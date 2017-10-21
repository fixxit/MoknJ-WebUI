'use strict';

angular.module('Menu').directive('searchMenus', () => {
    return {
        restrict: 'EA',
        template: '<input type="text" class="form-control" placeholder="Search here" ng-model="inputValue" />',
        scope: {
            inputValue: '=',
            pageValue: '='
        },
        link: (scope) => {
            scope.$watch('inputValue', (newValue, oldValue) => {
                if (newValue) {
                    if (newValue !== oldValue) {
                        scope.pageValue.currentPage = 1;
                    }
                }
            });
        }
    };
});
