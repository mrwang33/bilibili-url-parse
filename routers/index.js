var express = require('express');
var router = express.Router();
var request = require('request');
var router = express.Router();

router.get('/api', function(req, outRes, next) {
  var avid = req.query.avid;
  var cid = req.query.cid;
  var url='https://api.bilibili.com/x/player/playurl?avid='+avid+'&cid='+cid;
  request(url, (err, res, body) => {
    if (err) { return console.log(err); }
    var data = JSON.parse(body);
    var sourceUrl = data.data.durl[0].url;
    console.log(sourceUrl);
    var options = {
      method: "GET",
      url:sourceUrl,
      headers:{
        "referer": "https://www.bilibili.com",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
      }
    };
    console.log('start');
    request(options).pipe(outRes);
  });
});

module.exports = router;
