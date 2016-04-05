var express = require('express');
var Twitter = require('twitter');

var app = express.module = express();
var server = app.listen(process.env.PORT || 9999, function() {
  var port = server.address().port;

  console.log('Sloop Twitter Server is running at http://localhost:%s', port);
});

var client = new Twitter({
  consumer_key: 'DhByDg9KCOv6bWCgvkbdIsDRl',
  consumer_secret: 'ahKEkoGs8iIDBegOnL9sBQ2V8VUO4rpuNCi0hi28IdUXu4hZ08',
  access_token_key: '3427671862-olDxVZSTXHEhzkYjJozoSlvnm1L0GjtIEweDWkb',
  access_token_secret: 'KCcLc9Q4QEwU8C9DrWRKUNTdNemEjkBu8bu52CCBQVa1R'
});

app.get('/twitter/timeline', function(req, res) {

  client.get('statuses/user_timeline', {
    screen_name: req.query.source,
    count: req.query.limit
  }, function(error, timeline) {
    if (error) {
      console.log(error);
      res.type('x-www-form-urlencoded').status(error.code).send(error.message);
    } else {
      console.log(req.query.source, 'Timeline recieved');
      var ids = [];
      timeline.forEach(function(tweet) {
        ids.push({type: 'twitter', id: tweet['id_str'], date: Date.parse(tweet['created_at'])});
      });

      res.type('application/json').status(200).send(ids);
    }
  });

});