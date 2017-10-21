'use strict';
// declare modules
angular.module('Authentication', ['ui.bootstrap']);
angular.module('Home', ['ui.bootstrap', 'ngAnimate', 'chart.js']);
angular.module('Menu', ['ui.bootstrap', 'ngAnimate']);
angular.module('Type', ['ui.bootstrap', 'ngAnimate']);
angular.module('Asset', ['ui.bootstrap', 'ngAnimate']);
angular.module('Link', ['ui.bootstrap', 'ngAnimate']);
angular.module('Employee', ['ui.bootstrap', 'ngAnimate']);
angular.module('EmployeeLink', ['ui.bootstrap', 'ngAnimate']);
angular.module('User', ['ui.bootstrap', 'ngAnimate']);
angular.module('Graph', ['ui.bootstrap', 'ngAnimate']);
angular.module('Template', ['ui.bootstrap', 'ngAnimate']);
angular.module('Settings', []);
// new modles copme here
angular.module('Moknj', [
    'Authentication',
    'Home',
    'Menu',
    'Type',
    'Asset',
    'Employee',
    'EmployeeLink',
    'User',
    'Graph',
    'Link',
    'Settings',
    'Template',
    'ngRoute',
    'ngCookies'
]).config(['$routeProvider', function ($routeProvider) {
        // new controllers are instantiated here to the include!
        $routeProvider
                .when('/login', {
                    controller: 'LoginController',
                    templateUrl: 'modules/authentication/views/login.html',
                    hideMenus: true
                })

                .when('/home', {
                    controller: 'HomeController',
                    templateUrl: 'modules/home/views/home.html'
                })

                .when('/menu', {
                    controller: 'MenuController',
                    templateUrl: 'modules/menu/views/menu.html'
                })

                .when('/type', {
                    controller: 'TypeController',
                    templateUrl: 'modules/template/type/views/type.html'
                })

                .when('/hidden_template', {
                    controller: 'TemplateController',
                    templateUrl: 'modules/template/hidden/views/template.html'
                })

                .when('/user', {
                    controller: 'UserController',
                    templateUrl: 'modules/user/views/user.html'
                })

                .when('/graph', {
                    controller: 'GraphController',
                    templateUrl: 'modules/graph/views/graph.html'
                })

                .when('/link', {
                    controller: 'LinkController',
                    templateUrl: 'modules/templatetypes/asset/link/views/link.html'
                })

                .when('/employee_link', {
                    controller: 'EmployeeLinkController',
                    templateUrl: 'modules/templatetypes/employee/link/views/link.html'
                })

                .when('/asset', {
                    controller: 'AssetController',
                    templateUrl: 'modules/templatetypes/asset/new/views/asset.html'
                })

                .when('/employee', {
                    controller: 'EmployeeController',
                    templateUrl: 'modules/templatetypes/employee/new/views/employee.html'
                })

                .otherwise({redirectTo: '/login'});
    }]).run(['$rootScope', '$location', '$cookieStore', '$http', 'AuthenticationService',
    function ($rootScope, $location, $cookieStore, $http, AuthenticationService) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' +
                    $rootScope.globals.currentUser.authdata;
        }

        $rootScope.$on('$locationChangeStart', function () {
            // redirect to login page if not logged in
            if ($location.path() === '/login') {
                AuthenticationService.ClearCredentials();
            }
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
        });
    }]);

