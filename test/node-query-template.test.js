const QueryTemplater = require('../query/QueryTemplater.js');

describe('Library parameterizer with pg type', () => {
    const templater = new QueryTemplater();

    test('should handle simple pg query without templates', () => {
        const simpleQuery = {
            sql: 'SELECT * FROM table WHERE id = :id',
            type: 'pg',
        };

        const simpleParams = {
            id: 1,
        };

        const {query, params} = templater.parametrizeQuery(simpleQuery.sql, simpleParams, simpleQuery.type);

        expect(query).toBe('SELECT * FROM table WHERE id = $1');
        expect(params).toMatchObject([1]);
    });

    test('should handle query with unknown type', () => {
        const simpleQuery = {
            sql: 'SELECT * FROM table WHERE id = :id',
            type: 'ch',
        };

        const simpleParams = {
            id: 1,
        };

        expect(() => templater.parametrizeQuery(simpleQuery.sql, simpleParams, simpleQuery.type)).toThrowError(/ch/);
    });

    test('should not wrap non-presented params', () => {
        const simpleQuery = {
            sql: 'SELECT * FROM table WHERE id = :id',
            type: 'pg',
        };

        const simpleParams = {
        };

        const {query, params} = templater.parametrizeQuery(simpleQuery.sql, simpleParams, simpleQuery.type);

        expect(query).toBe('SELECT * FROM table WHERE id = :id');
        expect(params).toMatchObject([]);
    });

    test('should not touch addons', () => {
        const simpleQuery = {
            sql: 'SELECT * FROM table WHERE money = :money {{rank}}',
            type: 'pg',
            addons: {
                rank: {
                    sql: 'AND rank < :rank',
                    additionOptions: {propertyName: 'rank'},
                },
            },
        };

        const simpleParams = {
            money: 1000,
            rank: 10,
        };

        const {query, params} = templater.parametrizeQuery(simpleQuery.sql, simpleParams, simpleQuery.type);

        expect(query).toBe('SELECT * FROM table WHERE money = $1 {{rank}}');
        expect(params).toMatchObject([1000]);
    });

    test('should have valid params output on repeated params', () => {
        const simpleQuery = {
            sql: ':id :name :value :id :id :id :name :value',
            type: 'pg',
        };

        const simpleParams = {
            id: 1,
            name: 'test',
            value: 0.1,
        };

        const {query, params} = templater.parametrizeQuery(simpleQuery.sql, simpleParams, simpleQuery.type);

        expect(query).toBe('$1 $2 $3 $1 $1 $1 $2 $3');
        expect(params).toMatchObject([1, 'test', 0.1]);
    });
});

describe('Library parameterizer with mysql type', () => {
    const templater = new QueryTemplater();

    test('should handle simple mysql query without templates', () => {
        const simpleQuery = {
            sql: 'SELECT * FROM table WHERE id = :id',
            type: 'mysql',
        };

        const simpleParams = {
            id: 1,
        };

        const {query, params} = templater.parametrizeQuery(simpleQuery.sql, simpleParams, simpleQuery.type);

        expect(query).toBe('SELECT * FROM table WHERE id = ?');
        expect(params).toMatchObject([1]);
    });

    test('should throw on non-presented params', () => {
        const simpleQuery = {
            sql: 'SELECT * FROM table WHERE id = :id',
            type: 'mysql',
        };

        const simpleParams = {
        };

        expect(() => templater.parametrizeQuery(simpleQuery.sql, simpleParams, simpleQuery.type)).toThrow();
    });

    test('should not touch addons', () => {
        const simpleQuery = {
            sql: 'SELECT * FROM table WHERE money = :money {{rank}}',
            type: 'mysql',
            addons: {
                rank: {
                    sql: 'AND rank < :rank',
                    additionOptions: {propertyName: 'rank'},
                },
            },
        };

        const simpleParams = {
            money: 1000,
            rank: 10,
        };

        const {query, params} = templater.parametrizeQuery(simpleQuery.sql, simpleParams, simpleQuery.type);

        expect(query).toBe('SELECT * FROM table WHERE money = ? {{rank}}');
        expect(params).toMatchObject([1000]);
    });

    test('should have valid params output on repeated params', () => {
        const simpleQuery = {
            sql: ':id :name :value :id :id :id :name :value',
            type: 'mysql',
        };

        const simpleParams = {
            id: 1,
            name: 'test',
            value: 0.1,
        };

        const {query, params} = templater.parametrizeQuery(simpleQuery.sql, simpleParams, simpleQuery.type);

        expect(query).toBe('? ? ? ? ? ? ? ?');
        expect(params).toMatchObject([1, 'test', 0.1, 1, 1, 1, 'test', 0.1]);
    });
});

describe('Library templater', () => {
    const templater = new QueryTemplater();
    test('should handle simple query with templates', () => {
        const simpleQuery = {
            sql: 'SELECT * FROM table WHERE money = :money {{rank}}',
            type: 'pg',
            addons: {
                rank: {
                    sql: 'AND rank < :rank',
                    options: {propertyName: 'rank'},
                },
            },
        };

        const simpleParams = {
            money: 1000,
            rank: 10,
        };

        const query = templater.processTemplates(simpleQuery, simpleParams);

        expect(query).toBe('SELECT * FROM table WHERE money = :money AND rank < :rank');
    });

    test('should handle query with repeated templates', () => {
        const simpleQuery = {
            sql: '{{rank}} {{rank}}',
            type: 'pg',
            addons: {
                rank: {
                    sql: 'AND rank < :rank',
                    options: {propertyName: 'rank'},
                },
            },
        };

        const simpleParams = {
            money: 1000,
            rank: 10,
        };

        const query = templater.processTemplates(simpleQuery, simpleParams);

        expect(query).toBe('AND rank < :rank AND rank < :rank');
    });

    test('should handle multiple templates based on one param', () => {
        const simpleQuery = {
            sql: '{{t1}}{{t2}}',
            type: 'pg',
            addons: {
                t1: {
                    sql: 'T1',
                    options: {propertyName: 'tt', propertyValue: true},
                },

                t2: {
                    sql: 'T2',
                    options: {propertyName: 'tt', propertyValue: false},
                },
            },
        };

        expect(templater.processTemplates(simpleQuery, {tt: true})).toBe('T1');
        expect(templater.processTemplates(simpleQuery, {tt: false})).toBe('T2');
    });

    test('should throw an error if template is not presented in definition', () => {
        const simpleQuery = {
            sql: '{{t1}}{{t2}}',
            type: 'pg',
            addons: {
                t1: {
                    sql: 'T1',
                    options: {propertyName: 'tt', propertyValue: true},
                },
            },
        };

        expect(() => templater.processTemplates(simpleQuery, {tt: true})).toThrowError(/t2/);
    });
});
