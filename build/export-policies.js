require("source-map-support").install();
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports) {

module.exports = require("fs-extra");

/***/ },

/***/ 11:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var Path = __webpack_require__(2);
var fs_extra_1 = __webpack_require__(0);
function exportPolicies(folderPath) {
    var path = Path.resolve(folderPath);
    getFiles(path)
        .then(function (files) {
        return getDeclaration(files);
    })
        .then(function (declarations) {
        return writeIndex(path, declarations);
    })
        .then(function () {
        console.log('Done!');
    })
        .catch(function (err) { return console.log(err); });
}
exports.exportPolicies = exportPolicies;
function writeIndex(path, declarations) {
    return new Promise(function (resolve, reject) {
        var p = Path.join(path, 'index.ts');
        fs_extra_1.writeFile(p, declarations, function (err) {
            if (err)
                reject(err);
            resolve();
        });
    });
}
function getDeclaration(files) {
    return new Promise(function (resolve, reject) {
        var imports = files
            .filter(function (f) { return f.indexOf('index') === -1; })
            .map(function (f) { return f.slice(0, f.length - 3); })
            .map(function (f) { return "import { policies as " + f + " } from './" + f + "';\r\n"; })
            .reduce(function (acc, val) { return acc.concat(val); }, "import { Policy } from '../src/policy';\r\n");
        var exported = files
            .filter(function (f) { return f.indexOf('index') === -1; })
            .map(function (f) { return f.slice(0, f.length - 3); });
        var exdecl = "export const policies: Policy[] = [].concat(..." + exported.toString() + ")";
        var declarations = imports.concat("\r\n").concat(exdecl);
        resolve(declarations);
    });
}
function getFiles(path) {
    return new Promise(function (resolve, reject) {
        fs_extra_1.readdir(path, function (err, files) {
            if (err)
                reject(err);
            resolve(files);
        });
    });
}


/***/ },

/***/ 2:
/***/ function(module, exports) {

module.exports = require("path");

/***/ }

/******/ });
//# sourceMappingURL=export-policies.js.map