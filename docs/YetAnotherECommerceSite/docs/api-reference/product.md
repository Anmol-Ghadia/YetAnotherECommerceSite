### Product Queries
## Get single product by ID:
```json
{
    "URL": "/product/:productId",
    "METHOD": "GET",
    "TYPES": {
        "productId": "number"
    }
}
```
returns all the product details as outlined by the schema, with `status code: 200`
Can raise: 
1. `Type Error` due to incorrect id
1. `Bound Error`, id parameter does not adhere to constraints
## Get Range of products by ID
```json
{
    "URL": "/product/:startProductId/:endProductId",
    "METHOD" : "GET",
    "TYPES": {
        "startProductId": "number",
        "endProductId": "number"
    }
}
```
returns multiple products, if request is valid then `status code: 200` is returned

Can raise: 
1. `Type Error` due to incorrect startId or endId
1. `Bound Error`, parameters does not adhere to constraints
## `AUTH` Make a new product listing
```json
{
    "URL": "/product/create",
    "METHOD": "POST",
    "BODY": {
        "name": "string",
        "description": "string",
        "price": "number",
        "images": "array of strings"
    }
}
```
returns `status code: 201` and the product id of the newly created product
```js
response.body = {
    "success": "boolean",
    "payload": {
        "productId" : "number"
    }
}
```

the user creating the listing is the owner (which cannot be changed later)
returns success if product is listed

Can raise: 
1. `Type Error` incorrect parameter types
1. `Bound Error` price is below 0
1. `Session Error`, json-web-token is invalid
1. `Authentication Error`
## `AUTH` update product listing
```json
{
    "URL": "/product/update/:productId",
    "METHOD": "POST",
    "BODY": {
        "name": "string",
        "description": "string",
        "price": "number",
        "images": "array of strings"
    },
    "TYPES": {
        "productId": "number"
    }
}
```
returns success if product is updated and `status code:200`
Can raise: 
1. `Type Error` incorrect parameter types
1. `Bound Error` price is below 0
1. `Permission Error`, user is not the owner of product
1. `Session Error`, json-web-token is invalid
1. `Authentication Error`
## `AUTH` remove product listing
```JSON
{
    "URL": "/product/remove/:productId",
    "METHOD": "DELETE",
    "TYPES": {
        "productId": "number"
    }
}
```
returns success if removed
Can raise: 
1. `Type Error` incorrect type of id
1. `Bound Error`, id parameter does not adhere to constraints
1. `Permission Error`, user is not the owner of product
1. `Session Error`, json-web-token is invalid
1. `Authentication Error`
## `AUTH` check if the user is owner of listing
```JSON
{
    "URL": "/product/owner/:productId",
    "METHOD": "GET",
    "TYPES": {
        "productId": "number"
    }
}
```
Contains empty payload, as usual success is true if the authenticated user is the owner
of given product id 
Can raise: 
1. `Type Error` incorrect type of id
1. `Bound Error`, id parameter does not adhere to constraints
1. `Permission Error`, user is not the owner of product
1. `Session Error`, json-web-token is invalid
1. `Authentication Error`