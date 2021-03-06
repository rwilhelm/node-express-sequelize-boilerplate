/**
 * This module represents a repository for the table userToken
 * @param {Sequelize} userTokenModel the model created by sequelize
 */
var logger = require("../../config/logger");
var randomString = require('randomstring');

var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];

var userTokenModelReference;

module.exports.init = function(userTokenModel) {

    userTokenModelReference = userTokenModel;
    return this;
}

module.exports.getModel = function() {

    return userTokenModelReference;
}

/**
 * Finds a token row by token
 */
module.exports.findByToken = function(token, success, error){
    userTokenModelReference.find({where: {token: token}}).success(success).error(error);
}

/**
 * Finds a token row by token
 */
module.exports.findLastValidTokenByUser = function(userId, success, error){

    var now = new Date().getTime();

    userTokenModelReference.find({
        where: 
            {
            userId: userId,
            expiration: {
                gt: now
            }
        },
    }).success(success).error(error);
}

/**
 * Creates a token for an specific userId. It removes all other tokens before.
 */
module.exports.createTokenForUser = function(userId, type, success, error){

    var successDelete = function(){
        //then create a new token
        var timestamp = new Date().getTime();
        var timeout = config.app.tokenExpiration;
        var expiration = (timestamp-0)+(timeout-0);

        var rowToInsert = {
            token : timestamp.toString(),
            salt  : randomString.generate(10),
            expiration: expiration,
            type: type,
            userId: userId
        };

        //build model
        var builtModel = userTokenModelReference.build(rowToInsert);
        //encrypt token
        builtModel.setDataValue('token', builtModel.encryptToken(timestamp.toString()));

        builtModel.save().success(success).error(error);
    }

    //first delete all other tokens of the same type
    this.deleteAllTokensSameType(userId, type, successDelete);
}

module.exports.deleteAllTokensSameType = function(userId, type, success, error){

    var destroy = userTokenModelReference.destroy({type: type, userId: userId});

    if(success){
        destroy.success(success);
    }

    if(error){
        destroy.error(error);
    }
}

/**
 * Updates the expiration date of the token
 */
module.exports.updateTokenExpiration = function(token, success, error) {

    var timestamp = new Date().getTime();
    var timeout = config.app.tokenExpiration;
    var expiration = (timestamp-0)+(timeout-0);

    var successUpdate = function(){
        logger.debug("Token updated successfully");
    }

    var errorUpdate = function(error){
        // swallow it?
        logger.error(error);
    }

    //update expiration where token = token
    userTokenModelReference.update({expiration: expiration}, {token: token}, successUpdate, errorUpdate);
}
