const templatingStrategies = require('./templating-strategies');
const {PostgresParametrizingStrategy} = require('./parametrizing-strategies');

const parameterizers = require('./parameterizers');

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
        /** @type Map<String,AbstractTemplatingStrategy> */
        this._templatingStrategies = new Map();
        /** @type Map<String,BaseParameterizer> */
        this._parameterizers = new Map();

        this._initTemplatingStrategies();
        this._initParameterizers();
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

    /**
     * @protected
     */
    _initParameterizers() {
        for (const par in parameterizers) {
            if (Object.prototype.hasOwnProperty.call(parameterizers, par)) {
                const param = new parameterizers[par];
                this._parameterizers.set(param.type, param);
            }
        }
    }

    /**
     * @param {string} querySQL sql
     * @param {Object} buildParams params to build query
     * @param {Object} addons addons definition
     * @returns {String} built query
     */
    processTemplates({sql: querySQL, addons}, buildParams) {
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


    /**
     * @param {String} sql query text
     * @param {Object} params query params
     * @param {String} type parametrization algorithm type
     * @returns {{query:String,params:Array}} query and params ready-to-insert in db query method
     */
    parametrizeQuery(sql, params, type = 'pg') {
        if (this._parameterizers.has(type)) {
            const parameterizer = this._parameterizers.get(type);
            const result = parameterizer.parameterize(sql, params);
            return result;
        }

        throw new TypeError(`No parameterizer found for query type ${type}`);
    }

    /**
     * @param {String} name queryName
     * @param {Object} buildParams queryTemplateParams
     * @param {String} sql queryText
     * @param {Object} addons queryTemplateAddons
     * @returns {{query:String,params:Array}} built query
     */
    buildQuery({type, sql, addons}, buildParams) {
        const result = this.processTemplates({sql, addons}, buildParams);
        const parametrized = this.parametrizeQuery(result, buildParams, type);
        return parametrized;
    }
}

module.exports = QueryTemplater;
