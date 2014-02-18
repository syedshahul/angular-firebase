"use strict";

var myApp = angular.module('myApp.routes', [])

   // configure views; the authRequired parameter is used for specifying pages
   // which should only be available while logged in
   .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/home', {
         templateUrl: 'partials/home.html',
         controller: 'HomeCtrl',
				resolve: {
					myApp: function($q, $timeout) {
						var defer = $q.defer();
						$timeout(function() {
							defer.resolve();
						}, 3000);
						return defer.promise;
					}
				}
      });

      $routeProvider.when('/chat', {
				authRequired: true,
         templateUrl: 'partials/chat.html',
         controller: 'ChatCtrl'
      });

      $routeProvider.when('/account', {
         authRequired: true, // must authenticate before viewing this page
         templateUrl: 'partials/account.html',
         controller: 'AccountCtrl'
      });

      $routeProvider.when('/login', {
				authRequired: false,
         templateUrl: 'partials/login.html',
         controller: 'LoginCtrl'
      });
	   $routeProvider.when('/gitlogin', {
		    authRequired: false,
				controller: 'MainCtrl',
			 redirectTo: '/home'

	});

      $routeProvider.otherwise({redirectTo: '/home'});
   }]);