module.exports=function(n){function t(e){if(r[e])return r[e].exports;var o=r[e]={i:e,l:!1,exports:{}};return n[e].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var r={};return t.m=n,t.c=r,t.i=function(n){return n},t.d=function(n,t,r){Object.defineProperty(n,t,{configurable:!1,enumerable:!0,get:r})},t.n=function(n){var r=n&&n.__esModule?function(){return n.default}:function(){return n};return t.d(r,"a",r),r},t.o=function(n,t){return Object.prototype.hasOwnProperty.call(n,t)},t.p="",t(t.s=28)}({1:function(n,t){n.exports=require("fs-extra")},2:function(n,t){n.exports=require("path")},28:function(n,t,r){"use strict";function e(n){var t=u.resolve(n);c(t).then(function(n){return i(n)}).then(function(n){return o(t,n)}).then(function(){console.log("Done!")}).catch(function(n){return console.log(n)})}function o(n,t){return new Promise(function(r,e){var o=u.join(n,"index.ts");f.writeFile(o,t,function(n){n&&e(n),r()})})}function i(n){return new Promise(function(t,r){var e=n.filter(function(n){return n.indexOf("index")===-1}).map(function(n){return n.slice(0,n.length-3)}).map(function(n){return"import { policies as "+n+" } from './"+n+"';\r\n"}).reduce(function(n,t){return n.concat(t)},"import { Policy } from '../src/policy';\r\n"),o=n.filter(function(n){return n.indexOf("index")===-1}).map(function(n){return n.slice(0,n.length-3)}),i="export const policies: Policy[] = [].concat(..."+o.toString()+")",c=e.concat("\r\n").concat(i);t(c)})}function c(n){return new Promise(function(t,r){f.readdir(n,function(n,e){n&&r(n),t(e)})})}var u=r(2),f=r(1);t.exportPolicies=e}});