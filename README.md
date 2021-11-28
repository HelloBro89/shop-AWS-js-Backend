# Online shop (backend)
## This repository contains only a backend for an online store built on AWS. This app is in the process of being finalized, so some features have not yet been implemented.

## Additional links:
- link to frontend part https://github.com/HelloBro89/shop-AWS-React-ts-frontend
- link to cart-api-service https://github.com/HelloBro89/cart-api-backend-shop
## The application contains the following services:
- **product-service** - working with the database, adding, deleting, changing products in the store
- **import-service** - processing of the list of goods in the CSV format when adding to the store and transferring and adding them to the queue
- **authorization-service** - user authorization using a token (mock)
- **bff-service** - backend for frontend (temporarily disabled, due to financial policy Free Tier account)
- **cart-api-service** - detailed information here: https://github.com/HelloBro89/cart-api-backend-shop 

# ATTENTION

## If you are trying to add several products to the store at once using the "Choose File" button, you need to create a file with the "CSV" extension. For example

| count | price | title |   description   |
|-------|-------|-------|-----------------|
| 34    | 30    | jeans | jeans blue short|
| 15    | 20000 | car   | Ford sports car |

**!!! Сount, price, title and description fields must be filled in as in the example !!!**

## Also you can add, get by ID or get all a product using post request:
1. Add product (POST)
To url: https://b6sld3tghb.execute-api.eu-west-1.amazonaws.com/dev/products
#### and body:

```javascript
    {
    "price": 1000,
    "title": "TITILE",
    "description": "DESCRIPTION",
    "count": 9999999
    }
```
2. Get ALL (GET)
To url: https://b6sld3tghb.execute-api.eu-west-1.amazonaws.com/dev/products

3. Get by ID (GET)
To url: `https://b6sld3tghb.execute-api.eu-west-1.amazonaws.com/dev/products/{productID}`

## In this app I used (including all services):
- AWS/Serverless
- Lambda
- Cloud-Databases
- s3 Bucket
- EB(Elastic Beanstalk)
- SQS/SNS
- Authorizer
- Docker
- NestJS
- JavaScript/TypeScript