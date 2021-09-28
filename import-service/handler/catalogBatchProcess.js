import { SNS } from 'aws-sdk';
import { dbOptions, Client } from './connection/connection';

export const catalogBatchProcess = async (event) => {
    
    const client = new Client(dbOptions);
    await client.connect();
    
    const items = await event.Records.map(({body}) => body );
    const sns = new SNS({region: 'eu-west-1'});

    try {
        for (let item of items) {
            const { price, title, description, count } = JSON.parse(item);
    
            if (!price || !title || !description || !count) {
                throw new Error(`Product data is invalid`);
            };

            await client.query('BEGIN');
            const addReqToProductDB = `insert into products (title, description, price ) values ('${title}', '${description}', ${price}) returning id`;
            const resFromProductDB = await client.query(addReqToProductDB);
            const primaryKeyID = resFromProductDB.rows[0].id;
            const addReqToStockDB =  `insert into stocks (product_id, count ) values ('${primaryKeyID}', ${count})`;
            await client.query(addReqToStockDB);

            await client.query('COMMIT');
    }
        
        const params = {
            Subject: 'Products have been created in your DB',
            Message: items,
            TopicArn: process.env.SNS_ARN
        };
        
        console.log(`****Params: ${JSON.stringify(params)}`)
        console.log(`****ITEMS: ${JSON.stringify(items)}`);
        console.log(`****ITEMS how obj: ${items}`);

        sns.publish(params, () => {
            console.log("Success")
        })

    } catch (e) {
        console.log(`*****ERROR MESSAGE: ${e.message}`);
        console.log(`*****ERROR NAME: ${e.name}`);
        await client.query('ROLLBACK');
        if (e.message === 'Product data is invalid') {
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
            console.log("*****Error status 500: Unexpected error: ", e);
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



