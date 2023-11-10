"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductHasImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductHasImages.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "Product",
      });
    }
  }
  ProductHasImages.init(
    {
      productId: { type: DataTypes.INTEGER, allowNull: false },
      imageUrl: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "ProductHasImages",
    }
  );
  return ProductHasImages;
};
