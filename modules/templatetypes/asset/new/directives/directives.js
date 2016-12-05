'use strict';

angular.module('Asset').directive('moneyOnlyInput', function () {
    return {
        restrict: 'EA',
        template: '<input name="{{inputName}}" ng-model="inputValue" class="form-control" />',
        scope: {
            inputValue: '=',
            inputName: '='
        },
        link: function (scope) {
            scope.$watch('inputValue', function (newValue, oldValue) {
                if (newValue) {
                    var arr = String(newValue).split("");
                    if (arr.length === 0)
                        return;
                    if (arr.length === 1 && (arr[0] === '-' || arr[0] === '.'))
                        return;
                    if (arr.length === 2 && newValue === '-.')
                        return;
                    if (isNaN(newValue)) {
                        if (oldValue) {
                            scope.inputValue = oldValue;
                        } else {
                            scope.inputValue = '';
                        }
                    }
                }
            });
        }
    };
});

angular.module('Asset').directive('moneyOnlyInputRequired', function () {
    return {
        restrict: 'EA',
        template: '<input name="{{inputName}}" ng-model="inputValue" class="form-control" required />',
        scope: {
            inputValue: '=',
            inputName: '='
        },
        link: function (scope) {
            scope.$watch('inputValue', function (newValue, oldValue) {
                if (newValue) {
                    var arr = String(newValue).split("");
                    if (arr.length === 0)
                        return;
                    if (arr.length === 1 && (arr[0] === '-' || arr[0] === '.'))
                        return;
                    if (arr.length === 2 && newValue === '-.')
                        return;
                    if (isNaN(newValue)) {
                        if (oldValue) {
                            scope.inputValue = oldValue;
                        } else {
                            scope.inputValue = '';
                        }
                    }
                }
            });
        }
    };
});


angular.module('Asset').directive('numberOnlyInput', function () {
    return {
        restrict: 'EA',
        template: '<input name="{{inputName}}" ng-model="inputValue" class="form-control" />',
        scope: {
            inputValue: '=',
            inputName: '='
        },
        link: function (scope) {
            scope.$watch('inputValue', function (newValue, oldValue) {
                if (newValue) {
                    var arr = String(newValue).split("");
                    if (arr.length === 0) {
                        return;
                    } else if (arr.length === 1 && (arr[0] === '-' || arr[0] === '.')) {
                        return;
                    } else if (arr.length === 2 && newValue === '-.') {
                        return;
                    } else {
                        if (isNaN(newValue)) {
                            if (oldValue) {
                                scope.inputValue = oldValue;
                            } else {
                                scope.inputValue = '';
                            }
                        } else {
                            scope.inputValue = parseInt(Number(newValue));
                        }
                    }
                }
            });
        }
    };
});

angular.module('Asset').directive('numberOnlyInputRequired', function () {
    return {
        restrict: 'EA',
        template: '<input name="{{inputName}}" ng-model="inputValue" class="form-control" required/>',
        scope: {
            inputValue: '=',
            inputName: '='
        },
        link: function (scope) {
            scope.$watch('inputValue', function (newValue, oldValue) {
                if (newValue) {
                    var arr = String(newValue).split("");
                    if (arr.length === 0) {
                        return;
                    } else if (arr.length === 1 && (arr[0] === '-' || arr[0] === '.')) {
                        return;
                    } else if (arr.length === 2 && newValue === '-.') {
                        return;
                    } else {
                        if (isNaN(newValue)) {
                            if (oldValue) {
                                scope.inputValue = oldValue;
                            } else {
                                scope.inputValue = '';
                            }
                        } else {
                            scope.inputValue = parseInt(Number(newValue));
                        }
                    }
                }
            });
        }
    };
});

