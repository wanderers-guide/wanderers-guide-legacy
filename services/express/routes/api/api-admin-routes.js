const router = require("express").Router();

const CharGathering = require("../../js/CharGathering");
const CharSaving = require("../../js/CharSaving");
const AdminCreation = require("../../js/AdminCreation");

router.post("/item", (req, res) => {
  // Add
  const bodyData = req.body;
  if (bodyData) {
    // The fact that we pass the body directly into addItem is a security risk
    AdminCreation.addItem(bodyData).then((result) => {
      res.status(201).send(result);
    });
  } else {
    res.sendStatus(400);
  }
});

module.exports = router;
