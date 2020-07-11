
const router = require('express').Router();

const PATH = '/admin/edit/background/'; // <- Change this if routes are ever changed //

router.get('*', (req, res) => {

    let extraData = req.originalUrl.substring(PATH.length);

    res.render('admin/admin_builder/builder_background', {
        title: "Background Builder - Wanderer's Guide",
        user: req.user,
        backgroundID: extraData
    });
    
});

module.exports = router;