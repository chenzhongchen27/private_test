var map ={
	1:["*","*","*","*","*"]
	,2:["***","  *","***","*  ","***"]
	,3:["***","  *","***","  *","***"]
	,4:["* *","* *","***","  *","  *"]
	,5:["***","*  ","***","  *","***"]
	,6:["***","*  ","***","* *","***"]
	,7:["***","  *","  *","  *","  *"]
	,8:["***","* *","***","* *","***"]
	,9:["***","* *","***","  *","***"]
	,0:["***","* *","* *","* *","***"]
	,'+':["   "," * ","***"," * ","   "]
	,'-':["   ","   ","***","   ","   "]
	,'*':["   ","* *"," * ","* *","   "]
	,"/":["   ","  *"," * ","*  ","   "]
	,"=":["   ","***","   ","***","   "]
	,".":["   ","   ","   "," **"," **"]
}
function printOnStar(str){
	for(var i=0;i<str.length;i++){
		console.log(map[str[i]][0])
		console.log(map[str[i]][1])
		console.log(map[str[i]][2])
		console.log(map[str[i]][3])
		console.log(map[str[i]][4])
	}
}
printOnStar(".")