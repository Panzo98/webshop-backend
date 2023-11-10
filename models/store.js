"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Store.hasMany(models.Product, {
        foreignKey: "storeId",
        as: "Products",
      });
      Store.hasMany(models.User, {
        foreignKey: "storeId",
        as: "Users",
      });
      Store.hasMany(models.Order, {
        foreignKey: "storeId",
        as: "Orders",
      });
      Store.hasMany(models.Coupons, {
        foreignKey: "storeId",
        as: "Coupons",
      });
      Store.hasMany(models.Newsletters, {
        foreignKey: "storeId",
        as: "Newsletters",
      });
    }
  }
  Store.init(
    {
      name: DataTypes.STRING,
      webaddress: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    {
      sequelize,
      modelName: "Store",
    }
  );
  return Store;
};
