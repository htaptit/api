'use strict';

module.exports = function(Earticles) {
	Earticles.everything = function(sources, page, cb) {
		let limit = 20;

		var s = sources.replace(/ /g,'').split(',');

		var wo = null

		if(s.length > 1) {
			var tmp = [];

			for (var i = 0; i < s.length; i++) {
				tmp.push({sid: s[i]})
			}

			wo = {or: tmp}
		} else {
			wo = {sid: s}
		}

	    Earticles.find({
	    	where: wo, 
	    	limit: limit, 
	    	order: 'publishedAt DESC', 
	    	skip: page * limit}, 
	    	function (err, instance) {
	        	cb(null, instance);
	    });
	 };


	 Earticles.remoteMethod (
        'everything',
        {
          http: {path: '/v1/everything', verb: 'get'},
          accepts: [
          	{arg: 'sources', type: 'string', required: true, http: { source: 'query' } },
          	{arg: 'page', type: 'string', http: { source: 'query' } }
          ],
          returns: {arg: 'articles', type: 'object'}
        }
    );
};
