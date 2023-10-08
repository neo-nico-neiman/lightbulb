const express = require('express');
const server = require('http').createServer();

const app = express();

app.get('/', function (_, res) {
	res.sendFile('index.html', { root: __dirname });
});

server.on('request', app);

server.listen(3000, () => console.log('Server started on port 3000'));

const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
	const numberOfClients = wss.clients.size;
	console.log(`Clients connected: ${numberOfClients}`);

	wss.broadcast(stringify({ visitors: numberOfClients }));

	if (ws.readyState === ws.OPEN) {
		ws.send(stringify({ message: 'Welcome to my server' }));
	}

	ws.on('close', function close() {
		wss.broadcast(stringify({ visitors: numberOfClients }));
		console.log('A client has disconnected');
	});
});

wss.broadcast = function broadcast(data) {
	wss.clients.forEach(function each(client) {
		client.send(data);
	});
};

function stringify(data) {
	return JSON.stringify(data);
}
