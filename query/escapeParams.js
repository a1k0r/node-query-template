const arrayToList = (array, formatter) => {
    let sql = '';

    sql += '(';
    for (let i = 0; i < array.length; i++) {
        sql += (i === 0 ? '' : ', ') + formatter(array[i]);
    }
    sql += ')';

    return sql;
};

const processArray = (value, arrayFormattingRule = false) => {
    const temp = [];
    for (let i = 0; i < value.length; i++) {
        if (Array.isArray(value[i]) === true) {
            temp.push(arrayToList(value[i], escapeValue));
        } else {
            temp.push(escapeValue(value[i]));
        }
    }
    let stringArray = temp.toString();
    if (arrayFormattingRule) {
        stringArray = `array[${stringArray}]`;
    }
    return stringArray;
};
const wrapValue = value => {
    let resultValue = '\'';

    for (let i = 0; i < value.length; i++) {
        const char = value[i];
        if (char === '\'') {
            resultValue += char + char;
        } else if (char === '\\') {
            resultValue += char + char;
        } else {
            resultValue += char;
        }
    }

    resultValue += '\'';
    return resultValue;
};

const escapeValue = (value, type) => {
    let strVal = '';

    if (value === undefined || value === null) { // eslint-disable-line no-undefined
        return 'NULL';
    } else if (value === false) {
        return `'f'`;
    } else if (value === true) {
        return `'t'`;
    } else if (value instanceof Date) {
        return `'${value.toISOString()}'`;
    } else if (value instanceof Buffer) {
        return `E'\\\\x${value.toString('hex')}'`;
    } else if (Array.isArray(value) === true) {
        return processArray(value, type);
    } else if (value === Object(value)) {
        strVal = JSON.stringify(value);
    } else {
        strVal = value.toString().slice(0);
    }

    return wrapValue(strVal);
};

module.exports = (query, params) => {
    let rQuery = query;
    for (const param of Object.keys(params)) {
        // new RegExp need to replace all identical params in query
        rQuery = rQuery.replace(new RegExp(`:${param}`, 'gui'), () => escapeValue(params[param]));
    }

    return rQuery;
};
