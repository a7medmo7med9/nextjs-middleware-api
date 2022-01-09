nextjs-middleware-api
======

simple nextjs middleware for api routes

## Description

`nextjs-middleware-api` gives you a simple way to add custom middleware functions

## Install

```console
$ npm install nextjs-middleware-api
```

## Usage

Simple usage with nextjs api route.

1 - `/pages/api/hello` route example

```javascript
import middlewareHandler from 'nextjs-middleware-api'

export default async function handler(req, res) 
{
  if (!await middlewareHandler(
    [
      () => allowRequestMethods(["POST", "GET"], req, res),
      () => Auth(req, res),
    ]
  )) return;

  res.status(200).json({ name: 'John Doe' })
}
```

add custom middleware function to allow only `GET`, `POST` request `allowRequestMethods`

```javascript
const allowRequestMethods = (allowMethods, req, res) => new Promise((resolve, reject) =>
{
    if (allowMethods.includes(req.method)) 
    {
        return resolve();
    }
    else
    {
        res.status(404).send();
        return reject();
    }
})

export default allowRequestMethods
```

add custom auth middleware `Auth`

```javascript
const Auth = (req, res) => new Promise(async (resolve, reject) =>
{
    // Check for token 
    // return resolve if token ok
    // return reject
    if (1 == 1) 
    {
        resolve();
    }
    else
    {
        res.status(401).send({ message: 'login first' });
        reject();
    }
})

export default Auth;
```