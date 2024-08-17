# Authentication
## Request to generate a json-web-token for a user,

assuming the username is unique and both details satisfy with the schema

```json
{
    "URL": "/auth/login",
    "METHOD" : "POST",
    "BODY": {
        "username": "string",
        "password": "string"
    }
}
```

Returns the following token if success

```js
response.body = {
    "success": "boolean",
    "payload": {
        "token": "string",
        "validity": "number",
        "user": {
            "username": "string",
            "firstName": "string",
            "lastName": "string",
            "address": "string",
            "phone": "number",
            "email": "string in email format",
            "profilePhoto": "string"
        }
    }
}
```

Returns `status code: 202` if login credentials are valid

`Note:` Bearer keyword is not present in the generated token. Make sure that authorization header conatins the Bearer keyword followed by a space and then the token

Can raise: 

1. `Type Error` incorrect type of username or password
1. `Bound Error`, username and password does not adhere to constraints 
1. `General Error`, for example username or password incorrect

## Request to register a new user

```json
{
    "URL": "/auth/register",
    "METHOD": "POST",
    "BODY": {
        "username": "string",
        "password": "string",
        "firstName": "string",
        "lastName": "string",
        "address": "string",
        "phone": "number",
        "email": "string in email format",
        "profilePhoto": "string"
    }
}
```

Returns `status code: 201` if registration is successful

Returns `success: true` if the user was registered

Can raise: 

1. `Type Error` incorrect type of any parameter
1. `Bound Error`, any parameter does not adhere to constraints
1. `General Error`, if the username is taken

## `AUTH` To verify if a token is valid, include it in the authorization header

```json
{
    "URL": "/auth/verify",
    "METHOD" : "GET"
}
```

returns `status code: 200` along with `success: true` if valid

Can raise:

1. `Session Error`, json-web-token is invalid
1. `Authentication Error`, no token found