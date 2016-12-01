'use strict';

angular.module('Menu').filter('filterMenus', ['$filter', function ($filter) {
        return function (items, value, pagination) {

            var results = items;
            if (value) {
                results = $filter('filter')(results, value);
            }
            pagination.searchSize = results.length;
            items = results.slice(
                    ((pagination.currentPage - 1) * pagination.itemsPerPage),
                    ((pagination.currentPage) * pagination.itemsPerPage)
                    );

            return items;
        };
    }]);