module.exports = (function() {
	'use strict';

	var outils = {
		clone: function(obj){
			if (obj === null || typeof obj !== 'object') {
	        	return obj;
		    }
		    var temp = obj.constructor();
		    for (var key in obj) {
		        temp[key] = outils.clone(obj[key]);
		    }
		    return temp;
		},
		iterate: function(obj, callback, deep, cdeep, fobj){
			deep = deep ? deep : null;
			cdeep = cdeep ? cdeep : 0;
			fobj = fobj ? fobj : obj;

			if(cdeep < deep || deep === null){
				for (let prop in obj) {
					if ({}.hasOwnProperty.call(obj, prop)) {
						obj[prop] = callback.call(obj[prop], prop, obj[prop], cdeep );
						if(typeof obj[prop] === 'object'){
							obj[prop] = outils.iterate(obj[prop], callback, deep, cdeep+1, fobj);
						}
					}
				}
			}
			return obj;
		},
		selfref : function(obj){
			return outils.iterate(obj, function(key){
				if(typeof this === 'string'){
					return this.replace(/\{([^\%]+)\}/, function(s, m){
						var r = outils.get.call(obj, m.split('>')) || m;
						return r;
					});
				}
				return this;
			});
		},
		get: function(a){
			if(a && a.length >= 1){
				var shifted = a.shift();
				if(a.length>0){
					return outils.get.call(this[shifted], a);
				}else{
					return this[shifted];
				}
			}
			return null;
		}

	};

	return outils;
}());