# miscellaneous
## returns the user's first and last name

```json
{
    "URL": "/misc/user/:username",
    "METHOD" : "GET",
    "TYPES": {
        "username": "string"
    }
}
```

returns the first and last name as payload if success

```js
response.body= {
    "success": "boolean",
    "payload": {
        "firstName": "string"
        "lastName": "string"
    }
}
```

Can raise:

1. `Type Error`, username is of incorrect type
1. `Bound Error`, username does not adhere to constraints

## get items based on search

maxPrice is ignored if it is equal to 0

```json
{
    "URL": "/misc/search",
    "METHOD" : "POST",
    "BODY": {
        "minPrice" : "number",
        "maxPrice" : "number",
        "quantity" : "number",
        "search" : "string"
    }
}
```

returns products based on search parameters

```js
response.body= {
    "success": "boolean",
    "payload": {
        {
            "productId": "number";
            "name": "string";
            "description": "string";
            "price": "number";
            "images": "array of strings",
            "username": "string"
        },
        {
            "productId": "number";
            "name": "string";
            "description": "string";
            "price": "number";
            "images": "array of strings",
            "username": "string"
        },
        .
        .
        .
    }
}
```

Can raise:

1. `Type Error`, any parameter are of incorrect type
1. `Bound Error`, any parameter does not adhere to constraints