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
  "importFileParser": () => (/* binding */ importFileParser)
});

;// CONCATENATED MODULE: external "aws-sdk"
const external_aws_sdk_namespaceObject = require("aws-sdk");
var external_aws_sdk_default = /*#__PURE__*/__webpack_require__.n(external_aws_sdk_namespaceObject);
;// CONCATENATED MODULE: external "csv-parser"
const external_csv_parser_namespaceObject = require("csv-parser");
;// CONCATENATED MODULE: ./handler/importFileParser.js




const importFileParser = async event => {
  const s3 = new (external_aws_sdk_default()).S3({
    region: 'eu-west-1'
  });
  console.log(`CHEKC EVENT: ${JSON.stringify(event)}`);

  try {
    for (const record of event.Records) {
      const BUCKET = record.s3.bucket.name;
      const key = record.s3.object.key;
      const params = {
        Bucket: BUCKET,
        Key: key
      };
      console.log(`CHECK PARAMS  ${params}`);
      await new Promise((resolve, reject) => {
        s3.getObject(params).createReadStream().pipe(external_csv_parser_namespaceObject()).on('data', data => {
          console.log(`Data file:  ${JSON.stringify(data)}`);
        }).on('error', err => {
          reject(`Failed: ${err}`);
        }).on('end', async () => {
          console.log(`Copy from ${BUCKET}/${key}`);
          await s3.copyObject({
            Bucket: BUCKET,
            CopySource: `${BUCKET}/${key}`,
            Key: key.replace('uploaded', 'parser')
          }).promise();
          console.log(`Copied to file parser.`);
          await s3.deleteObject({
            Bucket: BUCKET,
            Key: key
          }).promise();
          console.log('File deleted');
          resolve(`GOOD`);
        });
      });
    }

    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: null
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: null
    };
  }
};
var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=importFileParser.js.map