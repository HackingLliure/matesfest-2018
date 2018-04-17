const NodeRSA = require('node-rsa');
const sqlite3 = require('sqlite3');
const async = require('async');

let blockchain_db = new sqlite3.Database('blockchain.sqlite3', (err) => {
  if (err) {
	console.error(err.message);
  }
  console.log('/MINING\tConnected to the blockchain database.');
});

let private_db = new sqlite3.Database('private.sqlite3', (err) => {
  if (err) {
	console.error(err.message);
  }
  console.log('/MINING\tonnected to the blockchain database.');
});

function get_public(from, callback){
	private_db.get(`SELECT id,public,private FROM accounts WHERE id = ?;`, [from], callback);
}

function get_balance(callback) {
	blockchain_db.all(`SELECT * FROM transactions;`, callback);
}

exports.index = function(req, res) {
	let cookies = req.cookies;
	let sign = [];

	blockchain_db.all(
		`SELECT * FROM transactions WHERE block_id = 0;`, (err, rows) => {
	    if (err) {
	    	console.log(err.message);
	    	return;
	    }
		async.forEach(rows, (value, callback) => {
			private_db.get(
				`SELECT id, public FROM accounts WHERE id is ?;`, [value.from], (err, sol) => {
					if (err) {
						return callback(err);
					}
					console.log(value.from, sol);
					callback();
					
				});
		}, function (err) {
			if (err) {
				console.log(err.message);
				return;
			}
			console.log(sign);
		});

		
		
		res.render('mining', {
			title: 'Mining',
			signatures: sign
		});	
	});
};