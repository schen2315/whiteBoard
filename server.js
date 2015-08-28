var express = require('express');
var socket = require('socket.io');
var path = require('path');
var http = require('http');

var app = express();

app.use(express.static(path.join(__dirname, '/')));
app.set('port', 8080);

var server = http.createServer(app);

server.listen(8080);

var io = socket(server);
var points = [];

io.on('connection', onconnect);
console.log('connecting to port 8080');

function onconnect(socket) {
	var i = 0;
	//log that a user has connected
	//update that user
	console.log('a user has connected');
	var stop = setInterval(update, 10);

	socket.on('draw', draw);


	function draw(data) {
		socket.broadcast.emit('draw', data);
		points.push(data);
	}

	function update() {
		if(points[i]) {
			socket.emit('update', points[i]);
			i++;
		} else {
			clearInterval(stop);
			i = null; //don't be namespace polluter ;)
		}
	}

	
}







