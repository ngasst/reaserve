import { ServerResponse } from 'http';
import { bad } from './bad';
import { forbidden } from './forbidden';
import { ok } from './ok';
import { payload } from './payload';
import { unauthorized } from './unauthorized';
import { error, ErrorMessages } from './error';

export let SoCustomResponses: any[] = [
    bad, forbidden, ok, payload, unauthorized
];


export interface SoResponse extends ServerResponse {
    payload?: (payload: any, message?: string) => void;
    ok?: (message?: string) => void;
    bad?: (message?: string) => void;
    unauthorized?: (message?: string) => void;
    forbidden?: (message?: string) => void;
    error?: () => ErrorMessages;
    json?: (json: Object) => void;
}