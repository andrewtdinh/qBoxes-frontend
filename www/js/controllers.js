'use strict';

angular.module('starter.controllers', ['starter.services', 'starter.constants', 'firebase', 'ngCordova', 'ngCordovaOauth'])

.controller('AppCtrl', function($window, firebaseUrl, $firebaseAuth, $scope, $ionicModal, $rootScope, User, $http, $state) {
  $rootScope.fbRoot = new $window.Firebase(firebaseUrl);
  $rootScope.afAuth = $firebaseAuth($rootScope.fbRoot);

  function goHome(){
    $state.go('app.home');
  }

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

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

  $rootScope.afAuth.$onAuth(function(data){
    if(data){
      $rootScope.activeUser = data;
      $rootScope.displayName = getDisplayName(data);
      $http.defaults.headers.common.Authorization = 'Bearer ' + data.token;
      User.initialize().then(function(response){
        $rootScope.activeUser.mongoId = response.data;
        goHome();
      });
    }else{
      $rootScope.activeUser = null;
      $rootScope.displayName = null;
      $http.defaults.headers.common.Authorization = null;
      goHome();
    }
  });
  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.oauth = function(provider){
    User.oauth(provider);
    $scope.modal.hide();
  }

  $scope.logout = function(){
    $scope.modal.hide();
    User.logout();
  }
});
