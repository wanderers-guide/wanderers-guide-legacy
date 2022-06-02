
const CampaignGathering = require('../../js/CampaignGathering');

const router = require('express').Router();

router.get('/', (req, res) => {

  let isPatreonSupporter = 0;
  if(req.user != null){
    isPatreonSupporter = req.user.isPatreonSupporter;
  }

  res.render('gm_tools/gm_tools', {
    title: "GM Tools - Wanderer's Guide",
    user: req.user,
    isPatreonSupporter,
  });

});

router.get('/shop-generator', (req, res) => {

  let isPatreonSupporter = 0;
  if(req.user != null){
    isPatreonSupporter = req.user.isPatreonSupporter;
  }

  res.render('gm_tools/shop_generator', {
    title: "Shop Generator - Wanderer's Guide",
    user: req.user,
    isPatreonSupporter,
  });

});

router.get('/encounter-builder', (req, res) => {

  let isPatreonSupporter = 0;
  if(req.user != null){
    isPatreonSupporter = req.user.isPatreonSupporter;
  }

  res.render('gm_tools/encounter_builder', {
    title: "Encounter Builder - Wanderer's Guide",
    user: req.user,
    isPatreonSupporter,
  });

});

router.get('/campaigns', (req, res) => {

  let isPatreonSupporter = 0;
  if(req.user != null){
    isPatreonSupporter = req.user.isPatreonSupporter;

    CampaignGathering.getOwnedCampaigns(req.user.id).then((campaigns) => {

      res.render('gm_tools/campaigns', {
        title: "Campaigns - Wanderer's Guide",
        user: req.user,
        isPatreonSupporter,
        campaigns,
      });

    });

  } else {
    res.redirect('/auth/login');
  }

});

module.exports = router;