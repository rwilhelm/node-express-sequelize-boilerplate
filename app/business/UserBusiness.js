var logger = require("../../config/logger");
var constants = require("../../config/constants");
var repositoryFactory = require("../repository/RepositoryFactory");
// Load configurations according to the selected environment
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];

var userResource = require("../resource/UserResource");

/**
 * This method returns (in the response) all users
 */
module.exports.all = function(req, res){

    var userRepository = repositoryFactory.getUserRepository(req.app);

    var success = function(result) {
        res.status(200).json(userResource.buildList(result));
    }

    var error = function(err) {
        res.status(500).json(err);
    }

    var offset = (req.param('offset') > 0 ? req.param('offset') : 1) - 1;
    var limit = (req.param('limit') > 0 ? req.param('limit') : constants.limit);

    var options = {
        offset: offset,
        limit: limit
    }

    userRepository.getAllUsers(options, success, error);
}

/**
 * This method return to the previous page, before login.
 * If no previous page exists, then redirect to index page
 */
module.exports.doLogin = function(req, res) {

    logger.debug("Inicio - doLogin "+req.user.username);

    var userTokenRepository = repositoryFactory.getUserTokenRepository(req.app);

    var success = function(token){
        if(token){
            var cookieName = config.app.cookieName;
            //set cookie
            res.cookie(cookieName, token.token, { signed: true });
            return res.json("OK");        
        }

        return res.status(401).json("Token not found");
    }

    var error = function(error){
        res.status(500).json(error);
    }

    userTokenRepository.findLastValidTokenByUser(req.user.id, success, error);

    logger.debug("Fin - doLogin");
}

/**
 * Logs out the user from app
 */
module.exports.doLogout = function(req, res){
    var cookieName = config.app.cookieName;
    //set cookie
    res.clearCookie(cookieName);
    //redirect to login page
    res.redirect("/login");
}

/*
 * Creates a new user
 */
module.exports.create = function(req, res){

    var userRepository = repositoryFactory.getUserRepository(req.app);

    var success = function(user){
        res.json(user);
    }

    var error = function(error){
        logger.error(error);
        res.status(500).json(error);
    }

    //encrypt password
    var userEntry = userRepository.build(req.body);

    var encryptedPassword = userEntry.encryptPassword(userEntry.password);
    userEntry.setDataValue('password', encryptedPassword);

    userEntry.save().success(success).error(error);
}

/*
 * Gets the role of a user by the token it sends in the http headers.
 */
module.exports.getUserRoleByToken = function(req, res) {

    var tokenSuccess = function(userToken) {

        if (userToken) {

            logger.debug(userToken);

        } else {

            tokenError("No se encontró el token");
        }
    };

    var tokenError = function(error) {
        logger.debug("*************** error: " + error);
    };

    var sequelizeRepository = repositoryFactory.getSequelizeRepository(req.app);
    sequelizeRepository.findRoleByToken(tokenSuccess, tokenError);
}
