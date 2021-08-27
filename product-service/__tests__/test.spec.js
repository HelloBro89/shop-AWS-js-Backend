import { getProductsById } from "../handler/getProductsById.mjs";
import {getAllProducts}  from "../handler/getAllProducts.mjs";
import productList from '../handler/productList.mjs'; 

  test('getAllProducts lambda: get all product', async () => {
    let checkBody = await getAllProducts();
    expect(checkBody.body).toBe(JSON.stringify(productList));
  });

  test('getAllProducts lambda: to be return status code 200', async () => {
    let checkBody = await getAllProducts();
    expect(checkBody.statusCode).toBe(200);
  });

  test('getAllProducts lambda: to be return define or not', async () => {
    expect(await getAllProducts()).toBeDefined();
  });

  test('getProductsById lambda: to be return obj by Id', async () => {
    let prodById = {
      pathParameters:{
        productId:'7567ec4b-b10c-45c5-9345-fc73c48a80a1'
      }
    };

    const exp = await getProductsById(prodById);
    expect(exp.body).toBe(JSON.stringify(productList[7]));
  });

  test('getProductsById lambda: to be return status code by Id', async () => {
    let prodById = {
      pathParameters:{
        productId:'7567ec4b-b10c-45c5-9345-fc73c48a80a1'
      }
    };
    const exp = await getProductsById(prodById);
    expect(exp.statusCode).toBe(200);
  });

  test('getProductsById lambda: to be return define or not', async () => {
    let prodById = {
      pathParameters:{
        productId:'7567ec4b-b10c-45c5-9345-fc73c48a80a1'
      }
    };
    expect(await getProductsById(prodById)).toBeDefined();
  });




