'use strict';

module.exports.getAllProducts = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        mess: event,
        productName: "Italy",
        price: 500
      }
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
