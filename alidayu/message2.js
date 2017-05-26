TopClient = require('./lib/api/topClient.js').TopClient;
var client = new TopClient({
    'appkey': '23847198',
    'appsecret': 'bec3ef5cfc1cfc2d1270f00dc20def30',
    'REST_URL': 'http://gw.api.taobao.com/router/rest'
});
 

function sendMessage(pass, warn){
	//为true时，发送秘密
	if(warn){
		client.execute('alibaba.aliqin.fc.sms.num.send', {
		    'sms_type':'normal',
		    'sms_free_sign_name':'密码箱管理中心',
		    'sms_param':'{"pass\":\"'+ pass + '\"}',
		    'rec_num':'17888812446',
		    'sms_template_code':'SMS_69130041'
		}, function(error, response) {
		    if (!error) console.log(response);
		    else console.log(error);
		})
	}else{
		client.execute('alibaba.aliqin.fc.sms.num.send', {
		    'sms_type':'normal',
		    'sms_free_sign_name':'密码箱管理中心',
		    'sms_param':'{"pass\":\"'+ pass + '\"}',
		    'rec_num':'17888812446',
		    'sms_template_code':'SMS_67715400'
		}, function(error, response) {
		    if (!error) console.log(response);
		    else console.log(error);
		})
	}
}

module.exports = sendMessage