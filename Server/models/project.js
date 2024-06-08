'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Project.hasMany(models.Activity)
    }
  }
  Project.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Project name is required" },
        notNull: { msg: "Project name is required" }
      }
    },
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};