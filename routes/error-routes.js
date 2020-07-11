const router = require('express').Router();

// Create 404 Error route
router.get('*', (req, res) => {
    res.status(404);
    res.render('error/404_error', { title: "404 Not Found - Wanderer's Guide", user: req.user });
});

module.exports = router;