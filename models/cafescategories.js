'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cafesCategories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  cafesCategories.init({
    cafeId: DataTypes.INTEGER,
    cafecategoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'cafesCategories',
  });
  return cafesCategories;
};