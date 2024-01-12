import { DataTypes, Model, Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(`${process.env.PG_DB}://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}/${process.env.PG_DB_NAME}?sslmode=require`);

class Segment extends Model {}

Segment.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ordersCount: {
    type: DataTypes.INTEGER,
  },
  ordersAmount: {
    type: DataTypes.INTEGER,
  },
  favouriteCurrencyBuy: {
    type: DataTypes.STRING,
  },
  favouriteCurrencySell: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  tableName: 'Segments',
  timestamps: true,
});

export default Segment
