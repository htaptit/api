'use strict';

module.exports = function(Sources) {
	Sources.sources = function(cb) {

    Sources.find({include: 'stypes'}, function(err, instance) {
        console.log(instance);
        // cb(instance);
      })
	};


  Sources.remoteMethod (
        'sources',
        {
          http: {path: '/v1/sources', verb: 'get'},
          accepts: [
          	
          ],
          returns: {arg: 'sources', type: 'object'}
        }
    );
};
