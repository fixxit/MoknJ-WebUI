'use strict';

angular.module('Link')
        .factory('LinkService',
                ['$http', '$rootScope',
                    function ($http, $rootScope) {
                        var service = {};
                        var url = $rootScope.globalAppUrl + 'asset/';

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
                                    url + 'link/all/' + id + '/asset?access_token=' + token,
                                    callback);
                        };

                        service.allLinkForResourceId = function (token, id, callback) {
                            service.process(
                                    url + 'link/all/' + id + '/resource?access_token=' + token,
                                    callback);
                        };

                        service.allLink = function (token, callback) {
                            service.process(
                                    url + 'link/all/?access_token=' + token,
                                    callback);
                        };

                        service.getResource = function (token, id, callback) {
                            service.process(
                                    url + 'resource/get/' + id + '?access_token=' + token,
                                    callback);
                        };

                        service.getAsset = function (token, id, callback) {
                            service.process(
                                    url + 'get/' + id + '?access_token=' + token,
                                    callback);
                        };

                        service.getDetail = function (token, id, callback) {
                            service.process(
                                    url + 'type/get/' + id + '?access_token=' + token,
                                    callback);
                        };

                        return service;
                    }]);