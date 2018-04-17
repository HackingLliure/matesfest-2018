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
	blockchain_db.all(`SELECT * FROM transactions WHERE block_id = 0;`, callback);	
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
		console.log(rows);
		let checked_signatures = [];
		async.forEach(rows, function (row, callback) {
			// Check if the tx is pending (block_id = 0)
			if (row.block_id == 0) {
				get_public(row.from,
					function (err, sol) {
						if (err) {
							return callback(err);
						} 
						if (sol != undefined) {
							let buffer = row.from + row.to + row.amount + String(row.timestamp);
							let key = new NodeRSA();
							key.importKey(sol.public);

							let obj = {
								made_by: row.from,
								time: row.timestamp, 
								signature: row.signature, 
								correct: false
							};

							if (key.verify(buffer, new Buffer(row.signature, 'base64'))) {
								obj.correct = true;
							}

							checked_signatures.push(obj);
						}
						callback();
				});
			}
		}, function (err) {
			if (err) {
				console.log(err.message);
				return;
			}

			checked_signatures.sort();
			//console.log(checked_signatures);
			/*
			let tx_unique = [];

			async.forEachOf(checked_signatures, 
				function (value, key, callback) {
					let tmp = value.made_by;
					if (!tx_unique.includes(tmp)) {
						tx_unique.push(tmp);
					}
			}, function (err) {
				if (err) {
					console.log(err.message);
					return;
				}
				//console.log(tx_unique);
			});
			
			get_balance(function(err, rows) {
				let balance = 0;

				if (err) {
					console.log(err);
					return;
				}
				rows.forEach((row) => {
					// bla bla
				});

				res.render('mining', {
			      title: 'Mining',
			      signatures: checked_signatures
			    });
			});
			*/

			res.render('mining', {
				title: 'Mining',
				signatures: checked_signatures
			});
		});
	});
}