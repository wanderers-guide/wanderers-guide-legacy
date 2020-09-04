
const router = require('express').Router();

const CharGathering = require('../js/CharGathering');

router.get('/', (req, res) => {

  res.send(req.charID);

  // Incomplete, create API GET and UPDATE requests

});

module.exports = router;