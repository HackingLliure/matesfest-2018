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
let key = new NodeRSA();
let db = new sqlite3.Database('private.sqlite3', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the private database.');
});

exports.index = function(req, res) {
  // Get session cookies
  cookies = req.cookies;

  // Check if session cookie exists
  if(!cookies["id"]) {
    let key = new NodeRSA();
    let keyHash = new NodeRSA({b: 512});

    key.generateKeyPair(128, 2111);
    id = keyHash.encrypt( key.exportKey('public') , 'hex').substring(0, 8);   // Hash the public key and generate a pseudo-unique id
    
    // Store account into database
    // TODO: create and store the secret
    db.run(`INSERT INTO accounts (id, secret, public, private) VALUES(?,?,?,?)`, 
    	[id, '', key.exportKey('public'), key.exportKey('private')]
    );

    // Store the user cookies
    res.cookie("id", id);
    res.cookie("public-key", key.exportKey('public'));
    res.cookie("private-key", key.exportKey('private'));
    
    // Render first-time home
    res.render('_home', {
      title: 'Home',
      id: id
    });
  } else {
    // If cookie exists render control panel
    res.render('home', {
      title: 'Home',
      id: cookies["id"]
    });
  }
};
