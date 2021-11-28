# Online shop (backend)
## This repository contains only a backend for an online store built on ABC. This appendix is in the process of being finalized, so some features have not yet been implemented.
## Additional links:
- link to frontend part https://github.com/HelloBro89/shop-AWS-React-ts-frontend
- link to cart-api-service https://github.com/HelloBro89/cart-api-backend-shop
## The application contains the following services:
- **product-service** - working with the database, adding, deleting, changing products in the store
- **import-service** - processing of the list of goods in the CSV format when adding to the store and transferring and adding them to the queue
- **authorization-service** - user authorization using a token (mock)
- **bff-service** - backend for frontend (temporarily disabled, due to financial policy Free Tier account)
- **cart-api-service** - detailed information here: https://github.com/HelloBro89/cart-api-backend-shop 

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