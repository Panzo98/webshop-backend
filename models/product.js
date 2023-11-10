"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.hasMany(models.OrderHasProduct, {
        foreignKey: "productId",
        as: "Products",
      });
      Product.belongsTo(models.Store, {
        foreignKey: "storeId",
        as: "Store",
      });
      Product.hasMany(models.ProductHasImages, {
        foreignKey: "productId",
        as: "Product",
      });
      Product.hasMany(models.productVariation, {
        foreignKey: "productId",
        as: "Product",
      });
    }
  }
  Product.init(
    {
      title: { type: DataTypes.STRING, allowNull: false },
      description: DataTypes.TEXT,
      price: { type: DataTypes.DECIMAL, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      primaryImageUrl: { type: DataTypes.STRING, allowNull: true },
      storeId: { type: DataTypes.INTEGER, allowNull: false },
      discount: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
