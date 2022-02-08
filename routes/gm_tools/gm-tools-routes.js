
const router = require('express').Router();

router.get('/shop-generator', (req, res) => {

  res.render('gm_tools/shop_generator', {
    title: "Shop Generator - Wanderer's Guide",
    user: req.user,
  });

});

module.exports = router;