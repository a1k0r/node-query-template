const AbstractParametrizingStrategy = require('./abstract-parametrizing-strategy.js');

/**
 * Mysql parametrizer
 */
class MySQLParametrizingStrategy extends AbstractParametrizingStrategy {
    /**
     * @inheritDoc
     */
    constructor() {
        super();
        this._type = 'mysql';
        this._replacement = '?';
    }

    /**
     * @inheritDoc
     */
    addParameter(value) {
        this._addedParams.push(value);
        return this._replacement;
    }
}

module.exports = MySQLParametrizingStrategy;
