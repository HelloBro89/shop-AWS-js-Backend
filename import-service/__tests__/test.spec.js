import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { importProductsFile } from '../handler/importProductsFile.js';


const mockedUrl = 'https://uploaded-product.s3.eu-west-1.amazonaws.com/uploaded';


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

test('ImportProductsFile lambda: to be return status 500 unhandled error ', async () => {
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

    expect( JSON.parse(body).message).toEqual(`Unhandled error!!!`);
    expect(statusCode).toBe(500);
    
    AWSMock.restore();
});


