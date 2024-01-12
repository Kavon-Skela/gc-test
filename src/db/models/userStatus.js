import { DataTypes, Model, Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(`${process.env.PG_DB}://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}/${process.env.PG_DB_NAME}?sslmode=require`);

class UserStatus extends Model {}

UserStatus.init({
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
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  branchAddress: {
    type: DataTypes.STRING,
  },
  clientGiveAmount: {
    type: DataTypes.INTEGER,
  },
  clientGiveCurrency: {
    type: DataTypes.STRING,
  },
  clientReceiveAmount: {
    type: DataTypes.INTEGER,
  },
  clientReceiveCurrency: {
    type: DataTypes.STRING,
  },
  currentRate: {
    type: DataTypes.INTEGER,
  },
}, {
  sequelize,
  tableName: 'UserStatuses',
  timestamps: true,
});

export default UserStatus
