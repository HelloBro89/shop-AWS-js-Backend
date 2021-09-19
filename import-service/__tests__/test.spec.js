import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { importProductsFile } from '../handler/importProductsFile.js';


const mockedUrl = 'https://uploaded-product.s3.eu-west-1.amazonaws.com/uploaded';

    AWSMock.setSDKInstance(AWS);

    AWSMock.mock('S3', 'getSignedUrl', (action, params, callback) => {
    callback(null, mockedUrl);
    });


  test('ImportProductsFile lambda: to be return the signURL', async () => {
    const mockEvent = {
        queryStringParameters: {
        name: 'test.csv',
        },
    };
      const executionResult = await importProductsFile(mockEvent);

      const { body, statusCode } = executionResult;
      console.log(executionResult)
      expect(body).toEqual(mockedUrl);
      expect(statusCode).toBe(200);
    //   AWSMock.restore();
  });

  test('ImportProductsFile lambda: to be return the status 400 if url does not have name parameter',
   async () => {

    const mockEvent = {
        queryStringParameters: {
            name: "test.jpeg"
        },
    }

    AWSMock.mock('S3', 'getSignedUrl', (action, params, callback) => {
        callback(null, mockedUrl);
        });

       const executionResult = await importProductsFile(mockEvent);
    //    console.log(body)
       const { body, statusCode } = executionResult;

        console.log(JSON.parse(body));
    expect(JSON.parse(body).message).toEqual("The file extension must be csv or the property name is missing");
    expect(statusCode).toBe(400);
    // AWSMock.restore();
});

//   test('ImportProductsFile lambda: to be return status 500  ', async () => {
// 
//     const mockEvent = {
//         queryStringParameters: {
//         name: 'test.csv',
//         },
//     };
// 
//     AWSMock.remock('S3', 'getSignedUrl', (action, params, callback) => {
//         callback('Unhandled error!!!');
//         });
// 
//     const executionResult = await importProductsFile(mockEvent);
// 
//     const { body, statusCode } = executionResult;
// 
//     expect(body.message).toEqual(`Unhandled error!!!`);
//     expect(statusCode).toBe(500);
//     AWSMock.restore();
// });


