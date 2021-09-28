import { dbOptions, Client } from './connection/connection';

export const catalogBatchProcess = async (event) => {

    const client = new Client(dbOptions);
    await client.connect();

    const items = await event.Records.map(({body}) => body );
    

    try {
        for (let item of items) {
            const { price, title, description, count } = JSON.parse(item);
    
            if (!price || !title || !description || !count) {
                throw new ValidationError(`Product data is invalid`);
            };

            const addReqToProductDB = `insert into products (title, description, price ) values ('${title}', '${description}', ${price}) returning id`;
            const resFromProductDB = await client.query(addReqToProductDB);
            const primaryKeyID = resFromProductDB.rows[0].id;
            const addReqToStockDB =  `insert into stocks (product_id, count ) values ('${primaryKeyID}', ${count})`;
            await client.query(addReqToStockDB);

            await client.query('COMMIT');
    }

    } catch (e) {
        console.log(`*****ERROR NAME: ${e.name}`);
        await client.query('ROLLBACK');
        if (e.name === 'ReferenceError') {
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
                 body: JSON.stringify({
                 message: "Unexpected error"
                }),
            };
        };
    };
};



