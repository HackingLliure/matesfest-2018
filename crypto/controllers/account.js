const sqlite3 = require('sqlite3');
const db = require('./../database.js');

let blockchain_db = db.get_blockchain_db();

function get_balance(callback) {
    blockchain_db.all(`SELECT * FROM transactions;`, callback);
}

exports.index = function(req, res) {
    let id = req.params.id ? req.params.id : req.cookies["id"];
    
    get_balance(function(err, rows) {
	let balance = 0;
	let transactions = [];

	if (err) {
	    console.log(err);
	} else {
	    rows.forEach((row) => {
		let obj = { from: null, to: null, amount: null }
		if (row.to == id) {
		    obj.from = row.from; 
		    obj.to = row.to;				
		} else if (row.from == id) {
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
	    res.render('account', {
		title: 'Account',
		id: id,
		balance: balance,
		transactions: transactions
	    });
	}
    });	
};
