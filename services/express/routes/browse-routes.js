const router = require("express").Router();

router.get("/", (req, res) => {
  let contentFilter = req.query.filter;
  let contentSection = req.query.content;
  let contentID = req.query.id;

  res.render("pages/browse", {
    title: "Browse - Wanderer's Guide",
    user: req.user,
    contentFilter,
    contentSection,
    contentID,
  });
});

module.exports = router;
