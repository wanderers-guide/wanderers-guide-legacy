
const router = require('express').Router();

router.get('/', (req, res) => {

  let user = null;
  if(req.user == null){
    user = {
      isPatreonSupporter: 0,
    };
  } else {
    user = req.user;
  }

  res.render('gm_tools/gm_tools', {
    title: "GM Tools - Wanderer's Guide",
    user: user,
  });

});

router.get('/shop-generator', (req, res) => {

  let user = null;
  if(req.user == null){
    user = {
      isPatreonSupporter: 0,
    };
  } else {
    user = req.user;
  }

  res.render('gm_tools/shop_generator', {
    title: "Shop Generator - Wanderer's Guide",
    user: user,
  });

});

module.exports = router;