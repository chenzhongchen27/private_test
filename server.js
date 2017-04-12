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
	if(req.method==='POST'){
		let content='';
		req.on('data',function(chunk){
			content += chunk;
		})
		req.on('end',function(){
			//数据进行处理
			
			//end
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
