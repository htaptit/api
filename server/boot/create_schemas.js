'use strict';

module.exports = function(app) {
  /*
   * The `app` object provides access to a variety of LoopBack resources such as
   * models (e.g. `app.models.YourModelName`) or data sources (e.g.
   * `app.datasources.YourDataSource`). See
   * https://loopback.io/doc/en/lb3/Working-with-LoopBack-objects.html
   * for more info.
   */
   app.datasources.ww_db.isActual('earticles', function(err, actual) {
   	if (actual) {
      app.datasources.ww_db.autoupdate('earticles', function(err){
        if (err) throw err;
        console.log('earticles => Updated !');
      })
   		return;
   	}

   	app.datasources.ww_db.automigrate('earticles', function(err){
	   	if (err) throw err;
	   	console.log('earticles => Created !');
   	})
   });

  app.datasources.ww_db.isActual('types', function(err, actual) {
      if (actual) {
        app.datasources.ww_db.autoupdate('types', function(err){
          if (err) throw err;
          console.log('types => Updated !');
        })
        return;
      }

      app.datasources.ww_db.automigrate('types', function(err){
        if (err) throw err;
        console.log('types => Created !');
      })
  });

  app.datasources.ww_db.isActual('sources', function(err, actual) {
    if (actual) {
      app.datasources.ww_db.autoupdate('sources', function(err){
        if (err) throw err;
        console.log('sources => Updated !');
      });
      return;
    }

    app.datasources.ww_db.automigrate('sources', function(err){
        if (err) throw err;
        console.log('sources => Created !');
    });
  });

  app.datasources.ww_db.isActual('newsapi_access_token', function(err, actual) {
    if (actual) {
      app.datasources.ww_db.autoupdate('newsapi_access_token', function(err){
        if (err) throw err;
        console.log('newsapi_access_token => Updated !');
      });
      return;
    }

    app.datasources.ww_db.automigrate('newsapi_access_token', function(err){
        if (err) throw err;
        console.log('newsapi_access_token => Created !');
    });
  });

  app.datasources.ww_db.isActual('accounts', function(err, actual) {
    if (actual) {
      app.datasources.ww_db.autoupdate('accounts', function(err){
        if (err) throw err;
        console.log('accounts => Updated !');
      });
      return;
    }

    app.datasources.ww_db.automigrate('accounts', function(err){
        if (err) throw err;
        console.log('accounts => Created !');
    });
  });

  // app.datasources.ww_db.isActual('roles', function(err, actual) {
  //   if (actual) {
  //     app.datasources.ww_db.autoupdate('roles', function(err){
  //       if (err) throw err;
  //       console.log('roles => Updated !');
  //     });
  //     return;
  //   }

  //   app.datasources.ww_db.automigrate('roles', function(err){
  //       if (err) throw err;
  //       console.log('roles => Created !');
  //   });
  // });

  // app.datasources.ww_db.isActual('roles_mappping', function(err, actual) {
  //   if (actual) {
  //     app.datasources.ww_db.autoupdate('roles_mappping', function(err){
  //       if (err) throw err;
  //       console.log('roles_mappping => Updated !');
  //     });
  //     return;
  //   }

  //   app.datasources.ww_db.automigrate('roles_mappping', function(err){
  //       if (err) throw err;
  //       console.log('roles_mappping => Created !');
  //   });
  // });

  // app.datasources.ww_db.isActual('tokens', function(err, actual) {
  //   if (actual) {
  //     app.datasources.ww_db.autoupdate('tokens', function(err){
  //       if (err) throw err;
  //       console.log('tokens => Updated !');
  //     });
  //     return;
  //   }

  //   app.datasources.ww_db.automigrate('tokens', function(err){
  //       if (err) throw err;
  //       console.log('tokens => Created !');
  //   });
  // });

  // app.datasources.ww_db.isActual('access_controller_list', function(err, actual) {
  //   if (actual) {
  //     app.datasources.ww_db.autoupdate('access_controller_list', function(err){
  //       if (err) throw err;
  //       console.log('access_controller_list => Updated !');
  //     });
  //     return;
  //   }

  //   app.datasources.ww_db.automigrate('access_controller_list', function(err){
  //       if (err) throw err;
  //       console.log('access_controller_list => Created !');
  //   });
  // });
};
