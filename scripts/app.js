'use strict';

// declare modules
angular.module('Authentication', ['ui.bootstrap']);
angular.module('Home', ['ui.bootstrap']);
angular.module('Type', ['ui.bootstrap']);
angular.module('Asset', ['ui.bootstrap']);
angular.module('Resource', ['ui.bootstrap']);

// new modles copme here
angular.module('FixxitAssetTrackerUI', [
    'Authentication',
    'Home',
    'Type',
    'Asset',
    'Resource',
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

                        .otherwise({redirectTo: '/login'});
            }])

        .run(['$rootScope', '$location', '$cookieStore', '$http', 'AuthenticationService',
            function ($rootScope, $location, $cookieStore, $http, AuthenticationService) {
                // set default server address.
                $rootScope.globalAppUrl = "http://localhost:8080/";
                
                // keep user logged in after page refresh
                $rootScope.globals = $cookieStore.get('globals') || {};
                if ($rootScope.globals.currentUser) {
                    $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
                }

                $rootScope.$on('$locationChangeStart', function (event, next, current) {
                    // redirect to login page if not logged in
                    if ($location.path() === '/login') {
                        $rootScope.token = {};
                        $cookieStore.remove('token');
                        AuthenticationService.ClearCredentials();
                        clearInterval($rootScope.interval);
                    } else {
                        $rootScope.token = $cookieStore.get('token') || {};
                        if ($rootScope.token && $rootScope.token.expired) {
                            AuthenticationService.ClearCredentials();
                            alert(JSON.stringify($rootScope.token))
                            $location.path($rootScope.token.location);
                        }
                    }

                    if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                        $location.path('/login');
                    }

                    $rootScope.refreshToken = function () {
                        $rootScope.globals = $cookieStore.get('globals') || {};
                        if ($rootScope.globals.currentUser) {
                            var message = confirm("login expired refresh token ?");
                            if (message) {
                                AuthenticationService.Login(
                                        $rootScope.globals.currentUser.username,
                                        $rootScope.globals.currentUser.password,
                                        function (response) {
                                            if (response.error_description) {
                                                clearInterval($rootScope.interval);
                                                alert(response.error_description);
                                                AuthenticationService.ClearCredentials();
                                                $rootScope.token = {'location': '/login', 'expired': true};
                                            } else {
                                                if (response.access_token) {
                                                    AuthenticationService.SetCredentials(
                                                            $rootScope.globals.currentUser.username,
                                                            $rootScope.globals.currentUser.password,
                                                            response.access_token,
                                                            response.refresh_token,
                                                            response.expires_in);
                                                    $rootScope.token = {'location': '', 'expired': false};
                                                    $cookieStore.put('token', $rootScope.token);
                                                } else {
                                                    clearInterval($rootScope.interval);
                                                    alert("Web app logged off no token recieved!");
                                                    $rootScope.token = {'location': '/login', 'expired': true};
                                                    $cookieStore.put('token', $rootScope.token);
                                                }
                                            }
                                            console.log("reset response : " + JSON.stringify(response));
                                        });
                            } else {
                                clearInterval($rootScope.interval);
                                $rootScope.token = {'location': '/login', 'expired': true};
                                $cookieStore.put('token', $rootScope.token);
                            }
                        }
                    };

                    if ($rootScope.globals.currentUser) {
                        // refresh token
                        // needs to calculate the date by getting the cookies date and then
                        if (!$rootScope.interval) {
                            var expiry = $rootScope.globals.currentUser.expires_in;
                            $rootScope.interval = setInterval(
                                    function () {
                                        $rootScope.refreshToken()
                                    }
                            , 1000 * expiry);// 1000 = 1 sec
                        }
                    }
                });
            }]);