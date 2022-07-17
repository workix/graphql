/** @format */
const { QueryTypes } = require('sequelize');
const _ = require('lodash');

/**
 * Batch insert
 * @param tableName
 * @param popData
 * @param connection
 * @returns {*}
 */
const batchInsert = async (tableName, popData, connection) => {
  let queryString = `INSERT INTO "{table}" ({keys}) VALUES {values} RETURNING *;`;
  let keys = [];
  let values = [];
  let dataValues = '';

  popData.forEach(item => {
    keys.push(Object.keys(item));
    values.push(Object.values(item));
  });

  keys = [].concat(...keys);
  keys = _.uniq(keys);

  const insertAt = (str, index, value) => {
    return str.substr(0, index) + value + str.substr(index);
  };

  values.forEach((item, i) => {
    item.forEach((v, idx) => {
      if (typeof v === 'string' && (!v.startsWith('(') && !v.endsWith(')'))) {
        item[idx] = "'" + v + "'";
      } else if (v instanceof Date) {
        item[idx] = "'" + v.toISOString() + "'";
      } else if (v == null || v == undefined) {
        item[idx] = 'null';
      }
    });

    let line = '(' + item.toString() + ')';
    if (values.length > 1 && i < values.length - 1) {
      line = insertAt(line, line.length, ',');
    }
    dataValues += line;
  });

  queryString = queryString.replace('{table}', tableName);
  queryString = queryString.replace('{values}', dataValues);
  queryString = queryString.replace('{keys}', keys.toString());

  return connection.query(queryString, { type: QueryTypes.INSERT });
};

const insert = async (tableName, data, connection) => {
  let queryString = `INSERT INTO "{table}" ({keys}) VALUES {values} RETURNING *;`;
  let keys = [];
  let values = [];
  let dataValues = '';

  keys.push(Object.keys(data));
  values.push(Object.values(data));

  keys = [].concat(...keys);
  keys = _.uniq(keys);

  const insertAt = (str, index, value) => {
    return str.substr(0, index) + value + str.substr(index);
  };

  values.forEach((item, i) => {
    item.forEach((v, idx) => {
      if (typeof v === 'string' && (!v.startsWith('(') && !v.endsWith(')'))) {
        item[idx] = "'" + v + "'";
      } else if (v instanceof Date) {
        item[idx] = "'" + v.toISOString() + "'";
      } else if (v == null || v == undefined) {
        item[idx] = 'null';
      }
    });

    let line = '(' + item.toString() + ')';

    if (values.length > 1 && i < values.length - 1) {
      line = insertAt(line, line.length, ',');
    }
    dataValues += line;
  });

  queryString = queryString.replace('{table}', tableName);
  queryString = queryString.replace('{values}', dataValues);
  queryString = queryString.replace('{keys}', keys.toString());

  return connection.query(queryString, { type: QueryTypes.INSERT });
};

const update = async (tableName, data, connection) => {
  const { id } = data;
  let queryString = `UPDATE "{table}" SET {pairs} WHERE id = {id} RETURNING *;`;
  let pairs = [];
  let dataValues;

  Object.entries(data).forEach(([k, v]) => {
    if (k !== 'id') {
      if (typeof v === 'string' && (!v.startsWith('(') && !v.endsWith(')'))) {
        v = "'" + v + "'";
      } else if (v instanceof Date) {
        v = "'" + v.toISOString() + "'";
      }
      pairs.push(`${k}=${v}`);
    }
  });

  dataValues = pairs.join(',');

  queryString = queryString.replace('{table}', tableName);
  queryString = queryString.replace('{pairs}', dataValues);
  queryString = queryString.replace('{id}', id);

  return connection.query(queryString, { type: QueryTypes.UPDATE });
};

const insertOrUpdate = async (tableName, data, connection) => {
  const { id } = data;

  if (id) {
    return update(tableName, data, connection);
  } else {
    return insert(tableName, data, connection);
  }
};

const select = async (tableName, options, connection) => {
  const { select, limit, offset, join, where } = options;
  let queryString = `SELECT {fields} FROM "{table}"`;

  queryString = queryString.replace('{table}', tableName);

  if (select) {
    const selects = [];
    select.forEach(s => {
      const { table, column, as } = s;
      selects.push(`"${table}".${column} as ${as || column}`);
    });
    queryString = queryString.replace('{fields}', selects.join(', '));
  } else {
    queryString = queryString.replace('{fields}', '*');
  }

  if (join) {
    join.forEach(j => {
      const { on, type, target } = j;
      const [k, v] = on.split('=');
      const joinType = type || 'INNER JOIN';
      queryString = `${queryString} ${joinType} "${target}" ON ${k.trim()} = ${v.trim()}`;
    });
  }

  if (where) {
    queryString = `${queryString} WHERE ${where}`;
  }

  if (limit && offset) {
    queryString = `${queryString} LIMIT ${limit} OFFSET ${offset}`;
  } else if (limit) {
    queryString = `${queryString} LIMIT ${limit}`;
  }

  return connection.query(queryString, { type: QueryTypes.SELECT });
};

const exclude = async (tableName, options, connection) => {
  let queryString = `DELETE FROM "{table}" WHERE {conditions} RETURNING *`;
  const { id, literal } = options;

  queryString = queryString.replace('{table}', tableName);

  if (id) {
    queryString = queryString.replace('{conditions}', `id = ${id}`);
  } else if (literal) {
    queryString = queryString.replace('{conditions}', literal);
  } else {
    queryString = queryString.replace('WHERE {conditions}', '');
  }

  return connection.query(queryString, { type: QueryTypes.DELETE });
};

module.exports = { batchInsert, insert, update, insertOrUpdate, select, exclude };
