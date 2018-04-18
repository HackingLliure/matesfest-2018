const sqlite3 = require('sqlite3');
const async = require('async');
const db = require('./../database.js');

let blockchain_db = db.get_blockchain_db();

exports.index = function(req, res) {

    let unverified_transactions = [];
    let blockchain = [];

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
						callback(obj);
					}
				}, function (obj) {
					blockchain_db.all(`SELECT * FROM transactions WHERE block_id = ?`, obj.id, 
						(err, rows) => {
							if (err) {
								console.log(err);
								return false;
							}
							async.each(rows, (row, callback) => {
								obj.transactions = rows;
								blockchain.push(obj);
								callback();
							}, function () {
								res.render('blockchain', {
									title: 'Blockchain',
									unverified_transactions: unverified_transactions,
									blockchain: blockchain
								});
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
