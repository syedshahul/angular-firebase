
var myApp =angular.module('myApp.service.login', ['myApp.service.firebase'])
/*		.factory('profileCreator', ['Firebase', 'FBURL', '$rootScope', function(Firebase, FBURL, $rootScope) {
	return function(id, name, email, callback) {
		new Firebase(FBURL).child('users/'+id).set({email: email, name: name}, function(err) {
			if( callback ) {
				callback(err);
				$rootScope.$apply();
			}
		});
	}
}])*/

.factory('firebaseAuth',['$firebase','$firebaseSimpleLogin','firebaseRef', '$rootScope','FBURL',
												 function($firebase, $firebaseSimpleLogin, firebaseRef, $rootScope, FBURL) {
	console.log("firebaseAuth");
													 var ref = new Firebase(FBURL);
													 $rootScope.auth = $firebaseSimpleLogin(ref);
													 var auth = new FirebaseSimpleLogin(ref, function(error, user) {
														 if (error) {
															 // an error occurred while attempting login
															 console.log(error);
														 } else if (user) {
															 // user authenticated with Firebase
															 console.log('User ID: ' + user.id + ', Provider: ' +
																					 user.provider +' , email id '+user.email+
																					 ' , username  '+user.username +
																					 ', displayname '+user.displayName
															 );
														 } else {
															 // user is logged out
															 console.log('logged ');

														 }
													 });

													 login: auth.login('github', {
														 rememberMe: true,
														 scope: 'user,gist'
													 });

}])

		.factory('githubService', ['$firebase','$rootScope', '$firebaseSimpleLogin', 'firebaseRef',
															function($firebase, $rootScope, $firebaseSimpleLogin, firebaseRef) {
																console.log("githubService");
																	var auth = null;
																return {
																	init: function() {
																		auth = $firebaseSimpleLogin(firebaseRef());
																		$rootScope.auth = {
																			authenticated: false,
																			userId:null,
																			provider:null,
																			emailId:null,
																			username:null,
																			displayName:null
																		};

																		auth = new FirebaseSimpleLogin(firebaseRef(), function(error, user) {
																			if (error) {
																				// an error occurred while attempting login
																				console.log(error);
																			} else if (user) {
																				// user authenticated with Firebase

																				$rootScope.auth = {
																					authenticated: true,
																					userId: user.id,
																					provider: user.provider,
																					emailId:user.email,
																					username:user.username,
																					displayName :user.displayName
																				};

																				console.log('$rootScope.auth.authenticated :'+$rootScope.auth.authenticated+', User ID: ' + user.id + ', Provider: ' +
																										user.provider +' , email id '+user.email+
																										' , username  '+user.username +
																										', displayname '+user.displayName);
																			} else {
																				// user is logged out
																				console.log('user is logged out');

																			}
																		});

																		return auth;
																	},

																	login: function() {
																		assertAuth();
																		console.log("verifying...");


																		auth.login('github', {
																			rememberMe: true,
																			scope: 'user,gist'
																		}).then(function(user) {
																																									console.log("login then");
																							alert(user.username);
																																									$rootScope.auth = {
																																										authenticated: true,
																																										userId: user.id,
																																										provider: user.provider,
																																										emailId:user.email,
																																										username:user.username,
																																										displayName :user.displayName
																																									};
																						});
																	},

																	logout: function() {
																		assertAuth();
																		auth.$logout();
																	}
																};

																function assertAuth() {
																	if( auth === null ) { throw new Error('Must call loginService.init() before using its methods'); }
																}
															}])

		.factory('gitLoginService',  ['$rootScope', '$firebaseSimpleLogin', 'firebaseRef', '$timeout',
																 function($rootScope, $firebaseSimpleLogin, firebaseRef, $timeout){

																	 var auth = null;
																	 return {
																		 init: function() {
																			 auth = $firebaseSimpleLogin(firebaseRef());
																			 console.log(auth.toString());

																			 $rootScope.auth = {
																				 authenticated: false,
																				 user: null,
																				 name: null
																			 };

																			 $rootScope.$on('$firebaseSimpleLogin:login', _set);
																			 $rootScope.$on('$firebaseSimpleLogin:error', _unset);
																			 $rootScope.$on('$firebaseSimpleLogin:logout', _unset);

																			 function _set(evt, user) {
																				 $timeout(function() {
																					 $rootScope.auth = {
																						 authenticated: true,
																						 user: user.id,
																						 provider: user.provider
																					 };
																				 });
																			 }

																			 function _unset() {
																				 $timeout(function() {
																					 $rootScope.auth = {
																						 authenticated: false,
																						 user: null,
																						 provider: $rootScope.auth && $rootScope.auth.provider
																					 };
																				 });
																			 }

																			 return auth;
																		 },
																		 login: function(){
																				 auth.login('github', {
																			 rememberMe: true,
																			 scope: 'user,gist'
																		 })},
																		 logout: function() {
																			 assertAuth();
																			 auth.$logout();
																		 }
																	 };

																	 function assertAuth() {
																		 if( auth === null ) { throw new Error('Must call loginService.init() before using its methods'); }
																	 }
}])
   .factory('loginService', ['$rootScope', '$firebaseSimpleLogin', 'firebaseRef', 'profileCreator', '$timeout',
      function($rootScope, $firebaseSimpleLogin, firebaseRef, profileCreator, $timeout) {
         var auth = null;
         return {
            init: function() {
               return auth = $firebaseSimpleLogin(firebaseRef());
            },

            /**
             * @param {string} email
             * @param {string} pass
             * @param {Function} [callback]
             * @returns {*}
             */
            login: function(email, pass, callback) {
               assertAuth();

              auth.$login('password', {
                  email: email,
                  password: pass,
                  rememberMe: true
               }).then(function(user) {
																				alert(user.toString());
                     if( callback ) {
                        //todo-bug https://github.com/firebase/angularFire/issues/199
                        $timeout(function() {
                           callback(null, user);
                        });
                     }
                  }, callback);
            },

            logout: function() {
               assertAuth();
               auth.$logout();
            },

            changePassword: function(opts) {
               assertAuth();
               var cb = opts.callback || function() {};
               if( !opts.oldpass || !opts.newpass ) {
                  $timeout(function(){ cb('Please enter a password'); });
               }
               else if( opts.newpass !== opts.confirm ) {
                  $timeout(function() { cb('Passwords do not match'); });
               }
               else {
                  auth.$changePassword(opts.email, opts.oldpass, opts.newpass).then(function() { cb && cb(null) }, cb);
               }
            },

            createAccount: function(email, pass, callback) {
               assertAuth();
               auth.$createUser(email, pass).then(function(user) { callback && callback(null, user) }, callback);
            },

            createProfile: profileCreator
         };

         function assertAuth() {
            if( auth === null ) { throw new Error('Must call loginService.init() before using its methods'); }
         }
      }])

   .factory('profileCreator', ['firebaseRef', '$timeout', function(firebaseRef, $timeout) {
      return function(id, email, callback) {
         firebaseRef('users/'+id).set({email: email, name: firstPartOfEmail(email)}, function(err) {
            //err && console.error(err);
            if( callback ) {
               $timeout(function() {
                  callback(err);
               })
            }
         });

         function firstPartOfEmail(email) {
            return ucfirst(email.substr(0, email.indexOf('@'))||'');
         }

         function ucfirst (str) {
            // credits: http://kevin.vanzonneveld.net
            str += '';
            var f = str.charAt(0).toUpperCase();
            return f + str.substr(1);
         }
      }
   }]);
