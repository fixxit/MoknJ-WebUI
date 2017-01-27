'use strict';

angular.module('Home')
        .factory('HomeService',
                ['SettingsCall',
                    function (SettingsCall) {
                        var service = {};

                        service.getAllTypes = function (token, callback) {
                            SettingsCall.process(
                                    'type/all?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.getAllMenus = function (token, callback) {
                            SettingsCall.process(
                                    'menu/all?access_token=' + token,
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

                        service.getAllAssetForType = function (token, templateId, menuId, callback) {
                            SettingsCall.process(
                                    'asset/get/all/' + templateId +
                                    '/' + menuId + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.getAllEmployeeForType = function (token, templateId, menuId, callback) {
                            SettingsCall.process(
                                    'employee/get/all/' + templateId +
                                    '/' + menuId + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.deleteAsset = function (token, payload, callback) {
                            SettingsCall.process(
                                    'asset/delete/?access_token=' + token,
                                    payload,
                                    callback);
                        };

                        service.deleteEmployee = function (token, payload, callback) {
                            SettingsCall.process(
                                    'employee/delete/?access_token=' + token,
                                    payload,
                                    callback);
                        };

                        service.addLink = function (token, payload, callback) {
                            SettingsCall.process(
                                    'link/asset/add?access_token=' + token,
                                    payload,
                                    callback);
                        };

                        service.all = function (token, callback) {
                            SettingsCall.process(
                                    'resource/get/employee/all?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.save = function (token, id, data, callback) {
                            SettingsCall.process(
                                    'asset/add/' + id + '?access_token=' + token,
                                    data,
                                    callback);
                        };

                        service.getResource = function (token, id, callback) {
                            SettingsCall.process(
                                    'resource/get/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.getGraphForID = function (token, id, callback) {
                            SettingsCall.process(
                                    'graph/get/data/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.getAllGraphs = function (token, callback) {
                            SettingsCall.process(
                                    'graph/all/data?access_token=' + token,
                                    null,
                                    callback);
                        };

                        return service;
                    }]);