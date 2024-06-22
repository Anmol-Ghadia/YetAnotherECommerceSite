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

## Sitemap
This is a sitemap with corresponding React Component names in round brackets and urls in square brackets

1) Landing Page (LandingPage) [/]
    1) Browse Products (SearchPage) [/browse]
        1) Single Product Page (productPage) [/browse/product/:id]
    1) **User Profile** (UserPage) [/user]
        1) **View Cart** (CartPage) [/user/cart]
    1) Authentication Page (AuthPage) [/auth]
        1) Login Page (LoginPage) [index]
        1) Registration Page (RegisterPage) [/auth/register]

> **Bold** pages can only be visited with valid JWT, otherwise redirected

## TODO
1) Add frontend checks for registration data
1) Add backend checks for registration data
1) Add notification system for successfull logins and registrations
1) Add more user info on Register page
1) Add add-to-cart button on product page
1) Add support for fetching and rendering images on product page
1) Add support for fetching and rendering images on search page
1) ~~Product Listing page fetches in a loop~~
1) ~~Update backend to respond in json for Product queries~~
1) ~~Add Product detailed view page~~
1) ~~Add Create Product Listing Page~~
1) ~~If valid token exists then user should be redirected to user home page from login page~~

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
