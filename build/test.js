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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

module.exports = require("@reactivex/rxjs");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var rxjs_1 = __webpack_require__(0);
var wpnu = __webpack_require__(5);
var Router = (function () {
    function Router(routes) {
        this.routes$ = rxjs_1.Observable.from(routes);
    }
    Router.prototype.match = function (req) {
        return this.routes$.filter(function (r) { return r.path === req.url; });
    };
    return Router;
}());
exports.Router = Router;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var rxjs_1 = __webpack_require__(0);
var http_1 = __webpack_require__(3);
var https_1 = __webpack_require__(4);
var Server = (function () {
    function Server(protocol) {
        if (protocol === void 0) { protocol = 'http'; }
        this.protocol = protocol;
        //
    }
    Server.prototype.server = function (port, protocol) {
        var _this = this;
        if (protocol === void 0) { protocol = this.protocol; }
        return rxjs_1.Observable.create(function (observer) {
            var server = protocol === 'http' ? _this.getHttpServer(observer) : _this.getHttpsServer(observer);
            server.listen(port);
            return function () {
                observer.complete();
                server.close();
            };
        });
    };
    Server.prototype.getJSON = function (options) {
        var _this = this;
        return rxjs_1.Observable.create(function (observer) {
            var req = _this.protocol === 'http' ? _this.getRequest(options, observer) : _this.getSecureRequest(options, observer);
        });
    };
    Server.prototype.getRequest = function (options, observer) {
        var req = http_1.request(options, function (res) {
            var rawData = '';
            res.on('data', function (chunk) { return rawData += chunk; });
            res.on('end', function () {
                var data;
                try {
                    data = JSON.parse(rawData);
                }
                catch (error) {
                    observer.error(error);
                }
                observer.next(data);
                observer.complete();
            });
        });
        req.on('error', function (err) { return observer.error(err); });
        req.end();
    };
    Server.prototype.getSecureRequest = function (options, observer) {
        var req = https_1.request(options, function (res) {
            var rawData = '';
            res.on('data', function (chunk) { return rawData += chunk; });
            res.on('end', function () {
                var data;
                try {
                    data = JSON.parse(rawData);
                }
                catch (error) {
                    observer.error(error);
                }
                observer.next(data);
                observer.complete();
            });
        });
    };
    Server.prototype.getHttpServer = function (observer) {
        var server = http_1.createServer(function (req, res) {
            observer.next({ req: req, res: res });
        });
        return server;
    };
    Server.prototype.getHttpsServer = function (observer) {
        var server = https_1.createServer(function (req, res) {
            observer.next({ req: req, res: res });
        });
        return server;
    };
    return Server;
}());
exports.Server = Server;


/***/ },
/* 3 */
/***/ function(module, exports) {

module.exports = require("http");

/***/ },
/* 4 */
/***/ function(module, exports) {

module.exports = require("https");

/***/ },
/* 5 */
/***/ function(module, exports) {

module.exports = require("webpack-node-utils");

/***/ },
/* 6 */,
/* 7 */,
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var server_1 = __webpack_require__(2);
var router_1 = __webpack_require__(1);
var server = new server_1.Server();
var router = new router_1.Router('routes');
server.server(3000)
    .map(function (r) { return router.match(r.req); })
    .subscribe(function (req) {
    console.log(req);
});


/***/ }
/******/ ]);
//# sourceMappingURL=test.js.map