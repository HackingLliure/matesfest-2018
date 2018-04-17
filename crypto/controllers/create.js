/**
 * GET /
 */

/*
  const crypto = require('crypto');
  const sign = crypto.createSign('SHA256');
  const verify = crypto.createVerify('SHA256');

  sign.write('test');
  sign.end();
  verify.write('test');
  verify.end();

  signature = sign.sign(privateKey);
  console.log(verify.verify(publicKey, signature));  
*/

const NodeRSA = require('node-rsa');
const sqlite3 = require('sqlite3');
const db = require('./../database.js');

const zero_user = "00000000";

let key = new NodeRSA();
/*
let private_db = new sqlite3.Database('private.sqlite3', (err) => {
    if (err) {
	console.error(err.message);
    }
    console.log('Connected to the private database.');
});
let blockchain_db = new sqlite3.Database('blockchain.sqlite3', (err) => {
    if (err) {
	console.error(err.message);
    }
    console.log('Connected to the blockchain database.');
});
*/

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

exports.index = function(req, res) {
    // Get session cookies
    cookies = req.cookies;
    
    let key = new NodeRSA();

    key.generateKeyPair(512);
    id = generate_id();   // Hash the public key and generate a pseudo-unique id
    secret = generate_id();

    // Give birth to Jesus
    get_zero(
	function (err, row) {
            if (err) {
		console.log(err);
            } else if (row == undefined){
		let keyZero = new NodeRSA();
		keyZero.generateKeyPair(512);
		private_db.run(`INSERT INTO accounts(id, secret, public, private) VALUES (?,?,?,?)`,
			       ["00000000", generate_id(), keyZero.exportKey('public'), keyZero.exportKey('private')]
			      );
            }
	});

    // Jesus is alive!
    get_zero(
	function (err, row) {
            if (err) {
		console.log(err);
            } else if (row != undefined) {
		let timestamp = Math.floor(new Date() / 1000);
		let buffer = row.id + id + "1" + String(timestamp);
		let keyZero = new NodeRSA(row.private);
		let signature = keyZero.sign(buffer, "base64");
		// console.log(signature);
		
		blockchain_db.run(`INSERT INTO transactions ('timestamp', 'from', 'to', 'amount', 'signature', 'block_id') VALUES(?,?,?,?,?,?)`,
          			  [timestamp, row.id, id, 1, signature, "null"]
				 );
            }
	});
    
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
    });
}



/*
    const key = new NodeRSA();
    key.generateKeyPair(512);
    const id = generate_id();   // Hash the public key and generate a pseudo-unique id
    const secret = generate_id();

    // Give birth to Jesus
    get_zero(
      function (err, row) {
        if (err) {
          console.log(err);
        } else if (row == undefined){
          let keyZero = new NodeRSA();
          keyZero.generateKeyPair(512);
          private_db.run(`INSERT INTO accounts(id, secret, public, private) VALUES (?,?,?,?)`,
            [ zero_user, generate_id(), keyZero.exportKey('public'), keyZero.exportKey('private') ]
          );
        }
    });

    // Jesus is alive!
    get_zero(
      function (err, row) {
        if (err) {
          console.log(err);
        }
        if (row != undefined) {
          let timestamp = Math.floor(new Date() / 1000);
          let buffer = row.id + id + "1" + String(timestamp);
          let keyZero = new NodeRSA(row.private);
          let signature = keyZero.sign(buffer, "base64");
          console.log(signature);
          
          blockchain_db.run(`INSERT INTO transactions ('timestamp', 'from', 'to', 'amount', 'signature', 'block_id') VALUES(?,?,?,?,?,?)`,
          	[timestamp, row.id, id, 1, signature, 0]
          );
        }
    });

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
    });
*/
