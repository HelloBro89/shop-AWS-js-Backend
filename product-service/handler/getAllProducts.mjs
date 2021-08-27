'use strict';
import productList from './productList.mjs';


export const getAllProducts = async event => {
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(productList),
  };
};
