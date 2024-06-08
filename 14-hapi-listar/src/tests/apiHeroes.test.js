const assert = require('assert');
const api = require('./../api');

let app = {};

describe('Suite de testes de API Heroes', function () {
  this.beforeAll(async () => {
    app = await api;
  });
  it('Listar /herois', async () => {
    const result = await app.inject({
      method: 'GET',
      url: '/herois?skip=0&limit=20',
    });

    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;

    assert.deepEqual(statusCode, 200);
    assert.ok(Array.isArray(dados));
  });

  it('listar/herois - deve retornar somente 10 registros', async () => {
    TAMANHO_LIMITE = 3;
    const result = await app.inject({
      method: 'GET',
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
      url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`,
    });

    assert.deepEqual(result.payload, 'Erro interno no servidor');
  });

  it('listar/herois - deve retornar somente 10 registros', async () => {
    const NAME = 'Homem Aranha-1717348206227';
    const result = await app.inject({
      method: 'GET',
      url: `/herois?skip=0&limit=20&nome=${NAME}`,
    });

    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 200);
    assert.deepEqual(dados[0].nome, NAME);
  });
});
