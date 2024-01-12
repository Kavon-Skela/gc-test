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
    type: DataTypes.ARRAY(DataTypes.UUID)
  },
  usedPromos: {
    type: DataTypes.ARRAY(DataTypes.UUID)
  },
  totalOrders: {
    type: DataTypes.INTEGER
  },
  successOrders: {
    type: DataTypes.INTEGER
  },
  failOrders: {
    type: DataTypes.INTEGER
  },
  successOrdersSum: {
    type: DataTypes.INTEGER
  },
  failOrdersSum: {
    type: DataTypes.INTEGER
  },
  averageSuccessOrderAmount: {
    type: DataTypes.INTEGER
  },
  averageFailOrderAmount: {
    type: DataTypes.INTEGER
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
  allOrders: {
    type: DataTypes.ARRAY(DataTypes.UUID)
  },
  segment: {
    type: DataTypes.STRING
  },
  entries: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
}, {
  sequelize,
  tableName: 'Users',
  timestamps: true,
});

export default User
