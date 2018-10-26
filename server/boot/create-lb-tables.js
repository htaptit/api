var server = require('../server');

// get a handle to our defined datasource
var ds = server.dataSources.ww_db;

// since we pass `null` as parameter ALL models will be created / updated
// including those provided by LoopBack e.g. 'User', 'AccessToken', 'ACL', 'RoleMapping' ...
ds.isActual(['AccessToken', 'ACL', 'RoleMapping', 'Role'], function (err, actual) {

    // if an error occured throw it
    if (err) {
        throw err;
    }

    // if changes are needed, if they are
    if (!actual) {

        // update the database
        // ds.automigrate(null, function (err, result) {
        ds.autoupdate(['AccessToken', 'ACL', 'RoleMapping', 'Role'], function (err, result) {

            // if an error occured throw it
            if (err) {
                throw err;
            }

        });
        
    }

});