const { deepEqual, ok } = require('assert');
const database = require('./database');
const DEFAULT_ITEM_CADASTRAR = {
  nome: 'Flash',
  poder: 'Speed',
  id: 1,
};

// destructor;
// const posicaoUm = resultado[0] ou [resultado]
// const posicaoUmEDois = [posica1, posicao2]

describe('Suite de manipulação de Herois', () => {
  it('deve pesquisar um heroi, usando arquivos', async () => {
    const expected = DEFAULT_ITEM_CADASTRAR;
    const [resultado] = await database.listar(expected.id);
    deepEqual(resultado, expected);
  });

  // it('deve cadastrar um heroi, usando arquivos', async () => {
  //   const expected = DEFAULT_ITEM_CADASTRAR;
  //   ok(null, expected);
  // });
});
