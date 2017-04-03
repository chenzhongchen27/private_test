var http = require('http')
var url = require('url')
var locationData=''

http.createServer(function(req,res){
	var urlParsed = url.parse(req.url,true);
	var pathname = urlParsed.pathname
	if(pathname=='/set'){
		let content='';
		req.on('data',function(chunk){
			content += chunk;
		})
		req.on('end',function(){
			locationData=content;
			res.writeHead(200)
			res.end('success')
		})
	}
	if(pathname=='/get'){
		if(!locationData){
			res.writeHead(200)
			res.end('没有位置数据')
		}else{
			res.writeHead(200)
			res.end('位置信息为: '+locationData)			
		}
	}
}).listen(9010,'0.0.0.0')