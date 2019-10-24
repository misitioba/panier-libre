# Panier Libre

Panier Libre allow local entrepreneurs to manage baskets online.

## Features

- How many baskets are available each month.
- Basket types: Define your products.
- Booking form model: Define the fields users need to fill in order to book.
- Form integration: Configure and generate the client-side script for integration.
- Show booked baskets
- Month/Year filter
- Search by field

## Installation

- Clone the core project first (savoie)
  
  [https://gitlab.com/javimosch/savoie/tree/master](https://gitlab.com/javimosch/savoie/tree/master)

  - Follow the indications to install the core project correctly.

- Clone this project into /savoie/apps

- Add the module record in mysql (savoie project) manually or using the GUI.

  - Manually: Add a record in table modules

    ```js
    {
        title:"Panier Libre", //this will look for /apps/panier-libre folder
        db_name: "panier_libre" //default database for this project
        enabled:1
    }
    ```

  - Using GUI:

    - Start core project

      ```js
      yarn dev
      ```

    - Navigate to localhost:3000/console

    - Login using enviromental password MYSQL_PWD

    - Add the module using the GUI.

- Run the initial msql migration file from migrations/initial.sql into your mysql database (i.e: panier_libre)

- Restart the core project

    ```js
    //rs (nodemon command to restart the process)
    //or CTRL+C and
    yarn dev
    ```

- This module should be accessible using from localhost:3000/panier-libre

## Expose your server to the ecosystem

- Add your instance into the instances array in package.json and pull request against the [official repository](https://gitlab.com/misitioba/panier-libre/tree/master)

- Your server will be displayed in the homepage of all other instances. In the future, minimal stats of every instance will be also displayed.
  