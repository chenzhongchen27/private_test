var fs = require('fs')
var path = require('path')

fs.readdir(__dirname + '/files/', function (err, files) {
  if(err) {
    console.error(err);
    return;
  } else {
  	console.log('files:',files)
    files.forEach(function (file) {
      var filePath = path.normalize(__dirname + '/files/' + file);
      fs.stat(filePath, function (err, stat) {
        if(stat.isFile()) {
          console.log(filePath + ' is: ' + 'file');
        }
        if(stat.isDirectory()) {
          console.log(filePath + ' is: ' + 'dir');
        }
      });
    });
  }
});