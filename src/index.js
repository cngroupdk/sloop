import Facebook from './components/facebook.js';
document.body.onload = checkLoginState;
window.fbAsyncInit = function() {
  FB.init({
    appId: '215566298800379',
    cookie: true,
    xfbml: true,
    version: 'v2.5'
  });
  checkLoginState();
};
var refreshIntervalTime = 360 * 1000;
var slideIntervalTime = 15 * 1000;
var sources = {
  facebook: [
    'cngroupzl', 'cngroupcz', 'cnuniversity'
  ]
};


var collection = [];
var feeds = [];
var activeID = 0;
var slideInterval;
var refreshInterval;

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      prepareFeeds();
    } else if (response.status === 'not_authorized') {
      document.getElementById('content').innerHTML = 'Please log into this app. <fb:login-button scope="public_profile,email" onlogin="location.reload();"> </fb:login-button>';
      FB.XFBML.parse();
    } else {
      document.getElementById('content').innerHTML = 'Please log into Facebook. <fb:login-button scope="public_profile,email" onlogin="location.reload();"> </fb:login-button>';
      FB.XFBML.parse();
    }
  });
}

function prepareFeeds() {
  var newCollection = [];
  for (var i = 0; i < sources.facebook.length; i++) {
    (function() {
      new Facebook(sources.facebook[i]).getFeed().then(function(response) {
        newCollection = newCollection.concat(response);
        newCollection.sort(function(a, b) {
          return new Date(b.date) - new Date(a.date);
        });

        if (i === sources.facebook.length) {
          if (newCollection !== collection) {
            collection = newCollection;
            createElements();
            startInterval();
          }
        }
      })
    })()
  }
}

function createElements() {
  var container = document.getElementById('content');
  var id = 0;

  collection.forEach(function(status) {
    var element;
    if (document.getElementById(id)) {
      element = document.getElementById(id);
      element.innerHTML = '';
    } else {
      element = document.createElement('div');
    }
    element.className = 'status deactivated';
    element.id = id++;

    var post = document.createElement('div');
    post.className = 'fb-post';
    post.setAttribute('data-href', status['permalink']);
    post.setAttribute('data-width', 750);
    element.appendChild(post);

    container.appendChild(element);
    FB.XFBML.parse();
  });
}

function slideShow() {
  if (collection.length > 0) {
    document.getElementById(activeID).className = 'status deactivated';
    if (activeID++ === collection.length - 1) {
      activeID = 0;
    }
    document.getElementById(activeID).className = 'status active';
  }
}

function startInterval() {
  if (!slideInterval) {
    slideInterval = setInterval(slideShow, slideIntervalTime);
    refreshInterval = setInterval(function() {
      prepareFeeds();
    }, refreshIntervalTime);
  }
}

function stopInterval() {
  window.clearInterval(slideInterval);
  window.clearInterval(refreshInterval);
}