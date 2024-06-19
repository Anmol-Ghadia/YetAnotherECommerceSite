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

## TODO
1) Refactor Routes in different folder
1) Make home page
1) Add public browse feature


## Development guide
1) install npm modules
    ```BASH
    npm install
    ```
1) Make .env file and configure the following variables
    ```py
    # .env file
    DB_URI=# Your URI here
    DB_NAME=#Database Name
    COLLECTION_NAME=#Collection Name
    PORT=#server's listening port her
    ```
1) compile Typescript files
    ```BASH
    npx tsc -w
    ```
1) Start server
    ```BASH
    node ./server/dist/main.js
    ```
1) Start React app
    ```BASH
    cd client
    npm start
    ```
