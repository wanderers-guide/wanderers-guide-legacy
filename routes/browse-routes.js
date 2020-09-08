
const router = require('express').Router();

router.get('/', (req, res) => {

  res.render('pages/browse', { title: "Browse - Wanderer's Guide", user: req.user });

});

module.exports = router;