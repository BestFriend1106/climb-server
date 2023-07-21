const db = require("../models");
const csv = require("csv-parser");
const fs = require("fs");
const Wallet = db.wallets;

// Create and Save a new user
exports.create = async (req, res) => {
  const results = [];
  fs.createReadStream("./1.csv")
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      for (i = 0; i < 8958; i++) {
        console.log(results[i]);
        const wallet = new Wallet({
          walletAddress: results[i].walletAddress,
        });
        wallet.save(wallet);
      }
    });
};
// delete all
exports.deleteAll = (req, res) => {
  Wallet.deleteMany({})
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
exports.allAddress = async (req, res) => {
  Wallet.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all spots.",
      });
    });
};

exports.addWalletAddress = async (req, res) => {
  Wallet.find({ walletAddress: req.body.data.walletAddress })
  .then((data) => {
    if(data.length === 0){
      const wallet = new Wallet({
        walletAddress: req.body.data.walletAddress,
      });
      wallet.save(wallet);
      res.send("sucess")
    }
    else res.send("Already exist")
  })
};

exports.getAvailable = async (req, res) => {
  Wallet.find({ walletAddress: req.body.data.walletAddress })
  .then((data) => {
    if(data.length === 0){
      res.send("Your wallet does not exist in white list")
    }
    else res.send("success")
  })
};
