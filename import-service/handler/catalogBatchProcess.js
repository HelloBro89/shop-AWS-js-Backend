import AWS, { SNS } from 'aws-sdk';

export const catalogBatchProcess = async (event) => {
    
    const users = await event.Records.map(({body}) => body );
    console.log(`******Messages from queue ${users}`);
}

// export const catalogBatchProcess = async (event, context, callback) => {
//     const sqs = new AWS.SQS();
//     const users = JSON.parse(event.body);
// 
//     users.forEach(user => {
//         sqs.sendMessage({
//             QueueUrl: process.env.SQS_URL,
//             MessageBody: user
//         }, () => {
//             console.log(`Send message for: ${user}`) //  instead of a callback, you can listen to the response and the response has a send method
//         });
//     });
// 
//     callback(null, {
//         statusCode: 200,
//         headers: {
//             'Access-Control-Allow-Origin': '*',
//             'Access-Control-Allow-Credentials': true,
//         }
//     })
// 
// }