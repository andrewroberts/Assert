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
  }
};