var fs = require('fs')
  , http = require('http')
  , nconf = require('nconf')
  , express = require('express')
  , jayson = require('jayson')
  , bitcoin = require('bitcoin')
  ;

// Configuration
nconf.argv()
     .env()
     .file({ file: 'config.json' });
nconf.defaults({
    'PORT': '12000'
});

var bitcoin = require('bitcoin');
var client = new bitcoin.Client({
  host: 'localhost',
  port: 18332,
  user: 'mydearbtc',
  pass: 'acoucadfcjaaerucaerargttrcradsdf',
  ssl: true,
  sslStrict: false
});
 
client.getBalance('*', 0, function(err, balance) {
  if (err) return console.log(err);
  console.log('Balance:', balance);
});

client.getDifficulty(function(err, difficulty) {
  if (err) {
    return console.error(err);
  }
  console.log('Difficulty: ' + difficulty);
});

client.validateAddress('mj56Q22mgPPR72Myk9gGuSCJxMoZasvfBq', function(err, info) {
    if (err) {
	return console.error(err)
    }
    console.log(info);
});

// Set up web interface
var app = express();
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

var port = nconf.get('PORT');
var server = http.createServer(app);
server.listen(port, function(){
  console.log("Express server listening on port " + port);
});

app.get('/', function(req, res){
    // client.request('getinfo', [], function(err, error, response) {
    // 	if(err) throw err;
    // 	console.log(error);
    // 	console.log(response);
    // 	res.send(response);
    // });
});

app.get('/send/:address/:amount', function(req, res) {
    var address = req.params.address
    try {
	var amount = parseFloat(req.params.amount);
    } catch (err) {
	res.send('bad amount?');
    }
    console.log(amount);
    console.log(address);

    var out = 'Sending to: '+address+'<br>';

    client.validateAddress(address, function(err, info) {
	console.log(info);
	if (info.isvalid) {
	    client.sendToAddress(address, amount, function(err, info) {
		if (err) { console.log(err) };
		console.log(info);
		res.send(info);
	    })
	} else {
	    res.send('Invalid address: '+address);
	}
    })

});
