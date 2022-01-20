
const Build = require('../../models/contentDB/Build');

const router = require('express').Router();

router.get('/', (req, res) => {

  let viewBuildID = parseInt(req.query.view_id); if(isNaN(viewBuildID)){viewBuildID=null;}
  let buildTabName = req.query.sub_tab;

  res.render('builds/builds', {
    title: "Builds - Wanderer's Guide",
    user: req.user,
    viewBuildID,
    buildTabName,
  });
});

router.get('/create', (req, res) => {

  let buildID = parseInt(req.query.build_id); if(isNaN(buildID)){buildID=null;}
  let buildPageName = req.query.page;

  Build.findOne({ where: { id: buildID, userID: req.user.id } }).then((build) => {
    if(build != null){

      if(buildPageName != null && buildPageName.toUpperCase() == 'INIT'){
        res.render('builds/build_creator_init', {
          title: "Create Build - Wanderer's Guide",
          user: req.user,
          build,
        });
      } else {
        res.render('builds/build_creator', {
          title: "Create Build - Wanderer's Guide",
          user: req.user,
          build,
        });
      }

    } else {
      res.render('error/404_error', { title: "Unknown Build - Wanderer's Guide" });
    }
  }).catch((error) => {
    res.render('error/404_error', { title: "Unknown Build - Wanderer's Guide" });
  });

  

});

module.exports = router;