#!/usr/bin/env node
!function(e){function r(t){if(n[t])return n[t].exports;var o=n[t]={i:t,l:!1,exports:{}};return e[t].call(o.exports,o,o.exports,r),o.l=!0,o.exports}var n={};return r.m=e,r.c=n,r.i=function(e){return e},r.d=function(e,r,n){Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},r.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return r.d(n,"a",n),n},r.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},r.p="",r(r.s=25)}([function(e,r){e.exports=require("fs-extra")},function(e,r){e.exports=require("path")},function(e,r){e.exports=require("@reactivex/rxjs")},function(e,r){"use strict";var n=function(){function e(){}return e.routeNotFound=function(e,r){r.error.notFound()},e.policyError=function(e,r){r.error.policyFailed()},e}();r.ErrorHandler=n},function(e,r,n){"use strict";var t=n(2),o=function(){function e(e){this.policies$=t.Observable.from(e)}return e.prototype.evaluate=function(e){return this.policies$.filter(function(r){return e.route.policies.indexOf(r.name)!==-1||0===e.route.policies.length}).map(function(r){return r.method(e.reqres)})["do"](function(e){return console.log(e)}).reduce(function(e,r){var n=r?0:1;return e+n},0).map(function(r){return 0===r?Object.assign({route:e.route,reqres:e.reqres,pass:!0}):Object.assign({route:e.route,reqres:e.reqres,pass:!1})})},e}();r.PolicyEvaluator=o},function(e,r,n){"use strict";var t=n(2),o=n(18),s=function(){function e(e){this.request=e,this.verb=this.request.method}return e.extract=function(e){if("GET"===e.method.toUpperCase()){var r=e;return r.params=this.getParams(e),r}if("POST"===e.method.toUpperCase()){var r=e;return r.body=this.getJSON(e),r}},e.getJSON=function(e){return t.Observable.fromEvent(e,"data").buffer(t.Observable.fromEvent(e,"end")).map(function(e){return JSON.parse(e.toString())})},e.getParams=function(e){var r=e.url,n=o.parse(r,!0).query;return n},e}();r.RequestExtractor=s},function(e,r){"use strict";var n=function(){function e(e){var r=this;this.response=e,this.response.json=function(e){r.response.writeHead(200,{"Content-Type":"application/json"}),r.response.end(JSON.stringify(e))},this.response.ok=function(e){void 0===e&&(e="Success"),r.response.writeHead(200,{"Content-Type":"application/json"}),r.response.end(JSON.stringify({success:!0,message:e}))},this.response.unauthorized=function(e){void 0===e&&(e="You are not authorized to access this resource."),r.response.writeHead(401,{"Content-Type":"application/json"}),r.response.end(JSON.stringify({success:!1,message:e}))},this.response.error={generic:function(e,n){void 0===e&&(e=404),void 0===n&&(n="Resource not found"),r.response.writeHead(e,{"Content-Type":"application/json"}),r.response.end(JSON.stringify({success:!1,message:n}))},server:function(){r.response.writeHead(500,{"Content-Type":"application/json"}),r.response.end(JSON.stringify({success:!1,message:"Something went wrong on the server. Please try again later."}))},notFound:function(){r.response.writeHead(404,{"Content-Type":"application/json"}),r.response.end(JSON.stringify({success:!1,message:"Resource Not Found"}))},policyFailed:function(){r.response.writeHead(401,{"Content-Type":"application/json"}),r.response.end(JSON.stringify({success:!1,message:"One or more policies prevented access to this route."}))}}}return e.prototype.load=function(){return this.response},e}();r.ResponseLoader=n},function(e,r,n){"use strict";var t=n(2),o=n(3),s=function(){function e(e){this.routes$=t.Observable.from(e)}return e.prototype.match=function(e){var r=this;return this.routes$.map(function(n){return r.parseUrls(n,e)}).filter(function(e){var r="undefined"!=typeof e.reqres.req&&e.route.path===e.reqres.req.unparsedUrl&&e.route.verb.toUpperCase()===e.reqres.req.method.toUpperCase();return r}).defaultIfEmpty(Object.assign({},{reqres:e,route:{path:"/route-not-found",verb:"GET",policies:[],handler:o.ErrorHandler.routeNotFound}}))},e.prototype.parseUrls=function(e,r){var n=e.path,t=r.req.url,o=n.match(/(:[^\/|\s]+)/g),s=n.match(/(^\/[a-zA-Z-_\/]*)/g)[0];o=null===o?[]:o;var i,u=t.replace(s,"").split("/"),c=u.filter(function(e){return e.length>1}),a=s.length>1?s.concat("/").concat(c.join("/")):s.concat(c.join("/"));if(o.length>0&&o.length===c.length){var p=o.map(function(e,r){return e+"="+c[r]}).map(function(e){return e.slice(1,e.length)}),f=s.concat("?").concat(p.join("&")),l={handler:e.handler,policies:e.policies,verb:e.verb,path:a},d=Object.assign(r.req,{url:f,unparsedUrl:t});i={route:l,reqres:Object.assign(r,{req:d})}}else i={route:e,reqres:{req:Object.assign({},r.req,{unparsedUrl:t}),res:r.res}};return i},e}();r.Router=s},function(e,r,n){"use strict";var t=n(2),o=n(16),s=n(17),i=function(){function e(e){void 0===e&&(e="http"),this.protocol=e}return e.prototype.server=function(e,r){var n=this;return void 0===r&&(r=this.protocol),t.Observable.create(function(t){var o="http"===r?n.getHttpServer(t):n.getHttpsServer(t);return o.listen(e),function(){t.complete(),o.close()}})},e.prototype.getHttpServer=function(e){var r=o.createServer(function(r,n){e.next({req:r,res:n})});return r},e.prototype.getHttpsServer=function(e){var r=s.createServer(function(r,n){e.next({req:r,res:n})});return r},e}();r.Server=i},function(e,r){"use strict";var n=function(){function e(){}return e.handle=function(e){var r=(e.exec||"undefined"==typeof e.exec)&&e.pass;r&&e.route.handler(e.req,e.res)},e}();r.RequestHandler=n},function(e,r,n){"use strict";function t(e){var r=u.resolve(e);i(r).then(function(e){return s(e)}).then(function(e){return o(r,e)}).then(function(){console.log("Done!")})["catch"](function(e){return console.log(e)})}function o(e,r){return new Promise(function(n,t){var o=u.join(e,"index.ts");c.writeFile(o,r,function(e){e&&t(e),n()})})}function s(e){return new Promise(function(r,n){var t=e.filter(function(e){return e.indexOf("index")===-1}).map(function(e){return e.slice(0,e.length-3)}).map(function(e){return"import { policies as "+e+" } from './"+e+"';\r\n"}).reduce(function(e,r){return e.concat(r)},"import { Policy } from '../src/policy';\r\n"),o=e.filter(function(e){return e.indexOf("index")===-1}).map(function(e){return e.slice(0,e.length-3)}),s="export const policies: Policy[] = [].concat(..."+o.toString()+")",i=t.concat("\r\n").concat(s);r(i)})}function i(e){return new Promise(function(r,n){c.readdir(e,function(e,t){e&&n(e),r(t)})})}var u=n(1),c=n(0);r.exportPolicies=t},function(e,r,n){"use strict";function t(e){var r=u.resolve(e);i(r).then(function(e){return s(e)}).then(function(e){return o(r,e)}).then(function(){console.log("Done!")})["catch"](function(e){return console.log(e)})}function o(e,r){return new Promise(function(n,t){var o=u.join(e,"index.ts");c.writeFile(o,r,function(e){e&&t(e),n()})})}function s(e){return new Promise(function(r,n){var t=e.filter(function(e){return e.indexOf("index")===-1}).map(function(e){return e.slice(0,e.length-3)}).map(function(e){return"import { routes as "+e+" } from './"+e+"';\r\n"}).reduce(function(e,r){return e.concat(r)},"import { Route } from '../src/router';\r\n"),o=e.filter(function(e){return e.indexOf("index")===-1}).map(function(e){return e.slice(0,e.length-3)}),s="export const routes: Route[] = [].concat(..."+o.toString()+")",i=t.concat("\r\n").concat(s);r(i)})}function i(e){return new Promise(function(r,n){c.readdir(e,function(e,t){e&&n(e),r(t)})})}var u=n(1),c=n(0);r.exportRoutes=t},function(e,r,n){"use strict";var t=n(10);r.exportPolicies=t.exportPolicies;var o=n(11);r.exportRoutes=o.exportRoutes},function(e,r,n){"use strict";var t=n(3);r.ErrorHandler=t.ErrorHandler},function(e,r){e.exports=require("mime")},function(e,r,n){"use strict";function t(e,r,n,t,d,v,m,h,q){void 0===q&&(q="assets");var g=new o.Server,y=new s.Router(r),x=new i.PolicyEvaluator(n);return g.server(e).map(function(e){var r=e.res;return null!==d&&"undefined"!=typeof d&&"array"==typeof d?r.setHeader("Access-Control-Allow-Origin",d.join(",")):null!==d&&"undefined"!=typeof d&&"string"==typeof d&&r.setHeader("Access-Control-Allow-Origin",d),null!==t&&"undefined"!=typeof t&&r.setHeader("Access-Control-Allow-Methods",t.join(",")),null!==v&&"undefined"!=typeof v&&r.setHeader("Access-Control-Allow-Headers",v.join(",")),"OPTIONS"===e.req.method&&(e.res.writeHead(200),e.res.end()),null!==m&&"undefined"!=typeof m&&m.forEach(function(e){r.setHeader(e.key,e.value)}),r.sendFile=function(r,n,t){var o=f.createReadStream(r);e.res.setHeader("Content-Type",n),null!==t&&"undefined"!=typeof t&&e.res.setHeader("Content-Length",""+t),e.res.writeHead(200),o.pipe(e.res)},null!==h&&"undefined"!=typeof h?r.render=function(e,r){h(e,r)}:r.render=function(e){r.writeHead(200,{"Content-Type":"text/html"}),r.end(e)},{req:e.req,res:r}}).map(function(e){var r="^/"+q+"/?[^s]+",n=e.req.url.match(r),t=null!==n;if(t){var o=l.lookup(e.req.url),s=p.join(process.cwd(),e.req.url),i=f.statSync(s);return e.res.sendFile(s,o,i.size),{req:e.req,res:e.res,pass:!1}}return e}).map(function(e){var r={req:"GET"!==e.req.method.toUpperCase()?c.RequestExtractor.extract(e.req):e.req,res:e.res,pass:e.pass};return r}).map(function(e){return y.match(e)})["switch"]().map(function(e){var r=new u.ResponseLoader(e.reqres.res),n=r.load(),t="GET"===e.reqres.req.method.toUpperCase()?c.RequestExtractor.extract(e.reqres.req):e.reqres.req,o={route:e.route,reqres:{req:t,res:n,pass:e.reqres.pass}};return o}).map(function(e){return x.evaluate(e)})["switch"]().map(function(e){var r={pass:e.pass,exec:e.reqres.pass,req:e.reqres.req,res:e.reqres.res,route:e.route};return r}).map(function(e){return console.log(e.exec,e.pass),e.pass||!e.exec&&"undefined"!=typeof e.exec?e:(a.ErrorHandler.policyError(e.req,e.res),e)})}var o=n(8),s=n(7),i=n(4),u=n(6),c=n(5),a=n(3),p=n(1),f=n(0),l=n(14);r.createServer=t;var d=n(8);r.Server=d.Server;var v=n(12);r.exportPolicies=v.exportPolicies,r.exportRoutes=v.exportRoutes;var m=n(13);r.ErrorHandler=m.ErrorHandler;var h=n(5);r.RequestExtractor=h.RequestExtractor;var q=n(6);r.ResponseLoader=q.ResponseLoader;var g=n(9);r.RequestHandler=g.RequestHandler;var y=n(7);r.Router=y.Router;var x=n(4);r.PolicyEvaluator=x.PolicyEvaluator},function(e,r){e.exports=require("http")},function(e,r){e.exports=require("https")},function(e,r){e.exports=require("url")},function(e,r,n){"use strict";var t=n(22);r.policies=[].concat.apply([],t.policies)},function(e,r,n){"use strict";var t=n(23);r.routes=[].concat.apply([],t.routes)},function(e,r,n){"use strict";var t=n(0),o=n(24),s=function(){function e(){}return e.main=function(e,r){t.readJSON("../hrm/src/assets/sandbox.json",function(e,n){var t=(n.map(function(e){return e.name}),o.renderFile("views/main.pug",n));r.render(t)})},e.post=function(e,r){var n=e.body.subscribe(function(e){r.json(e)},function(){n.unsubscribe()},function(e){return console.log(e)})},e.getById=function(e,r){var n=e.params;console.log(n),r.json(n)},e.getByIdAndUsername=function(e,r){var n=e.params;console.log(n),r.json(n)},e}();r.HomeHandler=s},function(e,r){"use strict";r.policies=[{name:"main",method:function(){return!0}}]},function(e,r,n){"use strict";var t=n(21);r.routes=[{path:"/",verb:"GET",handler:t.HomeHandler.main,policies:["main"]},{path:"/",verb:"POST",handler:t.HomeHandler.post,policies:["main"]},{path:"/:id",verb:"GET",handler:t.HomeHandler.getById,policies:[]},{path:"/:id/:username",verb:"GET",handler:t.HomeHandler.getByIdAndUsername,policies:[]}]},function(e,r){e.exports=require("pug")},function(e,r,n){"use strict";var t=n(20),o=n(19),s=n(9),i=n(15);i.createServer(3e3,t.routes,o.policies,null,"10.*").subscribe(function(e){s.RequestHandler.handle(e)})}]);
//# sourceMappingURL=test.js.map