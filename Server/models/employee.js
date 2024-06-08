'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Employee.hasOne(models.Activity)
    }
  }
  Employee.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Employee name is required" },
        notNull: { msg: "Employee name is required" }
      },
      unique: {
        msg: "Name already exists"
      },
    },
    rate: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Employee',
  });
  return Employee;
};