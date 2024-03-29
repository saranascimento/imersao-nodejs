/*
0 Obter um usuario
1 Obter o numero de telefone de um usuario a partir de seu id
2 Obter o endereco do usuario pelo id
*/
// importamos um módulo interno do node.js
const util = require('util');
const obterEnderecoAsync = util.promisify(obterEndereco);

function obterUsuario(callback) {
  // quando der algum problema -> reject(ERRO)
  // quando sucesso -> RESOLVE
  return new Promise(function resolvePromise(resolve, reject) {
    // return reject(new Error('DEU RUIM DE VERDADE!'));

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

function obterEndereco(idEndereco, callback) {
  setTimeout(function () {
    return callback(null, {
      rua: 'dos bobos',
      numero: 0,
    });
  }, 2000);
}

const usuarioPromise = obterUsuario();
usuarioPromise
  .then(function (usuario) {
    return obterTelefone(usuario.id).then(function resolverTelefone(resultado) {
      return {
        usuario: {
          nome: usuario.nome,
          id: usuario.id,
        },
        telefone: resultado,
      };
    });
  })
  .then(function (resultado) {
    const endereco = obterEnderecoAsync(resultado.usuario.id);
    return endereco.then(function resolveEndereco(endereco) {
      return {
        usuario: resultado.usuario,
        telefone: resultado.telefone,
        endereco: endereco,
      };
    });
  })
  .then(function (resultado) {
    console.log(`
    Nome: ${resultado.usuario.nome},
    Endereco: ${resultado.endereco.rua}, ${resultado.endereco.numero}
    Telefone: (${resultado.telefone.ddd}) ${resultado.telefone.telefone}
    `);
  })
  .catch(function (error) {
    console.error('DEU RUIM', error);
  });
