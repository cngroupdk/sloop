import {facebookLimit} from './configuration.js';

export default class Facebook {

  constructor(source) {
    this.source = source;
    this.collection = [];
  }

  getFeed() {
    var self = this;
    return new Promise(function(resolve) {
      FB.api(self.source + '/feed', {fields: ['permalink_url,created_time'], limit: facebookLimit},
        function(response) {
          if (response && !response.error) {
            response.data.forEach(function(status) {
              if (status['permalink_url']) {
                self.collection.push({
                  type: 'facebook',
                  permalink: status['permalink_url'],
                  date: Date.parse(status['created_time'])
                });
              }
            });
            resolve(self.collection);
          } else {
            console.error(response.error)
          }
        }
      )
    });
  }
}
