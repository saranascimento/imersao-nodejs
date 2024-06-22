const assert = require('assert');
const api = require('./../api');

let app = {};
const TOKEN = process.env.TOKEN;
const headers = {
  Authorization: TOKEN,
};

const MOCK_HEROI_CADASTRAR = {
  nome: 'Chapolin Colorado',
  poder: 'Marreta Bionica',
};

const MOCK_HEROI_INICIAL = {
  nome: 'Gavião Negro',
  poder: 'A mira',
};

let MOCK_ID = '';
describe('Suite de testes de API Heroes', function () {
  this.beforeAll(async () => {
    app = await api;
    const result = await app.inject({
      method: 'POST',
      headers,
      url: '/herois',
      payload: JSON.stringify(MOCK_HEROI_INICIAL),
    });
    const dados = JSON.parse(result.payload);
    MOCK_ID = dados._id;
  });

  it('Listar /herois', async () => {
    const result = await app.inject({
      method: 'GET',
      headers,
      url: '/herois?skip=0&limit=20',
    });

    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;

    assert.deepEqual(statusCode, 200);
    assert.ok(Array.isArray(dados));
  });

  it('listar/herois - deve retornar somente 3 registros', async () => {
    TAMANHO_LIMITE = 3;
    const result = await app.inject({
      method: 'GET',
      headers,
      url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`,
    });

    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 200);
    assert.ok(dados.length === TAMANHO_LIMITE);
  });

  it('listar/herois - deve retornar um erro com limit incorreto', async () => {
    TAMANHO_LIMITE = 'aeee';
    const result = await app.inject({
      method: 'GET',
      headers,
      url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`,
    });

    const errorResult = {
      statusCode: 400,
      error: 'Bad Request',
      message: '"limit" must be a number',
      validation: {
        source: 'query',
        keys: ['limit'],
      },
    };

    assert.deepEqual(result.statusCode, 400);
    assert.deepEqual(result.payload, JSON.stringify(errorResult));
  });

  it('listar - GET /herois - deve filtrar um item por nome', async () => {
    const NAME = MOCK_HEROI_INICIAL.nome;
    const result = await app.inject({
      method: 'GET',
      headers,
      url: `/herois?skip=0&limit=20&nome=${NAME}`,
    });

    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 200);
    assert.deepEqual(dados[0].nome, NAME);
  });

  it('listar - GET /herois - deve filtrar um item por id', async () => {
    const _id = MOCK_ID;
    const result = await app.inject({
      method: 'GET',
      headers,
      url: `/herois/${_id}`,
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);
    console.log('dados', dados);

    assert.deepEqual(statusCode, 200);
    assert.deepEqual(dados._id, _id);
  });

  it('listar - GET /herois - não deve filtrar um item com id inexistente', async () => {
    const _id = '66546c97d80948ec94958b2b';
    const result = await app.inject({
      method: 'GET',
      headers,
      url: `/herois/${_id}`,
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    const expected = {
      statusCode: 404,
      error: 'Not Found',
      message: 'Id não encontrado no banco',
    };

    assert.ok(statusCode === 404);
    assert.deepEqual(dados, expected);
  });

  it('cadastrar - POST /herois', async () => {
    const result = await app.inject({
      method: 'POST',
      headers,
      url: '/herois',
      payload: MOCK_HEROI_CADASTRAR,
    });

    const statusCode = result.statusCode;
    const { message, _id } = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.notStrictEqual(_id, undefined);
    assert.deepEqual(message, 'Heroi cadastrado com sucesso!');
  });

  it('atualizar PATCH - /herois/:id', async () => {
    const _id = MOCK_ID;
    const expected = {
      poder: 'Super Mira',
    };

    const result = await app.inject({
      method: 'PATCH',
      headers,
      url: `/herois/${_id}`,
      payload: JSON.stringify(expected),
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.deepEqual(dados.message, 'Heroi atualizado com sucesso!');
  });

  it('atualizar PATCH - /herois/:id - não deve atualizar com id inexistente', async () => {
    const _id = '66546c97d80948ec94958b2b';

    const result = await app.inject({
      method: 'PATCH',
      headers,
      url: `/herois/${_id}`,
      payload: JSON.stringify({
        poder: 'Super Mira',
      }),
    });

    const expected = {
      statusCode: 404,
      error: 'Not Found',
      message: 'Id não encontrado no banco',
    };

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.ok(statusCode === 404);
    assert.deepEqual(dados, expected);
  });

  it('remover - DELETE - /herois/:id', async () => {
    const _id = MOCK_ID;

    const result = await app.inject({
      method: 'DELETE',
      headers,
      url: `/herois/${_id}`,
    });
    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.deepEqual(dados.message, 'Heroi Removido com sucesso!');
  });

  it('remover - DELETE - /herois/:id não deve remover inexistente', async () => {
    const _id = '66546c97d80948ec94958b2b';

    const result = await app.inject({
      method: 'DELETE',
      headers,
      url: `/herois/${_id}`,
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    const expected = {
      statusCode: 404,
      error: 'Not Found',
      message: 'Id não encontrado no banco',
    };

    assert.ok(statusCode === 404);
    assert.deepEqual(dados, expected);
  });

  it('remover - DELETE - /herois/:id não deve remover com id invalido', async () => {
    const _id = 'ID_INVALIDO';

    const result = await app.inject({
      method: 'DELETE',
      headers,
      url: `/herois/${_id}`,
    });
    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    const expected = {
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An internal server error occurred',
    };

    assert.ok(statusCode === 500);
    assert.deepEqual(dados, expected);
  });
});
