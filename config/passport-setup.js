const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const RedditStrategy = require('passport-reddit').Strategy;
const keys = require('./keys');
const User = require('../models/contentDB/User');

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
        callbackURL: '/auth/google/redirect',
        userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
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

passport.use(
    new RedditStrategy({
        clientID: (process.env.PRODUCTION == 'true') ? keys.reddit.clientID : keys.reddit_dev.clientID,
        clientSecret: (process.env.PRODUCTION == 'true') ? keys.reddit.clientSecret : keys.reddit_dev.clientSecret,
        callbackURL: '/auth/reddit/redirect'
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