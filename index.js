var express = require('express');
var bodyParser = require('body-parser');
require('./vulnerabilities/static');

var app = express();

app.use('/assets', express.static('public'));
//app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');

app.use('/xss_test', require('./vulnerabilities/xss/'));
app.use('/sqli', require('./vulnerabilities/sqli/'));
app.use('/command_injection', require('./vulnerabilities/command_injection/'));
app.use('/unsafe_eval', require('./vulnerabilities/unsafe_eval/'));
app.use('/crypto', require('./vulnerabilities/crypto/'));
app.use('/parampollution', require('./vulnerabilities/parampollution/'));
app.use('/unvalidated-redirect', require('./vulnerabilities/unvalidated-redirect/'));
app.use('/path-traversal', require('./vulnerabilities/path-traversal/'));
app.use('/header-injection', require('./vulnerabilities/header-injection/'));
app.use('/config', require('./vulnerabilities/config/'));

app.get('/', function (req, res) {
	//res.send('Hello World!');
	res.render('pages/index');
});

var port = 3000;

app.listen(port, function () {
	if(process.send) { process.send({'startup': true}); }
	console.log('Example app listening on port %s!', port);
});

app.get('/quit', function(req, res) {
	res.send('adieu, cherie');
	process.exit();
});
