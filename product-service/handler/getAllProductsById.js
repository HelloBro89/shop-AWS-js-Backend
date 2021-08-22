module.exports.getAllProductsById = async (event) => {

    const productId = event.pathParameters.productId;

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          mess: productId,
          productName: "ById",
          price: 500
        }
      ),
    };
  
    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
  };
  