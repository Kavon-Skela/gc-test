import { DataTypes, Model, Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(`${process.env.PG_DB}://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}/${process.env.PG_DB_NAME}?sslmode=require`);

class Balance extends Model {}

Balance.init({
  branchId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  cashRegister: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  USD: {
    type: DataTypes.INTEGER,
  },
  EUR: {
    type: DataTypes.INTEGER,
  },
  PLN: {
    type: DataTypes.INTEGER,
  },
  CHF: {
    type: DataTypes.INTEGER,
  },
  GBP: {
    type: DataTypes.INTEGER,
  },
  UAH: {
    type: DataTypes.INTEGER,
  },
}, {
  sequelize,
  tableName: 'Balances',
  timestamps: true,
})


export default Balance
