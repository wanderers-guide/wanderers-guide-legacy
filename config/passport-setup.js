const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
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
                console.log('User logged in: '+profile.displayName);
                done(null, currentUser);
            } else {
                // Create new user in database
                console.log('Created new user: '+profile.displayName);
                User.create({
                    googleID: profile.id,
                    username: profile.displayName,
                    thumbnail: profile._json.picture
                }).then((newUser) => {
                    done(null, newUser);
                });
            }
        });
    })
);