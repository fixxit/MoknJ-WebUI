var express = require('express');
var app = express();

app.get('/', function (req, res, next) {
    res.sendfile('index.html');
});

/* serves all the static files */
app.get(/^(.+)$/, function (req, res) {
    console.log('static file request : ' + JSON.stringify(req.params));
    res.sendfile(__dirname + req.params[0]);
});

app.post('/', function (req, res, next) {
    // Handle the post for this route
});

var port = process.env.PORT || 80;
app.listen(port, function () {
    console.log("Listening on " + port);
});

