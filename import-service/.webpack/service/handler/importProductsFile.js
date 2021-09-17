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
  "importProductsFile": () => (/* binding */ importProductsFile)
});

;// CONCATENATED MODULE: external "aws-sdk"
const external_aws_sdk_namespaceObject = require("aws-sdk");
var external_aws_sdk_default = /*#__PURE__*/__webpack_require__.n(external_aws_sdk_namespaceObject);
;// CONCATENATED MODULE: ./handler/importProductsFile.js



const BUCKET = 'uploaded-product';
const importProductsFile = async event => {
  const s3 = new (external_aws_sdk_default()).S3({
    region: 'eu-west-1'
  }); // const catalogPath = `uploaded/USA.csv`;

  const {
    name
  } = event.queryStringParameters;
  console.log(`NAME: ${name}`);
  let status = 200;
  const params = {
    Bucket: BUCKET,
    Key: `uploaded/${name}`,
    Expires: 60,
    ContentType: 'text/csv'
  };

  try {
    let signURL = await new Promise((resolve, reject) => {
      return s3.getSignedUrl('putObject', params, (error, signURL) => {
        resolve(signURL);
      });
    });
    console.log(`Test URL ${signURL}`);
  } catch (error) {
    console.log(error);
    status = 500;
  }

  ;
  const response = {
    statusCode: status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: signURL
  };
  return response;
}; // 'use strict';
// import AWS from 'aws-sdk';
// const BUCKET = 'uploaded-product';
// 
// export const importProductsFile = async (event) => {
//   const s3 = new AWS.S3({region: 'eu-west-1'});
//   let status = 200;
//   let thumbnails = [];
//   const params = {
//     Bucket: BUCKET,
//     Prefix: 'uploaded/'
//   };
// 
//   try {
//     const s3Response = await s3.listObjectsV2(params).promise();
//     thumbnails = s3Response.Contents;
//   } catch (error) {
//     console.log(error);
//     status = 500;
//   };
// 
//   const response = {
//     statusCode: status,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Credentials': true,
//     },
//     body: JSON.stringify(
//       thumbnails
//       .filter(thumbnails => thumbnails.Size)
//       .map(thumbnails => `https://${BUCKET}.s3.amazonaws.com/${thumbnails.Key}`)
//     )
//   };
//     return response;
// 
// };
var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=importProductsFile.js.map