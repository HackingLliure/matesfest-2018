const sqlite3 = require('sqlite3');
let blockchain_db = new sqlite3.Database('blockchain.sqlite3', (err) => {
  if (err) {
	console.error(err.message);
  }
  console.log('Connected to the blockchain database.');
});

exports.index = function(req, res) {

	let unverified_transactions = [];
	let blockchain = [];

	blockchain_db.all(
		`SELECT * FROM transactions WHERE block_id = 0;`, (err, rows) => {
	    if (err) {
	    	console.log(err);
	    	return false;
	    }
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
	});
};
