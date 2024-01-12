import { Sequelize } from "sequelize";
import { models } from './models/index.js';

const URI = `${process.env.PG_DB}://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}/${process.env.PG_DB_NAME}?sslmode=require`;

export const dbinit = () => new Sequelize(URI, {
    models
  });
