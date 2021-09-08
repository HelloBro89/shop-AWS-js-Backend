/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "getProductsById": () => (/* binding */ getProductsById)
});

;// CONCATENATED MODULE: external "pg"
const external_pg_namespaceObject = require("pg");
;// CONCATENATED MODULE: ./handler/connection/connection.mjs

const { Client } = external_pg_namespaceObject;

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const dbOptions = {
   host: PG_HOST,
   port: PG_PORT,
   database: PG_DATABASE,
   user: PG_USERNAME,
   password: PG_PASSWORD,
   ssl: {
      rejectUnauthorized: false
   },
   connectionTimeoutMillis: 5000
};


;// CONCATENATED MODULE: ./handler/getProductsById.mjs



const getProductsById = async event => {
  const client = new Client(dbOptions);
  await client.connect();

  console.log("***********Get product by ID: ", event);
  
 
  try {
    const params = await event.pathParameters.productId;
    
    console.log(`***********Get params of request. Id = ${params}`);

    const {rows: productById} = await client.query(`select id, count, price, title, description from products p left join stocks s on p.id = s.product_id where id in ('${params}')`);
    
    console.log("************ TESTESTESTSETSETSETSE", productById[0]);

    if (productById[0]) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(productById[0]),
         };
      }  
        return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({message: 'Product not found'}),
    };
      
   } catch (e) {
     
    //  console.log("***********Error: ", e);

     if (/* e.name === 'SyntaxError' || e.code === '42703' || */ e.code === '22P02') {
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
    console.log("*****Error : ", e);
      return {
      statusCode: 500,
      headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
       message: "unexpected error"
    }),
 }
  }
   
  

    
     } finally {
      client.end()
    }
  }
  
var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=getProductsById.js.map