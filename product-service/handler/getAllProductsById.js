'use strict';
import productList from '../productList';
// const productList = require('../productList.json');


export const getAllProductsById = async event => {

  const params = event.pathParameters.productId;
  const productById = productList.find(item => item.id === params);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(
        {
          productById
        }
      ),
    };
  
    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
  };
  