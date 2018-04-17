const QRCode = require('qrcode')

exports.index = function(req, res) {
	QRCode.toDataURL('hackinglliure.com').then(url => {
		res.render('about', {
	    	title: 'About',
	    	qr: url
	  	});
	}).catch(err => {
		console.error(err);
		res.render('about', {
	    	title: 'About'
	  	});
	})
};
