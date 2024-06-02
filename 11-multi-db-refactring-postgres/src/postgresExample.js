const { config } = require('dotenv');
const { join } = require('path');
const { ok } = require('assert');

const env = process.env.NODE_ENV || 'dev';
ok(env === 'prod' || env === 'dev', 'a env é invalida');

const configPath = join(__dirname, '../../../config', `.env.${env}`);

config({
  path: configPath,
});

const Sequelize = require('sequelize');

const driver = new Sequelize(process.env.POSTGRES_URL, {
  loggin: false,
  quoteIdentifiers: false,
  operatorsAliases: 0,
  ssl: process.env.SSL_DB,
  dialectOptions: {
    ssl: process.env.SSL_DB,
  },
});

async function main() {
  const Herois = driver.define(
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
  await Herois.create({
    nome: 'Lanterna verde',
    poder: 'Anel',
  });

  const result = await Herois.findAll({
    raw: true,
    attributes: ['nome'],
  });

  console.log('result', result);
}

main();
