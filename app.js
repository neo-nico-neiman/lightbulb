const http = require("http");

http.createServer(function (req, res) {
	res.write("The lights are on");
	res.end();
}).listen(3000);

console.log("Server started on port 3000");
