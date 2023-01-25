![Wanderer's Guide](https://wanderersguide.app/images/logo.png "Wanderer's Guide logo")

- [Welcome to the Wanderer's Guide Repo](#welcome-to-the-wanderers-guide-repo)
  - [Issues, bugs, and requests](#issues-bugs-and-requests)
  - [Setting WG up on your local environment](#setting-wg-up-on-your-local-environment)
    - [Get the Prerequisites](#get-the-prerequisites)
      - [1. Software Installs](#1-software-installs)
      - [2. Set Up Socials and .env](#2-set-up-socials-and-env)
    - [Setup Guide Fast Mode](#setup-guide-fast-mode)
    - [Setup Guide Nodemon Mode](#setup-guide-nodemon-mode)
    - [Legacy Setup Guide](#legacy-setup-guide)
      - [Get the Prerequisites](#get-the-prerequisites-1)
- [](#)

# Welcome to the Wanderer's Guide Repo

_"Not all those who wander are lost"_

## Issues, bugs, and requests

We welcome contributions and feedback on Wanderer's Guide.
Please file a request in our
[issue tracker](https://github.com/Quzzar/Wanderers-Guide/issues/new/choose)
or create a [pull request](https://github.com/Quzzar/Wanderers-Guide/pulls).
For simple changes (such as tweaking some text),
it's easiest to make changes using the GitHub UI.

## Setting WG up on your local environment

Since Wanderer's Guide is, structure-wise, effectively a platform, it used to be a complex pain. However with the use of docker and docker-compose we have simplified that system. The following is the current way to do local development as well as the legacy way.

### Get the Prerequisites

Here is the base stuff you need to work in this repo.

#### 1. Software Installs

You will need the following installed on your systems

- [Node JS](https://nodejs.org/en/)
- [Docker](https://www.docker.com/)
- [sql data 1/20/23](https://drive.google.com/file/d/1mh3W1CKmnuuLso30gG8y9-f0PQrrqg0N/view)
- NVM `npm i -g nvm` this is optional but lets you use a particular npm version with ease.
- Update the .env file with socials or the dev.env file with socials (don't commit me)

#### 2. Set Up Socials and .env

1. In the main project folder, create a `.env` file for private keys. Within that file, paste this:

   ```env
    CLOUD_SQL_USERNAME = <db-username>
    CLOUD_SQL_PASSWORD = <db-password>
    CLOUD_DB_HOST = <db-ip-address>
    CLOUD_DB_PORT = <db-port>
    BACK_DB_NAME = wandeide_main
    CONTENT_DB_NAME = wandeide_main

    GOOGLE_AUTH_CLIENT_ID = <google-social-login client-id>
    GOOGLE_AUTH_CLIENT_SECRET = <google-social-login client-secret>

    REDDIT_AUTH_CLIENT_ID = <reddit-social-login client-id>
    REDDIT_AUTH_CLIENT_SECRET = <reddit-social-login client-secret>

    REDDIT_DEV_AUTH_CLIENT_ID = <reddit-dev-social-login client-id>
    REDDIT_DEV_AUTH_CLIENT_SECRET = <reddit-dev-social-login client-secret>

    EXPRESS_SESSION_SECRET = <user-session-store secret-key>

    PATREON_CLIENT_ID = <patreon-login client-id>
    PATREON_CLIENT_SECRET = <patreon-login client-secret>

    PRODUCTION = false

    DATABASE_URL = mysql://<db-username>:<db-password>@<db-ip-address>:<db-port>/wandeide_main?ssl-mode=REQUIRED?schema=wandeide_main
   ```

2. Social logins:

   You can now view your own locally hosted version of Wanderer's Guide but, since Wanderer's Guide only uses social logins, you're going to have to get yourself a OAuth2 client ID and secret and put it in your `.env` file to login.

   You don't have set this up for each social login, just the ones you plan to be using.

   You can follow these guides to get your client ID and secret:

   - **Google**: https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid

   - **Reddit**: https://github.com/reddit-archive/reddit/wiki/OAuth2

   You can set the redirect uri to `http://localhost/auth/(google or reddit)/redirect`

   For Google, replace `<google-social-login client-id>` and `<google-social-login client-secret>` with the respective client ID and secret you generate.

   For Reddit, you only need to replace `<reddit-dev-social-login client-id>` and `<reddit-dev-social-login client-secret>`. The non-dev versions in the `.env` file are for production only.

3. Set cookie session secret:

   Replace `<user-session-store secret-key>` in your `.env` file with a random secret key of your choice [Duck Duck Go Generate random](https://duckduckgo.com/?q=random+password). This is used for encrypting cookies.

### Setup Guide Fast Mode

1. Clone the repo:

   ```
   git clone https://github.com/Quzzar/Wanderers-Guide.git
   ```

2. Download sql data to the repo. [sql data 1/20/23](https://drive.google.com/file/d/1mh3W1CKmnuuLso30gG8y9-f0PQrrqg0N/view)

3. Start Docker
   `docker-compose up --build`

4. Done

### Setup Guide Nodemon Mode

1. Clone the repo:

   ```
   git clone https://github.com/Quzzar/Wanderers-Guide.git
   ```

2. Download sql data to the repo. [sql data 1/20/23](https://drive.google.com/file/d/1mh3W1CKmnuuLso30gG8y9-f0PQrrqg0N/view)

3. Start Docker
   `docker-compose up --build mysql`

4. Run site on local instead of docker.
   `npx prisma generate && npm run dev`

### Legacy Setup Guide

#### Get the Prerequisites

You will need the following tools installed to run WG:

- **nodeJS**, a JavaScript runtime environment.
  You will need this installed first before you continue with the setup guide. [Link.](https://nodejs.org/en/)
- **Redis**, an in-memory data structure store.
  The setup guide will cover getting this. For Windows, there is Redis Windows which runs a Redis server via .exe file.
- **MySQL**, our relational database system of choice.
  The setup guide will cover getting this. In the setup guide, it will also ask to install MySQL Workbench - this is not required, it was just found to be the least technical way to seed the database.

1. Clone the repo:

   ```
   git clone https://github.com/Quzzar/Wanderers-Guide.git
   ```

2. Within the main project folder, install dependencies:

   ```
   npm install
   ```

3. _Optional:_ After cloning the repo and installing dependencies, create a branch for your changes:

   ```
   git checkout -b <BRANCH_NAME>
   ```

4. Create a MySQL database:

   If you don't already have one, install and setup a [MySQL Community Server](https://dev.mysql.com/downloads/mysql/) (version 5.7.32). If you're on Windows, using the installer is the easiest setup. This setup guide will also be using MySQL Workbench, so make sure to enable and install that as well.

   After it's installed, on Windows, to start your local MySQL server, you can navigate to `C:\Program Files\MySQL\MySQL Server 5.7\bin\` and run the `mysqld` command in the terminal.

   Your local MySQL server should now be running in the background. You can access this server through the terminal but, for simplicity of seeding WG's dev database, we'll be using MySQL Workbench.

   Open the workbench and make a new connection for your local MySQL server (if one doesn't already exist). Unless changed, the hostname should be `localhost`, port `3306`, username `root`, and the password is the root password you set when setting up the server.

   Double click to open this new connection, it should connect. If not, check to make sure your server is running in the background and that you put in the connection information correctly.

   Once connected, open `Server > Data Import` and select to import from a self-contained file. Download one of the versions of WG's dev database (mostly the latest version) from [here](https://drive.google.com/drive/folders/1TIIKfROwuvuudhMZ-79loESHvjpqI_O_?usp=sharing). The file names are dated, `WG-dev-db-{date}.sql`.

   Select the dev database sql file you just downloaded and then click Start Import. If all goes well, the import should be successful.

5. Update your `.env` file to include your database connection info:

   Replace `<db-username>` to your username (probably `root`), `<db-password>` to your password, `<db-port>` to your port (probably `3306`), and `<db-ip-address>` to `localhost`.

   Make sure to also replace these values down in the `DATABASE_URL` connection string as well.

6. Setting up Prisma:

   Wanderer's Guide currently uses two ORMs: [Prisma](https://www.prisma.io/) and [Sequalize](https://sequelize.org/).

   Sequalize is what was used solely for the first year of development but then we transitioned many parts to using Prisma instead as it is faster and allows us to have server-side caching for sql queries.

   Currently Sequalize is used for query's that should not be cached (user data. _ex:_ characters) while Prisma is being used for query's that should be (system data. _ex:_ ancestries).

   To setup Prisma, run this command:

   ```
   npx prisma generate
   ```

7. With that, you should be good to start up the backend server and run Wanderer's Guide!

   Use this command to start up the server and run Redis in the background:

   ```
   npm run dev
   ```

   _We have nodemon installed so the server will automatically restart when you make changes to files._

   Wanderer's Guide should now be running on localhost: http://localhost/

8. Social logins:

   You can now view your own locally hosted version of Wanderer's Guide but, since Wanderer's Guide only uses social logins, you're going to have to get yourself a OAuth2 client ID and secret and put it in your `.env` file to login.

   You don't have set this up for each social login, just the ones you plan to be using.

   You can follow these guides to get your client ID and secret:

   - **Google**: https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid

   - **Reddit**: https://github.com/reddit-archive/reddit/wiki/OAuth2

   You can set the redirect uri to `http://localhost/auth/(google or reddit)/redirect`

   For Google, replace `<google-social-login client-id>` and `<google-social-login client-secret>` with the respective client ID and secret you generate.

   For Reddit, you only need to replace `<reddit-dev-social-login client-id>` and `<reddit-dev-social-login client-secret>`. The non-dev versions in the `.env` file are for production only.

9. Complete!

   You are now running Wanderer's Guide on your local machine. You should be able to login, make characters, and make changes. The nodeJS server will automatically restart whenever you make changes to files.

   As for your `.env`, don't need to replace `<reddit-social-login client-id>`, `<reddit-social-login client-secret>`, `<patreon-login client-id>`, or `<patreon-login client-secret>`.

   If you are having problems with any of these steps, which is bound to happen with this kind of stuff, please first check the internet for a solution to the problem. Then, if you still can't seem to fix it, see our `#development` channel in our [Discord server](https://discord.gg/mfqCWBF7Qv).

#
