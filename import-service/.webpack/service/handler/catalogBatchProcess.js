/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
  "catalogBatchProcess": () => (/* binding */ catalogBatchProcess)
});

;// CONCATENATED MODULE: external "aws-sdk"
const external_aws_sdk_namespaceObject = require("aws-sdk");
;// CONCATENATED MODULE: external "pg"
const external_pg_namespaceObject = require("pg");
var external_pg_default = /*#__PURE__*/__webpack_require__.n(external_pg_namespaceObject);
;// CONCATENATED MODULE: ./handler/connection/connection.js

const {
  Client
} = (external_pg_default());
const {
  PG_HOST,
  PG_PORT,
  PG_DATABASE,
  PG_USERNAME,
  PG_PASSWORD
} = process.env;
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

;// CONCATENATED MODULE: ./handler/catalogBatchProcess.js


const catalogBatchProcess = async event => {
  const client = new Client(dbOptions);
  await client.connect();
  const items = await event.Records.map(({
    body
  }) => body);

  try {
    for (let item of items) {
      const {
        price,
        title,
        description,
        count
      } = JSON.parse(item);

      if (!price || !title || !description || !count) {
        throw new Error(`Product data is invalid`);
      }

      ;
      await client.query('BEGIN');
      const addReqToProductDB = `insert into products (title, description, price ) values ('${title}', '${description}', ${price}) returning id`;
      const resFromProductDB = await client.query(addReqToProductDB);
      const primaryKeyID = resFromProductDB.rows[0].id;
      const addReqToStockDB = `insert into stocks (product_id, count ) values ('${primaryKeyID}', ${count})`;
      await client.query(addReqToStockDB);
      await client.query('COMMIT');
    }

    const sns = new external_aws_sdk_namespaceObject.SNS({
      region: 'eu-west-1'
    });
    const params = {
      Subject: 'Products have been created in your DB',
      Message: `${JSON.stringify(items)}`,
      TopicArn: process.env.SNS_ARN
    };
    console.log(`****Params: ${JSON.stringify(params)}`);
    console.log(`****ITEMS: ${JSON.stringify(items)}`); // sns.publish(params, async (error) => {
    //         if (error) {
    //         console.log(`********HANDLED ERROR ${error}`);
    //     } else {
    //             console.log("******Success!!!")
    //     }
    // });

    const test = await sns.publish(params).promise();
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: test
      })
    };
  } catch (e) {
    // console.log(`*****ERROR MESSAGE: ${e.message}`);
    // console.log(`*****ERROR NAME: ${e.name}`);
    await client.query('ROLLBACK');

    if (e.message === 'Product data is invalid') {
      console.log("*****Error SyntaxError: ", e);
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          message: "Product data is invalid"
        })
      };
    } else {
      console.log("*****Error status 500: Unexpected error: ", e);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          message: "Unexpected error"
        })
      };
    }

    ;
  }

  ;
};
var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=catalogBatchProcess.js.map