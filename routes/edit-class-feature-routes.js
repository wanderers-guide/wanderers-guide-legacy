
const router = require('express').Router();

const PATH = '/admin/edit/class-feature/'; // <- Change this if routes are ever changed //

router.get('*', (req, res) => {

    let extraData = req.originalUrl.substring(PATH.length);
    
    res.render('admin/admin_builder/builder_class-feature', {
        title: "Class Feature Builder - Wanderer's Guide",
        user: req.user,
        classFeatureID: extraData
    });
    
});

module.exports = router;