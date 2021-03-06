module.exports.getRoutes = function() {

    var routes = {

        // Public resources
        index: "/",
        login: "/login",
        userLogin: "/api/users/login",
        userLogout: "/api/users/logout",

        //sessions
        sessions: "/api/sessions",

        // Users
        users: "/api/users",
        specificUSer: "/api/users/:id",

        // Roles
        roles: "/api/roles",
        specificRole: "/api/roles/:id",

        //Token - Permissions relationship
        tokenPermissions: "/api/tokens/permissions",

        // Roles - Permissions relationship
        rolePermissions: "/api/roles/:id/permissions",

        // Permissions
        permissions: "/api/permissions",
        specificPermission: "/api/permissions/:id"
    }

    return routes;
};

module.exports.getPublicRoutes = function() {

    var routes = this.getRoutes();

    var publicResources = [
        { httpVerb: 'post', uri: routes.sessions },
        { httpVerb: 'get', uri: routes.sessions },
        { httpVerb: 'delete', uri: routes.sessions }
    ];

    return publicResources;
};
