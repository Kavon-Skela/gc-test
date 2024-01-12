import { DataTypes, Model, Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(`${process.env.PG_DB}://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}/${process.env.PG_DB_NAME}?sslmode=require`);

class Branch extends Model {}

Branch.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  lng: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  addressUa: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  addressRu: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  worksFrom: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  worksTo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  holidays: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  allowedCurrencies: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false
  },
  cashRegisters: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: false
  },
  isWorking: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  }
}, {
  sequelize,
  tableName: 'Branches',
  timestamps: true,
});

export default Branch
