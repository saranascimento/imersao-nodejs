/*
0 Obter um usuario
1 Obter o numero de telefone de um usuario a partir de seu id
2 Obter o endereco do usuario pelo id
*/

const util = require('util');
const obterEnderecoAsync = util.promisify(obterEndereco);

function obterUsuario(callback) {
  return new Promise(function resolvePromise(resolve, reject) {
    setTimeout(function () {
      return resolve({
        id: 1,
        nome: 'Aladin',
        dataNascimento: new Date(),
      });
    }, 1000);
  });
}

function obterTelefone(idUsuario, callback) {
  return new Promise(function resolvePromise(resolve, reject) {
    setTimeout(function () {
      return resolve({
        telefone: '1199002',
        ddd: 11,
      });
    }, 1000);
  });
}

function obterEndereco(idUsuario, callback) {
  setTimeout(function () {
    return callback(null, {
      rua: 'dos bobos',
      numero: 0,
    });
  }, 2000);
}

//1o passo adicionar a palavra async -> automaticamente ela retornará uma promise
main();
async function main() {
  try {
    console.time('medida-promise');
    const usuario = await obterUsuario();
    // const telefone = await obterTelefone(usuario.id);
    // const endereco = await obterEnderecoAsync(usuario.id);

    const resultado = await Promise.all([
      obterTelefone(usuario.id),
      obterEnderecoAsync(usuario.id),
    ]);
    const endereco = resultado[1];
    const telefone = resultado[0];

    console.log(`
    Nome: ${usuario.nome},
    Endereco: ${endereco.rua}, ${endereco.numero}
    Telefone: (${telefone.ddd}) ${telefone.telefone}
    `);
    console.timeEnd('medida-promise');
  } catch (error) {
    console.error('DEU RUIM', error);
  }
}
