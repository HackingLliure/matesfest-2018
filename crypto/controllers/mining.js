'use strict';

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
					blockchain_db.all(`SELECT * FROM transactions WHERE block_id != 0 and block_id != '0';`, // WHERE block_id is not 0;`, 
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
								res.cookie(value.time, value.signature);
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

exports.mine = function (req, res) {
	const cookies = req.cookies;
	for (const [key, value] of Object.entries(cookies)) {
		if (parseInt(key) > 0) {
			const signature = value;
			let actual_id = 0;
			let created = false;

			blockchain_db.get(`SELECT MAX(id) FROM blocks;`, (err, sol) => {
				if (err) {
					console.log(err);
					return;
				}
				
				if (sol && sol["MAX(id)"]) {
					actual_id = parseInt(sol["MAX(id)"]);
					console.log(actual_id);
				}

				const timestamp = Math.floor(new Date() / 1000);
				let buffer = cookies["id"] + signature + String(timestamp);
				const key = new NodeRSA(cookies["private-key"]);
				const hash = key.sign(buffer, "base64");
				const proof = 'trivial';
				
				if (!created) {
					blockchain_db.run(`INSERT INTO blocks ('id', 'timestamp', 'hash', 'proof', 'parent_block') VALUES(?,?,?,?,?);`,
						[ actual_id + 1, timestamp, hash, proof, actual_id ], (err, asdf) => {
							if (err) {
								console.log(err);
								return;
							}
							created = true;
						}
					);
				} else {
					actual_id -= 1;
				}

				blockchain_db.run(`UPDATE transactions SET block_id = ? WHERE signature = ?;`,
					[ actual_id + 1, signature ], 
					(err, sol) => {
						if (err) {
							console.log(err);
							return;
						}
						blockchain_db.run(`DELETE FROM transactions WHERE block_id = 0;`);
				});
			});
			
		}

		res.clearCookie(key);
		res.redirect('/');
	}
};