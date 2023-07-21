const db = require("../models");
const Spot = db.spots;

// Create and Save a new spot
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  let date_ob = new Date().toISOString().split("T")[0];
  // const date = date_ob.split("T");
  const equSpots = await Spot.find({
    walletAddress: req.body.data.walletAddress,
    date: date_ob,
    winStatus: req.body.winStatus,
  });
  if (equSpots.length !== 4) {
    const remainChance = 4 - equSpots.length;
    // Create a Spot
    const spot = new Spot({
      // walletAddress: req.body.data.walletAddress,
      walletAddress: req.body.data.walletAddress,
      winStatus: req.body.data.winStatus,
      date: date_ob,
      published: req.body.published ? req.body.published : false,
      remainTimes: remainChance,
    });
    // Save Spot in the database
    spot
      .save(spot)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Spots.",
        });
      });
  } else if (equSpots.length === 4) {
    res.send("There are no more chances today");
  }
};

// Retrieve all Spots from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};

  Spot.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving spots.",
      });
    });
};

exports.remainTimes = async (req, res) => {
  let date_ob = new Date().toISOString().split("T")[0];
  // const date = date_ob.split("T");
  const equSpots = await Spot.find({
    walletAddress: req.body.data.walletAddress,
    date: date_ob,
  });
  const winValue = await Spot.find({
    walletAddress: req.body.data.walletAddress,
    winStatus: 1,
  });
  let winPossible;
  if (winValue.length === 0) winPossible = "possible";
  else winPossible = "impossible";
  const response = {
    remainTimes: equSpots.length,
    winPossible: winPossible,
  };
  res.send(response);
};
// Find a single Spot with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Spot.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Spot with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving Spot with id=" + id });
    });
};

// Update a Spot by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Spot.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Spot with id=${id}. Maybe Spot was not found!`,
        });
      } else res.send({ message: "Spot was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Spot with id=" + id,
      });
    });
};

// Delete a Spot with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Spot.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Spot with id=${id}. Maybe Spot was not found!`,
        });
      } else {
        res.send({
          message: "Spot was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Spot with id=" + id,
      });
    });
};

// Delete all Spots from the database.
exports.deleteAll = (req, res) => {
  Spot.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Spots were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all spots.",
      });
    });
};

exports.allData = (req, res) => {
  Spot.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving spots.",
      });
    });
};

// Find all published Spots
exports.findAllPublished = (req, res) => {
  Spot.find({ published: true })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving spots.",
      });
    });
};
