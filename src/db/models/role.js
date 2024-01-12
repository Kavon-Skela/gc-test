import { DataTypes, Model, Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(`${process.env.PG_DB}://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}/${process.env.PG_DB_NAME}?sslmode=require`);

class Role extends Model {}

Role.init({
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
  read: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  edit: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'Roles',
  timestamps: true,
});

export default Role
