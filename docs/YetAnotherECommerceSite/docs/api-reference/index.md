# REST API

Every response will be in the following format:
```json
{
    "success": "boolean",
    "payload": {
        // Access point specific data
    }
}
```
The `success` parameter will always be present,  It will also be equal to true if the request was processed succesfully. If the request failed for any reason, `payload` will always contain `message` parameter giving a short description of the error

All the authorized routes(highlighted with `AUTH` tag) should be made with authorization header containing a valid Json-Web-Token. 

Some variables may be encoded in the URL path. These are represneted below as `/product/:id` where the colon before id(`:id`) represents an string can be placed in place of id. The data type is also specified for each variable. not adhering to these types will result in `Type incorrect` response

> `Note:` All the URLS are preceded by `/api-v1` route.

Types of Error Messages and their meaning:

1. `Type Error`, the type of argument is incorrect
1. `Bound Error`, arguments are out of bounds
1. `Permission Error`, the resource is inaccessible with current json-web-token, (responds with `403`)
1. `Session Error`, json-web-token is invalid
1. `Authentication Error`, no token found
1. `General Error`, api end point specific error, payload will contain `description` explaining the error

When an error occurs, success will be false and message inside the payload will contain type of error.
```js
errorResponse.body = {
    "success": false,
    "payload": {
        "message" : "Type of error"
    }
}
```

## Notes on API

1) Any request can send `Internal Error (CODE)`, where CODE refers to an internal error code for debugging purposes only
1) Any request that might return 0 documents will still contain `success=true`
1) Any request that does not adhere to the given specification bellow results in `status code:400`, successful requests have either of the following status codes: `200`, `201`, `202`
