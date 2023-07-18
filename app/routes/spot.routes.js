module.exports = app => {
  const spots = require("../controllers/spot.controller.js");

  var router = require("express").Router();

  // Create a new Spot
  router.post("/", spots.create);

  // Retrieve all Spots
  router.post("/remainTimes", spots.remainTimes);

  // Retrieve all published Spots
  router.get("/published", spots.findAllPublished);

  // Retrieve a single Spot with id
  router.get("/:id", spots.findOne);

  // Update a Spot with id
  router.put("/:id", spots.update);

  // Delete a Spot with id
  router.delete("/:id", spots.delete);

  // Create a new Spot
  router.delete("/", spots.deleteAll);

  app.use("/api/spots", router);
};
