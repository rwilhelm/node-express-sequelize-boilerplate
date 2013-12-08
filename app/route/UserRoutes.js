/**
 * This module represents all resources related to users
 */
var constants = require("../../config/constants");
var userBusiness = require("../business/UserBusiness");
var authorization = require("../auth/Authorization");

/**
 * Following are the routes for users
 * @param {Express} app the app element from express
 */
module.exports = function (app, passport) {

	//all users
	app.get("/"+constants.routes.users, 
			userBusiness.all);

	app.put("/"+constants.routes.users,
			userBusiness.create);


	app.post("/"+constants.routes.login, 
			passport.authenticate('local', { session: false }),
			userBusiness.doLogin);

	app.get("/"+constants.routes.logout,
			userBusiness.doLogout);

};