
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//initialize app middleware 
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/../src'));

//listen on port 3000 for connections
app.listen(3000, function(){
	console.log("Listening on port 3000");
});