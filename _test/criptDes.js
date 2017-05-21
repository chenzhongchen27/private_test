const crypto = require('crypto');
const cipher = crypto.createCipher('des', 'qwertyuioplkjhg');

let encrypted = cipher.update('humeiling123&luojing456', 'utf8', 'hex');
console.log('update后:',encrypted)
encrypted += cipher.final('hex');
console.log('最终',encrypted);


/**
 *  'des',
  'des-cbc',
  'des-cfb',
  'des-cfb1',
  'des-cfb8',
  'des-ecb',
  'des-ede',
  'des-ede-cbc',
  'des-ede-cfb',
  'des-ede-ofb',
  'des-ede3',
  'des-ede3-cbc',
  'des-ede3-cfb',
  'des-ede3-cfb1',
  'des-ede3-cfb8',
  'des-ede3-ofb',
  'des-ofb',
 */