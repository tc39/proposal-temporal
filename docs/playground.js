(function (factory) {
	typeof define === 'function' && define.amd ? define(factory) :
	factory();
}(function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var polyfill_1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	/* eslint no-invalid-this: 1 */

	var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
	var slice = Array.prototype.slice;
	var toStr = Object.prototype.toString;
	var funcType = '[object Function]';

	var implementation = function bind(that) {
	    var target = this;
	    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
	        throw new TypeError(ERROR_MESSAGE + target);
	    }
	    var args = slice.call(arguments, 1);

	    var bound;
	    var binder = function () {
	        if (this instanceof bound) {
	            var result = target.apply(
	                this,
	                args.concat(slice.call(arguments))
	            );
	            if (Object(result) === result) {
	                return result;
	            }
	            return this;
	        } else {
	            return target.apply(
	                that,
	                args.concat(slice.call(arguments))
	            );
	        }
	    };

	    var boundLength = Math.max(0, target.length - args.length);
	    var boundArgs = [];
	    for (var i = 0; i < boundLength; i++) {
	        boundArgs.push('$' + i);
	    }

	    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

	    if (target.prototype) {
	        var Empty = function Empty() {};
	        Empty.prototype = target.prototype;
	        bound.prototype = new Empty();
	        Empty.prototype = null;
	    }

	    return bound;
	};

	var functionBind = Function.prototype.bind || implementation;

	var toStr$1 = Object.prototype.toString;

	var isArguments = function isArguments(value) {
		var str = toStr$1.call(value);
		var isArgs = str === '[object Arguments]';
		if (!isArgs) {
			isArgs = str !== '[object Array]' &&
				value !== null &&
				typeof value === 'object' &&
				typeof value.length === 'number' &&
				value.length >= 0 &&
				toStr$1.call(value.callee) === '[object Function]';
		}
		return isArgs;
	};

	var keysShim;
	if (!Object.keys) {
		// modified from https://github.com/es-shims/es5-shim
		var has = Object.prototype.hasOwnProperty;
		var toStr$2 = Object.prototype.toString;
		var isArgs = isArguments; // eslint-disable-line global-require
		var isEnumerable = Object.prototype.propertyIsEnumerable;
		var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
		var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
		var dontEnums = [
			'toString',
			'toLocaleString',
			'valueOf',
			'hasOwnProperty',
			'isPrototypeOf',
			'propertyIsEnumerable',
			'constructor'
		];
		var equalsConstructorPrototype = function (o) {
			var ctor = o.constructor;
			return ctor && ctor.prototype === o;
		};
		var excludedKeys = {
			$applicationCache: true,
			$console: true,
			$external: true,
			$frame: true,
			$frameElement: true,
			$frames: true,
			$innerHeight: true,
			$innerWidth: true,
			$onmozfullscreenchange: true,
			$onmozfullscreenerror: true,
			$outerHeight: true,
			$outerWidth: true,
			$pageXOffset: true,
			$pageYOffset: true,
			$parent: true,
			$scrollLeft: true,
			$scrollTop: true,
			$scrollX: true,
			$scrollY: true,
			$self: true,
			$webkitIndexedDB: true,
			$webkitStorageInfo: true,
			$window: true
		};
		var hasAutomationEqualityBug = (function () {
			/* global window */
			if (typeof window === 'undefined') { return false; }
			for (var k in window) {
				try {
					if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
						try {
							equalsConstructorPrototype(window[k]);
						} catch (e) {
							return true;
						}
					}
				} catch (e) {
					return true;
				}
			}
			return false;
		}());
		var equalsConstructorPrototypeIfNotBuggy = function (o) {
			/* global window */
			if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
				return equalsConstructorPrototype(o);
			}
			try {
				return equalsConstructorPrototype(o);
			} catch (e) {
				return false;
			}
		};

		keysShim = function keys(object) {
			var isObject = object !== null && typeof object === 'object';
			var isFunction = toStr$2.call(object) === '[object Function]';
			var isArguments = isArgs(object);
			var isString = isObject && toStr$2.call(object) === '[object String]';
			var theKeys = [];

			if (!isObject && !isFunction && !isArguments) {
				throw new TypeError('Object.keys called on a non-object');
			}

			var skipProto = hasProtoEnumBug && isFunction;
			if (isString && object.length > 0 && !has.call(object, 0)) {
				for (var i = 0; i < object.length; ++i) {
					theKeys.push(String(i));
				}
			}

			if (isArguments && object.length > 0) {
				for (var j = 0; j < object.length; ++j) {
					theKeys.push(String(j));
				}
			} else {
				for (var name in object) {
					if (!(skipProto && name === 'prototype') && has.call(object, name)) {
						theKeys.push(String(name));
					}
				}
			}

			if (hasDontEnumBug) {
				var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

				for (var k = 0; k < dontEnums.length; ++k) {
					if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
						theKeys.push(dontEnums[k]);
					}
				}
			}
			return theKeys;
		};
	}
	var implementation$1 = keysShim;

	var slice$1 = Array.prototype.slice;


	var origKeys = Object.keys;
	var keysShim$1 = origKeys ? function keys(o) { return origKeys(o); } : implementation$1;

	var originalKeys = Object.keys;

	keysShim$1.shim = function shimObjectKeys() {
		if (Object.keys) {
			var keysWorksWithArguments = (function () {
				// Safari 5.0 bug
				var args = Object.keys(arguments);
				return args && args.length === arguments.length;
			}(1, 2));
			if (!keysWorksWithArguments) {
				Object.keys = function keys(object) { // eslint-disable-line func-name-matching
					if (isArguments(object)) {
						return originalKeys(slice$1.call(object));
					}
					return originalKeys(object);
				};
			}
		} else {
			Object.keys = keysShim$1;
		}
		return Object.keys || keysShim$1;
	};

	var objectKeys = keysShim$1;

	var hasSymbols = typeof Symbol === 'function' && typeof Symbol('foo') === 'symbol';

	var toStr$3 = Object.prototype.toString;
	var concat = Array.prototype.concat;
	var origDefineProperty = Object.defineProperty;

	var isFunction = function (fn) {
		return typeof fn === 'function' && toStr$3.call(fn) === '[object Function]';
	};

	var arePropertyDescriptorsSupported = function () {
		var obj = {};
		try {
			origDefineProperty(obj, 'x', { enumerable: false, value: obj });
			// eslint-disable-next-line no-unused-vars, no-restricted-syntax
			for (var _ in obj) { // jscs:ignore disallowUnusedVariables
				return false;
			}
			return obj.x === obj;
		} catch (e) { /* this is IE 8. */
			return false;
		}
	};
	var supportsDescriptors = origDefineProperty && arePropertyDescriptorsSupported();

	var defineProperty = function (object, name, value, predicate) {
		if (name in object && (!isFunction(predicate) || !predicate())) {
			return;
		}
		if (supportsDescriptors) {
			origDefineProperty(object, name, {
				configurable: true,
				enumerable: false,
				value: value,
				writable: true
			});
		} else {
			object[name] = value;
		}
	};

	var defineProperties = function (object, map) {
		var predicates = arguments.length > 2 ? arguments[2] : {};
		var props = objectKeys(map);
		if (hasSymbols) {
			props = concat.call(props, Object.getOwnPropertySymbols(map));
		}
		for (var i = 0; i < props.length; i += 1) {
			defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
		}
	};

	defineProperties.supportsDescriptors = !!supportsDescriptors;

	var defineProperties_1 = defineProperties;

	var replace = functionBind.call(Function.call, String.prototype.replace);

	/* eslint-disable no-control-regex */
	var leftWhitespace = /^[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]*/;
	/* eslint-enable no-control-regex */

	var implementation$2 = function trimLeft() {
		return replace(this, leftWhitespace, '');
	};

	var polyfill = function getPolyfill() {
		if (!String.prototype.trimLeft) {
			return implementation$2;
		}
		var zeroWidthSpace = '\u200b';
		if (zeroWidthSpace.trimLeft() !== zeroWidthSpace) {
			return implementation$2;
		}
		return String.prototype.trimLeft;
	};

	var shim = function shimTrimLeft() {
		var polyfill$1 = polyfill();
		defineProperties_1(
			String.prototype,
			{ trimLeft: polyfill$1 },
			{ trimLeft: function () { return String.prototype.trimLeft !== polyfill$1; } }
		);
		return polyfill$1;
	};

	var bound = functionBind.call(Function.call, polyfill());

	defineProperties_1(bound, {
		getPolyfill: polyfill,
		implementation: implementation$2,
		shim: shim
	});

	var string_prototype_trimleft = bound;

	var replace$1 = functionBind.call(Function.call, String.prototype.replace);

	/* eslint-disable no-control-regex */
	var rightWhitespace = /[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]*$/;
	/* eslint-enable no-control-regex */

	var implementation$3 = function trimRight() {
		return replace$1(this, rightWhitespace, '');
	};

	var polyfill$1 = function getPolyfill() {
		if (!String.prototype.trimRight) {
			return implementation$3;
		}
		var zeroWidthSpace = '\u200b';
		if (zeroWidthSpace.trimRight() !== zeroWidthSpace) {
			return implementation$3;
		}
		return String.prototype.trimRight;
	};

	var shim$1 = function shimTrimRight() {
		var polyfill = polyfill$1();
		defineProperties_1(
			String.prototype,
			{ trimRight: polyfill },
			{ trimRight: function () { return String.prototype.trimRight !== polyfill; } }
		);
		return polyfill;
	};

	var bound$1 = functionBind.call(Function.call, polyfill$1());

	defineProperties_1(bound$1, {
		getPolyfill: polyfill$1,
		implementation: implementation$3,
		shim: shim$1
	});

	var string_prototype_trimright = bound$1;

	const inspect = (obj)=>(obj && 'object' === typeof obj)?`{ ${Object.entries(obj).map(([k,v])=>`${k}:${v}`).join(', ') } }`:`${obj}`;

	var util = /*#__PURE__*/Object.freeze({
	    __proto__: null,
	    inspect: inspect
	});

	var commonjsGlobal$1 = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	function getCjsExportFromNamespace (n) {
		return n && n['default'] || n;
	}

	var require$$0 = getCjsExportFromNamespace(util);

	var util_inspect = require$$0.inspect;

	var hasMap = typeof Map === 'function' && Map.prototype;
	var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;
	var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;
	var mapForEach = hasMap && Map.prototype.forEach;
	var hasSet = typeof Set === 'function' && Set.prototype;
	var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;
	var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;
	var setForEach = hasSet && Set.prototype.forEach;
	var booleanValueOf = Boolean.prototype.valueOf;
	var objectToString = Object.prototype.toString;
	var bigIntValueOf = typeof BigInt === 'function' ? BigInt.prototype.valueOf : null;

	var inspectCustom = util_inspect.custom;
	var inspectSymbol = (inspectCustom && isSymbol(inspectCustom)) ? inspectCustom : null;

	var objectInspect = function inspect_ (obj, opts, depth, seen) {
	    if (!opts) opts = {};

	    if (has$1(opts, 'quoteStyle') && (opts.quoteStyle !== 'single' && opts.quoteStyle !== 'double')) {
	        throw new TypeError('option "quoteStyle" must be "single" or "double"');
	    }

	    if (typeof obj === 'undefined') {
	        return 'undefined';
	    }
	    if (obj === null) {
	        return 'null';
	    }
	    if (typeof obj === 'boolean') {
	        return obj ? 'true' : 'false';
	    }

	    if (typeof obj === 'string') {
	        return inspectString(obj, opts);
	    }
	    if (typeof obj === 'number') {
	      if (obj === 0) {
	        return Infinity / obj > 0 ? '0' : '-0';
	      }
	      return String(obj);
	    }
	    if (typeof obj === 'bigint') {
	      return String(obj) + 'n';
	    }

	    var maxDepth = typeof opts.depth === 'undefined' ? 5 : opts.depth;
	    if (typeof depth === 'undefined') depth = 0;
	    if (depth >= maxDepth && maxDepth > 0 && typeof obj === 'object') {
	        return '[Object]';
	    }

	    if (typeof seen === 'undefined') seen = [];
	    else if (indexOf(seen, obj) >= 0) {
	        return '[Circular]';
	    }

	    function inspect (value, from) {
	        if (from) {
	            seen = seen.slice();
	            seen.push(from);
	        }
	        return inspect_(value, opts, depth + 1, seen);
	    }

	    if (typeof obj === 'function') {
	        var name = nameOf(obj);
	        return '[Function' + (name ? ': ' + name : '') + ']';
	    }
	    if (isSymbol(obj)) {
	        var symString = Symbol.prototype.toString.call(obj);
	        return typeof obj === 'object' ? markBoxed(symString) : symString;
	    }
	    if (isElement(obj)) {
	        var s = '<' + String(obj.nodeName).toLowerCase();
	        var attrs = obj.attributes || [];
	        for (var i = 0; i < attrs.length; i++) {
	            s += ' ' + attrs[i].name + '=' + wrapQuotes(quote(attrs[i].value), 'double', opts);
	        }
	        s += '>';
	        if (obj.childNodes && obj.childNodes.length) s += '...';
	        s += '</' + String(obj.nodeName).toLowerCase() + '>';
	        return s;
	    }
	    if (isArray(obj)) {
	        if (obj.length === 0) return '[]';
	        return '[ ' + arrObjKeys(obj, inspect).join(', ') + ' ]';
	    }
	    if (isError(obj)) {
	        var parts = arrObjKeys(obj, inspect);
	        if (parts.length === 0) return '[' + String(obj) + ']';
	        return '{ [' + String(obj) + '] ' + parts.join(', ') + ' }';
	    }
	    if (typeof obj === 'object') {
	        if (inspectSymbol && typeof obj[inspectSymbol] === 'function') {
	            return obj[inspectSymbol]();
	        } else if (typeof obj.inspect === 'function') {
	            return obj.inspect();
	        }
	    }
	    if (isMap(obj)) {
	        var parts = [];
	        mapForEach.call(obj, function (value, key) {
	            parts.push(inspect(key, obj) + ' => ' + inspect(value, obj));
	        });
	        return collectionOf('Map', mapSize.call(obj), parts);
	    }
	    if (isSet(obj)) {
	        var parts = [];
	        setForEach.call(obj, function (value ) {
	            parts.push(inspect(value, obj));
	        });
	        return collectionOf('Set', setSize.call(obj), parts);
	    }
	    if (isNumber(obj)) {
	        return markBoxed(inspect(Number(obj)));
	    }
	    if (isBigInt(obj)) {
	        return markBoxed(inspect(bigIntValueOf.call(obj)));
	    }
	    if (isBoolean(obj)) {
	        return markBoxed(booleanValueOf.call(obj));
	    }
	    if (isString(obj)) {
	        return markBoxed(inspect(String(obj)));
	    }
	    if (!isDate(obj) && !isRegExp(obj)) {
	        var xs = arrObjKeys(obj, inspect);
	        if (xs.length === 0) return '{}';
	        return '{ ' + xs.join(', ') + ' }';
	    }
	    return String(obj);
	};

	function wrapQuotes (s, defaultStyle, opts) {
	    var quoteChar = (opts.quoteStyle || defaultStyle) === 'double' ? '"' : "'";
	    return quoteChar + s + quoteChar;
	}

	function quote (s) {
	    return String(s).replace(/"/g, '&quot;');
	}

	function isArray (obj) { return toStr$4(obj) === '[object Array]'; }
	function isDate (obj) { return toStr$4(obj) === '[object Date]'; }
	function isRegExp (obj) { return toStr$4(obj) === '[object RegExp]'; }
	function isError (obj) { return toStr$4(obj) === '[object Error]'; }
	function isSymbol (obj) { return toStr$4(obj) === '[object Symbol]'; }
	function isString (obj) { return toStr$4(obj) === '[object String]'; }
	function isNumber (obj) { return toStr$4(obj) === '[object Number]'; }
	function isBigInt (obj) { return toStr$4(obj) === '[object BigInt]'; }
	function isBoolean (obj) { return toStr$4(obj) === '[object Boolean]'; }

	var hasOwn = Object.prototype.hasOwnProperty || function (key) { return key in this; };
	function has$1 (obj, key) {
	    return hasOwn.call(obj, key);
	}

	function toStr$4 (obj) {
	    return objectToString.call(obj);
	}

	function nameOf (f) {
	    if (f.name) return f.name;
	    var m = String(f).match(/^function\s*([\w$]+)/);
	    if (m) return m[1];
	}

	function indexOf (xs, x) {
	    if (xs.indexOf) return xs.indexOf(x);
	    for (var i = 0, l = xs.length; i < l; i++) {
	        if (xs[i] === x) return i;
	    }
	    return -1;
	}

	function isMap (x) {
	    if (!mapSize) {
	        return false;
	    }
	    try {
	        mapSize.call(x);
	        try {
	            setSize.call(x);
	        } catch (s) {
	            return true;
	        }
	        return x instanceof Map; // core-js workaround, pre-v2.5.0
	    } catch (e) {}
	    return false;
	}

	function isSet (x) {
	    if (!setSize) {
	        return false;
	    }
	    try {
	        setSize.call(x);
	        try {
	            mapSize.call(x);
	        } catch (m) {
	            return true;
	        }
	        return x instanceof Set; // core-js workaround, pre-v2.5.0
	    } catch (e) {}
	    return false;
	}

	function isElement (x) {
	    if (!x || typeof x !== 'object') return false;
	    if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
	        return true;
	    }
	    return typeof x.nodeName === 'string'
	        && typeof x.getAttribute === 'function'
	    ;
	}

	function inspectString (str, opts) {
	    var s = str.replace(/(['\\])/g, '\\$1').replace(/[\x00-\x1f]/g, lowbyte);
	    return wrapQuotes(s, 'single', opts);
	}

	function lowbyte (c) {
	    var n = c.charCodeAt(0);
	    var x = { 8: 'b', 9: 't', 10: 'n', 12: 'f', 13: 'r' }[n];
	    if (x) return '\\' + x;
	    return '\\x' + (n < 0x10 ? '0' : '') + n.toString(16);
	}

	function markBoxed (str) {
	    return 'Object(' + str + ')';
	}

	function collectionOf (type, size, entries) {
	    return type + ' (' + size + ') {' + entries.join(', ') + '}';
	}

	function arrObjKeys (obj, inspect) {
	    var isArr = isArray(obj);
	    var xs = [];
	    if (isArr) {
	        xs.length = obj.length;
	        for (var i = 0; i < obj.length; i++) {
	            xs[i] = has$1(obj, i) ? inspect(obj[i], obj) : '';
	        }
	    }
	    for (var key in obj) {
	        if (!has$1(obj, key)) continue;
	        if (isArr && String(Number(key)) === key && key < obj.length) continue;
	        if (/[^\w$]/.test(key)) {
	            xs.push(inspect(key, obj) + ': ' + inspect(obj[key], obj));
	        } else {
	            xs.push(key + ': ' + inspect(obj[key], obj));
	        }
	    }
	    return xs;
	}

	/* globals
		Atomics,
		SharedArrayBuffer,
	*/

	var undefined$1; // eslint-disable-line no-shadow-restricted-names

	var ThrowTypeError = Object.getOwnPropertyDescriptor
		? (function () { return Object.getOwnPropertyDescriptor(arguments, 'callee').get; }())
		: function () { throw new TypeError(); };

	var hasSymbols$1 = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';

	var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto
	var generatorFunction =  undefined$1;
	var asyncFunction =  undefined$1;
	var asyncGenFunction =  undefined$1;

	var TypedArray = typeof Uint8Array === 'undefined' ? undefined$1 : getProto(Uint8Array);

	var INTRINSICS = {
		'$ %Array%': Array,
		'$ %ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined$1 : ArrayBuffer,
		'$ %ArrayBufferPrototype%': typeof ArrayBuffer === 'undefined' ? undefined$1 : ArrayBuffer.prototype,
		'$ %ArrayIteratorPrototype%': hasSymbols$1 ? getProto([][Symbol.iterator]()) : undefined$1,
		'$ %ArrayPrototype%': Array.prototype,
		'$ %ArrayProto_entries%': Array.prototype.entries,
		'$ %ArrayProto_forEach%': Array.prototype.forEach,
		'$ %ArrayProto_keys%': Array.prototype.keys,
		'$ %ArrayProto_values%': Array.prototype.values,
		'$ %AsyncFromSyncIteratorPrototype%': undefined$1,
		'$ %AsyncFunction%': asyncFunction,
		'$ %AsyncFunctionPrototype%':  undefined$1,
		'$ %AsyncGenerator%':  undefined$1,
		'$ %AsyncGeneratorFunction%': asyncGenFunction,
		'$ %AsyncGeneratorPrototype%':  undefined$1,
		'$ %AsyncIteratorPrototype%':  undefined$1,
		'$ %Atomics%': typeof Atomics === 'undefined' ? undefined$1 : Atomics,
		'$ %Boolean%': Boolean,
		'$ %BooleanPrototype%': Boolean.prototype,
		'$ %DataView%': typeof DataView === 'undefined' ? undefined$1 : DataView,
		'$ %DataViewPrototype%': typeof DataView === 'undefined' ? undefined$1 : DataView.prototype,
		'$ %Date%': Date,
		'$ %DatePrototype%': Date.prototype,
		'$ %decodeURI%': decodeURI,
		'$ %decodeURIComponent%': decodeURIComponent,
		'$ %encodeURI%': encodeURI,
		'$ %encodeURIComponent%': encodeURIComponent,
		'$ %Error%': Error,
		'$ %ErrorPrototype%': Error.prototype,
		'$ %eval%': eval, // eslint-disable-line no-eval
		'$ %EvalError%': EvalError,
		'$ %EvalErrorPrototype%': EvalError.prototype,
		'$ %Float32Array%': typeof Float32Array === 'undefined' ? undefined$1 : Float32Array,
		'$ %Float32ArrayPrototype%': typeof Float32Array === 'undefined' ? undefined$1 : Float32Array.prototype,
		'$ %Float64Array%': typeof Float64Array === 'undefined' ? undefined$1 : Float64Array,
		'$ %Float64ArrayPrototype%': typeof Float64Array === 'undefined' ? undefined$1 : Float64Array.prototype,
		'$ %Function%': Function,
		'$ %FunctionPrototype%': Function.prototype,
		'$ %Generator%':  undefined$1,
		'$ %GeneratorFunction%': generatorFunction,
		'$ %GeneratorPrototype%':  undefined$1,
		'$ %Int8Array%': typeof Int8Array === 'undefined' ? undefined$1 : Int8Array,
		'$ %Int8ArrayPrototype%': typeof Int8Array === 'undefined' ? undefined$1 : Int8Array.prototype,
		'$ %Int16Array%': typeof Int16Array === 'undefined' ? undefined$1 : Int16Array,
		'$ %Int16ArrayPrototype%': typeof Int16Array === 'undefined' ? undefined$1 : Int8Array.prototype,
		'$ %Int32Array%': typeof Int32Array === 'undefined' ? undefined$1 : Int32Array,
		'$ %Int32ArrayPrototype%': typeof Int32Array === 'undefined' ? undefined$1 : Int32Array.prototype,
		'$ %isFinite%': isFinite,
		'$ %isNaN%': isNaN,
		'$ %IteratorPrototype%': hasSymbols$1 ? getProto(getProto([][Symbol.iterator]())) : undefined$1,
		'$ %JSON%': JSON,
		'$ %JSONParse%': JSON.parse,
		'$ %Map%': typeof Map === 'undefined' ? undefined$1 : Map,
		'$ %MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols$1 ? undefined$1 : getProto(new Map()[Symbol.iterator]()),
		'$ %MapPrototype%': typeof Map === 'undefined' ? undefined$1 : Map.prototype,
		'$ %Math%': Math,
		'$ %Number%': Number,
		'$ %NumberPrototype%': Number.prototype,
		'$ %Object%': Object,
		'$ %ObjectPrototype%': Object.prototype,
		'$ %ObjProto_toString%': Object.prototype.toString,
		'$ %ObjProto_valueOf%': Object.prototype.valueOf,
		'$ %parseFloat%': parseFloat,
		'$ %parseInt%': parseInt,
		'$ %Promise%': typeof Promise === 'undefined' ? undefined$1 : Promise,
		'$ %PromisePrototype%': typeof Promise === 'undefined' ? undefined$1 : Promise.prototype,
		'$ %PromiseProto_then%': typeof Promise === 'undefined' ? undefined$1 : Promise.prototype.then,
		'$ %Promise_all%': typeof Promise === 'undefined' ? undefined$1 : Promise.all,
		'$ %Promise_reject%': typeof Promise === 'undefined' ? undefined$1 : Promise.reject,
		'$ %Promise_resolve%': typeof Promise === 'undefined' ? undefined$1 : Promise.resolve,
		'$ %Proxy%': typeof Proxy === 'undefined' ? undefined$1 : Proxy,
		'$ %RangeError%': RangeError,
		'$ %RangeErrorPrototype%': RangeError.prototype,
		'$ %ReferenceError%': ReferenceError,
		'$ %ReferenceErrorPrototype%': ReferenceError.prototype,
		'$ %Reflect%': typeof Reflect === 'undefined' ? undefined$1 : Reflect,
		'$ %RegExp%': RegExp,
		'$ %RegExpPrototype%': RegExp.prototype,
		'$ %Set%': typeof Set === 'undefined' ? undefined$1 : Set,
		'$ %SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols$1 ? undefined$1 : getProto(new Set()[Symbol.iterator]()),
		'$ %SetPrototype%': typeof Set === 'undefined' ? undefined$1 : Set.prototype,
		'$ %SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined$1 : SharedArrayBuffer,
		'$ %SharedArrayBufferPrototype%': typeof SharedArrayBuffer === 'undefined' ? undefined$1 : SharedArrayBuffer.prototype,
		'$ %String%': String,
		'$ %StringIteratorPrototype%': hasSymbols$1 ? getProto(''[Symbol.iterator]()) : undefined$1,
		'$ %StringPrototype%': String.prototype,
		'$ %Symbol%': hasSymbols$1 ? Symbol : undefined$1,
		'$ %SymbolPrototype%': hasSymbols$1 ? Symbol.prototype : undefined$1,
		'$ %SyntaxError%': SyntaxError,
		'$ %SyntaxErrorPrototype%': SyntaxError.prototype,
		'$ %ThrowTypeError%': ThrowTypeError,
		'$ %TypedArray%': TypedArray,
		'$ %TypedArrayPrototype%': TypedArray ? TypedArray.prototype : undefined$1,
		'$ %TypeError%': TypeError,
		'$ %TypeErrorPrototype%': TypeError.prototype,
		'$ %Uint8Array%': typeof Uint8Array === 'undefined' ? undefined$1 : Uint8Array,
		'$ %Uint8ArrayPrototype%': typeof Uint8Array === 'undefined' ? undefined$1 : Uint8Array.prototype,
		'$ %Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined$1 : Uint8ClampedArray,
		'$ %Uint8ClampedArrayPrototype%': typeof Uint8ClampedArray === 'undefined' ? undefined$1 : Uint8ClampedArray.prototype,
		'$ %Uint16Array%': typeof Uint16Array === 'undefined' ? undefined$1 : Uint16Array,
		'$ %Uint16ArrayPrototype%': typeof Uint16Array === 'undefined' ? undefined$1 : Uint16Array.prototype,
		'$ %Uint32Array%': typeof Uint32Array === 'undefined' ? undefined$1 : Uint32Array,
		'$ %Uint32ArrayPrototype%': typeof Uint32Array === 'undefined' ? undefined$1 : Uint32Array.prototype,
		'$ %URIError%': URIError,
		'$ %URIErrorPrototype%': URIError.prototype,
		'$ %WeakMap%': typeof WeakMap === 'undefined' ? undefined$1 : WeakMap,
		'$ %WeakMapPrototype%': typeof WeakMap === 'undefined' ? undefined$1 : WeakMap.prototype,
		'$ %WeakSet%': typeof WeakSet === 'undefined' ? undefined$1 : WeakSet,
		'$ %WeakSetPrototype%': typeof WeakSet === 'undefined' ? undefined$1 : WeakSet.prototype
	};

	var GetIntrinsic = function GetIntrinsic(name, allowMissing) {
		if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
			throw new TypeError('"allowMissing" argument must be a boolean');
		}

		var key = '$ ' + name;
		if (!(key in INTRINSICS)) {
			throw new SyntaxError('intrinsic ' + name + ' does not exist!');
		}

		// istanbul ignore if // hopefully this is impossible to test :-)
		if (typeof INTRINSICS[key] === 'undefined' && !allowMissing) {
			throw new TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}
		return INTRINSICS[key];
	};

	/* eslint complexity: [2, 17], max-statements: [2, 33] */
	var shams = function hasSymbols() {
		if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
		if (typeof Symbol.iterator === 'symbol') { return true; }

		var obj = {};
		var sym = Symbol('test');
		var symObj = Object(sym);
		if (typeof sym === 'string') { return false; }

		if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
		if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

		// temp disabled per https://github.com/ljharb/object.assign/issues/17
		// if (sym instanceof Symbol) { return false; }
		// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
		// if (!(symObj instanceof Symbol)) { return false; }

		// if (typeof Symbol.prototype.toString !== 'function') { return false; }
		// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

		var symVal = 42;
		obj[sym] = symVal;
		for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax
		if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

		if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

		var syms = Object.getOwnPropertySymbols(obj);
		if (syms.length !== 1 || syms[0] !== sym) { return false; }

		if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

		if (typeof Object.getOwnPropertyDescriptor === 'function') {
			var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
			if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
		}

		return true;
	};

	var origSymbol = commonjsGlobal$1.Symbol;


	var hasSymbols$2 = function hasNativeSymbols() {
		if (typeof origSymbol !== 'function') { return false; }
		if (typeof Symbol !== 'function') { return false; }
		if (typeof origSymbol('foo') !== 'symbol') { return false; }
		if (typeof Symbol('bar') !== 'symbol') { return false; }

		return shams();
	};

	var src = functionBind.call(Function.call, Object.prototype.hasOwnProperty);

	var isPrimitive = function isPrimitive(value) {
		return value === null || (typeof value !== 'function' && typeof value !== 'object');
	};

	var fnToStr = Function.prototype.toString;

	var constructorRegex = /^\s*class\b/;
	var isES6ClassFn = function isES6ClassFunction(value) {
		try {
			var fnStr = fnToStr.call(value);
			return constructorRegex.test(fnStr);
		} catch (e) {
			return false; // not a function
		}
	};

	var tryFunctionObject = function tryFunctionToStr(value) {
		try {
			if (isES6ClassFn(value)) { return false; }
			fnToStr.call(value);
			return true;
		} catch (e) {
			return false;
		}
	};
	var toStr$5 = Object.prototype.toString;
	var fnClass = '[object Function]';
	var genClass = '[object GeneratorFunction]';
	var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

	var isCallable = function isCallable(value) {
		if (!value) { return false; }
		if (typeof value !== 'function' && typeof value !== 'object') { return false; }
		if (typeof value === 'function' && !value.prototype) { return true; }
		if (hasToStringTag) { return tryFunctionObject(value); }
		if (isES6ClassFn(value)) { return false; }
		var strClass = toStr$5.call(value);
		return strClass === fnClass || strClass === genClass;
	};

	var getDay = Date.prototype.getDay;
	var tryDateObject = function tryDateObject(value) {
		try {
			getDay.call(value);
			return true;
		} catch (e) {
			return false;
		}
	};

	var toStr$6 = Object.prototype.toString;
	var dateClass = '[object Date]';
	var hasToStringTag$1 = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

	var isDateObject = function isDateObject(value) {
		if (typeof value !== 'object' || value === null) { return false; }
		return hasToStringTag$1 ? tryDateObject(value) : toStr$6.call(value) === dateClass;
	};

	var isSymbol$1 = createCommonjsModule(function (module) {

	var toStr = Object.prototype.toString;
	var hasSymbols = hasSymbols$2();

	if (hasSymbols) {
		var symToStr = Symbol.prototype.toString;
		var symStringRegex = /^Symbol\(.*\)$/;
		var isSymbolObject = function isRealSymbolObject(value) {
			if (typeof value.valueOf() !== 'symbol') {
				return false;
			}
			return symStringRegex.test(symToStr.call(value));
		};

		module.exports = function isSymbol(value) {
			if (typeof value === 'symbol') {
				return true;
			}
			if (toStr.call(value) !== '[object Symbol]') {
				return false;
			}
			try {
				return isSymbolObject(value);
			} catch (e) {
				return false;
			}
		};
	} else {

		module.exports = function isSymbol(value) {
			// this environment does not support Symbols.
			return false ;
		};
	}
	});

	var hasSymbols$3 = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';






	var ordinaryToPrimitive = function OrdinaryToPrimitive(O, hint) {
		if (typeof O === 'undefined' || O === null) {
			throw new TypeError('Cannot call method on ' + O);
		}
		if (typeof hint !== 'string' || (hint !== 'number' && hint !== 'string')) {
			throw new TypeError('hint must be "string" or "number"');
		}
		var methodNames = hint === 'string' ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
		var method, result, i;
		for (i = 0; i < methodNames.length; ++i) {
			method = O[methodNames[i]];
			if (isCallable(method)) {
				result = method.call(O);
				if (isPrimitive(result)) {
					return result;
				}
			}
		}
		throw new TypeError('No default value');
	};

	var GetMethod = function GetMethod(O, P) {
		var func = O[P];
		if (func !== null && typeof func !== 'undefined') {
			if (!isCallable(func)) {
				throw new TypeError(func + ' returned for property ' + P + ' of object ' + O + ' is not a function');
			}
			return func;
		}
		return void 0;
	};

	// http://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive
	var es2015 = function ToPrimitive(input) {
		if (isPrimitive(input)) {
			return input;
		}
		var hint = 'default';
		if (arguments.length > 1) {
			if (arguments[1] === String) {
				hint = 'string';
			} else if (arguments[1] === Number) {
				hint = 'number';
			}
		}

		var exoticToPrim;
		if (hasSymbols$3) {
			if (Symbol.toPrimitive) {
				exoticToPrim = GetMethod(input, Symbol.toPrimitive);
			} else if (isSymbol$1(input)) {
				exoticToPrim = Symbol.prototype.valueOf;
			}
		}
		if (typeof exoticToPrim !== 'undefined') {
			var result = exoticToPrim.call(input, hint);
			if (isPrimitive(result)) {
				return result;
			}
			throw new TypeError('unable to convert exotic object to primitive');
		}
		if (hint === 'default' && (isDateObject(input) || isSymbol$1(input))) {
			hint = 'string';
		}
		return ordinaryToPrimitive(input, hint === 'default' ? 'number' : hint);
	};

	var es6 = es2015;

	var $TypeError = GetIntrinsic('%TypeError%');
	var $SyntaxError = GetIntrinsic('%SyntaxError%');



	var predicates = {
		// https://ecma-international.org/ecma-262/6.0/#sec-property-descriptor-specification-type
		'Property Descriptor': function isPropertyDescriptor(ES, Desc) {
			if (ES.Type(Desc) !== 'Object') {
				return false;
			}
			var allowed = {
				'[[Configurable]]': true,
				'[[Enumerable]]': true,
				'[[Get]]': true,
				'[[Set]]': true,
				'[[Value]]': true,
				'[[Writable]]': true
			};

			for (var key in Desc) { // eslint-disable-line
				if (src(Desc, key) && !allowed[key]) {
					return false;
				}
			}

			var isData = src(Desc, '[[Value]]');
			var IsAccessor = src(Desc, '[[Get]]') || src(Desc, '[[Set]]');
			if (isData && IsAccessor) {
				throw new $TypeError('Property Descriptors may not be both accessor and data descriptors');
			}
			return true;
		}
	};

	var assertRecord = function assertRecord(ES, recordType, argumentName, value) {
		var predicate = predicates[recordType];
		if (typeof predicate !== 'function') {
			throw new $SyntaxError('unknown record type: ' + recordType);
		}
		if (!predicate(ES, value)) {
			throw new $TypeError(argumentName + ' must be a ' + recordType);
		}
	};

	var _isNaN = Number.isNaN || function isNaN(a) {
		return a !== a;
	};

	var $isNaN = Number.isNaN || function (a) { return a !== a; };

	var _isFinite = Number.isFinite || function (x) { return typeof x === 'number' && !$isNaN(x) && x !== Infinity && x !== -Infinity; };

	var $assign = GetIntrinsic('%Object%').assign;

	var assign = function assign(target, source) {
		if ($assign) {
			return $assign(target, source);
		}

		// eslint-disable-next-line no-restricted-syntax
		for (var key in source) {
			if (src(source, key)) {
				target[key] = source[key];
			}
		}
		return target;
	};

	var sign = function sign(number) {
		return number >= 0 ? 1 : -1;
	};

	var mod = function mod(number, modulo) {
		var remain = number % modulo;
		return Math.floor(remain >= 0 ? remain : remain + modulo);
	};

	var isPrimitive$1 = function isPrimitive(value) {
		return value === null || (typeof value !== 'function' && typeof value !== 'object');
	};

	var forEach = function forEach(array, callback) {
		for (var i = 0; i < array.length; i += 1) {
			callback(array[i], i, array); // eslint-disable-line callback-return
		}
	};

	var every = function every(array, predicate) {
		for (var i = 0; i < array.length; i += 1) {
			if (!predicate(array[i], i, array)) {
				return false;
			}
		}
		return true;
	};

	var isSamePropertyDescriptor = function isSamePropertyDescriptor(ES, D1, D2) {
		var fields = [
			'[[Configurable]]',
			'[[Enumerable]]',
			'[[Get]]',
			'[[Set]]',
			'[[Value]]',
			'[[Writable]]'
		];
		return every(fields, function (field) {
			if ((field in D1) !== (field in D2)) {
				return false;
			}
			return ES.SameValue(D1[field], D2[field]);
		});
	};

	var $TypeError$1 = GetIntrinsic('%TypeError%');

	var isPropertyDescriptor = function IsPropertyDescriptor(ES, Desc) {
		if (ES.Type(Desc) !== 'Object') {
			return false;
		}
		var allowed = {
			'[[Configurable]]': true,
			'[[Enumerable]]': true,
			'[[Get]]': true,
			'[[Set]]': true,
			'[[Value]]': true,
			'[[Writable]]': true
		};

	    for (var key in Desc) { // eslint-disable-line
			if (src(Desc, key) && !allowed[key]) {
				return false;
			}
		}

		if (ES.IsDataDescriptor(Desc) && ES.IsAccessorDescriptor(Desc)) {
			throw new $TypeError$1('Property Descriptors may not be both accessor and data descriptors');
		}
		return true;
	};

	var $Function = GetIntrinsic('%Function%');
	var $apply = $Function.apply;
	var $call = $Function.call;

	var callBind = function callBind() {
		return functionBind.apply($call, arguments);
	};

	var apply = function applyBind() {
		return functionBind.apply($apply, arguments);
	};
	callBind.apply = apply;

	var toStr$7 = Object.prototype.toString;





	// http://ecma-international.org/ecma-262/5.1/#sec-8.12.8
	var ES5internalSlots = {
		'[[DefaultValue]]': function (O) {
			var actualHint;
			if (arguments.length > 1) {
				actualHint = arguments[1];
			} else {
				actualHint = toStr$7.call(O) === '[object Date]' ? String : Number;
			}

			if (actualHint === String || actualHint === Number) {
				var methods = actualHint === String ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
				var value, i;
				for (i = 0; i < methods.length; ++i) {
					if (isCallable(O[methods[i]])) {
						value = O[methods[i]]();
						if (isPrimitive(value)) {
							return value;
						}
					}
				}
				throw new TypeError('No default value');
			}
			throw new TypeError('invalid [[DefaultValue]] hint supplied');
		}
	};

	// http://ecma-international.org/ecma-262/5.1/#sec-9.1
	var es5 = function ToPrimitive(input) {
		if (isPrimitive(input)) {
			return input;
		}
		if (arguments.length > 1) {
			return ES5internalSlots['[[DefaultValue]]'](input, arguments[1]);
		}
		return ES5internalSlots['[[DefaultValue]]'](input);
	};

	var $Object = GetIntrinsic('%Object%');
	var $TypeError$2 = GetIntrinsic('%TypeError%');
	var $String = GetIntrinsic('%String%');
	var $Number = GetIntrinsic('%Number%');















	var strSlice = callBind($String.prototype.slice);

	var isPrefixOf = function isPrefixOf(prefix, string) {
		if (prefix === string) {
			return true;
		}
		if (prefix.length > string.length) {
			return false;
		}
		return strSlice(string, 0, prefix.length) === prefix;
	};

	// https://es5.github.io/#x9
	var ES5 = {
		ToPrimitive: es5,

		ToBoolean: function ToBoolean(value) {
			return !!value;
		},
		ToNumber: function ToNumber(value) {
			return +value; // eslint-disable-line no-implicit-coercion
		},
		ToInteger: function ToInteger(value) {
			var number = this.ToNumber(value);
			if (_isNaN(number)) { return 0; }
			if (number === 0 || !_isFinite(number)) { return number; }
			return sign(number) * Math.floor(Math.abs(number));
		},
		ToInt32: function ToInt32(x) {
			return this.ToNumber(x) >> 0;
		},
		ToUint32: function ToUint32(x) {
			return this.ToNumber(x) >>> 0;
		},
		ToUint16: function ToUint16(value) {
			var number = this.ToNumber(value);
			if (_isNaN(number) || number === 0 || !_isFinite(number)) { return 0; }
			var posInt = sign(number) * Math.floor(Math.abs(number));
			return mod(posInt, 0x10000);
		},
		ToString: function ToString(value) {
			return $String(value);
		},
		ToObject: function ToObject(value) {
			this.CheckObjectCoercible(value);
			return $Object(value);
		},
		CheckObjectCoercible: function CheckObjectCoercible(value, optMessage) {
			/* jshint eqnull:true */
			if (value == null) {
				throw new $TypeError$2(optMessage || 'Cannot call method on ' + value);
			}
			return value;
		},
		IsCallable: isCallable,
		SameValue: function SameValue(x, y) {
			if (x === y) { // 0 === -0, but they are not identical.
				if (x === 0) { return 1 / x === 1 / y; }
				return true;
			}
			return _isNaN(x) && _isNaN(y);
		},

		// https://www.ecma-international.org/ecma-262/5.1/#sec-8
		Type: function Type(x) {
			if (x === null) {
				return 'Null';
			}
			if (typeof x === 'undefined') {
				return 'Undefined';
			}
			if (typeof x === 'function' || typeof x === 'object') {
				return 'Object';
			}
			if (typeof x === 'number') {
				return 'Number';
			}
			if (typeof x === 'boolean') {
				return 'Boolean';
			}
			if (typeof x === 'string') {
				return 'String';
			}
		},

		// https://ecma-international.org/ecma-262/6.0/#sec-property-descriptor-specification-type
		IsPropertyDescriptor: function IsPropertyDescriptor(Desc) {
			return isPropertyDescriptor(this, Desc);
		},

		// https://ecma-international.org/ecma-262/5.1/#sec-8.10.1
		IsAccessorDescriptor: function IsAccessorDescriptor(Desc) {
			if (typeof Desc === 'undefined') {
				return false;
			}

			assertRecord(this, 'Property Descriptor', 'Desc', Desc);

			if (!src(Desc, '[[Get]]') && !src(Desc, '[[Set]]')) {
				return false;
			}

			return true;
		},

		// https://ecma-international.org/ecma-262/5.1/#sec-8.10.2
		IsDataDescriptor: function IsDataDescriptor(Desc) {
			if (typeof Desc === 'undefined') {
				return false;
			}

			assertRecord(this, 'Property Descriptor', 'Desc', Desc);

			if (!src(Desc, '[[Value]]') && !src(Desc, '[[Writable]]')) {
				return false;
			}

			return true;
		},

		// https://ecma-international.org/ecma-262/5.1/#sec-8.10.3
		IsGenericDescriptor: function IsGenericDescriptor(Desc) {
			if (typeof Desc === 'undefined') {
				return false;
			}

			assertRecord(this, 'Property Descriptor', 'Desc', Desc);

			if (!this.IsAccessorDescriptor(Desc) && !this.IsDataDescriptor(Desc)) {
				return true;
			}

			return false;
		},

		// https://ecma-international.org/ecma-262/5.1/#sec-8.10.4
		FromPropertyDescriptor: function FromPropertyDescriptor(Desc) {
			if (typeof Desc === 'undefined') {
				return Desc;
			}

			assertRecord(this, 'Property Descriptor', 'Desc', Desc);

			if (this.IsDataDescriptor(Desc)) {
				return {
					value: Desc['[[Value]]'],
					writable: !!Desc['[[Writable]]'],
					enumerable: !!Desc['[[Enumerable]]'],
					configurable: !!Desc['[[Configurable]]']
				};
			} else if (this.IsAccessorDescriptor(Desc)) {
				return {
					get: Desc['[[Get]]'],
					set: Desc['[[Set]]'],
					enumerable: !!Desc['[[Enumerable]]'],
					configurable: !!Desc['[[Configurable]]']
				};
			} else {
				throw new $TypeError$2('FromPropertyDescriptor must be called with a fully populated Property Descriptor');
			}
		},

		// https://ecma-international.org/ecma-262/5.1/#sec-8.10.5
		ToPropertyDescriptor: function ToPropertyDescriptor(Obj) {
			if (this.Type(Obj) !== 'Object') {
				throw new $TypeError$2('ToPropertyDescriptor requires an object');
			}

			var desc = {};
			if (src(Obj, 'enumerable')) {
				desc['[[Enumerable]]'] = this.ToBoolean(Obj.enumerable);
			}
			if (src(Obj, 'configurable')) {
				desc['[[Configurable]]'] = this.ToBoolean(Obj.configurable);
			}
			if (src(Obj, 'value')) {
				desc['[[Value]]'] = Obj.value;
			}
			if (src(Obj, 'writable')) {
				desc['[[Writable]]'] = this.ToBoolean(Obj.writable);
			}
			if (src(Obj, 'get')) {
				var getter = Obj.get;
				if (typeof getter !== 'undefined' && !this.IsCallable(getter)) {
					throw new TypeError('getter must be a function');
				}
				desc['[[Get]]'] = getter;
			}
			if (src(Obj, 'set')) {
				var setter = Obj.set;
				if (typeof setter !== 'undefined' && !this.IsCallable(setter)) {
					throw new $TypeError$2('setter must be a function');
				}
				desc['[[Set]]'] = setter;
			}

			if ((src(desc, '[[Get]]') || src(desc, '[[Set]]')) && (src(desc, '[[Value]]') || src(desc, '[[Writable]]'))) {
				throw new $TypeError$2('Invalid property descriptor. Cannot both specify accessors and a value or writable attribute');
			}
			return desc;
		},

		// https://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3
		'Abstract Equality Comparison': function AbstractEqualityComparison(x, y) {
			var xType = this.Type(x);
			var yType = this.Type(y);
			if (xType === yType) {
				return x === y; // ES6+ specified this shortcut anyways.
			}
			if (x == null && y == null) {
				return true;
			}
			if (xType === 'Number' && yType === 'String') {
				return this['Abstract Equality Comparison'](x, this.ToNumber(y));
			}
			if (xType === 'String' && yType === 'Number') {
				return this['Abstract Equality Comparison'](this.ToNumber(x), y);
			}
			if (xType === 'Boolean') {
				return this['Abstract Equality Comparison'](this.ToNumber(x), y);
			}
			if (yType === 'Boolean') {
				return this['Abstract Equality Comparison'](x, this.ToNumber(y));
			}
			if ((xType === 'String' || xType === 'Number') && yType === 'Object') {
				return this['Abstract Equality Comparison'](x, this.ToPrimitive(y));
			}
			if (xType === 'Object' && (yType === 'String' || yType === 'Number')) {
				return this['Abstract Equality Comparison'](this.ToPrimitive(x), y);
			}
			return false;
		},

		// https://www.ecma-international.org/ecma-262/5.1/#sec-11.9.6
		'Strict Equality Comparison': function StrictEqualityComparison(x, y) {
			var xType = this.Type(x);
			var yType = this.Type(y);
			if (xType !== yType) {
				return false;
			}
			if (xType === 'Undefined' || xType === 'Null') {
				return true;
			}
			return x === y; // shortcut for steps 4-7
		},

		// https://www.ecma-international.org/ecma-262/5.1/#sec-11.8.5
		// eslint-disable-next-line max-statements
		'Abstract Relational Comparison': function AbstractRelationalComparison(x, y, LeftFirst) {
			if (this.Type(LeftFirst) !== 'Boolean') {
				throw new $TypeError$2('Assertion failed: LeftFirst argument must be a Boolean');
			}
			var px;
			var py;
			if (LeftFirst) {
				px = this.ToPrimitive(x, $Number);
				py = this.ToPrimitive(y, $Number);
			} else {
				py = this.ToPrimitive(y, $Number);
				px = this.ToPrimitive(x, $Number);
			}
			var bothStrings = this.Type(px) === 'String' && this.Type(py) === 'String';
			if (!bothStrings) {
				var nx = this.ToNumber(px);
				var ny = this.ToNumber(py);
				if (_isNaN(nx) || _isNaN(ny)) {
					return undefined;
				}
				if (_isFinite(nx) && _isFinite(ny) && nx === ny) {
					return false;
				}
				if (nx === 0 && ny === 0) {
					return false;
				}
				if (nx === Infinity) {
					return false;
				}
				if (ny === Infinity) {
					return true;
				}
				if (ny === -Infinity) {
					return false;
				}
				if (nx === -Infinity) {
					return true;
				}
				return nx < ny; // by now, these are both nonzero, finite, and not equal
			}
			if (isPrefixOf(py, px)) {
				return false;
			}
			if (isPrefixOf(px, py)) {
				return true;
			}
			return px < py; // both strings, neither a prefix of the other. shortcut for steps c-f
		}
	};

	var es5$1 = ES5;

	var regexExec = RegExp.prototype.exec;
	var gOPD = Object.getOwnPropertyDescriptor;

	var tryRegexExecCall = function tryRegexExec(value) {
		try {
			var lastIndex = value.lastIndex;
			value.lastIndex = 0;

			regexExec.call(value);
			return true;
		} catch (e) {
			return false;
		} finally {
			value.lastIndex = lastIndex;
		}
	};
	var toStr$8 = Object.prototype.toString;
	var regexClass = '[object RegExp]';
	var hasToStringTag$2 = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

	var isRegex = function isRegex(value) {
		if (!value || typeof value !== 'object') {
			return false;
		}
		if (!hasToStringTag$2) {
			return toStr$8.call(value) === regexClass;
		}

		var descriptor = gOPD(value, 'lastIndex');
		var hasLastIndexDataProperty = descriptor && src(descriptor, 'value');
		if (!hasLastIndexDataProperty) {
			return false;
		}

		return tryRegexExecCall(value);
	};

	var $TypeError$3 = GetIntrinsic('%TypeError%');
	var $RangeError = GetIntrinsic('%RangeError%');
	var $SyntaxError$1 = GetIntrinsic('%SyntaxError%');
	var $Array = GetIntrinsic('%Array%');
	var $ArrayPrototype = $Array.prototype;
	var $String$1 = GetIntrinsic('%String%');
	var $Object$1 = GetIntrinsic('%Object%');
	var $Number$1 = GetIntrinsic('%Number%');
	var $Symbol = GetIntrinsic('%Symbol%', true);
	var $RegExp = GetIntrinsic('%RegExp%');
	var $Promise = GetIntrinsic('%Promise%', true);
	var $preventExtensions = $Object$1.preventExtensions;

	var hasSymbols$4 = hasSymbols$2();




	var MAX_ARRAY_LENGTH = Math.pow(2, 32) - 1;
	var MAX_SAFE_INTEGER = $Number$1.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;









	var parseInteger = parseInt;

	var $PromiseThen = $Promise ? callBind(GetIntrinsic('%PromiseProto_then%')) : null;
	var arraySlice = callBind($Array.prototype.slice);
	var strSlice$1 = callBind($String$1.prototype.slice);
	var isBinary = callBind($RegExp.prototype.test, /^0b[01]+$/i);
	var isOctal = callBind($RegExp.prototype.test, /^0o[0-7]+$/i);
	var isDigit = callBind($RegExp.prototype.test, /^[0-9]$/);
	var regexExec$1 = callBind($RegExp.prototype.exec);
	var nonWS = ['\u0085', '\u200b', '\ufffe'].join('');
	var nonWSregex = new $RegExp('[' + nonWS + ']', 'g');
	var hasNonWS = callBind($RegExp.prototype.test, nonWSregex);
	var invalidHexLiteral = /^[-+]0x[0-9a-f]+$/i;
	var isInvalidHexLiteral = callBind($RegExp.prototype.test, invalidHexLiteral);
	var $charCodeAt = callBind($String$1.prototype.charCodeAt);
	var $isEnumerable = callBind($Object$1.prototype.propertyIsEnumerable);

	var toStr$9 = callBind($Object$1.prototype.toString);

	var $NumberValueOf = callBind(GetIntrinsic('%NumberPrototype%').valueOf);
	var $BooleanValueOf = callBind(GetIntrinsic('%BooleanPrototype%').valueOf);
	var $StringValueOf = callBind(GetIntrinsic('%StringPrototype%').valueOf);
	var $DateValueOf = callBind(GetIntrinsic('%DatePrototype%').valueOf);
	var $SymbolToString = hasSymbols$4 && callBind(GetIntrinsic('%SymbolPrototype%').toString);

	var $floor = Math.floor;
	var $abs = Math.abs;

	var $ObjectCreate = $Object$1.create;
	var $gOPD = $Object$1.getOwnPropertyDescriptor;
	var $gOPN = $Object$1.getOwnPropertyNames;
	var $gOPS = $Object$1.getOwnPropertySymbols;
	var $isExtensible = $Object$1.isExtensible;
	var $defineProperty = $Object$1.defineProperty;
	var $setProto = Object.setPrototypeOf || (
		// eslint-disable-next-line no-proto, no-negated-condition
		[].__proto__ !== Array.prototype
			? null
			: function (O, proto) {
				O.__proto__ = proto; // eslint-disable-line no-proto
				return O;
			}
	);

	var DefineOwnProperty = function DefineOwnProperty(ES, O, P, desc) {
		if (!$defineProperty) {
			if (!ES.IsDataDescriptor(desc)) {
				// ES3 does not support getters/setters
				return false;
			}
			if (!desc['[[Configurable]]'] || !desc['[[Writable]]']) {
				return false;
			}

			// fallback for ES3
			if (P in O && $isEnumerable(O, P) !== !!desc['[[Enumerable]]']) {
				// a non-enumerable existing property
				return false;
			}

			// property does not exist at all, or exists but is enumerable
			var V = desc['[[Value]]'];
			O[P] = V; // will use [[Define]]
			return ES.SameValue(O[P], V);
		}
		$defineProperty(O, P, ES.FromPropertyDescriptor(desc));
		return true;
	};

	// whitespace from: https://es5.github.io/#x15.5.4.20
	// implementation from https://github.com/es-shims/es5-shim/blob/v3.4.0/es5-shim.js#L1304-L1324
	var ws = [
		'\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003',
		'\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028',
		'\u2029\uFEFF'
	].join('');
	var trimRegex = new RegExp('(^[' + ws + ']+)|([' + ws + ']+$)', 'g');
	var $replace = callBind($String$1.prototype.replace);
	var trim = function (value) {
		return $replace(value, trimRegex, '');
	};





	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-abstract-operations
	var ES6 = assign(assign({}, es5$1), {

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-call-f-v-args
		Call: function Call(F, V) {
			var args = arguments.length > 2 ? arguments[2] : [];
			if (!this.IsCallable(F)) {
				throw new $TypeError$3(objectInspect(F) + ' is not a function');
			}
			return F.apply(V, args);
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toprimitive
		ToPrimitive: es6,

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toboolean
		// ToBoolean: ES5.ToBoolean,

		// https://ecma-international.org/ecma-262/6.0/#sec-tonumber
		ToNumber: function ToNumber(argument) {
			var value = isPrimitive$1(argument) ? argument : es6(argument, $Number$1);
			if (typeof value === 'symbol') {
				throw new $TypeError$3('Cannot convert a Symbol value to a number');
			}
			if (typeof value === 'string') {
				if (isBinary(value)) {
					return this.ToNumber(parseInteger(strSlice$1(value, 2), 2));
				} else if (isOctal(value)) {
					return this.ToNumber(parseInteger(strSlice$1(value, 2), 8));
				} else if (hasNonWS(value) || isInvalidHexLiteral(value)) {
					return NaN;
				} else {
					var trimmed = trim(value);
					if (trimmed !== value) {
						return this.ToNumber(trimmed);
					}
				}
			}
			return $Number$1(value);
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tointeger
		// ToInteger: ES5.ToNumber,

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint32
		// ToInt32: ES5.ToInt32,

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint32
		// ToUint32: ES5.ToUint32,

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint16
		ToInt16: function ToInt16(argument) {
			var int16bit = this.ToUint16(argument);
			return int16bit >= 0x8000 ? int16bit - 0x10000 : int16bit;
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint16
		// ToUint16: ES5.ToUint16,

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint8
		ToInt8: function ToInt8(argument) {
			var int8bit = this.ToUint8(argument);
			return int8bit >= 0x80 ? int8bit - 0x100 : int8bit;
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint8
		ToUint8: function ToUint8(argument) {
			var number = this.ToNumber(argument);
			if (_isNaN(number) || number === 0 || !_isFinite(number)) { return 0; }
			var posInt = sign(number) * $floor($abs(number));
			return mod(posInt, 0x100);
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint8clamp
		ToUint8Clamp: function ToUint8Clamp(argument) {
			var number = this.ToNumber(argument);
			if (_isNaN(number) || number <= 0) { return 0; }
			if (number >= 0xFF) { return 0xFF; }
			var f = $floor(argument);
			if (f + 0.5 < number) { return f + 1; }
			if (number < f + 0.5) { return f; }
			if (f % 2 !== 0) { return f + 1; }
			return f;
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tostring
		ToString: function ToString(argument) {
			if (typeof argument === 'symbol') {
				throw new $TypeError$3('Cannot convert a Symbol value to a string');
			}
			return $String$1(argument);
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toobject
		ToObject: function ToObject(value) {
			this.RequireObjectCoercible(value);
			return $Object$1(value);
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-topropertykey
		ToPropertyKey: function ToPropertyKey(argument) {
			var key = this.ToPrimitive(argument, $String$1);
			return typeof key === 'symbol' ? key : this.ToString(key);
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
		ToLength: function ToLength(argument) {
			var len = this.ToInteger(argument);
			if (len <= 0) { return 0; } // includes converting -0 to +0
			if (len > MAX_SAFE_INTEGER) { return MAX_SAFE_INTEGER; }
			return len;
		},

		// https://ecma-international.org/ecma-262/6.0/#sec-canonicalnumericindexstring
		CanonicalNumericIndexString: function CanonicalNumericIndexString(argument) {
			if (toStr$9(argument) !== '[object String]') {
				throw new $TypeError$3('must be a string');
			}
			if (argument === '-0') { return -0; }
			var n = this.ToNumber(argument);
			if (this.SameValue(this.ToString(n), argument)) { return n; }
			return void 0;
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-requireobjectcoercible
		RequireObjectCoercible: es5$1.CheckObjectCoercible,

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isarray
		IsArray: $Array.isArray || function IsArray(argument) {
			return toStr$9(argument) === '[object Array]';
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-iscallable
		// IsCallable: ES5.IsCallable,

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isconstructor
		IsConstructor: function IsConstructor(argument) {
			return typeof argument === 'function' && !!argument.prototype; // unfortunately there's no way to truly check this without try/catch `new argument`
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isextensible-o
		IsExtensible: $preventExtensions
			? function IsExtensible(obj) {
				if (isPrimitive$1(obj)) {
					return false;
				}
				return $isExtensible(obj);
			}
			: function isExtensible(obj) { return true; }, // eslint-disable-line no-unused-vars

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isinteger
		IsInteger: function IsInteger(argument) {
			if (typeof argument !== 'number' || _isNaN(argument) || !_isFinite(argument)) {
				return false;
			}
			var abs = $abs(argument);
			return $floor(abs) === abs;
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-ispropertykey
		IsPropertyKey: function IsPropertyKey(argument) {
			return typeof argument === 'string' || typeof argument === 'symbol';
		},

		// https://ecma-international.org/ecma-262/6.0/#sec-isregexp
		IsRegExp: function IsRegExp(argument) {
			if (!argument || typeof argument !== 'object') {
				return false;
			}
			if (hasSymbols$4) {
				var isRegExp = argument[$Symbol.match];
				if (typeof isRegExp !== 'undefined') {
					return es5$1.ToBoolean(isRegExp);
				}
			}
			return isRegex(argument);
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevalue
		// SameValue: ES5.SameValue,

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero
		SameValueZero: function SameValueZero(x, y) {
			return (x === y) || (_isNaN(x) && _isNaN(y));
		},

		/**
		 * 7.3.2 GetV (V, P)
		 * 1. Assert: IsPropertyKey(P) is true.
		 * 2. Let O be ToObject(V).
		 * 3. ReturnIfAbrupt(O).
		 * 4. Return O.[[Get]](P, V).
		 */
		GetV: function GetV(V, P) {
			// 7.3.2.1
			if (!this.IsPropertyKey(P)) {
				throw new $TypeError$3('Assertion failed: IsPropertyKey(P) is not true');
			}

			// 7.3.2.2-3
			var O = this.ToObject(V);

			// 7.3.2.4
			return O[P];
		},

		/**
		 * 7.3.9 - https://ecma-international.org/ecma-262/6.0/#sec-getmethod
		 * 1. Assert: IsPropertyKey(P) is true.
		 * 2. Let func be GetV(O, P).
		 * 3. ReturnIfAbrupt(func).
		 * 4. If func is either undefined or null, return undefined.
		 * 5. If IsCallable(func) is false, throw a TypeError exception.
		 * 6. Return func.
		 */
		GetMethod: function GetMethod(O, P) {
			// 7.3.9.1
			if (!this.IsPropertyKey(P)) {
				throw new $TypeError$3('Assertion failed: IsPropertyKey(P) is not true');
			}

			// 7.3.9.2
			var func = this.GetV(O, P);

			// 7.3.9.4
			if (func == null) {
				return void 0;
			}

			// 7.3.9.5
			if (!this.IsCallable(func)) {
				throw new $TypeError$3(P + 'is not a function');
			}

			// 7.3.9.6
			return func;
		},

		/**
		 * 7.3.1 Get (O, P) - https://ecma-international.org/ecma-262/6.0/#sec-get-o-p
		 * 1. Assert: Type(O) is Object.
		 * 2. Assert: IsPropertyKey(P) is true.
		 * 3. Return O.[[Get]](P, O).
		 */
		Get: function Get(O, P) {
			// 7.3.1.1
			if (this.Type(O) !== 'Object') {
				throw new $TypeError$3('Assertion failed: Type(O) is not Object');
			}
			// 7.3.1.2
			if (!this.IsPropertyKey(P)) {
				throw new $TypeError$3('Assertion failed: IsPropertyKey(P) is not true, got ' + objectInspect(P));
			}
			// 7.3.1.3
			return O[P];
		},

		Type: function Type(x) {
			if (typeof x === 'symbol') {
				return 'Symbol';
			}
			return es5$1.Type(x);
		},

		// https://ecma-international.org/ecma-262/6.0/#sec-speciesconstructor
		SpeciesConstructor: function SpeciesConstructor(O, defaultConstructor) {
			if (this.Type(O) !== 'Object') {
				throw new $TypeError$3('Assertion failed: Type(O) is not Object');
			}
			var C = O.constructor;
			if (typeof C === 'undefined') {
				return defaultConstructor;
			}
			if (this.Type(C) !== 'Object') {
				throw new $TypeError$3('O.constructor is not an Object');
			}
			var S = hasSymbols$4 && $Symbol.species ? C[$Symbol.species] : void 0;
			if (S == null) {
				return defaultConstructor;
			}
			if (this.IsConstructor(S)) {
				return S;
			}
			throw new $TypeError$3('no constructor found');
		},

		// https://www.ecma-international.org/ecma-262/6.0/#sec-frompropertydescriptor
		FromPropertyDescriptor: function FromPropertyDescriptor(Desc) {
			if (typeof Desc === 'undefined') {
				return Desc;
			}

			assertRecord(this, 'Property Descriptor', 'Desc', Desc);

			var obj = {};
			if ('[[Value]]' in Desc) {
				obj.value = Desc['[[Value]]'];
			}
			if ('[[Writable]]' in Desc) {
				obj.writable = Desc['[[Writable]]'];
			}
			if ('[[Get]]' in Desc) {
				obj.get = Desc['[[Get]]'];
			}
			if ('[[Set]]' in Desc) {
				obj.set = Desc['[[Set]]'];
			}
			if ('[[Enumerable]]' in Desc) {
				obj.enumerable = Desc['[[Enumerable]]'];
			}
			if ('[[Configurable]]' in Desc) {
				obj.configurable = Desc['[[Configurable]]'];
			}
			return obj;
		},

		// https://ecma-international.org/ecma-262/6.0/#sec-completepropertydescriptor
		CompletePropertyDescriptor: function CompletePropertyDescriptor(Desc) {
			assertRecord(this, 'Property Descriptor', 'Desc', Desc);

			if (this.IsGenericDescriptor(Desc) || this.IsDataDescriptor(Desc)) {
				if (!src(Desc, '[[Value]]')) {
					Desc['[[Value]]'] = void 0;
				}
				if (!src(Desc, '[[Writable]]')) {
					Desc['[[Writable]]'] = false;
				}
			} else {
				if (!src(Desc, '[[Get]]')) {
					Desc['[[Get]]'] = void 0;
				}
				if (!src(Desc, '[[Set]]')) {
					Desc['[[Set]]'] = void 0;
				}
			}
			if (!src(Desc, '[[Enumerable]]')) {
				Desc['[[Enumerable]]'] = false;
			}
			if (!src(Desc, '[[Configurable]]')) {
				Desc['[[Configurable]]'] = false;
			}
			return Desc;
		},

		// https://ecma-international.org/ecma-262/6.0/#sec-set-o-p-v-throw
		Set: function Set(O, P, V, Throw) {
			if (this.Type(O) !== 'Object') {
				throw new $TypeError$3('O must be an Object');
			}
			if (!this.IsPropertyKey(P)) {
				throw new $TypeError$3('P must be a Property Key');
			}
			if (this.Type(Throw) !== 'Boolean') {
				throw new $TypeError$3('Throw must be a Boolean');
			}
			if (Throw) {
				O[P] = V;
				return true;
			} else {
				try {
					O[P] = V;
				} catch (e) {
					return false;
				}
			}
		},

		// https://ecma-international.org/ecma-262/6.0/#sec-hasownproperty
		HasOwnProperty: function HasOwnProperty(O, P) {
			if (this.Type(O) !== 'Object') {
				throw new $TypeError$3('O must be an Object');
			}
			if (!this.IsPropertyKey(P)) {
				throw new $TypeError$3('P must be a Property Key');
			}
			return src(O, P);
		},

		// https://ecma-international.org/ecma-262/6.0/#sec-hasproperty
		HasProperty: function HasProperty(O, P) {
			if (this.Type(O) !== 'Object') {
				throw new $TypeError$3('O must be an Object');
			}
			if (!this.IsPropertyKey(P)) {
				throw new $TypeError$3('P must be a Property Key');
			}
			return P in O;
		},

		// https://ecma-international.org/ecma-262/6.0/#sec-isconcatspreadable
		IsConcatSpreadable: function IsConcatSpreadable(O) {
			if (this.Type(O) !== 'Object') {
				return false;
			}
			if (hasSymbols$4 && typeof $Symbol.isConcatSpreadable === 'symbol') {
				var spreadable = this.Get(O, Symbol.isConcatSpreadable);
				if (typeof spreadable !== 'undefined') {
					return this.ToBoolean(spreadable);
				}
			}
			return this.IsArray(O);
		},

		// https://ecma-international.org/ecma-262/6.0/#sec-invoke
		Invoke: function Invoke(O, P) {
			if (!this.IsPropertyKey(P)) {
				throw new $TypeError$3('P must be a Property Key');
			}
			var argumentsList = arraySlice(arguments, 2);
			var func = this.GetV(O, P);
			return this.Call(func, O, argumentsList);
		},

		// https://ecma-international.org/ecma-262/6.0/#sec-getiterator
		GetIterator: function GetIterator(obj, method) {
			var actualMethod = method;
			if (arguments.length < 2) {
				if (!hasSymbols$4) {
					throw new SyntaxError('GetIterator depends on native Symbol support when `method` is not passed');
				}
				actualMethod = this.GetMethod(obj, $Symbol.iterator);
			}
			var iterator = this.Call(actualMethod, obj);
			if (this.Type(iterator) !== 'Object') {
				throw new $TypeError$3('iterator must return an object');
			}

			return iterator;
		},

		// https://ecma-international.org/ecma-262/6.0/#sec-iteratornext
		IteratorNext: function IteratorNext(iterator, value) {
			var result = this.Invoke(iterator, 'next', arguments.length < 2 ? [] : [value]);
			if (this.Type(result) !== 'Object') {
				throw new $TypeError$3('iterator next must return an object');
			}
			return result;
		},

		// https://ecma-international.org/ecma-262/6.0/#sec-iteratorcomplete
		IteratorComplete: function IteratorComplete(iterResult) {
			if (this.Type(iterResult) !== 'Object') {
				throw new $TypeError$3('Assertion failed: Type(iterResult) is not Object');
			}
			return this.ToBoolean(this.Get(iterResult, 'done'));
		},

		// https://ecma-international.org/ecma-262/6.0/#sec-iteratorvalue
		IteratorValue: function IteratorValue(iterResult) {
			if (this.Type(iterResult) !== 'Object') {
				throw new $TypeError$3('Assertion failed: Type(iterResult) is not Object');
			}
			return this.Get(iterResult, 'value');
		},

		// https://ecma-international.org/ecma-262/6.0/#sec-iteratorstep
		IteratorStep: function IteratorStep(iterator) {
			var result = this.IteratorNext(iterator);
			var done = this.IteratorComplete(result);
			return done === true ? false : result;
		},

		// https://ecma-international.org/ecma-262/6.0/#sec-iteratorclose
		IteratorClose: function IteratorClose(iterator, completion) {
			if (this.Type(iterator) !== 'Object') {
				throw new $TypeError$3('Assertion failed: Type(iterator) is not Object');
			}
			if (!this.IsCallable(completion)) {
				throw new $TypeError$3('Assertion failed: completion is not a thunk for a Completion Record');
			}
			var completionThunk = completion;

			var iteratorReturn = this.GetMethod(iterator, 'return');

			if (typeof iteratorReturn === 'undefined') {
				return completionThunk();
			}

			var completionRecord;
			try {
				var innerResult = this.Call(iteratorReturn, iterator, []);
			} catch (e) {
				// if we hit here, then "e" is the innerResult completion that needs re-throwing

				// if the completion is of type "throw", this will throw.
				completionRecord = completionThunk();
				completionThunk = null; // ensure it's not called twice.

				// if not, then return the innerResult completion
				throw e;
			}
			completionRecord = completionThunk(); // if innerResult worked, then throw if the completion does
			completionThunk = null; // ensure it's not called twice.

			if (this.Type(innerResult) !== 'Object') {
				throw new $TypeError$3('iterator .return must return an object');
			}

			return completionRecord;
		},

		// https://ecma-international.org/ecma-262/6.0/#sec-createiterresultobject
		CreateIterResultObject: function CreateIterResultObject(value, done) {
			if (this.Type(done) !== 'Boolean') {
				throw new $TypeError$3('Assertion failed: Type(done) is not Boolean');
			}
			return {
				value: value,
				done: done
			};
		},

		// https://ecma-international.org/ecma-262/6.0/#sec-regexpexec
		RegExpExec: function RegExpExec(R, S) {
			if (this.Type(R) !== 'Object') {
				throw new $TypeError$3('R must be an Object');
			}
			if (this.Type(S) !== 'String') {
				throw new $TypeError$3('S must be a String');
			}
			var exec = this.Get(R, 'exec');
			if (this.IsCallable(exec)) {
				var result = this.Call(exec, R, [S]);
				if (result === null || this.Type(result) === 'Object') {
					return result;
				}
				throw new $TypeError$3('"exec" method must return `null` or an Object');
			}
			return regexExec$1(R, S);
		},

		// https://ecma-international.org/ecma-262/6.0/#sec-arrayspeciescreate
		ArraySpeciesCreate: function ArraySpeciesCreate(originalArray, length) {
			if (!this.IsInteger(length) || length < 0) {
				throw new $TypeError$3('Assertion failed: length must be an integer >= 0');
			}
			var len = length === 0 ? 0 : length;
			var C;
			var isArray = this.IsArray(originalArray);
			if (isArray) {
				C = this.Get(originalArray, 'constructor');
				// TODO: figure out how to make a cross-realm normal Array, a same-realm Array
				// if (this.IsConstructor(C)) {
				// 	if C is another realm's Array, C = undefined
				// 	Object.getPrototypeOf(Object.getPrototypeOf(Object.getPrototypeOf(Array))) === null ?
				// }
				if (this.Type(C) === 'Object' && hasSymbols$4 && $Symbol.species) {
					C = this.Get(C, $Symbol.species);
					if (C === null) {
						C = void 0;
					}
				}
			}
			if (typeof C === 'undefined') {
				return $Array(len);
			}
			if (!this.IsConstructor(C)) {
				throw new $TypeError$3('C must be a constructor');
			}
			return new C(len); // this.Construct(C, len);
		},

		CreateDataProperty: function CreateDataProperty(O, P, V) {
			if (this.Type(O) !== 'Object') {
				throw new $TypeError$3('Assertion failed: Type(O) is not Object');
			}
			if (!this.IsPropertyKey(P)) {
				throw new $TypeError$3('Assertion failed: IsPropertyKey(P) is not true');
			}
			var oldDesc = $gOPD(O, P);
			var extensible = oldDesc || this.IsExtensible(O);
			var immutable = oldDesc && (!oldDesc.writable || !oldDesc.configurable);
			if (immutable || !extensible) {
				return false;
			}
			return DefineOwnProperty(this, O, P, {
				'[[Configurable]]': true,
				'[[Enumerable]]': true,
				'[[Value]]': V,
				'[[Writable]]': true
			});
		},

		// https://ecma-international.org/ecma-262/6.0/#sec-createdatapropertyorthrow
		CreateDataPropertyOrThrow: function CreateDataPropertyOrThrow(O, P, V) {
			if (this.Type(O) !== 'Object') {
				throw new $TypeError$3('Assertion failed: Type(O) is not Object');
			}
			if (!this.IsPropertyKey(P)) {
				throw new $TypeError$3('Assertion failed: IsPropertyKey(P) is not true');
			}
			var success = this.CreateDataProperty(O, P, V);
			if (!success) {
				throw new $TypeError$3('unable to create data property');
			}
			return success;
		},

		// https://www.ecma-international.org/ecma-262/6.0/#sec-objectcreate
		ObjectCreate: function ObjectCreate(proto, internalSlotsList) {
			if (proto !== null && this.Type(proto) !== 'Object') {
				throw new $TypeError$3('Assertion failed: proto must be null or an object');
			}
			var slots = arguments.length < 2 ? [] : internalSlotsList;
			if (slots.length > 0) {
				throw new $SyntaxError$1('es-abstract does not yet support internal slots');
			}

			if (proto === null && !$ObjectCreate) {
				throw new $SyntaxError$1('native Object.create support is required to create null objects');
			}

			return $ObjectCreate(proto);
		},

		// https://ecma-international.org/ecma-262/6.0/#sec-advancestringindex
		AdvanceStringIndex: function AdvanceStringIndex(S, index, unicode) {
			if (this.Type(S) !== 'String') {
				throw new $TypeError$3('S must be a String');
			}
			if (!this.IsInteger(index) || index < 0 || index > MAX_SAFE_INTEGER) {
				throw new $TypeError$3('Assertion failed: length must be an integer >= 0 and <= 2**53');
			}
			if (this.Type(unicode) !== 'Boolean') {
				throw new $TypeError$3('Assertion failed: unicode must be a Boolean');
			}
			if (!unicode) {
				return index + 1;
			}
			var length = S.length;
			if ((index + 1) >= length) {
				return index + 1;
			}

			var first = $charCodeAt(S, index);
			if (first < 0xD800 || first > 0xDBFF) {
				return index + 1;
			}

			var second = $charCodeAt(S, index + 1);
			if (second < 0xDC00 || second > 0xDFFF) {
				return index + 1;
			}

			return index + 2;
		},

		// https://www.ecma-international.org/ecma-262/6.0/#sec-createmethodproperty
		CreateMethodProperty: function CreateMethodProperty(O, P, V) {
			if (this.Type(O) !== 'Object') {
				throw new $TypeError$3('Assertion failed: Type(O) is not Object');
			}

			if (!this.IsPropertyKey(P)) {
				throw new $TypeError$3('Assertion failed: IsPropertyKey(P) is not true');
			}

			var newDesc = {
				'[[Configurable]]': true,
				'[[Enumerable]]': false,
				'[[Value]]': V,
				'[[Writable]]': true
			};
			return DefineOwnProperty(this, O, P, newDesc);
		},

		// https://www.ecma-international.org/ecma-262/6.0/#sec-definepropertyorthrow
		DefinePropertyOrThrow: function DefinePropertyOrThrow(O, P, desc) {
			if (this.Type(O) !== 'Object') {
				throw new $TypeError$3('Assertion failed: Type(O) is not Object');
			}

			if (!this.IsPropertyKey(P)) {
				throw new $TypeError$3('Assertion failed: IsPropertyKey(P) is not true');
			}

			var Desc = isPropertyDescriptor(this, desc) ? desc : this.ToPropertyDescriptor(desc);
			if (!isPropertyDescriptor(this, Desc)) {
				throw new $TypeError$3('Assertion failed: Desc is not a valid Property Descriptor');
			}

			return DefineOwnProperty(this, O, P, Desc);
		},

		// https://www.ecma-international.org/ecma-262/6.0/#sec-deletepropertyorthrow
		DeletePropertyOrThrow: function DeletePropertyOrThrow(O, P) {
			if (this.Type(O) !== 'Object') {
				throw new $TypeError$3('Assertion failed: Type(O) is not Object');
			}

			if (!this.IsPropertyKey(P)) {
				throw new $TypeError$3('Assertion failed: IsPropertyKey(P) is not true');
			}

			var success = delete O[P];
			if (!success) {
				throw new TypeError('Attempt to delete property failed.');
			}
			return success;
		},

		// https://www.ecma-international.org/ecma-262/6.0/#sec-enumerableownnames
		EnumerableOwnNames: function EnumerableOwnNames(O) {
			if (this.Type(O) !== 'Object') {
				throw new $TypeError$3('Assertion failed: Type(O) is not Object');
			}

			return objectKeys(O);
		},

		// https://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-number-prototype-object
		thisNumberValue: function thisNumberValue(value) {
			if (this.Type(value) === 'Number') {
				return value;
			}

			return $NumberValueOf(value);
		},

		// https://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-boolean-prototype-object
		thisBooleanValue: function thisBooleanValue(value) {
			if (this.Type(value) === 'Boolean') {
				return value;
			}

			return $BooleanValueOf(value);
		},

		// https://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-string-prototype-object
		thisStringValue: function thisStringValue(value) {
			if (this.Type(value) === 'String') {
				return value;
			}

			return $StringValueOf(value);
		},

		// https://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-date-prototype-object
		thisTimeValue: function thisTimeValue(value) {
			return $DateValueOf(value);
		},

		// https://www.ecma-international.org/ecma-262/6.0/#sec-setintegritylevel
		SetIntegrityLevel: function SetIntegrityLevel(O, level) {
			if (this.Type(O) !== 'Object') {
				throw new $TypeError$3('Assertion failed: Type(O) is not Object');
			}
			if (level !== 'sealed' && level !== 'frozen') {
				throw new $TypeError$3('Assertion failed: `level` must be `"sealed"` or `"frozen"`');
			}
			if (!$preventExtensions) {
				throw new $SyntaxError$1('SetIntegrityLevel requires native `Object.preventExtensions` support');
			}
			var status = $preventExtensions(O);
			if (!status) {
				return false;
			}
			if (!$gOPN) {
				throw new $SyntaxError$1('SetIntegrityLevel requires native `Object.getOwnPropertyNames` support');
			}
			var theKeys = $gOPN(O);
			var ES = this;
			if (level === 'sealed') {
				forEach(theKeys, function (k) {
					ES.DefinePropertyOrThrow(O, k, { configurable: false });
				});
			} else if (level === 'frozen') {
				forEach(theKeys, function (k) {
					var currentDesc = $gOPD(O, k);
					if (typeof currentDesc !== 'undefined') {
						var desc;
						if (ES.IsAccessorDescriptor(ES.ToPropertyDescriptor(currentDesc))) {
							desc = { configurable: false };
						} else {
							desc = { configurable: false, writable: false };
						}
						ES.DefinePropertyOrThrow(O, k, desc);
					}
				});
			}
			return true;
		},

		// https://www.ecma-international.org/ecma-262/6.0/#sec-testintegritylevel
		TestIntegrityLevel: function TestIntegrityLevel(O, level) {
			if (this.Type(O) !== 'Object') {
				throw new $TypeError$3('Assertion failed: Type(O) is not Object');
			}
			if (level !== 'sealed' && level !== 'frozen') {
				throw new $TypeError$3('Assertion failed: `level` must be `"sealed"` or `"frozen"`');
			}
			var status = this.IsExtensible(O);
			if (status) {
				return false;
			}
			var theKeys = $gOPN(O);
			var ES = this;
			return theKeys.length === 0 || every(theKeys, function (k) {
				var currentDesc = $gOPD(O, k);
				if (typeof currentDesc !== 'undefined') {
					if (currentDesc.configurable) {
						return false;
					}
					if (level === 'frozen' && ES.IsDataDescriptor(ES.ToPropertyDescriptor(currentDesc)) && currentDesc.writable) {
						return false;
					}
				}
				return true;
			});
		},

		// https://www.ecma-international.org/ecma-262/6.0/#sec-ordinaryhasinstance
		OrdinaryHasInstance: function OrdinaryHasInstance(C, O) {
			if (this.IsCallable(C) === false) {
				return false;
			}
			if (this.Type(O) !== 'Object') {
				return false;
			}
			var P = this.Get(C, 'prototype');
			if (this.Type(P) !== 'Object') {
				throw new $TypeError$3('OrdinaryHasInstance called on an object with an invalid prototype property.');
			}
			return O instanceof C;
		},

		// https://www.ecma-international.org/ecma-262/6.0/#sec-ordinaryhasproperty
		OrdinaryHasProperty: function OrdinaryHasProperty(O, P) {
			if (this.Type(O) !== 'Object') {
				throw new $TypeError$3('Assertion failed: Type(O) is not Object');
			}
			if (!this.IsPropertyKey(P)) {
				throw new $TypeError$3('Assertion failed: P must be a Property Key');
			}
			return P in O;
		},

		// https://www.ecma-international.org/ecma-262/6.0/#sec-instanceofoperator
		InstanceofOperator: function InstanceofOperator(O, C) {
			if (this.Type(O) !== 'Object') {
				throw new $TypeError$3('Assertion failed: Type(O) is not Object');
			}
			var instOfHandler = hasSymbols$4 && $Symbol.hasInstance ? this.GetMethod(C, $Symbol.hasInstance) : void 0;
			if (typeof instOfHandler !== 'undefined') {
				return this.ToBoolean(this.Call(instOfHandler, C, [O]));
			}
			if (!this.IsCallable(C)) {
				throw new $TypeError$3('`C` is not Callable');
			}
			return this.OrdinaryHasInstance(C, O);
		},

		// https://www.ecma-international.org/ecma-262/6.0/#sec-ispromise
		IsPromise: function IsPromise(x) {
			if (this.Type(x) !== 'Object') {
				return false;
			}
			if (!$Promise) { // Promises are not supported
				return false;
			}
			try {
				$PromiseThen(x); // throws if not a promise
			} catch (e) {
				return false;
			}
			return true;
		},

		// https://www.ecma-international.org/ecma-262/6.0/#sec-abstract-equality-comparison
		'Abstract Equality Comparison': function AbstractEqualityComparison(x, y) {
			var xType = this.Type(x);
			var yType = this.Type(y);
			if (xType === yType) {
				return x === y; // ES6+ specified this shortcut anyways.
			}
			if (x == null && y == null) {
				return true;
			}
			if (xType === 'Number' && yType === 'String') {
				return this['Abstract Equality Comparison'](x, this.ToNumber(y));
			}
			if (xType === 'String' && yType === 'Number') {
				return this['Abstract Equality Comparison'](this.ToNumber(x), y);
			}
			if (xType === 'Boolean') {
				return this['Abstract Equality Comparison'](this.ToNumber(x), y);
			}
			if (yType === 'Boolean') {
				return this['Abstract Equality Comparison'](x, this.ToNumber(y));
			}
			if ((xType === 'String' || xType === 'Number' || xType === 'Symbol') && yType === 'Object') {
				return this['Abstract Equality Comparison'](x, this.ToPrimitive(y));
			}
			if (xType === 'Object' && (yType === 'String' || yType === 'Number' || yType === 'Symbol')) {
				return this['Abstract Equality Comparison'](this.ToPrimitive(x), y);
			}
			return false;
		},

		// eslint-disable-next-line max-lines-per-function, max-statements, id-length, max-params
		ValidateAndApplyPropertyDescriptor: function ValidateAndApplyPropertyDescriptor(O, P, extensible, Desc, current) {
			// this uses the ES2017+ logic, since it fixes a number of bugs in the ES2015 logic.
			var oType = this.Type(O);
			if (oType !== 'Undefined' && oType !== 'Object') {
				throw new $TypeError$3('Assertion failed: O must be undefined or an Object');
			}
			if (this.Type(extensible) !== 'Boolean') {
				throw new $TypeError$3('Assertion failed: extensible must be a Boolean');
			}
			if (!isPropertyDescriptor(this, Desc)) {
				throw new $TypeError$3('Assertion failed: Desc must be a Property Descriptor');
			}
			if (this.Type(current) !== 'Undefined' && !isPropertyDescriptor(this, current)) {
				throw new $TypeError$3('Assertion failed: current must be a Property Descriptor, or undefined');
			}
			if (oType !== 'Undefined' && !this.IsPropertyKey(P)) {
				throw new $TypeError$3('Assertion failed: if O is not undefined, P must be a Property Key');
			}
			if (this.Type(current) === 'Undefined') {
				if (!extensible) {
					return false;
				}
				if (this.IsGenericDescriptor(Desc) || this.IsDataDescriptor(Desc)) {
					if (oType !== 'Undefined') {
						DefineOwnProperty(this, O, P, {
							'[[Configurable]]': Desc['[[Configurable]]'],
							'[[Enumerable]]': Desc['[[Enumerable]]'],
							'[[Value]]': Desc['[[Value]]'],
							'[[Writable]]': Desc['[[Writable]]']
						});
					}
				} else {
					if (!this.IsAccessorDescriptor(Desc)) {
						throw new $TypeError$3('Assertion failed: Desc is not an accessor descriptor');
					}
					if (oType !== 'Undefined') {
						return DefineOwnProperty(this, O, P, Desc);
					}
				}
				return true;
			}
			if (this.IsGenericDescriptor(Desc) && !('[[Configurable]]' in Desc) && !('[[Enumerable]]' in Desc)) {
				return true;
			}
			if (isSamePropertyDescriptor(this, Desc, current)) {
				return true; // removed by ES2017, but should still be correct
			}
			// "if every field in Desc is absent, return true" can't really match the assertion that it's a Property Descriptor
			if (!current['[[Configurable]]']) {
				if (Desc['[[Configurable]]']) {
					return false;
				}
				if ('[[Enumerable]]' in Desc && !Desc['[[Enumerable]]'] === !!current['[[Enumerable]]']) {
					return false;
				}
			}
			if (this.IsGenericDescriptor(Desc)) ; else if (this.IsDataDescriptor(current) !== this.IsDataDescriptor(Desc)) {
				if (!current['[[Configurable]]']) {
					return false;
				}
				if (this.IsDataDescriptor(current)) {
					if (oType !== 'Undefined') {
						DefineOwnProperty(this, O, P, {
							'[[Configurable]]': current['[[Configurable]]'],
							'[[Enumerable]]': current['[[Enumerable]]'],
							'[[Get]]': undefined
						});
					}
				} else if (oType !== 'Undefined') {
					DefineOwnProperty(this, O, P, {
						'[[Configurable]]': current['[[Configurable]]'],
						'[[Enumerable]]': current['[[Enumerable]]'],
						'[[Value]]': undefined
					});
				}
			} else if (this.IsDataDescriptor(current) && this.IsDataDescriptor(Desc)) {
				if (!current['[[Configurable]]'] && !current['[[Writable]]']) {
					if ('[[Writable]]' in Desc && Desc['[[Writable]]']) {
						return false;
					}
					if ('[[Value]]' in Desc && !this.SameValue(Desc['[[Value]]'], current['[[Value]]'])) {
						return false;
					}
					return true;
				}
			} else if (this.IsAccessorDescriptor(current) && this.IsAccessorDescriptor(Desc)) {
				if (!current['[[Configurable]]']) {
					if ('[[Set]]' in Desc && !this.SameValue(Desc['[[Set]]'], current['[[Set]]'])) {
						return false;
					}
					if ('[[Get]]' in Desc && !this.SameValue(Desc['[[Get]]'], current['[[Get]]'])) {
						return false;
					}
					return true;
				}
			} else {
				throw new $TypeError$3('Assertion failed: current and Desc are not both data, both accessors, or one accessor and one data.');
			}
			if (oType !== 'Undefined') {
				return DefineOwnProperty(this, O, P, Desc);
			}
			return true;
		},

		// https://www.ecma-international.org/ecma-262/6.0/#sec-ordinarydefineownproperty
		OrdinaryDefineOwnProperty: function OrdinaryDefineOwnProperty(O, P, Desc) {
			if (this.Type(O) !== 'Object') {
				throw new $TypeError$3('Assertion failed: O must be an Object');
			}
			if (!this.IsPropertyKey(P)) {
				throw new $TypeError$3('Assertion failed: P must be a Property Key');
			}
			if (!isPropertyDescriptor(this, Desc)) {
				throw new $TypeError$3('Assertion failed: Desc must be a Property Descriptor');
			}
			var desc = $gOPD(O, P);
			var current = desc && this.ToPropertyDescriptor(desc);
			var extensible = this.IsExtensible(O);
			return this.ValidateAndApplyPropertyDescriptor(O, P, extensible, Desc, current);
		},

		// https://www.ecma-international.org/ecma-262/6.0/#sec-ordinarygetownproperty
		OrdinaryGetOwnProperty: function OrdinaryGetOwnProperty(O, P) {
			if (this.Type(O) !== 'Object') {
				throw new $TypeError$3('Assertion failed: O must be an Object');
			}
			if (!this.IsPropertyKey(P)) {
				throw new $TypeError$3('Assertion failed: P must be a Property Key');
			}
			if (!src(O, P)) {
				return void 0;
			}
			if (!$gOPD) {
				// ES3 fallback
				var arrayLength = this.IsArray(O) && P === 'length';
				var regexLastIndex = this.IsRegExp(O) && P === 'lastIndex';
				return {
					'[[Configurable]]': !(arrayLength || regexLastIndex),
					'[[Enumerable]]': $isEnumerable(O, P),
					'[[Value]]': O[P],
					'[[Writable]]': true
				};
			}
			return this.ToPropertyDescriptor($gOPD(O, P));
		},

		// https://www.ecma-international.org/ecma-262/6.0/#sec-arraycreate
		ArrayCreate: function ArrayCreate(length) {
			if (!this.IsInteger(length) || length < 0) {
				throw new $TypeError$3('Assertion failed: `length` must be an integer Number >= 0');
			}
			if (length > MAX_ARRAY_LENGTH) {
				throw new $RangeError('length is greater than (2**32 - 1)');
			}
			var proto = arguments.length > 1 ? arguments[1] : $ArrayPrototype;
			var A = []; // steps 5 - 7, and 9
			if (proto !== $ArrayPrototype) { // step 8
				if (!$setProto) {
					throw new $SyntaxError$1('ArrayCreate: a `proto` argument that is not `Array.prototype` is not supported in an environment that does not support setting the [[Prototype]]');
				}
				$setProto(A, proto);
			}
			if (length !== 0) { // bypasses the need for step 2
				A.length = length;
			}
			/* step 10, the above as a shortcut for the below
			this.OrdinaryDefineOwnProperty(A, 'length', {
				'[[Configurable]]': false,
				'[[Enumerable]]': false,
				'[[Value]]': length,
				'[[Writable]]': true
			});
			*/
			return A;
		},

		// eslint-disable-next-line max-statements, max-lines-per-function
		ArraySetLength: function ArraySetLength(A, Desc) {
			if (!this.IsArray(A)) {
				throw new $TypeError$3('Assertion failed: A must be an Array');
			}
			if (!isPropertyDescriptor(this, Desc)) {
				throw new $TypeError$3('Assertion failed: Desc must be a Property Descriptor');
			}
			if (!('[[Value]]' in Desc)) {
				return this.OrdinaryDefineOwnProperty(A, 'length', Desc);
			}
			var newLenDesc = assign({}, Desc);
			var newLen = this.ToUint32(Desc['[[Value]]']);
			var numberLen = this.ToNumber(Desc['[[Value]]']);
			if (newLen !== numberLen) {
				throw new $RangeError('Invalid array length');
			}
			newLenDesc['[[Value]]'] = newLen;
			var oldLenDesc = this.OrdinaryGetOwnProperty(A, 'length');
			if (!this.IsDataDescriptor(oldLenDesc)) {
				throw new $TypeError$3('Assertion failed: an array had a non-data descriptor on `length`');
			}
			var oldLen = oldLenDesc['[[Value]]'];
			if (newLen >= oldLen) {
				return this.OrdinaryDefineOwnProperty(A, 'length', newLenDesc);
			}
			if (!oldLenDesc['[[Writable]]']) {
				return false;
			}
			var newWritable;
			if (!('[[Writable]]' in newLenDesc) || newLenDesc['[[Writable]]']) {
				newWritable = true;
			} else {
				newWritable = false;
				newLenDesc['[[Writable]]'] = true;
			}
			var succeeded = this.OrdinaryDefineOwnProperty(A, 'length', newLenDesc);
			if (!succeeded) {
				return false;
			}
			while (newLen < oldLen) {
				oldLen -= 1;
				var deleteSucceeded = delete A[this.ToString(oldLen)];
				if (!deleteSucceeded) {
					newLenDesc['[[Value]]'] = oldLen + 1;
					if (!newWritable) {
						newLenDesc['[[Writable]]'] = false;
						this.OrdinaryDefineOwnProperty(A, 'length', newLenDesc);
						return false;
					}
				}
			}
			if (!newWritable) {
				return this.OrdinaryDefineOwnProperty(A, 'length', { '[[Writable]]': false });
			}
			return true;
		},

		// https://www.ecma-international.org/ecma-262/6.0/#sec-createhtml
		CreateHTML: function CreateHTML(string, tag, attribute, value) {
			if (this.Type(tag) !== 'String' || this.Type(attribute) !== 'String') {
				throw new $TypeError$3('Assertion failed: `tag` and `attribute` must be strings');
			}
			var str = this.RequireObjectCoercible(string);
			var S = this.ToString(str);
			var p1 = '<' + tag;
			if (attribute !== '') {
				var V = this.ToString(value);
				var escapedV = $replace(V, /\x22/g, '&quot;');
				p1 += '\x20' + attribute + '\x3D\x22' + escapedV + '\x22';
			}
			return p1 + '>' + S + '</' + tag + '>';
		},

		// https://www.ecma-international.org/ecma-262/6.0/#sec-getownpropertykeys
		GetOwnPropertyKeys: function GetOwnPropertyKeys(O, Type) {
			if (this.Type(O) !== 'Object') {
				throw new $TypeError$3('Assertion failed: Type(O) is not Object');
			}
			if (Type === 'Symbol') {
				return hasSymbols$4 && $gOPS ? $gOPS(O) : [];
			}
			if (Type === 'String') {
				if (!$gOPN) {
					return objectKeys(O);
				}
				return $gOPN(O);
			}
			throw new $TypeError$3('Assertion failed: `Type` must be `"String"` or `"Symbol"`');
		},

		// https://www.ecma-international.org/ecma-262/6.0/#sec-symboldescriptivestring
		SymbolDescriptiveString: function SymbolDescriptiveString(sym) {
			if (this.Type(sym) !== 'Symbol') {
				throw new $TypeError$3('Assertion failed: `sym` must be a Symbol');
			}
			return $SymbolToString(sym);
		},

		// https://www.ecma-international.org/ecma-262/6.0/#sec-getsubstitution
		// eslint-disable-next-line max-statements, max-params, max-lines-per-function
		GetSubstitution: function GetSubstitution(matched, str, position, captures, replacement) {
			if (this.Type(matched) !== 'String') {
				throw new $TypeError$3('Assertion failed: `matched` must be a String');
			}
			var matchLength = matched.length;

			if (this.Type(str) !== 'String') {
				throw new $TypeError$3('Assertion failed: `str` must be a String');
			}
			var stringLength = str.length;

			if (!this.IsInteger(position) || position < 0 || position > stringLength) {
				throw new $TypeError$3('Assertion failed: `position` must be a nonnegative integer, and less than or equal to the length of `string`, got ' + objectInspect(position));
			}

			var ES = this;
			var isStringOrHole = function (capture, index, arr) { return ES.Type(capture) === 'String' || !(index in arr); };
			if (!this.IsArray(captures) || !every(captures, isStringOrHole)) {
				throw new $TypeError$3('Assertion failed: `captures` must be a List of Strings, got ' + objectInspect(captures));
			}

			if (this.Type(replacement) !== 'String') {
				throw new $TypeError$3('Assertion failed: `replacement` must be a String');
			}

			var tailPos = position + matchLength;
			var m = captures.length;

			var result = '';
			for (var i = 0; i < replacement.length; i += 1) {
				// if this is a $, and it's not the end of the replacement
				var current = replacement[i];
				var isLast = (i + 1) >= replacement.length;
				var nextIsLast = (i + 2) >= replacement.length;
				if (current === '$' && !isLast) {
					var next = replacement[i + 1];
					if (next === '$') {
						result += '$';
						i += 1;
					} else if (next === '&') {
						result += matched;
						i += 1;
					} else if (next === '`') {
						result += position === 0 ? '' : strSlice$1(str, 0, position - 1);
						i += 1;
					} else if (next === "'") {
						result += tailPos >= stringLength ? '' : strSlice$1(str, tailPos);
						i += 1;
					} else {
						var nextNext = nextIsLast ? null : replacement[i + 2];
						if (isDigit(next) && next !== '0' && (nextIsLast || !isDigit(nextNext))) {
							// $1 through $9, and not followed by a digit
							var n = parseInteger(next, 10);
							// if (n > m, impl-defined)
							result += (n <= m && this.Type(captures[n - 1]) === 'Undefined') ? '' : captures[n - 1];
							i += 1;
						} else if (isDigit(next) && (nextIsLast || isDigit(nextNext))) {
							// $00 through $99
							var nn = next + nextNext;
							var nnI = parseInteger(nn, 10) - 1;
							// if nn === '00' or nn > m, impl-defined
							result += (nn <= m && this.Type(captures[nnI]) === 'Undefined') ? '' : captures[nnI];
							i += 2;
						} else {
							result += '$';
						}
					}
				} else {
					// the final $, or else not a $
					result += replacement[i];
				}
			}
			return result;
		}
	});

	delete ES6.CheckObjectCoercible; // renamed in ES6 to RequireObjectCoercible

	var es2015$1 = ES6;

	var $Array$1 = GetIntrinsic('%Array%');

	var hasSymbols$5 = hasSymbols$2();





	var $arrayPush = callBind($Array$1.prototype.push);
	var $arraySlice = callBind($Array$1.prototype.slice);
	var $arrayJoin = callBind($Array$1.prototype.join);

	var ES2016 = assign(assign({}, es2015$1), {
		// https://www.ecma-international.org/ecma-262/7.0/#sec-samevaluenonnumber
		SameValueNonNumber: function SameValueNonNumber(x, y) {
			if (typeof x === 'number' || typeof x !== typeof y) {
				throw new TypeError('SameValueNonNumber requires two non-number values of the same type.');
			}
			return this.SameValue(x, y);
		},

		// https://www.ecma-international.org/ecma-262/7.0/#sec-iterabletoarraylike
		IterableToArrayLike: function IterableToArrayLike(items) {
			var usingIterator;
			if (hasSymbols$5) {
				usingIterator = this.GetMethod(items, Symbol.iterator);
			} else if (this.IsArray(items)) {
				usingIterator = function () {
					var i = -1;
					var arr = this; // eslint-disable-line no-invalid-this
					return {
						next: function () {
							i += 1;
							return {
								done: i >= arr.length,
								value: arr[i]
							};
						}
					};
				};
			} else if (this.Type(items) === 'String') {
				var ES = this;
				usingIterator = function () {
					var i = 0;
					return {
						next: function () {
							var nextIndex = ES.AdvanceStringIndex(items, i, true);
							var value = $arrayJoin($arraySlice(items, i, nextIndex), '');
							i = nextIndex;
							return {
								done: nextIndex > items.length,
								value: value
							};
						}
					};
				};
			}
			if (typeof usingIterator !== 'undefined') {
				var iterator = this.GetIterator(items, usingIterator);
				var values = [];
				var next = true;
				while (next) {
					next = this.IteratorStep(iterator);
					if (next) {
						var nextValue = this.IteratorValue(next);
						$arrayPush(values, nextValue);
					}
				}
				return values;
			}

			return this.ToObject(items);
		}
	});

	var es2016 = ES2016;

	var $TypeError$4 = GetIntrinsic('%TypeError%');
	var $Array$2 = GetIntrinsic('%Array%');
	var $isEnumerable$1 = callBind(GetIntrinsic('%ObjectPrototype%').propertyIsEnumerable);
	var $pushApply = callBind.apply(GetIntrinsic('%ArrayPrototype%').push);
	var $arrayPush$1 = callBind($Array$2.prototype.push);

	var ES2017 = assign(assign({}, es2016), {
		ToIndex: function ToIndex(value) {
			if (typeof value === 'undefined') {
				return 0;
			}
			var integerIndex = this.ToInteger(value);
			if (integerIndex < 0) {
				throw new RangeError('index must be >= 0');
			}
			var index = this.ToLength(integerIndex);
			if (!this.SameValueZero(integerIndex, index)) {
				throw new RangeError('index must be >= 0 and < 2 ** 53 - 1');
			}
			return index;
		},

		// https://www.ecma-international.org/ecma-262/8.0/#sec-enumerableownproperties
		EnumerableOwnProperties: function EnumerableOwnProperties(O, kind) {
			var keys = es2016.EnumerableOwnNames(O);
			if (kind === 'key') {
				return keys;
			}
			if (kind === 'value' || kind === 'key+value') {
				var results = [];
				forEach(keys, function (key) {
					if ($isEnumerable$1(O, key)) {
						$pushApply(results, [
							kind === 'value' ? O[key] : [key, O[key]]
						]);
					}
				});
				return results;
			}
			throw new $TypeError$4('Assertion failed: "kind" is not "key", "value", or "key+value": ' + kind);
		},

		// https://www.ecma-international.org/ecma-262/8.0/#sec-iterabletolist
		IterableToList: function IterableToList(items, method) {
			var iterator = this.GetIterator(items, method);
			var values = [];
			var next = true;
			while (next) {
				next = this.IteratorStep(iterator);
				if (next) {
					var nextValue = this.IteratorValue(next);
					$arrayPush$1(values, nextValue);
				}
			}
			return values;
		}
	});

	delete ES2017.EnumerableOwnNames; // replaced with EnumerableOwnProperties
	delete ES2017.IterableToArrayLike; // replaced with IterableToList

	var es2017 = ES2017;

	var $String$2 = GetIntrinsic('%String%');
	var $Object$2 = GetIntrinsic('%Object%');
	var $TypeError$5 = GetIntrinsic('%TypeError%');
	var $RegExp$1 = GetIntrinsic('%RegExp%');

	var $SymbolProto = GetIntrinsic('%SymbolPrototype%', true);
	var $SymbolValueOf = $SymbolProto ? callBind($SymbolProto.valueOf) : null;
	var $StringProto = GetIntrinsic('%StringPrototype%');
	var $charAt = callBind($StringProto.charAt);
	var strSlice$2 = callBind($StringProto.slice);
	var $indexOf = callBind($StringProto.indexOf);
	var $parseInt = parseInt;
	var isDigit$1 = callBind($RegExp$1.prototype.test, /^[0-9]$/);

	var $PromiseResolveOrig = GetIntrinsic('%Promise_resolve%', true);
	var $PromiseResolve = $PromiseResolveOrig ? callBind($PromiseResolveOrig) : null;

	var $isEnumerable$2 = callBind(GetIntrinsic('%ObjectPrototype%').propertyIsEnumerable);
	var $pushApply$1 = callBind.apply(GetIntrinsic('%ArrayPrototype%').push);
	var $gOPS$1 = $SymbolValueOf ? $Object$2.getOwnPropertySymbols : null;

	var OwnPropertyKeys = function OwnPropertyKeys(ES, source) {
		var ownKeys = objectKeys(source);
		if ($gOPS$1) {
			$pushApply$1(ownKeys, $gOPS$1(source));
		}
		return ownKeys;
	};

	var ES2018 = assign(assign({}, es2017), {
		EnumerableOwnPropertyNames: es2017.EnumerableOwnProperties,

		// https://ecma-international.org/ecma-262/9.0/#sec-thissymbolvalue
		thisSymbolValue: function thisSymbolValue(value) {
			if (!$SymbolValueOf) {
				throw new SyntaxError('Symbols are not supported; thisSymbolValue requires that `value` be a Symbol or a Symbol object');
			}
			if (this.Type(value) === 'Symbol') {
				return value;
			}
			return $SymbolValueOf(value);
		},

		// https://www.ecma-international.org/ecma-262/9.0/#sec-isstringprefix
		IsStringPrefix: function IsStringPrefix(p, q) {
			if (this.Type(p) !== 'String') {
				throw new TypeError('Assertion failed: "p" must be a String');
			}

			if (this.Type(q) !== 'String') {
				throw new TypeError('Assertion failed: "q" must be a String');
			}

			if (p === q || p === '') {
				return true;
			}

			var pLength = p.length;
			var qLength = q.length;
			if (pLength >= qLength) {
				return false;
			}

			// assert: pLength < qLength

			for (var i = 0; i < pLength; i += 1) {
				if ($charAt(p, i) !== $charAt(q, i)) {
					return false;
				}
			}
			return true;
		},

		// https://www.ecma-international.org/ecma-262/9.0/#sec-tostring-applied-to-the-number-type
		NumberToString: function NumberToString(m) {
			if (this.Type(m) !== 'Number') {
				throw new TypeError('Assertion failed: "m" must be a String');
			}

			return $String$2(m);
		},

		// https://www.ecma-international.org/ecma-262/9.0/#sec-copydataproperties
		CopyDataProperties: function CopyDataProperties(target, source, excludedItems) {
			if (this.Type(target) !== 'Object') {
				throw new TypeError('Assertion failed: "target" must be an Object');
			}

			if (!this.IsArray(excludedItems)) {
				throw new TypeError('Assertion failed: "excludedItems" must be a List of Property Keys');
			}
			for (var i = 0; i < excludedItems.length; i += 1) {
				if (!this.IsPropertyKey(excludedItems[i])) {
					throw new TypeError('Assertion failed: "excludedItems" must be a List of Property Keys');
				}
			}

			if (typeof source === 'undefined' || source === null) {
				return target;
			}

			var ES = this;

			var fromObj = ES.ToObject(source);

			var sourceKeys = OwnPropertyKeys(ES, fromObj);
			forEach(sourceKeys, function (nextKey) {
				var excluded = false;

				forEach(excludedItems, function (e) {
					if (ES.SameValue(e, nextKey) === true) {
						excluded = true;
					}
				});

				var enumerable = $isEnumerable$2(fromObj, nextKey) || (
					// this is to handle string keys being non-enumerable in older engines
					typeof source === 'string'
					&& nextKey >= 0
					&& ES.IsInteger(ES.ToNumber(nextKey))
				);
				if (excluded === false && enumerable) {
					var propValue = ES.Get(fromObj, nextKey);
					ES.CreateDataProperty(target, nextKey, propValue);
				}
			});

			return target;
		},

		// https://ecma-international.org/ecma-262/9.0/#sec-promise-resolve
		PromiseResolve: function PromiseResolve(C, x) {
			if (!$PromiseResolve) {
				throw new SyntaxError('This environment does not support Promises.');
			}
			return $PromiseResolve(C, x);
		},

		// http://www.ecma-international.org/ecma-262/9.0/#sec-getsubstitution
		// eslint-disable-next-line max-statements, max-params, max-lines-per-function
		GetSubstitution: function GetSubstitution(matched, str, position, captures, namedCaptures, replacement) {
			if (this.Type(matched) !== 'String') {
				throw new $TypeError$5('Assertion failed: `matched` must be a String');
			}
			var matchLength = matched.length;

			if (this.Type(str) !== 'String') {
				throw new $TypeError$5('Assertion failed: `str` must be a String');
			}
			var stringLength = str.length;

			if (!this.IsInteger(position) || position < 0 || position > stringLength) {
				throw new $TypeError$5('Assertion failed: `position` must be a nonnegative integer, and less than or equal to the length of `string`, got ' + objectInspect(position));
			}

			var ES = this;
			var isStringOrHole = function (capture, index, arr) { return ES.Type(capture) === 'String' || !(index in arr); };
			if (!this.IsArray(captures) || !every(captures, isStringOrHole)) {
				throw new $TypeError$5('Assertion failed: `captures` must be a List of Strings, got ' + objectInspect(captures));
			}

			if (this.Type(replacement) !== 'String') {
				throw new $TypeError$5('Assertion failed: `replacement` must be a String');
			}

			var tailPos = position + matchLength;
			var m = captures.length;
			if (this.Type(namedCaptures) !== 'Undefined') {
				namedCaptures = this.ToObject(namedCaptures); // eslint-disable-line no-param-reassign
			}

			var result = '';
			for (var i = 0; i < replacement.length; i += 1) {
				// if this is a $, and it's not the end of the replacement
				var current = replacement[i];
				var isLast = (i + 1) >= replacement.length;
				var nextIsLast = (i + 2) >= replacement.length;
				if (current === '$' && !isLast) {
					var next = replacement[i + 1];
					if (next === '$') {
						result += '$';
						i += 1;
					} else if (next === '&') {
						result += matched;
						i += 1;
					} else if (next === '`') {
						result += position === 0 ? '' : strSlice$2(str, 0, position - 1);
						i += 1;
					} else if (next === "'") {
						result += tailPos >= stringLength ? '' : strSlice$2(str, tailPos);
						i += 1;
					} else {
						var nextNext = nextIsLast ? null : replacement[i + 2];
						if (isDigit$1(next) && next !== '0' && (nextIsLast || !isDigit$1(nextNext))) {
							// $1 through $9, and not followed by a digit
							var n = $parseInt(next, 10);
							// if (n > m, impl-defined)
							result += (n <= m && this.Type(captures[n - 1]) === 'Undefined') ? '' : captures[n - 1];
							i += 1;
						} else if (isDigit$1(next) && (nextIsLast || isDigit$1(nextNext))) {
							// $00 through $99
							var nn = next + nextNext;
							var nnI = $parseInt(nn, 10) - 1;
							// if nn === '00' or nn > m, impl-defined
							result += (nn <= m && this.Type(captures[nnI]) === 'Undefined') ? '' : captures[nnI];
							i += 2;
						} else if (next === '<') {
							// eslint-disable-next-line max-depth
							if (this.Type(namedCaptures) === 'Undefined') {
								result += '$<';
								i += 2;
							} else {
								var endIndex = $indexOf(replacement, '>', i);
								// eslint-disable-next-line max-depth
								if (endIndex > -1) {
									var groupName = strSlice$2(replacement, i, endIndex);
									var capture = this.Get(namedCaptures, groupName);
									// eslint-disable-next-line max-depth
									if (this.Type(capture) !== 'Undefined') {
										result += this.ToString(capture);
									}
									i += '$<' + groupName + '>'.length;
								}
							}
						} else {
							result += '$';
						}
					}
				} else {
					// the final $, or else not a $
					result += replacement[i];
				}
			}
			return result;
		}
	});

	delete ES2018.EnumerableOwnProperties; // replaced with EnumerableOwnPropertyNames

	delete ES2018.IsPropertyDescriptor; // not an actual abstract operation

	var es2018 = ES2018;

	var $TypeError$6 = GetIntrinsic('%TypeError%');
	var $Number$2 = GetIntrinsic('%Number%');
	var MAX_SAFE_INTEGER$1 = $Number$2.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;

	var ES2019 = assign(assign({}, es2018), {
		// https://tc39.es/ecma262/#sec-add-entries-from-iterable
		AddEntriesFromIterable: function AddEntriesFromIterable(target, iterable, adder) {
			if (!this.IsCallable(adder)) {
				throw new $TypeError$6('Assertion failed: `adder` is not callable');
			}
			if (iterable == null) {
				throw new $TypeError$6('Assertion failed: `iterable` is present, and not nullish');
			}
			var iteratorRecord = this.GetIterator(iterable);
			while (true) { // eslint-disable-line no-constant-condition
				var next = this.IteratorStep(iteratorRecord);
				if (!next) {
					return target;
				}
				var nextItem = this.IteratorValue(next);
				if (this.Type(nextItem) !== 'Object') {
					var error = new $TypeError$6('iterator next must return an Object, got ' + objectInspect(nextItem));
					return this.IteratorClose(
						iteratorRecord,
						function () { throw error; } // eslint-disable-line no-loop-func
					);
				}
				try {
					var k = this.Get(nextItem, '0');
					var v = this.Get(nextItem, '1');
					this.Call(adder, target, [k, v]);
				} catch (e) {
					return this.IteratorClose(
						iteratorRecord,
						function () { throw e; } // eslint-disable-line no-loop-func
					);
				}
			}
		},

		// https://ecma-international.org/ecma-262/10.0/#sec-flattenintoarray
		// eslint-disable-next-line max-params, max-statements
		FlattenIntoArray: function FlattenIntoArray(target, source, sourceLen, start, depth) {
			var mapperFunction;
			if (arguments.length > 5) {
				mapperFunction = arguments[5];
			}

			var targetIndex = start;
			var sourceIndex = 0;
			while (sourceIndex < sourceLen) {
				var P = this.ToString(sourceIndex);
				var exists = this.HasProperty(source, P);
				if (exists === true) {
					var element = this.Get(source, P);
					if (typeof mapperFunction !== 'undefined') {
						if (arguments.length <= 6) {
							throw new $TypeError$6('Assertion failed: thisArg is required when mapperFunction is provided');
						}
						element = this.Call(mapperFunction, arguments[6], [element, sourceIndex, source]);
					}
					var shouldFlatten = false;
					if (depth > 0) {
						shouldFlatten = this.IsArray(element);
					}
					if (shouldFlatten) {
						var elementLen = this.ToLength(this.Get(element, 'length'));
						targetIndex = this.FlattenIntoArray(target, element, elementLen, targetIndex, depth - 1);
					} else {
						if (targetIndex >= MAX_SAFE_INTEGER$1) {
							throw new $TypeError$6('index too large');
						}
						this.CreateDataPropertyOrThrow(target, this.ToString(targetIndex), element);
						targetIndex += 1;
					}
				}
				sourceIndex += 1;
			}

			return targetIndex;
		},

		// https://ecma-international.org/ecma-262/10.0/#sec-trimstring
		TrimString: function TrimString(string, where) {
			var str = this.RequireObjectCoercible(string);
			var S = this.ToString(str);
			var T;
			if (where === 'start') {
				T = string_prototype_trimleft(S);
			} else if (where === 'end') {
				T = string_prototype_trimright(S);
			} else if (where === 'start+end') {
				T = string_prototype_trimleft(string_prototype_trimright(S));
			} else {
				throw new $TypeError$6('Assertion failed: invalid `where` value; must be "start", "end", or "start+end"');
			}
			return T;
		}
	});

	var es2019 = ES2019;

	const yearmonth = /(\d{4}|[+-]\d{6})-(\d{2})/;
	const monthday = /(\d{2})-(\d{2})/;
	const date = new RegExp(`${yearmonth.source}${/-(\d{2})/.source}`);

	const basetim = /(\d{2}):(\d{2})/;
	const seconds = /(?:(\d{2})(?:\.(\d{3})(?: (\d{3})(?:(\d{3}))?)?)?)?/;
	const time = new RegExp(`${basetim}${seconds}`);

	const datetime = new RegExp(`${date.source}T${time.source}`);

	const offset = /([+-][01]?[0-9]):?([0-5][0-9])/;

	const timezone$1 = /([+-][0-1]?[0-9]:?[0-5][0-9]|\[[^]+\])/;

	const duration = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?/;

	// Absolute
	const EPOCHNANOSECONDS = Symbol('slot-epochNanoSeconds');

	// TimeZone
	const IDENTIFIER = Symbol('slot-identifier');

	// DateTime, Date, Time, YearMonth, MonthDay
	const YEAR$1 = Symbol('slot-year');
	const MONTH = Symbol('slot-month');
	const DAY = Symbol('slot-day');
	const HOUR = Symbol('slot-hour');
	const MINUTE = Symbol('slot-minute');
	const SECOND = Symbol('slot-second');
	const MILLISECOND = Symbol('slot-millisecond');
	const MICROSECOND = Symbol('slot-microsecond');
	const NANOSECOND = Symbol('slot-nanosecond');

	// Duration
	const YEARS = Symbol('slot-years');
	const MONTHS = Symbol('slot-months');
	const DAYS = Symbol('slot-days');
	const HOURS = Symbol('slot-hours');
	const MINUTES = Symbol('slot-minutes');
	const SECONDS = Symbol('slot-seconds');
	const MILLISECONDS = Symbol('slot-milliseconds');
	const MICROSECONDS = Symbol('slot-microseconds');
	const NANOSECONDS = Symbol('slot-nanoseconds');

	const slots = new WeakMap();
	function CreateSlots(container) {
	  slots.set(container, {});
	}
	function GetSlot(container, id) {
	  return slots.get(container)[id];
	}
	function SetSlot(container, id, value) {
	  slots.get(container)[id] = value;
	}

	const DATETIME = new RegExp(`^${datetime.source}$`);

	class DateTime$1 {
	  constructor(
	    year,
	    month,
	    day,
	    hour,
	    minute,
	    second = 0,
	    millisecond = 0,
	    microsecond = 0,
	    nanosecond = 0,
	    disambiguation = 'constrain'
	  ) {
	    year = ES.ToInteger(year);
	    month = ES.ToInteger(month);
	    day = ES.ToInteger(day);
	    hour = ES.ToInteger(hour);
	    minute = ES.ToInteger(minute);
	    second = ES.ToInteger(second);
	    millisecond = ES.ToInteger(millisecond);
	    microsecond = ES.ToInteger(microsecond);
	    nanosecond = ES.ToInteger(nanosecond);
	    switch (disambiguation) {
	      case 'constrain':
	        ({ year, month, day } = ES.ConstrainDate(year, month, day));
	        ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.ConstrainTime(
	          hour,
	          minute,
	          second,
	          millisecond,
	          microsecond,
	          nanosecond
	        ));
	        break;
	      case 'balance':
	        ({ days, hour, minute, second, millisecond, microsecond, nanosecond } = ES.BalanceTime(
	          hour,
	          minute,
	          second,
	          millisecond,
	          microsecond,
	          nanosecond
	        ));
	        ({ year, month, day } = ES.BalanceDate(year, month, day + days));
	        break;
	      default:
	        ES.RejectDate(year, month, day);
	        ES.RejectTime(hour, minute, second, millisecond, microsecond, nanosecond);
	    }

	    CreateSlots(this);
	    SetSlot(this, YEAR$1, year);
	    SetSlot(this, MONTH, month);
	    SetSlot(this, DAY, day);
	    SetSlot(this, HOUR, hour);
	    SetSlot(this, MINUTE, minute);
	    SetSlot(this, SECOND, second);
	    SetSlot(this, MILLISECOND, millisecond);
	    SetSlot(this, MICROSECOND, microsecond);
	    SetSlot(this, NANOSECOND, nanosecond);
	  }
	  year() {
	    return GetSlot(this, YEAR$1);
	  }
	  month() {
	    return GetSlot(this, MONTH);
	  }
	  day() {
	    return GetSlot(this, DAY);
	  }
	  hour() {
	    return GetSlot(this, HOUR);
	  }
	  minute() {
	    return GetSlot(this, MINUTE);
	  }
	  second() {
	    return GetSlot(this, SECOND);
	  }
	  millisecond() {
	    return GetSlot(this, MILLISECOND);
	  }
	  microsecond() {
	    return GetSlot(this, MICROSECOND);
	  }
	  nanosecond() {
	    return GetSlot(this, NANOSECOND);
	  }
	  dayOfWeek() {
	    return ES.DayOfWeek(GetSlot(this, YEAR$1), GetSlot(this, MONTH), GetSlot(this, DAY));
	  }
	  dayOfYear() {
	    return ES.DayOfYear(GetSlot(this, YEAR$1), GetSlot(this, MONTH), GetSlot(this, DAY));
	  }
	  weekOfYear() {
	    return ES.WeekOfYear(GetSlot(this, YEAR$1), GetSlot(this, MONTH), GetSlot(this, DAY));
	  }
	  daysInYear() {
	    return ES.LeapYear(GetSlot(this, YEAR$1)) ? 366 : 365;
	  }
	  daysInMonth() {
	    return ES.DaysInMonth(GetSlot(this, YEAR$1), GetSlot(this, MONTH));
	  }
	  leapYear() {
	    return ES.LeapYear(GetSlot(this, YEAR$1));
	  }
	  with(dateTimeLike = {}, disambiguation = 'constrain') {
	    const {
	      year = GetSlot(this, YEAR$1),
	      month = GetSlot(this, MONTH),
	      day = GetSlot(this, DAY),
	      hour = GetSlot(this, HOUR),
	      minute = GetSlot(this, MINUTE),
	      second = GetSlot(this, SECOND),
	      millisecond = GetSlot(this, MILLISECOND),
	      microsecond = GetSlot(this, MICROSECOND),
	      nanosecond = GetSlot(this, NANOSECOND)
	    } = dateTimeLike;
	    return new DateTime$1(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, disambiguation);
	  }
	  plus(durationLike = {}, disambiguation = 'constrain') {
	    const duration = ES.GetIntrinsic('%Temporal.duration%')(durationLike);
	    let { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = this;
	    let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
	    ({ year, month, day } = ES.AddDate(year, month, day, years, months, days, disambiguation));
	    ({ days, hour, minute, second, millisecond, microsecond, nanosecond } = ES.AddTime(
	      hour,
	      minute,
	      second,
	      millisecond,
	      microsecond,
	      nanosecond,
	      hours,
	      minutes,
	      seconds,
	      milliseconds,
	      microseconds,
	      nanoseconds
	    ));
	    day += days;
	    ({ year, month, day } = ES.BalanceDate(year, month, day));
	    return new DateTime$1(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
	  }
	  minus(durationLike = {}, disambiguation = 'constrain') {
	    const duration = ES.GetIntrinsic('%Temporal.duration%')(durationLike);
	    let { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = this;
	    let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
	    ({ year, month, day } = ES.SubtractDate(year, month, day, years, months, days, disambiguation));
	    ({ days, hour, minute, second, millisecond, microsecond, nanosecond } = ES.SubtractTime(
	      hour,
	      minute,
	      second,
	      millisecond,
	      microsecond,
	      nanosecond,
	      hours,
	      minutes,
	      seconds,
	      milliseconds,
	      microseconds,
	      nanoseconds
	    ));
	    day += days;
	    ({ year, month, day } = ES.BalanceDate(year, month, day));
	    return new DateTime$1(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
	  }
	  difference(other, disambiguation = 'constrain') {
	    other = ES.GetIntrinsic('%Temporal.datetime%')(other);
	    const [one, two] = [this, other].sort(DateTime$1.compare);
	    let years = two.year - one.year;

	    let days = ES.DayOfYear(two.year, two.month, two.day) - ES.DayOfYear(one.year, one.month, one.day);
	    if (days < 0) {
	      years -= 1;
	      days = (ES.LeapYear(two.year) ? 366 : 365) + days;
	    }
	    if (disambiguation === 'constrain' && month === 2 && ES.LeapYear(one.year) && !ES.LeapYear(one.year + years))
	      ;

	    let hours = two.hour - one.hour;
	    let minutes = two.minute - one.minute;
	    let seconds = two.second - one.second;
	    let milliseconds = two.millisecond - one.millisecond;
	    let microseconds = two.microsecond - one.microsecond;
	    let nanoseconds = two.nanosecond - one.nanosecond;
	    let deltaDays = 0;
	    ({
	      days: deltaDays,
	      hour: hours,
	      minute: minutes,
	      second: seconds,
	      millisecond: milliseconds,
	      microsecond: microseconds,
	      nanosecond: nanoseconds
	    } = ES.BalanceTime(hours, minutes, seconds, milliseconds, microseconds, nanoseconds));
	    days += deltaDays;
	    if (days < 0) {
	      years -= 1;
	      days += ES.DaysInMonth(two.year, two.month);
	    }
	    const Duration = ES.GetIntrinsic('%Temporal.Duration%');
	    return new Duration(years, 0, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
	  }
	  toString() {
	    let year = ES.ISOYearString(GetSlot(this, YEAR$1));
	    let month = ES.ISODateTimePartString(GetSlot(this, MONTH));
	    let day = ES.ISODateTimePartString(GetSlot(this, DAY));
	    let hour = ES.ISODateTimePartString(GetSlot(this, HOUR));
	    let minute = ES.ISODateTimePartString(GetSlot(this, MINUTE));
	    let second = ES.ISOSecondsString(
	      GetSlot(this, SECOND),
	      GetSlot(this, MILLISECOND),
	      GetSlot(this, MICROSECOND),
	      GetSlot(this, NANOSECOND)
	    );
	    let resultString = `${year}-${month}-${day}T${hour}:${minute}${second ? `:${second}` : ''}`;
	    return resultString;
	  }
	  toLocaleString(...args) {
	    return new Intl.DateTimeFormat(...args).format(this);
	  }

	  inZone(timeZoneParam = 'UTC', disambiguation = 'earlier') {
	    const timeZone = ES.GetIntrinsic('%Temporal.timezone%')(timeZoneParam);
	    return timeZone.getAbsoluteFor(this, disambiguation);
	  }
	  getDate() {
	    const Date = ES.GetIntrinsic('%Temporal.Date%');
	    return new Date(GetSlot(this, YEAR$1), GetSlot(this, MONTH), GetSlot(this, DAY));
	  }
	  getYearMonth() {
	    const YearMonth = ES.GetIntrinsic('%Temporal.YearMonth%');
	    return new YearMonth(GetSlot(this, YEAR$1), GetSlot(this, MONTH));
	  }
	  getMonthDay() {
	    const MonthDay = ES.GetIntrinsic('%Temporal.MonthDay%');
	    return new MonthDay(GetSlot(this, MONTH), GetSlot(this, DAY));
	  }
	  getTime() {
	    const Time = ES.GetIntrinsic('%Temporal.Time%');
	    return new Time(
	      GetSlot(this, HOUR),
	      GetSlot(this, MINUTE),
	      GetSlot(this, SECOND),
	      GetSlot(this, MILLISECOND),
	      GetSlot(this, MICROSECOND),
	      GetSlot(this, NANOSECOND)
	    );
	  }

	  static fromString(isoStringParam) {
	    const isoString = ES.ToString(isoStringParam);
	    const match = DATETIME.exec(isoString);
	    if (!match) throw new RangeError('invalid datetime string');
	    const year = ES.ToInteger(match[1]);
	    const month = ES.ToInteger(match[2]);
	    const day = ES.ToInteger(match[3]);
	    const hour = ES.ToInteger(match[4]);
	    const minute = ES.ToInteger(match[5]);
	    const second = match[6] ? ES.ToInteger(match[6]) : 0;
	    const millisecond = match[7] ? ES.ToInteger(match[7]) : 0;
	    const microsecond = match[8] ? ES.ToInteger(match[8]) : 0;
	    const nanosecond = match[9] ? ES.ToInteger(match[9]) : 0;
	    return new DateTime$1(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, 'reject');
	  }
	  static compare(one, two) {
	    one = ES.GetIntrinsic('%Temporal.datetime%')(one);
	    two = ES.GetIntrinsic('%Temporal.datetime%')(two);
	    if (one.year !== two.year) return one.year - two.year;
	    if (one.month !== two.month) return one.month - two.month;
	    if (one.day !== two.day) return one.day - two.day;
	    if (one.hour !== two.hour) return one.hour - two.hour;
	    if (one.minute !== two.minute) return one.minute - two.minute;
	    if (one.second !== two.second) return one.second - two.second;
	    if (one.millisecond !== two.millisecond) return one.millisecond - two.millisecond;
	    if (one.microsecond !== two.microsecond) return one.microsecond - two.microsecond;
	    if (one.nanosecond !== two.nanosecond) return one.nanosecond - two.nanosecond;
	    return 0;
	  }
	}
	DateTime$1.prototype.toJSON = DateTime$1.prototype.toString;
	Object.defineProperty(DateTime$1.prototype, Symbol.toStringTag, {
	  value: 'Temporal.DateTime'
	});

	const DATE = new RegExp(`^${date.source}$`);

	class Date$1 {
	  constructor(year, month, day, disambiguation) {
	    year = ES.ToInteger(year);
	    month = ES.ToInteger(month);
	    day = ES.ToInteger(day);
	    switch (disambiguation) {
	      case 'constrain':
	        ({ year, month, day } = ES.ConstrainDate(year, month, day));
	        break;
	      case 'balance':
	        ({ year, month, day } = ES.BalanceDate(year, month, day));
	        break;
	      default:
	        ES.RejectDate(year, month, day);
	    }

	    CreateSlots(this);
	    SetSlot(this, YEAR$1, year);
	    SetSlot(this, MONTH, month);
	    SetSlot(this, DAY, day);
	  }
	  year() {
	    return GetSlot(this, YEAR$1);
	  }
	  month() {
	    return GetSlot(this, MONTH);
	  }
	  day() {
	    return GetSlot(this, DAY);
	  }
	  dayOfWeek() {
	    return ES.DayOfWeek(GetSlot(this, THIS).year, GetSlot(this, THIS).month, GetSlot(this, DAY));
	  }
	  dayOfYear() {
	    return ES.DayOfYear(GetSlot(this, THIS).year, GetSlot(this, THIS).month, GetSlot(this, DAY));
	  }
	  weekOfYear() {
	    return ES.WeekOfYear(GetSlot(this, THIS).year, GetSlot(this, THIS).month, GetSlot(this, DAY));
	  }
	  daysInYear() {
	    return ES.LeapYear(GetSlot(this, YEAR$1)) ? 366 : 365;
	  }
	  daysInMonth() {
	    return ES.DaysInMonth(GetSlot(this, THIS).year, GetSlot(this, MONTH));
	  }
	  leapYear() {
	    return ES.LeapYear(GetSlot(this, YEAR$1));
	  }
	  with(dateLike = {}, disambiguation = 'constrain') {
	    const { year = GetSlot(this, YEAR$1), month = GetSlot(this, MONTH), day = GetSlot(this, DAY) } = dateTimeLike;
	    return new Date$1(year, month, day, disambiguation);
	  }
	  plus(durationLike = {}, disambiguation = 'constrain') {
	    const duration = ES.GetIntrinsic('%Temporal.duration%')(durationLike);
	    let { year, month, day } = this;
	    let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
	    if (hours || minutes || seconds || milliseconds || microseconds || nanoseconds)
	      throw new RangeError('invalid duration');
	    ({ year, month, day } = ES.AddDate(year, month, day, years, months, days, disambiguation));
	    ({ year, month, day } = ES.BalanceDate(year, month, day));
	    return new Date$1(year, month, day);
	  }
	  minus(durationLike = {}, disambiguation = 'constrain') {
	    const duration = ES.GetIntrinsic('%Temporal.duration%')(durationLike);
	    let { year, month, day } = this;
	    let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
	    if (hours || minutes || seconds || milliseconds || microseconds || nanoseconds)
	      throw new RangeError('invalid duration');
	    ({ year, month, day } = ES.SubtractDate(year, month, day, years, months, days, disambiguation));
	    ({ year, month, day } = ES.BalanceDate(year, month, day));
	    return new Date$1(year, month, day);
	  }
	  difference(other, disambiguation = 'constrain') {
	    other = ES.GetIntrinsic('%Temporal.date%')(other);
	    const [one, two] = [this, other].sort(DateTime.compare);
	    let years = two.year - one.year;

	    let days = ES.DayOfYear(two.year, two.month, two.day) - ES.DayOfYear(one.year, one.month, one.day);
	    if (days < 0) {
	      years -= 1;
	      days = (ES.LeapYear(two.year) ? 366 : 365) + days;
	    }
	    if (disambiguation === 'constrain' && month === 2 && ES.LeapYear(one.year) && !ES.LeapYear(one.year + years))
	      ;

	    if (days < 0) {
	      years -= 1;
	      days += ES.DaysInMonth(two.year, two.month);
	    }
	    const Duration = ES.GetIntrinsic('%Temporal.Duration%');
	    return new Duration(years, 0, days, 0, 0, 0, 0, 0, 0);
	  }
	  toString() {
	    let year = ES.ISOYearString(GetSlot(this, YEAR$1));
	    let month = ES.ISODateTimePartString(GetSlot(this, MONTH));
	    let day = ES.ISODateTimePartString(GetSlot(this, DAY));
	    let resultString = `${year}-${month}-${day}`;
	    return resultString;
	  }
	  toLocaleString(...args) {
	    return new Intl.DateTimeFormat(...args).format(this);
	  }
	  withTime(timeLike, disambiguation = 'constrain') {
	    const year = GetSlot(this, YEAR$1);
	    const month = GetSlot(this, MONTH);
	    const day = GetSlot(this, DAY);
	    timeLike = ES.GetIntrinsic('%Temporal.time%')(timeLike);
	    const { hour, minute, second, millisecond, microsecond, nanosecond } = timeLike;
	    const DateTime = ES.GetIntrinsic('%Temporal.DateTime%');
	    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, disambiguation);
	  }
	  getYearMonth() {
	    const YearMonth = ES.GetIntrinsic('%Temporal.YearMonth%');
	    return new YearMonth(GetSlot(this, YEAR$1), GetSlot(this, MONTH));
	  }
	  getMonthDay() {
	    const MonthDay = ES.GetIntrinsic('%Temporal.MonthDay%');
	    return new MonthDay(GetSlot(this, MONTH), GetSlot(this, DAY));
	  }

	  static fromString(isoStringParam) {
	    const isoString = ES.ToString(isoStringParam);
	    const match = DATE.exec(isoString);
	    if (!match) throw new RangeError('invalid date string');
	    const year = ES.ToInteger(match[1]);
	    const month = ES.ToInteger(match[2]);
	    const day = ES.ToInteger(match[3]);
	    return new Date$1(year, month, day, 'reject');
	  }
	  static compare(one, two) {
	    one = ES.GetIntrinsic('%Temporal.date%')(one);
	    two = ES.GetIntrinsic('%Temporal.date%')(two);
	    if (one.year !== two.year) return one.year - two.year;
	    if (one.month !== two.month) return one.month - two.month;
	    if (one.day !== two.day) return one.day - two.day;
	    return 0;
	  }
	}
	Date$1.prototype.toJSON = Date$1.prototype.toString;
	Object.defineProperty(Date$1.prototype, Symbol.toStringTag, {
	  value: 'Temporal.Date'
	});

	const DATE$1 = new RegExp(`^${yearmonth.source}$`);

	class YearMonth {
	  constructor(year, month, disambiguation) {
	    year = ES.ToInteger(year);
	    month = ES.ToInteger(month);
	    ({ year, month } = ES.ConstrainDate(year, month, 1));
	    switch (disambiguation) {
	      case 'constrain':
	        ({ year, month } = ES.ConstrainDate(year, month, 1));
	        break;
	      case 'balance':
	        ({ year, month } = ES.BalanceYearMonth(year, month));
	        break;
	      default:
	        ES.RejectDate(year, month, 1);
	    }
	    CreateSlots(this);
	    SetSlot(this, YEAR$1, year);
	    SetSlot(this, MONTH, month);
	  }
	  get year() {
	    return GetSlot(this, YEAR$1);
	  }
	  get month() {
	    return GetSlot(this, MONTH);
	  }
	  get daysInMonth() {
	    return ES.DaysInMonth(GetSlot(this, THIS).year, GetSlot(this, MONTH));
	  }
	  get leapYear() {
	    return ES.LeapYear(GetSlot(this, YEAR$1));
	  }
	  with(dateLike = {}, disambiguation = 'constrain') {
	    const { year = GetSlot(this, YEAR$1), month = GetSlot(this, MONTH) } = dateTimeLike;
	    return new YearMonth(year, month, disambiguation);
	  }
	  plus(durationLike = {}, disambiguation = 'constrain') {
	    const duration = ES.GetIntrinsic('%Temporal.duration%')(duration);
	    let { year, month } = this;
	    let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
	    if ((hours || minutes || seconds || milliseconds || microseconds || nanoseconds))
	      throw new RangeError('invalid duration');
	    ({ year, month } = ES.AddDate(year, month, 1, years, months, 0, disambiguation));
	    ({ year, month } = ES.BalanceYearMonth(year, month));
	    return new YearMonth(year, month);
	  }
	  minus(durationLike = {}, disambiguation = 'constrain') {
	    const duration = ES.GetIntrinsic('%Temporal.duration%')(duration);
	    let { year, month } = this;
	    let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
	    if (days || hours || minutes || seconds || milliseconds || microseconds || nanoseconds)
	      throw new RangeError('invalid duration');
	    ({ year, month } = ES.SubtractDate(year, month, 1, years, months, 0, disambiguation));
	    ({ year, month } = ES.BalanceYearMonth(year, month));
	    return new YearMonth(year, month);
	  }
	  difference(other) {
	    other = ES.GetIntrinsic('%Temporal.yearmonth%')(other);
	    const [one, two] = [this, other].sort(DateTime.compare);
	    let years = two.year - one.year;
	    let months = two.month - one.month;
	    if (months < 0) {
	      years -= 1;
	      months += 12;
	    }
	    const Duration = ES.GetIntrinsic('%Temporal.Duration%');
	    return new Duration(years, months);
	  }
	  toString() {
	    let year = ES.ISOYearString(GetSlot(this, YEAR$1));
	    let month = ES.ISODateTimePartString(GetSlot(this, MONTH));
	    let resultString = `${year}-${month}`;
	    return resultString;
	  }
	  toLocaleString(...args) {
	    return new Intl.DateTimeFormat(...args).format(this);
	  }
	  withDay(day, disambiguation = 'constrain') {
	    const year = GetSlot(this, YEAR$1);
	    const month = GetSlot(this, MONTH);
	    const Date = ES.GetIntrinsic('%Temporal.Date%');
	    return new Date(year, month, day, disambiguation);
	  }

	  static fromString(isoStringParam) {
	    const isoString = ES.ToString(isoStringParam);
	    const match = DATE$1.exec(isoString);
	    if (!match) throw new RangeError('invalid date string');
	    const year = ES.ToInteger(match[1]);
	    const month = ES.ToInteger(match[2]);
	    return new YearMonth(year, month, 'reject');
	  }
	  static compare(one, two) {
	    one = ES.GetIntrinsic('%Temporal.yearmonth%')(one);
	    two = ES.GetIntrinsic('%Temporal.yearmonth%')(two);
	    if (one.year !== two.year) return one.year - two.year;
	    if (one.month !== two.month) return one.month - two.month;
	    return 0;
	  }
	}
	YearMonth.prototype.toJSON = YearMonth.prototype.toString;
	Object.defineProperty(YearMonth.prototype, Symbol.toStringTag, {
	  value: 'Temporal.YearMonth'
	});

	const DATE$2 = new RegExp(`^${monthday.source}$`);

	class MonthDay {
	  constructor(month, day, disambiguation) {
	    month = ES.ToInteger(month);
	    day = ES.ToInteger(day);
	    switch (disambiguation) {
	      case 'constrain':
	        ({ month, day } = ES.ConstrainDate(1970, month, day));
	        break;
	      case 'balance':
	        ({ month, day } = ES.BalanceDate(1970, month, day));
	        break;
	      default:
	        ES.RejectDate(1970, month, day);
	    }

	    CreateSlots(this);
	    SetSlot(this, MONTH, month);
	    SetSlot(this, DAY, day);
	  }

	  get month() {
	    return GetSlot(this, MONTH);
	  }
	  get day() {
	    return GetSlot(this, DAY);
	  }

	  with(dateLike = {}, disambiguation = 'constrain') {
	    const { month = GetSlot(this, MONTH), day = GetSlot(this, DAY) } = dateTimeLike;
	    return new MonthDay(month, day, disambiguation);
	  }
	  plus(durationLike = {}, disambiguation = 'constrain') {
	    const duration = ES.GetIntrinsic('%Temporal.duration')(durationLike);
	    let { month, day } = this;
	    let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
	    if (years || hours || minutes || seconds || milliseconds || microseconds || nanoseconds)
	      throw new RangeError('invalid duration');
	    ({ year, month, day } = ES.AddDate(year, month, day, years, months, days, disambiguation));
	    ({ month, day } = ES.BalanceDate(1970, month, day));
	    return new MonthDay(month, day);
	  }
	  minus(durationLike = {}, disambiguation = 'constrain') {
	    const duration = ES.GetIntrinsic('%Temporal.duration')(durationLike);
	    let { year, month, day } = this;
	    let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
	    if (hours || minutes || seconds || milliseconds || microseconds || nanoseconds)
	      throw new RangeError('invalid duration');
	    ({ year, month, day } = ES.SubtractDate(year, month, day, years, months, days, disambiguation));
	    ({ year, month, day } = ES.BalanceDate(year, month, day));
	    return new MonthDay(month, day);
	  }
	  difference(other, disambiguation = 'constrain') {
	    other = ES.GetIntrinsic('%Temporal.monthday')(other);
	    const [one, two] = [this, other].sort(MonthDay.compare);
	    let months = two.month - one.month;
	    let days = (two.days = one.days);
	    if (days < 0) {
	      days = ES.DaysInMonth(1970, two.month) + days;
	      months -= 1;
	    }
	    const Duration = ES.GetIntrinsic('%Temporal.Duration%');
	    return new Duration(0, months, days, 0, 0, 0, 0, 0, 0);
	  }
	  toString() {
	    let year = ES.ISOYearString(GetSlot(this, YEAR));
	    let month = ES.ISODateTimePartString(GetSlot(this, MONTH));
	    let day = ES.ISODateTimePartString(GetSlot(this, DAY));
	    let resultString = `${year}-${month}-${day}`;
	    return resultString;
	  }
	  toLocaleString(...args) {
	    return new Intl.DateTimeFormat(...args).format(this);
	  }
	  withYear(year) {
	    const month = GetSlot(this, MONTH);
	    const day = GetSlot(this, DAY);
	    const Date = ES.GetIntrinsic('%Temporal.Date%');
	    return new Date(year, month, day);
	  }

	  static fromString(isoStringParam) {
	    const isoString = ES.ToString(isoStringParam);
	    const match = DATE$2.exec(isoString);
	    if (!match) throw new RangeError('invalid yearmonth string');
	    const month = ES.ToInteger(match[1]);
	    const day = ES.ToInteger(match[2]);
	    return new MonthDay(month, day, 'reject');
	  }
	  static compare(one, two) {
	    one = ES.GetIntrinsic('%Temporal.monthday')(one);
	    two = ES.GetIntrinsic('%Temporal.monthday')(two);
	    if (one.month !== two.month) return one.month - two.month;
	    if (one.day !== two.day) return one.day - two.day;
	    return 0;
	  }
	}
	MonthDay.prototype.toJSON = MonthDay.prototype.toString;
	Object.defineProperty(MonthDay.prototype, Symbol.toStringTag, {
	  value: 'Temporal.MonthDay'
	});

	const TIME = new RegExp(`^${time.source}$`);

	class Time {
	  constructor(
	    hour,
	    minute,
	    second = 0,
	    millisecond = 0,
	    microsecond = 0,
	    nanosecond = 0,
	    disambiguation = 'constrain'
	  ) {
	    hour = ES.ToInteger(hour);
	    minute = ES.ToInteger(minute);
	    second = ES.ToInteger(second);
	    millisecond = ES.ToInteger(millisecond);
	    microsecond = ES.ToInteger(microsecond);
	    nanosecond = ES.ToInteger(nanosecond);
	    switch (disambiguation) {
	      case 'constrain':
	        ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.ConstrainTime(
	          hour,
	          minute,
	          second,
	          millisecond,
	          microsecond,
	          nanosecond
	        ));
	        break;
	      case 'balance':
	        ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.BalanceTime(
	          hour,
	          minute,
	          second,
	          millisecond,
	          microsecond,
	          nanosecond
	        ));
	        break;
	      default:
	        ES.RejectTime(hour, minute, second, millisecond, microsecond, nanosecond);
	    }

	    CreateSlots(this);
	    SetSlot(this, HOUR, hour);
	    SetSlot(this, MINUTE, minute);
	    SetSlot(this, SECOND, second);
	    SetSlot(this, MILLISECOND, millisecond);
	    SetSlot(this, MICROSECOND, microsecond);
	    SetSlot(this, NANOSECOND, nanosecond);
	  }

	  get hour() {
	    return GetSlot(this, HOUR);
	  }
	  get minute() {
	    return GetSlot(this, MINUTE);
	  }
	  get second() {
	    return GetSlot(this, SECOND);
	  }
	  get millisecond() {
	    return GetSlot(this, MILLISECOND);
	  }
	  get microsecond() {
	    return GetSlot(this, MICROSECOND);
	  }
	  get nanosecond() {
	    return GetSlot(this, NANOSECOND);
	  }

	  with(timeLike = {}, disambiguation = 'constrain') {
	    const {
	      hour = GetSlot(this, HOUR),
	      minute = GetSlot(this, MINUTE),
	      second = GetSlot(this, SECOND),
	      millisecond = GetSlot(this, MILLISECOND),
	      microsecond = GetSlot(this, MICROSECOND),
	      nanosecond = GetSlot(this, NANOSECOND)
	    } = timeLike;
	    return new Time(hour, minute, second, millisecond, microsecond, nanosecond, disambiguation);
	  }
	  plus(durationLike) {
	    const duration = ES.GetIntrinsic('%Temporal.duration%')(durationLike);
	    let { hour, minute, second, millisecond, microsecond, nanosecond } = this;
	    let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
	    if (years || months || days) throw new RangeError('invalid duration');
	    ({ hour, minute, second, minute, microsecond, nanosecond } = ES.AddTime(
	      hour,
	      minute,
	      second,
	      minute,
	      microsecond,
	      nanosecond,
	      hours,
	      minutes,
	      seconds,
	      milliseconds,
	      microseconds,
	      nanoseconds
	    ));
	    ({ hour, minute, second, minute, microsecond, nanosecond } = ES.BalanceTime(
	      hour,
	      minute,
	      second,
	      minute,
	      microsecond,
	      nanosecond,
	      hours,
	      minutes,
	      seconds,
	      milliseconds,
	      microseconds,
	      nanoseconds
	    ));
	    return new Time(hour, minute, second, millisecond, microsecond, nanosecond);
	  }
	  minus(durationLike) {
	    const duration = ES.GetIntrinsic('%Temporal.duration%')(durationLike);
	    let { hour, minute, second, millisecond, microsecond, nanosecond } = this;
	    let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
	    if (years || months || days) throw new RangeError('invalid duration');
	    ({ hour, minute, second, minute, microsecond, nanosecond } = ES.SubtractTime(
	      hour,
	      minute,
	      second,
	      minute,
	      microsecond,
	      nanosecond,
	      hours,
	      minutes,
	      seconds,
	      milliseconds,
	      microseconds,
	      nanoseconds
	    ));
	    ({ hour, minute, second, minute, microsecond, nanosecond } = ES.BalanceTime(
	      hour,
	      minute,
	      second,
	      minute,
	      microsecond,
	      nanosecond,
	      hours,
	      minutes,
	      seconds,
	      milliseconds,
	      microseconds,
	      nanoseconds
	    ));
	    return new Time(hour, minute, second, millisecond, microsecond, nanosecond);
	  }
	  difference(other = {}) {
	    other = ES.GetIntrinsic('%Temporal.time%')(other);
	    const [one, two] = [
	      this,
	      Object.assign(
	        {
	          hours: 0,
	          minute: 0,
	          second: 0,
	          millisecond: 0,
	          microsecond: 0,
	          nanosecond: 0
	        },
	        other
	      )
	    ].sort(Time.compare);
	    const hours = two.hour - one.hour;
	    const minutes = two.minute - one.minute;
	    const seconds = two.second - one.seconds;
	    const milliseconds = two.millisecond - one.millisecond;
	    const microseconds = two.microsecond - one.microsecond;
	    const nanoseconds = two.nanosecond - one.nanosecond;
	    return new Duration(0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
	  }

	  toString() {
	    let hour = ES.ISODateTimePartString(GetSlot(this, HOUR));
	    let minute = ES.ISODateTimePartString(GetSlot(this, MINUTE));
	    let seconds = ES.ISOSecondsString(
	      GetSlot(this, SECOND),
	      GetSlot(this, MILLISECOND),
	      GetSlot(this, MICROSECOND),
	      GetSlot(this, NANOSECOND)
	    );
	    let resultString = `${hour}:${minute}${seconds ? `:${seconds}` : ''}`;
	    return resultString;
	  }
	  toLocaleString(...args) {
	    return new Intl.DateTimeFormat(...args).format(this);
	  }

	  withDate(dateLike = {}, disambiguation = 'constrain') {
	    let { year, month, day } = ES.GetIntrinsic('%Temporal.date%')(dateLike);
	    let { hour, minute, second, millisecond, microsecond, nanosecond } = this;
	    const DateTime = ES.GetIntrinsic('%Temporal.DateTime%');
	    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, disambiguation);
	  }

	  static fromString(isoStringParam) {
	    const isoString = ES.ToString(isoStringParam);
	    const match = TIME.exec(isoString);
	    if (!match) throw new RangeError('invalid datetime string');
	    const hour = ES.ToInteger(match[1]);
	    const minute = ES.ToInteger(match[2]);
	    const second = match[3] ? ES.ToInteger(match[3]) : 0;
	    const millisecond = match[4] ? ES.ToInteger(match[4]) : 0;
	    const microsecond = match[5] ? ES.ToInteger(match[5]) : 0;
	    const nanosecond = match[6] ? ES.ToInteger(match[6]) : 0;
	    return new Time(hour, minute, second, millisecond, microsecond, nanosecond, 'reject');
	  }
	  static compare(one, two) {
	    one = ES.GetIntrinsic('%Temporal.time%')(one);
	    two = ES.GetIntrinsic('%Temporal.time%')(two);
	    if (one.hour !== two.hour) return one.hour - two.hour;
	    if (one.minute !== two.minute) return one.minute - two.minute;
	    if (one.second !== two.second) return one.second - two.second;
	    if (one.millisecond !== two.millisecond) return one.millisecond - two.millisecond;
	    if (one.microsecond !== two.microsecond) return one.microsecond - two.microsecond;
	    if (one.nanosecond !== two.nanosecond) return one.nanosecond - two.nanosecond;
	    return 0;
	  }
	}
	Time.prototype.toJSON = Time.prototype.toString;
	Object.defineProperty(Time.prototype, Symbol.toStringTag, {
	  value: 'Temporal.Time'
	});

	class Absolute {
	  constructor(epochNanoseconds) {
	    CreateSlots(this);
	    SetSlot(this, EPOCHNANOSECONDS, epochNanoseconds);
	  }

	  getEpochSeconds() {
	    let epochNanoSeconds = GetSlot(this, EPOCHNANOSECONDS);
	    let epochSecondsBigInt = epochNanoSeconds / 1000000000n;
	    let epochSeconds = ES.ToNumber(epochSecondsBigInt);
	    return epochSeconds;
	  }
	  getEpochMilliseconds() {
	    let epochNanoSeconds = GetSlot(this, EPOCHNANOSECONDS);
	    let epochMillisecondsBigInt = epochNanoSeconds / 1000000n;
	    let epochMilliseconds = ES.ToNumber(epochMillisecondsBigInt);
	    return epochMilliseconds;
	  }
	  getEpochMicroseconds() {
	    let epochNanoSeconds = GetSlot(this, EPOCHNANOSECONDS);
	    let epochMicroseconds = epochNanoSeconds / 1000n;
	    return epochMicroseconds;
	  }
	  getEpochNanoseconds() {
	    let epochNanoSeconds = GetSlot(this, EPOCHNANOSECONDS);
	    return epochNanoSeconds;
	  }

	  plus(durationLike = {}) {
	    const duration = ES.GetIntrinsic('%Temporal.duration%')(durationLike);
	    if (duration.years) throw new RangeError(`invalid duration field years`);
	    if (duration.months) throw new RangeError(`invalid duration field months`);

	    let delta = BigInt(duration.days) * 86400000000000n;
	    delta += BigInt(duration.hours) * 3600000000000n;
	    delta += BigInt(duration.minutes) * 60000000000n;
	    delta += BigInt(duration.seconds) * 1000000000n;
	    delta += BigInt(duration.milliseconds) * 1000000n;
	    delta += BigInt(duration.microseconds) * 1000n;
	    delta += BigInt(duration.nanosecond);

	    const result = GetSlot(this, EPOCHNANOSECONDS) + delta;
	    return new Absolute(result);
	  }
	  minus(durationLike = {}) {
	    const duration = ES.GetIntrinsic('%Temporal.duration%')(durationLike);
	    if (duration.years) throw new RangeError(`invalid duration field years`);
	    if (duration.months) throw new RangeError(`invalid duration field months`);

	    let delta = BigInt(duration.days) * 86400000000000n;
	    delta += BigInt(duration.hours) * 3600000000000n;
	    delta += BigInt(duration.minutes) * 60000000000n;
	    delta += BigInt(duration.seconds) * 1000000000n;
	    delta += BigInt(duration.milliseconds) * 1000000n;
	    delta += BigInt(duration.microseconds) * 1000n;
	    delta += BigInt(duration.nanosecond);

	    const result = GetSlot(this, EPOCHNANOSECONDS) - delta;
	    return new Absolute(result);
	  }
	  difference(other) {
	    other = ES.GetIntrinsic('%Temporal.absolute%')(other);

	    const [one, two] = [this, other].sort(Absoulte.compare);
	    const delta = two.getEpochNanoseconds() - one.getEpochNanoseconds();
	    const duration = ES.GetIntrinsic('%Temporal.duration%')(delta);
	    return duration;
	  }
	  toString(timeZoneParam = 'UTC') {
	    let timeZone = ES.GetIntrinsic('%Temporal.timezone%')(timeZoneParam);
	    let dateTime = timeZone.getDateTimeFor(this);
	    let year = ES.ISOYearString(dateTime.year);
	    let month = ES.ISODateTimePartString(dateTime.month);
	    let day = ES.ISODateTimePartString(dateTime.day);
	    let hour = ES.ISODateTimePartString(dateTime.hour);
	    let minute = ES.ISODateTimePartString(dateTime.minute);
	    let seconds = ES.ISOSecondsString(dateTime.second, dateTime.millisecond, dateTime.microsecond, dateTime.nanosecond);
	    let timeZoneString = ES.ISOTimeZoneString(timeZone, this);
	    let resultString = `${year}-${month}-${day}T${hour}:${minute}${seconds ? `:${seconds}` : ''}${timeZoneString}`;
	    return resultString;
	  }
	  toLocaleString(...args) {
	    return new Intl.DateTimeFormat(...args).format(this);
	  }
	  inZone(timeZoneParam = 'UTC') {
	    const timeZone = ES.ToTimeZone(timeZoneParam);
	    return timeZone.getDateTimeFor(this);
	  }

	  static fromEpochSeconds(epochSecondsParam) {
	    let epochSeconds = ES.ToNumber(epochSecondsParam);
	    let epochSecondsBigInt = BigInt(epochSeconds);
	    let epochNanoSeconds = epochSecondsBigInt * 1000000000n;
	    let resultObject = new Absolute(epochNanoSeconds);
	    return resultObject;
	  }
	  static fromEpochMilliseconds(epochMillisecondsParam) {
	    let epochMilliseconds = ES.ToNumber(epochMillisecondsParam);
	    let epochMillisecondsBigInt = BigInt(epochMilliseconds);
	    let epochNanoSeconds = epochMillisecondsBigInt * 1000000n;
	    let resultObject = new Absolute(epochNanoSeconds);
	    return resultObject;
	  }
	  static fromEpochMicroseconds(epochMicrosecondsParam) {
	    let epochMicroseconds = BigInt(epochMicrosecondsParam);
	    let epochNanoSeconds = epochMicroseconds * 1000n;
	    let resultObject = new Absolute(epochNanoSeconds);
	    return resultObject;
	  }
	  static fromEpochNanoseconds(epochNanosecondsParam) {
	    let epochNanoseconds = BigInt(epochNanosecondsParam);
	    let resultObject = new Absolute(epochNanoseconds);
	    return resultObject;
	  }
	  static fromString(isoString) {}
	}
	Absolute.prototype.toJSON = Absolute.prototype.toString;
	Object.defineProperty(Absolute.prototype, Symbol.toStringTag, {
	  value: 'Temporal.Absolute'
	});

	const ZONES = [
	  'Africa/Abidjan',
	  'Africa/Accra',
	  'Africa/Addis_Ababa',
	  'Africa/Algiers',
	  'Africa/Asmara',
	  'Africa/Bamako',
	  'Africa/Bangui',
	  'Africa/Banjul',
	  'Africa/Bissau',
	  'Africa/Blantyre',
	  'Africa/Brazzaville',
	  'Africa/Bujumbura',
	  'Africa/Cairo',
	  'Africa/Casablanca',
	  'Africa/Ceuta',
	  'Africa/Conakry',
	  'Africa/Dakar',
	  'Africa/Dar_es_Salaam',
	  'Africa/Djibouti',
	  'Africa/Douala',
	  'Africa/El_Aaiun',
	  'Africa/Freetown',
	  'Africa/Gaborone',
	  'Africa/Harare',
	  'Africa/Johannesburg',
	  'Africa/Juba',
	  'Africa/Kampala',
	  'Africa/Khartoum',
	  'Africa/Kigali',
	  'Africa/Kinshasa',
	  'Africa/Lagos',
	  'Africa/Libreville',
	  'Africa/Lome',
	  'Africa/Luanda',
	  'Africa/Lubumbashi',
	  'Africa/Lusaka',
	  'Africa/Malabo',
	  'Africa/Maputo',
	  'Africa/Maseru',
	  'Africa/Mbabane',
	  'Africa/Mogadishu',
	  'Africa/Monrovia',
	  'Africa/Nairobi',
	  'Africa/Ndjamena',
	  'Africa/Niamey',
	  'Africa/Nouakchott',
	  'Africa/Ouagadougou',
	  'Africa/Porto-Novo',
	  'Africa/Sao_Tome',
	  'Africa/Timbuktu',
	  'Africa/Tripoli',
	  'Africa/Tunis',
	  'Africa/Windhoek',
	  'America/Adak',
	  'America/Anchorage',
	  'America/Anguilla',
	  'America/Antigua',
	  'America/Araguaina',
	  'America/Argentina/Buenos_Aires',
	  'America/Argentina/Catamarca',
	  'America/Argentina/ComodRivadavia',
	  'America/Argentina/Cordoba',
	  'America/Argentina/Jujuy',
	  'America/Argentina/La_Rioja',
	  'America/Argentina/Mendoza',
	  'America/Argentina/Rio_Gallegos',
	  'America/Argentina/Salta',
	  'America/Argentina/San_Juan',
	  'America/Argentina/San_Luis',
	  'America/Argentina/Tucuman',
	  'America/Argentina/Ushuaia',
	  'America/Aruba',
	  'America/Asuncion',
	  'America/Atikokan',
	  'America/Atka',
	  'America/Bahia',
	  'America/Bahia_Banderas',
	  'America/Barbados',
	  'America/Belem',
	  'America/Belize',
	  'America/Blanc-Sablon',
	  'America/Boa_Vista',
	  'America/Bogota',
	  'America/Boise',
	  'America/Buenos_Aires',
	  'America/Cambridge_Bay',
	  'America/Campo_Grande',
	  'America/Cancun',
	  'America/Caracas',
	  'America/Catamarca',
	  'America/Cayenne',
	  'America/Cayman',
	  'America/Chicago',
	  'America/Chihuahua',
	  'America/Coral_Harbour',
	  'America/Cordoba',
	  'America/Costa_Rica',
	  'America/Creston',
	  'America/Cuiaba',
	  'America/Curacao',
	  'America/Danmarkshavn',
	  'America/Dawson',
	  'America/Dawson_Creek',
	  'America/Denver',
	  'America/Detroit',
	  'America/Dominica',
	  'America/Edmonton',
	  'America/Eirunepe',
	  'America/El_Salvador',
	  'America/Ensenada',
	  'America/Fort_Nelson',
	  'America/Fort_Wayne',
	  'America/Fortaleza',
	  'America/Glace_Bay',
	  'America/Godthab',
	  'America/Goose_Bay',
	  'America/Grand_Turk',
	  'America/Grenada',
	  'America/Guadeloupe',
	  'America/Guatemala',
	  'America/Guayaquil',
	  'America/Guyana',
	  'America/Halifax',
	  'America/Havana',
	  'America/Hermosillo',
	  'America/Indiana/Indianapolis',
	  'America/Indiana/Knox',
	  'America/Indiana/Marengo',
	  'America/Indiana/Petersburg',
	  'America/Indiana/Tell_City',
	  'America/Indiana/Vevay',
	  'America/Indiana/Vincennes',
	  'America/Indiana/Winamac',
	  'America/Indianapolis',
	  'America/Inuvik',
	  'America/Iqaluit',
	  'America/Jamaica',
	  'America/Jujuy',
	  'America/Juneau',
	  'America/Kentucky/Louisville',
	  'America/Kentucky/Monticello',
	  'America/Knox_IN',
	  'America/Kralendijk',
	  'America/La_Paz',
	  'America/Lima',
	  'America/Los_Angeles',
	  'America/Louisville',
	  'America/Lower_Princes',
	  'America/Maceio',
	  'America/Managua',
	  'America/Manaus',
	  'America/Marigot',
	  'America/Martinique',
	  'America/Matamoros',
	  'America/Mazatlan',
	  'America/Mendoza',
	  'America/Menominee',
	  'America/Merida',
	  'America/Metlakatla',
	  'America/Mexico_City',
	  'America/Miquelon',
	  'America/Moncton',
	  'America/Monterrey',
	  'America/Montevideo',
	  'America/Montreal',
	  'America/Montserrat',
	  'America/Nassau',
	  'America/New_York',
	  'America/Nipigon',
	  'America/Nome',
	  'America/Noronha',
	  'America/North_Dakota/Beulah',
	  'America/North_Dakota/Center',
	  'America/North_Dakota/New_Salem',
	  'America/Ojinaga',
	  'America/Panama',
	  'America/Pangnirtung',
	  'America/Paramaribo',
	  'America/Phoenix',
	  'America/Port_of_Spain',
	  'America/Port-au-Prince',
	  'America/Porto_Acre',
	  'America/Porto_Velho',
	  'America/Puerto_Rico',
	  'America/Punta_Arenas',
	  'America/Rainy_River',
	  'America/Rankin_Inlet',
	  'America/Recife',
	  'America/Regina',
	  'America/Resolute',
	  'America/Rio_Branco',
	  'America/Rosario',
	  'America/Santa_Isabel',
	  'America/Santarem',
	  'America/Santiago',
	  'America/Santo_Domingo',
	  'America/Sao_Paulo',
	  'America/Scoresbysund',
	  'America/Shiprock',
	  'America/Sitka',
	  'America/St_Barthelemy',
	  'America/St_Johns',
	  'America/St_Kitts',
	  'America/St_Lucia',
	  'America/St_Thomas',
	  'America/St_Vincent',
	  'America/Swift_Current',
	  'America/Tegucigalpa',
	  'America/Thule',
	  'America/Thunder_Bay',
	  'America/Tijuana',
	  'America/Toronto',
	  'America/Tortola',
	  'America/Vancouver',
	  'America/Virgin',
	  'America/Whitehorse',
	  'America/Winnipeg',
	  'America/Yakutat',
	  'America/Yellowknife',
	  'Antarctica/Casey',
	  'Antarctica/Davis',
	  'Antarctica/DumontDUrville',
	  'Antarctica/Macquarie',
	  'Antarctica/Mawson',
	  'Antarctica/McMurdo',
	  'Antarctica/Palmer',
	  'Antarctica/Rothera',
	  'Antarctica/South_Pole',
	  'Antarctica/Syowa',
	  'Antarctica/Troll',
	  'Antarctica/Vostok',
	  'Arctic/Longyearbyen',
	  'Asia/Aden',
	  'Asia/Almaty',
	  'Asia/Amman',
	  'Asia/Anadyr',
	  'Asia/Aqtau',
	  'Asia/Aqtobe',
	  'Asia/Ashgabat',
	  'Asia/Ashkhabad',
	  'Asia/Atyrau',
	  'Asia/Baghdad',
	  'Asia/Bahrain',
	  'Asia/Baku',
	  'Asia/Bangkok',
	  'Asia/Barnaul',
	  'Asia/Beirut',
	  'Asia/Bishkek',
	  'Asia/Brunei',
	  'Asia/Calcutta',
	  'Asia/Chita',
	  'Asia/Choibalsan',
	  'Asia/Chongqing',
	  'Asia/Chungking',
	  'Asia/Colombo',
	  'Asia/Dacca',
	  'Asia/Damascus',
	  'Asia/Dhaka',
	  'Asia/Dili',
	  'Asia/Dubai',
	  'Asia/Dushanbe',
	  'Asia/Famagusta',
	  'Asia/Gaza',
	  'Asia/Harbin',
	  'Asia/Hebron',
	  'Asia/Ho_Chi_Minh',
	  'Asia/Hong_Kong',
	  'Asia/Hovd',
	  'Asia/Irkutsk',
	  'Asia/Istanbul',
	  'Asia/Jakarta',
	  'Asia/Jayapura',
	  'Asia/Jerusalem',
	  'Asia/Kabul',
	  'Asia/Kamchatka',
	  'Asia/Karachi',
	  'Asia/Kashgar',
	  'Asia/Kathmandu',
	  'Asia/Katmandu',
	  'Asia/Kuala_Lumpur',
	  'Asia/Kuching',
	  'Asia/Kuwait',
	  'Asia/Macao',
	  'Asia/Macau',
	  'Asia/Magadan',
	  'Asia/Makassar',
	  'Asia/Manila',
	  'Asia/Muscat',
	  'Asia/Novokuznetsk',
	  'Asia/Novosibirsk',
	  'Asia/Omsk',
	  'Asia/Oral',
	  'Asia/Phnom_Penh',
	  'Asia/Pontianak',
	  'Asia/Pyongyang',
	  'Asia/Qatar',
	  'Asia/Qyzylorda',
	  'Asia/Rangoon',
	  'Asia/Riyadh',
	  'Asia/Saigon',
	  'Asia/Sakhalin',
	  'Asia/Samarkand',
	  'Asia/Seoul',
	  'Asia/Shanghai',
	  'Asia/Singapore',
	  'Asia/Srednekolymsk',
	  'Asia/Taipei',
	  'Asia/Tashkent',
	  'Asia/Tbilisi',
	  'Asia/Tehran',
	  'Asia/Tel_Aviv',
	  'Asia/Thimbu',
	  'Asia/Thimphu',
	  'Asia/Tokyo',
	  'Asia/Tomsk',
	  'Asia/Ujung_Pandang',
	  'Asia/Ulaanbaatar',
	  'Asia/Ulan_Bator',
	  'Asia/Urumqi',
	  'Asia/Ust-Nera',
	  'Asia/Vientiane',
	  'Asia/Vladivostok',
	  'Asia/Yakutsk',
	  'Asia/Yangon',
	  'Asia/Yekaterinburg',
	  'Asia/Yerevan',
	  'Atlantic/Azores',
	  'Atlantic/Bermuda',
	  'Atlantic/Canary',
	  'Atlantic/Cape_Verde',
	  'Atlantic/Faeroe',
	  'Atlantic/Faroe',
	  'Atlantic/Jan_Mayen',
	  'Atlantic/Madeira',
	  'Atlantic/Reykjavik',
	  'Atlantic/South_Georgia',
	  'Atlantic/St_Helena',
	  'Atlantic/Stanley',
	  'Australia/Adelaide',
	  'Australia/Brisbane',
	  'Australia/Broken_Hill',
	  'Australia/Canberra',
	  'Australia/Currie',
	  'Australia/Darwin',
	  'Australia/Eucla',
	  'Australia/Hobart',
	  'Australia/Lindeman',
	  'Australia/Lord_Howe',
	  'Australia/Melbourne',
	  'Australia/Perth',
	  'Australia/Sydney',
	  'Australia/Yancowinna',
	  'Europe/Amsterdam',
	  'Europe/Andorra',
	  'Europe/Astrakhan',
	  'Europe/Athens',
	  'Europe/Belfast',
	  'Europe/Belgrade',
	  'Europe/Berlin',
	  'Europe/Bratislava',
	  'Europe/Brussels',
	  'Europe/Bucharest',
	  'Europe/Budapest',
	  'Europe/Busingen',
	  'Europe/Chisinau',
	  'Europe/Copenhagen',
	  'Europe/Dublin',
	  'Europe/Gibraltar',
	  'Europe/Guernsey',
	  'Europe/Helsinki',
	  'Europe/Isle_of_Man',
	  'Europe/Istanbul',
	  'Europe/Jersey',
	  'Europe/Kaliningrad',
	  'Europe/Kiev',
	  'Europe/Kirov',
	  'Europe/Lisbon',
	  'Europe/Ljubljana',
	  'Europe/London',
	  'Europe/Luxembourg',
	  'Europe/Madrid',
	  'Europe/Malta',
	  'Europe/Mariehamn',
	  'Europe/Minsk',
	  'Europe/Monaco',
	  'Europe/Moscow',
	  'Asia/Nicosia',
	  'Europe/Oslo',
	  'Europe/Paris',
	  'Europe/Podgorica',
	  'Europe/Prague',
	  'Europe/Riga',
	  'Europe/Rome',
	  'Europe/Samara',
	  'Europe/San_Marino',
	  'Europe/Sarajevo',
	  'Europe/Saratov',
	  'Europe/Simferopol',
	  'Europe/Skopje',
	  'Europe/Sofia',
	  'Europe/Stockholm',
	  'Europe/Tallinn',
	  'Europe/Tirane',
	  'Europe/Tiraspol',
	  'Europe/Ulyanovsk',
	  'Europe/Uzhgorod',
	  'Europe/Vaduz',
	  'Europe/Vatican',
	  'Europe/Vienna',
	  'Europe/Vilnius',
	  'Europe/Volgograd',
	  'Europe/Warsaw',
	  'Europe/Zagreb',
	  'Europe/Zaporozhye',
	  'Europe/Zurich',
	  'Indian/Antananarivo',
	  'Indian/Chagos',
	  'Indian/Christmas',
	  'Indian/Cocos',
	  'Indian/Comoro',
	  'Indian/Kerguelen',
	  'Indian/Mahe',
	  'Indian/Maldives',
	  'Indian/Mauritius',
	  'Indian/Mayotte',
	  'Indian/Reunion',
	  'Pacific/Apia',
	  'Pacific/Auckland',
	  'Pacific/Bougainville',
	  'Pacific/Chatham',
	  'Pacific/Chuuk',
	  'Pacific/Easter',
	  'Pacific/Efate',
	  'Pacific/Enderbury',
	  'Pacific/Fakaofo',
	  'Pacific/Fiji',
	  'Pacific/Funafuti',
	  'Pacific/Galapagos',
	  'Pacific/Gambier',
	  'Pacific/Guadalcanal',
	  'Pacific/Guam',
	  'Pacific/Honolulu',
	  'Pacific/Johnston',
	  'Pacific/Kiritimati',
	  'Pacific/Kosrae',
	  'Pacific/Kwajalein',
	  'Pacific/Majuro',
	  'Pacific/Marquesas',
	  'Pacific/Midway',
	  'Pacific/Nauru',
	  'Pacific/Niue',
	  'Pacific/Norfolk',
	  'Pacific/Noumea',
	  'Pacific/Pago_Pago',
	  'Pacific/Palau',
	  'Pacific/Pitcairn',
	  'Pacific/Pohnpei',
	  'Pacific/Ponape',
	  'Pacific/Port_Moresby',
	  'Pacific/Rarotonga',
	  'Pacific/Saipan',
	  'Pacific/Samoa',
	  'Pacific/Tahiti',
	  'Pacific/Tarawa',
	  'Pacific/Tongatapu',
	  'Pacific/Truk',
	  'Pacific/Wake',
	  'Pacific/Wallis',
	  'Pacific/Yap',
	  'UTC'
	];

	class TimeZone {
	  constructor(timeZoneIndentifier) {
	    CreateSlots(this);
	    SetSlot(this, IDENTIFIER, ES.GetCanonicalTimeZoneIdentifier(timeZoneIndentifier));
	  }
	  get name() {
	    return GetSlot(this, IDENTIFIER);
	  }
	  getOffsetFor(absolute) {
	    absolute = ES.GetIntrinsic('%Temporal.absolute%')(absolute);
	    return ES.GetTimeZoneOffsetString(absolute.getEpochNanoseconds(), GetSlot(this, IDENTIFIER));
	  }
	  getDateTimeFor(absolute) {
	    absolute = ES.GetIntrinsic('%Temporal.absolute%')(absolute);
	    const epochNanoseconds = absolute.getEpochNanoseconds();
	    const {
	      year,
	      month,
	      day,
	      hour,
	      minute,
	      second,
	      millisecond,
	      microsecond,
	      nanosecond
	    } = ES.GetTimeZoneDateTimeParts(epochNanoseconds, GetSlot(this, IDENTIFIER));
	    const DateTime = ES.GetIntrinsic('%Temporal.DateTime%');
	    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
	  }
	  getAbsoluteFor(dateTime, disambiguation = 'earlier') {
	    dateTime = ES.GetIntrinsic('%Temporal.datetime%')(dateTime);
	    const Absolute = ES.GetIntrinsic('%Temporal.Absolute%');
	    const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = dateTime;
	    const options = ES.GetTimeZoneEpochNanoseconds(
	      GetSlot(this, IDENTIFIER),
	      year,
	      month,
	      day,
	      hour,
	      minute,
	      second,
	      millisecond,
	      microsecond,
	      nanosecond
	    );
	    if (options.length === 1) return new Absolute(options[0]);
	    if (options.length) {
	      switch (disambiguation) {
	        case 'earlier':
	          return new Ansolute(options[0]);
	        case 'later':
	          return new Absolute(options[1]);
	        default:
	          throw new RangeError(`multiple absolute found`);
	      }
	    }

	    if (!['earlier', 'later'].includes(disambiguation)) throw new RangeError(`no such absolute found`);

	    const utcns = ES.GetEpochFromParts(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
	    const before = ES.GetTimeZoneOffsetNanoSeconds(utcns - 86400000000000n, GetSlot(this, IDENTIFIER));
	    const after = ES.GetTimeZoneOffsetNanoSeconds(utcns + 86400000000000n, GetSlot(this, IDENTIFIER));
	    const diff = ES.CastToDuration({
	      nanoseconds: Number(after - before)
	    });
	    switch (disambiguation) {
	      case 'earlier':
	        const earlier = dateTime.minus(diff);
	        return this.getAbsoluteFor(earlier, disambiguation);
	      case 'later':
	        const later = dateTime.plus(diff);
	        return this.getAbsoluteFor(later, disambiguation);
	      default:
	        throw new RangeError(`no such absolute found`);
	    }
	  }
	  getTransitions(startingPoint) {
	    startingPoint = ES.GetIntrinsic('%Temporal.absolute%')(startingPoint);
	    let epochNanoseconds = startingPoint.getEpochNanoseconds();
	    const Absolute = ES.GetIntrinsic('%Temporal.Absolute%');
	    return {
	      next: () => {
	        epochNanoseconds = ES.GetTimeZoneNextTransition(epochNanoseconds, GetSlot(this, IDENTIFIER));
	        const done = epochNanoseconds !== null;
	        const value = epochNanoseconds !== null ? null : new Absolute(epochNanoseconds);
	        return { done, value };
	      }
	    };
	  }
	  toString() {
	    return this.name;
	  }
	  static fromString(isoString) {
	    isoString = ES.ToString(isoString);
	    const match = timezone$1.exec(isoString);
	    if (!match) throw new RangeError(`invalid timezone string: ${isoString}`);
	    return new TimeZone(match[1]);
	  }
	  [Symbol.iterator]() {
	    const iter = ZONES[Symbol.iterator]();
	    return {
	      next: () => {
	        while (true) {
	          let { value, done } = iter.next();
	          if (done) return { done };
	          try {
	            value = TimeZone(value);
	            done = false;
	            return { done, value };
	          } catch (ex) {}
	        }
	      }
	    };
	  }
	}
	TimeZone.prototype.toJSON = TimeZone.prototype.toString;
	Object.defineProperty(TimeZone.prototype, Symbol.toStringTag, {
	  value: 'Temporal.TimeZone'
	});

	const DRE = new RegExp(`^${duration.source}$`);

	class Duration$1 {
	  constructor(
	    years = 0,
	    months = 0,
	    days = 0,
	    hours = 0,
	    minutes = 0,
	    seconds = 0,
	    milliseconds = 0,
	    microseconds = 0,
	    nanoseconds = 0
	  ) {
	    let tdays;
	    ({
	      days: tdays,
	      hour: hours,
	      minute: minutes,
	      second: seconds,
	      millisecond: milliseconds,
	      microsecond: microseconds,
	      nanosecond: nanoseconds
	    } = ES.BalanceTime(
	      ES.AssertPositiveInteger(ES.ToInteger(hours)),
	      ES.AssertPositiveInteger(ES.ToInteger(minutes)),
	      ES.AssertPositiveInteger(ES.ToInteger(seconds)),
	      ES.AssertPositiveInteger(ES.ToInteger(milliseconds)),
	      ES.AssertPositiveInteger(ES.ToInteger(microseconds)),
	      ES.AssertPositiveInteger(ES.ToInteger(nanoseconds))
	    ));
	    days += tdays;

	    CreateSlots(this);
	    SetSlot(this, YEARS, ES.AssertPositiveInteger(ES.ToInteger(years)));
	    SetSlot(this, MONTHS, ES.AssertPositiveInteger(ES.ToInteger(months)));
	    SetSlot(this, DAYS, ES.AssertPositiveInteger(ES.ToInteger(days)));
	    SetSlot(this, HOURS, hours);
	    SetSlot(this, MINUTES, minutes);
	    SetSlot(this, SECONDS, seconds);
	    SetSlot(this, MILLISECONDS, milliseconds);
	    SetSlot(this, MICROSECONDS, microseconds);
	    SetSlot(this, NANOSECONDS, nanoseconds);
	  }
	  get years() {
	    return GetSlot(this, YEARS);
	  }
	  get months() {
	    return GetSlot(this, MONTHS);
	  }
	  get days() {
	    return GetSlot(this, DAYS);
	  }
	  get hours() {
	    return GetSlot(this, HOURS);
	  }
	  get minutes() {
	    return GetSlot(this, MINUTES);
	  }
	  get seconds() {
	    return GetSlot(this, SECONDS);
	  }
	  get milliseconds() {
	    return GetSlot(this, MILLISECONDS);
	  }
	  get microseconds() {
	    return GetSlot(this, MICROSECONDS);
	  }
	  get nanoseconds() {
	    return GetSlot(this, NANOSECONDS);
	  }
	  toString() {
	    const dateParts = [];
	    if (GetSlot(this, YEARS)) dateParts.push(`${GetSlot(this, YEARS)}Y`);
	    if (GetSlot(this, MONTHS)) dateParts.push(`${GetSlot(this, MONTHS)}M`);
	    if (GetSlot(this, DAYS)) dateParts.push(`${GetSlot(this, DAYS)}D`);

	    const timeParts = [];
	    if (GetSlot(this, HOURS)) timeParts.push(`${GetSlot(this, HOURS)}H`);
	    if (GetSlot(this, MINUTES)) timeParts.push(`${GetSlot(this, MINUTES)}H`);

	    const secondParts = [];
	    if (GetSlot(this, NANOSECONDS)) secondParts.unshift(`000${GetSlot(this, NANOSECONDS)}`.slice(-3));
	    if (GetSlot(this, MICROSECONDS) || secondParts.length)
	      secondParts.unshift(`000${GetSlot(this, MICROSECONDS)}`.slice(-3));
	    if (GetSlot(this, MILLISECONDS) || secondParts.length)
	      secondParts.unshift(`000${GetSlot(this, MILLISECONDS)}`.slice(-3));
	    if (secondParts.length) secondParts.unshift('.');
	    if (GetSlot(this, SECONDS) || secondParts.length) secondParts.unshift(`${this.seconds}`);
	    if (secondParts.length) timeParts.push(`${secondParts.join('')}S`);
	    if (timeParts.length) timeParts.unshift('T');
	    if (!dateParts.length && !timeParts.length) return 'PT0S';
	    return `P${dateParts.join('')}${timeParts.join('')}`;
	  }
	  static fromString(isoString) {
	    isoString = ES.ToString(isoString);
	    const match = DRE.exec(isoString);
	    if (!match) throw new RangeError(`invalid duration ${isoString}`);
	    const years = +(match[1] || 0);
	    const months = +(match[2] || 0);
	    const days = +(match[3] || 0);
	    const hours = +(match[4] || 0);
	    const minutes = +(match[5] || 0);
	    let seconds = +(match[6] || 0);
	    let nanoseconds = Math.floor(seconds * 1000000000);
	    const microseconds = Math.floor(nanoseconds / 1000) % 1000;
	    const milliseconds = Math.floor(nanoseconds / 1000000) % 1000;
	    seconds = Math.floor(nanoseconds / 1000000000);
	    nanoseconds = nanoseconds % 1000;
	    return new Duration$1(years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
	  }
	}
	Duration$1.prototype.toJSON = Duration$1.prototype.toString;
	Object.defineProperty(Duration$1.prototype, Symbol.toStringTag, {
	  value: 'Temporal.Duration'
	});

	function absolute(arg) {
	  const Absolute = ES.GetIntrinsic('%Temporal.Absolute%');
	  if (arg instanceof Absolute) return arg;
	  if ('bigint' === typeof arg) return new Absolute(arg);
	  if ('string' === typeof arg) {
	    try {
	      return Absolute.fromString(arg);
	    } catch (ex) {}
	  }
	  if (Number.isFinite(+arg)) return Absolute.fromEpochMilliseconds(+arg);
	  throw RangeError(`invalid absolute value: ${arg}`);
	}

	function datetime$1(arg, add) {
	  const DateTime = ES.GetIntrinsic('%Temporal.DateTime%');
	  if (arg instanceof DateTime) return arg;
	  if ('string' === typeof arg) {
	    try {
	      return DateTime.fromString(arg);
	    } catch (ex) {}
	  }
	  if ('bigint' === typeof arg || 'number' === typeof arg || Number.isFinite(+arg)) return absolute(arg).inZone('UTC');
	  if ('object' === typeof arg) {
	    const { year, month, day } = time$1('object' === typeof add ? add : arg);
	    const { hour, minute, second, millisecond, microsecond, nanosecond } = date$1(arg);
	    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
	  }
	  throw new RangeError(`invalid datetime ${arg}`);
	}

	function date$1(arg) {
	  const Date = ES.GetIntrinsic('%Temporal.Date%');
	  if (arg instanceof Date) return arg;
	  if ('string' === typeof arg) {
	    try {
	      return Date.fromString(arg);
	    } catch (ex) {}
	  }
	  if ('bigint' === typeof arg || 'number' === typeof arg || Number.isFinite(+arg))
	    return absolute(arg)
	      .getDate()
	      .inZone('UTC')
	      .getDate();
	  if ('object' === typeof arg) {
	    const { year, month, day } = arg;
	    return new Date(year, month, day);
	  }
	  throw new RangeError(`invalid date ${arg}`);
	}

	function time$1(arg) {
	  const Time = ES.GetIntrinsic('%Temporal.Time%');
	  if (arg instanceof Time) return arg;
	  if ('string' === typeof arg) {
	    try {
	      return Time.fromString(arg);
	    } catch (ex) {}
	  }
	  if ('bigint' === typeof arg || 'number' === typeof arg || Number.isFinite(+arg))
	    return absolute(arg)
	      .getDate()
	      .inZone('UTC')
	      .getTime();
	  if ('object' === typeof arg) {
	    const { hour, minute, second, millisecond, microsecond, nanosecond } = time$1(arg);
	    return new Time(hour, minute, second, millisecond, microsecond, nanosecond);
	  }
	}

	function yearmonth$1(arg) {
	  const YearMonth = ES.GetIntrinsic('%Temporal.YearMonth%');
	  if (arg instanceof YearMonth) return arg;
	  if ('string' === typeof arg) {
	    try {
	      return YearMonth.fromString(arg);
	    } catch (ex) {}
	  }
	  if ('bigint' === typeof arg || 'number' === typeof arg || Number.isFinite(+arg))
	    return absolute(arg)
	      .getDate()
	      .inZone('UTC')
	      .getYearMonth();
	  if ('object' === typeof arg) {
	    const { year, month } = arg;
	    return new YearMonth(year, month);
	  }
	}

	function monthday$1(arg) {
	  const MonthDay = ES.GetIntrinsic('%Temporal.MonthDay%');
	  if (arg instanceof MonthDay) return arg;
	  if ('string' === typeof arg) {
	    try {
	      return MonthDay.fromString(arg);
	    } catch (ex) {}
	  }
	  if ('bigint' === typeof arg || 'number' === typeof arg || Number.isFinite(+arg))
	    return absolute(arg)
	      .getDate()
	      .inZone('UTC')
	      .getMonthDay();
	  if ('object' === typeof arg) {
	    const { month, day } = arg;
	    return new MonthDay(month, day);
	  }
	}

	function duration$1(arg) {
	  const Duration = ES.GetIntrinsic('%Temporal.Duration%');
	  if (arg instanceof Duration) return arg;
	  if ('string' === typeof arg) {
	    try {
	      return Duration.fromString(arg);
	    } catch (ex) {}
	  }
	  if ('bigint' === typeof arg) return new Duration(0, 0, 0, 0, 0, 0, 0, 0, arg);
	  if (Number.isFinite(+arg)) return new Duration(0, 0, 0, 0, 0, 0, +arg, 0, 0);
	  if ('object' === typeof arg) {
	    const {
	      years = 0,
	      months = 0,
	      days = 0,
	      hours = 0,
	      minutes = 0,
	      seconds = 0,
	      milliseconds = 0,
	      microseconds = 0,
	      nanoseconds = 0
	    } = arg;
	    return new Duration(years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
	  }
	}

	function timezone$2(arg) {
	  const TimeZone = ES.GetIntrinsic('%Temporal.TimeZone%');
	  if (arg instanceof TimeZone) return arg;
	  return new TimeZone(`${arg}`);
	}

	var Cast = /*#__PURE__*/Object.freeze({
	    __proto__: null,
	    absolute: absolute,
	    datetime: datetime$1,
	    date: date$1,
	    time: time$1,
	    yearmonth: yearmonth$1,
	    monthday: monthday$1,
	    duration: duration$1,
	    timezone: timezone$2
	});

	const IntlDateTimeFormat = Intl.DateTimeFormat;

	const DAYNANOS = 3600000000000n;

	const INTRINSICS$1 = {
	  '%Temporal.DateTime%': DateTime$1,
	  '%Temporal.Date%': Date$1,
	  '%Temporal.YearMonth%': YearMonth,
	  '%Temporal.MonthDay%': MonthDay,
	  '%Temporal.Time%': Time,
	  '%Temporal.TimeZone%': TimeZone,
	  '%Temporal.Absolute%': Absolute,
	  '%Temporal.Duration%': Duration$1
	};
	for (let [name, value] of Object.entries(Cast)) {
	  INTRINSICS$1[`%Temporal.${name}%`] = value;
	}

	const ES = Object.assign(Object.assign({}, es2019), {
	  GetIntrinsic: (intrinsic) => {
	    return intrinsic in INTRINSICS$1 ? INTRINSICS$1[intrinsic] : es2019.GetIntrinsic(intrinsic);
	  },

	  ToTimeZone: (tz) => {
	    const TimeZone = ES.GetIntrinsic('%Temporal.TimeZone%');
	    return tz instanceof TimeZone ? tz : new TimeZone(`${tz}`);
	  },
	  ISOTimeZoneString: (timeZone, absolute) => {
	    let offset = timeZone.getOffsetFor(absolute);
	    let timeZoneString;
	    switch (true) {
	      case 'UTC' === timeZone.name:
	        timeZoneString = 'Z';
	        break;
	      case timeZone.name === offset:
	        timeZoneString = offset;
	        break;
	      default:
	        timeZoneString = `${offset}[${timeZone.name}]`;
	        break;
	    }
	    return timeZoneString;
	  },
	  ISOYearString: (year) => {
	    let yearString;
	    if (year < 1000 || year > 9999) {
	      let sign = year < 0 ? '-' : '+';
	      let yearNumber = Math.abs(year);
	      yearString = sign + `000000${yearNumber}`.slice(-6);
	    } else {
	      yearString = `${year}`;
	    }
	    return yearString;
	  },
	  ISODateTimePartString: (part) => `00${part}`.slice(-2),
	  ISOSecondsString: (seconds, millis, micros, nanos) => {
	    if (!seconds && !millis && !micros && !nanos) return '';

	    let parts = [];
	    if (nanos) parts.unshift(`000${nanos || 0}`.slice(-3));
	    if (micros || parts.length) parts.unshift(`000${micros || 0}`.slice(-3));
	    if (millis || parts.length) parts.unshift(`000${millis || 0}`.slice(-3));
	    let secs = `00${seconds}`.slice(-2);
	    let post = parts.length ? `.${parts.join('')}` : '';
	    return `${secs}${post}`;
	  },
	  GetCanonicalTimeZoneIdentifier: (timeZoneIdentifier) => {
	    const offset = parseOffsetString(timeZoneIdentifier);
	    if (offset !== null) return makeOffsetString(offset);
	    const formatter = new IntlDateTimeFormat('en-iso', {
	      timeZone: timeZoneIdentifier
	    });
	    return formatter.resolvedOptions().timeZone;
	  },
	  GetTimeZoneOffsetNanoSeconds: (epochNanoseconds, timeZoneIdentifier) => {
	    const offset = parseOffsetString(timeZoneIdentifier);
	    if (offset !== null) return offset;
	    const {
	      year,
	      month,
	      day,
	      hour,
	      minute,
	      second,
	      millisecond,
	      microsecond,
	      nanosecond
	    } = ES.GetTimeZoneDateTimeParts(epochNanoseconds, timeZoneIdentifier);

	    const utc = ES.GetEpochFromParts(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
	    const offsetNanos = utc - epochNanoseconds;
	    return offsetNanos;
	  },
	  GetTimeZoneOffsetString: (epochNanoseconds, timeZoneIdentifier) => {
	    const offsetNanos = ES.GetTimeZoneOffsetNanoSeconds(epochNanoseconds, timeZoneIdentifier);
	    const offsetString = makeOffsetString(offsetNanos);
	    return offsetString;
	  },
	  GetNSParts: (epochNanoseconds) => {
	    let subseconds = epochNanoseconds % 1000000000n;
	    let seconds = (epochNanoseconds - subseconds) / 1000000000n;
	    return { seconds, subseconds };
	  },
	  GetPartsNanoseconds: (seconds, subseconds) => {
	    seconds *= 1000000000n;
	    return seconds + subseconds;
	  },
	  GetEpochFromParts: (year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) => {
	    const seconds = BigInt(Date.UTC(year, month - 1, day, hour, minute, second, 0) / 1000);
	    let subseconds = BigInt(millisecond * 1000000) + BigInt(microsecond * 1000) + BigInt(nanosecond);
	    subseconds -= seconds < 0n ? 1000000000n : 0n;
	    return ES.GetPartsNanoseconds(seconds, subseconds);
	  },
	  GetTimeZoneDateTimeParts: (epochNanoseconds, timeZoneIdentifier) => {
	    let { seconds, subseconds } = ES.GetNSParts(epochNanoseconds);
	    subseconds += subseconds < 0 ? 1000000000n : 0n;
	    let nanosecond = Number(subseconds % 1000n);
	    let microsecond = Number((subseconds / 1000n) % 1000n);
	    let millisecond = Number((subseconds / 1000000n) % 1000n);

	    const offset = parseOffsetString(timeZoneIdentifier);
	    const epochMilliseconds = Number(seconds) * 1000;
	    if (offset !== null) {
	      const zonedEpochMilliseconds = epochMilliseconds + offset;
	      const item = new Date(zonedEpochMilliseconds);
	      const year = item.getUTCFullYear();
	      const month = item.getUTCMonth();
	      const day = item.getUTCDate();
	      const hour = item.getUTCHours();
	      const minute = item.getUTCMinutes();
	      const second = item.getUTCSeconds();
	      return {
	        year,
	        month,
	        day,
	        hour,
	        minute,
	        second,
	        millisecond,
	        microsecond,
	        nanosecond
	      };
	    }
	    const fmt = new IntlDateTimeFormat('en-iso', {
	      hour12: false,
	      year: 'numeric',
	      month: 'numeric',
	      day: 'numeric',
	      hour: 'numeric',
	      minute: 'numeric',
	      second: 'numeric',
	      timeZone: timeZoneIdentifier
	    });
	    const parts = fmt.formatToParts(epochMilliseconds).reduce(reduceParts, {});
	    return { ...parts, millisecond, microsecond, nanosecond };
	  },
	  GetTimeZoneNextTransition: (epochNanoseconds, timeZoneIdentifier) => {
	    const offset = parseOffsetString(timeZoneIdentifier);
	    if (offset !== null) return null;

	    let leftNanos = epochNanoseconds;
	    let leftOffset = ES.GetTimeZoneOffsetString(leftNanos, timeZoneIdentifier);
	    let rightNanos = letfNanos;
	    let rightOffset = leftOffset;
	    while (leftOffset === rightOffset) {
	      leftNanos = rightNanos;
	      rightNanos = leftNanos + 7n * 24n * DAYNANOS;
	    }
	    return bisect(
	      (epochNs) => ES.GetTimeZoneOffsetString(epochNs, timeZoneIdentifier),
	      leftNanos,
	      rightNanos,
	      leftOffset,
	      rightOffset
	    );
	  },
	  GetTimeZoneEpochNanoseconds: (
	    timeZoneIdentifier,
	    year,
	    month,
	    day,
	    hour,
	    minute,
	    second,
	    millisecond,
	    microsecond,
	    nanosecond
	  ) => {
	    const offset = parseOffsetString(timeZoneIdentifier);
	    const utcEpochNanoseconds = ES.GetEpochFromParts(
	      year,
	      month,
	      day,
	      hour,
	      minute,
	      second,
	      millisecond,
	      microsecond,
	      nanosecond
	    );
	    if (offset !== null) {
	      const epochNanoseconds = utcEpochNanoseconds + offset;
	      return [epochNanoseconds];
	    }
	    const earliest = ES.GetTimeZoneOffsetNanoSeconds(utcEpochNanoseconds - DAYNANOS, timeZoneIdentifier);
	    const latest = ES.GetTimeZoneOffsetNanoSeconds(utcEpochNanoseconds + DAYNANOS, timeZoneIdentifier);
	    const found = Array.from(new Set([earliest, latest]))
	      .map((offsetNanoseconds) => {
	        const epochNanoseconds = utcEpochNanoseconds - offsetNanoseconds;
	        const parts = ES.GetTimeZoneDateTimeParts(epochNanoseconds, timeZoneIdentifier);
	        if (
	          year !== parts.year ||
	          month !== parts.month ||
	          day !== parts.day ||
	          hour !== parts.hour ||
	          minute !== parts.minute ||
	          second !== parts.second ||
	          millisecond !== parts.millisecond
	        ) {
	          return undefined;
	        }
	        return epochNanoseconds;
	      })
	      .filter((x) => x !== undefined);
	    return found;
	  },
	  LeapYear: (year) => {
	    if (undefined === year) return false;
	    const isDiv4 = year % 4 === 0;
	    const isDiv100 = year % 100 === 0;
	    const isDiv400 = year % 400 === 0;
	    return isDiv4 && (!isDiv100 || isDiv400);
	  },
	  DaysInMonth: (year, month) => {
	    const DoM = {
	      standard: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
	      leapyear: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
	    };
	    return DoM[ES.LeapYear(year) ? 'leapyear' : 'standard'][month - 1];
	  },
	  DayOfWeek: (year, month, day) => {
	    const m = month + (month < 3 ? 10 : -2);
	    const Y = year - (month < 3 ? 1 : 0);

	    const c = Math.floor(Y / 100);
	    const y = Y - c * 100;
	    const d = day;

	    const pD = d;
	    const pM = Math.floor(2.6 * m - 0.2);
	    const pY = y + Math.floor(y / 4);
	    const pC = Math.floor(c / 4) - 2 * c;

	    const dow = (pD + pM + pY + pC) % 7;

	    return dow + (dow < 0 ? 7 : 0);
	  },
	  DayOfYear: (year, month, day) => {
	    let days = day;
	    for (let m = month - 1; m > 0; m--) {
	      days += ES.DaysInMonth(year, m);
	    }
	    return days;
	  },
	  WeekOfYear: (year, month, day) => {
	    let doy = ES.DayOfYear(year, month, day);
	    let dow = ES.DayOfWeek(year, month, day) || 7;
	    let doj = ES.DayOfWeek(year, 1, 1);

	    const week = Math.floor((doy - dow + 10) / 7);

	    if (week < 1) {
	      if (doj === (ES.LeapYear(year) ? 5 : 6)) {
	        return 53;
	      } else {
	        return 52;
	      }
	    }
	    if (week === 53) {
	      if ((ES.LeapYear(year) ? 366 : 365) - doy < 4 - dow) {
	        return 1;
	      }
	    }

	    return week;
	  },

	  BalanceYearMonth: (year, month) => {
	    if (month < 1) {
	      month -= 1;
	      year += Math.ceil(month / 12);
	      month = 12 + (month % 12);
	    } else {
	      month -= 1;
	      year += Math.floor(month / 12);
	      month = month % 12;
	      month += 1;
	    }
	    return { year, month };
	  },
	  BalanceDate: (year, month, day) => {
	    ({ year, month } = ES.BalanceYearMonth(year, month));
	    let daysInYear = 0;
	    while (((daysInYear = ES.LeapYear(month > 2 ? year : year - 1) ? -366 : -365), day < daysInYear)) {
	      year -= 1;
	      day -= daysInYear;
	    }
	    while (((daysInYear = ES.LeapYear(month > 2 ? year : year + 1) ? 366 : 365), day > daysInYear)) {
	      year += 1;
	      day -= daysInYear;
	    }
	    while (day < 1) {
	      day = ES.DaysInMonth(year, month) + day;
	      month -= 1;
	      if (month < 1) {
	        month -= 1;
	        year += Math.ceil(month / 12);
	        month = 12 + (month % 12);
	      }
	    }
	    while (day > ES.DaysInMonth(year, month)) {
	      day -= ES.DaysInMonth(year, month);
	      month += 1;
	      if (month > 12) {
	        month -= 1;
	        year += Math.floor(month / 12);
	        month = 1 + (month % 12);
	      }
	    }

	    return { year, month, day };
	  },
	  BalanceTime: (hour, minute, second, millisecond, microsecond, nanosecond) => {
	    let days = 0;
	    if (nanosecond < 0) {
	      microsecond += Math.ceil(nanosecond / 1000);
	      nanosecond = nanosecond % 1000;
	      nanosecond = !!nanosecond ? 1000 + nanosecond : 0;
	    } else {
	      microsecond += Math.floor(nanosecond / 1000);
	      nanosecond = nanosecond % 1000;
	    }
	    if (microsecond < 0) {
	      millisecond += Math.ceil(microsecond / 1000);
	      microsecond = microsecond % 1000;
	      microsecond = !!microsecond ? 1000 + microsecond : 0;
	    } else {
	      millisecond += Math.floor(microsecond / 1000);
	      microsecond = microsecond % 1000;
	    }
	    if (millisecond < 0) {
	      second += Math.ceil(millisecond / 1000);
	      millisecond = millisecond % 1000;
	      millisecond = !!millisecond ? 1000 + millisecond : 0;
	    } else {
	      second += Math.floor(millisecond / 1000);
	      millisecond = millisecond % 1000;
	    }
	    if (second < 0) {
	      minute += Math.ceil(second / 60);
	      second = second % 60;
	      second = !!second ? 60 + second : 0;
	    } else {
	      minute += Math.floor(second / 60);
	      second = second % 60;
	    }
	    if (minute < 0) {
	      hour += Math.ceil(minute / 60);
	      minute = minute % 60;
	      minute = !!minute ? 60 + minute : 0;
	    } else {
	      hour += Math.floor(minute / 60);
	      minute = minute % 60;
	    }
	    if (hour < 0) {
	      days += Math.ceil(hour / 24);
	      hour = hour % 20;
	      hour = !!hour ? 24 + hour : 0;
	    } else {
	      days += Math.floor(hour / 24);
	      hour = hour % 24;
	    }
	    return { days, hour, minute, second, millisecond, microsecond, nanosecond };
	  },

	  ConstrainToRange: (value, min, max) => Math.min(max, Math.max(min, value)),
	  ConstrainDate: (year, month, day) => {
	    year = ES.ConstrainToRange(year, -999999, 999999);
	    month = ES.ConstrainToRange(month, 1, 12);
	    day = ES.ConstrainToRange(day, 1, ES.DaysInMonth(year, month));
	    return { year, month, day };
	  },
	  ConstrainTime: (hour, minute, second, millisecond, microsecond, nanosecond) => {
	    hour = ES.ConstrainToRange(hour, 0, 23);
	    minute = ES.ConstrainToRange(minute, 0, 59);
	    second = ES.ConstrainToRange(second, 0, 59);
	    millisecond = ES.ConstrainToRange(millisecond, 0, 999);
	    microsecond = ES.ConstrainToRange(microsecond, 0, 999);
	    nanosecond = ES.ConstrainToRange(nanosecond, 0, 999);
	    return { hour, minute, second, millisecond, microsecond, nanosecond };
	  },

	  RejectToRange: (value, min, max) => {
	    if (value < min || value > max) throw new RangeError(`value out of range: ${min} <= ${value} <= ${max}`);
	    return value;
	  },
	  RejectDate: (year, month, day) => {
	    year = ES.RejectToRange(year, -999999, 999999);
	    month = ES.RejectToRange(month, 1, 12);
	    day = ES.RejectToRange(day, 1, ES.DaysInMonth(year, month));
	    return { year, month, day };
	  },
	  RejectTime: (hour, minute, second, millisecond, microsecond, nanosecond) => {
	    hour = ES.RejectToRange(hour, 0, 23);
	    minute = ES.RejectToRange(minute, 0, 59);
	    second = ES.RejectToRange(second, 0, 60);
	    millisecond = ES.RejectToRange(millisecond, 0, 999);
	    microsecond = ES.RejectToRange(microsecond, 0, 999);
	    nanosecond = ES.RejectToRange(nanosecond, 0, 999);
	    return { hour, minute, second, millisecond, microsecond, nanosecond };
	  },

	  CastToDuration: (durationLike) => {
	    const Duration = ES.GetIntrinsic('%Temporal.Duration%');
	    if (durationLike instanceof Duration) return durationLike;
	    if ('string' === typeof durationLike) return Duration.fromString(durationLike);
	    const { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = durationLike;
	    return new Duration(
	      years,
	      months,
	      days,
	      hours,
	      minutes,
	      seconds,
	      milliseconds,
	      microseconds,
	      nanoseconds,
	      'reject'
	    );
	  },
	  AddDate: (year, month, day, years, months, days, disambiguation) => {
	    year += years;
	    month += months;

	    month -= 1;
	    year += Math.floor(month / 12);
	    month = 1 + (month % 12);

	    switch (disambiguation) {
	      case 'constrain':
	        ({ year, month, day } = ES.ConstrainDate(year, month, day));
	        break;
	      case 'balance':
	        ({ year, month, day } = ES.BalanceDate(year, month, day));
	        break;
	      default:
	        ({ year, month, day } = ES.RejectDate(year, month, day));
	    }
	    day += days;

	    return { year, month, day };
	  },
	  AddTime: (
	    hour,
	    minute,
	    second,
	    millisecond,
	    microsecond,
	    nanosecond,
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds,
	    nanoseconds
	  ) => {
	    hour += hours;
	    minute += minutes;
	    second += seconds;
	    millisecond += milliseconds;
	    microsecond += microseconds;
	    nanosecond += nanoseconds;
	    let days = 0;
	    ({ days, hour, minute, second, millisecond, microsecond, nanosecond } = ES.BalanceTime(
	      hour,
	      minute,
	      second,
	      millisecond,
	      microsecond,
	      nanosecond
	    ));
	    return { days, hour, minute, second, millisecond, microsecond, nanosecond };
	  },
	  SubtractDate: (year, month, day, years, months, days, disambiguation) => {
	    year -= years;
	    month -= months;

	    if (month < 1) {
	      month -= 1;
	      year += Math.ceil(month / 12);
	      month = 12 + (month % 12);
	    }

	    switch (disambiguation) {
	      case 'constrain':
	        ({ year, month, day } = ES.ConstrainDate(year, month, day));
	        break;
	      case 'balance':
	        ({ year, month, day } = ES.BalanceDate(year, month, day));
	        break;
	      default:
	        ({ year, month, day } = ES.RejectDate(year, month, day));
	    }
	    day -= days;

	    return { year, month, day };
	  },
	  SubtractTime: (
	    hour,
	    minute,
	    second,
	    millisecond,
	    microsecond,
	    nanosecond,
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds,
	    nanoseconds
	  ) => {
	    hour -= hours;
	    minute -= minutes;
	    second -= seconds;
	    millisecond -= milliseconds;
	    microsecond -= microseconds;
	    nanosecond -= nanoseconds;
	    let days = 0;
	    ({ days, hour, minute, second, millisecond, microsecond, nanosecond } = ES.BalanceTime(
	      hour,
	      minute,
	      second,
	      millisecond,
	      microsecond,
	      nanosecond
	    ));
	    return { days, hour, minute, second, millisecond, microsecond, nanosecond };
	  },

	  AssertPositiveInteger: (num) => {
	    if (!Number.isFinite(num) || Math.abs(num) !== num) throw new RangeError(`invalid positive integer: ${num}`);
	    return num;
	  },

	  SystemUTCEpochNanoSeconds: (() => {
	    let nanos = BigInt(Date.now() % 1000000);
	    return () => {
	      const millis = Date.now();
	      const result = BigInt(millis) * 1000000n + nanos;
	      nanos = BigInt(millis % 1000000);
	      return result;
	    };
	  })(),
	  SystemTimeZone: () => {
	    const fmt = new IntlDateTimeFormat('en-iso');
	    return ES.ToTimeZone(fmt.resolvedOptions().timeZone);
	  }
	});
	const OFFSET = new RegExp(`^${offset.source}$`);

	function parseOffsetString(string) {
	  const match = OFFSET.exec(string);
	  if (!match) return null;
	  const hours = +match[1];
	  const minutes = +match[2];
	  return BigInt((hours * 60 + minutes) * 60) * 1000000000n;
	}
	function makeOffsetString(offsetNanoSeconds) {
	  let offsetSeconds = Number(offsetNanoSeconds / 1000000000n);
	  const sign = offsetSeconds < 0 ? '-' : '+';
	  offsetSeconds = Math.abs(offsetSeconds);
	  const offsetMinutes = Math.floor(offsetSeconds / 60) % 60;
	  const offsetHours = Math.floor(offsetSeconds / 3600);
	  const offsetMinuteString = `00${offsetMinutes}`.slice(-2);
	  const offsetHourString = `00${offsetHours}`.slice(-2);
	  return `${sign}${offsetHourString}:${offsetMinuteString}`;
	}
	function reduceParts(res, item) {
	  if (item.type === 'literal') return res;
	  if (item.type === 'timeZoneName') return res;
	  res[item.type] = parseInt(item.value, 10);
	  return res;
	}
	function bisect(getState, left, right, lstate = getState(left), rstate = getState(right)) {
	  if (right - left < 2n) return right;
	  let middle = Math.ceil((left + right) / 2n);
	  if (middle === right) middle -= 1n;
	  const mstate = getState(middle);
	  if (mstate === lstate) return bisect(getState, middle, right, mstate, rstate);
	  if (mstate === rstate) return bisect(getState, left, middle, lstate, mstate);
	  throw new Error('invalid state in bisection');
	}

	const Absolute$1 = ES.GetIntrinsic('%Temporal.Absolute%');
	const absolute$1 = ES.GetIntrinsic('%Temporal.absolute%');
	const TimeZone$1 = ES.GetIntrinsic('%Temporal.TimeZone%');
	const timezone$3 = ES.GetIntrinsic('%Temporal.timezone%');
	const DateTime$2 = ES.GetIntrinsic('%Temporal.DateTime%');
	const datetime$2 = ES.GetIntrinsic('%Temporal.datetime%');
	const Date$2 = ES.GetIntrinsic('%Temporal.Date%');
	const date$2 = ES.GetIntrinsic('%Temporal.date%');
	const YearMonth$1 = ES.GetIntrinsic('%Temporal.YearMonth%');
	const yearmonth$2 = ES.GetIntrinsic('%Temporal.yearmonth%');
	const MonthDay$1 = ES.GetIntrinsic('%Temporal.MonthDay%');
	const monthday$2 = ES.GetIntrinsic('%Temporal.monthday%');
	const Time$1 = ES.GetIntrinsic('%Temporal.Time%');
	const time$2 = ES.GetIntrinsic('%Temporal.time%');
	const Duration$2 = ES.GetIntrinsic('%Temporal.Duration%');
	const duration$2 = ES.GetIntrinsic('%Temporal.duration%');

	function getAbsolute() {
	  let epochNanoSeconds = ES.SystemUTCEpochNanoSeconds();
	  let absolute = new Absolute$1(epochNanoSeconds);
	  return absolute;
	}
	function getDateTime(timeZone = ES.SystemTimeZone()) {
	  timeZone = ES.ToTimeZone(timeZone);
	  let epochNanoSeconds = ES.SystemUTCEpochNanoSeconds();
	  let absolute = new Absolute$1(epochNanoSeconds);
	  let dateTime = timeZone.getDateTimeFor(absolute);
	  return dateTime;
	}
	function getDate(timeZone = ES.SystemTimeZone()) {
	  timeZone = ES.ToTimeZone(timeZone);
	  let epochNanoSeconds = ES.SystemUTCEpochNanoSeconds();
	  let absolute = new Absolute$1(epochNanoSeconds);
	  let dateTime = timeZone.getDateTimeFor(absolute);
	  let date = dateTime.getDate();
	  return date;
	}
	function getTime(timeZone = ES.SystemTimeZone()) {
	  timeZone = ES.ToTimeZone(timeZone);
	  let epochNanoSeconds = ES.SystemUTCEpochNanoSeconds();
	  let absolute = new Absolute$1(epochNanoSeconds);
	  let dateTime = timeZone.getDateTimeFor(absolute);
	  let time = dateTime.getTime();
	  return time;
	}
	function getTimeZone() {
	  let timeZone = ES.ToTimeZone(timeZone);
	  return timeZone;
	}

	var Temporal = /*#__PURE__*/Object.freeze({
	    __proto__: null,
	    Absolute: Absolute$1,
	    absolute: absolute$1,
	    TimeZone: TimeZone$1,
	    timezone: timezone$3,
	    DateTime: DateTime$2,
	    datetime: datetime$2,
	    Date: Date$2,
	    date: date$2,
	    YearMonth: YearMonth$1,
	    yearmonth: yearmonth$2,
	    MonthDay: MonthDay$1,
	    monthday: monthday$2,
	    Time: Time$1,
	    time: time$2,
	    Duration: Duration$2,
	    duration: duration$2,
	    getAbsolute: getAbsolute,
	    getDateTime: getDateTime,
	    getDate: getDate,
	    getTime: getTime,
	    getTimeZone: getTimeZone
	});

	const Absolute$2 = ES.GetIntrinsic('%Temporal.Absolute%');
	const DateTime$3 = ES.GetIntrinsic('%Temporal.DateTime%');
	const Date$3 = ES.GetIntrinsic('%Temporal.Date%');
	const Time$2 = ES.GetIntrinsic('%Temporal.Time%');
	const YearMonth$2 = ES.GetIntrinsic('%Temporal.YearMonth%');
	const MonthDay$2 = ES.GetIntrinsic('%Temporal.MonthDay%');

	const DATE$3 = Symbol('date');
	const YM = Symbol('ym');
	const MD = Symbol('md');
	const TIME$1 = Symbol('time');
	const DATETIME$1 = Symbol('datetime');
	const ORIGINAL = Symbol('original');

	const IntlDateTimeFormat$1 = Intl.DateTimeFormat;
	function DateTimeFormat(locale = IntlDateTimeFormat$1().resolvedOptions().locale, options = {}) {
	  if (!(this instanceof DateTimeFormat)) return new DateTimeFormat(locale, options);
	  this[ORIGINAL] = new IntlDateTimeFormat$1(locale, options);
	  this[DATE$3] = new IntlDateTimeFormat$1(locale, dateAmmend(options, {}));
	  this[YM] = new IntlDateTimeFormat$1(locale, dateAmmend(options, { day: false }));
	  this[MD] = new IntlDateTimeFormat$1(locale, dateAmmend(options, { year: false }));
	  this[TIME$1] = new IntlDateTimeFormat$1(locale, timeAmmend(options));
	  this[DATETIME$1] = new IntlDateTimeFormat$1(locale, datetimeAmmend(options));
	}
	DateTimeFormat.supportedLocalesOf = function(...args) {
	  return IntlDateTimeFormat$1.supportedLocalesOf(...args);
	};
	DateTimeFormat.prototype = Object.create(IntlDateTimeFormat$1.prototype, {
	  resolvedOptions: {
	    value: resolvedOptions,
	    enumerable: true,
	    writable: false,
	    configurable: true
	  },
	  format: {
	    value: format,
	    enumerable: true,
	    writable: false,
	    configurable: true
	  },
	  formatToParts: {
	    value: formatToParts,
	    enumerable: true,
	    writable: false,
	    configurable: true
	  },
	  formatRange: {
	    value: formatRange,
	    enumerable: true,
	    writable: false,
	    configurable: true
	  },
	  formatRangeToParts: {
	    value: formatRangeToParts,
	    enumerable: true,
	    writable: false,
	    configurable: true
	  }
	});

	function resolvedOptions() {
	  return this[ORIGINAL].resolvedOptions();
	}
	function format(datetime, ...rest) {
	  const { absolute, formatter } = extractOverrides(datetime, this);
	  if (absolute && formatter) {
	    return formatter.format(absolute.getEpochMilliseconds());
	  }
	  return this[ORIGINAL].format(datetime, ...rest);
	}
	function formatToParts(datetime, ...rest) {
	  const { absolute, formatter } = extractOverrides(datetime, this);
	  if (absolute && formatter) return formatter.formatToParts(absolute.getEpochMilliseconds());
	  return this[ORIGINAL].formatToParts(datetime, ...rest);
	}
	function formatRange(a, b) {
	  if ('object' === typeof a && 'object' === typeof b && Object.getPrototypeOf(a) === Object.getPrototypeOf(b)) {
	    const { absolute: aa, formatter } = extractOverrides(a, this);
	    if (aa && formatter) {
	      const { absolute: ba } = extractOverrides(b, this);
	      return formatter.formatRange(aa, ba);
	    }
	  }
	  return this[ORIGINAL].formatRange(a, b);
	}
	function formatRangeToParts(a, b) {
	  if ('object' === typeof a && 'object' === typeof b && Object.getPrototypeOf(a) === Object.getPrototypeOf(b)) {
	    const { absolute: aa, formatter } = extractOverrides(a, this);
	    if (aa && formatter) {
	      const { absolute: ba } = extractOverrides(b, this);
	      return formatter.formatRangeToParts(aa, ba);
	    }
	  }
	  return this[ORIGINAL].formatRangeToParts(a, b);
	}

	function ammend(options = {}, ammended = {}) {
	  options = Object.assign({}, options);
	  for (let opt of ['year', 'month', 'day', 'hour', 'minute', 'second']) {
	    options[opt] = opt in ammended ? ammended[opt] : options[opt];
	    if (options[opt] === false || options[opt] === undefined) delete options[opt];
	  }
	  return options;
	}
	function timeAmmend(options) {
	  options = ammend(options, { year: false, month: false, day: false });
	  if (!hasTimeOptions(options)) {
	    options = Object.assign(options, {
	      hour: 'numeric',
	      minute: 'numeric',
	      second: 'numeric'
	    });
	  }
	  return options;
	}
	function dateAmmend(options, ammendments) {
	  options = ammend(options, { hour: false, minute: false, second: false });
	  if (!hasDateOptions(options)) {
	    options = Object.assign(options, {
	      year: 'numeric',
	      month: 'numeric',
	      day: 'numeric'
	    });
	  }
	  options = ammend(options, ammendments);
	  return options;
	}
	function datetimeAmmend(options) {
	  options = Object.assign({}, options);
	  if (!hasTimeOptions(options) && !hasDateOptions(options)) {
	    Object.assign(options, {
	      year: 'numeric',
	      month: 'numeric',
	      day: 'numeric',
	      hour: 'numeric',
	      minute: 'numeric',
	      second: 'numeric'
	    });
	  }
	  return options;
	}

	function hasDateOptions(options) {
	  return 'year' in options || 'month' in options || 'day' in options;
	}
	function hasTimeOptions(options) {
	  return 'hour' in options || 'minute' in options || 'second' in options;
	}
	function extractOverrides(datetime, main) {
	  let formatter;
	  if (datetime instanceof Time$2) {
	    datetime = datetime.withDate(new Date$3(1970, 1, 1));
	    formatter = main[TIME$1];
	  }
	  if (datetime instanceof YearMonth$2) {
	    datetime = datetime.withDay(1);
	    formatter = main[YM];
	  }
	  if (datetime instanceof MonthDay$2) {
	    datetime = datetime.withYear(2004); // use a leap-year for maximum range
	    formatter = main[MD];
	  }
	  if (datetime instanceof Date$3) {
	    datetime = datetime.withTime(new Time$2(12, 0));
	    formatter = formatter || main[DATE$3];
	  }
	  if (datetime instanceof DateTime$3) {
	    const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = datetime;
	    const found = ES.GetTimeZoneEpochNanoseconds(
	      main.resolvedOptions().timeZone,
	      year,
	      month,
	      day,
	      hour,
	      minute,
	      second,
	      millisecond,
	      microsecond,
	      nanosecond
	    );
	    formatter = formatter || main[DATETIME$1];
	    if (!found.length) throw new RangeError(`invalid datetime in ${timezone}`);
	    datetime = new Absolute$2(found[0]);
	  }
	  if (datetime instanceof Absolute$2) {
	    formatter = formatter || main[DATETIME$1];
	    return { absolute: datetime, formatter };
	  } else {
	    return {};
	  }
	}

	var Intl$1 = /*#__PURE__*/Object.freeze({
	    __proto__: null,
	    DateTimeFormat: DateTimeFormat
	});

	function setup(global = globalThis) {
	  global.Temporal = {};
	  copy(global.Temporal, Temporal);
	  copy(global.Intl, Intl$1);

	  function copy(target, source) {
	    for (const prop of Object.getOwnPropertyNames(source)) {
	      target[prop] = source[prop];
	    }
	  }
	}

	exports.Intl = Intl$1;
	exports.Temporal = Temporal;
	exports.setup = setup;
	});

	unwrapExports(polyfill_1);
	var polyfill_2 = polyfill_1.Intl;
	var polyfill_3 = polyfill_1.Temporal;
	var polyfill_4 = polyfill_1.setup;

	polyfill_4();

}));
