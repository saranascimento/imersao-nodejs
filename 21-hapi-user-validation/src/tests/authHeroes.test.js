const assert = require('assert');
const api = require('../api');
const Context = require('../db/strategies/base/contextStrategy');
const PostGres = require('../db/strategies/postgres/postgres');
const UsuarioSchema = require('../db/strategies/postgres/schemas/usuarioShema');

let app = {};
const USER = {
  username: 'nome',
  password: 'senha',
};

USER_DB = {
  username: USER.username.toLowerCase(),
  password: 'hash',
};

describe('Auth test suite', function () {
  this.beforeAll(async () => {
    app = await api;

    const connectionPostgres = await PostGres.connect();
    const model = await PostGres.defineModel(connectionPostgres, UsuarioSchema);

    const postgres = new Context(new PostGres(connectionPostgres, model));

    await postgres.update(null, USER_DB, true);
  });

  it('deve obter um token', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        username: 'nome',
        password: 'senha',
      },
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.equal(statusCode, 200);
    assert.ok(dados.token.length > 10);
  });

  it('deve retornar não autorizado ao tentar obter um login errado', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        username: 'nome',
        password: 'senha',
      },
    });
    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.deepEqual(statusCode, 401);
    assert.deepEqual(dados.error, 'Unauthorized');
  });
});
