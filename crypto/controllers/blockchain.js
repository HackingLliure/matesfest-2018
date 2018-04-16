const sqlite3 = require('sqlite3');
let blockchain_db = new sqlite3.Database('blockchain.sqlite3', (err) => {
  if (err) {
	console.error(err.message);
  }
  console.log('Connected to the blockchain database.');
});

exports.index = function(req, res) {

	blockchain_db.each(
		`SELECT * FROM transactions WHERE block_id is NULL;`, function(err, row) {
	    console.log(row);
	});

	//console.log(unsecured_transactions);

	res.render('blockchain', {
		title: 'Blockchain',
		//unsecured_transactions: unsecured_transactions
	});
};
