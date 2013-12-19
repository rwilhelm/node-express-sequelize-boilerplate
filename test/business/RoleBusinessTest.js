var should = require('should');
var rewire = require("rewire");
var logger = require("../../config/logger");

var constants = require("../../config/constants");

describe('RoleBusiness', function () {

    describe('all method', function () {

        it('should return 200 OK', function (done) {

            //attention: it's rewire not require :)
            var roleBusiness = rewire("../../app/business/RoleBusiness");

            var expectedResult = {

                foo: 1
            }

            var expectedStatus = 200;

            var request = {

                param: function(name){
                    //mocks offset and limit
                    return 10;
                }
            };

            var response = {

                render: function(view, viewData) {
                    view.should.equal(constants.getRoutes().roles);
                },
                status: function(status) {
                    status.should.equal(expectedStatus);
                    return this;
                },
                json: function(result) {

                    result.should.equal(expectedResult);
                    done();
                }
            };

            /**
             * Mock all needed methods and properties to the element we try to test
             */
            var mocks = function() {

                //mock getRepository function (i.e. the repository). This way, we do not need the database connection
                roleBusiness.__set__("repositoryFactory", {
                    getRoleRepository: function(req) {
                        return {
                            getAllRoles: function(options, success, error) {
                                success(expectedResult);
                            }
                        }
                    }
                });
            };

            //set up mocks
            mocks();

            roleBusiness.all(request, response);
        });

        it('should return 500 error if something wrong happens at persistence layer', function(done) {

            //attention: it's rewire not require :)
            var roleBusiness = rewire("../../app/business/RoleBusiness");

            var expectedResult= {
                foo: 1
            }

            var expectedStatus = 500;

            var request = {
                param: function(name) {
                    //mocks offset and limit
                    return 10;
                }
            };

            var response = {
                render: function(view, viewData) {
                    view.should.equal(constants.getRoutes().documentType);
                },
                status: function(status) {
                    status.should.equal(expectedStatus);
                    return this;
                },
                json: function(result) {
                    result.should.equal(expectedResult);
                    done();
                }
            };

            /**
             * Mock all needed methods and properties to the element we try to test
             */
            var mocks = function() {

                //mock getRepository function (i.e. the repository). This way, we do not need the database connection
                roleBusiness.__set__("repositoryFactory", {
                    getRoleRepository: function(req){
                        return {
                            getAllRoles: function(options, success, error){
                                error(expectedResult);
                            }
                        }
                    }
                });
            }

            //set up mocks
            mocks();

            roleBusiness.all(request, response);
        });
    });

    describe('create method', function() {

        it('should return 201 Created', function(done) {

            var roleBusiness = rewire("../../app/business/RoleBusiness");

            var request = {

                body: {
                    'name' : 'admin'
                }
            };

            var expectedStatus = 201;

            var expectedResult = {

                "id": 1,
                "name": "admin",
                "createdAt": "2013-12-14T05:24:37.000Z",
                "updatedAt": "2013-12-14T05:24:37.000Z"
            };

            var response = {

                status: function(status) {
                    status.should.equal(expectedStatus);
                    return this;
                },
                json: function(result) {

                    result.should.equal(expectedResult);
                    done();
                }
            };

            /**
             * Mock all needed methods and properties to the element we try to test
             */
            var mocks = function() {

                //mock getRepository function (i.e. the repository). This way, we do not need the database connection
                roleBusiness.__set__(

                    "repositoryFactory", {

                    getRoleRepository: function(req) {

                        return {

                            build:function(req) {

                                var result = {

                                    save: function() {

                                        return result;
                                    },

                                    success: function(success) {

                                        success(expectedResult);
                                        return result;
                                    }, 

                                    error: function(error) {

                                        return result;
                                    }
                                }

                                return result;
                            }
                        }

                        return roleRepository;
                    }
                });

            };

            //set up mocks
            mocks();

            roleBusiness.create(request, response); 
        });

        it('should return 500 error if something wrong happens at persistence layer', function(done) {

            var roleBusiness = rewire("../../app/business/RoleBusiness");

            var request = {

                body: {
                    'name' : 'admin'
                }
            };

            var expectedStatus = 500;

            var expectedResult = {

                "id": 1,
                "name": "admin",
                "createdAt": "2013-12-14T05:24:37.000Z",
                "updatedAt": "2013-12-14T05:24:37.000Z"
            };

            var response = {

                status: function(status) {
                    status.should.equal(expectedStatus);
                    return this;
                },
                json: function(result) {

                    result.should.equal(expectedResult);
                    done();
                }
            };

            /**
             * Mock all the methods and properties needed to the element we try to test
             */
            var mocks = function() {

                //mock getRepository function (i.e. the repository). This way, we do not need the database connection
                roleBusiness.__set__(

                    "repositoryFactory", {

                    getRoleRepository: function(req) {

                        return {

                            build:function(req) {

                                var result = {

                                    save: function() {

                                        return result;
                                    },

                                    success: function(success) {

                                        return result;
                                    }, 

                                    error: function(error) {

                                        error(expectedResult);
                                        return result;
                                    }
                                }

                                return result;
                            }
                        }

                        return roleRepository;
                    }
                });
            };

            //set up mocks
            mocks();

            roleBusiness.create(request, response); 
        });
    });

    describe('getRolePermissions method', function() {

        it('should return 200 and a list of the permissions of the given role', function(done) {

            var roleBusiness = rewire("../../app/business/RoleBusiness");

            var rolename = 'admin';

            var request = {

                params: {

                    'rolename': rolename
                }
            };

            var expectedStatus = 200;

            var expectedResult = {

                'permissions' : '[]'
            };

            var response = {

                status: function(status) {
                    status.should.equal(expectedStatus);
                    return this;
                },
                json: function(result) {

                    result.should.equal(expectedResult);
                    done();
                }
            };

            // Verify the request contains the expected params.
            var params = request.params;
            params.should.not.be.empty;
            params.should.have.keys('rolename');
            params.rolename.should.include('admin');

            /**
             * Mock all the methods and properties needed to the element we try to test
             */
            var mocks = function() {

                roleBusiness.__set__("repositoryFactory", {

                    getRoleRepository: function(req) {
                        return roleRepository;
                    },

                    getPermissionRepository: function(req) {
                        return permissionRepository;
                    }
                });

                roleBusiness.__set__("roleRepository", {

                    getRoleByName: function(rolename, success, error) {
                        success(success);
                    }
                });

                roleBusiness.__set__("permissionRepository", {

                    findPermissionsByRole: function(role, success, error) {
                        success(expectedResult);
                    }
                });
            };

            //set up mocks
            mocks();

            roleBusiness.getRolePermissions(request, response);
        });
    });
});
