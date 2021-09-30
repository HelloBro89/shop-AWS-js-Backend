import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { importProductsFile } from '../handler/importProductsFile.js';
import { catalogBatchProcess } from '../handler/catalogBatchProcess.js';

const mockUrl = 'https://uploaded-product.s3.eu-west-1.amazonaws.com/uploaded';

const setMockEvent = data => ({
    Records: [
        {
            body: JSON.stringify(data),
        },
    ]
    });

jest.mock('pg', () => {
    const Client = {
        connect: jest.fn(),
        query: jest.fn(() => ({
            rows: [{   
                price: 99,
                title: 'JEST TEST',
                description: 'JEST DESC',
                count: 99 
            }],
        })),
        end: jest.fn(),
    };
    return { Client: jest.fn(() => Client) };
});

describe('Tests for catalogBatchProcess', () => {

    test('to be return the "succsess" if all OK', async () => {
        const mockDataForDB = {
            price: 99,
            title: 'JEST TEST',
            description: 'JEST DESC',
            count: 99
        }; 

        AWSMock.setSDKInstance(AWS);
        AWSMock.mock('SNS', 'publish', (params, callback) => {
            callback(undefined, 'Data sent successfully'); // Mocked response returns ‘success’ always
            });

        const result = await catalogBatchProcess(setMockEvent(mockDataForDB));
        const { message } = JSON.parse(result.body);
        expect(message).toBe('Data sent successfully'); // Mocked response to equal to ‘success’ string from above

        AWSMock.restore(); // Restore the mock
      });

      test('to be return the "status code 400" and message "Product data is invalid" if data is not valid',
       async () => {
           const mockDataForDB = {
            title: 'JEST TEST',
            description: 'JEST DESC',
            count: 99           
        }; 

        const result = await catalogBatchProcess(setMockEvent(mockDataForDB));
        const { message } = JSON.parse(result.body);
        // console.log(JSON.stringify(result));
        expect(result.statusCode).toBe(400);
        expect(message).toBe('Product data is invalid');
        AWSMock.restore();
      });

      test('to be return the "status code 500" and message "Unexpected error" if unexpected error',
      async () => {
          const mockDataForDB = {
              price: 99,
              title: 'JEST TEST',
              description: 'JEST DESC',
              count: 99           
       }; 

       AWSMock.setSDKInstance(AWS);
       AWSMock.mock('SNS', 'publish', (params, callback) => {
           callback(new Error('Something went wrong')); // Mocked response returns ‘success’ always
           });

       const result = await catalogBatchProcess(setMockEvent(mockDataForDB));
       const { message } = JSON.parse(result.body);
    //    console.log(message)
    //    console.log(JSON.stringify(result));
       expect(result.statusCode).toBe(500); 
       expect(message).toBe('Unexpected error');
       AWSMock.restore();
     });
})

describe('Tests for importProductsFile', () => {

    test('ImportProductsFile lambda: to be return the signURL', async () => {
        const mockEvent = {
            queryStringParameters: {
            name: 'test.csv',
            },
        };

        AWSMock.setSDKInstance(AWS);
        AWSMock.mock('S3', 'getSignedUrl', (action, params, callback) => {
            callback(null, mockUrl);
            });

        const executionResult = await importProductsFile(mockEvent);
        // console.log(executionResult)
        const { body, statusCode } = executionResult;

        expect(body).toEqual(mockUrl);
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
})

