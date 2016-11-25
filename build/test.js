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
/******/ 	return __webpack_require__(__webpack_require__.s = 27);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

module.exports = require("fs-extra");

/***/ },
/* 1 */
/***/ function(module, exports) {

module.exports = require("@reactivex/rxjs");

/***/ },
/* 2 */
/***/ function(module, exports) {

module.exports = require("path");

/***/ },
/* 3 */
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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var rxjs_1 = __webpack_require__(1);
var PolicyEvaluator = (function () {
    function PolicyEvaluator(policies) {
        this.policies$ = rxjs_1.Observable.from(policies);
    }
    PolicyEvaluator.prototype.evaluate = function (mr) {
        return this.policies$
            .filter(function (pol) { return mr.route.policies.indexOf(pol.name) !== -1 || mr.route.policies.length === 0; })
            .map(function (p) { return p.method(mr.reqres); })
            .do(function (val) { return console.log('from policy evaluator: ', val); })
            .reduce(function (acc, val) { var num = val ? 0 : 1; return acc + num; }, 0)
            .map(function (guard) { return guard === 0 ? Object.assign({ route: mr.route, reqres: mr.reqres, pass: true }) : Object.assign({ route: mr.route, reqres: mr.reqres, pass: false }); });
    };
    return PolicyEvaluator;
}());
exports.PolicyEvaluator = PolicyEvaluator;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var rxjs_1 = __webpack_require__(1);
var url_1 = __webpack_require__(18);
var RequestExtractor = (function () {
    function RequestExtractor(req) {
        this.request = req;
        this.verb = this.request.method;
    }
    RequestExtractor.extract = function (req) {
        //params
        if (req.method.toUpperCase() === ('GET' || 'DELETE')) {
            var request = req;
            request.params = this.getParams(req);
            return request;
        }
        //body
        if (req.method.toUpperCase() === ('POST' || 'UPDATE' || 'DELETE' || 'PATCH')) {
            var request = req;
            request.body = this.getJSON(req);
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
/* 6 */
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var rxjs_1 = __webpack_require__(1);
var Router = (function () {
    function Router(routes) {
        this.routes$ = rxjs_1.Observable.from(routes);
    }
    Router.prototype.match = function (reqres) {
        var _this = this;
        return this.routes$
            .map(function (r) { return _this.parseUrls(r, reqres); })
            .do(function (mr) { return console.log(mr.reqres.req.url, mr.reqres.req.unparsedUrl, mr.route.path); })
            .filter(function (mr) {
            var test = (typeof mr.reqres.req !== 'undefined'
                && mr.route.path === mr.reqres.req.unparsedUrl
                && mr.route.verb.toUpperCase() === mr.reqres.req.method.toUpperCase());
            return test;
        });
        //.do(r => console.log(r.route.path, r.reqres.req.url, r.reqres.req.unparsedUrl))
        //.do(r => console.log(r));
    };
    Router.prototype.parseUrls = function (route, reqres) {
        var path = route.path;
        var url = reqres.req.url;
        var labels = path.match(/(:[^\/|\s]+)/g);
        var base = path.match(/(^\/[a-zA-Z-_\/]*)/g)[0];
        labels = labels === null ? [] : labels;
        var valuesArray = url.replace(base, '').split('/');
        var values = valuesArray.filter(function (s) { return s.length > 1; });
        var newPath = base.length > 1 ? base.concat('/').concat(values.join('/')) : base.concat(values.join('/'));
        var mr;
        if ((labels.length > 0 && labels.length === values.length)) {
            //console.log(labels);
            var pairs = labels.map(function (l, i) { return l + "=" + values[i]; }).map(function (s) { return s.slice(1, s.length); });
            var newUrl = base.concat('?').concat(pairs.join('&'));
            var newRoute = {
                handler: route.handler,
                policies: route.policies,
                verb: route.verb,
                path: newPath
            };
            var newReq = Object.assign(reqres.req, { url: newUrl, unparsedUrl: url });
            mr = {
                route: newRoute,
                reqres: Object.assign(reqres, { req: newReq })
            };
        }
        else {
            mr = {
                route: route,
                reqres: {
                    req: Object.assign({}, reqres.req, { unparsedUrl: url }),
                    res: reqres.res
                }
            };
        }
        //console.log(mr.route.path, labels, reqres.req.url, reqres.req.parsedUrl);
        return mr;
    };
    return Router;
}());
exports.Router = Router;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var rxjs_1 = __webpack_require__(1);
var http_1 = __webpack_require__(15);
var https_1 = __webpack_require__(16);
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
/* 9 */
/***/ function(module, exports) {

"use strict";
"use strict";
var RequestHandler = (function () {
    function RequestHandler() {
        //
    }
    RequestHandler.handle = function (fr) {
        var pass = ((!fr.asset || typeof fr.asset === 'undefined') && fr.pass);
        if (pass) {
            fr.route.handler(fr.req, fr.res);
        }
    };
    return RequestHandler;
}());
exports.RequestHandler = RequestHandler;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var server_1 = __webpack_require__(8);
var policy_1 = __webpack_require__(4);
var response_1 = __webpack_require__(6);
var request_1 = __webpack_require__(5);
var errors_handler_1 = __webpack_require__(3);
var server_partials_1 = __webpack_require__(12);
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
        return server_partials_1.manageAssets(r, assetsFolderName);
    })
        .map(function (r) {
        // for some reason, rxjs throws an error when trying to access the requent event data after it has been matched.
        // check here if this is a request type that has post data and if so, extract it before matching.
        return Object.assign(r, { req: (r.req.method.toUpperCase() !== ('GET' || 'DELETE')) ? request_1.RequestExtractor.extract(r.req) : r.req });
    })
        .map(function (r) { return server_partials_1.manageRouting(routes, r, rerouteUnmatched); })
        .switch()
        .map(function (mr) {
        var resload = new response_1.ResponseLoader(mr.reqres.res);
        var response = resload.load();
        var request = (mr.reqres.req.method.toUpperCase() === ('GET' || 'DELETE')) ? request_1.RequestExtractor.extract(mr.reqres.req) : mr.reqres.req;
        var obj = { route: mr.route, reqres: { req: request, res: response, asset: mr.reqres.asset, redirect: mr.reqres.redirect } };
        return obj;
    })
        .map(function (mr) { return evaluator.evaluate(mr); })
        .concatAll()
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
        console.log('exec from index: ', 'redirect: ', fr.redirect, 'asset: ', fr.asset, 'policy :', fr.pass);
        if (!fr.pass && (fr.asset || typeof fr.asset === 'undefined')) {
            errors_handler_1.ErrorHandler.policyError(fr.req, fr.res);
            return fr;
        }
        else {
            return fr;
        }
    });
}
exports.createServer = createServer;
var server_2 = __webpack_require__(8);
exports.Server = server_2.Server;
//export { exportPolicies } from './exporters/export-policies';
//export { exportRoutes } from './exporters/export-routes';
var errors_handler_2 = __webpack_require__(3);
exports.ErrorHandler = errors_handler_2.ErrorHandler;
var request_2 = __webpack_require__(5);
exports.RequestExtractor = request_2.RequestExtractor;
var response_2 = __webpack_require__(6);
exports.ResponseLoader = response_2.ResponseLoader;
var request_handler_1 = __webpack_require__(9);
exports.RequestHandler = request_handler_1.RequestHandler;
var router_1 = __webpack_require__(7);
exports.Router = router_1.Router;
var policy_2 = __webpack_require__(4);
exports.PolicyEvaluator = policy_2.PolicyEvaluator;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(__webpack_require__(10));


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(__webpack_require__(14));
__export(__webpack_require__(13));
__export(__webpack_require__(28));


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var fs_extra_1 = __webpack_require__(0);
var Path = __webpack_require__(2);
var mime = __webpack_require__(17);
function manageAssets(r, assetsFolderName) {
    //remap any incoming request asking for a common asset file to the assets folder
    var regex = /(^\/.+\.[(js$)|(css$)|png]+)/;
    r.req.url = regex.exec(r.req.url) !== null ? r.req.url.replace(regex, "/assets$1") : r.req.url;
    var regex2 = /(^\/assets\/assets)/;
    var testAssets = (regex2.exec(r.req.url) !== null);
    r.req.url = testAssets ? r.req.url.replace(regex2, "/assets") : r.req.url;
    if (testAssets) {
        var type = mime.lookup(r.req.url);
        var path = Path.join(process.cwd(), r.req.url);
        var stats = fs_extra_1.statSync(path);
        r.res.sendFile(path, type, stats.size);
    }
    return Object.assign(r, { asset: testAssets });
}
exports.manageAssets = manageAssets;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var fs_extra_1 = __webpack_require__(0);
function manageHeaders(r, renderEngine, allowedMethods, allowedHeaders, allowedOrigins, additionalHeaders) {
    var response = r.res;
    if ((typeof allowedOrigins === 'array' && allowedOrigins.length > 0)) {
        response.setHeader('Access-Control-Allow-Origin', allowedOrigins.join(','));
    }
    else {
        if (typeof allowedOrigins === 'string' && allowedOrigins.length > 0) {
            response.setHeader('Access-Control-Allow-Origin', allowedOrigins);
        }
    }
    if ((allowedMethods.length > 0))
        response.setHeader('Access-Control-Allow-Methods', allowedMethods.join(','));
    if ((allowedHeaders.length > 0))
        response.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(','));
    if (r.req.method === 'OPTIONS') {
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
/* 15 */
/***/ function(module, exports) {

module.exports = require("http");

/***/ },
/* 16 */
/***/ function(module, exports) {

module.exports = require("https");

/***/ },
/* 17 */
/***/ function(module, exports) {

module.exports = require("mime");

/***/ },
/* 18 */
/***/ function(module, exports) {

module.exports = require("url");

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var main_1 = __webpack_require__(22);
exports.policies = [].concat.apply([], main_1.policies);


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var main_1 = __webpack_require__(23);
exports.routes = [].concat.apply([], main_1.routes);


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var fs_extra_1 = __webpack_require__(0);
var pug_1 = __webpack_require__(24);
var HomeHandler = (function () {
    function HomeHandler() {
    }
    HomeHandler.main = function (req, res) {
        fs_extra_1.readJSON('../hrm/assets/sandbox.json', function (err, data) {
            if (err)
                console.log(err);
            var display = data.map(function (d) { return d.name; });
            var html = pug_1.renderFile('views/main.pug', data);
            res.render(html);
        });
    };
    HomeHandler.post = function (req, res) {
        //console.log(inspect(req, true, 5, true));
        var sub = req.body.subscribe(function (data) {
            res.json(data);
        }, function () {
            sub.unsubscribe();
        }, function (err) { return console.log(err); });
    };
    HomeHandler.getById = function (req, res) {
        var params = req.params;
        res.json(params);
    };
    HomeHandler.getByIdAndUsername = function (req, res) {
        var params = req.params;
        res.json(params);
    };
    return HomeHandler;
}());
exports.HomeHandler = HomeHandler;


/***/ },
/* 22 */
/***/ function(module, exports) {

"use strict";
"use strict";
exports.policies = [
    {
        name: 'main',
        method: function () { return true; }
    }
];


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var home_1 = __webpack_require__(21);
exports.routes = [
    {
        path: '/',
        verb: 'GET',
        handler: home_1.HomeHandler.main,
        policies: ['main']
    },
    {
        path: '/',
        verb: 'POST',
        handler: home_1.HomeHandler.post,
        policies: ['main']
    },
    {
        path: '/:id',
        verb: 'GET',
        handler: home_1.HomeHandler.getById,
        policies: []
    },
    {
        path: '/:id/:username',
        verb: 'GET',
        handler: home_1.HomeHandler.getByIdAndUsername,
        policies: []
    }
];


/***/ },
/* 24 */
/***/ function(module, exports) {

module.exports = require("pug");

/***/ },
/* 25 */,
/* 26 */,
/* 27 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var routes_1 = __webpack_require__(20);
var policies_1 = __webpack_require__(19);
var request_handler_1 = __webpack_require__(9);
var index_1 = __webpack_require__(11);
index_1.createServer(3000, routes_1.routes, policies_1.policies, undefined, '10.*')
    .subscribe(function (fr) {
    request_handler_1.RequestHandler.handle(fr);
});


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var rxjs_1 = __webpack_require__(1);
var index_1 = __webpack_require__(10);
function manageRouting(routes, r, redirect) {
    var router = new index_1.Router(routes);
    var matched$ = router.match(r);
    return matched$.isEmpty().map(function (t) {
        if (t) {
            if (redirect && !r.asset) {
                var mr = Object.assign({}, { reqres: Object.assign(r, { redirect: redirect }), route: { path: r.req.url, verb: r.req.method, policies: [], handler: null } });
                return rxjs_1.Observable.of(mr);
            }
            else {
                var mr = Object.assign({}, { reqres: r, route: { path: '/route-not-found', verb: 'GET', policies: [], handler: index_1.ErrorHandler.routeNotFound } });
                return rxjs_1.Observable.of(mr);
            }
        }
        else {
            return matched$;
        }
    })
        .switch();
}
exports.manageRouting = manageRouting;


/***/ }
/******/ ]);
//# sourceMappingURL=test.js.map