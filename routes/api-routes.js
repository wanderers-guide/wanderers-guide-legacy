
const router = require('express').Router();
const apiCharRoutes = require('./api-char-routes');

const AuthCheck = require('../js/AuthCheck');

const charAuthCheck = (req, res, next) => {
  if(!req.user){
    res.status(401);
    res.send('Error: No user logged in');
  } else {
    AuthCheck.ownsCharacterAPI(req.user.id, req.params.id).then((ownsChar) => {
      if(ownsChar){
        req.charID = req.params.id;
        next();
      } else {
        res.status(401);
        res.send('Error: Invalid character ID');
      }
    });
  }
};

router.use('/char/:id', charAuthCheck, apiCharRoutes);

module.exports = router;