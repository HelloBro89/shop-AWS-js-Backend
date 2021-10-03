import { SNS } from 'aws-sdk';
import { dbOptions, Client } from './connection/connection'

export const catalogBatchProcess = async (event) => {
    
    const client = new Client(dbOptions);
    await client.connect();
    console.log(`******CHECK EVENT  ${JSON.stringify(event)}`);
    const items = await event.Records.map(({body}) => body );
    let resFromSns;

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
    
            const sns = new SNS({region: 'eu-west-1'});

            const filteredPrice = (Number(price) > 999) ? 'moreThousand' : 'lessThousand';

            console.log(`******CHECK RESULT ${filteredPrice}`);
            const params = {
                Subject: 'Products have been created in your DB',
                Message: `${JSON.stringify(item)}`,
                TopicArn: process.env.SNS_ARN,
                MessageAttributes: {
                    price: {
                        DataType: 'String',
                        StringValue: filteredPrice,
                    }
                }
            };

         resFromSns = await sns.publish(params).promise();
    }
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                message: resFromSns,
            }),
        };
        

    } catch (e) {
        // console.log(`*****ERROR MESSAGE: ${e.message}`);
        // console.log(`*****ERROR NAME: ${e.name}`);
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



