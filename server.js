var express = require('express');
var app = express();
var favicon = require('serve-favicon');

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

