const NodeRSA = require('node-rsa');
const sqlite3 = require('sqlite3');
const { body, cookie, validationResult } = require('express-validator/check');
const { matchedData, sanitizeBody, sanitizeCookie } = require('express-validator/filter');
const transaction_querry = `INSERT INTO transactions ('timestamp', 'from', 'to', 'amount', 'signature', 'block_id') VALUES(?,?,?,?,?,?)`;

let key = new NodeRSA();
let blockchain_db = new sqlite3.Database('blockchain.sqlite3', (err) => {
    if (err) {
	console.error(err.message);
    }
    console.log('Connected to the blockchain database.');
});

exports.transactionGet = function(req, res) {
    // Get session cookies
    const cookies = req.cookies;

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

exports.transactionPost = [
    body('to_id')
	.exists()
	.isLength({ min: 1 }).withMessage("Id required")
	.isString().withMessage("Id must be a string"),
    body('amount')
	.exists()
	.isLength({ min: 1 }).withMessage("Amount required")
	.isInt().withMessage("Amount must be an integer"),
    
    cookie('id').exists(),
    cookie('secret').exists(),
    cookie('private-key').exists(),
    cookie('public-key').exists(),
    
    sanitizeBody('to_id').trim().escape(),
    sanitizeBody('amount').trim().escape().toInt(),
    
    (req, res, next) => {
	const errors = validationResult(req);
	
	if (!errors.isEmpty()) {
	    for (var i = 0; i < errors.array().length; i++) {
		if (errors.array({ onlyFirstError: true })[i]
		    && errors.array({ onlyFirstError: true })[i].location == "cookies") {
		    return res.redirect("/");
		}
	    }
	    req.flash('error', errors.array({ onlyFirstError: true }));
	    return res.redirect('/transaction');
	}
	
	const cookiesData = matchedData(req, { locations: ['cookies'] });
	const bodyData = matchedData(req, { locations: ['body'] });
	
	const timestamp = Math.floor(new Date() / 1000);
	const from_id = cookiesData.id;
	const to_id = bodyData.to_id;
	const amount = bodyData.amount;
	const block_id = 0;
	
	let buffer = from_id + to_id + amount + String(timestamp);
	let key = new NodeRSA(cookies["private-key"]);
	const signature = key.sign(buffer, "base64");
	
	blockchain_db.run(transaction_querry, [timestamp, from_id, to_id, amount, signature, block_id]);
	
	req.flash('success', { msg: 'Your transaction have been submitted!'});
	res.redirect('/transaction');
    }
];
