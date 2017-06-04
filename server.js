var http = require('http')
var app = http.createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var url = require('url');
var PORT = 8085;
var sendMessage = require('./alidayu/message2.js')

app.listen(PORT,'0.0.0.0',function(){
	console.log(`Server start on port ${PORT}`)
});
var locationObjHistory = []
var polygonPath = [
		[116.280137,39.839381],
		[116.280933,39.838669],
		[116.281124,39.837674], 
		[116.280559,39.835866], 
		[116.279352,39.836387], 
	];
var pass = '' //存储密码，发送一次之后清空
var phone = '13261403387'
var startTime = '17:04'
var endTime = '19:04'

function parseContent(content){
	var obj = {}
	var arr = content.split('&')
	arr.forEach(function(str){
		var temp = str.split('=')
		obj[temp[0]] = temp[1]
	})
	return obj;
}

function handler(req, res) {
	console.log(req.url)
	console.log('新的请求','startTime ',startTime,'endTime ',endTime,'phone ',phone)

	if(req.method==='POST'){
		let content='';
		req.on('data',function(chunk){
			content += chunk;
		})
		req.on('end',function(){
			//处理保存绘制多边形的数据
			if(req.url === '/saveArea'){
				polygonPath = JSON.parse(content)
				res.writeHead(200)
				res.end('success save polygonPath')
				return;
			}
			if(req.url === '/saveTime'){
				var parsedTime = JSON.parse(content)
				startTime = parsedTime.startTime
				endTime = parsedTime.endTime
				res.writeHead(200)
				res.end('success save time')

				return;
			}
			if(req.url === '/savePhone'){
				var parsedPhone = JSON.parse(content)
				console.log(parsedPhone)
				phone = parsedPhone.phone
				res.writeHead(200)
				res.end('success save phone')

				return;
			}


			//对密码是否发送进行处理
			pass = parseContent(content)['key']
			// console.log('pass=> ',pass)			
			//end
			
			// console.log('【新的连接】','url ',req.url,'method ',req.method,'content ',content)
			// content = content.replace(/(\d{2})\./g,".$1")
			//提取并转化两个坐标
			var gpslnglat=[]
			var trsGpslnglat='' //转换后的坐标
			//(\d{3})(\d{2}\.\d*) 如11645.222  ([^\d]*) (\d{2})(\d{2}\.\d*) 如3984.22
			content.replace(/(\d{3})(\d{2}\.\d*)([^\d]*)(\d{2})(\d{2}\.\d*)/,function(...arr){
			    var num1 = parseInt(arr[1])  //116
			    var num4 = parseInt(arr[4])  //39
			    var num2 = parseFloat(arr[2])/60      //先除以60进行转换，然后将该数字通过高德的接口进行转换
			    var num5 = parseFloat(arr[5])/60
			    gpslnglat.push(num1+num2) //存储lng
			    gpslnglat.push(num4+num5) //存储lat  都为数字型，在发给前端时记得转成字符串形式
			    // var str = (num1+num2).toString() + arr[3] + (num4+num5).toString()
			    // return arr[1]
			})
			// console.log('处理完之后的坐标',gpslnglat)

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
			       console.log(e.message,'【rawData】',rawData);
			     }
			   });
			 }).on('error', (e) => {
			   console.log(`错误: ${e.message}`);
			 });
		})
		return;
	}
	if(req.url === '/setarea.html'){
		fs.createReadStream('./setarea.html').pipe(res)
	}else if(req.url === '/getArea'){
		res.writeHead(200,{
			"Content-Type":"application/json"
		})
		res.end(JSON.stringify(polygonPath))
	}else if(req.url === '/getTime'){
		res.writeHead(200,{
			"Content-Type":"application/json"
		})
		res.end(JSON.stringify({
			startTime : startTime,
			endTime : endTime
		}))
	}else if(req.url === '/getPhone'){
		//手机号
		res.writeHead(200,{
			"Content-Type":"application/json"
		})
		res.end(JSON.stringify({
			phone: phone	
		})) //phone为字符串
	}else if(req.url === '/resource/regular.js'){
		fs.createReadStream('./resource/regular.js').pipe(res)
	}else if(req.url === '/favicon.ico'){
		res.writeHead(200)
		res.end('no icon')
	}else{
		fs.createReadStream('./index.html').pipe(res)
	}
}

io.on('connection', function(socket) {
	socket.emit('start data',locationObjHistory);
	socket.on('judge scope',function(obj){
		console.log('judgeScope',obj)
		//判断是否在某个时间范围
		//提取时间
		var lastTime = locationObjHistory[0].time;
		var curParsedArr = lastTime.split(/(\s|:)/g); //["2017-6-4", " ", "22", ":", "17", ":", "07"]
		var startParsedArr = startTime.split(/:/g)
		var endParsedArr = endTime.split(/:/g)

		var curHour = curParsedArr[2]
		var curMinu = curParsedArr[4]

		var startHour = startParsedArr[0]
		var startMinu = startParsedArr[1]

		var endHour = endParsedArr[0]
		var endMinu = endParsedArr[1]

		console.log('curHour ',curHour,'startHour ',startHour,'endHour ',endHour)
		console.log('curMinu ',curMinu,'startMinu ',startMinu,'endMinu ',endMinu)

		if(curHour>endHour||curHour<startHour){
			//小时完全不符合
			console.log('时间-小时-不符合要求')
			sendMessage(pass,true,phone)
			return;
		}else if(curHour == endHour&&curMinu>endMinu){
			//有一个等于时，比较该分钟
			console.log("时间-分钟-不符合要求")
			sendMessage(pass,true,phone)
			return
		}else if(curHour == startHour&&curMinu<startMinu){
			//有一个等于时，比较该分钟
			console.log("时间-分钟-不符合要求")
			sendMessage(pass,true,phone)
			return;

		}else{
			// sendMessage(pass,false,phone)

			console.log('时间分钟 符合要求')
			// return;
		}

		//
		//
		if(obj.isRange&&pass){
			sendMessage(pass,false,phone)
		}else if(obj.isRange && !pass){
			console.log('无密码，可能的原因为已发送过，请判断是否打开了多个管理员页面')
		}else if(!obj.isRange){
			sendMessage(pass,true,phone)
		}
	});
	socket.on('my other event', function(data) {
		console.error('接收到yotherevent时间')

		console.log(data);
	});
});
