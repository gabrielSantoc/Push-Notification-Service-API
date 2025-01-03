
const express = require("express");
const pingRouter = express.Router()


pingRouter.get("/ping", (req, res) => {
  res.status(200).send("Server is alive");
});

module.exports = pingRouter;
