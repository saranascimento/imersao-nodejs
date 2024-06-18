const assert = require('assert');
const passwordHelper = require('./../helpers/passwordHelper');

const SENHA = process.env.USER_PWD;
const HASH = process.env.USER_HASH;

describe('UserHelper test suite', function () {
  it('deve gerar um hash a partir de uma senha', async () => {
    const result = await passwordHelper.hashPassword(SENHA);
    assert.ok(result.length > 10);
  });

  it('deve comparar uma senha e seu hash', async () => {
    const result = await passwordHelper.comparePassword(SENHA, HASH);
    console.log('result', result);
    console.log('senha', SENHA);
    console.log('HASH', HASH);
    assert.ok(result);
  });
});
