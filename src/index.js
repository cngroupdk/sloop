import Facebook from './components/facebook.js';
import Twitter from './components/twitter.js';
import * as config from './components/configuration.js';
import './style.scss';

document.body.onload = checkLoginState;
window.fbAsyncInit = function() {
  FB.init({
    appId: config.facebookAppID,
    cookie: true,
    xfbml: true,
    version: 'v2.5'
  });
  checkLoginState();
};

var collection = [];
var feeds = [];
var activeID = 0;
var slideInterval;
var refreshInterval;
var facebookFeedReady = false;
var twitterFeedReady = false;

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      prepareFeeds();
    } else if (response.status === 'not_authorized') {
      document.getElementById('content').innerHTML = '<div class="status"><p>Please log into this app.</p><fb:login-button scope="public_profile,email" onlogin="location.reload();"> </fb:login-button></div>';
      FB.XFBML.parse();
    } else {
      document.getElementById('content').innerHTML = '<div class="status"><p>Please log into Facebook. </p><fb:login-button scope="public_profile,email" onlogin="location.reload();"> </fb:login-button></div>';
      FB.XFBML.parse();
    }
  });
}

function prepareFeeds() {
  var newCollection = [];
  var i = 1;
  if (config.sources.facebook.length > 0) {
    config.sources.facebook.forEach(function(source) {
      new Facebook(source).getFeed().then(function(response) {
        newCollection = newCollection.concat(response);

        if (i === config.sources.facebook.length) {
          collection = newCollection;
          facebookFeedReady = true;
          startInterval();
        }
        i++;
      });
    });
  } else {
    facebookFeedReady = true;
  }
  if (config.sources.twitter.length > 0) {
    config.sources.twitter.forEach(function(source) {
      new Twitter(source).getFeed().then(function(response) {
        if (response) {
          newCollection = newCollection.concat(response);
          collection = newCollection;
        }
        twitterFeedReady = true;
        startInterval();
      })
    })
  } else {
    twitterFeedReady = true;
  }
}

function createElements(id) {
  var container = document.getElementById('content');
  var element;
  var post;

  if (collection[id]['type'] === 'facebook') {
    if (document.getElementById(id)) {
      element = document.getElementById(id);
      if (element.firstChild.getAttribute('data-href') === collection[id]['permalink']) {
        return;
      }
      element.innerHTML = '';
    } else {
      element = document.createElement('div');
      element.className = 'status deactivated';
    }
    element.id = id;

    post = document.createElement('div');
    post.className = 'fb-post';
    post.setAttribute('data-href', collection[id]['permalink']);
    post.setAttribute('data-width', 750);
    element.appendChild(post);
    container.appendChild(element);

    FB.XFBML.parse(element);
  } else {
    if (document.getElementById(id)) {
      element = document.getElementById(id);
      if (element.firstChild.getAttribute('tweet-id') === collection[id]['id']) {
        return;
      }
      element.innerHTML = '';
    } else {
      element = document.createElement('div');
      element.className = 'status deactivated';
    }
    element.id = id;

    post = document.createElement('div');
    post.className = 'tweet';
    post.setAttribute('tweet-id', collection[id]['id']);
    element.appendChild(post);
    container.appendChild(element);
    twttr.widgets.createTweet(collection[id]['id'], post, {
      align: 'center',
      width: '550'
    });
  }
}

function test() {

}

function slideShow() {
  if (collection.length > 0) {
    document.getElementById(activeID).className = 'status deactivated';
    activeID++;
    if (activeID >= collection.length - 1) {
      activeID = 0;
    }
    document.getElementById(activeID).className = 'status active';
    if (activeID + 1 < collection.length - 1) {
      createElements(activeID + 1);
    } else {
      createElements(0);
    }
  }
}

function startInterval() {
  if (!slideInterval && facebookFeedReady && twitterFeedReady) {
    collection.sort(function(a, b) {
      return b.date - a.date;
    });
    collection.forEach(function(feedID, index) {
      createElements(index);
    });
    document.getElementById(0).className = 'status active';
    slideInterval = setInterval(slideShow, config.slideIntervalTime);
    refreshInterval = setInterval(function() {
      prepareFeeds();
    }, config.refreshIntervalTime);
  }
}

function stopInterval() {
  window.clearInterval(slideInterval);
  window.clearInterval(refreshInterval);
}
