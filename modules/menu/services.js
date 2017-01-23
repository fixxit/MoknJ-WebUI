'use strict';

angular.module('Menu')
        .factory('MenuService',
                ['SettingsCall',
                    function (SettingsCall) {
                        var service = {};

                        service.getAllTypes = function (token, callback) {
                            SettingsCall.process(
                                    'type/all?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.getMenu = function (token, id, callback) {
                            SettingsCall.process(
                                    'menu/get/' + id +
                                    '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.deleteMenu = function (token, id, callback) {
                            SettingsCall.process(
                                    'menu/delete/' + id +
                                    '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.saveMenu = function (token, menu, callback) {
                            SettingsCall.process(
                                    'menu/add?access_token=' + token,
                                    menu,
                                    callback);
                        };

                        service.getAllMenus = function (token, callback) {
                            SettingsCall.process(
                                    'menu/all?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.getAllModules = function (token, callback) {
                            SettingsCall.process(
                                    'menu/module/types?access_token=' + token,
                                    null,
                                    callback);
                        };

                        return service;
                    }]);