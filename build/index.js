require("source-map-support").install();
module.exports =
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
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

module.exports = require("@reactivex/rxjs");

/***/ },
/* 1 */
/***/ function(module, exports) {

module.exports = require("fs-extra");

/***/ },
/* 2 */
/***/ function(module, exports) {

module.exports = require("path");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var rxjs_1 = __webpack_require__(0);
var server_1 = __webpack_require__(10);
var policy_1 = __webpack_require__(6);
var response_1 = __webpack_require__(8);
var request_1 = __webpack_require__(7);
var errors_handler_1 = __webpack_require__(5);
var server_partials_1 = __webpack_require__(9);
var asset_handler_1 = __webpack_require__(4);
var server_partials_2 = __webpack_require__(9);
function createServer(port, routes, policies, rerouteUnmatched, allowedOrigins, allowedMethods, allowedHeaders, additionalHeaders, renderEngine, assetsFolderName) {
    if (rerouteUnmatched === void 0) { rerouteUnmatched = false; }
    if (allowedOrigins === void 0) { allowedOrigins = ''; }
    if (allowedMethods === void 0) { allowedMethods = []; }
    if (allowedHeaders === void 0) { allowedHeaders = []; }
    if (additionalHeaders === void 0) { additionalHeaders = []; }
    if (renderEngine === void 0) { renderEngine = 'default'; }
    if (assetsFolderName === void 0) { assetsFolderName = 'assets'; }
    var server = new server_1.Server();
    var evaluator = new policy_1.PolicyEvaluator(policies);
    return server.server(port)
        .map(function (r) {
        return server_partials_1.manageHeaders(r, renderEngine, allowedMethods, allowedHeaders, allowedOrigins, additionalHeaders);
    })
        .map(function (r) {
        return server_partials_1.manageAssets(r);
    })
        .map(function (r) {
        if (['GET', 'DELETE'].indexOf(r.req.method.toUpperCase()) !== -1)
            return rxjs_1.Observable.of(r);
        return request_1.RequestExtractor.extractBody(r);
    })
        .switch()
        .map(function (r) { return server_partials_1.manageRouting(routes, r, rerouteUnmatched); })
        .switch()
        .map(function (mr) { return server_partials_2.manageRequestRouteRemapping(mr); })
        .map(function (mr) {
        var resload = new response_1.ResponseLoader(mr.reqres.res);
        var response = resload.load();
        var request = (mr.reqres.req.method.toUpperCase() === ('GET' || 'DELETE')) ? request_1.RequestExtractor.extract(mr.reqres.req) : mr.reqres.req;
        var obj = { route: mr.route, reqres: { req: request, res: response, asset: mr.reqres.asset, redirect: mr.reqres.redirect } };
        return obj;
    })
        .map(function (mr) { return evaluator.evaluate(mr); })
        .switch()
        .map(function (er) {
        var emr = {
            pass: er.pass,
            asset: er.reqres.asset,
            redirect: er.reqres.redirect,
            req: er.reqres.req,
            res: er.reqres.res,
            route: er.route
        };
        return emr;
    })
        .map(function (fr) {
        //console.log('exec from index: ', 'redirect: ', fr.redirect, 'asset: ', fr.asset, 'policy :', fr.pass);
        if (fr.asset) {
            asset_handler_1.AssetHandler.serve(fr.req, fr.res, assetsFolderName);
            return fr;
        }
        if (!fr.pass) {
            errors_handler_1.ErrorHandler.policyError(fr.req, fr.res);
            return fr;
        }
        return fr;
    });
}
exports.createServer = createServer;
var server_2 = __webpack_require__(10);
exports.Server = server_2.Server;
var asset_handler_2 = __webpack_require__(4);
exports.AssetHandler = asset_handler_2.AssetHandler;
var errors_handler_2 = __webpack_require__(5);
exports.ErrorHandler = errors_handler_2.ErrorHandler;
var request_2 = __webpack_require__(7);
exports.RequestExtractor = request_2.RequestExtractor;
var response_2 = __webpack_require__(8);
exports.ResponseLoader = response_2.ResponseLoader;
var request_handler_1 = __webpack_require__(11);
exports.RequestHandler = request_handler_1.RequestHandler;
var router_1 = __webpack_require__(13);
exports.Router = router_1.Router;
var policy_2 = __webpack_require__(6);
exports.PolicyEvaluator = policy_2.PolicyEvaluator;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var fs_extra_1 = __webpack_require__(1);
var Path = __webpack_require__(2);
var mime = __webpack_require__(20);
var AssetHandler = (function () {
    function AssetHandler() {
    }
    AssetHandler.serve = function (req, res, assetsFolderName) {
        var path = Path.join(process.cwd(), assetsFolderName, req.url);
        var type = mime.lookup(path);
        var stats = fs_extra_1.statSync(path);
        res.sendFile(path, type, stats.size);
    };
    return AssetHandler;
}());
exports.AssetHandler = AssetHandler;


/***/ },
/* 5 */
/***/ function(module, exports) {

"use strict";
"use strict";
var ErrorHandler = (function () {
    function ErrorHandler() {
    }
    ErrorHandler.routeNotFound = function (req, res) {
        res.error.notFound();
    };
    ErrorHandler.policyError = function (req, res) {
        res.error.policyFailed();
    };
    return ErrorHandler;
}());
exports.ErrorHandler = ErrorHandler;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var rxjs_1 = __webpack_require__(0);
var PolicyEvaluator = (function () {
    function PolicyEvaluator(policies) {
        this.policies$ = rxjs_1.Observable.from(policies);
    }
    PolicyEvaluator.prototype.evaluate = function (mr) {
        return this.policies$
            .filter(function (pol) { return mr.route.policies.indexOf(pol.name) !== -1 || mr.route.policies.length === 0; })
            .map(function (p) { return p.method(mr.reqres); })
            .reduce(function (acc, val) { var num = val ? 0 : 1; return acc + num; }, 0)
            .map(function (guard) { return guard === 0 ? Object.assign({ route: mr.route, reqres: mr.reqres, pass: true }) : Object.assign({ route: mr.route, reqres: mr.reqres, pass: false }); });
    };
    return PolicyEvaluator;
}());
exports.PolicyEvaluator = PolicyEvaluator;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var rxjs_1 = __webpack_require__(0);
var url_1 = __webpack_require__(21);
var RequestExtractor = (function () {
    function RequestExtractor(req) {
        this.request = req;
        this.verb = this.request.method;
    }
    RequestExtractor.extractBody = function (rs) {
        return this.getJSON(rs.req)
            .map(function (data) { return Object.assign(rs, { req: Object.assign(rs.req, { body: data }) }); });
    };
    RequestExtractor.extract = function (req) {
        //body
        if (req.method.toUpperCase() === ('POST' || 'UPDATE' || 'DELETE' || 'PATCH')) {
            var request = req;
            request.body = this.getJSON(req);
            return request;
        }
        //params
        if (req.method.toUpperCase() === ('GET' || 'DELETE')) {
            var request = req;
            request.params = this.getParams(req);
            return request;
        }
    };
    RequestExtractor.getJSON = function (req) {
        return rxjs_1.Observable
            .fromEvent(req, 'data')
            .buffer(rxjs_1.Observable.fromEvent(req, 'end'))
            .map(function (d) { return JSON.parse(d.toString()); });
    };
    RequestExtractor.getParams = function (req) {
        var url = req.url;
        var parsed = url_1.parse(url, true).query;
        return parsed;
    };
    return RequestExtractor;
}());
exports.RequestExtractor = RequestExtractor;


/***/ },
/* 8 */
/***/ function(module, exports) {

"use strict";
"use strict";
var ResponseLoader = (function () {
    function ResponseLoader(res) {
        var _this = this;
        this.response = res;
        this.response.json = function (json) {
            _this.response.writeHead(200, { 'Content-Type': 'application/json' });
            _this.response.end(JSON.stringify(json));
        };
        this.response.ok = function (message) {
            if (message === void 0) { message = 'Success'; }
            _this.response.writeHead(200, { 'Content-Type': 'application/json' });
            _this.response.end(JSON.stringify({ success: true, message: message }));
        };
        this.response.unauthorized = function (message) {
            if (message === void 0) { message = 'You are not authorized to access this resource.'; }
            _this.response.writeHead(401, { 'Content-Type': 'application/json' });
            _this.response.end(JSON.stringify({ success: false, message: message }));
        };
        this.response.error = {
            generic: function (status, message) {
                if (status === void 0) { status = 404; }
                if (message === void 0) { message = 'Resource not found'; }
                _this.response.writeHead(status, { 'Content-Type': 'application/json' });
                _this.response.end(JSON.stringify({ success: false, message: message }));
            },
            server: function () {
                _this.response.writeHead(500, { 'Content-Type': 'application/json' });
                _this.response.end(JSON.stringify({ success: false, message: 'Something went wrong on the server. Please try again later.' }));
            },
            notFound: function () {
                _this.response.writeHead(404, { 'Content-Type': 'application/json' });
                _this.response.end(JSON.stringify({ success: false, message: 'Resource Not Found' }));
            },
            policyFailed: function () {
                _this.response.writeHead(401, { 'Content-Type': 'application/json' });
                _this.response.end(JSON.stringify({ success: false, message: 'One or more policies prevented access to this route.' }));
            }
        };
    }
    ResponseLoader.prototype.load = function () {
        return this.response;
    };
    return ResponseLoader;
}());
exports.ResponseLoader = ResponseLoader;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(__webpack_require__(15));
__export(__webpack_require__(14));
__export(__webpack_require__(17));
__export(__webpack_require__(16));


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var rxjs_1 = __webpack_require__(0);
var http_1 = __webpack_require__(18);
var https_1 = __webpack_require__(19);
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
/* 11 */
/***/ function(module, exports) {

"use strict";
"use strict";
var RequestHandler = (function () {
    function RequestHandler() {
        //
    }
    RequestHandler.handle = function (fr) {
        if (!fr.asset && fr.pass)
            fr.route.handler(fr.req, fr.res);
    };
    return RequestHandler;
}());
exports.RequestHandler = RequestHandler;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(__webpack_require__(3));


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var rxjs_1 = __webpack_require__(0);
var Router = (function () {
    function Router(routes) {
        this.routes$ = rxjs_1.Observable.from(routes);
    }
    Router.prototype.match = function (reqres) {
        return this.routes$
            .filter(function (r) {
            var basematch = false;
            var basepath = r.path.match(/[^:]*/i)[0];
            basematch = reqres.req.url.indexOf(basepath) !== -1;
            var postbasereq = reqres.req.url.replace(basepath, '').split('/').filter(function (s) { return s.length > 0; });
            var postbasepath = r.path.replace(basepath, '').split('/').filter(function (s) { return s.length > 0; });
            return (basematch && postbasereq.length === postbasepath.length);
        })
            .filter(function (r) { return r.verb.toUpperCase() === reqres.req.method.toUpperCase(); });
    };
    return Router;
}());
exports.Router = Router;


/***/ },
/* 14 */
/***/ function(module, exports) {

"use strict";
"use strict";
function manageAssets(r) {
    //remap any incoming request asking for a common asset file to the assets folder
    var regex = /(^\/.*\.(jpg|jpeg|gif|json|png|js|svg|ico|js.map)$)/i;
    var match = r.req.url.match(regex);
    var testAssets = match !== null;
    return Object.assign(r, { asset: testAssets });
}
exports.manageAssets = manageAssets;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var fs_extra_1 = __webpack_require__(1);
function manageHeaders(r, renderEngine, allowedMethods, allowedHeaders, allowedOrigins, additionalHeaders) {
    var response = r.res;
    if ((typeof allowedOrigins === 'array' && allowedOrigins.length > 0)) {
        response.setHeader('Access-Control-Allow-Origin', allowedOrigins.join(','));
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept');
        response.setHeader('Content-Type', 'application/json');
    }
    else {
        if (typeof allowedOrigins === 'string' && allowedOrigins.length > 0) {
            response.setHeader('Access-Control-Allow-Origin', allowedOrigins);
            response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            response.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept');
            response.setHeader('Content-Type', 'application/json');
        }
    }
    if ((allowedMethods.length > 0))
        response.setHeader('Access-Control-Allow-Methods', allowedMethods.join(','));
    if ((allowedHeaders.length > 0))
        response.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(','));
    if (r.req.method === 'OPTIONS') {
        console.log(r.req.method);
        console.log(r.req.headers);
        r.res.writeHead(200);
        r.res.end();
    }
    if (additionalHeaders.length > 0) {
        additionalHeaders.forEach(function (h) {
            response.setHeader(h.key, h.value);
        });
    }
    //give the response the ability to send back responses
    response.sendFile = function (path, ct, size) {
        var rs = fs_extra_1.createReadStream(path);
        r.res.setHeader('Content-Type', ct);
        if (size !== null && typeof size !== 'undefined')
            r.res.setHeader('Content-Length', "" + size);
        r.res.writeHead(200);
        rs.pipe(r.res);
    };
    //check if a render engine was provided; if so, use it; otherwise, use default render method;
    if (typeof renderEngine === 'string') {
        //check if this is the default render engine and define basic render method
        if (renderEngine === 'default') {
            response.render = function (html) {
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(html);
            };
        }
    }
    else {
        response.render = function (path, options) {
            renderEngine(path, options, function (err, data) {
                if (err) {
                    response.writeHead(500, { 'Content-Type': 'text/html' });
                    response.end(data);
                }
                else {
                    response.writeHead(200, { 'Content-Type': 'text/html' });
                    response.end(data);
                }
            });
        };
    }
    return { req: r.req, res: response };
}
exports.manageHeaders = manageHeaders;


/***/ },
/* 16 */
/***/ function(module, exports) {

"use strict";
"use strict";
function manageRequestRouteRemapping(mr) {
    var route = mr.route;
    var req = mr.reqres.req;
    var path = route.path;
    var url = req.url;
    var labelsregex = /:([a-zA-Z_-]+[^\W])/gi;
    var labels = [];
    var matches = [];
    while (matches = labelsregex.exec(path))
        labels.push(matches[1]);
    //requirete path url to match incoming request so it can be matched in the next step
    var matchBase = path.match(/^[^:]*/);
    var base = matchBase[0].trim();
    if (labels.length > 0 && !mr.reqres.asset) {
        var valuesArray_1 = url.replace(base, '').split('/').filter(function (s) { return s.length > 0; });
        var newPath = base.concat(valuesArray_1.join('/'));
        var qs = labels
            .map(function (s) { return s.trim(); })
            .map(function (s, i) { return s + "=" + valuesArray_1[i]; })
            .join('&');
        var newUrl = base
            .trim()
            .slice(0, base.length > 1 ? base.length - 1 : base.length)
            .concat('?')
            .concat(qs);
        var newroute = Object.assign(route, { matchedPath: newPath });
        var request_1 = Object.assign(req, { url: newUrl, unparsedUrl: newPath });
        var newreqres_1 = Object.assign(mr.reqres, { req: request_1 });
        return Object.assign({}, { route: newroute, reqres: newreqres_1 });
    }
    var request = Object.assign(req, { unparsedUrl: req.url });
    var newreqres = Object.assign(mr.reqres, { req: request });
    return Object.assign({}, { route: route, reqres: newreqres });
}
exports.manageRequestRouteRemapping = manageRequestRouteRemapping;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var rxjs_1 = __webpack_require__(0);
var index_1 = __webpack_require__(3);
function manageRouting(routes, r, redirect) {
    var matched$ = new index_1.Router(routes).match(r);
    return matched$
        .defaultIfEmpty(false)
        .map(function (t) {
        if (!t) {
            if (redirect) {
                return rxjs_1.Observable.of(Object.assign({}, { reqres: Object.assign(r, { redirect: redirect }), route: { path: '/redirected', verb: r.req.method, policies: [], handler: null } }));
            }
            return rxjs_1.Observable.of(Object.assign({}, { reqres: r, route: { path: '/route-not-found', verb: 'GET', policies: [], handler: index_1.ErrorHandler.routeNotFound } }));
        }
        return matched$.map(function (route) { return Object.assign({}, { route: route, reqres: r }); });
    })
        .switch();
}
exports.manageRouting = manageRouting;


/***/ },
/* 18 */
/***/ function(module, exports) {

module.exports = require("http");

/***/ },
/* 19 */
/***/ function(module, exports) {

module.exports = require("https");

/***/ },
/* 20 */
/***/ function(module, exports) {

module.exports = require("mime");

/***/ },
/* 21 */
/***/ function(module, exports) {

module.exports = require("url");

/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map