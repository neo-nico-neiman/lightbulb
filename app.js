const express = require('express');
const server = require('http').createServer();
const app = express();
const { stringify } = require('./utils');
const sqlite = require('sqlite3');

app.get('/', function (_, res) {
	res.sendFile('index.html', { root: __dirname });
});

server.on('request', app);

server.listen(3000, () => console.log('Server started on port 3000'));

process.on('SIGINT', () => {
	wss.clients.forEach(function each(client) {
		client.close();
	});

	server.close(() => {
		shutdownDB();
	});
});

const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
	const numberOfClients = wss.clients.size;
	console.log(`Clients connected: ${numberOfClients}`);

	wss.broadcast(stringify({ visitors: numberOfClients }));

	if (ws.readyState === ws.OPEN) {
		ws.send(stringify({ message: 'Welcome to my server' }));
	}

	db.run(`
	INSERT INTO visitors (counts, time)
	VALUES (${numberOfClients}, datetime('now'))
	`);

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

const db = new sqlite.Database(':memory:');
db.serialize(() => {
	db.run(`
	CREATE TABLE visitors (
		counts INTEGER,
		time TEXT
	)`);
});

function shutdownDB() {
	db.serialize(function getCountsAndClose() {
		db.each('SELECT * FROM visitors', (err, row) => {
			console.log(row);
		});

		console.log('Shutting down db');
		db.close();
	});
}
