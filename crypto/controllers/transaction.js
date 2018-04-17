const NodeRSA = require('node-rsa');
const sqlite3 = require('sqlite3');
const transaction_querry = `INSERT INTO transactions ('timestamp', 'from', 'to', 'amount', 'signature') VALUES(?,?,?,?,?)`

let key = new NodeRSA();
let blockchain_db = new sqlite3.Database('blockchain.sqlite3', (err) => {
    if (err) {
	console.error(err.message);
    }
    console.log('Connected to the blockchain database.');
});

exports.transactionGet = function(req, res) {
    // Get session cookies
    cookies = req.cookies;

    // Check if session cookie exists
    if(!cookies["id"]
       || !cookies["secret"]
       || !cookies["private-key"]
       || !cookies["public-key"]) {
	return res.redirect("/");
    }
    
    // If cookie exists render control panel
    res.render('transaction', {
	title: 'Transaction'
    });
};

exports.transactionPost = function(req, res) {
    req.assert('to_id', 'Id cannot be blank').notEmpty();
    //req.assert('email', 'Email is not valid').notEmpty();

    
    var errors = req.validationErrors();
    
    if (errors) {
	req.flash('error', errors);
	return res.redirect('/transaction');
    }
    
    timestamp = Math.floor(new Date() / 1000);
    from_id = cookies["id"];
    to_id = req.body.to_id;
    amount = req.body.amount;
    signature = '';
    
    blockchain_db.run(transaction_querry, [timestamp, from_id, to_id, amount, signature]);
    
    // If cookie exists render control panel
    res.render('transaction', {
	title: 'Transaction'
    });
};
