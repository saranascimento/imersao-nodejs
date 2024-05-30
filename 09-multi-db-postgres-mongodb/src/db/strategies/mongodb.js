const ICrud = require('./interfaces/interfaceCrud');
const Mongoose = require('mongoose');

const { config } = require('dotenv');
const { join } = require('path');
const { ok } = require('assert');

const env = process.env.NODE_ENV || 'dev';
ok(env === 'prod' || env === 'dev', 'a env é invalida');

const configPath = join(__dirname, '../../../config', `.env.${env}`);

config({
  path: configPath,
});

const STATUS = {
  0: 'Disconectado',
  1: 'Conectado',
  2: 'Conectando',
  3: 'Disconectando',
};

class MongoDB extends ICrud {
  constructor() {
    super();
    this._herois = null;
    this._driver = null;
  }

  async isConnected() {
    const state = STATUS[this._driver.readyState];
    if (state === 'Conectado') return state;

    if (state !== 'Conectando') return state;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return STATUS[this._driver.readyState];
  }

  defineModel() {
    heroiSchema = new Mongoose.Schema({
      nome: {
        type: String,
        required: true,
      },
      poder: {
        type: String,
        required: true,
      },
      insertedAt: {
        type: Date,
        default: new Date(),
      },
    });

    this._herois = Mongoose.model('herois', heroiSchema);
  }

  connect() {
    Mongoose.connect(process.env.MONGODB_URL).catch((error) => {
      if (!error) return;
      console.log('Falha na conexão!', error);
    });

    const connection = Mongoose.connection;

    connection.once('open', () => console.log('database rodando!'));

    this._driver = connection;
  }

  async create(item) {
    const resultCadastrar = await model.create({
      nome: 'Batman',
      poder: 'Dinheiro',
    });

    console.log('result cadastrar', resultCadastrar);
  }
}

module.exports = MongoDB;
