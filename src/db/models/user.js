import { DataTypes, Model, Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(`${process.env.PG_DB}://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}/${process.env.PG_DB_NAME}?sslmode=require`);

class User extends Model {}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
  },
  lastName: {
    type: DataTypes.STRING,
  },
  birthDate: {
    type: DataTypes.STRING,
  },
  sex: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  allowedPromos: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  usedPromos: {
    type: DataTypes.ARRAY(DataTypes.STRING)
  },
  totalOrders: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  successOrders: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  failOrders: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  successOrdersSum: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  failOrdersSum: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalOrdersSum: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  averageSuccessOrderAmount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  averageFailOrderAmount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  favouriteCurrencyGive: {
    type: DataTypes.STRING
  },
  favouriteCurrencyReceive: {
    type: DataTypes.STRING
  },
  favouriteBranch: {
    type: DataTypes.STRING
  },
  entries: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  orders: {
    type: DataTypes.ARRAY(DataTypes.JSON)
  }
}, {
  sequelize,
  tableName: 'Users',
  timestamps: true,
});

export default User
