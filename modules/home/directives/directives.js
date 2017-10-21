'use strict';

angular.module('Home').directive('globalTypeSearch', () => {
    return {
        restrict: 'EA',
        template: '<input type="text" class="form-control" placeholder="Search here" ng-model="inputValue" />',
        scope: {
            inputValue: '=',
            types: '='
        },
        link: (scope) => {
            scope.$watch('inputValue', (newValue, oldValue) => {
                if (newValue) {
                    if (newValue !== oldValue) {
                        angular.forEach(scope.types, (type) => {
                            type.currentPage = 1;
                        });
                    }
                }
            });
        }
    };
});


angular.module('Home').directive('typeSearch', () => {
    return {
        restrict: 'EA',
        template: '<input type="text" class="form-control" placeholder="Search here" ng-model="inputValue" />',
        scope: {
            inputValue: '=',
            type: '='
        },
        link: (scope) => {
            scope.$watch('inputValue', (newValue, oldValue) => {
                if (newValue) {
                    if (newValue !== oldValue) {
                        scope.type.currentPage = 1;
                    }
                }
            });
        }
    };
});