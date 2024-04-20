const Database = require('./database');
const { program } = require('commander');
const Heroi = require('./heroi');

async function main() {
  program
    .version('v1')
    .option('-n, --nome [value]', 'Nome do heroi')
    .option('-p, --poder [value]', 'Poder do heroi')
    .option('-i, --id [value]', 'Id do heroi')

    .option('-c, --cadastrar', 'Cadastrar do heroi')
    .option('-l, --listar', 'Listar Herois')
    .option('-r, --remover', 'Remove um Heroi')
    .option('-a, --atualizar [value]', 'Atualiza um Heroi');

  program.parse(process.argv);
  const options = program.opts();
  const heroi = new Heroi(options);

  try {
    if (options.cadastrar) {
      delete heroi.id;

      const resultado = await Database.cadastrar(heroi);
      if (!resultado) {
        console.error('Heroi nao foi cadastrado!');
        return;
      }
      console.log('Heroi cadastrado com sucesso');
    }

    if (options.listar) {
      const resultado = await Database.listar();
      console.log(resultado);
      return;
    }

    if (options.remover) {
      const resultado = await Database.remover(heroi.id);

      if (!resultado) {
        console.error('Não foi possível remover o heroi');
        return;
      }
      console.log('Heroi removido com sucesso');
    }

    if (options.atualizar) {
      const idParaAtualizar = parseInt(options.atualizar);

      //remover todas as chaves que estiverem com undefined | null
      const dado = JSON.stringify(heroi);
      const heroiAtualizar = JSON.parse(dado);

      const resultado = await Database.atualizar(
        idParaAtualizar,
        heroiAtualizar,
      );

      if (!resultado) {
        console.error('Não foi possível atualizar o heroi');
        return;
      }
      console.log('Heroi atualizado com sucesso');
    }
  } catch (error) {
    console.error('DEU RUIM', error);
  }
}

main();
