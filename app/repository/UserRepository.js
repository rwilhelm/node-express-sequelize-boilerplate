/**
 * This module represents a repository for the table user
 * @param {Sequelize} userModel the model created by sequelize
 */
module.exports = function(userModel) {

	/**
	 * finds all results of the user table according to the params offset and limit
	 */
	userModel.getAllUsers = function(options, success, error){
		userModel.findAll({offset: options.offset, limit: options.limit}).success(success).error(error);
	}

	userModel.findByUsername = function(username, success, error){
		userModel.find({where: {username: username}}).success(success).error(error);
	}

	return userModel;
};
