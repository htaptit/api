'use strict';
var Twit = require('twit')

var T = new Twit({
  consumer_key:         'CK3nW8UpyA4MOA3CADiKFTc0U',
  consumer_secret:      'SNrx1dFGlgsj0f9syrlIF1TDGAWeIvSXloFFm3FYqkFYYvRQHo',
  access_token:         '3146759460-tnRDY2g2meDB4ziHT9UHakHM0gh3P85KOv44FnJ',
  access_token_secret:  'ifiu6zHaIW0estIGbDdBr4bHlZpHmE1FFNTZL8BcBzJ3R',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

T.get('users/lookup', { screen_name: 'nytimes' },  function (err, data, response) {
  console.log(data)
})