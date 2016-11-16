import { SoRequest } from '../requests';
export { authenticated } from './auth.policy';
export { Policy } from './policy';

export interface SoPolicy {
    try: (req: SoRequest) => boolean; 
}