var logger = require("../../config/logger");
var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {

    var UserToken = sequelize.define('userToken', {

        token: {
            type : DataTypes.STRING,
            primaryKey: true, 
            validate: {
                notNull: true,
                notEmpty: true,
            }
        },
        salt: {
            type: DataTypes.STRING,
            validate: {
                notNull: true,
                notEmpty: true
            }
        },
        expiration: {
            type: DataTypes.BIGINT,
            validate: {
                notNull: true,
                notEmpty: true
            }
        }

    }, {

        validate : {

        },

        instanceMethods: {

            encryptToken: function(plainToken) { 
                var cipher = crypto.createCipher('aes-256-cbc', this.salt);
                cipher.update(plainToken, 'utf8', 'base64');
                var encryptedToken = cipher.final('base64')
                return encryptedToken;
            },

            decryptToken: function(){
                var decipher = crypto.createDecipher('aes-256-cbc', this.salt);
                decipher.update(this.token, 'base64', 'utf8');
                var decryptedToken = decipher.final('utf8');
                return decryptedToken;
            },

            getRoleByToken: function(success, error) {

                sequelize.query("select * from roles").success(success).error(error);

                /*
                sequelize.query("SELECT r.id, r.name FROM userToken ut LEFT JOIN users AS u 
                ON u.id = ut.userId LEFT JOIN roles AS r ON u.roleId = r.id").success(function(result) {

                logger.debug("QQQQQQQQQQQQQQQQQQQQQQQ: " + result);
                });
                */
            }
        }

    });

    return UserToken;
};
