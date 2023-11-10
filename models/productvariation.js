"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class productVariation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      productVariation.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "Product",
      });
    }
  }
  productVariation.init(
    {
      productId: { type: DataTypes.INTEGER, allowNull: false },
      size: { type: DataTypes.STRING },
      color: { type: DataTypes.STRING },
      price: { type: DataTypes.DECIMAL, allowNull: false },
    },
    {
      sequelize,
      modelName: "productVariation",
    }
  );
  return productVariation;
};
