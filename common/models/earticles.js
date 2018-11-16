'use strict';

module.exports = function(Earticles) {
	Earticles.afterRemote("**", function(ctx, expenses, next){
		if(ctx.method.name == 'find') {
			ctx.result = {"articles": ctx.result};
			next();
		}
	  });
};