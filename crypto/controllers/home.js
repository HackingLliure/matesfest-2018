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

const crypto = require('crypto');
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

  //console.log(crypto.getCurves());
  //console.log(crypto.getHashes());

  // Cookie stuff
  if(!cookies["public-id"]) {

    key.generateKeyPair(256, 9109);
    id = crypto.createHash('sha256').update(key.exportKey('public')).digest("base64").substring(0, 8);
    cookies["public-id"] =  [ id, key.exportKey('public'), key.exportKey('private') ];
    
    res.cookie("public-id", cookies["public-id"][0]);
    res.cookie("public-key", cookies["public-id"][1]);
    res.cookie("private-key", cookies["public-id"][2]);

    db.run(`INSERT INTO accounts (id, secret, public, private) VALUES(?,?,?,?)`, 
    	[cookies["public-id"][0], '', cookies["public-id"][1], cookies["public-id"][2]]
    );
    
    res.render('_home', {
      title: 'Home',
      id: cookies["public-id"]
    });

  } else {

    res.render('home', {
      title: 'Home',
      id: cookies["public-id"]
    });

  }

};
