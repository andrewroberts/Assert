// This is taken from https://github.com/Jxck/assert/blob/master/assert.js

var Util_ = {
  inherits: function(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  },
  isArray: function(ar) {
    return Array.isArray(ar);
  },
  isBoolean: function(arg) {
    return typeof arg === 'boolean';
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  },
  isNumber: function(arg) {
    return typeof arg === 'number';
  },
  isString: function(arg) {
    return typeof arg === 'string';
  },
  isSymbol: function(arg) {
    return typeof arg === 'symbol';
  },
  isUndefined: function(arg) {
    return arg === void 0;
  },
  isRegExp: function(re) {
    return Util_.isObject(re) && Util_.objectToString(re) === '[object RegExp]';
  },
  isObject: function(arg) {
    return typeof arg === 'object' && arg !== null;
  },
  isDate: function(d) {
    return Util_.isObject(d) && Util_.objectToString(d) === '[object Date]';
  },
  isError: function(e) {
    return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
  },
  isFunction: function(arg) {
    return typeof arg === 'function';
  },
  isPrimitive: function(arg) {
    return arg === null ||
      typeof arg === 'boolean' ||
      typeof arg === 'number' ||
      typeof arg === 'string' ||
      typeof arg === 'symbol' ||  // ES6 symbol
      typeof arg === 'undefined';
  },
  objectToString: function(o) {
    return Object.prototype.toString.call(o);
  },
  objectsAreEqual: function (obj) {
	//Loop through properties in object 1
    var obj1 = obj.obj1
    var obj2 = obj.obj2
	for (var p in obj1) {
		//Check property exists on both objects
		if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;
 
		switch (typeof (obj1[p])) {
			//Deep compare objects
			case 'object':
				if (!Util_.objectsAreEqual(obj1[p], obj2[p])) return false;
				break;
			//Compare function code
			case 'function':
				if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
				break;
			//Compare values
			default:
				if (obj1[p] != obj2[p]) return false;
		}
	}
 
	//Check object 2 for any extra properties
	for (var p in obj2) {
		if (typeof (obj1[p]) == 'undefined') return false;
	}
	return true;
  }

};
