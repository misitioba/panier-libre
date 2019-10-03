# Basket-hot

Basket hot allow local entrepreneurs to manage baskets online.

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
        title:"basket-hot",
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

- Restart the core project

    ```js
    //rs (nodemon command to restart the process)
    //or CTRL+C and 
    yarn dev
    ```

- This module should be accessible using from localhost:3000/basket-hot
  