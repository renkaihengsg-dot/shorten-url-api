import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(process.env.MYSQLCONNSTR, {
  pool: {
    acquire: 30000,
    idle: 10000,
    max: 5,
    min: 0,
  },
});
