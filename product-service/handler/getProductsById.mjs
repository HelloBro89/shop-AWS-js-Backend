'use strict';
import productList from './productList.mjs';

export const getProductsById = async event => {

try {
  
  const params = event.pathParameters.productId;
  const productById = productList.find(item => item.id === params);
  
  if (productById){
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(productById),
    };
  } 
  return {
    statusCode: 404,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({message: 'Product not found'}),
  };
    
    } catch (e) {
  console.log("Error: ", e);
  }
};
  