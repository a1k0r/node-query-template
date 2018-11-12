class BaseParameterizer {
    /**
     * @constructor
     */
    constructor() {
        this.type = '';
    }

    /**
     * @abstract
     * @param {String} query query text
     * @param {Object} params query params
     * @returns {{query: String, params: Array}} res
     */
    parameterize(query, params) {
        // abstract
    }
}

module.exports = BaseParameterizer;