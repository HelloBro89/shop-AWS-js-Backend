'use strict';
import productList from './productList.mjs';

export const getAllProducts = async event => {

   console.log("Get all products: ", event);

   try {
     return {
       statusCode: 200,
        headers: {
         'Access-Control-Allow-Origin': '*',
         'Access-Control-Allow-Credentials': true,
       },

       body: JSON.stringify(productList),
    };
   } catch (e) {
       console.log("Error: ", e);
  }
};




// 'use strict';
// import productList from './productList.mjs';
// 
// export const getAllProducts = async event => {
// 
//    console.log("Get all products: ", event)
// 
//    try {
// 
//     if (productList.length > 0) {
//      return {
//        statusCode: 200,
//         headers: {
//          'Access-Control-Allow-Origin': '*',
//          'Access-Control-Allow-Credentials': true,
//        },
// 
//        body: JSON.stringify(productList),
//     };
//   } 
//      return {
//         tatusCode: 404,
//        headers: {
//           'Access-Control-Allow-Origin': '*',
//          'Access-Control-Allow-Credentials': true,
//     },
//    body: JSON.stringify({message: 'Product not found'}),
//     };
// 
//     } catch (e) {
//        console.log("Error: ", e);
//   }
// };
