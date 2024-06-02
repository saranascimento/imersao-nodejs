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
    const heroiSchema = new Mongoose.Schema({
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
    this._driver = connection;

    connection.once('open', () => console.log('database rodando!'));
    this.defineModel();
  }

  create(item) {
    return this._herois.create(item);
  }

  // skip = pula para o a posição do item escolhido
  read(item, skip = 0, limit = 10) {
    return this._herois.find(item).skip(skip).limit(limit);
  }

  update(id, item) {
    return this._herois.updateOne({ _id: id }, { $set: item });
  }

  delete(id) {
    console.log('deleting item', id);
    return this._herois.deleteOne({ _id: id });
  }
}

module.exports = MongoDB;
