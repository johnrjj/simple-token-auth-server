# simple-token-auth-server

## To run:

Make sure mongo instance is running

npm install

npm start

npm lint and npm test are also available, using eslint and mocha respectively

## API endpoints

### Auth
/auth/register - register an account

/auth/token - get new access token from refresh token

/auth/login - login with a username and password and get an access token and (an optional) refresh token

### API
/api/v1/me - returns user from token (requires token)

/api/v1/protected - sample route requiring a token (requires token)

/api/v1/public - public route (does not require token)

Per standard conventions: For a GET, put the token in the header as follows: 

Authorization: Bearer [token]
