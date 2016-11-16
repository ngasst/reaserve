export class Policy {
    static evaluate(policies: boolean[]) {
        if (policies.length < 1)
            return true;
        
        let result: number = policies
            .map(val => val.try() ? 0 : 1)
            .reduce((curr, prev) => curr + prev);

        let evaluation = result === 0 ? true : false;

        return evaluation;
    }
}