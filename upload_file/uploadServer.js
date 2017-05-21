var formidable = require('formidable'),
	http = require('http'),
	util = require('util')
	,fs = require('fs')
	,path = require('path');

http.createServer(function(req, res) {
	if(req.url == '/getfiles'){
		//返回文件已有的数据
		fs.readdir(__dirname + '/files/', function (err, files) {
		  if(err) {
		    console.error(err);
		    return;
		  } else {
		    res.writeHead(500)
		    res.end(JSON.stringify(files))
		  }
		});
		return;
	}

	if(req.url.indexOf('/files')===0){
		var filename = req.url.split('/').pop()
		res.setHeader('Content-Disposition',`attachment; filename="${filename}"`)
		res.setHeader('ContentType',"application/octet-stream")
		fs.createReadStream('./files/'+filename).pipe(res)
		return;
	}

	if (req.url==='/'&&req.method.toLowerCase() == 'post') {
		// parse a file upload
		var form = new formidable.IncomingForm();
		/**
		 * 后续加 如果文件夹不存在，则新建文件夹
		 * @type {String}
		 */
		form.uploadDir = './files/'
		form.keepExtensions = true;
		form.parse(req, function(err, fields, files) {
			if(err) {
				res.writeHead(500)
				res.end(err);
				return;
			}
			console.log(fields);
			var newPath = form.uploadDir + (fields.title||files.file.name);
			fs.renameSync(files.file.path, newPath);
			// res.writeHead(200,{'content-type': 'text/json'})
			// res.end(JSON.stringify(content));
			console.log('上传成功,文件名：',files.file.name)
		});
	}
	fs.createReadStream('./index.html').pipe(res)
}).listen(8070);



