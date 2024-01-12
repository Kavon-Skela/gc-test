import { DataTypes, Model, Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(`${process.env.PG_DB}://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}/${process.env.PG_DB_NAME}?sslmode=require`);

class Order extends Model {}

Order.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  currentLimitDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
  },
  lastName: {
    type: DataTypes.STRING,
  },
  clientGiveAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  clientGiveCurrency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  clientReceiveAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  clientReceiveCurrency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  currentRate: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  promo: {
    type: DataTypes.STRING,
  },
  branchAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  blueDollars: {
    type: DataTypes.BOOLEAN,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'fail', 'success'),
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  cashRegister: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  sequelize,
  tableName: 'Orders',
  timestamps: true,
});

export default Order
