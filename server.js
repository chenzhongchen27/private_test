var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var url = require('url');
var PORT = 3333;

app.listen(PORT,'0.0.0.0',function(){
	console.log(`Server start on port ${PORT}`)
});
var locationObjHistory = []

function handler(req, res) {
	var urlObj = url.parse(req.url,true)
	var pathname = urlObj.pathname;
	//   /set?location=111222
	console.log('接受请求',req.url)
	if(pathname==='/set'){
		var locationObj = {
			time:((new Date()).toLocaleString()),
			location:urlObj.query.location
		}
		locationObjHistory.unshift(locationObj)
		if(locationObjHistory.length>10){
			//只保留十个历史
			locationObjHistory=locationObjHistory.splice(0,10)
		}
		io.emit('change location',locationObj)
		res.writeHead(200)
		res.end('success set data')
		return;
	}
	fs.createReadStream(__dirname + '/index.html').pipe(res)

	// fs.readFile(__dirname + '/index.html',function(err, data) {
	// 		if (err) {
	// 			res.writeHead(500);
	// 			return res.end('Error loading index.html');
	// 		}

	// 		res.writeHead(200);
	// 		res.end(data);
	// });
}

io.on('connection', function(socket) {
	socket.emit('start data',locationObjHistory);
/*	socket.on('my other event', function(data) {
		console.log(data);
	});*/
});