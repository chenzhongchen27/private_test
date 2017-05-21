const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('message', (msg, rinfo) => {
  console.log(`服务器收到：${msg} 来自 ${rinfo.address}:${rinfo.port}`);
  server.send('server get the message: '+msg, rinfo.port, rinfo.address,()=>{
  	// server.close();
  });
});

server.on('listening', () => {
  var address = server.address();
  console.log(`服务器监听 ${address.address}:${address.port}`);
});

server.bind(41234);