'use strict';

let projects = [
  {
    name: "Website App",
  },
  {
    name: "Mobile App",
  },
  {
    name: "UI/UX",
  },
  {
    name: "Logo Design",
  },
]

projects = projects.map(x => {
  x.createdAt = x.updatedAt = new Date()

  return x
})

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Projects', projects, {})
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
