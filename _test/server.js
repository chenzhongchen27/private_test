var http = require('http')

http.createServer(function(req,res){
	res.writeHead(200)
	res.end('<h1>failefef</h1> ')

}).listen(9010,'0.0.0.0')