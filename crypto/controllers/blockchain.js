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

	/*
	SELECT * FROM blocks; .each(err, row) {
		this.transactions.append(SELECT * FROM transactions where 'block_id' = row.id)
	}
	*/

	//console.log(unsecured_transactions);

	res.render('blockchain', {
		title: 'Blockchain',
		//unsecured_transactions: unsecured_transactions
		blockchain: [
			{
				id: "1337",
				timestamp: "123412512",
				transactions: [
					{
						from: "me",
						to: "you",
						amount: 1,
						signature: "34812654198052463976769"
					}
				]
			}
		]
	});
};
