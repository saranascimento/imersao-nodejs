const assert = require('assert');
const Postgres = require('../db/strategies/postgres/postgres');
const HeroisSchema = require('../db/strategies/postgres/schemas/heroisSchema');
const Context = require('../db/strategies/base/contextStrategy');

const MOCK_HEROI_CADASTRAR = {
  nome: 'Gaviao Negro',
  poder: 'flexas',
};

const MOCK_HEROI_ATUALIZAR = {
  nome: 'Batman',
  poder: 'Dinheiro',
};

let context = {};

describe('Postgres Strategy', function () {
  this.timeout(Infinity);

  this.beforeAll(async function () {
    const connection = await Postgres.connect();
    const model = await Postgres.defineModel(connection, HeroisSchema);
    context = new Context(new Postgres(connection, model));
    await context.delete();
    await context.create(MOCK_HEROI_ATUALIZAR);
  });

  it('PostgresSQL Connection', async function () {
    const result = await context.isConnected();
    assert.equal(result, true);
  });

  it('cadastrar', async function () {
    const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR);
    const result = {
      nome,
      poder,
    };
    assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
  });

  it('listar', async function () {
    const [{ nome, poder }] = await context.read({
      nome: MOCK_HEROI_CADASTRAR.nome,
    });
    const result = {
      nome,
      poder,
    };
    assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
  });

  it('atualizar', async function () {
    const [itemAtualizar] = await context.read({
      nome: MOCK_HEROI_CADASTRAR.nome,
    });
    const novoItem = {
      ...MOCK_HEROI_ATUALIZAR,
      nome: 'Mulher Maravilha',
    };
    const [result] = await context.update(itemAtualizar.id, novoItem);
    const [itemAtualizado] = await context.read({ id: itemAtualizar.id });
    assert.deepEqual(result, 1);
    assert.deepEqual(itemAtualizado.nome, novoItem.nome);
  });

  it('remover por id', async function () {
    const [item] = await context.read({});
    const result = await context.delete(item.id);
    assert.deepEqual(result, 1);
  });
});
