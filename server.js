var express = require('express');
var favicon = require('serve-favicon');
var uglify = require("uglify-js");
var fs = require('fs');
var app = express();

var min_options = {
    mangle: false,
    compress: {
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: true
    }
}
// =============================================================================
// ============================== Core Minify ==================================
// =============================================================================
// authentication
var authentication_min_js = uglify.minify([
    __dirname + '/modules/authentication/services.js',
    __dirname + '/modules/authentication/controllers.js'
], min_options);

// Home 
var home_min_js = uglify.minify([
    __dirname + '/modules/home/services.js',
    __dirname + '/modules/home/controllers.js',
    __dirname + '/modules/home/filters/filters.js',
    __dirname + '/modules/home/directives/directives.js'
], min_options);

// Menu 
var menu_min_js = uglify.minify([
    __dirname + '/modules/menu/services.js',
    __dirname + '/modules/menu/controllers.js',
    __dirname + '/modules/menu/modals/modals.js',
    __dirname + '/modules/menu/filters/filters.js',
    __dirname + '/modules/menu/directives/directives.js'
], min_options);

// Template
var template_min_js = uglify.minify([
    __dirname + '/modules/template/type/services.js',
    __dirname + '/modules/template/type/controllers.js',
    __dirname + '/modules/template/type/modals/modals.js',
    __dirname + '/modules/template/hidden/controllers.js'
], min_options);

// User
var user_min_js = uglify.minify([
    __dirname + '/modules/user/services.js',
    __dirname + '/modules/user/controllers.js'
], min_options);

// Authentication min file
fs.writeFile(
        __dirname + '/modules/authentication/min/authentication.min.js',
        authentication_min_js.code,
        function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Script generated and saved:", 'authentication.min.js');
            }
        }
);

// Home min file
fs.writeFile(
        __dirname + '/modules/home/min/home.min.js',
        home_min_js.code,
        function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Script generated and saved:", 'home.min.js');
            }
        }
);

// Menu min file
fs.writeFile(
        __dirname + '/modules/menu/min/menu.min.js',
        menu_min_js.code,
        function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Script generated and saved:", 'menu.min.js');
            }
        }
);

// Template min file
fs.writeFile(
        __dirname + '/modules/template/min/template.min.js',
        template_min_js.code,
        function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Script generated and saved:", 'template.min.js');
            }
        }
);

// User min file
fs.writeFile(
        __dirname + '/modules/user/min/user.min.js',
        user_min_js.code,
        function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Script generated and saved:", 'user.min.js');
            }
        }
);
// =============================================================================
// ============================== Modules Minify ===============================
// =============================================================================
// Asset Module
var asset_min_js = uglify.minify([
    __dirname + '/modules/templatetypes/asset/assign/controllers.js',
    __dirname + '/modules/templatetypes/asset/delete/controllers.js',
    __dirname + '/modules/templatetypes/asset/link/services.js',
    __dirname + '/modules/templatetypes/asset/link/controllers.js',
    __dirname + '/modules/templatetypes/asset/new/services.js',
    __dirname + '/modules/templatetypes/asset/new/controllers.js',
    __dirname + '/modules/templatetypes/asset/new/directives/directives.js',
    __dirname + '/modules/templatetypes/asset/unassign/controllers.js',
], min_options);

// Employee Module
var employee_min_js = uglify.minify([
    __dirname + '/modules/templatetypes/employee/new/services.js',
    __dirname + '/modules/templatetypes/employee/new/controllers.js',
    __dirname + '/modules/templatetypes/employee/delete/controllers.js',
    __dirname + '/modules/templatetypes/employee/link/controllers.js',
    __dirname + '/modules/templatetypes/employee/link/services.js'
], min_options);


// User min file
fs.writeFile(
        __dirname + '/modules/templatetypes/asset/min/asset.min.js',
        asset_min_js.code,
        function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Script generated and saved:", 'asset.min.js');
            }
        }
);

// Employee min file
fs.writeFile(
        __dirname + '/modules/templatetypes/employee/min/employee.min.js',
        employee_min_js.code,
        function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Script generated and saved:", 'employee.min.js');
            }
        }
);
// =============================================================================
app.use(favicon(__dirname + '/images/favicon.ico'));
app.get('/', function (req, res, next) {
    console.log("Getting home page : " + __dirname + '/index.html');
    res.sendFile(__dirname + '/index.html');
});

/* serves all the static files */
app.get(/^(.+)$/, function (req, res) {
    console.log('static file request : ' + JSON.stringify(req.params));
    res.sendFile(__dirname + req.params[0]);
});

app.post('/', function (req, res, next) {
    // Handle the post for this route
});

var port = process.env.PORT || 80;
app.listen(port, function () {
    console.log("Listening on " + port);
});

