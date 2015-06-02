'use strict';

angular.module('starter.services', ['starter.constants', 'firebase', 'ngCordova', 'ngCordovaOauth'])
.factory('User', function($rootScope, $http, nodeUrl, $ionicPopup, $cordovaOauth){
  function User(){
  }

  function goHome(){
    $state.go('app.home');
  }

  function showAlert(titleStr, response){
    $ionicPopup.alert({
      title: titleStr,
      content: response
    }).then(function(res) {
      console.log('Test Alert Box');
    });
  }

  function getDisplayName(data){
    switch(data.provider){
      case 'password':
        return data.password.email;
      case 'twitter':
        return data.twitter.username;
      case 'google':
        return data.google.displayName;
      case 'facebook':
        return data.facebook.displayName;
      case 'github':
        return data.github.displayName;
    }
  }

  User.initialize = function(){
    return $http.post(nodeUrl + '/users');
  };

  User.oauth = function(provider){
    switch(provider){
      case 'facebook':
        $cordovaOauth.facebook('442668512567921', ['email']).then(function(result){
          $rootScope.afAuth.$authWithOAuthToken('facebook', result.access_token).then(function(authData){
            console.log('Successfully login data:  ', authData);
          }, function(error){
            console.log('ERROR at the firebaseAuth level', error);
          });
        }, function(error){
          console.log('ERROR at the facebook level',  error);
        });
        break;
      case 'google':
        $cordovaOauth.google('534265459229-jpvjvcbk8vmevna8i8iccrvgmb7tcp4o.apps.googleusercontent.com', ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email"]).then(function(result){
          $rootScope.afAuth.$authWithOAuthToken('google', result.access_token).then(function(authData){
            console.log('Successfully login data:  ', authData);
          }, function(error){
            console.log('ERROR at the firebaseAuth level', error);
          });
        }, function(error){
          console.log('ERROR at the google plus level', error);
        });
    }
  };

  // User.register = function(user){
  //   return $rootScope.afAuth.$createUser(user);
  // };

  // User.login = function(user){
  //   return $rootScope.afAuth.$authWithPassword(user);
  // };

  User.logout = function(){
    return $rootScope.afAuth.$unauth();
  };

  return User;
});
