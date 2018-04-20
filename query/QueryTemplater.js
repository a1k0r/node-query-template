// const escapeParams = require('./escapeParams.js');
const templatingStrategies = require('./templating-strategies');
const {PostgresParametrizingStrategy} = require('./parametrizing-strategies');
/**
 * @class
 */
class QueryTemplater {
    /**
     * @constructor
     */
    constructor() {
        // TODO: think about query cache adding
        this._templateSearchRegex = /\{\{(#)?([-\w]+)\}\}/gui;
        this._paramSearchRegex = //gu
        /** @type Map<String,AbstractTemplatingStrategy> */
        this._templatingStrategies = new Map();
        /** @type Map<String,AbstractParametrizingStrategy.class> */
        this._parametrizingStrategies = new Map();

        this._initTemplatingStrategies();
        this._initParametrizingStrategies();
    }

    /**
     * @protected
     */
    _initTemplatingStrategies() {
        for (const tsName of Object.keys(templatingStrategies)) {
            /** @type AbstractTemplatingStrategy */
            const strategy = new templatingStrategies[tsName]();
            this._templatingStrategies.set(strategy.getPrefix(), strategy);
        }
    }

    _initParametrizingStrategies() {
        this._parametrizingStrategies.set('pg', PostgresParametrizingStrategy);
    }

    /**
     * @param {string} querySQL sql
     * @param {Object} buildParams params to build query
     * @param {Object} addons addons definition
     * @returns {String} built query
     * @private
     */
    _processQuery({sql: querySQL, addons}, buildParams) {
        let resultQuery = querySQL;
        let matchArray;
        while ((matchArray = this._templateSearchRegex.exec(querySQL)) !== null) {
            const [, prefix = '', additionName] = matchArray;
            const addon = addons[additionName];
            if (addon) {
                const {sql: additionSQL, options: additionOptions} = addon;
                const additionParam = buildParams[additionOptions.propertyName];

                const strategyParam = {
                    additionName,
                    additionSQL,
                    additionOptions,
                };

                resultQuery = this._templatingStrategies.get(prefix)
                    .applyStrategy(resultQuery, strategyParam, additionParam);
                continue;
            }
            throw new TypeError(`Addon ${additionName} is not presented in query definition`);
        }
        return resultQuery;
    }

    _parametrizeQuery(sql, params, type = 'pg') {
        let query = sql;
        const Strategy = this._parametrizingStrategies.get(type);
        if (!Strategy) {
            throw new TypeError(`Invalid param generation type ${type}`);
        }

        const strat = new Strategy();
        for (const paramName of Object.keys(params)) {
            const pVal = strat.addParameter(params[paramName]);
            query = query.replace(`:${paramName}`, pVal);
        }
        return query;
    }

    /**
     * @param {String} name queryName
     * @param {Object} buildParams queryTemplateParams
     * @param {String} sql queryText
     * @param {Object} addons queryTemplateAddons
     * @returns {String} built query
     */
    buildQuery({type, sql, addons}, buildParams) {
        const result = this._processQuery({sql, addons}, buildParams);
    }
}

module.exports = QueryTemplater;
