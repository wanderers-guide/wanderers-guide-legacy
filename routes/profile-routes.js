const router = require("express").Router();
const charRoutes = require("./char-routes");

const authCheck = (req, res, next) => {
  let rSheetPageMatch = req.originalUrl.match(/\/profile\/characters\/\d+$/);
  if (!req.user && rSheetPageMatch == null) {
    res.redirect("/auth/login");
  } else {
    next();
  }
};

router.get("/", authCheck, (req, res) => {
  let patreonAuthURL;
  if (process.env.NODE_ENV === "production") {
    patreonAuthURL =
      "https://www.patreon.com/oauth2/authorize?response_type=code&client_id=muoRJEEoFBwx_RQCR3GvkAEI1o_SA2pIM3rYbx_VrdRbm6Ca4VQS2TFLm5wlyprt&redirect_uri=https://wanderersguide.app/auth/patreon/redirect&scope=users pledges-to-me my-campaign";
  } else {
    patreonAuthURL =
      "https://www.patreon.com/oauth2/authorize?response_type=code&client_id=muoRJEEoFBwx_RQCR3GvkAEI1o_SA2pIM3rYbx_VrdRbm6Ca4VQS2TFLm5wlyprt&redirect_uri=http://localhost/auth/patreon/redirect&scope=users pledges-to-me my-campaign";
  }

  let isPatreonConnected = req.user.patreonAccessToken != null;

  res.render("pages/profile", {
    title: req.user.username + "'s Profile - Wanderer's Guide",
    user: req.user,
    patreonAuthURL: patreonAuthURL,
    isPatreonConnected: isPatreonConnected,
  });
});

router.use("/characters", charRoutes);

module.exports = router;
