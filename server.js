/* global __dirname */
var express = require('express');
var favicon = require('serve-favicon');
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();
var path = require('path');
var http = require('http');
var settings = require('./settings.json');
var port = process.env.PORT || settings.gui_port;
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(favicon(__dirname + '/images/favicon.ico'));
// when localhost is called always route to index..
app.get('/', (req, res, next) => {
    console.log('all gets : ' + JSON.stringify(req.params));
    console.log("Getting home page : " + __dirname + '/index.html');
    res.sendFile(__dirname + '/index.html');
});
//Routes all api calls to happen on the server which then executes the call to api
router.post('/', (req, res) => {
    const basicAuth = new Buffer(settings.auth_user + ':' + settings.auth_psw).toString('base64');
    console.log(`request header: ${JSON.stringify(req.headers)}`);
    console.log(`all post: ${JSON.stringify(req.body)}`);
    console.log(`basicAuth: ${basicAuth}`);
    console.log(`request url: ${settings.api_path + req.headers.apiurl}`);
    // server api request options
    const options = {
        host: settings.api_url,
        port: settings.api_port,
        path: settings.api_path + req.headers.apiurl,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + basicAuth
        }
    };
    // execute request to api
    const request = http.request(options, (response) => {
        console.log(`response status: ${response.statusCode}`);
        console.log(`response headers: ${JSON.stringify(response.headers)}`);
        response.setEncoding('utf8');
        // write response to req-res
        response.on('data', (body) => {
            console.log(body);
            res.send(body);
        });
        response.on('end', () => {
            console.log('No more data in response.');
        });
    });
    // write error to reponse 
    request.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
        res.send(e);
    });
    // write data to request body
    request.write(JSON.stringify(req.body));
    request.end();
});
// REGISTER OUR STATIC ROUTES
app.use('/node_modules', express.static(path.join(__dirname + '/node_modules')));
app.use('/scripts', express.static(path.join(__dirname + '/scripts')));
app.use('/modules', express.static(path.join(__dirname + '/modules')));
app.use('/stylesheet', express.static(path.join(__dirname + '/stylesheet')));
app.use('/images', express.static(path.join(__dirname + '/images')));
// all of our routes will be prefixed with /api
app.use('/api', router);
app.listen(port, () => {
    console.log("Listening on " + port);
});
