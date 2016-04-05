var express = require('express');
var Twitter = require('twitter');

var app = express.module = express();
var server = app.listen(process.env.PORT || 9999, function() {
  var port = server.address().port;

  console.log('Sloop Twitter Server is running at http://localhost:%s', port);
});

var client = new Twitter({
  consumer_key: 'P7k3Ub3WJYphvTaJljjbenZNc',
  consumer_secret: 'SFi1hBdtbwc9vbkixYgBkNf9orU2eK5nlg1sKrtDmK94KkBEoK',
  access_token_key: '712286831853883392-7EyKVvPukWEN83AfxNQG8230PFtfDMf',
  access_token_secret: 'tMpEKISuzXUJeSwCVASDC7oGfQ09zMCcmL2RHXTCsrHLy'
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