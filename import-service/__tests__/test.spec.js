import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { importProductsFile } from '../handler/importProductsFile.js';


const mockedUrl = 'https://uploaded-product.s3.eu-west-1.amazonaws.com/uploaded';

//         11111111111111111111111111111111111111111111111111111111111111111111111111

test('ImportProductsFile lambda: to be return the signURL', async () => {
    const mockEvent = {
        queryStringParameters: {
        name: 'test.csv',
        },
    };

    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('S3', 'getSignedUrl', (action, params, callback) => {
        callback(null, mockedUrl);
        });

    const executionResult = await importProductsFile(mockEvent);
    const { body, statusCode } = executionResult;

    expect(body).toEqual(mockedUrl);
    expect(statusCode).toBe(200);

    AWSMock.restore();
});

// //         2222222222222222222222222222222222222222222222222222222222222222222222222222
// 
// test('ImportProductsFile lambda: to be return the status 400 if the file extension is not csv',
// async () => {
//      const mockEvent = {
//         queryStringParameters: {
//             name: "testtest.jpeg"
//         },
//     }
// 
//     AWSMock.setSDKInstance(AWS);
//     AWSMock.mock('S3', 'getSignedUrl', (action, params, callback) => {
//         callback(null, mockedUrl);
//     });
// 
//     const executionResult = await importProductsFile(mockEvent);
//     const { body, statusCode } = executionResult;
// 
//     expect(JSON.parse(body).message).toEqual("The file extension must be csv or the property name is missing");
//     expect(statusCode).toBe(400);
// 
//     AWSMock.restore();
// });
// 
// // 333333333333333333333333333333333333333333333333333333333333333333333333333333
// 
// test('ImportProductsFile lambda: to be return the status 400 if url does not have name parameter',
// async () => {
//     const mockEvent = {
//         queryStringParameters: {},
//     }
//     AWSMock.setSDKInstance(AWS);
//     AWSMock.mock('S3', 'getSignedUrl', (action, params, callback) => {
//         callback(null, mockedUrl);
//     });
// 
//     const executionResult = await importProductsFile(mockEvent);
//     const { body, statusCode } = executionResult;
//     expect(JSON.parse(body).message).toEqual("The file extension must be csv or the property name is missing");
//     expect(statusCode).toBe(400);
//     AWSMock.restore();
// });

//444444444444444444444444444444444444444444444444444444444444444444444444444444444

test('ImportProductsFile lambda: to be return status 500  ', async () => {
    const mockEvent = {
        queryStringParameters: {
        name: 'test.csv',
        },
    };
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('S3', 'getSignedUrl', (action, params, callback) => {
        callback(`Unhandled error!`);
    });

    const executionResult = await importProductsFile(mockEvent);
    const { body, statusCode } = executionResult;
    // console.log(executionResult)
    expect( JSON.parse(body).message).toEqual(`Unhandled error!!!`);
    expect(statusCode).toBe(500);
    
    AWSMock.restore();
});


