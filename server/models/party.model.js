import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";
import generateUUID from "../utils/uuidGenerator.js";

const Party = sequelize.define("Party", {
  party_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: () => generateUUID(),
  },
  party_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pending_payment: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
    allowNull: false,
  },
});

export default Party;