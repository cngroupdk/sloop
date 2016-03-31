import Facebook from './components/facebook.js';
import './style.scss';

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

var refreshIntervalTime = 30 * 1000;
var slideIntervalTime = 5 * 1000;
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
  var i = 1;
  sources.facebook.forEach(function(source) {
    new Facebook(source).getFeed().then(function(response) {
      newCollection = newCollection.concat(response);

      if (i === sources.facebook.length) {
        newCollection.sort(function(a, b) {
          return new Date(b.date) - new Date(a.date);
        });
        if (newCollection !== collection) {
          collection = newCollection;
          startInterval();
        }
      }
      i++;
    });
  })
}

function createElements(id) {
  var container = document.getElementById('content');

  var element;
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

  var post = document.createElement('div');
  post.className = 'fb-post';
  post.setAttribute('data-href', collection[id]['permalink']);
  post.setAttribute('data-width', 750);
  element.appendChild(post);

  container.appendChild(element);
  FB.XFBML.parse(element);
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
  if (!slideInterval) {
    collection.forEach(function(feedID, index) {
      createElements(index);
    });
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
