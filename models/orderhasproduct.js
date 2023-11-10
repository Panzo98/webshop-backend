"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderHasProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OrderHasProduct.belongsTo(models.Order, {
        foreignKey: "orderId",
        as: "Order",
      });
      OrderHasProduct.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "Product",
      });
    }
  }
  OrderHasProduct.init(
    {
      orderId: DataTypes.INTEGER,
      productId: { type: DataTypes.INTEGER, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      price: { type: DataTypes.DECIMAL, allowNull: false },
    },
    {
      sequelize,
      modelName: "OrderHasProduct",
    }
  );
  return OrderHasProduct;
};
