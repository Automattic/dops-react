(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('es5-shim');
require('es5-shim/es5-sham');
},{"es5-shim":3,"es5-shim/es5-sham":2}],2:[function(require,module,exports){
/*!
 * https://github.com/es-shims/es5-shim
 * @license es5-shim Copyright 2009-2015 by contributors, MIT License
 * see https://github.com/es-shims/es5-shim/blob/master/LICENSE
 */

// vim: ts=4 sts=4 sw=4 expandtab

// Add semicolon to prevent IIFE from being passed as argument to concatenated code.
;

// UMD (Universal Module Definition)
// see https://github.com/umdjs/umd/blob/master/returnExports.js
(function (root, factory) {
    'use strict';

    /* global define, exports, module */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
  }
}(this, function () {

var call = Function.prototype.call;
var prototypeOfObject = Object.prototype;
var owns = call.bind(prototypeOfObject.hasOwnProperty);

// If JS engine supports accessors creating shortcuts.
var defineGetter;
var defineSetter;
var lookupGetter;
var lookupSetter;
var supportsAccessors = owns(prototypeOfObject, '__defineGetter__');
if (supportsAccessors) {
    /* eslint-disable no-underscore-dangle */
    defineGetter = call.bind(prototypeOfObject.__defineGetter__);
    defineSetter = call.bind(prototypeOfObject.__defineSetter__);
    lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
    lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
    /* eslint-enable no-underscore-dangle */
}

// ES5 15.2.3.2
// http://es5.github.com/#x15.2.3.2
if (!Object.getPrototypeOf) {
    // https://github.com/es-shims/es5-shim/issues#issue/2
    // http://ejohn.org/blog/objectgetprototypeof/
    // recommended by fschaefer on github
    //
    // sure, and webreflection says ^_^
    // ... this will nerever possibly return null
    // ... Opera Mini breaks here with infinite loops
    Object.getPrototypeOf = function getPrototypeOf(object) {
        /* eslint-disable no-proto */
        var proto = object.__proto__;
        /* eslint-enable no-proto */
        if (proto || proto === null) {
            return proto;
        } else if (object.constructor) {
            return object.constructor.prototype;
        } else {
            return prototypeOfObject;
        }
    };
}

// ES5 15.2.3.3
// http://es5.github.com/#x15.2.3.3

var doesGetOwnPropertyDescriptorWork = function doesGetOwnPropertyDescriptorWork(object) {
    try {
        object.sentinel = 0;
        return Object.getOwnPropertyDescriptor(object, 'sentinel').value === 0;
    } catch (exception) {
        return false;
    }
};

// check whether getOwnPropertyDescriptor works if it's given. Otherwise, shim partially.
if (Object.defineProperty) {
    var getOwnPropertyDescriptorWorksOnObject = doesGetOwnPropertyDescriptorWork({});
    var getOwnPropertyDescriptorWorksOnDom = typeof document === 'undefined' ||
    doesGetOwnPropertyDescriptorWork(document.createElement('div'));
    if (!getOwnPropertyDescriptorWorksOnDom || !getOwnPropertyDescriptorWorksOnObject) {
        var getOwnPropertyDescriptorFallback = Object.getOwnPropertyDescriptor;
    }
}

if (!Object.getOwnPropertyDescriptor || getOwnPropertyDescriptorFallback) {
    var ERR_NON_OBJECT = 'Object.getOwnPropertyDescriptor called on a non-object: ';

    /* eslint-disable no-proto */
    Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
        if ((typeof object !== 'object' && typeof object !== 'function') || object === null) {
            throw new TypeError(ERR_NON_OBJECT + object);
        }

        // make a valiant attempt to use the real getOwnPropertyDescriptor
        // for I8's DOM elements.
        if (getOwnPropertyDescriptorFallback) {
            try {
                return getOwnPropertyDescriptorFallback.call(Object, object, property);
            } catch (exception) {
                // try the shim if the real one doesn't work
            }
        }

        var descriptor;

        // If object does not owns property return undefined immediately.
        if (!owns(object, property)) {
            return descriptor;
        }

        // If object has a property then it's for sure both `enumerable` and
        // `configurable`.
        descriptor = { enumerable: true, configurable: true };

        // If JS engine supports accessor properties then property may be a
        // getter or setter.
        if (supportsAccessors) {
            // Unfortunately `__lookupGetter__` will return a getter even
            // if object has own non getter property along with a same named
            // inherited getter. To avoid misbehavior we temporary remove
            // `__proto__` so that `__lookupGetter__` will return getter only
            // if it's owned by an object.
            var prototype = object.__proto__;
            var notPrototypeOfObject = object !== prototypeOfObject;
            // avoid recursion problem, breaking in Opera Mini when
            // Object.getOwnPropertyDescriptor(Object.prototype, 'toString')
            // or any other Object.prototype accessor
            if (notPrototypeOfObject) {
                object.__proto__ = prototypeOfObject;
            }

            var getter = lookupGetter(object, property);
            var setter = lookupSetter(object, property);

            if (notPrototypeOfObject) {
                // Once we have getter and setter we can put values back.
                object.__proto__ = prototype;
            }

            if (getter || setter) {
                if (getter) {
                    descriptor.get = getter;
                }
                if (setter) {
                    descriptor.set = setter;
                }
                // If it was accessor property we're done and return here
                // in order to avoid adding `value` to the descriptor.
                return descriptor;
            }
        }

        // If we got this far we know that object has an own property that is
        // not an accessor so we set it as a value and return descriptor.
        descriptor.value = object[property];
        descriptor.writable = true;
        return descriptor;
    };
    /* eslint-enable no-proto */
}

// ES5 15.2.3.4
// http://es5.github.com/#x15.2.3.4
if (!Object.getOwnPropertyNames) {
    Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
        return Object.keys(object);
    };
}

// ES5 15.2.3.5
// http://es5.github.com/#x15.2.3.5
if (!Object.create) {

    // Contributed by Brandon Benvie, October, 2012
    var createEmpty;
    var supportsProto = !({ __proto__: null } instanceof Object);
                        // the following produces false positives
                        // in Opera Mini => not a reliable check
                        // Object.prototype.__proto__ === null

    // Check for document.domain and active x support
    // No need to use active x approach when document.domain is not set
    // see https://github.com/es-shims/es5-shim/issues/150
    // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
    /* global ActiveXObject */
    var shouldUseActiveX = function shouldUseActiveX() {
        // return early if document.domain not set
        if (!document.domain) {
            return false;
        }

        try {
            return !!new ActiveXObject('htmlfile');
        } catch (exception) {
            return false;
        }
    };

    // This supports IE8 when document.domain is used
    // see https://github.com/es-shims/es5-shim/issues/150
    // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
    var getEmptyViaActiveX = function getEmptyViaActiveX() {
        var empty;
        var xDoc;

        xDoc = new ActiveXObject('htmlfile');

        xDoc.write('<script><\/script>');
        xDoc.close();

        empty = xDoc.parentWindow.Object.prototype;
        xDoc = null;

        return empty;
    };

    // The original implementation using an iframe
    // before the activex approach was added
    // see https://github.com/es-shims/es5-shim/issues/150
    var getEmptyViaIFrame = function getEmptyViaIFrame() {
        var iframe = document.createElement('iframe');
        var parent = document.body || document.documentElement;
        var empty;

        iframe.style.display = 'none';
        parent.appendChild(iframe);
        /* eslint-disable no-script-url */
        iframe.src = 'javascript:';
        /* eslint-enable no-script-url */

        empty = iframe.contentWindow.Object.prototype;
        parent.removeChild(iframe);
        iframe = null;

        return empty;
    };

    /* global document */
    if (supportsProto || typeof document === 'undefined') {
        createEmpty = function () {
            return { __proto__: null };
        };
    } else {
        // In old IE __proto__ can't be used to manually set `null`, nor does
        // any other method exist to make an object that inherits from nothing,
        // aside from Object.prototype itself. Instead, create a new global
        // object and *steal* its Object.prototype and strip it bare. This is
        // used as the prototype to create nullary objects.
        createEmpty = function () {
            // Determine which approach to use
            // see https://github.com/es-shims/es5-shim/issues/150
            var empty = shouldUseActiveX() ? getEmptyViaActiveX() : getEmptyViaIFrame();

            delete empty.constructor;
            delete empty.hasOwnProperty;
            delete empty.propertyIsEnumerable;
            delete empty.isPrototypeOf;
            delete empty.toLocaleString;
            delete empty.toString;
            delete empty.valueOf;
            /* eslint-disable no-proto */
            empty.__proto__ = null;
            /* eslint-enable no-proto */

            var Empty = function Empty() {};
            Empty.prototype = empty;
            // short-circuit future calls
            createEmpty = function () {
                return new Empty();
            };
            return new Empty();
        };
    }

    Object.create = function create(prototype, properties) {

        var object;
        var Type = function Type() {}; // An empty constructor.

        if (prototype === null) {
            object = createEmpty();
        } else {
            if (typeof prototype !== 'object' && typeof prototype !== 'function') {
                // In the native implementation `parent` can be `null`
                // OR *any* `instanceof Object`  (Object|Function|Array|RegExp|etc)
                // Use `typeof` tho, b/c in old IE, DOM elements are not `instanceof Object`
                // like they are in modern browsers. Using `Object.create` on DOM elements
                // is...err...probably inappropriate, but the native version allows for it.
                throw new TypeError('Object prototype may only be an Object or null'); // same msg as Chrome
            }
            Type.prototype = prototype;
            object = new Type();
            // IE has no built-in implementation of `Object.getPrototypeOf`
            // neither `__proto__`, but this manually setting `__proto__` will
            // guarantee that `Object.getPrototypeOf` will work as expected with
            // objects created using `Object.create`
            /* eslint-disable no-proto */
            object.__proto__ = prototype;
            /* eslint-enable no-proto */
        }

        if (properties !== void 0) {
            Object.defineProperties(object, properties);
        }

        return object;
    };
}

// ES5 15.2.3.6
// http://es5.github.com/#x15.2.3.6

// Patch for WebKit and IE8 standard mode
// Designed by hax <hax.github.com>
// related issue: https://github.com/es-shims/es5-shim/issues#issue/5
// IE8 Reference:
//     http://msdn.microsoft.com/en-us/library/dd282900.aspx
//     http://msdn.microsoft.com/en-us/library/dd229916.aspx
// WebKit Bugs:
//     https://bugs.webkit.org/show_bug.cgi?id=36423

var doesDefinePropertyWork = function doesDefinePropertyWork(object) {
    try {
        Object.defineProperty(object, 'sentinel', {});
        return 'sentinel' in object;
    } catch (exception) {
        return false;
    }
};

// check whether defineProperty works if it's given. Otherwise,
// shim partially.
if (Object.defineProperty) {
    var definePropertyWorksOnObject = doesDefinePropertyWork({});
    var definePropertyWorksOnDom = typeof document === 'undefined' ||
        doesDefinePropertyWork(document.createElement('div'));
    if (!definePropertyWorksOnObject || !definePropertyWorksOnDom) {
        var definePropertyFallback = Object.defineProperty,
            definePropertiesFallback = Object.defineProperties;
    }
}

if (!Object.defineProperty || definePropertyFallback) {
    var ERR_NON_OBJECT_DESCRIPTOR = 'Property description must be an object: ';
    var ERR_NON_OBJECT_TARGET = 'Object.defineProperty called on non-object: ';
    var ERR_ACCESSORS_NOT_SUPPORTED = 'getters & setters can not be defined on this javascript engine';

    Object.defineProperty = function defineProperty(object, property, descriptor) {
        if ((typeof object !== 'object' && typeof object !== 'function') || object === null) {
            throw new TypeError(ERR_NON_OBJECT_TARGET + object);
        }
        if ((typeof descriptor !== 'object' && typeof descriptor !== 'function') || descriptor === null) {
            throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + descriptor);
        }
        // make a valiant attempt to use the real defineProperty
        // for I8's DOM elements.
        if (definePropertyFallback) {
            try {
                return definePropertyFallback.call(Object, object, property, descriptor);
            } catch (exception) {
                // try the shim if the real one doesn't work
            }
        }

        // If it's a data property.
        if ('value' in descriptor) {
            // fail silently if 'writable', 'enumerable', or 'configurable'
            // are requested but not supported
            /*
            // alternate approach:
            if ( // can't implement these features; allow false but not true
                ('writable' in descriptor && !descriptor.writable) ||
                ('enumerable' in descriptor && !descriptor.enumerable) ||
                ('configurable' in descriptor && !descriptor.configurable)
            ))
                throw new RangeError(
                    'This implementation of Object.defineProperty does not support configurable, enumerable, or writable.'
                );
            */

            if (supportsAccessors && (lookupGetter(object, property) || lookupSetter(object, property))) {
                // As accessors are supported only on engines implementing
                // `__proto__` we can safely override `__proto__` while defining
                // a property to make sure that we don't hit an inherited
                // accessor.
                /* eslint-disable no-proto */
                var prototype = object.__proto__;
                object.__proto__ = prototypeOfObject;
                // Deleting a property anyway since getter / setter may be
                // defined on object itself.
                delete object[property];
                object[property] = descriptor.value;
                // Setting original `__proto__` back now.
                object.__proto__ = prototype;
                /* eslint-enable no-proto */
            } else {
                object[property] = descriptor.value;
            }
        } else {
            if (!supportsAccessors) {
                throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
            }
            // If we got that far then getters and setters can be defined !!
            if ('get' in descriptor) {
                defineGetter(object, property, descriptor.get);
            }
            if ('set' in descriptor) {
                defineSetter(object, property, descriptor.set);
            }
        }
        return object;
    };
}

// ES5 15.2.3.7
// http://es5.github.com/#x15.2.3.7
if (!Object.defineProperties || definePropertiesFallback) {
    Object.defineProperties = function defineProperties(object, properties) {
        // make a valiant attempt to use the real defineProperties
        if (definePropertiesFallback) {
            try {
                return definePropertiesFallback.call(Object, object, properties);
            } catch (exception) {
                // try the shim if the real one doesn't work
            }
        }

        Object.keys(properties).forEach(function (property) {
            if (property !== '__proto__') {
                Object.defineProperty(object, property, properties[property]);
            }
        });
        return object;
    };
}

// ES5 15.2.3.8
// http://es5.github.com/#x15.2.3.8
if (!Object.seal) {
    Object.seal = function seal(object) {
        if (Object(object) !== object) {
            throw new TypeError('Object.seal can only be called on Objects.');
        }
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// ES5 15.2.3.9
// http://es5.github.com/#x15.2.3.9
if (!Object.freeze) {
    Object.freeze = function freeze(object) {
        if (Object(object) !== object) {
            throw new TypeError('Object.freeze can only be called on Objects.');
        }
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// detect a Rhino bug and patch it
try {
    Object.freeze(function () {});
} catch (exception) {
    Object.freeze = (function (freezeObject) {
        return function freeze(object) {
            if (typeof object === 'function') {
                return object;
            } else {
                return freezeObject(object);
            }
        };
    }(Object.freeze));
}

// ES5 15.2.3.10
// http://es5.github.com/#x15.2.3.10
if (!Object.preventExtensions) {
    Object.preventExtensions = function preventExtensions(object) {
        if (Object(object) !== object) {
            throw new TypeError('Object.preventExtensions can only be called on Objects.');
        }
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// ES5 15.2.3.11
// http://es5.github.com/#x15.2.3.11
if (!Object.isSealed) {
    Object.isSealed = function isSealed(object) {
        if (Object(object) !== object) {
            throw new TypeError('Object.isSealed can only be called on Objects.');
        }
        return false;
    };
}

// ES5 15.2.3.12
// http://es5.github.com/#x15.2.3.12
if (!Object.isFrozen) {
    Object.isFrozen = function isFrozen(object) {
        if (Object(object) !== object) {
            throw new TypeError('Object.isFrozen can only be called on Objects.');
        }
        return false;
    };
}

// ES5 15.2.3.13
// http://es5.github.com/#x15.2.3.13
if (!Object.isExtensible) {
    Object.isExtensible = function isExtensible(object) {
        // 1. If Type(O) is not Object throw a TypeError exception.
        if (Object(object) !== object) {
            throw new TypeError('Object.isExtensible can only be called on Objects.');
        }
        // 2. Return the Boolean value of the [[Extensible]] internal property of O.
        var name = '';
        while (owns(object, name)) {
            name += '?';
        }
        object[name] = true;
        var returnValue = owns(object, name);
        delete object[name];
        return returnValue;
    };
}

}));

},{}],3:[function(require,module,exports){
/*!
 * https://github.com/es-shims/es5-shim
 * @license es5-shim Copyright 2009-2015 by contributors, MIT License
 * see https://github.com/es-shims/es5-shim/blob/master/LICENSE
 */

// vim: ts=4 sts=4 sw=4 expandtab

// Add semicolon to prevent IIFE from being passed as argument to concatenated code.
;

// UMD (Universal Module Definition)
// see https://github.com/umdjs/umd/blob/master/returnExports.js
(function (root, factory) {
    'use strict';

    /* global define, exports, module */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {

/**
 * Brings an environment as close to ECMAScript 5 compliance
 * as is possible with the facilities of erstwhile engines.
 *
 * Annotated ES5: http://es5.github.com/ (specific links below)
 * ES5 Spec: http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
 * Required reading: http://javascriptweblog.wordpress.com/2011/12/05/extending-javascript-natives/
 */

// Shortcut to an often accessed properties, in order to avoid multiple
// dereference that costs universally.
var ArrayPrototype = Array.prototype;
var ObjectPrototype = Object.prototype;
var FunctionPrototype = Function.prototype;
var StringPrototype = String.prototype;
var NumberPrototype = Number.prototype;
var array_slice = ArrayPrototype.slice;
var array_splice = ArrayPrototype.splice;
var array_push = ArrayPrototype.push;
var array_unshift = ArrayPrototype.unshift;
var array_concat = ArrayPrototype.concat;
var call = FunctionPrototype.call;

// Having a toString local variable name breaks in Opera so use to_string.
var to_string = ObjectPrototype.toString;

var isArray = Array.isArray || function isArray(obj) {
    return to_string.call(obj) === '[object Array]';
};

var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
var isCallable; /* inlined from https://npmjs.com/is-callable */ var fnToStr = Function.prototype.toString, tryFunctionObject = function tryFunctionObject(value) { try { fnToStr.call(value); return true; } catch (e) { return false; } }, fnClass = '[object Function]', genClass = '[object GeneratorFunction]'; isCallable = function isCallable(value) { if (typeof value !== 'function') { return false; } if (hasToStringTag) { return tryFunctionObject(value); } var strClass = to_string.call(value); return strClass === fnClass || strClass === genClass; };
var isRegex; /* inlined from https://npmjs.com/is-regex */ var regexExec = RegExp.prototype.exec, tryRegexExec = function tryRegexExec(value) { try { regexExec.call(value); return true; } catch (e) { return false; } }, regexClass = '[object RegExp]'; isRegex = function isRegex(value) { if (typeof value !== 'object') { return false; } return hasToStringTag ? tryRegexExec(value) : to_string.call(value) === regexClass; };
var isString; /* inlined from https://npmjs.com/is-string */ var strValue = String.prototype.valueOf, tryStringObject = function tryStringObject(value) { try { strValue.call(value); return true; } catch (e) { return false; } }, stringClass = '[object String]'; isString = function isString(value) { if (typeof value === 'string') { return true; } if (typeof value !== 'object') { return false; } return hasToStringTag ? tryStringObject(value) : to_string.call(value) === stringClass; };

var isArguments = function isArguments(value) {
    var str = to_string.call(value);
    var isArgs = str === '[object Arguments]';
    if (!isArgs) {
        isArgs = !isArray(value) &&
          value !== null &&
          typeof value === 'object' &&
          typeof value.length === 'number' &&
          value.length >= 0 &&
          isCallable(value.callee);
    }
    return isArgs;
};

/* inlined from http://npmjs.com/define-properties */
var defineProperties = (function (has) {
  var supportsDescriptors = Object.defineProperty && (function () {
      try {
          var obj = {};
          Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
          for (var _ in obj) { return false; }
          return obj.x === obj;
      } catch (e) { /* this is ES3 */
          return false;
      }
  }());

  // Define configurable, writable and non-enumerable props
  // if they don't exist.
  var defineProperty;
  if (supportsDescriptors) {
      defineProperty = function (object, name, method, forceAssign) {
          if (!forceAssign && (name in object)) { return; }
          Object.defineProperty(object, name, {
              configurable: true,
              enumerable: false,
              writable: true,
              value: method
          });
      };
  } else {
      defineProperty = function (object, name, method, forceAssign) {
          if (!forceAssign && (name in object)) { return; }
          object[name] = method;
      };
  }
  return function defineProperties(object, map, forceAssign) {
      for (var name in map) {
          if (has.call(map, name)) {
            defineProperty(object, name, map[name], forceAssign);
          }
      }
  };
}(ObjectPrototype.hasOwnProperty));

//
// Util
// ======
//

/* replaceable with https://npmjs.com/package/es-abstract /helpers/isPrimitive */
var isPrimitive = function isPrimitive(input) {
    var type = typeof input;
    return input === null || (type !== 'object' && type !== 'function');
};

var ES = {
    // ES5 9.4
    // http://es5.github.com/#x9.4
    // http://jsperf.com/to-integer
    /* replaceable with https://npmjs.com/package/es-abstract ES5.ToInteger */
    ToInteger: function ToInteger(num) {
        var n = +num;
        if (n !== n) { // isNaN
            n = 0;
        } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
            n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
        return n;
    },

    /* replaceable with https://npmjs.com/package/es-abstract ES5.ToPrimitive */
    ToPrimitive: function ToPrimitive(input) {
        var val, valueOf, toStr;
        if (isPrimitive(input)) {
            return input;
        }
        valueOf = input.valueOf;
        if (isCallable(valueOf)) {
            val = valueOf.call(input);
            if (isPrimitive(val)) {
                return val;
            }
        }
        toStr = input.toString;
        if (isCallable(toStr)) {
            val = toStr.call(input);
            if (isPrimitive(val)) {
                return val;
            }
        }
        throw new TypeError();
    },

    // ES5 9.9
    // http://es5.github.com/#x9.9
    /* replaceable with https://npmjs.com/package/es-abstract ES5.ToObject */
    ToObject: function (o) {
        /* jshint eqnull: true */
        if (o == null) { // this matches both null and undefined
            throw new TypeError("can't convert " + o + ' to object');
        }
        return Object(o);
    },

    /* replaceable with https://npmjs.com/package/es-abstract ES5.ToUint32 */
    ToUint32: function ToUint32(x) {
        return x >>> 0;
    }
};

//
// Function
// ========
//

// ES-5 15.3.4.5
// http://es5.github.com/#x15.3.4.5

var Empty = function Empty() {};

defineProperties(FunctionPrototype, {
    bind: function bind(that) { // .length is 1
        // 1. Let Target be the this value.
        var target = this;
        // 2. If IsCallable(Target) is false, throw a TypeError exception.
        if (!isCallable(target)) {
            throw new TypeError('Function.prototype.bind called on incompatible ' + target);
        }
        // 3. Let A be a new (possibly empty) internal list of all of the
        //   argument values provided after thisArg (arg1, arg2 etc), in order.
        // XXX slicedArgs will stand in for "A" if used
        var args = array_slice.call(arguments, 1); // for normal call
        // 4. Let F be a new native ECMAScript object.
        // 11. Set the [[Prototype]] internal property of F to the standard
        //   built-in Function prototype object as specified in 15.3.3.1.
        // 12. Set the [[Call]] internal property of F as described in
        //   15.3.4.5.1.
        // 13. Set the [[Construct]] internal property of F as described in
        //   15.3.4.5.2.
        // 14. Set the [[HasInstance]] internal property of F as described in
        //   15.3.4.5.3.
        var bound;
        var binder = function () {

            if (this instanceof bound) {
                // 15.3.4.5.2 [[Construct]]
                // When the [[Construct]] internal method of a function object,
                // F that was created using the bind function is called with a
                // list of arguments ExtraArgs, the following steps are taken:
                // 1. Let target be the value of F's [[TargetFunction]]
                //   internal property.
                // 2. If target has no [[Construct]] internal method, a
                //   TypeError exception is thrown.
                // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Construct]] internal
                //   method of target providing args as the arguments.

                var result = target.apply(
                    this,
                    array_concat.call(args, array_slice.call(arguments))
                );
                if (Object(result) === result) {
                    return result;
                }
                return this;

            } else {
                // 15.3.4.5.1 [[Call]]
                // When the [[Call]] internal method of a function object, F,
                // which was created using the bind function is called with a
                // this value and a list of arguments ExtraArgs, the following
                // steps are taken:
                // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 2. Let boundThis be the value of F's [[BoundThis]] internal
                //   property.
                // 3. Let target be the value of F's [[TargetFunction]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Call]] internal method
                //   of target providing boundThis as the this value and
                //   providing args as the arguments.

                // equiv: target.call(this, ...boundArgs, ...args)
                return target.apply(
                    that,
                    array_concat.call(args, array_slice.call(arguments))
                );

            }

        };

        // 15. If the [[Class]] internal property of Target is "Function", then
        //     a. Let L be the length property of Target minus the length of A.
        //     b. Set the length own property of F to either 0 or L, whichever is
        //       larger.
        // 16. Else set the length own property of F to 0.

        var boundLength = Math.max(0, target.length - args.length);

        // 17. Set the attributes of the length own property of F to the values
        //   specified in 15.3.5.1.
        var boundArgs = [];
        for (var i = 0; i < boundLength; i++) {
            boundArgs.push('$' + i);
        }

        // XXX Build a dynamic function with desired amount of arguments is the only
        // way to set the length property of a function.
        // In environments where Content Security Policies enabled (Chrome extensions,
        // for ex.) all use of eval or Function costructor throws an exception.
        // However in all of these environments Function.prototype.bind exists
        // and so this code will never be executed.
        bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);

        if (target.prototype) {
            Empty.prototype = target.prototype;
            bound.prototype = new Empty();
            // Clean up dangling references.
            Empty.prototype = null;
        }

        // TODO
        // 18. Set the [[Extensible]] internal property of F to true.

        // TODO
        // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
        // 20. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
        //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
        //   false.
        // 21. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
        //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
        //   and false.

        // TODO
        // NOTE Function objects created using Function.prototype.bind do not
        // have a prototype property or the [[Code]], [[FormalParameters]], and
        // [[Scope]] internal properties.
        // XXX can't delete prototype in pure-js.

        // 22. Return F.
        return bound;
    }
});

// _Please note: Shortcuts are defined after `Function.prototype.bind` as we
// us it in defining shortcuts.
var owns = call.bind(ObjectPrototype.hasOwnProperty);

//
// Array
// =====
//

// ES5 15.4.4.12
// http://es5.github.com/#x15.4.4.12
var spliceNoopReturnsEmptyArray = (function () {
    var a = [1, 2];
    var result = a.splice();
    return a.length === 2 && isArray(result) && result.length === 0;
}());
defineProperties(ArrayPrototype, {
    // Safari 5.0 bug where .splice() returns undefined
    splice: function splice(start, deleteCount) {
        if (arguments.length === 0) {
            return [];
        } else {
            return array_splice.apply(this, arguments);
        }
    }
}, !spliceNoopReturnsEmptyArray);

var spliceWorksWithEmptyObject = (function () {
    var obj = {};
    ArrayPrototype.splice.call(obj, 0, 0, 1);
    return obj.length === 1;
}());
defineProperties(ArrayPrototype, {
    splice: function splice(start, deleteCount) {
        if (arguments.length === 0) { return []; }
        var args = arguments;
        this.length = Math.max(ES.ToInteger(this.length), 0);
        if (arguments.length > 0 && typeof deleteCount !== 'number') {
            args = array_slice.call(arguments);
            if (args.length < 2) {
                args.push(this.length - start);
            } else {
                args[1] = ES.ToInteger(deleteCount);
            }
        }
        return array_splice.apply(this, args);
    }
}, !spliceWorksWithEmptyObject);

// ES5 15.4.4.12
// http://es5.github.com/#x15.4.4.13
// Return len+argCount.
// [bugfix, ielt8]
// IE < 8 bug: [].unshift(0) === undefined but should be "1"
var hasUnshiftReturnValueBug = [].unshift(0) !== 1;
defineProperties(ArrayPrototype, {
    unshift: function () {
        array_unshift.apply(this, arguments);
        return this.length;
    }
}, hasUnshiftReturnValueBug);

// ES5 15.4.3.2
// http://es5.github.com/#x15.4.3.2
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
defineProperties(Array, { isArray: isArray });

// The IsCallable() check in the Array functions
// has been replaced with a strict check on the
// internal class of the object to trap cases where
// the provided function was actually a regular
// expression literal, which in V8 and
// JavaScriptCore is a typeof "function".  Only in
// V8 are regular expression literals permitted as
// reduce parameters, so it is desirable in the
// general case for the shim to match the more
// strict and common behavior of rejecting regular
// expressions.

// ES5 15.4.4.18
// http://es5.github.com/#x15.4.4.18
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/forEach

// Check failure of by-index access of string characters (IE < 9)
// and failure of `0 in boxedString` (Rhino)
var boxedString = Object('a');
var splitString = boxedString[0] !== 'a' || !(0 in boxedString);

var properlyBoxesContext = function properlyBoxed(method) {
    // Check node 0.6.21 bug where third parameter is not boxed
    var properlyBoxesNonStrict = true;
    var properlyBoxesStrict = true;
    if (method) {
        method.call('foo', function (_, __, context) {
            if (typeof context !== 'object') { properlyBoxesNonStrict = false; }
        });

        method.call([1], function () {
            'use strict';

            properlyBoxesStrict = typeof this === 'string';
        }, 'x');
    }
    return !!method && properlyBoxesNonStrict && properlyBoxesStrict;
};

defineProperties(ArrayPrototype, {
    forEach: function forEach(callbackfn /*, thisArg*/) {
        var object = ES.ToObject(this);
        var self = splitString && isString(this) ? this.split('') : object;
        var i = -1;
        var length = self.length >>> 0;
        var T;
        if (arguments.length > 1) {
          T = arguments[1];
        }

        // If no callback function or if callback is not a callable function
        if (!isCallable(callbackfn)) {
            throw new TypeError('Array.prototype.forEach callback must be a function');
        }

        while (++i < length) {
            if (i in self) {
                // Invoke the callback function with call, passing arguments:
                // context, property value, property key, thisArg object
                if (typeof T !== 'undefined') {
                    callbackfn.call(T, self[i], i, object);
                } else {
                    callbackfn(self[i], i, object);
                }
            }
        }
    }
}, !properlyBoxesContext(ArrayPrototype.forEach));

// ES5 15.4.4.19
// http://es5.github.com/#x15.4.4.19
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
defineProperties(ArrayPrototype, {
    map: function map(callbackfn/*, thisArg*/) {
        var object = ES.ToObject(this);
        var self = splitString && isString(this) ? this.split('') : object;
        var length = self.length >>> 0;
        var result = Array(length);
        var T;
        if (arguments.length > 1) {
            T = arguments[1];
        }

        // If no callback function or if callback is not a callable function
        if (!isCallable(callbackfn)) {
            throw new TypeError('Array.prototype.map callback must be a function');
        }

        for (var i = 0; i < length; i++) {
            if (i in self) {
                if (typeof T !== 'undefined') {
                    result[i] = callbackfn.call(T, self[i], i, object);
                } else {
                    result[i] = callbackfn(self[i], i, object);
                }
            }
        }
        return result;
    }
}, !properlyBoxesContext(ArrayPrototype.map));

// ES5 15.4.4.20
// http://es5.github.com/#x15.4.4.20
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
defineProperties(ArrayPrototype, {
    filter: function filter(callbackfn /*, thisArg*/) {
        var object = ES.ToObject(this);
        var self = splitString && isString(this) ? this.split('') : object;
        var length = self.length >>> 0;
        var result = [];
        var value;
        var T;
        if (arguments.length > 1) {
            T = arguments[1];
        }

        // If no callback function or if callback is not a callable function
        if (!isCallable(callbackfn)) {
            throw new TypeError('Array.prototype.filter callback must be a function');
        }

        for (var i = 0; i < length; i++) {
            if (i in self) {
                value = self[i];
                if (typeof T === 'undefined' ? callbackfn(value, i, object) : callbackfn.call(T, value, i, object)) {
                    result.push(value);
                }
            }
        }
        return result;
    }
}, !properlyBoxesContext(ArrayPrototype.filter));

// ES5 15.4.4.16
// http://es5.github.com/#x15.4.4.16
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
defineProperties(ArrayPrototype, {
    every: function every(callbackfn /*, thisArg*/) {
        var object = ES.ToObject(this);
        var self = splitString && isString(this) ? this.split('') : object;
        var length = self.length >>> 0;
        var T;
        if (arguments.length > 1) {
            T = arguments[1];
        }

        // If no callback function or if callback is not a callable function
        if (!isCallable(callbackfn)) {
            throw new TypeError('Array.prototype.every callback must be a function');
        }

        for (var i = 0; i < length; i++) {
            if (i in self && !(typeof T === 'undefined' ? callbackfn(self[i], i, object) : callbackfn.call(T, self[i], i, object))) {
                return false;
            }
        }
        return true;
    }
}, !properlyBoxesContext(ArrayPrototype.every));

// ES5 15.4.4.17
// http://es5.github.com/#x15.4.4.17
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
defineProperties(ArrayPrototype, {
    some: function some(callbackfn/*, thisArg */) {
        var object = ES.ToObject(this);
        var self = splitString && isString(this) ? this.split('') : object;
        var length = self.length >>> 0;
        var T;
        if (arguments.length > 1) {
            T = arguments[1];
        }

        // If no callback function or if callback is not a callable function
        if (!isCallable(callbackfn)) {
            throw new TypeError('Array.prototype.some callback must be a function');
        }

        for (var i = 0; i < length; i++) {
            if (i in self && (typeof T === 'undefined' ? callbackfn(self[i], i, object) : callbackfn.call(T, self[i], i, object))) {
                return true;
            }
        }
        return false;
    }
}, !properlyBoxesContext(ArrayPrototype.some));

// ES5 15.4.4.21
// http://es5.github.com/#x15.4.4.21
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
var reduceCoercesToObject = false;
if (ArrayPrototype.reduce) {
    reduceCoercesToObject = typeof ArrayPrototype.reduce.call('es5', function (_, __, ___, list) { return list; }) === 'object';
}
defineProperties(ArrayPrototype, {
    reduce: function reduce(callbackfn /*, initialValue*/) {
        var object = ES.ToObject(this);
        var self = splitString && isString(this) ? this.split('') : object;
        var length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (!isCallable(callbackfn)) {
            throw new TypeError('Array.prototype.reduce callback must be a function');
        }

        // no value to return if no initial value and an empty array
        if (length === 0 && arguments.length === 1) {
            throw new TypeError('reduce of empty array with no initial value');
        }

        var i = 0;
        var result;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i++];
                    break;
                }

                // if array contains no values, no initial value to return
                if (++i >= length) {
                    throw new TypeError('reduce of empty array with no initial value');
                }
            } while (true);
        }

        for (; i < length; i++) {
            if (i in self) {
                result = callbackfn(result, self[i], i, object);
            }
        }

        return result;
    }
}, !reduceCoercesToObject);

// ES5 15.4.4.22
// http://es5.github.com/#x15.4.4.22
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
var reduceRightCoercesToObject = false;
if (ArrayPrototype.reduceRight) {
    reduceRightCoercesToObject = typeof ArrayPrototype.reduceRight.call('es5', function (_, __, ___, list) { return list; }) === 'object';
}
defineProperties(ArrayPrototype, {
    reduceRight: function reduceRight(callbackfn/*, initial*/) {
        var object = ES.ToObject(this);
        var self = splitString && isString(this) ? this.split('') : object;
        var length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (!isCallable(callbackfn)) {
            throw new TypeError('Array.prototype.reduceRight callback must be a function');
        }

        // no value to return if no initial value, empty array
        if (length === 0 && arguments.length === 1) {
            throw new TypeError('reduceRight of empty array with no initial value');
        }

        var result;
        var i = length - 1;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i--];
                    break;
                }

                // if array contains no values, no initial value to return
                if (--i < 0) {
                    throw new TypeError('reduceRight of empty array with no initial value');
                }
            } while (true);
        }

        if (i < 0) {
            return result;
        }

        do {
            if (i in self) {
                result = callbackfn(result, self[i], i, object);
            }
        } while (i--);

        return result;
    }
}, !reduceRightCoercesToObject);

// ES5 15.4.4.14
// http://es5.github.com/#x15.4.4.14
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
var hasFirefox2IndexOfBug = Array.prototype.indexOf && [0, 1].indexOf(1, 2) !== -1;
defineProperties(ArrayPrototype, {
    indexOf: function indexOf(searchElement /*, fromIndex */) {
        var self = splitString && isString(this) ? this.split('') : ES.ToObject(this);
        var length = self.length >>> 0;

        if (length === 0) {
            return -1;
        }

        var i = 0;
        if (arguments.length > 1) {
            i = ES.ToInteger(arguments[1]);
        }

        // handle negative indices
        i = i >= 0 ? i : Math.max(0, length + i);
        for (; i < length; i++) {
            if (i in self && self[i] === searchElement) {
                return i;
            }
        }
        return -1;
    }
}, hasFirefox2IndexOfBug);

// ES5 15.4.4.15
// http://es5.github.com/#x15.4.4.15
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
var hasFirefox2LastIndexOfBug = Array.prototype.lastIndexOf && [0, 1].lastIndexOf(0, -3) !== -1;
defineProperties(ArrayPrototype, {
    lastIndexOf: function lastIndexOf(searchElement /*, fromIndex */) {
        var self = splitString && isString(this) ? this.split('') : ES.ToObject(this);
        var length = self.length >>> 0;

        if (length === 0) {
            return -1;
        }
        var i = length - 1;
        if (arguments.length > 1) {
            i = Math.min(i, ES.ToInteger(arguments[1]));
        }
        // handle negative indices
        i = i >= 0 ? i : length - Math.abs(i);
        for (; i >= 0; i--) {
            if (i in self && searchElement === self[i]) {
                return i;
            }
        }
        return -1;
    }
}, hasFirefox2LastIndexOfBug);

//
// Object
// ======
//

// ES5 15.2.3.14
// http://es5.github.com/#x15.2.3.14

// http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
var hasDontEnumBug = !({ 'toString': null }).propertyIsEnumerable('toString'),
    hasProtoEnumBug = function () {}.propertyIsEnumerable('prototype'),
    hasStringEnumBug = !owns('x', '0'),
    dontEnums = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
    ],
    dontEnumsLength = dontEnums.length;

defineProperties(Object, {
    keys: function keys(object) {
        var isFn = isCallable(object),
            isArgs = isArguments(object),
            isObject = object !== null && typeof object === 'object',
            isStr = isObject && isString(object);

        if (!isObject && !isFn && !isArgs) {
            throw new TypeError('Object.keys called on a non-object');
        }

        var theKeys = [];
        var skipProto = hasProtoEnumBug && isFn;
        if ((isStr && hasStringEnumBug) || isArgs) {
            for (var i = 0; i < object.length; ++i) {
                theKeys.push(String(i));
            }
        }

        if (!isArgs) {
            for (var name in object) {
                if (!(skipProto && name === 'prototype') && owns(object, name)) {
                    theKeys.push(String(name));
                }
            }
        }

        if (hasDontEnumBug) {
            var ctor = object.constructor,
                skipConstructor = ctor && ctor.prototype === object;
            for (var j = 0; j < dontEnumsLength; j++) {
                var dontEnum = dontEnums[j];
                if (!(skipConstructor && dontEnum === 'constructor') && owns(object, dontEnum)) {
                    theKeys.push(dontEnum);
                }
            }
        }
        return theKeys;
    }
});

var keysWorksWithArguments = Object.keys && (function () {
    // Safari 5.0 bug
    return Object.keys(arguments).length === 2;
}(1, 2));
var originalKeys = Object.keys;
defineProperties(Object, {
    keys: function keys(object) {
        if (isArguments(object)) {
            return originalKeys(ArrayPrototype.slice.call(object));
        } else {
            return originalKeys(object);
        }
    }
}, !keysWorksWithArguments);

//
// Date
// ====
//

// ES5 15.9.5.43
// http://es5.github.com/#x15.9.5.43
// This function returns a String value represent the instance in time
// represented by this Date object. The format of the String is the Date Time
// string format defined in 15.9.1.15. All fields are present in the String.
// The time zone is always UTC, denoted by the suffix Z. If the time value of
// this object is not a finite Number a RangeError exception is thrown.
var negativeDate = -62198755200000;
var negativeYearString = '-000001';
var hasNegativeDateBug = Date.prototype.toISOString && new Date(negativeDate).toISOString().indexOf(negativeYearString) === -1;

defineProperties(Date.prototype, {
    toISOString: function toISOString() {
        var result, length, value, year, month;
        if (!isFinite(this)) {
            throw new RangeError('Date.prototype.toISOString called on non-finite value.');
        }

        year = this.getUTCFullYear();

        month = this.getUTCMonth();
        // see https://github.com/es-shims/es5-shim/issues/111
        year += Math.floor(month / 12);
        month = (month % 12 + 12) % 12;

        // the date time string format is specified in 15.9.1.15.
        result = [month + 1, this.getUTCDate(), this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()];
        year = (
            (year < 0 ? '-' : (year > 9999 ? '+' : '')) +
            ('00000' + Math.abs(year)).slice((0 <= year && year <= 9999) ? -4 : -6)
        );

        length = result.length;
        while (length--) {
            value = result[length];
            // pad months, days, hours, minutes, and seconds to have two
            // digits.
            if (value < 10) {
                result[length] = '0' + value;
            }
        }
        // pad milliseconds to have three digits.
        return (
            year + '-' + result.slice(0, 2).join('-') +
            'T' + result.slice(2).join(':') + '.' +
            ('000' + this.getUTCMilliseconds()).slice(-3) + 'Z'
        );
    }
}, hasNegativeDateBug);

// ES5 15.9.5.44
// http://es5.github.com/#x15.9.5.44
// This function provides a String representation of a Date object for use by
// JSON.stringify (15.12.3).
var dateToJSONIsSupported = (function () {
    try {
        return Date.prototype.toJSON &&
            new Date(NaN).toJSON() === null &&
            new Date(negativeDate).toJSON().indexOf(negativeYearString) !== -1 &&
            Date.prototype.toJSON.call({ // generic
                toISOString: function () { return true; }
            });
    } catch (e) {
        return false;
    }
}());
if (!dateToJSONIsSupported) {
    Date.prototype.toJSON = function toJSON(key) {
        // When the toJSON method is called with argument key, the following
        // steps are taken:

        // 1.  Let O be the result of calling ToObject, giving it the this
        // value as its argument.
        // 2. Let tv be ES.ToPrimitive(O, hint Number).
        var O = Object(this);
        var tv = ES.ToPrimitive(O);
        // 3. If tv is a Number and is not finite, return null.
        if (typeof tv === 'number' && !isFinite(tv)) {
            return null;
        }
        // 4. Let toISO be the result of calling the [[Get]] internal method of
        // O with argument "toISOString".
        var toISO = O.toISOString;
        // 5. If IsCallable(toISO) is false, throw a TypeError exception.
        if (!isCallable(toISO)) {
            throw new TypeError('toISOString property is not callable');
        }
        // 6. Return the result of calling the [[Call]] internal method of
        //  toISO with O as the this value and an empty argument list.
        return toISO.call(O);

        // NOTE 1 The argument is ignored.

        // NOTE 2 The toJSON function is intentionally generic; it does not
        // require that its this value be a Date object. Therefore, it can be
        // transferred to other kinds of objects for use as a method. However,
        // it does require that any such object have a toISOString method. An
        // object is free to use the argument key to filter its
        // stringification.
    };
}

// ES5 15.9.4.2
// http://es5.github.com/#x15.9.4.2
// based on work shared by Daniel Friesen (dantman)
// http://gist.github.com/303249
var supportsExtendedYears = Date.parse('+033658-09-27T01:46:40.000Z') === 1e15;
var acceptsInvalidDates = !isNaN(Date.parse('2012-04-04T24:00:00.500Z')) || !isNaN(Date.parse('2012-11-31T23:59:59.000Z')) || !isNaN(Date.parse('2012-12-31T23:59:60.000Z'));
var doesNotParseY2KNewYear = isNaN(Date.parse('2000-01-01T00:00:00.000Z'));
if (!Date.parse || doesNotParseY2KNewYear || acceptsInvalidDates || !supportsExtendedYears) {
    // XXX global assignment won't work in embeddings that use
    // an alternate object for the context.
    /* global Date: true */
    /* eslint-disable no-undef */
    Date = (function (NativeDate) {
    /* eslint-enable no-undef */
        // Date.length === 7
        var DateShim = function Date(Y, M, D, h, m, s, ms) {
            var length = arguments.length;
            var date;
            if (this instanceof NativeDate) {
                date = length === 1 && String(Y) === Y ? // isString(Y)
                    // We explicitly pass it through parse:
                    new NativeDate(DateShim.parse(Y)) :
                    // We have to manually make calls depending on argument
                    // length here
                    length >= 7 ? new NativeDate(Y, M, D, h, m, s, ms) :
                    length >= 6 ? new NativeDate(Y, M, D, h, m, s) :
                    length >= 5 ? new NativeDate(Y, M, D, h, m) :
                    length >= 4 ? new NativeDate(Y, M, D, h) :
                    length >= 3 ? new NativeDate(Y, M, D) :
                    length >= 2 ? new NativeDate(Y, M) :
                    length >= 1 ? new NativeDate(Y) :
                                  new NativeDate();
            } else {
                date = NativeDate.apply(this, arguments);
            }
            // Prevent mixups with unfixed Date object
            defineProperties(date, { constructor: DateShim }, true);
            return date;
        };

        // 15.9.1.15 Date Time String Format.
        var isoDateExpression = new RegExp('^' +
            '(\\d{4}|[+-]\\d{6})' + // four-digit year capture or sign +
                                      // 6-digit extended year
            '(?:-(\\d{2})' + // optional month capture
            '(?:-(\\d{2})' + // optional day capture
            '(?:' + // capture hours:minutes:seconds.milliseconds
                'T(\\d{2})' + // hours capture
                ':(\\d{2})' + // minutes capture
                '(?:' + // optional :seconds.milliseconds
                    ':(\\d{2})' + // seconds capture
                    '(?:(\\.\\d{1,}))?' + // milliseconds capture
                ')?' +
            '(' + // capture UTC offset component
                'Z|' + // UTC capture
                '(?:' + // offset specifier +/-hours:minutes
                    '([-+])' + // sign capture
                    '(\\d{2})' + // hours offset capture
                    ':(\\d{2})' + // minutes offset capture
                ')' +
            ')?)?)?)?' +
        '$');

        var months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];

        var dayFromMonth = function dayFromMonth(year, month) {
            var t = month > 1 ? 1 : 0;
            return (
                months[month] +
                Math.floor((year - 1969 + t) / 4) -
                Math.floor((year - 1901 + t) / 100) +
                Math.floor((year - 1601 + t) / 400) +
                365 * (year - 1970)
            );
        };

        var toUTC = function toUTC(t) {
            return Number(new NativeDate(1970, 0, 1, 0, 0, 0, t));
        };

        // Copy any custom methods a 3rd party library may have added
        for (var key in NativeDate) {
            if (owns(NativeDate, key)) {
                DateShim[key] = NativeDate[key];
            }
        }

        // Copy "native" methods explicitly; they may be non-enumerable
        defineProperties(DateShim, {
            now: NativeDate.now,
            UTC: NativeDate.UTC
        }, true);
        DateShim.prototype = NativeDate.prototype;
        defineProperties(DateShim.prototype, {
            constructor: DateShim
        }, true);

        // Upgrade Date.parse to handle simplified ISO 8601 strings
        var parseShim = function parse(string) {
            var match = isoDateExpression.exec(string);
            if (match) {
                // parse months, days, hours, minutes, seconds, and milliseconds
                // provide default values if necessary
                // parse the UTC offset component
                var year = Number(match[1]),
                    month = Number(match[2] || 1) - 1,
                    day = Number(match[3] || 1) - 1,
                    hour = Number(match[4] || 0),
                    minute = Number(match[5] || 0),
                    second = Number(match[6] || 0),
                    millisecond = Math.floor(Number(match[7] || 0) * 1000),
                    // When time zone is missed, local offset should be used
                    // (ES 5.1 bug)
                    // see https://bugs.ecmascript.org/show_bug.cgi?id=112
                    isLocalTime = Boolean(match[4] && !match[8]),
                    signOffset = match[9] === '-' ? 1 : -1,
                    hourOffset = Number(match[10] || 0),
                    minuteOffset = Number(match[11] || 0),
                    result;
                if (
                    hour < (
                        minute > 0 || second > 0 || millisecond > 0 ?
                        24 : 25
                    ) &&
                    minute < 60 && second < 60 && millisecond < 1000 &&
                    month > -1 && month < 12 && hourOffset < 24 &&
                    minuteOffset < 60 && // detect invalid offsets
                    day > -1 &&
                    day < (
                        dayFromMonth(year, month + 1) -
                        dayFromMonth(year, month)
                    )
                ) {
                    result = (
                        (dayFromMonth(year, month) + day) * 24 +
                        hour +
                        hourOffset * signOffset
                    ) * 60;
                    result = (
                        (result + minute + minuteOffset * signOffset) * 60 +
                        second
                    ) * 1000 + millisecond;
                    if (isLocalTime) {
                        result = toUTC(result);
                    }
                    if (-8.64e15 <= result && result <= 8.64e15) {
                        return result;
                    }
                }
                return NaN;
            }
            return NativeDate.parse.apply(this, arguments);
        };
        defineProperties(DateShim, { parse: parseShim });

        return DateShim;
    }(Date));
    /* global Date: false */
}

// ES5 15.9.4.4
// http://es5.github.com/#x15.9.4.4
if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}

//
// Number
// ======
//

// ES5.1 15.7.4.5
// http://es5.github.com/#x15.7.4.5
var hasToFixedBugs = NumberPrototype.toFixed && (
  (0.00008).toFixed(3) !== '0.000' ||
  (0.9).toFixed(0) !== '1' ||
  (1.255).toFixed(2) !== '1.25' ||
  (1000000000000000128).toFixed(0) !== '1000000000000000128'
);

var toFixedHelpers = {
  base: 1e7,
  size: 6,
  data: [0, 0, 0, 0, 0, 0],
  multiply: function multiply(n, c) {
      var i = -1;
      var c2 = c;
      while (++i < toFixedHelpers.size) {
          c2 += n * toFixedHelpers.data[i];
          toFixedHelpers.data[i] = c2 % toFixedHelpers.base;
          c2 = Math.floor(c2 / toFixedHelpers.base);
      }
  },
  divide: function divide(n) {
      var i = toFixedHelpers.size, c = 0;
      while (--i >= 0) {
          c += toFixedHelpers.data[i];
          toFixedHelpers.data[i] = Math.floor(c / n);
          c = (c % n) * toFixedHelpers.base;
      }
  },
  numToString: function numToString() {
      var i = toFixedHelpers.size;
      var s = '';
      while (--i >= 0) {
          if (s !== '' || i === 0 || toFixedHelpers.data[i] !== 0) {
              var t = String(toFixedHelpers.data[i]);
              if (s === '') {
                  s = t;
              } else {
                  s += '0000000'.slice(0, 7 - t.length) + t;
              }
          }
      }
      return s;
  },
  pow: function pow(x, n, acc) {
      return (n === 0 ? acc : (n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc)));
  },
  log: function log(x) {
      var n = 0;
      var x2 = x;
      while (x2 >= 4096) {
          n += 12;
          x2 /= 4096;
      }
      while (x2 >= 2) {
          n += 1;
          x2 /= 2;
      }
      return n;
  }
};

defineProperties(NumberPrototype, {
    toFixed: function toFixed(fractionDigits) {
        var f, x, s, m, e, z, j, k;

        // Test for NaN and round fractionDigits down
        f = Number(fractionDigits);
        f = f !== f ? 0 : Math.floor(f);

        if (f < 0 || f > 20) {
            throw new RangeError('Number.toFixed called with invalid number of decimals');
        }

        x = Number(this);

        // Test for NaN
        if (x !== x) {
            return 'NaN';
        }

        // If it is too big or small, return the string value of the number
        if (x <= -1e21 || x >= 1e21) {
            return String(x);
        }

        s = '';

        if (x < 0) {
            s = '-';
            x = -x;
        }

        m = '0';

        if (x > 1e-21) {
            // 1e-21 < x < 1e21
            // -70 < log2(x) < 70
            e = toFixedHelpers.log(x * toFixedHelpers.pow(2, 69, 1)) - 69;
            z = (e < 0 ? x * toFixedHelpers.pow(2, -e, 1) : x / toFixedHelpers.pow(2, e, 1));
            z *= 0x10000000000000; // Math.pow(2, 52);
            e = 52 - e;

            // -18 < e < 122
            // x = z / 2 ^ e
            if (e > 0) {
                toFixedHelpers.multiply(0, z);
                j = f;

                while (j >= 7) {
                    toFixedHelpers.multiply(1e7, 0);
                    j -= 7;
                }

                toFixedHelpers.multiply(toFixedHelpers.pow(10, j, 1), 0);
                j = e - 1;

                while (j >= 23) {
                    toFixedHelpers.divide(1 << 23);
                    j -= 23;
                }

                toFixedHelpers.divide(1 << j);
                toFixedHelpers.multiply(1, 1);
                toFixedHelpers.divide(2);
                m = toFixedHelpers.numToString();
            } else {
                toFixedHelpers.multiply(0, z);
                toFixedHelpers.multiply(1 << (-e), 0);
                m = toFixedHelpers.numToString() + '0.00000000000000000000'.slice(2, 2 + f);
            }
        }

        if (f > 0) {
            k = m.length;

            if (k <= f) {
                m = s + '0.0000000000000000000'.slice(0, f - k + 2) + m;
            } else {
                m = s + m.slice(0, k - f) + '.' + m.slice(k - f);
            }
        } else {
            m = s + m;
        }

        return m;
    }
}, hasToFixedBugs);

//
// String
// ======
//

// ES5 15.5.4.14
// http://es5.github.com/#x15.5.4.14

// [bugfix, IE lt 9, firefox 4, Konqueror, Opera, obscure browsers]
// Many browsers do not split properly with regular expressions or they
// do not perform the split correctly under obscure conditions.
// See http://blog.stevenlevithan.com/archives/cross-browser-split
// I've tested in many browsers and this seems to cover the deviant ones:
//    'ab'.split(/(?:ab)*/) should be ["", ""], not [""]
//    '.'.split(/(.?)(.?)/) should be ["", ".", "", ""], not ["", ""]
//    'tesst'.split(/(s)*/) should be ["t", undefined, "e", "s", "t"], not
//       [undefined, "t", undefined, "e", ...]
//    ''.split(/.?/) should be [], not [""]
//    '.'.split(/()()/) should be ["."], not ["", "", "."]

var string_split = StringPrototype.split;
if (
    'ab'.split(/(?:ab)*/).length !== 2 ||
    '.'.split(/(.?)(.?)/).length !== 4 ||
    'tesst'.split(/(s)*/)[1] === 't' ||
    'test'.split(/(?:)/, -1).length !== 4 ||
    ''.split(/.?/).length ||
    '.'.split(/()()/).length > 1
) {
    (function () {
        var compliantExecNpcg = typeof (/()??/).exec('')[1] === 'undefined'; // NPCG: nonparticipating capturing group

        StringPrototype.split = function (separator, limit) {
            var string = this;
            if (typeof separator === 'undefined' && limit === 0) {
                return [];
            }

            // If `separator` is not a regex, use native split
            if (!isRegex(separator)) {
                return string_split.call(this, separator, limit);
            }

            var output = [];
            var flags = (separator.ignoreCase ? 'i' : '') +
                        (separator.multiline ? 'm' : '') +
                        (separator.extended ? 'x' : '') + // Proposed for ES6
                        (separator.sticky ? 'y' : ''), // Firefox 3+
                lastLastIndex = 0,
                // Make `global` and avoid `lastIndex` issues by working with a copy
                separator2, match, lastIndex, lastLength;
            var separatorCopy = new RegExp(separator.source, flags + 'g');
            string += ''; // Type-convert
            if (!compliantExecNpcg) {
                // Doesn't need flags gy, but they don't hurt
                separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
            }
            /* Values for `limit`, per the spec:
             * If undefined: 4294967295 // Math.pow(2, 32) - 1
             * If 0, Infinity, or NaN: 0
             * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
             * If negative number: 4294967296 - Math.floor(Math.abs(limit))
             * If other: Type-convert, then use the above rules
             */
            var splitLimit = typeof limit === 'undefined' ?
                -1 >>> 0 : // Math.pow(2, 32) - 1
                ES.ToUint32(limit);
            match = separatorCopy.exec(string);
            while (match) {
                // `separatorCopy.lastIndex` is not reliable cross-browser
                lastIndex = match.index + match[0].length;
                if (lastIndex > lastLastIndex) {
                    output.push(string.slice(lastLastIndex, match.index));
                    // Fix browsers whose `exec` methods don't consistently return `undefined` for
                    // nonparticipating capturing groups
                    if (!compliantExecNpcg && match.length > 1) {
                        /* eslint-disable no-loop-func */
                        match[0].replace(separator2, function () {
                            for (var i = 1; i < arguments.length - 2; i++) {
                                if (typeof arguments[i] === 'undefined') {
                                    match[i] = void 0;
                                }
                            }
                        });
                        /* eslint-enable no-loop-func */
                    }
                    if (match.length > 1 && match.index < string.length) {
                        array_push.apply(output, match.slice(1));
                    }
                    lastLength = match[0].length;
                    lastLastIndex = lastIndex;
                    if (output.length >= splitLimit) {
                        break;
                    }
                }
                if (separatorCopy.lastIndex === match.index) {
                    separatorCopy.lastIndex++; // Avoid an infinite loop
                }
                match = separatorCopy.exec(string);
            }
            if (lastLastIndex === string.length) {
                if (lastLength || !separatorCopy.test('')) {
                    output.push('');
                }
            } else {
                output.push(string.slice(lastLastIndex));
            }
            return output.length > splitLimit ? output.slice(0, splitLimit) : output;
        };
    }());

// [bugfix, chrome]
// If separator is undefined, then the result array contains just one String,
// which is the this value (converted to a String). If limit is not undefined,
// then the output array is truncated so that it contains no more than limit
// elements.
// "0".split(undefined, 0) -> []
} else if ('0'.split(void 0, 0).length) {
    StringPrototype.split = function split(separator, limit) {
        if (typeof separator === 'undefined' && limit === 0) { return []; }
        return string_split.call(this, separator, limit);
    };
}

var str_replace = StringPrototype.replace;
var replaceReportsGroupsCorrectly = (function () {
    var groups = [];
    'x'.replace(/x(.)?/g, function (match, group) {
        groups.push(group);
    });
    return groups.length === 1 && typeof groups[0] === 'undefined';
}());

if (!replaceReportsGroupsCorrectly) {
    StringPrototype.replace = function replace(searchValue, replaceValue) {
        var isFn = isCallable(replaceValue);
        var hasCapturingGroups = isRegex(searchValue) && (/\)[*?]/).test(searchValue.source);
        if (!isFn || !hasCapturingGroups) {
            return str_replace.call(this, searchValue, replaceValue);
        } else {
            var wrappedReplaceValue = function (match) {
                var length = arguments.length;
                var originalLastIndex = searchValue.lastIndex;
                searchValue.lastIndex = 0;
                var args = searchValue.exec(match) || [];
                searchValue.lastIndex = originalLastIndex;
                args.push(arguments[length - 2], arguments[length - 1]);
                return replaceValue.apply(this, args);
            };
            return str_replace.call(this, searchValue, wrappedReplaceValue);
        }
    };
}

// ECMA-262, 3rd B.2.3
// Not an ECMAScript standard, although ECMAScript 3rd Edition has a
// non-normative section suggesting uniform semantics and it should be
// normalized across all browsers
// [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE
var string_substr = StringPrototype.substr;
var hasNegativeSubstrBug = ''.substr && '0b'.substr(-1) !== 'b';
defineProperties(StringPrototype, {
    substr: function substr(start, length) {
        var normalizedStart = start;
        if (start < 0) {
            normalizedStart = Math.max(this.length + start, 0);
        }
        return string_substr.call(this, normalizedStart, length);
    }
}, hasNegativeSubstrBug);

// ES5 15.5.4.20
// whitespace from: http://es5.github.io/#x15.5.4.20
var ws = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
    '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028' +
    '\u2029\uFEFF';
var zeroWidth = '\u200b';
var wsRegexChars = '[' + ws + ']';
var trimBeginRegexp = new RegExp('^' + wsRegexChars + wsRegexChars + '*');
var trimEndRegexp = new RegExp(wsRegexChars + wsRegexChars + '*$');
var hasTrimWhitespaceBug = StringPrototype.trim && (ws.trim() || !zeroWidth.trim());
defineProperties(StringPrototype, {
    // http://blog.stevenlevithan.com/archives/faster-trim-javascript
    // http://perfectionkills.com/whitespace-deviations/
    trim: function trim() {
        if (typeof this === 'undefined' || this === null) {
            throw new TypeError("can't convert " + this + ' to object');
        }
        return String(this).replace(trimBeginRegexp, '').replace(trimEndRegexp, '');
    }
}, hasTrimWhitespaceBug);

// ES-5 15.1.2.2
if (parseInt(ws + '08') !== 8 || parseInt(ws + '0x16') !== 22) {
    /* global parseInt: true */
    parseInt = (function (origParseInt) {
        var hexRegex = /^0[xX]/;
        return function parseInt(str, radix) {
            var string = String(str).trim();
            var defaultedRadix = Number(radix) || (hexRegex.test(string) ? 16 : 10);
            return origParseInt(string, defaultedRadix);
        };
    }(parseInt));
}

}));

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvaWUtc2hpbXMuanMiLCJub2RlX21vZHVsZXMvZXM1LXNoaW0vZXM1LXNoYW0uanMiLCJub2RlX21vZHVsZXMvZXM1LXNoaW0vZXM1LXNoaW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwaUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSgnZXM1LXNoaW0nKTtcbnJlcXVpcmUoJ2VzNS1zaGltL2VzNS1zaGFtJyk7IiwiLyohXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZXMtc2hpbXMvZXM1LXNoaW1cbiAqIEBsaWNlbnNlIGVzNS1zaGltIENvcHlyaWdodCAyMDA5LTIwMTUgYnkgY29udHJpYnV0b3JzLCBNSVQgTGljZW5zZVxuICogc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lcy1zaGltcy9lczUtc2hpbS9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cblxuLy8gdmltOiB0cz00IHN0cz00IHN3PTQgZXhwYW5kdGFiXG5cbi8vIEFkZCBzZW1pY29sb24gdG8gcHJldmVudCBJSUZFIGZyb20gYmVpbmcgcGFzc2VkIGFzIGFyZ3VtZW50IHRvIGNvbmNhdGVuYXRlZCBjb2RlLlxuO1xuXG4vLyBVTUQgKFVuaXZlcnNhbCBNb2R1bGUgRGVmaW5pdGlvbilcbi8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vdW1kanMvdW1kL2Jsb2IvbWFzdGVyL3JldHVybkV4cG9ydHMuanNcbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8qIGdsb2JhbCBkZWZpbmUsIGV4cG9ydHMsIG1vZHVsZSAqL1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgICAgICBkZWZpbmUoZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgLy8gTm9kZS4gRG9lcyBub3Qgd29yayB3aXRoIHN0cmljdCBDb21tb25KUywgYnV0XG4gICAgICAgIC8vIG9ubHkgQ29tbW9uSlMtbGlrZSBlbnZpcm9tZW50cyB0aGF0IHN1cHBvcnQgbW9kdWxlLmV4cG9ydHMsXG4gICAgICAgIC8vIGxpa2UgTm9kZS5cbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQnJvd3NlciBnbG9iYWxzIChyb290IGlzIHdpbmRvdylcbiAgICAgICAgcm9vdC5yZXR1cm5FeHBvcnRzID0gZmFjdG9yeSgpO1xuICB9XG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcblxudmFyIGNhbGwgPSBGdW5jdGlvbi5wcm90b3R5cGUuY2FsbDtcbnZhciBwcm90b3R5cGVPZk9iamVjdCA9IE9iamVjdC5wcm90b3R5cGU7XG52YXIgb3ducyA9IGNhbGwuYmluZChwcm90b3R5cGVPZk9iamVjdC5oYXNPd25Qcm9wZXJ0eSk7XG5cbi8vIElmIEpTIGVuZ2luZSBzdXBwb3J0cyBhY2Nlc3NvcnMgY3JlYXRpbmcgc2hvcnRjdXRzLlxudmFyIGRlZmluZUdldHRlcjtcbnZhciBkZWZpbmVTZXR0ZXI7XG52YXIgbG9va3VwR2V0dGVyO1xudmFyIGxvb2t1cFNldHRlcjtcbnZhciBzdXBwb3J0c0FjY2Vzc29ycyA9IG93bnMocHJvdG90eXBlT2ZPYmplY3QsICdfX2RlZmluZUdldHRlcl9fJyk7XG5pZiAoc3VwcG9ydHNBY2Nlc3NvcnMpIHtcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlcnNjb3JlLWRhbmdsZSAqL1xuICAgIGRlZmluZUdldHRlciA9IGNhbGwuYmluZChwcm90b3R5cGVPZk9iamVjdC5fX2RlZmluZUdldHRlcl9fKTtcbiAgICBkZWZpbmVTZXR0ZXIgPSBjYWxsLmJpbmQocHJvdG90eXBlT2ZPYmplY3QuX19kZWZpbmVTZXR0ZXJfXyk7XG4gICAgbG9va3VwR2V0dGVyID0gY2FsbC5iaW5kKHByb3RvdHlwZU9mT2JqZWN0Ll9fbG9va3VwR2V0dGVyX18pO1xuICAgIGxvb2t1cFNldHRlciA9IGNhbGwuYmluZChwcm90b3R5cGVPZk9iamVjdC5fX2xvb2t1cFNldHRlcl9fKTtcbiAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVuZGVyc2NvcmUtZGFuZ2xlICovXG59XG5cbi8vIEVTNSAxNS4yLjMuMlxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjJcbmlmICghT2JqZWN0LmdldFByb3RvdHlwZU9mKSB7XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2VzLXNoaW1zL2VzNS1zaGltL2lzc3VlcyNpc3N1ZS8yXG4gICAgLy8gaHR0cDovL2Vqb2huLm9yZy9ibG9nL29iamVjdGdldHByb3RvdHlwZW9mL1xuICAgIC8vIHJlY29tbWVuZGVkIGJ5IGZzY2hhZWZlciBvbiBnaXRodWJcbiAgICAvL1xuICAgIC8vIHN1cmUsIGFuZCB3ZWJyZWZsZWN0aW9uIHNheXMgXl9eXG4gICAgLy8gLi4uIHRoaXMgd2lsbCBuZXJldmVyIHBvc3NpYmx5IHJldHVybiBudWxsXG4gICAgLy8gLi4uIE9wZXJhIE1pbmkgYnJlYWtzIGhlcmUgd2l0aCBpbmZpbml0ZSBsb29wc1xuICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZiA9IGZ1bmN0aW9uIGdldFByb3RvdHlwZU9mKG9iamVjdCkge1xuICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xuICAgICAgICB2YXIgcHJvdG8gPSBvYmplY3QuX19wcm90b19fO1xuICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXByb3RvICovXG4gICAgICAgIGlmIChwcm90byB8fCBwcm90byA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHByb3RvO1xuICAgICAgICB9IGVsc2UgaWYgKG9iamVjdC5jb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgcmV0dXJuIG9iamVjdC5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvdG90eXBlT2ZPYmplY3Q7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuMi4zLjNcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy4zXG5cbnZhciBkb2VzR2V0T3duUHJvcGVydHlEZXNjcmlwdG9yV29yayA9IGZ1bmN0aW9uIGRvZXNHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JXb3JrKG9iamVjdCkge1xuICAgIHRyeSB7XG4gICAgICAgIG9iamVjdC5zZW50aW5lbCA9IDA7XG4gICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgJ3NlbnRpbmVsJykudmFsdWUgPT09IDA7XG4gICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59O1xuXG4vLyBjaGVjayB3aGV0aGVyIGdldE93blByb3BlcnR5RGVzY3JpcHRvciB3b3JrcyBpZiBpdCdzIGdpdmVuLiBPdGhlcndpc2UsIHNoaW0gcGFydGlhbGx5LlxuaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkge1xuICAgIHZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JXb3Jrc09uT2JqZWN0ID0gZG9lc0dldE93blByb3BlcnR5RGVzY3JpcHRvcldvcmsoe30pO1xuICAgIHZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JXb3Jrc09uRG9tID0gdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJyB8fFxuICAgIGRvZXNHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JXb3JrKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKTtcbiAgICBpZiAoIWdldE93blByb3BlcnR5RGVzY3JpcHRvcldvcmtzT25Eb20gfHwgIWdldE93blByb3BlcnR5RGVzY3JpcHRvcldvcmtzT25PYmplY3QpIHtcbiAgICAgICAgdmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvckZhbGxiYWNrID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgICB9XG59XG5cbmlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciB8fCBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JGYWxsYmFjaykge1xuICAgIHZhciBFUlJfTk9OX09CSkVDVCA9ICdPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIGNhbGxlZCBvbiBhIG5vbi1vYmplY3Q6ICc7XG5cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBwcm9wZXJ0eSkge1xuICAgICAgICBpZiAoKHR5cGVvZiBvYmplY3QgIT09ICdvYmplY3QnICYmIHR5cGVvZiBvYmplY3QgIT09ICdmdW5jdGlvbicpIHx8IG9iamVjdCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihFUlJfTk9OX09CSkVDVCArIG9iamVjdCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtYWtlIGEgdmFsaWFudCBhdHRlbXB0IHRvIHVzZSB0aGUgcmVhbCBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JcbiAgICAgICAgLy8gZm9yIEk4J3MgRE9NIGVsZW1lbnRzLlxuICAgICAgICBpZiAoZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yRmFsbGJhY2spIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldE93blByb3BlcnR5RGVzY3JpcHRvckZhbGxiYWNrLmNhbGwoT2JqZWN0LCBvYmplY3QsIHByb3BlcnR5KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgICAgIC8vIHRyeSB0aGUgc2hpbSBpZiB0aGUgcmVhbCBvbmUgZG9lc24ndCB3b3JrXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZGVzY3JpcHRvcjtcblxuICAgICAgICAvLyBJZiBvYmplY3QgZG9lcyBub3Qgb3ducyBwcm9wZXJ0eSByZXR1cm4gdW5kZWZpbmVkIGltbWVkaWF0ZWx5LlxuICAgICAgICBpZiAoIW93bnMob2JqZWN0LCBwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgIHJldHVybiBkZXNjcmlwdG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgb2JqZWN0IGhhcyBhIHByb3BlcnR5IHRoZW4gaXQncyBmb3Igc3VyZSBib3RoIGBlbnVtZXJhYmxlYCBhbmRcbiAgICAgICAgLy8gYGNvbmZpZ3VyYWJsZWAuXG4gICAgICAgIGRlc2NyaXB0b3IgPSB7IGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9O1xuXG4gICAgICAgIC8vIElmIEpTIGVuZ2luZSBzdXBwb3J0cyBhY2Nlc3NvciBwcm9wZXJ0aWVzIHRoZW4gcHJvcGVydHkgbWF5IGJlIGFcbiAgICAgICAgLy8gZ2V0dGVyIG9yIHNldHRlci5cbiAgICAgICAgaWYgKHN1cHBvcnRzQWNjZXNzb3JzKSB7XG4gICAgICAgICAgICAvLyBVbmZvcnR1bmF0ZWx5IGBfX2xvb2t1cEdldHRlcl9fYCB3aWxsIHJldHVybiBhIGdldHRlciBldmVuXG4gICAgICAgICAgICAvLyBpZiBvYmplY3QgaGFzIG93biBub24gZ2V0dGVyIHByb3BlcnR5IGFsb25nIHdpdGggYSBzYW1lIG5hbWVkXG4gICAgICAgICAgICAvLyBpbmhlcml0ZWQgZ2V0dGVyLiBUbyBhdm9pZCBtaXNiZWhhdmlvciB3ZSB0ZW1wb3JhcnkgcmVtb3ZlXG4gICAgICAgICAgICAvLyBgX19wcm90b19fYCBzbyB0aGF0IGBfX2xvb2t1cEdldHRlcl9fYCB3aWxsIHJldHVybiBnZXR0ZXIgb25seVxuICAgICAgICAgICAgLy8gaWYgaXQncyBvd25lZCBieSBhbiBvYmplY3QuXG4gICAgICAgICAgICB2YXIgcHJvdG90eXBlID0gb2JqZWN0Ll9fcHJvdG9fXztcbiAgICAgICAgICAgIHZhciBub3RQcm90b3R5cGVPZk9iamVjdCA9IG9iamVjdCAhPT0gcHJvdG90eXBlT2ZPYmplY3Q7XG4gICAgICAgICAgICAvLyBhdm9pZCByZWN1cnNpb24gcHJvYmxlbSwgYnJlYWtpbmcgaW4gT3BlcmEgTWluaSB3aGVuXG4gICAgICAgICAgICAvLyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE9iamVjdC5wcm90b3R5cGUsICd0b1N0cmluZycpXG4gICAgICAgICAgICAvLyBvciBhbnkgb3RoZXIgT2JqZWN0LnByb3RvdHlwZSBhY2Nlc3NvclxuICAgICAgICAgICAgaWYgKG5vdFByb3RvdHlwZU9mT2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0Ll9fcHJvdG9fXyA9IHByb3RvdHlwZU9mT2JqZWN0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZ2V0dGVyID0gbG9va3VwR2V0dGVyKG9iamVjdCwgcHJvcGVydHkpO1xuICAgICAgICAgICAgdmFyIHNldHRlciA9IGxvb2t1cFNldHRlcihvYmplY3QsIHByb3BlcnR5KTtcblxuICAgICAgICAgICAgaWYgKG5vdFByb3RvdHlwZU9mT2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgLy8gT25jZSB3ZSBoYXZlIGdldHRlciBhbmQgc2V0dGVyIHdlIGNhbiBwdXQgdmFsdWVzIGJhY2suXG4gICAgICAgICAgICAgICAgb2JqZWN0Ll9fcHJvdG9fXyA9IHByb3RvdHlwZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGdldHRlciB8fCBzZXR0ZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZ2V0dGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0b3IuZ2V0ID0gZ2V0dGVyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc2V0dGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0b3Iuc2V0ID0gc2V0dGVyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBJZiBpdCB3YXMgYWNjZXNzb3IgcHJvcGVydHkgd2UncmUgZG9uZSBhbmQgcmV0dXJuIGhlcmVcbiAgICAgICAgICAgICAgICAvLyBpbiBvcmRlciB0byBhdm9pZCBhZGRpbmcgYHZhbHVlYCB0byB0aGUgZGVzY3JpcHRvci5cbiAgICAgICAgICAgICAgICByZXR1cm4gZGVzY3JpcHRvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHdlIGdvdCB0aGlzIGZhciB3ZSBrbm93IHRoYXQgb2JqZWN0IGhhcyBhbiBvd24gcHJvcGVydHkgdGhhdCBpc1xuICAgICAgICAvLyBub3QgYW4gYWNjZXNzb3Igc28gd2Ugc2V0IGl0IGFzIGEgdmFsdWUgYW5kIHJldHVybiBkZXNjcmlwdG9yLlxuICAgICAgICBkZXNjcmlwdG9yLnZhbHVlID0gb2JqZWN0W3Byb3BlcnR5XTtcbiAgICAgICAgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgICAgIHJldHVybiBkZXNjcmlwdG9yO1xuICAgIH07XG4gICAgLyogZXNsaW50LWVuYWJsZSBuby1wcm90byAqL1xufVxuXG4vLyBFUzUgMTUuMi4zLjRcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy40XG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKSB7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqZWN0KTtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuMi4zLjVcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy41XG5pZiAoIU9iamVjdC5jcmVhdGUpIHtcblxuICAgIC8vIENvbnRyaWJ1dGVkIGJ5IEJyYW5kb24gQmVudmllLCBPY3RvYmVyLCAyMDEyXG4gICAgdmFyIGNyZWF0ZUVtcHR5O1xuICAgIHZhciBzdXBwb3J0c1Byb3RvID0gISh7IF9fcHJvdG9fXzogbnVsbCB9IGluc3RhbmNlb2YgT2JqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSBmb2xsb3dpbmcgcHJvZHVjZXMgZmFsc2UgcG9zaXRpdmVzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpbiBPcGVyYSBNaW5pID0+IG5vdCBhIHJlbGlhYmxlIGNoZWNrXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBPYmplY3QucHJvdG90eXBlLl9fcHJvdG9fXyA9PT0gbnVsbFxuXG4gICAgLy8gQ2hlY2sgZm9yIGRvY3VtZW50LmRvbWFpbiBhbmQgYWN0aXZlIHggc3VwcG9ydFxuICAgIC8vIE5vIG5lZWQgdG8gdXNlIGFjdGl2ZSB4IGFwcHJvYWNoIHdoZW4gZG9jdW1lbnQuZG9tYWluIGlzIG5vdCBzZXRcbiAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2VzLXNoaW1zL2VzNS1zaGltL2lzc3Vlcy8xNTBcbiAgICAvLyB2YXJpYXRpb24gb2YgaHR0cHM6Ly9naXRodWIuY29tL2tpdGNhbWJyaWRnZS9lczUtc2hpbS9jb21taXQvNGY3MzhhYzA2NjM0NlxuICAgIC8qIGdsb2JhbCBBY3RpdmVYT2JqZWN0ICovXG4gICAgdmFyIHNob3VsZFVzZUFjdGl2ZVggPSBmdW5jdGlvbiBzaG91bGRVc2VBY3RpdmVYKCkge1xuICAgICAgICAvLyByZXR1cm4gZWFybHkgaWYgZG9jdW1lbnQuZG9tYWluIG5vdCBzZXRcbiAgICAgICAgaWYgKCFkb2N1bWVudC5kb21haW4pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gISFuZXcgQWN0aXZlWE9iamVjdCgnaHRtbGZpbGUnKTtcbiAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gVGhpcyBzdXBwb3J0cyBJRTggd2hlbiBkb2N1bWVudC5kb21haW4gaXMgdXNlZFxuICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vZXMtc2hpbXMvZXM1LXNoaW0vaXNzdWVzLzE1MFxuICAgIC8vIHZhcmlhdGlvbiBvZiBodHRwczovL2dpdGh1Yi5jb20va2l0Y2FtYnJpZGdlL2VzNS1zaGltL2NvbW1pdC80ZjczOGFjMDY2MzQ2XG4gICAgdmFyIGdldEVtcHR5VmlhQWN0aXZlWCA9IGZ1bmN0aW9uIGdldEVtcHR5VmlhQWN0aXZlWCgpIHtcbiAgICAgICAgdmFyIGVtcHR5O1xuICAgICAgICB2YXIgeERvYztcblxuICAgICAgICB4RG9jID0gbmV3IEFjdGl2ZVhPYmplY3QoJ2h0bWxmaWxlJyk7XG5cbiAgICAgICAgeERvYy53cml0ZSgnPHNjcmlwdD48XFwvc2NyaXB0PicpO1xuICAgICAgICB4RG9jLmNsb3NlKCk7XG5cbiAgICAgICAgZW1wdHkgPSB4RG9jLnBhcmVudFdpbmRvdy5PYmplY3QucHJvdG90eXBlO1xuICAgICAgICB4RG9jID0gbnVsbDtcblxuICAgICAgICByZXR1cm4gZW1wdHk7XG4gICAgfTtcblxuICAgIC8vIFRoZSBvcmlnaW5hbCBpbXBsZW1lbnRhdGlvbiB1c2luZyBhbiBpZnJhbWVcbiAgICAvLyBiZWZvcmUgdGhlIGFjdGl2ZXggYXBwcm9hY2ggd2FzIGFkZGVkXG4gICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lcy1zaGltcy9lczUtc2hpbS9pc3N1ZXMvMTUwXG4gICAgdmFyIGdldEVtcHR5VmlhSUZyYW1lID0gZnVuY3Rpb24gZ2V0RW1wdHlWaWFJRnJhbWUoKSB7XG4gICAgICAgIHZhciBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcbiAgICAgICAgdmFyIHBhcmVudCA9IGRvY3VtZW50LmJvZHkgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICB2YXIgZW1wdHk7XG5cbiAgICAgICAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1zY3JpcHQtdXJsICovXG4gICAgICAgIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonO1xuICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXNjcmlwdC11cmwgKi9cblxuICAgICAgICBlbXB0eSA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdC5wcm90b3R5cGU7XG4gICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICAgICAgICBpZnJhbWUgPSBudWxsO1xuXG4gICAgICAgIHJldHVybiBlbXB0eTtcbiAgICB9O1xuXG4gICAgLyogZ2xvYmFsIGRvY3VtZW50ICovXG4gICAgaWYgKHN1cHBvcnRzUHJvdG8gfHwgdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBjcmVhdGVFbXB0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB7IF9fcHJvdG9fXzogbnVsbCB9O1xuICAgICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEluIG9sZCBJRSBfX3Byb3RvX18gY2FuJ3QgYmUgdXNlZCB0byBtYW51YWxseSBzZXQgYG51bGxgLCBub3IgZG9lc1xuICAgICAgICAvLyBhbnkgb3RoZXIgbWV0aG9kIGV4aXN0IHRvIG1ha2UgYW4gb2JqZWN0IHRoYXQgaW5oZXJpdHMgZnJvbSBub3RoaW5nLFxuICAgICAgICAvLyBhc2lkZSBmcm9tIE9iamVjdC5wcm90b3R5cGUgaXRzZWxmLiBJbnN0ZWFkLCBjcmVhdGUgYSBuZXcgZ2xvYmFsXG4gICAgICAgIC8vIG9iamVjdCBhbmQgKnN0ZWFsKiBpdHMgT2JqZWN0LnByb3RvdHlwZSBhbmQgc3RyaXAgaXQgYmFyZS4gVGhpcyBpc1xuICAgICAgICAvLyB1c2VkIGFzIHRoZSBwcm90b3R5cGUgdG8gY3JlYXRlIG51bGxhcnkgb2JqZWN0cy5cbiAgICAgICAgY3JlYXRlRW1wdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBEZXRlcm1pbmUgd2hpY2ggYXBwcm9hY2ggdG8gdXNlXG4gICAgICAgICAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2VzLXNoaW1zL2VzNS1zaGltL2lzc3Vlcy8xNTBcbiAgICAgICAgICAgIHZhciBlbXB0eSA9IHNob3VsZFVzZUFjdGl2ZVgoKSA/IGdldEVtcHR5VmlhQWN0aXZlWCgpIDogZ2V0RW1wdHlWaWFJRnJhbWUoKTtcblxuICAgICAgICAgICAgZGVsZXRlIGVtcHR5LmNvbnN0cnVjdG9yO1xuICAgICAgICAgICAgZGVsZXRlIGVtcHR5Lmhhc093blByb3BlcnR5O1xuICAgICAgICAgICAgZGVsZXRlIGVtcHR5LnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuICAgICAgICAgICAgZGVsZXRlIGVtcHR5LmlzUHJvdG90eXBlT2Y7XG4gICAgICAgICAgICBkZWxldGUgZW1wdHkudG9Mb2NhbGVTdHJpbmc7XG4gICAgICAgICAgICBkZWxldGUgZW1wdHkudG9TdHJpbmc7XG4gICAgICAgICAgICBkZWxldGUgZW1wdHkudmFsdWVPZjtcbiAgICAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG4gICAgICAgICAgICBlbXB0eS5fX3Byb3RvX18gPSBudWxsO1xuICAgICAgICAgICAgLyogZXNsaW50LWVuYWJsZSBuby1wcm90byAqL1xuXG4gICAgICAgICAgICB2YXIgRW1wdHkgPSBmdW5jdGlvbiBFbXB0eSgpIHt9O1xuICAgICAgICAgICAgRW1wdHkucHJvdG90eXBlID0gZW1wdHk7XG4gICAgICAgICAgICAvLyBzaG9ydC1jaXJjdWl0IGZ1dHVyZSBjYWxsc1xuICAgICAgICAgICAgY3JlYXRlRW1wdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFbXB0eSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRW1wdHkoKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBPYmplY3QuY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKHByb3RvdHlwZSwgcHJvcGVydGllcykge1xuXG4gICAgICAgIHZhciBvYmplY3Q7XG4gICAgICAgIHZhciBUeXBlID0gZnVuY3Rpb24gVHlwZSgpIHt9OyAvLyBBbiBlbXB0eSBjb25zdHJ1Y3Rvci5cblxuICAgICAgICBpZiAocHJvdG90eXBlID09PSBudWxsKSB7XG4gICAgICAgICAgICBvYmplY3QgPSBjcmVhdGVFbXB0eSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm90b3R5cGUgIT09ICdvYmplY3QnICYmIHR5cGVvZiBwcm90b3R5cGUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAvLyBJbiB0aGUgbmF0aXZlIGltcGxlbWVudGF0aW9uIGBwYXJlbnRgIGNhbiBiZSBgbnVsbGBcbiAgICAgICAgICAgICAgICAvLyBPUiAqYW55KiBgaW5zdGFuY2VvZiBPYmplY3RgICAoT2JqZWN0fEZ1bmN0aW9ufEFycmF5fFJlZ0V4cHxldGMpXG4gICAgICAgICAgICAgICAgLy8gVXNlIGB0eXBlb2ZgIHRobywgYi9jIGluIG9sZCBJRSwgRE9NIGVsZW1lbnRzIGFyZSBub3QgYGluc3RhbmNlb2YgT2JqZWN0YFxuICAgICAgICAgICAgICAgIC8vIGxpa2UgdGhleSBhcmUgaW4gbW9kZXJuIGJyb3dzZXJzLiBVc2luZyBgT2JqZWN0LmNyZWF0ZWAgb24gRE9NIGVsZW1lbnRzXG4gICAgICAgICAgICAgICAgLy8gaXMuLi5lcnIuLi5wcm9iYWJseSBpbmFwcHJvcHJpYXRlLCBidXQgdGhlIG5hdGl2ZSB2ZXJzaW9uIGFsbG93cyBmb3IgaXQuXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0IHByb3RvdHlwZSBtYXkgb25seSBiZSBhbiBPYmplY3Qgb3IgbnVsbCcpOyAvLyBzYW1lIG1zZyBhcyBDaHJvbWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFR5cGUucHJvdG90eXBlID0gcHJvdG90eXBlO1xuICAgICAgICAgICAgb2JqZWN0ID0gbmV3IFR5cGUoKTtcbiAgICAgICAgICAgIC8vIElFIGhhcyBubyBidWlsdC1pbiBpbXBsZW1lbnRhdGlvbiBvZiBgT2JqZWN0LmdldFByb3RvdHlwZU9mYFxuICAgICAgICAgICAgLy8gbmVpdGhlciBgX19wcm90b19fYCwgYnV0IHRoaXMgbWFudWFsbHkgc2V0dGluZyBgX19wcm90b19fYCB3aWxsXG4gICAgICAgICAgICAvLyBndWFyYW50ZWUgdGhhdCBgT2JqZWN0LmdldFByb3RvdHlwZU9mYCB3aWxsIHdvcmsgYXMgZXhwZWN0ZWQgd2l0aFxuICAgICAgICAgICAgLy8gb2JqZWN0cyBjcmVhdGVkIHVzaW5nIGBPYmplY3QuY3JlYXRlYFxuICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cbiAgICAgICAgICAgIG9iamVjdC5fX3Byb3RvX18gPSBwcm90b3R5cGU7XG4gICAgICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXByb3RvICovXG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvcGVydGllcyAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhvYmplY3QsIHByb3BlcnRpZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuMi4zLjZcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy42XG5cbi8vIFBhdGNoIGZvciBXZWJLaXQgYW5kIElFOCBzdGFuZGFyZCBtb2RlXG4vLyBEZXNpZ25lZCBieSBoYXggPGhheC5naXRodWIuY29tPlxuLy8gcmVsYXRlZCBpc3N1ZTogaHR0cHM6Ly9naXRodWIuY29tL2VzLXNoaW1zL2VzNS1zaGltL2lzc3VlcyNpc3N1ZS81XG4vLyBJRTggUmVmZXJlbmNlOlxuLy8gICAgIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9kZDI4MjkwMC5hc3B4XG4vLyAgICAgaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2RkMjI5OTE2LmFzcHhcbi8vIFdlYktpdCBCdWdzOlxuLy8gICAgIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0zNjQyM1xuXG52YXIgZG9lc0RlZmluZVByb3BlcnR5V29yayA9IGZ1bmN0aW9uIGRvZXNEZWZpbmVQcm9wZXJ0eVdvcmsob2JqZWN0KSB7XG4gICAgdHJ5IHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ3NlbnRpbmVsJywge30pO1xuICAgICAgICByZXR1cm4gJ3NlbnRpbmVsJyBpbiBvYmplY3Q7XG4gICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59O1xuXG4vLyBjaGVjayB3aGV0aGVyIGRlZmluZVByb3BlcnR5IHdvcmtzIGlmIGl0J3MgZ2l2ZW4uIE90aGVyd2lzZSxcbi8vIHNoaW0gcGFydGlhbGx5LlxuaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkge1xuICAgIHZhciBkZWZpbmVQcm9wZXJ0eVdvcmtzT25PYmplY3QgPSBkb2VzRGVmaW5lUHJvcGVydHlXb3JrKHt9KTtcbiAgICB2YXIgZGVmaW5lUHJvcGVydHlXb3Jrc09uRG9tID0gdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJyB8fFxuICAgICAgICBkb2VzRGVmaW5lUHJvcGVydHlXb3JrKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKTtcbiAgICBpZiAoIWRlZmluZVByb3BlcnR5V29ya3NPbk9iamVjdCB8fCAhZGVmaW5lUHJvcGVydHlXb3Jrc09uRG9tKSB7XG4gICAgICAgIHZhciBkZWZpbmVQcm9wZXJ0eUZhbGxiYWNrID0gT2JqZWN0LmRlZmluZVByb3BlcnR5LFxuICAgICAgICAgICAgZGVmaW5lUHJvcGVydGllc0ZhbGxiYWNrID0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXM7XG4gICAgfVxufVxuXG5pZiAoIU9iamVjdC5kZWZpbmVQcm9wZXJ0eSB8fCBkZWZpbmVQcm9wZXJ0eUZhbGxiYWNrKSB7XG4gICAgdmFyIEVSUl9OT05fT0JKRUNUX0RFU0NSSVBUT1IgPSAnUHJvcGVydHkgZGVzY3JpcHRpb24gbXVzdCBiZSBhbiBvYmplY3Q6ICc7XG4gICAgdmFyIEVSUl9OT05fT0JKRUNUX1RBUkdFVCA9ICdPYmplY3QuZGVmaW5lUHJvcGVydHkgY2FsbGVkIG9uIG5vbi1vYmplY3Q6ICc7XG4gICAgdmFyIEVSUl9BQ0NFU1NPUlNfTk9UX1NVUFBPUlRFRCA9ICdnZXR0ZXJzICYgc2V0dGVycyBjYW4gbm90IGJlIGRlZmluZWQgb24gdGhpcyBqYXZhc2NyaXB0IGVuZ2luZSc7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5LCBkZXNjcmlwdG9yKSB7XG4gICAgICAgIGlmICgodHlwZW9mIG9iamVjdCAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIG9iamVjdCAhPT0gJ2Z1bmN0aW9uJykgfHwgb2JqZWN0ID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEVSUl9OT05fT0JKRUNUX1RBUkdFVCArIG9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCh0eXBlb2YgZGVzY3JpcHRvciAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIGRlc2NyaXB0b3IgIT09ICdmdW5jdGlvbicpIHx8IGRlc2NyaXB0b3IgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRVJSX05PTl9PQkpFQ1RfREVTQ1JJUFRPUiArIGRlc2NyaXB0b3IpO1xuICAgICAgICB9XG4gICAgICAgIC8vIG1ha2UgYSB2YWxpYW50IGF0dGVtcHQgdG8gdXNlIHRoZSByZWFsIGRlZmluZVByb3BlcnR5XG4gICAgICAgIC8vIGZvciBJOCdzIERPTSBlbGVtZW50cy5cbiAgICAgICAgaWYgKGRlZmluZVByb3BlcnR5RmFsbGJhY2spIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmluZVByb3BlcnR5RmFsbGJhY2suY2FsbChPYmplY3QsIG9iamVjdCwgcHJvcGVydHksIGRlc2NyaXB0b3IpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgLy8gdHJ5IHRoZSBzaGltIGlmIHRoZSByZWFsIG9uZSBkb2Vzbid0IHdvcmtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIGl0J3MgYSBkYXRhIHByb3BlcnR5LlxuICAgICAgICBpZiAoJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yKSB7XG4gICAgICAgICAgICAvLyBmYWlsIHNpbGVudGx5IGlmICd3cml0YWJsZScsICdlbnVtZXJhYmxlJywgb3IgJ2NvbmZpZ3VyYWJsZSdcbiAgICAgICAgICAgIC8vIGFyZSByZXF1ZXN0ZWQgYnV0IG5vdCBzdXBwb3J0ZWRcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAvLyBhbHRlcm5hdGUgYXBwcm9hY2g6XG4gICAgICAgICAgICBpZiAoIC8vIGNhbid0IGltcGxlbWVudCB0aGVzZSBmZWF0dXJlczsgYWxsb3cgZmFsc2UgYnV0IG5vdCB0cnVlXG4gICAgICAgICAgICAgICAgKCd3cml0YWJsZScgaW4gZGVzY3JpcHRvciAmJiAhZGVzY3JpcHRvci53cml0YWJsZSkgfHxcbiAgICAgICAgICAgICAgICAoJ2VudW1lcmFibGUnIGluIGRlc2NyaXB0b3IgJiYgIWRlc2NyaXB0b3IuZW51bWVyYWJsZSkgfHxcbiAgICAgICAgICAgICAgICAoJ2NvbmZpZ3VyYWJsZScgaW4gZGVzY3JpcHRvciAmJiAhZGVzY3JpcHRvci5jb25maWd1cmFibGUpXG4gICAgICAgICAgICApKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFxuICAgICAgICAgICAgICAgICAgICAnVGhpcyBpbXBsZW1lbnRhdGlvbiBvZiBPYmplY3QuZGVmaW5lUHJvcGVydHkgZG9lcyBub3Qgc3VwcG9ydCBjb25maWd1cmFibGUsIGVudW1lcmFibGUsIG9yIHdyaXRhYmxlLidcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgaWYgKHN1cHBvcnRzQWNjZXNzb3JzICYmIChsb29rdXBHZXR0ZXIob2JqZWN0LCBwcm9wZXJ0eSkgfHwgbG9va3VwU2V0dGVyKG9iamVjdCwgcHJvcGVydHkpKSkge1xuICAgICAgICAgICAgICAgIC8vIEFzIGFjY2Vzc29ycyBhcmUgc3VwcG9ydGVkIG9ubHkgb24gZW5naW5lcyBpbXBsZW1lbnRpbmdcbiAgICAgICAgICAgICAgICAvLyBgX19wcm90b19fYCB3ZSBjYW4gc2FmZWx5IG92ZXJyaWRlIGBfX3Byb3RvX19gIHdoaWxlIGRlZmluaW5nXG4gICAgICAgICAgICAgICAgLy8gYSBwcm9wZXJ0eSB0byBtYWtlIHN1cmUgdGhhdCB3ZSBkb24ndCBoaXQgYW4gaW5oZXJpdGVkXG4gICAgICAgICAgICAgICAgLy8gYWNjZXNzb3IuXG4gICAgICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cbiAgICAgICAgICAgICAgICB2YXIgcHJvdG90eXBlID0gb2JqZWN0Ll9fcHJvdG9fXztcbiAgICAgICAgICAgICAgICBvYmplY3QuX19wcm90b19fID0gcHJvdG90eXBlT2ZPYmplY3Q7XG4gICAgICAgICAgICAgICAgLy8gRGVsZXRpbmcgYSBwcm9wZXJ0eSBhbnl3YXkgc2luY2UgZ2V0dGVyIC8gc2V0dGVyIG1heSBiZVxuICAgICAgICAgICAgICAgIC8vIGRlZmluZWQgb24gb2JqZWN0IGl0c2VsZi5cbiAgICAgICAgICAgICAgICBkZWxldGUgb2JqZWN0W3Byb3BlcnR5XTtcbiAgICAgICAgICAgICAgICBvYmplY3RbcHJvcGVydHldID0gZGVzY3JpcHRvci52YWx1ZTtcbiAgICAgICAgICAgICAgICAvLyBTZXR0aW5nIG9yaWdpbmFsIGBfX3Byb3RvX19gIGJhY2sgbm93LlxuICAgICAgICAgICAgICAgIG9iamVjdC5fX3Byb3RvX18gPSBwcm90b3R5cGU7XG4gICAgICAgICAgICAgICAgLyogZXNsaW50LWVuYWJsZSBuby1wcm90byAqL1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvYmplY3RbcHJvcGVydHldID0gZGVzY3JpcHRvci52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghc3VwcG9ydHNBY2Nlc3NvcnMpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEVSUl9BQ0NFU1NPUlNfTk9UX1NVUFBPUlRFRCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBJZiB3ZSBnb3QgdGhhdCBmYXIgdGhlbiBnZXR0ZXJzIGFuZCBzZXR0ZXJzIGNhbiBiZSBkZWZpbmVkICEhXG4gICAgICAgICAgICBpZiAoJ2dldCcgaW4gZGVzY3JpcHRvcikge1xuICAgICAgICAgICAgICAgIGRlZmluZUdldHRlcihvYmplY3QsIHByb3BlcnR5LCBkZXNjcmlwdG9yLmdldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJ3NldCcgaW4gZGVzY3JpcHRvcikge1xuICAgICAgICAgICAgICAgIGRlZmluZVNldHRlcihvYmplY3QsIHByb3BlcnR5LCBkZXNjcmlwdG9yLnNldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuMi4zLjdcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy43XG5pZiAoIU9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIHx8IGRlZmluZVByb3BlcnRpZXNGYWxsYmFjaykge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhvYmplY3QsIHByb3BlcnRpZXMpIHtcbiAgICAgICAgLy8gbWFrZSBhIHZhbGlhbnQgYXR0ZW1wdCB0byB1c2UgdGhlIHJlYWwgZGVmaW5lUHJvcGVydGllc1xuICAgICAgICBpZiAoZGVmaW5lUHJvcGVydGllc0ZhbGxiYWNrKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWZpbmVQcm9wZXJ0aWVzRmFsbGJhY2suY2FsbChPYmplY3QsIG9iamVjdCwgcHJvcGVydGllcyk7XG4gICAgICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgICAgICAgICAvLyB0cnkgdGhlIHNoaW0gaWYgdGhlIHJlYWwgb25lIGRvZXNuJ3Qgd29ya1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgT2JqZWN0LmtleXMocHJvcGVydGllcykuZm9yRWFjaChmdW5jdGlvbiAocHJvcGVydHkpIHtcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eSAhPT0gJ19fcHJvdG9fXycpIHtcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eSwgcHJvcGVydGllc1twcm9wZXJ0eV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuMi4zLjhcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy44XG5pZiAoIU9iamVjdC5zZWFsKSB7XG4gICAgT2JqZWN0LnNlYWwgPSBmdW5jdGlvbiBzZWFsKG9iamVjdCkge1xuICAgICAgICBpZiAoT2JqZWN0KG9iamVjdCkgIT09IG9iamVjdCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LnNlYWwgY2FuIG9ubHkgYmUgY2FsbGVkIG9uIE9iamVjdHMuJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gdGhpcyBpcyBtaXNsZWFkaW5nIGFuZCBicmVha3MgZmVhdHVyZS1kZXRlY3Rpb24sIGJ1dFxuICAgICAgICAvLyBhbGxvd3MgXCJzZWN1cmFibGVcIiBjb2RlIHRvIFwiZ3JhY2VmdWxseVwiIGRlZ3JhZGUgdG8gd29ya2luZ1xuICAgICAgICAvLyBidXQgaW5zZWN1cmUgY29kZS5cbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuMi4zLjlcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy45XG5pZiAoIU9iamVjdC5mcmVlemUpIHtcbiAgICBPYmplY3QuZnJlZXplID0gZnVuY3Rpb24gZnJlZXplKG9iamVjdCkge1xuICAgICAgICBpZiAoT2JqZWN0KG9iamVjdCkgIT09IG9iamVjdCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmZyZWV6ZSBjYW4gb25seSBiZSBjYWxsZWQgb24gT2JqZWN0cy4nKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0aGlzIGlzIG1pc2xlYWRpbmcgYW5kIGJyZWFrcyBmZWF0dXJlLWRldGVjdGlvbiwgYnV0XG4gICAgICAgIC8vIGFsbG93cyBcInNlY3VyYWJsZVwiIGNvZGUgdG8gXCJncmFjZWZ1bGx5XCIgZGVncmFkZSB0byB3b3JraW5nXG4gICAgICAgIC8vIGJ1dCBpbnNlY3VyZSBjb2RlLlxuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH07XG59XG5cbi8vIGRldGVjdCBhIFJoaW5vIGJ1ZyBhbmQgcGF0Y2ggaXRcbnRyeSB7XG4gICAgT2JqZWN0LmZyZWV6ZShmdW5jdGlvbiAoKSB7fSk7XG59IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICBPYmplY3QuZnJlZXplID0gKGZ1bmN0aW9uIChmcmVlemVPYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGZyZWV6ZShvYmplY3QpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZyZWV6ZU9iamVjdChvYmplY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0oT2JqZWN0LmZyZWV6ZSkpO1xufVxuXG4vLyBFUzUgMTUuMi4zLjEwXG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuMTBcbmlmICghT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKSB7XG4gICAgT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zID0gZnVuY3Rpb24gcHJldmVudEV4dGVuc2lvbnMob2JqZWN0KSB7XG4gICAgICAgIGlmIChPYmplY3Qob2JqZWN0KSAhPT0gb2JqZWN0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QucHJldmVudEV4dGVuc2lvbnMgY2FuIG9ubHkgYmUgY2FsbGVkIG9uIE9iamVjdHMuJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gdGhpcyBpcyBtaXNsZWFkaW5nIGFuZCBicmVha3MgZmVhdHVyZS1kZXRlY3Rpb24sIGJ1dFxuICAgICAgICAvLyBhbGxvd3MgXCJzZWN1cmFibGVcIiBjb2RlIHRvIFwiZ3JhY2VmdWxseVwiIGRlZ3JhZGUgdG8gd29ya2luZ1xuICAgICAgICAvLyBidXQgaW5zZWN1cmUgY29kZS5cbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuMi4zLjExXG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuMTFcbmlmICghT2JqZWN0LmlzU2VhbGVkKSB7XG4gICAgT2JqZWN0LmlzU2VhbGVkID0gZnVuY3Rpb24gaXNTZWFsZWQob2JqZWN0KSB7XG4gICAgICAgIGlmIChPYmplY3Qob2JqZWN0KSAhPT0gb2JqZWN0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuaXNTZWFsZWQgY2FuIG9ubHkgYmUgY2FsbGVkIG9uIE9iamVjdHMuJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS4yLjMuMTJcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy4xMlxuaWYgKCFPYmplY3QuaXNGcm96ZW4pIHtcbiAgICBPYmplY3QuaXNGcm96ZW4gPSBmdW5jdGlvbiBpc0Zyb3plbihvYmplY3QpIHtcbiAgICAgICAgaWYgKE9iamVjdChvYmplY3QpICE9PSBvYmplY3QpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5pc0Zyb3plbiBjYW4gb25seSBiZSBjYWxsZWQgb24gT2JqZWN0cy4nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjIuMy4xM1xuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjEzXG5pZiAoIU9iamVjdC5pc0V4dGVuc2libGUpIHtcbiAgICBPYmplY3QuaXNFeHRlbnNpYmxlID0gZnVuY3Rpb24gaXNFeHRlbnNpYmxlKG9iamVjdCkge1xuICAgICAgICAvLyAxLiBJZiBUeXBlKE8pIGlzIG5vdCBPYmplY3QgdGhyb3cgYSBUeXBlRXJyb3IgZXhjZXB0aW9uLlxuICAgICAgICBpZiAoT2JqZWN0KG9iamVjdCkgIT09IG9iamVjdCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmlzRXh0ZW5zaWJsZSBjYW4gb25seSBiZSBjYWxsZWQgb24gT2JqZWN0cy4nKTtcbiAgICAgICAgfVxuICAgICAgICAvLyAyLiBSZXR1cm4gdGhlIEJvb2xlYW4gdmFsdWUgb2YgdGhlIFtbRXh0ZW5zaWJsZV1dIGludGVybmFsIHByb3BlcnR5IG9mIE8uXG4gICAgICAgIHZhciBuYW1lID0gJyc7XG4gICAgICAgIHdoaWxlIChvd25zKG9iamVjdCwgbmFtZSkpIHtcbiAgICAgICAgICAgIG5hbWUgKz0gJz8nO1xuICAgICAgICB9XG4gICAgICAgIG9iamVjdFtuYW1lXSA9IHRydWU7XG4gICAgICAgIHZhciByZXR1cm5WYWx1ZSA9IG93bnMob2JqZWN0LCBuYW1lKTtcbiAgICAgICAgZGVsZXRlIG9iamVjdFtuYW1lXTtcbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICAgIH07XG59XG5cbn0pKTtcbiIsIi8qIVxuICogaHR0cHM6Ly9naXRodWIuY29tL2VzLXNoaW1zL2VzNS1zaGltXG4gKiBAbGljZW5zZSBlczUtc2hpbSBDb3B5cmlnaHQgMjAwOS0yMDE1IGJ5IGNvbnRyaWJ1dG9ycywgTUlUIExpY2Vuc2VcbiAqIHNlZSBodHRwczovL2dpdGh1Yi5jb20vZXMtc2hpbXMvZXM1LXNoaW0vYmxvYi9tYXN0ZXIvTElDRU5TRVxuICovXG5cbi8vIHZpbTogdHM9NCBzdHM9NCBzdz00IGV4cGFuZHRhYlxuXG4vLyBBZGQgc2VtaWNvbG9uIHRvIHByZXZlbnQgSUlGRSBmcm9tIGJlaW5nIHBhc3NlZCBhcyBhcmd1bWVudCB0byBjb25jYXRlbmF0ZWQgY29kZS5cbjtcblxuLy8gVU1EIChVbml2ZXJzYWwgTW9kdWxlIERlZmluaXRpb24pXG4vLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3VtZGpzL3VtZC9ibG9iL21hc3Rlci9yZXR1cm5FeHBvcnRzLmpzXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvKiBnbG9iYWwgZGVmaW5lLCBleHBvcnRzLCBtb2R1bGUgKi9cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICAgICAgZGVmaW5lKGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIC8vIE5vZGUuIERvZXMgbm90IHdvcmsgd2l0aCBzdHJpY3QgQ29tbW9uSlMsIGJ1dFxuICAgICAgICAvLyBvbmx5IENvbW1vbkpTLWxpa2UgZW52aXJvbWVudHMgdGhhdCBzdXBwb3J0IG1vZHVsZS5leHBvcnRzLFxuICAgICAgICAvLyBsaWtlIE5vZGUuXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXG4gICAgICAgIHJvb3QucmV0dXJuRXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcblxuLyoqXG4gKiBCcmluZ3MgYW4gZW52aXJvbm1lbnQgYXMgY2xvc2UgdG8gRUNNQVNjcmlwdCA1IGNvbXBsaWFuY2VcbiAqIGFzIGlzIHBvc3NpYmxlIHdpdGggdGhlIGZhY2lsaXRpZXMgb2YgZXJzdHdoaWxlIGVuZ2luZXMuXG4gKlxuICogQW5ub3RhdGVkIEVTNTogaHR0cDovL2VzNS5naXRodWIuY29tLyAoc3BlY2lmaWMgbGlua3MgYmVsb3cpXG4gKiBFUzUgU3BlYzogaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL3B1YmxpY2F0aW9ucy9maWxlcy9FQ01BLVNUL0VjbWEtMjYyLnBkZlxuICogUmVxdWlyZWQgcmVhZGluZzogaHR0cDovL2phdmFzY3JpcHR3ZWJsb2cud29yZHByZXNzLmNvbS8yMDExLzEyLzA1L2V4dGVuZGluZy1qYXZhc2NyaXB0LW5hdGl2ZXMvXG4gKi9cblxuLy8gU2hvcnRjdXQgdG8gYW4gb2Z0ZW4gYWNjZXNzZWQgcHJvcGVydGllcywgaW4gb3JkZXIgdG8gYXZvaWQgbXVsdGlwbGVcbi8vIGRlcmVmZXJlbmNlIHRoYXQgY29zdHMgdW5pdmVyc2FsbHkuXG52YXIgQXJyYXlQcm90b3R5cGUgPSBBcnJheS5wcm90b3R5cGU7XG52YXIgT2JqZWN0UHJvdG90eXBlID0gT2JqZWN0LnByb3RvdHlwZTtcbnZhciBGdW5jdGlvblByb3RvdHlwZSA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcbnZhciBTdHJpbmdQcm90b3R5cGUgPSBTdHJpbmcucHJvdG90eXBlO1xudmFyIE51bWJlclByb3RvdHlwZSA9IE51bWJlci5wcm90b3R5cGU7XG52YXIgYXJyYXlfc2xpY2UgPSBBcnJheVByb3RvdHlwZS5zbGljZTtcbnZhciBhcnJheV9zcGxpY2UgPSBBcnJheVByb3RvdHlwZS5zcGxpY2U7XG52YXIgYXJyYXlfcHVzaCA9IEFycmF5UHJvdG90eXBlLnB1c2g7XG52YXIgYXJyYXlfdW5zaGlmdCA9IEFycmF5UHJvdG90eXBlLnVuc2hpZnQ7XG52YXIgYXJyYXlfY29uY2F0ID0gQXJyYXlQcm90b3R5cGUuY29uY2F0O1xudmFyIGNhbGwgPSBGdW5jdGlvblByb3RvdHlwZS5jYWxsO1xuXG4vLyBIYXZpbmcgYSB0b1N0cmluZyBsb2NhbCB2YXJpYWJsZSBuYW1lIGJyZWFrcyBpbiBPcGVyYSBzbyB1c2UgdG9fc3RyaW5nLlxudmFyIHRvX3N0cmluZyA9IE9iamVjdFByb3RvdHlwZS50b1N0cmluZztcblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIGlzQXJyYXkob2JqKSB7XG4gICAgcmV0dXJuIHRvX3N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuXG52YXIgaGFzVG9TdHJpbmdUYWcgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnO1xudmFyIGlzQ2FsbGFibGU7IC8qIGlubGluZWQgZnJvbSBodHRwczovL25wbWpzLmNvbS9pcy1jYWxsYWJsZSAqLyB2YXIgZm5Ub1N0ciA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZywgdHJ5RnVuY3Rpb25PYmplY3QgPSBmdW5jdGlvbiB0cnlGdW5jdGlvbk9iamVjdCh2YWx1ZSkgeyB0cnkgeyBmblRvU3RyLmNhbGwodmFsdWUpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfSwgZm5DbGFzcyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsIGdlbkNsYXNzID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJzsgaXNDYWxsYWJsZSA9IGZ1bmN0aW9uIGlzQ2FsbGFibGUodmFsdWUpIHsgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ2Z1bmN0aW9uJykgeyByZXR1cm4gZmFsc2U7IH0gaWYgKGhhc1RvU3RyaW5nVGFnKSB7IHJldHVybiB0cnlGdW5jdGlvbk9iamVjdCh2YWx1ZSk7IH0gdmFyIHN0ckNsYXNzID0gdG9fc3RyaW5nLmNhbGwodmFsdWUpOyByZXR1cm4gc3RyQ2xhc3MgPT09IGZuQ2xhc3MgfHwgc3RyQ2xhc3MgPT09IGdlbkNsYXNzOyB9O1xudmFyIGlzUmVnZXg7IC8qIGlubGluZWQgZnJvbSBodHRwczovL25wbWpzLmNvbS9pcy1yZWdleCAqLyB2YXIgcmVnZXhFeGVjID0gUmVnRXhwLnByb3RvdHlwZS5leGVjLCB0cnlSZWdleEV4ZWMgPSBmdW5jdGlvbiB0cnlSZWdleEV4ZWModmFsdWUpIHsgdHJ5IHsgcmVnZXhFeGVjLmNhbGwodmFsdWUpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfSwgcmVnZXhDbGFzcyA9ICdbb2JqZWN0IFJlZ0V4cF0nOyBpc1JlZ2V4ID0gZnVuY3Rpb24gaXNSZWdleCh2YWx1ZSkgeyBpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JykgeyByZXR1cm4gZmFsc2U7IH0gcmV0dXJuIGhhc1RvU3RyaW5nVGFnID8gdHJ5UmVnZXhFeGVjKHZhbHVlKSA6IHRvX3N0cmluZy5jYWxsKHZhbHVlKSA9PT0gcmVnZXhDbGFzczsgfTtcbnZhciBpc1N0cmluZzsgLyogaW5saW5lZCBmcm9tIGh0dHBzOi8vbnBtanMuY29tL2lzLXN0cmluZyAqLyB2YXIgc3RyVmFsdWUgPSBTdHJpbmcucHJvdG90eXBlLnZhbHVlT2YsIHRyeVN0cmluZ09iamVjdCA9IGZ1bmN0aW9uIHRyeVN0cmluZ09iamVjdCh2YWx1ZSkgeyB0cnkgeyBzdHJWYWx1ZS5jYWxsKHZhbHVlKTsgcmV0dXJuIHRydWU7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9IH0sIHN0cmluZ0NsYXNzID0gJ1tvYmplY3QgU3RyaW5nXSc7IGlzU3RyaW5nID0gZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHsgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHsgcmV0dXJuIHRydWU7IH0gaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpIHsgcmV0dXJuIGZhbHNlOyB9IHJldHVybiBoYXNUb1N0cmluZ1RhZyA/IHRyeVN0cmluZ09iamVjdCh2YWx1ZSkgOiB0b19zdHJpbmcuY2FsbCh2YWx1ZSkgPT09IHN0cmluZ0NsYXNzOyB9O1xuXG52YXIgaXNBcmd1bWVudHMgPSBmdW5jdGlvbiBpc0FyZ3VtZW50cyh2YWx1ZSkge1xuICAgIHZhciBzdHIgPSB0b19zdHJpbmcuY2FsbCh2YWx1ZSk7XG4gICAgdmFyIGlzQXJncyA9IHN0ciA9PT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG4gICAgaWYgKCFpc0FyZ3MpIHtcbiAgICAgICAgaXNBcmdzID0gIWlzQXJyYXkodmFsdWUpICYmXG4gICAgICAgICAgdmFsdWUgIT09IG51bGwgJiZcbiAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgdHlwZW9mIHZhbHVlLmxlbmd0aCA9PT0gJ251bWJlcicgJiZcbiAgICAgICAgICB2YWx1ZS5sZW5ndGggPj0gMCAmJlxuICAgICAgICAgIGlzQ2FsbGFibGUodmFsdWUuY2FsbGVlKTtcbiAgICB9XG4gICAgcmV0dXJuIGlzQXJncztcbn07XG5cbi8qIGlubGluZWQgZnJvbSBodHRwOi8vbnBtanMuY29tL2RlZmluZS1wcm9wZXJ0aWVzICovXG52YXIgZGVmaW5lUHJvcGVydGllcyA9IChmdW5jdGlvbiAoaGFzKSB7XG4gIHZhciBzdXBwb3J0c0Rlc2NyaXB0b3JzID0gT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIChmdW5jdGlvbiAoKSB7XG4gICAgICB0cnkge1xuICAgICAgICAgIHZhciBvYmogPSB7fTtcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCAneCcsIHsgZW51bWVyYWJsZTogZmFsc2UsIHZhbHVlOiBvYmogfSk7XG4gICAgICAgICAgZm9yICh2YXIgXyBpbiBvYmopIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICAgICAgcmV0dXJuIG9iai54ID09PSBvYmo7XG4gICAgICB9IGNhdGNoIChlKSB7IC8qIHRoaXMgaXMgRVMzICovXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICB9KCkpO1xuXG4gIC8vIERlZmluZSBjb25maWd1cmFibGUsIHdyaXRhYmxlIGFuZCBub24tZW51bWVyYWJsZSBwcm9wc1xuICAvLyBpZiB0aGV5IGRvbid0IGV4aXN0LlxuICB2YXIgZGVmaW5lUHJvcGVydHk7XG4gIGlmIChzdXBwb3J0c0Rlc2NyaXB0b3JzKSB7XG4gICAgICBkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIChvYmplY3QsIG5hbWUsIG1ldGhvZCwgZm9yY2VBc3NpZ24pIHtcbiAgICAgICAgICBpZiAoIWZvcmNlQXNzaWduICYmIChuYW1lIGluIG9iamVjdCkpIHsgcmV0dXJuOyB9XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwge1xuICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgdmFsdWU6IG1ldGhvZFxuICAgICAgICAgIH0pO1xuICAgICAgfTtcbiAgfSBlbHNlIHtcbiAgICAgIGRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZSwgbWV0aG9kLCBmb3JjZUFzc2lnbikge1xuICAgICAgICAgIGlmICghZm9yY2VBc3NpZ24gJiYgKG5hbWUgaW4gb2JqZWN0KSkgeyByZXR1cm47IH1cbiAgICAgICAgICBvYmplY3RbbmFtZV0gPSBtZXRob2Q7XG4gICAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKG9iamVjdCwgbWFwLCBmb3JjZUFzc2lnbikge1xuICAgICAgZm9yICh2YXIgbmFtZSBpbiBtYXApIHtcbiAgICAgICAgICBpZiAoaGFzLmNhbGwobWFwLCBuYW1lKSkge1xuICAgICAgICAgICAgZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCBtYXBbbmFtZV0sIGZvcmNlQXNzaWduKTtcbiAgICAgICAgICB9XG4gICAgICB9XG4gIH07XG59KE9iamVjdFByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSkpO1xuXG4vL1xuLy8gVXRpbFxuLy8gPT09PT09XG4vL1xuXG4vKiByZXBsYWNlYWJsZSB3aXRoIGh0dHBzOi8vbnBtanMuY29tL3BhY2thZ2UvZXMtYWJzdHJhY3QgL2hlbHBlcnMvaXNQcmltaXRpdmUgKi9cbnZhciBpc1ByaW1pdGl2ZSA9IGZ1bmN0aW9uIGlzUHJpbWl0aXZlKGlucHV0KSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgaW5wdXQ7XG4gICAgcmV0dXJuIGlucHV0ID09PSBudWxsIHx8ICh0eXBlICE9PSAnb2JqZWN0JyAmJiB0eXBlICE9PSAnZnVuY3Rpb24nKTtcbn07XG5cbnZhciBFUyA9IHtcbiAgICAvLyBFUzUgOS40XG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4OS40XG4gICAgLy8gaHR0cDovL2pzcGVyZi5jb20vdG8taW50ZWdlclxuICAgIC8qIHJlcGxhY2VhYmxlIHdpdGggaHR0cHM6Ly9ucG1qcy5jb20vcGFja2FnZS9lcy1hYnN0cmFjdCBFUzUuVG9JbnRlZ2VyICovXG4gICAgVG9JbnRlZ2VyOiBmdW5jdGlvbiBUb0ludGVnZXIobnVtKSB7XG4gICAgICAgIHZhciBuID0gK251bTtcbiAgICAgICAgaWYgKG4gIT09IG4pIHsgLy8gaXNOYU5cbiAgICAgICAgICAgIG4gPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKG4gIT09IDAgJiYgbiAhPT0gKDEgLyAwKSAmJiBuICE9PSAtKDEgLyAwKSkge1xuICAgICAgICAgICAgbiA9IChuID4gMCB8fCAtMSkgKiBNYXRoLmZsb29yKE1hdGguYWJzKG4pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbjtcbiAgICB9LFxuXG4gICAgLyogcmVwbGFjZWFibGUgd2l0aCBodHRwczovL25wbWpzLmNvbS9wYWNrYWdlL2VzLWFic3RyYWN0IEVTNS5Ub1ByaW1pdGl2ZSAqL1xuICAgIFRvUHJpbWl0aXZlOiBmdW5jdGlvbiBUb1ByaW1pdGl2ZShpbnB1dCkge1xuICAgICAgICB2YXIgdmFsLCB2YWx1ZU9mLCB0b1N0cjtcbiAgICAgICAgaWYgKGlzUHJpbWl0aXZlKGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICB9XG4gICAgICAgIHZhbHVlT2YgPSBpbnB1dC52YWx1ZU9mO1xuICAgICAgICBpZiAoaXNDYWxsYWJsZSh2YWx1ZU9mKSkge1xuICAgICAgICAgICAgdmFsID0gdmFsdWVPZi5jYWxsKGlucHV0KTtcbiAgICAgICAgICAgIGlmIChpc1ByaW1pdGl2ZSh2YWwpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0b1N0ciA9IGlucHV0LnRvU3RyaW5nO1xuICAgICAgICBpZiAoaXNDYWxsYWJsZSh0b1N0cikpIHtcbiAgICAgICAgICAgIHZhbCA9IHRvU3RyLmNhbGwoaW5wdXQpO1xuICAgICAgICAgICAgaWYgKGlzUHJpbWl0aXZlKHZhbCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICB9LFxuXG4gICAgLy8gRVM1IDkuOVxuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDkuOVxuICAgIC8qIHJlcGxhY2VhYmxlIHdpdGggaHR0cHM6Ly9ucG1qcy5jb20vcGFja2FnZS9lcy1hYnN0cmFjdCBFUzUuVG9PYmplY3QgKi9cbiAgICBUb09iamVjdDogZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgLyoganNoaW50IGVxbnVsbDogdHJ1ZSAqL1xuICAgICAgICBpZiAobyA9PSBudWxsKSB7IC8vIHRoaXMgbWF0Y2hlcyBib3RoIG51bGwgYW5kIHVuZGVmaW5lZFxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImNhbid0IGNvbnZlcnQgXCIgKyBvICsgJyB0byBvYmplY3QnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gT2JqZWN0KG8pO1xuICAgIH0sXG5cbiAgICAvKiByZXBsYWNlYWJsZSB3aXRoIGh0dHBzOi8vbnBtanMuY29tL3BhY2thZ2UvZXMtYWJzdHJhY3QgRVM1LlRvVWludDMyICovXG4gICAgVG9VaW50MzI6IGZ1bmN0aW9uIFRvVWludDMyKHgpIHtcbiAgICAgICAgcmV0dXJuIHggPj4+IDA7XG4gICAgfVxufTtcblxuLy9cbi8vIEZ1bmN0aW9uXG4vLyA9PT09PT09PVxuLy9cblxuLy8gRVMtNSAxNS4zLjQuNVxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMy40LjVcblxudmFyIEVtcHR5ID0gZnVuY3Rpb24gRW1wdHkoKSB7fTtcblxuZGVmaW5lUHJvcGVydGllcyhGdW5jdGlvblByb3RvdHlwZSwge1xuICAgIGJpbmQ6IGZ1bmN0aW9uIGJpbmQodGhhdCkgeyAvLyAubGVuZ3RoIGlzIDFcbiAgICAgICAgLy8gMS4gTGV0IFRhcmdldCBiZSB0aGUgdGhpcyB2YWx1ZS5cbiAgICAgICAgdmFyIHRhcmdldCA9IHRoaXM7XG4gICAgICAgIC8vIDIuIElmIElzQ2FsbGFibGUoVGFyZ2V0KSBpcyBmYWxzZSwgdGhyb3cgYSBUeXBlRXJyb3IgZXhjZXB0aW9uLlxuICAgICAgICBpZiAoIWlzQ2FsbGFibGUodGFyZ2V0KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgY2FsbGVkIG9uIGluY29tcGF0aWJsZSAnICsgdGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgICAvLyAzLiBMZXQgQSBiZSBhIG5ldyAocG9zc2libHkgZW1wdHkpIGludGVybmFsIGxpc3Qgb2YgYWxsIG9mIHRoZVxuICAgICAgICAvLyAgIGFyZ3VtZW50IHZhbHVlcyBwcm92aWRlZCBhZnRlciB0aGlzQXJnIChhcmcxLCBhcmcyIGV0YyksIGluIG9yZGVyLlxuICAgICAgICAvLyBYWFggc2xpY2VkQXJncyB3aWxsIHN0YW5kIGluIGZvciBcIkFcIiBpZiB1c2VkXG4gICAgICAgIHZhciBhcmdzID0gYXJyYXlfc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpOyAvLyBmb3Igbm9ybWFsIGNhbGxcbiAgICAgICAgLy8gNC4gTGV0IEYgYmUgYSBuZXcgbmF0aXZlIEVDTUFTY3JpcHQgb2JqZWN0LlxuICAgICAgICAvLyAxMS4gU2V0IHRoZSBbW1Byb3RvdHlwZV1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgdG8gdGhlIHN0YW5kYXJkXG4gICAgICAgIC8vICAgYnVpbHQtaW4gRnVuY3Rpb24gcHJvdG90eXBlIG9iamVjdCBhcyBzcGVjaWZpZWQgaW4gMTUuMy4zLjEuXG4gICAgICAgIC8vIDEyLiBTZXQgdGhlIFtbQ2FsbF1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgYXMgZGVzY3JpYmVkIGluXG4gICAgICAgIC8vICAgMTUuMy40LjUuMS5cbiAgICAgICAgLy8gMTMuIFNldCB0aGUgW1tDb25zdHJ1Y3RdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIGFzIGRlc2NyaWJlZCBpblxuICAgICAgICAvLyAgIDE1LjMuNC41LjIuXG4gICAgICAgIC8vIDE0LiBTZXQgdGhlIFtbSGFzSW5zdGFuY2VdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIGFzIGRlc2NyaWJlZCBpblxuICAgICAgICAvLyAgIDE1LjMuNC41LjMuXG4gICAgICAgIHZhciBib3VuZDtcbiAgICAgICAgdmFyIGJpbmRlciA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBib3VuZCkge1xuICAgICAgICAgICAgICAgIC8vIDE1LjMuNC41LjIgW1tDb25zdHJ1Y3RdXVxuICAgICAgICAgICAgICAgIC8vIFdoZW4gdGhlIFtbQ29uc3RydWN0XV0gaW50ZXJuYWwgbWV0aG9kIG9mIGEgZnVuY3Rpb24gb2JqZWN0LFxuICAgICAgICAgICAgICAgIC8vIEYgdGhhdCB3YXMgY3JlYXRlZCB1c2luZyB0aGUgYmluZCBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCBhXG4gICAgICAgICAgICAgICAgLy8gbGlzdCBvZiBhcmd1bWVudHMgRXh0cmFBcmdzLCB0aGUgZm9sbG93aW5nIHN0ZXBzIGFyZSB0YWtlbjpcbiAgICAgICAgICAgICAgICAvLyAxLiBMZXQgdGFyZ2V0IGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tUYXJnZXRGdW5jdGlvbl1dXG4gICAgICAgICAgICAgICAgLy8gICBpbnRlcm5hbCBwcm9wZXJ0eS5cbiAgICAgICAgICAgICAgICAvLyAyLiBJZiB0YXJnZXQgaGFzIG5vIFtbQ29uc3RydWN0XV0gaW50ZXJuYWwgbWV0aG9kLCBhXG4gICAgICAgICAgICAgICAgLy8gICBUeXBlRXJyb3IgZXhjZXB0aW9uIGlzIHRocm93bi5cbiAgICAgICAgICAgICAgICAvLyAzLiBMZXQgYm91bmRBcmdzIGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tCb3VuZEFyZ3NdXSBpbnRlcm5hbFxuICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXG4gICAgICAgICAgICAgICAgLy8gNC4gTGV0IGFyZ3MgYmUgYSBuZXcgbGlzdCBjb250YWluaW5nIHRoZSBzYW1lIHZhbHVlcyBhcyB0aGVcbiAgICAgICAgICAgICAgICAvLyAgIGxpc3QgYm91bmRBcmdzIGluIHRoZSBzYW1lIG9yZGVyIGZvbGxvd2VkIGJ5IHRoZSBzYW1lXG4gICAgICAgICAgICAgICAgLy8gICB2YWx1ZXMgYXMgdGhlIGxpc3QgRXh0cmFBcmdzIGluIHRoZSBzYW1lIG9yZGVyLlxuICAgICAgICAgICAgICAgIC8vIDUuIFJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbQ29uc3RydWN0XV0gaW50ZXJuYWxcbiAgICAgICAgICAgICAgICAvLyAgIG1ldGhvZCBvZiB0YXJnZXQgcHJvdmlkaW5nIGFyZ3MgYXMgdGhlIGFyZ3VtZW50cy5cblxuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSB0YXJnZXQuYXBwbHkoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAgICAgICAgIGFycmF5X2NvbmNhdC5jYWxsKGFyZ3MsIGFycmF5X3NsaWNlLmNhbGwoYXJndW1lbnRzKSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGlmIChPYmplY3QocmVzdWx0KSA9PT0gcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIDE1LjMuNC41LjEgW1tDYWxsXV1cbiAgICAgICAgICAgICAgICAvLyBXaGVuIHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBtZXRob2Qgb2YgYSBmdW5jdGlvbiBvYmplY3QsIEYsXG4gICAgICAgICAgICAgICAgLy8gd2hpY2ggd2FzIGNyZWF0ZWQgdXNpbmcgdGhlIGJpbmQgZnVuY3Rpb24gaXMgY2FsbGVkIHdpdGggYVxuICAgICAgICAgICAgICAgIC8vIHRoaXMgdmFsdWUgYW5kIGEgbGlzdCBvZiBhcmd1bWVudHMgRXh0cmFBcmdzLCB0aGUgZm9sbG93aW5nXG4gICAgICAgICAgICAgICAgLy8gc3RlcHMgYXJlIHRha2VuOlxuICAgICAgICAgICAgICAgIC8vIDEuIExldCBib3VuZEFyZ3MgYmUgdGhlIHZhbHVlIG9mIEYncyBbW0JvdW5kQXJnc11dIGludGVybmFsXG4gICAgICAgICAgICAgICAgLy8gICBwcm9wZXJ0eS5cbiAgICAgICAgICAgICAgICAvLyAyLiBMZXQgYm91bmRUaGlzIGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tCb3VuZFRoaXNdXSBpbnRlcm5hbFxuICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXG4gICAgICAgICAgICAgICAgLy8gMy4gTGV0IHRhcmdldCBiZSB0aGUgdmFsdWUgb2YgRidzIFtbVGFyZ2V0RnVuY3Rpb25dXSBpbnRlcm5hbFxuICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXG4gICAgICAgICAgICAgICAgLy8gNC4gTGV0IGFyZ3MgYmUgYSBuZXcgbGlzdCBjb250YWluaW5nIHRoZSBzYW1lIHZhbHVlcyBhcyB0aGVcbiAgICAgICAgICAgICAgICAvLyAgIGxpc3QgYm91bmRBcmdzIGluIHRoZSBzYW1lIG9yZGVyIGZvbGxvd2VkIGJ5IHRoZSBzYW1lXG4gICAgICAgICAgICAgICAgLy8gICB2YWx1ZXMgYXMgdGhlIGxpc3QgRXh0cmFBcmdzIGluIHRoZSBzYW1lIG9yZGVyLlxuICAgICAgICAgICAgICAgIC8vIDUuIFJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbQ2FsbF1dIGludGVybmFsIG1ldGhvZFxuICAgICAgICAgICAgICAgIC8vICAgb2YgdGFyZ2V0IHByb3ZpZGluZyBib3VuZFRoaXMgYXMgdGhlIHRoaXMgdmFsdWUgYW5kXG4gICAgICAgICAgICAgICAgLy8gICBwcm92aWRpbmcgYXJncyBhcyB0aGUgYXJndW1lbnRzLlxuXG4gICAgICAgICAgICAgICAgLy8gZXF1aXY6IHRhcmdldC5jYWxsKHRoaXMsIC4uLmJvdW5kQXJncywgLi4uYXJncylcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0LmFwcGx5KFxuICAgICAgICAgICAgICAgICAgICB0aGF0LFxuICAgICAgICAgICAgICAgICAgICBhcnJheV9jb25jYXQuY2FsbChhcmdzLCBhcnJheV9zbGljZS5jYWxsKGFyZ3VtZW50cykpXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gMTUuIElmIHRoZSBbW0NsYXNzXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgVGFyZ2V0IGlzIFwiRnVuY3Rpb25cIiwgdGhlblxuICAgICAgICAvLyAgICAgYS4gTGV0IEwgYmUgdGhlIGxlbmd0aCBwcm9wZXJ0eSBvZiBUYXJnZXQgbWludXMgdGhlIGxlbmd0aCBvZiBBLlxuICAgICAgICAvLyAgICAgYi4gU2V0IHRoZSBsZW5ndGggb3duIHByb3BlcnR5IG9mIEYgdG8gZWl0aGVyIDAgb3IgTCwgd2hpY2hldmVyIGlzXG4gICAgICAgIC8vICAgICAgIGxhcmdlci5cbiAgICAgICAgLy8gMTYuIEVsc2Ugc2V0IHRoZSBsZW5ndGggb3duIHByb3BlcnR5IG9mIEYgdG8gMC5cblxuICAgICAgICB2YXIgYm91bmRMZW5ndGggPSBNYXRoLm1heCgwLCB0YXJnZXQubGVuZ3RoIC0gYXJncy5sZW5ndGgpO1xuXG4gICAgICAgIC8vIDE3LiBTZXQgdGhlIGF0dHJpYnV0ZXMgb2YgdGhlIGxlbmd0aCBvd24gcHJvcGVydHkgb2YgRiB0byB0aGUgdmFsdWVzXG4gICAgICAgIC8vICAgc3BlY2lmaWVkIGluIDE1LjMuNS4xLlxuICAgICAgICB2YXIgYm91bmRBcmdzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYm91bmRMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYm91bmRBcmdzLnB1c2goJyQnICsgaSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBYWFggQnVpbGQgYSBkeW5hbWljIGZ1bmN0aW9uIHdpdGggZGVzaXJlZCBhbW91bnQgb2YgYXJndW1lbnRzIGlzIHRoZSBvbmx5XG4gICAgICAgIC8vIHdheSB0byBzZXQgdGhlIGxlbmd0aCBwcm9wZXJ0eSBvZiBhIGZ1bmN0aW9uLlxuICAgICAgICAvLyBJbiBlbnZpcm9ubWVudHMgd2hlcmUgQ29udGVudCBTZWN1cml0eSBQb2xpY2llcyBlbmFibGVkIChDaHJvbWUgZXh0ZW5zaW9ucyxcbiAgICAgICAgLy8gZm9yIGV4LikgYWxsIHVzZSBvZiBldmFsIG9yIEZ1bmN0aW9uIGNvc3RydWN0b3IgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbiAgICAgICAgLy8gSG93ZXZlciBpbiBhbGwgb2YgdGhlc2UgZW52aXJvbm1lbnRzIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kIGV4aXN0c1xuICAgICAgICAvLyBhbmQgc28gdGhpcyBjb2RlIHdpbGwgbmV2ZXIgYmUgZXhlY3V0ZWQuXG4gICAgICAgIGJvdW5kID0gRnVuY3Rpb24oJ2JpbmRlcicsICdyZXR1cm4gZnVuY3Rpb24gKCcgKyBib3VuZEFyZ3Muam9pbignLCcpICsgJyl7IHJldHVybiBiaW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfScpKGJpbmRlcik7XG5cbiAgICAgICAgaWYgKHRhcmdldC5wcm90b3R5cGUpIHtcbiAgICAgICAgICAgIEVtcHR5LnByb3RvdHlwZSA9IHRhcmdldC5wcm90b3R5cGU7XG4gICAgICAgICAgICBib3VuZC5wcm90b3R5cGUgPSBuZXcgRW1wdHkoKTtcbiAgICAgICAgICAgIC8vIENsZWFuIHVwIGRhbmdsaW5nIHJlZmVyZW5jZXMuXG4gICAgICAgICAgICBFbXB0eS5wcm90b3R5cGUgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVE9ET1xuICAgICAgICAvLyAxOC4gU2V0IHRoZSBbW0V4dGVuc2libGVdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIHRvIHRydWUuXG5cbiAgICAgICAgLy8gVE9ET1xuICAgICAgICAvLyAxOS4gTGV0IHRocm93ZXIgYmUgdGhlIFtbVGhyb3dUeXBlRXJyb3JdXSBmdW5jdGlvbiBPYmplY3QgKDEzLjIuMykuXG4gICAgICAgIC8vIDIwLiBDYWxsIHRoZSBbW0RlZmluZU93blByb3BlcnR5XV0gaW50ZXJuYWwgbWV0aG9kIG9mIEYgd2l0aFxuICAgICAgICAvLyAgIGFyZ3VtZW50cyBcImNhbGxlclwiLCBQcm9wZXJ0eURlc2NyaXB0b3Ige1tbR2V0XV06IHRocm93ZXIsIFtbU2V0XV06XG4gICAgICAgIC8vICAgdGhyb3dlciwgW1tFbnVtZXJhYmxlXV06IGZhbHNlLCBbW0NvbmZpZ3VyYWJsZV1dOiBmYWxzZX0sIGFuZFxuICAgICAgICAvLyAgIGZhbHNlLlxuICAgICAgICAvLyAyMS4gQ2FsbCB0aGUgW1tEZWZpbmVPd25Qcm9wZXJ0eV1dIGludGVybmFsIG1ldGhvZCBvZiBGIHdpdGhcbiAgICAgICAgLy8gICBhcmd1bWVudHMgXCJhcmd1bWVudHNcIiwgUHJvcGVydHlEZXNjcmlwdG9yIHtbW0dldF1dOiB0aHJvd2VyLFxuICAgICAgICAvLyAgIFtbU2V0XV06IHRocm93ZXIsIFtbRW51bWVyYWJsZV1dOiBmYWxzZSwgW1tDb25maWd1cmFibGVdXTogZmFsc2V9LFxuICAgICAgICAvLyAgIGFuZCBmYWxzZS5cblxuICAgICAgICAvLyBUT0RPXG4gICAgICAgIC8vIE5PVEUgRnVuY3Rpb24gb2JqZWN0cyBjcmVhdGVkIHVzaW5nIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kIGRvIG5vdFxuICAgICAgICAvLyBoYXZlIGEgcHJvdG90eXBlIHByb3BlcnR5IG9yIHRoZSBbW0NvZGVdXSwgW1tGb3JtYWxQYXJhbWV0ZXJzXV0sIGFuZFxuICAgICAgICAvLyBbW1Njb3BlXV0gaW50ZXJuYWwgcHJvcGVydGllcy5cbiAgICAgICAgLy8gWFhYIGNhbid0IGRlbGV0ZSBwcm90b3R5cGUgaW4gcHVyZS1qcy5cblxuICAgICAgICAvLyAyMi4gUmV0dXJuIEYuXG4gICAgICAgIHJldHVybiBib3VuZDtcbiAgICB9XG59KTtcblxuLy8gX1BsZWFzZSBub3RlOiBTaG9ydGN1dHMgYXJlIGRlZmluZWQgYWZ0ZXIgYEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kYCBhcyB3ZVxuLy8gdXMgaXQgaW4gZGVmaW5pbmcgc2hvcnRjdXRzLlxudmFyIG93bnMgPSBjYWxsLmJpbmQoT2JqZWN0UHJvdG90eXBlLmhhc093blByb3BlcnR5KTtcblxuLy9cbi8vIEFycmF5XG4vLyA9PT09PVxuLy9cblxuLy8gRVM1IDE1LjQuNC4xMlxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjEyXG52YXIgc3BsaWNlTm9vcFJldHVybnNFbXB0eUFycmF5ID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYSA9IFsxLCAyXTtcbiAgICB2YXIgcmVzdWx0ID0gYS5zcGxpY2UoKTtcbiAgICByZXR1cm4gYS5sZW5ndGggPT09IDIgJiYgaXNBcnJheShyZXN1bHQpICYmIHJlc3VsdC5sZW5ndGggPT09IDA7XG59KCkpO1xuZGVmaW5lUHJvcGVydGllcyhBcnJheVByb3RvdHlwZSwge1xuICAgIC8vIFNhZmFyaSA1LjAgYnVnIHdoZXJlIC5zcGxpY2UoKSByZXR1cm5zIHVuZGVmaW5lZFxuICAgIHNwbGljZTogZnVuY3Rpb24gc3BsaWNlKHN0YXJ0LCBkZWxldGVDb3VudCkge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGFycmF5X3NwbGljZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgfVxufSwgIXNwbGljZU5vb3BSZXR1cm5zRW1wdHlBcnJheSk7XG5cbnZhciBzcGxpY2VXb3Jrc1dpdGhFbXB0eU9iamVjdCA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9iaiA9IHt9O1xuICAgIEFycmF5UHJvdG90eXBlLnNwbGljZS5jYWxsKG9iaiwgMCwgMCwgMSk7XG4gICAgcmV0dXJuIG9iai5sZW5ndGggPT09IDE7XG59KCkpO1xuZGVmaW5lUHJvcGVydGllcyhBcnJheVByb3RvdHlwZSwge1xuICAgIHNwbGljZTogZnVuY3Rpb24gc3BsaWNlKHN0YXJ0LCBkZWxldGVDb3VudCkge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gW107IH1cbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgIHRoaXMubGVuZ3RoID0gTWF0aC5tYXgoRVMuVG9JbnRlZ2VyKHRoaXMubGVuZ3RoKSwgMCk7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMCAmJiB0eXBlb2YgZGVsZXRlQ291bnQgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBhcmdzID0gYXJyYXlfc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgICAgIGFyZ3MucHVzaCh0aGlzLmxlbmd0aCAtIHN0YXJ0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXJnc1sxXSA9IEVTLlRvSW50ZWdlcihkZWxldGVDb3VudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycmF5X3NwbGljZS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG59LCAhc3BsaWNlV29ya3NXaXRoRW1wdHlPYmplY3QpO1xuXG4vLyBFUzUgMTUuNC40LjEyXG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMTNcbi8vIFJldHVybiBsZW4rYXJnQ291bnQuXG4vLyBbYnVnZml4LCBpZWx0OF1cbi8vIElFIDwgOCBidWc6IFtdLnVuc2hpZnQoMCkgPT09IHVuZGVmaW5lZCBidXQgc2hvdWxkIGJlIFwiMVwiXG52YXIgaGFzVW5zaGlmdFJldHVyblZhbHVlQnVnID0gW10udW5zaGlmdCgwKSAhPT0gMTtcbmRlZmluZVByb3BlcnRpZXMoQXJyYXlQcm90b3R5cGUsIHtcbiAgICB1bnNoaWZ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGFycmF5X3Vuc2hpZnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubGVuZ3RoO1xuICAgIH1cbn0sIGhhc1Vuc2hpZnRSZXR1cm5WYWx1ZUJ1Zyk7XG5cbi8vIEVTNSAxNS40LjMuMlxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC4zLjJcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2lzQXJyYXlcbmRlZmluZVByb3BlcnRpZXMoQXJyYXksIHsgaXNBcnJheTogaXNBcnJheSB9KTtcblxuLy8gVGhlIElzQ2FsbGFibGUoKSBjaGVjayBpbiB0aGUgQXJyYXkgZnVuY3Rpb25zXG4vLyBoYXMgYmVlbiByZXBsYWNlZCB3aXRoIGEgc3RyaWN0IGNoZWNrIG9uIHRoZVxuLy8gaW50ZXJuYWwgY2xhc3Mgb2YgdGhlIG9iamVjdCB0byB0cmFwIGNhc2VzIHdoZXJlXG4vLyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gd2FzIGFjdHVhbGx5IGEgcmVndWxhclxuLy8gZXhwcmVzc2lvbiBsaXRlcmFsLCB3aGljaCBpbiBWOCBhbmRcbi8vIEphdmFTY3JpcHRDb3JlIGlzIGEgdHlwZW9mIFwiZnVuY3Rpb25cIi4gIE9ubHkgaW5cbi8vIFY4IGFyZSByZWd1bGFyIGV4cHJlc3Npb24gbGl0ZXJhbHMgcGVybWl0dGVkIGFzXG4vLyByZWR1Y2UgcGFyYW1ldGVycywgc28gaXQgaXMgZGVzaXJhYmxlIGluIHRoZVxuLy8gZ2VuZXJhbCBjYXNlIGZvciB0aGUgc2hpbSB0byBtYXRjaCB0aGUgbW9yZVxuLy8gc3RyaWN0IGFuZCBjb21tb24gYmVoYXZpb3Igb2YgcmVqZWN0aW5nIHJlZ3VsYXJcbi8vIGV4cHJlc3Npb25zLlxuXG4vLyBFUzUgMTUuNC40LjE4XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMThcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL2FycmF5L2ZvckVhY2hcblxuLy8gQ2hlY2sgZmFpbHVyZSBvZiBieS1pbmRleCBhY2Nlc3Mgb2Ygc3RyaW5nIGNoYXJhY3RlcnMgKElFIDwgOSlcbi8vIGFuZCBmYWlsdXJlIG9mIGAwIGluIGJveGVkU3RyaW5nYCAoUmhpbm8pXG52YXIgYm94ZWRTdHJpbmcgPSBPYmplY3QoJ2EnKTtcbnZhciBzcGxpdFN0cmluZyA9IGJveGVkU3RyaW5nWzBdICE9PSAnYScgfHwgISgwIGluIGJveGVkU3RyaW5nKTtcblxudmFyIHByb3Blcmx5Qm94ZXNDb250ZXh0ID0gZnVuY3Rpb24gcHJvcGVybHlCb3hlZChtZXRob2QpIHtcbiAgICAvLyBDaGVjayBub2RlIDAuNi4yMSBidWcgd2hlcmUgdGhpcmQgcGFyYW1ldGVyIGlzIG5vdCBib3hlZFxuICAgIHZhciBwcm9wZXJseUJveGVzTm9uU3RyaWN0ID0gdHJ1ZTtcbiAgICB2YXIgcHJvcGVybHlCb3hlc1N0cmljdCA9IHRydWU7XG4gICAgaWYgKG1ldGhvZCkge1xuICAgICAgICBtZXRob2QuY2FsbCgnZm9vJywgZnVuY3Rpb24gKF8sIF9fLCBjb250ZXh0KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbnRleHQgIT09ICdvYmplY3QnKSB7IHByb3Blcmx5Qm94ZXNOb25TdHJpY3QgPSBmYWxzZTsgfVxuICAgICAgICB9KTtcblxuICAgICAgICBtZXRob2QuY2FsbChbMV0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAgICAgcHJvcGVybHlCb3hlc1N0cmljdCA9IHR5cGVvZiB0aGlzID09PSAnc3RyaW5nJztcbiAgICAgICAgfSwgJ3gnKTtcbiAgICB9XG4gICAgcmV0dXJuICEhbWV0aG9kICYmIHByb3Blcmx5Qm94ZXNOb25TdHJpY3QgJiYgcHJvcGVybHlCb3hlc1N0cmljdDtcbn07XG5cbmRlZmluZVByb3BlcnRpZXMoQXJyYXlQcm90b3R5cGUsIHtcbiAgICBmb3JFYWNoOiBmdW5jdGlvbiBmb3JFYWNoKGNhbGxiYWNrZm4gLyosIHRoaXNBcmcqLykge1xuICAgICAgICB2YXIgb2JqZWN0ID0gRVMuVG9PYmplY3QodGhpcyk7XG4gICAgICAgIHZhciBzZWxmID0gc3BsaXRTdHJpbmcgJiYgaXNTdHJpbmcodGhpcykgPyB0aGlzLnNwbGl0KCcnKSA6IG9iamVjdDtcbiAgICAgICAgdmFyIGkgPSAtMTtcbiAgICAgICAgdmFyIGxlbmd0aCA9IHNlbGYubGVuZ3RoID4+PiAwO1xuICAgICAgICB2YXIgVDtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgVCA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIG5vIGNhbGxiYWNrIGZ1bmN0aW9uIG9yIGlmIGNhbGxiYWNrIGlzIG5vdCBhIGNhbGxhYmxlIGZ1bmN0aW9uXG4gICAgICAgIGlmICghaXNDYWxsYWJsZShjYWxsYmFja2ZuKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJyYXkucHJvdG90eXBlLmZvckVhY2ggY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAoKytpIDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaSBpbiBzZWxmKSB7XG4gICAgICAgICAgICAgICAgLy8gSW52b2tlIHRoZSBjYWxsYmFjayBmdW5jdGlvbiB3aXRoIGNhbGwsIHBhc3NpbmcgYXJndW1lbnRzOlxuICAgICAgICAgICAgICAgIC8vIGNvbnRleHQsIHByb3BlcnR5IHZhbHVlLCBwcm9wZXJ0eSBrZXksIHRoaXNBcmcgb2JqZWN0XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBUICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja2ZuLmNhbGwoVCwgc2VsZltpXSwgaSwgb2JqZWN0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja2ZuKHNlbGZbaV0sIGksIG9iamVjdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSwgIXByb3Blcmx5Qm94ZXNDb250ZXh0KEFycmF5UHJvdG90eXBlLmZvckVhY2gpKTtcblxuLy8gRVM1IDE1LjQuNC4xOVxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjE5XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9Db3JlX0phdmFTY3JpcHRfMS41X1JlZmVyZW5jZS9PYmplY3RzL0FycmF5L21hcFxuZGVmaW5lUHJvcGVydGllcyhBcnJheVByb3RvdHlwZSwge1xuICAgIG1hcDogZnVuY3Rpb24gbWFwKGNhbGxiYWNrZm4vKiwgdGhpc0FyZyovKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSBFUy5Ub09iamVjdCh0aGlzKTtcbiAgICAgICAgdmFyIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBpc1N0cmluZyh0aGlzKSA/IHRoaXMuc3BsaXQoJycpIDogb2JqZWN0O1xuICAgICAgICB2YXIgbGVuZ3RoID0gc2VsZi5sZW5ndGggPj4+IDA7XG4gICAgICAgIHZhciByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuICAgICAgICB2YXIgVDtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBUID0gYXJndW1lbnRzWzFdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgbm8gY2FsbGJhY2sgZnVuY3Rpb24gb3IgaWYgY2FsbGJhY2sgaXMgbm90IGEgY2FsbGFibGUgZnVuY3Rpb25cbiAgICAgICAgaWYgKCFpc0NhbGxhYmxlKGNhbGxiYWNrZm4pKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcnJheS5wcm90b3R5cGUubWFwIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGkgaW4gc2VsZikge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgVCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2ldID0gY2FsbGJhY2tmbi5jYWxsKFQsIHNlbGZbaV0sIGksIG9iamVjdCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2ldID0gY2FsbGJhY2tmbihzZWxmW2ldLCBpLCBvYmplY3QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn0sICFwcm9wZXJseUJveGVzQ29udGV4dChBcnJheVByb3RvdHlwZS5tYXApKTtcblxuLy8gRVM1IDE1LjQuNC4yMFxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjIwXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9Db3JlX0phdmFTY3JpcHRfMS41X1JlZmVyZW5jZS9PYmplY3RzL0FycmF5L2ZpbHRlclxuZGVmaW5lUHJvcGVydGllcyhBcnJheVByb3RvdHlwZSwge1xuICAgIGZpbHRlcjogZnVuY3Rpb24gZmlsdGVyKGNhbGxiYWNrZm4gLyosIHRoaXNBcmcqLykge1xuICAgICAgICB2YXIgb2JqZWN0ID0gRVMuVG9PYmplY3QodGhpcyk7XG4gICAgICAgIHZhciBzZWxmID0gc3BsaXRTdHJpbmcgJiYgaXNTdHJpbmcodGhpcykgPyB0aGlzLnNwbGl0KCcnKSA6IG9iamVjdDtcbiAgICAgICAgdmFyIGxlbmd0aCA9IHNlbGYubGVuZ3RoID4+PiAwO1xuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIHZhciB2YWx1ZTtcbiAgICAgICAgdmFyIFQ7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgVCA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIG5vIGNhbGxiYWNrIGZ1bmN0aW9uIG9yIGlmIGNhbGxiYWNrIGlzIG5vdCBhIGNhbGxhYmxlIGZ1bmN0aW9uXG4gICAgICAgIGlmICghaXNDYWxsYWJsZShjYWxsYmFja2ZuKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJyYXkucHJvdG90eXBlLmZpbHRlciBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpIGluIHNlbGYpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHNlbGZbaV07XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBUID09PSAndW5kZWZpbmVkJyA/IGNhbGxiYWNrZm4odmFsdWUsIGksIG9iamVjdCkgOiBjYWxsYmFja2ZuLmNhbGwoVCwgdmFsdWUsIGksIG9iamVjdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn0sICFwcm9wZXJseUJveGVzQ29udGV4dChBcnJheVByb3RvdHlwZS5maWx0ZXIpKTtcblxuLy8gRVM1IDE1LjQuNC4xNlxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjE2XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9ldmVyeVxuZGVmaW5lUHJvcGVydGllcyhBcnJheVByb3RvdHlwZSwge1xuICAgIGV2ZXJ5OiBmdW5jdGlvbiBldmVyeShjYWxsYmFja2ZuIC8qLCB0aGlzQXJnKi8pIHtcbiAgICAgICAgdmFyIG9iamVjdCA9IEVTLlRvT2JqZWN0KHRoaXMpO1xuICAgICAgICB2YXIgc2VsZiA9IHNwbGl0U3RyaW5nICYmIGlzU3RyaW5nKHRoaXMpID8gdGhpcy5zcGxpdCgnJykgOiBvYmplY3Q7XG4gICAgICAgIHZhciBsZW5ndGggPSBzZWxmLmxlbmd0aCA+Pj4gMDtcbiAgICAgICAgdmFyIFQ7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgVCA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIG5vIGNhbGxiYWNrIGZ1bmN0aW9uIG9yIGlmIGNhbGxiYWNrIGlzIG5vdCBhIGNhbGxhYmxlIGZ1bmN0aW9uXG4gICAgICAgIGlmICghaXNDYWxsYWJsZShjYWxsYmFja2ZuKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJyYXkucHJvdG90eXBlLmV2ZXJ5IGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGkgaW4gc2VsZiAmJiAhKHR5cGVvZiBUID09PSAndW5kZWZpbmVkJyA/IGNhbGxiYWNrZm4oc2VsZltpXSwgaSwgb2JqZWN0KSA6IGNhbGxiYWNrZm4uY2FsbChULCBzZWxmW2ldLCBpLCBvYmplY3QpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59LCAhcHJvcGVybHlCb3hlc0NvbnRleHQoQXJyYXlQcm90b3R5cGUuZXZlcnkpKTtcblxuLy8gRVM1IDE1LjQuNC4xN1xuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjE3XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9zb21lXG5kZWZpbmVQcm9wZXJ0aWVzKEFycmF5UHJvdG90eXBlLCB7XG4gICAgc29tZTogZnVuY3Rpb24gc29tZShjYWxsYmFja2ZuLyosIHRoaXNBcmcgKi8pIHtcbiAgICAgICAgdmFyIG9iamVjdCA9IEVTLlRvT2JqZWN0KHRoaXMpO1xuICAgICAgICB2YXIgc2VsZiA9IHNwbGl0U3RyaW5nICYmIGlzU3RyaW5nKHRoaXMpID8gdGhpcy5zcGxpdCgnJykgOiBvYmplY3Q7XG4gICAgICAgIHZhciBsZW5ndGggPSBzZWxmLmxlbmd0aCA+Pj4gMDtcbiAgICAgICAgdmFyIFQ7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgVCA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIG5vIGNhbGxiYWNrIGZ1bmN0aW9uIG9yIGlmIGNhbGxiYWNrIGlzIG5vdCBhIGNhbGxhYmxlIGZ1bmN0aW9uXG4gICAgICAgIGlmICghaXNDYWxsYWJsZShjYWxsYmFja2ZuKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJyYXkucHJvdG90eXBlLnNvbWUgY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaSBpbiBzZWxmICYmICh0eXBlb2YgVCA9PT0gJ3VuZGVmaW5lZCcgPyBjYWxsYmFja2ZuKHNlbGZbaV0sIGksIG9iamVjdCkgOiBjYWxsYmFja2ZuLmNhbGwoVCwgc2VsZltpXSwgaSwgb2JqZWN0KSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufSwgIXByb3Blcmx5Qm94ZXNDb250ZXh0KEFycmF5UHJvdG90eXBlLnNvbWUpKTtcblxuLy8gRVM1IDE1LjQuNC4yMVxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjIxXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9Db3JlX0phdmFTY3JpcHRfMS41X1JlZmVyZW5jZS9PYmplY3RzL0FycmF5L3JlZHVjZVxudmFyIHJlZHVjZUNvZXJjZXNUb09iamVjdCA9IGZhbHNlO1xuaWYgKEFycmF5UHJvdG90eXBlLnJlZHVjZSkge1xuICAgIHJlZHVjZUNvZXJjZXNUb09iamVjdCA9IHR5cGVvZiBBcnJheVByb3RvdHlwZS5yZWR1Y2UuY2FsbCgnZXM1JywgZnVuY3Rpb24gKF8sIF9fLCBfX18sIGxpc3QpIHsgcmV0dXJuIGxpc3Q7IH0pID09PSAnb2JqZWN0Jztcbn1cbmRlZmluZVByb3BlcnRpZXMoQXJyYXlQcm90b3R5cGUsIHtcbiAgICByZWR1Y2U6IGZ1bmN0aW9uIHJlZHVjZShjYWxsYmFja2ZuIC8qLCBpbml0aWFsVmFsdWUqLykge1xuICAgICAgICB2YXIgb2JqZWN0ID0gRVMuVG9PYmplY3QodGhpcyk7XG4gICAgICAgIHZhciBzZWxmID0gc3BsaXRTdHJpbmcgJiYgaXNTdHJpbmcodGhpcykgPyB0aGlzLnNwbGl0KCcnKSA6IG9iamVjdDtcbiAgICAgICAgdmFyIGxlbmd0aCA9IHNlbGYubGVuZ3RoID4+PiAwO1xuXG4gICAgICAgIC8vIElmIG5vIGNhbGxiYWNrIGZ1bmN0aW9uIG9yIGlmIGNhbGxiYWNrIGlzIG5vdCBhIGNhbGxhYmxlIGZ1bmN0aW9uXG4gICAgICAgIGlmICghaXNDYWxsYWJsZShjYWxsYmFja2ZuKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJyYXkucHJvdG90eXBlLnJlZHVjZSBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG5vIHZhbHVlIHRvIHJldHVybiBpZiBubyBpbml0aWFsIHZhbHVlIGFuZCBhbiBlbXB0eSBhcnJheVxuICAgICAgICBpZiAobGVuZ3RoID09PSAwICYmIGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3JlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgdmFyIHJlc3VsdDtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMikge1xuICAgICAgICAgICAgcmVzdWx0ID0gYXJndW1lbnRzWzFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIGlmIChpIGluIHNlbGYpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gc2VsZltpKytdO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBpZiBhcnJheSBjb250YWlucyBubyB2YWx1ZXMsIG5vIGluaXRpYWwgdmFsdWUgdG8gcmV0dXJuXG4gICAgICAgICAgICAgICAgaWYgKCsraSA+PSBsZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigncmVkdWNlIG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gd2hpbGUgKHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGkgaW4gc2VsZikge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGNhbGxiYWNrZm4ocmVzdWx0LCBzZWxmW2ldLCBpLCBvYmplY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG59LCAhcmVkdWNlQ29lcmNlc1RvT2JqZWN0KTtcblxuLy8gRVM1IDE1LjQuNC4yMlxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjIyXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9Db3JlX0phdmFTY3JpcHRfMS41X1JlZmVyZW5jZS9PYmplY3RzL0FycmF5L3JlZHVjZVJpZ2h0XG52YXIgcmVkdWNlUmlnaHRDb2VyY2VzVG9PYmplY3QgPSBmYWxzZTtcbmlmIChBcnJheVByb3RvdHlwZS5yZWR1Y2VSaWdodCkge1xuICAgIHJlZHVjZVJpZ2h0Q29lcmNlc1RvT2JqZWN0ID0gdHlwZW9mIEFycmF5UHJvdG90eXBlLnJlZHVjZVJpZ2h0LmNhbGwoJ2VzNScsIGZ1bmN0aW9uIChfLCBfXywgX19fLCBsaXN0KSB7IHJldHVybiBsaXN0OyB9KSA9PT0gJ29iamVjdCc7XG59XG5kZWZpbmVQcm9wZXJ0aWVzKEFycmF5UHJvdG90eXBlLCB7XG4gICAgcmVkdWNlUmlnaHQ6IGZ1bmN0aW9uIHJlZHVjZVJpZ2h0KGNhbGxiYWNrZm4vKiwgaW5pdGlhbCovKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSBFUy5Ub09iamVjdCh0aGlzKTtcbiAgICAgICAgdmFyIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBpc1N0cmluZyh0aGlzKSA/IHRoaXMuc3BsaXQoJycpIDogb2JqZWN0O1xuICAgICAgICB2YXIgbGVuZ3RoID0gc2VsZi5sZW5ndGggPj4+IDA7XG5cbiAgICAgICAgLy8gSWYgbm8gY2FsbGJhY2sgZnVuY3Rpb24gb3IgaWYgY2FsbGJhY2sgaXMgbm90IGEgY2FsbGFibGUgZnVuY3Rpb25cbiAgICAgICAgaWYgKCFpc0NhbGxhYmxlKGNhbGxiYWNrZm4pKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcnJheS5wcm90b3R5cGUucmVkdWNlUmlnaHQgY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBubyB2YWx1ZSB0byByZXR1cm4gaWYgbm8gaW5pdGlhbCB2YWx1ZSwgZW1wdHkgYXJyYXlcbiAgICAgICAgaWYgKGxlbmd0aCA9PT0gMCAmJiBhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdyZWR1Y2VSaWdodCBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZXN1bHQ7XG4gICAgICAgIHZhciBpID0gbGVuZ3RoIC0gMTtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMikge1xuICAgICAgICAgICAgcmVzdWx0ID0gYXJndW1lbnRzWzFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIGlmIChpIGluIHNlbGYpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gc2VsZltpLS1dO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBpZiBhcnJheSBjb250YWlucyBubyB2YWx1ZXMsIG5vIGluaXRpYWwgdmFsdWUgdG8gcmV0dXJuXG4gICAgICAgICAgICAgICAgaWYgKC0taSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigncmVkdWNlUmlnaHQgb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSB3aGlsZSAodHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaSA8IDApIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICBkbyB7XG4gICAgICAgICAgICBpZiAoaSBpbiBzZWxmKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gY2FsbGJhY2tmbihyZXN1bHQsIHNlbGZbaV0sIGksIG9iamVjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gd2hpbGUgKGktLSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG59LCAhcmVkdWNlUmlnaHRDb2VyY2VzVG9PYmplY3QpO1xuXG4vLyBFUzUgMTUuNC40LjE0XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMTRcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2luZGV4T2ZcbnZhciBoYXNGaXJlZm94MkluZGV4T2ZCdWcgPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZiAmJiBbMCwgMV0uaW5kZXhPZigxLCAyKSAhPT0gLTE7XG5kZWZpbmVQcm9wZXJ0aWVzKEFycmF5UHJvdG90eXBlLCB7XG4gICAgaW5kZXhPZjogZnVuY3Rpb24gaW5kZXhPZihzZWFyY2hFbGVtZW50IC8qLCBmcm9tSW5kZXggKi8pIHtcbiAgICAgICAgdmFyIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBpc1N0cmluZyh0aGlzKSA/IHRoaXMuc3BsaXQoJycpIDogRVMuVG9PYmplY3QodGhpcyk7XG4gICAgICAgIHZhciBsZW5ndGggPSBzZWxmLmxlbmd0aCA+Pj4gMDtcblxuICAgICAgICBpZiAobGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgaSA9IEVTLlRvSW50ZWdlcihhcmd1bWVudHNbMV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaGFuZGxlIG5lZ2F0aXZlIGluZGljZXNcbiAgICAgICAgaSA9IGkgPj0gMCA/IGkgOiBNYXRoLm1heCgwLCBsZW5ndGggKyBpKTtcbiAgICAgICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGkgaW4gc2VsZiAmJiBzZWxmW2ldID09PSBzZWFyY2hFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbn0sIGhhc0ZpcmVmb3gySW5kZXhPZkJ1Zyk7XG5cbi8vIEVTNSAxNS40LjQuMTVcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4xNVxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvbGFzdEluZGV4T2ZcbnZhciBoYXNGaXJlZm94Mkxhc3RJbmRleE9mQnVnID0gQXJyYXkucHJvdG90eXBlLmxhc3RJbmRleE9mICYmIFswLCAxXS5sYXN0SW5kZXhPZigwLCAtMykgIT09IC0xO1xuZGVmaW5lUHJvcGVydGllcyhBcnJheVByb3RvdHlwZSwge1xuICAgIGxhc3RJbmRleE9mOiBmdW5jdGlvbiBsYXN0SW5kZXhPZihzZWFyY2hFbGVtZW50IC8qLCBmcm9tSW5kZXggKi8pIHtcbiAgICAgICAgdmFyIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBpc1N0cmluZyh0aGlzKSA/IHRoaXMuc3BsaXQoJycpIDogRVMuVG9PYmplY3QodGhpcyk7XG4gICAgICAgIHZhciBsZW5ndGggPSBzZWxmLmxlbmd0aCA+Pj4gMDtcblxuICAgICAgICBpZiAobGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGkgPSBsZW5ndGggLSAxO1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIGkgPSBNYXRoLm1pbihpLCBFUy5Ub0ludGVnZXIoYXJndW1lbnRzWzFdKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaGFuZGxlIG5lZ2F0aXZlIGluZGljZXNcbiAgICAgICAgaSA9IGkgPj0gMCA/IGkgOiBsZW5ndGggLSBNYXRoLmFicyhpKTtcbiAgICAgICAgZm9yICg7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpZiAoaSBpbiBzZWxmICYmIHNlYXJjaEVsZW1lbnQgPT09IHNlbGZbaV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxufSwgaGFzRmlyZWZveDJMYXN0SW5kZXhPZkJ1Zyk7XG5cbi8vXG4vLyBPYmplY3Rcbi8vID09PT09PVxuLy9cblxuLy8gRVM1IDE1LjIuMy4xNFxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjE0XG5cbi8vIGh0dHA6Ly93aGF0dGhlaGVhZHNhaWQuY29tLzIwMTAvMTAvYS1zYWZlci1vYmplY3Qta2V5cy1jb21wYXRpYmlsaXR5LWltcGxlbWVudGF0aW9uXG52YXIgaGFzRG9udEVudW1CdWcgPSAhKHsgJ3RvU3RyaW5nJzogbnVsbCB9KS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgndG9TdHJpbmcnKSxcbiAgICBoYXNQcm90b0VudW1CdWcgPSBmdW5jdGlvbiAoKSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgncHJvdG90eXBlJyksXG4gICAgaGFzU3RyaW5nRW51bUJ1ZyA9ICFvd25zKCd4JywgJzAnKSxcbiAgICBkb250RW51bXMgPSBbXG4gICAgICAgICd0b1N0cmluZycsXG4gICAgICAgICd0b0xvY2FsZVN0cmluZycsXG4gICAgICAgICd2YWx1ZU9mJyxcbiAgICAgICAgJ2hhc093blByb3BlcnR5JyxcbiAgICAgICAgJ2lzUHJvdG90eXBlT2YnLFxuICAgICAgICAncHJvcGVydHlJc0VudW1lcmFibGUnLFxuICAgICAgICAnY29uc3RydWN0b3InXG4gICAgXSxcbiAgICBkb250RW51bXNMZW5ndGggPSBkb250RW51bXMubGVuZ3RoO1xuXG5kZWZpbmVQcm9wZXJ0aWVzKE9iamVjdCwge1xuICAgIGtleXM6IGZ1bmN0aW9uIGtleXMob2JqZWN0KSB7XG4gICAgICAgIHZhciBpc0ZuID0gaXNDYWxsYWJsZShvYmplY3QpLFxuICAgICAgICAgICAgaXNBcmdzID0gaXNBcmd1bWVudHMob2JqZWN0KSxcbiAgICAgICAgICAgIGlzT2JqZWN0ID0gb2JqZWN0ICE9PSBudWxsICYmIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnLFxuICAgICAgICAgICAgaXNTdHIgPSBpc09iamVjdCAmJiBpc1N0cmluZyhvYmplY3QpO1xuXG4gICAgICAgIGlmICghaXNPYmplY3QgJiYgIWlzRm4gJiYgIWlzQXJncykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmtleXMgY2FsbGVkIG9uIGEgbm9uLW9iamVjdCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRoZUtleXMgPSBbXTtcbiAgICAgICAgdmFyIHNraXBQcm90byA9IGhhc1Byb3RvRW51bUJ1ZyAmJiBpc0ZuO1xuICAgICAgICBpZiAoKGlzU3RyICYmIGhhc1N0cmluZ0VudW1CdWcpIHx8IGlzQXJncykge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmplY3QubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICB0aGVLZXlzLnB1c2goU3RyaW5nKGkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNBcmdzKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBuYW1lIGluIG9iamVjdCkge1xuICAgICAgICAgICAgICAgIGlmICghKHNraXBQcm90byAmJiBuYW1lID09PSAncHJvdG90eXBlJykgJiYgb3ducyhvYmplY3QsIG5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoZUtleXMucHVzaChTdHJpbmcobmFtZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXNEb250RW51bUJ1Zykge1xuICAgICAgICAgICAgdmFyIGN0b3IgPSBvYmplY3QuY29uc3RydWN0b3IsXG4gICAgICAgICAgICAgICAgc2tpcENvbnN0cnVjdG9yID0gY3RvciAmJiBjdG9yLnByb3RvdHlwZSA9PT0gb2JqZWN0O1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBkb250RW51bXNMZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIHZhciBkb250RW51bSA9IGRvbnRFbnVtc1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoIShza2lwQ29uc3RydWN0b3IgJiYgZG9udEVudW0gPT09ICdjb25zdHJ1Y3RvcicpICYmIG93bnMob2JqZWN0LCBkb250RW51bSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhlS2V5cy5wdXNoKGRvbnRFbnVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoZUtleXM7XG4gICAgfVxufSk7XG5cbnZhciBrZXlzV29ya3NXaXRoQXJndW1lbnRzID0gT2JqZWN0LmtleXMgJiYgKGZ1bmN0aW9uICgpIHtcbiAgICAvLyBTYWZhcmkgNS4wIGJ1Z1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhhcmd1bWVudHMpLmxlbmd0aCA9PT0gMjtcbn0oMSwgMikpO1xudmFyIG9yaWdpbmFsS2V5cyA9IE9iamVjdC5rZXlzO1xuZGVmaW5lUHJvcGVydGllcyhPYmplY3QsIHtcbiAgICBrZXlzOiBmdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuICAgICAgICBpZiAoaXNBcmd1bWVudHMob2JqZWN0KSkge1xuICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsS2V5cyhBcnJheVByb3RvdHlwZS5zbGljZS5jYWxsKG9iamVjdCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsS2V5cyhvYmplY3QpO1xuICAgICAgICB9XG4gICAgfVxufSwgIWtleXNXb3Jrc1dpdGhBcmd1bWVudHMpO1xuXG4vL1xuLy8gRGF0ZVxuLy8gPT09PVxuLy9cblxuLy8gRVM1IDE1LjkuNS40M1xuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuOS41LjQzXG4vLyBUaGlzIGZ1bmN0aW9uIHJldHVybnMgYSBTdHJpbmcgdmFsdWUgcmVwcmVzZW50IHRoZSBpbnN0YW5jZSBpbiB0aW1lXG4vLyByZXByZXNlbnRlZCBieSB0aGlzIERhdGUgb2JqZWN0LiBUaGUgZm9ybWF0IG9mIHRoZSBTdHJpbmcgaXMgdGhlIERhdGUgVGltZVxuLy8gc3RyaW5nIGZvcm1hdCBkZWZpbmVkIGluIDE1LjkuMS4xNS4gQWxsIGZpZWxkcyBhcmUgcHJlc2VudCBpbiB0aGUgU3RyaW5nLlxuLy8gVGhlIHRpbWUgem9uZSBpcyBhbHdheXMgVVRDLCBkZW5vdGVkIGJ5IHRoZSBzdWZmaXggWi4gSWYgdGhlIHRpbWUgdmFsdWUgb2Zcbi8vIHRoaXMgb2JqZWN0IGlzIG5vdCBhIGZpbml0ZSBOdW1iZXIgYSBSYW5nZUVycm9yIGV4Y2VwdGlvbiBpcyB0aHJvd24uXG52YXIgbmVnYXRpdmVEYXRlID0gLTYyMTk4NzU1MjAwMDAwO1xudmFyIG5lZ2F0aXZlWWVhclN0cmluZyA9ICctMDAwMDAxJztcbnZhciBoYXNOZWdhdGl2ZURhdGVCdWcgPSBEYXRlLnByb3RvdHlwZS50b0lTT1N0cmluZyAmJiBuZXcgRGF0ZShuZWdhdGl2ZURhdGUpLnRvSVNPU3RyaW5nKCkuaW5kZXhPZihuZWdhdGl2ZVllYXJTdHJpbmcpID09PSAtMTtcblxuZGVmaW5lUHJvcGVydGllcyhEYXRlLnByb3RvdHlwZSwge1xuICAgIHRvSVNPU3RyaW5nOiBmdW5jdGlvbiB0b0lTT1N0cmluZygpIHtcbiAgICAgICAgdmFyIHJlc3VsdCwgbGVuZ3RoLCB2YWx1ZSwgeWVhciwgbW9udGg7XG4gICAgICAgIGlmICghaXNGaW5pdGUodGhpcykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdEYXRlLnByb3RvdHlwZS50b0lTT1N0cmluZyBjYWxsZWQgb24gbm9uLWZpbml0ZSB2YWx1ZS4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHllYXIgPSB0aGlzLmdldFVUQ0Z1bGxZZWFyKCk7XG5cbiAgICAgICAgbW9udGggPSB0aGlzLmdldFVUQ01vbnRoKCk7XG4gICAgICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vZXMtc2hpbXMvZXM1LXNoaW0vaXNzdWVzLzExMVxuICAgICAgICB5ZWFyICs9IE1hdGguZmxvb3IobW9udGggLyAxMik7XG4gICAgICAgIG1vbnRoID0gKG1vbnRoICUgMTIgKyAxMikgJSAxMjtcblxuICAgICAgICAvLyB0aGUgZGF0ZSB0aW1lIHN0cmluZyBmb3JtYXQgaXMgc3BlY2lmaWVkIGluIDE1LjkuMS4xNS5cbiAgICAgICAgcmVzdWx0ID0gW21vbnRoICsgMSwgdGhpcy5nZXRVVENEYXRlKCksIHRoaXMuZ2V0VVRDSG91cnMoKSwgdGhpcy5nZXRVVENNaW51dGVzKCksIHRoaXMuZ2V0VVRDU2Vjb25kcygpXTtcbiAgICAgICAgeWVhciA9IChcbiAgICAgICAgICAgICh5ZWFyIDwgMCA/ICctJyA6ICh5ZWFyID4gOTk5OSA/ICcrJyA6ICcnKSkgK1xuICAgICAgICAgICAgKCcwMDAwMCcgKyBNYXRoLmFicyh5ZWFyKSkuc2xpY2UoKDAgPD0geWVhciAmJiB5ZWFyIDw9IDk5OTkpID8gLTQgOiAtNilcbiAgICAgICAgKTtcblxuICAgICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuICAgICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgICAgIHZhbHVlID0gcmVzdWx0W2xlbmd0aF07XG4gICAgICAgICAgICAvLyBwYWQgbW9udGhzLCBkYXlzLCBob3VycywgbWludXRlcywgYW5kIHNlY29uZHMgdG8gaGF2ZSB0d29cbiAgICAgICAgICAgIC8vIGRpZ2l0cy5cbiAgICAgICAgICAgIGlmICh2YWx1ZSA8IDEwKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W2xlbmd0aF0gPSAnMCcgKyB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBwYWQgbWlsbGlzZWNvbmRzIHRvIGhhdmUgdGhyZWUgZGlnaXRzLlxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgeWVhciArICctJyArIHJlc3VsdC5zbGljZSgwLCAyKS5qb2luKCctJykgK1xuICAgICAgICAgICAgJ1QnICsgcmVzdWx0LnNsaWNlKDIpLmpvaW4oJzonKSArICcuJyArXG4gICAgICAgICAgICAoJzAwMCcgKyB0aGlzLmdldFVUQ01pbGxpc2Vjb25kcygpKS5zbGljZSgtMykgKyAnWidcbiAgICAgICAgKTtcbiAgICB9XG59LCBoYXNOZWdhdGl2ZURhdGVCdWcpO1xuXG4vLyBFUzUgMTUuOS41LjQ0XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS45LjUuNDRcbi8vIFRoaXMgZnVuY3Rpb24gcHJvdmlkZXMgYSBTdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYSBEYXRlIG9iamVjdCBmb3IgdXNlIGJ5XG4vLyBKU09OLnN0cmluZ2lmeSAoMTUuMTIuMykuXG52YXIgZGF0ZVRvSlNPTklzU3VwcG9ydGVkID0gKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gRGF0ZS5wcm90b3R5cGUudG9KU09OICYmXG4gICAgICAgICAgICBuZXcgRGF0ZShOYU4pLnRvSlNPTigpID09PSBudWxsICYmXG4gICAgICAgICAgICBuZXcgRGF0ZShuZWdhdGl2ZURhdGUpLnRvSlNPTigpLmluZGV4T2YobmVnYXRpdmVZZWFyU3RyaW5nKSAhPT0gLTEgJiZcbiAgICAgICAgICAgIERhdGUucHJvdG90eXBlLnRvSlNPTi5jYWxsKHsgLy8gZ2VuZXJpY1xuICAgICAgICAgICAgICAgIHRvSVNPU3RyaW5nOiBmdW5jdGlvbiAoKSB7IHJldHVybiB0cnVlOyB9XG4gICAgICAgICAgICB9KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59KCkpO1xuaWYgKCFkYXRlVG9KU09OSXNTdXBwb3J0ZWQpIHtcbiAgICBEYXRlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04oa2V5KSB7XG4gICAgICAgIC8vIFdoZW4gdGhlIHRvSlNPTiBtZXRob2QgaXMgY2FsbGVkIHdpdGggYXJndW1lbnQga2V5LCB0aGUgZm9sbG93aW5nXG4gICAgICAgIC8vIHN0ZXBzIGFyZSB0YWtlbjpcblxuICAgICAgICAvLyAxLiAgTGV0IE8gYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIFRvT2JqZWN0LCBnaXZpbmcgaXQgdGhlIHRoaXNcbiAgICAgICAgLy8gdmFsdWUgYXMgaXRzIGFyZ3VtZW50LlxuICAgICAgICAvLyAyLiBMZXQgdHYgYmUgRVMuVG9QcmltaXRpdmUoTywgaGludCBOdW1iZXIpLlxuICAgICAgICB2YXIgTyA9IE9iamVjdCh0aGlzKTtcbiAgICAgICAgdmFyIHR2ID0gRVMuVG9QcmltaXRpdmUoTyk7XG4gICAgICAgIC8vIDMuIElmIHR2IGlzIGEgTnVtYmVyIGFuZCBpcyBub3QgZmluaXRlLCByZXR1cm4gbnVsbC5cbiAgICAgICAgaWYgKHR5cGVvZiB0diA9PT0gJ251bWJlcicgJiYgIWlzRmluaXRlKHR2KSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgLy8gNC4gTGV0IHRvSVNPIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tHZXRdXSBpbnRlcm5hbCBtZXRob2Qgb2ZcbiAgICAgICAgLy8gTyB3aXRoIGFyZ3VtZW50IFwidG9JU09TdHJpbmdcIi5cbiAgICAgICAgdmFyIHRvSVNPID0gTy50b0lTT1N0cmluZztcbiAgICAgICAgLy8gNS4gSWYgSXNDYWxsYWJsZSh0b0lTTykgaXMgZmFsc2UsIHRocm93IGEgVHlwZUVycm9yIGV4Y2VwdGlvbi5cbiAgICAgICAgaWYgKCFpc0NhbGxhYmxlKHRvSVNPKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndG9JU09TdHJpbmcgcHJvcGVydHkgaXMgbm90IGNhbGxhYmxlJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gNi4gUmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tDYWxsXV0gaW50ZXJuYWwgbWV0aG9kIG9mXG4gICAgICAgIC8vICB0b0lTTyB3aXRoIE8gYXMgdGhlIHRoaXMgdmFsdWUgYW5kIGFuIGVtcHR5IGFyZ3VtZW50IGxpc3QuXG4gICAgICAgIHJldHVybiB0b0lTTy5jYWxsKE8pO1xuXG4gICAgICAgIC8vIE5PVEUgMSBUaGUgYXJndW1lbnQgaXMgaWdub3JlZC5cblxuICAgICAgICAvLyBOT1RFIDIgVGhlIHRvSlNPTiBmdW5jdGlvbiBpcyBpbnRlbnRpb25hbGx5IGdlbmVyaWM7IGl0IGRvZXMgbm90XG4gICAgICAgIC8vIHJlcXVpcmUgdGhhdCBpdHMgdGhpcyB2YWx1ZSBiZSBhIERhdGUgb2JqZWN0LiBUaGVyZWZvcmUsIGl0IGNhbiBiZVxuICAgICAgICAvLyB0cmFuc2ZlcnJlZCB0byBvdGhlciBraW5kcyBvZiBvYmplY3RzIGZvciB1c2UgYXMgYSBtZXRob2QuIEhvd2V2ZXIsXG4gICAgICAgIC8vIGl0IGRvZXMgcmVxdWlyZSB0aGF0IGFueSBzdWNoIG9iamVjdCBoYXZlIGEgdG9JU09TdHJpbmcgbWV0aG9kLiBBblxuICAgICAgICAvLyBvYmplY3QgaXMgZnJlZSB0byB1c2UgdGhlIGFyZ3VtZW50IGtleSB0byBmaWx0ZXIgaXRzXG4gICAgICAgIC8vIHN0cmluZ2lmaWNhdGlvbi5cbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuOS40LjJcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjkuNC4yXG4vLyBiYXNlZCBvbiB3b3JrIHNoYXJlZCBieSBEYW5pZWwgRnJpZXNlbiAoZGFudG1hbilcbi8vIGh0dHA6Ly9naXN0LmdpdGh1Yi5jb20vMzAzMjQ5XG52YXIgc3VwcG9ydHNFeHRlbmRlZFllYXJzID0gRGF0ZS5wYXJzZSgnKzAzMzY1OC0wOS0yN1QwMTo0Njo0MC4wMDBaJykgPT09IDFlMTU7XG52YXIgYWNjZXB0c0ludmFsaWREYXRlcyA9ICFpc05hTihEYXRlLnBhcnNlKCcyMDEyLTA0LTA0VDI0OjAwOjAwLjUwMFonKSkgfHwgIWlzTmFOKERhdGUucGFyc2UoJzIwMTItMTEtMzFUMjM6NTk6NTkuMDAwWicpKSB8fCAhaXNOYU4oRGF0ZS5wYXJzZSgnMjAxMi0xMi0zMVQyMzo1OTo2MC4wMDBaJykpO1xudmFyIGRvZXNOb3RQYXJzZVkyS05ld1llYXIgPSBpc05hTihEYXRlLnBhcnNlKCcyMDAwLTAxLTAxVDAwOjAwOjAwLjAwMFonKSk7XG5pZiAoIURhdGUucGFyc2UgfHwgZG9lc05vdFBhcnNlWTJLTmV3WWVhciB8fCBhY2NlcHRzSW52YWxpZERhdGVzIHx8ICFzdXBwb3J0c0V4dGVuZGVkWWVhcnMpIHtcbiAgICAvLyBYWFggZ2xvYmFsIGFzc2lnbm1lbnQgd29uJ3Qgd29yayBpbiBlbWJlZGRpbmdzIHRoYXQgdXNlXG4gICAgLy8gYW4gYWx0ZXJuYXRlIG9iamVjdCBmb3IgdGhlIGNvbnRleHQuXG4gICAgLyogZ2xvYmFsIERhdGU6IHRydWUgKi9cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuICAgIERhdGUgPSAoZnVuY3Rpb24gKE5hdGl2ZURhdGUpIHtcbiAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVuZGVmICovXG4gICAgICAgIC8vIERhdGUubGVuZ3RoID09PSA3XG4gICAgICAgIHZhciBEYXRlU2hpbSA9IGZ1bmN0aW9uIERhdGUoWSwgTSwgRCwgaCwgbSwgcywgbXMpIHtcbiAgICAgICAgICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICAgICAgdmFyIGRhdGU7XG4gICAgICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIE5hdGl2ZURhdGUpIHtcbiAgICAgICAgICAgICAgICBkYXRlID0gbGVuZ3RoID09PSAxICYmIFN0cmluZyhZKSA9PT0gWSA/IC8vIGlzU3RyaW5nKFkpXG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIGV4cGxpY2l0bHkgcGFzcyBpdCB0aHJvdWdoIHBhcnNlOlxuICAgICAgICAgICAgICAgICAgICBuZXcgTmF0aXZlRGF0ZShEYXRlU2hpbS5wYXJzZShZKSkgOlxuICAgICAgICAgICAgICAgICAgICAvLyBXZSBoYXZlIHRvIG1hbnVhbGx5IG1ha2UgY2FsbHMgZGVwZW5kaW5nIG9uIGFyZ3VtZW50XG4gICAgICAgICAgICAgICAgICAgIC8vIGxlbmd0aCBoZXJlXG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCA+PSA3ID8gbmV3IE5hdGl2ZURhdGUoWSwgTSwgRCwgaCwgbSwgcywgbXMpIDpcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID49IDYgPyBuZXcgTmF0aXZlRGF0ZShZLCBNLCBELCBoLCBtLCBzKSA6XG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCA+PSA1ID8gbmV3IE5hdGl2ZURhdGUoWSwgTSwgRCwgaCwgbSkgOlxuICAgICAgICAgICAgICAgICAgICBsZW5ndGggPj0gNCA/IG5ldyBOYXRpdmVEYXRlKFksIE0sIEQsIGgpIDpcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID49IDMgPyBuZXcgTmF0aXZlRGF0ZShZLCBNLCBEKSA6XG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCA+PSAyID8gbmV3IE5hdGl2ZURhdGUoWSwgTSkgOlxuICAgICAgICAgICAgICAgICAgICBsZW5ndGggPj0gMSA/IG5ldyBOYXRpdmVEYXRlKFkpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTmF0aXZlRGF0ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkYXRlID0gTmF0aXZlRGF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gUHJldmVudCBtaXh1cHMgd2l0aCB1bmZpeGVkIERhdGUgb2JqZWN0XG4gICAgICAgICAgICBkZWZpbmVQcm9wZXJ0aWVzKGRhdGUsIHsgY29uc3RydWN0b3I6IERhdGVTaGltIH0sIHRydWUpO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gMTUuOS4xLjE1IERhdGUgVGltZSBTdHJpbmcgRm9ybWF0LlxuICAgICAgICB2YXIgaXNvRGF0ZUV4cHJlc3Npb24gPSBuZXcgUmVnRXhwKCdeJyArXG4gICAgICAgICAgICAnKFxcXFxkezR9fFsrLV1cXFxcZHs2fSknICsgLy8gZm91ci1kaWdpdCB5ZWFyIGNhcHR1cmUgb3Igc2lnbiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDYtZGlnaXQgZXh0ZW5kZWQgeWVhclxuICAgICAgICAgICAgJyg/Oi0oXFxcXGR7Mn0pJyArIC8vIG9wdGlvbmFsIG1vbnRoIGNhcHR1cmVcbiAgICAgICAgICAgICcoPzotKFxcXFxkezJ9KScgKyAvLyBvcHRpb25hbCBkYXkgY2FwdHVyZVxuICAgICAgICAgICAgJyg/OicgKyAvLyBjYXB0dXJlIGhvdXJzOm1pbnV0ZXM6c2Vjb25kcy5taWxsaXNlY29uZHNcbiAgICAgICAgICAgICAgICAnVChcXFxcZHsyfSknICsgLy8gaG91cnMgY2FwdHVyZVxuICAgICAgICAgICAgICAgICc6KFxcXFxkezJ9KScgKyAvLyBtaW51dGVzIGNhcHR1cmVcbiAgICAgICAgICAgICAgICAnKD86JyArIC8vIG9wdGlvbmFsIDpzZWNvbmRzLm1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgICAgICAgICAnOihcXFxcZHsyfSknICsgLy8gc2Vjb25kcyBjYXB0dXJlXG4gICAgICAgICAgICAgICAgICAgICcoPzooXFxcXC5cXFxcZHsxLH0pKT8nICsgLy8gbWlsbGlzZWNvbmRzIGNhcHR1cmVcbiAgICAgICAgICAgICAgICAnKT8nICtcbiAgICAgICAgICAgICcoJyArIC8vIGNhcHR1cmUgVVRDIG9mZnNldCBjb21wb25lbnRcbiAgICAgICAgICAgICAgICAnWnwnICsgLy8gVVRDIGNhcHR1cmVcbiAgICAgICAgICAgICAgICAnKD86JyArIC8vIG9mZnNldCBzcGVjaWZpZXIgKy8taG91cnM6bWludXRlc1xuICAgICAgICAgICAgICAgICAgICAnKFstK10pJyArIC8vIHNpZ24gY2FwdHVyZVxuICAgICAgICAgICAgICAgICAgICAnKFxcXFxkezJ9KScgKyAvLyBob3VycyBvZmZzZXQgY2FwdHVyZVxuICAgICAgICAgICAgICAgICAgICAnOihcXFxcZHsyfSknICsgLy8gbWludXRlcyBvZmZzZXQgY2FwdHVyZVxuICAgICAgICAgICAgICAgICcpJyArXG4gICAgICAgICAgICAnKT8pPyk/KT8nICtcbiAgICAgICAgJyQnKTtcblxuICAgICAgICB2YXIgbW9udGhzID0gWzAsIDMxLCA1OSwgOTAsIDEyMCwgMTUxLCAxODEsIDIxMiwgMjQzLCAyNzMsIDMwNCwgMzM0LCAzNjVdO1xuXG4gICAgICAgIHZhciBkYXlGcm9tTW9udGggPSBmdW5jdGlvbiBkYXlGcm9tTW9udGgoeWVhciwgbW9udGgpIHtcbiAgICAgICAgICAgIHZhciB0ID0gbW9udGggPiAxID8gMSA6IDA7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIG1vbnRoc1ttb250aF0gK1xuICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoKHllYXIgLSAxOTY5ICsgdCkgLyA0KSAtXG4gICAgICAgICAgICAgICAgTWF0aC5mbG9vcigoeWVhciAtIDE5MDEgKyB0KSAvIDEwMCkgK1xuICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoKHllYXIgLSAxNjAxICsgdCkgLyA0MDApICtcbiAgICAgICAgICAgICAgICAzNjUgKiAoeWVhciAtIDE5NzApXG4gICAgICAgICAgICApO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciB0b1VUQyA9IGZ1bmN0aW9uIHRvVVRDKHQpIHtcbiAgICAgICAgICAgIHJldHVybiBOdW1iZXIobmV3IE5hdGl2ZURhdGUoMTk3MCwgMCwgMSwgMCwgMCwgMCwgdCkpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIENvcHkgYW55IGN1c3RvbSBtZXRob2RzIGEgM3JkIHBhcnR5IGxpYnJhcnkgbWF5IGhhdmUgYWRkZWRcbiAgICAgICAgZm9yICh2YXIga2V5IGluIE5hdGl2ZURhdGUpIHtcbiAgICAgICAgICAgIGlmIChvd25zKE5hdGl2ZURhdGUsIGtleSkpIHtcbiAgICAgICAgICAgICAgICBEYXRlU2hpbVtrZXldID0gTmF0aXZlRGF0ZVtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29weSBcIm5hdGl2ZVwiIG1ldGhvZHMgZXhwbGljaXRseTsgdGhleSBtYXkgYmUgbm9uLWVudW1lcmFibGVcbiAgICAgICAgZGVmaW5lUHJvcGVydGllcyhEYXRlU2hpbSwge1xuICAgICAgICAgICAgbm93OiBOYXRpdmVEYXRlLm5vdyxcbiAgICAgICAgICAgIFVUQzogTmF0aXZlRGF0ZS5VVENcbiAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgIERhdGVTaGltLnByb3RvdHlwZSA9IE5hdGl2ZURhdGUucHJvdG90eXBlO1xuICAgICAgICBkZWZpbmVQcm9wZXJ0aWVzKERhdGVTaGltLnByb3RvdHlwZSwge1xuICAgICAgICAgICAgY29uc3RydWN0b3I6IERhdGVTaGltXG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIC8vIFVwZ3JhZGUgRGF0ZS5wYXJzZSB0byBoYW5kbGUgc2ltcGxpZmllZCBJU08gODYwMSBzdHJpbmdzXG4gICAgICAgIHZhciBwYXJzZVNoaW0gPSBmdW5jdGlvbiBwYXJzZShzdHJpbmcpIHtcbiAgICAgICAgICAgIHZhciBtYXRjaCA9IGlzb0RhdGVFeHByZXNzaW9uLmV4ZWMoc3RyaW5nKTtcbiAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgIC8vIHBhcnNlIG1vbnRocywgZGF5cywgaG91cnMsIG1pbnV0ZXMsIHNlY29uZHMsIGFuZCBtaWxsaXNlY29uZHNcbiAgICAgICAgICAgICAgICAvLyBwcm92aWRlIGRlZmF1bHQgdmFsdWVzIGlmIG5lY2Vzc2FyeVxuICAgICAgICAgICAgICAgIC8vIHBhcnNlIHRoZSBVVEMgb2Zmc2V0IGNvbXBvbmVudFxuICAgICAgICAgICAgICAgIHZhciB5ZWFyID0gTnVtYmVyKG1hdGNoWzFdKSxcbiAgICAgICAgICAgICAgICAgICAgbW9udGggPSBOdW1iZXIobWF0Y2hbMl0gfHwgMSkgLSAxLFxuICAgICAgICAgICAgICAgICAgICBkYXkgPSBOdW1iZXIobWF0Y2hbM10gfHwgMSkgLSAxLFxuICAgICAgICAgICAgICAgICAgICBob3VyID0gTnVtYmVyKG1hdGNoWzRdIHx8IDApLFxuICAgICAgICAgICAgICAgICAgICBtaW51dGUgPSBOdW1iZXIobWF0Y2hbNV0gfHwgMCksXG4gICAgICAgICAgICAgICAgICAgIHNlY29uZCA9IE51bWJlcihtYXRjaFs2XSB8fCAwKSxcbiAgICAgICAgICAgICAgICAgICAgbWlsbGlzZWNvbmQgPSBNYXRoLmZsb29yKE51bWJlcihtYXRjaFs3XSB8fCAwKSAqIDEwMDApLFxuICAgICAgICAgICAgICAgICAgICAvLyBXaGVuIHRpbWUgem9uZSBpcyBtaXNzZWQsIGxvY2FsIG9mZnNldCBzaG91bGQgYmUgdXNlZFxuICAgICAgICAgICAgICAgICAgICAvLyAoRVMgNS4xIGJ1ZylcbiAgICAgICAgICAgICAgICAgICAgLy8gc2VlIGh0dHBzOi8vYnVncy5lY21hc2NyaXB0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTEyXG4gICAgICAgICAgICAgICAgICAgIGlzTG9jYWxUaW1lID0gQm9vbGVhbihtYXRjaFs0XSAmJiAhbWF0Y2hbOF0pLFxuICAgICAgICAgICAgICAgICAgICBzaWduT2Zmc2V0ID0gbWF0Y2hbOV0gPT09ICctJyA/IDEgOiAtMSxcbiAgICAgICAgICAgICAgICAgICAgaG91ck9mZnNldCA9IE51bWJlcihtYXRjaFsxMF0gfHwgMCksXG4gICAgICAgICAgICAgICAgICAgIG1pbnV0ZU9mZnNldCA9IE51bWJlcihtYXRjaFsxMV0gfHwgMCksXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGhvdXIgPCAoXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW51dGUgPiAwIHx8IHNlY29uZCA+IDAgfHwgbWlsbGlzZWNvbmQgPiAwID9cbiAgICAgICAgICAgICAgICAgICAgICAgIDI0IDogMjVcbiAgICAgICAgICAgICAgICAgICAgKSAmJlxuICAgICAgICAgICAgICAgICAgICBtaW51dGUgPCA2MCAmJiBzZWNvbmQgPCA2MCAmJiBtaWxsaXNlY29uZCA8IDEwMDAgJiZcbiAgICAgICAgICAgICAgICAgICAgbW9udGggPiAtMSAmJiBtb250aCA8IDEyICYmIGhvdXJPZmZzZXQgPCAyNCAmJlxuICAgICAgICAgICAgICAgICAgICBtaW51dGVPZmZzZXQgPCA2MCAmJiAvLyBkZXRlY3QgaW52YWxpZCBvZmZzZXRzXG4gICAgICAgICAgICAgICAgICAgIGRheSA+IC0xICYmXG4gICAgICAgICAgICAgICAgICAgIGRheSA8IChcbiAgICAgICAgICAgICAgICAgICAgICAgIGRheUZyb21Nb250aCh5ZWFyLCBtb250aCArIDEpIC1cbiAgICAgICAgICAgICAgICAgICAgICAgIGRheUZyb21Nb250aCh5ZWFyLCBtb250aClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSAoXG4gICAgICAgICAgICAgICAgICAgICAgICAoZGF5RnJvbU1vbnRoKHllYXIsIG1vbnRoKSArIGRheSkgKiAyNCArXG4gICAgICAgICAgICAgICAgICAgICAgICBob3VyICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvdXJPZmZzZXQgKiBzaWduT2Zmc2V0XG4gICAgICAgICAgICAgICAgICAgICkgKiA2MDtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gKFxuICAgICAgICAgICAgICAgICAgICAgICAgKHJlc3VsdCArIG1pbnV0ZSArIG1pbnV0ZU9mZnNldCAqIHNpZ25PZmZzZXQpICogNjAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgc2Vjb25kXG4gICAgICAgICAgICAgICAgICAgICkgKiAxMDAwICsgbWlsbGlzZWNvbmQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0xvY2FsVGltZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdG9VVEMocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoLTguNjRlMTUgPD0gcmVzdWx0ICYmIHJlc3VsdCA8PSA4LjY0ZTE1KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gTmF0aXZlRGF0ZS5wYXJzZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgICAgICBkZWZpbmVQcm9wZXJ0aWVzKERhdGVTaGltLCB7IHBhcnNlOiBwYXJzZVNoaW0gfSk7XG5cbiAgICAgICAgcmV0dXJuIERhdGVTaGltO1xuICAgIH0oRGF0ZSkpO1xuICAgIC8qIGdsb2JhbCBEYXRlOiBmYWxzZSAqL1xufVxuXG4vLyBFUzUgMTUuOS40LjRcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjkuNC40XG5pZiAoIURhdGUubm93KSB7XG4gICAgRGF0ZS5ub3cgPSBmdW5jdGlvbiBub3coKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB9O1xufVxuXG4vL1xuLy8gTnVtYmVyXG4vLyA9PT09PT1cbi8vXG5cbi8vIEVTNS4xIDE1LjcuNC41XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS43LjQuNVxudmFyIGhhc1RvRml4ZWRCdWdzID0gTnVtYmVyUHJvdG90eXBlLnRvRml4ZWQgJiYgKFxuICAoMC4wMDAwOCkudG9GaXhlZCgzKSAhPT0gJzAuMDAwJyB8fFxuICAoMC45KS50b0ZpeGVkKDApICE9PSAnMScgfHxcbiAgKDEuMjU1KS50b0ZpeGVkKDIpICE9PSAnMS4yNScgfHxcbiAgKDEwMDAwMDAwMDAwMDAwMDAxMjgpLnRvRml4ZWQoMCkgIT09ICcxMDAwMDAwMDAwMDAwMDAwMTI4J1xuKTtcblxudmFyIHRvRml4ZWRIZWxwZXJzID0ge1xuICBiYXNlOiAxZTcsXG4gIHNpemU6IDYsXG4gIGRhdGE6IFswLCAwLCAwLCAwLCAwLCAwXSxcbiAgbXVsdGlwbHk6IGZ1bmN0aW9uIG11bHRpcGx5KG4sIGMpIHtcbiAgICAgIHZhciBpID0gLTE7XG4gICAgICB2YXIgYzIgPSBjO1xuICAgICAgd2hpbGUgKCsraSA8IHRvRml4ZWRIZWxwZXJzLnNpemUpIHtcbiAgICAgICAgICBjMiArPSBuICogdG9GaXhlZEhlbHBlcnMuZGF0YVtpXTtcbiAgICAgICAgICB0b0ZpeGVkSGVscGVycy5kYXRhW2ldID0gYzIgJSB0b0ZpeGVkSGVscGVycy5iYXNlO1xuICAgICAgICAgIGMyID0gTWF0aC5mbG9vcihjMiAvIHRvRml4ZWRIZWxwZXJzLmJhc2UpO1xuICAgICAgfVxuICB9LFxuICBkaXZpZGU6IGZ1bmN0aW9uIGRpdmlkZShuKSB7XG4gICAgICB2YXIgaSA9IHRvRml4ZWRIZWxwZXJzLnNpemUsIGMgPSAwO1xuICAgICAgd2hpbGUgKC0taSA+PSAwKSB7XG4gICAgICAgICAgYyArPSB0b0ZpeGVkSGVscGVycy5kYXRhW2ldO1xuICAgICAgICAgIHRvRml4ZWRIZWxwZXJzLmRhdGFbaV0gPSBNYXRoLmZsb29yKGMgLyBuKTtcbiAgICAgICAgICBjID0gKGMgJSBuKSAqIHRvRml4ZWRIZWxwZXJzLmJhc2U7XG4gICAgICB9XG4gIH0sXG4gIG51bVRvU3RyaW5nOiBmdW5jdGlvbiBudW1Ub1N0cmluZygpIHtcbiAgICAgIHZhciBpID0gdG9GaXhlZEhlbHBlcnMuc2l6ZTtcbiAgICAgIHZhciBzID0gJyc7XG4gICAgICB3aGlsZSAoLS1pID49IDApIHtcbiAgICAgICAgICBpZiAocyAhPT0gJycgfHwgaSA9PT0gMCB8fCB0b0ZpeGVkSGVscGVycy5kYXRhW2ldICE9PSAwKSB7XG4gICAgICAgICAgICAgIHZhciB0ID0gU3RyaW5nKHRvRml4ZWRIZWxwZXJzLmRhdGFbaV0pO1xuICAgICAgICAgICAgICBpZiAocyA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgIHMgPSB0O1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcyArPSAnMDAwMDAwMCcuc2xpY2UoMCwgNyAtIHQubGVuZ3RoKSArIHQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcztcbiAgfSxcbiAgcG93OiBmdW5jdGlvbiBwb3coeCwgbiwgYWNjKSB7XG4gICAgICByZXR1cm4gKG4gPT09IDAgPyBhY2MgOiAobiAlIDIgPT09IDEgPyBwb3coeCwgbiAtIDEsIGFjYyAqIHgpIDogcG93KHggKiB4LCBuIC8gMiwgYWNjKSkpO1xuICB9LFxuICBsb2c6IGZ1bmN0aW9uIGxvZyh4KSB7XG4gICAgICB2YXIgbiA9IDA7XG4gICAgICB2YXIgeDIgPSB4O1xuICAgICAgd2hpbGUgKHgyID49IDQwOTYpIHtcbiAgICAgICAgICBuICs9IDEyO1xuICAgICAgICAgIHgyIC89IDQwOTY7XG4gICAgICB9XG4gICAgICB3aGlsZSAoeDIgPj0gMikge1xuICAgICAgICAgIG4gKz0gMTtcbiAgICAgICAgICB4MiAvPSAyO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG47XG4gIH1cbn07XG5cbmRlZmluZVByb3BlcnRpZXMoTnVtYmVyUHJvdG90eXBlLCB7XG4gICAgdG9GaXhlZDogZnVuY3Rpb24gdG9GaXhlZChmcmFjdGlvbkRpZ2l0cykge1xuICAgICAgICB2YXIgZiwgeCwgcywgbSwgZSwgeiwgaiwgaztcblxuICAgICAgICAvLyBUZXN0IGZvciBOYU4gYW5kIHJvdW5kIGZyYWN0aW9uRGlnaXRzIGRvd25cbiAgICAgICAgZiA9IE51bWJlcihmcmFjdGlvbkRpZ2l0cyk7XG4gICAgICAgIGYgPSBmICE9PSBmID8gMCA6IE1hdGguZmxvb3IoZik7XG5cbiAgICAgICAgaWYgKGYgPCAwIHx8IGYgPiAyMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ051bWJlci50b0ZpeGVkIGNhbGxlZCB3aXRoIGludmFsaWQgbnVtYmVyIG9mIGRlY2ltYWxzJyk7XG4gICAgICAgIH1cblxuICAgICAgICB4ID0gTnVtYmVyKHRoaXMpO1xuXG4gICAgICAgIC8vIFRlc3QgZm9yIE5hTlxuICAgICAgICBpZiAoeCAhPT0geCkge1xuICAgICAgICAgICAgcmV0dXJuICdOYU4nO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgaXQgaXMgdG9vIGJpZyBvciBzbWFsbCwgcmV0dXJuIHRoZSBzdHJpbmcgdmFsdWUgb2YgdGhlIG51bWJlclxuICAgICAgICBpZiAoeCA8PSAtMWUyMSB8fCB4ID49IDFlMjEpIHtcbiAgICAgICAgICAgIHJldHVybiBTdHJpbmcoeCk7XG4gICAgICAgIH1cblxuICAgICAgICBzID0gJyc7XG5cbiAgICAgICAgaWYgKHggPCAwKSB7XG4gICAgICAgICAgICBzID0gJy0nO1xuICAgICAgICAgICAgeCA9IC14O1xuICAgICAgICB9XG5cbiAgICAgICAgbSA9ICcwJztcblxuICAgICAgICBpZiAoeCA+IDFlLTIxKSB7XG4gICAgICAgICAgICAvLyAxZS0yMSA8IHggPCAxZTIxXG4gICAgICAgICAgICAvLyAtNzAgPCBsb2cyKHgpIDwgNzBcbiAgICAgICAgICAgIGUgPSB0b0ZpeGVkSGVscGVycy5sb2coeCAqIHRvRml4ZWRIZWxwZXJzLnBvdygyLCA2OSwgMSkpIC0gNjk7XG4gICAgICAgICAgICB6ID0gKGUgPCAwID8geCAqIHRvRml4ZWRIZWxwZXJzLnBvdygyLCAtZSwgMSkgOiB4IC8gdG9GaXhlZEhlbHBlcnMucG93KDIsIGUsIDEpKTtcbiAgICAgICAgICAgIHogKj0gMHgxMDAwMDAwMDAwMDAwMDsgLy8gTWF0aC5wb3coMiwgNTIpO1xuICAgICAgICAgICAgZSA9IDUyIC0gZTtcblxuICAgICAgICAgICAgLy8gLTE4IDwgZSA8IDEyMlxuICAgICAgICAgICAgLy8geCA9IHogLyAyIF4gZVxuICAgICAgICAgICAgaWYgKGUgPiAwKSB7XG4gICAgICAgICAgICAgICAgdG9GaXhlZEhlbHBlcnMubXVsdGlwbHkoMCwgeik7XG4gICAgICAgICAgICAgICAgaiA9IGY7XG5cbiAgICAgICAgICAgICAgICB3aGlsZSAoaiA+PSA3KSB7XG4gICAgICAgICAgICAgICAgICAgIHRvRml4ZWRIZWxwZXJzLm11bHRpcGx5KDFlNywgMCk7XG4gICAgICAgICAgICAgICAgICAgIGogLT0gNztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0b0ZpeGVkSGVscGVycy5tdWx0aXBseSh0b0ZpeGVkSGVscGVycy5wb3coMTAsIGosIDEpLCAwKTtcbiAgICAgICAgICAgICAgICBqID0gZSAtIDE7XG5cbiAgICAgICAgICAgICAgICB3aGlsZSAoaiA+PSAyMykge1xuICAgICAgICAgICAgICAgICAgICB0b0ZpeGVkSGVscGVycy5kaXZpZGUoMSA8PCAyMyk7XG4gICAgICAgICAgICAgICAgICAgIGogLT0gMjM7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdG9GaXhlZEhlbHBlcnMuZGl2aWRlKDEgPDwgaik7XG4gICAgICAgICAgICAgICAgdG9GaXhlZEhlbHBlcnMubXVsdGlwbHkoMSwgMSk7XG4gICAgICAgICAgICAgICAgdG9GaXhlZEhlbHBlcnMuZGl2aWRlKDIpO1xuICAgICAgICAgICAgICAgIG0gPSB0b0ZpeGVkSGVscGVycy5udW1Ub1N0cmluZygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0b0ZpeGVkSGVscGVycy5tdWx0aXBseSgwLCB6KTtcbiAgICAgICAgICAgICAgICB0b0ZpeGVkSGVscGVycy5tdWx0aXBseSgxIDw8ICgtZSksIDApO1xuICAgICAgICAgICAgICAgIG0gPSB0b0ZpeGVkSGVscGVycy5udW1Ub1N0cmluZygpICsgJzAuMDAwMDAwMDAwMDAwMDAwMDAwMDAnLnNsaWNlKDIsIDIgKyBmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmID4gMCkge1xuICAgICAgICAgICAgayA9IG0ubGVuZ3RoO1xuXG4gICAgICAgICAgICBpZiAoayA8PSBmKSB7XG4gICAgICAgICAgICAgICAgbSA9IHMgKyAnMC4wMDAwMDAwMDAwMDAwMDAwMDAwJy5zbGljZSgwLCBmIC0gayArIDIpICsgbTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbSA9IHMgKyBtLnNsaWNlKDAsIGsgLSBmKSArICcuJyArIG0uc2xpY2UoayAtIGYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbSA9IHMgKyBtO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfVxufSwgaGFzVG9GaXhlZEJ1Z3MpO1xuXG4vL1xuLy8gU3RyaW5nXG4vLyA9PT09PT1cbi8vXG5cbi8vIEVTNSAxNS41LjQuMTRcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjUuNC4xNFxuXG4vLyBbYnVnZml4LCBJRSBsdCA5LCBmaXJlZm94IDQsIEtvbnF1ZXJvciwgT3BlcmEsIG9ic2N1cmUgYnJvd3NlcnNdXG4vLyBNYW55IGJyb3dzZXJzIGRvIG5vdCBzcGxpdCBwcm9wZXJseSB3aXRoIHJlZ3VsYXIgZXhwcmVzc2lvbnMgb3IgdGhleVxuLy8gZG8gbm90IHBlcmZvcm0gdGhlIHNwbGl0IGNvcnJlY3RseSB1bmRlciBvYnNjdXJlIGNvbmRpdGlvbnMuXG4vLyBTZWUgaHR0cDovL2Jsb2cuc3RldmVubGV2aXRoYW4uY29tL2FyY2hpdmVzL2Nyb3NzLWJyb3dzZXItc3BsaXRcbi8vIEkndmUgdGVzdGVkIGluIG1hbnkgYnJvd3NlcnMgYW5kIHRoaXMgc2VlbXMgdG8gY292ZXIgdGhlIGRldmlhbnQgb25lczpcbi8vICAgICdhYicuc3BsaXQoLyg/OmFiKSovKSBzaG91bGQgYmUgW1wiXCIsIFwiXCJdLCBub3QgW1wiXCJdXG4vLyAgICAnLicuc3BsaXQoLyguPykoLj8pLykgc2hvdWxkIGJlIFtcIlwiLCBcIi5cIiwgXCJcIiwgXCJcIl0sIG5vdCBbXCJcIiwgXCJcIl1cbi8vICAgICd0ZXNzdCcuc3BsaXQoLyhzKSovKSBzaG91bGQgYmUgW1widFwiLCB1bmRlZmluZWQsIFwiZVwiLCBcInNcIiwgXCJ0XCJdLCBub3Rcbi8vICAgICAgIFt1bmRlZmluZWQsIFwidFwiLCB1bmRlZmluZWQsIFwiZVwiLCAuLi5dXG4vLyAgICAnJy5zcGxpdCgvLj8vKSBzaG91bGQgYmUgW10sIG5vdCBbXCJcIl1cbi8vICAgICcuJy5zcGxpdCgvKCkoKS8pIHNob3VsZCBiZSBbXCIuXCJdLCBub3QgW1wiXCIsIFwiXCIsIFwiLlwiXVxuXG52YXIgc3RyaW5nX3NwbGl0ID0gU3RyaW5nUHJvdG90eXBlLnNwbGl0O1xuaWYgKFxuICAgICdhYicuc3BsaXQoLyg/OmFiKSovKS5sZW5ndGggIT09IDIgfHxcbiAgICAnLicuc3BsaXQoLyguPykoLj8pLykubGVuZ3RoICE9PSA0IHx8XG4gICAgJ3Rlc3N0Jy5zcGxpdCgvKHMpKi8pWzFdID09PSAndCcgfHxcbiAgICAndGVzdCcuc3BsaXQoLyg/OikvLCAtMSkubGVuZ3RoICE9PSA0IHx8XG4gICAgJycuc3BsaXQoLy4/LykubGVuZ3RoIHx8XG4gICAgJy4nLnNwbGl0KC8oKSgpLykubGVuZ3RoID4gMVxuKSB7XG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNvbXBsaWFudEV4ZWNOcGNnID0gdHlwZW9mICgvKCk/Py8pLmV4ZWMoJycpWzFdID09PSAndW5kZWZpbmVkJzsgLy8gTlBDRzogbm9ucGFydGljaXBhdGluZyBjYXB0dXJpbmcgZ3JvdXBcblxuICAgICAgICBTdHJpbmdQcm90b3R5cGUuc3BsaXQgPSBmdW5jdGlvbiAoc2VwYXJhdG9yLCBsaW1pdCkge1xuICAgICAgICAgICAgdmFyIHN0cmluZyA9IHRoaXM7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHNlcGFyYXRvciA9PT0gJ3VuZGVmaW5lZCcgJiYgbGltaXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIGBzZXBhcmF0b3JgIGlzIG5vdCBhIHJlZ2V4LCB1c2UgbmF0aXZlIHNwbGl0XG4gICAgICAgICAgICBpZiAoIWlzUmVnZXgoc2VwYXJhdG9yKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdHJpbmdfc3BsaXQuY2FsbCh0aGlzLCBzZXBhcmF0b3IsIGxpbWl0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG91dHB1dCA9IFtdO1xuICAgICAgICAgICAgdmFyIGZsYWdzID0gKHNlcGFyYXRvci5pZ25vcmVDYXNlID8gJ2knIDogJycpICtcbiAgICAgICAgICAgICAgICAgICAgICAgIChzZXBhcmF0b3IubXVsdGlsaW5lID8gJ20nIDogJycpICtcbiAgICAgICAgICAgICAgICAgICAgICAgIChzZXBhcmF0b3IuZXh0ZW5kZWQgPyAneCcgOiAnJykgKyAvLyBQcm9wb3NlZCBmb3IgRVM2XG4gICAgICAgICAgICAgICAgICAgICAgICAoc2VwYXJhdG9yLnN0aWNreSA/ICd5JyA6ICcnKSwgLy8gRmlyZWZveCAzK1xuICAgICAgICAgICAgICAgIGxhc3RMYXN0SW5kZXggPSAwLFxuICAgICAgICAgICAgICAgIC8vIE1ha2UgYGdsb2JhbGAgYW5kIGF2b2lkIGBsYXN0SW5kZXhgIGlzc3VlcyBieSB3b3JraW5nIHdpdGggYSBjb3B5XG4gICAgICAgICAgICAgICAgc2VwYXJhdG9yMiwgbWF0Y2gsIGxhc3RJbmRleCwgbGFzdExlbmd0aDtcbiAgICAgICAgICAgIHZhciBzZXBhcmF0b3JDb3B5ID0gbmV3IFJlZ0V4cChzZXBhcmF0b3Iuc291cmNlLCBmbGFncyArICdnJyk7XG4gICAgICAgICAgICBzdHJpbmcgKz0gJyc7IC8vIFR5cGUtY29udmVydFxuICAgICAgICAgICAgaWYgKCFjb21wbGlhbnRFeGVjTnBjZykge1xuICAgICAgICAgICAgICAgIC8vIERvZXNuJ3QgbmVlZCBmbGFncyBneSwgYnV0IHRoZXkgZG9uJ3QgaHVydFxuICAgICAgICAgICAgICAgIHNlcGFyYXRvcjIgPSBuZXcgUmVnRXhwKCdeJyArIHNlcGFyYXRvckNvcHkuc291cmNlICsgJyQoPyFcXFxccyknLCBmbGFncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBWYWx1ZXMgZm9yIGBsaW1pdGAsIHBlciB0aGUgc3BlYzpcbiAgICAgICAgICAgICAqIElmIHVuZGVmaW5lZDogNDI5NDk2NzI5NSAvLyBNYXRoLnBvdygyLCAzMikgLSAxXG4gICAgICAgICAgICAgKiBJZiAwLCBJbmZpbml0eSwgb3IgTmFOOiAwXG4gICAgICAgICAgICAgKiBJZiBwb3NpdGl2ZSBudW1iZXI6IGxpbWl0ID0gTWF0aC5mbG9vcihsaW1pdCk7IGlmIChsaW1pdCA+IDQyOTQ5NjcyOTUpIGxpbWl0IC09IDQyOTQ5NjcyOTY7XG4gICAgICAgICAgICAgKiBJZiBuZWdhdGl2ZSBudW1iZXI6IDQyOTQ5NjcyOTYgLSBNYXRoLmZsb29yKE1hdGguYWJzKGxpbWl0KSlcbiAgICAgICAgICAgICAqIElmIG90aGVyOiBUeXBlLWNvbnZlcnQsIHRoZW4gdXNlIHRoZSBhYm92ZSBydWxlc1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB2YXIgc3BsaXRMaW1pdCA9IHR5cGVvZiBsaW1pdCA9PT0gJ3VuZGVmaW5lZCcgP1xuICAgICAgICAgICAgICAgIC0xID4+PiAwIDogLy8gTWF0aC5wb3coMiwgMzIpIC0gMVxuICAgICAgICAgICAgICAgIEVTLlRvVWludDMyKGxpbWl0KTtcbiAgICAgICAgICAgIG1hdGNoID0gc2VwYXJhdG9yQ29weS5leGVjKHN0cmluZyk7XG4gICAgICAgICAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAvLyBgc2VwYXJhdG9yQ29weS5sYXN0SW5kZXhgIGlzIG5vdCByZWxpYWJsZSBjcm9zcy1icm93c2VyXG4gICAgICAgICAgICAgICAgbGFzdEluZGV4ID0gbWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgaWYgKGxhc3RJbmRleCA+IGxhc3RMYXN0SW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goc3RyaW5nLnNsaWNlKGxhc3RMYXN0SW5kZXgsIG1hdGNoLmluZGV4KSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIEZpeCBicm93c2VycyB3aG9zZSBgZXhlY2AgbWV0aG9kcyBkb24ndCBjb25zaXN0ZW50bHkgcmV0dXJuIGB1bmRlZmluZWRgIGZvclxuICAgICAgICAgICAgICAgICAgICAvLyBub25wYXJ0aWNpcGF0aW5nIGNhcHR1cmluZyBncm91cHNcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjb21wbGlhbnRFeGVjTnBjZyAmJiBtYXRjaC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1sb29wLWZ1bmMgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoWzBdLnJlcGxhY2Uoc2VwYXJhdG9yMiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aCAtIDI7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1tpXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoW2ldID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWxvb3AtZnVuYyAqL1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaC5sZW5ndGggPiAxICYmIG1hdGNoLmluZGV4IDwgc3RyaW5nLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJyYXlfcHVzaC5hcHBseShvdXRwdXQsIG1hdGNoLnNsaWNlKDEpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsYXN0TGVuZ3RoID0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBsYXN0TGFzdEluZGV4ID0gbGFzdEluZGV4O1xuICAgICAgICAgICAgICAgICAgICBpZiAob3V0cHV0Lmxlbmd0aCA+PSBzcGxpdExpbWl0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc2VwYXJhdG9yQ29weS5sYXN0SW5kZXggPT09IG1hdGNoLmluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcGFyYXRvckNvcHkubGFzdEluZGV4Kys7IC8vIEF2b2lkIGFuIGluZmluaXRlIGxvb3BcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbWF0Y2ggPSBzZXBhcmF0b3JDb3B5LmV4ZWMoc3RyaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsYXN0TGFzdEluZGV4ID09PSBzdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxhc3RMZW5ndGggfHwgIXNlcGFyYXRvckNvcHkudGVzdCgnJykpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goc3RyaW5nLnNsaWNlKGxhc3RMYXN0SW5kZXgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQubGVuZ3RoID4gc3BsaXRMaW1pdCA/IG91dHB1dC5zbGljZSgwLCBzcGxpdExpbWl0KSA6IG91dHB1dDtcbiAgICAgICAgfTtcbiAgICB9KCkpO1xuXG4vLyBbYnVnZml4LCBjaHJvbWVdXG4vLyBJZiBzZXBhcmF0b3IgaXMgdW5kZWZpbmVkLCB0aGVuIHRoZSByZXN1bHQgYXJyYXkgY29udGFpbnMganVzdCBvbmUgU3RyaW5nLFxuLy8gd2hpY2ggaXMgdGhlIHRoaXMgdmFsdWUgKGNvbnZlcnRlZCB0byBhIFN0cmluZykuIElmIGxpbWl0IGlzIG5vdCB1bmRlZmluZWQsXG4vLyB0aGVuIHRoZSBvdXRwdXQgYXJyYXkgaXMgdHJ1bmNhdGVkIHNvIHRoYXQgaXQgY29udGFpbnMgbm8gbW9yZSB0aGFuIGxpbWl0XG4vLyBlbGVtZW50cy5cbi8vIFwiMFwiLnNwbGl0KHVuZGVmaW5lZCwgMCkgLT4gW11cbn0gZWxzZSBpZiAoJzAnLnNwbGl0KHZvaWQgMCwgMCkubGVuZ3RoKSB7XG4gICAgU3RyaW5nUHJvdG90eXBlLnNwbGl0ID0gZnVuY3Rpb24gc3BsaXQoc2VwYXJhdG9yLCBsaW1pdCkge1xuICAgICAgICBpZiAodHlwZW9mIHNlcGFyYXRvciA9PT0gJ3VuZGVmaW5lZCcgJiYgbGltaXQgPT09IDApIHsgcmV0dXJuIFtdOyB9XG4gICAgICAgIHJldHVybiBzdHJpbmdfc3BsaXQuY2FsbCh0aGlzLCBzZXBhcmF0b3IsIGxpbWl0KTtcbiAgICB9O1xufVxuXG52YXIgc3RyX3JlcGxhY2UgPSBTdHJpbmdQcm90b3R5cGUucmVwbGFjZTtcbnZhciByZXBsYWNlUmVwb3J0c0dyb3Vwc0NvcnJlY3RseSA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGdyb3VwcyA9IFtdO1xuICAgICd4Jy5yZXBsYWNlKC94KC4pPy9nLCBmdW5jdGlvbiAobWF0Y2gsIGdyb3VwKSB7XG4gICAgICAgIGdyb3Vwcy5wdXNoKGdyb3VwKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZ3JvdXBzLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YgZ3JvdXBzWzBdID09PSAndW5kZWZpbmVkJztcbn0oKSk7XG5cbmlmICghcmVwbGFjZVJlcG9ydHNHcm91cHNDb3JyZWN0bHkpIHtcbiAgICBTdHJpbmdQcm90b3R5cGUucmVwbGFjZSA9IGZ1bmN0aW9uIHJlcGxhY2Uoc2VhcmNoVmFsdWUsIHJlcGxhY2VWYWx1ZSkge1xuICAgICAgICB2YXIgaXNGbiA9IGlzQ2FsbGFibGUocmVwbGFjZVZhbHVlKTtcbiAgICAgICAgdmFyIGhhc0NhcHR1cmluZ0dyb3VwcyA9IGlzUmVnZXgoc2VhcmNoVmFsdWUpICYmICgvXFwpWyo/XS8pLnRlc3Qoc2VhcmNoVmFsdWUuc291cmNlKTtcbiAgICAgICAgaWYgKCFpc0ZuIHx8ICFoYXNDYXB0dXJpbmdHcm91cHMpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHJfcmVwbGFjZS5jYWxsKHRoaXMsIHNlYXJjaFZhbHVlLCByZXBsYWNlVmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHdyYXBwZWRSZXBsYWNlVmFsdWUgPSBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB2YXIgb3JpZ2luYWxMYXN0SW5kZXggPSBzZWFyY2hWYWx1ZS5sYXN0SW5kZXg7XG4gICAgICAgICAgICAgICAgc2VhcmNoVmFsdWUubGFzdEluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IHNlYXJjaFZhbHVlLmV4ZWMobWF0Y2gpIHx8IFtdO1xuICAgICAgICAgICAgICAgIHNlYXJjaFZhbHVlLmxhc3RJbmRleCA9IG9yaWdpbmFsTGFzdEluZGV4O1xuICAgICAgICAgICAgICAgIGFyZ3MucHVzaChhcmd1bWVudHNbbGVuZ3RoIC0gMl0sIGFyZ3VtZW50c1tsZW5ndGggLSAxXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcGxhY2VWYWx1ZS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gc3RyX3JlcGxhY2UuY2FsbCh0aGlzLCBzZWFyY2hWYWx1ZSwgd3JhcHBlZFJlcGxhY2VWYWx1ZSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG4vLyBFQ01BLTI2MiwgM3JkIEIuMi4zXG4vLyBOb3QgYW4gRUNNQVNjcmlwdCBzdGFuZGFyZCwgYWx0aG91Z2ggRUNNQVNjcmlwdCAzcmQgRWRpdGlvbiBoYXMgYVxuLy8gbm9uLW5vcm1hdGl2ZSBzZWN0aW9uIHN1Z2dlc3RpbmcgdW5pZm9ybSBzZW1hbnRpY3MgYW5kIGl0IHNob3VsZCBiZVxuLy8gbm9ybWFsaXplZCBhY3Jvc3MgYWxsIGJyb3dzZXJzXG4vLyBbYnVnZml4LCBJRSBsdCA5XSBJRSA8IDkgc3Vic3RyKCkgd2l0aCBuZWdhdGl2ZSB2YWx1ZSBub3Qgd29ya2luZyBpbiBJRVxudmFyIHN0cmluZ19zdWJzdHIgPSBTdHJpbmdQcm90b3R5cGUuc3Vic3RyO1xudmFyIGhhc05lZ2F0aXZlU3Vic3RyQnVnID0gJycuc3Vic3RyICYmICcwYicuc3Vic3RyKC0xKSAhPT0gJ2InO1xuZGVmaW5lUHJvcGVydGllcyhTdHJpbmdQcm90b3R5cGUsIHtcbiAgICBzdWJzdHI6IGZ1bmN0aW9uIHN1YnN0cihzdGFydCwgbGVuZ3RoKSB7XG4gICAgICAgIHZhciBub3JtYWxpemVkU3RhcnQgPSBzdGFydDtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgICAgICAgbm9ybWFsaXplZFN0YXJ0ID0gTWF0aC5tYXgodGhpcy5sZW5ndGggKyBzdGFydCwgMCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0cmluZ19zdWJzdHIuY2FsbCh0aGlzLCBub3JtYWxpemVkU3RhcnQsIGxlbmd0aCk7XG4gICAgfVxufSwgaGFzTmVnYXRpdmVTdWJzdHJCdWcpO1xuXG4vLyBFUzUgMTUuNS40LjIwXG4vLyB3aGl0ZXNwYWNlIGZyb206IGh0dHA6Ly9lczUuZ2l0aHViLmlvLyN4MTUuNS40LjIwXG52YXIgd3MgPSAnXFx4MDlcXHgwQVxceDBCXFx4MENcXHgwRFxceDIwXFx4QTBcXHUxNjgwXFx1MTgwRVxcdTIwMDBcXHUyMDAxXFx1MjAwMlxcdTIwMDMnICtcbiAgICAnXFx1MjAwNFxcdTIwMDVcXHUyMDA2XFx1MjAwN1xcdTIwMDhcXHUyMDA5XFx1MjAwQVxcdTIwMkZcXHUyMDVGXFx1MzAwMFxcdTIwMjgnICtcbiAgICAnXFx1MjAyOVxcdUZFRkYnO1xudmFyIHplcm9XaWR0aCA9ICdcXHUyMDBiJztcbnZhciB3c1JlZ2V4Q2hhcnMgPSAnWycgKyB3cyArICddJztcbnZhciB0cmltQmVnaW5SZWdleHAgPSBuZXcgUmVnRXhwKCdeJyArIHdzUmVnZXhDaGFycyArIHdzUmVnZXhDaGFycyArICcqJyk7XG52YXIgdHJpbUVuZFJlZ2V4cCA9IG5ldyBSZWdFeHAod3NSZWdleENoYXJzICsgd3NSZWdleENoYXJzICsgJyokJyk7XG52YXIgaGFzVHJpbVdoaXRlc3BhY2VCdWcgPSBTdHJpbmdQcm90b3R5cGUudHJpbSAmJiAod3MudHJpbSgpIHx8ICF6ZXJvV2lkdGgudHJpbSgpKTtcbmRlZmluZVByb3BlcnRpZXMoU3RyaW5nUHJvdG90eXBlLCB7XG4gICAgLy8gaHR0cDovL2Jsb2cuc3RldmVubGV2aXRoYW4uY29tL2FyY2hpdmVzL2Zhc3Rlci10cmltLWphdmFzY3JpcHRcbiAgICAvLyBodHRwOi8vcGVyZmVjdGlvbmtpbGxzLmNvbS93aGl0ZXNwYWNlLWRldmlhdGlvbnMvXG4gICAgdHJpbTogZnVuY3Rpb24gdHJpbSgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzID09PSAndW5kZWZpbmVkJyB8fCB0aGlzID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiY2FuJ3QgY29udmVydCBcIiArIHRoaXMgKyAnIHRvIG9iamVjdCcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBTdHJpbmcodGhpcykucmVwbGFjZSh0cmltQmVnaW5SZWdleHAsICcnKS5yZXBsYWNlKHRyaW1FbmRSZWdleHAsICcnKTtcbiAgICB9XG59LCBoYXNUcmltV2hpdGVzcGFjZUJ1Zyk7XG5cbi8vIEVTLTUgMTUuMS4yLjJcbmlmIChwYXJzZUludCh3cyArICcwOCcpICE9PSA4IHx8IHBhcnNlSW50KHdzICsgJzB4MTYnKSAhPT0gMjIpIHtcbiAgICAvKiBnbG9iYWwgcGFyc2VJbnQ6IHRydWUgKi9cbiAgICBwYXJzZUludCA9IChmdW5jdGlvbiAob3JpZ1BhcnNlSW50KSB7XG4gICAgICAgIHZhciBoZXhSZWdleCA9IC9eMFt4WF0vO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gcGFyc2VJbnQoc3RyLCByYWRpeCkge1xuICAgICAgICAgICAgdmFyIHN0cmluZyA9IFN0cmluZyhzdHIpLnRyaW0oKTtcbiAgICAgICAgICAgIHZhciBkZWZhdWx0ZWRSYWRpeCA9IE51bWJlcihyYWRpeCkgfHwgKGhleFJlZ2V4LnRlc3Qoc3RyaW5nKSA/IDE2IDogMTApO1xuICAgICAgICAgICAgcmV0dXJuIG9yaWdQYXJzZUludChzdHJpbmcsIGRlZmF1bHRlZFJhZGl4KTtcbiAgICAgICAgfTtcbiAgICB9KHBhcnNlSW50KSk7XG59XG5cbn0pKTtcbiJdfQ==
