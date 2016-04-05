import {twitterLimit} from './configuration.js';
export default class Twitter {

  constructor(source) {
    this.source = source;
    this.collection = [];
  }

  getFeed() {
    var self = this;
    return new Promise(function(resolve, reject) {
      var httpRequest = new XMLHttpRequest();

      var params = 'source=' + self.source + '&limit=' + twitterLimit;
      httpRequest.open('GET', location + 'twitter/timeline?' + params, true);
      httpRequest.setRequestHeader('Content-Type', 'application/json');
      httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
          if (httpRequest.status === 200) {
            var parsedArray = JSON.parse("[" + httpRequest.responseText + "]")[0];
            resolve(parsedArray);
          } else {
            console.warn('Twitter server error.');
            resolve();
          }
        }
      };
      httpRequest.send(params);
    })
  }
}
