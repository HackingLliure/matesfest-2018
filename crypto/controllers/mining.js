const NodeRSA = require('node-rsa');
const sqlite3 = require('sqlite3');
const async = require('async');

let blockchain_db = new sqlite3.Database('blockchain.sqlite3', (err) => {
  if (err) {
	console.error(err.message);
  }
  console.log('Connected to the blockchain database.');
});

let private_db = new sqlite3.Database('private.sqlite3', (err) => {
  if (err) {
	console.error(err.message);
  }
  console.log('Connected to the blockchain database.');
});

function get_pending_transactions(callback) {
	blockchain_db.all(`SELECT * FROM transactions WHERE block_id = 'null';`, callback);	
}

function get_public(from, callback){
	private_db.get(`SELECT id,public,private FROM accounts WHERE id = ?;`, [from], callback);
}

function get_balance(callback) {
	blockchain_db.all(`SELECT * FROM transactions;`, callback);
}

exports.index = function(req, res) {
	let cookies = req.cookies;

	get_pending_transactions(function (err, rows) {
		if (err) {
			console.log(err);
			return;
		}

		let checked_signatures = [];
		async.forEachOf(rows, function (row, key, callback) {
			get_public(row.from,
				function (err, sol) {
					if (err) {
						return callback(err);
					} else if (sol != undefined) {
						//console.log(row);
						let buffer = row.from + row.to + row.amount + String(row.timestamp);
						let key = new NodeRSA();
						key.importKey(sol.public);

						if (key.verify(buffer, new Buffer(row.signature, 'base64'))) {
							checked_signatures.push({time: row.timestamp, signature: row.signature, correct: "True"});
						} else {
							checked_signatures.push({time: row.timestamp, signature: row.signature, correct: "False"});
						}
						callback();	
					}
			});
		}, function (err) {
			if (err) {
				console.log(err.message);
				return;
			}

			checked_signatures.sort();
			console.log(checked_signatures);

			get_balance(function(err, rows) {
				let balance = 0;
				let transactions = [];

				if (err) {
					console.log(err);
					return;
				}
				rows.forEach((row) => {
					let obj = { from: null, to: null, amount: null }
					if (row.to == cookies["id"]) {
						obj.from = row.from; 
						obj.to = row.to;				
					} else if (row.from == cookies["id"]) {
						row.amount *= -1;
					
						obj.from = row.from; 
						obj.to = row.to;
					} else {
						return;
					}
					if (row.block_id) {
						balance += row.amount;
					}
					obj.amount = row.amount;
					transactions.push(obj);
				});

				console.log(transactions);

				res.render('mining', {
			      title: 'Mining',
			      signatures: checked_signatures
			    });
			});
		});
	});
}