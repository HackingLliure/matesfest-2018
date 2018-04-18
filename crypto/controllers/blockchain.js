const sqlite3 = require('sqlite3');
const async = require('async');
const db = require('./../database.js');

let blockchain_db = db.get_blockchain_db();

exports.index = function(req, res) {

    let unverified_transactions = [];
	let blockchain = [];
	let blocks = [];

    blockchain_db.all(
	`SELECT * FROM transactions WHERE block_id is 0;`, (err, rows) => {
	    if (err) {
	    	console.log(err);
	    	return false;
		}
		
		async.each(rows, (row, callback) => {
			unverified_transactions.push(row);
			callback();
		}, function () {
			blockchain_db.all(`SELECT * FROM blocks;`, (err, rows) => {
				if (err) {
					console.log(err);
					return false;
				}
				async.each(rows, (row, callback) => {
					if (row != undefined) {
						let obj = {
							id: row.id,
							timestamp: row.timestamp
						};
						// console.log(obj);
						blockchain.push(obj);
					}
					callback();
				}, function () {
					// console.log("After - " + obj);
					async.each(blockchain, 
						(obj, callback) => {
							blockchain_db.all(`SELECT * FROM transactions WHERE block_id = ?`, obj.id, 
								(err, rows) => {
									if (err) {
										return callback(err);
									}
									async.each(rows, (row, callback) => {
										obj.transactions = rows;
										blocks.push(obj);
										callback();
									}, function () {
										callback();
									});
								});
						}, function (err) {
							if (err) {
								console.log(err);
								return;
							}
							blocks = blocks.filter(function(elem, pos) {
								return blocks.indexOf(elem) == pos;
							});

							res.render('blockchain', {
								title: 'Blockchain',
								unverified_transactions: unverified_transactions,
								blockchain: blocks.sort((a, b) => {
									if (parseInt(a.id) > parseInt(b.id)) return -1;
									else if (parseInt(a.id) == parseInt(b.id)) return 0;
									else return 1;
								})
							});
						});
				});
			});
		});
	});
}
/*
	    rows.forEach((row) => {
			unverified_transactions.push(row);
	    });

	    blockchain_db.all(`SELECT * FROM blocks;`, (err, rows) => {
		if (err) {
		    console.log(err);
		    return false;
		}

		rows.forEach((row) => {
		    let obj = {
			id: row.id,
			timestamp: row.timestamp
		    };

		    blockchain_db.all(`SELECT * FROM transactions WHERE block_id = ?`, row.id, (err, rows) => {
			if (err) {
			    console.log(err);
			    return false;
			}
			obj.transactions = rows;
			blockchain.push(obj);
		    });
		});

		res.render('blockchain', {
		    title: 'Blockchain',
		    unverified_transactions: unverified_transactions,
		    blockchain: blockchain
		});
	    });		
	});*/
