var readline = require('readline');
const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
});
var sum=0,book={};
rl.on('line', function(line){
	line = line.trim()
	if(line.length===0){
		return;
	}
	if(line==='0'){
		console.log(sum)
		sum = 0
		return;
	}

	if(!book[line]){
		book[line]=true;
		sum++;
	}
});