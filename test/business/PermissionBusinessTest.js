var should = require('should');
var rewire = require("rewire");
var logger = require("../../config/logger");

var constants = require("../../config/constants");

describe('PermissionBusiness', function () {

    describe('getAllPermissions method', function () {

        it('should return 200 OK', function (done) {

            //attention: it's rewire not require :)
            var permissionBusiness = rewire("../../app/business/PermissionBusiness");

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
                permissionBusiness.__set__("repositoryFactory", {
                    getPermissionRepository: function(req) {
                        return {
                            getAllPermissions: function(options, success, error) {
                                success(expectedResult);
                            }
                        }
                    }
                });

                permissionBusiness.__set__("permissionResource", {
                    buildList: function(permissions) {
                        return expectedResult;
                    }
                });
            }

            //set up mocks
            mocks();

            permissionBusiness.getAllPermissions(request, response);
        });

        it('should return 500 Error', function (done) {

            //attention: it's rewire not require :)
            var permissionBusiness = rewire("../../app/business/PermissionBusiness");

            var expectedResult = {
                'error': 'error message'
            }

            var expectedStatus = 500;

            var request = {
                param: function(name){
                    //mocks offset and limit
                    return 10;
                }
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
                permissionBusiness.__set__("repositoryFactory", {
                    getPermissionRepository: function(req) {
                        return {
                            getAllPermissions: function(options, success, error) {
                                error(expectedResult);
                            }
                        }
                    }
                });
            }

            //set up mocks
            mocks();

            permissionBusiness.getAllPermissions(request, response);
        });
    });

    describe('getPermission method', function () {

        it('should return 200 OK', function (done) {

            //attention: it's rewire not require :)
            var permissionBusiness = rewire("../../app/business/PermissionBusiness");

            var expectedResult = {
                foo: 1
            }

            var expectedStatus = 200;

            var permissionName = 'Admin';
            var request = {

                params: {
                    permissionName: permissionName
                }
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

            // Verify the request if formed properly.
            request.params.permissionName.should.equal(permissionName);

            /**
             * Mock all needed methods and properties to the element we try to test
             */
            var mocks = function() {

                //mock getRepository function (i.e. the repository). This way, we do not need the database connection
                permissionBusiness.__set__("repositoryFactory", {
                    getPermissionRepository: function() {
                        return {
                            getPermissionById: function(permissionName, success, error) {
                                success(expectedResult);
                            }
                        }
                    }
                });

                permissionBusiness.__set__("permissionResource", {
                    buildList: function(permission) {
                        return expectedResult;
                    }
                });
            }

            //set up mocks
            mocks();

            permissionBusiness.getPermission(request, response);
        });

        it('should return 500 Error', function (done) {

            //attention: it's rewire not require :)
            var permissionBusiness = rewire("../../app/business/PermissionBusiness");

            var expectedResult = {
                foo: 1
            }

            var expectedStatus = 500;

            var permissionName = 'Admin';
            var request = {

                params: {
                    permissionName: permissionName
                }
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

            // Verify the request if formed properly.
            request.params.permissionName.should.equal(permissionName);

            /**
             * Mock all needed methods and properties to the element we try to test
             */
            var mocks = function() {

                //mock getRepository function (i.e. the repository). This way, we do not need the database connection
                permissionBusiness.__set__("repositoryFactory", {
                    getPermissionRepository: function(req) {
                        return {
                            getPermissionById: function(permissionName, success, error) {
                                error(expectedResult);
                            }
                        }
                    }
                });
            }

            //set up mocks
            mocks();

            permissionBusiness.getPermission(request, response);
        });
    });

    describe('updatePermission method', function () {

        it('should return 200 OK', function (done) {

            //attention: it's rewire not require :)
            var permissionBusiness = rewire("../../app/business/PermissionBusiness");

            var expectedResult = "OK";
            var expectedStatus = 200;

            var permissionName = 'admin';
            var request = {

                params: {
                    permissionName: permissionName
                },

                body: {
                    'name': 'root',
                    'httpVerb': 'get',
                    'uri': '/api/permissions'
                }
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

            // Verify the request if formed properly.
            request.params.permissionName.should.equal(permissionName);
            request.body.should.not.be.empty;

            /**
             * Mock all needed methods and properties to the element we try to test
             */
            var mocks = function() {

                //mock getRepository function (i.e. the repository). This way, we do not need the database connection
                permissionBusiness.__set__("repositoryFactory", {
                    getPermissionRepository: function(req) {
                        return {
                            updatePermission: function(permissionName, updatedPermission, success, error) {
                                success(expectedResult);
                            }
                        }
                    }
                });
            }

            //set up mocks
            mocks();

            permissionBusiness.updatePermission(request, response);
        });

        it('should return 500 Error', function (done) {

            //attention: it's rewire not require :)
            var permissionBusiness = rewire("../../app/business/PermissionBusiness");

            var expectedResult = {
                'error': 'error message'
            }

            var expectedStatus = 500;

            var permissionName = 'admin';
            var request = {

                params: {
                    permissionName: permissionName
                },

                body: {
                    'name': 'root',
                    'httpVerb': 'get',
                    'uri': '/api/permissions'
                }
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

            // Verify the request if formed properly.
            request.params.permissionName.should.equal(permissionName);
            request.body.should.not.be.empty;

            /**
             * Mock all needed methods and properties to the element we try to test
             */
            var mocks = function() {

                //mock getRepository function (i.e. the repository). This way, we do not need the database connection
                permissionBusiness.__set__("repositoryFactory", {
                    getPermissionRepository: function(req) {
                        return {
                            updatePermission: function(permissionName, updatedPermission, success, error) {
                                error(expectedResult);
                            }
                        }
                    }
                });
            }

            //set up mocks
            mocks();

            permissionBusiness.updatePermission(request, response);
        });
    });

    describe('deletePermission method', function () {

        it('should return 200 OK', function (done) {

            //attention: it's rewire not require :)
            var permissionBusiness = rewire("../../app/business/PermissionBusiness");

            var expectedResult = "OK";
            var expectedStatus = 200;

            var permissionName = 'admin';
            var request = {

                params: {
                    permissionName: permissionName
                }
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

            // Verify the request if formed properly.
            request.params.permissionName.should.equal(permissionName);

            /**
             * Mock all needed methods and properties to the element we try to test
             */
            var mocks = function() {

                //mock getRepository function (i.e. the repository). This way, we do not need the database connection
                permissionBusiness.__set__("repositoryFactory", {
                    getPermissionRepository: function(req) {
                        return {
                            deletePermission: function(permissionName, success, error) {
                                success(expectedResult);
                            }
                        }
                    }
                });
            }

            //set up mocks
            mocks();

           permissionBusiness.deletePermission(request, response);
        });

        it('should return 500 Error', function (done) {

            //attention: it's rewire not require :)
            var permissionBusiness = rewire("../../app/business/PermissionBusiness");

            var expectedResult = {
                'error': 'error message'
            }

            var expectedStatus = 500;

            var permissionName = 'admin';
            var request = {

                params: {
                    permissionName: permissionName
                }
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

            // Verify the request if formed properly.
            request.params.permissionName.should.equal(permissionName);

            /**
             * Mock all needed methods and properties to the element we try to test
             */
            var mocks = function() {

                //mock getRepository function (i.e. the repository). This way, we do not need the database connection
                permissionBusiness.__set__("repositoryFactory", {
                    getPermissionRepository: function(req) {
                        return {
                            deletePermission: function(permissionName, success, error) {
                                error(expectedResult);
                            }
                        }
                    }
                });
            }

            //set up mocks
            mocks();

           permissionBusiness.deletePermission(request, response);
        });
    });
});
