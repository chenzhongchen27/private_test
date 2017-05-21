const dgram = require('dgram');
const client = dgram.createSocket('udp4');
// client.on('message', (msg, rinfo) => {
//   console.log(`客户端收到：${msg} 来自 ${rinfo.address}:${rinfo.port}`);
//   // client.close();
// });

var readline = require('readline');
const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
});
rl.on('line', function(line){
	client.send(line, 41234, 'localhost', (err) => {
	  // client.close();
	});
})