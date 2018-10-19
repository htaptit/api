'use strict';

module.exports = function(app) {
  /*
   * The `app` object provides access to a variety of LoopBack resources such as
   * models (e.g. `app.models.YourModelName`) or data sources (e.g.
   * `app.datasources.YourDataSource`). See
   * https://loopback.io/doc/en/lb3/Working-with-LoopBack-objects.html
   * for more info.
   */
   app.datasources.wordwide.isActual('earticles', function(err, actual) {
   	if (actual) {
   		return;
   	}

   	app.datasources.wordwide.automigrate('earticles', function(err){
	   	if (err) throw err;
	   	console.log('earticles => Created !');
   	})
   });

  app.datasources.wordwide.isActual('types', function(err, actual) {
      if (actual) {
        return;
      }

      app.datasources.wordwide.automigrate('types', function(err){
        if (err) throw err;
        console.log('types => Created !');
      })
  });

  app.datasources.wordwide.isActual('sources', function(err, actual) {
    if (actual) {
        return;
    }

    app.datasources.wordwide.automigrate('sources', function(err){
        if (err) throw err;
        console.log('sources => Created !');
    })
  });
};
