/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


'use strict';

angular.module('Type')
        .controller('TypeController',
                ['$cookieStore', '$scope', '$rootScope', '$location',
                    function ($cookieStore, $scope, $rootScope, $location) {
                        $rootScope.globals = $cookieStore.get('globals') || {};
                        console.log("$rootScope.globals : " + $rootScope.globals); 
                        console.log("name  : " + $rootScope.globals.currentUser.username);

                    }]);