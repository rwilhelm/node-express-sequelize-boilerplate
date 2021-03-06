var logger = require("../../config/logger");
var repositoryFactory = require("../repository/RepositoryFactory").getRepositoryFactory();
var constants = require("../../config/constants");
var routesConstants = require("../../config/routesConstants");
// Load configurations according to the selected environment
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];
var express = require("express");

var that = this;

/**
 * Similar to 403 Forbidden, but specifically for use when 
 * authentication is required and has failed or has not yet been provided
 */
var error401 = function(res, error) {

    var response = {
        error: error,
        loginUrl: "/login"
    }

    return res.status(401).json(response);
}

/**
 * On servers where authentication is required, 
 * this commonly means that the provided credentials were 
 * successfully authenticated but that the credentials still 
 * do not grant the client permission to access the resource 
 * (e.g., a recognized user attempting to access restricted content).
 */
var error403 = function(res, error) {

    var response = {
        error: error,
        loginUrl: "/login"
    }

    return res.status(403).json(response);
}

/*
 *  Generic require login routing middleware. Redirects to
 * /login if no cookie found
 */
exports.requiresLoginAndRedirect = function(req, res, next) {

    var userTokenRepository = repositoryFactory.getUserTokenRepository();

    //get the cookie
    var cookie = req.signedCookies[config.app.cookieName];

    var error = function(error){
        req.session.returnTo = req.originalUrl
        return res.redirect('/login');
    }

    if (!cookie) {
        return error("No autorizado.");	
    }

    var success = function(token){
        req.loggedInUser = token.userId;

        //update token
        userTokenRepository.updateTokenExpiration(cookie);

        next();
    }

    //find token
    userTokenRepository.findByToken(cookie, success, error);
}


var getTokenFromRequest2 = function(req){
    var token = req.get(constants.tokenHeader);
    if(!token){
        token = "";
    }
    return token;
}



exports.getTokenFromRequest = function(req) {
    return getTokenFromRequest2(req);
}

exports.getTokenType = function(req){
    var type = constants.client.web;
    if(req.body && req.body.type){
        type = constants.client.mobile;
    }

    return type;
}
    

/*
 *  Generic require login routing middleware. Redirects to
 * /login if no cookie found
 */
exports.requiresLogin = function(req, res, next) {

    var userTokenRepository = repositoryFactory.getUserTokenRepository();

    //get the token
    var cookie = getTokenFromRequest2(req);

    logger.debug("TOKEN:: "+cookie);

    if(!cookie) {		
        return error401(res, "No autorizado");	
    }

    var success = function(token) {
        if(token){
            req.loggedInUser = token.userId;

            //update token
            userTokenRepository.updateTokenExpiration(cookie);

            return next();
        }

        return error401(res, "No autorizado");
    }

    //find token
    userTokenRepository.findByToken(cookie, success, error401);
}

function isAuthorized(permissionList, httpVerb, uri) {

    // First translate the values to lowercase.
    httpVerb = httpVerb.toLowerCase();
    uri = uri.toLowerCase();

    var found = false;

    for (var i = 0; (i < permissionList.length) && (!found); i++) {

        var permission = permissionList[i];

        var permissionRoute = new express.Route('', permission.uri.toLowerCase());
        var matched = permissionRoute.match(uri);

        // Translate the object values to lowercase.
        if ((permission.httpVerb.toLowerCase() == httpVerb) && (matched)) {
            logger.info("Matching: "+permission.uri.toLowerCase()+" with "+uri+"  ::::::"+matched);
            found = true;
        }
    }

    logger.debug("isAuthorized: " + found);

    return found;
}

function isRequestingAPublicResource(publicResourceList, httpVerb, uri) {

    // First translate the values to lowercase.
    httpVerb = httpVerb.toLowerCase();
    uri = uri.toLowerCase();

    var found = false;

    for (var i = 0; (i < publicResourceList.length) && (!found); i++) {

        var publicResource = publicResourceList[i];
        if ((publicResource.httpVerb.toLowerCase() == httpVerb) && (publicResource.uri.toLowerCase() == uri)) {
            found = true;
        }
    }

    logger.debug("isRequestingAPublicResource: " + found);

    return found;
}

exports.checkIsAuthorizedToAccess = function(req, res, next) {

    var token = getTokenFromRequest2(req);

    var route = req.route;
    var httpVerb = route.method;
    var uri = req.path;

    var roleSuccess = function(roleResult) {

        var permissionSuccess = function(permissionList) {

            if (permissionList) {

                if (isAuthorized(permissionList, httpVerb, uri)) {

                    var message = "El usuario: " + token + 
                                  " está autorizado para ejecutar la operacion: "
                                  + httpVerb + " sobre la uri: " + uri;

                    logger.info(message);

                    // If the user is authorized the we allow he/she access the requested operation.
                    return next();

                } else {

                    error403(res, "No autorizado");
                }

            } else {

                // The given role does not conatin permissions.
                error403(res, "No autorizado");
            }
        };

        var permissionError = function(error) {
            res.status(503).json(error);
        };

        if (roleResult) {

            var roleRepository = repositoryFactory.getRoleRepository();
            roleRepository.getRolePermissions(roleResult.name, permissionSuccess, permissionError);

        } else {

            // No debería entrar aqui.
            var message = 'No hay existe un rol correspondiente al token enviado.';
            res.status(500).json(message);
        }
    };

    var roleError = function(roleErrorMessage) {
        res.status(503).json(error);
    };

    
    var publicResourceList = routesConstants.getPublicRoutes();

    if (isRequestingAPublicResource(publicResourceList, httpVerb, uri, req.app)) {

        // If the requested resource is public then it allows the user to access it.
        return next();

    } else {
        
        // If the requested resource is not public the it check if the user is authorized to access it.
        var sequelizeRepository = repositoryFactory.getSequelizeRepository();
        sequelizeRepository.findRoleByToken(token, roleSuccess, roleError);
    }
}
