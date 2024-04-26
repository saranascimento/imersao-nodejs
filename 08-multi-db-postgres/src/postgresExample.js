// npm install pg-hstore pg sequelize

const Sequelize = require('sequelize');

const driver = new Sequelize('heros', 'user', 'senha', {
  host: 'localhost',
  dialect: 'postgres',
  quoteIdentifiers: false,
  operatorsAliases: 0,
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
