import { DataTypes, Model, Sequelize } from "sequelize";
// import { Attribute, PrimaryKey, Default, Table } from '@sequelize/core/decorators-legacy';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(`${process.env.PG_DB}://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}/${process.env.PG_DB_NAME}?sslmode=require`);

// @Table({ schema: 'Balances' })
class Balance extends Model {
  // @Attribute(DataTypes.INTEGER)
  // @PrimaryKey
  // @NotNull
  // branchId;

  // @Attribute(DataTypes.INTEGER)
  // @NotNull
  // cashRegister;

  // @Attribute(DataTypes.INTEGER)
  // @Default(0)
  // USD;

  // @Attribute(DataTypes.INTEGER)
  // @Default(0)
  // EUR;

  // @Attribute(DataTypes.INTEGER)
  // @Default(0)
  // PLN;

  // @Attribute(DataTypes.INTEGER)
  // @Default(0)
  // CHF;

  // @Attribute(DataTypes.INTEGER)
  // @Default(0)
  // GBP;

  // @Attribute(DataTypes.INTEGER)
  // @Default(0)
  // UAH;
}

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
