angular.module('app').factory('googlePlus', function($rootScope, $q, user, $timeout) {

  // For official docs, see:
  //   https://developers.google.com/+/web/signin/#javascript_api

  var exports = {};
  var whenInitialized = $q.defer();
  var signedIn = false;
  var initializedUser = false;
  var initializedService = false;
  exports.renderButton = function(window, document, elementId) {
    window.startGoogleApp = function() { render(elementId); };
    initialize(document);
  };

  exports.login = function() {
    var deferred = $q.defer();
    whenInitialized.promise.then(function(){
      user.email = _.findWhere(user.google.emails, {type : 'account'}).value;
      user.firstName = user.google.name.givenName ? user.google.name.givenName : '';
      user.lastName = user.google.name.familyName ? user.google.name.familyName : '';
      deferred.resolve();
    }, function(){
        deferred.reject();
    });
    $rootScope.$broadcast("alternatePlaceholder:getIsDirty");
    return deferred.promise;
  };

  var auth2 = {};
  var helper = (function() {
    return {
      /**
       *
       * @param {Object} authResult An Object which contains the access token and
       *   other authentication information.
       */
      onSignInCallback: function(authResult) {
        if (authResult.isSignedIn.get()) {
          helper.profile(authResult);
        } else if (authResult['error'] ||
            authResult.currentUser && authResult.currentUser.get().getAuthResponse() == null) {
          //do nothing... we would add to a log if we had one.
        }
      },
      /**
       * Calls the OAuth2 endpoint to disconnect the app for the user.
       */
      disconnect: function() {
        // Revoke the access token.
        auth2.disconnect();
      },
      /**
       * Gets and renders the list of people visible to this app.
       */
      people: function() {
        gapi.client.plus.people.list({
          'userId': 'me',
          'collection': 'visible'
        }).then(function(res) {
          var people = res.result;
          for (var personIndex in people.items) {
            person = people.items[personIndex];
          }
        });
      },
      /**
       * Gets and renders the currently signed in user's profile data.
       */
      profile: function(authResult){
        gapi.client.plus.people.get({
          'userId': 'me'
        }).then(function(res) {
          var profile = res.result;
         user.google = profile;
          user.google.token = authResult.access_token;
          whenInitialized.resolve();
        }, function(err) {
          whenInitialized.reject();
        });
      }
    };
  })();
  var updateSignIn = function(authResultInit) {
    if(authResultInit && authResultInit.access_token && !authResultInit.error){
      gapi.client.load('plus', 'v1', function(){
          gapi.auth.setToken(authResultInit);
        helper.profile(authResultInit);
      });
    }
  };

  var render = function(elementId) {
    gapi.load('auth2', function() {
      gapi.client.load('plus','v1').then(function() {
        gapi.signin.render(elementId, {
          scope: 'https://www.googleapis.com/auth/plus.login',
          cookiepolicy:  'single_host_origin',
          clientid : '123456789101-higcffl7sbmjdv48orpauimmm8d447h0rp.apps.googleusercontent.com',
          fetch_basic_profile: true,
          callback: updateSignIn
        });
      });
    });
  };

  var initialize = function(document) {
    if(!initializedService){
      initializedService = true;
      var po = document.createElement('script');
      po.type = 'text/javascript';
      po.async = true;
      po.src = 'https://apis.google.com/js/client:platform.js?onload=startGoogleApp';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(po, s);
    }
  };

  return exports;
});
