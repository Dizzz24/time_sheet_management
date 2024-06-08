'use strict';

const calculateDuration = require('../utilities/calculateDuration');

let activities = [
  {
    name: "Activity 2",
    startDate: new Date("2023-10-01"),
    endDate: new Date("2023-10-01"),
    startTime: "08:00",
    endTime: "16:00",
    ProjectId: 1,
    EmployeeId: 1
  },
  {
    name: "Mobile bro",
    startDate: new Date("2023-10-02"),
    endDate: new Date("2023-10-02"),
    startTime: "08:50",
    endTime: "17:30",
    ProjectId: 2,
    EmployeeId: 1
  },
  {
    name: "Actionnnn",
    startDate: new Date("2023-10-03"),
    endDate: new Date("2023-10-03"),
    startTime: "10:30",
    endTime: "15:00",
    ProjectId: 3,
    EmployeeId: 1
  }
]

activities = activities.map(activity => {
  let { startDate, endDate, startTime, endTime } = activity;
  startDate = startDate.toISOString().split("T")[0]
  endDate = endDate.toISOString().split("T")[0]
  activity.duration = calculateDuration({ startDate, endDate, startTime, endTime });
  activity.createdAt = activity.updatedAt = new Date();
  return activity;
});

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Activities', activities, {})
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
