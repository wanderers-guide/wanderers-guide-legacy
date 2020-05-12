
module.exports = {
    google: {
        clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET
    },
    cloudSQL: {
        Username: process.env.CLOUD_SQL_USERNAME,
        Password: process.env.CLOUD_SQL_PASSWORD,
        Host: process.env.CLOUD_DB_HOST,
        Instance: process.env.CLOUD_DB_INSTANCE,
    },
    userDB: {
        DbName: process.env.USER_DB_NAME,
    },
    backgroundDB: {
        DbName: process.env.BACK_DB_NAME,
    },
    contentDB: {
        DbName: process.env.CONTENT_DB_NAME,
    },
    session: {
        expressSecret: process.env.EXPRESS_SESSION_SECRET
    }
};