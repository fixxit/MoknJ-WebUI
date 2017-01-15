'use strict';

angular.module('Type')
        .factory('TypeService',
                ['SettingsCall',
                    function (SettingsCall) {
                        var service = {};

                        service.save = function (item, token, callback) {
                            SettingsCall.process('type/add?access_token=' + token,
                                    item,
                                    callback);
                        };

                        service.getAllTemplates = function (token, callback) {
                            SettingsCall.process('type/all?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.getFieldTypes = function (token, callback) {
                            SettingsCall.process('type/fields?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.getTemplateTypes = function (token, callback) {
                            SettingsCall.process('type/templates?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.getType = function (token, id, callback) {
                            SettingsCall.process('type/get/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.getTemplateFields = function (token, id, callback) {
                            SettingsCall.process('type/template/dropdown/' + id + '/fields?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.getTemplateDateFields = function (token, id, callback) {
                            SettingsCall.process('type/template/date/' + id + '/fields?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.hidden = function (token, callback) {
                            SettingsCall.process('type/hidden/?access_token=' + token,
                                    null,
                                    callback);

                        };

                        service.unhide = function (token, id, callback) {
                            SettingsCall.process('type/unhide/' + id
                                    + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.delete = function (token, id, callback) {
                            service.deleteTemplate(token, id, true, callback);
                        };

                        service.deleteTemplate = function (token, id, cascade, callback) {
                            SettingsCall.process(
                                    'type/delete/' + id + '?access_token='
                                    + token + '&cascade=' + cascade,
                                    null,
                                    callback);
                        };

                        return service;
                    }]);