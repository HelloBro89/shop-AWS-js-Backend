'use strict';
import {dbOptions, Client} from './connection/connection.mjs';

export const addNewItem = async event => {
    const client = new Client(dbOptions);
    await client.connect();
    console.log("**********Get logs of event event: ", event);
    

    try {
        const json = await JSON.parse(event.body);
        const {price, title, description, count} = json;

        console.log(`***********Get arguments of request. Price = ${price}, Title = ${title}, Description = ${description}, Count = ${count}`);

        await client.query('BEGIN');

        const addReqToProductDB = `insert into products (title, description, price ) values ('${title}', '${description}', ${price}) returning id`;
        const resFromProductDB = await client.query(addReqToProductDB);

        const primaryKeyID = resFromProductDB.rows[0].id;
        const addReqToStockDB =  `insert into stocks (product_id, count ) values ('${primaryKeyID}', ${count})`;
        await client.query(addReqToStockDB);

        await client.query('COMMIT');

        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
        },

            body: JSON.stringify({message: "Item added",
            idPrimary: primaryKeyID}),
     };
    } catch(e) {
        console.log("*****Error: ", e);
        console.log("*****Error: ", e.name);
        console.log(`********Error type  ${typeof e.name}`)
        await client.query('ROLLBACK');
        console.log("*****Error: ", e);
        if (e.name === 'SyntaxError' || e.code === '42703') {
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
            console.log("*****Error status 500: ", e);
            return {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
            },
             body: JSON.stringify({message: "Unexpected error"}),
         };
        };

    } finally {
        client.end();
    }
}