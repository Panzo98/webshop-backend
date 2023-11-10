"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Coupons extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Coupons.belongsTo(models.Store, {
        foreignKey: "storeId",
        as: "Store",
      });
    }
  }
  Coupons.init(
    {
      coupon: { type: DataTypes.STRING, allowNull: false },
      used: { type: DataTypes.BOOLEAN, defaultValue: false },
      storeId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "coupons",
    }
  );
  return Coupons;
};
