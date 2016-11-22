'use strict';

angular.module('Link')
        .factory('LinkService',
                ['$http', '$rootScope',
                    function ($http, $rootScope) {
                        var service = {};

                        $http.get('../settings.json').success(
                                function (response) {
                                    $rootScope.globalAppUrl = response.api_url;
                                    $rootScope.auth_user = response.auth_user;
                                    $rootScope.auth_psw = response.auth_psw;
                                });

                        service.process = function (url, callback) {
                            $http.post(url)
                                    .success(
                                            function (response) {
                                                callback(response);
                                            })
                                    .error(
                                            function (response) {
                                                callback(response);
                                            }
                                    );
                        };

                        service.allLinkForAssetId = function (token, id, callback) {
                            service.process(
                                    $rootScope.globalAppUrl + 'link/all/' + id + '/asset?access_token=' + token,
                                    callback);
                        };

                        service.allLinkForResourceId = function (token, id, callback) {
                            service.process(
                                    $rootScope.globalAppUrl + 'link/all/' + id + '/resource?access_token=' + token,
                                    callback);
                        };

                        service.allLink = function (token, callback) {
                            service.process(
                                    $rootScope.globalAppUrl + 'link/all/?access_token=' + token,
                                    callback);
                        };

                        service.getResource = function (token, id, callback) {
                            service.process(
                                    $rootScope.globalAppUrl + 'resource/get/' + id + '?access_token=' + token,
                                    callback);
                        };

                        service.getAsset = function (token, id, callback) {
                            service.process(
                                    $rootScope.globalAppUrl + 'asset/get/' + id + '?access_token=' + token,
                                    callback);
                        };

                        service.getDetail = function (token, id, callback) {
                            service.process(
                                    $rootScope.globalAppUrl + 'type/get/' + id + '?access_token=' + token,
                                    callback);
                        };

                        return service;
                    }]);