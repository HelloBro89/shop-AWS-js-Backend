'use strict';
import {dbOptions, Client} from './connection/connection.mjs';

export const addNewItem = async event => {
    const client = new Client(dbOptions);
    await client.connect();
    console.log("**********Get logs of: ", event);

    try {
        const json = await JSON.parse(event.body);
        const {price, title, description, count} = json;

        const addReqToProductDB = `insert into products (title, description, price ) values ('${title}', '${description}', ${price}) returning id`;
        const resFromProductDB = await client.query(addReqToProductDB);

        const primaryKeyID = resFromProductDB.rows[0].id;
        const addReqToStockDB =  `insert into stocks (product_id, count ) values ('${primaryKeyID}', ${count})`;
        await client.query(addReqToStockDB);

        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
        },

            body: JSON.stringify({message: "Item added",
            idPrimary: primaryKeyID}),
     };
    } catch(e){
        console.log('*********Error: ', e);
    } finally {
        client.end();
    }
}