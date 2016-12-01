'use strict';

angular.module('Home').filter('filterAssetMultiple', ['$filter', function ($filter) {
        return function (items, values, type) {
            if (values && Array === values.constructor) {
                var results = items;
                angular.forEach(values, function (value) {
                    if (value) {
                        if (items && Array === items.constructor) {
                            results = $filter('filter')(results, value);
                        }
                    }
                });

                if (items && Array === items.constructor) {
                    if (values && Array === values.constructor) {
                        type.searchSize = results.length;
                        var checkedOut = 0;
                        angular.forEach(results, function (result) {
                            var linked = result.linkedResource;
                            if (linked
                                    && linked !== 'unassigned'
                                    && linked !== 'employee deleted') {
                                checkedOut = checkedOut + 1;
                            }
                        });
                        type.checkedOut = checkedOut;
                        type.checkedIn = type.searchSize - checkedOut;
                        items = results.slice(
                                ((type.currentPage - 1) * type.itemsPerPage),
                                ((type.currentPage) * type.itemsPerPage)
                                );
                    }
                }
            }
            return items;
        };
    }]);


angular.module('Home').filter('filterResources', ['$filter', function ($filter) {
        return function (items, values, pagination) {
            if (values && Array === values.constructor) {
                var results = items;
                angular.forEach(values, function (value) {
                    if (value) {
                        if (items && Array === items.constructor) {
                            results = $filter('filter')(results, value);
                        }
                    }
                });

                if (items && Array === items.constructor) {
                    if (values && Array === values.constructor) {
                        pagination.searchSize = results.length;
                        items = results.slice(
                                ((pagination.currentPage - 1) * pagination.itemsPerPage),
                                ((pagination.currentPage) * pagination.itemsPerPage)
                                );
                    }
                }
            }
            return items;
        };
    }]);

