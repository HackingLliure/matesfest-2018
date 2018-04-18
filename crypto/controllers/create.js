const NodeRSA = require('node-rsa');
const sqlite3 = require('sqlite3');
const async = require('async');
const db = require('./../database.js');

const zero_user = "00000000";

let key = new NodeRSA();
let private_db = db.get_private_db();
let blockchain_db = db.get_blockchain_db();

function generate_id() {
    let key = new NodeRSA({b: 512});
    let keyHash = new NodeRSA({b: 512});
    return keyHash.encrypt( key.exportKey('public') , 'hex').substring(0, 8);
}

function get_zero(callback) {
    private_db.get(`SELECT * FROM accounts WHERE id = ?`, [zero_user], callback);
} 

function get_user(user, callback) {
    private_db.get(`SELECT * FROM accounts WHERE id = ?`, [user], callback);
} 

exports.index = function(req, res) {
    // Get session cookies
    const cookies = req.cookies;
    
    const keyZero = new NodeRSA();
    const key = new NodeRSA();
    key.generateKeyPair(512);

    const id = generate_id();
    const secret = generate_id();

    const user_array = [ id, secret, key.exportKey('public'), key.exportKey('private') ];


    private_db.get(`SELECT * FROM accounts WHERE id = ?;`, [ zero_user ], 
        (err, row) => {
            if (err) {
                console.log(err);
                return;
            }

            if (row == undefined) {
		        keyZero.generateKeyPair(512);
		        private_db.run(`INSERT INTO accounts(id, secret, public, private) VALUES (?,?,?,?)`,
			       [ zero_user, generate_id(), keyZero.exportKey('public'), keyZero.exportKey('private') ]
			      );
            } else {
                keyZero.importKey(row.private);
            }

            private_db.get(`SELECT * FROM accounts WHERE id = ?;`,[ id ], 
                (err, row) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (row == undefined){
                        private_db.run(`INSERT INTO accounts(id, secret, public, private) VALUES (?,?,?,?)`, user_array);
                    }

                    let timestamp = Math.floor(new Date() / 1000);
                    let buffer = zero_user + id + "1" + String(timestamp);
                    let signature = keyZero.sign(buffer, "base64");
                    
                    console.log("first transaction");
                    blockchain_db.run(`INSERT INTO transactions ('timestamp', 'from', 'to', 'amount', 'signature', 'block_id') VALUES(?,?,?,?,?,?)`,
                                [timestamp, zero_user, id, 1, signature, 0],
                                (err, sol) => {
                                    if (err) {
                                        console.log(err);
                                        return;
                                    }
                                    res.cookie("id", id);
                                    res.cookie("secret", secret);
                                    res.cookie("public-key", key.exportKey('public'));
                                    res.cookie("private-key", key.exportKey('private'));
                                    
                                    // Render first-time home
                                    res.render('_home', {
                                    title: 'Home',
                                    id: id,
                                    secret: secret
                                    });
                                });
                    });

                });
        /*
    // Create user
    get_user(id, (err, row) => {
        if (err) {
            console.log(err);
            return;
        }
        if (row == undefined){
            private_db.run(`INSERT INTO accounts(id, secret, public, private) VALUES (?,?,?,?)`, user_array);
        }
	});

    // Jesus is alive!
    get_zero(
	function (err, row) {
            if (err) {
		console.log(err);
            }
            if (row != undefined) {
		
	}
    );
    
    // Store the user cookies
    res.cookie("id", id);
    res.cookie("secret", secret);
    res.cookie("public-key", key.exportKey('public'));
    res.cookie("private-key", key.exportKey('private'));
    
    // Render first-time home
    res.render('_home', {
	title: 'Home',
	id: id,
	secret: secret
    });*/
}
