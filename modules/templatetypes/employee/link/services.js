'use strict';

angular.module('EmployeeLink')
        .factory('EmployeeLinkService',
                ['SettingsCall',
                    function (SettingsCall) {
                        var service = {};

                        service.allEmployeeLinksForEmployeeId = function (token, id, callback) {
                            SettingsCall.simpleHttpCall(
                                    'link/employee/all/' + id + '/employee?access_token=' + token,
                                    callback);
                        };


                        service.allEmployeeLink = function (token, callback) {
                            SettingsCall.simpleHttpCall(
                                    'link/employee/all?access_token=' + token,
                                    callback);
                        };

                        return service;
                    }]);