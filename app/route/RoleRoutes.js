/**
 * This module represents all routes related to roles
 */
var logger = require("../../config/logger");
var routesConstants = require("../../config/routesConstants");
var roleBusiness = require("../business/RoleBusiness");

/**
 * Following are the routes for roles
 * @param {Express} app the app element from express
 */
module.exports = function (app, passport) {

    var routes = routesConstants.getRoutes();

    // Get all roles.
    app.get(routes.roles, roleBusiness.all);

    // Get a role with its permissions
    app.get(routes.specificRole, roleBusiness.getRole);
    
    // Create a new role.
    app.post(routes.roles, roleBusiness.create);

    // Update a given role.
    app.put(routes.specificRole, roleBusiness.updateRole);

    // Delete a specific role.
    app.delete(routes.specificRole, roleBusiness.deleteRole);

    // Get all role permissions
    app.get(routes.rolePermissions, roleBusiness.getRolePermissions);

    // add permissions to a role.
    app.post(routes.rolePermissions, roleBusiness.setMultiplePermissionsToRole);
};
