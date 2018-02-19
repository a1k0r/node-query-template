const AbstractTemplatingStrategy = require('./abstract-templating-strategy.js');
const escapeParams = require('../escapeParams');
/**
 * @class
 */
class CyclicTemplatingStrategy extends AbstractTemplatingStrategy {
    /**
     * @constructor
     */
    constructor() {
        super();
        this._leadingSequence = '#';
    }

    /**
     * @param {string} additionSQL additionSQL
     * @param {array<object>} propertyValue propertyValue
     * @param {string} delimiter delimiter
     * @returns {string} built replacement
     * @private
     */
    _createQueryTemplate(additionSQL, propertyValue, delimiter) {
        return propertyValue.reduce((res, elem, idx) => {
            const delim = idx === 0 ? '' : delimiter;
            return `${res} ${delim} ${escapeParams(additionSQL, elem)}`.trim();
        }, '');
    }

    /**
     * @inheritDoc
     */
    applyStrategy(query, {additionName, additionSQL, additionOptions}, propertyValue) {
        if (additionOptions && additionOptions.delimiter) {
            const {delimiter} = additionOptions;
            if (Array.isArray(propertyValue)) {
                const replacement = this._createQueryTemplate(additionSQL, propertyValue, delimiter);
                return this.replaceInQuery(additionName, query, replacement);
            }
            throw new TypeError(`For cyclic template parameter value must be array type!`);
        }
        throw new TypeError('Delimiter is not set!');
    }
}

module.exports = CyclicTemplatingStrategy;
