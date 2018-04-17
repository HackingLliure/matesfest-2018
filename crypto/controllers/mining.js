const NodeRSA = require('node-rsa');
const sqlite3 = require('sqlite3');
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
	blockchain_db.all(`SELECT * FROM transactions WHERE signature is '';`, callback);	
}

exports.index = function(req, res) {
	let cookies = req.cookies;

	get_pending_transactions(function (err, rows) {
		if (err) {
			console.log(err);
		} else {
			rows.forEach(function (row) {
				let buffer = "";

				let public = private_db.get(`SELECT * FROM accounts WHERE id = ?;`, [row.to], 
					function (err, sol) {
						buffer += "";
						console.log(sol.public);
				});

				buffer += row.amount;
				console.log(buffer);
			});
		}
	});

	res.render('mining', {
      title: 'Mining'
    });
}