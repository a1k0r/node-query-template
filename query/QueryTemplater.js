// const escapeParams = require('./escapeParams.js');
const templatingStrategies = require('./templating-strategies');
/**
 * @class
 */
class QueryTemplater {
    /**
     * @constructor
     */
    constructor() {
        // TODO: think about query cache adding
        this._paramSearchRegex = /\{\{(#)?([-\w]+)\}\}/gui;
        /** @type Map<String,AbstractTemplatingStrategy> */
        this._templatingStrategies = new Map();

        this._initTemplatingStrategies();
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
     * @param {string} querySQL sql
     * @param {Object} buildParams params to build query
     * @param {Object} addons addons definition
     * @returns {String} built query
     * @private
     */
    _processQuery({sql: querySQL, addons}, buildParams) {
        let resultQuery = querySQL;
        let matchArray;
        while ((matchArray = this._paramSearchRegex.exec(querySQL)) !== null) {
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
     * @param {String} name queryName
     * @param {Object} buildParams queryTemplateParams
     * @param {String} sql queryText
     * @param {Object} addons queryTemplateAddons
     * @returns {String} built query
     */
    buildQuery({name, sql, addons}, buildParams) {
        return this._processQuery({sql, addons}, buildParams);
    }
}

module.exports = QueryTemplater;
