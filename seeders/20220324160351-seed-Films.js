'use strict';
const fs = require("fs")

module.exports = {
  up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    const createdAt = new Date()
    const updatedAt = new Date()

    let films = JSON.parse(fs.readFileSync("./data/films.json", "utf-8"))

    films.forEach(el => {
      el.createdAt = createdAt
      el.updatedAt = updatedAt
    })

    return queryInterface.bulkInsert("Films", films, {})
  },

  down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */


    return queryInterface.bulkDelete("Films", null, {})
  }
};
