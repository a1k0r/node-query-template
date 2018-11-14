const BaseParameterizer = require('./base-parameterizer');

class PgParameterizer extends BaseParameterizer {
    /**
     * @constructor
     */
    constructor() {
        super();
        this.type = 'pg';
        this._regex = new RegExp(/:(\w+)/g);
    }

    /**
     * @inheritDoc
     */
    parameterize(query, params) {
        const resultParams = [];
        let resultQuery = query;

        let index = 0;
        for (const param of Object.keys(params)) {
            const rexp = new RegExp(`:${param}`, 'gu');
            if (rexp.test(query)) {
                resultParams.push(params[param]);
                resultQuery = resultQuery.replace(rexp, `$${++index}`);
            }
        }

        return {
            query: resultQuery,
            params: resultParams,
        };
    }
}

module.exports = PgParameterizer;
