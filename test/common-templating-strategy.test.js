const {CommonTemplatingStrategy} = require('../query/templating-strategies');
describe('Common templating strategy', () => {
    const strategy = new CommonTemplatingStrategy();

    test('has empty prefix', () => {
        expect(strategy.getPrefix()).toBe('');
    });

    test('handles simple template with boolean true param', () => {
        const template = '{{template}}';
        const params = {
            additionName: 'template',
            additionSQL: 'replacer',
            additionOptions: {propertyValue: true},
        };

        expect(strategy.applyStrategy(template, params, true)).toBe('replacer');
        expect(strategy.applyStrategy(template, params, false)).toBe('');
        expect(strategy.applyStrategy(template, params, '')).toBe('');
        expect(strategy.applyStrategy(template, params, 'test')).toBe('');
        expect(strategy.applyStrategy(template, params, 123)).toBe('');
        expect(strategy.applyStrategy(template, params, {})).toBe('');
        expect(strategy.applyStrategy(template, params, 1.1)).toBe('');
        expect(strategy.applyStrategy(template, params, null)).toBe('');
        expect(strategy.applyStrategy(template, params, undefined)).toBe('');

    });

    test('handles simple template with boolean false param', () => {
        const template = '{{template}}';
        const params = {
            additionName: 'template',
            additionSQL: 'replacer',
            additionOptions: {propertyValue: false},
        };

        expect(strategy.applyStrategy(template, params, true)).toBe('');
        expect(strategy.applyStrategy(template, params, false)).toBe('replacer');
        expect(strategy.applyStrategy(template, params, '')).toBe('');
        expect(strategy.applyStrategy(template, params, 'test')).toBe('');
        expect(strategy.applyStrategy(template, params, 123)).toBe('');
        expect(strategy.applyStrategy(template, params, {})).toBe('');
        expect(strategy.applyStrategy(template, params, 1.1)).toBe('');
        expect(strategy.applyStrategy(template, params, null)).toBe('');
        expect(strategy.applyStrategy(template, params, undefined)).toBe('');
    });

    test('handles simple template with non-empty string param', () => {
        const template = '{{template}}';
        const params = {
            additionName: 'template',
            additionSQL: 'replacer',
            additionOptions: {propertyValue: 'test'},
        };

        expect(strategy.applyStrategy(template, params, true)).toBe('');
        expect(strategy.applyStrategy(template, params, false)).toBe('');
        expect(strategy.applyStrategy(template, params, '')).toBe('');
        expect(strategy.applyStrategy(template, params, 'test')).toBe('replacer');
        expect(strategy.applyStrategy(template, params, 123)).toBe('');
        expect(strategy.applyStrategy(template, params, {})).toBe('');
        expect(strategy.applyStrategy(template, params, 1.1)).toBe('');
        expect(strategy.applyStrategy(template, params, null)).toBe('');
        expect(strategy.applyStrategy(template, params, undefined)).toBe('');
    });

    test('handles simple template with empty string param', () => {
        const template = '{{template}}';
        const params = {
            additionName: 'template',
            additionSQL: 'replacer',
            additionOptions: {propertyValue: ''},
        };

        expect(strategy.applyStrategy(template, params, true)).toBe('');
        expect(strategy.applyStrategy(template, params, false)).toBe('');
        expect(strategy.applyStrategy(template, params, '')).toBe('replacer');
        expect(strategy.applyStrategy(template, params, 'test')).toBe('');
        expect(strategy.applyStrategy(template, params, 123)).toBe('');
        expect(strategy.applyStrategy(template, params, {})).toBe('');
        expect(strategy.applyStrategy(template, params, 1.1)).toBe('');
        expect(strategy.applyStrategy(template, params, null)).toBe('');
        expect(strategy.applyStrategy(template, params, undefined)).toBe('');
    });

    test('handles simple template with number param', () => {
        const template = '{{template}}';
        const params = {
            additionName: 'template',
            additionSQL: 'replacer',
            additionOptions: {propertyValue: 123},
        };

        expect(strategy.applyStrategy(template, params, true)).toBe('');
        expect(strategy.applyStrategy(template, params, false)).toBe('');
        expect(strategy.applyStrategy(template, params, '123')).toBe('');
        expect(strategy.applyStrategy(template, params, 'test')).toBe('');
        expect(strategy.applyStrategy(template, params, 123)).toBe('replacer');
        expect(strategy.applyStrategy(template, params, {})).toBe('');
        expect(strategy.applyStrategy(template, params, 1.1)).toBe('');
        expect(strategy.applyStrategy(template, params, null)).toBe('');
        expect(strategy.applyStrategy(template, params, undefined)).toBe('');
    });

    test ('handles simple template without parameter', () => {
        const template = '{{template}}';
        const params = {
            additionName: 'template',
            additionSQL: 'replacer',
            additionOptions: {},
        };

        expect(strategy.applyStrategy(template, params, true)).toBe('replacer');
        expect(strategy.applyStrategy(template, params, false)).toBe('');
        expect(strategy.applyStrategy(template, params, '123')).toBe('replacer');
        expect(strategy.applyStrategy(template, params, 'test')).toBe('replacer');
        expect(strategy.applyStrategy(template, params, 123)).toBe('replacer');
        expect(strategy.applyStrategy(template, params, {})).toBe('replacer');
        expect(strategy.applyStrategy(template, params, 1.1)).toBe('replacer');
        expect(strategy.applyStrategy(template, params, null)).toBe('');
        expect(strategy.applyStrategy(template, params, undefined)).toBe('');
    })
});
