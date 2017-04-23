var http = require('http')
var app = http.createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var url = require('url');
var PORT = 8085;

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
			console.log('【新的连接】','url ',req.url,'method ',req.method,'content ',content)
			// content = content.replace(/(\d{2})\./g,".$1")
			//提取并转化两个坐标
			var gpslnglat=[]
			var trsGpslnglat='' //转换后的坐标
			content.replace(/(\d{3})(\d{2}\.\d*)([^\d]*)(\d{2})(\d{2}\.\d*)/,function(...arr){
			    var num1 = parseInt(arr[1])  //116
			    var num4 = parseInt(arr[4])  //39
			    var num2 = parseFloat(arr[2])/60
			    var num5 = parseFloat(arr[5])/60
			    gpslnglat.push(num1+num2) //存储lng
			    gpslnglat.push(num4+num5) //存储lat  都为数字型，在发给前端时记得转成字符串形式
			    // var str = (num1+num2).toString() + arr[3] + (num4+num5).toString()
			    // return arr[1]
			})
			console.log('处理完之后的坐标',gpslnglat)

			/**
			 * 用高德地图的接口进行坐标转换
			 */
			var transferUrl = 'http://restapi.amap.com/v3/assistant/coordinate/convert\?locations\='+ gpslnglat.join(',')+ '\&coordsys\=gps\&output\=JSON\&key\=404ea8ad33ca372fb5a5d53913828981'
			 http.get(transferUrl, (getRes) => {
			   const statusCode = getRes.statusCode;

			   let error;
			   if (statusCode !== 200) {
			     error = new Error(`请求失败。\n` +
			                       `状态码: ${statusCode}`);
			   }
			   if (error) {
			     console.log(error.message);
			     // 消耗响应数据以释放内存
			     getRes.resume();
			     return;
			   }

			   getRes.setEncoding('utf8');
			   let rawData = '';
			   getRes.on('data', (chunk) => rawData += chunk);
			   getRes.on('end', () => {
			     try {
			       let parsedData = JSON.parse(rawData);
			       // console.log(parsedData);
			       trsGpslnglat = parsedData.locations.split(',')

			       //上层响应处理 start
			       
			       var locationObj = {
			       	time:((new Date()).toLocaleString()),
			       	location:'lng\='+trsGpslnglat[0].toString()+'\&lat\='+trsGpslnglat[1].toString()
			       	,trsGpslnglat:trsGpslnglat
			       }
			       locationObjHistory.unshift(locationObj)
			       if(locationObjHistory.length>10){
			       	//只保留十个历史
			       	locationObjHistory=locationObjHistory.splice(0,10)
			       }
			       io.emit('change location',locationObj)
			       res.writeHead(200)
			       res.end('success set data')
			       //上层响应处理 end
			     } catch (e) {
			       console.log(e.message);
			     }
			   });
			 }).on('error', (e) => {
			   console.log(`错误: ${e.message}`);
			 });
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
