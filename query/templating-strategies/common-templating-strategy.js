const AbstractTemplatingStrategy = require('./abstract-templating-strategy.js');

/**
 * @class
 */
class CommonTemplatingStrategy extends AbstractTemplatingStrategy {
    /**
     * @inheritDoc
     */
    applyStrategy(query, {additionName, additionSQL, additionOptions}, propertyValue) {
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
