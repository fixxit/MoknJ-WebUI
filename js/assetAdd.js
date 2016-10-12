'use strict';

angular.module('addAsset', [])
    .controller('AddAssetController', function ($scope, $http) {
        $scope.asset = {
            name: '',
            description: '',
            price: 0,
            purchaseDate: ''
        };
        $scope.submitForm = function () {
            console.log($scope.asset)

            $http({
                method: 'POST',
                url: 'http://localhost:8080/addAsset',
                data: JSON.stringify($scope.asset), 
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function (response) {
                console.log("success response : " + JSON.stringify(response));
            }).error(function (response){
                console.log("fail response : " + JSON.stringify($scope.asset));
                console.log("fail response : " + JSON.stringify(response));
            });
        }
    });