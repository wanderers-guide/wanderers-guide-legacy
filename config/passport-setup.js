const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const RedditStrategy = require('passport-reddit').Strategy;
//const AppleStrategy = require('passport-apple');
const keys = require('./keys');
const User = require('../models/contentDB/User');
let callbackURL = `https://wanderersguide.app/auth/google/redirect`;
if (process.env.NODE_ENV !== 'production') {
    callbackURL = `http://localhost:${process.env.PORT}/auth/google/redirect`
}


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findByPk(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy({
        // Options for Google Strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL,
    }, (accessToken, refreshToken, profile, done) => {
        // Check if user exists in database
        User.findOne({where:{ googleID: profile.id} }).then((currentUser) => {
            if(currentUser){
                // Already have user
                console.log('(Google) User logged in: '+profile.displayName);
                done(null, currentUser);
            } else {
                // Create new user in database
                console.log('(Google) Created new user: '+profile.displayName);
                User.create({
                    googleID: profile.id,
                    redditID: '',
                    username: profile.displayName,
                    thumbnail: profile._json.picture
                }).then((newUser) => {
                    done(null, newUser);
                }).catch(err => {
                  console.error(err);
                  console.error('Failed to create user from Google profile data, using default data instead...');
                  User.create({
                    googleID: profile.id,
                    redditID: '',
                    username: 'New User',
                    thumbnail: 'https://wanderersguide.app/images/fb_profile_pic.png'
                  }).then((defaultNewUser) => {
                      done(null, defaultNewUser);
                  });
                });
            }
        });
    })
);

/*
passport.use(
    new AppleStrategy({
        clientID: "",
        teamID: "",
        callbackURL: "",
        keyID: "",
        privateKeyLocation: "",
        passReqToCallback: true
    }, function(req, accessToken, refreshToken, decodedIdToken, profile, cb) {
        // Here, check if the decodedIdToken.sub exists in your database!
        // decodedIdToken should contains email too if user authorized it but will not contain the name
        // `profile` parameter is REQUIRED for the sake of passport implementation
        // it should be profile in the future but apple hasn't implemented passing data
        // in access token yet https://developer.apple.com/documentation/sign_in_with_apple/tokenresponse
        cb(null, decodedIdToken);
    })
);
*/

passport.use(
    new RedditStrategy({
        clientID: (process.env.NODE_ENV === 'production') ? keys.reddit.clientID : keys.reddit_dev.clientID,
        clientSecret: (process.env.NODE_ENV === 'production') ? keys.reddit.clientSecret : keys.reddit_dev.clientSecret,
        callbackURL: `https://${(process.env.NODE_ENV === 'production') ? 'wanderersguide.app' : 'localhost'}/auth/reddit/redirect`,
    }, (accessToken, refreshToken, profile, done) => {
        // Check if user exists in database
        User.findOne({where:{ redditID: profile.id} }).then((currentUser) => {
          if(currentUser){
              // Already have user
              console.log('(Reddit) User logged in: '+profile.name);
              done(null, currentUser);
          } else {
              // Create new user in database
              console.log('(Reddit) Created new user: '+profile.name);
              User.create({
                  googleID: '',
                  redditID: profile.id,
                  username: profile.name,
                  thumbnail: 'https://www.redditstatic.com/avatars/avatar_default_02_24A0ED.png'
              }).then((newUser) => {
                  done(null, newUser);
              }).catch(err => {
                console.error(err);
                console.error('Failed to create user from Reddit profile data, using default data instead...');
                User.create({
                  googleID: '',
                  redditID: profile.id,
                  username: 'New User',
                  thumbnail: 'https://wanderersguide.app/images/fb_profile_pic.png'
                }).then((defaultNewUser) => {
                    done(null, defaultNewUser);
                });
              });
          }
        });
    })
);