const AbstractTemplatingStrategy = require('./abstract-templating-strategy.js');

/**
 * @class
 */
class CommonTemplatingStrategy extends AbstractTemplatingStrategy {
    /**
     * @inheritDoc
     */
    constructor() {
        super();
        /**
         * @type {string}
         * @protected
         */
        this._leadingSequence = ':';
    }

    /**
     * @inheritDoc
     */
    applyStrategy(query, {additionName, additionSQL, additionOptions}, propertyValue, paramContainer) { // todo pass param container
        if (!paramContainer) {
            throw new TypeError(`Invalid param container passed`);
        }


        let buildAddition = false;
        if (additionOptions && (additionOptions.propertyValue !== undefined)) {
            buildAddition = additionOptions.propertyValue === propertyValue;
        } else {
            buildAddition = !!propertyValue;
        }
        return this.replaceInQuery(additionName, query, buildAddition ? additionSQL : '');
    }
}

module.exports = CommonTemplatingStrategy;
