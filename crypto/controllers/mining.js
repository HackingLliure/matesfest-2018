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
						console.log(row);
						let buffer = row.from + row.to + row.amount;
						let key = new NodeRSA();
						key.importKey(sol.public);

						if (key.verify(buffer, new Buffer(row.signature, 'base64'))) {
							checked_signatures.push({signature: row.signature, correct: "True"});
						} else {
							checked_signatures.push({signature: row.signature, correct: "False"});
						}
						callback();	
					}
			});
		}, function (err) {
			if (err) {
				console.log(err.message);
				return;
			}

			res.render('mining', {
		      title: 'Mining',
		      signatures: checked_signatures
		    });
		});

		

	});
}