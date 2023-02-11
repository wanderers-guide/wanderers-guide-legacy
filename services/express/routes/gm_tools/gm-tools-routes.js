const CampaignGathering = require("../../js/CampaignGathering");

const router = require("express").Router();

router.get("/", (req, res) => {
  let isPatreonSupporter = 0;
  if (req.user != null) {
    isPatreonSupporter = req.user.isPatreonSupporter;
  }

  res.render("gm_tools/gm_tools", {
    title: "GM Tools - Wanderer's Guide",
    user: req.user,
    isPatreonSupporter,
  });
});

router.get("/shop-generator", (req, res) => {
  let isPatreonSupporter = 0;
  if (req.user != null) {
    isPatreonSupporter = req.user.isPatreonSupporter;
  }

  res.render("gm_tools/shop_generator", {
    title: "Shop Generator - Wanderer's Guide",
    user: req.user,
    isPatreonSupporter,
  });
});

router.get("/encounter-builder", (req, res) => {
  let isPatreonSupporter = 0;
  if (req.user != null) {
    isPatreonSupporter = req.user.isPatreonSupporter;
  }

  res.render("gm_tools/encounter_builder", {
    title: "Encounter Builder - Wanderer's Guide",
    user: req.user,
    isPatreonSupporter,
  });
});

router.get("/campaigns", (req, res) => {
  handleCampaignRoute(req, res);
});
router.get("/campaigns/*", (req, res) => {
  handleCampaignRoute(req, res);
});
function handleCampaignRoute(req, res) {
  if (req.user != null) {
    CampaignGathering.getOwnedCampaigns(req.user.id).then((campaigns) => {
      let canMakeCampaign = CampaignGathering.canMakeCampaign(
        req.user,
        campaigns,
      );
      let campaignLimit = CampaignGathering.getUserCampaignLimit();

      res.render("gm_tools/campaigns", {
        title: "Campaigns - Wanderer's Guide",
        user: req.user,
        campaigns,
        campaignLimit,
        canMakeCampaign,
      });
    });
  } else {
    res.redirect("/auth/login");
  }
}

module.exports = router;
