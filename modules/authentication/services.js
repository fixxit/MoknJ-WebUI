'use strict';

angular.module('Authentication')
        .factory('ApiAuthenticationCall',
                ['$http', 'Base64',
                    function ($http) {
                        var service = {};
                        service.process = function (url, callback) {
                            $http({
                                method: 'POST',
                                url: "/api",
                                headers: {
                                    'apiUrl': url,
                                    'Content-Type': 'application/json'
                                }
                            }).success(function (response) {
                                callback(response);
                            }).error(function (response) {
                                callback(response);
                            });
                        };

                        return service;
                    }]);

angular.module('Authentication')
        .factory('AuthenticationService',
                ['Base64', '$http', '$cookieStore', '$rootScope', 'ApiAuthenticationCall',
                    function (Base64, $http, $cookieStore, $rootScope, ApiAuthenticationCall) {
                        var service = {};
                        // SETS BASIC AUTH PARMS                 
                        service.Login = function (username, password, callback) {
                            ApiAuthenticationCall.process(
                                    'oauth/token?grant_type=password&username=' + username + '&password=' + password,
                                    callback);
                        };

                        service.SetCredentials = function (username, password, access_token,
                                refresh_token, expires_in) {
                            var now = new Date();
                            var expiresValue = new Date(now);
                            expiresValue.setSeconds(now.getSeconds() + expires_in);

                            $rootScope.globals = {
                                currentUser: {
                                    username: username,
                                    password: password,
                                    access_token: access_token,
                                    refresh_token: refresh_token,
                                    expires_in: expiresValue.getTime(),
                                    authdata: Base64.encode($rootScope.auth_user + ':' + $rootScope.auth_psw)
                                }
                            };

                            $cookieStore.put('globals', $rootScope.globals, {'expires': expiresValue});
                            $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode($rootScope.auth_user + ':' + $rootScope.auth_psw);
                        };

                        service.ClearCredentials = function () {
                            $rootScope.globals = {};
                            $cookieStore.remove('globals');
                            $http.defaults.headers.common.Authorization = 'Basic ';
                        };

                        return service;
                    }])

        .factory('Base64', function () {
            var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

            return {
                encode: function (input) {
                    var output = "";
                    var chr1, chr2, chr3 = "";
                    var enc1, enc2, enc3, enc4 = "";
                    var i = 0;

                    do {
                        chr1 = input.charCodeAt(i++);
                        chr2 = input.charCodeAt(i++);
                        chr3 = input.charCodeAt(i++);

                        enc1 = chr1 >> 2;
                        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                        enc4 = chr3 & 63;

                        if (isNaN(chr2)) {
                            enc3 = enc4 = 64;
                        } else if (isNaN(chr3)) {
                            enc4 = 64;
                        }

                        output = output +
                                keyStr.charAt(enc1) +
                                keyStr.charAt(enc2) +
                                keyStr.charAt(enc3) +
                                keyStr.charAt(enc4);
                        chr1 = chr2 = chr3 = "";
                        enc1 = enc2 = enc3 = enc4 = "";
                    } while (i < input.length);

                    return output;
                },
                decode: function (input) {
                    var output = "";
                    var chr1, chr2, chr3 = "";
                    var enc1, enc2, enc3, enc4 = "";
                    var i = 0;

                    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
                    var base64test = /[^A-Za-z0-9\+\/\=]/g;
                    if (base64test.exec(input)) {
                        window.alert("There were invalid base64 characters in the input text.\n" +
                                "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                                "Expect errors in decoding.");
                    }
                    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                    do {
                        enc1 = keyStr.indexOf(input.charAt(i++));
                        enc2 = keyStr.indexOf(input.charAt(i++));
                        enc3 = keyStr.indexOf(input.charAt(i++));
                        enc4 = keyStr.indexOf(input.charAt(i++));

                        chr1 = (enc1 << 2) | (enc2 >> 4);
                        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                        chr3 = ((enc3 & 3) << 6) | enc4;

                        output = output + String.fromCharCode(chr1);

                        if (enc3 != 64) {
                            output = output + String.fromCharCode(chr2);
                        }
                        if (enc4 != 64) {
                            output = output + String.fromCharCode(chr3);
                        }

                        chr1 = chr2 = chr3 = "";
                        enc1 = enc2 = enc3 = enc4 = "";

                    } while (i < input.length);

                    return output;
                }
            };
        });