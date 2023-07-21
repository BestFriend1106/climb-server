module.exports = app => {
    const wallets = require("../controllers/wallet.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Spot
    router.post("/", wallets.create);
    router.post("/delete", wallets.deleteAll)
    router.get("/", wallets.allAddress)
    router.post("/addWalletAddress", wallets.addWalletAddress)
    router.post("/getAvailable", wallets.getAvailable)
  
    app.use("/api/wallet", router);
  };
  