import { DataTypes, Model, Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(`${process.env.PG_DB}://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}/${process.env.PG_DB_NAME}?sslmode=require`);

class Promo extends Model {}

Promo.init({
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  conditionsUa: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  conditionsRu: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pairs: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  discountSize: {
    type: DataTypes.FLOAT(1),
    allowNull: false,
  },
  weekDays: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  periodOfDay: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  regions: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  startDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  finishDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  operationType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  limitMax: {
    type: DataTypes.INTEGER,
  },
  limitMin: {
    type: DataTypes.INTEGER,
  },
  special: {
    type: DataTypes.STRING,
  },
  segment: {
    type: DataTypes.STRING,
  },
  branches: {
    type: DataTypes.ARRAY(DataTypes.INTEGER)
  },
  personalCabinetVisibility: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  }
}, {
  sequelize,
  tableName: 'Promos',
  timestamps: true,
});

export default Promo
