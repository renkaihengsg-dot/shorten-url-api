import { sequelize } from "#db/connection.js";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

class Url extends Model<InferAttributes<Url>, InferCreationAttributes<Url>> {
  declare id: CreationOptional<number>;
  declare expiresAt: Date | null;
  declare shortCode: string;
  declare originalUrl: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Url.init(
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      field: "ID",
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    expiresAt: {
      field: `EXPIRES_AT`,
      type: DataTypes.DATE,
      allowNull: true,
    },
    shortCode: {
      field: `SHORT_CODE`,
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    originalUrl: {
      field: `ORIGINAL_URL`,
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      field: "CREATED_AT",
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      field: "UPDATED_AT",
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        fields: ["SHORT_CODE"],
        name: "IDX_URL_SHORT_CODE",
      },
    ],
    sequelize,
    tableName: "URLS",
    timestamps: true,
  },
);

export default Url;
