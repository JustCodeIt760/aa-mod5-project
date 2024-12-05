"use strict";

const { SpotImage, Spot } = require("../models");
const { Op } = require("sequelize");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const demoSpots = await Spot.findAll({
      where: {
        name: {
          [Op.in]: [
            "Cozy SF Apartment",
            "Manhattan Loft",
            "Hollywood Hills Villa",
          ],
        },
      },
      attributes: ["id", "name"],
    });

    if (demoSpots.length === 0) {
      console.error("No spots found. Ensure the spots exist in the database.");
      return;
    }

    await SpotImage.bulkCreate(
      [
        // Cozy SF Apartment
        {
          spotId: demoSpots.find((spot) => spot.name === "Cozy SF Apartment").id,
          url: "https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?q=80&w=967&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          preview: true,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Cozy SF Apartment").id,
          url: "https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?q=80&w=967&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Cozy SF Apartment").id,
          url: "https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?q=80&w=967&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Cozy SF Apartment").id,
          url: "https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?q=80&w=967&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Cozy SF Apartment").id,
          url: "https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?q=80&w=967&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          preview: false,
        },
        // Manhattan Loft
        {
          spotId: demoSpots.find((spot) => spot.name === "Manhattan Loft").id,
          url: "https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?q=80&w=967&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          preview: true,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Manhattan Loft").id,
          url: "https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?q=80&w=967&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Manhattan Loft").id,
          url: "https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?q=80&w=967&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Manhattan Loft").id,
          url: "https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?q=80&w=967&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Manhattan Loft").id,
          url: "https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?q=80&w=967&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          preview: false,
        },
        // Hollywood Hills Villa
        {
          spotId: demoSpots.find((spot) => spot.name === "Hollywood Hills Villa").id,
          url: "https://example.com/hollywood-villa1.jpg",
          preview: true,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Hollywood Hills Villa").id,
          url: "ttps://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?q=80&w=967&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Hollywood Hills Villa").id,
          url: "ttps://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?q=80&w=967&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Hollywood Hills Villa").id,
          url: "ttps://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?q=80&w=967&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Hollywood Hills Villa").id,
          url: "ttps://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?q=80&w=967&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          preview: false,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    return queryInterface.bulkDelete(options, null, {});
  },
};
