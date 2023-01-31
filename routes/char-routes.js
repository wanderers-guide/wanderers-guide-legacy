const router = require("express").Router();
const express = require("express");
const charbuilderRoutes = require("./charbuilder-routes");
const chardeleteRoutes = require("./chardelete-routes");
const charsheetRoutes = require("./charsheet-routes");

const CharSaving = require("../js/CharSaving");
const path = require("path");

const solidPath = path.join(__dirname, "../dist/public");

router.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.sendFile(path.join(solidPath, "index.html"));
});

router.get("/add", (req, res) => {
  CharSaving.createNewCharacter(req.user).then((character) => {
    if (character != null) {
      res.redirect("/profile/characters/builder/basics/?id=" + character.id);
    } else {
      // Cannot make another character, goto 404 not found
      res.status(404);
      res.render("error/404_error", {
        title: "404 Not Found - Wanderer's Guide",
        user: req.user,
      });
    }
  });
});

router.use("/delete", chardeleteRoutes);

router.use("/builder", charbuilderRoutes);

router.use("*", charsheetRoutes);

module.exports = router;
