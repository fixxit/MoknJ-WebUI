'use strict';

angular.module('Menu').directive('searchMenus', function () {
    return {
        restrict: 'EA',
        template: '<input type="text" class="form-control" placeholder="Search here" ng-model="inputValue" />',
        scope: {
            inputValue: '=',
            pageValue: '='
        },
        link: function (scope) {
            scope.$watch('inputValue', function (newValue, oldValue) {
                if (newValue) {
                    if (newValue !== oldValue) {
                        scope.pageValue.currentPage = 1;
                    }
                }
            });
        }
    };
});