'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  restaurant.init({
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    note: DataTypes.TEXT,
    rating: DataTypes.INTEGER,
    coordinates: DataTypes.GEOMETRY('POINT', 4326)
  }, {
    sequelize,
    modelName: 'restaurant',
  });
  return restaurant;
};