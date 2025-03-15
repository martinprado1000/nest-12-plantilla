import * as Joi from 'joi';
// Los valoredes default definidos aca son para el caso que no entendefinidos en la variable de entorno.
// Los valore que pongo aca por default prevalecen ante el envLoader.
// para que no me de error NO lo puede dejar vacio en el .env, directamente no tiene que estar definido dicha variable.

export const envSchema = Joi.object({ 
  PORT: Joi.number().default(3000), // Asigno por default en 3000 en el caso que no lo pasen
  HOST_API: Joi.string().required(),
  NODE_ENV: Joi.string().default('dev'),
  JWT_SECRET: Joi.string().required(),
  DATABASE_URI: Joi.string().required(),
  DATABASE_PORT: Joi.string(),
  DATABASE_NAME: Joi.string(),
  DATABASE_USERNAME: Joi.string().allow('', null),
  DATABASE_PASSWORD: Joi.string().allow('', null),
  PAGINATIONS_DEFAULT_LIMIT: Joi.number().default(20), 
  PASSWORD_SEED_USERS: Joi.string().required(),
  AUDIT: Joi.boolean().default(false),
});
