'use strict';

angular.module('Employee')
        .factory('EmployeeService',
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
                                    'employee/get/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.save = function (token, id, data, callback) {
                            SettingsCall.process(
                                    'employee/add/' + id + '?access_token=' + token,
                                    data,
                                    callback);
                        };

                        service.allResources = function (token, callback) {
                            SettingsCall.process(
                                    'resource/get/employee/all?access_token=' + token,
                                    null,
                                    callback);
                        };

                        return service;
                    }]);