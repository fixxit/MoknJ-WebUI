
'use strict';

angular.module('assetGet', [])
        .controller('AssetController', function ($scope, $http) {
            $scope.$watch('search', function () {
                fetch();
            });

            function fetch() {
                $http.get("http://localhost:8080/asset/all")
                        .then(function (response) {
                            $scope.assetDetails = response.data;
                        });
            }

            $scope.select = function () {
                this.setSelectionRange(0, this.value.length);
            }
        });
