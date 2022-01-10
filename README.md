nextjs-middleware-api
======

simple nextjs middleware for api routes

## Description

`nextjs-middleware-api` gives you a simple way to add custom middleware functions

## Install

```console
$ npm install nextjs-middleware-api
```

## Usage with simple middleware

Simple usage with nextjs api route.

`/pages/api/hello` route example

```javascript
import NextMiddleware from 'nextjs-middleware-api'
import Auth from './middleware/auth'

export default NextMiddleware(Auth, (req, res) => {
    res.send("Hello mr " + req.user.username)
})
```

`/middleware/auth.js` file

```javascript
function Auth(req, res, next, stop) {
    // 1- get token from [req]
    // 2- check token validation
    // 3- return response

    // if token is valid return next() function
    if (1 == 1) 
    {
        // return next() to continue to the next middleware or final callback function
        req.username = "John Doe";
        next();
    }
    else
    {
        // if token not valid for some reason return your custom error message with custom status code
        res.status(404).send({ success: false, message: 'username or password is wrong' });
        // then call stop() to stop next middleware from runing
        stop();
    }
}

export default Auth;
```

## Usage with cors

you can add cors to middleware by just pass object with cors options

```javascript
import NextMiddleware from 'nextjs-middleware-api'

var corsOptions = {
    origin: 'http://example.com',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    // ...
}

export default NextMiddleware(corsOptions, Auth, Validation, isAdmin, (req, res) => {
    res.send("Hello mr " + req.username)
})
```

## How to allow only selected methods

use can allow methods like `POST` or `GET` or `Delete` or any other type of method by just pass `allowedMethods` inside `corsOptions` like

```javascript
import NextMiddleware from 'nextjs-middleware-api'

var corsOptions = {
    allowedMethods: ["POST", "get", "DelEtE"], // not case sensitive
    origin: 'http://example.com',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

export default NextMiddleware(corsOptions, Auth, (req, res) => {
    res.send("Hello mr " + req.username)
})
```

`allowedMethods` must be an array[] of sting

`allowedMethods` not case sensitive you can type `["POST"]` or `["post"]` or `["PoSt"]`

`allowedMethods` will return `404 page not found` for methods not included in array

`allowedMethods` not like `methods` option in cors you can still pass `methods` in cors options normally
```javascript
var corsOptions = {
    allowedMethods: ["POST", "get", "DelEtE"], // custom option
    origin: 'http://example.com', // cors option
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"], // cors option
    optionsSuccessStatus: 200 // cors option
}
```