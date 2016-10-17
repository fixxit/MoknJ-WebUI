'use strict';

angular.module('Home')
        .controller('HomeController',
                ['$cookieStore', '$scope', '$rootScope', '$location',
                    function ($cookieStore, $scope, $rootScope, $location) {
                        $rootScope.globals = $cookieStore.get('globals') || {};

                        // test code
                        
                        console.log("$rootScope.globals : " + $rootScope.globals);
                        
                        console.log("name  : " + $rootScope.globals.currentUser.username);
                        $scope.username = $rootScope.globals.currentUser.username;
                    }]);