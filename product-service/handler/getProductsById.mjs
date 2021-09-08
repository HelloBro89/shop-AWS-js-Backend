'use strict';
import {dbOptions, Client} from './connection/connection.mjs';

export const getProductsById = async event => {
  const client = new Client(dbOptions);
  await client.connect();

  console.log("***********Get product by ID: ", event);
  
 
  try {
    const params = await event.pathParameters.productId;
    
    console.log(`***********Get params of request. Id = ${params}`);

    const {rows: productById} = await client.query(`select id, count, price, title, description from products p left join stocks s on p.id = s.product_id where id in ('${params}')`);
    
    console.log("************ TESTESTESTSETSETSETSE", productById[0]);

    if (productById[0]) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(productById[0]),
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
     
    //  console.log("***********Error: ", e);

     if (/* e.name === 'SyntaxError' || e.code === '42703' || */ e.code === '22P02') {
      console.log("*****Error SyntaxError: ", e);
      return {
          statusCode: 400,
          headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
      },
       body: JSON.stringify({message: "Product data is invalid"}),
   };
  } else {
    console.log("*****Error : ", e);
      return {
      statusCode: 500,
      headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
       message: "unexpected error"
    }),
 }
  }
   
  

    
     } finally {
      client.end()
    }
  }
  