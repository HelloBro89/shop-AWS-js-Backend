// import {sum} from './fortest.mjs';
// console.log(sum)
// 
// test('adds 1 + 2 to equal 3', () => {
//   expect(sum(1, 2)).toBe(3);
// });
import { getProductsById } from "../handler/getProductsById.mjs";
import {getAllProducts}  from "../handler/getAllProducts.mjs";
import productList from '../handler/productList.mjs'; 

  test('mock data get all product', async () => {
    let checkBody = await getAllProducts();
    expect(checkBody.body).toBe(JSON.stringify(productList));
  });

  test('return obj by Id', async () => {
    let prodById = {
      pathParameters:{
        productId:'7567ec4b-b10c-45c5-9345-fc73c48a80a1'
      }
    };

    const exp = await getProductsById(prodById);
    expect(exp.body).toBe(JSON.stringify(productList[7]));
  });


