module.exports = {
	mySplit:(oldStr,num)=>{
		var len =oldStr.length;
		let newStr="";
		if(len<num){
			num = len;
		}
		for(let i = 0; i < num; i++){
             newStr += oldStr[i];
		}
		return newStr;
	}
}