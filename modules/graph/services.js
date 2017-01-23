'use strict';

angular.module('Graph')
        .factory('GraphService',
                ['SettingsCall', 'MenuService', 'TypeService',
                    function (SettingsCall, MenuService, TypeService) {
                        var service = {};

                        service.getAllMenus = function (token, callback) {
                            MenuService.getAllMenus(token, callback);
                        };

                        service.getAllTemplates = function (token, callback) {
                            MenuService.getAllTypes(token, callback);
                        };

                        service.getTempFields = function (token, id, callback) {
                            TypeService.getTemplateFields(token, id, callback);
                        };

                        service.getTempDateFields = function (token, id, callback) {
                            TypeService.getTemplateDateFields(token, id, callback);
                        };

                        service.getGraphTypes = function (token, callback) {
                            SettingsCall.process(
                                    'graph/types?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.saveGraph = function (token, graph, callback) {
                            SettingsCall.process(
                                    'graph/add?access_token=' + token,
                                    graph,
                                    callback);
                        };

                        service.getAllSavedGraphs = function (token, callback) {
                            SettingsCall.process(
                                    'graph/all/saved?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.getGraphViews = function (token, callback) {
                            SettingsCall.process(
                                    'graph/views?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.getGraphFocuses = function (token, id, callback) {
                            SettingsCall.process(
                                    'graph/focus/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.getGraphDateTypes = function (token, id, callback) {
                            SettingsCall.process(
                                    'graph/datetypes/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.deleteGraph = function (token, id, callback) {
                            SettingsCall.process(
                                    'graph/delete/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        return service;
                    }]);