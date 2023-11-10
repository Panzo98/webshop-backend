"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Store, {
        foreignKey: "storeId",
        as: "Store",
      });
      User.hasMany(models.Order, {
        foreignKey: "userId",
        as: "User",
      });
      User.hasMany(models.Address, {
        foreignKey: "userId",
        as: "Addresses",
      });
    }
  }
  User.init(
    {
      username: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      name: DataTypes.STRING,
      surname: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      storeId: { type: DataTypes.INTEGER, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
