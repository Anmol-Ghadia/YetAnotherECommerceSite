# Review
## Return all reviews for specific product
```json
{
    "URL": "/review/product/:productId",
    "METHOD" : "GET",
    "TYPES": {
        "productId": "number"
    }
}
```

returns all the reviews in the following format

```js
response.body = {
    "success" : "boolean",
    "payload" : {
        {
            "title": "string",
            "description": "string",
            "rating": "number",
            "username": "string"
        },
        {
            "title": "string",
            "description": "string",
            "rating": "number",
            "username": "string"
        },
        .
        .
        .
    }
}
```

Returns `status code: 200` on success, otherwise `400` due to below errors

Can raise:

1. `Type Error`, product id is of incorrect type
1. `Bound Error`, id parameter does not adhere to constraints

## Returns the summary of reviews for a product
```json
{
    "URL": "/review/product/stats/:productId",
    "METHOD" : "GET",
    "TYPES": {
        "productId": "number"
    }
}
```

returns the average rating and number of reviews for the product

```js
response.body = {
    "success" : "boolean",
    "payload" : {
        "rating": "number",
        "count" : "number"
    }
}
```

returns `status code: 200` if success, otherwise `400` due to below errors 

Can raise:

1. `Type Error`, product id is of incorrect type
1. `Bound Error`, id parameter does not adhere to constraints

> where count is the number of reviews and rating is the average rating for the product in the range `[0,5]` with step values of `0.5`.
## `AUTH` Return all reviews of a user

```json
{
    "URL": "/review/user/all",
    "METHOD" : "GET"
}
```

returns all the reviews of the user in the following format

```js
response.body = {
    "success" : "boolean",
    "payload" : {
        {
            "title": "string",
            "description": "string",
            "rating": "number",
            "productId": "number"
        },
        {
            "title": "string",
            "description": "string",
            "rating": "number",
            "productId": "number"
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

## `AUTH` Adds a new review

```json
{
    "URL": "/review/:productId",
    "METHOD": "POST",
    "BODY": {
        "title": "string",
        "description": "string",
        "rating": "number"
    },
    "TYPES": {
        "productId": "number"
    }
}

```

returns `201` if created and success is truthy

Can raise:

1. `Type Error`, any parameter is of incorrect type
1. `Bound Error`, any parameter does not adhere to constraints
1. `Session Error`, json-web-token is invalid
1. `Authentication Error`, no token found
1. `General Error`, if the product review already exists

Adds the user as the owner of the review if success

## `AUTH` Updates an existing review

```json
{
    "URL": "/review/:productId",
    "METHOD": "PATCH",
    "BODY": {
        "title": "string",
        "description": "string",
        "rating": "number"
    },
    "TYPES": {
        "productId": "number"
    }
}

```

Can raise:

1. `Type Error`, any parameter is of incorrect type
1. `Bound Error`, any parameter does not adhere to constraints
1. `Session Error`, json-web-token is invalid
1. `Authentication Error`, no token found
1. `General Error`, if the product review does not exists

## `AUTH` Deletes a review

```json
{
    "URL": "/review/:productId",
    "METHOD": "DELETE",
    "TYPES": {
        "productId": "number"
    }
}
```

Can raise:

1. `Type Error`, id parameter is of incorrect type
1. `Bound Error`, id parameter does not adhere to constraints
1. `Authentication Error`, no token found
1. `Session Error`, json-web-token is invalid
1. `General Error`, if the product review does not exists