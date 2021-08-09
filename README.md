# Abb clone Backend project

## Requirements
* Nodejs version >= 14 and  npm
* Mysql

&nbsp;
# Run project
## Install dependencies
```npm install```
## Create a user in mysql (if not already exist):
```
user: duyle
password: duyle95
```
## Create database and import data
* Create database
```
CREATE DATABASE abb-clone CHARACTER SET utf8mb4
```
## Import data to database
```
mysql -u duyle -p abb-clone < ./abb-clone*.sql
```
## Run the application
```
NODE_ENV=development node index.js
```
### Test API
Go to url/backend/api-docs to test API. For example: 
```
http://localhost:4000/backend/api-docs
```