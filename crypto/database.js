const sqlite3 = require('sqlite3').verbose();
//const sqlite3 = require('sqlite3');

module.exports = (function() {
    // Singleton instance goes into this variable
    let blockchain_db;
    let private_db;

    // Singleton factory method
    function factory_blockchain_db() {
        return new sqlite3.Database('blockchain.sqlite3', (err) => {
	    if (err) {
		console.error(err.message);
	    }
	    console.log('Connected to the blockchain database.');
	});
    }
    function factory_private_db() {
        return new sqlite3.Database('private.sqlite3', (err) => {
	    if (err) {
		console.error(err.message);
	    }
	    console.log('Connected to the private database.');
	});
    }

    // Singleton database getter
    function get_blockchain_db() {
        // If the instance does not exists, creates it
        if (blockchain_db === undefined) {
            blockchain_db = factory_blockchain_db();
        }

        return blockchain_db;
    }
    function get_private_db() {
        // If the instance does not exists, creates it
        if (private_db === undefined) {
            private_db = factory_private_db();
        }

        return private_db;
    }

    // Close database functions
    function close_blockchain_db() {
	blockchain_db.close((err) => {
	    if (err) {
		console.error(err.message);
	    }
	    console.log('Close the database connection.');
	});
    }
    function close_private_db() {
	private_db.close((err) => {
	    if (err) {
		console.error(err.message);
	    }
	    console.log('Close the database connection.');
	});
    }
    
    // Public API definition
    return {
        get_blockchain_db: get_blockchain_db,
	get_private_db: get_private_db,
	close_blockchain_db: close_blockchain_db,
	close_private_db: close_private_db
    };
})();
