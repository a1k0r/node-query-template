# node-query-template
> Node.js library for SQL queries templating and parameters escaping

[![NPM Version][npm-image]][npm-url]

## Installation

```sh
npm install node-query-template
```

## Features

* Simple templating, f.e. `{{templateName}}`
* Cyclic templates by `#` prefix, f.e. iteration over array of objects and passing it to query
* Named parameters escaping, f.e. `:namedParameter`

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
const {QueryTemplater, escapeParams} = require('query-template');

const qt = new QueryTemplater();

const sqlWithBalance = qt.buildQuery(getUsersByScore, {needBalance: true}); // => SELECT id FROM users WHERE score > :score AND balance >= :minBalance;
const sqlWithoutBalance = qt.buildQuery(getUsersByScore, {}); // => SELECT id FROM users WHERE score > :score;

```

### Param escaping example

```js
const builtSQL = escapeParams(sqlWithBalance, {score: 10, minBalance: 150}) // => SELECT id FROM users WHERE score > '10' AND balance >= '150';
```

### Query with cyclic template example

## Author

Pavel Romanov -- alkor@alkor.pw -- [GitHub](https://github.com/Shikyaro)

## License

Distributed under MIT License. See [`LICENSE`](./LICENSE) for more information;

[npm-image]: https://img.shields.io/npm/v/query-template.svg?style=flat-square
[npm-url]: https://npmjs.org/package/query-template