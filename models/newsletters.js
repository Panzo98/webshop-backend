"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Newsletters extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Newsletters.belongsTo(models.Store, {
        foreignKey: "storeId",
        as: "Store",
      });
    }
  }
  Newsletters.init(
    {
      email: { type: DataTypes.STRING, allowNull: false },
      storeId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "newsletters",
    }
  );
  return Newsletters;
};
