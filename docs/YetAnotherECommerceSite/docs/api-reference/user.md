# User
> Note: All requests for this route require valid auth header
## `AUTH` Request to get all the product IDs along with quantity in the user's cart

```json
{
    "URL": "/user/cart",
    "METHOD" : "GET"
}

```

returns the list of product, quantity and corresponding details

```js
response.body = {
    "success" : "boolean",
    "payload": {
        {
            "productId": "number",
            "quantity" : "number",
            "name": "string",
            "description": "string",
            "price": "number",
            "images": "string[]",
            "username": "string"
        },
        {
            "productId": "number",
            "quantity" : "number",
            "name": "string",
            "description": "string",
            "price": "number",
            "images": "string[]",
            "username": "string"
        },
        .
        .
        .
    }
}
```

Can raise:

1. `Session Error`, json-web-token is invalid
1. `Authentication Error`, no token found

## `AUTH` Request to find out if the user has a specific product in their cart

```json
{
    "URL": "/user/cart/product/:productId",
    "METHOD" : "GET",
    "TYPES": {
        "productId": "number"
    }
}
```

returns the number in cart

```js
response.body= {
    "success": "boolean",
    "payload": {
        "quantity": "number"
    }
}
```

Can raise:

1. `Type Error`, product id is of incorrect type
1. `Bound Error`, id parameter does not adhere to constraints
1. `Session Error`, json-web-token is invalid
1. `Authentication Error`, no token found

## `AUTH` Request to update the count of product in a users cart

```json
{
    "URL": "/user/cart/product/:id",
    "METHOD" : "POST",
    "BODY": {
        "quantity": "number"
    },
    "TYPES": {
        "id": "number"
    }
}
```

payload of response is empty if succeded, gives `status code: 201`

Can raise:

1. `Type Error`, product id or quantity is of incorrect type
1. `Bound Error`, quantity is negative
1. `Session Error`, json-web-token is invalid
1. `Authentication Error`, no token found

## `AUTH` Request to update user details

```json
{
    "URL": "/user/update",
    "METHOD": "POST",
    "BODY": {
        "firstName": "string",
        "lastName": "string",
        "address": "string",
        "phone": "number",
        "email": "string in email format",
        "profilePhoto": "string"
    }
}
```

Returns `success: true` if the user data was modified along with `status code:200`

Can raise:

1. `Type Error`, any parameter is of incorrect type
1. `Bound Error`, any parameter does not adhere to constraints
1. `Session Error`, json-web-token is invalid
1. `Authentication Error`, no token found

## `AUTH` Request to delete the user's account, all the relevant product listings and reviews are removed

```json
{
    "URL": "/user/remove",
    "METHOD": "DELETE",
    "BODY": {
        "password": "string"
    }
}
```

Returns `success: true` if the user data was deleted and `status code: 200`

Can raise:

1. `Type Error`, password is of incorrect type
1. `Bound Error`, password does not adhere to constraints
1. `Session Error`, json-web-token is invalid
1. `Authentication Error`, no token found