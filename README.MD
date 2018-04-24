# node-query-template
> Node.js library for SQL queries templating and parameters wrapping

[![NPM Version][npm-image]][npm-url]

## Installation

```sh
npm install node-query-template
```

## Features

* Simple templating, e.g. `{{templateName}}`
* Named parameters wrapping, e.g. `:namedParameter`
* Parameterizing and templating can be simply extended by adding new strategy

## Dependencies

* No dependencies

## Usage example

### Simple query definition example

```js
const getUsersByScore = {
    sql: `
        SELECT id
          FROM users
          WHERE score > :score
            {{balance}};
        `,
    addons: {
        balance: {
            options: {propertyName: 'needBalance', propertyValue: true},
            sql: 'AND balance >= :minBalance',
        },
    },
};
```

### Simple query building example

```js
const QueryTemplater = require('query-template');

const qt = new QueryTemplater();

const sqlWithBalance = qt.processTemplates(getUsersByScore, {needBalance: true}); 
// => SELECT id FROM users WHERE score > :score AND balance >= :minBalance;

const sqlWithoutBalance = qt.processTemplates(getUsersByScore, {}); 
// => SELECT id FROM users WHERE score > :score;

```

### Parametrizing example

```js
const builtSQL = qt.parametrizeQuery(sqlWithBalance, {score: 10, minBalance: 150})
```
Result:
```js
{
    query: 'SELECT id FROM users WHERE score > $1 AND balance >= $2',
    params: [10,150],
}
```

## Author

Pavel Romanov -- alkor@alkor.pw -- [GitHub](https://github.com/Shikyaro)

## License

Distributed under MIT License. See [`LICENSE`](./LICENSE) for more information;

[npm-image]: https://img.shields.io/npm/v/query-template.svg?style=flat-square
[npm-url]: https://npmjs.org/package/query-template