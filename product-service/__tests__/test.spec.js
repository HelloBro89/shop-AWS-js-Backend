// import {sum} from './fortest.mjs';
// console.log(sum)
// 
// test('adds 1 + 2 to equal 3', () => {
//   expect(sum(1, 2)).toBe(3);
// });
import {sum} from './fortest.mjs';
import {getAllProducts}  from "../handler/getAllProducts.mjs";
import productList from '../handler/productList.mjs'; 

  test('mock data get all product', async () => {
    let checkBody = await getAllProducts();
    expect(checkBody.body).toBe(JSON.stringify(productList));
  });

//   test('adds 1 + 2 to equal 3', () => {
//   expect(sum(1, 2)).toBe(3);
// });



