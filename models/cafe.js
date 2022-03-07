'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cafe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.cafe.belongsTo(models.user)
      models.cafe.hasMany(models.cafemenu, {onDelete: 'cascade', hooks: true})
      models.cafe.belongsToMany(models.cafecategory, {through: "cafesCategories"})
    }
  }
  cafe.init({
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    note: DataTypes.TEXT,
    rating: DataTypes.INTEGER,
    coordinates: DataTypes.GEOMETRY('POINT', 4326)
  }, {
    sequelize,
    modelName: 'cafe',
  });
  return cafe;
};