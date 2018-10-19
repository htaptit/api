'use strict';

module.exports = function(Types) {
	Types.sources = function(cb) {

	    Types.find({filter: {include: ['sources']}}, function(err, instance) {
        console.log(instance);
        // cb(instance);
      })
	};


  Types.remoteMethod (
        'sources',
        {
          http: {path: '/v1/sources', verb: 'get'},
          accepts: [
          	
          ],
          returns: {arg: 'sources', type: 'object'}
        }
    );
};
