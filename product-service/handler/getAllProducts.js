'use strict';
import {dbOptions, Client} from './connection/connection';

export const getAllProducts = async event => {
   const client = new Client(dbOptions);
   await client.connect();

   console.log("**********Get logs of event: ", event);

   try {
      const {rows: products} = await client.query(`select id, count, price, title, description
      from products p left join stocks s on p.id = s.product_id`);
      return {
         statusCode: 200,
         headers: {
         'Access-Control-Allow-Origin': '*',
         'Access-Control-Allow-Credentials': true,
       },
       body: JSON.stringify(products),
    };
   } catch (e) {
       console.log("******Error: ", e);
       return {
         statusCode: 500,
         headers: {
         'Access-Control-Allow-Origin': '*',
         'Access-Control-Allow-Credentials': true,
       },
       body: JSON.stringify({
          message: "unexpected error"
       }),
    };
  } finally {
     client.end()
  }
};



