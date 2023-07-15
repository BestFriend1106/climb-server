const db = require("../models");
const Spot = db.spots;
function getRandom(){
  var num=Math.random();
  if(num < 0.1) return 1;  //probability 0.1
  else if(num < 0.3) return 2; // probability 0.3
  else return 3; //probability 0.6
}

// Create and Save a new spot
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const winStatus = getRandom();

  // Create a Spot
  const spot = new Spot({
    walletAddress: req.body.walletAddress,
    winStatus: winStatus,
    published: req.body.published ? req.body.published : false
  });
  console.log("spot------------>", spot)
  // Save Spot in the database
  spot
    .save(spot)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Spots."
      });
    });
};

// Retrieve all Spots from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Spot.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving spots."
      });
    });
};

// Find a single Spot with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Spot.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Spot with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Spot with id=" + id });
    });
};

// Update a Spot by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Spot.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Spot with id=${id}. Maybe Spot was not found!`
        });
      } else res.send({ message: "Spot was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Spot with id=" + id
      });
    });
};

// Delete a Spot with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Spot.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Spot with id=${id}. Maybe Spot was not found!`
        });
      } else {
        res.send({
          message: "Spot was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Spot with id=" + id
      });
    });
};

// Delete all Spots from the database.
exports.deleteAll = (req, res) => {
  Spot.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Spots were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all spots."
      });
    });
};

// Find all published Spots
exports.findAllPublished = (req, res) => {
  Spot.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving spots."
      });
    });
};
