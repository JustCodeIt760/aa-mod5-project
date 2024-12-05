"use strict";

const { Spot } = require("../models");
const { Op } = require("sequelize");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const spots = await Spot.findAll({
      attributes: ["id", "name"],
    });

    const spotImages = [];
    spots.forEach(spot => {
      // Create 5 images for each spot
      for (let i = 0; i < 5; i++) {
        spotImages.push({
          spotId: spot.id,
          url: "https://i.ibb.co/zStVLWf/pexels-photo-106399.jpg",
          preview: i === 0 // First image is preview image
        });
      }
    });

    options.tableName = "SpotImages";
    await queryInterface.bulkInsert(options, spotImages, {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    await queryInterface.bulkDelete(options, null, {});
  },
};
