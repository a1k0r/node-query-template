const BaseParameterizer = require('./base-parameterizer');

class MysqlParameterizer extends BaseParameterizer {
    /**
     * @constructor
     */
    constructor() {
        super();
        this.type = 'mysql';
        this._regex = new RegExp(/:(\w+)/g);
    }

    /**
     * @inheritDoc
     * @throws Error when param is presented in query but not presented in values
     */
    parameterize(query, params) {
        const foundParams = query.match(this._regex);
        const resultParams = [];

        if (foundParams && foundParams.length) {
            for (const param of foundParams.map(par => par.slice(1))) {
                if (Object.prototype.hasOwnProperty.call(params, param)) {
                    resultParams.push(params[param]);
                } else {
                    throw new Error(`Param ${param} not presented`);
                }
            }

            const replaced = query.replace(this._regex, '?');
            return {
                query: replaced,
                params: resultParams,
            };
        }

        return {
            query,
            params: resultParams,
        };
    }
}

module.exports = MysqlParameterizer;
