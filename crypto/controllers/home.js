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

function generate_id() {
  let key = new NodeRSA({b: 512});
  let keyHash = new NodeRSA({b: 512});
  return keyHash.encrypt( key.exportKey('public') , 'hex').substring(0, 8);
}

exports.index = function(req, res) {
  // Get session cookies
  cookies = req.cookies;

  // Check if session cookie exists
  if(!cookies["id"]) {
    let key = new NodeRSA();

    key.generateKeyPair(512);
    id = generate_id();   // Hash the public key and generate a pseudo-unique id
    secret = generate_id();

    // Store account into database
    // TODO: create and store the secret

    private_db.get(`SELECT * FROM accounts WHERE id = ?`, "00000000", function (err, row) {
      if (err) {
        console.log(err);
      } else if (row == undefined){
        let keyZero = new NodeRSA();
        keyZero.generateKeyPair(512);
        private_db.run(`INSERT INTO accounts ('id', 'secret', 'public', 'private') VALUES(?,?,?,?)`, 
          ["00000000", generate_id(), keyZero.exportKey('public'), keyZero.exportKey('private')]
        ); 
      }
    });

    console.log(key.sign("lel", "base64"));
      
    blockchain_db.run(`INSERT INTO transactions ('timestamp', 'from', 'to', 'amount', 'signature') VALUES(?,?,?,?,?)`,
    	[Math.floor(new Date() / 1000), "00000000", id, 1, '']
    ); // WIPWIPWIPWIPWIP

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
  } else {
    // If cookie exists render control panel
    res.render('home', {
      title: 'Home',
      id: cookies["id"],
      secret: cookies["secret"]
    });
  }
};
