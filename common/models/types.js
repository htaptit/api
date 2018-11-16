'use strict';

module.exports = function(Types) {
	Types.afterRemote("**", function(ctx, expenses, next){
      if(ctx.method.name == 'find') {
        ctx.result = {"types": ctx.result};
        next();
      }
	  });
};
