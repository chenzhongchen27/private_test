TopClient = require('./topClient').TopClient;
var client = new TopClient({
    'appkey': 'appkey',
    'appsecret': 'secret',
    'REST_URL': 'http://gw.api.taobao.com/router/rest'
});
 
client.execute('alibaba.aliqin.fc.sms.num.send', {
    'extend':'123456',
    'sms_type':'normal',
    'sms_free_sign_name':'阿里大于',
    'sms_param':'{\"code\":\"1234\",\"product\":\"alidayu\"}',
    'rec_num':'13000000000',
    'sms_template_code':'SMS_585014'
}, function(error, response) {
    if (!error) console.log(response);
    else console.log(error);
})