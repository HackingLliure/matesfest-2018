const sqlite3 = require('sqlite3');
let blockchain_db = new sqlite3.Database('blockchain.sqlite3', (err) => {
  	if (err) {
		console.error(err.message);
  	} else {
  		console.log('Connected to the blockchain database.');
  	}
});

function get_balance(callback) {
	blockchain_db.all(`SELECT * FROM transactions`, callback);
}

exports.index = function(req, res) {
	let id = req.cookies["id"];
	

	get_balance(function(err, rows) {
		let balance = 0;
		let transactions = [];

		if (err) {
			console.log(err);
		} else {
			rows.forEach((row) => {
				let obj = { from: null, to: null, amount: null }
				if (row.to == id) {
					balance += row.amount;

					obj.from = row.from; 
					obj.to = row.to;
					obj.amount = row.amount;
					transactions.push(obj);
				
				} else if (row.from == id) {
					balance -= row.amount;
				
					obj.from = row.from; 
					obj.to = row.to;
					obj.amount = row.amount;
					transactions.push(obj);
				}
			});
			res.render('account', {
			    	title: 'Account',
			    	id: id,
			    	balance: balance,
			    	transactions: transactions
			});
		}
	});

	
};
