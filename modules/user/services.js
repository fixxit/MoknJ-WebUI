'use strict';

angular.module('User')
        .factory('UserService',
                ['SettingsCall', 'MenuService',
                    function (SettingsCall, MenuService) {
                        var service = {};

                        service.getAllMenus = function (token, callback) {
                            MenuService.getAllMenus(token, callback);
                        };

                        service.addAccess = function (token, id, acccess, callback) {
                            SettingsCall.process(
                                    'resource/add/' + id + '/accesss?access_token=' + token,
                                    acccess,
                                    callback);
                        };

                        service.getAccessList = function (token, id, callback) {
                            SettingsCall.process(
                                    'resource/get/' + id + '/accesss?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.allRights = function (token, callback) {
                            SettingsCall.process(
                                    'resource/all/rights?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.get = function (token, id, callback) {
                            SettingsCall.process(
                                    'resource/get/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.save = function (token, data, callback) {
                            SettingsCall.process(
                                    'resource/add/?access_token=' + token,
                                    data,
                                    callback);
                        };

                        service.authorities = function (token, callback) {
                            SettingsCall.process(
                                    'resource/authorities?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.all = function (token, callback) {
                            SettingsCall.process(
                                    'resource/get/all/?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.remove = function (token, id, callback) {
                            SettingsCall.process(
                                    'resource/delete/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        return service;
                    }]);