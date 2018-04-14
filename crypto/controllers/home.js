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
let key = new NodeRSA();
let keyHash = new NodeRSA({b: 512});

exports.index = function(req, res) {
  // Get session cookies
  cookies = req.cookies;

  // Check if session cookie exists
  if(!cookies["id"]) {

    // Low e
    key.generateKeyPair(128, 2111);
    id = keyHash.encrypt( key.exportKey('public') , 'hex').substring(0, 8);
    cookies["id"] =  [ id, key.exportKey('public'), key.exportKey('private') ];

    res.cookie("id", cookies["id"][0]);
    res.cookie("public-key", cookies["id"][1]);
    res.cookie("private-key", cookies["id"][2]);
    
    res.render('_home', {
      title: 'Home',
      id: cookies["id"]
    });

  } else {

    res.render('home', {
      title: 'Home',
      id: cookies["id"]
    });

  }

};
