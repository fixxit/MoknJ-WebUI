'use strict';

angular.module('Link')
        .factory('LinkService',
                ['$http', '$rootScope',
                    function ($http, $rootScope) {
                        var service = {};
                        var url = $rootScope.globalAppUrl + 'asset/';

                        service.allLinkForAssetId = function (token, id, callback) {
                            $http({
                                method: 'POST',
                                url: url + 'link/all/'+id+'/asset?access_token=' + token,
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }).success(function (response) {
                                callback(response);
                            }).error(function (response) {
                                callback(response);
                            });
                        };
                        
                        service.allLinkForResourceId = function (token, id, callback) {
                            $http({
                                method: 'POST',
                                url: url + 'link/all/'+id+'/resource?access_token=' + token,
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }).success(function (response) {
                                callback(response);
                            }).error(function (response) {
                                callback(response);
                            });
                        }; 
                        
                        service.allLink = function (token, callback) {
                            $http({
                                method: 'POST',
                                url: url + 'link/all/?access_token=' + token,
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }).success(function (response) {
                                callback(response);
                            }).error(function (response) {
                                callback(response);
                            });
                        };
                        
                        service.getResource = function (token, id, callback) {
                            $http({
                                method: 'POST',
                                url: url + 'resource/get/' + id + '?access_token=' + token,
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