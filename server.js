var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var url = require('url');
var PORT = 8084;

app.listen(PORT,'0.0.0.0',function(){
	console.log(`Server start on port ${PORT}`)
});
var locationObjHistory = []

function handler(req, res) {
	// var urlObj = url.parse(req.url,true)
	// var pathname = urlObj.pathname;
	//   /set?location=111222
	// console.log('url--',req.url,'method--',req.method,'headers--',req.headers)
	// let content='';
	// req.on('data',function(chunk){
	// 	content += chunk;
	// })
	// req.on('end',function(){
	// 	locationData=content;
	// 	console.log('content--',content)
	// 	res.writeHead(200)
	// 	res.end('debugger haha')
	// })
	// return;
	if(req.method==='POST'){
		let content='';
		req.on('data',function(chunk){
			content += chunk;
		})
		req.on('end',function(){
			var locationObj = {
				time:((new Date()).toLocaleString()),
				location:content
			}
			locationObjHistory.unshift(locationObj)
			if(locationObjHistory.length>10){
				//只保留十个历史
				locationObjHistory=locationObjHistory.splice(0,10)
			}
			io.emit('change location',locationObj)
			res.writeHead(200)
			res.end('success set data')
		})
		return;
	}
	fs.createReadStream('./index.html').pipe(res)
}

io.on('connection', function(socket) {
	socket.emit('start data',locationObjHistory);
/*	socket.on('my other event', function(data) {
		console.log(data);
	});*/
});
