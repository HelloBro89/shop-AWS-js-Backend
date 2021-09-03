'use strict';
import PG from 'pg';
const { Client } = PG;

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const dbOptions = {
   host: PG_HOST,
   port: PG_PORT,
   database: PG_DATABASE,
   user: PG_USERNAME,
   password: PG_PASSWORD,
   ssl: {
      rejectUnauthorized: false
   },
   connectionTimeoutMillis: 5000
};

export const getAllProducts = async event => {
   const client = new Client(dbOptions);
   await client.connect();

   console.log("**********Get logs of: ", event);

   try {
      const {rows: products} = await client.query(`select * from products`);
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
  } finally {
     client.end()
  }
};



