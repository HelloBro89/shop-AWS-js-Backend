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
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "basicAuthorizer": () => (/* binding */ basicAuthorizer)
/* harmony export */ });


const generatePolicy = (principalId, resource, effect) => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [{
      Action: 'execute-api:Invoke',
      Resource: resource,
      Effect: effect
    }]
  }
});

const basicAuthorizer = async (event, context, callback) => {
  console.log("**********Get logs of event: ", event);

  if (event.type !== 'TOKEN') {
    callback('Unauthorized');
  }

  ;

  try {
    const encoded = event.authorizationToken.split(' ')[1];
    console.log(`******CHECK encoded: ${encoded}`);
    const buff = Buffer.from(encoded, 'base64');
    const [username, password] = buff.toString('utf-8').split(':');
    const storedPassword = process.env[username];
    console.log(`********CHECK username: ${username}`);
    console.log(`********CHECK storedPassword: ${storedPassword}`);
    console.log(`********CHECK PASSWORD: ${password}`);
    const effect = !storedPassword || storedPassword !== password ? 'Deny' : 'Allow';
    console.log(`********CHECK EFFECT: ${effect}`);
    const policy = generatePolicy(encoded, event.methodArn, effect);
    console.log(`CHECK POLICY: ${JSON.stringify(policy)}`);
    callback(null, policy);
  } catch (e) {
    console.log(`*******CHECK ERROR ${e}`);
    callback(`Unauthorized: ${e.message}`);
  }
};
var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=basicAuthorizer.js.map