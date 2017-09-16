'use strict';

angular.module('Asset')
        .factory('AssetService',
                ['SettingsCall',
                    function (SettingsCall) {
                        var service = {};

                        service.getDetail = function (token, id, callback) {
                            SettingsCall.process(
                                    'type/get/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.get = function (token, id, callback) {
                            SettingsCall.process(
                                    'asset/get/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.save = function (token, menuId, id, data, callback) {
                            SettingsCall.process(
                                    'asset/add/' + menuId + '/' + id + '?access_token=' + token,
                                    data,
                                    callback);
                        };


                        return service;
                    }]);