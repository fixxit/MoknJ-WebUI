'use strict';

angular.module('Home').directive('globalTypeSearch', function () {
    return {
        restrict: 'EA',
        template: '<input type="text" class="form-control" placeholder="Search here" ng-model="inputValue" />',
        scope: {
            inputValue: '=',
            types: '='
        },
        link: function (scope) {
            scope.$watch('inputValue', function (newValue, oldValue) {
                if (newValue) {
                    if (newValue !== oldValue) {
                        angular.forEach(scope.types, function (type) {
                            type.currentPage = 1;
                        });
                    }
                }
            });
        }
    };
});


angular.module('Home').directive('typeSearch', function () {
    return {
        restrict: 'EA',
        template: '<input type="text" class="form-control" placeholder="Search here" ng-model="inputValue" />',
        scope: {
            inputValue: '=',
            type: '='
        },
        link: function (scope) {
            scope.$watch('inputValue', function (newValue, oldValue) {
                if (newValue) {
                    if (newValue !== oldValue) {
                        scope.type.currentPage = 1;
                    }
                }
            });
        }
    };
});