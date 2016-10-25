'use strict';

angular.module('Home')
        .controller('HomeController',
                ['$cookieStore', '$scope', '$rootScope', '$location', 'TypeService',
                    function ($cookieStore, $scope, $rootScope, $location, TypeService) {
                        if (!$rootScope.globals) {
                            $rootScope.globals = $cookieStore.get('globals') || {};
                        }

                        // test code

                        console.log("$rootScope.globals : " + $rootScope.globals);

                        console.log("name  : " + $rootScope.globals.currentUser.username);
                        $scope.username = $rootScope.globals.currentUser.username;
                        
                    }]);