const { obterPessoas } = require('./service');

Array.prototype.meuReduce = function (callback, valorInicial) {
  let valorFinal = typeof valorInicial !== undefined ? valorInicial : this[0];
  for (let index = 0; index <= this.length - 1; index++) {
    valorFinal = callback(valorFinal, this[index], this);
  }

  return valorFinal;
};

async function main() {
  try {
    const { results } = await obterPessoas('a');
    const pesos = results.map((item) => parseInt(item.height));
    console.log('pesos', pesos);

    // const total = pesos.reduce((anterior, proximo) => {
    //   return anterior + proximo;
    // }, 0);

    // console.log('total', total);

    const minhaLista = [
      ['Erick', 'Wendel'],
      ['NodeBR', 'Nerdzao'],
    ];

    const lista = minhaLista
      .meuReduce((anterior, proximo) => {
        return anterior.concat(proximo);
      }, [])
      .join(', ');

    console.log('lista', lista);

    // substitui ultima virgula por 'e'
    // console.log('lista', lista.replace(/,(?=[^,]*$)/, ' e'));
  } catch (error) {
    console.error('DEU RUIM', error);
  }
}

main();
