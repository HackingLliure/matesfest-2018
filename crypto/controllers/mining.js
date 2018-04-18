const NodeRSA = require('node-rsa');
const sqlite3 = require('sqlite3');
const async = require('async');
const db = require('./../database.js');

let private_db = db.get_private_db();
let blockchain_db = db.get_blockchain_db();

exports.index = function(req, res) {
	let cookies = req.cookies;
	let txs = [];

	blockchain_db.all(`SELECT * FROM transactions WHERE block_id = 0;`, (err, rows) => {
		if (err) {
			console.log(err);
			return;
		}

		async.each(rows, (value, callback) => {
			private_db.get(`SELECT public FROM accounts WHERE id is ?`, 
				[ value.from ], 
				(err, sol) => {
					if (err) {
						return callback(err);
					}
					const buffer = value.from + value.to + value.amount + String(value.timestamp);
					let obj = {
						time: value.timestamp,
						made_by: value.from,
						signature: value.signature,
						true_sign: false,
						true_balance: 0,
						accepted: false
					};
					const key = new NodeRSA();
					key.importKey(sol.public);
					if (key.verify(buffer, new Buffer(value.signature, 'base64'))) {
						obj.true_sign = true;
					}
					txs.push(obj);
					callback();
			});
		}, 
		function (err) {
			if (err) {
				console.log(err);
				return;
			}

			async.each(txs, 
				(value, callback) => {
					blockchain_db.all(`SELECT * FROM transactions;`, // WHERE block_id is not 0;`, 
						(err, rows) => {
							if (err) {
								return callback(err);
							}
							// console.log(rows);
							rows.forEach((row) => {
								if (row.from == value.made_by) {
									value.true_balance -= row.amount;
								} else if (row.to == txs.made_by) {
									value.true_balance += row.amount;
								}
							});
							callback();
						});
				}, 
				function (err) {
					if (err) {
						console.log(err);
						return;
					}

					async.each(txs,
						(value, callback) => {
							if (value.made_by == "00000000" || (value.true_sign && value.true_balance >= 0) ) { 
								value.accepted = true;
								if (value.made_by == "00000000") {
									value.true_balance = 0;
								}
							}
							callback();
						}, function () {
							res.render('mining', {
								title: 'Mining',
								signatures: txs
							});	
						})
				});	
		});
	});
};