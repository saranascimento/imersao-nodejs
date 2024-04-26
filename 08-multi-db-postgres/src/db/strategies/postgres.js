const ICrud = require('./interfaces/interfaceCrud');
const Sequelize = require('sequelize');

class Postgres extends ICrud {
  constructor() {
    super();
    this._driver = null;
    this._herois = null;
    this._connect();
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
    this._herois = driver.define(
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

    await Herois.sync();
  }

  create(item) {
    console.log('O item foi salvo em Postgres');
  }

  _connect() {
    this._driver = new Sequelize('heros', 'user', 'senha', {
      host: 'localhost',
      dialect: 'postgres',
      quoteIdentifiers: false,
      operatorsAliases: 0,
    });
  }
}

module.exports = Postgres;
