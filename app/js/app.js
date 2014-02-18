'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp',
      ['ngRoute', 'myApp.config', 'myApp.routes', 'myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers',
         'waitForAuth', 'routeSecurity','firebase']
   )

/*   .run(['gitLoginService', '$rootScope', 'FBURL', function(gitLoginService, $rootScope, FBURL) {
      if( FBURL === 'https://INSTANCE.firebaseio.com' ) {
         // double-check that the app has been configured
         angular.element(document.body).html('<h1>Please configure app/js/config.js before running!</h1>');
         setTimeout(function() {
            angular.element(document.body).removeClass('hide');
         }, 250);
      }
      else {
         // establish authentication
         $rootScope.auth = gitLoginService.init('/login');
         $rootScope.FBURL = FBURL;
      }
   }]);*/


.run(['$rootScope','$location', 'githubService', 'FBURL', function($rootScope, $location, githubService, FBURL){
	if( FBURL === 'https://INSTANCE.firebaseio.com' ) {
		// double-check that the app has been configured
		angular.element(document.body).html('<h1>Please configure app/js/config.js before running!</h1>');
		setTimeout(function() {
			angular.element(document.body).removeClass('hide');
		}, 250);
	}

	githubService.init();
	$rootScope.$watch('auth.authenticated', function() {
		$rootScope.isAuthenticated = $rootScope.auth.authenticated;
	});
}]);
