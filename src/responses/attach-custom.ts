import { ServerResponse } from 'http';
import {  payload } from './payload';
import {  ok } from './ok';
import {  unauthorized } from './unauthorized';
import {  forbidden } from './forbidden';
import {  bad } from './bad';
import {  error } from './error';
import {  json } from './json';

export function attachCustomResponses(res: ServerResponse) {
    res['payload'] = payload;
    res['ok'] = ok;
    res['unauthorized'] = unauthorized;
    res['forbidden'] = forbidden;
    res['bad'] = bad;
    res['error'] = error;
    res['json'] = json;

    return res;
}