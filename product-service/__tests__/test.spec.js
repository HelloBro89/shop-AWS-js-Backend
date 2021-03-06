import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { catalogBatchProcess } from '../handler/catalogBatchProcess.js';

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
       expect(result.statusCode).toBe(500); 
       expect(message).toBe('Unexpected error');
       AWSMock.restore();
     });
});





//  OLD TESTS

// import { getProductsById } from "../handler/getProductsById";
// import {getAllProducts}  from "../handler/getAllProducts";
// import productList from '../handler/productList'; 
// 
//   test('getAllProducts lambda: get all product', async () => {
//     let checkBody = await getAllProducts();
//     expect(checkBody.body).toBe(JSON.stringify(productList));
//   });
// 
//   test('getAllProducts lambda: to be return status code 200', async () => {
//     let checkBody = await getAllProducts();
//     expect(checkBody.statusCode).toBe(200);
//   });
// 
//   test('getAllProducts lambda: to be return define or not', async () => {
//     expect(await getAllProducts()).toBeDefined();
//   });
// 
//   test('getProductsById lambda: to be return obj by Id', async () => {
//     let prodById = {
//       pathParameters:{
//         productId:'7567ec4b-b10c-45c5-9345-fc73c48a80a1'
//       }
//     };
// 
//     const exp = await getProductsById(prodById);
//     expect(exp.body).toBe(JSON.stringify(productList[7]));
//   });
// 
//   test('getProductsById lambda: to be return status code by Id', async () => {
//     let prodById = {
//       pathParameters:{
//         productId:'7567ec4b-b10c-45c5-9345-fc73c48a80a1'
//       }
//     };
//     const exp = await getProductsById(prodById);
//     expect(exp.statusCode).toBe(200);
//   });
// 
//   test('getProductsById lambda: to be return define or not', async () => {
//     let prodById = {
//       pathParameters:{
//         productId:'7567ec4b-b10c-45c5-9345-fc73c48a80a1'
//       }
//     };
//     expect(await getProductsById(prodById)).toBeDefined();
//   });
// 
// 
// 
// 
