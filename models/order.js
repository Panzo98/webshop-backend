"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: "userId",
        as: "User",
      });
      Order.belongsTo(models.Store, {
        foreignKey: "storeId",
        as: "Store",
      });
      Order.hasMany(models.OrderHasProduct, {
        foreignKey: "orderId",
        as: "OrderedProducts",
      });
    }
  }
  Order.init(
    {
      storeId: { type: DataTypes.INTEGER, allowNull: false },
      totalAmount: { type: DataTypes.DECIMAL, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      status: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
