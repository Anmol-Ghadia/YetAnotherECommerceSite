# MERN Stack - E-Commerce Site
A simple E-Commerce site that allows user to browse products and
save products to cart if logged in. Allows new users to create an account
and does not need a password, just a code which is sent to email whenever
necessary

Allows filtering of products based on category, searching for products by name
or description. Check out process involves a confirmation and places the order
by default

Allows user to view and update profile

Seller's are also users with special status who can create a product listing

## Search Logic (BrowsePage)
1) When no keywords are supplied
    When no preferences are set, the backend server selects a random product and the next 14 products (15 total) for retrieval. To keep things fresh, the frontend then shuffles these items before displaying them.

    Quantity buttons: then number of items selected after the inital random product is controlled

    Category: **under devlopment**

    Price range: The next items that do not fall in acceptable range are omited by database
1) When keywords are supplied
    Products contain description and name from which keywords are generated and the keywords that are supplied by the user are matched against these product describing keywords. Using a scoring system, the highest scoring are displayed first

    All the filters work the same way but apply only on the items returned by the search method

## Frontend structure
This is a sitemap with corresponding React Component names in round brackets and urls in square brackets

1) Landing Page (LandingPage) [/]
    1) Browse Products (SearchPage) [/browse]
        1) Single Product Page (ProductPage) [/browse/product/:id]
    1) **User Profile** (UserPage) [/user]
        1) **View Cart** (CartPage) [/user/cart]
    1) Authentication Page (AuthPage) [/auth]
        1) Login Page (LoginPage) [index]
        1) Registration Page (RegisterPage) [/auth/register]

> **Bold** pages can only be visited with valid JWT, otherwise redirected

## Backend Structure

1. Initial checks for environment variables are done in `helpers.ts` at top level
1. All routers are contined in routers where the api is divided in sub parts as specified by sub routers
1. Handlers perform checks on received data before passing it to the database
1. All database interactions are contained in `database.ts`

Routes requiring authentication have to go through auth middleware

## Development guide
1) install npm modules
    ```BASH
    cd frontend
    npm install
    cd ..
    cd backend
    npm install
    ```
1) Make .env file and configure the following variables
    ```py
    # .env file inside backend directory
    DB_URI=# Your URI here
    DB_NAME=#Database Name
    PORT=#server's listening port her
    PRODUCT_COLLECTION_NAME=
    USER_COLLECTION_NAME=
    REVIEW_COLLECTION_NAME=
    CART_COLLECTION_NAME=
    JWT_PRIVATE_KEY=#use long and random string
    JWT_SESSION_TIME=#time in seconds for user sessions
    ```
1) compile Typescript files
    ```BASH
    cd backend
    npx tsc -w
    ```
1) Start server
    ```BASH
    node .backend/dist/main.js
    ```
    or
    ```BASH
    cd backend
    npm start
    ```
1) Start React app
    ```BASH
    cd client
    npm start
    ```
    ![DB Draft](https://github.com/Anmol-Ghadia/YetAnotherECommerceSite/assets/47422194/e44b70f6-8980-4840-90a6-733c34cc8120)

## Build Notes:
1) Remove React Strict tags from `index.js`
1) Set Cookie paramaeter `secure: true` in Login.jsx


## TODO
1) Add authentication middleware
1) Add sample data to db
1) Add log detials to text file
1) Update db for cartitem when front end is updated
1) Add middleware for authentication checks
1) Display all cart items in the cart page
1) Display total in the cart page
1) Add a order now option on the cart page
1) Fetch and display reviews on product page
1) Allow user maximum of 1 review per product
1) allow user to edit reviews
1) Show cumulative rating of product
1) Add Date to db for Reviews
1) Allow user to add product listings
1) Allow user to add a maximum of 10 image links for their products
1) Allow user to edit their listing once product is already listed
1) Add frontend checks for registration data
1) Add backend checks for registration data
1) Add notification system for successfull logins and registrations
1) Add more user info on Register page
1) Add support for displaying multiple images on product page
1) Add support for fetching and rendering images on search page
1) Use SASS for styling
1) ~~Rethink API access points~~
1) ~~Add documentation for api~~
1) ~~Migrate from cookies to authorization header for jwt token~~
1) ~~Add support for fetching and rendering images on product page~~
1) ~~Add add-to-cart button on product page~~
1) ~~Product Listing page fetches in a loop~~
1) ~~Update backend to respond in json for Product queries~~
1) ~~Add Product detailed view page~~
1) ~~Add Create Product Listing Page~~
1) ~~If valid token exists then user should be redirected to user home page from login page~~

## Database Schema
Valid Characters for strings include: 
```ts
const validChar = /^[a-zA-Z0-9()_\-,.]*$/;
```
Number of characters allowed in each string are specified as follows
1. (tiny) firstName,LastName => [1-25]
1. (short) username => [5-25]
1. (medium) name (product), title (review), password => [8-25]
1. (long) address ,description (product), description (review) => [10-500]

Special Types
1. email
1. url 

All the ids such as `username`, `productId`, `reviewId` are integers starting from 0 and going above

`phoneNumber` is anywhere from 9 to 12 digits, so [0-9] only

`rating` is number from 0 to 5 with a step value of 0.5. Example: 0, 2, 5, 0.5, 3.5 

1. User
    ```ts
    interface User {
        username:string,
        hash:string,
        firstName: string,
        lastName: string,
        address: string,
        phone: number,
        email: string,
        profilePhoto: string
    }
    ```
1. CartItem
    ```ts
    interface CartItem {
        username: string,
        productId: number,
        quantity: number
    }
    ```
1. Product
    ```ts
    interface Product {
        productId: number;
        name: string;
        description: string;
        price: number;
        images: string[],
        username: string
    }
    ```
1. Review
    ```ts
    interface Review {
        reviewId: number,
        title: string,
        description: string,
        rating: number,
        username: string,
        productId: number
    } 
    ```
## REST API

Every response will be in the following format:
```json
{
    "success": boolean,
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
1. `Permission Error`, the resource is inaccessible with current json-web-token
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
> `Note:` All requests can send `Internal Error (CODE)`, where CODE refers to an internal error code for debugging purposes only
> `Note:` any request that might return 0 documents will still contain `success=true`
### Product Queries
1) Get single product by ID:
    ```json
    {
        "URL": "/product/:productId",
        "METHOD": "GET",
        "TYPES": {
            "productId": "number"
        }
    }
    ```
    returns all the product details as outlined by the schema
    Can raise: 
    1. `Type Error` due to incorrect id
    1. `Bound Error`, id parameter does not adhere to constraints
1) Get Range of products by ID
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
    returns multiple products
    Can raise: 
    1. `Type Error` due to incorrect startId or endId
    1. `Bound Error`, parameters does not adhere to constraints
1) `AUTH` Make a new product listing
    ```json
    {
        "URL": "/product/create",
        "METHOD": "PUT",
        "BODY": {
            "name": "string",
            "description": "string",
            "price": "number",
            "images": "array of strings"
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
1) `AUTH` update product listing
    ```json
    {
        "URL": "/product/update/:id",
        "METHOD": "POST",
        "BODY": {
            "name": "string",
            "description": "string",
            "price": "number",
            "images": "array of strings"
        },
        "TYPES": {
            "id": "number"
        }
    }
    ```
    returns success if product is listed
    Can raise: 
    1. `Type Error` incorrect parameter types
    1. `Bound Error` price is below 0
    1. `Permission Error`, user is not the owner of product
    1. `Session Error`, json-web-token is invalid
    1. `Authentication Error`
1) `AUTH` remove product listing
    ```JSON
    {
        "URL": "/product/remove/:id",
        "METHOD": "DELETE",
        "TYPES": {
            "id": "number"
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
1) `AUTH` check if the user is owner of listing
    ```JSON
    {
        "URL": "/product/isOwner/:id",
        "METHOD": "GET",
        "TYPES": {
            "id": "number"
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

### Authentication related queries
1) Request to generate a json-web-token for a user,
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
    `Note:` Bearer keyword is not present in the generated token. Make sure that authorization header conatins the Bearer keyword followed by a space and then the token
    Can raise: 
    1. `Type Error` incorrect type of username or password
    1. `Bound Error`, username and password does not adhere to constraints 
    1. `General Error`, for example username or password incorrect
1) Request to register a new user
    ```json
    {
        "URL": "/auth/register",
        "METHOD": "PUT",
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
    Returns `success: true` if the user was registered
    Can raise: 
    1. `Type Error` incorrect type of any parameter
    1. `Bound Error`, any parameter does not adhere to constraints
    1. `General Error`, if the username is taken
1) `AUTH` To verify if a token is valid, include it in the authorization header
    ```json
    {
        "URL": "/auth/verify",
        "METHOD" : "GET"
    }
    ```
    returns `success: true` if valid
    Can raise:
    1. `Session Error`, json-web-token is invalid
    1. `Authentication Error`, no token found
### User Related queries (All require valid json-web-token)
1) `AUTH` Request to get all the product IDs along with quantity in the user's cart
    ```json
    {
        "URL": "/user/cart",
        "METHOD" : "GET"
    }
    ```
    returns the list of product and corresponding quantity
    ```js
    response.body = {
        "success" : "boolean",
        "payload": {
            {
                "productId": "number",
                "quantity" : "number"
            },
            {
                "productId": "number",
                "quantity" : "number"
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
1) `AUTH` Request to find out if the user has a specific product in their cart
    ```json
    {
        "URL": "/user/cart/product/:id",
        "METHOD" : "GET",
        "TYPES": {
            "id": "number"
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
1) `AUTH` Request to update the count of product in a users cart
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
    payload of response is empty if succeded
    Can raise:
    1. `Type Error`, product id or quantity is of incorrect type
    1. `Bound Error`, quantity is negative
    1. `Session Error`, json-web-token is invalid
    1. `Authentication Error`, no token found
1) `AUTH` Request to update user details
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
    If any parameter is not needing updation, then omit it from the body.
    Returns `success: true` if the user data was modified
    Can raise:
    1. `Type Error`, any parameter is of incorrect type
    1. `Bound Error`, any parameter does not adhere to constraints
    1. `Session Error`, json-web-token is invalid
    1. `Authentication Error`, no token found
1) `AUTH` Request to delete the user's account, all the relevant product listings and reviews are removed
    ```json
    {
        "URL": "/user/remove",
        "METHOD": "DELETE",
        "BODY": {
            "password": "string"
        }
    }
    ```
    Returns `success: true` if the user data was deleted
    Can raise:
    1. `Type Error`, password is of incorrect type
    1. `Bound Error`, password does not adhere to constraints
    1. `Session Error`, json-web-token is invalid
    1. `Authentication Error`, no token found

### Review queries
1) Return all queries for specific product
    ```json
    {
        "URL": "/review/product/:id",
        "METHOD" : "GET",
        "TYPES": {
            "id": "number"
        }
    }
    ```
    returns all the reviews in the following format
    ```js
    response.body = {
        "success" : "boolean",
        "payload" : {
            {
                "reviewId" : "number",
                "title": "string",
                "description": "string",
                "rating": "number",
                "username": "string"
            },
            {
                "reviewId" : "number",
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
    Can raise:
    1. `Type Error`, product id is of incorrect type
    1. `Bound Error`, id parameter does not adhere to constraints
1) Returns the summary of reviews for a product
    ```json
    {
        "URL": "/review/stats/product/:id",
        "METHOD" : "GET",
        "TYPES": {
            "id": "number"
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
    Can raise:
    1. `Type Error`, product id is of incorrect type
    1. `Bound Error`, id parameter does not adhere to constraints
    where count is the number of reviews and rating is the average rating for the product in the range `[0,5]` with step values of `0.5`.
1) `AUTH` Return all reviews of a user
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
                "reviewId" : "number",
                "title": "string",
                "description": "string",
                "rating": "number",
                "productId": "number"
            },
            {
                "reviewId" : "number",
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
1) `AUTH` Adds a new review
    ```json
    {
        "URL": "/review/product/:id",
        "METHOD": "PUT",
        "BODY": {
            "title": "string",
            "description": "string",
            "rating": "number"
        },
        "TYPES": {
            "id": "number"
        }
    }
    ```
    Can raise:
    1. `Type Error`, any parameter is of incorrect type
    1. `Bound Error`, any parameter does not adhere to constraints
    1. `Session Error`, json-web-token is invalid
    1. `Authentication Error`, no token found
    Adds the user as the owner of the review if success
1) `AUTH` Updates an existing review
    ```json
    {
        "URL": "/review/product/:id",
        "METHOD": "POST",
        "BODY": {
            "title": "string",
            "description": "string",
            "rating": "number"
        },
        "TYPES": {
            "id": "number"
        }
    }
    ```
    Can raise:
    1. `Type Error`, any parameter is of incorrect type
    1. `Bound Error`, any parameter does not adhere to constraints
    1. `Permission Error`, the resource is inaccessible with current json-web-token
    1. `Session Error`, json-web-token is invalid
    1. `Authentication Error`, no token found
1) `AUTH` Deletes a review
    ```json
    {
        "URL": "/review/product/:id",
        "METHOD": "DELETE",
        "TYPES": {
            "id": "number"
        }
    }
    ```
    Can raise:
    1. `Type Error`, id parameter is of incorrect type
    1. `Bound Error`, id parameter does not adhere to constraints
    1. `Permission Error`, the resource is inaccessible with current json-web-token
    1. `Authentication Error`, no token found
    1. `Session Error`, json-web-token is invalid

### miscellaneous queries
1) returns the user's first and last name
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
1) get random set of products from the database
    ```json
    {
        "URL": "/misc/product/random/:qty",
        "METHOD" : "GET",
        "TYPES": {
            "quantity": "number"
        }
    }
    ```
    returns qunatity number of random products
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
    1. `Type Error`, quantity is of incorrect type
    1. `Bound Error`, quantity does not adhere to constraints
1) get items based on search
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
