var express = require('express');
<<<<<<< HEAD

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send('Hello World2!');
=======
var fs = require('fs');
var app = express.createServer(express.logger());

var kindle = fs.readFileSync('index.html');

app.get('/', function(request, response) {
  response.send(kindle.toString("utf-8") );
>>>>>>> 3a50d0293b8a0da411a12537ba10805045baf9f9
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});