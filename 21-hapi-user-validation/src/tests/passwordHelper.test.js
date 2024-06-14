const assert = require('assert');
const passwordHelper = require('./../helpers/passwordHelper');

const SENHA = 'senha';
const HASH = 'hash';

describe('UserHelper test suite', function () {
  it('deve gerar um hash a partir de uma senha', async () => {
    const result = await passwordHelper.hashPassword(SENHA);
    assert.ok(result.length > 10);
  });

  it('deve comparar uma senha e seu hash', async () => {
    const result = await passwordHelper.comparePassword(SENHA, HASH);
    assert.ok(result);
  });
});
