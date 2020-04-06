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
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect',
        userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
    }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists in our own db

        console.log(profile);

        User.findOne({where:{ googleID: profile.id} }).then((currentUser) => {
            if(currentUser){
                // already have this user
                //console.log('user is: ', currentUser);
                done(null, currentUser);
            } else {

                // Switch jpg with jpeg
                //let image_url = profile._json.picture.url.slice(0, -3);
                //image_url += "jpeg";

                // if not, create user in our db
                User.create({
                    googleID: profile.id,
                    username: profile.displayName,
                    thumbnail: profile._json.picture
                }).then((newUser) => {
                    //console.log('created new user: ', newUser);
                    done(null, newUser);
                });
            }
        });
    })
);