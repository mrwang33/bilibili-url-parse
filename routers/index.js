var express = require('express');
var router = express.Router();
var request = require('request');
var router = express.Router();

router.get('/api', function(req, outRes, next) {
  var avid = req.query.avid;
  var cid = req.query.cid;

  request({
    method: 'GET',
    url:'https://api.bilibili.com/x/player/playurl?avid='+avid+'&cid='+cid+'&qn=64',
    header: {
            'Cookie': 'SESSDATA=23ec7408%2C1694949442%2C7fe83%2A31; Path=/; Domain=bilibili.com; Expires=Sun, 17 Sep 2023 11:17:22 GMT; HttpOnly; Secure'
    }
  }, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log(body);
    var data = JSON.parse(body);
    var sourceUrl = data.data.durl[0].url;
    console.log(sourceUrl);
    var options = {
      method: "GET",
      url:sourceUrl,
      headers:{
        "referer": "https://www.bilibili.com",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
        'Cookie': 'SESSDATA=23ec7408%2C1694949442%2C7fe83%2A31; Path=/; Domain=bilibili.com; Expires=Sun, 17 Sep 2023 11:17:22 GMT; HttpOnly; Secure'
      }
    };
    console.log('start');
    request(options).pipe(outRes);
  });
});

var qrCodeKey = '';
router.get('/login', function(req, outRes, next) {
  var url='https://passport.bilibili.com/x/passport-login/web/qrcode/generate';
  request(url, (err, res, body) => {
    if (err) { return console.log(err); }
    var data = JSON.parse(body);
    var qrCodeUrl = data.data.url;
    qrCodeKey = data.data.qrcode_key;
    console.log('qrCodeUrl:'+ qrCodeUrl);
  });
});

router.get('/login/check', function(req, outRes, next) {
  var url='https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key='+qrCodeKey;
  request(url, (err, response, body) => {
    if (err) { return console.log(err); }
    console.log(body);
    var rawcookies = response.headers['set-cookie'];
    console.log(rawcookies);
  });
});

module.exports = router;
