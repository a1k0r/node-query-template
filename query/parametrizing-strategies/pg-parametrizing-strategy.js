const AbstractParametrizingStrategy = require('./abstract-parametrizing-strategy.js');

/**
 * Postgres parametrizer
 */
class PostgresParametrizingStrategy extends AbstractParametrizingStrategy {
    /**
     * @inheritDoc
     */
    constructor() {
        super();
        this._type = 'pg';
        this._replacement = '$';
    }

    /**
     * @inheritDoc
     */
    addParameter(value) {
        this._addedParams.push(value);
        return `${this._replacement}${this._addedParams.length}`;
    }
}

module.exports = PostgresParametrizingStrategy;
