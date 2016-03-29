document.body.onload = checkLoginState;

var collection = [];
var activeID = 0;
var slideInterval;
var sources = {
  facebook: [
    'cngroupzl', 'cngroupcz', 'cnuniversity'
  ]
};

window.fbAsyncInit = function() {
  FB.init({
    appId: '215566298800379',
    cookie: true,
    xfbml: true,
    version: 'v2.5'
  });
  checkLoginState();
};

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      getFacebookFeed();
    } else if (response.status === 'not_authorized') {
      document.getElementById('content').innerHTML = 'Please log into this app.';
    } else {
      document.getElementById('content').innerHTML = 'Please log into Facebook.';
    }
  });
}

function getFacebookFeed() {
  sources.facebook.forEach(function(feedSource) {
    FB.api(feedSource + '/feed', {fields: ['full_picture,message,type,created_time,from{name,picture}'], limit: 15},
      function(response) {
        if (response && !response.error) {
          response.data.forEach(function(status) {
            if (status.type === 'photo' || status.type === 'link') {
              collection.push({
                type: 'facebook',
                message: status.message,
                img: status['full_picture'],
                date: new Date(status['created_time']),
                source: {
                  name: status['from']['name'],
                  icon: status['from']['picture']['data']['url']
                }
              });
            }
          });
          collection.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
          });
          createContainer();
        } else {
          console.error(response.error)
        }
      }
    );

  })
}

function createContainer() {
  var container = document.getElementById('content');
  container.innerHTML = '';
  var id = 0;

  collection.forEach(function(status) {
    var element = document.createElement('div');
    element.className = 'status deactivated';
    element.id = id++;

    // From
    var from = document.createElement('h3');
    from.className = 'from';

    var fromIcon = document.createElement('img');
    fromIcon.className = 'icon';
    fromIcon.src = status.source.icon;
    from.appendChild(fromIcon);

    var fromInfo = document.createElement('div');
    var fromName = document.createElement('span');
    fromName.innerHTML = status.source.name;
    fromName.className = 'name';
    fromInfo.appendChild(fromName);

    // Date
    var date = document.createElement('span');
    date.innerHTML = (status.date.getDate() + 1) + '.' + (status.date.getMonth() + 1) + '.' + status.date.getFullYear();
    date.className = 'date';

    fromInfo.appendChild(date);

    from.appendChild(fromInfo);
    element.appendChild(from);

    // Status Content
    var content = document.createElement('div');
    content.className = 'content';

    // Message
    var message = document.createElement('div');
    message.innerHTML = status.message;
    message.className = 'message';
    content.appendChild(message);

    // Image
    if (status.img) {
      var picture = document.createElement('img');
      picture.src = status.img;
      picture.className = 'statusPicture';
      content.appendChild(picture);
    }
    element.appendChild(content);

    container.appendChild(element);
  });

  startInterval();
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
  //set first as active
  document.getElementById(0).className = 'status active';
  if (!slideInterval) {
    slideInterval = setInterval(slideShow, 5000);
  }
}
function stopInterval() {
  window.clearInterval(slideInterval);
}

