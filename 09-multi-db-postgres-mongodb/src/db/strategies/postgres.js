const { config } = require('dotenv');
const { join } = require('path');
const { ok } = require('assert');

const env = process.env.NODE_ENV || 'dev';
ok(env === 'prod' || env === 'dev', 'a env é invalida');

const configPath = join(__dirname, '../../../config', `.env.${env}`);

config({
  path: configPath,
});

const ICrud = require('./interfaces/interfaceCrud');
const Sequelize = require('sequelize');

class Postgres extends ICrud {
  constructor() {
    super();
    this._driver = null;
    this._herois = null;
  }

  async isConnected() {
    try {
      await this._driver.authenticate();
      return true;
    } catch (error) {
      console.error('fail!', error);
      return false;
    }
  }

  async defineModel() {
    this._herois = this._driver.define(
      'herois',
      {
        id: {
          type: Sequelize.INTEGER,
          require: true,
          primaryKey: true,
          autoIncrement: true,
        },
        nome: {
          type: Sequelize.STRING,
          require: true,
        },
        poder: {
          type: Sequelize.STRING,
          require: true,
        },
      },
      {
        tableName: 'TB_HEROIS',
        freezeTableName: false,
        timestamps: false,
      },
    );

    await this._herois.sync();
  }

  async create(item) {
    const { dataValues } = await this._herois.create(item);
    return dataValues;
  }

  async read(item) {
    return await this._herois.findAll({ where: item, raw: true });
  }

  async update(id, item) {
    return await this._herois.update(item, { where: { id: id } });
  }

  async delete(id) {
    const query = id ? { id } : {};
    return this._herois.destroy({ where: query });
  }

  async connect() {
    this._driver = new Sequelize(process.env.POSTGRES_URL, {
      loggin: false,
      quoteIdentifiers: false,
      operatorsAliases: 0,
      ssl: process.env.SSL_DB,
      dialectOptions: {
        ssl: process.env.SSL_DB,
      },
    });

    await this.defineModel();
  }
}

module.exports = Postgres;
