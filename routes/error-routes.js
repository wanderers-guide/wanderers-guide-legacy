const router = require('express').Router();

// Create 404 Error route
router.get('*', (req, res) => {
    res.status(404);
    res.render('404_error', { title: "404 Not Found - Apeiron", user: req.user });
});

module.exports = router;