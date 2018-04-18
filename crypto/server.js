var express = require('express');
var cookieParser = require('cookie-parser'); 
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var methodOverride = require('method-override');
var session = require('express-session');
var flash = require('express-flash');
var bodyParser = require('body-parser');
const { cookie, validationResult } = require('express-validator/check');
var dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.load();

// Controllers
var HomeController = require('./controllers/home');
var BlockchainController = require('./controllers/blockchain');
var AccountController = require('./controllers/account');
var TransactionController = require('./controllers/transaction');
var AboutController = require('./controllers/about');
var MiningController = require('./controllers/mining');
var CreateController = require('./controllers/create')

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.use([
    cookie('id').exists(),
    cookie('secret').exists(),
    cookie('private-key').exists(),
    cookie('public-key').exists()
], function(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      CreateController.index(req, res);
      return;
    }
    next();
})

app.get('/', HomeController.index);
app.get('/blockchain',BlockchainController.index);
app.get('/account', AccountController.index);
app.get('/account/:id', AccountController.index);
app.get('/transaction', TransactionController.transactionGet);
app.post('/transaction', TransactionController.transactionPost);
app.get('/about', AboutController.index);
app.get('/mining', MiningController.index);
app.post('/mining', MiningController.mine);

// Production error handler
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
