'use strict';
import productList from './productList';

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
  };
  