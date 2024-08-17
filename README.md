# MERN Stack - E-Commerce Site
A simple E-Commerce site that allows user to browse products and
save products to cart if logged in. Allows new users to create an account

Allows filtering of products based on category, searching for products by name
or description. Check out process involves a confirmation and places the order
by default. Users can also leave reviews for products

Allows user to view and update profile

Seller's are also users with special status who can create a product listing

## [Documentation](https://anmol-ghadia.github.io/YetAnotherECommerceSite/)

## Caching database queries
Most DB queries that can be predicted based on previous results are stored on the backend's memory in a `Cache` class. This cache is queried first to see if it contains the required items, hence reducing the expensive DB call. The cache has configurable parameter such as `CACHE_SIZE` described in the environment variables section below.

## Search Logic (BrowsePage)
1) When no keywords are supplied
    When no preferences are set, the backend server selects random products that satisfy the criteria for retrieval.

    Quantity buttons: then number of items selected after the inital random product is controlled

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
1. All routers are contained in routers where the api is divided in sub parts as specified by sub routers
1. Handlers perform checks on received data before passing it to the database
1. All authenticated routes are protected by authentication middleware which also appends username to `headers`
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
    CACHE_SIZE=# number of documents to store in memory for each CACHE. use 50 if not sure
    LOGGING_LEVEL=#0 for critical and 1 for general notifications
    RESET_DB=#true or false
    ```
1) Start server
    ```BASH
    cs ./backend
    npm start
    ```
1) Start React app
    ```BASH
    cd ./frontend
    npm start
    ```

![DB Draft](https://github.com/Anmol-Ghadia/YetAnotherECommerceSite/assets/47422194/e44b70f6-8980-4840-90a6-733c34cc8120)

## Build guide for documentation (TODO !!!)
Follow the guide on [python virtual environments](https://docs.python.org/3/tutorial/venv.html).
Continue by refering the [mkdocs guide](https://www.mkdocs.org/getting-started/).
## Frontend Migration to TS and eslint
Gradually .jsx files will be dropped in favour for .tsx. Also new files should adhere to a modified version of airbnb linting style.

The project is using Approach `Level 1A` as listed on [React Docs](https://react-typescript-cheatsheet.netlify.app/docs/migration/)

It is recomended to run eslint and prettier before PRs for code consistency

## Build Notes:
1) Remove React Strict tags from `index.js`
1) Set Cookie paramaeter `secure: true` in Login.jsx

## TODO
1) Do not fetch the cart if no token is present (on frontend) QID15,16
1) integrate cache for Cart, review, ~~Users~~ in database connector
1) Refactor database connector
1) Add an order now option on the cart page
1) Allow user maximum of 1 review per product
1) allow user to edit reviews
1) Add Date to db for Reviews
1) Allow user to add product listings
1) Allow user to add a maximum of 10 image links for their products
1) Allow user to edit their listing once product is already listed
1) Add frontend checks for registration data
1) Add notification system for successfull logins and registrations
1) Add support for displaying multiple images on product page
1) Add support for fetching and rendering images on search page

## Attributions
I would highly recommend cehcking out the following links
1) Default User Icon by [flaticon-user](https://www.flaticon.com/free-icons/user)
