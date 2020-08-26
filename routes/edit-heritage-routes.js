
const router = require('express').Router();

const PATH = '/admin/edit/heritage/'; // <- Change this if routes are ever changed //

router.get('*', (req, res) => {

    let extraData = req.originalUrl.substring(PATH.length);
    
    res.render('admin/admin_builder/builder_heritage', {
        title: "Heritage Builder - Wanderer's Guide",
        user: req.user,
        heritageID: extraData
    });
    
});

module.exports = router;