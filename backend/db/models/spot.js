"use strict";
const { Model } = require("sequelize");
const Booking = require("./booking");

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Spot.hasMany(models.Booking, { 
        foreignKey: "spotId",
        onDelete: "CASCADE",
      });
      Spot.hasMany(models.Review, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Spot.hasMany(models.SpotImage, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
      });
      Spot.belongsTo(models.User, { foreignKey: "ownerId" });
    }
  }
  Spot.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
      city: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      state: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      country: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      lat: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        validate: {
          isDecimal: true,
          min: -90,
          max: 90
        }
      },
      lng: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        validate: {
          isDecimal: true,
          min: -180,
          max: 180
        }
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Spot",
    }
  );
  return Spot;
};
