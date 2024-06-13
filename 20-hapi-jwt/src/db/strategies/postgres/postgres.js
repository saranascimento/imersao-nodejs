const { config } = require('dotenv');
const { join } = require('path');
const { ok } = require('assert');

const env = process.env.NODE_ENV || 'dev';
ok(env === 'prod' || env === 'dev', 'a env é invalida');

const configPath = join(__dirname, '../../../../config', `.env.${env}`);

config({
  path: configPath,
});

const ICrud = require('./../interfaces/interfaceCrud');
const Sequelize = require('sequelize');

class Postgres extends ICrud {
  constructor(connection, schema) {
    super();
    this._connection = connection;
    this._schema = schema;
  }

  async isConnected() {
    try {
      await this._connection.authenticate();
      return true;
    } catch (error) {
      console.error('fail!', error);
      return false;
    }
  }

  static async defineModel(connection, schema) {
    const model = connection.define(schema.name, schema.schema, schema.option);

    await model.sync();
    return model;
  }

  async create(item) {
    const { dataValues } = await this._schema.create(item);
    return dataValues;
  }

  async read(item) {
    return await this._schema.findAll({ where: item, raw: true });
  }

  async update(id, item) {
    return await this._schema.update(item, { where: { id: id } });
  }

  async delete(id) {
    const query = id ? { id } : {};
    return this._schema.destroy({ where: query });
  }

  static async connect() {
    const connection = new Sequelize(process.env.POSTGRES_URL, {
      logging: false,
      quoteIdentifiers: false,
      operatorsAliases: 0,
      dialect: 'postgres',
      // ssl: process.env.SSL_DB,
      // dialectOptions: {
      //   ssl: process.env.SSL_DB,
      // },
    });

    return connection;
  }
}

module.exports = Postgres;
