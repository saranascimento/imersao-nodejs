// docker ps
// docker exec -it ${CONTAINER ID do mongoclient} mongo -u ${username} -p ${password} --authenticationDatabase ${table}

// database
// show dbs

// mudando o contexto para uma database
// use heros

// mostrar tables (colecoes)
// show collections

db.heros.insert({
  nome: 'flash',
  poder: 'Velocidade',
  dataNascimento: '1998-01-01',
});

// listar todos
db.heros.find();

// lista todos formatado
db.heros.find().pretty();

// lista apenas 1
db.heros.findOne();

// lista apenas 1 especificado por id
db.heros.findOne({ _id: ObjectId('6632eafde4647536aea8720e') });

// numero de itens na tabela
db.heros.count();

// lista limitado
db.heros.find().limit(1000).sort({ nome: -1 });

// lista coluna especifica e força para nao retornar o id
db.heros.find({}, { poder: 1, _id: 0 });

for (let i = 0; i <= 100000; i++) {
  db.heros.insert({
    nome: `Clone-${i}`,
    poder: 'Velocidade',
    dataNascimento: '1998-01-01',
  });
}

// create
db.heros.insert({
  nome: `Clone-${i}`,
  poder: 'Velocidade',
  dataNascimento: '1998-01-01',
});

// read
db.heros.find();

// update
// atualiza substituindo todo o objeto pelo dado que for passado
db.heros.update(
  { _id: ObjectId('6632ea09e4647536aea871fc') },
  { nome: 'Mulher maravilha' },
);

// atualiza usando o $set para alterar apenas o dado refrente ao que foi passado
db.heros.update(
  { _id: ObjectId('6632eafde4647536aea8720e') },
  { $set: { nome: 'Lanterna verde' } },
);

// se tentar atualizar uma prop inexistente será criado como uma nova
db.heros.update(
  { _id: ObjectId('6632eafde4647536aea8720e') },
  { $set: { name: 'Lanterna verde' } },
);

// por padrão só pode atualizar um item por vez
db.heros.update({ poder: 'Velocidade' }, { $set: { poder: 'super força' } });

// delete
// remove todos da base
db.heros.remove({});
// remove por prop
db.heros.remove({ name: 'Lanterna verde' });
