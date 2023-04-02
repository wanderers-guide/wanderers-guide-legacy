const router = require("express").Router();
const apiCharRoutes = require("./api/api-char-routes");
const apiGeneralRoutes = require("./api/api-general-routes");

const APIClientApp = require("../models/contentDB/APIClientApp");
const Character = require("../models/contentDB/Character");

const ClientAPI = require("../js/ClientAPI");
const AuthCheck = require("../js/AuthCheck");

const charAuthCheck = (req, res, next) => {
  if (!req.user) {
    res.status(401);
    res.redirect("/auth/login");
  } else {
    AuthCheck.ownsCharacter(req.user.id, req.params.id).then((ownsChar) => {
      if (ownsChar) {
        req.charID = req.params.id;
        next();
      } else {
        res.status(401);
        res.redirect("/");
      }
    });
  }
};

router.get("/oauth2/authorize/:id", charAuthCheck, (req, res) => {
  if (req.query.client_id != null && req.query.response_type != null) {
    let responseType = req.query.response_type;
    if (responseType != "code") {
      res.sendStatus(400);
      return;
    }

    let charID = req.charID;
    let clientID = req.query.client_id;
    let state = req.query.state;

    return APIClientApp.findOne({ where: { clientID: clientID } }).then(
      (apiClient) => {
        return Character.findOne({ where: { id: charID } }).then(
          (character) => {
            if (apiClient != null && character != null) {
              res.render("pages/api_request_access", {
                title: "Request Access - Wanderer's Guide",
                user: req.user,
                apiClient: apiClient,
                charName: character.name,
                charID: charID,
                clientID: clientID,
                state: state,
              });
            } else {
              res.status(401);
              res.redirect("/");
            }
          },
        );
      },
    );
  } else {
    res.status(400);
    res.redirect("/");
  }
});

router.post("/oauth2/token", (req, res) => {
  if (
    req.query.code != null &&
    req.query.client_id != null &&
    req.header("Authorization") != null
  ) {
    const code = req.query.code;
    const clientID = req.query.client_id;
    const apiKey = req.header("Authorization").replace("Apikey ", "");

    ClientAPI.generateAccessToken(code, clientID, apiKey).then(
      (accessTokenData) => {
        if (accessTokenData != null) {
          res.send(accessTokenData);
        } else {
          res.sendStatus(401);
        }
      },
    );
  } else {
    res.sendStatus(400);
  }
});

///////////////

const charCheck = (req, res, next) => {
  if (req.header("Authorization") != null) {
    req.charID = req.params.id;
    const accessToken = req.header("Authorization").replace("Bearer ", "");
    ClientAPI.hasAccessToCharacter(req.charID, accessToken).then(
      (accessRights) => {
        if (accessRights != null) {
          req.accessRights = accessRights;
          next();
        } else {
          res.sendStatus(401);
        }
      },
    );
  } else {
    res.sendStatus(400);
  }
};

router.use("/char/:id", charCheck, apiCharRoutes);

///////////////

const authCheck = (req, res, next) => {
  if (req.header("Authorization") != null) {
    const apiKey = req.header("Authorization").replace("Apikey ", "");
    ClientAPI.validAPIKey(apiKey).then((isValid) => {
      if (isValid) {
        next();
      } else {
        // Incorrect API requests will come back to this point.
        // For that reason, we return 400 rather than 401 here.
        res.sendStatus(400);
      }
    });
  } else {
    res.sendStatus(400);
  }
};

router.use("/", authCheck, apiGeneralRoutes);

module.exports = router;
