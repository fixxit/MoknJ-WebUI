'use strict';

angular.module('Link')
        .factory('LinkService',
                ['SettingsCall',
                    function (SettingsCall) {
                        var service = {};

                        service.allLinkForAssetId = function (token, id, callback) {
                            SettingsCall.simpleHttpCall(
                                    'link/asset/all/' + id + '/asset?access_token=' + token,
                                    callback);
                        };

                        service.allLinkForResourceId = function (token, id, callback) {
                            SettingsCall.simpleHttpCall(
                                    'link/asset/all/' + id + '/resource?access_token=' + token,
                                    callback);
                        };

                        service.allLink = function (token, callback) {
                            SettingsCall.simpleHttpCall(
                                    'link/asset/all/?access_token=' + token,
                                    callback);
                        };

                        service.getResource = function (token, id, callback) {
                            SettingsCall.simpleHttpCall(
                                    'resource/get/' + id + '?access_token=' + token,
                                    callback);
                        };

                        service.getAsset = function (token, id, callback) {
                            SettingsCall.simpleHttpCall(
                                    'asset/get/' + id + '?access_token=' + token,
                                    callback);
                        };

                        service.getDetail = function (token, id, callback) {
                            SettingsCall.simpleHttpCall(
                                    'type/get/' + id + '?access_token=' + token,
                                    callback);
                        };

                        return service;
                    }]);