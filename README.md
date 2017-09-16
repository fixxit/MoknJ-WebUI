# MoknJ UI #
* This is a Node.js web application. It is only a gui layer so... No connection is made to the mango db :+1: 
* For more info and some fancy screen shots go [MoknJ API Link](https://github.com/fixxit/MoknJ)

![2032.gif](https://github.com/fixxit/MoknJ/blob/master/images/1615879524-2032.gif?raw=true)

# Requirements #
* Node.js (latest)
* npm (latest)

# Technology Stack #
* angular: 1.5.8 
* angular-route: 1.5.8 
* angular-cookies : 1.5.8 
* angular-ui-bootstrap : 0.13.4 
* angular-animate : 1.5.8 
* angular-chart.js : 1.1.1 
* angular-chartjs-directive : 1.0.0 
* express : 4.14.0 
* chart.js : 2.4.0 
* uglify-js : 2.7.5 
* bootstrap : 3.3.1 
* serve-favicon : 2.3.2 

# Setup # 
Main root contains a settings.json file, make sure that it points to your web server instance of moknj api
```
{
    "api_url": "http://localhost:8084/FixxITMoknj/",
    "auth_user": "fixx-trusted-client",
    "auth_psw": "fixx_secret"
}
```
Also note the admin_auth user and auth_psw these should be defined on your server app moknj api (MoknJ/src/main/java/application.yml), make sure they match (security.client, security.secret)

```
environment: 
system:
    db: moknj
    url: localhost
    port: 27017
    username: 
    password: 
admin:
    user: fixxit
    pass: fix!2
security:
    realm: FIXX_OAUTH_REALM
    client: fixx-trusted-client
    secret: fixx_secret
    tokenValiditySeconds: 72000
    refreshTokenValiditySeconds: 72000
    resourceId: fixx_rest_api
```

# Debugging #
Port error 
```
events.js:160
      throw er; // Unhandled 'error' event
      ^

Error: listen EACCES 0.0.0.0:80
```
Main root contains server.js assign new port see below example
```

var port = process.env.PORT || 8087;
app.listen(port, function () {
    console.log("Listening on " + port);
});
```
