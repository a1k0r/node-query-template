/**
 * Abstraction of parameter-generator classes
 */
class AbstractParametrizingStrategy {
    /**
     * @constructor
     * @param {Object} paramValues obj
     */
    constructor(paramValues = {}) {
        /**
         * @type Array
         * @protected
         */
        this._addedParams = [];
        /**
         * @type String
         * @protected
         */
        this._replacement = '';

        /**
         * RDBMS type
         * @type {string}
         * @protected
         */
        this._type = '';

        if (new.target === AbstractParametrizingStrategy) {
            throw new TypeError(`Can't create instance of abstract class`);
        }
    }

    /**
     * @returns {string} rdbms type of this parametrizer
     */
    getType() {
        return this._type;
    }

    /**
     * @abstract
     * @param {*} value of param
     * @returns {String} replacement
     */
    addParameter(value) {
        throw new TypeError('This method must be overridden');
    }

    /**
     * @returns {Array} result array of params
     */
    getParams() {
        return this._addedParams;
    }
}

module.exports = AbstractParametrizingStrategy;
