This is a server-side application uses Typescript and Express.js.
 #### `GET` `/rate`  This application provides an ability to get currency exchange rate USD to UAH.
 #### `POST` `/subscripe` `body example: { email: 'john.doe@gmail.com' }` Also, it is possible to subscribe to daily email with updated rate values. Values are taken from Privat Bank api.

To run an application you need to:
1. Install postgres v16.1 (https://www.postgresql.org/download/)
2. Create the database and roles for development
   `psql -d postgres`
   `CREATE USER data_user WITH PASSWORD 'password';`
   `CREATE DATABASE curr_data OWNER data_user;`
   `GRANT ALL PRIVILEGES ON DATABASE curr_data to data_user;`

4. Install node.js v21.3.0 (https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
   `nvm` is convinient to complete this step (https://github.com/nvm-sh/nvm)
5. To apply migrations use `npm run migrate-up`
6. Run to setup the server `npm i` `npm run build` `npm run start`

Note: app uses Google credentials authentication, but from September 30th it is going to be blocked. Possible solution - switch to use OAuth for sending emails. 
