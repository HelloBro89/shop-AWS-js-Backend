'use strict';
import productList from './productList.mjs';

export const getAllProducts = async event => {

   try {

    if (productList.length > 0) {
     return {
       statusCode: 200,
        headers: {
         'Access-Control-Allow-Origin': '*',
         'Access-Control-Allow-Credentials': true,
       },

       body: JSON.stringify(productList),
    };
  } 
     return {
        tatusCode: 404,
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
