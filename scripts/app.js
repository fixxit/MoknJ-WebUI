/* global restlayerAPI_URL */

'use strict';

// declare modules
angular.module('Authentication', ['ui.bootstrap']);
angular.module('Home', ['ui.bootstrap']);
angular.module('Type', ['ui.bootstrap']);
angular.module('Asset', ['ui.bootstrap']);
angular.module('Resource', ['ui.bootstrap']);
angular.module('Link', ['ui.bootstrap']);
angular.module('Template', ['ui.bootstrap']);

// new modles copme here
angular.module('FixxitAssetTrackerUI', [
    'Authentication',
    'Home',
    'Type',
    'Asset',
    'Resource',
    'Link',
    'Template',
    'ngRoute',
    'ngCookies'
]).config(['$routeProvider', function ($routeProvider) {
        // new controllers are instantiated here to the include!
        $routeProvider
                .when('/login', {
                    controller: 'LoginController',
                    templateUrl: 'modules/authentication/views/login.html',
                    hideMenus: true
                })

                .when('/home', {
                    controller: 'HomeController',
                    templateUrl: 'modules/home/views/home.html'
                })

                .when('/type', {
                    controller: 'TypeController',
                    templateUrl: 'modules/type/views/type.html'
                })

                .when('/asset', {
                    controller: 'AssetController',
                    templateUrl: 'modules/asset/views/asset.html'
                })

                .when('/resource', {
                    controller: 'ResourceController',
                    templateUrl: 'modules/resource/views/resource.html'
                })

                .when('/link', {
                    controller: 'LinkController',
                    templateUrl: 'modules/link/views/link.html'
                })
                
                .when('/template', {
                    controller: 'TemplateController',
                    templateUrl: 'modules/template/views/template.html'
                })
                
                .otherwise({redirectTo: '/login'});
    }])

        .run(['$rootScope', '$location', '$cookieStore', '$http', 'AuthenticationService',
            function ($rootScope, $location, $cookieStore, $http, AuthenticationService) {
                

                // keep user logged in after page refresh
                $rootScope.globals = $cookieStore.get('globals') || {};
                if ($rootScope.globals.currentUser) {
                    $http.defaults.headers.common['Authorization'] = 'Basic ' +
                            $rootScope.globals.currentUser.authdata; // jshint ignore:line
                }

                $rootScope.$on('$locationChangeStart', function (event, next, current) {

                    $rootScope.refreshToken = function (callback) {
                        $rootScope.globals = $cookieStore.get('globals') || {};
                        var username = $rootScope.globals.currentUser.username;
                        var password = $rootScope.globals.currentUser.password;
                        AuthenticationService.Login(
                                username,
                                password,
                                function (response) {
                                    if (response.error_description) {
                                        callback(false);
                                    } else {
                                        if (response.access_token) {
                                            AuthenticationService.SetCredentials(
                                                    username,
                                                    password,
                                                    response.access_token,
                                                    response.refresh_token,
                                                    response.expires_in);
                                        } else {
                                            callback(false);

                                        }
                                    }
                                    callback(true);
                                });
                    };

                    // redirect to login page if not logged in
                    if ($location.path() === '/login') {
                        AuthenticationService.ClearCredentials();
                    } else {
                        if ($rootScope.globals.currentUser) {
                            // refresh token
                            // needs to calculate the date by getting the cookies date and then
                            var expiry = $rootScope.globals.currentUser.expires_in;
                            var current = new Date().getTime();
                            var tokenExpiry = new Date(expiry).getTime();
                            var dif = tokenExpiry - current;

                            if (dif < 0) {
                                $rootScope.refreshToken(
                                        function (success) {
                                            if (!success) {
                                                alert("User logged out of system!");
                                                $location.path('/login');
                                            } else {
                                                $rootScope.globals = $cookieStore.get('globals') || {};
                                            }
                                        }
                                );
                            }
                        }
                    }
                    if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                        $location.path('/login');
                    }
                });
            }]);

