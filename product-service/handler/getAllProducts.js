'use strict';

module.exports.getAllProducts = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        productName: "Italy",
        price: 500
      }
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

// module.exports.getAllProductsById = async (event) => {
//   return {
//     statusCode: 200,
//     body: JSON.stringify(
//       {
//         productName: "ById",
//         price: 300
//       }
//     ),
//   };
// 
//   // Use this code if you don't use the http event with the LAMBDA-PROXY integration
//   // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
// };
