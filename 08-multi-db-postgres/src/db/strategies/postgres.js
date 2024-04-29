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

  async connect() {
    this._driver = new Sequelize('heros', 'user', 'senha', {
      host: 'localhost',
      dialect: 'postgres',
      quoteIdentifiers: false,
      operatorsAliases: 0,
    });

    await this.defineModel();
  }
}

module.exports = Postgres;
