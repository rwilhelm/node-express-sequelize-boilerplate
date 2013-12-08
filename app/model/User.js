var logger = require("../../config/logger");
var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
  
  var User = sequelize.define('user', {
    
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true
    },

    username: {
    	type : DataTypes.STRING,
    	validate: {
    		notNull: true,
    		notEmpty: true,
    	}
    },

    password: {
      type : DataTypes.STRING,
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
    }
  
  }, {

	validate : {

	},

  instanceMethods: {
    encryptPassword: function(plainPassword) { 
      var cipher = crypto.createCipher('aes-256-cbc', this.salt);
      cipher.update(plainPassword, 'utf8', 'base64');
      var encryptedPassword = cipher.final('base64')
      return encryptedPassword;
    },

    decryptPassword: function(){
      var decipher = crypto.createDecipher('aes-256-cbc', this.salt);
      decipher.update(this.password, 'base64', 'utf8');
      var decryptedPassword = decipher.final('utf8');
      return decryptedPassword;
    }
  }

  });

  return User;

};