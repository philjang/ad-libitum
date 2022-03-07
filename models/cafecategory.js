'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cafecategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.cafecategory.belongsTo(models.user)
      models.cafecategory.belongsToMany(models.cafe, {through: "cafesCategories"})
    }
  }
  cafecategory.init({
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'cafecategory',
  });
  return cafecategory;
};