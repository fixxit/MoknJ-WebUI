'use strict';

angular.module('Home')
        .factory('HomeService',
                ['$http',
                    function ($http) {
                        var service = {};
                        var url = 'http://localhost:8080/asset/type/';
                        
                        service.getAllTypes = function (token, callback) {
                            $http({
                                method: 'POST',
                                url: url + 'all' + '?access_token=' + token,
                                data: {},
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }).success(function (response) {
                                callback(response);
                            }).error(function (response) {
                                callback(response);
                            });
                        };

                        return service;
                    }]);