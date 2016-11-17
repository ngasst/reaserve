import { Policy } from '../src/policy';
import { ReqRes } from '../src/server';

export const policies: Policy[] = [
    {
        name: 'main',
        method: () => true
    }
]