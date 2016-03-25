document.body.onload = checkLoginState;

window.fbAsyncInit = function() {
  FB.init({
    appId: '215566298800379',
    cookie: true,
    xfbml: true,  // parse social plugins on this page
    version: 'v2.5' // use graph api version 2.5
  });
  checkLoginState();
};

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      getFacebookFeed();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('content').innerHTML = 'Please log into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('content').innerHTML = 'Please log into Facebook.';
    }
  });
}

function getFacebookFeed() {
  FB.api("cngroupzl/feed?fields=full_picture,message,created_time,object_id,type&limit=10",
    function(response) {
      if (response && !response.error) {
        var container = document.getElementById('content');

        response.data.forEach(function(status) {
          if (status.type === 'photo') {
            var element = document.createElement('div');
            element.innerHTML =
              '<div>' + status.message + ' - ' + new Date(status['created_time']).toDateString() + '<div> ' +
              '<img src="' + status['full_picture'] + '">';
            container.appendChild(element);
          }
        });
      } else {
        console.error(response.error)
      }
    }
  );
}