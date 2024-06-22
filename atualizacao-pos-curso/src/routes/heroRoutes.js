const BaseRoute = require('./base/baseRoute');
const Joi = require('joi');
const Boom = require('@hapi/boom');

const failAction = (request, headers, error) => {
  throw error;
};

const headers = Joi.object({
  authorization: Joi.string().required(),
}).unknown();

class HeroRoutes extends BaseRoute {
  constructor(db) {
    super();
    this.db = db;
  }

  list() {
    return {
      path: '/herois',
      method: 'GET',
      config: {
        tags: ['api'],
        description: 'Deve listar herois',
        notes: 'pode paginar resultados e filtrar por nome',
        validate: {
          failAction,
          query: Joi.object({
            skip: Joi.number().integer().default(0),
            limit: Joi.number().integer().default(10),
            nome: Joi.string().min(3).max(100),
          }),
          headers,
        },
      },
      handler: (request, headers) => {
        try {
          const { skip, limit, nome } = request.query;

          const query = nome
            ? {
                nome: {
                  $regex: `.*${nome}*`,
                },
              }
            : {};
          return this.db.read(nome ? query : {}, skip, limit);
        } catch (error) {
          console.log('Deu ruim!!', error);
          return Boom.internal();
        }
      },
    };
  }

  listById() {
    return {
      path: '/herois/{id}',
      method: 'GET',
      config: {
        tags: ['api'],
        description: 'Deve listar heroi por id',
        notes: 'pode filtrar por id',
        validate: {
          failAction,
          params: Joi.object({
            id: Joi.string().hex().length(24).required(),
          }),
          headers,
        },
      },
      handler: async (request, headers) => {
        try {
          const { id } = request.params;
          const result = await this.db.readOne(id);

          if (!result) {
            return Boom.notFound('Id não encontrado no banco');
          }

          return result;
        } catch (error) {
          console.log('Deu ruim!!', error);
          return Boom.internal();
        }
      },
    };
  }

  create() {
    return {
      path: '/herois',
      method: 'POST',
      config: {
        tags: ['api'],
        description: 'Deve cadastrar herois',
        notes: 'deve cadastrar heroi por nome e poder',
        validate: {
          headers,
          failAction,
          payload: Joi.object({
            nome: Joi.string().required().min(3).max(100),
            poder: Joi.string().required().min(2).max(100),
          }),
        },
      },
      handler: async (request) => {
        try {
          const { nome, poder } = request.payload;
          const result = await this.db.create({ nome, poder });

          return {
            message: 'Heroi cadastrado com sucesso!',
            _id: result._id,
          };
        } catch (error) {
          console.log('DEU RUIM', error);
          return Boom.internal();
        }
      },
    };
  }

  update() {
    return {
      path: '/herois/{id}',
      method: 'PATCH',
      config: {
        tags: ['api'],
        description: 'Deve atualizar heroi por id',
        notes: 'pode atualizar qualquer campo',
        validate: {
          headers,
          params: Joi.object({
            id: Joi.string().required(),
          }),
          payload: Joi.object({
            nome: Joi.string().min(3).max(100),
            poder: Joi.string().min(2).max(100),
          }),
        },
      },
      handler: async (request) => {
        try {
          const { id } = request.params;
          const { payload } = request;
          const dadosString = JSON.stringify(payload);
          const dados = JSON.parse(dadosString);
          const result = await this.db.update(id, dados);

          if (result.modifiedCount !== 1)
            return Boom.notFound('Id não encontrado no banco');

          return {
            message: 'Heroi atualizado com sucesso!',
          };
        } catch (error) {
          console.error('DEU RUIM', error);
          return Boom.internal();
        }
      },
    };
  }

  delete() {
    return {
      path: '/herois/{id}',
      method: 'DELETE',
      config: {
        tags: ['api'],
        description: 'Deve remover heroi por id',
        notes: 'o id tem que ser valido',
        validate: {
          headers,
          failAction,
          params: Joi.object({
            id: Joi.string().required(),
          }),
        },
      },
      handler: async (request) => {
        try {
          const { id } = request.params;
          const result = await this.db.delete(id);
          if (result.deletedCount !== 1)
            return Boom.notFound('Id não encontrado no banco');
          return {
            message: 'Heroi Removido com sucesso!',
          };
        } catch (error) {
          console.error('DEU RUIM', error);
          return Boom.internal();
        }
      },
    };
  }
}

module.exports = HeroRoutes;
