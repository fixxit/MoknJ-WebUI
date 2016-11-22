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

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 80,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
	
app.listen(port,ip);

console.log('Server running on http://%s:%s', ip, port);

