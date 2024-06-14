const Hapi = require('@hapi/hapi');
const Context = require('./db/strategies/base/contextStrategy');
const MongoDb = require('./db/strategies/mongodb/mongodb');
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroisSchema');
const HeroRoute = require('./routes/heroRoutes');
const AuthRoute = require('./routes/authRoutes');

const Postgres = require('./db/strategies/postgres/postgres');
const UsuariosSchema = require('./db/strategies/postgres/schemas/usuarioShema');

const HapiSwagger = require('hapi-swagger');
const Vision = require('@hapi/vision');
const Inert = require('@hapi/inert');
const JWT_SECRET = 'senha';
const HapiJwt = require('hapi-auth-jwt2');
const UsuarioSchema = require('./db/strategies/postgres/schemas/usuarioShema');

const app = new Hapi.Server({
  port: 5000,
});

function mapRoutes(instance, methods) {
  return methods.map((method) => instance[method]());
}

async function main() {
  const connection = MongoDb.connect();
  const context = new Context(new MongoDb(connection, HeroiSchema));

  const connectionPostgres = await Postgres.connect();
  const usuarioSchema = await Postgres.defineModel(
    connectionPostgres,
    UsuarioSchema,
  );
  const contextPostgres = new Context(
    new Postgres(connectionPostgres, usuarioSchema),
  );

  const swaggerOptions = {
    info: {
      title: 'API Herois - #CursoNodeBR',
      version: 'v1.0',
    },
  };
  await app.register([
    HapiJwt,
    Vision,
    Inert,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  app.auth.strategy('jwt', 'jwt', {
    key: JWT_SECRET,
    validate: async (dado, request) => {
      const [result] = await contextPostgres.read({
        username: dado.username.toLowerCase(),
      });

      if (!result) {
        return {
          isValid: false,
        };
      }

      return {
        isValid: true,
      };
    },
  });

  app.auth.default('jwt');

  app.route([
    ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
    ...mapRoutes(
      new AuthRoute(JWT_SECRET, contextPostgres),
      AuthRoute.methods(),
    ),
  ]);

  await app.start();
  console.log('Server rodando na porta', app.info.port);

  return app;
}
module.exports = main();
