'use strict';
const { Model } = require('sequelize');
const calculateDuration = require('../utilities/calculateDuration');

module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    static associate(models) {
      Activity.belongsTo(models.Project);
      Activity.belongsTo(models.Employee);
    }
  }

  Activity.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Activity name is required" },
        notNull: { msg: "Activity name is required" }
      }
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Choose the right start date" },
        notNull: { msg: "Choose the right start date" }
      }
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Choose the right end date" },
        notNull: { msg: "Choose the right end date" }
      }
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Choose the right start time" },
        notNull: { msg: "Choose the right start time" }
      }
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Choose the right end time" },
        notNull: { msg: "Choose the right end time" }
      }
    },
    ProjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Project name is required" },
        notNull: { msg: "Project name is required" }
      }
    },
    EmployeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Employee name is required" },
        notNull: { msg: "Employee name is required" }
      }
    },
    duration: {
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'Activity',
    hooks: {
      beforeCreate: (activity) => {
        if (activity.startDate && activity.startTime && activity.endDate && activity.endTime) {
          activity.duration = calculateDuration(activity);
        }
      },
      beforeUpdate: (activity) => {
        if (activity.startDate && activity.startTime && activity.endDate && activity.endTime) {
          activity.duration = calculateDuration(activity);
        }
      }
    }
  });

  return Activity;
};