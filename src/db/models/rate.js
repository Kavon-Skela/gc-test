import { DataTypes, Model, Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(`${process.env.PG_DB}://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}/${process.env.PG_DB_NAME}?sslmode=require`);

class Rate extends Model {}

Rate.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  USD: {
    type: DataTypes.JSONB,
  },
  EUR: {
    type: DataTypes.JSONB,
  },
  PLN: {
    type: DataTypes.JSONB,
  },
  CHF: {
    type: DataTypes.JSONB,
  },
  GBP: {
    type: DataTypes.JSONB,
  },
}, {
  sequelize,
  tableName: 'Rates',
  timestamps: true,
});

export default Rate
