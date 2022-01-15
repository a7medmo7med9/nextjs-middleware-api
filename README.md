nextjs-middleware-api
======

simple nextjs middleware for api routes

## Description

`nextjs-middleware-api` gives you a simple way to add custom middleware functions or using npm middleware 

like `cors` and `express-rate-limit` and `cookie-parser` and ...more

## Install

```console
$ npm install nextjs-middleware-api
```

## Usage with custom middleware

Simple usage with nextjs api route.

`/pages/api/account` route example

```javascript
// import package
import NextMiddleware from 'nextjs-middleware-api'

// import your cutom middleware
import Auth from './customMiddleware/auth'

// add your custom middleware and callback function
export default NextMiddleware(Auth, (req, res) => {
    res.send("Hello mr " + req.username)
})
```

`/middleware/auth.js` custom middleware file

```javascript
// you can catch [req, res, next] to handle your custom middleware function
function Auth(req, res, next) {
    // 1- get token from [req]
    // 2- check token validation
    // 3- return response

    // dummy example
    // if token is valid return next() function
    if (1 == 1) 
    {
        // do your work
        req.username = "John Doe";
        
        // after you finish just return next() to continue to the next middleware if exist or your final callback function
        next();
    }
    else
    {
        // if token not valid for some reason return your custom error message with custom status code
        res.status(404).send({ success: false, message: 'username or password is wrong' });
    }
}

export default Auth;
```

## Usage with npm middleware packages like `cors`

you can add cors to middleware by just pass `cors` like this

```javascript
// import package
import NextMiddleware from 'nextjs-middleware-api'

// import your cutom middleware
import Auth from './customMiddleware/auth'
import Validation from './customMiddleware/validation'

// import third party packages like cors
import cors from 'cors'

// using the middleware like
const usingCors = cors({
    origin: 'http://example.com', // add your domain or use "*" to accept all origins
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    // ... more cors options
})

export default NextMiddleware(usingCors, Auth, Validation, (req, res) => {
    res.send("Hello mr " + req.username)
})
```
you can add more packages with the same way


## How to allow only selected methods

use can allow methods like `POST` or `GET` or `Delete` or any other type of method by just pass `allowedMethods` inside `object` like this

```javascript
// import package
import NextMiddleware from 'nextjs-middleware-api'

// import your cutom middleware
import Auth from './customMiddleware/auth'
import Validation from './customMiddleware/validation'
import IsAdmin from './customMiddleware/isAdmin'

var customOptions = {
    allowedMethods: ["POST", "get", "DelEtE"], // not case sensitive
}

export default NextMiddleware(customOptions, Auth, Validation, IsAdmin,  (req, res) => {
    if (req.method == "POST") 
    {
        res.send("Request POST method")
    }
    else if (req.method == "GET") 
    {
        res.send("Request GET method")
    }
    // final else will be [DELETE] method because there is no fourth option in [allowedMethods] array
    else 
    {
        res.send("Request DELETE method")
    }
})
```

`allowedMethods` must be an array[] of sting

`allowedMethods` not case sensitive you can type `["POST"]` or `["post"]` or `["PoSt"]`

`allowedMethods` will return `404 page not found` for methods not included in array