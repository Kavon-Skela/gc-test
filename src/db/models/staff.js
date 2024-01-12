import { DataTypes, Model, Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(`${process.env.PG_DB}://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}/${process.env.PG_DB_NAME}?sslmode=require`);

class Staff extends Model {}

Staff.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  roles: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false
  },
  ip: {
    type: DataTypes.STRING,
  },
  branchId: {
    type: DataTypes.INTEGER,
  },
  cashNumber: {
    type: DataTypes.INTEGER,
  },
}, {
  sequelize,
  tableName: 'Staff',
  timestamps: true,
})

export default Staff
