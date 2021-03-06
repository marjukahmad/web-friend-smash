function login(callback) {
  FB.login(callback);
}
function loginCallback(response) {
  console.log('loginCallback',response);
  if(response.status != 'connected') {
    top.location.href = 'https://www.facebook.com/appcenter/smash-hard';
  }
}
function onStatusChange(response) {
  if( response.status != 'connected' ) {
    login(loginCallback);
  } else {
    showHome();
  }
}
function onAuthResponseChange(response) {
  console.log('onAuthResponseChange', response);
}

var friendCache = {};

function getMe(callback) {
  FB.api('/me', {fields: 'id,name,first_name,picture.width(120).height(120)'}, function(response){
    if( !response.error ) {
      friendCache.me = response;
      callback();
    } else {
      console.error('/me', response);
    }
  });
}


function onStatusChange(response) {
  if( response.status != 'connected' ) {
    login(loginCallback);
  } else {
    getMe(function(){
      renderWelcome();
      showHome();
    });
  }
}

function login(callback) {
  FB.login(callback, {scope: 'user_friends'});
}

function getFriends(callback) {
  FB.api('/me/friends', {fields: 'id,name,first_name,picture.width(120).height(120)'}, function(response){
    if( !response.error ) {
      friendCache.friends = response.data;
      callback();
    } else {
      console.error('/me/friends', response);
    }
  });
}

function getPermissions(callback) {
  FB.api('/me/permissions', function(response){
    if( !response.error ) {
      friendCache.permissions = response.data;
      callback();
    } else {
      console.error('/me/permissions', response);
    }
  });
}

function hasPermission(permission) {
  for( var i in friendCache.permissions ) {
    if( 
      friendCache.permissions[i].permission == permission 
      && friendCache.permissions[i].status == 'granted' ) 
      return true;
  }
  return false;
}

function onStatusChange(response) {
  if( response.status != 'connected' ) {
    login(loginCallback);
  } else {
    getMe(function(){
      getPermissions(function(){
        if(hasPermission('user_friends')) {
          getFriends(function(){
            renderWelcome();
            onLeaderboard();
            showHome();    
          });
        } else {
          renderWelcome();
          showHome();
        }
      });
    });
  }
}
