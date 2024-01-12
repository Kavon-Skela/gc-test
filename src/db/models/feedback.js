import { DataTypes, Model, Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(`${process.env.PG_DB}://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}/${process.env.PG_DB_NAME}?sslmode=require`);

class Feedback extends Model {}

Feedback.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  suggestions: {
    type: DataTypes.STRING,
  },
  errorsReport: {
    type: DataTypes.STRING,
  },
  like: {
    type: DataTypes.STRING,
  },
  dislike: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  tableName: 'Feedback',
  timestamps: true,
});

export default Feedback
