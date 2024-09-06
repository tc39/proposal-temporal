(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.temporal = {}));
})(this, (function (exports) { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function getAugmentedNamespace(n) {
	  if (n.__esModule) return n;
	  var f = n.default;
		if (typeof f == "function") {
			var a = function a () {
				if (this instanceof a) {
	        return Reflect.construct(f, arguments, this.constructor);
				}
				return f.apply(this, arguments);
			};
			a.prototype = f.prototype;
	  } else a = {};
	  Object.defineProperty(a, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	/** @type {import('.')} */
	var esErrors = Error;

	/** @type {import('./eval')} */
	var _eval = EvalError;

	var range;
	var hasRequiredRange;

	function requireRange () {
		if (hasRequiredRange) return range;
		hasRequiredRange = 1;

		/** @type {import('./range')} */
		range = RangeError;
		return range;
	}

	/** @type {import('./ref')} */
	var ref = ReferenceError;

	/** @type {import('./syntax')} */
	var syntax = SyntaxError;

	/** @type {import('./type')} */
	var type = TypeError;

	/** @type {import('./uri')} */
	var uri = URIError;

	/* eslint complexity: [2, 18], max-statements: [2, 33] */
	var shams$1 = function hasSymbols() {
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
		for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
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

	var origSymbol = typeof Symbol !== 'undefined' && Symbol;
	var hasSymbolSham = shams$1;

	var hasSymbols$4 = function hasNativeSymbols() {
		if (typeof origSymbol !== 'function') { return false; }
		if (typeof Symbol !== 'function') { return false; }
		if (typeof origSymbol('foo') !== 'symbol') { return false; }
		if (typeof Symbol('bar') !== 'symbol') { return false; }

		return hasSymbolSham();
	};

	var test = {
		__proto__: null,
		foo: {}
	};

	var $Object$1 = Object;

	/** @type {import('.')} */
	var hasProto$1 = function hasProto() {
		// @ts-expect-error: TS errors on an inherited property for some reason
		return { __proto__: test }.foo === test.foo
			&& !(test instanceof $Object$1);
	};

	/* eslint no-invalid-this: 1 */

	var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
	var toStr$5 = Object.prototype.toString;
	var max = Math.max;
	var funcType = '[object Function]';

	var concatty = function concatty(a, b) {
	    var arr = [];

	    for (var i = 0; i < a.length; i += 1) {
	        arr[i] = a[i];
	    }
	    for (var j = 0; j < b.length; j += 1) {
	        arr[j + a.length] = b[j];
	    }

	    return arr;
	};

	var slicy = function slicy(arrLike, offset) {
	    var arr = [];
	    for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
	        arr[j] = arrLike[i];
	    }
	    return arr;
	};

	var joiny = function (arr, joiner) {
	    var str = '';
	    for (var i = 0; i < arr.length; i += 1) {
	        str += arr[i];
	        if (i + 1 < arr.length) {
	            str += joiner;
	        }
	    }
	    return str;
	};

	var implementation$3 = function bind(that) {
	    var target = this;
	    if (typeof target !== 'function' || toStr$5.apply(target) !== funcType) {
	        throw new TypeError(ERROR_MESSAGE + target);
	    }
	    var args = slicy(arguments, 1);

	    var bound;
	    var binder = function () {
	        if (this instanceof bound) {
	            var result = target.apply(
	                this,
	                concatty(args, arguments)
	            );
	            if (Object(result) === result) {
	                return result;
	            }
	            return this;
	        }
	        return target.apply(
	            that,
	            concatty(args, arguments)
	        );

	    };

	    var boundLength = max(0, target.length - args.length);
	    var boundArgs = [];
	    for (var i = 0; i < boundLength; i++) {
	        boundArgs[i] = '$' + i;
	    }

	    bound = Function('binder', 'return function (' + joiny(boundArgs, ',') + '){ return binder.apply(this,arguments); }')(binder);

	    if (target.prototype) {
	        var Empty = function Empty() {};
	        Empty.prototype = target.prototype;
	        bound.prototype = new Empty();
	        Empty.prototype = null;
	    }

	    return bound;
	};

	var implementation$2 = implementation$3;

	var functionBind = Function.prototype.bind || implementation$2;

	var call = Function.prototype.call;
	var $hasOwn = Object.prototype.hasOwnProperty;
	var bind$1 = functionBind;

	/** @type {import('.')} */
	var hasown = bind$1.call(call, $hasOwn);

	var undefined$1;

	var $Error = esErrors;
	var $EvalError = _eval;
	var $RangeError$1 = requireRange();
	var $ReferenceError = ref;
	var $SyntaxError$1 = syntax;
	var $TypeError$9 = type;
	var $URIError = uri;

	var $Function = Function;

	// eslint-disable-next-line consistent-return
	var getEvalledConstructor = function (expressionSyntax) {
		try {
			return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
		} catch (e) {}
	};

	var $gOPD = Object.getOwnPropertyDescriptor;
	if ($gOPD) {
		try {
			$gOPD({}, '');
		} catch (e) {
			$gOPD = null; // this is IE 8, which has a broken gOPD
		}
	}

	var throwTypeError = function () {
		throw new $TypeError$9();
	};
	var ThrowTypeError = $gOPD
		? (function () {
			try {
				// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
				arguments.callee; // IE 8 does not throw here
				return throwTypeError;
			} catch (calleeThrows) {
				try {
					// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
					return $gOPD(arguments, 'callee').get;
				} catch (gOPDthrows) {
					return throwTypeError;
				}
			}
		}())
		: throwTypeError;

	var hasSymbols$3 = hasSymbols$4();
	var hasProto = hasProto$1();

	var getProto = Object.getPrototypeOf || (
		hasProto
			? function (x) { return x.__proto__; } // eslint-disable-line no-proto
			: null
	);

	var needsEval = {};

	var TypedArray = typeof Uint8Array === 'undefined' || !getProto ? undefined$1 : getProto(Uint8Array);

	var INTRINSICS$1 = {
		__proto__: null,
		'%AggregateError%': typeof AggregateError === 'undefined' ? undefined$1 : AggregateError,
		'%Array%': Array,
		'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined$1 : ArrayBuffer,
		'%ArrayIteratorPrototype%': hasSymbols$3 && getProto ? getProto([][Symbol.iterator]()) : undefined$1,
		'%AsyncFromSyncIteratorPrototype%': undefined$1,
		'%AsyncFunction%': needsEval,
		'%AsyncGenerator%': needsEval,
		'%AsyncGeneratorFunction%': needsEval,
		'%AsyncIteratorPrototype%': needsEval,
		'%Atomics%': typeof Atomics === 'undefined' ? undefined$1 : Atomics,
		'%BigInt%': typeof BigInt === 'undefined' ? undefined$1 : BigInt,
		'%BigInt64Array%': typeof BigInt64Array === 'undefined' ? undefined$1 : BigInt64Array,
		'%BigUint64Array%': typeof BigUint64Array === 'undefined' ? undefined$1 : BigUint64Array,
		'%Boolean%': Boolean,
		'%DataView%': typeof DataView === 'undefined' ? undefined$1 : DataView,
		'%Date%': Date,
		'%decodeURI%': decodeURI,
		'%decodeURIComponent%': decodeURIComponent,
		'%encodeURI%': encodeURI,
		'%encodeURIComponent%': encodeURIComponent,
		'%Error%': $Error,
		'%eval%': eval, // eslint-disable-line no-eval
		'%EvalError%': $EvalError,
		'%Float32Array%': typeof Float32Array === 'undefined' ? undefined$1 : Float32Array,
		'%Float64Array%': typeof Float64Array === 'undefined' ? undefined$1 : Float64Array,
		'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined$1 : FinalizationRegistry,
		'%Function%': $Function,
		'%GeneratorFunction%': needsEval,
		'%Int8Array%': typeof Int8Array === 'undefined' ? undefined$1 : Int8Array,
		'%Int16Array%': typeof Int16Array === 'undefined' ? undefined$1 : Int16Array,
		'%Int32Array%': typeof Int32Array === 'undefined' ? undefined$1 : Int32Array,
		'%isFinite%': isFinite,
		'%isNaN%': isNaN,
		'%IteratorPrototype%': hasSymbols$3 && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined$1,
		'%JSON%': typeof JSON === 'object' ? JSON : undefined$1,
		'%Map%': typeof Map === 'undefined' ? undefined$1 : Map,
		'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols$3 || !getProto ? undefined$1 : getProto(new Map()[Symbol.iterator]()),
		'%Math%': Math,
		'%Number%': Number,
		'%Object%': Object,
		'%parseFloat%': parseFloat,
		'%parseInt%': parseInt,
		'%Promise%': typeof Promise === 'undefined' ? undefined$1 : Promise,
		'%Proxy%': typeof Proxy === 'undefined' ? undefined$1 : Proxy,
		'%RangeError%': $RangeError$1,
		'%ReferenceError%': $ReferenceError,
		'%Reflect%': typeof Reflect === 'undefined' ? undefined$1 : Reflect,
		'%RegExp%': RegExp,
		'%Set%': typeof Set === 'undefined' ? undefined$1 : Set,
		'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols$3 || !getProto ? undefined$1 : getProto(new Set()[Symbol.iterator]()),
		'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined$1 : SharedArrayBuffer,
		'%String%': String,
		'%StringIteratorPrototype%': hasSymbols$3 && getProto ? getProto(''[Symbol.iterator]()) : undefined$1,
		'%Symbol%': hasSymbols$3 ? Symbol : undefined$1,
		'%SyntaxError%': $SyntaxError$1,
		'%ThrowTypeError%': ThrowTypeError,
		'%TypedArray%': TypedArray,
		'%TypeError%': $TypeError$9,
		'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined$1 : Uint8Array,
		'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined$1 : Uint8ClampedArray,
		'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined$1 : Uint16Array,
		'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined$1 : Uint32Array,
		'%URIError%': $URIError,
		'%WeakMap%': typeof WeakMap === 'undefined' ? undefined$1 : WeakMap,
		'%WeakRef%': typeof WeakRef === 'undefined' ? undefined$1 : WeakRef,
		'%WeakSet%': typeof WeakSet === 'undefined' ? undefined$1 : WeakSet
	};

	if (getProto) {
		try {
			null.error; // eslint-disable-line no-unused-expressions
		} catch (e) {
			// https://github.com/tc39/proposal-shadowrealm/pull/384#issuecomment-1364264229
			var errorProto = getProto(getProto(e));
			INTRINSICS$1['%Error.prototype%'] = errorProto;
		}
	}

	var doEval = function doEval(name) {
		var value;
		if (name === '%AsyncFunction%') {
			value = getEvalledConstructor('async function () {}');
		} else if (name === '%GeneratorFunction%') {
			value = getEvalledConstructor('function* () {}');
		} else if (name === '%AsyncGeneratorFunction%') {
			value = getEvalledConstructor('async function* () {}');
		} else if (name === '%AsyncGenerator%') {
			var fn = doEval('%AsyncGeneratorFunction%');
			if (fn) {
				value = fn.prototype;
			}
		} else if (name === '%AsyncIteratorPrototype%') {
			var gen = doEval('%AsyncGenerator%');
			if (gen && getProto) {
				value = getProto(gen.prototype);
			}
		}

		INTRINSICS$1[name] = value;

		return value;
	};

	var LEGACY_ALIASES = {
		__proto__: null,
		'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
		'%ArrayPrototype%': ['Array', 'prototype'],
		'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
		'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
		'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
		'%ArrayProto_values%': ['Array', 'prototype', 'values'],
		'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
		'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
		'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
		'%BooleanPrototype%': ['Boolean', 'prototype'],
		'%DataViewPrototype%': ['DataView', 'prototype'],
		'%DatePrototype%': ['Date', 'prototype'],
		'%ErrorPrototype%': ['Error', 'prototype'],
		'%EvalErrorPrototype%': ['EvalError', 'prototype'],
		'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
		'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
		'%FunctionPrototype%': ['Function', 'prototype'],
		'%Generator%': ['GeneratorFunction', 'prototype'],
		'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
		'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
		'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
		'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
		'%JSONParse%': ['JSON', 'parse'],
		'%JSONStringify%': ['JSON', 'stringify'],
		'%MapPrototype%': ['Map', 'prototype'],
		'%NumberPrototype%': ['Number', 'prototype'],
		'%ObjectPrototype%': ['Object', 'prototype'],
		'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
		'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
		'%PromisePrototype%': ['Promise', 'prototype'],
		'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
		'%Promise_all%': ['Promise', 'all'],
		'%Promise_reject%': ['Promise', 'reject'],
		'%Promise_resolve%': ['Promise', 'resolve'],
		'%RangeErrorPrototype%': ['RangeError', 'prototype'],
		'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
		'%RegExpPrototype%': ['RegExp', 'prototype'],
		'%SetPrototype%': ['Set', 'prototype'],
		'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
		'%StringPrototype%': ['String', 'prototype'],
		'%SymbolPrototype%': ['Symbol', 'prototype'],
		'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
		'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
		'%TypeErrorPrototype%': ['TypeError', 'prototype'],
		'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
		'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
		'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
		'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
		'%URIErrorPrototype%': ['URIError', 'prototype'],
		'%WeakMapPrototype%': ['WeakMap', 'prototype'],
		'%WeakSetPrototype%': ['WeakSet', 'prototype']
	};

	var bind = functionBind;
	var hasOwn$2 = hasown;
	var $concat$1 = bind.call(Function.call, Array.prototype.concat);
	var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
	var $replace$1 = bind.call(Function.call, String.prototype.replace);
	var $strSlice = bind.call(Function.call, String.prototype.slice);
	var $exec = bind.call(Function.call, RegExp.prototype.exec);

	/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
	var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
	var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
	var stringToPath = function stringToPath(string) {
		var first = $strSlice(string, 0, 1);
		var last = $strSlice(string, -1);
		if (first === '%' && last !== '%') {
			throw new $SyntaxError$1('invalid intrinsic syntax, expected closing `%`');
		} else if (last === '%' && first !== '%') {
			throw new $SyntaxError$1('invalid intrinsic syntax, expected opening `%`');
		}
		var result = [];
		$replace$1(string, rePropName, function (match, number, quote, subString) {
			result[result.length] = quote ? $replace$1(subString, reEscapeChar, '$1') : number || match;
		});
		return result;
	};
	/* end adaptation */

	var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
		var intrinsicName = name;
		var alias;
		if (hasOwn$2(LEGACY_ALIASES, intrinsicName)) {
			alias = LEGACY_ALIASES[intrinsicName];
			intrinsicName = '%' + alias[0] + '%';
		}

		if (hasOwn$2(INTRINSICS$1, intrinsicName)) {
			var value = INTRINSICS$1[intrinsicName];
			if (value === needsEval) {
				value = doEval(intrinsicName);
			}
			if (typeof value === 'undefined' && !allowMissing) {
				throw new $TypeError$9('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
			}

			return {
				alias: alias,
				name: intrinsicName,
				value: value
			};
		}

		throw new $SyntaxError$1('intrinsic ' + name + ' does not exist!');
	};

	var getIntrinsic = function GetIntrinsic(name, allowMissing) {
		if (typeof name !== 'string' || name.length === 0) {
			throw new $TypeError$9('intrinsic name must be a non-empty string');
		}
		if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
			throw new $TypeError$9('"allowMissing" argument must be a boolean');
		}

		if ($exec(/^%?[^%]*%?$/, name) === null) {
			throw new $SyntaxError$1('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
		}
		var parts = stringToPath(name);
		var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

		var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
		var intrinsicRealName = intrinsic.name;
		var value = intrinsic.value;
		var skipFurtherCaching = false;

		var alias = intrinsic.alias;
		if (alias) {
			intrinsicBaseName = alias[0];
			$spliceApply(parts, $concat$1([0, 1], alias));
		}

		for (var i = 1, isOwn = true; i < parts.length; i += 1) {
			var part = parts[i];
			var first = $strSlice(part, 0, 1);
			var last = $strSlice(part, -1);
			if (
				(
					(first === '"' || first === "'" || first === '`')
					|| (last === '"' || last === "'" || last === '`')
				)
				&& first !== last
			) {
				throw new $SyntaxError$1('property names with quotes must have matching quotes');
			}
			if (part === 'constructor' || !isOwn) {
				skipFurtherCaching = true;
			}

			intrinsicBaseName += '.' + part;
			intrinsicRealName = '%' + intrinsicBaseName + '%';

			if (hasOwn$2(INTRINSICS$1, intrinsicRealName)) {
				value = INTRINSICS$1[intrinsicRealName];
			} else if (value != null) {
				if (!(part in value)) {
					if (!allowMissing) {
						throw new $TypeError$9('base intrinsic for ' + name + ' exists, but the property is not available.');
					}
					return void undefined$1;
				}
				if ($gOPD && (i + 1) >= parts.length) {
					var desc = $gOPD(value, part);
					isOwn = !!desc;

					// By convention, when a data property is converted to an accessor
					// property to emulate a data property that does not suffer from
					// the override mistake, that accessor's getter is marked with
					// an `originalValue` property. Here, when we detect this, we
					// uphold the illusion by pretending to see that original data
					// property, i.e., returning the value rather than the getter
					// itself.
					if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
						value = desc.get;
					} else {
						value = value[part];
					}
				} else {
					isOwn = hasOwn$2(value, part);
					value = value[part];
				}

				if (isOwn && !skipFurtherCaching) {
					INTRINSICS$1[intrinsicRealName] = value;
				}
			}
		}
		return value;
	};

	var callBind$2 = {exports: {}};

	var esDefineProperty;
	var hasRequiredEsDefineProperty;

	function requireEsDefineProperty () {
		if (hasRequiredEsDefineProperty) return esDefineProperty;
		hasRequiredEsDefineProperty = 1;

		var GetIntrinsic = getIntrinsic;

		/** @type {import('.')} */
		var $defineProperty = GetIntrinsic('%Object.defineProperty%', true) || false;
		if ($defineProperty) {
			try {
				$defineProperty({}, 'a', { value: 1 });
			} catch (e) {
				// IE 8 has a broken defineProperty
				$defineProperty = false;
			}
		}

		esDefineProperty = $defineProperty;
		return esDefineProperty;
	}

	var gopd$1;
	var hasRequiredGopd;

	function requireGopd () {
		if (hasRequiredGopd) return gopd$1;
		hasRequiredGopd = 1;

		var GetIntrinsic = getIntrinsic;

		var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);

		if ($gOPD) {
			try {
				$gOPD([], 'length');
			} catch (e) {
				// IE 8 has a broken gOPD
				$gOPD = null;
			}
		}

		gopd$1 = $gOPD;
		return gopd$1;
	}

	var $defineProperty$1 = requireEsDefineProperty();

	var $SyntaxError = syntax;
	var $TypeError$8 = type;

	var gopd = requireGopd();

	/** @type {import('.')} */
	var defineDataProperty = function defineDataProperty(
		obj,
		property,
		value
	) {
		if (!obj || (typeof obj !== 'object' && typeof obj !== 'function')) {
			throw new $TypeError$8('`obj` must be an object or a function`');
		}
		if (typeof property !== 'string' && typeof property !== 'symbol') {
			throw new $TypeError$8('`property` must be a string or a symbol`');
		}
		if (arguments.length > 3 && typeof arguments[3] !== 'boolean' && arguments[3] !== null) {
			throw new $TypeError$8('`nonEnumerable`, if provided, must be a boolean or null');
		}
		if (arguments.length > 4 && typeof arguments[4] !== 'boolean' && arguments[4] !== null) {
			throw new $TypeError$8('`nonWritable`, if provided, must be a boolean or null');
		}
		if (arguments.length > 5 && typeof arguments[5] !== 'boolean' && arguments[5] !== null) {
			throw new $TypeError$8('`nonConfigurable`, if provided, must be a boolean or null');
		}
		if (arguments.length > 6 && typeof arguments[6] !== 'boolean') {
			throw new $TypeError$8('`loose`, if provided, must be a boolean');
		}

		var nonEnumerable = arguments.length > 3 ? arguments[3] : null;
		var nonWritable = arguments.length > 4 ? arguments[4] : null;
		var nonConfigurable = arguments.length > 5 ? arguments[5] : null;
		var loose = arguments.length > 6 ? arguments[6] : false;

		/* @type {false | TypedPropertyDescriptor<unknown>} */
		var desc = !!gopd && gopd(obj, property);

		if ($defineProperty$1) {
			$defineProperty$1(obj, property, {
				configurable: nonConfigurable === null && desc ? desc.configurable : !nonConfigurable,
				enumerable: nonEnumerable === null && desc ? desc.enumerable : !nonEnumerable,
				value: value,
				writable: nonWritable === null && desc ? desc.writable : !nonWritable
			});
		} else if (loose || (!nonEnumerable && !nonWritable && !nonConfigurable)) {
			// must fall back to [[Set]], and was not explicitly asked to make non-enumerable, non-writable, or non-configurable
			obj[property] = value; // eslint-disable-line no-param-reassign
		} else {
			throw new $SyntaxError('This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.');
		}
	};

	var $defineProperty = requireEsDefineProperty();

	var hasPropertyDescriptors = function hasPropertyDescriptors() {
		return !!$defineProperty;
	};

	hasPropertyDescriptors.hasArrayLengthDefineBug = function hasArrayLengthDefineBug() {
		// node v0.6 has a bug where array lengths can be Set but not Defined
		if (!$defineProperty) {
			return null;
		}
		try {
			return $defineProperty([], 'length', { value: 1 }).length !== 1;
		} catch (e) {
			// In Firefox 4-22, defining length on an array throws an exception.
			return true;
		}
	};

	var hasPropertyDescriptors_1 = hasPropertyDescriptors;

	var GetIntrinsic$9 = getIntrinsic;
	var define = defineDataProperty;
	var hasDescriptors = hasPropertyDescriptors_1();
	var gOPD = requireGopd();

	var $TypeError$7 = type;
	var $floor$2 = GetIntrinsic$9('%Math.floor%');

	/** @type {import('.')} */
	var setFunctionLength = function setFunctionLength(fn, length) {
		if (typeof fn !== 'function') {
			throw new $TypeError$7('`fn` is not a function');
		}
		if (typeof length !== 'number' || length < 0 || length > 0xFFFFFFFF || $floor$2(length) !== length) {
			throw new $TypeError$7('`length` must be a positive 32-bit integer');
		}

		var loose = arguments.length > 2 && !!arguments[2];

		var functionLengthIsConfigurable = true;
		var functionLengthIsWritable = true;
		if ('length' in fn && gOPD) {
			var desc = gOPD(fn, 'length');
			if (desc && !desc.configurable) {
				functionLengthIsConfigurable = false;
			}
			if (desc && !desc.writable) {
				functionLengthIsWritable = false;
			}
		}

		if (functionLengthIsConfigurable || functionLengthIsWritable || !loose) {
			if (hasDescriptors) {
				define(/** @type {Parameters<define>[0]} */ (fn), 'length', length, true, true);
			} else {
				define(/** @type {Parameters<define>[0]} */ (fn), 'length', length);
			}
		}
		return fn;
	};

	(function (module) {

		var bind = functionBind;
		var GetIntrinsic = getIntrinsic;
		var setFunctionLength$1 = setFunctionLength;

		var $TypeError = type;
		var $apply = GetIntrinsic('%Function.prototype.apply%');
		var $call = GetIntrinsic('%Function.prototype.call%');
		var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

		var $defineProperty = requireEsDefineProperty();
		var $max = GetIntrinsic('%Math.max%');

		module.exports = function callBind(originalFunction) {
			if (typeof originalFunction !== 'function') {
				throw new $TypeError('a function is required');
			}
			var func = $reflectApply(bind, $call, arguments);
			return setFunctionLength$1(
				func,
				1 + $max(0, originalFunction.length - (arguments.length - 1)),
				true
			);
		};

		var applyBind = function applyBind() {
			return $reflectApply(bind, $apply, arguments);
		};

		if ($defineProperty) {
			$defineProperty(module.exports, 'apply', { value: applyBind });
		} else {
			module.exports.apply = applyBind;
		} 
	} (callBind$2));

	var callBindExports = callBind$2.exports;

	var GetIntrinsic$8 = getIntrinsic;

	var callBind$1 = callBindExports;

	var $indexOf = callBind$1(GetIntrinsic$8('String.prototype.indexOf'));

	var callBound$3 = function callBoundIntrinsic(name, allowMissing) {
		var intrinsic = GetIntrinsic$8(name, !!allowMissing);
		if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
			return callBind$1(intrinsic);
		}
		return intrinsic;
	};

	var GetIntrinsic$7 = getIntrinsic;

	var $Array = GetIntrinsic$7('%Array%');

	// eslint-disable-next-line global-require
	var toStr$4 = !$Array.isArray && callBound$3('Object.prototype.toString');

	var IsArray$3 = $Array.isArray || function IsArray(argument) {
		return toStr$4(argument) === '[object Array]';
	};

	// https://262.ecma-international.org/6.0/#sec-isarray
	var IsArray$2 = IsArray$3;

	var GetIntrinsic$6 = getIntrinsic;
	var callBound$2 = callBound$3;

	var $TypeError$6 = type;

	var IsArray$1 = IsArray$2;

	var $apply = GetIntrinsic$6('%Reflect.apply%', true) || callBound$2('Function.prototype.apply');

	// https://262.ecma-international.org/6.0/#sec-call

	var Call = function Call(F, V) {
		var argumentsList = arguments.length > 2 ? arguments[2] : [];
		if (!IsArray$1(argumentsList)) {
			throw new $TypeError$6('Assertion failed: optional `argumentsList`, if provided, must be a List');
		}
		return $apply(F, V, argumentsList);
	};

	var Call$1 = /*@__PURE__*/getDefaultExportFromCjs(Call);

	// https://262.ecma-international.org/5.1/#sec-8

	var Type$4 = function Type(x) {
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
	};

	var ES5Type = Type$4;

	// https://262.ecma-international.org/11.0/#sec-ecmascript-data-types-and-values

	var Type$2 = function Type(x) {
		if (typeof x === 'symbol') {
			return 'Symbol';
		}
		if (typeof x === 'bigint') {
			return 'BigInt';
		}
		return ES5Type(x);
	};

	var Type$3 = /*@__PURE__*/getDefaultExportFromCjs(Type$2);

	var BigInteger = {exports: {}};

	(function (module) {
		var bigInt = (function (undefined$1) {

		    var BASE = 1e7,
		        LOG_BASE = 7,
		        MAX_INT = 9007199254740992,
		        MAX_INT_ARR = smallToArray(MAX_INT),
		        DEFAULT_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

		    var supportsNativeBigInt = typeof BigInt === "function";

		    function Integer(v, radix, alphabet, caseSensitive) {
		        if (typeof v === "undefined") return Integer[0];
		        if (typeof radix !== "undefined") return +radix === 10 && !alphabet ? parseValue(v) : parseBase(v, radix, alphabet, caseSensitive);
		        return parseValue(v);
		    }

		    function BigInteger(value, sign) {
		        this.value = value;
		        this.sign = sign;
		        this.isSmall = false;
		    }
		    BigInteger.prototype = Object.create(Integer.prototype);

		    function SmallInteger(value) {
		        this.value = value;
		        this.sign = value < 0;
		        this.isSmall = true;
		    }
		    SmallInteger.prototype = Object.create(Integer.prototype);

		    function NativeBigInt(value) {
		        this.value = value;
		    }
		    NativeBigInt.prototype = Object.create(Integer.prototype);

		    function isPrecise(n) {
		        return -MAX_INT < n && n < MAX_INT;
		    }

		    function smallToArray(n) { // For performance reasons doesn't reference BASE, need to change this function if BASE changes
		        if (n < 1e7)
		            return [n];
		        if (n < 1e14)
		            return [n % 1e7, Math.floor(n / 1e7)];
		        return [n % 1e7, Math.floor(n / 1e7) % 1e7, Math.floor(n / 1e14)];
		    }

		    function arrayToSmall(arr) { // If BASE changes this function may need to change
		        trim(arr);
		        var length = arr.length;
		        if (length < 4 && compareAbs(arr, MAX_INT_ARR) < 0) {
		            switch (length) {
		                case 0: return 0;
		                case 1: return arr[0];
		                case 2: return arr[0] + arr[1] * BASE;
		                default: return arr[0] + (arr[1] + arr[2] * BASE) * BASE;
		            }
		        }
		        return arr;
		    }

		    function trim(v) {
		        var i = v.length;
		        while (v[--i] === 0);
		        v.length = i + 1;
		    }

		    function createArray(length) { // function shamelessly stolen from Yaffle's library https://github.com/Yaffle/BigInteger
		        var x = new Array(length);
		        var i = -1;
		        while (++i < length) {
		            x[i] = 0;
		        }
		        return x;
		    }

		    function truncate(n) {
		        if (n > 0) return Math.floor(n);
		        return Math.ceil(n);
		    }

		    function add(a, b) { // assumes a and b are arrays with a.length >= b.length
		        var l_a = a.length,
		            l_b = b.length,
		            r = new Array(l_a),
		            carry = 0,
		            base = BASE,
		            sum, i;
		        for (i = 0; i < l_b; i++) {
		            sum = a[i] + b[i] + carry;
		            carry = sum >= base ? 1 : 0;
		            r[i] = sum - carry * base;
		        }
		        while (i < l_a) {
		            sum = a[i] + carry;
		            carry = sum === base ? 1 : 0;
		            r[i++] = sum - carry * base;
		        }
		        if (carry > 0) r.push(carry);
		        return r;
		    }

		    function addAny(a, b) {
		        if (a.length >= b.length) return add(a, b);
		        return add(b, a);
		    }

		    function addSmall(a, carry) { // assumes a is array, carry is number with 0 <= carry < MAX_INT
		        var l = a.length,
		            r = new Array(l),
		            base = BASE,
		            sum, i;
		        for (i = 0; i < l; i++) {
		            sum = a[i] - base + carry;
		            carry = Math.floor(sum / base);
		            r[i] = sum - carry * base;
		            carry += 1;
		        }
		        while (carry > 0) {
		            r[i++] = carry % base;
		            carry = Math.floor(carry / base);
		        }
		        return r;
		    }

		    BigInteger.prototype.add = function (v) {
		        var n = parseValue(v);
		        if (this.sign !== n.sign) {
		            return this.subtract(n.negate());
		        }
		        var a = this.value, b = n.value;
		        if (n.isSmall) {
		            return new BigInteger(addSmall(a, Math.abs(b)), this.sign);
		        }
		        return new BigInteger(addAny(a, b), this.sign);
		    };
		    BigInteger.prototype.plus = BigInteger.prototype.add;

		    SmallInteger.prototype.add = function (v) {
		        var n = parseValue(v);
		        var a = this.value;
		        if (a < 0 !== n.sign) {
		            return this.subtract(n.negate());
		        }
		        var b = n.value;
		        if (n.isSmall) {
		            if (isPrecise(a + b)) return new SmallInteger(a + b);
		            b = smallToArray(Math.abs(b));
		        }
		        return new BigInteger(addSmall(b, Math.abs(a)), a < 0);
		    };
		    SmallInteger.prototype.plus = SmallInteger.prototype.add;

		    NativeBigInt.prototype.add = function (v) {
		        return new NativeBigInt(this.value + parseValue(v).value);
		    };
		    NativeBigInt.prototype.plus = NativeBigInt.prototype.add;

		    function subtract(a, b) { // assumes a and b are arrays with a >= b
		        var a_l = a.length,
		            b_l = b.length,
		            r = new Array(a_l),
		            borrow = 0,
		            base = BASE,
		            i, difference;
		        for (i = 0; i < b_l; i++) {
		            difference = a[i] - borrow - b[i];
		            if (difference < 0) {
		                difference += base;
		                borrow = 1;
		            } else borrow = 0;
		            r[i] = difference;
		        }
		        for (i = b_l; i < a_l; i++) {
		            difference = a[i] - borrow;
		            if (difference < 0) difference += base;
		            else {
		                r[i++] = difference;
		                break;
		            }
		            r[i] = difference;
		        }
		        for (; i < a_l; i++) {
		            r[i] = a[i];
		        }
		        trim(r);
		        return r;
		    }

		    function subtractAny(a, b, sign) {
		        var value;
		        if (compareAbs(a, b) >= 0) {
		            value = subtract(a, b);
		        } else {
		            value = subtract(b, a);
		            sign = !sign;
		        }
		        value = arrayToSmall(value);
		        if (typeof value === "number") {
		            if (sign) value = -value;
		            return new SmallInteger(value);
		        }
		        return new BigInteger(value, sign);
		    }

		    function subtractSmall(a, b, sign) { // assumes a is array, b is number with 0 <= b < MAX_INT
		        var l = a.length,
		            r = new Array(l),
		            carry = -b,
		            base = BASE,
		            i, difference;
		        for (i = 0; i < l; i++) {
		            difference = a[i] + carry;
		            carry = Math.floor(difference / base);
		            difference %= base;
		            r[i] = difference < 0 ? difference + base : difference;
		        }
		        r = arrayToSmall(r);
		        if (typeof r === "number") {
		            if (sign) r = -r;
		            return new SmallInteger(r);
		        } return new BigInteger(r, sign);
		    }

		    BigInteger.prototype.subtract = function (v) {
		        var n = parseValue(v);
		        if (this.sign !== n.sign) {
		            return this.add(n.negate());
		        }
		        var a = this.value, b = n.value;
		        if (n.isSmall)
		            return subtractSmall(a, Math.abs(b), this.sign);
		        return subtractAny(a, b, this.sign);
		    };
		    BigInteger.prototype.minus = BigInteger.prototype.subtract;

		    SmallInteger.prototype.subtract = function (v) {
		        var n = parseValue(v);
		        var a = this.value;
		        if (a < 0 !== n.sign) {
		            return this.add(n.negate());
		        }
		        var b = n.value;
		        if (n.isSmall) {
		            return new SmallInteger(a - b);
		        }
		        return subtractSmall(b, Math.abs(a), a >= 0);
		    };
		    SmallInteger.prototype.minus = SmallInteger.prototype.subtract;

		    NativeBigInt.prototype.subtract = function (v) {
		        return new NativeBigInt(this.value - parseValue(v).value);
		    };
		    NativeBigInt.prototype.minus = NativeBigInt.prototype.subtract;

		    BigInteger.prototype.negate = function () {
		        return new BigInteger(this.value, !this.sign);
		    };
		    SmallInteger.prototype.negate = function () {
		        var sign = this.sign;
		        var small = new SmallInteger(-this.value);
		        small.sign = !sign;
		        return small;
		    };
		    NativeBigInt.prototype.negate = function () {
		        return new NativeBigInt(-this.value);
		    };

		    BigInteger.prototype.abs = function () {
		        return new BigInteger(this.value, false);
		    };
		    SmallInteger.prototype.abs = function () {
		        return new SmallInteger(Math.abs(this.value));
		    };
		    NativeBigInt.prototype.abs = function () {
		        return new NativeBigInt(this.value >= 0 ? this.value : -this.value);
		    };


		    function multiplyLong(a, b) {
		        var a_l = a.length,
		            b_l = b.length,
		            l = a_l + b_l,
		            r = createArray(l),
		            base = BASE,
		            product, carry, i, a_i, b_j;
		        for (i = 0; i < a_l; ++i) {
		            a_i = a[i];
		            for (var j = 0; j < b_l; ++j) {
		                b_j = b[j];
		                product = a_i * b_j + r[i + j];
		                carry = Math.floor(product / base);
		                r[i + j] = product - carry * base;
		                r[i + j + 1] += carry;
		            }
		        }
		        trim(r);
		        return r;
		    }

		    function multiplySmall(a, b) { // assumes a is array, b is number with |b| < BASE
		        var l = a.length,
		            r = new Array(l),
		            base = BASE,
		            carry = 0,
		            product, i;
		        for (i = 0; i < l; i++) {
		            product = a[i] * b + carry;
		            carry = Math.floor(product / base);
		            r[i] = product - carry * base;
		        }
		        while (carry > 0) {
		            r[i++] = carry % base;
		            carry = Math.floor(carry / base);
		        }
		        return r;
		    }

		    function shiftLeft(x, n) {
		        var r = [];
		        while (n-- > 0) r.push(0);
		        return r.concat(x);
		    }

		    function multiplyKaratsuba(x, y) {
		        var n = Math.max(x.length, y.length);

		        if (n <= 30) return multiplyLong(x, y);
		        n = Math.ceil(n / 2);

		        var b = x.slice(n),
		            a = x.slice(0, n),
		            d = y.slice(n),
		            c = y.slice(0, n);

		        var ac = multiplyKaratsuba(a, c),
		            bd = multiplyKaratsuba(b, d),
		            abcd = multiplyKaratsuba(addAny(a, b), addAny(c, d));

		        var product = addAny(addAny(ac, shiftLeft(subtract(subtract(abcd, ac), bd), n)), shiftLeft(bd, 2 * n));
		        trim(product);
		        return product;
		    }

		    // The following function is derived from a surface fit of a graph plotting the performance difference
		    // between long multiplication and karatsuba multiplication versus the lengths of the two arrays.
		    function useKaratsuba(l1, l2) {
		        return -0.012 * l1 - 0.012 * l2 + 0.000015 * l1 * l2 > 0;
		    }

		    BigInteger.prototype.multiply = function (v) {
		        var n = parseValue(v),
		            a = this.value, b = n.value,
		            sign = this.sign !== n.sign,
		            abs;
		        if (n.isSmall) {
		            if (b === 0) return Integer[0];
		            if (b === 1) return this;
		            if (b === -1) return this.negate();
		            abs = Math.abs(b);
		            if (abs < BASE) {
		                return new BigInteger(multiplySmall(a, abs), sign);
		            }
		            b = smallToArray(abs);
		        }
		        if (useKaratsuba(a.length, b.length)) // Karatsuba is only faster for certain array sizes
		            return new BigInteger(multiplyKaratsuba(a, b), sign);
		        return new BigInteger(multiplyLong(a, b), sign);
		    };

		    BigInteger.prototype.times = BigInteger.prototype.multiply;

		    function multiplySmallAndArray(a, b, sign) { // a >= 0
		        if (a < BASE) {
		            return new BigInteger(multiplySmall(b, a), sign);
		        }
		        return new BigInteger(multiplyLong(b, smallToArray(a)), sign);
		    }
		    SmallInteger.prototype._multiplyBySmall = function (a) {
		        if (isPrecise(a.value * this.value)) {
		            return new SmallInteger(a.value * this.value);
		        }
		        return multiplySmallAndArray(Math.abs(a.value), smallToArray(Math.abs(this.value)), this.sign !== a.sign);
		    };
		    BigInteger.prototype._multiplyBySmall = function (a) {
		        if (a.value === 0) return Integer[0];
		        if (a.value === 1) return this;
		        if (a.value === -1) return this.negate();
		        return multiplySmallAndArray(Math.abs(a.value), this.value, this.sign !== a.sign);
		    };
		    SmallInteger.prototype.multiply = function (v) {
		        return parseValue(v)._multiplyBySmall(this);
		    };
		    SmallInteger.prototype.times = SmallInteger.prototype.multiply;

		    NativeBigInt.prototype.multiply = function (v) {
		        return new NativeBigInt(this.value * parseValue(v).value);
		    };
		    NativeBigInt.prototype.times = NativeBigInt.prototype.multiply;

		    function square(a) {
		        //console.assert(2 * BASE * BASE < MAX_INT);
		        var l = a.length,
		            r = createArray(l + l),
		            base = BASE,
		            product, carry, i, a_i, a_j;
		        for (i = 0; i < l; i++) {
		            a_i = a[i];
		            carry = 0 - a_i * a_i;
		            for (var j = i; j < l; j++) {
		                a_j = a[j];
		                product = 2 * (a_i * a_j) + r[i + j] + carry;
		                carry = Math.floor(product / base);
		                r[i + j] = product - carry * base;
		            }
		            r[i + l] = carry;
		        }
		        trim(r);
		        return r;
		    }

		    BigInteger.prototype.square = function () {
		        return new BigInteger(square(this.value), false);
		    };

		    SmallInteger.prototype.square = function () {
		        var value = this.value * this.value;
		        if (isPrecise(value)) return new SmallInteger(value);
		        return new BigInteger(square(smallToArray(Math.abs(this.value))), false);
		    };

		    NativeBigInt.prototype.square = function (v) {
		        return new NativeBigInt(this.value * this.value);
		    };

		    function divMod1(a, b) { // Left over from previous version. Performs faster than divMod2 on smaller input sizes.
		        var a_l = a.length,
		            b_l = b.length,
		            base = BASE,
		            result = createArray(b.length),
		            divisorMostSignificantDigit = b[b_l - 1],
		            // normalization
		            lambda = Math.ceil(base / (2 * divisorMostSignificantDigit)),
		            remainder = multiplySmall(a, lambda),
		            divisor = multiplySmall(b, lambda),
		            quotientDigit, shift, carry, borrow, i, l, q;
		        if (remainder.length <= a_l) remainder.push(0);
		        divisor.push(0);
		        divisorMostSignificantDigit = divisor[b_l - 1];
		        for (shift = a_l - b_l; shift >= 0; shift--) {
		            quotientDigit = base - 1;
		            if (remainder[shift + b_l] !== divisorMostSignificantDigit) {
		                quotientDigit = Math.floor((remainder[shift + b_l] * base + remainder[shift + b_l - 1]) / divisorMostSignificantDigit);
		            }
		            // quotientDigit <= base - 1
		            carry = 0;
		            borrow = 0;
		            l = divisor.length;
		            for (i = 0; i < l; i++) {
		                carry += quotientDigit * divisor[i];
		                q = Math.floor(carry / base);
		                borrow += remainder[shift + i] - (carry - q * base);
		                carry = q;
		                if (borrow < 0) {
		                    remainder[shift + i] = borrow + base;
		                    borrow = -1;
		                } else {
		                    remainder[shift + i] = borrow;
		                    borrow = 0;
		                }
		            }
		            while (borrow !== 0) {
		                quotientDigit -= 1;
		                carry = 0;
		                for (i = 0; i < l; i++) {
		                    carry += remainder[shift + i] - base + divisor[i];
		                    if (carry < 0) {
		                        remainder[shift + i] = carry + base;
		                        carry = 0;
		                    } else {
		                        remainder[shift + i] = carry;
		                        carry = 1;
		                    }
		                }
		                borrow += carry;
		            }
		            result[shift] = quotientDigit;
		        }
		        // denormalization
		        remainder = divModSmall(remainder, lambda)[0];
		        return [arrayToSmall(result), arrayToSmall(remainder)];
		    }

		    function divMod2(a, b) { // Implementation idea shamelessly stolen from Silent Matt's library http://silentmatt.com/biginteger/
		        // Performs faster than divMod1 on larger input sizes.
		        var a_l = a.length,
		            b_l = b.length,
		            result = [],
		            part = [],
		            base = BASE,
		            guess, xlen, highx, highy, check;
		        while (a_l) {
		            part.unshift(a[--a_l]);
		            trim(part);
		            if (compareAbs(part, b) < 0) {
		                result.push(0);
		                continue;
		            }
		            xlen = part.length;
		            highx = part[xlen - 1] * base + part[xlen - 2];
		            highy = b[b_l - 1] * base + b[b_l - 2];
		            if (xlen > b_l) {
		                highx = (highx + 1) * base;
		            }
		            guess = Math.ceil(highx / highy);
		            do {
		                check = multiplySmall(b, guess);
		                if (compareAbs(check, part) <= 0) break;
		                guess--;
		            } while (guess);
		            result.push(guess);
		            part = subtract(part, check);
		        }
		        result.reverse();
		        return [arrayToSmall(result), arrayToSmall(part)];
		    }

		    function divModSmall(value, lambda) {
		        var length = value.length,
		            quotient = createArray(length),
		            base = BASE,
		            i, q, remainder, divisor;
		        remainder = 0;
		        for (i = length - 1; i >= 0; --i) {
		            divisor = remainder * base + value[i];
		            q = truncate(divisor / lambda);
		            remainder = divisor - q * lambda;
		            quotient[i] = q | 0;
		        }
		        return [quotient, remainder | 0];
		    }

		    function divModAny(self, v) {
		        var value, n = parseValue(v);
		        if (supportsNativeBigInt) {
		            return [new NativeBigInt(self.value / n.value), new NativeBigInt(self.value % n.value)];
		        }
		        var a = self.value, b = n.value;
		        var quotient;
		        if (b === 0) throw new Error("Cannot divide by zero");
		        if (self.isSmall) {
		            if (n.isSmall) {
		                return [new SmallInteger(truncate(a / b)), new SmallInteger(a % b)];
		            }
		            return [Integer[0], self];
		        }
		        if (n.isSmall) {
		            if (b === 1) return [self, Integer[0]];
		            if (b == -1) return [self.negate(), Integer[0]];
		            var abs = Math.abs(b);
		            if (abs < BASE) {
		                value = divModSmall(a, abs);
		                quotient = arrayToSmall(value[0]);
		                var remainder = value[1];
		                if (self.sign) remainder = -remainder;
		                if (typeof quotient === "number") {
		                    if (self.sign !== n.sign) quotient = -quotient;
		                    return [new SmallInteger(quotient), new SmallInteger(remainder)];
		                }
		                return [new BigInteger(quotient, self.sign !== n.sign), new SmallInteger(remainder)];
		            }
		            b = smallToArray(abs);
		        }
		        var comparison = compareAbs(a, b);
		        if (comparison === -1) return [Integer[0], self];
		        if (comparison === 0) return [Integer[self.sign === n.sign ? 1 : -1], Integer[0]];

		        // divMod1 is faster on smaller input sizes
		        if (a.length + b.length <= 200)
		            value = divMod1(a, b);
		        else value = divMod2(a, b);

		        quotient = value[0];
		        var qSign = self.sign !== n.sign,
		            mod = value[1],
		            mSign = self.sign;
		        if (typeof quotient === "number") {
		            if (qSign) quotient = -quotient;
		            quotient = new SmallInteger(quotient);
		        } else quotient = new BigInteger(quotient, qSign);
		        if (typeof mod === "number") {
		            if (mSign) mod = -mod;
		            mod = new SmallInteger(mod);
		        } else mod = new BigInteger(mod, mSign);
		        return [quotient, mod];
		    }

		    BigInteger.prototype.divmod = function (v) {
		        var result = divModAny(this, v);
		        return {
		            quotient: result[0],
		            remainder: result[1]
		        };
		    };
		    NativeBigInt.prototype.divmod = SmallInteger.prototype.divmod = BigInteger.prototype.divmod;


		    BigInteger.prototype.divide = function (v) {
		        return divModAny(this, v)[0];
		    };
		    NativeBigInt.prototype.over = NativeBigInt.prototype.divide = function (v) {
		        return new NativeBigInt(this.value / parseValue(v).value);
		    };
		    SmallInteger.prototype.over = SmallInteger.prototype.divide = BigInteger.prototype.over = BigInteger.prototype.divide;

		    BigInteger.prototype.mod = function (v) {
		        return divModAny(this, v)[1];
		    };
		    NativeBigInt.prototype.mod = NativeBigInt.prototype.remainder = function (v) {
		        return new NativeBigInt(this.value % parseValue(v).value);
		    };
		    SmallInteger.prototype.remainder = SmallInteger.prototype.mod = BigInteger.prototype.remainder = BigInteger.prototype.mod;

		    BigInteger.prototype.pow = function (v) {
		        var n = parseValue(v),
		            a = this.value,
		            b = n.value,
		            value, x, y;
		        if (b === 0) return Integer[1];
		        if (a === 0) return Integer[0];
		        if (a === 1) return Integer[1];
		        if (a === -1) return n.isEven() ? Integer[1] : Integer[-1];
		        if (n.sign) {
		            return Integer[0];
		        }
		        if (!n.isSmall) throw new Error("The exponent " + n.toString() + " is too large.");
		        if (this.isSmall) {
		            if (isPrecise(value = Math.pow(a, b)))
		                return new SmallInteger(truncate(value));
		        }
		        x = this;
		        y = Integer[1];
		        while (true) {
		            if (b & 1 === 1) {
		                y = y.times(x);
		                --b;
		            }
		            if (b === 0) break;
		            b /= 2;
		            x = x.square();
		        }
		        return y;
		    };
		    SmallInteger.prototype.pow = BigInteger.prototype.pow;

		    NativeBigInt.prototype.pow = function (v) {
		        var n = parseValue(v);
		        var a = this.value, b = n.value;
		        var _0 = BigInt(0), _1 = BigInt(1), _2 = BigInt(2);
		        if (b === _0) return Integer[1];
		        if (a === _0) return Integer[0];
		        if (a === _1) return Integer[1];
		        if (a === BigInt(-1)) return n.isEven() ? Integer[1] : Integer[-1];
		        if (n.isNegative()) return new NativeBigInt(_0);
		        var x = this;
		        var y = Integer[1];
		        while (true) {
		            if ((b & _1) === _1) {
		                y = y.times(x);
		                --b;
		            }
		            if (b === _0) break;
		            b /= _2;
		            x = x.square();
		        }
		        return y;
		    };

		    BigInteger.prototype.modPow = function (exp, mod) {
		        exp = parseValue(exp);
		        mod = parseValue(mod);
		        if (mod.isZero()) throw new Error("Cannot take modPow with modulus 0");
		        var r = Integer[1],
		            base = this.mod(mod);
		        if (exp.isNegative()) {
		            exp = exp.multiply(Integer[-1]);
		            base = base.modInv(mod);
		        }
		        while (exp.isPositive()) {
		            if (base.isZero()) return Integer[0];
		            if (exp.isOdd()) r = r.multiply(base).mod(mod);
		            exp = exp.divide(2);
		            base = base.square().mod(mod);
		        }
		        return r;
		    };
		    NativeBigInt.prototype.modPow = SmallInteger.prototype.modPow = BigInteger.prototype.modPow;

		    function compareAbs(a, b) {
		        if (a.length !== b.length) {
		            return a.length > b.length ? 1 : -1;
		        }
		        for (var i = a.length - 1; i >= 0; i--) {
		            if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
		        }
		        return 0;
		    }

		    BigInteger.prototype.compareAbs = function (v) {
		        var n = parseValue(v),
		            a = this.value,
		            b = n.value;
		        if (n.isSmall) return 1;
		        return compareAbs(a, b);
		    };
		    SmallInteger.prototype.compareAbs = function (v) {
		        var n = parseValue(v),
		            a = Math.abs(this.value),
		            b = n.value;
		        if (n.isSmall) {
		            b = Math.abs(b);
		            return a === b ? 0 : a > b ? 1 : -1;
		        }
		        return -1;
		    };
		    NativeBigInt.prototype.compareAbs = function (v) {
		        var a = this.value;
		        var b = parseValue(v).value;
		        a = a >= 0 ? a : -a;
		        b = b >= 0 ? b : -b;
		        return a === b ? 0 : a > b ? 1 : -1;
		    };

		    BigInteger.prototype.compare = function (v) {
		        // See discussion about comparison with Infinity:
		        // https://github.com/peterolson/BigInteger.js/issues/61
		        if (v === Infinity) {
		            return -1;
		        }
		        if (v === -Infinity) {
		            return 1;
		        }

		        var n = parseValue(v),
		            a = this.value,
		            b = n.value;
		        if (this.sign !== n.sign) {
		            return n.sign ? 1 : -1;
		        }
		        if (n.isSmall) {
		            return this.sign ? -1 : 1;
		        }
		        return compareAbs(a, b) * (this.sign ? -1 : 1);
		    };
		    BigInteger.prototype.compareTo = BigInteger.prototype.compare;

		    SmallInteger.prototype.compare = function (v) {
		        if (v === Infinity) {
		            return -1;
		        }
		        if (v === -Infinity) {
		            return 1;
		        }

		        var n = parseValue(v),
		            a = this.value,
		            b = n.value;
		        if (n.isSmall) {
		            return a == b ? 0 : a > b ? 1 : -1;
		        }
		        if (a < 0 !== n.sign) {
		            return a < 0 ? -1 : 1;
		        }
		        return a < 0 ? 1 : -1;
		    };
		    SmallInteger.prototype.compareTo = SmallInteger.prototype.compare;

		    NativeBigInt.prototype.compare = function (v) {
		        if (v === Infinity) {
		            return -1;
		        }
		        if (v === -Infinity) {
		            return 1;
		        }
		        var a = this.value;
		        var b = parseValue(v).value;
		        return a === b ? 0 : a > b ? 1 : -1;
		    };
		    NativeBigInt.prototype.compareTo = NativeBigInt.prototype.compare;

		    BigInteger.prototype.equals = function (v) {
		        return this.compare(v) === 0;
		    };
		    NativeBigInt.prototype.eq = NativeBigInt.prototype.equals = SmallInteger.prototype.eq = SmallInteger.prototype.equals = BigInteger.prototype.eq = BigInteger.prototype.equals;

		    BigInteger.prototype.notEquals = function (v) {
		        return this.compare(v) !== 0;
		    };
		    NativeBigInt.prototype.neq = NativeBigInt.prototype.notEquals = SmallInteger.prototype.neq = SmallInteger.prototype.notEquals = BigInteger.prototype.neq = BigInteger.prototype.notEquals;

		    BigInteger.prototype.greater = function (v) {
		        return this.compare(v) > 0;
		    };
		    NativeBigInt.prototype.gt = NativeBigInt.prototype.greater = SmallInteger.prototype.gt = SmallInteger.prototype.greater = BigInteger.prototype.gt = BigInteger.prototype.greater;

		    BigInteger.prototype.lesser = function (v) {
		        return this.compare(v) < 0;
		    };
		    NativeBigInt.prototype.lt = NativeBigInt.prototype.lesser = SmallInteger.prototype.lt = SmallInteger.prototype.lesser = BigInteger.prototype.lt = BigInteger.prototype.lesser;

		    BigInteger.prototype.greaterOrEquals = function (v) {
		        return this.compare(v) >= 0;
		    };
		    NativeBigInt.prototype.geq = NativeBigInt.prototype.greaterOrEquals = SmallInteger.prototype.geq = SmallInteger.prototype.greaterOrEquals = BigInteger.prototype.geq = BigInteger.prototype.greaterOrEquals;

		    BigInteger.prototype.lesserOrEquals = function (v) {
		        return this.compare(v) <= 0;
		    };
		    NativeBigInt.prototype.leq = NativeBigInt.prototype.lesserOrEquals = SmallInteger.prototype.leq = SmallInteger.prototype.lesserOrEquals = BigInteger.prototype.leq = BigInteger.prototype.lesserOrEquals;

		    BigInteger.prototype.isEven = function () {
		        return (this.value[0] & 1) === 0;
		    };
		    SmallInteger.prototype.isEven = function () {
		        return (this.value & 1) === 0;
		    };
		    NativeBigInt.prototype.isEven = function () {
		        return (this.value & BigInt(1)) === BigInt(0);
		    };

		    BigInteger.prototype.isOdd = function () {
		        return (this.value[0] & 1) === 1;
		    };
		    SmallInteger.prototype.isOdd = function () {
		        return (this.value & 1) === 1;
		    };
		    NativeBigInt.prototype.isOdd = function () {
		        return (this.value & BigInt(1)) === BigInt(1);
		    };

		    BigInteger.prototype.isPositive = function () {
		        return !this.sign;
		    };
		    SmallInteger.prototype.isPositive = function () {
		        return this.value > 0;
		    };
		    NativeBigInt.prototype.isPositive = SmallInteger.prototype.isPositive;

		    BigInteger.prototype.isNegative = function () {
		        return this.sign;
		    };
		    SmallInteger.prototype.isNegative = function () {
		        return this.value < 0;
		    };
		    NativeBigInt.prototype.isNegative = SmallInteger.prototype.isNegative;

		    BigInteger.prototype.isUnit = function () {
		        return false;
		    };
		    SmallInteger.prototype.isUnit = function () {
		        return Math.abs(this.value) === 1;
		    };
		    NativeBigInt.prototype.isUnit = function () {
		        return this.abs().value === BigInt(1);
		    };

		    BigInteger.prototype.isZero = function () {
		        return false;
		    };
		    SmallInteger.prototype.isZero = function () {
		        return this.value === 0;
		    };
		    NativeBigInt.prototype.isZero = function () {
		        return this.value === BigInt(0);
		    };

		    BigInteger.prototype.isDivisibleBy = function (v) {
		        var n = parseValue(v);
		        if (n.isZero()) return false;
		        if (n.isUnit()) return true;
		        if (n.compareAbs(2) === 0) return this.isEven();
		        return this.mod(n).isZero();
		    };
		    NativeBigInt.prototype.isDivisibleBy = SmallInteger.prototype.isDivisibleBy = BigInteger.prototype.isDivisibleBy;

		    function isBasicPrime(v) {
		        var n = v.abs();
		        if (n.isUnit()) return false;
		        if (n.equals(2) || n.equals(3) || n.equals(5)) return true;
		        if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5)) return false;
		        if (n.lesser(49)) return true;
		        // we don't know if it's prime: let the other functions figure it out
		    }

		    function millerRabinTest(n, a) {
		        var nPrev = n.prev(),
		            b = nPrev,
		            r = 0,
		            d, i, x;
		        while (b.isEven()) b = b.divide(2), r++;
		        next: for (i = 0; i < a.length; i++) {
		            if (n.lesser(a[i])) continue;
		            x = bigInt(a[i]).modPow(b, n);
		            if (x.isUnit() || x.equals(nPrev)) continue;
		            for (d = r - 1; d != 0; d--) {
		                x = x.square().mod(n);
		                if (x.isUnit()) return false;
		                if (x.equals(nPrev)) continue next;
		            }
		            return false;
		        }
		        return true;
		    }

		    // Set "strict" to true to force GRH-supported lower bound of 2*log(N)^2
		    BigInteger.prototype.isPrime = function (strict) {
		        var isPrime = isBasicPrime(this);
		        if (isPrime !== undefined$1) return isPrime;
		        var n = this.abs();
		        var bits = n.bitLength();
		        if (bits <= 64)
		            return millerRabinTest(n, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]);
		        var logN = Math.log(2) * bits.toJSNumber();
		        var t = Math.ceil((strict === true) ? (2 * Math.pow(logN, 2)) : logN);
		        for (var a = [], i = 0; i < t; i++) {
		            a.push(bigInt(i + 2));
		        }
		        return millerRabinTest(n, a);
		    };
		    NativeBigInt.prototype.isPrime = SmallInteger.prototype.isPrime = BigInteger.prototype.isPrime;

		    BigInteger.prototype.isProbablePrime = function (iterations, rng) {
		        var isPrime = isBasicPrime(this);
		        if (isPrime !== undefined$1) return isPrime;
		        var n = this.abs();
		        var t = iterations === undefined$1 ? 5 : iterations;
		        for (var a = [], i = 0; i < t; i++) {
		            a.push(bigInt.randBetween(2, n.minus(2), rng));
		        }
		        return millerRabinTest(n, a);
		    };
		    NativeBigInt.prototype.isProbablePrime = SmallInteger.prototype.isProbablePrime = BigInteger.prototype.isProbablePrime;

		    BigInteger.prototype.modInv = function (n) {
		        var t = bigInt.zero, newT = bigInt.one, r = parseValue(n), newR = this.abs(), q, lastT, lastR;
		        while (!newR.isZero()) {
		            q = r.divide(newR);
		            lastT = t;
		            lastR = r;
		            t = newT;
		            r = newR;
		            newT = lastT.subtract(q.multiply(newT));
		            newR = lastR.subtract(q.multiply(newR));
		        }
		        if (!r.isUnit()) throw new Error(this.toString() + " and " + n.toString() + " are not co-prime");
		        if (t.compare(0) === -1) {
		            t = t.add(n);
		        }
		        if (this.isNegative()) {
		            return t.negate();
		        }
		        return t;
		    };

		    NativeBigInt.prototype.modInv = SmallInteger.prototype.modInv = BigInteger.prototype.modInv;

		    BigInteger.prototype.next = function () {
		        var value = this.value;
		        if (this.sign) {
		            return subtractSmall(value, 1, this.sign);
		        }
		        return new BigInteger(addSmall(value, 1), this.sign);
		    };
		    SmallInteger.prototype.next = function () {
		        var value = this.value;
		        if (value + 1 < MAX_INT) return new SmallInteger(value + 1);
		        return new BigInteger(MAX_INT_ARR, false);
		    };
		    NativeBigInt.prototype.next = function () {
		        return new NativeBigInt(this.value + BigInt(1));
		    };

		    BigInteger.prototype.prev = function () {
		        var value = this.value;
		        if (this.sign) {
		            return new BigInteger(addSmall(value, 1), true);
		        }
		        return subtractSmall(value, 1, this.sign);
		    };
		    SmallInteger.prototype.prev = function () {
		        var value = this.value;
		        if (value - 1 > -MAX_INT) return new SmallInteger(value - 1);
		        return new BigInteger(MAX_INT_ARR, true);
		    };
		    NativeBigInt.prototype.prev = function () {
		        return new NativeBigInt(this.value - BigInt(1));
		    };

		    var powersOfTwo = [1];
		    while (2 * powersOfTwo[powersOfTwo.length - 1] <= BASE) powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);
		    var powers2Length = powersOfTwo.length, highestPower2 = powersOfTwo[powers2Length - 1];

		    function shift_isSmall(n) {
		        return Math.abs(n) <= BASE;
		    }

		    BigInteger.prototype.shiftLeft = function (v) {
		        var n = parseValue(v).toJSNumber();
		        if (!shift_isSmall(n)) {
		            throw new Error(String(n) + " is too large for shifting.");
		        }
		        if (n < 0) return this.shiftRight(-n);
		        var result = this;
		        if (result.isZero()) return result;
		        while (n >= powers2Length) {
		            result = result.multiply(highestPower2);
		            n -= powers2Length - 1;
		        }
		        return result.multiply(powersOfTwo[n]);
		    };
		    NativeBigInt.prototype.shiftLeft = SmallInteger.prototype.shiftLeft = BigInteger.prototype.shiftLeft;

		    BigInteger.prototype.shiftRight = function (v) {
		        var remQuo;
		        var n = parseValue(v).toJSNumber();
		        if (!shift_isSmall(n)) {
		            throw new Error(String(n) + " is too large for shifting.");
		        }
		        if (n < 0) return this.shiftLeft(-n);
		        var result = this;
		        while (n >= powers2Length) {
		            if (result.isZero() || (result.isNegative() && result.isUnit())) return result;
		            remQuo = divModAny(result, highestPower2);
		            result = remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
		            n -= powers2Length - 1;
		        }
		        remQuo = divModAny(result, powersOfTwo[n]);
		        return remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
		    };
		    NativeBigInt.prototype.shiftRight = SmallInteger.prototype.shiftRight = BigInteger.prototype.shiftRight;

		    function bitwise(x, y, fn) {
		        y = parseValue(y);
		        var xSign = x.isNegative(), ySign = y.isNegative();
		        var xRem = xSign ? x.not() : x,
		            yRem = ySign ? y.not() : y;
		        var xDigit = 0, yDigit = 0;
		        var xDivMod = null, yDivMod = null;
		        var result = [];
		        while (!xRem.isZero() || !yRem.isZero()) {
		            xDivMod = divModAny(xRem, highestPower2);
		            xDigit = xDivMod[1].toJSNumber();
		            if (xSign) {
		                xDigit = highestPower2 - 1 - xDigit; // two's complement for negative numbers
		            }

		            yDivMod = divModAny(yRem, highestPower2);
		            yDigit = yDivMod[1].toJSNumber();
		            if (ySign) {
		                yDigit = highestPower2 - 1 - yDigit; // two's complement for negative numbers
		            }

		            xRem = xDivMod[0];
		            yRem = yDivMod[0];
		            result.push(fn(xDigit, yDigit));
		        }
		        var sum = fn(xSign ? 1 : 0, ySign ? 1 : 0) !== 0 ? bigInt(-1) : bigInt(0);
		        for (var i = result.length - 1; i >= 0; i -= 1) {
		            sum = sum.multiply(highestPower2).add(bigInt(result[i]));
		        }
		        return sum;
		    }

		    BigInteger.prototype.not = function () {
		        return this.negate().prev();
		    };
		    NativeBigInt.prototype.not = SmallInteger.prototype.not = BigInteger.prototype.not;

		    BigInteger.prototype.and = function (n) {
		        return bitwise(this, n, function (a, b) { return a & b; });
		    };
		    NativeBigInt.prototype.and = SmallInteger.prototype.and = BigInteger.prototype.and;

		    BigInteger.prototype.or = function (n) {
		        return bitwise(this, n, function (a, b) { return a | b; });
		    };
		    NativeBigInt.prototype.or = SmallInteger.prototype.or = BigInteger.prototype.or;

		    BigInteger.prototype.xor = function (n) {
		        return bitwise(this, n, function (a, b) { return a ^ b; });
		    };
		    NativeBigInt.prototype.xor = SmallInteger.prototype.xor = BigInteger.prototype.xor;

		    var LOBMASK_I = 1 << 30, LOBMASK_BI = (BASE & -BASE) * (BASE & -BASE) | LOBMASK_I;
		    function roughLOB(n) { // get lowestOneBit (rough)
		        // SmallInteger: return Min(lowestOneBit(n), 1 << 30)
		        // BigInteger: return Min(lowestOneBit(n), 1 << 14) [BASE=1e7]
		        var v = n.value,
		            x = typeof v === "number" ? v | LOBMASK_I :
		                typeof v === "bigint" ? v | BigInt(LOBMASK_I) :
		                    v[0] + v[1] * BASE | LOBMASK_BI;
		        return x & -x;
		    }

		    function integerLogarithm(value, base) {
		        if (base.compareTo(value) <= 0) {
		            var tmp = integerLogarithm(value, base.square(base));
		            var p = tmp.p;
		            var e = tmp.e;
		            var t = p.multiply(base);
		            return t.compareTo(value) <= 0 ? { p: t, e: e * 2 + 1 } : { p: p, e: e * 2 };
		        }
		        return { p: bigInt(1), e: 0 };
		    }

		    BigInteger.prototype.bitLength = function () {
		        var n = this;
		        if (n.compareTo(bigInt(0)) < 0) {
		            n = n.negate().subtract(bigInt(1));
		        }
		        if (n.compareTo(bigInt(0)) === 0) {
		            return bigInt(0);
		        }
		        return bigInt(integerLogarithm(n, bigInt(2)).e).add(bigInt(1));
		    };
		    NativeBigInt.prototype.bitLength = SmallInteger.prototype.bitLength = BigInteger.prototype.bitLength;

		    function max(a, b) {
		        a = parseValue(a);
		        b = parseValue(b);
		        return a.greater(b) ? a : b;
		    }
		    function min(a, b) {
		        a = parseValue(a);
		        b = parseValue(b);
		        return a.lesser(b) ? a : b;
		    }
		    function gcd(a, b) {
		        a = parseValue(a).abs();
		        b = parseValue(b).abs();
		        if (a.equals(b)) return a;
		        if (a.isZero()) return b;
		        if (b.isZero()) return a;
		        var c = Integer[1], d, t;
		        while (a.isEven() && b.isEven()) {
		            d = min(roughLOB(a), roughLOB(b));
		            a = a.divide(d);
		            b = b.divide(d);
		            c = c.multiply(d);
		        }
		        while (a.isEven()) {
		            a = a.divide(roughLOB(a));
		        }
		        do {
		            while (b.isEven()) {
		                b = b.divide(roughLOB(b));
		            }
		            if (a.greater(b)) {
		                t = b; b = a; a = t;
		            }
		            b = b.subtract(a);
		        } while (!b.isZero());
		        return c.isUnit() ? a : a.multiply(c);
		    }
		    function lcm(a, b) {
		        a = parseValue(a).abs();
		        b = parseValue(b).abs();
		        return a.divide(gcd(a, b)).multiply(b);
		    }
		    function randBetween(a, b, rng) {
		        a = parseValue(a);
		        b = parseValue(b);
		        var usedRNG = rng || Math.random;
		        var low = min(a, b), high = max(a, b);
		        var range = high.subtract(low).add(1);
		        if (range.isSmall) return low.add(Math.floor(usedRNG() * range));
		        var digits = toBase(range, BASE).value;
		        var result = [], restricted = true;
		        for (var i = 0; i < digits.length; i++) {
		            var top = restricted ? digits[i] + (i + 1 < digits.length ? digits[i + 1] / BASE : 0) : BASE;
		            var digit = truncate(usedRNG() * top);
		            result.push(digit);
		            if (digit < digits[i]) restricted = false;
		        }
		        return low.add(Integer.fromArray(result, BASE, false));
		    }

		    var parseBase = function (text, base, alphabet, caseSensitive) {
		        alphabet = alphabet || DEFAULT_ALPHABET;
		        text = String(text);
		        if (!caseSensitive) {
		            text = text.toLowerCase();
		            alphabet = alphabet.toLowerCase();
		        }
		        var length = text.length;
		        var i;
		        var absBase = Math.abs(base);
		        var alphabetValues = {};
		        for (i = 0; i < alphabet.length; i++) {
		            alphabetValues[alphabet[i]] = i;
		        }
		        for (i = 0; i < length; i++) {
		            var c = text[i];
		            if (c === "-") continue;
		            if (c in alphabetValues) {
		                if (alphabetValues[c] >= absBase) {
		                    if (c === "1" && absBase === 1) continue;
		                    throw new Error(c + " is not a valid digit in base " + base + ".");
		                }
		            }
		        }
		        base = parseValue(base);
		        var digits = [];
		        var isNegative = text[0] === "-";
		        for (i = isNegative ? 1 : 0; i < text.length; i++) {
		            var c = text[i];
		            if (c in alphabetValues) digits.push(parseValue(alphabetValues[c]));
		            else if (c === "<") {
		                var start = i;
		                do { i++; } while (text[i] !== ">" && i < text.length);
		                digits.push(parseValue(text.slice(start + 1, i)));
		            }
		            else throw new Error(c + " is not a valid character");
		        }
		        return parseBaseFromArray(digits, base, isNegative);
		    };

		    function parseBaseFromArray(digits, base, isNegative) {
		        var val = Integer[0], pow = Integer[1], i;
		        for (i = digits.length - 1; i >= 0; i--) {
		            val = val.add(digits[i].times(pow));
		            pow = pow.times(base);
		        }
		        return isNegative ? val.negate() : val;
		    }

		    function stringify(digit, alphabet) {
		        alphabet = alphabet || DEFAULT_ALPHABET;
		        if (digit < alphabet.length) {
		            return alphabet[digit];
		        }
		        return "<" + digit + ">";
		    }

		    function toBase(n, base) {
		        base = bigInt(base);
		        if (base.isZero()) {
		            if (n.isZero()) return { value: [0], isNegative: false };
		            throw new Error("Cannot convert nonzero numbers to base 0.");
		        }
		        if (base.equals(-1)) {
		            if (n.isZero()) return { value: [0], isNegative: false };
		            if (n.isNegative())
		                return {
		                    value: [].concat.apply([], Array.apply(null, Array(-n.toJSNumber()))
		                        .map(Array.prototype.valueOf, [1, 0])
		                    ),
		                    isNegative: false
		                };

		            var arr = Array.apply(null, Array(n.toJSNumber() - 1))
		                .map(Array.prototype.valueOf, [0, 1]);
		            arr.unshift([1]);
		            return {
		                value: [].concat.apply([], arr),
		                isNegative: false
		            };
		        }

		        var neg = false;
		        if (n.isNegative() && base.isPositive()) {
		            neg = true;
		            n = n.abs();
		        }
		        if (base.isUnit()) {
		            if (n.isZero()) return { value: [0], isNegative: false };

		            return {
		                value: Array.apply(null, Array(n.toJSNumber()))
		                    .map(Number.prototype.valueOf, 1),
		                isNegative: neg
		            };
		        }
		        var out = [];
		        var left = n, divmod;
		        while (left.isNegative() || left.compareAbs(base) >= 0) {
		            divmod = left.divmod(base);
		            left = divmod.quotient;
		            var digit = divmod.remainder;
		            if (digit.isNegative()) {
		                digit = base.minus(digit).abs();
		                left = left.next();
		            }
		            out.push(digit.toJSNumber());
		        }
		        out.push(left.toJSNumber());
		        return { value: out.reverse(), isNegative: neg };
		    }

		    function toBaseString(n, base, alphabet) {
		        var arr = toBase(n, base);
		        return (arr.isNegative ? "-" : "") + arr.value.map(function (x) {
		            return stringify(x, alphabet);
		        }).join('');
		    }

		    BigInteger.prototype.toArray = function (radix) {
		        return toBase(this, radix);
		    };

		    SmallInteger.prototype.toArray = function (radix) {
		        return toBase(this, radix);
		    };

		    NativeBigInt.prototype.toArray = function (radix) {
		        return toBase(this, radix);
		    };

		    BigInteger.prototype.toString = function (radix, alphabet) {
		        if (radix === undefined$1) radix = 10;
		        if (radix !== 10 || alphabet) return toBaseString(this, radix, alphabet);
		        var v = this.value, l = v.length, str = String(v[--l]), zeros = "0000000", digit;
		        while (--l >= 0) {
		            digit = String(v[l]);
		            str += zeros.slice(digit.length) + digit;
		        }
		        var sign = this.sign ? "-" : "";
		        return sign + str;
		    };

		    SmallInteger.prototype.toString = function (radix, alphabet) {
		        if (radix === undefined$1) radix = 10;
		        if (radix != 10 || alphabet) return toBaseString(this, radix, alphabet);
		        return String(this.value);
		    };

		    NativeBigInt.prototype.toString = SmallInteger.prototype.toString;

		    NativeBigInt.prototype.toJSON = BigInteger.prototype.toJSON = SmallInteger.prototype.toJSON = function () { return this.toString(); };

		    BigInteger.prototype.valueOf = function () {
		        return parseInt(this.toString(), 10);
		    };
		    BigInteger.prototype.toJSNumber = BigInteger.prototype.valueOf;

		    SmallInteger.prototype.valueOf = function () {
		        return this.value;
		    };
		    SmallInteger.prototype.toJSNumber = SmallInteger.prototype.valueOf;
		    NativeBigInt.prototype.valueOf = NativeBigInt.prototype.toJSNumber = function () {
		        return parseInt(this.toString(), 10);
		    };

		    function parseStringValue(v) {
		        if (isPrecise(+v)) {
		            var x = +v;
		            if (x === truncate(x))
		                return supportsNativeBigInt ? new NativeBigInt(BigInt(x)) : new SmallInteger(x);
		            throw new Error("Invalid integer: " + v);
		        }
		        var sign = v[0] === "-";
		        if (sign) v = v.slice(1);
		        var split = v.split(/e/i);
		        if (split.length > 2) throw new Error("Invalid integer: " + split.join("e"));
		        if (split.length === 2) {
		            var exp = split[1];
		            if (exp[0] === "+") exp = exp.slice(1);
		            exp = +exp;
		            if (exp !== truncate(exp) || !isPrecise(exp)) throw new Error("Invalid integer: " + exp + " is not a valid exponent.");
		            var text = split[0];
		            var decimalPlace = text.indexOf(".");
		            if (decimalPlace >= 0) {
		                exp -= text.length - decimalPlace - 1;
		                text = text.slice(0, decimalPlace) + text.slice(decimalPlace + 1);
		            }
		            if (exp < 0) throw new Error("Cannot include negative exponent part for integers");
		            text += (new Array(exp + 1)).join("0");
		            v = text;
		        }
		        var isValid = /^([0-9][0-9]*)$/.test(v);
		        if (!isValid) throw new Error("Invalid integer: " + v);
		        if (supportsNativeBigInt) {
		            return new NativeBigInt(BigInt(sign ? "-" + v : v));
		        }
		        var r = [], max = v.length, l = LOG_BASE, min = max - l;
		        while (max > 0) {
		            r.push(+v.slice(min, max));
		            min -= l;
		            if (min < 0) min = 0;
		            max -= l;
		        }
		        trim(r);
		        return new BigInteger(r, sign);
		    }

		    function parseNumberValue(v) {
		        if (supportsNativeBigInt) {
		            return new NativeBigInt(BigInt(v));
		        }
		        if (isPrecise(v)) {
		            if (v !== truncate(v)) throw new Error(v + " is not an integer.");
		            return new SmallInteger(v);
		        }
		        return parseStringValue(v.toString());
		    }

		    function parseValue(v) {
		        if (typeof v === "number") {
		            return parseNumberValue(v);
		        }
		        if (typeof v === "string") {
		            return parseStringValue(v);
		        }
		        if (typeof v === "bigint") {
		            return new NativeBigInt(v);
		        }
		        return v;
		    }
		    // Pre-define numbers in range [-999,999]
		    for (var i = 0; i < 1000; i++) {
		        Integer[i] = parseValue(i);
		        if (i > 0) Integer[-i] = parseValue(-i);
		    }
		    // Backwards compatibility
		    Integer.one = Integer[1];
		    Integer.zero = Integer[0];
		    Integer.minusOne = Integer[-1];
		    Integer.max = max;
		    Integer.min = min;
		    Integer.gcd = gcd;
		    Integer.lcm = lcm;
		    Integer.isInstance = function (x) { return x instanceof BigInteger || x instanceof SmallInteger || x instanceof NativeBigInt; };
		    Integer.randBetween = randBetween;

		    Integer.fromArray = function (digits, base, isNegative) {
		        return parseBaseFromArray(digits.map(parseValue), parseValue(base || 10), isNegative);
		    };

		    return Integer;
		})();

		// Node.js check
		if (module.hasOwnProperty("exports")) {
		    module.exports = bigInt;
		}
	} (BigInteger));

	var BigIntegerExports = BigInteger.exports;
	var bigInt = /*@__PURE__*/getDefaultExportFromCjs(BigIntegerExports);

	var forEach$1 = function forEach(array, callback) {
		for (var i = 0; i < array.length; i += 1) {
			callback(array[i], i, array); // eslint-disable-line callback-return
		}
	};

	var every$1 = function every(array, predicate) {
		for (var i = 0; i < array.length; i += 1) {
			if (!predicate(array[i], i, array)) {
				return false;
			}
		}
		return true;
	};

	var some$1 = function some(array, predicate) {
		for (var i = 0; i < array.length; i += 1) {
			if (predicate(array[i], i, array)) {
				return true;
			}
		}
		return false;
	};

	var isArguments;
	var hasRequiredIsArguments;

	function requireIsArguments () {
		if (hasRequiredIsArguments) return isArguments;
		hasRequiredIsArguments = 1;

		var toStr = Object.prototype.toString;

		isArguments = function isArguments(value) {
			var str = toStr.call(value);
			var isArgs = str === '[object Arguments]';
			if (!isArgs) {
				isArgs = str !== '[object Array]' &&
					value !== null &&
					typeof value === 'object' &&
					typeof value.length === 'number' &&
					value.length >= 0 &&
					toStr.call(value.callee) === '[object Function]';
			}
			return isArgs;
		};
		return isArguments;
	}

	var implementation$1;
	var hasRequiredImplementation$1;

	function requireImplementation$1 () {
		if (hasRequiredImplementation$1) return implementation$1;
		hasRequiredImplementation$1 = 1;

		var keysShim;
		if (!Object.keys) {
			// modified from https://github.com/es-shims/es5-shim
			var has = Object.prototype.hasOwnProperty;
			var toStr = Object.prototype.toString;
			var isArgs = requireIsArguments(); // eslint-disable-line global-require
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
				var isFunction = toStr.call(object) === '[object Function]';
				var isArguments = isArgs(object);
				var isString = isObject && toStr.call(object) === '[object String]';
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
		implementation$1 = keysShim;
		return implementation$1;
	}

	var objectKeys;
	var hasRequiredObjectKeys;

	function requireObjectKeys () {
		if (hasRequiredObjectKeys) return objectKeys;
		hasRequiredObjectKeys = 1;

		var slice = Array.prototype.slice;
		var isArgs = requireIsArguments();

		var origKeys = Object.keys;
		var keysShim = origKeys ? function keys(o) { return origKeys(o); } : requireImplementation$1();

		var originalKeys = Object.keys;

		keysShim.shim = function shimObjectKeys() {
			if (Object.keys) {
				var keysWorksWithArguments = (function () {
					// Safari 5.0 bug
					var args = Object.keys(arguments);
					return args && args.length === arguments.length;
				}(1, 2));
				if (!keysWorksWithArguments) {
					Object.keys = function keys(object) { // eslint-disable-line func-name-matching
						if (isArgs(object)) {
							return originalKeys(slice.call(object));
						}
						return originalKeys(object);
					};
				}
			} else {
				Object.keys = keysShim;
			}
			return Object.keys || keysShim;
		};

		objectKeys = keysShim;
		return objectKeys;
	}

	var GetIntrinsic$5 = getIntrinsic;

	var callBind = callBindExports;
	var callBound$1 = callBound$3;

	var $ownKeys = GetIntrinsic$5('%Reflect.ownKeys%', true);
	var $pushApply = callBind.apply(GetIntrinsic$5('%Array.prototype.push%'));
	var $SymbolValueOf = callBound$1('Symbol.prototype.valueOf', true);
	var $gOPN = GetIntrinsic$5('%Object.getOwnPropertyNames%', true);
	var $gOPS = $SymbolValueOf ? GetIntrinsic$5('%Object.getOwnPropertySymbols%') : null;

	var keys = requireObjectKeys();

	var OwnPropertyKeys$1 = $ownKeys || function OwnPropertyKeys(source) {
		var ownKeys = ($gOPN || keys)(source);
		if ($gOPS) {
			$pushApply(ownKeys, $gOPS(source));
		}
		return ownKeys;
	};

	// https://262.ecma-international.org/6.0/#sec-ispropertykey

	var IsPropertyKey$2 = function IsPropertyKey(argument) {
		return typeof argument === 'string' || typeof argument === 'symbol';
	};

	var propertyDescriptor;
	var hasRequiredPropertyDescriptor;

	function requirePropertyDescriptor () {
		if (hasRequiredPropertyDescriptor) return propertyDescriptor;
		hasRequiredPropertyDescriptor = 1;

		var $TypeError = type;

		var hasOwn = hasown;

		var allowed = {
			__proto__: null,
			'[[Configurable]]': true,
			'[[Enumerable]]': true,
			'[[Get]]': true,
			'[[Set]]': true,
			'[[Value]]': true,
			'[[Writable]]': true
		};

		// https://262.ecma-international.org/6.0/#sec-property-descriptor-specification-type

		propertyDescriptor = function isPropertyDescriptor(Desc) {
			if (!Desc || typeof Desc !== 'object') {
				return false;
			}

			for (var key in Desc) { // eslint-disable-line
				if (hasOwn(Desc, key) && !allowed[key]) {
					return false;
				}
			}

			var isData = hasOwn(Desc, '[[Value]]') || hasOwn(Desc, '[[Writable]]');
			var IsAccessor = hasOwn(Desc, '[[Get]]') || hasOwn(Desc, '[[Set]]');
			if (isData && IsAccessor) {
				throw new $TypeError('Property Descriptors may not be both accessor and data descriptors');
			}
			return true;
		};
		return propertyDescriptor;
	}

	var IsAccessorDescriptor;
	var hasRequiredIsAccessorDescriptor;

	function requireIsAccessorDescriptor () {
		if (hasRequiredIsAccessorDescriptor) return IsAccessorDescriptor;
		hasRequiredIsAccessorDescriptor = 1;

		var $TypeError = type;

		var hasOwn = hasown;

		var isPropertyDescriptor = requirePropertyDescriptor();

		// https://262.ecma-international.org/5.1/#sec-8.10.1

		IsAccessorDescriptor = function IsAccessorDescriptor(Desc) {
			if (typeof Desc === 'undefined') {
				return false;
			}

			if (!isPropertyDescriptor(Desc)) {
				throw new $TypeError('Assertion failed: `Desc` must be a Property Descriptor');
			}

			if (!hasOwn(Desc, '[[Get]]') && !hasOwn(Desc, '[[Set]]')) {
				return false;
			}

			return true;
		};
		return IsAccessorDescriptor;
	}

	var isPrimitive$4;
	var hasRequiredIsPrimitive;

	function requireIsPrimitive () {
		if (hasRequiredIsPrimitive) return isPrimitive$4;
		hasRequiredIsPrimitive = 1;

		isPrimitive$4 = function isPrimitive(value) {
			return value === null || (typeof value !== 'function' && typeof value !== 'object');
		};
		return isPrimitive$4;
	}

	var IsExtensible;
	var hasRequiredIsExtensible;

	function requireIsExtensible () {
		if (hasRequiredIsExtensible) return IsExtensible;
		hasRequiredIsExtensible = 1;

		var GetIntrinsic = getIntrinsic;

		var $preventExtensions = GetIntrinsic('%Object.preventExtensions%', true);
		var $isExtensible = GetIntrinsic('%Object.isExtensible%', true);

		var isPrimitive = requireIsPrimitive();

		// https://262.ecma-international.org/6.0/#sec-isextensible-o

		IsExtensible = $preventExtensions
			? function IsExtensible(obj) {
				return !isPrimitive(obj) && $isExtensible(obj);
			}
			: function IsExtensible(obj) {
				return !isPrimitive(obj);
			};
		return IsExtensible;
	}

	var ToBoolean;
	var hasRequiredToBoolean;

	function requireToBoolean () {
		if (hasRequiredToBoolean) return ToBoolean;
		hasRequiredToBoolean = 1;

		// http://262.ecma-international.org/5.1/#sec-9.2

		ToBoolean = function ToBoolean(value) { return !!value; };
		return ToBoolean;
	}

	var fnToStr = Function.prototype.toString;
	var reflectApply = typeof Reflect === 'object' && Reflect !== null && Reflect.apply;
	var badArrayLike;
	var isCallableMarker;
	if (typeof reflectApply === 'function' && typeof Object.defineProperty === 'function') {
		try {
			badArrayLike = Object.defineProperty({}, 'length', {
				get: function () {
					throw isCallableMarker;
				}
			});
			isCallableMarker = {};
			// eslint-disable-next-line no-throw-literal
			reflectApply(function () { throw 42; }, null, badArrayLike);
		} catch (_) {
			if (_ !== isCallableMarker) {
				reflectApply = null;
			}
		}
	} else {
		reflectApply = null;
	}

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
	var toStr$3 = Object.prototype.toString;
	var objectClass = '[object Object]';
	var fnClass = '[object Function]';
	var genClass = '[object GeneratorFunction]';
	var ddaClass = '[object HTMLAllCollection]'; // IE 11
	var ddaClass2 = '[object HTML document.all class]';
	var ddaClass3 = '[object HTMLCollection]'; // IE 9-10
	var hasToStringTag$1 = typeof Symbol === 'function' && !!Symbol.toStringTag; // better: use `has-tostringtag`

	var isIE68 = !(0 in [,]); // eslint-disable-line no-sparse-arrays, comma-spacing

	var isDDA = function isDocumentDotAll() { return false; };
	if (typeof document === 'object') {
		// Firefox 3 canonicalizes DDA to undefined when it's not accessed directly
		var all = document.all;
		if (toStr$3.call(all) === toStr$3.call(document.all)) {
			isDDA = function isDocumentDotAll(value) {
				/* globals document: false */
				// in IE 6-8, typeof document.all is "object" and it's truthy
				if ((isIE68 || !value) && (typeof value === 'undefined' || typeof value === 'object')) {
					try {
						var str = toStr$3.call(value);
						return (
							str === ddaClass
							|| str === ddaClass2
							|| str === ddaClass3 // opera 12.16
							|| str === objectClass // IE 6-8
						) && value('') == null; // eslint-disable-line eqeqeq
					} catch (e) { /**/ }
				}
				return false;
			};
		}
	}

	var isCallable$1 = reflectApply
		? function isCallable(value) {
			if (isDDA(value)) { return true; }
			if (!value) { return false; }
			if (typeof value !== 'function' && typeof value !== 'object') { return false; }
			try {
				reflectApply(value, null, badArrayLike);
			} catch (e) {
				if (e !== isCallableMarker) { return false; }
			}
			return !isES6ClassFn(value) && tryFunctionObject(value);
		}
		: function isCallable(value) {
			if (isDDA(value)) { return true; }
			if (!value) { return false; }
			if (typeof value !== 'function' && typeof value !== 'object') { return false; }
			if (hasToStringTag$1) { return tryFunctionObject(value); }
			if (isES6ClassFn(value)) { return false; }
			var strClass = toStr$3.call(value);
			if (strClass !== fnClass && strClass !== genClass && !(/^\[object HTML/).test(strClass)) { return false; }
			return tryFunctionObject(value);
		};

	// http://262.ecma-international.org/5.1/#sec-9.11

	var IsCallable = isCallable$1;

	var ToPropertyDescriptor;
	var hasRequiredToPropertyDescriptor;

	function requireToPropertyDescriptor () {
		if (hasRequiredToPropertyDescriptor) return ToPropertyDescriptor;
		hasRequiredToPropertyDescriptor = 1;

		var hasOwn = hasown;

		var $TypeError = type;

		var Type = Type$2;
		var ToBoolean = requireToBoolean();
		var IsCallable$1 = IsCallable;

		// https://262.ecma-international.org/5.1/#sec-8.10.5

		ToPropertyDescriptor = function ToPropertyDescriptor(Obj) {
			if (Type(Obj) !== 'Object') {
				throw new $TypeError('ToPropertyDescriptor requires an object');
			}

			var desc = {};
			if (hasOwn(Obj, 'enumerable')) {
				desc['[[Enumerable]]'] = ToBoolean(Obj.enumerable);
			}
			if (hasOwn(Obj, 'configurable')) {
				desc['[[Configurable]]'] = ToBoolean(Obj.configurable);
			}
			if (hasOwn(Obj, 'value')) {
				desc['[[Value]]'] = Obj.value;
			}
			if (hasOwn(Obj, 'writable')) {
				desc['[[Writable]]'] = ToBoolean(Obj.writable);
			}
			if (hasOwn(Obj, 'get')) {
				var getter = Obj.get;
				if (typeof getter !== 'undefined' && !IsCallable$1(getter)) {
					throw new $TypeError('getter must be a function');
				}
				desc['[[Get]]'] = getter;
			}
			if (hasOwn(Obj, 'set')) {
				var setter = Obj.set;
				if (typeof setter !== 'undefined' && !IsCallable$1(setter)) {
					throw new $TypeError('setter must be a function');
				}
				desc['[[Set]]'] = setter;
			}

			if ((hasOwn(desc, '[[Get]]') || hasOwn(desc, '[[Set]]')) && (hasOwn(desc, '[[Value]]') || hasOwn(desc, '[[Writable]]'))) {
				throw new $TypeError('Invalid property descriptor. Cannot both specify accessors and a value or writable attribute');
			}
			return desc;
		};
		return ToPropertyDescriptor;
	}

	var _isNaN = Number.isNaN || function isNaN(a) {
		return a !== a;
	};

	var SameValue$1;
	var hasRequiredSameValue;

	function requireSameValue () {
		if (hasRequiredSameValue) return SameValue$1;
		hasRequiredSameValue = 1;

		var $isNaN = _isNaN;

		// http://262.ecma-international.org/5.1/#sec-9.12

		SameValue$1 = function SameValue(x, y) {
			if (x === y) { // 0 === -0, but they are not identical.
				if (x === 0) { return 1 / x === 1 / y; }
				return true;
			}
			return $isNaN(x) && $isNaN(y);
		};
		return SameValue$1;
	}

	var DefineOwnProperty;
	var hasRequiredDefineOwnProperty;

	function requireDefineOwnProperty () {
		if (hasRequiredDefineOwnProperty) return DefineOwnProperty;
		hasRequiredDefineOwnProperty = 1;

		var hasPropertyDescriptors = hasPropertyDescriptors_1;

		var $defineProperty = requireEsDefineProperty();

		var hasArrayLengthDefineBug = hasPropertyDescriptors.hasArrayLengthDefineBug();

		// eslint-disable-next-line global-require
		var isArray = hasArrayLengthDefineBug && IsArray$3;

		var callBound = callBound$3;

		var $isEnumerable = callBound('Object.prototype.propertyIsEnumerable');

		// eslint-disable-next-line max-params
		DefineOwnProperty = function DefineOwnProperty(IsDataDescriptor, SameValue, FromPropertyDescriptor, O, P, desc) {
			if (!$defineProperty) {
				if (!IsDataDescriptor(desc)) {
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
				// eslint-disable-next-line no-param-reassign
				O[P] = V; // will use [[Define]]
				return SameValue(O[P], V);
			}
			if (
				hasArrayLengthDefineBug
				&& P === 'length'
				&& '[[Value]]' in desc
				&& isArray(O)
				&& O.length !== desc['[[Value]]']
			) {
				// eslint-disable-next-line no-param-reassign
				O.length = desc['[[Value]]'];
				return O.length === desc['[[Value]]'];
			}

			$defineProperty(O, P, FromPropertyDescriptor(desc));
			return true;
		};
		return DefineOwnProperty;
	}

	var isFullyPopulatedPropertyDescriptor;
	var hasRequiredIsFullyPopulatedPropertyDescriptor;

	function requireIsFullyPopulatedPropertyDescriptor () {
		if (hasRequiredIsFullyPopulatedPropertyDescriptor) return isFullyPopulatedPropertyDescriptor;
		hasRequiredIsFullyPopulatedPropertyDescriptor = 1;

		var isPropertyDescriptor = requirePropertyDescriptor();

		isFullyPopulatedPropertyDescriptor = function isFullyPopulatedPropertyDescriptor(ES, Desc) {
			return isPropertyDescriptor(Desc)
				&& typeof Desc === 'object'
				&& '[[Enumerable]]' in Desc
				&& '[[Configurable]]' in Desc
				&& (ES.IsAccessorDescriptor(Desc) || ES.IsDataDescriptor(Desc));
		};
		return isFullyPopulatedPropertyDescriptor;
	}

	var fromPropertyDescriptor;
	var hasRequiredFromPropertyDescriptor$1;

	function requireFromPropertyDescriptor$1 () {
		if (hasRequiredFromPropertyDescriptor$1) return fromPropertyDescriptor;
		hasRequiredFromPropertyDescriptor$1 = 1;

		fromPropertyDescriptor = function fromPropertyDescriptor(Desc) {
			if (typeof Desc === 'undefined') {
				return Desc;
			}
			var obj = {};
			if ('[[Value]]' in Desc) {
				obj.value = Desc['[[Value]]'];
			}
			if ('[[Writable]]' in Desc) {
				obj.writable = !!Desc['[[Writable]]'];
			}
			if ('[[Get]]' in Desc) {
				obj.get = Desc['[[Get]]'];
			}
			if ('[[Set]]' in Desc) {
				obj.set = Desc['[[Set]]'];
			}
			if ('[[Enumerable]]' in Desc) {
				obj.enumerable = !!Desc['[[Enumerable]]'];
			}
			if ('[[Configurable]]' in Desc) {
				obj.configurable = !!Desc['[[Configurable]]'];
			}
			return obj;
		};
		return fromPropertyDescriptor;
	}

	var FromPropertyDescriptor;
	var hasRequiredFromPropertyDescriptor;

	function requireFromPropertyDescriptor () {
		if (hasRequiredFromPropertyDescriptor) return FromPropertyDescriptor;
		hasRequiredFromPropertyDescriptor = 1;

		var $TypeError = type;

		var isPropertyDescriptor = requirePropertyDescriptor();
		var fromPropertyDescriptor = requireFromPropertyDescriptor$1();

		// https://262.ecma-international.org/6.0/#sec-frompropertydescriptor

		FromPropertyDescriptor = function FromPropertyDescriptor(Desc) {
			if (typeof Desc !== 'undefined' && !isPropertyDescriptor(Desc)) {
				throw new $TypeError('Assertion failed: `Desc` must be a Property Descriptor');
			}

			return fromPropertyDescriptor(Desc);
		};
		return FromPropertyDescriptor;
	}

	var IsDataDescriptor;
	var hasRequiredIsDataDescriptor;

	function requireIsDataDescriptor () {
		if (hasRequiredIsDataDescriptor) return IsDataDescriptor;
		hasRequiredIsDataDescriptor = 1;

		var $TypeError = type;

		var hasOwn = hasown;

		var isPropertyDescriptor = requirePropertyDescriptor();

		// https://262.ecma-international.org/5.1/#sec-8.10.2

		IsDataDescriptor = function IsDataDescriptor(Desc) {
			if (typeof Desc === 'undefined') {
				return false;
			}

			if (!isPropertyDescriptor(Desc)) {
				throw new $TypeError('Assertion failed: `Desc` must be a Property Descriptor');
			}

			if (!hasOwn(Desc, '[[Value]]') && !hasOwn(Desc, '[[Writable]]')) {
				return false;
			}

			return true;
		};
		return IsDataDescriptor;
	}

	var IsGenericDescriptor;
	var hasRequiredIsGenericDescriptor;

	function requireIsGenericDescriptor () {
		if (hasRequiredIsGenericDescriptor) return IsGenericDescriptor;
		hasRequiredIsGenericDescriptor = 1;

		var $TypeError = type;

		var IsAccessorDescriptor = requireIsAccessorDescriptor();
		var IsDataDescriptor = requireIsDataDescriptor();

		var isPropertyDescriptor = requirePropertyDescriptor();

		// https://262.ecma-international.org/6.0/#sec-isgenericdescriptor

		IsGenericDescriptor = function IsGenericDescriptor(Desc) {
			if (typeof Desc === 'undefined') {
				return false;
			}

			if (!isPropertyDescriptor(Desc)) {
				throw new $TypeError('Assertion failed: `Desc` must be a Property Descriptor');
			}

			if (!IsAccessorDescriptor(Desc) && !IsDataDescriptor(Desc)) {
				return true;
			}

			return false;
		};
		return IsGenericDescriptor;
	}

	var ValidateAndApplyPropertyDescriptor;
	var hasRequiredValidateAndApplyPropertyDescriptor;

	function requireValidateAndApplyPropertyDescriptor () {
		if (hasRequiredValidateAndApplyPropertyDescriptor) return ValidateAndApplyPropertyDescriptor;
		hasRequiredValidateAndApplyPropertyDescriptor = 1;

		var $TypeError = type;

		var DefineOwnProperty = requireDefineOwnProperty();
		var isFullyPopulatedPropertyDescriptor = requireIsFullyPopulatedPropertyDescriptor();
		var isPropertyDescriptor = requirePropertyDescriptor();

		var FromPropertyDescriptor = requireFromPropertyDescriptor();
		var IsAccessorDescriptor = requireIsAccessorDescriptor();
		var IsDataDescriptor = requireIsDataDescriptor();
		var IsGenericDescriptor = requireIsGenericDescriptor();
		var IsPropertyKey = IsPropertyKey$2;
		var SameValue = requireSameValue();
		var Type = Type$2;

		// https://262.ecma-international.org/13.0/#sec-validateandapplypropertydescriptor

		// see https://github.com/tc39/ecma262/pull/2468 for ES2022 changes

		// eslint-disable-next-line max-lines-per-function, max-statements
		ValidateAndApplyPropertyDescriptor = function ValidateAndApplyPropertyDescriptor(O, P, extensible, Desc, current) {
			var oType = Type(O);
			if (oType !== 'Undefined' && oType !== 'Object') {
				throw new $TypeError('Assertion failed: O must be undefined or an Object');
			}
			if (!IsPropertyKey(P)) {
				throw new $TypeError('Assertion failed: P must be a Property Key');
			}
			if (typeof extensible !== 'boolean') {
				throw new $TypeError('Assertion failed: extensible must be a Boolean');
			}
			if (!isPropertyDescriptor(Desc)) {
				throw new $TypeError('Assertion failed: Desc must be a Property Descriptor');
			}
			if (typeof current !== 'undefined' && !isPropertyDescriptor(current)) {
				throw new $TypeError('Assertion failed: current must be a Property Descriptor, or undefined');
			}

			if (typeof current === 'undefined') { // step 2
				if (!extensible) {
					return false; // step 2.a
				}
				if (oType === 'Undefined') {
					return true; // step 2.b
				}
				if (IsAccessorDescriptor(Desc)) { // step 2.c
					return DefineOwnProperty(
						IsDataDescriptor,
						SameValue,
						FromPropertyDescriptor,
						O,
						P,
						Desc
					);
				}
				// step 2.d
				return DefineOwnProperty(
					IsDataDescriptor,
					SameValue,
					FromPropertyDescriptor,
					O,
					P,
					{
						'[[Configurable]]': !!Desc['[[Configurable]]'],
						'[[Enumerable]]': !!Desc['[[Enumerable]]'],
						'[[Value]]': Desc['[[Value]]'],
						'[[Writable]]': !!Desc['[[Writable]]']
					}
				);
			}

			// 3. Assert: current is a fully populated Property Descriptor.
			if (
				!isFullyPopulatedPropertyDescriptor(
					{
						IsAccessorDescriptor: IsAccessorDescriptor,
						IsDataDescriptor: IsDataDescriptor
					},
					current
				)
			) {
				throw new $TypeError('`current`, when present, must be a fully populated and valid Property Descriptor');
			}

			// 4. If every field in Desc is absent, return true.
			// this can't really match the assertion that it's a Property Descriptor in our JS implementation

			// 5. If current.[[Configurable]] is false, then
			if (!current['[[Configurable]]']) {
				if ('[[Configurable]]' in Desc && Desc['[[Configurable]]']) {
					// step 5.a
					return false;
				}
				if ('[[Enumerable]]' in Desc && !SameValue(Desc['[[Enumerable]]'], current['[[Enumerable]]'])) {
					// step 5.b
					return false;
				}
				if (!IsGenericDescriptor(Desc) && !SameValue(IsAccessorDescriptor(Desc), IsAccessorDescriptor(current))) {
					// step 5.c
					return false;
				}
				if (IsAccessorDescriptor(current)) { // step 5.d
					if ('[[Get]]' in Desc && !SameValue(Desc['[[Get]]'], current['[[Get]]'])) {
						return false;
					}
					if ('[[Set]]' in Desc && !SameValue(Desc['[[Set]]'], current['[[Set]]'])) {
						return false;
					}
				} else if (!current['[[Writable]]']) { // step 5.e
					if ('[[Writable]]' in Desc && Desc['[[Writable]]']) {
						return false;
					}
					if ('[[Value]]' in Desc && !SameValue(Desc['[[Value]]'], current['[[Value]]'])) {
						return false;
					}
				}
			}

			// 6. If O is not undefined, then
			if (oType !== 'Undefined') {
				var configurable;
				var enumerable;
				if (IsDataDescriptor(current) && IsAccessorDescriptor(Desc)) { // step 6.a
					configurable = ('[[Configurable]]' in Desc ? Desc : current)['[[Configurable]]'];
					enumerable = ('[[Enumerable]]' in Desc ? Desc : current)['[[Enumerable]]'];
					// Replace the property named P of object O with an accessor property having [[Configurable]] and [[Enumerable]] attributes as described by current and each other attribute set to its default value.
					return DefineOwnProperty(
						IsDataDescriptor,
						SameValue,
						FromPropertyDescriptor,
						O,
						P,
						{
							'[[Configurable]]': !!configurable,
							'[[Enumerable]]': !!enumerable,
							'[[Get]]': ('[[Get]]' in Desc ? Desc : current)['[[Get]]'],
							'[[Set]]': ('[[Set]]' in Desc ? Desc : current)['[[Set]]']
						}
					);
				} else if (IsAccessorDescriptor(current) && IsDataDescriptor(Desc)) {
					configurable = ('[[Configurable]]' in Desc ? Desc : current)['[[Configurable]]'];
					enumerable = ('[[Enumerable]]' in Desc ? Desc : current)['[[Enumerable]]'];
					// i. Replace the property named P of object O with a data property having [[Configurable]] and [[Enumerable]] attributes as described by current and each other attribute set to its default value.
					return DefineOwnProperty(
						IsDataDescriptor,
						SameValue,
						FromPropertyDescriptor,
						O,
						P,
						{
							'[[Configurable]]': !!configurable,
							'[[Enumerable]]': !!enumerable,
							'[[Value]]': ('[[Value]]' in Desc ? Desc : current)['[[Value]]'],
							'[[Writable]]': !!('[[Writable]]' in Desc ? Desc : current)['[[Writable]]']
						}
					);
				}

				// For each field of Desc that is present, set the corresponding attribute of the property named P of object O to the value of the field.
				return DefineOwnProperty(
					IsDataDescriptor,
					SameValue,
					FromPropertyDescriptor,
					O,
					P,
					Desc
				);
			}

			return true; // step 7
		};
		return ValidateAndApplyPropertyDescriptor;
	}

	var OrdinaryDefineOwnProperty;
	var hasRequiredOrdinaryDefineOwnProperty;

	function requireOrdinaryDefineOwnProperty () {
		if (hasRequiredOrdinaryDefineOwnProperty) return OrdinaryDefineOwnProperty;
		hasRequiredOrdinaryDefineOwnProperty = 1;

		var $gOPD = requireGopd();
		var $SyntaxError = syntax;
		var $TypeError = type;

		var isPropertyDescriptor = requirePropertyDescriptor();

		var IsAccessorDescriptor = requireIsAccessorDescriptor();
		var IsExtensible = requireIsExtensible();
		var IsPropertyKey = IsPropertyKey$2;
		var ToPropertyDescriptor = requireToPropertyDescriptor();
		var SameValue = requireSameValue();
		var Type = Type$2;
		var ValidateAndApplyPropertyDescriptor = requireValidateAndApplyPropertyDescriptor();

		// https://262.ecma-international.org/6.0/#sec-ordinarydefineownproperty

		OrdinaryDefineOwnProperty = function OrdinaryDefineOwnProperty(O, P, Desc) {
			if (Type(O) !== 'Object') {
				throw new $TypeError('Assertion failed: O must be an Object');
			}
			if (!IsPropertyKey(P)) {
				throw new $TypeError('Assertion failed: P must be a Property Key');
			}
			if (!isPropertyDescriptor(Desc)) {
				throw new $TypeError('Assertion failed: Desc must be a Property Descriptor');
			}
			if (!$gOPD) {
				// ES3/IE 8 fallback
				if (IsAccessorDescriptor(Desc)) {
					throw new $SyntaxError('This environment does not support accessor property descriptors.');
				}
				var creatingNormalDataProperty = !(P in O)
					&& Desc['[[Writable]]']
					&& Desc['[[Enumerable]]']
					&& Desc['[[Configurable]]']
					&& '[[Value]]' in Desc;
				var settingExistingDataProperty = (P in O)
					&& (!('[[Configurable]]' in Desc) || Desc['[[Configurable]]'])
					&& (!('[[Enumerable]]' in Desc) || Desc['[[Enumerable]]'])
					&& (!('[[Writable]]' in Desc) || Desc['[[Writable]]'])
					&& '[[Value]]' in Desc;
				if (creatingNormalDataProperty || settingExistingDataProperty) {
					O[P] = Desc['[[Value]]']; // eslint-disable-line no-param-reassign
					return SameValue(O[P], Desc['[[Value]]']);
				}
				throw new $SyntaxError('This environment does not support defining non-writable, non-enumerable, or non-configurable properties');
			}
			var desc = $gOPD(O, P);
			var current = desc && ToPropertyDescriptor(desc);
			var extensible = IsExtensible(O);
			return ValidateAndApplyPropertyDescriptor(O, P, extensible, Desc, current);
		};
		return OrdinaryDefineOwnProperty;
	}

	var CreateDataProperty;
	var hasRequiredCreateDataProperty;

	function requireCreateDataProperty () {
		if (hasRequiredCreateDataProperty) return CreateDataProperty;
		hasRequiredCreateDataProperty = 1;

		var $TypeError = type;

		var IsPropertyKey = IsPropertyKey$2;
		var OrdinaryDefineOwnProperty = requireOrdinaryDefineOwnProperty();
		var Type = Type$2;

		// https://262.ecma-international.org/6.0/#sec-createdataproperty

		CreateDataProperty = function CreateDataProperty(O, P, V) {
			if (Type(O) !== 'Object') {
				throw new $TypeError('Assertion failed: Type(O) is not Object');
			}
			if (!IsPropertyKey(P)) {
				throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
			}
			var newDesc = {
				'[[Configurable]]': true,
				'[[Enumerable]]': true,
				'[[Value]]': V,
				'[[Writable]]': true
			};
			return OrdinaryDefineOwnProperty(O, P, newDesc);
		};
		return CreateDataProperty;
	}

	var CreateDataPropertyOrThrow$1;
	var hasRequiredCreateDataPropertyOrThrow;

	function requireCreateDataPropertyOrThrow () {
		if (hasRequiredCreateDataPropertyOrThrow) return CreateDataPropertyOrThrow$1;
		hasRequiredCreateDataPropertyOrThrow = 1;

		var $TypeError = type;

		var CreateDataProperty = requireCreateDataProperty();
		var IsPropertyKey = IsPropertyKey$2;
		var Type = Type$2;

		// // https://262.ecma-international.org/14.0/#sec-createdatapropertyorthrow

		CreateDataPropertyOrThrow$1 = function CreateDataPropertyOrThrow(O, P, V) {
			if (Type(O) !== 'Object') {
				throw new $TypeError('Assertion failed: Type(O) is not Object');
			}
			if (!IsPropertyKey(P)) {
				throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
			}
			var success = CreateDataProperty(O, P, V);
			if (!success) {
				throw new $TypeError('unable to create data property');
			}
		};
		return CreateDataPropertyOrThrow$1;
	}

	var global$1 = (typeof global !== "undefined" ? global :
	  typeof self !== "undefined" ? self :
	  typeof window !== "undefined" ? window : {});

	var lookup = [];
	var revLookup = [];
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
	var inited = false;
	function init () {
	  inited = true;
	  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	  for (var i = 0, len = code.length; i < len; ++i) {
	    lookup[i] = code[i];
	    revLookup[code.charCodeAt(i)] = i;
	  }

	  revLookup['-'.charCodeAt(0)] = 62;
	  revLookup['_'.charCodeAt(0)] = 63;
	}

	function toByteArray (b64) {
	  if (!inited) {
	    init();
	  }
	  var i, j, l, tmp, placeHolders, arr;
	  var len = b64.length;

	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }

	  // the number of equal signs (place holders)
	  // if there are two placeholders, than the two characters before it
	  // represent one byte
	  // if there is only one, then the three characters before it represent 2 bytes
	  // this is just a cheap hack to not do indexOf twice
	  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

	  // base64 is 4/3 + up to two characters of the original data
	  arr = new Arr(len * 3 / 4 - placeHolders);

	  // if there are placeholders, only get up to the last complete 4 chars
	  l = placeHolders > 0 ? len - 4 : len;

	  var L = 0;

	  for (i = 0, j = 0; i < l; i += 4, j += 3) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
	    arr[L++] = (tmp >> 16) & 0xFF;
	    arr[L++] = (tmp >> 8) & 0xFF;
	    arr[L++] = tmp & 0xFF;
	  }

	  if (placeHolders === 2) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
	    arr[L++] = tmp & 0xFF;
	  } else if (placeHolders === 1) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
	    arr[L++] = (tmp >> 8) & 0xFF;
	    arr[L++] = tmp & 0xFF;
	  }

	  return arr
	}

	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
	}

	function encodeChunk (uint8, start, end) {
	  var tmp;
	  var output = [];
	  for (var i = start; i < end; i += 3) {
	    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
	    output.push(tripletToBase64(tmp));
	  }
	  return output.join('')
	}

	function fromByteArray (uint8) {
	  if (!inited) {
	    init();
	  }
	  var tmp;
	  var len = uint8.length;
	  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
	  var output = '';
	  var parts = [];
	  var maxChunkLength = 16383; // must be multiple of 3

	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
	  }

	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1];
	    output += lookup[tmp >> 2];
	    output += lookup[(tmp << 4) & 0x3F];
	    output += '==';
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
	    output += lookup[tmp >> 10];
	    output += lookup[(tmp >> 4) & 0x3F];
	    output += lookup[(tmp << 2) & 0x3F];
	    output += '=';
	  }

	  parts.push(output);

	  return parts.join('')
	}

	function read (buffer, offset, isLE, mLen, nBytes) {
	  var e, m;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var nBits = -7;
	  var i = isLE ? (nBytes - 1) : 0;
	  var d = isLE ? -1 : 1;
	  var s = buffer[offset + i];

	  i += d;

	  e = s & ((1 << (-nBits)) - 1);
	  s >>= (-nBits);
	  nBits += eLen;
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1);
	  e >>= (-nBits);
	  nBits += mLen;
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}

	function write (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
	  var i = isLE ? 0 : (nBytes - 1);
	  var d = isLE ? 1 : -1;
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

	  value = Math.abs(value);

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }

	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128;
	}

	var toString = {}.toString;

	var isArray$2 = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};

	/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */

	var INSPECT_MAX_BYTES = 50;

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined
	  ? global$1.TYPED_ARRAY_SUPPORT
	  : true;

	/*
	 * Export kMaxLength after typed array support is determined.
	 */
	kMaxLength();

	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}

	function createBuffer (that, length) {
	  if (kMaxLength() < length) {
	    throw new RangeError('Invalid typed array length')
	  }
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = new Uint8Array(length);
	    that.__proto__ = Buffer.prototype;
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    if (that === null) {
	      that = new Buffer(length);
	    }
	    that.length = length;
	  }

	  return that
	}

	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */

	function Buffer (arg, encodingOrOffset, length) {
	  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
	    return new Buffer(arg, encodingOrOffset, length)
	  }

	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new Error(
	        'If encoding is specified then the first argument must be a string'
	      )
	    }
	    return allocUnsafe(this, arg)
	  }
	  return from(this, arg, encodingOrOffset, length)
	}

	Buffer.poolSize = 8192; // not used by this implementation

	// TODO: Legacy, not needed anymore. Remove in next major version.
	Buffer._augment = function (arr) {
	  arr.__proto__ = Buffer.prototype;
	  return arr
	};

	function from (that, value, encodingOrOffset, length) {
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number')
	  }

	  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	    return fromArrayBuffer(that, value, encodingOrOffset, length)
	  }

	  if (typeof value === 'string') {
	    return fromString(that, value, encodingOrOffset)
	  }

	  return fromObject(that, value)
	}

	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	  return from(null, value, encodingOrOffset, length)
	};

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype;
	  Buffer.__proto__ = Uint8Array;
	}

	function assertSize (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be a number')
	  } else if (size < 0) {
	    throw new RangeError('"size" argument must not be negative')
	  }
	}

	function alloc (that, size, fill, encoding) {
	  assertSize(size);
	  if (size <= 0) {
	    return createBuffer(that, size)
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpretted as a start offset.
	    return typeof encoding === 'string'
	      ? createBuffer(that, size).fill(fill, encoding)
	      : createBuffer(that, size).fill(fill)
	  }
	  return createBuffer(that, size)
	}

	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	  return alloc(null, size, fill, encoding)
	};

	function allocUnsafe (that, size) {
	  assertSize(size);
	  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < size; ++i) {
	      that[i] = 0;
	    }
	  }
	  return that
	}

	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(null, size)
	};
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(null, size)
	};

	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8';
	  }

	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('"encoding" must be a valid string encoding')
	  }

	  var length = byteLength(string, encoding) | 0;
	  that = createBuffer(that, length);

	  var actual = that.write(string, encoding);

	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    that = that.slice(0, actual);
	  }

	  return that
	}

	function fromArrayLike (that, array) {
	  var length = array.length < 0 ? 0 : checked(array.length) | 0;
	  that = createBuffer(that, length);
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that
	}

	function fromArrayBuffer (that, array, byteOffset, length) {
	  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('\'offset\' is out of bounds')
	  }

	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('\'length\' is out of bounds')
	  }

	  if (byteOffset === undefined && length === undefined) {
	    array = new Uint8Array(array);
	  } else if (length === undefined) {
	    array = new Uint8Array(array, byteOffset);
	  } else {
	    array = new Uint8Array(array, byteOffset, length);
	  }

	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = array;
	    that.__proto__ = Buffer.prototype;
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromArrayLike(that, array);
	  }
	  return that
	}

	function fromObject (that, obj) {
	  if (internalIsBuffer(obj)) {
	    var len = checked(obj.length) | 0;
	    that = createBuffer(that, len);

	    if (that.length === 0) {
	      return that
	    }

	    obj.copy(that, 0, 0, len);
	    return that
	  }

	  if (obj) {
	    if ((typeof ArrayBuffer !== 'undefined' &&
	        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
	      if (typeof obj.length !== 'number' || isnan(obj.length)) {
	        return createBuffer(that, 0)
	      }
	      return fromArrayLike(that, obj)
	    }

	    if (obj.type === 'Buffer' && isArray$2(obj.data)) {
	      return fromArrayLike(that, obj.data)
	    }
	  }

	  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
	}

	function checked (length) {
	  // Note: cannot use `length < kMaxLength()` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}
	Buffer.isBuffer = isBuffer$1;
	function internalIsBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function compare (a, b) {
	  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length;
	  var y = b.length;

	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i];
	      y = b[i];
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	};

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	};

	Buffer.concat = function concat (list, length) {
	  if (!isArray$2(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers')
	  }

	  if (list.length === 0) {
	    return Buffer.alloc(0)
	  }

	  var i;
	  if (length === undefined) {
	    length = 0;
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length;
	    }
	  }

	  var buffer = Buffer.allocUnsafe(length);
	  var pos = 0;
	  for (i = 0; i < list.length; ++i) {
	    var buf = list[i];
	    if (!internalIsBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers')
	    }
	    buf.copy(buffer, pos);
	    pos += buf.length;
	  }
	  return buffer
	};

	function byteLength (string, encoding) {
	  if (internalIsBuffer(string)) {
	    return string.length
	  }
	  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
	      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
	    return string.byteLength
	  }
	  if (typeof string !== 'string') {
	    string = '' + string;
	  }

	  var len = string.length;
	  if (len === 0) return 0

	  // Use a for loop to avoid recursion
	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len
	      case 'utf8':
	      case 'utf-8':
	      case undefined:
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	}
	Buffer.byteLength = byteLength;

	function slowToString (encoding, start, end) {
	  var loweredCase = false;

	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.

	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0;
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return ''
	  }

	  if (end === undefined || end > this.length) {
	    end = this.length;
	  }

	  if (end <= 0) {
	    return ''
	  }

	  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0;
	  start >>>= 0;

	  if (end <= start) {
	    return ''
	  }

	  if (!encoding) encoding = 'utf8';

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase();
	        loweredCase = true;
	    }
	  }
	}

	// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
	// Buffer instances.
	Buffer.prototype._isBuffer = true;

	function swap (b, n, m) {
	  var i = b[n];
	  b[n] = b[m];
	  b[m] = i;
	}

	Buffer.prototype.swap16 = function swap16 () {
	  var len = this.length;
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits')
	  }
	  for (var i = 0; i < len; i += 2) {
	    swap(this, i, i + 1);
	  }
	  return this
	};

	Buffer.prototype.swap32 = function swap32 () {
	  var len = this.length;
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits')
	  }
	  for (var i = 0; i < len; i += 4) {
	    swap(this, i, i + 3);
	    swap(this, i + 1, i + 2);
	  }
	  return this
	};

	Buffer.prototype.swap64 = function swap64 () {
	  var len = this.length;
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits')
	  }
	  for (var i = 0; i < len; i += 8) {
	    swap(this, i, i + 7);
	    swap(this, i + 1, i + 6);
	    swap(this, i + 2, i + 5);
	    swap(this, i + 3, i + 4);
	  }
	  return this
	};

	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0;
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	};

	Buffer.prototype.equals = function equals (b) {
	  if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	};

	Buffer.prototype.inspect = function inspect () {
	  var str = '';
	  var max = INSPECT_MAX_BYTES;
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
	    if (this.length > max) str += ' ... ';
	  }
	  return '<Buffer ' + str + '>'
	};

	Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	  if (!internalIsBuffer(target)) {
	    throw new TypeError('Argument must be a Buffer')
	  }

	  if (start === undefined) {
	    start = 0;
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0;
	  }
	  if (thisStart === undefined) {
	    thisStart = 0;
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length;
	  }

	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index')
	  }

	  if (thisStart >= thisEnd && start >= end) {
	    return 0
	  }
	  if (thisStart >= thisEnd) {
	    return -1
	  }
	  if (start >= end) {
	    return 1
	  }

	  start >>>= 0;
	  end >>>= 0;
	  thisStart >>>= 0;
	  thisEnd >>>= 0;

	  if (this === target) return 0

	  var x = thisEnd - thisStart;
	  var y = end - start;
	  var len = Math.min(x, y);

	  var thisCopy = this.slice(thisStart, thisEnd);
	  var targetCopy = target.slice(start, end);

	  for (var i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i];
	      y = targetCopy[i];
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	};

	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1

	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset;
	    byteOffset = 0;
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff;
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000;
	  }
	  byteOffset = +byteOffset;  // Coerce to Number.
	  if (isNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : (buffer.length - 1);
	  }

	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1
	    else byteOffset = buffer.length - 1;
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0;
	    else return -1
	  }

	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding);
	  }

	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (internalIsBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
	  } else if (typeof val === 'number') {
	    val = val & 0xFF; // Search for a byte value [0-255]
	    if (Buffer.TYPED_ARRAY_SUPPORT &&
	        typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
	      }
	    }
	    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
	  var indexSize = 1;
	  var arrLength = arr.length;
	  var valLength = val.length;

	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase();
	    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	        encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1
	      }
	      indexSize = 2;
	      arrLength /= 2;
	      valLength /= 2;
	      byteOffset /= 2;
	    }
	  }

	  function read (buf, i) {
	    if (indexSize === 1) {
	      return buf[i]
	    } else {
	      return buf.readUInt16BE(i * indexSize)
	    }
	  }

	  var i;
	  if (dir) {
	    var foundIndex = -1;
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i;
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex;
	        foundIndex = -1;
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
	    for (i = byteOffset; i >= 0; i--) {
	      var found = true;
	      for (var j = 0; j < valLength; j++) {
	        if (read(arr, i + j) !== read(val, j)) {
	          found = false;
	          break
	        }
	      }
	      if (found) return i
	    }
	  }

	  return -1
	}

	Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1
	};

	Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
	};

	Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
	};

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0;
	  var remaining = buf.length - offset;
	  if (!length) {
	    length = remaining;
	  } else {
	    length = Number(length);
	    if (length > remaining) {
	      length = remaining;
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length;
	  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2;
	  }
	  for (var i = 0; i < length; ++i) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16);
	    if (isNaN(parsed)) return i
	    buf[offset + i] = parsed;
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function latin1Write (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8';
	    length = this.length;
	    offset = 0;
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset;
	    length = this.length;
	    offset = 0;
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0;
	    if (isFinite(length)) {
	      length = length | 0;
	      if (encoding === undefined) encoding = 'utf8';
	    } else {
	      encoding = length;
	      length = undefined;
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    throw new Error(
	      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	    )
	  }

	  var remaining = this.length - offset;
	  if (length === undefined || length > remaining) length = remaining;

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8';

	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	        return asciiWrite(this, string, offset, length)

	      case 'latin1':
	      case 'binary':
	        return latin1Write(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	};

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	};

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return fromByteArray(buf)
	  } else {
	    return fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end);
	  var res = [];

	  var i = start;
	  while (i < end) {
	    var firstByte = buf[i];
	    var codePoint = null;
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1;

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint;

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte;
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1];
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          fourthByte = buf[i + 3];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint;
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD;
	      bytesPerSequence = 1;
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000;
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
	      codePoint = 0xDC00 | codePoint & 0x3FF;
	    }

	    res.push(codePoint);
	    i += bytesPerSequence;
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000;

	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length;
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = '';
	  var i = 0;
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    );
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F);
	  }
	  return ret
	}

	function latin1Slice (buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i]);
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length;

	  if (!start || start < 0) start = 0;
	  if (!end || end < 0 || end > len) end = len;

	  var out = '';
	  for (var i = start; i < end; ++i) {
	    out += toHex(buf[i]);
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end);
	  var res = '';
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length;
	  start = ~~start;
	  end = end === undefined ? len : ~~end;

	  if (start < 0) {
	    start += len;
	    if (start < 0) start = 0;
	  } else if (start > len) {
	    start = len;
	  }

	  if (end < 0) {
	    end += len;
	    if (end < 0) end = 0;
	  } else if (end > len) {
	    end = len;
	  }

	  if (end < start) end = start;

	  var newBuf;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = this.subarray(start, end);
	    newBuf.__proto__ = Buffer.prototype;
	  } else {
	    var sliceLen = end - start;
	    newBuf = new Buffer(sliceLen, undefined);
	    for (var i = 0; i < sliceLen; ++i) {
	      newBuf[i] = this[i + start];
	    }
	  }

	  return newBuf
	};

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }

	  return val
	};

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length);
	  }

	  var val = this[offset + --byteLength];
	  var mul = 1;
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul;
	  }

	  return val
	};

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  return this[offset]
	};

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return this[offset] | (this[offset + 1] << 8)
	};

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return (this[offset] << 8) | this[offset + 1]
	};

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	};

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	};

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val
	};

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var i = byteLength;
	  var mul = 1;
	  var val = this[offset + --i];
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val
	};

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	};

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset] | (this[offset + 1] << 8);
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	};

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset + 1] | (this[offset] << 8);
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	};

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	};

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	};

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return read(this, offset, true, 23, 4)
	};

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return read(this, offset, false, 23, 4)
	};

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return read(this, offset, true, 52, 8)
	};

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return read(this, offset, false, 52, 8)
	};

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
	    checkInt(this, value, offset, byteLength, maxBytes, 0);
	  }

	  var mul = 1;
	  var i = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
	    checkInt(this, value, offset, byteLength, maxBytes, 0);
	  }

	  var i = byteLength - 1;
	  var mul = 1;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  this[offset] = (value & 0xff);
	  return offset + 1
	};

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8;
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff);
	    this[offset + 1] = (value >>> 8);
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2
	};

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8);
	    this[offset + 1] = (value & 0xff);
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2
	};

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24);
	    this[offset + 2] = (value >>> 16);
	    this[offset + 1] = (value >>> 8);
	    this[offset] = (value & 0xff);
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4
	};

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24);
	    this[offset + 1] = (value >>> 16);
	    this[offset + 2] = (value >>> 8);
	    this[offset + 3] = (value & 0xff);
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4
	};

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = 0;
	  var mul = 1;
	  var sub = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1;
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = byteLength - 1;
	  var mul = 1;
	  var sub = 0;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1;
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  if (value < 0) value = 0xff + value + 1;
	  this[offset] = (value & 0xff);
	  return offset + 1
	};

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff);
	    this[offset + 1] = (value >>> 8);
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2
	};

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8);
	    this[offset + 1] = (value & 0xff);
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2
	};

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff);
	    this[offset + 1] = (value >>> 8);
	    this[offset + 2] = (value >>> 16);
	    this[offset + 3] = (value >>> 24);
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4
	};

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (value < 0) value = 0xffffffff + value + 1;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24);
	    this[offset + 1] = (value >>> 16);
	    this[offset + 2] = (value >>> 8);
	    this[offset + 3] = (value & 0xff);
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4
	};

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	  if (offset < 0) throw new RangeError('Index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4);
	  }
	  write(buf, value, offset, littleEndian, 23, 4);
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	};

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	};

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8);
	  }
	  write(buf, value, offset, littleEndian, 52, 8);
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	};

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	};

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0;
	  if (!end && end !== 0) end = this.length;
	  if (targetStart >= target.length) targetStart = target.length;
	  if (!targetStart) targetStart = 0;
	  if (end > 0 && end < start) end = start;

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length;
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start;
	  }

	  var len = end - start;
	  var i;

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; --i) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; ++i) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else {
	    Uint8Array.prototype.set.call(
	      target,
	      this.subarray(start, start + len),
	      targetStart
	    );
	  }

	  return len
	};

	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill (val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start;
	      start = 0;
	      end = this.length;
	    } else if (typeof end === 'string') {
	      encoding = end;
	      end = this.length;
	    }
	    if (val.length === 1) {
	      var code = val.charCodeAt(0);
	      if (code < 256) {
	        val = code;
	      }
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string')
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding)
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255;
	  }

	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index')
	  }

	  if (end <= start) {
	    return this
	  }

	  start = start >>> 0;
	  end = end === undefined ? this.length : end >>> 0;

	  if (!val) val = 0;

	  var i;
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val;
	    }
	  } else {
	    var bytes = internalIsBuffer(val)
	      ? val
	      : utf8ToBytes(new Buffer(val, encoding).toString());
	    var len = bytes.length;
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len];
	    }
	  }

	  return this
	};

	// HELPER FUNCTIONS
	// ================

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '=';
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity;
	  var codePoint;
	  var length = string.length;
	  var leadSurrogate = null;
	  var bytes = [];

	  for (var i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i);

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint;

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	        leadSurrogate = codePoint;
	        continue
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	    }

	    leadSurrogate = null;

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint);
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      );
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      );
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      );
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = [];
	  for (var i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF);
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo;
	  var byteArray = [];
	  for (var i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i);
	    hi = c >> 8;
	    lo = c % 256;
	    byteArray.push(lo);
	    byteArray.push(hi);
	  }

	  return byteArray
	}


	function base64ToBytes (str) {
	  return toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; ++i) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i];
	  }
	  return i
	}

	function isnan (val) {
	  return val !== val // eslint-disable-line no-self-compare
	}


	// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
	// The _isBuffer check is for Safari 5-7 support, because it's missing
	// Object.prototype.constructor. Remove this eventually
	function isBuffer$1(obj) {
	  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
	}

	function isFastBuffer (obj) {
	  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
	}

	// For Node v0.10 support. Remove this eventually.
	function isSlowBuffer (obj) {
	  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
	}

	// shim for using process in browser
	// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	var cachedSetTimeout = defaultSetTimout;
	var cachedClearTimeout = defaultClearTimeout;
	if (typeof global$1.setTimeout === 'function') {
	    cachedSetTimeout = setTimeout;
	}
	if (typeof global$1.clearTimeout === 'function') {
	    cachedClearTimeout = clearTimeout;
	}

	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	function nextTick(fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	}
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	var title = 'browser';
	var platform = 'browser';
	var browser = true;
	var env = {};
	var argv = [];
	var version = ''; // empty string to avoid regexp issues
	var versions = {};
	var release = {};
	var config = {};

	function noop() {}

	var on = noop;
	var addListener = noop;
	var once = noop;
	var off = noop;
	var removeListener = noop;
	var removeAllListeners = noop;
	var emit = noop;

	function binding(name) {
	    throw new Error('process.binding is not supported');
	}

	function cwd () { return '/' }
	function chdir (dir) {
	    throw new Error('process.chdir is not supported');
	}function umask() { return 0; }

	// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
	var performance = global$1.performance || {};
	var performanceNow =
	  performance.now        ||
	  performance.mozNow     ||
	  performance.msNow      ||
	  performance.oNow       ||
	  performance.webkitNow  ||
	  function(){ return (new Date()).getTime() };

	// generate timestamp or delta
	// see http://nodejs.org/api/process.html#process_process_hrtime
	function hrtime(previousTimestamp){
	  var clocktime = performanceNow.call(performance)*1e-3;
	  var seconds = Math.floor(clocktime);
	  var nanoseconds = Math.floor((clocktime%1)*1e9);
	  if (previousTimestamp) {
	    seconds = seconds - previousTimestamp[0];
	    nanoseconds = nanoseconds - previousTimestamp[1];
	    if (nanoseconds<0) {
	      seconds--;
	      nanoseconds += 1e9;
	    }
	  }
	  return [seconds,nanoseconds]
	}

	var startTime = new Date();
	function uptime() {
	  var currentTime = new Date();
	  var dif = currentTime - startTime;
	  return dif / 1000;
	}

	var browser$1 = {
	  nextTick: nextTick,
	  title: title,
	  browser: browser,
	  env: env,
	  argv: argv,
	  version: version,
	  versions: versions,
	  on: on,
	  addListener: addListener,
	  once: once,
	  off: off,
	  removeListener: removeListener,
	  removeAllListeners: removeAllListeners,
	  emit: emit,
	  binding: binding,
	  cwd: cwd,
	  chdir: chdir,
	  umask: umask,
	  hrtime: hrtime,
	  platform: platform,
	  release: release,
	  config: config,
	  uptime: uptime
	};

	var process = browser$1;

	var inherits;
	if (typeof Object.create === 'function'){
	  inherits = function inherits(ctor, superCtor) {
	    // implementation from standard node.js 'util' module
	    ctor.super_ = superCtor;
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  inherits = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    var TempCtor = function () {};
	    TempCtor.prototype = superCtor.prototype;
	    ctor.prototype = new TempCtor();
	    ctor.prototype.constructor = ctor;
	  };
	}
	var inherits$1 = inherits;

	var formatRegExp = /%[sdj%]/g;
	function format$1(f) {
	  if (!isString$1(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	}

	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	function deprecate(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global$1.process)) {
	    return function() {
	      return deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  if (process.noDeprecation === true) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	}

	var debugs = {};
	var debugEnviron;
	function debuglog(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = 0;
	      debugs[set] = function() {
	        var msg = format$1.apply(null, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	}

	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean$1(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    _extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}

	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};


	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}


	function stylizeNoColor(str, styleType) {
	  return str;
	}


	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}


	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString$1(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }

	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError$1(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp$1(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate$2(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError$1(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '', array = false, braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray$1(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp$1(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate$2(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError$1(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp$1(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}


	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString$1(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber$1(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean$1(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}


	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}


	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}


	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}


	function reduceToSingleString(output, base, braces) {
	  var length = output.reduce(function(prev, cur) {
	    if (cur.indexOf('\n') >= 0) ;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}


	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray$1(ar) {
	  return Array.isArray(ar);
	}

	function isBoolean$1(arg) {
	  return typeof arg === 'boolean';
	}

	function isNull(arg) {
	  return arg === null;
	}

	function isNullOrUndefined(arg) {
	  return arg == null;
	}

	function isNumber$1(arg) {
	  return typeof arg === 'number';
	}

	function isString$1(arg) {
	  return typeof arg === 'string';
	}

	function isSymbol$3(arg) {
	  return typeof arg === 'symbol';
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}

	function isRegExp$1(re) {
	  return isObject(re) && objectToString$1(re) === '[object RegExp]';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isDate$2(d) {
	  return isObject(d) && objectToString$1(d) === '[object Date]';
	}

	function isError$1(e) {
	  return isObject(e) &&
	      (objectToString$1(e) === '[object Error]' || e instanceof Error);
	}

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isPrimitive$3(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}

	function isBuffer(maybeBuf) {
	  return Buffer.isBuffer(maybeBuf);
	}

	function objectToString$1(o) {
	  return Object.prototype.toString.call(o);
	}


	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}


	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}


	// log is just a thin wrapper to console.log that prepends a timestamp
	function log() {
	  console.log('%s - %s', timestamp(), format$1.apply(null, arguments));
	}

	function _extend(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	}
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	var util = {
	  inherits: inherits$1,
	  _extend: _extend,
	  log: log,
	  isBuffer: isBuffer,
	  isPrimitive: isPrimitive$3,
	  isFunction: isFunction,
	  isError: isError$1,
	  isDate: isDate$2,
	  isObject: isObject,
	  isRegExp: isRegExp$1,
	  isUndefined: isUndefined,
	  isSymbol: isSymbol$3,
	  isString: isString$1,
	  isNumber: isNumber$1,
	  isNullOrUndefined: isNullOrUndefined,
	  isNull: isNull,
	  isBoolean: isBoolean$1,
	  isArray: isArray$1,
	  inspect: inspect,
	  deprecate: deprecate,
	  format: format$1,
	  debuglog: debuglog
	};

	var util$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		_extend: _extend,
		debuglog: debuglog,
		default: util,
		deprecate: deprecate,
		format: format$1,
		inherits: inherits$1,
		inspect: inspect,
		isArray: isArray$1,
		isBoolean: isBoolean$1,
		isBuffer: isBuffer,
		isDate: isDate$2,
		isError: isError$1,
		isFunction: isFunction,
		isNull: isNull,
		isNullOrUndefined: isNullOrUndefined,
		isNumber: isNumber$1,
		isObject: isObject,
		isPrimitive: isPrimitive$3,
		isRegExp: isRegExp$1,
		isString: isString$1,
		isSymbol: isSymbol$3,
		isUndefined: isUndefined,
		log: log
	});

	var require$$0 = /*@__PURE__*/getAugmentedNamespace(util$1);

	var util_inspect = require$$0.inspect;

	var hasMap = typeof Map === 'function' && Map.prototype;
	var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;
	var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;
	var mapForEach = hasMap && Map.prototype.forEach;
	var hasSet = typeof Set === 'function' && Set.prototype;
	var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;
	var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;
	var setForEach = hasSet && Set.prototype.forEach;
	var hasWeakMap = typeof WeakMap === 'function' && WeakMap.prototype;
	var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
	var hasWeakSet = typeof WeakSet === 'function' && WeakSet.prototype;
	var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
	var hasWeakRef = typeof WeakRef === 'function' && WeakRef.prototype;
	var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
	var booleanValueOf = Boolean.prototype.valueOf;
	var objectToString = Object.prototype.toString;
	var functionToString = Function.prototype.toString;
	var $match = String.prototype.match;
	var $slice = String.prototype.slice;
	var $replace = String.prototype.replace;
	var $toUpperCase = String.prototype.toUpperCase;
	var $toLowerCase = String.prototype.toLowerCase;
	var $test = RegExp.prototype.test;
	var $concat = Array.prototype.concat;
	var $join = Array.prototype.join;
	var $arrSlice = Array.prototype.slice;
	var $floor$1 = Math.floor;
	var bigIntValueOf = typeof BigInt === 'function' ? BigInt.prototype.valueOf : null;
	var gOPS = Object.getOwnPropertySymbols;
	var symToString = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? Symbol.prototype.toString : null;
	var hasShammedSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'object';
	// ie, `has-tostringtag/shams
	var toStringTag = typeof Symbol === 'function' && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? 'object' : 'symbol')
	    ? Symbol.toStringTag
	    : null;
	var isEnumerable = Object.prototype.propertyIsEnumerable;

	var gPO = (typeof Reflect === 'function' ? Reflect.getPrototypeOf : Object.getPrototypeOf) || (
	    [].__proto__ === Array.prototype // eslint-disable-line no-proto
	        ? function (O) {
	            return O.__proto__; // eslint-disable-line no-proto
	        }
	        : null
	);

	function addNumericSeparator(num, str) {
	    if (
	        num === Infinity
	        || num === -Infinity
	        || num !== num
	        || (num && num > -1000 && num < 1000)
	        || $test.call(/e/, str)
	    ) {
	        return str;
	    }
	    var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
	    if (typeof num === 'number') {
	        var int = num < 0 ? -$floor$1(-num) : $floor$1(num); // trunc(num)
	        if (int !== num) {
	            var intStr = String(int);
	            var dec = $slice.call(str, intStr.length + 1);
	            return $replace.call(intStr, sepRegex, '$&_') + '.' + $replace.call($replace.call(dec, /([0-9]{3})/g, '$&_'), /_$/, '');
	        }
	    }
	    return $replace.call(str, sepRegex, '$&_');
	}

	var utilInspect = util_inspect;
	var inspectCustom = utilInspect.custom;
	var inspectSymbol = isSymbol$2(inspectCustom) ? inspectCustom : null;

	var objectInspect = function inspect_(obj, options, depth, seen) {
	    var opts = options || {};

	    if (has(opts, 'quoteStyle') && (opts.quoteStyle !== 'single' && opts.quoteStyle !== 'double')) {
	        throw new TypeError('option "quoteStyle" must be "single" or "double"');
	    }
	    if (
	        has(opts, 'maxStringLength') && (typeof opts.maxStringLength === 'number'
	            ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity
	            : opts.maxStringLength !== null
	        )
	    ) {
	        throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
	    }
	    var customInspect = has(opts, 'customInspect') ? opts.customInspect : true;
	    if (typeof customInspect !== 'boolean' && customInspect !== 'symbol') {
	        throw new TypeError('option "customInspect", if provided, must be `true`, `false`, or `\'symbol\'`');
	    }

	    if (
	        has(opts, 'indent')
	        && opts.indent !== null
	        && opts.indent !== '\t'
	        && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)
	    ) {
	        throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
	    }
	    if (has(opts, 'numericSeparator') && typeof opts.numericSeparator !== 'boolean') {
	        throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
	    }
	    var numericSeparator = opts.numericSeparator;

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
	        var str = String(obj);
	        return numericSeparator ? addNumericSeparator(obj, str) : str;
	    }
	    if (typeof obj === 'bigint') {
	        var bigIntStr = String(obj) + 'n';
	        return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
	    }

	    var maxDepth = typeof opts.depth === 'undefined' ? 5 : opts.depth;
	    if (typeof depth === 'undefined') { depth = 0; }
	    if (depth >= maxDepth && maxDepth > 0 && typeof obj === 'object') {
	        return isArray(obj) ? '[Array]' : '[Object]';
	    }

	    var indent = getIndent(opts, depth);

	    if (typeof seen === 'undefined') {
	        seen = [];
	    } else if (indexOf(seen, obj) >= 0) {
	        return '[Circular]';
	    }

	    function inspect(value, from, noIndent) {
	        if (from) {
	            seen = $arrSlice.call(seen);
	            seen.push(from);
	        }
	        if (noIndent) {
	            var newOpts = {
	                depth: opts.depth
	            };
	            if (has(opts, 'quoteStyle')) {
	                newOpts.quoteStyle = opts.quoteStyle;
	            }
	            return inspect_(value, newOpts, depth + 1, seen);
	        }
	        return inspect_(value, opts, depth + 1, seen);
	    }

	    if (typeof obj === 'function' && !isRegExp(obj)) { // in older engines, regexes are callable
	        var name = nameOf(obj);
	        var keys = arrObjKeys(obj, inspect);
	        return '[Function' + (name ? ': ' + name : ' (anonymous)') + ']' + (keys.length > 0 ? ' { ' + $join.call(keys, ', ') + ' }' : '');
	    }
	    if (isSymbol$2(obj)) {
	        var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, '$1') : symToString.call(obj);
	        return typeof obj === 'object' && !hasShammedSymbols ? markBoxed(symString) : symString;
	    }
	    if (isElement(obj)) {
	        var s = '<' + $toLowerCase.call(String(obj.nodeName));
	        var attrs = obj.attributes || [];
	        for (var i = 0; i < attrs.length; i++) {
	            s += ' ' + attrs[i].name + '=' + wrapQuotes(quote(attrs[i].value), 'double', opts);
	        }
	        s += '>';
	        if (obj.childNodes && obj.childNodes.length) { s += '...'; }
	        s += '</' + $toLowerCase.call(String(obj.nodeName)) + '>';
	        return s;
	    }
	    if (isArray(obj)) {
	        if (obj.length === 0) { return '[]'; }
	        var xs = arrObjKeys(obj, inspect);
	        if (indent && !singleLineValues(xs)) {
	            return '[' + indentedJoin(xs, indent) + ']';
	        }
	        return '[ ' + $join.call(xs, ', ') + ' ]';
	    }
	    if (isError(obj)) {
	        var parts = arrObjKeys(obj, inspect);
	        if (!('cause' in Error.prototype) && 'cause' in obj && !isEnumerable.call(obj, 'cause')) {
	            return '{ [' + String(obj) + '] ' + $join.call($concat.call('[cause]: ' + inspect(obj.cause), parts), ', ') + ' }';
	        }
	        if (parts.length === 0) { return '[' + String(obj) + ']'; }
	        return '{ [' + String(obj) + '] ' + $join.call(parts, ', ') + ' }';
	    }
	    if (typeof obj === 'object' && customInspect) {
	        if (inspectSymbol && typeof obj[inspectSymbol] === 'function' && utilInspect) {
	            return utilInspect(obj, { depth: maxDepth - depth });
	        } else if (customInspect !== 'symbol' && typeof obj.inspect === 'function') {
	            return obj.inspect();
	        }
	    }
	    if (isMap(obj)) {
	        var mapParts = [];
	        if (mapForEach) {
	            mapForEach.call(obj, function (value, key) {
	                mapParts.push(inspect(key, obj, true) + ' => ' + inspect(value, obj));
	            });
	        }
	        return collectionOf('Map', mapSize.call(obj), mapParts, indent);
	    }
	    if (isSet(obj)) {
	        var setParts = [];
	        if (setForEach) {
	            setForEach.call(obj, function (value) {
	                setParts.push(inspect(value, obj));
	            });
	        }
	        return collectionOf('Set', setSize.call(obj), setParts, indent);
	    }
	    if (isWeakMap(obj)) {
	        return weakCollectionOf('WeakMap');
	    }
	    if (isWeakSet(obj)) {
	        return weakCollectionOf('WeakSet');
	    }
	    if (isWeakRef(obj)) {
	        return weakCollectionOf('WeakRef');
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
	    // note: in IE 8, sometimes `global !== window` but both are the prototypes of each other
	    /* eslint-env browser */
	    if (typeof window !== 'undefined' && obj === window) {
	        return '{ [object Window] }';
	    }
	    if (
	        (typeof globalThis !== 'undefined' && obj === globalThis)
	        || (typeof commonjsGlobal !== 'undefined' && obj === commonjsGlobal)
	    ) {
	        return '{ [object globalThis] }';
	    }
	    if (!isDate$1(obj) && !isRegExp(obj)) {
	        var ys = arrObjKeys(obj, inspect);
	        var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
	        var protoTag = obj instanceof Object ? '' : 'null prototype';
	        var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr$2(obj), 8, -1) : protoTag ? 'Object' : '';
	        var constructorTag = isPlainObject || typeof obj.constructor !== 'function' ? '' : obj.constructor.name ? obj.constructor.name + ' ' : '';
	        var tag = constructorTag + (stringTag || protoTag ? '[' + $join.call($concat.call([], stringTag || [], protoTag || []), ': ') + '] ' : '');
	        if (ys.length === 0) { return tag + '{}'; }
	        if (indent) {
	            return tag + '{' + indentedJoin(ys, indent) + '}';
	        }
	        return tag + '{ ' + $join.call(ys, ', ') + ' }';
	    }
	    return String(obj);
	};

	function wrapQuotes(s, defaultStyle, opts) {
	    var quoteChar = (opts.quoteStyle || defaultStyle) === 'double' ? '"' : "'";
	    return quoteChar + s + quoteChar;
	}

	function quote(s) {
	    return $replace.call(String(s), /"/g, '&quot;');
	}

	function isArray(obj) { return toStr$2(obj) === '[object Array]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
	function isDate$1(obj) { return toStr$2(obj) === '[object Date]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
	function isRegExp(obj) { return toStr$2(obj) === '[object RegExp]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
	function isError(obj) { return toStr$2(obj) === '[object Error]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
	function isString(obj) { return toStr$2(obj) === '[object String]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
	function isNumber(obj) { return toStr$2(obj) === '[object Number]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
	function isBoolean(obj) { return toStr$2(obj) === '[object Boolean]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }

	// Symbol and BigInt do have Symbol.toStringTag by spec, so that can't be used to eliminate false positives
	function isSymbol$2(obj) {
	    if (hasShammedSymbols) {
	        return obj && typeof obj === 'object' && obj instanceof Symbol;
	    }
	    if (typeof obj === 'symbol') {
	        return true;
	    }
	    if (!obj || typeof obj !== 'object' || !symToString) {
	        return false;
	    }
	    try {
	        symToString.call(obj);
	        return true;
	    } catch (e) {}
	    return false;
	}

	function isBigInt(obj) {
	    if (!obj || typeof obj !== 'object' || !bigIntValueOf) {
	        return false;
	    }
	    try {
	        bigIntValueOf.call(obj);
	        return true;
	    } catch (e) {}
	    return false;
	}

	var hasOwn$1 = Object.prototype.hasOwnProperty || function (key) { return key in this; };
	function has(obj, key) {
	    return hasOwn$1.call(obj, key);
	}

	function toStr$2(obj) {
	    return objectToString.call(obj);
	}

	function nameOf(f) {
	    if (f.name) { return f.name; }
	    var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
	    if (m) { return m[1]; }
	    return null;
	}

	function indexOf(xs, x) {
	    if (xs.indexOf) { return xs.indexOf(x); }
	    for (var i = 0, l = xs.length; i < l; i++) {
	        if (xs[i] === x) { return i; }
	    }
	    return -1;
	}

	function isMap(x) {
	    if (!mapSize || !x || typeof x !== 'object') {
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

	function isWeakMap(x) {
	    if (!weakMapHas || !x || typeof x !== 'object') {
	        return false;
	    }
	    try {
	        weakMapHas.call(x, weakMapHas);
	        try {
	            weakSetHas.call(x, weakSetHas);
	        } catch (s) {
	            return true;
	        }
	        return x instanceof WeakMap; // core-js workaround, pre-v2.5.0
	    } catch (e) {}
	    return false;
	}

	function isWeakRef(x) {
	    if (!weakRefDeref || !x || typeof x !== 'object') {
	        return false;
	    }
	    try {
	        weakRefDeref.call(x);
	        return true;
	    } catch (e) {}
	    return false;
	}

	function isSet(x) {
	    if (!setSize || !x || typeof x !== 'object') {
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

	function isWeakSet(x) {
	    if (!weakSetHas || !x || typeof x !== 'object') {
	        return false;
	    }
	    try {
	        weakSetHas.call(x, weakSetHas);
	        try {
	            weakMapHas.call(x, weakMapHas);
	        } catch (s) {
	            return true;
	        }
	        return x instanceof WeakSet; // core-js workaround, pre-v2.5.0
	    } catch (e) {}
	    return false;
	}

	function isElement(x) {
	    if (!x || typeof x !== 'object') { return false; }
	    if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
	        return true;
	    }
	    return typeof x.nodeName === 'string' && typeof x.getAttribute === 'function';
	}

	function inspectString(str, opts) {
	    if (str.length > opts.maxStringLength) {
	        var remaining = str.length - opts.maxStringLength;
	        var trailer = '... ' + remaining + ' more character' + (remaining > 1 ? 's' : '');
	        return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
	    }
	    // eslint-disable-next-line no-control-regex
	    var s = $replace.call($replace.call(str, /(['\\])/g, '\\$1'), /[\x00-\x1f]/g, lowbyte);
	    return wrapQuotes(s, 'single', opts);
	}

	function lowbyte(c) {
	    var n = c.charCodeAt(0);
	    var x = {
	        8: 'b',
	        9: 't',
	        10: 'n',
	        12: 'f',
	        13: 'r'
	    }[n];
	    if (x) { return '\\' + x; }
	    return '\\x' + (n < 0x10 ? '0' : '') + $toUpperCase.call(n.toString(16));
	}

	function markBoxed(str) {
	    return 'Object(' + str + ')';
	}

	function weakCollectionOf(type) {
	    return type + ' { ? }';
	}

	function collectionOf(type, size, entries, indent) {
	    var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ', ');
	    return type + ' (' + size + ') {' + joinedEntries + '}';
	}

	function singleLineValues(xs) {
	    for (var i = 0; i < xs.length; i++) {
	        if (indexOf(xs[i], '\n') >= 0) {
	            return false;
	        }
	    }
	    return true;
	}

	function getIndent(opts, depth) {
	    var baseIndent;
	    if (opts.indent === '\t') {
	        baseIndent = '\t';
	    } else if (typeof opts.indent === 'number' && opts.indent > 0) {
	        baseIndent = $join.call(Array(opts.indent + 1), ' ');
	    } else {
	        return null;
	    }
	    return {
	        base: baseIndent,
	        prev: $join.call(Array(depth + 1), baseIndent)
	    };
	}

	function indentedJoin(xs, indent) {
	    if (xs.length === 0) { return ''; }
	    var lineJoiner = '\n' + indent.prev + indent.base;
	    return lineJoiner + $join.call(xs, ',' + lineJoiner) + '\n' + indent.prev;
	}

	function arrObjKeys(obj, inspect) {
	    var isArr = isArray(obj);
	    var xs = [];
	    if (isArr) {
	        xs.length = obj.length;
	        for (var i = 0; i < obj.length; i++) {
	            xs[i] = has(obj, i) ? inspect(obj[i], obj) : '';
	        }
	    }
	    var syms = typeof gOPS === 'function' ? gOPS(obj) : [];
	    var symMap;
	    if (hasShammedSymbols) {
	        symMap = {};
	        for (var k = 0; k < syms.length; k++) {
	            symMap['$' + syms[k]] = syms[k];
	        }
	    }

	    for (var key in obj) { // eslint-disable-line no-restricted-syntax
	        if (!has(obj, key)) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
	        if (isArr && String(Number(key)) === key && key < obj.length) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
	        if (hasShammedSymbols && symMap['$' + key] instanceof Symbol) {
	            // this is to prevent shammed Symbols, which are stored as strings, from being included in the string key section
	            continue; // eslint-disable-line no-restricted-syntax, no-continue
	        } else if ($test.call(/[^\w$]/, key)) {
	            xs.push(inspect(key, obj) + ': ' + inspect(obj[key], obj));
	        } else {
	            xs.push(key + ': ' + inspect(obj[key], obj));
	        }
	    }
	    if (typeof gOPS === 'function') {
	        for (var j = 0; j < syms.length; j++) {
	            if (isEnumerable.call(obj, syms[j])) {
	                xs.push('[' + inspect(syms[j]) + ']: ' + inspect(obj[syms[j]], obj));
	            }
	        }
	    }
	    return xs;
	}

	var Get$1;
	var hasRequiredGet;

	function requireGet () {
		if (hasRequiredGet) return Get$1;
		hasRequiredGet = 1;

		var $TypeError = type;

		var inspect = objectInspect;

		var IsPropertyKey = IsPropertyKey$2;
		var Type = Type$2;

		// https://262.ecma-international.org/6.0/#sec-get-o-p

		Get$1 = function Get(O, P) {
			// 7.3.1.1
			if (Type(O) !== 'Object') {
				throw new $TypeError('Assertion failed: Type(O) is not Object');
			}
			// 7.3.1.2
			if (!IsPropertyKey(P)) {
				throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true, got ' + inspect(P));
			}
			// 7.3.1.3
			return O[P];
		};
		return Get$1;
	}

	// var modulo = require('./modulo');
	var $floor = Math.floor;

	// http://262.ecma-international.org/11.0/#eqn-floor

	var floor$1 = function floor(x) {
		// return x - modulo(x, 1);
		if (typeof x === 'bigint') {
			return x;
		}
		return $floor(x);
	};

	var floor = floor$1;

	var $TypeError$5 = type;

	// https://262.ecma-international.org/14.0/#eqn-truncate

	var truncate$1 = function truncate(x) {
		if (typeof x !== 'number' && typeof x !== 'bigint') {
			throw new $TypeError$5('argument must be a Number or a BigInt');
		}
		var result = x < 0 ? -floor(-x) : floor(x);
		return result === 0 ? 0 : result; // in the spec, these are math values, so we filter out -0 here
	};

	var $isNaN = _isNaN;

	var _isFinite = function (x) { return (typeof x === 'number' || typeof x === 'bigint') && !$isNaN(x) && x !== Infinity && x !== -Infinity; };

	var truncate = truncate$1;

	var $isFinite = _isFinite;

	// https://262.ecma-international.org/14.0/#sec-isintegralnumber

	var IsIntegralNumber$1 = function IsIntegralNumber(argument) {
		if (typeof argument !== 'number' || !$isFinite(argument)) {
			return false;
		}
		return truncate(argument) === argument;
	};

	var IsIntegralNumber$2 = /*@__PURE__*/getDefaultExportFromCjs(IsIntegralNumber$1);

	var isPrimitive$2 = function isPrimitive(value) {
		return value === null || (typeof value !== 'function' && typeof value !== 'object');
	};

	var hasSymbols$2 = shams$1;

	/** @type {import('.')} */
	var shams = function hasToStringTagShams() {
		return hasSymbols$2() && !!Symbol.toStringTag;
	};

	var getDay = Date.prototype.getDay;
	var tryDateObject = function tryDateGetDayCall(value) {
		try {
			getDay.call(value);
			return true;
		} catch (e) {
			return false;
		}
	};

	var toStr$1 = Object.prototype.toString;
	var dateClass = '[object Date]';
	var hasToStringTag = shams();

	var isDateObject = function isDateObject(value) {
		if (typeof value !== 'object' || value === null) {
			return false;
		}
		return hasToStringTag ? tryDateObject(value) : toStr$1.call(value) === dateClass;
	};

	var isSymbol$1 = {exports: {}};

	var toStr = Object.prototype.toString;
	var hasSymbols$1 = hasSymbols$4();

	if (hasSymbols$1) {
		var symToStr = Symbol.prototype.toString;
		var symStringRegex = /^Symbol\(.*\)$/;
		var isSymbolObject = function isRealSymbolObject(value) {
			if (typeof value.valueOf() !== 'symbol') {
				return false;
			}
			return symStringRegex.test(symToStr.call(value));
		};

		isSymbol$1.exports = function isSymbol(value) {
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

		isSymbol$1.exports = function isSymbol(value) {
			// this environment does not support Symbols.
			return false ;
		};
	}

	var isSymbolExports = isSymbol$1.exports;

	var hasSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';

	var isPrimitive$1 = isPrimitive$2;
	var isCallable = isCallable$1;
	var isDate = isDateObject;
	var isSymbol = isSymbolExports;

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
				if (isPrimitive$1(result)) {
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
		if (isPrimitive$1(input)) {
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
		if (hasSymbols) {
			if (Symbol.toPrimitive) {
				exoticToPrim = GetMethod(input, Symbol.toPrimitive);
			} else if (isSymbol(input)) {
				exoticToPrim = Symbol.prototype.valueOf;
			}
		}
		if (typeof exoticToPrim !== 'undefined') {
			var result = exoticToPrim.call(input, hint);
			if (isPrimitive$1(result)) {
				return result;
			}
			throw new TypeError('unable to convert exotic object to primitive');
		}
		if (hint === 'default' && (isDate(input) || isSymbol(input))) {
			hint = 'string';
		}
		return ordinaryToPrimitive(input, hint === 'default' ? 'number' : hint);
	};

	var toPrimitive = es2015;

	// https://262.ecma-international.org/6.0/#sec-toprimitive

	var ToPrimitive$1 = function ToPrimitive(input) {
		if (arguments.length > 1) {
			return toPrimitive(input, arguments[1]);
		}
		return toPrimitive(input);
	};

	var ToPrimitive$2 = /*@__PURE__*/getDefaultExportFromCjs(ToPrimitive$1);

	var isRegex;
	var hasRequiredIsRegex;

	function requireIsRegex () {
		if (hasRequiredIsRegex) return isRegex;
		hasRequiredIsRegex = 1;

		var callBound = callBound$3;
		var hasToStringTag = shams();
		var has;
		var $exec;
		var isRegexMarker;
		var badStringifier;

		if (hasToStringTag) {
			has = callBound('Object.prototype.hasOwnProperty');
			$exec = callBound('RegExp.prototype.exec');
			isRegexMarker = {};

			var throwRegexMarker = function () {
				throw isRegexMarker;
			};
			badStringifier = {
				toString: throwRegexMarker,
				valueOf: throwRegexMarker
			};

			if (typeof Symbol.toPrimitive === 'symbol') {
				badStringifier[Symbol.toPrimitive] = throwRegexMarker;
			}
		}

		var $toString = callBound('Object.prototype.toString');
		var gOPD = Object.getOwnPropertyDescriptor;
		var regexClass = '[object RegExp]';

		isRegex = hasToStringTag
			// eslint-disable-next-line consistent-return
			? function isRegex(value) {
				if (!value || typeof value !== 'object') {
					return false;
				}

				var descriptor = gOPD(value, 'lastIndex');
				var hasLastIndexDataProperty = descriptor && has(descriptor, 'value');
				if (!hasLastIndexDataProperty) {
					return false;
				}

				try {
					$exec(value, badStringifier);
				} catch (e) {
					return e === isRegexMarker;
				}
			}
			: function isRegex(value) {
				// In older browsers, typeof regex incorrectly returns 'function'
				if (!value || (typeof value !== 'object' && typeof value !== 'function')) {
					return false;
				}

				return $toString(value) === regexClass;
			};
		return isRegex;
	}

	var safeRegexTest;
	var hasRequiredSafeRegexTest;

	function requireSafeRegexTest () {
		if (hasRequiredSafeRegexTest) return safeRegexTest;
		hasRequiredSafeRegexTest = 1;

		var callBound = callBound$3;
		var isRegex = requireIsRegex();

		var $exec = callBound('RegExp.prototype.exec');
		var $TypeError = type;

		safeRegexTest = function regexTester(regex) {
			if (!isRegex(regex)) {
				throw new $TypeError('`regex` must be a RegExp');
			}
			return function test(s) {
				return $exec(regex, s) !== null;
			};
		};
		return safeRegexTest;
	}

	var defineProperties_1;
	var hasRequiredDefineProperties;

	function requireDefineProperties () {
		if (hasRequiredDefineProperties) return defineProperties_1;
		hasRequiredDefineProperties = 1;

		var keys = requireObjectKeys();
		var hasSymbols = typeof Symbol === 'function' && typeof Symbol('foo') === 'symbol';

		var toStr = Object.prototype.toString;
		var concat = Array.prototype.concat;
		var defineDataProperty$1 = defineDataProperty;

		var isFunction = function (fn) {
			return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
		};

		var supportsDescriptors = hasPropertyDescriptors_1();

		var defineProperty = function (object, name, value, predicate) {
			if (name in object) {
				if (predicate === true) {
					if (object[name] === value) {
						return;
					}
				} else if (!isFunction(predicate) || !predicate()) {
					return;
				}
			}

			if (supportsDescriptors) {
				defineDataProperty$1(object, name, value, true);
			} else {
				defineDataProperty$1(object, name, value);
			}
		};

		var defineProperties = function (object, map) {
			var predicates = arguments.length > 2 ? arguments[2] : {};
			var props = keys(map);
			if (hasSymbols) {
				props = concat.call(props, Object.getOwnPropertySymbols(map));
			}
			for (var i = 0; i < props.length; i += 1) {
				defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
			}
		};

		defineProperties.supportsDescriptors = !!supportsDescriptors;

		defineProperties_1 = defineProperties;
		return defineProperties_1;
	}

	var $TypeError$4 = type;

	/** @type {import('./RequireObjectCoercible')} */
	var RequireObjectCoercible$1 = function RequireObjectCoercible(value) {
		if (value == null) {
			throw new $TypeError$4((arguments.length > 0 && arguments[1]) || ('Cannot call method on ' + value));
		}
		return value;
	};

	var GetIntrinsic$4 = getIntrinsic;

	var $String$1 = GetIntrinsic$4('%String%');
	var $TypeError$3 = type;

	// https://262.ecma-international.org/6.0/#sec-tostring

	var ToString = function ToString(argument) {
		if (typeof argument === 'symbol') {
			throw new $TypeError$3('Cannot convert a Symbol value to a string');
		}
		return $String$1(argument);
	};

	var ToString$1 = /*@__PURE__*/getDefaultExportFromCjs(ToString);

	var implementation;
	var hasRequiredImplementation;

	function requireImplementation () {
		if (hasRequiredImplementation) return implementation;
		hasRequiredImplementation = 1;

		var RequireObjectCoercible = RequireObjectCoercible$1;
		var ToString$1 = ToString;
		var callBound = callBound$3;
		var $replace = callBound('String.prototype.replace');

		var mvsIsWS = (/^\s$/).test('\u180E');
		/* eslint-disable no-control-regex */
		var leftWhitespace = mvsIsWS
			? /^[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]+/
			: /^[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]+/;
		var rightWhitespace = mvsIsWS
			? /[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]+$/
			: /[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]+$/;
		/* eslint-enable no-control-regex */

		implementation = function trim() {
			var S = ToString$1(RequireObjectCoercible(this));
			return $replace($replace(S, leftWhitespace, ''), rightWhitespace, '');
		};
		return implementation;
	}

	var polyfill;
	var hasRequiredPolyfill;

	function requirePolyfill () {
		if (hasRequiredPolyfill) return polyfill;
		hasRequiredPolyfill = 1;

		var implementation = requireImplementation();

		var zeroWidthSpace = '\u200b';
		var mongolianVowelSeparator = '\u180E';

		polyfill = function getPolyfill() {
			if (
				String.prototype.trim
				&& zeroWidthSpace.trim() === zeroWidthSpace
				&& mongolianVowelSeparator.trim() === mongolianVowelSeparator
				&& ('_' + mongolianVowelSeparator).trim() === ('_' + mongolianVowelSeparator)
				&& (mongolianVowelSeparator + '_').trim() === (mongolianVowelSeparator + '_')
			) {
				return String.prototype.trim;
			}
			return implementation;
		};
		return polyfill;
	}

	var shim;
	var hasRequiredShim;

	function requireShim () {
		if (hasRequiredShim) return shim;
		hasRequiredShim = 1;

		var define = requireDefineProperties();
		var getPolyfill = requirePolyfill();

		shim = function shimStringTrim() {
			var polyfill = getPolyfill();
			define(String.prototype, { trim: polyfill }, {
				trim: function testTrim() {
					return String.prototype.trim !== polyfill;
				}
			});
			return polyfill;
		};
		return shim;
	}

	var string_prototype_trim;
	var hasRequiredString_prototype_trim;

	function requireString_prototype_trim () {
		if (hasRequiredString_prototype_trim) return string_prototype_trim;
		hasRequiredString_prototype_trim = 1;

		var callBind = callBindExports;
		var define = requireDefineProperties();
		var RequireObjectCoercible = RequireObjectCoercible$1;

		var implementation = requireImplementation();
		var getPolyfill = requirePolyfill();
		var shim = requireShim();

		var bound = callBind(getPolyfill());
		var boundMethod = function trim(receiver) {
			RequireObjectCoercible(receiver);
			return bound(receiver);
		};

		define(boundMethod, {
			getPolyfill: getPolyfill,
			implementation: implementation,
			shim: shim
		});

		string_prototype_trim = boundMethod;
		return string_prototype_trim;
	}

	var StringToNumber$1;
	var hasRequiredStringToNumber;

	function requireStringToNumber () {
		if (hasRequiredStringToNumber) return StringToNumber$1;
		hasRequiredStringToNumber = 1;

		var GetIntrinsic = getIntrinsic;

		var $Number = GetIntrinsic('%Number%');
		var $RegExp = GetIntrinsic('%RegExp%');
		var $TypeError = type;
		var $parseInteger = GetIntrinsic('%parseInt%');

		var callBound = callBound$3;
		var regexTester = requireSafeRegexTest();

		var $strSlice = callBound('String.prototype.slice');
		var isBinary = regexTester(/^0b[01]+$/i);
		var isOctal = regexTester(/^0o[0-7]+$/i);
		var isInvalidHexLiteral = regexTester(/^[-+]0x[0-9a-f]+$/i);
		var nonWS = ['\u0085', '\u200b', '\ufffe'].join('');
		var nonWSregex = new $RegExp('[' + nonWS + ']', 'g');
		var hasNonWS = regexTester(nonWSregex);

		var $trim = requireString_prototype_trim();

		// https://262.ecma-international.org/13.0/#sec-stringtonumber

		StringToNumber$1 = function StringToNumber(argument) {
			if (typeof argument !== 'string') {
				throw new $TypeError('Assertion failed: `argument` is not a String');
			}
			if (isBinary(argument)) {
				return $Number($parseInteger($strSlice(argument, 2), 2));
			}
			if (isOctal(argument)) {
				return $Number($parseInteger($strSlice(argument, 2), 8));
			}
			if (hasNonWS(argument) || isInvalidHexLiteral(argument)) {
				return NaN;
			}
			var trimmed = $trim(argument);
			if (trimmed !== argument) {
				return StringToNumber(trimmed);
			}
			return $Number(argument);
		};
		return StringToNumber$1;
	}

	var GetIntrinsic$3 = getIntrinsic;

	var $TypeError$2 = type;
	var $Number = GetIntrinsic$3('%Number%');
	var isPrimitive = requireIsPrimitive();

	var ToPrimitive = ToPrimitive$1;
	var StringToNumber = requireStringToNumber();

	// https://262.ecma-international.org/13.0/#sec-tonumber

	var ToNumber$1 = function ToNumber(argument) {
		var value = isPrimitive(argument) ? argument : ToPrimitive(argument, $Number);
		if (typeof value === 'symbol') {
			throw new $TypeError$2('Cannot convert a Symbol value to a number');
		}
		if (typeof value === 'bigint') {
			throw new $TypeError$2('Conversion from \'BigInt\' to \'number\' is not allowed.');
		}
		if (typeof value === 'string') {
			return StringToNumber(value);
		}
		return $Number(value);
	};

	var ToNumber$2 = /*@__PURE__*/getDefaultExportFromCjs(ToNumber$1);

	/** @type {import('.')} */
	var esObjectAtoms = Object;

	var $Object = esObjectAtoms;
	var RequireObjectCoercible = RequireObjectCoercible$1;

	/** @type {import('./ToObject')} */
	var ToObject$3 = function ToObject(value) {
		RequireObjectCoercible(value);
		return $Object(value);
	};

	// https://262.ecma-international.org/6.0/#sec-toobject

	var ToObject$1 = ToObject$3;

	var ToObject$2 = /*@__PURE__*/getDefaultExportFromCjs(ToObject$1);

	var $TypeError$1 = type;

	var callBound = callBound$3;
	var forEach = forEach$1;
	var every = every$1;
	var some = some$1;
	var OwnPropertyKeys = OwnPropertyKeys$1;

	var $isEnumerable = callBound('Object.prototype.propertyIsEnumerable');

	var CreateDataPropertyOrThrow = requireCreateDataPropertyOrThrow();
	var Get = requireGet();
	var IsArray = IsArray$2;
	var IsIntegralNumber = IsIntegralNumber$1;
	var IsPropertyKey$1 = IsPropertyKey$2;
	var SameValue = requireSameValue();
	var ToNumber = ToNumber$1;
	var ToObject = ToObject$1;
	var Type$1 = Type$2;

	// https://262.ecma-international.org/12.0/#sec-copydataproperties

	var CopyDataProperties = function CopyDataProperties(target, source, excludedItems) {
		if (Type$1(target) !== 'Object') {
			throw new $TypeError$1('Assertion failed: "target" must be an Object');
		}

		if (!IsArray(excludedItems) || !every(excludedItems, IsPropertyKey$1)) {
			throw new $TypeError$1('Assertion failed: "excludedItems" must be a List of Property Keys');
		}

		if (typeof source === 'undefined' || source === null) {
			return target;
		}

		var from = ToObject(source);

		var keys = OwnPropertyKeys(from);
		forEach(keys, function (nextKey) {
			var excluded = some(excludedItems, function (e) {
				return SameValue(e, nextKey) === true;
			});
			/*
			var excluded = false;

			forEach(excludedItems, function (e) {
				if (SameValue(e, nextKey) === true) {
					excluded = true;
				}
			});
			*/

			var enumerable = $isEnumerable(from, nextKey) || (
			// this is to handle string keys being non-enumerable in older engines
				typeof source === 'string'
				&& nextKey >= 0
				&& IsIntegralNumber(ToNumber(nextKey))
			);
			if (excluded === false && enumerable) {
				var propValue = Get(from, nextKey);
				CreateDataPropertyOrThrow(target, nextKey, propValue);
			}
		});

		return target;
	};

	var CopyDataProperties$1 = /*@__PURE__*/getDefaultExportFromCjs(CopyDataProperties);

	var $TypeError = type;

	var hasOwn = hasown;

	var IsPropertyKey = IsPropertyKey$2;
	var Type = Type$2;

	// https://262.ecma-international.org/6.0/#sec-hasownproperty

	var HasOwnProperty = function HasOwnProperty(O, P) {
		if (Type(O) !== 'Object') {
			throw new $TypeError('Assertion failed: `O` must be an Object');
		}
		if (!IsPropertyKey(P)) {
			throw new $TypeError('Assertion failed: `P` must be a Property Key');
		}
		return hasOwn(O, P);
	};

	var HasOwnProperty$1 = /*@__PURE__*/getDefaultExportFromCjs(HasOwnProperty);

	var isInteger$1;
	var hasRequiredIsInteger;

	function requireIsInteger () {
		if (hasRequiredIsInteger) return isInteger$1;
		hasRequiredIsInteger = 1;

		var GetIntrinsic = getIntrinsic;

		var $abs = GetIntrinsic('%Math.abs%');
		var $floor = GetIntrinsic('%Math.floor%');

		var $isNaN = _isNaN;
		var $isFinite = _isFinite;

		isInteger$1 = function isInteger(argument) {
			if (typeof argument !== 'number' || $isNaN(argument) || !$isFinite(argument)) {
				return false;
			}
			var absValue = $abs(argument);
			return $floor(absValue) === absValue;
		};
		return isInteger$1;
	}

	var StringPad$1;
	var hasRequiredStringPad;

	function requireStringPad () {
		if (hasRequiredStringPad) return StringPad$1;
		hasRequiredStringPad = 1;

		var $TypeError = type;

		var callBound = callBound$3;

		var isInteger = requireIsInteger();

		var $strSlice = callBound('String.prototype.slice');

		// https://262.ecma-international.org/15.0/#sec-stringpad

		StringPad$1 = function StringPad(S, maxLength, fillString, placement) {
			if (typeof S !== 'string') {
				throw new $TypeError('Assertion failed: `S` must be a String');
			}
			if (!isInteger(maxLength) || maxLength < 0) {
				throw new $TypeError('Assertion failed: `maxLength` must be a non-negative integer');
			}
			if (typeof fillString !== 'string') {
				throw new $TypeError('Assertion failed: `fillString` must be a String');
			}
			if (placement !== 'start' && placement !== 'end' && placement !== 'START' && placement !== 'END') {
				throw new $TypeError('Assertion failed: `placement` must be ~START~ or ~END~');
			}

			var stringLength = S.length; // step 1

			if (maxLength <= stringLength) { return S; } // step 2

			if (fillString === '') { return S; } // step 3

			var fillLen = maxLength - stringLength; // step 4

			// 5. Let _truncatedStringFiller_ be the String value consisting of repeated concatenations of _fillString_ truncated to length _fillLen_.
			var truncatedStringFiller = '';
			while (truncatedStringFiller.length < fillLen) {
				truncatedStringFiller += fillString;
			}
			truncatedStringFiller = $strSlice(truncatedStringFiller, 0, fillLen);

			if (placement === 'start' || placement === 'START') { return truncatedStringFiller + S; } // step 6

			return S + truncatedStringFiller; // step 7
		};
		return StringPad$1;
	}

	var GetIntrinsic$2 = getIntrinsic;

	var $String = GetIntrinsic$2('%String%');
	var $RangeError = requireRange();

	var StringPad = requireStringPad();

	var isInteger = requireIsInteger();

	// https://262.ecma-international.org/13.0/#sec-tozeropaddeddecimalstring

	var ToZeroPaddedDecimalString = function ToZeroPaddedDecimalString(n, minLength) {
		if (!isInteger(n) || n < 0) {
			throw new $RangeError('Assertion failed: `q` must be a non-negative integer');
		}
		var S = $String(n);
		return StringPad(S, minLength, '0', 'start');
	};

	var ToZeroPaddedDecimalString$1 = /*@__PURE__*/getDefaultExportFromCjs(ToZeroPaddedDecimalString);

	// TODO: remove, semver-major

	var GetIntrinsic$1 = getIntrinsic;

	var ESGetIntrinsic = /*@__PURE__*/getDefaultExportFromCjs(GetIntrinsic$1);

	/* global true */

	const INTRINSICS = {};
	const customUtilInspectFormatters = {
	  ['Temporal.Duration'](depth, options) {
	    const descr = options.stylize(this._repr_, 'special');
	    if (depth < 1) return descr;
	    const entries = [];
	    for (const prop of ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds']) {
	      if (this[prop] !== 0) entries.push(`  ${prop}: ${options.stylize(this[prop], 'number')}`);
	    }
	    return descr + ' {\n' + entries.join(',\n') + '\n}';
	  }
	};
	function defaultUtilInspectFormatter(depth, options) {
	  return options.stylize(this._repr_, 'special');
	}
	function MakeIntrinsicClass(Class, name) {
	  Object.defineProperty(Class.prototype, Symbol.toStringTag, {
	    value: name,
	    writable: false,
	    enumerable: false,
	    configurable: true
	  });
	  {
	    Object.defineProperty(Class.prototype, Symbol.for('nodejs.util.inspect.custom'), {
	      value: customUtilInspectFormatters[name] || defaultUtilInspectFormatter,
	      writable: false,
	      enumerable: false,
	      configurable: true
	    });
	  }
	  for (let prop of Object.getOwnPropertyNames(Class)) {
	    const desc = Object.getOwnPropertyDescriptor(Class, prop);
	    if (!desc.configurable || !desc.enumerable) continue;
	    desc.enumerable = false;
	    Object.defineProperty(Class, prop, desc);
	  }
	  for (let prop of Object.getOwnPropertyNames(Class.prototype)) {
	    const desc = Object.getOwnPropertyDescriptor(Class.prototype, prop);
	    if (!desc.configurable || !desc.enumerable) continue;
	    desc.enumerable = false;
	    Object.defineProperty(Class.prototype, prop, desc);
	  }
	  DefineIntrinsic(name, Class);
	  DefineIntrinsic(`${name}.prototype`, Class.prototype);
	}
	function DefineIntrinsic(name, value) {
	  const key = `%${name}%`;
	  if (INTRINSICS[key] !== undefined) throw new Error(`intrinsic ${name} already exists`);
	  INTRINSICS[key] = value;
	}
	function GetIntrinsic(intrinsic) {
	  return intrinsic in INTRINSICS ? INTRINSICS[intrinsic] : ESGetIntrinsic(intrinsic);
	}

	const MathAbs$3 = Math.abs;
	const MathLog10 = Math.log10;
	const MathSign$2 = Math.sign;
	const MathTrunc$1 = Math.trunc;
	const NumberParseInt = Number.parseInt;
	const NumberPrototypeToPrecision = Number.prototype.toPrecision;
	const StringPrototypePadStart = String.prototype.padStart;
	const StringPrototypeRepeat = String.prototype.repeat;
	const StringPrototypeSlice$1 = String.prototype.slice;

	// Computes trunc(x / 10**p) and x % 10**p, returning { div, mod }, with
	// precision loss only once in the quotient, by string manipulation. If the
	// quotient and remainder are safe integers, then they are exact. x must be an
	// integer. p must be a non-negative integer. Both div and mod have the sign of
	// x.
	function TruncatingDivModByPowerOf10(x, p) {
	  if (x === 0) return {
	    div: x,
	    mod: x
	  }; // preserves signed zero

	  const sign = MathSign$2(x);
	  x = MathAbs$3(x);
	  const xDigits = MathTrunc$1(1 + MathLog10(x));
	  if (p >= xDigits) return {
	    div: sign * 0,
	    mod: sign * x
	  };
	  if (p === 0) return {
	    div: sign * x,
	    mod: sign * 0
	  };

	  // would perform nearest rounding if x was not an integer:
	  const xStr = Call$1(NumberPrototypeToPrecision, x, [xDigits]);
	  const div = sign * NumberParseInt(Call$1(StringPrototypeSlice$1, xStr, [0, xDigits - p]), 10);
	  const mod = sign * NumberParseInt(Call$1(StringPrototypeSlice$1, xStr, [xDigits - p]), 10);
	  return {
	    div,
	    mod
	  };
	}

	// Computes x * 10**p + z with precision loss only at the end, by string
	// manipulation. If the result is a safe integer, then it is exact. x must be
	// an integer. p must be a non-negative integer. z must have the same sign as
	// x and be less than 10**p.
	function FMAPowerOf10(x, p, z) {
	  if (x === 0) return z;
	  const sign = MathSign$2(x) || MathSign$2(z);
	  x = MathAbs$3(x);
	  z = MathAbs$3(z);
	  const xStr = Call$1(NumberPrototypeToPrecision, x, [MathTrunc$1(1 + MathLog10(x))]);
	  if (z === 0) return sign * NumberParseInt(xStr + Call$1(StringPrototypeRepeat, '0', [p]), 10);
	  const zStr = Call$1(NumberPrototypeToPrecision, z, [MathTrunc$1(1 + MathLog10(z))]);
	  const resStr = xStr + Call$1(StringPrototypePadStart, zStr, [p, '0']);
	  return sign * NumberParseInt(resStr, 10);
	}
	function GetUnsignedRoundingMode(mode, sign) {
	  const index = +(sign === 'negative'); // 0 = positive, 1 = negative
	  switch (mode) {
	    case 'ceil':
	      return ['infinity', 'zero'][index];
	    case 'floor':
	      return ['zero', 'infinity'][index];
	    case 'expand':
	      return 'infinity';
	    case 'trunc':
	      return 'zero';
	    case 'halfCeil':
	      return ['half-infinity', 'half-zero'][index];
	    case 'halfFloor':
	      return ['half-zero', 'half-infinity'][index];
	    case 'halfExpand':
	      return 'half-infinity';
	    case 'halfTrunc':
	      return 'half-zero';
	    case 'halfEven':
	      return 'half-even';
	  }
	}

	// Omits first step from spec algorithm so that it can be used both for
	// RoundNumberToIncrement and RoundNormalizedTimeDurationToIncrement
	function ApplyUnsignedRoundingMode(r1, r2, cmp, evenCardinality, unsignedRoundingMode) {
	  if (unsignedRoundingMode === 'zero') return r1;
	  if (unsignedRoundingMode === 'infinity') return r2;
	  if (cmp < 0) return r1;
	  if (cmp > 0) return r2;
	  if (unsignedRoundingMode === 'half-zero') return r1;
	  if (unsignedRoundingMode === 'half-infinity') return r2;
	  return evenCardinality ? r1 : r2;
	}

	const MathAbs$2 = Math.abs;
	const MathSign$1 = Math.sign;
	const NumberIsInteger = Number.isInteger;
	const NumberIsSafeInteger$1 = Number.isSafeInteger;
	class TimeDuration {
	  static MAX = (() => bigInt('9007199254740991999999999'))();
	  static ZERO = (() => new TimeDuration(bigInt.zero))();
	  constructor(totalNs) {
	    if (typeof totalNs === 'number') throw new Error('assertion failed: big integer required');
	    this.totalNs = bigInt(totalNs);
	    if (this.totalNs.abs().greater(TimeDuration.MAX)) throw new Error('assertion failed: integer too big');
	    const {
	      quotient,
	      remainder
	    } = this.totalNs.divmod(1e9);
	    this.sec = quotient.toJSNumber();
	    this.subsec = remainder.toJSNumber();
	    if (!NumberIsSafeInteger$1(this.sec)) throw new Error('assertion failed: seconds too big');
	    if (MathAbs$2(this.subsec) > 999_999_999) throw new Error('assertion failed: subseconds too big');
	  }
	  static #validateNew(totalNs, operation) {
	    if (totalNs.abs().greater(TimeDuration.MAX)) {
	      throw new RangeError(`${operation} of duration time units cannot exceed ${TimeDuration.MAX} s`);
	    }
	    return new TimeDuration(totalNs);
	  }
	  static fromEpochNsDiff(epochNs1, epochNs2) {
	    const diff = bigInt(epochNs1).subtract(epochNs2);
	    // No extra validate step. Should instead fail assertion if too big
	    return new TimeDuration(diff);
	  }
	  static normalize(h, min, s, ms, µs, ns) {
	    const totalNs = bigInt(ns).add(bigInt(µs).multiply(1e3)).add(bigInt(ms).multiply(1e6)).add(bigInt(s).multiply(1e9)).add(bigInt(min).multiply(60e9)).add(bigInt(h).multiply(3600e9));
	    return TimeDuration.#validateNew(totalNs, 'total');
	  }
	  abs() {
	    return new TimeDuration(this.totalNs.abs());
	  }
	  add(other) {
	    return TimeDuration.#validateNew(this.totalNs.add(other.totalNs), 'sum');
	  }
	  add24HourDays(days) {
	    if (!NumberIsInteger(days)) throw new Error('assertion failed: days is an integer');
	    return TimeDuration.#validateNew(this.totalNs.add(bigInt(days).multiply(86400e9)), 'sum');
	  }
	  addToEpochNs(epochNs) {
	    return bigInt(epochNs).add(this.totalNs);
	  }
	  cmp(other) {
	    return this.totalNs.compare(other.totalNs);
	  }
	  divmod(n) {
	    if (n === 0) throw new Error('division by zero');
	    const {
	      quotient,
	      remainder
	    } = this.totalNs.divmod(n);
	    const q = quotient.toJSNumber();
	    const r = new TimeDuration(remainder);
	    return {
	      quotient: q,
	      remainder: r
	    };
	  }
	  fdiv(n) {
	    n = bigInt(n);
	    if (n.isZero()) throw new Error('division by zero');
	    let {
	      quotient,
	      remainder
	    } = this.totalNs.divmod(n);

	    // Perform long division to calculate the fractional part of the quotient
	    // remainder / n with more accuracy than 64-bit floating point division
	    const precision = 50;
	    const decimalDigits = [];
	    let digit;
	    const sign = (this.totalNs.geq(0) ? 1 : -1) * MathSign$1(n);
	    while (!remainder.isZero() && decimalDigits.length < precision) {
	      remainder = remainder.multiply(10);
	      ({
	        quotient: digit,
	        remainder
	      } = remainder.divmod(n));
	      decimalDigits.push(MathAbs$2(digit.toJSNumber()));
	    }
	    return sign * Number(quotient.abs().toString() + '.' + decimalDigits.join(''));
	  }
	  isZero() {
	    return this.totalNs.isZero();
	  }
	  round(increment, mode) {
	    const {
	      quotient,
	      remainder
	    } = this.totalNs.divmod(increment);
	    const sign = this.totalNs.lt(0) ? 'negative' : 'positive';
	    const r1 = quotient.abs().multiply(increment);
	    const r2 = r1.add(increment);
	    const cmp = remainder.multiply(2).abs().compare(increment);
	    const even = quotient.isEven();
	    const unsignedRoundingMode = GetUnsignedRoundingMode(mode, sign);
	    const rounded = this.totalNs.abs().eq(r1) ? r1 : ApplyUnsignedRoundingMode(r1, r2, cmp, even, unsignedRoundingMode);
	    const result = sign === 'positive' ? rounded : rounded.multiply(-1);
	    return TimeDuration.#validateNew(result, 'rounding');
	  }
	  sign() {
	    return this.cmp(new TimeDuration(0n));
	  }
	  subtract(other) {
	    return TimeDuration.#validateNew(this.totalNs.subtract(other.totalNs), 'difference');
	  }
	}

	// Instant
	const EPOCHNANOSECONDS = 'slot-epochNanoSeconds';

	// DateTime, Date, Time, YearMonth, MonthDay
	const ISO_YEAR = 'slot-year';
	const ISO_MONTH = 'slot-month';
	const ISO_DAY = 'slot-day';
	const ISO_HOUR = 'slot-hour';
	const ISO_MINUTE = 'slot-minute';
	const ISO_SECOND = 'slot-second';
	const ISO_MILLISECOND = 'slot-millisecond';
	const ISO_MICROSECOND = 'slot-microsecond';
	const ISO_NANOSECOND = 'slot-nanosecond';
	const CALENDAR = 'slot-calendar';
	// Date, YearMonth, and MonthDay all have the same slots, disambiguation needed:
	const DATE_BRAND = 'slot-date-brand';
	const YEAR_MONTH_BRAND = 'slot-year-month-brand';
	const MONTH_DAY_BRAND = 'slot-month-day-brand';

	// ZonedDateTime
	const TIME_ZONE = 'slot-time-zone';

	// Duration
	const YEARS = 'slot-years';
	const MONTHS = 'slot-months';
	const WEEKS = 'slot-weeks';
	const DAYS = 'slot-days';
	const HOURS = 'slot-hours';
	const MINUTES = 'slot-minutes';
	const SECONDS = 'slot-seconds';
	const MILLISECONDS = 'slot-milliseconds';
	const MICROSECONDS = 'slot-microseconds';
	const NANOSECONDS = 'slot-nanoseconds';
	const slots = new WeakMap();
	function CreateSlots(container) {
	  slots.set(container, Object.create(null));
	}
	function GetSlots(container) {
	  return slots.get(container);
	}
	function HasSlot(container) {
	  if (!container || 'object' !== typeof container) return false;
	  const myslots = GetSlots(container);
	  for (var _len = arguments.length, ids = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    ids[_key - 1] = arguments[_key];
	  }
	  return !!myslots && ids.reduce((all, id) => all && id in myslots, true);
	}
	function GetSlot(container, id) {
	  return GetSlots(container)[id];
	}
	function SetSlot(container, id, value) {
	  GetSlots(container)[id] = value;
	}

	const offsetIdentifierNoCapture = /(?:[+-](?:[01][0-9]|2[0-3])(?::?[0-5][0-9])?)/;
	const tzComponent = /[A-Za-z._][A-Za-z._0-9+-]*/;
	const timeZoneID = new RegExp(`(?:${offsetIdentifierNoCapture.source}|(?:${tzComponent.source})(?:\\/(?:${tzComponent.source}))*)`);
	const yearpart = /(?:[+-]\d{6}|\d{4})/;
	const monthpart = /(?:0[1-9]|1[0-2])/;
	const daypart = /(?:0[1-9]|[12]\d|3[01])/;
	const datesplit = new RegExp(`(${yearpart.source})(?:-(${monthpart.source})-(${daypart.source})|(${monthpart.source})(${daypart.source}))`);
	const timesplit = /(\d{2})(?::(\d{2})(?::(\d{2})(?:[.,](\d{1,9}))?)?|(\d{2})(?:(\d{2})(?:[.,](\d{1,9}))?)?)?/;
	const offsetWithParts = /([+-])([01][0-9]|2[0-3])(?::?([0-5][0-9])(?::?([0-5][0-9])(?:[.,](\d{1,9}))?)?)?/;
	const offset = /((?:[+-])(?:[01][0-9]|2[0-3])(?::?(?:[0-5][0-9])(?::?(?:[0-5][0-9])(?:[.,](?:\d{1,9}))?)?)?)/;
	const offsetpart = new RegExp(`([zZ])|${offset.source}?`);
	const offsetIdentifier = /([+-])([01][0-9]|2[0-3])(?::?([0-5][0-9])?)?/;
	const annotation = /\[(!)?([a-z_][a-z0-9_-]*)=([A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)\]/g;
	const zoneddatetime = new RegExp([`^${datesplit.source}`, `(?:(?:[tT]|\\s+)${timesplit.source}(?:${offsetpart.source})?)?`, `(?:\\[!?(${timeZoneID.source})\\])?`, `((?:${annotation.source})*)$`].join(''));
	const time = new RegExp([`^[tT]?${timesplit.source}`, `(?:${offsetpart.source})?`, `(?:\\[!?${timeZoneID.source}\\])?`, `((?:${annotation.source})*)$`].join(''));

	// The short forms of YearMonth and MonthDay are only for the ISO calendar, but
	// annotations are still allowed, and will throw if the calendar annotation is
	// not ISO.
	// Non-ISO calendar YearMonth and MonthDay have to parse as a Temporal.PlainDate,
	// with the reference fields.
	// YYYYMM forbidden by ISO 8601 because ambiguous with YYMMDD, but allowed by
	// RFC 3339 and we don't allow 2-digit years, so we allow it.
	// Not ambiguous with HHMMSS because that requires a 'T' prefix
	// UTC offsets are not allowed, because they are not allowed with any date-only
	// format; also, YYYY-MM-UU is ambiguous with YYYY-MM-DD
	const yearmonth = new RegExp(`^(${yearpart.source})-?(${monthpart.source})(?:\\[!?${timeZoneID.source}\\])?((?:${annotation.source})*)$`);
	const monthday = new RegExp(`^(?:--)?(${monthpart.source})-?(${daypart.source})(?:\\[!?${timeZoneID.source}\\])?((?:${annotation.source})*)$`);
	const fraction = /(\d+)(?:[.,](\d{1,9}))?/;
	const durationDate = /(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?/;
	const durationTime = new RegExp(`(?:${fraction.source}H)?(?:${fraction.source}M)?(?:${fraction.source}S)?`);
	const duration = new RegExp(`^([+-])?P${durationDate.source}(?:T(?!$)${durationTime.source})?$`, 'i');

	/* global true */

	const ArrayIncludes = Array.prototype.includes;
	const ArrayPrototypeConcat = Array.prototype.concat;
	const ArrayPrototypeFilter = Array.prototype.filter;
	const ArrayPrototypePush = Array.prototype.push;
	const ArrayPrototypeSort$1 = Array.prototype.sort;
	const IntlDateTimeFormat$2 = globalThis.Intl.DateTimeFormat;
	const IntlSupportedValuesOf = globalThis.Intl.supportedValuesOf;
	const MapCtor = Map;
	const MapPrototypeSet$1 = Map.prototype.set;
	const MathAbs$1 = Math.abs;
	const MathFloor$1 = Math.floor;
	const MathMax = Math.max;
	const MathMin = Math.min;
	const MathSign = Math.sign;
	const MathTrunc = Math.trunc;
	const NumberIsFinite = Number.isFinite;
	const NumberIsNaN$1 = Number.isNaN;
	const NumberIsSafeInteger = Number.isSafeInteger;
	const NumberMaxSafeInteger = Number.MAX_SAFE_INTEGER;
	const ObjectCreate$6 = Object.create;
	const ObjectDefineProperty$1 = Object.defineProperty;
	const ObjectEntries$1 = Object.entries;
	const SetPrototypeHas = Set.prototype.has;
	const StringCtor = String;
	const StringFromCharCode = String.fromCharCode;
	const StringPrototypeCharCodeAt = String.prototype.charCodeAt;
	const StringPrototypeMatchAll = String.prototype.matchAll;
	const StringPrototypeReplace = String.prototype.replace;
	const StringPrototypeSlice = String.prototype.slice;
	const DAY_SECONDS = 86400;
	const DAY_NANOS = DAY_SECONDS * 1e9;
	// Instant range is 100 million days (inclusive) before or after epoch.
	const NS_MIN = bigInt(DAY_NANOS).multiply(-1e8);
	const NS_MAX = bigInt(DAY_NANOS).multiply(1e8);
	// PlainDateTime range is 24 hours wider (exclusive) than the Instant range on
	// both ends, to allow for valid Instant=>PlainDateTime conversion for all
	// built-in time zones (whose offsets must have a magnitude less than 24 hours).
	const DATETIME_NS_MIN = NS_MIN.subtract(DAY_NANOS).add(bigInt.one);
	const DATETIME_NS_MAX = NS_MAX.add(DAY_NANOS).subtract(bigInt.one);
	// The pattern of leap years in the ISO 8601 calendar repeats every 400 years.
	// The constant below is the number of nanoseconds in 400 years. It is used to
	// avoid overflows when dealing with values at the edge legacy Date's range.
	const NS_IN_400_YEAR_CYCLE = bigInt(400 * 365 + 97).multiply(DAY_NANOS);
	const YEAR_MIN = -271821;
	const YEAR_MAX = 275760;
	const BEFORE_FIRST_DST = bigInt(-388152).multiply(1e13); // 1847-01-01T00:00:00Z

	const BUILTIN_CALENDAR_IDS = ['iso8601', 'hebrew', 'islamic', 'islamic-umalqura', 'islamic-tbla', 'islamic-civil', 'islamic-rgsa', 'islamicc', 'persian', 'ethiopic', 'ethioaa', 'ethiopic-amete-alem', 'coptic', 'chinese', 'dangi', 'roc', 'indian', 'buddhist', 'japanese', 'gregory'];
	const ICU_LEGACY_TIME_ZONE_IDS = new Set(['ACT', 'AET', 'AGT', 'ART', 'AST', 'BET', 'BST', 'CAT', 'CNT', 'CST', 'CTT', 'EAT', 'ECT', 'IET', 'IST', 'JST', 'MIT', 'NET', 'NST', 'PLT', 'PNT', 'PRT', 'PST', 'SST', 'VST']);
	function ToIntegerWithTruncation(value) {
	  const number = ToNumber$2(value);
	  if (number === 0) return 0;
	  if (NumberIsNaN$1(number) || !NumberIsFinite(number)) {
	    throw new RangeError('invalid number value');
	  }
	  const integer = MathTrunc(number);
	  if (integer === 0) return 0; // ℝ(value) in spec text; converts -0 to 0
	  return integer;
	}
	function ToPositiveIntegerWithTruncation(value, property) {
	  const integer = ToIntegerWithTruncation(value);
	  if (integer <= 0) {
	    if (property !== undefined) {
	      throw new RangeError(`property '${property}' cannot be a a number less than one`);
	    }
	    throw new RangeError('Cannot convert a number less than one to a positive integer');
	  }
	  return integer;
	}
	function ToIntegerIfIntegral(value) {
	  const number = ToNumber$2(value);
	  if (!NumberIsFinite(number)) throw new RangeError('infinity is out of range');
	  if (!IsIntegralNumber$2(number)) throw new RangeError(`unsupported fractional value ${value}`);
	  if (number === 0) return 0; // ℝ(value) in spec text; converts -0 to 0
	  return number;
	}

	// This convenience function isn't in the spec, but is useful in the polyfill
	// for DRY and better error messages.
	function RequireString(value) {
	  if (Type$3(value) !== 'String') {
	    // Use String() to ensure that Symbols won't throw
	    throw new TypeError(`expected a string, not ${StringCtor(value)}`);
	  }
	  return value;
	}

	// This function is an enum in the spec, but it's helpful to make it a
	// function in the polyfill.
	function ToPrimitiveAndRequireString(value) {
	  value = ToPrimitive$2(value, StringCtor);
	  return RequireString(value);
	}
	const CALENDAR_FIELD_KEYS = ['era', 'eraYear', 'year', 'month', 'monthCode', 'day', 'hour', 'minute', 'second', 'millisecond', 'microsecond', 'nanosecond', 'offset', 'timeZone'];
	const BUILTIN_CASTS = new Map([['era', ToString$1], ['eraYear', ToIntegerWithTruncation], ['year', ToIntegerWithTruncation], ['month', ToPositiveIntegerWithTruncation], ['monthCode', ToPrimitiveAndRequireString], ['day', ToPositiveIntegerWithTruncation], ['hour', ToIntegerWithTruncation], ['minute', ToIntegerWithTruncation], ['second', ToIntegerWithTruncation], ['millisecond', ToIntegerWithTruncation], ['microsecond', ToIntegerWithTruncation], ['nanosecond', ToIntegerWithTruncation], ['offset', ToPrimitiveAndRequireString], ['timeZone', ToTemporalTimeZoneIdentifier]]);
	const BUILTIN_DEFAULTS = new Map([['hour', 0], ['minute', 0], ['second', 0], ['millisecond', 0], ['microsecond', 0], ['nanosecond', 0]]);

	// each item is [plural, singular, category, (length in ns)]
	const TEMPORAL_UNITS = [['years', 'year', 'date'], ['months', 'month', 'date'], ['weeks', 'week', 'date'], ['days', 'day', 'date', DAY_NANOS], ['hours', 'hour', 'time', 3600e9], ['minutes', 'minute', 'time', 60e9], ['seconds', 'second', 'time', 1e9], ['milliseconds', 'millisecond', 'time', 1e6], ['microseconds', 'microsecond', 'time', 1e3], ['nanoseconds', 'nanosecond', 'time', 1]];
	const SINGULAR_FOR = new Map(TEMPORAL_UNITS);
	const PLURAL_FOR = new Map(TEMPORAL_UNITS.map(_ref => {
	  let [p, s] = _ref;
	  return [s, p];
	}));
	const UNITS_DESCENDING = TEMPORAL_UNITS.map(_ref2 => {
	  let [, s] = _ref2;
	  return s;
	});
	const NS_PER_TIME_UNIT = new Map(TEMPORAL_UNITS.map(_ref3 => {
	  let [, s,, l] = _ref3;
	  return [s, l];
	}).filter(_ref4 => {
	  let [, l] = _ref4;
	  return l;
	}));
	const DURATION_FIELDS = ['days', 'hours', 'microseconds', 'milliseconds', 'minutes', 'months', 'nanoseconds', 'seconds', 'weeks', 'years'];
	const IntlDateTimeFormatEnUsCache = new Map();
	function getIntlDateTimeFormatEnUsForTimeZone(timeZoneIdentifier) {
	  const lowercaseIdentifier = ASCIILowercase(timeZoneIdentifier);
	  let instance = IntlDateTimeFormatEnUsCache.get(lowercaseIdentifier);
	  if (instance === undefined) {
	    instance = new IntlDateTimeFormat$2('en-us', {
	      timeZone: lowercaseIdentifier,
	      hour12: false,
	      era: 'short',
	      year: 'numeric',
	      month: 'numeric',
	      day: 'numeric',
	      hour: 'numeric',
	      minute: 'numeric',
	      second: 'numeric'
	    });
	    IntlDateTimeFormatEnUsCache.set(lowercaseIdentifier, instance);
	  }
	  return instance;
	}
	function IsTemporalInstant(item) {
	  return HasSlot(item, EPOCHNANOSECONDS) && !HasSlot(item, TIME_ZONE, CALENDAR);
	}
	function IsTemporalDuration(item) {
	  return HasSlot(item, YEARS, MONTHS, DAYS, HOURS, MINUTES, SECONDS, MILLISECONDS, MICROSECONDS, NANOSECONDS);
	}
	function IsTemporalDate(item) {
	  return HasSlot(item, DATE_BRAND);
	}
	function IsTemporalTime(item) {
	  return HasSlot(item, ISO_HOUR, ISO_MINUTE, ISO_SECOND, ISO_MILLISECOND, ISO_MICROSECOND, ISO_NANOSECOND) && !HasSlot(item, ISO_YEAR, ISO_MONTH, ISO_DAY);
	}
	function IsTemporalDateTime(item) {
	  return HasSlot(item, ISO_YEAR, ISO_MONTH, ISO_DAY, ISO_HOUR, ISO_MINUTE, ISO_SECOND, ISO_MILLISECOND, ISO_MICROSECOND, ISO_NANOSECOND);
	}
	function IsTemporalYearMonth(item) {
	  return HasSlot(item, YEAR_MONTH_BRAND);
	}
	function IsTemporalMonthDay(item) {
	  return HasSlot(item, MONTH_DAY_BRAND);
	}
	function IsTemporalZonedDateTime(item) {
	  return HasSlot(item, EPOCHNANOSECONDS, TIME_ZONE, CALENDAR);
	}
	function RejectTemporalLikeObject(item) {
	  if (HasSlot(item, CALENDAR) || HasSlot(item, TIME_ZONE)) {
	    throw new TypeError('with() does not support a calendar or timeZone property');
	  }
	  if (IsTemporalTime(item)) {
	    throw new TypeError('with() does not accept Temporal.PlainTime, use withPlainTime() instead');
	  }
	  if (item.calendar !== undefined) {
	    throw new TypeError('with() does not support a calendar property');
	  }
	  if (item.timeZone !== undefined) {
	    throw new TypeError('with() does not support a timeZone property');
	  }
	}
	function MaybeFormatCalendarAnnotation(calendar, showCalendar) {
	  if (showCalendar === 'never') return '';
	  return FormatCalendarAnnotation(calendar, showCalendar);
	}
	function FormatCalendarAnnotation(id, showCalendar) {
	  if (showCalendar === 'never') return '';
	  if (showCalendar === 'auto' && id === 'iso8601') return '';
	  const flag = showCalendar === 'critical' ? '!' : '';
	  return `[${flag}u-ca=${id}]`;
	}

	// Not a separate abstract operation in the spec, because it only occurs in one
	// place: ParseISODateTime. In the code it's more convenient to split up
	// ParseISODateTime for the YYYY-MM, MM-DD, and THH:MM:SS parse goals, so it's
	// repeated four times.
	function processAnnotations(annotations) {
	  let calendar;
	  let calendarWasCritical = false;
	  for (const [, critical, key, value] of Call$1(StringPrototypeMatchAll, annotations, [annotation])) {
	    if (key === 'u-ca') {
	      if (calendar === undefined) {
	        calendar = value;
	        calendarWasCritical = critical === '!';
	      } else if (critical === '!' || calendarWasCritical) {
	        throw new RangeError(`Invalid annotations in ${annotations}: more than one u-ca present with critical flag`);
	      }
	    } else if (critical === '!') {
	      throw new RangeError(`Unrecognized annotation: !${key}=${value}`);
	    }
	  }
	  return calendar;
	}
	function ParseISODateTime(isoString) {
	  // ZDT is the superset of fields for every other Temporal type
	  const match = zoneddatetime.exec(isoString);
	  if (!match) throw new RangeError(`invalid ISO 8601 string: ${isoString}`);
	  const calendar = processAnnotations(match[16]);
	  let yearString = match[1];
	  if (yearString === '-000000') throw new RangeError(`invalid ISO 8601 string: ${isoString}`);
	  const year = +yearString;
	  const month = +(match[2] ?? match[4] ?? 1);
	  const day = +(match[3] ?? match[5] ?? 1);
	  const hasTime = match[6] !== undefined;
	  const hour = +(match[6] ?? 0);
	  const minute = +(match[7] ?? match[10] ?? 0);
	  let second = +(match[8] ?? match[11] ?? 0);
	  if (second === 60) second = 59;
	  const fraction = (match[9] ?? match[12] ?? '') + '000000000';
	  const millisecond = +fraction.slice(0, 3);
	  const microsecond = +fraction.slice(3, 6);
	  const nanosecond = +fraction.slice(6, 9);
	  let offset;
	  let z = false;
	  if (match[13]) {
	    offset = undefined;
	    z = true;
	  } else if (match[14]) {
	    offset = match[14];
	  }
	  const tzAnnotation = match[15];
	  RejectDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
	  return {
	    year,
	    month,
	    day,
	    time: hasTime ? {
	      hour,
	      minute,
	      second,
	      millisecond,
	      microsecond,
	      nanosecond
	    } : 'start-of-day',
	    tzAnnotation,
	    offset,
	    z,
	    calendar
	  };
	}
	function ParseTemporalInstantString(isoString) {
	  const result = ParseISODateTime(isoString);
	  if (!result.z && !result.offset) throw new RangeError('Temporal.Instant requires a time zone offset');
	  return result;
	}
	function ParseTemporalZonedDateTimeString(isoString) {
	  const result = ParseISODateTime(isoString);
	  if (!result.tzAnnotation) throw new RangeError('Temporal.ZonedDateTime requires a time zone ID in brackets');
	  return result;
	}
	function ParseTemporalDateTimeString(isoString) {
	  return ParseISODateTime(isoString);
	}
	function ParseTemporalDateString(isoString) {
	  return ParseISODateTime(isoString);
	}
	function ParseTemporalTimeString(isoString) {
	  const match = time.exec(isoString);
	  let hour, minute, second, millisecond, microsecond, nanosecond;
	  if (match) {
	    processAnnotations(match[10]); // ignore found calendar
	    hour = +(match[1] ?? 0);
	    minute = +(match[2] ?? match[5] ?? 0);
	    second = +(match[3] ?? match[6] ?? 0);
	    if (second === 60) second = 59;
	    const fraction = (match[4] ?? match[7] ?? '') + '000000000';
	    millisecond = +fraction.slice(0, 3);
	    microsecond = +fraction.slice(3, 6);
	    nanosecond = +fraction.slice(6, 9);
	    if (match[8]) throw new RangeError('Z designator not supported for PlainTime');
	  } else {
	    const {
	      time,
	      z
	    } = ParseISODateTime(isoString);
	    if (time === 'start-of-day') throw new RangeError(`time is missing in string: ${isoString}`);
	    if (z) throw new RangeError('Z designator not supported for PlainTime');
	    ({
	      hour,
	      minute,
	      second,
	      millisecond,
	      microsecond,
	      nanosecond
	    } = time);
	  }
	  // if it's a date-time string, OK
	  if (/[tT ][0-9][0-9]/.test(isoString)) {
	    return {
	      hour,
	      minute,
	      second,
	      millisecond,
	      microsecond,
	      nanosecond
	    };
	  }
	  // Reject strings that are ambiguous with PlainMonthDay or PlainYearMonth.
	  try {
	    const {
	      month,
	      day
	    } = ParseTemporalMonthDayString(isoString);
	    RejectISODate(1972, month, day);
	  } catch {
	    try {
	      const {
	        year,
	        month
	      } = ParseTemporalYearMonthString(isoString);
	      RejectISODate(year, month, 1);
	    } catch {
	      return {
	        hour,
	        minute,
	        second,
	        millisecond,
	        microsecond,
	        nanosecond
	      };
	    }
	  }
	  throw new RangeError(`invalid ISO 8601 time-only string ${isoString}; may need a T prefix`);
	}
	function ParseTemporalYearMonthString(isoString) {
	  const match = yearmonth.exec(isoString);
	  let year, month, calendar, referenceISODay;
	  if (match) {
	    calendar = processAnnotations(match[3]);
	    let yearString = match[1];
	    if (yearString === '-000000') throw new RangeError(`invalid ISO 8601 string: ${isoString}`);
	    year = +yearString;
	    month = +match[2];
	    referenceISODay = 1;
	    if (calendar !== undefined && calendar !== 'iso8601') {
	      throw new RangeError('YYYY-MM format is only valid with iso8601 calendar');
	    }
	  } else {
	    let z;
	    ({
	      year,
	      month,
	      calendar,
	      day: referenceISODay,
	      z
	    } = ParseISODateTime(isoString));
	    if (z) throw new RangeError('Z designator not supported for PlainYearMonth');
	  }
	  return {
	    year,
	    month,
	    calendar,
	    referenceISODay
	  };
	}
	function ParseTemporalMonthDayString(isoString) {
	  const match = monthday.exec(isoString);
	  let month, day, calendar, referenceISOYear;
	  if (match) {
	    calendar = processAnnotations(match[3]);
	    month = +match[1];
	    day = +match[2];
	    if (calendar !== undefined && calendar !== 'iso8601') {
	      throw new RangeError('MM-DD format is only valid with iso8601 calendar');
	    }
	  } else {
	    let z;
	    ({
	      month,
	      day,
	      calendar,
	      year: referenceISOYear,
	      z
	    } = ParseISODateTime(isoString));
	    if (z) throw new RangeError('Z designator not supported for PlainMonthDay');
	  }
	  return {
	    month,
	    day,
	    calendar,
	    referenceISOYear
	  };
	}
	const TIMEZONE_IDENTIFIER = new RegExp(`^${timeZoneID.source}$`, 'i');
	const OFFSET_IDENTIFIER = new RegExp(`^${offsetIdentifier.source}$`);
	function throwBadTimeZoneStringError(timeZoneString) {
	  // Offset identifiers only support minute precision, but offsets in ISO
	  // strings support nanosecond precision. If the identifier is invalid but
	  // it's a valid ISO offset, then it has sub-minute precision. Show a clearer
	  // error message in that case.
	  const msg = OFFSET.test(timeZoneString) ? 'Seconds not allowed in offset time zone' : 'Invalid time zone';
	  throw new RangeError(`${msg}: ${timeZoneString}`);
	}
	function ParseTimeZoneIdentifier(identifier) {
	  if (!TIMEZONE_IDENTIFIER.test(identifier)) {
	    throwBadTimeZoneStringError(identifier);
	  }
	  if (OFFSET_IDENTIFIER.test(identifier)) {
	    const offsetNanoseconds = ParseDateTimeUTCOffset(identifier);
	    // The regex limits the input to minutes precision, so we know that the
	    // division below will result in an integer.
	    return {
	      offsetMinutes: offsetNanoseconds / 60e9
	    };
	  }
	  return {
	    tzName: identifier
	  };
	}

	// This operation doesn't exist in the spec, but in the polyfill it's split from
	// ParseTemporalTimeZoneString so that parsing can be tested separately from the
	// logic of converting parsed values into a named or offset identifier.
	function ParseTemporalTimeZoneStringRaw(timeZoneString) {
	  if (TIMEZONE_IDENTIFIER.test(timeZoneString)) {
	    return {
	      tzAnnotation: timeZoneString,
	      offset: undefined,
	      z: false
	    };
	  }
	  try {
	    // Try parsing ISO string instead
	    const {
	      tzAnnotation,
	      offset,
	      z
	    } = ParseISODateTime(timeZoneString);
	    if (z || tzAnnotation || offset) {
	      return {
	        tzAnnotation,
	        offset,
	        z
	      };
	    }
	  } catch {
	    // fall through
	  }
	  throwBadTimeZoneStringError(timeZoneString);
	}
	function ParseTemporalTimeZoneString(stringIdent) {
	  const {
	    tzAnnotation,
	    offset,
	    z
	  } = ParseTemporalTimeZoneStringRaw(stringIdent);
	  if (tzAnnotation) return ParseTimeZoneIdentifier(tzAnnotation);
	  if (z) return ParseTimeZoneIdentifier('UTC');
	  if (offset) return ParseTimeZoneIdentifier(offset);
	  throw new Error('this line should not be reached');
	}
	function ParseTemporalDurationString(isoString) {
	  const match = duration.exec(isoString);
	  if (!match) throw new RangeError(`invalid duration: ${isoString}`);
	  if (match.slice(2).every(element => element === undefined)) {
	    throw new RangeError(`invalid duration: ${isoString}`);
	  }
	  const sign = match[1] === '-' ? -1 : 1;
	  const years = match[2] === undefined ? 0 : ToIntegerWithTruncation(match[2]) * sign;
	  const months = match[3] === undefined ? 0 : ToIntegerWithTruncation(match[3]) * sign;
	  const weeks = match[4] === undefined ? 0 : ToIntegerWithTruncation(match[4]) * sign;
	  const days = match[5] === undefined ? 0 : ToIntegerWithTruncation(match[5]) * sign;
	  const hours = match[6] === undefined ? 0 : ToIntegerWithTruncation(match[6]) * sign;
	  let fHours = match[7];
	  let minutesStr = match[8];
	  let fMinutes = match[9];
	  let secondsStr = match[10];
	  let fSeconds = match[11];
	  let minutes = 0;
	  let seconds = 0;
	  // fractional hours, minutes, or seconds, expressed in whole nanoseconds:
	  let excessNanoseconds = 0;
	  if (fHours !== undefined) {
	    if (minutesStr ?? fMinutes ?? secondsStr ?? fSeconds ?? false) {
	      throw new RangeError('only the smallest unit can be fractional');
	    }
	    excessNanoseconds = ToIntegerWithTruncation((fHours + '000000000').slice(0, 9)) * 3600 * sign;
	  } else {
	    minutes = minutesStr === undefined ? 0 : ToIntegerWithTruncation(minutesStr) * sign;
	    if (fMinutes !== undefined) {
	      if (secondsStr ?? fSeconds ?? false) {
	        throw new RangeError('only the smallest unit can be fractional');
	      }
	      excessNanoseconds = ToIntegerWithTruncation((fMinutes + '000000000').slice(0, 9)) * 60 * sign;
	    } else {
	      seconds = secondsStr === undefined ? 0 : ToIntegerWithTruncation(secondsStr) * sign;
	      if (fSeconds !== undefined) {
	        excessNanoseconds = ToIntegerWithTruncation((fSeconds + '000000000').slice(0, 9)) * sign;
	      }
	    }
	  }
	  const nanoseconds = excessNanoseconds % 1000;
	  const microseconds = MathTrunc(excessNanoseconds / 1000) % 1000;
	  const milliseconds = MathTrunc(excessNanoseconds / 1e6) % 1000;
	  seconds += MathTrunc(excessNanoseconds / 1e9) % 60;
	  minutes += MathTrunc(excessNanoseconds / 60e9);
	  RejectDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
	  return {
	    years,
	    months,
	    weeks,
	    days,
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds,
	    nanoseconds
	  };
	}
	function RegulateISODate(year, month, day, overflow) {
	  switch (overflow) {
	    case 'reject':
	      RejectISODate(year, month, day);
	      break;
	    case 'constrain':
	      ({
	        year,
	        month,
	        day
	      } = ConstrainISODate(year, month, day));
	      break;
	  }
	  return {
	    year,
	    month,
	    day
	  };
	}
	function RegulateTime(hour, minute, second, millisecond, microsecond, nanosecond, overflow) {
	  switch (overflow) {
	    case 'reject':
	      RejectTime(hour, minute, second, millisecond, microsecond, nanosecond);
	      break;
	    case 'constrain':
	      ({
	        hour,
	        minute,
	        second,
	        millisecond,
	        microsecond,
	        nanosecond
	      } = ConstrainTime(hour, minute, second, millisecond, microsecond, nanosecond));
	      break;
	  }
	  return {
	    hour,
	    minute,
	    second,
	    millisecond,
	    microsecond,
	    nanosecond
	  };
	}
	function RegulateISOYearMonth(year, month, overflow) {
	  const referenceISODay = 1;
	  switch (overflow) {
	    case 'reject':
	      RejectISODate(year, month, referenceISODay);
	      break;
	    case 'constrain':
	      ({
	        year,
	        month
	      } = ConstrainISODate(year, month));
	      break;
	  }
	  return {
	    year,
	    month
	  };
	}
	function ToTemporalDurationRecord(item) {
	  if (Type$3(item) !== 'Object') {
	    return ParseTemporalDurationString(RequireString(item));
	  }
	  if (IsTemporalDuration(item)) {
	    return {
	      years: GetSlot(item, YEARS),
	      months: GetSlot(item, MONTHS),
	      weeks: GetSlot(item, WEEKS),
	      days: GetSlot(item, DAYS),
	      hours: GetSlot(item, HOURS),
	      minutes: GetSlot(item, MINUTES),
	      seconds: GetSlot(item, SECONDS),
	      milliseconds: GetSlot(item, MILLISECONDS),
	      microseconds: GetSlot(item, MICROSECONDS),
	      nanoseconds: GetSlot(item, NANOSECONDS)
	    };
	  }
	  const result = {
	    years: 0,
	    months: 0,
	    weeks: 0,
	    days: 0,
	    hours: 0,
	    minutes: 0,
	    seconds: 0,
	    milliseconds: 0,
	    microseconds: 0,
	    nanoseconds: 0
	  };
	  let partial = ToTemporalPartialDurationRecord(item);
	  for (let index = 0; index < DURATION_FIELDS.length; index++) {
	    const property = DURATION_FIELDS[index];
	    const value = partial[property];
	    if (value !== undefined) {
	      result[property] = value;
	    }
	  }
	  let {
	    years,
	    months,
	    weeks,
	    days,
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds,
	    nanoseconds
	  } = result;
	  RejectDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
	  return result;
	}
	function ToTemporalPartialDurationRecord(temporalDurationLike) {
	  if (Type$3(temporalDurationLike) !== 'Object') {
	    throw new TypeError('invalid duration-like');
	  }
	  const result = {
	    years: undefined,
	    months: undefined,
	    weeks: undefined,
	    days: undefined,
	    hours: undefined,
	    minutes: undefined,
	    seconds: undefined,
	    milliseconds: undefined,
	    microseconds: undefined,
	    nanoseconds: undefined
	  };
	  let any = false;
	  for (let index = 0; index < DURATION_FIELDS.length; index++) {
	    const property = DURATION_FIELDS[index];
	    const value = temporalDurationLike[property];
	    if (value !== undefined) {
	      any = true;
	      result[property] = ToIntegerIfIntegral(value);
	    }
	  }
	  if (!any) {
	    throw new TypeError('invalid duration-like');
	  }
	  return result;
	}
	function ToLimitedTemporalDuration(item, disallowedProperties) {
	  let record = ToTemporalDurationRecord(item);
	  for (const property of disallowedProperties) {
	    if (record[property] !== 0) {
	      throw new RangeError(`Duration field ${property} not supported by Temporal.Instant. Try Temporal.ZonedDateTime instead.`);
	    }
	  }
	  return record;
	}
	function TemporalObjectToISODateRecord(temporalObject) {
	  return {
	    year: GetSlot(temporalObject, ISO_YEAR),
	    month: GetSlot(temporalObject, ISO_MONTH),
	    day: GetSlot(temporalObject, ISO_DAY)
	  };
	}
	function PlainDateTimeToISODateTimeRecord(plainDateTime) {
	  return {
	    year: GetSlot(plainDateTime, ISO_YEAR),
	    month: GetSlot(plainDateTime, ISO_MONTH),
	    day: GetSlot(plainDateTime, ISO_DAY),
	    hour: GetSlot(plainDateTime, ISO_HOUR),
	    minute: GetSlot(plainDateTime, ISO_MINUTE),
	    second: GetSlot(plainDateTime, ISO_SECOND),
	    millisecond: GetSlot(plainDateTime, ISO_MILLISECOND),
	    microsecond: GetSlot(plainDateTime, ISO_MICROSECOND),
	    nanosecond: GetSlot(plainDateTime, ISO_NANOSECOND)
	  };
	}
	function ISODateTimeToDateRecord(_ref5) {
	  let {
	    year,
	    month,
	    day
	  } = _ref5;
	  return {
	    year,
	    month,
	    day
	  };
	}
	function CombineISODateAndTimeRecord(date, time) {
	  const {
	    year,
	    month,
	    day
	  } = date;
	  const {
	    hour,
	    minute,
	    second,
	    millisecond,
	    microsecond,
	    nanosecond
	  } = time;
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
	function GetTemporalOverflowOption(options) {
	  if (options === undefined) return 'constrain';
	  return GetOption(options, 'overflow', ['constrain', 'reject'], 'constrain');
	}
	function GetTemporalDisambiguationOption(options) {
	  if (options === undefined) return 'compatible';
	  return GetOption(options, 'disambiguation', ['compatible', 'earlier', 'later', 'reject'], 'compatible');
	}
	function GetRoundingModeOption(options, fallback) {
	  return GetOption(options, 'roundingMode', ['ceil', 'floor', 'expand', 'trunc', 'halfCeil', 'halfFloor', 'halfExpand', 'halfTrunc', 'halfEven'], fallback);
	}
	function NegateRoundingMode(roundingMode) {
	  switch (roundingMode) {
	    case 'ceil':
	      return 'floor';
	    case 'floor':
	      return 'ceil';
	    case 'halfCeil':
	      return 'halfFloor';
	    case 'halfFloor':
	      return 'halfCeil';
	    default:
	      return roundingMode;
	  }
	}
	function GetTemporalOffsetOption(options, fallback) {
	  if (options === undefined) return fallback;
	  return GetOption(options, 'offset', ['prefer', 'use', 'ignore', 'reject'], fallback);
	}
	function GetTemporalShowCalendarNameOption(options) {
	  return GetOption(options, 'calendarName', ['auto', 'always', 'never', 'critical'], 'auto');
	}
	function GetTemporalShowTimeZoneNameOption(options) {
	  return GetOption(options, 'timeZoneName', ['auto', 'never', 'critical'], 'auto');
	}
	function GetTemporalShowOffsetOption(options) {
	  return GetOption(options, 'offset', ['auto', 'never'], 'auto');
	}
	function GetDirectionOption(options) {
	  return GetOption(options, 'direction', ['next', 'previous'], REQUIRED);
	}
	function GetRoundingIncrementOption(options) {
	  let increment = options.roundingIncrement;
	  if (increment === undefined) return 1;
	  increment = ToNumber$2(increment);
	  if (!NumberIsFinite(increment)) {
	    throw new RangeError('roundingIncrement must be finite');
	  }
	  const integerIncrement = MathTrunc(increment);
	  if (integerIncrement < 1 || integerIncrement > 1e9) {
	    throw new RangeError(`roundingIncrement must be at least 1 and at most 1e9, not ${increment}`);
	  }
	  return integerIncrement;
	}
	function ValidateTemporalRoundingIncrement(increment, dividend, inclusive) {
	  const maximum = inclusive ? dividend : dividend - 1;
	  if (increment > maximum) {
	    throw new RangeError(`roundingIncrement must be at least 1 and less than ${maximum}, not ${increment}`);
	  }
	  if (dividend % increment !== 0) {
	    throw new RangeError(`Rounding increment must divide evenly into ${dividend}`);
	  }
	}
	function GetTemporalFractionalSecondDigitsOption(options) {
	  let digitsValue = options.fractionalSecondDigits;
	  if (digitsValue === undefined) return 'auto';
	  if (Type$3(digitsValue) !== 'Number') {
	    if (ToString$1(digitsValue) !== 'auto') {
	      throw new RangeError(`fractionalSecondDigits must be 'auto' or 0 through 9, not ${digitsValue}`);
	    }
	    return 'auto';
	  }
	  const digitCount = MathFloor$1(digitsValue);
	  if (!NumberIsFinite(digitCount) || digitCount < 0 || digitCount > 9) {
	    throw new RangeError(`fractionalSecondDigits must be 'auto' or 0 through 9, not ${digitsValue}`);
	  }
	  return digitCount;
	}
	function ToSecondsStringPrecisionRecord(smallestUnit, precision) {
	  switch (smallestUnit) {
	    case 'minute':
	      return {
	        precision: 'minute',
	        unit: 'minute',
	        increment: 1
	      };
	    case 'second':
	      return {
	        precision: 0,
	        unit: 'second',
	        increment: 1
	      };
	    case 'millisecond':
	      return {
	        precision: 3,
	        unit: 'millisecond',
	        increment: 1
	      };
	    case 'microsecond':
	      return {
	        precision: 6,
	        unit: 'microsecond',
	        increment: 1
	      };
	    case 'nanosecond':
	      return {
	        precision: 9,
	        unit: 'nanosecond',
	        increment: 1
	      };
	  }
	  switch (precision) {
	    case 'auto':
	      return {
	        precision,
	        unit: 'nanosecond',
	        increment: 1
	      };
	    case 0:
	      return {
	        precision,
	        unit: 'second',
	        increment: 1
	      };
	    case 1:
	    case 2:
	    case 3:
	      return {
	        precision,
	        unit: 'millisecond',
	        increment: 10 ** (3 - precision)
	      };
	    case 4:
	    case 5:
	    case 6:
	      return {
	        precision,
	        unit: 'microsecond',
	        increment: 10 ** (6 - precision)
	      };
	    case 7:
	    case 8:
	    case 9:
	      return {
	        precision,
	        unit: 'nanosecond',
	        increment: 10 ** (9 - precision)
	      };
	  }
	}
	const REQUIRED = Symbol('~required~');
	function GetTemporalUnitValuedOption(options, key, unitGroup, requiredOrDefault) {
	  let extraValues = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
	  const allowedSingular = [];
	  for (let index = 0; index < TEMPORAL_UNITS.length; index++) {
	    const unitInfo = TEMPORAL_UNITS[index];
	    const singular = unitInfo[1];
	    const category = unitInfo[2];
	    if (unitGroup === 'datetime' || unitGroup === category) {
	      allowedSingular.push(singular);
	    }
	  }
	  Call$1(ArrayPrototypePush, allowedSingular, extraValues);
	  let defaultVal = requiredOrDefault;
	  if (defaultVal === REQUIRED) {
	    defaultVal = undefined;
	  } else if (defaultVal !== undefined) {
	    allowedSingular.push(defaultVal);
	  }
	  const allowedValues = [];
	  Call$1(ArrayPrototypePush, allowedValues, allowedSingular);
	  for (let index = 0; index < allowedSingular.length; index++) {
	    const singular = allowedSingular[index];
	    const plural = PLURAL_FOR.get(singular);
	    if (plural !== undefined) allowedValues.push(plural);
	  }
	  let retval = GetOption(options, key, allowedValues, defaultVal);
	  if (retval === undefined && requiredOrDefault === REQUIRED) {
	    throw new RangeError(`${key} is required`);
	  }
	  if (SINGULAR_FOR.has(retval)) retval = SINGULAR_FOR.get(retval);
	  return retval;
	}
	function GetTemporalRelativeToOption(options) {
	  // returns: {
	  //   plainRelativeTo: Temporal.PlainDate | undefined
	  //   zonedRelativeTo: Temporal.ZonedDateTime | undefined
	  // }
	  // plainRelativeTo and zonedRelativeTo are mutually exclusive.
	  const relativeTo = options.relativeTo;
	  if (relativeTo === undefined) return {};
	  let offsetBehaviour = 'option';
	  let matchMinutes = false;
	  let year, month, day, time, calendar, timeZone, offset;
	  if (Type$3(relativeTo) === 'Object') {
	    if (IsTemporalZonedDateTime(relativeTo)) {
	      return {
	        zonedRelativeTo: relativeTo
	      };
	    }
	    if (IsTemporalDate(relativeTo)) return {
	      plainRelativeTo: relativeTo
	    };
	    if (IsTemporalDateTime(relativeTo)) return {
	      plainRelativeTo: TemporalDateTimeToDate(relativeTo)
	    };
	    calendar = GetTemporalCalendarIdentifierWithISODefault(relativeTo);
	    const fields = PrepareCalendarFields(calendar, relativeTo, ['day', 'month', 'monthCode', 'year'], ['hour', 'microsecond', 'millisecond', 'minute', 'nanosecond', 'offset', 'second', 'timeZone'], []);
	    ({
	      year,
	      month,
	      day,
	      time
	    } = InterpretTemporalDateTimeFields(calendar, fields, 'constrain'));
	    offset = fields.offset;
	    if (offset === undefined) offsetBehaviour = 'wall';
	    timeZone = fields.timeZone;
	    if (timeZone !== undefined) timeZone = ToTemporalTimeZoneIdentifier(timeZone);
	  } else {
	    let tzAnnotation, z;
	    ({
	      year,
	      month,
	      day,
	      time,
	      calendar,
	      tzAnnotation,
	      offset,
	      z
	    } = ParseISODateTime(RequireString(relativeTo)));
	    if (tzAnnotation) {
	      timeZone = ToTemporalTimeZoneIdentifier(tzAnnotation);
	      if (z) {
	        offsetBehaviour = 'exact';
	      } else if (!offset) {
	        offsetBehaviour = 'wall';
	      }
	      matchMinutes = true;
	    } else if (z) {
	      throw new RangeError('Z designator not supported for PlainDate relativeTo; either remove the Z or add a bracketed time zone');
	    }
	    if (!calendar) calendar = 'iso8601';
	    if (!IsBuiltinCalendar(calendar)) throw new RangeError(`invalid calendar identifier ${calendar}`);
	    calendar = CanonicalizeCalendar(calendar);
	  }
	  if (timeZone === undefined) return {
	    plainRelativeTo: CreateTemporalDate(year, month, day, calendar)
	  };
	  const offsetNs = offsetBehaviour === 'option' ? ParseDateTimeUTCOffset(offset) : 0;
	  const epochNanoseconds = InterpretISODateTimeOffset(year, month, day, time, offsetBehaviour, offsetNs, timeZone, 'compatible', 'reject', matchMinutes);
	  return {
	    zonedRelativeTo: CreateTemporalZonedDateTime(epochNanoseconds, timeZone, calendar)
	  };
	}
	function DefaultTemporalLargestUnit(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds) {
	  const entries = ObjectEntries$1({
	    years,
	    months,
	    weeks,
	    days,
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds
	  });
	  for (let index = 0; index < entries.length; index++) {
	    const entry = entries[index];
	    const prop = entry[0];
	    const v = entry[1];
	    if (v !== 0) return SINGULAR_FOR.get(prop);
	  }
	  return 'nanosecond';
	}
	function LargerOfTwoTemporalUnits(unit1, unit2) {
	  if (UNITS_DESCENDING.indexOf(unit1) > UNITS_DESCENDING.indexOf(unit2)) return unit2;
	  return unit1;
	}
	function IsCalendarUnit(unit) {
	  return unit === 'year' || unit === 'month' || unit === 'week';
	}
	function TemporalObjectToFields(temporalObject) {
	  const calendar = GetSlot(temporalObject, CALENDAR);
	  const isoDate = TemporalObjectToISODateRecord(temporalObject);
	  let type = 'date';
	  if (IsTemporalYearMonth(temporalObject)) {
	    type = 'year-month';
	  } else if (IsTemporalMonthDay(temporalObject)) {
	    type = 'month-day';
	  }
	  return ISODateToFields(calendar, isoDate, type);
	}
	function ISODateToFields(calendar, isoDate) {
	  let type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'date';
	  const fields = ObjectCreate$6(null);
	  fields.monthCode = CalendarMonthCode(calendar, isoDate);
	  if (type === 'month-day' || type === 'date') {
	    fields.day = CalendarDay(calendar, isoDate);
	  }
	  if (type === 'year-month' || type === 'date') {
	    fields.year = CalendarYear(calendar, isoDate);
	  }
	  return fields;
	}
	function PrepareCalendarFields(calendar, bag, calendarFieldNames, nonCalendarFieldNames, requiredFields) {
	  const extraFieldNames = GetIntrinsic('%calendarImpl%')(calendar).extraFields();
	  const fields = Call$1(ArrayPrototypeConcat, calendarFieldNames, [nonCalendarFieldNames, extraFieldNames]);
	  const result = ObjectCreate$6(null);
	  let any = false;
	  Call$1(ArrayPrototypeSort$1, fields, []);
	  for (let index = 0; index < fields.length; index++) {
	    const property = fields[index];
	    const value = bag[property];
	    if (value !== undefined) {
	      any = true;
	      result[property] = BUILTIN_CASTS.get(property)(value);
	    } else if (requiredFields !== 'partial') {
	      if (Call$1(ArrayIncludes, requiredFields, [property])) {
	        throw new TypeError(`required property '${property}' missing or undefined`);
	      }
	      result[property] = BUILTIN_DEFAULTS.get(property);
	    }
	  }
	  if (requiredFields === 'partial' && !any) {
	    throw new TypeError('no supported properties found');
	  }
	  return result;
	}
	function ToTemporalTimeRecord(bag) {
	  let completeness = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'complete';
	  const fields = ['hour', 'microsecond', 'millisecond', 'minute', 'nanosecond', 'second'];
	  let any = false;
	  const result = ObjectCreate$6(null);
	  for (let index = 0; index < fields.length; index++) {
	    const field = fields[index];
	    const value = bag[field];
	    if (value !== undefined) {
	      result[field] = ToIntegerWithTruncation(value);
	      any = true;
	    } else if (completeness === 'complete') {
	      result[field] = 0;
	    }
	  }
	  if (!any) throw new TypeError('invalid time-like');
	  return result;
	}
	function ToTemporalDate(item) {
	  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	  if (Type$3(item) === 'Object') {
	    if (IsTemporalDate(item)) {
	      GetTemporalOverflowOption(GetOptionsObject(options));
	      return item;
	    }
	    if (IsTemporalZonedDateTime(item)) {
	      const isoDateTime = GetISODateTimeFor(GetSlot(item, TIME_ZONE), GetSlot(item, EPOCHNANOSECONDS));
	      GetTemporalOverflowOption(GetOptionsObject(options)); // validate and ignore
	      return CreateTemporalDate(isoDateTime.year, isoDateTime.month, isoDateTime.day, GetSlot(item, CALENDAR));
	    }
	    if (IsTemporalDateTime(item)) {
	      GetTemporalOverflowOption(GetOptionsObject(options)); // validate and ignore
	      return CreateTemporalDate(GetSlot(item, ISO_YEAR), GetSlot(item, ISO_MONTH), GetSlot(item, ISO_DAY), GetSlot(item, CALENDAR));
	    }
	    const calendar = GetTemporalCalendarIdentifierWithISODefault(item);
	    const fields = PrepareCalendarFields(calendar, item, ['day', 'month', 'monthCode', 'year'], [], []);
	    const overflow = GetTemporalOverflowOption(GetOptionsObject(options));
	    const {
	      year,
	      month,
	      day
	    } = CalendarDateFromFields(calendar, fields, overflow);
	    return CreateTemporalDate(year, month, day, calendar);
	  }
	  let {
	    year,
	    month,
	    day,
	    calendar,
	    z
	  } = ParseTemporalDateString(RequireString(item));
	  if (z) throw new RangeError('Z designator not supported for PlainDate');
	  if (!calendar) calendar = 'iso8601';
	  if (!IsBuiltinCalendar(calendar)) throw new RangeError(`invalid calendar identifier ${calendar}`);
	  calendar = CanonicalizeCalendar(calendar);
	  GetTemporalOverflowOption(GetOptionsObject(options)); // validate and ignore
	  return CreateTemporalDate(year, month, day, calendar);
	}
	function InterpretTemporalDateTimeFields(calendar, fields, overflow) {
	  const isoDate = CalendarDateFromFields(calendar, fields, overflow);
	  const time = RegulateTime(fields.hour, fields.minute, fields.second, fields.millisecond, fields.microsecond, fields.nanosecond, overflow);
	  return {
	    ...isoDate,
	    time
	  };
	}
	function ToTemporalDateTime(item) {
	  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	  let year, month, day, time, calendar;
	  if (Type$3(item) === 'Object') {
	    if (IsTemporalDateTime(item)) {
	      GetTemporalOverflowOption(GetOptionsObject(options));
	      return item;
	    }
	    if (IsTemporalZonedDateTime(item)) {
	      const isoDateTime = GetISODateTimeFor(GetSlot(item, TIME_ZONE), GetSlot(item, EPOCHNANOSECONDS));
	      GetTemporalOverflowOption(GetOptionsObject(options));
	      return CreateTemporalDateTime(isoDateTime.year, isoDateTime.month, isoDateTime.day, isoDateTime.hour, isoDateTime.minute, isoDateTime.second, isoDateTime.millisecond, isoDateTime.microsecond, isoDateTime.nanosecond, GetSlot(item, CALENDAR));
	    }
	    if (IsTemporalDate(item)) {
	      GetTemporalOverflowOption(GetOptionsObject(options));
	      return CreateTemporalDateTime(GetSlot(item, ISO_YEAR), GetSlot(item, ISO_MONTH), GetSlot(item, ISO_DAY), 0, 0, 0, 0, 0, 0, GetSlot(item, CALENDAR));
	    }
	    calendar = GetTemporalCalendarIdentifierWithISODefault(item);
	    const fields = PrepareCalendarFields(calendar, item, ['day', 'month', 'monthCode', 'year'], ['hour', 'microsecond', 'millisecond', 'minute', 'nanosecond', 'second'], []);
	    const overflow = GetTemporalOverflowOption(GetOptionsObject(options));
	    ({
	      year,
	      month,
	      day,
	      time
	    } = InterpretTemporalDateTimeFields(calendar, fields, overflow));
	  } else {
	    let z;
	    ({
	      year,
	      month,
	      day,
	      time,
	      calendar,
	      z
	    } = ParseTemporalDateTimeString(RequireString(item)));
	    if (z) throw new RangeError('Z designator not supported for PlainDateTime');
	    if (time === 'start-of-day') {
	      time = {
	        hour: 0,
	        minute: 0,
	        second: 0,
	        millisecond: 0,
	        microsecond: 0,
	        nanosecond: 0
	      };
	    }
	    RejectDateTime(year, month, day, time.hour, time.minute, time.second, time.millisecond, time.microsecond, time.nanosecond);
	    if (!calendar) calendar = 'iso8601';
	    if (!IsBuiltinCalendar(calendar)) throw new RangeError(`invalid calendar identifier ${calendar}`);
	    calendar = CanonicalizeCalendar(calendar);
	    GetTemporalOverflowOption(GetOptionsObject(options));
	  }
	  const {
	    hour,
	    minute,
	    second,
	    millisecond,
	    microsecond,
	    nanosecond
	  } = time;
	  return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
	}
	function ToTemporalDuration(item) {
	  if (IsTemporalDuration(item)) return item;
	  let {
	    years,
	    months,
	    weeks,
	    days,
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds,
	    nanoseconds
	  } = ToTemporalDurationRecord(item);
	  const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
	  return new TemporalDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
	}
	function ToTemporalInstant(item) {
	  if (Type$3(item === 'Object')) {
	    if (IsTemporalInstant(item)) return item;
	    if (IsTemporalZonedDateTime(item)) {
	      const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
	      return new TemporalInstant(GetSlot(item, EPOCHNANOSECONDS));
	    }
	    item = ToPrimitive$2(item, StringCtor);
	  }
	  const {
	    year,
	    month,
	    day,
	    time,
	    offset,
	    z
	  } = ParseTemporalInstantString(RequireString(item));
	  const {
	    hour = 0,
	    minute = 0,
	    second = 0,
	    millisecond = 0,
	    microsecond = 0,
	    nanosecond = 0
	  } = time === 'start-of-day' ? {} : time;

	  // ParseTemporalInstantString ensures that either `z` is true or or `offset` is non-undefined
	  const offsetNanoseconds = z ? 0 : ParseDateTimeUTCOffset(offset);
	  const epochNanoseconds = GetUTCEpochNanoseconds(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, offsetNanoseconds);
	  ValidateEpochNanoseconds(epochNanoseconds);
	  const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
	  return new TemporalInstant(epochNanoseconds);
	}
	function ToTemporalMonthDay(item) {
	  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	  if (Type$3(item) === 'Object') {
	    if (IsTemporalMonthDay(item)) {
	      GetTemporalOverflowOption(GetOptionsObject(options));
	      return item;
	    }
	    let calendar;
	    if (HasSlot(item, CALENDAR)) {
	      calendar = GetSlot(item, CALENDAR);
	    } else {
	      calendar = item.calendar;
	      if (calendar === undefined) calendar = 'iso8601';
	      calendar = ToTemporalCalendarIdentifier(calendar);
	    }
	    const fields = PrepareCalendarFields(calendar, item, ['day', 'month', 'monthCode', 'year'], [], []);
	    const overflow = GetTemporalOverflowOption(GetOptionsObject(options));
	    const {
	      year,
	      month,
	      day
	    } = CalendarMonthDayFromFields(calendar, fields, overflow);
	    return CreateTemporalMonthDay(month, day, calendar, year);
	  }
	  let {
	    month,
	    day,
	    referenceISOYear,
	    calendar
	  } = ParseTemporalMonthDayString(RequireString(item));
	  if (calendar === undefined) calendar = 'iso8601';
	  if (!IsBuiltinCalendar(calendar)) throw new RangeError(`invalid calendar identifier ${calendar}`);
	  calendar = CanonicalizeCalendar(calendar);
	  GetTemporalOverflowOption(GetOptionsObject(options));
	  if (referenceISOYear === undefined) {
	    if (calendar !== 'iso8601') {
	      throw new Error(`assertion failed: missing year with non-"iso8601" calendar identifier ${calendar}`);
	    }
	    const isoCalendarReferenceYear = 1972; // First leap year after Unix epoch
	    return CreateTemporalMonthDay(month, day, calendar, isoCalendarReferenceYear);
	  }
	  const isoDate = {
	    year: referenceISOYear,
	    month,
	    day
	  };
	  const result = ISODateToFields(calendar, isoDate, 'month-day');
	  ({
	    year: referenceISOYear,
	    month,
	    day
	  } = CalendarMonthDayFromFields(calendar, result, 'constrain'));
	  return CreateTemporalMonthDay(month, day, calendar, referenceISOYear);
	}
	function ToTemporalTime(item) {
	  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	  let hour, minute, second, millisecond, microsecond, nanosecond;
	  const TemporalPlainTime = GetIntrinsic('%Temporal.PlainTime%');
	  if (Type$3(item) === 'Object') {
	    if (IsTemporalTime(item)) {
	      GetTemporalOverflowOption(GetOptionsObject(options));
	      return item;
	    }
	    if (IsTemporalZonedDateTime(item)) {
	      const isoDateTime = GetISODateTimeFor(GetSlot(item, TIME_ZONE), GetSlot(item, EPOCHNANOSECONDS));
	      GetTemporalOverflowOption(GetOptionsObject(options));
	      return new TemporalPlainTime(isoDateTime.hour, isoDateTime.minute, isoDateTime.second, isoDateTime.millisecond, isoDateTime.microsecond, isoDateTime.nanosecond);
	    }
	    if (IsTemporalDateTime(item)) {
	      GetTemporalOverflowOption(GetOptionsObject(options));
	      return new TemporalPlainTime(GetSlot(item, ISO_HOUR), GetSlot(item, ISO_MINUTE), GetSlot(item, ISO_SECOND), GetSlot(item, ISO_MILLISECOND), GetSlot(item, ISO_MICROSECOND), GetSlot(item, ISO_NANOSECOND));
	    }
	    ({
	      hour,
	      minute,
	      second,
	      millisecond,
	      microsecond,
	      nanosecond
	    } = ToTemporalTimeRecord(item));
	    const overflow = GetTemporalOverflowOption(GetOptionsObject(options));
	    ({
	      hour,
	      minute,
	      second,
	      millisecond,
	      microsecond,
	      nanosecond
	    } = RegulateTime(hour, minute, second, millisecond, microsecond, nanosecond, overflow));
	  } else {
	    ({
	      hour,
	      minute,
	      second,
	      millisecond,
	      microsecond,
	      nanosecond
	    } = ParseTemporalTimeString(RequireString(item)));
	    RejectTime(hour, minute, second, millisecond, microsecond, nanosecond);
	    GetTemporalOverflowOption(GetOptionsObject(options));
	  }
	  return new TemporalPlainTime(hour, minute, second, millisecond, microsecond, nanosecond);
	}
	function ToTemporalTimeOrMidnight(item) {
	  const TemporalPlainTime = GetIntrinsic('%Temporal.PlainTime%');
	  if (item === undefined) return new TemporalPlainTime();
	  return ToTemporalTime(item);
	}
	function ToTemporalYearMonth(item) {
	  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	  if (Type$3(item) === 'Object') {
	    if (IsTemporalYearMonth(item)) {
	      GetTemporalOverflowOption(GetOptionsObject(options));
	      return item;
	    }
	    const calendar = GetTemporalCalendarIdentifierWithISODefault(item);
	    const fields = PrepareCalendarFields(calendar, item, ['month', 'monthCode', 'year'], [], []);
	    const overflow = GetTemporalOverflowOption(GetOptionsObject(options));
	    const {
	      year,
	      month,
	      day
	    } = CalendarYearMonthFromFields(calendar, fields, overflow);
	    return CreateTemporalYearMonth(year, month, calendar, day);
	  }
	  let {
	    year,
	    month,
	    referenceISODay,
	    calendar
	  } = ParseTemporalYearMonthString(RequireString(item));
	  if (calendar === undefined) calendar = 'iso8601';
	  if (!IsBuiltinCalendar(calendar)) throw new RangeError(`invalid calendar identifier ${calendar}`);
	  calendar = CanonicalizeCalendar(calendar);
	  const result = ISODateToFields(calendar, {
	    year,
	    month,
	    day: referenceISODay
	  }, 'year-month');
	  GetTemporalOverflowOption(GetOptionsObject(options));
	  ({
	    year,
	    month,
	    day: referenceISODay
	  } = CalendarYearMonthFromFields(calendar, result, 'constrain'));
	  return CreateTemporalYearMonth(year, month, calendar, referenceISODay);
	}
	function InterpretISODateTimeOffset(year, month, day, time, offsetBehaviour, offsetNs, timeZone, disambiguation, offsetOpt, matchMinute) {
	  // start-of-day signifies that we had a string such as YYYY-MM-DD[Zone]. It is
	  // grammatically not possible to specify a UTC offset in that string, so the
	  // behaviour collapses into ~WALL~, which is equivalent to offset: "ignore".
	  if (time === 'start-of-day') {
	    if (offsetBehaviour !== 'wall' || offsetNs !== 0) {
	      throw new Error('assertion failure: offset cannot be provided in YYYY-MM-DD[Zone] string');
	    }
	    return GetStartOfDay(timeZone, {
	      year,
	      month,
	      day
	    });
	  }
	  const dt = CombineISODateAndTimeRecord({
	    year,
	    month,
	    day
	  }, time);
	  if (offsetBehaviour === 'wall' || offsetOpt === 'ignore') {
	    // Simple case: ISO string without a TZ offset (or caller wants to ignore
	    // the offset), so just convert DateTime to Instant in the given time zone
	    return GetEpochNanosecondsFor(timeZone, dt, disambiguation);
	  }

	  // The caller wants the offset to always win ('use') OR the caller is OK
	  // with the offset winning ('prefer' or 'reject') as long as it's valid
	  // for this timezone and date/time.
	  if (offsetBehaviour === 'exact' || offsetOpt === 'use') {
	    // Calculate the instant for the input's date/time and offset
	    const epochNs = GetUTCEpochNanoseconds(year, month, day, time.hour, time.minute, time.second, time.millisecond, time.microsecond, time.nanosecond, offsetNs);
	    ValidateEpochNanoseconds(epochNs);
	    return epochNs;
	  }

	  // "prefer" or "reject"
	  const possibleEpochNs = GetPossibleEpochNanoseconds(timeZone, dt);
	  if (possibleEpochNs.length > 0) {
	    for (let index = 0; index < possibleEpochNs.length; index++) {
	      const candidate = possibleEpochNs[index];
	      const candidateOffset = GetOffsetNanosecondsFor(timeZone, candidate);
	      const roundedCandidateOffset = RoundNumberToIncrement(candidateOffset, 60e9, 'halfExpand');
	      if (candidateOffset === offsetNs || matchMinute && roundedCandidateOffset === offsetNs) {
	        return candidate;
	      }
	    }
	  }

	  // the user-provided offset doesn't match any instants for this time
	  // zone and date/time.
	  if (offsetOpt === 'reject') {
	    const offsetStr = FormatUTCOffsetNanoseconds(offsetNs);
	    const dtStr = TemporalDateTimeToString(dt, 'iso8601', 'auto');
	    throw new RangeError(`Offset ${offsetStr} is invalid for ${dtStr} in ${timeZone}`);
	  }
	  // fall through: offsetOpt === 'prefer', but the offset doesn't match
	  // so fall back to use the time zone instead.
	  return DisambiguatePossibleEpochNanoseconds(possibleEpochNs, timeZone, dt, disambiguation);
	}
	function ToTemporalZonedDateTime(item) {
	  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	  let year, month, day, time, timeZone, offset, calendar;
	  let matchMinute = false;
	  let offsetBehaviour = 'option';
	  let disambiguation, offsetOpt;
	  if (Type$3(item) === 'Object') {
	    if (IsTemporalZonedDateTime(item)) {
	      options = GetOptionsObject(options);
	      GetTemporalDisambiguationOption(options); // validate and ignore
	      GetTemporalOffsetOption(options, 'reject');
	      GetTemporalOverflowOption(options);
	      return item;
	    }
	    calendar = GetTemporalCalendarIdentifierWithISODefault(item);
	    const fields = PrepareCalendarFields(calendar, item, ['day', 'month', 'monthCode', 'year'], ['hour', 'microsecond', 'millisecond', 'minute', 'nanosecond', 'offset', 'second', 'timeZone'], ['timeZone']);
	    timeZone = ToTemporalTimeZoneIdentifier(fields.timeZone);
	    offset = fields.offset;
	    if (offset === undefined) {
	      offsetBehaviour = 'wall';
	    }
	    options = GetOptionsObject(options);
	    disambiguation = GetTemporalDisambiguationOption(options);
	    offsetOpt = GetTemporalOffsetOption(options, 'reject');
	    const overflow = GetTemporalOverflowOption(options);
	    ({
	      year,
	      month,
	      day,
	      time
	    } = InterpretTemporalDateTimeFields(calendar, fields, overflow));
	  } else {
	    let tzAnnotation, z;
	    ({
	      year,
	      month,
	      day,
	      time,
	      tzAnnotation,
	      offset,
	      z,
	      calendar
	    } = ParseTemporalZonedDateTimeString(RequireString(item)));
	    timeZone = ToTemporalTimeZoneIdentifier(tzAnnotation);
	    if (z) {
	      offsetBehaviour = 'exact';
	    } else if (!offset) {
	      offsetBehaviour = 'wall';
	    }
	    if (!calendar) calendar = 'iso8601';
	    if (!IsBuiltinCalendar(calendar)) throw new RangeError(`invalid calendar identifier ${calendar}`);
	    calendar = CanonicalizeCalendar(calendar);
	    matchMinute = true; // ISO strings may specify offset with less precision
	    options = GetOptionsObject(options);
	    disambiguation = GetTemporalDisambiguationOption(options);
	    offsetOpt = GetTemporalOffsetOption(options, 'reject');
	    GetTemporalOverflowOption(options); // validate and ignore
	  }
	  let offsetNs = 0;
	  if (offsetBehaviour === 'option') offsetNs = ParseDateTimeUTCOffset(offset);
	  const epochNanoseconds = InterpretISODateTimeOffset(year, month, day, time, offsetBehaviour, offsetNs, timeZone, disambiguation, offsetOpt, matchMinute);
	  return CreateTemporalZonedDateTime(epochNanoseconds, timeZone, calendar);
	}
	function CreateTemporalDateSlots(result, isoYear, isoMonth, isoDay, calendar) {
	  RejectISODate(isoYear, isoMonth, isoDay);
	  RejectDateRange(isoYear, isoMonth, isoDay);
	  CreateSlots(result);
	  SetSlot(result, ISO_YEAR, isoYear);
	  SetSlot(result, ISO_MONTH, isoMonth);
	  SetSlot(result, ISO_DAY, isoDay);
	  SetSlot(result, CALENDAR, calendar);
	  SetSlot(result, DATE_BRAND, true);
	  {
	    const repr = TemporalDateToString(result, 'auto');
	    ObjectDefineProperty$1(result, '_repr_', {
	      value: `Temporal.PlainDate <${repr}>`,
	      writable: false,
	      enumerable: false,
	      configurable: false
	    });
	  }
	}
	function CreateTemporalDate(isoYear, isoMonth, isoDay) {
	  let calendar = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'iso8601';
	  const TemporalPlainDate = GetIntrinsic('%Temporal.PlainDate%');
	  const result = ObjectCreate$6(TemporalPlainDate.prototype);
	  CreateTemporalDateSlots(result, isoYear, isoMonth, isoDay, calendar);
	  return result;
	}
	function CreateTemporalDateTimeSlots(result, isoYear, isoMonth, isoDay, h, min, s, ms, µs, ns, calendar) {
	  RejectDateTime(isoYear, isoMonth, isoDay, h, min, s, ms, µs, ns);
	  RejectDateTimeRange(isoYear, isoMonth, isoDay, h, min, s, ms, µs, ns);
	  CreateSlots(result);
	  SetSlot(result, ISO_YEAR, isoYear);
	  SetSlot(result, ISO_MONTH, isoMonth);
	  SetSlot(result, ISO_DAY, isoDay);
	  SetSlot(result, ISO_HOUR, h);
	  SetSlot(result, ISO_MINUTE, min);
	  SetSlot(result, ISO_SECOND, s);
	  SetSlot(result, ISO_MILLISECOND, ms);
	  SetSlot(result, ISO_MICROSECOND, µs);
	  SetSlot(result, ISO_NANOSECOND, ns);
	  SetSlot(result, CALENDAR, calendar);
	  {
	    const iso = {
	      year: isoYear,
	      month: isoMonth,
	      day: isoDay,
	      hour: h,
	      minute: min,
	      second: s,
	      millisecond: ms,
	      microsecond: µs,
	      nanosecond: ns
	    };
	    let repr = TemporalDateTimeToString(iso, calendar, 'auto');
	    Object.defineProperty(result, '_repr_', {
	      value: `Temporal.PlainDateTime <${repr}>`,
	      writable: false,
	      enumerable: false,
	      configurable: false
	    });
	  }
	}
	function CreateTemporalDateTime(isoYear, isoMonth, isoDay, h, min, s, ms, µs, ns) {
	  let calendar = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : 'iso8601';
	  const TemporalPlainDateTime = GetIntrinsic('%Temporal.PlainDateTime%');
	  const result = ObjectCreate$6(TemporalPlainDateTime.prototype);
	  CreateTemporalDateTimeSlots(result, isoYear, isoMonth, isoDay, h, min, s, ms, µs, ns, calendar);
	  return result;
	}
	function CreateTemporalMonthDaySlots(result, isoMonth, isoDay, calendar, referenceISOYear) {
	  RejectISODate(referenceISOYear, isoMonth, isoDay);
	  RejectDateRange(referenceISOYear, isoMonth, isoDay);
	  CreateSlots(result);
	  SetSlot(result, ISO_MONTH, isoMonth);
	  SetSlot(result, ISO_DAY, isoDay);
	  SetSlot(result, ISO_YEAR, referenceISOYear);
	  SetSlot(result, CALENDAR, calendar);
	  SetSlot(result, MONTH_DAY_BRAND, true);
	  {
	    const repr = TemporalMonthDayToString(result, 'auto');
	    Object.defineProperty(result, '_repr_', {
	      value: `Temporal.PlainMonthDay <${repr}>`,
	      writable: false,
	      enumerable: false,
	      configurable: false
	    });
	  }
	}
	function CreateTemporalMonthDay(isoMonth, isoDay, calendar, referenceISOYear) {
	  const TemporalPlainMonthDay = GetIntrinsic('%Temporal.PlainMonthDay%');
	  const result = ObjectCreate$6(TemporalPlainMonthDay.prototype);
	  CreateTemporalMonthDaySlots(result, isoMonth, isoDay, calendar, referenceISOYear);
	  return result;
	}
	function CreateTemporalYearMonthSlots(result, isoYear, isoMonth, calendar, referenceISODay) {
	  RejectISODate(isoYear, isoMonth, referenceISODay);
	  RejectYearMonthRange(isoYear, isoMonth);
	  CreateSlots(result);
	  SetSlot(result, ISO_YEAR, isoYear);
	  SetSlot(result, ISO_MONTH, isoMonth);
	  SetSlot(result, ISO_DAY, referenceISODay);
	  SetSlot(result, CALENDAR, calendar);
	  SetSlot(result, YEAR_MONTH_BRAND, true);
	  {
	    const repr = TemporalYearMonthToString(result, 'auto');
	    Object.defineProperty(result, '_repr_', {
	      value: `Temporal.PlainYearMonth <${repr}>`,
	      writable: false,
	      enumerable: false,
	      configurable: false
	    });
	  }
	}
	function CreateTemporalYearMonth(isoYear, isoMonth, calendar, referenceISODay) {
	  const TemporalPlainYearMonth = GetIntrinsic('%Temporal.PlainYearMonth%');
	  const result = ObjectCreate$6(TemporalPlainYearMonth.prototype);
	  CreateTemporalYearMonthSlots(result, isoYear, isoMonth, calendar, referenceISODay);
	  return result;
	}
	function CreateTemporalZonedDateTimeSlots(result, epochNanoseconds, timeZone, calendar) {
	  ValidateEpochNanoseconds(epochNanoseconds);
	  CreateSlots(result);
	  SetSlot(result, EPOCHNANOSECONDS, epochNanoseconds);
	  SetSlot(result, TIME_ZONE, timeZone);
	  SetSlot(result, CALENDAR, calendar);
	  {
	    const repr = TemporalZonedDateTimeToString(result, 'auto');
	    Object.defineProperty(result, '_repr_', {
	      value: `Temporal.ZonedDateTime <${repr}>`,
	      writable: false,
	      enumerable: false,
	      configurable: false
	    });
	  }
	}
	function CreateTemporalZonedDateTime(epochNanoseconds, timeZone) {
	  let calendar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'iso8601';
	  const TemporalZonedDateTime = GetIntrinsic('%Temporal.ZonedDateTime%');
	  const result = ObjectCreate$6(TemporalZonedDateTime.prototype);
	  CreateTemporalZonedDateTimeSlots(result, epochNanoseconds, timeZone, calendar);
	  return result;
	}
	function CalendarFieldKeysPresent(fields) {
	  return Call$1(ArrayPrototypeFilter, CALENDAR_FIELD_KEYS, [key => fields[key] !== undefined]);
	}
	function CalendarMergeFields(calendar, fields, additionalFields) {
	  const additionalKeys = CalendarFieldKeysPresent(additionalFields);
	  const overriddenKeys = GetIntrinsic('%calendarImpl%')(calendar).fieldKeysToIgnore(additionalKeys);
	  const merged = ObjectCreate$6(null);
	  const fieldsKeys = CalendarFieldKeysPresent(fields);
	  for (let ix = 0; ix < CALENDAR_FIELD_KEYS.length; ix++) {
	    let propValue = undefined;
	    const key = CALENDAR_FIELD_KEYS[ix];
	    if (Call$1(ArrayIncludes, fieldsKeys, [key]) && !Call$1(ArrayIncludes, overriddenKeys, [key])) {
	      propValue = fields[key];
	    }
	    if (Call$1(ArrayIncludes, additionalKeys, [key])) {
	      propValue = additionalFields[key];
	    }
	    if (propValue !== undefined) merged[key] = propValue;
	  }
	  return merged;
	}
	function CalendarDateAdd(calendar, isoDate, dateDuration, overflow) {
	  return GetIntrinsic('%calendarImpl%')(calendar).dateAdd(isoDate, dateDuration, overflow);
	}
	function CalendarDateUntil(calendar, isoDate, isoOtherDate, largestUnit) {
	  return GetIntrinsic('%calendarImpl%')(calendar).dateUntil(isoDate, isoOtherDate, largestUnit);
	}
	function CalendarYear(calendar, isoDate) {
	  return GetIntrinsic('%calendarImpl%')(calendar).year(isoDate);
	}
	function CalendarMonth(calendar, isoDate) {
	  return GetIntrinsic('%calendarImpl%')(calendar).month(isoDate);
	}
	function CalendarMonthCode(calendar, isoDate) {
	  return GetIntrinsic('%calendarImpl%')(calendar).monthCode(isoDate);
	}
	function CalendarDay(calendar, isoDate) {
	  return GetIntrinsic('%calendarImpl%')(calendar).day(isoDate);
	}
	function CalendarEra(calendar, isoDate) {
	  return GetIntrinsic('%calendarImpl%')(calendar).era(isoDate);
	}
	function CalendarEraYear(calendar, isoDate) {
	  return GetIntrinsic('%calendarImpl%')(calendar).eraYear(isoDate);
	}
	function CalendarDayOfWeek(calendar, isoDate) {
	  return GetIntrinsic('%calendarImpl%')(calendar).dayOfWeek(isoDate);
	}
	function CalendarDayOfYear(calendar, isoDate) {
	  return GetIntrinsic('%calendarImpl%')(calendar).dayOfYear(isoDate);
	}
	function CalendarWeekOfYear(calendar, isoDate) {
	  return GetIntrinsic('%calendarDateWeekOfYear%')(calendar, isoDate).week;
	}
	function CalendarYearOfWeek(calendar, isoDate) {
	  return GetIntrinsic('%calendarDateWeekOfYear%')(calendar, isoDate).year;
	}
	function CalendarDaysInWeek(calendar, isoDate) {
	  return GetIntrinsic('%calendarImpl%')(calendar).daysInWeek(isoDate);
	}
	function CalendarDaysInMonth(calendar, isoDate) {
	  return GetIntrinsic('%calendarImpl%')(calendar).daysInMonth(isoDate);
	}
	function CalendarDaysInYear(calendar, isoDate) {
	  return GetIntrinsic('%calendarImpl%')(calendar).daysInYear(isoDate);
	}
	function CalendarMonthsInYear(calendar, isoDate) {
	  return GetIntrinsic('%calendarImpl%')(calendar).monthsInYear(isoDate);
	}
	function CalendarInLeapYear(calendar, isoDate) {
	  return GetIntrinsic('%calendarImpl%')(calendar).inLeapYear(isoDate);
	}
	function ToTemporalCalendarIdentifier(calendarLike) {
	  if (Type$3(calendarLike) === 'Object') {
	    if (HasSlot(calendarLike, CALENDAR)) return GetSlot(calendarLike, CALENDAR);
	  }
	  const identifier = RequireString(calendarLike);
	  if (IsBuiltinCalendar(identifier)) return CanonicalizeCalendar(identifier);
	  let calendar;
	  try {
	    ({
	      calendar
	    } = ParseISODateTime(identifier));
	  } catch {
	    try {
	      ({
	        calendar
	      } = ParseTemporalYearMonthString(identifier));
	    } catch {
	      ({
	        calendar
	      } = ParseTemporalMonthDayString(identifier));
	    }
	  }
	  if (!calendar) calendar = 'iso8601';
	  if (!IsBuiltinCalendar(calendar)) throw new RangeError(`invalid calendar identifier ${calendar}`);
	  return CanonicalizeCalendar(calendar);
	}
	function GetTemporalCalendarIdentifierWithISODefault(item) {
	  if (HasSlot(item, CALENDAR)) return GetSlot(item, CALENDAR);
	  const {
	    calendar
	  } = item;
	  if (calendar === undefined) return 'iso8601';
	  return ToTemporalCalendarIdentifier(calendar);
	}
	function CalendarEquals(one, two) {
	  return CanonicalizeCalendar(one) === CanonicalizeCalendar(two);
	}
	function CalendarDateFromFields(calendar, fields, overflow) {
	  return GetIntrinsic('%calendarImpl%')(calendar).dateFromFields(fields, overflow);
	}
	function CalendarYearMonthFromFields(calendar, fields, overflow) {
	  return GetIntrinsic('%calendarImpl%')(calendar).yearMonthFromFields(fields, overflow);
	}
	function CalendarMonthDayFromFields(calendar, fields, overflow) {
	  return GetIntrinsic('%calendarImpl%')(calendar).monthDayFromFields(fields, overflow);
	}
	function ToTemporalTimeZoneIdentifier(temporalTimeZoneLike) {
	  if (Type$3(temporalTimeZoneLike) === 'Object') {
	    if (IsTemporalZonedDateTime(temporalTimeZoneLike)) return GetSlot(temporalTimeZoneLike, TIME_ZONE);
	  }
	  const timeZoneString = RequireString(temporalTimeZoneLike);
	  const {
	    tzName,
	    offsetMinutes
	  } = ParseTemporalTimeZoneString(timeZoneString);
	  if (offsetMinutes !== undefined) {
	    return FormatOffsetTimeZoneIdentifier(offsetMinutes);
	  }
	  // if offsetMinutes is undefined, then tzName must be present
	  const record = GetAvailableNamedTimeZoneIdentifier(tzName);
	  if (!record) throw new RangeError(`Unrecognized time zone ${tzName}`);
	  return record.identifier;
	}
	function TimeZoneEquals(one, two) {
	  if (one === two) return true;
	  const offsetMinutes1 = ParseTimeZoneIdentifier(one).offsetMinutes;
	  const offsetMinutes2 = ParseTimeZoneIdentifier(two).offsetMinutes;
	  if (offsetMinutes1 === undefined && offsetMinutes2 === undefined) {
	    // Calling GetAvailableNamedTimeZoneIdentifier is costly, so (unlike the
	    // spec) the polyfill will early-return if one of them isn't recognized. Try
	    // the second ID first because it's more likely to be unknown, because it
	    // can come from the argument of TimeZone.p.equals as opposed to the first
	    // ID which comes from the receiver.
	    const idRecord2 = GetAvailableNamedTimeZoneIdentifier(two);
	    if (!idRecord2) return false;
	    const idRecord1 = GetAvailableNamedTimeZoneIdentifier(one);
	    if (!idRecord1) return false;
	    return idRecord1.primaryIdentifier === idRecord2.primaryIdentifier;
	  } else {
	    return offsetMinutes1 === offsetMinutes2;
	  }
	}
	function TemporalDateTimeToDate(dateTime) {
	  return CreateTemporalDate(GetSlot(dateTime, ISO_YEAR), GetSlot(dateTime, ISO_MONTH), GetSlot(dateTime, ISO_DAY), GetSlot(dateTime, CALENDAR));
	}
	function TemporalDateTimeToTime(dateTime) {
	  const Time = GetIntrinsic('%Temporal.PlainTime%');
	  return new Time(GetSlot(dateTime, ISO_HOUR), GetSlot(dateTime, ISO_MINUTE), GetSlot(dateTime, ISO_SECOND), GetSlot(dateTime, ISO_MILLISECOND), GetSlot(dateTime, ISO_MICROSECOND), GetSlot(dateTime, ISO_NANOSECOND));
	}
	function GetOffsetNanosecondsFor(timeZone, epochNs) {
	  const offsetMinutes = ParseTimeZoneIdentifier(timeZone).offsetMinutes;
	  if (offsetMinutes !== undefined) return offsetMinutes * 60e9;
	  return GetNamedTimeZoneOffsetNanoseconds(timeZone, epochNs);
	}
	function FormatUTCOffsetNanoseconds(offsetNs) {
	  const sign = offsetNs < 0 ? '-' : '+';
	  const absoluteNs = MathAbs$1(offsetNs);
	  const hour = MathFloor$1(absoluteNs / 3600e9);
	  const minute = MathFloor$1(absoluteNs / 60e9) % 60;
	  const second = MathFloor$1(absoluteNs / 1e9) % 60;
	  const subSecondNs = absoluteNs % 1e9;
	  const precision = second === 0 && subSecondNs === 0 ? 'minute' : 'auto';
	  const timeString = FormatTimeString(hour, minute, second, subSecondNs, precision);
	  return `${sign}${timeString}`;
	}
	function GetISODateTimeFor(timeZone, epochNs) {
	  const offsetNs = GetOffsetNanosecondsFor(timeZone, epochNs);
	  let {
	    year,
	    month,
	    day,
	    hour,
	    minute,
	    second,
	    millisecond,
	    microsecond,
	    nanosecond
	  } = GetISOPartsFromEpoch(epochNs);
	  return BalanceISODateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond + offsetNs);
	}
	function GetEpochNanosecondsFor(timeZone, isoDateTime, disambiguation) {
	  const possibleEpochNs = GetPossibleEpochNanoseconds(timeZone, isoDateTime);
	  return DisambiguatePossibleEpochNanoseconds(possibleEpochNs, timeZone, isoDateTime, disambiguation);
	}

	// TODO: See if this logic can be removed in favour of GetNamedTimeZoneEpochNanoseconds
	function DisambiguatePossibleEpochNanoseconds(possibleEpochNs, timeZone, isoDateTime, disambiguation) {
	  const numInstants = possibleEpochNs.length;
	  if (numInstants === 1) return possibleEpochNs[0];
	  if (numInstants) {
	    switch (disambiguation) {
	      case 'compatible':
	      // fall through because 'compatible' means 'earlier' for "fall back" transitions
	      case 'earlier':
	        return possibleEpochNs[0];
	      case 'later':
	        return possibleEpochNs[numInstants - 1];
	      case 'reject':
	        {
	          throw new RangeError('multiple instants found');
	        }
	    }
	  }
	  if (disambiguation === 'reject') throw new RangeError('multiple instants found');
	  const {
	    year,
	    month,
	    day,
	    hour = 0,
	    minute = 0,
	    second = 0,
	    millisecond = 0,
	    microsecond = 0,
	    nanosecond = 0
	  } = isoDateTime;
	  const utcns = GetUTCEpochNanoseconds(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
	  const dayBefore = utcns.minus(DAY_NANOS);
	  ValidateEpochNanoseconds(dayBefore);
	  const offsetBefore = GetOffsetNanosecondsFor(timeZone, dayBefore);
	  const dayAfter = utcns.plus(DAY_NANOS);
	  ValidateEpochNanoseconds(dayAfter);
	  const offsetAfter = GetOffsetNanosecondsFor(timeZone, dayAfter);
	  const nanoseconds = offsetAfter - offsetBefore;
	  if (MathAbs$1(nanoseconds) > DAY_NANOS) {
	    throw new Error('assertion failure: UTC offset shift longer than 24 hours');
	  }
	  switch (disambiguation) {
	    case 'earlier':
	      {
	        const norm = TimeDuration.normalize(0, 0, 0, 0, 0, -nanoseconds);
	        const earlierTime = AddTime(hour, minute, second, millisecond, microsecond, nanosecond, norm);
	        const earlierDate = BalanceISODate(year, month, day + earlierTime.deltaDays);
	        return GetPossibleEpochNanoseconds(timeZone, {
	          ...earlierTime,
	          ...earlierDate
	        })[0];
	      }
	    case 'compatible':
	    // fall through because 'compatible' means 'later' for "spring forward" transitions
	    case 'later':
	      {
	        const norm = TimeDuration.normalize(0, 0, 0, 0, 0, nanoseconds);
	        const laterTime = AddTime(hour, minute, second, millisecond, microsecond, nanosecond, norm);
	        const laterDate = BalanceISODate(year, month, day + laterTime.deltaDays);
	        const possible = GetPossibleEpochNanoseconds(timeZone, {
	          ...laterTime,
	          ...laterDate
	        });
	        return possible[possible.length - 1];
	      }
	    case 'reject':
	      {
	        throw new Error('should not be reached: reject handled earlier');
	      }
	  }
	  throw new Error(`assertion failed: invalid disambiguation value ${disambiguation}`);
	}
	function GetPossibleEpochNanoseconds(timeZone, isoDateTime) {
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
	  } = isoDateTime;
	  const offsetMinutes = ParseTimeZoneIdentifier(timeZone).offsetMinutes;
	  if (offsetMinutes !== undefined) {
	    return [GetUTCEpochNanoseconds(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, offsetMinutes * 60e9)];
	  }
	  return GetNamedTimeZoneEpochNanoseconds(timeZone, year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
	}
	function GetStartOfDay(timeZone, isoDate) {
	  const isoDateTime = {
	    ...isoDate,
	    hour: 0,
	    minute: 0,
	    second: 0,
	    millisecond: 0,
	    microsecond: 0,
	    nanosecond: 0
	  };
	  const possibleEpochNs = GetPossibleEpochNanoseconds(timeZone, isoDateTime);
	  // If not a DST gap, return the single or earlier epochNs
	  if (possibleEpochNs.length) return possibleEpochNs[0];

	  // Otherwise, 00:00:00 lies within a DST gap. Compute an epochNs that's
	  // guaranteed to be before the transition
	  if (IsOffsetTimeZoneIdentifier(timeZone)) {
	    throw new Error('assertion failure: should only be reached with named time zone');
	  }
	  const utcns = GetUTCEpochNanoseconds(isoDate.year, isoDate.month, isoDate.day, 0, 0, 0, 0, 0, 0);
	  const dayBefore = utcns.minus(DAY_NANOS);
	  ValidateEpochNanoseconds(dayBefore);
	  return GetNamedTimeZoneNextTransition(timeZone, dayBefore);
	}
	function ISOYearString(year) {
	  let yearString;
	  if (year < 0 || year > 9999) {
	    const sign = year < 0 ? '-' : '+';
	    const yearNumber = MathAbs$1(year);
	    yearString = sign + ToZeroPaddedDecimalString$1(yearNumber, 6);
	  } else {
	    yearString = ToZeroPaddedDecimalString$1(year, 4);
	  }
	  return yearString;
	}
	function ISODateTimePartString(part) {
	  return ToZeroPaddedDecimalString$1(part, 2);
	}
	function FormatFractionalSeconds(subSecondNanoseconds, precision) {
	  let fraction;
	  if (precision === 'auto') {
	    if (subSecondNanoseconds === 0) return '';
	    const fractionFullPrecision = ToZeroPaddedDecimalString$1(subSecondNanoseconds, 9);
	    // now remove any trailing zeroes
	    fraction = Call$1(StringPrototypeReplace, fractionFullPrecision, [/0+$/, '']);
	  } else {
	    if (precision === 0) return '';
	    const fractionFullPrecision = ToZeroPaddedDecimalString$1(subSecondNanoseconds, 9);
	    fraction = Call$1(StringPrototypeSlice, fractionFullPrecision, [0, precision]);
	  }
	  return `.${fraction}`;
	}
	function FormatTimeString(hour, minute, second, subSecondNanoseconds, precision) {
	  let result = `${ISODateTimePartString(hour)}:${ISODateTimePartString(minute)}`;
	  if (precision === 'minute') return result;
	  result += `:${ISODateTimePartString(second)}`;
	  result += FormatFractionalSeconds(subSecondNanoseconds, precision);
	  return result;
	}
	function TemporalInstantToString(instant, timeZone, precision) {
	  let outputTimeZone = timeZone;
	  if (outputTimeZone === undefined) outputTimeZone = 'UTC';
	  const epochNs = GetSlot(instant, EPOCHNANOSECONDS);
	  const iso = GetISODateTimeFor(outputTimeZone, epochNs);
	  const dateTimeString = TemporalDateTimeToString(iso, 'iso8601', precision, 'never');
	  let timeZoneString = 'Z';
	  if (timeZone !== undefined) {
	    const offsetNs = GetOffsetNanosecondsFor(outputTimeZone, epochNs);
	    timeZoneString = FormatDateTimeUTCOffsetRounded(offsetNs);
	  }
	  return `${dateTimeString}${timeZoneString}`;
	}
	function formatAsDecimalNumber(num) {
	  if (num <= NumberMaxSafeInteger) return num.toString(10);
	  return bigInt(num).toString();
	}
	function TemporalDurationToString(years, months, weeks, days, hours, minutes, normSeconds) {
	  let precision = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 'auto';
	  const sign = DurationSign(years, months, weeks, days, hours, minutes, normSeconds.sec, 0, 0, normSeconds.subsec);
	  let datePart = '';
	  if (years !== 0) datePart += `${formatAsDecimalNumber(MathAbs$1(years))}Y`;
	  if (months !== 0) datePart += `${formatAsDecimalNumber(MathAbs$1(months))}M`;
	  if (weeks !== 0) datePart += `${formatAsDecimalNumber(MathAbs$1(weeks))}W`;
	  if (days !== 0) datePart += `${formatAsDecimalNumber(MathAbs$1(days))}D`;
	  let timePart = '';
	  if (hours !== 0) timePart += `${formatAsDecimalNumber(MathAbs$1(hours))}H`;
	  if (minutes !== 0) timePart += `${formatAsDecimalNumber(MathAbs$1(minutes))}M`;
	  if (!normSeconds.isZero() || years === 0 && months === 0 && weeks === 0 && days === 0 && hours === 0 && minutes === 0 || precision !== 'auto') {
	    const secondsPart = formatAsDecimalNumber(MathAbs$1(normSeconds.sec));
	    const subSecondsPart = FormatFractionalSeconds(MathAbs$1(normSeconds.subsec), precision);
	    timePart += `${secondsPart}${subSecondsPart}S`;
	  }
	  let result = `${sign < 0 ? '-' : ''}P${datePart}`;
	  if (timePart) result = `${result}T${timePart}`;
	  return result;
	}
	function TemporalDateToString(date) {
	  let showCalendar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'auto';
	  const year = ISOYearString(GetSlot(date, ISO_YEAR));
	  const month = ISODateTimePartString(GetSlot(date, ISO_MONTH));
	  const day = ISODateTimePartString(GetSlot(date, ISO_DAY));
	  const calendar = MaybeFormatCalendarAnnotation(GetSlot(date, CALENDAR), showCalendar);
	  return `${year}-${month}-${day}${calendar}`;
	}
	function TemporalDateTimeToString(isoDateTime, calendar, precision) {
	  let showCalendar = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'auto';
	  let {
	    year,
	    month,
	    day,
	    hour,
	    minute,
	    second,
	    millisecond,
	    microsecond,
	    nanosecond
	  } = isoDateTime;
	  const yearString = ISOYearString(year);
	  const monthString = ISODateTimePartString(month);
	  const dayString = ISODateTimePartString(day);
	  const subSecondNanoseconds = millisecond * 1e6 + microsecond * 1e3 + nanosecond;
	  const timeString = FormatTimeString(hour, minute, second, subSecondNanoseconds, precision);
	  const calendarString = MaybeFormatCalendarAnnotation(calendar, showCalendar);
	  return `${yearString}-${monthString}-${dayString}T${timeString}${calendarString}`;
	}
	function TemporalMonthDayToString(monthDay) {
	  let showCalendar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'auto';
	  const month = ISODateTimePartString(GetSlot(monthDay, ISO_MONTH));
	  const day = ISODateTimePartString(GetSlot(monthDay, ISO_DAY));
	  let resultString = `${month}-${day}`;
	  const calendar = GetSlot(monthDay, CALENDAR);
	  if (showCalendar === 'always' || showCalendar === 'critical' || calendar !== 'iso8601') {
	    const year = ISOYearString(GetSlot(monthDay, ISO_YEAR));
	    resultString = `${year}-${resultString}`;
	  }
	  const calendarString = FormatCalendarAnnotation(calendar, showCalendar);
	  if (calendarString) resultString += calendarString;
	  return resultString;
	}
	function TemporalYearMonthToString(yearMonth) {
	  let showCalendar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'auto';
	  const year = ISOYearString(GetSlot(yearMonth, ISO_YEAR));
	  const month = ISODateTimePartString(GetSlot(yearMonth, ISO_MONTH));
	  let resultString = `${year}-${month}`;
	  const calendar = GetSlot(yearMonth, CALENDAR);
	  if (showCalendar === 'always' || showCalendar === 'critical' || calendar !== 'iso8601') {
	    const day = ISODateTimePartString(GetSlot(yearMonth, ISO_DAY));
	    resultString += `-${day}`;
	  }
	  const calendarString = FormatCalendarAnnotation(calendar, showCalendar);
	  if (calendarString) resultString += calendarString;
	  return resultString;
	}
	function TemporalZonedDateTimeToString(zdt, precision) {
	  let showCalendar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'auto';
	  let showTimeZone = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'auto';
	  let showOffset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'auto';
	  let options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
	  let epochNs = GetSlot(zdt, EPOCHNANOSECONDS);
	  if (options) {
	    const {
	      unit,
	      increment,
	      roundingMode
	    } = options;
	    epochNs = RoundTemporalInstant(epochNs, increment, unit, roundingMode);
	  }
	  const tz = GetSlot(zdt, TIME_ZONE);
	  const offsetNs = GetOffsetNanosecondsFor(tz, epochNs);
	  const iso = GetISODateTimeFor(tz, epochNs);
	  let dateTimeString = TemporalDateTimeToString(iso, 'iso8601', precision, 'never');
	  if (showOffset !== 'never') {
	    dateTimeString += FormatDateTimeUTCOffsetRounded(offsetNs);
	  }
	  if (showTimeZone !== 'never') {
	    const flag = showTimeZone === 'critical' ? '!' : '';
	    dateTimeString += `[${flag}${tz}]`;
	  }
	  dateTimeString += MaybeFormatCalendarAnnotation(GetSlot(zdt, CALENDAR), showCalendar);
	  return dateTimeString;
	}
	function IsOffsetTimeZoneIdentifier(string) {
	  return OFFSET.test(string);
	}
	function ParseDateTimeUTCOffset(string) {
	  const match = OFFSET_WITH_PARTS.exec(string);
	  if (!match) {
	    throw new RangeError(`invalid time zone offset: ${string}`);
	  }
	  const sign = match[1] === '-' ? -1 : +1;
	  const hours = +match[2];
	  const minutes = +(match[3] || 0);
	  const seconds = +(match[4] || 0);
	  const nanoseconds = +((match[5] || 0) + '000000000').slice(0, 9);
	  const offsetNanoseconds = sign * (((hours * 60 + minutes) * 60 + seconds) * 1e9 + nanoseconds);
	  return offsetNanoseconds;
	}
	let canonicalTimeZoneIdsCache = undefined;
	function GetAvailableNamedTimeZoneIdentifier(identifier) {
	  // The most common case is when the identifier is a canonical time zone ID.
	  // Fast-path that case by caching all canonical IDs. For old ECMAScript
	  // implementations lacking this API, set the cache to `null` to avoid retries.
	  if (canonicalTimeZoneIdsCache === undefined) {
	    const canonicalTimeZoneIds = IntlSupportedValuesOf?.('timeZone');
	    if (canonicalTimeZoneIds) {
	      canonicalTimeZoneIdsCache = new MapCtor();
	      for (let ix = 0; ix < canonicalTimeZoneIds.length; ix++) {
	        const id = canonicalTimeZoneIds[ix];
	        Call$1(MapPrototypeSet$1, canonicalTimeZoneIdsCache, [ASCIILowercase(id), id]);
	      }
	    } else {
	      canonicalTimeZoneIdsCache = null;
	    }
	  }
	  const lower = ASCIILowercase(identifier);
	  let primaryIdentifier = canonicalTimeZoneIdsCache?.get(lower);
	  if (primaryIdentifier) return {
	    identifier: primaryIdentifier,
	    primaryIdentifier
	  };

	  // It's not already a primary identifier, so get its primary identifier (or
	  // return if it's not an available named time zone ID).
	  try {
	    const formatter = getIntlDateTimeFormatEnUsForTimeZone(identifier);
	    primaryIdentifier = formatter.resolvedOptions().timeZone;
	  } catch {
	    return undefined;
	  }

	  // Some legacy identifiers are aliases in ICU but not legal IANA identifiers.
	  // Reject them even if the implementation's Intl supports them, as they are
	  // not present in the IANA time zone database.
	  if (Call$1(SetPrototypeHas, ICU_LEGACY_TIME_ZONE_IDS, [identifier])) {
	    throw new RangeError(`${identifier} is a legacy time zone identifier from ICU. Use ${primaryIdentifier} instead`);
	  }

	  // The identifier is an alias (a deprecated identifier that's a synonym for a
	  // primary identifier), so we need to case-normalize the identifier to match
	  // the IANA TZDB, e.g. america/new_york => America/New_York. There's no
	  // built-in way to do this using Intl.DateTimeFormat, but the we can normalize
	  // almost all aliases (modulo a few special cases) using the TZDB's basic
	  // capitalization pattern:
	  // 1. capitalize the first letter of the identifier
	  // 2. capitalize the letter after every slash, dash, or underscore delimiter
	  const standardCase = [...lower].map((c, i) => i === 0 || '/-_'.includes(lower[i - 1]) ? c.toUpperCase() : c).join('');
	  const segments = standardCase.split('/');
	  if (segments.length === 1) {
	    // If a single-segment legacy ID is 2-3 chars or contains a number or dash, then
	    // (except for the "GB-Eire" special case) the case-normalized form is uppercase.
	    // These are: GMT+0, GMT-0, GB, NZ, PRC, ROC, ROK, UCT, GMT, GMT0, CET, CST6CDT,
	    // EET, EST, HST, MET, MST, MST7MDT, PST8PDT, WET, NZ-CHAT, and W-SU.
	    // Otherwise it's standard form: first letter capitalized, e.g. Iran, Egypt, Hongkong
	    if (lower === 'gb-eire') return {
	      identifier: 'GB-Eire',
	      primaryIdentifier
	    };
	    return {
	      identifier: lower.length <= 3 || /[-0-9]/.test(lower) ? lower.toUpperCase() : segments[0],
	      primaryIdentifier
	    };
	  }

	  // All Etc zone names are uppercase except three exceptions.
	  if (segments[0] === 'Etc') {
	    const etcName = ['Zulu', 'Greenwich', 'Universal'].includes(segments[1]) ? segments[1] : segments[1].toUpperCase();
	    return {
	      identifier: `Etc/${etcName}`,
	      primaryIdentifier
	    };
	  }

	  // Legacy US identifiers like US/Alaska or US/Indiana-Starke are 2 segments and use standard form.
	  if (segments[0] === 'Us') return {
	    identifier: `US/${segments[1]}`,
	    primaryIdentifier
	  };

	  // For multi-segment IDs, there's a few special cases in the second/third segments
	  const specialCases = {
	    Act: 'ACT',
	    Lhi: 'LHI',
	    Nsw: 'NSW',
	    Dar_Es_Salaam: 'Dar_es_Salaam',
	    Port_Of_Spain: 'Port_of_Spain',
	    Isle_Of_Man: 'Isle_of_Man',
	    Comodrivadavia: 'ComodRivadavia',
	    Knox_In: 'Knox_IN',
	    Dumontdurville: 'DumontDUrville',
	    Mcmurdo: 'McMurdo',
	    Denoronha: 'DeNoronha',
	    Easterisland: 'EasterIsland',
	    Bajanorte: 'BajaNorte',
	    Bajasur: 'BajaSur'
	  };
	  segments[1] = specialCases[segments[1]] ?? segments[1];
	  if (segments.length > 2) segments[2] = specialCases[segments[2]] ?? segments[2];
	  return {
	    identifier: segments.join('/'),
	    primaryIdentifier
	  };
	}
	function GetNamedTimeZoneOffsetNanoseconds(id, epochNanoseconds) {
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
	  } = GetNamedTimeZoneDateTimeParts(id, epochNanoseconds);
	  const utc = GetUTCEpochNanoseconds(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
	  return utc.minus(epochNanoseconds).toJSNumber();
	}
	function FormatOffsetTimeZoneIdentifier(offsetMinutes) {
	  const sign = offsetMinutes < 0 ? '-' : '+';
	  const absoluteMinutes = MathAbs$1(offsetMinutes);
	  const hour = MathFloor$1(absoluteMinutes / 60);
	  const minute = absoluteMinutes % 60;
	  const timeString = FormatTimeString(hour, minute, 0, 0, 'minute');
	  return `${sign}${timeString}`;
	}
	function FormatDateTimeUTCOffsetRounded(offsetNanoseconds) {
	  offsetNanoseconds = RoundNumberToIncrement(offsetNanoseconds, 60e9, 'halfExpand');
	  return FormatOffsetTimeZoneIdentifier(offsetNanoseconds / 60e9);
	}
	function GetUTCEpochNanoseconds(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) {
	  let offsetNs = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : 0;
	  // The pattern of leap years in the ISO 8601 calendar repeats every 400
	  // years. To avoid overflowing at the edges of the range, we reduce the year
	  // to the remainder after dividing by 400, and then add back all the
	  // nanoseconds from the multiples of 400 years at the end.
	  const reducedYear = year % 400;
	  const yearCycles = (year - reducedYear) / 400;

	  // Note: Date.UTC() interprets one and two-digit years as being in the
	  // 20th century, so don't use it
	  const legacyDate = new Date();
	  legacyDate.setUTCHours(hour, minute, second, millisecond);
	  legacyDate.setUTCFullYear(reducedYear, month - 1, day);
	  const ms = legacyDate.getTime();
	  let ns = bigInt(ms).multiply(1e6);
	  ns = ns.plus(bigInt(microsecond).multiply(1e3));
	  ns = ns.plus(bigInt(nanosecond));
	  let result = ns.plus(NS_IN_400_YEAR_CYCLE.multiply(bigInt(yearCycles)));
	  if (offsetNs) result = result.subtract(bigInt(offsetNs));
	  return result;
	}
	function GetISOPartsFromEpoch(epochNanoseconds) {
	  const {
	    quotient,
	    remainder
	  } = bigInt(epochNanoseconds).divmod(1e6);
	  let epochMilliseconds = +quotient;
	  let nanos = +remainder;
	  if (nanos < 0) {
	    nanos += 1e6;
	    epochMilliseconds -= 1;
	  }
	  const microsecond = MathFloor$1(nanos / 1e3) % 1e3;
	  const nanosecond = nanos % 1e3;
	  const item = new Date(epochMilliseconds);
	  const year = item.getUTCFullYear();
	  const month = item.getUTCMonth() + 1;
	  const day = item.getUTCDate();
	  const hour = item.getUTCHours();
	  const minute = item.getUTCMinutes();
	  const second = item.getUTCSeconds();
	  const millisecond = item.getUTCMilliseconds();
	  return {
	    epochMilliseconds,
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
	function GetNamedTimeZoneDateTimeParts(id, epochNanoseconds) {
	  const {
	    epochMilliseconds,
	    millisecond,
	    microsecond,
	    nanosecond
	  } = GetISOPartsFromEpoch(epochNanoseconds);
	  const {
	    year,
	    month,
	    day,
	    hour,
	    minute,
	    second
	  } = GetFormatterParts(id, epochMilliseconds);
	  return BalanceISODateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
	}
	function GetNamedTimeZoneNextTransition(id, epochNanoseconds) {
	  if (epochNanoseconds.lesser(BEFORE_FIRST_DST)) {
	    return GetNamedTimeZoneNextTransition(id, BEFORE_FIRST_DST);
	  }
	  // Optimization: the farthest that we'll look for a next transition is 3 years
	  // after the later of epochNanoseconds or the current time. If there are no
	  // transitions found before then, we'll assume that there will not be any more
	  // transitions after that.
	  const now = SystemUTCEpochNanoSeconds();
	  const base = epochNanoseconds.greater(now) ? epochNanoseconds : now;
	  const uppercap = base.plus(bigInt(DAY_NANOS).multiply(366 * 3));
	  let leftNanos = epochNanoseconds;
	  let leftOffsetNs = GetNamedTimeZoneOffsetNanoseconds(id, leftNanos);
	  let rightNanos = leftNanos;
	  let rightOffsetNs = leftOffsetNs;
	  while (leftOffsetNs === rightOffsetNs && bigInt(leftNanos).compare(uppercap) === -1) {
	    rightNanos = bigInt(leftNanos).plus(bigInt(DAY_NANOS).multiply(2 * 7));
	    if (rightNanos.greater(NS_MAX)) return null;
	    rightOffsetNs = GetNamedTimeZoneOffsetNanoseconds(id, rightNanos);
	    if (leftOffsetNs === rightOffsetNs) {
	      leftNanos = rightNanos;
	    }
	  }
	  if (leftOffsetNs === rightOffsetNs) return null;
	  const result = bisect(epochNs => GetNamedTimeZoneOffsetNanoseconds(id, epochNs), leftNanos, rightNanos, leftOffsetNs, rightOffsetNs);
	  return result;
	}
	function GetNamedTimeZonePreviousTransition(id, epochNanoseconds) {
	  // Optimization: if the instant is more than 3 years in the future and there
	  // are no transitions between the present day and 3 years from now, assume
	  // there are none after.
	  const now = SystemUTCEpochNanoSeconds();
	  const lookahead = now.plus(bigInt(DAY_NANOS).multiply(366 * 3));
	  if (epochNanoseconds.gt(lookahead)) {
	    const prevBeforeLookahead = GetNamedTimeZonePreviousTransition(id, lookahead);
	    if (prevBeforeLookahead === null || prevBeforeLookahead.lt(now)) {
	      return prevBeforeLookahead;
	    }
	  }

	  // We assume most time zones either have regular DST rules that extend
	  // indefinitely into the future, or they have no DST transitions between now
	  // and next year. Africa/Casablanca and Africa/El_Aaiun are unique cases
	  // that fit neither of these. Their irregular DST transitions are
	  // precomputed until 2087 in the current time zone database, so requesting
	  // the previous transition for an instant far in the future may take an
	  // extremely long time as it loops backward 2 weeks at a time.
	  if (id === 'Africa/Casablanca' || id === 'Africa/El_Aaiun') {
	    const lastPrecomputed = GetSlot(ToTemporalInstant('2088-01-01T00Z'), EPOCHNANOSECONDS);
	    if (lastPrecomputed.lesser(epochNanoseconds)) {
	      return GetNamedTimeZonePreviousTransition(id, lastPrecomputed);
	    }
	  }
	  let rightNanos = bigInt(epochNanoseconds).minus(1);
	  if (rightNanos.lesser(BEFORE_FIRST_DST)) return null;
	  let rightOffsetNs = GetNamedTimeZoneOffsetNanoseconds(id, rightNanos);
	  let leftNanos = rightNanos;
	  let leftOffsetNs = rightOffsetNs;
	  while (rightOffsetNs === leftOffsetNs && bigInt(rightNanos).compare(BEFORE_FIRST_DST) === 1) {
	    leftNanos = bigInt(rightNanos).minus(bigInt(DAY_NANOS).multiply(2 * 7));
	    if (leftNanos.lesser(BEFORE_FIRST_DST)) return null;
	    leftOffsetNs = GetNamedTimeZoneOffsetNanoseconds(id, leftNanos);
	    if (rightOffsetNs === leftOffsetNs) {
	      rightNanos = leftNanos;
	    }
	  }
	  if (rightOffsetNs === leftOffsetNs) return null;
	  const result = bisect(epochNs => GetNamedTimeZoneOffsetNanoseconds(id, epochNs), leftNanos, rightNanos, leftOffsetNs, rightOffsetNs);
	  return result;
	}
	function GetFormatterParts(timeZone, epochMilliseconds) {
	  const formatter = getIntlDateTimeFormatEnUsForTimeZone(timeZone);
	  // Using `format` instead of `formatToParts` for compatibility with older clients
	  const datetime = formatter.format(new Date(epochMilliseconds));
	  const splits = datetime.split(/[^\w]+/);
	  const month = splits[0];
	  const day = splits[1];
	  const year = splits[2];
	  const era = splits[3];
	  const hour = splits[4];
	  const minute = splits[5];
	  const second = splits[6];
	  return {
	    year: era.toUpperCase().startsWith('B') ? -year + 1 : +year,
	    month: +month,
	    day: +day,
	    hour: hour === '24' ? 0 : +hour,
	    // bugs.chromium.org/p/chromium/issues/detail?id=1045791
	    minute: +minute,
	    second: +second
	  };
	}

	// The goal of this function is to find the exact time(s) that correspond to a
	// calendar date and clock time in a particular time zone. Normally there will
	// be only one match. But for repeated clock times after backwards transitions
	// (like when DST ends) there may be two matches. And for skipped clock times
	// after forward transitions, there will be no matches.
	function GetNamedTimeZoneEpochNanoseconds(id, year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) {
	  // Get the offset of one day before and after the requested calendar date and
	  // clock time, avoiding overflows if near the edge of the Instant range.
	  let ns = GetUTCEpochNanoseconds(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
	  let nsEarlier = ns.minus(DAY_NANOS);
	  if (nsEarlier.lesser(NS_MIN)) nsEarlier = ns;
	  let nsLater = ns.plus(DAY_NANOS);
	  if (nsLater.greater(NS_MAX)) nsLater = ns;
	  const earlierOffsetNs = GetNamedTimeZoneOffsetNanoseconds(id, nsEarlier);
	  const laterOffsetNs = GetNamedTimeZoneOffsetNanoseconds(id, nsLater);

	  // If before and after offsets are the same, then we assume there was no
	  // offset transition in between, and therefore only one exact time can
	  // correspond to the provided calendar date and clock time. But if they're
	  // different, then there was an offset transition in between, so test both
	  // offsets to see which one(s) will yield a matching exact time.
	  const found = earlierOffsetNs === laterOffsetNs ? [earlierOffsetNs] : [earlierOffsetNs, laterOffsetNs];
	  return found.map(offsetNanoseconds => {
	    const epochNanoseconds = bigInt(ns).minus(offsetNanoseconds);
	    const parts = GetNamedTimeZoneDateTimeParts(id, epochNanoseconds);
	    if (year !== parts.year || month !== parts.month || day !== parts.day || hour !== parts.hour || minute !== parts.minute || second !== parts.second || millisecond !== parts.millisecond || microsecond !== parts.microsecond || nanosecond !== parts.nanosecond) {
	      return undefined;
	    }
	    return epochNanoseconds;
	  }).filter(x => x !== undefined);
	}
	function LeapYear(year) {
	  if (undefined === year) return false;
	  const isDiv4 = year % 4 === 0;
	  const isDiv100 = year % 100 === 0;
	  const isDiv400 = year % 400 === 0;
	  return isDiv4 && (!isDiv100 || isDiv400);
	}
	function ISODaysInMonth(year, month) {
	  const DoM = {
	    standard: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
	    leapyear: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
	  };
	  return DoM[LeapYear(year) ? 'leapyear' : 'standard'][month - 1];
	}
	function DurationSign(y, mon, w, d, h, min, s, ms, µs, ns) {
	  const fields = [y, mon, w, d, h, min, s, ms, µs, ns];
	  for (let index = 0; index < fields.length; index++) {
	    const prop = fields[index];
	    if (prop !== 0) return prop < 0 ? -1 : 1;
	  }
	  return 0;
	}
	function BalanceISOYearMonth(year, month) {
	  if (!NumberIsFinite(year) || !NumberIsFinite(month)) throw new RangeError('infinity is out of range');
	  month -= 1;
	  year += MathFloor$1(month / 12);
	  month %= 12;
	  if (month < 0) month += 12;
	  month += 1;
	  return {
	    year,
	    month
	  };
	}
	function BalanceISODate(year, month, day) {
	  if (!NumberIsFinite(day)) throw new RangeError('infinity is out of range');
	  ({
	    year,
	    month
	  } = BalanceISOYearMonth(year, month));

	  // The pattern of leap years in the ISO 8601 calendar repeats every 400
	  // years. So if we have more than 400 years in days, there's no need to
	  // convert days to a year 400 times. We can convert a multiple of 400 all at
	  // once.
	  const daysIn400YearCycle = 400 * 365 + 97;
	  if (MathAbs$1(day) > daysIn400YearCycle) {
	    const nCycles = MathTrunc(day / daysIn400YearCycle);
	    year += 400 * nCycles;
	    day -= nCycles * daysIn400YearCycle;
	  }
	  let daysInYear = 0;
	  let testYear = month > 2 ? year : year - 1;
	  while (daysInYear = LeapYear(testYear) ? 366 : 365, day < -daysInYear) {
	    year -= 1;
	    testYear -= 1;
	    day += daysInYear;
	  }
	  testYear += 1;
	  while (daysInYear = LeapYear(testYear) ? 366 : 365, day > daysInYear) {
	    year += 1;
	    testYear += 1;
	    day -= daysInYear;
	  }
	  while (day < 1) {
	    ({
	      year,
	      month
	    } = BalanceISOYearMonth(year, month - 1));
	    day += ISODaysInMonth(year, month);
	  }
	  while (day > ISODaysInMonth(year, month)) {
	    day -= ISODaysInMonth(year, month);
	    ({
	      year,
	      month
	    } = BalanceISOYearMonth(year, month + 1));
	  }
	  return {
	    year,
	    month,
	    day
	  };
	}
	function BalanceISODateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) {
	  const time = BalanceTime(hour, minute, second, millisecond, microsecond, nanosecond);
	  const isoDate = BalanceISODate(year, month, day + time.deltaDays);
	  return CombineISODateAndTimeRecord(isoDate, time);
	}
	function BalanceTime(hour, minute, second, millisecond, microsecond, nanosecond) {
	  hour = bigInt(hour);
	  minute = bigInt(minute);
	  second = bigInt(second);
	  millisecond = bigInt(millisecond);
	  microsecond = bigInt(microsecond);
	  nanosecond = bigInt(nanosecond);
	  let quotient;
	  ({
	    quotient,
	    remainder: nanosecond
	  } = NonNegativeBigIntDivmod(nanosecond, 1000));
	  microsecond = microsecond.add(quotient);
	  ({
	    quotient,
	    remainder: microsecond
	  } = NonNegativeBigIntDivmod(microsecond, 1000));
	  millisecond = millisecond.add(quotient);
	  ({
	    quotient,
	    remainder: millisecond
	  } = NonNegativeBigIntDivmod(millisecond, 1000));
	  second = second.add(quotient);
	  ({
	    quotient,
	    remainder: second
	  } = NonNegativeBigIntDivmod(second, 60));
	  minute = minute.add(quotient);
	  ({
	    quotient,
	    remainder: minute
	  } = NonNegativeBigIntDivmod(minute, 60));
	  hour = hour.add(quotient);
	  ({
	    quotient,
	    remainder: hour
	  } = NonNegativeBigIntDivmod(hour, 24));
	  return {
	    deltaDays: quotient.toJSNumber(),
	    hour: hour.toJSNumber(),
	    minute: minute.toJSNumber(),
	    second: second.toJSNumber(),
	    millisecond: millisecond.toJSNumber(),
	    microsecond: microsecond.toJSNumber(),
	    nanosecond: nanosecond.toJSNumber()
	  };
	}
	function BalanceTimeDuration(norm, largestUnit) {
	  const sign = norm.sign();
	  let nanoseconds = norm.abs().subsec;
	  let microseconds = 0;
	  let milliseconds = 0;
	  let seconds = norm.abs().sec;
	  let minutes = 0;
	  let hours = 0;
	  let days = 0;
	  switch (largestUnit) {
	    case 'year':
	    case 'month':
	    case 'week':
	    case 'day':
	      microseconds = MathTrunc(nanoseconds / 1000);
	      nanoseconds %= 1000;
	      milliseconds = MathTrunc(microseconds / 1000);
	      microseconds %= 1000;
	      seconds += MathTrunc(milliseconds / 1000);
	      milliseconds %= 1000;
	      minutes = MathTrunc(seconds / 60);
	      seconds %= 60;
	      hours = MathTrunc(minutes / 60);
	      minutes %= 60;
	      days = MathTrunc(hours / 24);
	      hours %= 24;
	      break;
	    case 'hour':
	      microseconds = MathTrunc(nanoseconds / 1000);
	      nanoseconds %= 1000;
	      milliseconds = MathTrunc(microseconds / 1000);
	      microseconds %= 1000;
	      seconds += MathTrunc(milliseconds / 1000);
	      milliseconds %= 1000;
	      minutes = MathTrunc(seconds / 60);
	      seconds %= 60;
	      hours = MathTrunc(minutes / 60);
	      minutes %= 60;
	      break;
	    case 'minute':
	      microseconds = MathTrunc(nanoseconds / 1000);
	      nanoseconds %= 1000;
	      milliseconds = MathTrunc(microseconds / 1000);
	      microseconds %= 1000;
	      seconds += MathTrunc(milliseconds / 1000);
	      milliseconds %= 1000;
	      minutes = MathTrunc(seconds / 60);
	      seconds %= 60;
	      break;
	    case 'second':
	      microseconds = MathTrunc(nanoseconds / 1000);
	      nanoseconds %= 1000;
	      milliseconds = MathTrunc(microseconds / 1000);
	      microseconds %= 1000;
	      seconds += MathTrunc(milliseconds / 1000);
	      milliseconds %= 1000;
	      break;
	    case 'millisecond':
	      microseconds = MathTrunc(nanoseconds / 1000);
	      nanoseconds %= 1000;
	      milliseconds = FMAPowerOf10(seconds, 3, MathTrunc(microseconds / 1000));
	      microseconds %= 1000;
	      seconds = 0;
	      break;
	    case 'microsecond':
	      microseconds = FMAPowerOf10(seconds, 6, MathTrunc(nanoseconds / 1000));
	      nanoseconds %= 1000;
	      seconds = 0;
	      break;
	    case 'nanosecond':
	      nanoseconds = FMAPowerOf10(seconds, 9, nanoseconds);
	      seconds = 0;
	      break;
	    default:
	      throw new Error('assert not reached');
	  }
	  days *= sign;
	  hours *= sign;
	  minutes *= sign;
	  seconds *= sign;
	  milliseconds *= sign;
	  microseconds *= sign;
	  nanoseconds *= sign;
	  RejectDuration(0, 0, 0, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
	  return {
	    days,
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds,
	    nanoseconds
	  };
	}
	function UnbalanceDateDurationRelative(years, months, weeks, days, plainRelativeTo) {
	  if (years === 0 && months === 0 && weeks === 0) return days;

	  // balance years, months, and weeks down to days
	  const isoDate = TemporalObjectToISODateRecord(plainRelativeTo);
	  const later = CalendarDateAdd(GetSlot(plainRelativeTo, CALENDAR), isoDate, {
	    years,
	    months,
	    weeks
	  }, 'constrain');
	  const epochDaysEarlier = ISODateToEpochDays(isoDate.year, isoDate.month, isoDate.day);
	  const epochDaysLater = ISODateToEpochDays(later.year, later.month, later.day);
	  const yearsMonthsWeeksInDays = epochDaysLater - epochDaysEarlier;
	  return days + yearsMonthsWeeksInDays;
	}
	function CreateNegatedTemporalDuration(duration) {
	  const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
	  return new TemporalDuration(-GetSlot(duration, YEARS), -GetSlot(duration, MONTHS), -GetSlot(duration, WEEKS), -GetSlot(duration, DAYS), -GetSlot(duration, HOURS), -GetSlot(duration, MINUTES), -GetSlot(duration, SECONDS), -GetSlot(duration, MILLISECONDS), -GetSlot(duration, MICROSECONDS), -GetSlot(duration, NANOSECONDS));
	}
	function ConstrainToRange(value, min, max) {
	  return MathMin(max, MathMax(min, value));
	}
	function ConstrainISODate(year, month, day) {
	  month = ConstrainToRange(month, 1, 12);
	  day = ConstrainToRange(day, 1, ISODaysInMonth(year, month));
	  return {
	    year,
	    month,
	    day
	  };
	}
	function ConstrainTime(hour, minute, second, millisecond, microsecond, nanosecond) {
	  hour = ConstrainToRange(hour, 0, 23);
	  minute = ConstrainToRange(minute, 0, 59);
	  second = ConstrainToRange(second, 0, 59);
	  millisecond = ConstrainToRange(millisecond, 0, 999);
	  microsecond = ConstrainToRange(microsecond, 0, 999);
	  nanosecond = ConstrainToRange(nanosecond, 0, 999);
	  return {
	    hour,
	    minute,
	    second,
	    millisecond,
	    microsecond,
	    nanosecond
	  };
	}
	function RejectToRange(value, min, max) {
	  if (value < min || value > max) throw new RangeError(`value out of range: ${min} <= ${value} <= ${max}`);
	}
	function RejectISODate(year, month, day) {
	  RejectToRange(month, 1, 12);
	  RejectToRange(day, 1, ISODaysInMonth(year, month));
	}
	function RejectDateRange(year, month, day) {
	  // Noon avoids trouble at edges of DateTime range (excludes midnight)
	  RejectDateTimeRange(year, month, day, 12, 0, 0, 0, 0, 0);
	}
	function RejectTime(hour, minute, second, millisecond, microsecond, nanosecond) {
	  RejectToRange(hour, 0, 23);
	  RejectToRange(minute, 0, 59);
	  RejectToRange(second, 0, 59);
	  RejectToRange(millisecond, 0, 999);
	  RejectToRange(microsecond, 0, 999);
	  RejectToRange(nanosecond, 0, 999);
	}
	function RejectDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) {
	  RejectISODate(year, month, day);
	  RejectTime(hour, minute, second, millisecond, microsecond, nanosecond);
	}
	function RejectDateTimeRange(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) {
	  const ns = GetUTCEpochNanoseconds(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
	  if (ns.lesser(DATETIME_NS_MIN) || ns.greater(DATETIME_NS_MAX)) {
	    // Because PlainDateTime's range is wider than Instant's range, the line
	    // below will always throw. Calling `ValidateEpochNanoseconds` avoids
	    // repeating the same error message twice.
	    ValidateEpochNanoseconds(ns);
	  }
	}

	// In the spec, IsValidEpochNanoseconds returns a boolean and call sites are
	// responsible for throwing. In the polyfill, ValidateEpochNanoseconds takes its
	// place so that we can DRY the throwing code.
	function ValidateEpochNanoseconds(epochNanoseconds) {
	  if (epochNanoseconds.lesser(NS_MIN) || epochNanoseconds.greater(NS_MAX)) {
	    throw new RangeError('date/time value is outside of supported range');
	  }
	}
	function RejectYearMonthRange(year, month) {
	  RejectToRange(year, YEAR_MIN, YEAR_MAX);
	  if (year === YEAR_MIN) {
	    RejectToRange(month, 4, 12);
	  } else if (year === YEAR_MAX) {
	    RejectToRange(month, 1, 9);
	  }
	}
	function RejectDuration(y, mon, w, d, h, min, s, ms, µs, ns) {
	  const sign = DurationSign(y, mon, w, d, h, min, s, ms, µs, ns);
	  const fields = [y, mon, w, d, h, min, s, ms, µs, ns];
	  for (let index = 0; index < fields.length; index++) {
	    const prop = fields[index];
	    if (!NumberIsFinite(prop)) throw new RangeError('infinite values not allowed as duration fields');
	    const propSign = MathSign(prop);
	    if (propSign !== 0 && propSign !== sign) throw new RangeError('mixed-sign values not allowed as duration fields');
	  }
	  if (MathAbs$1(y) >= 2 ** 32 || MathAbs$1(mon) >= 2 ** 32 || MathAbs$1(w) >= 2 ** 32) {
	    throw new RangeError('years, months, and weeks must be < 2³²');
	  }
	  const msResult = TruncatingDivModByPowerOf10(ms, 3);
	  const µsResult = TruncatingDivModByPowerOf10(µs, 6);
	  const nsResult = TruncatingDivModByPowerOf10(ns, 9);
	  const remainderSec = TruncatingDivModByPowerOf10(msResult.mod * 1e6 + µsResult.mod * 1e3 + nsResult.mod, 9).div;
	  const totalSec = d * 86400 + h * 3600 + min * 60 + s + msResult.div + µsResult.div + nsResult.div + remainderSec;
	  if (!NumberIsSafeInteger(totalSec)) {
	    throw new RangeError('total of duration time units cannot exceed 9007199254740991.999999999 s');
	  }
	}
	function ISODateSurpasses(sign, y1, m1, d1, y2, m2, d2) {
	  const cmp = CompareISODate(y1, m1, d1, y2, m2, d2);
	  return sign * cmp === 1;
	}
	function CombineDateAndNormalizedTimeDuration(y, m, w, d, norm) {
	  const dateSign = DurationSign(y, m, w, d, 0, 0, 0, 0, 0, 0);
	  const timeSign = norm.sign();
	  if (dateSign !== 0 && timeSign !== 0 && dateSign !== timeSign) {
	    throw new RangeError('mixed-sign values not allowed as duration fields');
	  }
	}
	function ISODateToEpochDays(y, m, d) {
	  // This is inefficient, but we use GetUTCEpochNanoseconds to avoid duplicating
	  // the workarounds for legacy Date. (see that function for explanation)
	  return GetUTCEpochNanoseconds(y, m, d, 0, 0, 0, 0, 0, 0).divide(DAY_NANOS).toJSNumber();
	}
	function DifferenceISODate(y1, m1, d1, y2, m2, d2) {
	  let largestUnit = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 'days';
	  const sign = -CompareISODate(y1, m1, d1, y2, m2, d2);
	  if (sign === 0) return {
	    years: 0,
	    months: 0,
	    weeks: 0,
	    days: 0
	  };
	  let years = 0;
	  let months = 0;
	  let intermediate;
	  if (largestUnit === 'year' || largestUnit === 'month') {
	    // We can skip right to the neighbourhood of the correct number of years,
	    // it'll be at least one less than y2 - y1 (unless it's zero)
	    let candidateYears = y2 - y1;
	    if (candidateYears !== 0) candidateYears -= sign;
	    // loops at most twice
	    while (!ISODateSurpasses(sign, y1 + candidateYears, m1, d1, y2, m2, d2)) {
	      years = candidateYears;
	      candidateYears += sign;
	    }
	    let candidateMonths = sign;
	    intermediate = BalanceISOYearMonth(y1 + years, m1 + candidateMonths);
	    // loops at most 12 times
	    while (!ISODateSurpasses(sign, intermediate.year, intermediate.month, d1, y2, m2, d2)) {
	      months = candidateMonths;
	      candidateMonths += sign;
	      intermediate = BalanceISOYearMonth(intermediate.year, intermediate.month + sign);
	    }
	    if (largestUnit === 'month') {
	      months += years * 12;
	      years = 0;
	    }
	  }
	  intermediate = BalanceISOYearMonth(y1 + years, m1 + months);
	  const constrained = ConstrainISODate(intermediate.year, intermediate.month, d1);
	  let weeks = 0;
	  let days = ISODateToEpochDays(y2, m2, d2) - ISODateToEpochDays(constrained.year, constrained.month, constrained.day);
	  if (largestUnit === 'week') {
	    weeks = MathTrunc(days / 7);
	    days %= 7;
	  }
	  return {
	    years,
	    months,
	    weeks,
	    days
	  };
	}
	function DifferenceTime(h1, min1, s1, ms1, µs1, ns1, h2, min2, s2, ms2, µs2, ns2) {
	  const hours = h2 - h1;
	  const minutes = min2 - min1;
	  const seconds = s2 - s1;
	  const milliseconds = ms2 - ms1;
	  const microseconds = µs2 - µs1;
	  const nanoseconds = ns2 - ns1;
	  const norm = TimeDuration.normalize(hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
	  if (norm.abs().sec >= 86400) throw new Error('assertion failure in DifferenceTime: _bt_.[[Days]] should be 0');
	  return norm;
	}
	function DifferenceInstant(ns1, ns2, increment, smallestUnit, roundingMode) {
	  const diff = TimeDuration.fromEpochNsDiff(ns2, ns1);
	  return RoundTimeDuration(0, diff, increment, smallestUnit, roundingMode);
	}
	function DifferenceISODateTime(y1, mon1, d1, h1, min1, s1, ms1, µs1, ns1, y2, mon2, d2, h2, min2, s2, ms2, µs2, ns2, calendar, largestUnit) {
	  let timeDuration = DifferenceTime(h1, min1, s1, ms1, µs1, ns1, h2, min2, s2, ms2, µs2, ns2);
	  const timeSign = timeDuration.sign();
	  const dateSign = CompareISODate(y2, mon2, d2, y1, mon1, d1);

	  // back-off a day from date2 so that the signs of the date a time diff match
	  if (dateSign === -timeSign) {
	    ({
	      year: y2,
	      month: mon2,
	      day: d2
	    } = BalanceISODate(y2, mon2, d2 + timeSign));
	    timeDuration = timeDuration.add24HourDays(-timeSign);
	  }
	  const date1 = {
	    year: y1,
	    month: mon1,
	    day: d1
	  };
	  const date2 = {
	    year: y2,
	    month: mon2,
	    day: d2
	  };
	  const dateLargestUnit = LargerOfTwoTemporalUnits('day', largestUnit);
	  let {
	    years,
	    months,
	    weeks,
	    days
	  } = CalendarDateUntil(calendar, date1, date2, dateLargestUnit);
	  if (largestUnit !== dateLargestUnit) {
	    // largestUnit < days, so add the days in to the normalized duration
	    timeDuration = timeDuration.add24HourDays(days);
	    days = 0;
	  }
	  CombineDateAndNormalizedTimeDuration(years, months, weeks, days, timeDuration);
	  return {
	    years,
	    months,
	    weeks,
	    days,
	    norm: timeDuration
	  };
	}
	function DifferenceZonedDateTime(ns1, ns2, timeZone, calendar, largestUnit) {
	  const nsDiff = ns2.subtract(ns1);
	  if (nsDiff.isZero()) {
	    return {
	      years: 0,
	      months: 0,
	      weeks: 0,
	      days: 0,
	      norm: TimeDuration.ZERO
	    };
	  }
	  const sign = nsDiff.lt(0) ? -1 : 1;

	  // Convert start/end instants to datetimes
	  const isoDtStart = GetISODateTimeFor(timeZone, ns1);
	  const isoDtEnd = GetISODateTimeFor(timeZone, ns2);

	  // Simulate moving ns1 as many years/months/weeks/days as possible without
	  // surpassing ns2. This value is stored in intermediateDateTime/intermediateInstant/intermediateNs.
	  // We do not literally move years/months/weeks/days with calendar arithmetic,
	  // but rather assume intermediateDateTime will have the same time-parts as
	  // dtStart and the date-parts from dtEnd, and move backward from there.
	  // The number of days we move backward is stored in dayCorrection.
	  // Credit to Adam Shaw for devising this algorithm.
	  let dayCorrection = 0;
	  let intermediateDateTime;
	  let norm;

	  // The max number of allowed day corrections depends on the direction of travel.
	  // Both directions allow for 1 day correction due to an ISO wall-clock overshoot (see below).
	  // Only the forward direction allows for an additional 1 day correction caused by a push-forward
	  // 'compatible' DST transition causing the wall-clock to overshoot again.
	  // This max value is inclusive.
	  let maxDayCorrection = sign === 1 ? 2 : 1;

	  // Detect ISO wall-clock overshoot.
	  // If the diff of the ISO wall-clock times is opposite to the overall diff's sign,
	  // we are guaranteed to need at least one day correction.
	  let timeDuration = DifferenceTime(isoDtStart.hour, isoDtStart.minute, isoDtStart.second, isoDtStart.millisecond, isoDtStart.microsecond, isoDtStart.nanosecond, isoDtEnd.hour, isoDtEnd.minute, isoDtEnd.second, isoDtEnd.millisecond, isoDtEnd.microsecond, isoDtEnd.nanosecond);
	  if (timeDuration.sign() === -sign) {
	    dayCorrection++;
	  }
	  for (; dayCorrection <= maxDayCorrection; dayCorrection++) {
	    const intermediateDate = BalanceISODate(isoDtEnd.year, isoDtEnd.month, isoDtEnd.day - dayCorrection * sign);

	    // Incorporate time parts from dtStart
	    intermediateDateTime = {
	      year: intermediateDate.year,
	      month: intermediateDate.month,
	      day: intermediateDate.day,
	      hour: isoDtStart.hour,
	      minute: isoDtStart.minute,
	      second: isoDtStart.second,
	      millisecond: isoDtStart.millisecond,
	      microsecond: isoDtStart.microsecond,
	      nanosecond: isoDtStart.nanosecond
	    };

	    // Convert intermediate datetime to epoch-nanoseconds (may disambiguate)
	    const intermediateNs = GetEpochNanosecondsFor(timeZone, intermediateDateTime, 'compatible');

	    // Compute the nanosecond diff between the intermediate instant and the final destination
	    norm = TimeDuration.fromEpochNsDiff(ns2, intermediateNs);

	    // Did intermediateNs NOT surpass ns2?
	    // If so, exit the loop with success (without incrementing dayCorrection past maxDayCorrection)
	    if (norm.sign() !== -sign) {
	      break;
	    }
	  }
	  if (dayCorrection > maxDayCorrection) {
	    throw new Error(`assertion failed: more than ${maxDayCorrection} day correction needed`);
	  }

	  // Similar to what happens in DifferenceISODateTime with date parts only:
	  const dateLargestUnit = LargerOfTwoTemporalUnits('day', largestUnit);
	  const {
	    years,
	    months,
	    weeks,
	    days
	  } = CalendarDateUntil(calendar, isoDtStart, intermediateDateTime, dateLargestUnit);
	  CombineDateAndNormalizedTimeDuration(years, months, weeks, days, norm);
	  return {
	    years,
	    months,
	    weeks,
	    days,
	    norm
	  };
	}

	// Epoch-nanosecond bounding technique where the start/end of the calendar-unit
	// interval are converted to epoch-nanosecond times and destEpochNs is nudged to
	// either one.
	function NudgeToCalendarUnit(sign, duration, destEpochNs, dateTime, calendar, timeZone, increment, unit, roundingMode) {
	  // unit must be day, week, month, or year
	  // timeZone may be undefined

	  // Create a duration with smallestUnit trunc'd towards zero
	  // Create a separate duration that incorporates roundingIncrement
	  let r1, r2, startDuration, endDuration;
	  switch (unit) {
	    case 'year':
	      {
	        const years = RoundNumberToIncrement(duration.years, increment, 'trunc');
	        r1 = years;
	        r2 = years + increment * sign;
	        startDuration = {
	          years: r1,
	          months: 0,
	          weeks: 0,
	          days: 0
	        };
	        endDuration = {
	          ...startDuration,
	          years: r2
	        };
	        break;
	      }
	    case 'month':
	      {
	        const months = RoundNumberToIncrement(duration.months, increment, 'trunc');
	        r1 = months;
	        r2 = months + increment * sign;
	        startDuration = {
	          years: duration.years,
	          months: r1,
	          weeks: 0,
	          days: 0
	        };
	        endDuration = {
	          ...startDuration,
	          months: r2
	        };
	        break;
	      }
	    case 'week':
	      {
	        const year = dateTime.year + duration.years;
	        const month = dateTime.month + duration.months;
	        const day = dateTime.day;
	        const weeksStart = BalanceISODate(year, month, day);
	        const weeksEnd = BalanceISODate(year, month, day + duration.days);
	        const untilResult = CalendarDateUntil(calendar, weeksStart, weeksEnd, 'week');
	        const weeks = RoundNumberToIncrement(duration.weeks + untilResult.weeks, increment, 'trunc');
	        r1 = weeks;
	        r2 = weeks + increment * sign;
	        startDuration = {
	          years: duration.years,
	          months: duration.months,
	          weeks: r1,
	          days: 0
	        };
	        endDuration = {
	          ...startDuration,
	          weeks: r2
	        };
	        break;
	      }
	    case 'day':
	      {
	        const days = RoundNumberToIncrement(duration.days, increment, 'trunc');
	        r1 = days;
	        r2 = days + increment * sign;
	        startDuration = {
	          years: duration.years,
	          months: duration.months,
	          weeks: duration.weeks,
	          days: r1
	        };
	        endDuration = {
	          ...startDuration,
	          days: r2
	        };
	        break;
	      }
	    default:
	      throw new Error('assert not reached');
	  }
	  if (sign === 1 && (r1 < 0 || r1 >= r2) || sign === -1 && (r1 > 0 || r1 <= r2)) {
	    throw new Error('assertion failed: ordering of r1, r2 according to sign');
	  }

	  // Apply to origin, output PlainDateTimes
	  const startDate = ISODateTimeToDateRecord(dateTime);
	  const start = CalendarDateAdd(calendar, startDate, startDuration, 'constrain');
	  const end = CalendarDateAdd(calendar, startDate, endDuration, 'constrain');

	  // Convert to epoch-nanoseconds
	  let startEpochNs, endEpochNs;
	  if (timeZone) {
	    const startDateTime = CombineISODateAndTimeRecord(start, dateTime);
	    startEpochNs = GetEpochNanosecondsFor(timeZone, startDateTime, 'compatible');
	    const endDateTime = CombineISODateAndTimeRecord(end, dateTime);
	    endEpochNs = GetEpochNanosecondsFor(timeZone, endDateTime, 'compatible');
	  } else {
	    startEpochNs = GetUTCEpochNanoseconds(start.year, start.month, start.day, dateTime.hour, dateTime.minute, dateTime.second, dateTime.millisecond, dateTime.microsecond, dateTime.nanosecond);
	    endEpochNs = GetUTCEpochNanoseconds(end.year, end.month, end.day, dateTime.hour, dateTime.minute, dateTime.second, dateTime.millisecond, dateTime.microsecond, dateTime.nanosecond);
	  }

	  // Round the smallestUnit within the epoch-nanosecond span
	  if (sign === 1 && (startEpochNs.gt(destEpochNs) || destEpochNs.gt(endEpochNs)) || sign === -1 && (endEpochNs.gt(destEpochNs) || destEpochNs.gt(startEpochNs))) {
	    throw new RangeError(`custom calendar reported a ${unit} that is 0 days long`);
	  }
	  if (endEpochNs.equals(startEpochNs)) {
	    throw new Error('assertion failed: startEpochNs ≠ endEpochNs');
	  }
	  const numerator = TimeDuration.fromEpochNsDiff(destEpochNs, startEpochNs);
	  const denominator = TimeDuration.fromEpochNsDiff(endEpochNs, startEpochNs);
	  const unsignedRoundingMode = GetUnsignedRoundingMode(roundingMode, sign < 0 ? 'negative' : 'positive');
	  const cmp = numerator.add(numerator).abs().subtract(denominator.abs()).sign();
	  const even = MathAbs$1(r1) / increment % 2 === 0;
	  const roundedUnit = numerator.isZero() ? MathAbs$1(r1) : !numerator.cmp(denominator) // equal?
	  ? MathAbs$1(r2) : ApplyUnsignedRoundingMode(MathAbs$1(r1), MathAbs$1(r2), cmp, even, unsignedRoundingMode);

	  // Trick to minimize rounding error, due to the lack of fma() in JS
	  const fakeNumerator = new TimeDuration(denominator.totalNs.times(r1).add(numerator.totalNs.times(increment * sign)));
	  const total = fakeNumerator.fdiv(denominator.totalNs);
	  if (MathAbs$1(total) < MathAbs$1(r1) || MathAbs$1(total) > MathAbs$1(r2)) {
	    throw new Error('assertion failed: r1 ≤ total ≤ r2');
	  }

	  // Determine whether expanded or contracted
	  const didExpandCalendarUnit = roundedUnit === MathAbs$1(r2);
	  duration = {
	    ...(didExpandCalendarUnit ? endDuration : startDuration),
	    norm: TimeDuration.ZERO
	  };
	  return {
	    duration,
	    total,
	    nudgedEpochNs: didExpandCalendarUnit ? endEpochNs : startEpochNs,
	    didExpandCalendarUnit
	  };
	}

	// Attempts rounding of time units within a time zone's day, but if the rounding
	// causes time to exceed the total time within the day, rerun rounding in next
	// day.
	function NudgeToZonedTime(sign, duration, dateTime, calendar, timeZone, increment, unit, roundingMode) {
	  // unit must be hour or smaller

	  // Apply to origin, output start/end of the day as PlainDateTimes
	  const date = ISODateTimeToDateRecord(dateTime);
	  const dateDuration = {
	    years: duration.years,
	    months: duration.months,
	    weeks: duration.weeks,
	    days: duration.days
	  };
	  const start = CalendarDateAdd(calendar, date, dateDuration, 'constrain');
	  const startDateTime = CombineISODateAndTimeRecord(start, dateTime);
	  const endDate = BalanceISODate(start.year, start.month, start.day + sign);
	  const endDateTime = CombineISODateAndTimeRecord(endDate, dateTime);

	  // Compute the epoch-nanosecond start/end of the final whole-day interval
	  // If duration has negative sign, startEpochNs will be after endEpochNs
	  const startEpochNs = GetEpochNanosecondsFor(timeZone, startDateTime, 'compatible');
	  const endEpochNs = GetEpochNanosecondsFor(timeZone, endDateTime, 'compatible');

	  // The signed amount of time from the start of the whole-day interval to the end
	  const daySpan = TimeDuration.fromEpochNsDiff(endEpochNs, startEpochNs);
	  if (daySpan.sign() !== sign) throw new RangeError('time zone returned inconsistent Instants');

	  // Compute time parts of the duration to nanoseconds and round
	  // Result could be negative
	  let roundedNorm = duration.norm.round(NS_PER_TIME_UNIT.get(unit) * increment, roundingMode);

	  // Does the rounded time exceed the time-in-day?
	  const beyondDaySpan = roundedNorm.subtract(daySpan);
	  const didRoundBeyondDay = beyondDaySpan.sign() !== -sign;
	  let dayDelta, nudgedEpochNs;
	  if (didRoundBeyondDay) {
	    // If rounded into next day, use the day-end as the local origin and rerun
	    // the rounding
	    dayDelta = sign;
	    roundedNorm = beyondDaySpan.round(NS_PER_TIME_UNIT.get(unit) * increment, roundingMode);
	    nudgedEpochNs = roundedNorm.addToEpochNs(endEpochNs);
	  } else {
	    // Otherwise, if time not rounded beyond day, use the day-start as the local
	    // origin
	    dayDelta = 0;
	    nudgedEpochNs = roundedNorm.addToEpochNs(startEpochNs);
	  }
	  duration = {
	    years: duration.years,
	    months: duration.months,
	    weeks: duration.weeks,
	    days: duration.days + dayDelta,
	    norm: roundedNorm
	  };
	  return {
	    duration,
	    total: NaN,
	    // Not computed in this path, so we assert that it is not NaN later on
	    nudgedEpochNs,
	    didExpandCalendarUnit: didRoundBeyondDay
	  };
	}

	// Converts all fields to nanoseconds and does integer rounding.
	function NudgeToDayOrTime(duration, destEpochNs, largestUnit, increment, smallestUnit, roundingMode) {
	  // unit must be day or smaller

	  const norm = duration.norm.add24HourDays(duration.days);
	  // Convert to nanoseconds and round
	  const unitLength = NS_PER_TIME_UNIT.get(smallestUnit);
	  const total = norm.fdiv(unitLength);
	  const roundedNorm = norm.round(increment * unitLength, roundingMode);
	  const diffNorm = roundedNorm.subtract(norm);

	  // Determine if whole days expanded
	  const {
	    quotient: wholeDays
	  } = norm.divmod(DAY_NANOS);
	  const {
	    quotient: roundedWholeDays
	  } = roundedNorm.divmod(DAY_NANOS);
	  const didExpandDays = MathSign(roundedWholeDays - wholeDays) === norm.sign();
	  const nudgedEpochNs = diffNorm.addToEpochNs(destEpochNs);
	  let days = 0;
	  let remainder = roundedNorm;
	  if (LargerOfTwoTemporalUnits(largestUnit, 'day') === largestUnit) {
	    days = roundedWholeDays;
	    remainder = roundedNorm.subtract(TimeDuration.normalize(roundedWholeDays * 24, 0, 0, 0, 0, 0));
	  }
	  duration = {
	    ...duration,
	    days,
	    norm: remainder
	  };
	  return {
	    duration,
	    total,
	    nudgedEpochNs,
	    didExpandCalendarUnit: didExpandDays
	  };
	}

	// Given a potentially bottom-heavy duration, bubble up smaller units to larger
	// units. Any units smaller than smallestUnit are already zeroed-out.
	function BubbleRelativeDuration(sign, duration, nudgedEpochNs, plainDateTime, calendar, timeZone, largestUnit, smallestUnit) {
	  // smallestUnit is day or larger

	  if (smallestUnit === 'year') return duration;

	  // Check to see if nudgedEpochNs has hit the boundary of any units higher than
	  // smallestUnit, in which case increment the higher unit and clear smaller
	  // units.
	  const largestUnitIndex = UNITS_DESCENDING.indexOf(largestUnit);
	  const smallestUnitIndex = UNITS_DESCENDING.indexOf(smallestUnit);
	  for (let unitIndex = smallestUnitIndex - 1; unitIndex >= largestUnitIndex; unitIndex--) {
	    // The only situation where days and smaller bubble-up into weeks is when
	    // largestUnit is 'week' (not to be confused with the situation where
	    // smallestUnit is 'week', in which case days and smaller are ROUNDED-up
	    // into weeks, but that has already happened by the time this function
	    // executes)
	    // So, if days and smaller are NOT bubbled-up into weeks, and the current
	    // unit is weeks, skip.
	    const unit = UNITS_DESCENDING[unitIndex];
	    if (unit === 'week' && largestUnit !== 'week') {
	      continue;
	    }
	    let endDuration;
	    switch (unit) {
	      case 'year':
	        {
	          const years = duration.years + sign;
	          endDuration = {
	            years,
	            months: 0,
	            weeks: 0,
	            days: 0
	          };
	          break;
	        }
	      case 'month':
	        {
	          const months = duration.months + sign;
	          endDuration = {
	            years: duration.years,
	            months,
	            weeks: 0,
	            days: 0
	          };
	          break;
	        }
	      case 'week':
	        {
	          const weeks = duration.weeks + sign;
	          endDuration = {
	            years: duration.years,
	            months: duration.months,
	            weeks,
	            days: 0
	          };
	          break;
	        }
	      case 'day':
	        {
	          const days = duration.days + sign;
	          endDuration = {
	            years: duration.years,
	            months: duration.months,
	            weeks: duration.weeks,
	            days
	          };
	          break;
	        }
	      default:
	        throw new Error('assert not reached');
	    }

	    // Compute end-of-unit in epoch-nanoseconds
	    const date = ISODateTimeToDateRecord(plainDateTime);
	    const end = CalendarDateAdd(calendar, date, endDuration, 'constrain');
	    let endEpochNs;
	    if (timeZone) {
	      const endDateTime = CombineISODateAndTimeRecord(end, plainDateTime);
	      endEpochNs = GetEpochNanosecondsFor(timeZone, endDateTime, 'compatible');
	    } else {
	      endEpochNs = GetUTCEpochNanoseconds(end.year, end.month, end.day, plainDateTime.hour, plainDateTime.minute, plainDateTime.second, plainDateTime.millisecond, plainDateTime.microsecond, plainDateTime.nanosecond);
	    }
	    const didExpandToEnd = nudgedEpochNs.compare(endEpochNs) !== -sign;

	    // Is nudgedEpochNs at the end-of-unit? This means it should bubble-up to
	    // the next highest unit (and possibly further...)
	    if (didExpandToEnd) {
	      duration = {
	        ...endDuration,
	        norm: TimeDuration.ZERO
	      };
	    } else {
	      // NOT at end-of-unit. Stop looking for bubbling
	      break;
	    }
	  }
	  return duration;
	}
	function RoundRelativeDuration(duration, destEpochNs, dateTime, calendar, timeZone, largestUnit, increment, smallestUnit, roundingMode) {
	  // The duration must already be balanced. This should be achieved by calling
	  // one of the non-rounding since/until internal methods prior. It's okay to
	  // have a bottom-heavy weeks because weeks don't bubble-up into months. It's
	  // okay to have >24 hour day assuming the final day of relativeTo+duration has
	  // >24 hours in its timezone. (should automatically end up like this if using
	  // non-rounding since/until internal methods prior)
	  const irregularLengthUnit = IsCalendarUnit(smallestUnit) || timeZone && smallestUnit === 'day';
	  const sign = DurationSign(duration.years, duration.months, duration.weeks, duration.days, duration.norm.sign()) < 0 ? -1 : 1;
	  let nudgeResult;
	  if (irregularLengthUnit) {
	    // Rounding an irregular-length unit? Use epoch-nanosecond-bounding technique
	    nudgeResult = NudgeToCalendarUnit(sign, duration, destEpochNs, dateTime, calendar, timeZone, increment, smallestUnit, roundingMode);
	  } else if (timeZone) {
	    // Special-case for rounding time units within a zoned day. total() never
	    // takes this path because largestUnit is then also a time unit, so
	    // DifferenceZonedDateTimeWithRounding uses Instant math
	    nudgeResult = NudgeToZonedTime(sign, duration, dateTime, calendar, timeZone, increment, smallestUnit, roundingMode);
	  } else {
	    // Rounding uniform-length days/hours/minutes/etc units. Simple nanosecond
	    // math. years/months/weeks unchanged
	    nudgeResult = NudgeToDayOrTime(duration, destEpochNs, largestUnit, increment, smallestUnit, roundingMode);
	  }
	  duration = nudgeResult.duration;
	  // Did nudging cause the duration to expand to the next day or larger?
	  // Bubble-up smaller calendar units into higher ones, except for weeks, which
	  // don't balance up into months
	  if (nudgeResult.didExpandCalendarUnit && smallestUnit !== 'week') {
	    duration = BubbleRelativeDuration(sign, duration, nudgeResult.nudgedEpochNs,
	    // The destEpochNs after expanding/contracting
	    dateTime, calendar, timeZone, largestUnit,
	    // where to STOP bubbling
	    LargerOfTwoTemporalUnits(smallestUnit, 'day') // where to START bubbling-up from
	    );
	  }
	  if (IsCalendarUnit(largestUnit) || largestUnit === 'day') {
	    largestUnit = 'hour';
	  }
	  const {
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds,
	    nanoseconds
	  } = BalanceTimeDuration(duration.norm, largestUnit);
	  return {
	    years: duration.years,
	    months: duration.months,
	    weeks: duration.weeks,
	    days: duration.days,
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds,
	    nanoseconds,
	    total: nudgeResult.total
	  };
	}
	function DifferencePlainDateTimeWithRounding(y1, mon1, d1, h1, min1, s1, ms1, µs1, ns1, y2, mon2, d2, h2, min2, s2, ms2, µs2, ns2, calendar, largestUnit, roundingIncrement, smallestUnit, roundingMode) {
	  if (CompareISODateTime(y1, mon1, d1, h1, min1, s1, ms1, µs1, ns1, y2, mon2, d2, h2, min2, s2, ms2, µs2, ns2) == 0) {
	    return {
	      years: 0,
	      months: 0,
	      weeks: 0,
	      days: 0,
	      hours: 0,
	      minutes: 0,
	      seconds: 0,
	      milliseconds: 0,
	      microseconds: 0,
	      nanoseconds: 0,
	      total: 0
	    };
	  }
	  let {
	    years,
	    months,
	    weeks,
	    days,
	    norm
	  } = DifferenceISODateTime(y1, mon1, d1, h1, min1, s1, ms1, µs1, ns1, y2, mon2, d2, h2, min2, s2, ms2, µs2, ns2, calendar, largestUnit);
	  const roundingIsNoop = smallestUnit === 'nanosecond' && roundingIncrement === 1;
	  if (roundingIsNoop) {
	    const normWithDays = norm.add24HourDays(days);
	    let hours, minutes, seconds, milliseconds, microseconds, nanoseconds;
	    ({
	      days,
	      hours,
	      minutes,
	      seconds,
	      milliseconds,
	      microseconds,
	      nanoseconds
	    } = BalanceTimeDuration(normWithDays, largestUnit));
	    const total = norm.totalNs.toJSNumber();
	    return {
	      years,
	      months,
	      weeks,
	      days,
	      hours,
	      minutes,
	      seconds,
	      milliseconds,
	      microseconds,
	      nanoseconds,
	      total
	    };
	  }
	  const dateTime = {
	    year: y1,
	    month: mon1,
	    day: d1,
	    hour: h1,
	    minute: min1,
	    second: s1,
	    millisecond: ms1,
	    microsecond: µs1,
	    nanosecond: ns1
	  };
	  const destEpochNs = GetUTCEpochNanoseconds(y2, mon2, d2, h2, min2, s2, ms2, µs2, ns2);
	  return RoundRelativeDuration({
	    years,
	    months,
	    weeks,
	    days,
	    norm
	  }, destEpochNs, dateTime, calendar, null, largestUnit, roundingIncrement, smallestUnit, roundingMode);
	}
	function DifferenceZonedDateTimeWithRounding(ns1, ns2, calendar, timeZone, largestUnit, roundingIncrement, smallestUnit, roundingMode) {
	  if (!IsCalendarUnit(largestUnit) && largestUnit !== 'day') {
	    // The user is only asking for a time difference, so return difference of instants.
	    const {
	      norm,
	      total
	    } = DifferenceInstant(ns1, ns2, roundingIncrement, smallestUnit, largestUnit);
	    const {
	      hours,
	      minutes,
	      seconds,
	      milliseconds,
	      microseconds,
	      nanoseconds
	    } = BalanceTimeDuration(norm, largestUnit);
	    return {
	      years: 0,
	      months: 0,
	      weeks: 0,
	      days: 0,
	      hours,
	      minutes,
	      seconds,
	      milliseconds,
	      microseconds,
	      nanoseconds,
	      total
	    };
	  }
	  let {
	    years,
	    months,
	    weeks,
	    days,
	    norm
	  } = DifferenceZonedDateTime(ns1, ns2, timeZone, calendar, largestUnit);
	  if (smallestUnit === 'nanosecond' && roundingIncrement === 1) {
	    const {
	      hours,
	      minutes,
	      seconds,
	      milliseconds,
	      microseconds,
	      nanoseconds
	    } = BalanceTimeDuration(norm, 'hour');
	    const total = norm.totalNs.toJSNumber();
	    return {
	      years,
	      months,
	      weeks,
	      days,
	      hours,
	      minutes,
	      seconds,
	      milliseconds,
	      microseconds,
	      nanoseconds,
	      total
	    };
	  }
	  const dateTime = GetISODateTimeFor(timeZone, ns1);
	  return RoundRelativeDuration({
	    years,
	    months,
	    weeks,
	    days,
	    norm
	  }, ns2, dateTime, calendar, timeZone, largestUnit, roundingIncrement, smallestUnit, roundingMode);
	}
	function GetDifferenceSettings(op, options, group, disallowed, fallbackSmallest, smallestLargestDefaultUnit) {
	  const ALLOWED_UNITS = TEMPORAL_UNITS.reduce((allowed, unitInfo) => {
	    const p = unitInfo[0];
	    const s = unitInfo[1];
	    const c = unitInfo[2];
	    if ((group === 'datetime' || c === group) && !Call$1(ArrayIncludes, disallowed, [s])) {
	      allowed.push(s, p);
	    }
	    return allowed;
	  }, []);
	  let largestUnit = GetTemporalUnitValuedOption(options, 'largestUnit', group, 'auto');
	  if (Call$1(ArrayIncludes, disallowed, [largestUnit])) {
	    throw new RangeError(`largestUnit must be one of ${ALLOWED_UNITS.join(', ')}, not ${largestUnit}`);
	  }
	  const roundingIncrement = GetRoundingIncrementOption(options);
	  let roundingMode = GetRoundingModeOption(options, 'trunc');
	  if (op === 'since') roundingMode = NegateRoundingMode(roundingMode);
	  const smallestUnit = GetTemporalUnitValuedOption(options, 'smallestUnit', group, fallbackSmallest);
	  if (Call$1(ArrayIncludes, disallowed, [smallestUnit])) {
	    throw new RangeError(`smallestUnit must be one of ${ALLOWED_UNITS.join(', ')}, not ${smallestUnit}`);
	  }
	  const defaultLargestUnit = LargerOfTwoTemporalUnits(smallestLargestDefaultUnit, smallestUnit);
	  if (largestUnit === 'auto') largestUnit = defaultLargestUnit;
	  if (LargerOfTwoTemporalUnits(largestUnit, smallestUnit) !== largestUnit) {
	    throw new RangeError(`largestUnit ${largestUnit} cannot be smaller than smallestUnit ${smallestUnit}`);
	  }
	  const MAX_DIFFERENCE_INCREMENTS = {
	    hour: 24,
	    minute: 60,
	    second: 60,
	    millisecond: 1000,
	    microsecond: 1000,
	    nanosecond: 1000
	  };
	  const maximum = MAX_DIFFERENCE_INCREMENTS[smallestUnit];
	  if (maximum !== undefined) ValidateTemporalRoundingIncrement(roundingIncrement, maximum, false);
	  return {
	    largestUnit,
	    roundingIncrement,
	    roundingMode,
	    smallestUnit
	  };
	}
	function DifferenceTemporalInstant(operation, instant, other, options) {
	  const sign = operation === 'since' ? -1 : 1;
	  other = ToTemporalInstant(other);
	  const resolvedOptions = GetOptionsObject(options);
	  const settings = GetDifferenceSettings(operation, resolvedOptions, 'time', [], 'nanosecond', 'second');
	  const onens = GetSlot(instant, EPOCHNANOSECONDS);
	  const twons = GetSlot(other, EPOCHNANOSECONDS);
	  const {
	    norm
	  } = DifferenceInstant(onens, twons, settings.roundingIncrement, settings.smallestUnit, settings.roundingMode);
	  const {
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds,
	    nanoseconds
	  } = BalanceTimeDuration(norm, settings.largestUnit);
	  const Duration = GetIntrinsic('%Temporal.Duration%');
	  return new Duration(0, 0, 0, 0, sign * hours, sign * minutes, sign * seconds, sign * milliseconds, sign * microseconds, sign * nanoseconds);
	}
	function DifferenceTemporalPlainDate(operation, plainDate, other, options) {
	  const sign = operation === 'since' ? -1 : 1;
	  other = ToTemporalDate(other);
	  const calendar = GetSlot(plainDate, CALENDAR);
	  const otherCalendar = GetSlot(other, CALENDAR);
	  if (!CalendarEquals(calendar, otherCalendar)) {
	    throw new RangeError(`cannot compute difference between dates of ${calendar} and ${otherCalendar} calendars`);
	  }
	  const resolvedOptions = GetOptionsObject(options);
	  const settings = GetDifferenceSettings(operation, resolvedOptions, 'date', [], 'day', 'day');
	  const Duration = GetIntrinsic('%Temporal.Duration%');
	  if (GetSlot(plainDate, ISO_YEAR) === GetSlot(other, ISO_YEAR) && GetSlot(plainDate, ISO_MONTH) === GetSlot(other, ISO_MONTH) && GetSlot(plainDate, ISO_DAY) === GetSlot(other, ISO_DAY)) {
	    return new Duration();
	  }
	  const isoDate = TemporalObjectToISODateRecord(plainDate);
	  const isoOther = TemporalObjectToISODateRecord(other);
	  let {
	    years,
	    months,
	    weeks,
	    days
	  } = CalendarDateUntil(calendar, isoDate, isoOther, settings.largestUnit);
	  const roundingIsNoop = settings.smallestUnit === 'day' && settings.roundingIncrement === 1;
	  if (!roundingIsNoop) {
	    const dateTime = {
	      ...isoDate,
	      hour: 0,
	      minute: 0,
	      second: 0,
	      millisecond: 0,
	      microsecond: 0,
	      nanosecond: 0
	    };
	    const destEpochNs = GetUTCEpochNanoseconds(isoOther.year, isoOther.month, isoOther.day, 0, 0, 0, 0, 0, 0);
	    ({
	      years,
	      months,
	      weeks,
	      days
	    } = RoundRelativeDuration({
	      years,
	      months,
	      weeks,
	      days,
	      norm: TimeDuration.ZERO
	    }, destEpochNs, dateTime, calendar, null, settings.largestUnit, settings.roundingIncrement, settings.smallestUnit, settings.roundingMode));
	  }
	  return new Duration(sign * years, sign * months, sign * weeks, sign * days, 0, 0, 0, 0, 0, 0);
	}
	function DifferenceTemporalPlainDateTime(operation, plainDateTime, other, options) {
	  const sign = operation === 'since' ? -1 : 1;
	  other = ToTemporalDateTime(other);
	  const calendar = GetSlot(plainDateTime, CALENDAR);
	  const otherCalendar = GetSlot(other, CALENDAR);
	  if (!CalendarEquals(calendar, otherCalendar)) {
	    throw new RangeError(`cannot compute difference between dates of ${calendar} and ${otherCalendar} calendars`);
	  }
	  const resolvedOptions = GetOptionsObject(options);
	  const settings = GetDifferenceSettings(operation, resolvedOptions, 'datetime', [], 'nanosecond', 'day');
	  const Duration = GetIntrinsic('%Temporal.Duration%');
	  if (GetSlot(plainDateTime, ISO_YEAR) === GetSlot(other, ISO_YEAR) && GetSlot(plainDateTime, ISO_MONTH) === GetSlot(other, ISO_MONTH) && GetSlot(plainDateTime, ISO_DAY) === GetSlot(other, ISO_DAY) && GetSlot(plainDateTime, ISO_HOUR) == GetSlot(other, ISO_HOUR) && GetSlot(plainDateTime, ISO_MINUTE) == GetSlot(other, ISO_MINUTE) && GetSlot(plainDateTime, ISO_SECOND) == GetSlot(other, ISO_SECOND) && GetSlot(plainDateTime, ISO_MILLISECOND) == GetSlot(other, ISO_MILLISECOND) && GetSlot(plainDateTime, ISO_MICROSECOND) == GetSlot(other, ISO_MICROSECOND) && GetSlot(plainDateTime, ISO_NANOSECOND) == GetSlot(other, ISO_NANOSECOND)) {
	    return new Duration();
	  }
	  const {
	    years,
	    months,
	    weeks,
	    days,
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds,
	    nanoseconds
	  } = DifferencePlainDateTimeWithRounding(GetSlot(plainDateTime, ISO_YEAR), GetSlot(plainDateTime, ISO_MONTH), GetSlot(plainDateTime, ISO_DAY), GetSlot(plainDateTime, ISO_HOUR), GetSlot(plainDateTime, ISO_MINUTE), GetSlot(plainDateTime, ISO_SECOND), GetSlot(plainDateTime, ISO_MILLISECOND), GetSlot(plainDateTime, ISO_MICROSECOND), GetSlot(plainDateTime, ISO_NANOSECOND), GetSlot(other, ISO_YEAR), GetSlot(other, ISO_MONTH), GetSlot(other, ISO_DAY), GetSlot(other, ISO_HOUR), GetSlot(other, ISO_MINUTE), GetSlot(other, ISO_SECOND), GetSlot(other, ISO_MILLISECOND), GetSlot(other, ISO_MICROSECOND), GetSlot(other, ISO_NANOSECOND), calendar, settings.largestUnit, settings.roundingIncrement, settings.smallestUnit, settings.roundingMode);
	  return new Duration(sign * years, sign * months, sign * weeks, sign * days, sign * hours, sign * minutes, sign * seconds, sign * milliseconds, sign * microseconds, sign * nanoseconds);
	}
	function DifferenceTemporalPlainTime(operation, plainTime, other, options) {
	  const sign = operation === 'since' ? -1 : 1;
	  other = ToTemporalTime(other);
	  const resolvedOptions = GetOptionsObject(options);
	  const settings = GetDifferenceSettings(operation, resolvedOptions, 'time', [], 'nanosecond', 'hour');
	  let norm = DifferenceTime(GetSlot(plainTime, ISO_HOUR), GetSlot(plainTime, ISO_MINUTE), GetSlot(plainTime, ISO_SECOND), GetSlot(plainTime, ISO_MILLISECOND), GetSlot(plainTime, ISO_MICROSECOND), GetSlot(plainTime, ISO_NANOSECOND), GetSlot(other, ISO_HOUR), GetSlot(other, ISO_MINUTE), GetSlot(other, ISO_SECOND), GetSlot(other, ISO_MILLISECOND), GetSlot(other, ISO_MICROSECOND), GetSlot(other, ISO_NANOSECOND));
	  if (settings.smallestUnit !== 'nanosecond' || settings.roundingIncrement !== 1) {
	    ({
	      norm
	    } = RoundTimeDuration(0, norm, settings.roundingIncrement, settings.smallestUnit, settings.roundingMode));
	  }
	  const {
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds,
	    nanoseconds
	  } = BalanceTimeDuration(norm, settings.largestUnit);
	  const Duration = GetIntrinsic('%Temporal.Duration%');
	  return new Duration(0, 0, 0, 0, sign * hours, sign * minutes, sign * seconds, sign * milliseconds, sign * microseconds, sign * nanoseconds);
	}
	function DifferenceTemporalPlainYearMonth(operation, yearMonth, other, options) {
	  const sign = operation === 'since' ? -1 : 1;
	  other = ToTemporalYearMonth(other);
	  const calendar = GetSlot(yearMonth, CALENDAR);
	  const otherCalendar = GetSlot(other, CALENDAR);
	  if (!CalendarEquals(calendar, otherCalendar)) {
	    throw new RangeError(`cannot compute difference between months of ${calendar} and ${otherCalendar} calendars`);
	  }
	  const resolvedOptions = GetOptionsObject(options);
	  const settings = GetDifferenceSettings(operation, resolvedOptions, 'date', ['week', 'day'], 'month', 'year');
	  const Duration = GetIntrinsic('%Temporal.Duration%');
	  if (GetSlot(yearMonth, ISO_YEAR) === GetSlot(other, ISO_YEAR) && GetSlot(yearMonth, ISO_MONTH) === GetSlot(other, ISO_MONTH) && GetSlot(yearMonth, ISO_DAY) === GetSlot(other, ISO_DAY)) {
	    return new Duration();
	  }
	  const thisFields = TemporalObjectToFields(yearMonth);
	  thisFields.day = 1;
	  const thisDate = CalendarDateFromFields(calendar, thisFields, 'constrain');
	  const otherFields = TemporalObjectToFields(other);
	  otherFields.day = 1;
	  const otherDate = CalendarDateFromFields(calendar, otherFields, 'constrain');
	  let {
	    years,
	    months
	  } = CalendarDateUntil(calendar, thisDate, otherDate, settings.largestUnit);
	  if (settings.smallestUnit !== 'month' || settings.roundingIncrement !== 1) {
	    const dateTime = {
	      year: thisDate.year,
	      month: thisDate.month,
	      day: thisDate.day,
	      hour: 0,
	      minute: 0,
	      second: 0,
	      millisecond: 0,
	      microsecond: 0,
	      nanosecond: 0
	    };
	    const destEpochNs = GetUTCEpochNanoseconds(otherDate.year, otherDate.month, otherDate.day, 0, 0, 0, 0, 0, 0);
	    ({
	      years,
	      months
	    } = RoundRelativeDuration({
	      years,
	      months,
	      weeks: 0,
	      days: 0,
	      norm: TimeDuration.ZERO
	    }, destEpochNs, dateTime, calendar, null, settings.largestUnit, settings.roundingIncrement, settings.smallestUnit, settings.roundingMode));
	  }
	  return new Duration(sign * years, sign * months, 0, 0, 0, 0, 0, 0, 0, 0);
	}
	function DifferenceTemporalZonedDateTime(operation, zonedDateTime, other, options) {
	  const sign = operation === 'since' ? -1 : 1;
	  other = ToTemporalZonedDateTime(other);
	  const calendar = GetSlot(zonedDateTime, CALENDAR);
	  const otherCalendar = GetSlot(other, CALENDAR);
	  if (!CalendarEquals(calendar, otherCalendar)) {
	    throw new RangeError(`cannot compute difference between dates of ${calendar} and ${otherCalendar} calendars`);
	  }
	  const resolvedOptions = GetOptionsObject(options);
	  const settings = GetDifferenceSettings(operation, resolvedOptions, 'datetime', [], 'nanosecond', 'hour');
	  const ns1 = GetSlot(zonedDateTime, EPOCHNANOSECONDS);
	  const ns2 = GetSlot(other, EPOCHNANOSECONDS);
	  const Duration = GetIntrinsic('%Temporal.Duration%');
	  let years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds;
	  if (settings.largestUnit !== 'year' && settings.largestUnit !== 'month' && settings.largestUnit !== 'week' && settings.largestUnit !== 'day') {
	    // The user is only asking for a time difference, so return difference of instants.
	    years = 0;
	    months = 0;
	    weeks = 0;
	    days = 0;
	    const {
	      norm
	    } = DifferenceInstant(ns1, ns2, settings.roundingIncrement, settings.smallestUnit, settings.roundingMode);
	    ({
	      hours,
	      minutes,
	      seconds,
	      milliseconds,
	      microseconds,
	      nanoseconds
	    } = BalanceTimeDuration(norm, settings.largestUnit));
	  } else {
	    const timeZone = GetSlot(zonedDateTime, TIME_ZONE);
	    if (!TimeZoneEquals(timeZone, GetSlot(other, TIME_ZONE))) {
	      throw new RangeError("When calculating difference between time zones, largestUnit must be 'hours' " + 'or smaller because day lengths can vary between time zones due to DST or time zone offset changes.');
	    }
	    if (ns1.equals(ns2)) return new Duration();
	    ({
	      years,
	      months,
	      weeks,
	      days,
	      hours,
	      minutes,
	      seconds,
	      milliseconds,
	      microseconds,
	      nanoseconds
	    } = DifferenceZonedDateTimeWithRounding(ns1, ns2, calendar, timeZone, settings.largestUnit, settings.roundingIncrement, settings.smallestUnit, settings.roundingMode));
	  }
	  return new Duration(sign * years, sign * months, sign * weeks, sign * days, sign * hours, sign * minutes, sign * seconds, sign * milliseconds, sign * microseconds, sign * nanoseconds);
	}
	function AddISODate(year, month, day, years, months, weeks, days, overflow) {
	  year += years;
	  month += months;
	  ({
	    year,
	    month
	  } = BalanceISOYearMonth(year, month));
	  ({
	    year,
	    month,
	    day
	  } = RegulateISODate(year, month, day, overflow));
	  days += 7 * weeks;
	  day += days;
	  ({
	    year,
	    month,
	    day
	  } = BalanceISODate(year, month, day));
	  RejectDateRange(year, month, day);
	  return {
	    year,
	    month,
	    day
	  };
	}
	function AddTime(hour, minute, second, millisecond, microsecond, nanosecond, norm) {
	  second += norm.sec;
	  nanosecond += norm.subsec;
	  return BalanceTime(hour, minute, second, millisecond, microsecond, nanosecond);
	}
	function AddInstant(epochNanoseconds, norm) {
	  const result = norm.addToEpochNs(epochNanoseconds);
	  ValidateEpochNanoseconds(result);
	  return result;
	}
	function AddDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar, years, months, weeks, days, norm, overflow) {
	  // Add the time part
	  const timeResult = AddTime(hour, minute, second, millisecond, microsecond, nanosecond, norm);
	  days += timeResult.deltaDays;

	  // Delegate the date part addition to the calendar
	  RejectDuration(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
	  const addedDate = CalendarDateAdd(calendar, {
	    year,
	    month,
	    day
	  }, {
	    years,
	    months,
	    weeks,
	    days
	  }, overflow);
	  return CombineISODateAndTimeRecord(addedDate, timeResult);
	}
	function AddZonedDateTime(epochNs, timeZone, calendar, years, months, weeks, days, norm) {
	  let overflow = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 'constrain';
	  // If only time is to be added, then use Instant math. It's not OK to fall
	  // through to the date/time code below because compatible disambiguation in
	  // the PlainDateTime=>Instant conversion will change the offset of any
	  // ZonedDateTime in the repeated clock time after a backwards transition.
	  // When adding/subtracting time units and not dates, this disambiguation is
	  // not expected and so is avoided below via a fast path for time-only
	  // arithmetic.
	  // BTW, this behavior is similar in spirit to offset: 'prefer' in `with`.
	  if (DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0) === 0) {
	    return AddInstant(epochNs, norm);
	  }

	  // RFC 5545 requires the date portion to be added in calendar days and the
	  // time portion to be added in exact time.
	  const dt = GetISODateTimeFor(timeZone, epochNs);
	  const addedDate = CalendarDateAdd(calendar, dt, {
	    years,
	    months,
	    weeks,
	    days
	  }, overflow);
	  const dtIntermediate = CombineISODateAndTimeRecord(addedDate, dt);

	  // Note that 'compatible' is used below because this disambiguation behavior
	  // is required by RFC 5545.
	  const intermediateNs = GetEpochNanosecondsFor(timeZone, dtIntermediate, 'compatible');
	  return AddInstant(intermediateNs, norm);
	}
	function AddDurations(operation, duration, other) {
	  const sign = operation === 'subtract' ? -1 : 1;
	  other = ToTemporalDurationRecord(other);
	  const y1 = GetSlot(duration, YEARS);
	  const mon1 = GetSlot(duration, MONTHS);
	  const w1 = GetSlot(duration, WEEKS);
	  const d1 = GetSlot(duration, DAYS);
	  const h1 = GetSlot(duration, HOURS);
	  const min1 = GetSlot(duration, MINUTES);
	  const s1 = GetSlot(duration, SECONDS);
	  const ms1 = GetSlot(duration, MILLISECONDS);
	  const µs1 = GetSlot(duration, MICROSECONDS);
	  const ns1 = GetSlot(duration, NANOSECONDS);
	  const y2 = sign * other.years;
	  const mon2 = sign * other.months;
	  const w2 = sign * other.weeks;
	  const d2 = sign * other.days;
	  const h2 = sign * other.hours;
	  const min2 = sign * other.minutes;
	  const s2 = sign * other.seconds;
	  const ms2 = sign * other.milliseconds;
	  const µs2 = sign * other.microseconds;
	  const ns2 = sign * other.nanoseconds;
	  const largestUnit1 = DefaultTemporalLargestUnit(y1, mon1, w1, d1, h1, min1, s1, ms1, µs1);
	  const largestUnit2 = DefaultTemporalLargestUnit(y2, mon2, w2, d2, h2, min2, s2, ms2, µs2);
	  const largestUnit = LargerOfTwoTemporalUnits(largestUnit1, largestUnit2);
	  const norm1 = TimeDuration.normalize(h1, min1, s1, ms1, µs1, ns1);
	  const norm2 = TimeDuration.normalize(h2, min2, s2, ms2, µs2, ns2);
	  const Duration = GetIntrinsic('%Temporal.Duration%');
	  if (IsCalendarUnit(largestUnit)) {
	    throw new RangeError('For years, months, or weeks arithmetic, use date arithmetic relative to a starting point');
	  }
	  const {
	    days,
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds,
	    nanoseconds
	  } = BalanceTimeDuration(norm1.add(norm2).add24HourDays(d1 + d2), largestUnit);
	  return new Duration(0, 0, 0, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
	}
	function AddDurationToOrSubtractDurationFromInstant(operation, instant, durationLike) {
	  const sign = operation === 'subtract' ? -1 : 1;
	  const {
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds,
	    nanoseconds
	  } = ToLimitedTemporalDuration(durationLike, ['years', 'months', 'weeks', 'days']);
	  const norm = TimeDuration.normalize(sign * hours, sign * minutes, sign * seconds, sign * milliseconds, sign * microseconds, sign * nanoseconds);
	  const ns = AddInstant(GetSlot(instant, EPOCHNANOSECONDS), norm);
	  const Instant = GetIntrinsic('%Temporal.Instant%');
	  return new Instant(ns);
	}
	function AddDurationToDate(operation, plainDate, durationLike, options) {
	  const sign = operation === 'subtract' ? -1 : 1;
	  const isoDate = TemporalObjectToISODateRecord(plainDate);
	  const calendar = GetSlot(plainDate, CALENDAR);
	  let duration = ToTemporalDurationRecord(durationLike);
	  const norm = TimeDuration.normalize(sign * duration.hours, sign * duration.minutes, sign * duration.seconds, sign * duration.milliseconds, sign * duration.microseconds, sign * duration.nanoseconds);
	  const days = sign * duration.days + BalanceTimeDuration(norm, 'day').days;
	  const dateDuration = {
	    years: sign * duration.years,
	    months: sign * duration.months,
	    weeks: sign * duration.weeks,
	    days
	  };
	  options = GetOptionsObject(options);
	  const overflow = GetTemporalOverflowOption(options);
	  const addedDate = CalendarDateAdd(calendar, isoDate, dateDuration, overflow);
	  return CreateTemporalDate(addedDate.year, addedDate.month, addedDate.day, calendar);
	}
	function AddDurationToOrSubtractDurationFromPlainDateTime(operation, dateTime, durationLike, options) {
	  const sign = operation === 'subtract' ? -1 : 1;
	  const {
	    years,
	    months,
	    weeks,
	    days,
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds,
	    nanoseconds
	  } = ToTemporalDurationRecord(durationLike);
	  options = GetOptionsObject(options);
	  const overflow = GetTemporalOverflowOption(options);
	  const calendar = GetSlot(dateTime, CALENDAR);
	  const norm = TimeDuration.normalize(sign * hours, sign * minutes, sign * seconds, sign * milliseconds, sign * microseconds, sign * nanoseconds);
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
	  } = AddDateTime(GetSlot(dateTime, ISO_YEAR), GetSlot(dateTime, ISO_MONTH), GetSlot(dateTime, ISO_DAY), GetSlot(dateTime, ISO_HOUR), GetSlot(dateTime, ISO_MINUTE), GetSlot(dateTime, ISO_SECOND), GetSlot(dateTime, ISO_MILLISECOND), GetSlot(dateTime, ISO_MICROSECOND), GetSlot(dateTime, ISO_NANOSECOND), calendar, sign * years, sign * months, sign * weeks, sign * days, norm, overflow);
	  return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
	}
	function AddDurationToOrSubtractDurationFromPlainTime(operation, temporalTime, durationLike) {
	  const sign = operation === 'subtract' ? -1 : 1;
	  const {
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds,
	    nanoseconds
	  } = ToTemporalDurationRecord(durationLike);
	  const norm = TimeDuration.normalize(sign * hours, sign * minutes, sign * seconds, sign * milliseconds, sign * microseconds, sign * nanoseconds);
	  let {
	    hour,
	    minute,
	    second,
	    millisecond,
	    microsecond,
	    nanosecond
	  } = AddTime(GetSlot(temporalTime, ISO_HOUR), GetSlot(temporalTime, ISO_MINUTE), GetSlot(temporalTime, ISO_SECOND), GetSlot(temporalTime, ISO_MILLISECOND), GetSlot(temporalTime, ISO_MICROSECOND), GetSlot(temporalTime, ISO_NANOSECOND), norm);
	  ({
	    hour,
	    minute,
	    second,
	    millisecond,
	    microsecond,
	    nanosecond
	  } = RegulateTime(hour, minute, second, millisecond, microsecond, nanosecond, 'reject'));
	  const PlainTime = GetIntrinsic('%Temporal.PlainTime%');
	  return new PlainTime(hour, minute, second, millisecond, microsecond, nanosecond);
	}
	function AddDurationToOrSubtractDurationFromPlainYearMonth(operation, yearMonth, durationLike, options) {
	  let duration = ToTemporalDurationRecord(durationLike);
	  if (operation === 'subtract') {
	    duration = {
	      years: -duration.years,
	      months: -duration.months,
	      weeks: -duration.weeks,
	      days: -duration.days,
	      hours: -duration.hours,
	      minutes: -duration.minutes,
	      seconds: -duration.seconds,
	      milliseconds: -duration.milliseconds,
	      microseconds: -duration.microseconds,
	      nanoseconds: -duration.nanoseconds
	    };
	  }
	  let {
	    years,
	    months,
	    weeks,
	    days,
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds,
	    nanoseconds
	  } = duration;
	  options = GetOptionsObject(options);
	  const overflow = GetTemporalOverflowOption(options);
	  const norm = TimeDuration.normalize(hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
	  days += BalanceTimeDuration(norm, 'day').days;
	  const sign = DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
	  const calendar = GetSlot(yearMonth, CALENDAR);
	  const fields = TemporalObjectToFields(yearMonth);
	  fields.day = 1;
	  let startDate = CalendarDateFromFields(calendar, fields, 'constrain');
	  if (sign < 0) {
	    const nextMonth = CalendarDateAdd(calendar, startDate, {
	      months: 1
	    }, 'constrain');
	    const endOfMonth = BalanceISODate(nextMonth.year, nextMonth.month, nextMonth.day - 1);
	    fields.day = CalendarDay(calendar, endOfMonth);
	    startDate = CalendarDateFromFields(calendar, fields, 'constrain');
	  }
	  RejectDateRange(startDate.year, startDate.month, startDate.day);
	  const addedDate = CalendarDateAdd(calendar, startDate, {
	    years,
	    months,
	    weeks,
	    days
	  }, overflow);
	  const addedDateFields = ISODateToFields(calendar, addedDate, 'year-month');
	  const {
	    year,
	    month,
	    day
	  } = CalendarYearMonthFromFields(calendar, addedDateFields, overflow);
	  return CreateTemporalYearMonth(year, month, calendar, day);
	}
	function AddDurationToOrSubtractDurationFromZonedDateTime(operation, zonedDateTime, durationLike, options) {
	  const sign = operation === 'subtract' ? -1 : 1;
	  const {
	    years,
	    months,
	    weeks,
	    days,
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds,
	    nanoseconds
	  } = ToTemporalDurationRecord(durationLike);
	  options = GetOptionsObject(options);
	  const overflow = GetTemporalOverflowOption(options);
	  const timeZone = GetSlot(zonedDateTime, TIME_ZONE);
	  const calendar = GetSlot(zonedDateTime, CALENDAR);
	  const norm = TimeDuration.normalize(sign * hours, sign * minutes, sign * seconds, sign * milliseconds, sign * microseconds, sign * nanoseconds);
	  const epochNanoseconds = AddZonedDateTime(GetSlot(zonedDateTime, EPOCHNANOSECONDS), timeZone, calendar, sign * years, sign * months, sign * weeks, sign * days, norm, overflow);
	  return CreateTemporalZonedDateTime(epochNanoseconds, timeZone, calendar);
	}
	function RoundNumberToIncrement(quantity, increment, mode) {
	  const quotient = MathTrunc(quantity / increment);
	  const remainder = quantity % increment;
	  const sign = quantity < 0 ? 'negative' : 'positive';
	  const r1 = MathAbs$1(quotient);
	  const r2 = r1 + 1;
	  const cmp = ComparisonResult(MathAbs$1(remainder * 2) - increment);
	  const even = r1 % 2 === 0;
	  const unsignedRoundingMode = GetUnsignedRoundingMode(mode, sign);
	  const rounded = MathAbs$1(quantity) === r1 * increment ? r1 : ApplyUnsignedRoundingMode(r1, r2, cmp, even, unsignedRoundingMode);
	  return increment * (sign === 'positive' ? rounded : -rounded);
	}
	function RoundNumberToIncrementAsIfPositive(quantity, increment, mode) {
	  const {
	    quotient,
	    remainder
	  } = quantity.divmod(increment);
	  const unsignedRoundingMode = GetUnsignedRoundingMode(mode, 'positive');
	  let r1, r2;
	  if (quantity.lt(0)) {
	    r1 = quotient.add(-1);
	    r2 = quotient;
	  } else {
	    r1 = quotient;
	    r2 = quotient.add(1);
	  }
	  const cmp = remainder.times(2).abs().compare(increment) * (quantity.lt(0) ? -1 : 1);
	  const even = r1.isEven();
	  const rounded = quotient.times(increment).eq(quantity) ? quotient : ApplyUnsignedRoundingMode(r1, r2, cmp, even, unsignedRoundingMode);
	  return rounded.times(increment);
	}
	function RoundTemporalInstant(epochNs, increment, unit, roundingMode) {
	  const incrementNs = NS_PER_TIME_UNIT.get(unit) * increment;
	  return RoundNumberToIncrementAsIfPositive(epochNs, incrementNs, roundingMode);
	}
	function RoundISODateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, increment, unit, roundingMode) {
	  const time = RoundTime(hour, minute, second, millisecond, microsecond, nanosecond, increment, unit, roundingMode);
	  const isoDate = BalanceISODate(year, month, day + time.deltaDays);
	  return CombineISODateAndTimeRecord(isoDate, time);
	}
	function RoundTime(hour, minute, second, millisecond, microsecond, nanosecond, increment, unit, roundingMode) {
	  let quantity;
	  switch (unit) {
	    case 'day':
	    case 'hour':
	      quantity = ((((hour * 60 + minute) * 60 + second) * 1000 + millisecond) * 1000 + microsecond) * 1000 + nanosecond;
	      break;
	    case 'minute':
	      quantity = (((minute * 60 + second) * 1000 + millisecond) * 1000 + microsecond) * 1000 + nanosecond;
	      break;
	    case 'second':
	      quantity = ((second * 1000 + millisecond) * 1000 + microsecond) * 1000 + nanosecond;
	      break;
	    case 'millisecond':
	      quantity = (millisecond * 1000 + microsecond) * 1000 + nanosecond;
	      break;
	    case 'microsecond':
	      quantity = microsecond * 1000 + nanosecond;
	      break;
	    case 'nanosecond':
	      quantity = nanosecond;
	  }
	  const nsPerUnit = NS_PER_TIME_UNIT.get(unit);
	  const result = RoundNumberToIncrement(quantity, nsPerUnit * increment, roundingMode) / nsPerUnit;
	  switch (unit) {
	    case 'day':
	      return {
	        deltaDays: result,
	        hour: 0,
	        minute: 0,
	        second: 0,
	        millisecond: 0,
	        microsecond: 0,
	        nanosecond: 0
	      };
	    case 'hour':
	      return BalanceTime(result, 0, 0, 0, 0, 0);
	    case 'minute':
	      return BalanceTime(hour, result, 0, 0, 0, 0);
	    case 'second':
	      return BalanceTime(hour, minute, result, 0, 0, 0);
	    case 'millisecond':
	      return BalanceTime(hour, minute, second, result, 0, 0);
	    case 'microsecond':
	      return BalanceTime(hour, minute, second, millisecond, result, 0);
	    case 'nanosecond':
	      return BalanceTime(hour, minute, second, millisecond, microsecond, result);
	  }
	}
	function RoundTimeDuration(days, norm, increment, unit, roundingMode) {
	  // unit must not be a calendar unit

	  let total;
	  if (unit === 'day') {
	    // First convert time units up to days
	    const {
	      quotient,
	      remainder
	    } = norm.divmod(DAY_NANOS);
	    days += quotient;
	    total = days + remainder.fdiv(DAY_NANOS);
	    days = RoundNumberToIncrement(total, increment, roundingMode);
	    norm = TimeDuration.ZERO;
	  } else {
	    const divisor = NS_PER_TIME_UNIT.get(unit);
	    total = norm.fdiv(divisor);
	    norm = norm.round(divisor * increment, roundingMode);
	  }
	  CombineDateAndNormalizedTimeDuration(0, 0, 0, days, norm);
	  return {
	    days,
	    norm,
	    total
	  };
	}
	function CompareISODate(y1, m1, d1, y2, m2, d2) {
	  if (y1 !== y2) return ComparisonResult(y1 - y2);
	  if (m1 !== m2) return ComparisonResult(m1 - m2);
	  if (d1 !== d2) return ComparisonResult(d1 - d2);
	  return 0;
	}
	function CompareTemporalTime(h1, min1, s1, ms1, µs1, ns1, h2, min2, s2, ms2, µs2, ns2) {
	  if (h1 !== h2) return ComparisonResult(h1 - h2);
	  if (min1 !== min2) return ComparisonResult(min1 - min2);
	  if (s1 !== s2) return ComparisonResult(s1 - s2);
	  if (ms1 !== ms2) return ComparisonResult(ms1 - ms2);
	  if (µs1 !== µs2) return ComparisonResult(µs1 - µs2);
	  if (ns1 !== ns2) return ComparisonResult(ns1 - ns2);
	  return 0;
	}
	function CompareISODateTime(y1, m1, d1, h1, min1, s1, ms1, µs1, ns1, y2, m2, d2, h2, min2, s2, ms2, µs2, ns2) {
	  const dateResult = CompareISODate(y1, m1, d1, y2, m2, d2);
	  if (dateResult !== 0) return dateResult;
	  return CompareTemporalTime(h1, min1, s1, ms1, µs1, ns1, h2, min2, s2, ms2, µs2, ns2);
	}

	// Not abstract operations from the spec

	function NonNegativeBigIntDivmod(x, y) {
	  let {
	    quotient,
	    remainder
	  } = x.divmod(y);
	  if (remainder.lesser(0)) {
	    quotient = quotient.prev();
	    remainder = remainder.plus(y);
	  }
	  return {
	    quotient,
	    remainder
	  };
	}
	function BigIntFloorDiv(left, right) {
	  left = bigInt(left);
	  right = bigInt(right);
	  const {
	    quotient,
	    remainder
	  } = left.divmod(right);
	  if (!remainder.isZero() && !left.isNegative() != !right.isNegative()) {
	    return quotient.prev();
	  }
	  return quotient;
	}
	function BigIntIfAvailable(wrapper) {
	  return typeof BigInt === 'undefined' ? wrapper : wrapper.value;
	}
	function ToBigInt(arg) {
	  if (bigInt.isInstance(arg)) {
	    return arg;
	  }
	  const prim = ToPrimitive$2(arg, Number);
	  switch (typeof prim) {
	    case 'undefined':
	    case 'object':
	    case 'number':
	    case 'symbol':
	      throw new TypeError(`cannot convert ${typeof arg} to bigint`);
	    case 'string':
	      if (!prim.match(/^\s*(?:[+-]?\d+\s*)?$/)) {
	        throw new SyntaxError('invalid BigInt syntax');
	      }
	    // eslint: no-fallthrough: false
	    case 'bigint':
	      try {
	        return bigInt(prim);
	      } catch (e) {
	        if (e instanceof Error && e.message.startsWith('Invalid integer')) throw new SyntaxError(e.message);
	        throw e;
	      }
	    case 'boolean':
	      if (prim) {
	        return bigInt(1);
	      } else {
	        return bigInt.zero;
	      }
	  }
	}

	// Note: This method returns values with bogus nanoseconds based on the previous iteration's
	// milliseconds. That way there is a guarantee that the full nanoseconds are always going to be
	// increasing at least and that the microsecond and nanosecond fields are likely to be non-zero.

	const SystemUTCEpochNanoSeconds = (() => {
	  let ns = Date.now() % 1e6;
	  return () => {
	    const ms = Date.now();
	    const result = bigInt(ms).multiply(1e6).plus(ns);
	    ns = ms % 1e6;
	    return bigInt.min(NS_MAX, bigInt.max(NS_MIN, result));
	  };
	})();
	function DefaultTimeZone() {
	  return new Intl.DateTimeFormat().resolvedOptions().timeZone;
	}
	function ComparisonResult(value) {
	  return value < 0 ? -1 : value > 0 ? 1 : value;
	}
	function GetOptionsObject(options) {
	  if (options === undefined) return ObjectCreate$6(null);
	  if (Type$3(options) === 'Object') return options;
	  throw new TypeError(`Options parameter must be an object, not ${options === null ? 'null' : `a ${typeof options}`}`);
	}
	function GetOption(options, property, allowedValues, fallback) {
	  let value = options[property];
	  if (value !== undefined) {
	    value = ToString$1(value);
	    if (!allowedValues.includes(value)) {
	      throw new RangeError(`${property} must be one of ${allowedValues.join(', ')}, not ${value}`);
	    }
	    return value;
	  }
	  if (fallback === REQUIRED) throw new RangeError(`${property} option is required`);
	  return fallback;
	}
	function IsBuiltinCalendar(id) {
	  return Call$1(ArrayIncludes, BUILTIN_CALENDAR_IDS, [ASCIILowercase(id)]);
	}

	// This is a temporary implementation. Ideally we'd rely on Intl.DateTimeFormat
	// here, to provide the latest CLDR alias data, when implementations catch up to
	// the ECMA-402 change. The aliases below are taken from
	// https://github.com/unicode-org/cldr/blob/main/common/bcp47/calendar.xml
	function CanonicalizeCalendar(id) {
	  id = ASCIILowercase(id);
	  switch (id) {
	    case 'ethiopic-amete-alem':
	      // May need to be removed in the future.
	      // See https://github.com/tc39/ecma402/issues/285
	      return 'ethioaa';
	    // case 'gregorian':
	    // (Skip 'gregorian'. It isn't a valid identifier as it's a single
	    // subcomponent longer than 8 letters. It can only be used with the old
	    // @key=value syntax.)
	    case 'islamicc':
	      return 'islamic-civil';
	  }
	  return id;
	}
	function ASCIILowercase(str) {
	  // The spec defines this operation distinct from String.prototype.lowercase,
	  // so we'll follow the spec here. Note that nasty security issues that can
	  // happen for some use cases if you're comparing case-modified non-ASCII
	  // values. For example, Turkish's "I" character was the source of a security
	  // issue involving "file://" URLs. See
	  // https://haacked.com/archive/2012/07/05/turkish-i-problem-and-why-you-should-care.aspx/.
	  let lowercase = '';
	  for (let ix = 0; ix < str.length; ix++) {
	    const code = Call$1(StringPrototypeCharCodeAt, str, [ix]);
	    if (code >= 0x41 && code <= 0x5a) {
	      lowercase += StringFromCharCode(code + 0x20);
	    } else {
	      lowercase += StringFromCharCode(code);
	    }
	  }
	  return lowercase;
	}

	// This function isn't in the spec, but we put it in the polyfill to avoid
	// repeating the same (long) error message in many files.
	function ValueOfThrows(constructorName) {
	  const compareCode = constructorName === 'PlainMonthDay' ? 'Temporal.PlainDate.compare(obj1.toPlainDate(year), obj2.toPlainDate(year))' : `Temporal.${constructorName}.compare(obj1, obj2)`;
	  throw new TypeError('Do not use built-in arithmetic operators with Temporal objects. ' + `When comparing, use ${compareCode}, not obj1 > obj2. ` + "When coercing to strings, use `${obj}` or String(obj), not '' + obj. " + 'When coercing to numbers, use properties or methods of the object, not `+obj`. ' + 'When concatenating with strings, use `${str}${obj}` or str.concat(obj), not str + obj. ' + 'In React, coerce to a string before rendering a Temporal object.');
	}
	const OFFSET = new RegExp(`^${offset.source}$`);
	const OFFSET_WITH_PARTS = new RegExp(`^${offsetWithParts.source}$`);
	function bisect(getState, left, right) {
	  let lstate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : getState(left);
	  let rstate = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : getState(right);
	  left = bigInt(left);
	  right = bigInt(right);
	  while (right.minus(left).greater(1)) {
	    let middle = left.plus(right).divide(2);
	    const mstate = getState(middle);
	    if (mstate === lstate) {
	      left = middle;
	      lstate = mstate;
	    } else if (mstate === rstate) {
	      right = middle;
	      rstate = mstate;
	    } else {
	      throw new Error(`invalid state in bisection ${lstate} - ${mstate} - ${rstate}`);
	    }
	  }
	  return right;
	}

	const ArrayFrom = Array.from;
	const ArrayPrototypeSort = Array.prototype.sort;
	const IntlDateTimeFormat$1 = globalThis.Intl.DateTimeFormat;
	const MathAbs = Math.abs;
	const MathFloor = Math.floor;
	const ObjectAssign$2 = Object.assign;
	const ObjectEntries = Object.entries;
	const OriginalMap = Map;
	const OriginalSet = Set;
	const OriginalWeakMap = WeakMap;
	const MapPrototypeEntries = Map.prototype.entries;
	const MapPrototypeGet = Map.prototype.get;
	const MapPrototypeSet = Map.prototype.set;
	const SetPrototypeAdd = Set.prototype.add;
	const SetPrototypeValues = Set.prototype.values;
	const SymbolIterator = Symbol.iterator;
	const WeakMapPrototypeGet = WeakMap.prototype.get;
	const WeakMapPrototypeSet = WeakMap.prototype.set;
	const MapIterator = Call$1(MapPrototypeEntries, new Map(), []);
	const MapIteratorPrototypeNext = MapIterator.next;
	const SetIterator = Call$1(SetPrototypeValues, new Set(), []);
	const SetIteratorPrototypeNext = SetIterator.next;
	function arrayFromSet(src) {
	  const valuesIterator = Call$1(SetPrototypeValues, src, []);
	  return ArrayFrom({
	    [SymbolIterator]() {
	      return this;
	    },
	    next() {
	      return Call$1(SetIteratorPrototypeNext, valuesIterator, []);
	    }
	  });
	}
	function calendarDateWeekOfYear(id, isoDate) {
	  // Supports only Gregorian and ISO8601 calendar; can be updated to add support for other calendars.
	  // Returns undefined for calendars without a well-defined week calendar system.
	  // eslint-disable-next-line max-len
	  // Also see: https://github.com/unicode-org/icu/blob/ab72ab1d4a3c3f9beeb7d92b0c7817ca93dfdb04/icu4c/source/i18n/calendar.cpp#L1606
	  if (id !== 'gregory' && id !== 'iso8601') {
	    return {
	      week: undefined,
	      year: undefined
	    };
	  }
	  const calendar = impl[id];
	  let yow = isoDate.year;
	  const dayOfWeek = calendar.dayOfWeek(isoDate);
	  const dayOfYear = calendar.dayOfYear(isoDate);
	  const fdow = id === 'iso8601' ? 1 : calendar.helper.getFirstDayOfWeek();
	  const mdow = id === 'iso8601' ? 4 : calendar.helper.getMinimalDaysInFirstWeek();

	  // For both the input date and the first day of its calendar year, calculate the day of week
	  // relative to first day of week in the relevant calendar (e.g., in iso8601, relative to Monday).
	  var relDow = (dayOfWeek + 7 - fdow) % 7;
	  // Assuming the year length is less than 7000 days.
	  var relDowJan1 = (dayOfWeek - dayOfYear + 7001 - fdow) % 7;
	  var woy = MathFloor((dayOfYear - 1 + relDowJan1) / 7);
	  if (7 - relDowJan1 >= mdow) {
	    ++woy;
	  }

	  // Adjust for weeks at the year end that overlap into the previous or next calendar year.
	  if (woy == 0) {
	    // Check for last week of previous year; if true, handle the case for
	    // first week of next year
	    var prevDoy = dayOfYear + calendar.daysInYear(calendar.dateAdd(isoDate, {
	      years: -1
	    }, 'constrain'));
	    woy = weekNumber(fdow, mdow, prevDoy, dayOfWeek);
	    yow--;
	  } else {
	    // For it to be week 1 of the next year, dayOfYear must be >= lastDoy - 5
	    //          L-5                  L
	    // doy: 359 360 361 362 363 364 365 001
	    // dow:      1   2   3   4   5   6   7
	    var lastDoy = calendar.daysInYear(isoDate);
	    if (dayOfYear >= lastDoy - 5) {
	      var lastRelDow = (relDow + lastDoy - dayOfYear) % 7;
	      if (lastRelDow < 0) {
	        lastRelDow += 7;
	      }
	      if (6 - lastRelDow >= mdow && dayOfYear + 7 - relDow > lastDoy) {
	        woy = 1;
	        yow++;
	      }
	    }
	  }
	  return {
	    week: woy,
	    year: yow
	  };
	}
	const impl = {};
	impl['iso8601'] = {
	  dateFromFields(fields, overflow) {
	    requireFields(fields, ['year', 'day']);
	    let {
	      year,
	      month,
	      day
	    } = resolveNonLunisolarMonth(fields);
	    ({
	      year,
	      month,
	      day
	    } = RegulateISODate(year, month, day, overflow));
	    RejectDateRange(year, month, day);
	    return {
	      year,
	      month,
	      day
	    };
	  },
	  yearMonthFromFields(fields, overflow) {
	    requireFields(fields, ['year']);
	    let {
	      year,
	      month
	    } = resolveNonLunisolarMonth(fields);
	    ({
	      year,
	      month
	    } = RegulateISOYearMonth(year, month, overflow));
	    RejectYearMonthRange(year, month);
	    return {
	      year,
	      month,
	      /* reference */day: 1
	    };
	  },
	  monthDayFromFields(fields, overflow) {
	    requireFields(fields, ['day']);
	    const referenceISOYear = 1972;
	    let {
	      month,
	      day,
	      year
	    } = resolveNonLunisolarMonth(fields);
	    ({
	      month,
	      day
	    } = RegulateISODate(year !== undefined ? year : referenceISOYear, month, day, overflow));
	    return {
	      month,
	      day,
	      year: referenceISOYear
	    };
	  },
	  extraFields() {
	    return [];
	  },
	  fieldKeysToIgnore(keys) {
	    const result = new OriginalSet();
	    for (let ix = 0; ix < keys.length; ix++) {
	      const key = keys[ix];
	      Call$1(SetPrototypeAdd, result, [key]);
	      if (key === 'month') {
	        Call$1(SetPrototypeAdd, result, ['monthCode']);
	      } else if (key === 'monthCode') {
	        Call$1(SetPrototypeAdd, result, ['month']);
	      }
	    }
	    return arrayFromSet(result);
	  },
	  dateAdd(_ref, _ref2, overflow) {
	    let {
	      year,
	      month,
	      day
	    } = _ref;
	    let {
	      years = 0,
	      months = 0,
	      weeks = 0,
	      days = 0
	    } = _ref2;
	    return AddISODate(year, month, day, years, months, weeks, days, overflow);
	  },
	  dateUntil(one, two, largestUnit) {
	    return DifferenceISODate(one.year, one.month, one.day, two.year, two.month, two.day, largestUnit);
	  },
	  year(_ref3) {
	    let {
	      year
	    } = _ref3;
	    return year;
	  },
	  era() {
	    return undefined;
	  },
	  eraYear() {
	    return undefined;
	  },
	  month(_ref4) {
	    let {
	      month
	    } = _ref4;
	    return month;
	  },
	  monthCode(_ref5) {
	    let {
	      month
	    } = _ref5;
	    return buildMonthCode(month);
	  },
	  day(_ref6) {
	    let {
	      day
	    } = _ref6;
	    return day;
	  },
	  dayOfWeek(_ref7) {
	    let {
	      year,
	      month,
	      day
	    } = _ref7;
	    const m = month + (month < 3 ? 10 : -2);
	    const Y = year - (month < 3 ? 1 : 0);
	    const c = MathFloor(Y / 100);
	    const y = Y - c * 100;
	    const d = day;
	    const pD = d;
	    const pM = MathFloor(2.6 * m - 0.2);
	    const pY = y + MathFloor(y / 4);
	    const pC = MathFloor(c / 4) - 2 * c;
	    const dow = (pD + pM + pY + pC) % 7;
	    return dow + (dow <= 0 ? 7 : 0);
	  },
	  dayOfYear(_ref8) {
	    let {
	      year,
	      month,
	      day
	    } = _ref8;
	    let days = day;
	    for (let m = month - 1; m > 0; m--) {
	      days += this.daysInMonth({
	        year,
	        month: m
	      });
	    }
	    return days;
	  },
	  daysInWeek() {
	    return 7;
	  },
	  daysInMonth(_ref9) {
	    let {
	      year,
	      month
	    } = _ref9;
	    return ISODaysInMonth(year, month);
	  },
	  daysInYear(isoDate) {
	    return this.inLeapYear(isoDate) ? 366 : 365;
	  },
	  monthsInYear() {
	    return 12;
	  },
	  inLeapYear(_ref10) {
	    let {
	      year
	    } = _ref10;
	    return LeapYear(year);
	  }
	};

	// Note: other built-in calendars than iso8601 are not part of the Temporal
	// proposal for ECMA-262. These calendars will be standardized as part of
	// ECMA-402.

	function monthCodeNumberPart(monthCode) {
	  if (!monthCode.startsWith('M')) {
	    throw new RangeError(`Invalid month code: ${monthCode}.  Month codes must start with M.`);
	  }
	  const month = +monthCode.slice(1);
	  if (isNaN(month)) throw new RangeError(`Invalid month code: ${monthCode}`);
	  return month;
	}
	function buildMonthCode(month) {
	  let leap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	  return `M${month.toString().padStart(2, '0')}${leap ? 'L' : ''}`;
	}
	function requireFields(fields, requiredFieldNames) {
	  for (let index = 0; index < requiredFieldNames.length; index++) {
	    const fieldName = requiredFieldNames[index];
	    if (fields[fieldName] === undefined) {
	      throw new TypeError(`${fieldName} is required`);
	    }
	  }
	}

	/**
	 * Safely merge a month, monthCode pair into an integer month.
	 * If both are present, make sure they match.
	 * This logic doesn't work for lunisolar calendars!
	 * */
	function resolveNonLunisolarMonth(calendarDate) {
	  let overflow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	  let monthsPerYear = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 12;
	  let {
	    month,
	    monthCode
	  } = calendarDate;
	  if (monthCode === undefined) {
	    if (month === undefined) throw new TypeError('Either month or monthCode are required');
	    // The ISO calendar uses the default (undefined) value because it does
	    // constrain/reject after this method returns. Non-ISO calendars, however,
	    // rely on this function to constrain/reject out-of-range `month` values.
	    if (overflow === 'reject') RejectToRange(month, 1, monthsPerYear);
	    if (overflow === 'constrain') month = ConstrainToRange(month, 1, monthsPerYear);
	    monthCode = buildMonthCode(month);
	  } else {
	    const numberPart = monthCodeNumberPart(monthCode);
	    if (month !== undefined && month !== numberPart) {
	      throw new RangeError(`monthCode ${monthCode} and month ${month} must match if both are present`);
	    }
	    if (monthCode !== buildMonthCode(numberPart)) {
	      throw new RangeError(`Invalid month code: ${monthCode}`);
	    }
	    month = numberPart;
	    if (month < 1 || month > monthsPerYear) throw new RangeError(`Invalid monthCode: ${monthCode}`);
	  }
	  return {
	    ...calendarDate,
	    month,
	    monthCode
	  };
	}
	function weekNumber(firstDayOfWeek, minimalDaysInFirstWeek, desiredDay, dayOfWeek) {
	  var periodStartDayOfWeek = (dayOfWeek - firstDayOfWeek - desiredDay + 1) % 7;
	  if (periodStartDayOfWeek < 0) periodStartDayOfWeek += 7;
	  var weekNo = MathFloor((desiredDay + periodStartDayOfWeek - 1) / 7);
	  if (7 - periodStartDayOfWeek >= minimalDaysInFirstWeek) {
	    ++weekNo;
	  }
	  return weekNo;
	}

	// Note: other built-in calendars than iso8601 are not part of the Temporal
	// proposal for ECMA-262. An implementation of these calendars is present in
	// this polyfill in order to validate the Temporal API and to get early feedback
	// about non-ISO calendars. However, non-ISO calendar implementation is subject
	// to change because these calendars are implementation-defined.

	/**
	 * This prototype implementation of non-ISO calendars makes many repeated calls
	 * to Intl APIs which may be slow (e.g. >0.2ms). This trivial cache will speed
	 * up these repeat accesses. Each cache instance is associated (via a WeakMap)
	 * to a specific Temporal object, which speeds up multiple calendar calls on the
	 * same Temporal object instance.  No invalidation or pruning is necessary
	 * because each object's cache is thrown away when the object is GC-ed.
	 */
	class OneObjectCache {
	  constructor() {
	    let cacheToClone = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	    this.map = new OriginalMap();
	    this.calls = 0;
	    this.now = globalThis.performance ? globalThis.performance.now() : Date.now();
	    this.hits = 0;
	    this.misses = 0;
	    if (cacheToClone !== undefined) {
	      let i = 0;
	      const entriesIterator = Call$1(MapPrototypeEntries, cacheToClone.map, []);
	      for (;;) {
	        const iterResult = Call$1(MapIteratorPrototypeNext, entriesIterator, []);
	        if (iterResult.done) break;
	        if (++i > OneObjectCache.MAX_CACHE_ENTRIES) break;
	        Call$1(MapPrototypeSet, this.map, iterResult.value);
	      }
	    }
	  }
	  get(key) {
	    const result = Call$1(MapPrototypeGet, this.map, [key]);
	    if (result) {
	      this.hits++;
	      this.report();
	    }
	    this.calls++;
	    return result;
	  }
	  set(key, value) {
	    Call$1(MapPrototypeSet, this.map, [key, value]);
	    this.misses++;
	    this.report();
	  }
	  report() {
	    /*
	    if (this.calls === 0) return;
	    const ms = (globalThis.performance ? globalThis.performance.now() : Date.now()) - this.now;
	    const hitRate = ((100 * this.hits) / this.calls).toFixed(0);
	    console.log(`${this.calls} calls in ${ms.toFixed(2)}ms. Hits: ${this.hits} (${hitRate}%). Misses: ${this.misses}.`);
	    */
	  }
	  setObject(obj) {
	    if (Call$1(WeakMapPrototypeGet, OneObjectCache.objectMap, [obj])) throw new RangeError('object already cached');
	    Call$1(WeakMapPrototypeSet, OneObjectCache.objectMap, [obj, this]);
	    this.report();
	  }
	}
	OneObjectCache.objectMap = new OriginalWeakMap();
	OneObjectCache.MAX_CACHE_ENTRIES = 1000;
	/**
	 * Returns a WeakMap-backed cache that's used to store expensive results
	 * that are associated with a particular Temporal object instance.
	 *
	 * @param obj - object to associate with the cache
	 */
	OneObjectCache.getCacheForObject = function (obj) {
	  let cache = Call$1(WeakMapPrototypeGet, OneObjectCache.objectMap, [obj]);
	  if (!cache) {
	    cache = new OneObjectCache();
	    Call$1(WeakMapPrototypeSet, OneObjectCache.objectMap, [obj, cache]);
	  }
	  return cache;
	};
	function toUtcIsoDateString(_ref11) {
	  let {
	    isoYear,
	    isoMonth,
	    isoDay
	  } = _ref11;
	  const yearString = ISOYearString(isoYear);
	  const monthString = ISODateTimePartString(isoMonth);
	  const dayString = ISODateTimePartString(isoDay);
	  return `${yearString}-${monthString}-${dayString}T00:00Z`;
	}
	function simpleDateDiff(one, two) {
	  return {
	    years: one.year - two.year,
	    months: one.month - two.month,
	    days: one.day - two.day
	  };
	}

	/**
	 * Implementation that's common to all non-trivial non-ISO calendars
	 */
	const nonIsoHelperBase = {
	  // The properties and methods below here should be the same for all lunar/lunisolar calendars.
	  getFormatter() {
	    // `new Intl.DateTimeFormat()` is amazingly slow and chews up RAM. Per
	    // https://bugs.chromium.org/p/v8/issues/detail?id=6528#c4, we cache one
	    // DateTimeFormat instance per calendar. Caching is lazy so we only pay for
	    // calendars that are used. Note that the nonIsoHelperBase object is spread
	    // into each calendar's implementation before any cache is created, so
	    // each calendar gets its own separate cached formatter.
	    if (typeof this.formatter === 'undefined') {
	      this.formatter = new IntlDateTimeFormat$1(`en-US-u-ca-${this.id}`, {
	        day: 'numeric',
	        month: 'numeric',
	        year: 'numeric',
	        era: 'short',
	        timeZone: 'UTC'
	      });
	    }
	    return this.formatter;
	  },
	  isoToCalendarDate(isoDate, cache) {
	    const {
	      year: isoYear,
	      month: isoMonth,
	      day: isoDay
	    } = isoDate;
	    const key = JSON.stringify({
	      func: 'isoToCalendarDate',
	      isoYear,
	      isoMonth,
	      isoDay,
	      id: this.id
	    });
	    const cached = cache.get(key);
	    if (cached) return cached;
	    const dateTimeFormat = this.getFormatter();
	    let parts, isoString;
	    try {
	      isoString = toUtcIsoDateString({
	        isoYear,
	        isoMonth,
	        isoDay
	      });
	      parts = dateTimeFormat.formatToParts(new Date(isoString));
	    } catch (e) {
	      throw new RangeError(`Invalid ISO date: ${JSON.stringify({
        isoYear,
        isoMonth,
        isoDay
      })}`);
	    }
	    const result = {};
	    for (let {
	      type,
	      value
	    } of parts) {
	      if (type === 'year') result.eraYear = +value;
	      if (type === 'relatedYear') result.eraYear = +value;
	      if (type === 'month') {
	        const matches = /^([0-9]*)(.*?)$/.exec(value);
	        if (!matches || matches.length != 3 || !matches[1] && !matches[2]) {
	          throw new RangeError(`Unexpected month: ${value}`);
	        }
	        // If the month has no numeric part (should only see this for the Hebrew
	        // calendar with newer FF / Chromium versions; see
	        // https://bugzilla.mozilla.org/show_bug.cgi?id=1751833) then set a
	        // placeholder month index of `1` and rely on the derived class to
	        // calculate the correct month index from the month name stored in
	        // `monthExtra`.
	        result.month = matches[1] ? +matches[1] : 1;
	        if (result.month < 1) {
	          throw new RangeError(`Invalid month ${value} from ${isoString}[u-ca-${this.id}]` + ' (probably due to https://bugs.chromium.org/p/v8/issues/detail?id=10527)');
	        }
	        if (result.month > 13) {
	          throw new RangeError(`Invalid month ${value} from ${isoString}[u-ca-${this.id}]` + ' (probably due to https://bugs.chromium.org/p/v8/issues/detail?id=10529)');
	        }

	        // The ICU formats for the Hebrew calendar no longer support a numeric
	        // month format. So we'll rely on the derived class to interpret it.
	        // `monthExtra` is also used on the Chinese calendar to handle a suffix
	        // "bis" indicating a leap month.
	        if (matches[2]) result.monthExtra = matches[2];
	      }
	      if (type === 'day') result.day = +value;
	      if (this.hasEra && type === 'era' && value != null && value !== '') {
	        // The convention for Temporal era values is lowercase, so following
	        // that convention in this prototype. Punctuation is removed, accented
	        // letters are normalized, and spaces are replaced with dashes.
	        // E.g.: "ERA0" => "era0", "Before R.O.C." => "before-roc", "En’ō" => "eno"
	        // The call to normalize() and the replacement regex deals with era
	        // names that contain non-ASCII characters like Japanese eras. Also
	        // ignore extra content in parentheses like JPN era date ranges.
	        value = value.split(' (')[0];
	        result.era = value.normalize('NFD').replace(/[^-0-9 \p{L}]/gu, '').replace(' ', '-').toLowerCase();
	      }
	    }
	    if (result.eraYear === undefined) {
	      // Node 12 has outdated ICU data that lacks the `relatedYear` field in the
	      // output of Intl.DateTimeFormat.formatToParts.
	      throw new RangeError(`Intl.DateTimeFormat.formatToParts lacks relatedYear in ${this.id} calendar. Try Node 14+ or modern browsers.`);
	    }
	    // Translate eras that may be handled differently by Temporal vs. by Intl
	    // (e.g. Japanese pre-Meiji eras). See #526 for details.
	    if (this.reviseIntlEra) {
	      const {
	        era,
	        eraYear
	      } = this.reviseIntlEra(result, isoDate);
	      result.era = era;
	      result.eraYear = eraYear;
	    }
	    if (this.checkIcuBugs) this.checkIcuBugs(isoDate);
	    const calendarDate = this.adjustCalendarDate(result, cache, 'constrain', true);
	    if (calendarDate.year === undefined) throw new RangeError(`Missing year converting ${JSON.stringify(isoDate)}`);
	    if (calendarDate.month === undefined) throw new RangeError(`Missing month converting ${JSON.stringify(isoDate)}`);
	    if (calendarDate.day === undefined) throw new RangeError(`Missing day converting ${JSON.stringify(isoDate)}`);
	    cache.set(key, calendarDate);
	    // Also cache the reverse mapping
	    ['constrain', 'reject'].forEach(overflow => {
	      const keyReverse = JSON.stringify({
	        func: 'calendarToIsoDate',
	        year: calendarDate.year,
	        month: calendarDate.month,
	        day: calendarDate.day,
	        overflow,
	        id: this.id
	      });
	      cache.set(keyReverse, isoDate);
	    });
	    return calendarDate;
	  },
	  validateCalendarDate(calendarDate) {
	    const {
	      era,
	      month,
	      year,
	      day,
	      eraYear,
	      monthCode,
	      monthExtra
	    } = calendarDate;
	    // When there's a suffix (e.g. "5bis" for a leap month in Chinese calendar)
	    // the derived class must deal with it.
	    if (monthExtra !== undefined) throw new RangeError('Unexpected `monthExtra` value');
	    if (year === undefined && eraYear === undefined) throw new TypeError('year or eraYear is required');
	    if (month === undefined && monthCode === undefined) throw new TypeError('month or monthCode is required');
	    if (day === undefined) throw new RangeError('Missing day');
	    if (monthCode !== undefined) {
	      if (typeof monthCode !== 'string') {
	        throw new RangeError(`monthCode must be a string, not ${Type$3(monthCode).toLowerCase()}`);
	      }
	      if (!/^M([01]?\d)(L?)$/.test(monthCode)) throw new RangeError(`Invalid monthCode: ${monthCode}`);
	    }
	    if (this.constantEra) {
	      if (era !== undefined && era !== this.constantEra) {
	        throw new RangeError(`era must be ${this.constantEra}, not ${era}`);
	      }
	      if (eraYear !== undefined && year !== undefined && eraYear !== year) {
	        throw new RangeError(`eraYear ${eraYear} does not match year ${year}`);
	      }
	    }
	    if (this.hasEra) {
	      if (calendarDate['era'] === undefined !== (calendarDate['eraYear'] === undefined)) {
	        throw new TypeError("properties 'era' and 'eraYear' must be provided together");
	      }
	    }
	  },
	  /**
	   * Allows derived calendars to add additional fields and/or to make
	   * adjustments e.g. to set the era based on the date or to revise the month
	   * number in lunisolar calendars per
	   * https://github.com/tc39/proposal-temporal/issues/1203.
	   *
	   * The base implementation fills in missing values by assuming the simplest
	   * possible calendar:
	   * - no eras or a constant era defined in `.constantEra`
	   * - non-lunisolar calendar (no leap months)
	   * */
	  adjustCalendarDate(calendarDate, cache, overflow /*, fromLegacyDate = false */) {
	    if (this.calendarType === 'lunisolar') throw new RangeError('Override required for lunisolar calendars');
	    this.validateCalendarDate(calendarDate);
	    // For calendars that always use the same era, set it here so that derived
	    // calendars won't need to implement this method simply to set the era.
	    if (this.constantEra) {
	      // year and eraYear always match when there's only one possible era
	      const {
	        year,
	        eraYear
	      } = calendarDate;
	      calendarDate = {
	        ...calendarDate,
	        era: this.constantEra,
	        year: year !== undefined ? year : eraYear,
	        eraYear: eraYear !== undefined ? eraYear : year
	      };
	    }
	    const largestMonth = this.monthsInYear(calendarDate, cache);
	    let {
	      month,
	      monthCode
	    } = calendarDate;
	    ({
	      month,
	      monthCode
	    } = resolveNonLunisolarMonth(calendarDate, overflow, largestMonth));
	    return {
	      ...calendarDate,
	      month,
	      monthCode
	    };
	  },
	  regulateMonthDayNaive(calendarDate, overflow, cache) {
	    const largestMonth = this.monthsInYear(calendarDate, cache);
	    let {
	      month,
	      day
	    } = calendarDate;
	    if (overflow === 'reject') {
	      RejectToRange(month, 1, largestMonth);
	      RejectToRange(day, 1, this.maximumMonthLength(calendarDate));
	    } else {
	      month = ConstrainToRange(month, 1, largestMonth);
	      day = ConstrainToRange(day, 1, this.maximumMonthLength({
	        ...calendarDate,
	        month
	      }));
	    }
	    return {
	      ...calendarDate,
	      month,
	      day
	    };
	  },
	  calendarToIsoDate(date) {
	    let overflow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'constrain';
	    let cache = arguments.length > 2 ? arguments[2] : undefined;
	    const originalDate = date;
	    // First, normalize the calendar date to ensure that (year, month, day)
	    // are all present, converting monthCode and eraYear if needed.
	    date = this.adjustCalendarDate(date, cache, overflow, false);

	    // Fix obviously out-of-bounds values. Values that are valid generally, but
	    // not in this particular year, may not be caught here for some calendars.
	    // If so, these will be handled lower below.
	    date = this.regulateMonthDayNaive(date, overflow, cache);
	    const {
	      year,
	      month,
	      day
	    } = date;
	    const key = JSON.stringify({
	      func: 'calendarToIsoDate',
	      year,
	      month,
	      day,
	      overflow,
	      id: this.id
	    });
	    let cached = cache.get(key);
	    if (cached) return cached;
	    // If YMD are present in the input but the input has been constrained
	    // already, then cache both the original value and the constrained value.
	    let keyOriginal;
	    if (originalDate.year !== undefined && originalDate.month !== undefined && originalDate.day !== undefined && (originalDate.year !== date.year || originalDate.month !== date.month || originalDate.day !== date.day)) {
	      keyOriginal = JSON.stringify({
	        func: 'calendarToIsoDate',
	        year: originalDate.year,
	        month: originalDate.month,
	        day: originalDate.day,
	        overflow,
	        id: this.id
	      });
	      cached = cache.get(keyOriginal);
	      if (cached) return cached;
	    }

	    // First, try to roughly guess the result
	    let isoEstimate = this.estimateIsoDate({
	      year,
	      month,
	      day
	    });
	    const calculateSameMonthResult = diffDays => {
	      // If the estimate is in the same year & month as the target, then we can
	      // calculate the result exactly and short-circuit any additional logic.
	      // This optimization assumes that months are continuous. It would break if
	      // a calendar skipped days, like the Julian->Gregorian switchover. But
	      // current ICU calendars only skip days (japanese/roc/buddhist) because of
	      // a bug (https://bugs.chromium.org/p/chromium/issues/detail?id=1173158)
	      // that's currently worked around by a custom calendarToIsoDate
	      // implementation in those calendars. So this optimization should be safe
	      // for all ICU calendars.
	      let testIsoEstimate = this.addDaysIso(isoEstimate, diffDays);
	      if (date.day > this.minimumMonthLength(date)) {
	        // There's a chance that the calendar date is out of range. Throw or
	        // constrain if so.
	        let testCalendarDate = this.isoToCalendarDate(testIsoEstimate, cache);
	        while (testCalendarDate.month !== month || testCalendarDate.year !== year) {
	          if (overflow === 'reject') {
	            throw new RangeError(`day ${day} does not exist in month ${month} of year ${year}`);
	          }
	          // Back up a day at a time until we're not hanging over the month end
	          testIsoEstimate = this.addDaysIso(testIsoEstimate, -1);
	          testCalendarDate = this.isoToCalendarDate(testIsoEstimate, cache);
	        }
	      }
	      return testIsoEstimate;
	    };
	    let sign = 0;
	    let roundtripEstimate = this.isoToCalendarDate(isoEstimate, cache);
	    let diff = simpleDateDiff(date, roundtripEstimate);
	    if (diff.years !== 0 || diff.months !== 0 || diff.days !== 0) {
	      const diffTotalDaysEstimate = diff.years * 365 + diff.months * 30 + diff.days;
	      isoEstimate = this.addDaysIso(isoEstimate, diffTotalDaysEstimate);
	      roundtripEstimate = this.isoToCalendarDate(isoEstimate, cache);
	      diff = simpleDateDiff(date, roundtripEstimate);
	      if (diff.years === 0 && diff.months === 0) {
	        isoEstimate = calculateSameMonthResult(diff.days);
	      } else {
	        sign = this.compareCalendarDates(date, roundtripEstimate);
	      }
	    }
	    // If the initial guess is not in the same month, then bisect the
	    // distance to the target, starting with 8 days per step.
	    let increment = 8;
	    while (sign) {
	      isoEstimate = this.addDaysIso(isoEstimate, sign * increment);
	      const oldRoundtripEstimate = roundtripEstimate;
	      roundtripEstimate = this.isoToCalendarDate(isoEstimate, cache);
	      const oldSign = sign;
	      sign = this.compareCalendarDates(date, roundtripEstimate);
	      if (sign) {
	        diff = simpleDateDiff(date, roundtripEstimate);
	        if (diff.years === 0 && diff.months === 0) {
	          isoEstimate = calculateSameMonthResult(diff.days);
	          // Signal the loop condition that there's a match.
	          sign = 0;
	        } else if (oldSign && sign !== oldSign) {
	          if (increment > 1) {
	            // If the estimate overshot the target, try again with a smaller increment
	            // in the reverse direction.
	            increment /= 2;
	          } else {
	            // Increment is 1, and neither the previous estimate nor the new
	            // estimate is correct. The only way that can happen is if the
	            // original date was an invalid value that will be constrained or
	            // rejected here.
	            if (overflow === 'reject') {
	              throw new RangeError(`Can't find ISO date from calendar date: ${JSON.stringify({
                ...originalDate
              })}`);
	            } else {
	              // To constrain, pick the earliest value
	              const order = this.compareCalendarDates(roundtripEstimate, oldRoundtripEstimate);
	              // If current value is larger, then back up to the previous value.
	              if (order > 0) isoEstimate = this.addDaysIso(isoEstimate, -1);
	              sign = 0;
	            }
	          }
	        }
	      }
	    }
	    cache.set(key, isoEstimate);
	    if (keyOriginal) cache.set(keyOriginal, isoEstimate);
	    if (date.year === undefined || date.month === undefined || date.day === undefined || date.monthCode === undefined || this.hasEra && (date.era === undefined || date.eraYear === undefined)) {
	      throw new RangeError('Unexpected missing property');
	    }
	    return isoEstimate;
	  },
	  compareCalendarDates(date1, date2) {
	    if (date1.year !== date2.year) return ComparisonResult(date1.year - date2.year);
	    if (date1.month !== date2.month) return ComparisonResult(date1.month - date2.month);
	    if (date1.day !== date2.day) return ComparisonResult(date1.day - date2.day);
	    return 0;
	  },
	  /** Ensure that a calendar date actually exists. If not, return the closest earlier date. */
	  regulateDate(calendarDate) {
	    let overflow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'constrain';
	    let cache = arguments.length > 2 ? arguments[2] : undefined;
	    const isoDate = this.calendarToIsoDate(calendarDate, overflow, cache);
	    return this.isoToCalendarDate(isoDate, cache);
	  },
	  addDaysIso(isoDate, days) {
	    const added = AddISODate(isoDate.year, isoDate.month, isoDate.day, 0, 0, 0, days, 'constrain');
	    return added;
	  },
	  addDaysCalendar(calendarDate, days, cache) {
	    const isoDate = this.calendarToIsoDate(calendarDate, 'constrain', cache);
	    const addedIso = this.addDaysIso(isoDate, days);
	    const addedCalendar = this.isoToCalendarDate(addedIso, cache);
	    return addedCalendar;
	  },
	  addMonthsCalendar(calendarDate, months, overflow, cache) {
	    const {
	      day
	    } = calendarDate;
	    for (let i = 0, absMonths = MathAbs(months); i < absMonths; i++) {
	      const {
	        month
	      } = calendarDate;
	      const oldCalendarDate = calendarDate;
	      const days = months < 0 ? -Math.max(day, this.daysInPreviousMonth(calendarDate, cache)) : this.daysInMonth(calendarDate, cache);
	      const isoDate = this.calendarToIsoDate(calendarDate, 'constrain', cache);
	      let addedIso = this.addDaysIso(isoDate, days, cache);
	      calendarDate = this.isoToCalendarDate(addedIso, cache);

	      // Normally, we can advance one month by adding the number of days in the
	      // current month. However, if we're at the end of the current month and
	      // the next month has fewer days, then we rolled over to the after-next
	      // month. Below we detect this condition and back up until we're back in
	      // the desired month.
	      if (months > 0) {
	        const monthsInOldYear = this.monthsInYear(oldCalendarDate, cache);
	        while (calendarDate.month - 1 !== month % monthsInOldYear) {
	          addedIso = this.addDaysIso(addedIso, -1, cache);
	          calendarDate = this.isoToCalendarDate(addedIso, cache);
	        }
	      }
	      if (calendarDate.day !== day) {
	        // try to retain the original day-of-month, if possible
	        calendarDate = this.regulateDate({
	          ...calendarDate,
	          day
	        }, 'constrain', cache);
	      }
	    }
	    if (overflow === 'reject' && calendarDate.day !== day) {
	      throw new RangeError(`Day ${day} does not exist in resulting calendar month`);
	    }
	    return calendarDate;
	  },
	  addCalendar(calendarDate, _ref12, overflow, cache) {
	    let {
	      years = 0,
	      months = 0,
	      weeks = 0,
	      days = 0
	    } = _ref12;
	    const {
	      year,
	      day,
	      monthCode
	    } = calendarDate;
	    const addedYears = this.adjustCalendarDate({
	      year: year + years,
	      monthCode,
	      day
	    }, cache);
	    const addedMonths = this.addMonthsCalendar(addedYears, months, overflow, cache);
	    days += weeks * 7;
	    const addedDays = this.addDaysCalendar(addedMonths, days, cache);
	    return addedDays;
	  },
	  untilCalendar(calendarOne, calendarTwo, largestUnit, cache) {
	    let days = 0;
	    let weeks = 0;
	    let months = 0;
	    let years = 0;
	    switch (largestUnit) {
	      case 'day':
	        days = this.calendarDaysUntil(calendarOne, calendarTwo, cache);
	        break;
	      case 'week':
	        {
	          const totalDays = this.calendarDaysUntil(calendarOne, calendarTwo, cache);
	          days = totalDays % 7;
	          weeks = (totalDays - days) / 7;
	          break;
	        }
	      case 'month':
	      case 'year':
	        {
	          const sign = this.compareCalendarDates(calendarTwo, calendarOne);
	          if (!sign) {
	            return {
	              years: 0,
	              months: 0,
	              weeks: 0,
	              days: 0
	            };
	          }
	          const diffYears = calendarTwo.year - calendarOne.year;
	          const diffDays = calendarTwo.day - calendarOne.day;
	          if (largestUnit === 'year' && diffYears) {
	            let diffInYearSign = 0;
	            if (calendarTwo.monthCode > calendarOne.monthCode) diffInYearSign = 1;
	            if (calendarTwo.monthCode < calendarOne.monthCode) diffInYearSign = -1;
	            if (!diffInYearSign) diffInYearSign = Math.sign(diffDays);
	            const isOneFurtherInYear = diffInYearSign * sign < 0;
	            years = isOneFurtherInYear ? diffYears - sign : diffYears;
	          }
	          const yearsAdded = years ? this.addCalendar(calendarOne, {
	            years
	          }, 'constrain', cache) : calendarOne;
	          // Now we have less than one year remaining. Add one month at a time
	          // until we go over the target, then back up one month and calculate
	          // remaining days and weeks.
	          let current;
	          let next = yearsAdded;
	          do {
	            months += sign;
	            current = next;
	            next = this.addMonthsCalendar(current, sign, 'constrain', cache);
	            if (next.day !== calendarOne.day) {
	              // In case the day was constrained down, try to un-constrain it
	              next = this.regulateDate({
	                ...next,
	                day: calendarOne.day
	              }, 'constrain', cache);
	            }
	          } while (this.compareCalendarDates(calendarTwo, next) * sign >= 0);
	          months -= sign; // correct for loop above which overshoots by 1
	          const remainingDays = this.calendarDaysUntil(current, calendarTwo, cache);
	          days = remainingDays;
	          break;
	        }
	    }
	    return {
	      years,
	      months,
	      weeks,
	      days
	    };
	  },
	  daysInMonth(calendarDate, cache) {
	    // Add enough days to roll over to the next month. One we're in the next
	    // month, we can calculate the length of the current month. NOTE: This
	    // algorithm assumes that months are continuous. It would break if a
	    // calendar skipped days, like the Julian->Gregorian switchover. But current
	    // ICU calendars only skip days (japanese/roc/buddhist) because of a bug
	    // (https://bugs.chromium.org/p/chromium/issues/detail?id=1173158) that's
	    // currently worked around by a custom calendarToIsoDate implementation in
	    // those calendars. So this code should be safe for all ICU calendars.
	    const {
	      day
	    } = calendarDate;
	    const max = this.maximumMonthLength(calendarDate);
	    const min = this.minimumMonthLength(calendarDate);
	    // easiest case: we already know the month length if min and max are the same.
	    if (min === max) return min;

	    // Add enough days to get into the next month, without skipping it
	    const increment = day <= max - min ? max : min;
	    const isoDate = this.calendarToIsoDate(calendarDate, 'constrain', cache);
	    const addedIsoDate = this.addDaysIso(isoDate, increment);
	    const addedCalendarDate = this.isoToCalendarDate(addedIsoDate, cache);

	    // Now back up to the last day of the original month
	    const endOfMonthIso = this.addDaysIso(addedIsoDate, -addedCalendarDate.day);
	    const endOfMonthCalendar = this.isoToCalendarDate(endOfMonthIso, cache);
	    return endOfMonthCalendar.day;
	  },
	  daysInPreviousMonth(calendarDate, cache) {
	    const {
	      day,
	      month,
	      year
	    } = calendarDate;

	    // Check to see if we already know the month length, and return it if so
	    const previousMonthYear = month > 1 ? year : year - 1;
	    let previousMonthDate = {
	      year: previousMonthYear,
	      month,
	      day: 1
	    };
	    const previousMonth = month > 1 ? month - 1 : this.monthsInYear(previousMonthDate, cache);
	    previousMonthDate = {
	      ...previousMonthDate,
	      month: previousMonth
	    };
	    const min = this.minimumMonthLength(previousMonthDate);
	    const max = this.maximumMonthLength(previousMonthDate);
	    if (min === max) return max;
	    const isoDate = this.calendarToIsoDate(calendarDate, 'constrain', cache);
	    const lastDayOfPreviousMonthIso = this.addDaysIso(isoDate, -day);
	    const lastDayOfPreviousMonthCalendar = this.isoToCalendarDate(lastDayOfPreviousMonthIso, cache);
	    return lastDayOfPreviousMonthCalendar.day;
	  },
	  startOfCalendarYear(calendarDate) {
	    return {
	      year: calendarDate.year,
	      month: 1,
	      monthCode: 'M01',
	      day: 1
	    };
	  },
	  startOfCalendarMonth(calendarDate) {
	    return {
	      year: calendarDate.year,
	      month: calendarDate.month,
	      day: 1
	    };
	  },
	  calendarDaysUntil(calendarOne, calendarTwo, cache) {
	    const oneIso = this.calendarToIsoDate(calendarOne, 'constrain', cache);
	    const twoIso = this.calendarToIsoDate(calendarTwo, 'constrain', cache);
	    return this.isoDaysUntil(oneIso, twoIso);
	  },
	  isoDaysUntil(oneIso, twoIso) {
	    const duration = DifferenceISODate(oneIso.year, oneIso.month, oneIso.day, twoIso.year, twoIso.month, twoIso.day, 'day');
	    return duration.days;
	  },
	  // All built-in calendars except Chinese/Dangi and Hebrew use an era
	  hasEra: true,
	  monthDayFromFields(fields, overflow, cache) {
	    let {
	      monthCode,
	      day
	    } = fields;
	    if (monthCode === undefined) {
	      let {
	        year,
	        era,
	        eraYear
	      } = fields;
	      if (year === undefined && (era === undefined || eraYear === undefined)) {
	        throw new TypeError('when `monthCode` is omitted, `year` (or `era` and `eraYear`) and `month` are required');
	      }
	      // Apply overflow behaviour to year/month/day, to get correct monthCode/day
	      ({
	        monthCode,
	        day
	      } = this.isoToCalendarDate(this.calendarToIsoDate(fields, overflow, cache), cache));
	    }
	    let isoYear, isoMonth, isoDay;
	    let closestCalendar, closestIso;
	    // Look backwards starting from one of the calendar years spanning ISO year
	    // 1972, up to 100 calendar years prior, to find a year that has this month
	    // and day. Normal months and days will match immediately, but for leap days
	    // and leap months we may have to look for a while.
	    const startDateIso = {
	      year: 1972,
	      month: 12,
	      day: 31
	    };
	    const calendarOfStartDateIso = this.isoToCalendarDate(startDateIso, cache);
	    // Note: relies on lexicographical ordering of monthCodes
	    const calendarYear = calendarOfStartDateIso.monthCode > monthCode || calendarOfStartDateIso.monthCode === monthCode && calendarOfStartDateIso.day >= day ? calendarOfStartDateIso.year : calendarOfStartDateIso.year - 1;
	    for (let i = 0; i < 100; i++) {
	      let testCalendarDate = this.adjustCalendarDate({
	        day,
	        monthCode,
	        year: calendarYear - i
	      }, cache);
	      const isoDate = this.calendarToIsoDate(testCalendarDate, 'constrain', cache);
	      const roundTripCalendarDate = this.isoToCalendarDate(isoDate, cache);
	      ({
	        year: isoYear,
	        month: isoMonth,
	        day: isoDay
	      } = isoDate);
	      if (roundTripCalendarDate.monthCode === monthCode && roundTripCalendarDate.day === day) {
	        return {
	          month: isoMonth,
	          day: isoDay,
	          year: isoYear
	        };
	      } else if (overflow === 'constrain') {
	        // non-ISO constrain algorithm tries to find the closest date in a matching month
	        if (closestCalendar === undefined || roundTripCalendarDate.monthCode === closestCalendar.monthCode && roundTripCalendarDate.day > closestCalendar.day) {
	          closestCalendar = roundTripCalendarDate;
	          closestIso = isoDate;
	        }
	      }
	    }
	    if (overflow === 'constrain' && closestIso !== undefined) return closestIso;
	    throw new RangeError(`No recent ${this.id} year with monthCode ${monthCode} and day ${day}`);
	  }
	};
	const helperHebrew = ObjectAssign$2({}, nonIsoHelperBase, {
	  id: 'hebrew',
	  calendarType: 'lunisolar',
	  inLeapYear(calendarDate /*, cache */) {
	    const {
	      year
	    } = calendarDate;
	    // FYI: In addition to adding a month in leap years, the Hebrew calendar
	    // also has per-year changes to the number of days of Heshvan and Kislev.
	    // Given that these can be calculated by counting the number of days in
	    // those months, I assume that these DO NOT need to be exposed as
	    // Hebrew-only prototype fields or methods.
	    return (7 * year + 1) % 19 < 7;
	  },
	  monthsInYear(calendarDate) {
	    return this.inLeapYear(calendarDate) ? 13 : 12;
	  },
	  minimumMonthLength(calendarDate) {
	    return this.minMaxMonthLength(calendarDate, 'min');
	  },
	  maximumMonthLength(calendarDate) {
	    return this.minMaxMonthLength(calendarDate, 'max');
	  },
	  minMaxMonthLength(calendarDate, minOrMax) {
	    const {
	      month,
	      year
	    } = calendarDate;
	    const monthCode = this.getMonthCode(year, month);
	    const monthInfo = ObjectEntries(this.months).find(m => m[1].monthCode === monthCode);
	    if (monthInfo === undefined) throw new RangeError(`unmatched Hebrew month: ${month}`);
	    const daysInMonth = monthInfo[1].days;
	    return typeof daysInMonth === 'number' ? daysInMonth : daysInMonth[minOrMax];
	  },
	  /** Take a guess at what ISO date a particular calendar date corresponds to */
	  estimateIsoDate(calendarDate) {
	    const {
	      year
	    } = calendarDate;
	    return {
	      year: year - 3760,
	      month: 1,
	      day: 1
	    };
	  },
	  months: {
	    Tishri: {
	      leap: 1,
	      regular: 1,
	      monthCode: 'M01',
	      days: 30
	    },
	    Heshvan: {
	      leap: 2,
	      regular: 2,
	      monthCode: 'M02',
	      days: {
	        min: 29,
	        max: 30
	      }
	    },
	    Kislev: {
	      leap: 3,
	      regular: 3,
	      monthCode: 'M03',
	      days: {
	        min: 29,
	        max: 30
	      }
	    },
	    Tevet: {
	      leap: 4,
	      regular: 4,
	      monthCode: 'M04',
	      days: 29
	    },
	    Shevat: {
	      leap: 5,
	      regular: 5,
	      monthCode: 'M05',
	      days: 30
	    },
	    Adar: {
	      leap: undefined,
	      regular: 6,
	      monthCode: 'M06',
	      days: 29
	    },
	    'Adar I': {
	      leap: 6,
	      regular: undefined,
	      monthCode: 'M05L',
	      days: 30
	    },
	    'Adar II': {
	      leap: 7,
	      regular: undefined,
	      monthCode: 'M06',
	      days: 29
	    },
	    Nisan: {
	      leap: 8,
	      regular: 7,
	      monthCode: 'M07',
	      days: 30
	    },
	    Iyar: {
	      leap: 9,
	      regular: 8,
	      monthCode: 'M08',
	      days: 29
	    },
	    Sivan: {
	      leap: 10,
	      regular: 9,
	      monthCode: 'M09',
	      days: 30
	    },
	    Tamuz: {
	      leap: 11,
	      regular: 10,
	      monthCode: 'M10',
	      days: 29
	    },
	    Av: {
	      leap: 12,
	      regular: 11,
	      monthCode: 'M11',
	      days: 30
	    },
	    Elul: {
	      leap: 13,
	      regular: 12,
	      monthCode: 'M12',
	      days: 29
	    }
	  },
	  getMonthCode(year, month) {
	    if (this.inLeapYear({
	      year
	    })) {
	      return month === 6 ? buildMonthCode(5, true) : buildMonthCode(month < 6 ? month : month - 1);
	    } else {
	      return buildMonthCode(month);
	    }
	  },
	  adjustCalendarDate(calendarDate, cache) {
	    let overflow = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'constrain';
	    let fromLegacyDate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
	    let {
	      year,
	      eraYear,
	      month,
	      monthCode,
	      day,
	      monthExtra
	    } = calendarDate;
	    if (year === undefined) year = eraYear;
	    if (eraYear === undefined) eraYear = year;
	    if (fromLegacyDate) {
	      // In Pre Node-14 V8, DateTimeFormat.formatToParts `month: 'numeric'`
	      // output returns the numeric equivalent of `month` as a string, meaning
	      // that `'6'` in a leap year is Adar I, while `'6'` in a non-leap year
	      // means Adar. In this case, `month` will already be correct and no action
	      // is needed. However, in Node 14 and later formatToParts returns the name
	      // of the Hebrew month (e.g. "Tevet"), so we'll need to look up the
	      // correct `month` using the string name as a key.
	      if (monthExtra) {
	        const monthInfo = this.months[monthExtra];
	        if (!monthInfo) throw new RangeError(`Unrecognized month from formatToParts: ${monthExtra}`);
	        month = this.inLeapYear({
	          year
	        }) ? monthInfo.leap : monthInfo.regular;
	      }
	      monthCode = this.getMonthCode(year, month);
	      const result = {
	        year,
	        month,
	        day,
	        era: undefined,
	        eraYear,
	        monthCode
	      };
	      return result;
	    } else {
	      // When called without input coming from legacy Date output, simply ensure
	      // that all fields are present.
	      this.validateCalendarDate(calendarDate);
	      if (month === undefined) {
	        if (monthCode.endsWith('L')) {
	          if (monthCode !== 'M05L') {
	            throw new RangeError(`Hebrew leap month must have monthCode M05L, not ${monthCode}`);
	          }
	          month = 6;
	          if (!this.inLeapYear({
	            year
	          })) {
	            if (overflow === 'reject') {
	              throw new RangeError(`Hebrew monthCode M05L is invalid in year ${year} which is not a leap year`);
	            } else {
	              // constrain to same day of next month (Adar)
	              month = 6;
	              monthCode = 'M06';
	            }
	          }
	        } else {
	          month = monthCodeNumberPart(monthCode);
	          // if leap month is before this one, the month index is one more than the month code
	          if (this.inLeapYear({
	            year
	          }) && month >= 6) month++;
	          const largestMonth = this.monthsInYear({
	            year
	          });
	          if (month < 1 || month > largestMonth) throw new RangeError(`Invalid monthCode: ${monthCode}`);
	        }
	      } else {
	        if (overflow === 'reject') {
	          RejectToRange(month, 1, this.monthsInYear({
	            year
	          }));
	          RejectToRange(day, 1, this.maximumMonthLength({
	            year,
	            month
	          }));
	        } else {
	          month = ConstrainToRange(month, 1, this.monthsInYear({
	            year
	          }));
	          day = ConstrainToRange(day, 1, this.maximumMonthLength({
	            year,
	            month
	          }));
	        }
	        if (monthCode === undefined) {
	          monthCode = this.getMonthCode(year, month);
	        } else {
	          const calculatedMonthCode = this.getMonthCode(year, month);
	          if (calculatedMonthCode !== monthCode) {
	            throw new RangeError(`monthCode ${monthCode} doesn't correspond to month ${month} in Hebrew year ${year}`);
	          }
	        }
	      }
	      return {
	        ...calendarDate,
	        day,
	        month,
	        monthCode,
	        year,
	        eraYear
	      };
	    }
	  },
	  // All built-in calendars except Chinese/Dangi and Hebrew use an era
	  hasEra: false
	});

	/**
	 * For Temporal purposes, the Islamic calendar is simple because it's always the
	 * same 12 months in the same order.
	 */
	const helperIslamic = ObjectAssign$2({}, nonIsoHelperBase, {
	  id: 'islamic',
	  calendarType: 'lunar',
	  inLeapYear(calendarDate, cache) {
	    const startOfYearCalendar = {
	      year: calendarDate.year,
	      month: 1,
	      monthCode: 'M01',
	      day: 1
	    };
	    const startOfNextYearCalendar = {
	      year: calendarDate.year + 1,
	      month: 1,
	      monthCode: 'M01',
	      day: 1
	    };
	    const result = this.calendarDaysUntil(startOfYearCalendar, startOfNextYearCalendar, cache);
	    return result === 355;
	  },
	  monthsInYear(/* calendarYear, cache */
	  ) {
	    return 12;
	  },
	  minimumMonthLength: (/* calendarDate */) => 29,
	  maximumMonthLength: (/* calendarDate */) => 30,
	  DAYS_PER_ISLAMIC_YEAR: 354 + 11 / 30,
	  DAYS_PER_ISO_YEAR: 365.2425,
	  constantEra: 'ah',
	  reviseIntlEra(calendarDate /*, isoDate*/) {
	    // Chrome for Android as of v 142.0.6367.179 mishandled the era option in Intl.DateTimeFormat
	    // and returned 'bc' instead of 'ah'. This code corrects that and any possible future errors.
	    // see https://issues.chromium.org/issues/40856332
	    return {
	      ...calendarDate,
	      era: 'ah'
	    };
	  },
	  estimateIsoDate(calendarDate) {
	    const {
	      year
	    } = this.adjustCalendarDate(calendarDate);
	    return {
	      year: MathFloor(year * this.DAYS_PER_ISLAMIC_YEAR / this.DAYS_PER_ISO_YEAR) + 622,
	      month: 1,
	      day: 1
	    };
	  }
	});
	const helperPersian = ObjectAssign$2({}, nonIsoHelperBase, {
	  id: 'persian',
	  calendarType: 'solar',
	  inLeapYear(calendarDate, cache) {
	    // If the last month has 30 days, it's a leap year.
	    return this.daysInMonth({
	      year: calendarDate.year,
	      month: 12,
	      day: 1
	    }, cache) === 30;
	  },
	  monthsInYear(/* calendarYear, cache */
	  ) {
	    return 12;
	  },
	  minimumMonthLength(calendarDate) {
	    const {
	      month
	    } = calendarDate;
	    if (month === 12) return 29;
	    return month <= 6 ? 31 : 30;
	  },
	  maximumMonthLength(calendarDate) {
	    const {
	      month
	    } = calendarDate;
	    if (month === 12) return 30;
	    return month <= 6 ? 31 : 30;
	  },
	  constantEra: 'ap',
	  estimateIsoDate(calendarDate) {
	    const {
	      year
	    } = this.adjustCalendarDate(calendarDate);
	    return {
	      year: year + 621,
	      month: 1,
	      day: 1
	    };
	  }
	});
	const helperIndian = ObjectAssign$2({}, nonIsoHelperBase, {
	  id: 'indian',
	  calendarType: 'solar',
	  inLeapYear(calendarDate /*, cache*/) {
	    // From https://en.wikipedia.org/wiki/Indian_national_calendar:
	    // Years are counted in the Saka era, which starts its year 0 in the year 78
	    // of the Common Era. To determine leap years, add 78 to the Saka year – if
	    // the result is a leap year in the Gregorian calendar, then the Saka year
	    // is a leap year as well.
	    return isGregorianLeapYear(calendarDate.year + 78);
	  },
	  monthsInYear(/* calendarYear, cache */
	  ) {
	    return 12;
	  },
	  minimumMonthLength(calendarDate) {
	    return this.getMonthInfo(calendarDate).length;
	  },
	  maximumMonthLength(calendarDate) {
	    return this.getMonthInfo(calendarDate).length;
	  },
	  constantEra: 'saka',
	  // Indian months always start at the same well-known Gregorian month and
	  // day. So this conversion is easy and fast. See
	  // https://en.wikipedia.org/wiki/Indian_national_calendar
	  months: {
	    1: {
	      length: 30,
	      month: 3,
	      day: 22,
	      leap: {
	        length: 31,
	        month: 3,
	        day: 21
	      }
	    },
	    2: {
	      length: 31,
	      month: 4,
	      day: 21
	    },
	    3: {
	      length: 31,
	      month: 5,
	      day: 22
	    },
	    4: {
	      length: 31,
	      month: 6,
	      day: 22
	    },
	    5: {
	      length: 31,
	      month: 7,
	      day: 23
	    },
	    6: {
	      length: 31,
	      month: 8,
	      day: 23
	    },
	    7: {
	      length: 30,
	      month: 9,
	      day: 23
	    },
	    8: {
	      length: 30,
	      month: 10,
	      day: 23
	    },
	    9: {
	      length: 30,
	      month: 11,
	      day: 22
	    },
	    10: {
	      length: 30,
	      month: 12,
	      day: 22
	    },
	    11: {
	      length: 30,
	      month: 1,
	      nextYear: true,
	      day: 21
	    },
	    12: {
	      length: 30,
	      month: 2,
	      nextYear: true,
	      day: 20
	    }
	  },
	  getMonthInfo(calendarDate) {
	    const {
	      month
	    } = calendarDate;
	    let monthInfo = this.months[month];
	    if (monthInfo === undefined) throw new RangeError(`Invalid month: ${month}`);
	    if (this.inLeapYear(calendarDate) && monthInfo.leap) monthInfo = monthInfo.leap;
	    return monthInfo;
	  },
	  estimateIsoDate(calendarDate) {
	    // FYI, this "estimate" is always the exact ISO date, which makes the Indian
	    // calendar fast!
	    calendarDate = this.adjustCalendarDate(calendarDate);
	    const monthInfo = this.getMonthInfo(calendarDate);
	    const isoYear = calendarDate.year + 78 + (monthInfo.nextYear ? 1 : 0);
	    const isoMonth = monthInfo.month;
	    const isoDay = monthInfo.day;
	    const isoDate = AddISODate(isoYear, isoMonth, isoDay, 0, 0, 0, calendarDate.day - 1, 'constrain');
	    return isoDate;
	  },
	  // https://bugs.chromium.org/p/v8/issues/detail?id=10529 causes Intl's Indian
	  // calendar output to fail for all dates before 0001-01-01 ISO.  For example,
	  // in Node 12 0000-01-01 is calculated as 6146/12/-583 instead of 10/11/-79 as
	  // expected.
	  vulnerableToBceBug: new Date('0000-01-01T00:00Z').toLocaleDateString('en-US-u-ca-indian', {
	    timeZone: 'UTC'
	  }) !== '10/11/-79 Saka',
	  checkIcuBugs(isoDate) {
	    if (this.vulnerableToBceBug && isoDate.year < 1) {
	      throw new RangeError(`calendar '${this.id}' is broken for ISO dates before 0001-01-01` + ' (see https://bugs.chromium.org/p/v8/issues/detail?id=10529)');
	    }
	  }
	});

	/**
	 * This function adds additional metadata that makes it easier to work with
	 * eras. Note that it mutates and normalizes the original era objects, which is
	 * OK because this is non-observable, internal-only metadata.
	 *
	 *  interface Era {
	 *   /** name of the era
	 *   name: string;
	 *
	 *   // alternate name of the era used in old versions of ICU data
	 *   // format is `era{n}` where n is the zero-based index of the era
	 *   // with the oldest era being 0.
	 *   genericName: string;
	 *
	 *   // Signed calendar year where this era begins. Will be 1 (or 0 for zero-based
	 *   // eras) for the anchor era assuming that `year` numbering starts at the
	 *   // beginning of the anchor era, which is true for all ICU calendars except
	 *   // Japanese. For input, the month and day are optional. If an era starts
	 *   // mid-year then a calendar month and day are included.
	 *   // Otherwise `{ month: 1, day: 1 }` is assumed.
	 *   anchorEpoch: { year: number; month: number; day: number };
	 *
	 *   // ISO date of the first day of this era
	 *   isoEpoch: { year: number; month: number; day: number };
	 *
	 *   // If present, then this era counts years backwards like BC
	 *   // and this property points to the forward era. This must be
	 *   // the last (oldest) era in the array.
	 *   reverseOf?: Era;
	 *
	 *   // If true, the era's years are 0-based. If omitted or false,
	 *   // then the era's years are 1-based.
	 *   hasYearZero?: boolean;
	 *
	 *   // Override if this era is the anchor. Not normally used because
	 *   // anchor eras are inferred.
	 *   isAnchor?: boolean;
	 * }
	 * ```
	 * */
	function adjustEras(eras) {
	  if (eras.length === 0) {
	    throw new RangeError('Invalid era data: eras are required');
	  }
	  if (eras.length === 1 && eras[0].reverseOf) {
	    throw new RangeError('Invalid era data: anchor era cannot count years backwards');
	  }
	  if (eras.length === 1 && !eras[0].name) {
	    throw new RangeError('Invalid era data: at least one named era is required');
	  }
	  if (eras.filter(e => e.reverseOf != null).length > 1) {
	    throw new RangeError('Invalid era data: only one era can count years backwards');
	  }

	  // Find the "anchor era" which is the era used for (era-less) `year`. Reversed
	  // eras can never be anchors. The era without an `anchorEpoch` property is the
	  // anchor.
	  let anchorEra;
	  eras.forEach(e => {
	    if (e.isAnchor || !e.anchorEpoch && !e.reverseOf) {
	      if (anchorEra) throw new RangeError('Invalid era data: cannot have multiple anchor eras');
	      anchorEra = e;
	      e.anchorEpoch = {
	        year: e.hasYearZero ? 0 : 1
	      };
	    } else if (!e.name) {
	      throw new RangeError('If era name is blank, it must be the anchor era');
	    }
	  });

	  // If the era name is undefined, then it's an anchor that doesn't interact
	  // with eras at all. For example, Japanese `year` is always the same as ISO
	  // `year`.  So this "era" is the anchor era but isn't used for era matching.
	  // Strip it from the list that's returned.
	  eras = eras.filter(e => e.name);
	  eras.forEach(e => {
	    // Some eras are mirror images of another era e.g. B.C. is the reverse of A.D.
	    // Replace the string-valued "reverseOf" property with the actual era object
	    // that's reversed.
	    const {
	      reverseOf
	    } = e;
	    if (reverseOf) {
	      const reversedEra = eras.find(era => era.name === reverseOf);
	      if (reversedEra === undefined) throw new RangeError(`Invalid era data: unmatched reverseOf era: ${reverseOf}`);
	      e.reverseOf = reversedEra;
	      e.anchorEpoch = reversedEra.anchorEpoch;
	      e.isoEpoch = reversedEra.isoEpoch;
	    }
	    if (e.anchorEpoch.month === undefined) e.anchorEpoch.month = 1;
	    if (e.anchorEpoch.day === undefined) e.anchorEpoch.day = 1;
	  });

	  // Ensure that the latest epoch is first in the array. This lets us try to
	  // match eras in index order, with the last era getting the remaining older
	  // years. Any reverse-signed era must be at the end.
	  Call$1(ArrayPrototypeSort, eras, [(e1, e2) => {
	    if (e1.reverseOf) return 1;
	    if (e2.reverseOf) return -1;
	    if (!e1.isoEpoch || !e2.isoEpoch) throw new RangeError('Invalid era data: missing ISO epoch');
	    return e2.isoEpoch.year - e1.isoEpoch.year;
	  }]);

	  // If there's a reversed era, then the one before it must be the era that's
	  // being reversed.
	  const lastEraReversed = eras[eras.length - 1].reverseOf;
	  if (lastEraReversed) {
	    if (lastEraReversed !== eras[eras.length - 2]) throw new RangeError('Invalid era data: invalid reverse-sign era');
	  }

	  // Finally, add a "genericName" property in the format "era{n} where `n` is
	  // zero-based index, with the oldest era being zero. This format is used by
	  // older versions of ICU data.
	  eras.forEach((e, i) => {
	    e.genericName = `era${eras.length - 1 - i}`;
	  });
	  return {
	    eras,
	    anchorEra: anchorEra || eras[0]
	  };
	}
	function isGregorianLeapYear(year) {
	  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
	}

	/** Base for all Gregorian-like calendars. */
	const makeHelperGregorian = (id, originalEras) => {
	  const {
	    eras,
	    anchorEra
	  } = adjustEras(originalEras);
	  return ObjectAssign$2({}, nonIsoHelperBase, {
	    id,
	    eras,
	    anchorEra,
	    calendarType: 'solar',
	    inLeapYear(calendarDate /*, cache */) {
	      const {
	        year
	      } = this.estimateIsoDate(calendarDate);
	      return isGregorianLeapYear(year);
	    },
	    monthsInYear(/* calendarDate */
	    ) {
	      return 12;
	    },
	    minimumMonthLength(calendarDate) {
	      const {
	        month
	      } = calendarDate;
	      if (month === 2) return this.inLeapYear(calendarDate) ? 29 : 28;
	      return [4, 6, 9, 11].indexOf(month) >= 0 ? 30 : 31;
	    },
	    maximumMonthLength(calendarDate) {
	      return this.minimumMonthLength(calendarDate);
	    },
	    /** Fill in missing parts of the (year, era, eraYear) tuple */
	    completeEraYear(calendarDate) {
	      const checkField = (name, value) => {
	        const currentValue = calendarDate[name];
	        if (currentValue != null && currentValue != value) {
	          throw new RangeError(`Input ${name} ${currentValue} doesn't match calculated value ${value}`);
	        }
	      };
	      const eraFromYear = year => {
	        let eraYear;
	        const adjustedCalendarDate = {
	          ...calendarDate,
	          year
	        };
	        const matchingEra = this.eras.find((e, i) => {
	          if (i === this.eras.length - 1) {
	            if (e.reverseOf) {
	              // This is a reverse-sign era (like BCE) which must be the oldest
	              // era. Count years backwards.
	              if (year > 0) throw new RangeError(`Signed year ${year} is invalid for era ${e.name}`);
	              eraYear = e.anchorEpoch.year - year;
	              return true;
	            }
	            // last era always gets all "leftover" (older than epoch) years,
	            // so no need for a comparison like below.
	            eraYear = year - e.anchorEpoch.year + (e.hasYearZero ? 0 : 1);
	            return true;
	          }
	          const comparison = nonIsoHelperBase.compareCalendarDates(adjustedCalendarDate, e.anchorEpoch);
	          if (comparison >= 0) {
	            eraYear = year - e.anchorEpoch.year + (e.hasYearZero ? 0 : 1);
	            return true;
	          }
	          return false;
	        });
	        if (!matchingEra) throw new RangeError(`Year ${year} was not matched by any era`);
	        return {
	          eraYear,
	          era: matchingEra.name
	        };
	      };
	      let {
	        year,
	        eraYear,
	        era
	      } = calendarDate;
	      if (year != null) {
	        ({
	          eraYear,
	          era
	        } = eraFromYear(year));
	        checkField('era', era);
	        checkField('eraYear', eraYear);
	      } else if (eraYear != null) {
	        const matchingEra = era === undefined ? undefined : this.eras.find(e => e.name === era || e.genericName === era);
	        if (!matchingEra) throw new RangeError(`Era ${era} (ISO year ${eraYear}) was not matched by any era`);
	        if (eraYear < 1 && matchingEra.reverseOf) {
	          throw new RangeError(`Years in ${era} era must be positive, not ${year}`);
	        }
	        if (matchingEra.reverseOf) {
	          year = matchingEra.anchorEpoch.year - eraYear;
	        } else {
	          year = eraYear + matchingEra.anchorEpoch.year - (matchingEra.hasYearZero ? 0 : 1);
	        }
	        checkField('year', year);
	        // We'll accept dates where the month/day is earlier than the start of
	        // the era or after its end as long as it's in the same year. If that
	        // happens, we'll adjust the era/eraYear pair to be the correct era for
	        // the `year`.
	        ({
	          eraYear,
	          era
	        } = eraFromYear(year));
	      } else {
	        throw new RangeError('Either `year` or `eraYear` and `era` are required');
	      }
	      return {
	        ...calendarDate,
	        year,
	        eraYear,
	        era
	      };
	    },
	    adjustCalendarDate(calendarDate, cache, overflow /*, fromLegacyDate = false */) {
	      // Because this is not a lunisolar calendar, it's safe to convert monthCode to a number
	      const {
	        month,
	        monthCode
	      } = calendarDate;
	      if (month === undefined) calendarDate = {
	        ...calendarDate,
	        month: monthCodeNumberPart(monthCode)
	      };
	      this.validateCalendarDate(calendarDate);
	      calendarDate = this.completeEraYear(calendarDate);
	      calendarDate = Call$1(nonIsoHelperBase.adjustCalendarDate, this, [calendarDate, cache, overflow]);
	      return calendarDate;
	    },
	    estimateIsoDate(calendarDate) {
	      calendarDate = this.adjustCalendarDate(calendarDate);
	      const {
	        year,
	        month,
	        day
	      } = calendarDate;
	      const {
	        anchorEra
	      } = this;
	      const isoYearEstimate = year + anchorEra.isoEpoch.year - (anchorEra.hasYearZero ? 0 : 1);
	      return RegulateISODate(isoYearEstimate, month, day, 'constrain');
	    }
	  });
	};

	/**
	 * Some calendars are identical to Gregorian except era and year. For these
	 * calendars, we can avoid using Intl.DateTimeFormat and just calculate the
	 * year, era, and eraYear. This is faster (because Intl.DateTimeFormat is slow
	 * and uses a huge amount of RAM), and it avoids ICU bugs like
	 * https://bugs.chromium.org/p/chromium/issues/detail?id=1173158.
	 */
	const makeHelperSameMonthDayAsGregorian = (id, originalEras) => {
	  const base = makeHelperGregorian(id, originalEras);
	  return ObjectAssign$2(base, {
	    isoToCalendarDate(isoDate) {
	      // Month and day are same as ISO, so bypass Intl.DateTimeFormat and
	      // calculate the year, era, and eraYear here.
	      const {
	        year: isoYear,
	        month,
	        day
	      } = isoDate;
	      const monthCode = buildMonthCode(month);
	      const year = isoYear - this.anchorEra.isoEpoch.year + 1;
	      return this.completeEraYear({
	        year,
	        month,
	        monthCode,
	        day
	      });
	    }
	  });
	};
	const makeHelperOrthodox = (id, originalEras) => {
	  const base = makeHelperGregorian(id, originalEras);
	  return ObjectAssign$2(base, {
	    inLeapYear(calendarDate /*, cache */) {
	      // Leap years happen one year before the Julian leap year. Note that this
	      // calendar is based on the Julian calendar which has a leap year every 4
	      // years, unlike the Gregorian calendar which doesn't have leap years on
	      // years divisible by 100 except years divisible by 400.
	      //
	      // Note that we're assuming that leap years in before-epoch times match
	      // how leap years are defined now. This is probably not accurate but I'm
	      // not sure how better to do it.
	      const {
	        year
	      } = calendarDate;
	      return (year + 1) % 4 === 0;
	    },
	    monthsInYear(/* calendarDate */
	    ) {
	      return 13;
	    },
	    minimumMonthLength(calendarDate) {
	      const {
	        month
	      } = calendarDate;
	      // Ethiopian/Coptic calendars have 12 30-day months and an extra 5-6 day 13th month.
	      if (month === 13) return this.inLeapYear(calendarDate) ? 6 : 5;
	      return 30;
	    },
	    maximumMonthLength(calendarDate) {
	      return this.minimumMonthLength(calendarDate);
	    }
	  });
	};

	// `coptic` and `ethiopic` calendars are very similar to `ethioaa` calendar,
	// with the following differences:
	// - Coptic uses BCE-like positive numbers for years before its epoch (the other
	//   two use negative year numbers before epoch)
	// - Coptic has a different epoch date
	// - Ethiopic has an additional second era that starts at the same date as the
	//   zero era of ethioaa.
	const helperEthioaa = makeHelperOrthodox('ethioaa', [{
	  name: 'era0',
	  isoEpoch: {
	    year: -5492,
	    month: 7,
	    day: 17
	  }
	}]);
	const helperCoptic = makeHelperOrthodox('coptic', [{
	  name: 'era1',
	  isoEpoch: {
	    year: 284,
	    month: 8,
	    day: 29
	  }
	}, {
	  name: 'era0',
	  reverseOf: 'era1'
	}]);
	// Anchor is currently the older era to match ethioaa, but should it be the newer era?
	// See https://github.com/tc39/ecma402/issues/534 for discussion.
	const helperEthiopic = makeHelperOrthodox('ethiopic', [{
	  name: 'era0',
	  isoEpoch: {
	    year: -5492,
	    month: 7,
	    day: 17
	  }
	}, {
	  name: 'era1',
	  isoEpoch: {
	    year: 8,
	    month: 8,
	    day: 27
	  },
	  anchorEpoch: {
	    year: 5501
	  }
	}]);
	const helperRoc = ObjectAssign$2({}, makeHelperSameMonthDayAsGregorian('roc', [{
	  name: 'minguo',
	  isoEpoch: {
	    year: 1912,
	    month: 1,
	    day: 1
	  }
	}, {
	  name: 'before-roc',
	  reverseOf: 'minguo'
	}]));
	const helperBuddhist = ObjectAssign$2({}, makeHelperSameMonthDayAsGregorian('buddhist', [{
	  name: 'be',
	  hasYearZero: true,
	  isoEpoch: {
	    year: -543,
	    month: 1,
	    day: 1
	  }
	}]));
	const helperGregory = ObjectAssign$2({}, makeHelperSameMonthDayAsGregorian('gregory', [{
	  name: 'ce',
	  isoEpoch: {
	    year: 1,
	    month: 1,
	    day: 1
	  }
	}, {
	  name: 'bce',
	  reverseOf: 'ce'
	}]), {
	  reviseIntlEra(calendarDate /*, isoDate*/) {
	    let {
	      era,
	      eraYear
	    } = calendarDate;
	    // Firefox 96 introduced a bug where the `'short'` format of the era
	    // option mistakenly returns the one-letter (narrow) format instead. The
	    // code below handles either the correct or Firefox-buggy format. See
	    // https://bugzilla.mozilla.org/show_bug.cgi?id=1752253
	    if (era === 'bc' || era === 'b') era = 'bce';
	    if (era === 'ad' || era === 'a') era = 'ce';
	    return {
	      era,
	      eraYear
	    };
	  },
	  getFirstDayOfWeek() {
	    return 1;
	  },
	  getMinimalDaysInFirstWeek() {
	    return 1;
	  }
	});
	const helperJapanese = ObjectAssign$2({},
	// NOTE: Only the 5 modern eras (Meiji and later) are included. For dates
	// before Meiji 1, the `ce` and `bce` eras are used. Challenges with pre-Meiji
	// eras include:
	// - Start/end dates of older eras are not precisely defined, which is
	//   challenging given Temporal's need for precision
	// - Some era dates and/or names are disputed by historians
	// - As historical research proceeds, new eras are discovered and existing era
	//   dates are modified, leading to considerable churn which is not good for
	//   Temporal use.
	//  - The earliest era (in 645 CE) may not end up being the earliest depending
	//    on future historical scholarship
	//  - Before Meiji, Japan used a lunar (or lunisolar?) calendar but AFAIK
	//    that's not reflected in the ICU implementation.
	//
	// For more discussion: https://github.com/tc39/proposal-temporal/issues/526.
	//
	// Here's a full list of CLDR/ICU eras:
	// https://github.com/unicode-org/icu/blob/master/icu4c/source/data/locales/root.txt#L1582-L1818
	// https://github.com/unicode-org/cldr/blob/master/common/supplemental/supplementalData.xml#L4310-L4546
	//
	// NOTE: Japan started using the Gregorian calendar in 6 Meiji, replacing a
	// lunisolar calendar. So the day before January 1 of 6 Meiji (1873) was not
	// December 31, but December 2, of 5 Meiji (1872). The existing Ecma-402
	// Japanese calendar doesn't seem to take this into account, so neither do we:
	// > args = ['en-ca-u-ca-japanese', { era: 'short' }]
	// > new Date('1873-01-01T12:00').toLocaleString(...args)
	// '1 1, 6 Meiji, 12:00:00 PM'
	// > new Date('1872-12-31T12:00').toLocaleString(...args)
	// '12 31, 5 Meiji, 12:00:00 PM'
	makeHelperSameMonthDayAsGregorian('japanese', [
	// The Japanese calendar `year` is just the ISO year, because (unlike other
	// ICU calendars) there's no obvious "default era", we use the ISO year.
	{
	  name: 'reiwa',
	  isoEpoch: {
	    year: 2019,
	    month: 5,
	    day: 1
	  },
	  anchorEpoch: {
	    year: 2019,
	    month: 5,
	    day: 1
	  }
	}, {
	  name: 'heisei',
	  isoEpoch: {
	    year: 1989,
	    month: 1,
	    day: 8
	  },
	  anchorEpoch: {
	    year: 1989,
	    month: 1,
	    day: 8
	  }
	}, {
	  name: 'showa',
	  isoEpoch: {
	    year: 1926,
	    month: 12,
	    day: 25
	  },
	  anchorEpoch: {
	    year: 1926,
	    month: 12,
	    day: 25
	  }
	}, {
	  name: 'taisho',
	  isoEpoch: {
	    year: 1912,
	    month: 7,
	    day: 30
	  },
	  anchorEpoch: {
	    year: 1912,
	    month: 7,
	    day: 30
	  }
	}, {
	  name: 'meiji',
	  isoEpoch: {
	    year: 1868,
	    month: 9,
	    day: 8
	  },
	  anchorEpoch: {
	    year: 1868,
	    month: 9,
	    day: 8
	  }
	}, {
	  name: 'ce',
	  isoEpoch: {
	    year: 1,
	    month: 1,
	    day: 1
	  }
	}, {
	  name: 'bce',
	  reverseOf: 'ce'
	}]), {
	  erasBeginMidYear: true,
	  reviseIntlEra(calendarDate, isoDate) {
	    const {
	      era,
	      eraYear
	    } = calendarDate;
	    const {
	      year: isoYear
	    } = isoDate;
	    if (this.eras.find(e => e.name === era)) return {
	      era,
	      eraYear
	    };
	    return isoYear < 1 ? {
	      era: 'bce',
	      eraYear: 1 - isoYear
	    } : {
	      era: 'ce',
	      eraYear: isoYear
	    };
	  }
	});
	const helperChinese = ObjectAssign$2({}, nonIsoHelperBase, {
	  id: 'chinese',
	  calendarType: 'lunisolar',
	  inLeapYear(calendarDate, cache) {
	    const months = this.getMonthList(calendarDate.year, cache);
	    return ObjectEntries(months).length === 13;
	  },
	  monthsInYear(calendarDate, cache) {
	    return this.inLeapYear(calendarDate, cache) ? 13 : 12;
	  },
	  minimumMonthLength: (/* calendarDate */) => 29,
	  maximumMonthLength: (/* calendarDate */) => 30,
	  getMonthList(calendarYear, cache) {
	    if (calendarYear === undefined) {
	      throw new TypeError('Missing year');
	    }
	    const key = JSON.stringify({
	      func: 'getMonthList',
	      calendarYear,
	      id: this.id
	    });
	    const cached = cache.get(key);
	    if (cached) return cached;
	    const dateTimeFormat = this.getFormatter();
	    const getCalendarDate = (isoYear, daysPastFeb1) => {
	      const isoStringFeb1 = toUtcIsoDateString({
	        isoYear,
	        isoMonth: 2,
	        isoDay: 1
	      });
	      const legacyDate = new Date(isoStringFeb1);
	      // Now add the requested number of days, which may wrap to the next month.
	      legacyDate.setUTCDate(daysPastFeb1 + 1);
	      const newYearGuess = dateTimeFormat.formatToParts(legacyDate);
	      const calendarMonthString = newYearGuess.find(tv => tv.type === 'month').value;
	      const calendarDay = +newYearGuess.find(tv => tv.type === 'day').value;
	      let calendarYearToVerify = newYearGuess.find(tv => tv.type === 'relatedYear');
	      if (calendarYearToVerify !== undefined) {
	        calendarYearToVerify = +calendarYearToVerify.value;
	      } else {
	        // Node 12 has outdated ICU data that lacks the `relatedYear` field in the
	        // output of Intl.DateTimeFormat.formatToParts.
	        throw new RangeError(`Intl.DateTimeFormat.formatToParts lacks relatedYear in ${this.id} calendar. Try Node 14+ or modern browsers.`);
	      }
	      return {
	        calendarMonthString,
	        calendarDay,
	        calendarYearToVerify
	      };
	    };

	    // First, find a date close to Chinese New Year. Feb 17 will either be in
	    // the first month or near the end of the last month of the previous year.
	    let isoDaysDelta = 17;
	    let {
	      calendarMonthString,
	      calendarDay,
	      calendarYearToVerify
	    } = getCalendarDate(calendarYear, isoDaysDelta);

	    // If we didn't guess the first month correctly, add (almost in some months)
	    // a lunar month
	    if (calendarMonthString !== '1') {
	      isoDaysDelta += 29;
	      ({
	        calendarMonthString,
	        calendarDay
	      } = getCalendarDate(calendarYear, isoDaysDelta));
	    }

	    // Now back up to near the start of the first month, but not too near that
	    // off-by-one issues matter.
	    isoDaysDelta -= calendarDay - 5;
	    const result = {};
	    let monthIndex = 1;
	    let oldCalendarDay;
	    let oldMonthString;
	    let done = false;
	    do {
	      ({
	        calendarMonthString,
	        calendarDay,
	        calendarYearToVerify
	      } = getCalendarDate(calendarYear, isoDaysDelta));
	      if (oldCalendarDay) {
	        result[oldMonthString].daysInMonth = oldCalendarDay + 30 - calendarDay;
	      }
	      if (calendarYearToVerify !== calendarYear) {
	        done = true;
	      } else {
	        result[calendarMonthString] = {
	          monthIndex: monthIndex++
	        };
	        // Move to the next month. Because months are sometimes 29 days, the day of the
	        // calendar month will move forward slowly but not enough to flip over to a new
	        // month before the loop ends at 12-13 months.
	        isoDaysDelta += 30;
	      }
	      oldCalendarDay = calendarDay;
	      oldMonthString = calendarMonthString;
	    } while (!done);
	    result[oldMonthString].daysInMonth = oldCalendarDay + 30 - calendarDay;
	    cache.set(key, result);
	    return result;
	  },
	  estimateIsoDate(calendarDate) {
	    const {
	      year,
	      month
	    } = calendarDate;
	    return {
	      year,
	      month: month >= 12 ? 12 : month + 1,
	      day: 1
	    };
	  },
	  adjustCalendarDate(calendarDate, cache) {
	    let overflow = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'constrain';
	    let fromLegacyDate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
	    let {
	      year,
	      month,
	      monthExtra,
	      day,
	      monthCode,
	      eraYear
	    } = calendarDate;
	    if (fromLegacyDate) {
	      // Legacy Date output returns a string that's an integer with an optional
	      // "bis" suffix used only by the Chinese/Dangi calendar to indicate a leap
	      // month. Below we'll normalize the output.
	      year = eraYear;
	      if (monthExtra && monthExtra !== 'bis') throw new RangeError(`Unexpected leap month suffix: ${monthExtra}`);
	      const monthCode = buildMonthCode(month, monthExtra !== undefined);
	      const monthString = `${month}${monthExtra || ''}`;
	      const months = this.getMonthList(year, cache);
	      const monthInfo = months[monthString];
	      if (monthInfo === undefined) throw new RangeError(`Unmatched month ${monthString} in Chinese year ${year}`);
	      month = monthInfo.monthIndex;
	      return {
	        year,
	        month,
	        day,
	        era: undefined,
	        eraYear,
	        monthCode
	      };
	    } else {
	      // When called without input coming from legacy Date output,
	      // simply ensure that all fields are present.
	      this.validateCalendarDate(calendarDate);
	      if (year === undefined) year = eraYear;
	      if (eraYear === undefined) eraYear = year;
	      if (month === undefined) {
	        const months = this.getMonthList(year, cache);
	        let numberPart = monthCode.replace('L', 'bis').slice(1);
	        if (numberPart[0] === '0') numberPart = numberPart.slice(1);
	        let monthInfo = months[numberPart];
	        month = monthInfo && monthInfo.monthIndex;
	        // If this leap month isn't present in this year, constrain to the same
	        // day of the previous month.
	        if (month === undefined && monthCode.endsWith('L') && monthCode != 'M13L' && overflow === 'constrain') {
	          let withoutML = monthCode.slice(1, -1);
	          if (withoutML[0] === '0') withoutML = withoutML.slice(1);
	          monthInfo = months[withoutML];
	          if (monthInfo) {
	            month = monthInfo.monthIndex;
	            monthCode = buildMonthCode(withoutML);
	          }
	        }
	        if (month === undefined) {
	          throw new RangeError(`Unmatched month ${monthCode} in Chinese year ${year}`);
	        }
	      } else if (monthCode === undefined) {
	        const months = this.getMonthList(year, cache);
	        const monthEntries = ObjectEntries(months);
	        const largestMonth = monthEntries.length;
	        if (overflow === 'reject') {
	          RejectToRange(month, 1, largestMonth);
	          RejectToRange(day, 1, this.maximumMonthLength());
	        } else {
	          month = ConstrainToRange(month, 1, largestMonth);
	          day = ConstrainToRange(day, 1, this.maximumMonthLength());
	        }
	        const matchingMonthEntry = monthEntries.find(_ref13 => {
	          let [, v] = _ref13;
	          return v.monthIndex === month;
	        });
	        if (matchingMonthEntry === undefined) {
	          throw new RangeError(`Invalid month ${month} in Chinese year ${year}`);
	        }
	        monthCode = buildMonthCode(matchingMonthEntry[0].replace('bis', ''), matchingMonthEntry[0].indexOf('bis') !== -1);
	      } else {
	        // Both month and monthCode are present. Make sure they don't conflict.
	        const months = this.getMonthList(year, cache);
	        let numberPart = monthCode.replace('L', 'bis').slice(1);
	        if (numberPart[0] === '0') numberPart = numberPart.slice(1);
	        const monthInfo = months[numberPart];
	        if (!monthInfo) throw new RangeError(`Unmatched monthCode ${monthCode} in Chinese year ${year}`);
	        if (month !== monthInfo.monthIndex) {
	          throw new RangeError(`monthCode ${monthCode} doesn't correspond to month ${month} in Chinese year ${year}`);
	        }
	      }
	      return {
	        ...calendarDate,
	        year,
	        eraYear,
	        month,
	        monthCode,
	        day
	      };
	    }
	  },
	  // All built-in calendars except Chinese/Dangi and Hebrew use an era
	  hasEra: false
	});

	// Dangi (Korean) calendar has same implementation as Chinese
	const helperDangi = ObjectAssign$2({}, {
	  ...helperChinese,
	  id: 'dangi'
	});

	/**
	 * Common implementation of all non-ISO calendars.
	 * Per-calendar id and logic live in `id` and `helper` properties attached later.
	 * This split allowed an easy separation between code that was similar between
	 * ISO and non-ISO implementations vs. code that was very different.
	 */
	const nonIsoGeneralImpl = {
	  extraFields() {
	    let type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'date';
	    if (type === 'month-day') return [];
	    return ['era', 'eraYear'];
	  },
	  dateFromFields(fields, overflow) {
	    const cache = new OneObjectCache();
	    const result = this.helper.calendarToIsoDate(fields, overflow, cache);
	    cache.setObject(result);
	    return result;
	  },
	  yearMonthFromFields(fields, overflow) {
	    const cache = new OneObjectCache();
	    const result = this.helper.calendarToIsoDate({
	      ...fields,
	      day: 1
	    }, overflow, cache);
	    cache.setObject(result);
	    return result;
	  },
	  monthDayFromFields(fields, overflow) {
	    const cache = new OneObjectCache();
	    // For lunisolar calendars, either `monthCode` or `year` must be provided
	    // because `month` is ambiguous without a year or a code.
	    const result = this.helper.monthDayFromFields(fields, overflow, cache);
	    // result.year is a reference year where this month/day exists in this calendar
	    cache.setObject(result);
	    return result;
	  },
	  fieldKeysToIgnore(keys) {
	    const result = new OriginalSet();
	    for (let ix = 0; ix < keys.length; ix++) {
	      const key = keys[ix];
	      Call$1(SetPrototypeAdd, result, [key]);
	      switch (key) {
	        case 'era':
	          Call$1(SetPrototypeAdd, result, ['eraYear']);
	          Call$1(SetPrototypeAdd, result, ['year']);
	          break;
	        case 'eraYear':
	          Call$1(SetPrototypeAdd, result, ['era']);
	          Call$1(SetPrototypeAdd, result, ['year']);
	          break;
	        case 'year':
	          Call$1(SetPrototypeAdd, result, ['era']);
	          Call$1(SetPrototypeAdd, result, ['eraYear']);
	          break;
	        case 'month':
	          Call$1(SetPrototypeAdd, result, ['monthCode']);
	          // See https://github.com/tc39/proposal-temporal/issues/1784
	          if (this.helper.erasBeginMidYear) {
	            Call$1(SetPrototypeAdd, result, ['era']);
	            Call$1(SetPrototypeAdd, result, ['eraYear']);
	          }
	          break;
	        case 'monthCode':
	          Call$1(SetPrototypeAdd, result, ['month']);
	          if (this.helper.erasBeginMidYear) {
	            Call$1(SetPrototypeAdd, result, ['era']);
	            Call$1(SetPrototypeAdd, result, ['eraYear']);
	          }
	          break;
	        case 'day':
	          if (this.helper.erasBeginMidYear) {
	            Call$1(SetPrototypeAdd, result, ['era']);
	            Call$1(SetPrototypeAdd, result, ['eraYear']);
	          }
	          break;
	      }
	    }
	    return arrayFromSet(result);
	  },
	  dateAdd(isoDate, _ref14, overflow) {
	    let {
	      years,
	      months,
	      weeks,
	      days
	    } = _ref14;
	    const cache = OneObjectCache.getCacheForObject(isoDate);
	    const calendarDate = this.helper.isoToCalendarDate(isoDate, cache);
	    const added = this.helper.addCalendar(calendarDate, {
	      years,
	      months,
	      weeks,
	      days
	    }, overflow, cache);
	    const isoAdded = this.helper.calendarToIsoDate(added, 'constrain', cache);
	    // The new object's cache starts with the cache of the old object
	    const newCache = new OneObjectCache(cache);
	    newCache.setObject(isoAdded);
	    return isoAdded;
	  },
	  dateUntil(one, two, largestUnit) {
	    const cacheOne = OneObjectCache.getCacheForObject(one);
	    const cacheTwo = OneObjectCache.getCacheForObject(two);
	    const calendarOne = this.helper.isoToCalendarDate(one, cacheOne);
	    const calendarTwo = this.helper.isoToCalendarDate(two, cacheTwo);
	    const result = this.helper.untilCalendar(calendarOne, calendarTwo, largestUnit, cacheOne);
	    return result;
	  },
	  year(date) {
	    const cache = OneObjectCache.getCacheForObject(date);
	    const calendarDate = this.helper.isoToCalendarDate(date, cache);
	    return calendarDate.year;
	  },
	  month(date) {
	    const cache = OneObjectCache.getCacheForObject(date);
	    const calendarDate = this.helper.isoToCalendarDate(date, cache);
	    return calendarDate.month;
	  },
	  day(date) {
	    const cache = OneObjectCache.getCacheForObject(date);
	    const calendarDate = this.helper.isoToCalendarDate(date, cache);
	    return calendarDate.day;
	  },
	  era(date) {
	    if (!this.helper.hasEra) return undefined;
	    const cache = OneObjectCache.getCacheForObject(date);
	    const calendarDate = this.helper.isoToCalendarDate(date, cache);
	    return calendarDate.era;
	  },
	  eraYear(date) {
	    if (!this.helper.hasEra) return undefined;
	    const cache = OneObjectCache.getCacheForObject(date);
	    const calendarDate = this.helper.isoToCalendarDate(date, cache);
	    return calendarDate.eraYear;
	  },
	  monthCode(date) {
	    const cache = OneObjectCache.getCacheForObject(date);
	    const calendarDate = this.helper.isoToCalendarDate(date, cache);
	    return calendarDate.monthCode;
	  },
	  dayOfWeek(isoDate) {
	    return impl['iso8601'].dayOfWeek(isoDate);
	  },
	  dayOfYear(isoDate) {
	    const cache = OneObjectCache.getCacheForObject(isoDate);
	    const calendarDate = this.helper.isoToCalendarDate(isoDate, cache);
	    const startOfYear = this.helper.startOfCalendarYear(calendarDate);
	    const diffDays = this.helper.calendarDaysUntil(startOfYear, calendarDate, cache);
	    return diffDays + 1;
	  },
	  daysInWeek(date) {
	    return impl['iso8601'].daysInWeek(date);
	  },
	  daysInMonth(date) {
	    const cache = OneObjectCache.getCacheForObject(date);
	    const calendarDate = this.helper.isoToCalendarDate(date, cache);

	    // Easy case: if the helper knows the length without any heavy calculation.
	    const max = this.helper.maximumMonthLength(calendarDate);
	    const min = this.helper.minimumMonthLength(calendarDate);
	    if (max === min) return max;

	    // The harder case is where months vary every year, e.g. islamic calendars.
	    // Find the answer by calculating the difference in days between the first
	    // day of the current month and the first day of the next month.
	    const startOfMonthCalendar = this.helper.startOfCalendarMonth(calendarDate);
	    const startOfNextMonthCalendar = this.helper.addMonthsCalendar(startOfMonthCalendar, 1, 'constrain', cache);
	    const result = this.helper.calendarDaysUntil(startOfMonthCalendar, startOfNextMonthCalendar, cache);
	    return result;
	  },
	  daysInYear(isoDate) {
	    const cache = OneObjectCache.getCacheForObject(isoDate);
	    const calendarDate = this.helper.isoToCalendarDate(isoDate, cache);
	    const startOfYearCalendar = this.helper.startOfCalendarYear(calendarDate);
	    const startOfNextYearCalendar = this.helper.addCalendar(startOfYearCalendar, {
	      years: 1
	    }, 'constrain', cache);
	    const result = this.helper.calendarDaysUntil(startOfYearCalendar, startOfNextYearCalendar, cache);
	    return result;
	  },
	  monthsInYear(date) {
	    const cache = OneObjectCache.getCacheForObject(date);
	    const calendarDate = this.helper.isoToCalendarDate(date, cache);
	    const result = this.helper.monthsInYear(calendarDate, cache);
	    return result;
	  },
	  inLeapYear(date) {
	    const cache = OneObjectCache.getCacheForObject(date);
	    const calendarDate = this.helper.isoToCalendarDate(date, cache);
	    const result = this.helper.inLeapYear(calendarDate, cache);
	    return result;
	  }
	};
	impl['hebrew'] = ObjectAssign$2({}, nonIsoGeneralImpl, {
	  helper: helperHebrew
	});
	impl['islamic'] = ObjectAssign$2({}, nonIsoGeneralImpl, {
	  helper: helperIslamic
	});
	['islamic-umalqura', 'islamic-tbla', 'islamic-civil', 'islamic-rgsa', 'islamicc'].forEach(id => {
	  impl[id] = ObjectAssign$2({}, nonIsoGeneralImpl, {
	    helper: {
	      ...helperIslamic,
	      id
	    }
	  });
	});
	impl['persian'] = ObjectAssign$2({}, nonIsoGeneralImpl, {
	  helper: helperPersian
	});
	impl['ethiopic'] = ObjectAssign$2({}, nonIsoGeneralImpl, {
	  helper: helperEthiopic
	});
	impl['ethioaa'] = ObjectAssign$2({}, nonIsoGeneralImpl, {
	  helper: helperEthioaa
	});
	impl['coptic'] = ObjectAssign$2({}, nonIsoGeneralImpl, {
	  helper: helperCoptic
	});
	impl['chinese'] = ObjectAssign$2({}, nonIsoGeneralImpl, {
	  helper: helperChinese
	});
	impl['dangi'] = ObjectAssign$2({}, nonIsoGeneralImpl, {
	  helper: helperDangi
	});
	impl['roc'] = ObjectAssign$2({}, nonIsoGeneralImpl, {
	  helper: helperRoc
	});
	impl['indian'] = ObjectAssign$2({}, nonIsoGeneralImpl, {
	  helper: helperIndian
	});
	impl['buddhist'] = ObjectAssign$2({}, nonIsoGeneralImpl, {
	  helper: helperBuddhist
	});
	impl['japanese'] = ObjectAssign$2({}, nonIsoGeneralImpl, {
	  helper: helperJapanese
	});
	impl['gregory'] = ObjectAssign$2({}, nonIsoGeneralImpl, {
	  helper: helperGregory
	});
	function calendarImpl(calendar) {
	  return impl[calendar];
	}
	// Probably not what the intrinsics mechanism was intended for, but view this as
	// an export of calendarImpl while avoiding circular dependencies
	DefineIntrinsic('calendarImpl', calendarImpl);
	DefineIntrinsic('calendarDateWeekOfYear', calendarDateWeekOfYear);

	const DATE = Symbol('date');
	const YM = Symbol('ym');
	const MD = Symbol('md');
	const TIME = Symbol('time');
	const DATETIME = Symbol('datetime');
	const INST = Symbol('instant');
	const ORIGINAL = Symbol('original');
	const TZ_CANONICAL = Symbol('timezone-canonical');
	const TZ_ORIGINAL = Symbol('timezone-original');
	const CAL_ID = Symbol('calendar-id');
	const LOCALE = Symbol('locale');
	const OPTIONS = Symbol('options');
	const IntlDateTimeFormat = globalThis.Intl.DateTimeFormat;
	const ObjectAssign$1 = Object.assign;
	const ObjectCreate$5 = Object.create;
	const ObjectDefineProperty = Object.defineProperty;

	// Construction of built-in Intl.DateTimeFormat objects is sloooooow,
	// so we'll only create those instances when we need them.
	// See https://bugs.chromium.org/p/v8/issues/detail?id=6528
	function getSlotLazy(obj, slot) {
	  let val = GetSlot(obj, slot);
	  if (typeof val === 'function') {
	    val = new IntlDateTimeFormat(GetSlot(obj, LOCALE), val(GetSlot(obj, OPTIONS)));
	    SetSlot(obj, slot, val);
	  }
	  return val;
	}
	function createDateTimeFormat(dtf, locale, options) {
	  const hasOptions = typeof options !== 'undefined';
	  if (hasOptions) {
	    // Read all the options in the expected order and copy them to a
	    // null-prototype object with which we can do further operations
	    // unobservably
	    const props = ['localeMatcher', 'calendar', 'numberingSystem', 'hour12', 'hourCycle', 'timeZone', 'weekday', 'era', 'year', 'month', 'day', 'dayPeriod', 'hour', 'minute', 'second', 'fractionalSecondDigits', 'timeZoneName', 'formatMatcher', 'dateStyle', 'timeStyle'];
	    options = ToObject$2(options);
	    const newOptions = ObjectCreate$5(null);
	    for (const prop of props) {
	      if (HasOwnProperty$1(options, prop)) {
	        newOptions[prop] = options[prop];
	      }
	    }
	    options = newOptions;
	  } else {
	    options = ObjectCreate$5(null);
	  }
	  const original = new IntlDateTimeFormat(locale, options);
	  const ro = original.resolvedOptions();
	  CreateSlots(dtf);

	  // DateTimeFormat instances are very expensive to create. Therefore, they will
	  // be lazily created only when needed, using the locale and options provided.
	  // But it's possible for callers to mutate those inputs before lazy creation
	  // happens. For this reason, we clone the inputs instead of caching the
	  // original objects. To avoid the complexity of deep cloning any inputs that
	  // are themselves objects (e.g. the locales array, or options property values
	  // that will be coerced to strings), we rely on `resolvedOptions()` to do the
	  // coercion and cloning for us. Unfortunately, we can't just use the resolved
	  // options as-is because our options-amending logic adds additional fields if
	  // the user doesn't supply any unit fields like year, month, day, hour, etc.
	  // Therefore, we limit the properties in the clone to properties that were
	  // present in the original input.
	  if (hasOptions) {
	    const clonedResolved = ObjectAssign$1(ObjectCreate$5(null), ro);
	    for (const prop in clonedResolved) {
	      if (!HasOwnProperty$1(options, prop)) delete clonedResolved[prop];
	    }
	    SetSlot(dtf, OPTIONS, clonedResolved);
	  } else {
	    SetSlot(dtf, OPTIONS, options);
	  }
	  SetSlot(dtf, LOCALE, ro.locale);
	  SetSlot(dtf, ORIGINAL, original);
	  SetSlot(dtf, TZ_CANONICAL, ro.timeZone);
	  SetSlot(dtf, CAL_ID, ro.calendar);
	  SetSlot(dtf, DATE, dateAmend);
	  SetSlot(dtf, YM, yearMonthAmend);
	  SetSlot(dtf, MD, monthDayAmend);
	  SetSlot(dtf, TIME, timeAmend);
	  SetSlot(dtf, DATETIME, datetimeAmend);
	  SetSlot(dtf, INST, instantAmend);

	  // Save the original time zone, for a few reasons:
	  // - Clearer error messages
	  // - More clearly follows the spec for InitializeDateTimeFormat
	  // - Because it follows the spec more closely, will make it easier to integrate
	  //   support of offset strings and other potential changes like proposal-canonical-tz.
	  const timeZoneOption = hasOptions ? options.timeZone : undefined;
	  if (timeZoneOption === undefined) {
	    SetSlot(dtf, TZ_ORIGINAL, ro.timeZone);
	  } else {
	    const id = ToString$1(timeZoneOption);
	    if (IsOffsetTimeZoneIdentifier(id)) {
	      // Note: https://github.com/tc39/ecma402/issues/683 will remove this
	      throw new RangeError('Intl.DateTimeFormat does not currently support offset time zones');
	    }
	    const record = GetAvailableNamedTimeZoneIdentifier(id);
	    if (!record) throw new RangeError(`Intl.DateTimeFormat formats built-in time zones, not ${id}`);
	    SetSlot(dtf, TZ_ORIGINAL, record.identifier);
	  }
	}
	class DateTimeFormatImpl {
	  constructor() {
	    let locales = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    createDateTimeFormat(this, locales, options);
	  }
	  get format() {
	    var _this = this;
	    if (!HasSlot(this, ORIGINAL)) throw new TypeError('invalid receiver');
	    const boundFormat = function (datetime) {
	      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }
	      return Call$1(format, _this, [datetime, ...args]);
	    };
	    ObjectDefineProperty(boundFormat, 'name', {
	      value: '',
	      enumerable: false,
	      writable: false,
	      configurable: true
	    });
	    return boundFormat;
	  }
	  formatRange(a, b) {
	    if (!HasSlot(this, ORIGINAL)) throw new TypeError('invalid receiver');
	    return Call$1(formatRange, this, [a, b]);
	  }
	  formatToParts(datetime) {
	    if (!HasSlot(this, ORIGINAL)) throw new TypeError('invalid receiver');
	    for (var _len2 = arguments.length, rest = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	      rest[_key2 - 1] = arguments[_key2];
	    }
	    return Call$1(formatToParts, this, [datetime, ...rest]);
	  }
	  formatRangeToParts(a, b) {
	    if (!HasSlot(this, ORIGINAL)) throw new TypeError('invalid receiver');
	    return Call$1(formatRangeToParts, this, [a, b]);
	  }
	  resolvedOptions() {
	    if (!HasSlot(this, ORIGINAL)) throw new TypeError('invalid receiver');
	    return Call$1(resolvedOptions, this, []);
	  }
	}
	if (!('formatToParts' in IntlDateTimeFormat.prototype)) {
	  delete DateTimeFormatImpl.prototype.formatToParts;
	}
	if (!('formatRangeToParts' in IntlDateTimeFormat.prototype)) {
	  delete DateTimeFormatImpl.prototype.formatRangeToParts;
	}

	// A non-class constructor is needed because Intl.DateTimeFormat must be able to
	// be called without 'new'
	function DateTimeFormat() {
	  let locales = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	  return new DateTimeFormatImpl(locales, options);
	}
	DateTimeFormatImpl.prototype.constructor = DateTimeFormat;
	ObjectDefineProperty(DateTimeFormat, 'prototype', {
	  value: DateTimeFormatImpl.prototype,
	  writable: false,
	  enumerable: false,
	  configurable: false
	});
	DateTimeFormat.supportedLocalesOf = IntlDateTimeFormat.supportedLocalesOf;
	MakeIntrinsicClass(DateTimeFormat, 'Intl.DateTimeFormat');
	function resolvedOptions() {
	  const resolved = GetSlot(this, ORIGINAL).resolvedOptions();
	  resolved.timeZone = GetSlot(this, TZ_ORIGINAL);
	  return resolved;
	}
	function epochNsToMs(epochNs) {
	  return BigIntFloorDiv(epochNs, 1e6).toJSNumber();
	}
	function format(datetime) {
	  let {
	    epochNs,
	    formatter
	  } = extractOverrides(datetime, this);
	  if (formatter) return formatter.format(epochNsToMs(epochNs));
	  for (var _len3 = arguments.length, rest = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
	    rest[_key3 - 1] = arguments[_key3];
	  }
	  return GetSlot(this, ORIGINAL).format(datetime, ...rest);
	}
	function formatToParts(datetime) {
	  let {
	    epochNs,
	    formatter
	  } = extractOverrides(datetime, this);
	  if (formatter) return formatter.formatToParts(epochNsToMs(epochNs));
	  for (var _len4 = arguments.length, rest = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
	    rest[_key4 - 1] = arguments[_key4];
	  }
	  return GetSlot(this, ORIGINAL).formatToParts(datetime, ...rest);
	}
	function formatRange(a, b) {
	  if (isTemporalObject(a) || isTemporalObject(b)) {
	    if (!sameTemporalType(a, b)) {
	      throw new TypeError('Intl.DateTimeFormat.formatRange accepts two values of the same type');
	    }
	    const {
	      epochNs: aa,
	      formatter: aformatter
	    } = extractOverrides(a, this);
	    const {
	      epochNs: bb,
	      formatter: bformatter
	    } = extractOverrides(b, this);
	    if (aformatter) {
	      if (bformatter !== aformatter) {
	        throw new Error('assertion failed: formatters for same Temporal type should be identical');
	      }
	      return aformatter.formatRange(epochNsToMs(aa), epochNsToMs(bb));
	    }
	  }
	  return GetSlot(this, ORIGINAL).formatRange(a, b);
	}
	function formatRangeToParts(a, b) {
	  if (isTemporalObject(a) || isTemporalObject(b)) {
	    if (!sameTemporalType(a, b)) {
	      throw new TypeError('Intl.DateTimeFormat.formatRangeToParts accepts two values of the same type');
	    }
	    const {
	      epochNs: aa,
	      formatter: aformatter
	    } = extractOverrides(a, this);
	    const {
	      epochNs: bb,
	      formatter: bformatter
	    } = extractOverrides(b, this);
	    if (aformatter) {
	      if (bformatter !== aformatter) {
	        throw new Error('assertion failed: formatters for same Temporal type should be identical');
	      }
	      return aformatter.formatRangeToParts(epochNsToMs(aa), epochNsToMs(bb));
	    }
	  }
	  return GetSlot(this, ORIGINAL).formatRangeToParts(a, b);
	}
	function amend() {
	  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	  let amended = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  options = ObjectAssign$1({}, options);
	  for (let opt of ['year', 'month', 'day', 'hour', 'minute', 'second', 'weekday', 'dayPeriod', 'timeZoneName', 'dateStyle', 'timeStyle']) {
	    options[opt] = opt in amended ? amended[opt] : options[opt];
	    if (options[opt] === false || options[opt] === undefined) delete options[opt];
	  }
	  return options;
	}
	function timeAmend(options) {
	  options = amend(options, {
	    year: false,
	    month: false,
	    day: false,
	    weekday: false,
	    timeZoneName: false,
	    dateStyle: false
	  });
	  if (!hasTimeOptions(options)) {
	    options = ObjectAssign$1({}, options, {
	      hour: 'numeric',
	      minute: 'numeric',
	      second: 'numeric'
	    });
	  }
	  return options;
	}
	function yearMonthAmend(options) {
	  // Try to fake what dateStyle should do for dates without a day. This is not
	  // accurate for locales that always print the era
	  const dateStyleHacks = {
	    short: {
	      year: '2-digit',
	      month: 'numeric'
	    },
	    medium: {
	      year: 'numeric',
	      month: 'short'
	    },
	    long: {
	      year: 'numeric',
	      month: 'long'
	    },
	    full: {
	      year: 'numeric',
	      month: 'long'
	    }
	  };
	  options = amend(options, {
	    day: false,
	    hour: false,
	    minute: false,
	    second: false,
	    weekday: false,
	    dayPeriod: false,
	    timeZoneName: false,
	    timeStyle: false
	  });
	  if ('dateStyle' in options) {
	    const style = options.dateStyle;
	    delete options.dateStyle;
	    Object.assign(options, dateStyleHacks[style]);
	  }
	  if (!('year' in options || 'month' in options)) {
	    options = ObjectAssign$1(options, {
	      year: 'numeric',
	      month: 'numeric'
	    });
	  }
	  return options;
	}
	function monthDayAmend(options) {
	  // Try to fake what dateStyle should do for dates without a day
	  const dateStyleHacks = {
	    short: {
	      month: 'numeric',
	      day: 'numeric'
	    },
	    medium: {
	      month: 'short',
	      day: 'numeric'
	    },
	    long: {
	      month: 'long',
	      day: 'numeric'
	    },
	    full: {
	      month: 'long',
	      day: 'numeric'
	    }
	  };
	  options = amend(options, {
	    year: false,
	    hour: false,
	    minute: false,
	    second: false,
	    weekday: false,
	    dayPeriod: false,
	    timeZoneName: false,
	    timeStyle: false
	  });
	  if ('dateStyle' in options) {
	    const style = options.dateStyle;
	    delete options.dateStyle;
	    Object.assign(options, dateStyleHacks[style]);
	  }
	  if (!('month' in options || 'day' in options)) {
	    options = ObjectAssign$1({}, options, {
	      month: 'numeric',
	      day: 'numeric'
	    });
	  }
	  return options;
	}
	function dateAmend(options) {
	  options = amend(options, {
	    hour: false,
	    minute: false,
	    second: false,
	    dayPeriod: false,
	    timeZoneName: false,
	    timeStyle: false
	  });
	  if (!hasDateOptions(options)) {
	    options = ObjectAssign$1({}, options, {
	      year: 'numeric',
	      month: 'numeric',
	      day: 'numeric'
	    });
	  }
	  return options;
	}
	function datetimeAmend(options) {
	  options = amend(options, {
	    timeZoneName: false
	  });
	  if (!hasTimeOptions(options) && !hasDateOptions(options)) {
	    options = ObjectAssign$1({}, options, {
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
	function instantAmend(options) {
	  if (!hasTimeOptions(options) && !hasDateOptions(options)) {
	    options = ObjectAssign$1({}, options, {
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
	  return 'year' in options || 'month' in options || 'day' in options || 'weekday' in options || 'dateStyle' in options;
	}
	function hasTimeOptions(options) {
	  return 'hour' in options || 'minute' in options || 'second' in options || 'timeStyle' in options || 'dayPeriod' in options;
	}
	function isTemporalObject(obj) {
	  return IsTemporalDate(obj) || IsTemporalTime(obj) || IsTemporalDateTime(obj) || IsTemporalZonedDateTime(obj) || IsTemporalYearMonth(obj) || IsTemporalMonthDay(obj) || IsTemporalInstant(obj);
	}
	function sameTemporalType(x, y) {
	  if (!isTemporalObject(x) || !isTemporalObject(y)) return false;
	  if (IsTemporalTime(x) && !IsTemporalTime(y)) return false;
	  if (IsTemporalDate(x) && !IsTemporalDate(y)) return false;
	  if (IsTemporalDateTime(x) && !IsTemporalDateTime(y)) return false;
	  if (IsTemporalZonedDateTime(x) && !IsTemporalZonedDateTime(y)) return false;
	  if (IsTemporalYearMonth(x) && !IsTemporalYearMonth(y)) return false;
	  if (IsTemporalMonthDay(x) && !IsTemporalMonthDay(y)) return false;
	  if (IsTemporalInstant(x) && !IsTemporalInstant(y)) return false;
	  return true;
	}
	function extractOverrides(temporalObj, main) {
	  if (IsTemporalTime(temporalObj)) {
	    const isoDateTime = {
	      year: 1970,
	      month: 1,
	      day: 1,
	      hour: GetSlot(temporalObj, ISO_HOUR),
	      minute: GetSlot(temporalObj, ISO_MINUTE),
	      second: GetSlot(temporalObj, ISO_SECOND),
	      millisecond: GetSlot(temporalObj, ISO_MILLISECOND),
	      microsecond: GetSlot(temporalObj, ISO_MICROSECOND),
	      nanosecond: GetSlot(temporalObj, ISO_NANOSECOND)
	    };
	    return {
	      epochNs: GetEpochNanosecondsFor(GetSlot(main, TZ_CANONICAL), isoDateTime, 'compatible'),
	      formatter: getSlotLazy(main, TIME)
	    };
	  }
	  if (IsTemporalYearMonth(temporalObj)) {
	    const calendar = GetSlot(temporalObj, CALENDAR);
	    const mainCalendar = GetSlot(main, CAL_ID);
	    if (calendar !== mainCalendar) {
	      throw new RangeError(`cannot format PlainYearMonth with calendar ${calendar} in locale with calendar ${mainCalendar}`);
	    }
	    const isoDateTime = {
	      year: GetSlot(temporalObj, ISO_YEAR),
	      month: GetSlot(temporalObj, ISO_MONTH),
	      day: GetSlot(temporalObj, ISO_DAY),
	      hour: 12
	    };
	    return {
	      epochNs: GetEpochNanosecondsFor(GetSlot(main, TZ_CANONICAL), isoDateTime, 'compatible'),
	      formatter: getSlotLazy(main, YM)
	    };
	  }
	  if (IsTemporalMonthDay(temporalObj)) {
	    const calendar = GetSlot(temporalObj, CALENDAR);
	    const mainCalendar = GetSlot(main, CAL_ID);
	    if (calendar !== mainCalendar) {
	      throw new RangeError(`cannot format PlainMonthDay with calendar ${calendar} in locale with calendar ${mainCalendar}`);
	    }
	    const isoDateTime = {
	      year: GetSlot(temporalObj, ISO_YEAR),
	      month: GetSlot(temporalObj, ISO_MONTH),
	      day: GetSlot(temporalObj, ISO_DAY),
	      hour: 12
	    };
	    return {
	      epochNs: GetEpochNanosecondsFor(GetSlot(main, TZ_CANONICAL), isoDateTime, 'compatible'),
	      formatter: getSlotLazy(main, MD)
	    };
	  }
	  if (IsTemporalDate(temporalObj)) {
	    const calendar = GetSlot(temporalObj, CALENDAR);
	    const mainCalendar = GetSlot(main, CAL_ID);
	    if (calendar !== 'iso8601' && calendar !== mainCalendar) {
	      throw new RangeError(`cannot format PlainDate with calendar ${calendar} in locale with calendar ${mainCalendar}`);
	    }
	    const isoDateTime = {
	      year: GetSlot(temporalObj, ISO_YEAR),
	      month: GetSlot(temporalObj, ISO_MONTH),
	      day: GetSlot(temporalObj, ISO_DAY),
	      hour: 12
	    };
	    return {
	      epochNs: GetEpochNanosecondsFor(GetSlot(main, TZ_CANONICAL), isoDateTime, 'compatible'),
	      formatter: getSlotLazy(main, DATE)
	    };
	  }
	  if (IsTemporalDateTime(temporalObj)) {
	    const calendar = GetSlot(temporalObj, CALENDAR);
	    const mainCalendar = GetSlot(main, CAL_ID);
	    if (calendar !== 'iso8601' && calendar !== mainCalendar) {
	      throw new RangeError(`cannot format PlainDateTime with calendar ${calendar} in locale with calendar ${mainCalendar}`);
	    }
	    const isoDateTime = PlainDateTimeToISODateTimeRecord(temporalObj);
	    return {
	      epochNs: GetEpochNanosecondsFor(GetSlot(main, TZ_CANONICAL), isoDateTime, 'compatible'),
	      formatter: getSlotLazy(main, DATETIME)
	    };
	  }
	  if (IsTemporalZonedDateTime(temporalObj)) {
	    throw new TypeError('Temporal.ZonedDateTime not supported in DateTimeFormat methods. Use toLocaleString() instead.');
	  }
	  if (IsTemporalInstant(temporalObj)) {
	    return {
	      epochNs: GetSlot(temporalObj, EPOCHNANOSECONDS),
	      formatter: getSlotLazy(main, INST)
	    };
	  }
	  return {};
	}

	var Intl$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		DateTimeFormat: DateTimeFormat
	});

	/* global true */

	const ObjectCreate$4 = Object.create;
	class Instant {
	  constructor(epochNanoseconds) {
	    // Note: if the argument is not passed, ToBigInt(undefined) will throw. This check exists only
	    //       to improve the error message.
	    if (arguments.length < 1) {
	      throw new TypeError('missing argument: epochNanoseconds is required');
	    }
	    const ns = ToBigInt(epochNanoseconds);
	    ValidateEpochNanoseconds(ns);
	    CreateSlots(this);
	    SetSlot(this, EPOCHNANOSECONDS, ns);
	    {
	      const iso = GetISOPartsFromEpoch(ns);
	      const repr = TemporalDateTimeToString(iso, 'iso8601', 'auto', 'never') + 'Z';
	      Object.defineProperty(this, '_repr_', {
	        value: `${this[Symbol.toStringTag]} <${repr}>`,
	        writable: false,
	        enumerable: false,
	        configurable: false
	      });
	    }
	  }
	  get epochMilliseconds() {
	    if (!IsTemporalInstant(this)) throw new TypeError('invalid receiver');
	    const value = bigInt(GetSlot(this, EPOCHNANOSECONDS));
	    return BigIntFloorDiv(value, 1e6).toJSNumber();
	  }
	  get epochNanoseconds() {
	    if (!IsTemporalInstant(this)) throw new TypeError('invalid receiver');
	    return BigIntIfAvailable(GetSlot(this, EPOCHNANOSECONDS));
	  }
	  add(temporalDurationLike) {
	    if (!IsTemporalInstant(this)) throw new TypeError('invalid receiver');
	    return AddDurationToOrSubtractDurationFromInstant('add', this, temporalDurationLike);
	  }
	  subtract(temporalDurationLike) {
	    if (!IsTemporalInstant(this)) throw new TypeError('invalid receiver');
	    return AddDurationToOrSubtractDurationFromInstant('subtract', this, temporalDurationLike);
	  }
	  until(other) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalInstant(this)) throw new TypeError('invalid receiver');
	    return DifferenceTemporalInstant('until', this, other, options);
	  }
	  since(other) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalInstant(this)) throw new TypeError('invalid receiver');
	    return DifferenceTemporalInstant('since', this, other, options);
	  }
	  round(roundTo) {
	    if (!IsTemporalInstant(this)) throw new TypeError('invalid receiver');
	    if (roundTo === undefined) throw new TypeError('options parameter is required');
	    if (Type$3(roundTo) === 'String') {
	      const stringParam = roundTo;
	      roundTo = ObjectCreate$4(null);
	      roundTo.smallestUnit = stringParam;
	    } else {
	      roundTo = GetOptionsObject(roundTo);
	    }
	    const roundingIncrement = GetRoundingIncrementOption(roundTo);
	    const roundingMode = GetRoundingModeOption(roundTo, 'halfExpand');
	    const smallestUnit = GetTemporalUnitValuedOption(roundTo, 'smallestUnit', 'time', REQUIRED);
	    const maximumIncrements = {
	      hour: 24,
	      minute: 1440,
	      second: 86400,
	      millisecond: 86400e3,
	      microsecond: 86400e6,
	      nanosecond: 86400e9
	    };
	    ValidateTemporalRoundingIncrement(roundingIncrement, maximumIncrements[smallestUnit], true);
	    const ns = GetSlot(this, EPOCHNANOSECONDS);
	    const roundedNs = RoundTemporalInstant(ns, roundingIncrement, smallestUnit, roundingMode);
	    return new Instant(roundedNs);
	  }
	  equals(other) {
	    if (!IsTemporalInstant(this)) throw new TypeError('invalid receiver');
	    other = ToTemporalInstant(other);
	    const one = GetSlot(this, EPOCHNANOSECONDS);
	    const two = GetSlot(other, EPOCHNANOSECONDS);
	    return bigInt(one).equals(two);
	  }
	  toString() {
	    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	    if (!IsTemporalInstant(this)) throw new TypeError('invalid receiver');
	    options = GetOptionsObject(options);
	    const digits = GetTemporalFractionalSecondDigitsOption(options);
	    const roundingMode = GetRoundingModeOption(options, 'trunc');
	    const smallestUnit = GetTemporalUnitValuedOption(options, 'smallestUnit', 'time', undefined);
	    if (smallestUnit === 'hour') throw new RangeError('smallestUnit must be a time unit other than "hour"');
	    let timeZone = options.timeZone;
	    if (timeZone !== undefined) timeZone = ToTemporalTimeZoneIdentifier(timeZone);
	    const {
	      precision,
	      unit,
	      increment
	    } = ToSecondsStringPrecisionRecord(smallestUnit, digits);
	    const ns = GetSlot(this, EPOCHNANOSECONDS);
	    const roundedNs = RoundTemporalInstant(ns, increment, unit, roundingMode);
	    const roundedInstant = new Instant(roundedNs);
	    return TemporalInstantToString(roundedInstant, timeZone, precision);
	  }
	  toJSON() {
	    if (!IsTemporalInstant(this)) throw new TypeError('invalid receiver');
	    return TemporalInstantToString(this, undefined, 'auto');
	  }
	  toLocaleString() {
	    let locales = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalInstant(this)) throw new TypeError('invalid receiver');
	    return new DateTimeFormat(locales, options).format(this);
	  }
	  valueOf() {
	    ValueOfThrows('Instant');
	  }
	  toZonedDateTimeISO(timeZone) {
	    if (!IsTemporalInstant(this)) throw new TypeError('invalid receiver');
	    timeZone = ToTemporalTimeZoneIdentifier(timeZone);
	    return CreateTemporalZonedDateTime(GetSlot(this, EPOCHNANOSECONDS), timeZone, 'iso8601');
	  }
	  static fromEpochMilliseconds(epochMilliseconds) {
	    epochMilliseconds = ToNumber$2(epochMilliseconds);
	    const epochNanoseconds = bigInt(epochMilliseconds).multiply(1e6);
	    ValidateEpochNanoseconds(epochNanoseconds);
	    return new Instant(epochNanoseconds);
	  }
	  static fromEpochNanoseconds(epochNanoseconds) {
	    epochNanoseconds = ToBigInt(epochNanoseconds);
	    ValidateEpochNanoseconds(epochNanoseconds);
	    return new Instant(epochNanoseconds);
	  }
	  static from(item) {
	    if (IsTemporalInstant(item)) {
	      return new Instant(GetSlot(item, EPOCHNANOSECONDS));
	    }
	    return ToTemporalInstant(item);
	  }
	  static compare(one, two) {
	    one = ToTemporalInstant(one);
	    two = ToTemporalInstant(two);
	    one = GetSlot(one, EPOCHNANOSECONDS);
	    two = GetSlot(two, EPOCHNANOSECONDS);
	    if (bigInt(one).lesser(two)) return -1;
	    if (bigInt(one).greater(two)) return 1;
	    return 0;
	  }
	}
	MakeIntrinsicClass(Instant, 'Temporal.Instant');

	class PlainDate {
	  constructor(isoYear, isoMonth, isoDay) {
	    let calendar = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'iso8601';
	    isoYear = ToIntegerWithTruncation(isoYear);
	    isoMonth = ToIntegerWithTruncation(isoMonth);
	    isoDay = ToIntegerWithTruncation(isoDay);
	    calendar = calendar === undefined ? 'iso8601' : RequireString(calendar);
	    if (!IsBuiltinCalendar(calendar)) throw new RangeError(`unknown calendar ${calendar}`);
	    calendar = CanonicalizeCalendar(calendar);
	    CreateTemporalDateSlots(this, isoYear, isoMonth, isoDay, calendar);
	  }
	  get calendarId() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, CALENDAR);
	  }
	  get era() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarEra(GetSlot(this, CALENDAR), isoDate);
	  }
	  get eraYear() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarEraYear(GetSlot(this, CALENDAR), isoDate);
	  }
	  get year() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarYear(GetSlot(this, CALENDAR), isoDate);
	  }
	  get month() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarMonth(GetSlot(this, CALENDAR), isoDate);
	  }
	  get monthCode() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarMonthCode(GetSlot(this, CALENDAR), isoDate);
	  }
	  get day() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarDay(GetSlot(this, CALENDAR), isoDate);
	  }
	  get dayOfWeek() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarDayOfWeek(GetSlot(this, CALENDAR), isoDate);
	  }
	  get dayOfYear() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarDayOfYear(GetSlot(this, CALENDAR), isoDate);
	  }
	  get weekOfYear() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarWeekOfYear(GetSlot(this, CALENDAR), isoDate);
	  }
	  get yearOfWeek() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarYearOfWeek(GetSlot(this, CALENDAR), isoDate);
	  }
	  get daysInWeek() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarDaysInWeek(GetSlot(this, CALENDAR), isoDate);
	  }
	  get daysInMonth() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarDaysInMonth(GetSlot(this, CALENDAR), isoDate);
	  }
	  get daysInYear() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarDaysInYear(GetSlot(this, CALENDAR), isoDate);
	  }
	  get monthsInYear() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarMonthsInYear(GetSlot(this, CALENDAR), isoDate);
	  }
	  get inLeapYear() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarInLeapYear(GetSlot(this, CALENDAR), isoDate);
	  }
	  with(temporalDateLike) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    if (Type$3(temporalDateLike) !== 'Object') {
	      throw new TypeError('invalid argument');
	    }
	    RejectTemporalLikeObject(temporalDateLike);
	    const calendar = GetSlot(this, CALENDAR);
	    let fields = TemporalObjectToFields(this);
	    const partialDate = PrepareCalendarFields(calendar, temporalDateLike, ['day', 'month', 'monthCode', 'year'], [], 'partial');
	    fields = CalendarMergeFields(calendar, fields, partialDate);
	    const overflow = GetTemporalOverflowOption(GetOptionsObject(options));
	    const {
	      year,
	      month,
	      day
	    } = CalendarDateFromFields(calendar, fields, overflow);
	    return CreateTemporalDate(year, month, day, calendar);
	  }
	  withCalendar(calendar) {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    calendar = ToTemporalCalendarIdentifier(calendar);
	    return CreateTemporalDate(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), calendar);
	  }
	  add(temporalDurationLike) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    return AddDurationToDate('add', this, temporalDurationLike, options);
	  }
	  subtract(temporalDurationLike) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    return AddDurationToDate('subtract', this, temporalDurationLike, options);
	  }
	  until(other) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    return DifferenceTemporalPlainDate('until', this, other, options);
	  }
	  since(other) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    return DifferenceTemporalPlainDate('since', this, other, options);
	  }
	  equals(other) {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    other = ToTemporalDate(other);
	    if (GetSlot(this, ISO_YEAR) !== GetSlot(other, ISO_YEAR)) return false;
	    if (GetSlot(this, ISO_MONTH) !== GetSlot(other, ISO_MONTH)) return false;
	    if (GetSlot(this, ISO_DAY) !== GetSlot(other, ISO_DAY)) return false;
	    return CalendarEquals(GetSlot(this, CALENDAR), GetSlot(other, CALENDAR));
	  }
	  toString() {
	    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    options = GetOptionsObject(options);
	    const showCalendar = GetTemporalShowCalendarNameOption(options);
	    return TemporalDateToString(this, showCalendar);
	  }
	  toJSON() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    return TemporalDateToString(this);
	  }
	  toLocaleString() {
	    let locales = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    return new DateTimeFormat(locales, options).format(this);
	  }
	  valueOf() {
	    ValueOfThrows('PlainDate');
	  }
	  toPlainDateTime() {
	    let temporalTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    temporalTime = ToTemporalTimeOrMidnight(temporalTime);
	    return CreateTemporalDateTime(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), GetSlot(temporalTime, ISO_HOUR), GetSlot(temporalTime, ISO_MINUTE), GetSlot(temporalTime, ISO_SECOND), GetSlot(temporalTime, ISO_MILLISECOND), GetSlot(temporalTime, ISO_MICROSECOND), GetSlot(temporalTime, ISO_NANOSECOND), GetSlot(this, CALENDAR));
	  }
	  toZonedDateTime(item) {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    let timeZone, temporalTime;
	    if (Type$3(item) === 'Object') {
	      const timeZoneLike = item.timeZone;
	      if (timeZoneLike === undefined) {
	        timeZone = ToTemporalTimeZoneIdentifier(item);
	      } else {
	        timeZone = ToTemporalTimeZoneIdentifier(timeZoneLike);
	        temporalTime = item.plainTime;
	      }
	    } else {
	      timeZone = ToTemporalTimeZoneIdentifier(item);
	    }
	    const calendar = GetSlot(this, CALENDAR);
	    const year = GetSlot(this, ISO_YEAR);
	    const month = GetSlot(this, ISO_MONTH);
	    const day = GetSlot(this, ISO_DAY);
	    let epochNs;
	    if (temporalTime === undefined) {
	      epochNs = GetStartOfDay(timeZone, {
	        year,
	        month,
	        day
	      });
	    } else {
	      temporalTime = ToTemporalTime(temporalTime);
	      const dt = {
	        year,
	        month,
	        day,
	        hour: GetSlot(temporalTime, ISO_HOUR),
	        minute: GetSlot(temporalTime, ISO_MINUTE),
	        second: GetSlot(temporalTime, ISO_SECOND),
	        millisecond: GetSlot(temporalTime, ISO_MILLISECOND),
	        microsecond: GetSlot(temporalTime, ISO_MICROSECOND),
	        nanosecond: GetSlot(temporalTime, ISO_NANOSECOND)
	      };
	      epochNs = GetEpochNanosecondsFor(timeZone, dt, 'compatible');
	    }
	    return CreateTemporalZonedDateTime(epochNs, timeZone, calendar);
	  }
	  toPlainYearMonth() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    const calendar = GetSlot(this, CALENDAR);
	    const fields = TemporalObjectToFields(this);
	    const {
	      year,
	      month,
	      day
	    } = CalendarYearMonthFromFields(calendar, fields);
	    return CreateTemporalYearMonth(year, month, calendar, day);
	  }
	  toPlainMonthDay() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    const calendar = GetSlot(this, CALENDAR);
	    const fields = TemporalObjectToFields(this);
	    const {
	      year,
	      month,
	      day
	    } = CalendarMonthDayFromFields(calendar, fields);
	    return CreateTemporalMonthDay(month, day, calendar, year);
	  }
	  static from(item) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (IsTemporalDate(item)) {
	      GetTemporalOverflowOption(GetOptionsObject(options));
	      return CreateTemporalDate(GetSlot(item, ISO_YEAR), GetSlot(item, ISO_MONTH), GetSlot(item, ISO_DAY), GetSlot(item, CALENDAR));
	    }
	    return ToTemporalDate(item, options);
	  }
	  static compare(one, two) {
	    one = ToTemporalDate(one);
	    two = ToTemporalDate(two);
	    return CompareISODate(GetSlot(one, ISO_YEAR), GetSlot(one, ISO_MONTH), GetSlot(one, ISO_DAY), GetSlot(two, ISO_YEAR), GetSlot(two, ISO_MONTH), GetSlot(two, ISO_DAY));
	  }
	}
	MakeIntrinsicClass(PlainDate, 'Temporal.PlainDate');

	const ObjectCreate$3 = Object.create;
	class PlainDateTime {
	  constructor(isoYear, isoMonth, isoDay) {
	    let hour = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
	    let minute = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
	    let second = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
	    let millisecond = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
	    let microsecond = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
	    let nanosecond = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 0;
	    let calendar = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : 'iso8601';
	    isoYear = ToIntegerWithTruncation(isoYear);
	    isoMonth = ToIntegerWithTruncation(isoMonth);
	    isoDay = ToIntegerWithTruncation(isoDay);
	    hour = hour === undefined ? 0 : ToIntegerWithTruncation(hour);
	    minute = minute === undefined ? 0 : ToIntegerWithTruncation(minute);
	    second = second === undefined ? 0 : ToIntegerWithTruncation(second);
	    millisecond = millisecond === undefined ? 0 : ToIntegerWithTruncation(millisecond);
	    microsecond = microsecond === undefined ? 0 : ToIntegerWithTruncation(microsecond);
	    nanosecond = nanosecond === undefined ? 0 : ToIntegerWithTruncation(nanosecond);
	    calendar = calendar === undefined ? 'iso8601' : RequireString(calendar);
	    if (!IsBuiltinCalendar(calendar)) throw new RangeError(`unknown calendar ${calendar}`);
	    calendar = CanonicalizeCalendar(calendar);
	    CreateTemporalDateTimeSlots(this, isoYear, isoMonth, isoDay, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
	  }
	  get calendarId() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, CALENDAR);
	  }
	  get year() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarYear(GetSlot(this, CALENDAR), isoDate);
	  }
	  get month() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarMonth(GetSlot(this, CALENDAR), isoDate);
	  }
	  get monthCode() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarMonthCode(GetSlot(this, CALENDAR), isoDate);
	  }
	  get day() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarDay(GetSlot(this, CALENDAR), isoDate);
	  }
	  get hour() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, ISO_HOUR);
	  }
	  get minute() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, ISO_MINUTE);
	  }
	  get second() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, ISO_SECOND);
	  }
	  get millisecond() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, ISO_MILLISECOND);
	  }
	  get microsecond() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, ISO_MICROSECOND);
	  }
	  get nanosecond() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, ISO_NANOSECOND);
	  }
	  get era() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarEra(GetSlot(this, CALENDAR), isoDate);
	  }
	  get eraYear() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarEraYear(GetSlot(this, CALENDAR), isoDate);
	  }
	  get dayOfWeek() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarDayOfWeek(GetSlot(this, CALENDAR), isoDate);
	  }
	  get dayOfYear() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarDayOfYear(GetSlot(this, CALENDAR), isoDate);
	  }
	  get weekOfYear() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarWeekOfYear(GetSlot(this, CALENDAR), isoDate);
	  }
	  get yearOfWeek() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarYearOfWeek(GetSlot(this, CALENDAR), isoDate);
	  }
	  get daysInWeek() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarDaysInWeek(GetSlot(this, CALENDAR), isoDate);
	  }
	  get daysInYear() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarDaysInYear(GetSlot(this, CALENDAR), isoDate);
	  }
	  get daysInMonth() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarDaysInMonth(GetSlot(this, CALENDAR), isoDate);
	  }
	  get monthsInYear() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarMonthsInYear(GetSlot(this, CALENDAR), isoDate);
	  }
	  get inLeapYear() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarInLeapYear(GetSlot(this, CALENDAR), isoDate);
	  }
	  with(temporalDateTimeLike) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    if (Type$3(temporalDateTimeLike) !== 'Object') {
	      throw new TypeError('invalid argument');
	    }
	    RejectTemporalLikeObject(temporalDateTimeLike);
	    const calendar = GetSlot(this, CALENDAR);
	    let fields = TemporalObjectToFields(this);
	    fields.hour = GetSlot(this, ISO_HOUR);
	    fields.minute = GetSlot(this, ISO_MINUTE);
	    fields.second = GetSlot(this, ISO_SECOND);
	    fields.millisecond = GetSlot(this, ISO_MILLISECOND);
	    fields.microsecond = GetSlot(this, ISO_MICROSECOND);
	    fields.nanosecond = GetSlot(this, ISO_NANOSECOND);
	    const partialDateTime = PrepareCalendarFields(calendar, temporalDateTimeLike, ['day', 'month', 'monthCode', 'year'], ['hour', 'microsecond', 'millisecond', 'minute', 'nanosecond', 'second'], 'partial');
	    fields = CalendarMergeFields(calendar, fields, partialDateTime);
	    const overflow = GetTemporalOverflowOption(GetOptionsObject(options));
	    const {
	      year,
	      month,
	      day,
	      time
	    } = InterpretTemporalDateTimeFields(calendar, fields, overflow);
	    const {
	      hour = 0,
	      minute = 0,
	      second = 0,
	      millisecond = 0,
	      microsecond = 0,
	      nanosecond = 0
	    } = time === 'start-of-day' ? {} : time;
	    return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
	  }
	  withPlainTime() {
	    let temporalTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    temporalTime = ToTemporalTimeOrMidnight(temporalTime);
	    return CreateTemporalDateTime(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), GetSlot(temporalTime, ISO_HOUR), GetSlot(temporalTime, ISO_MINUTE), GetSlot(temporalTime, ISO_SECOND), GetSlot(temporalTime, ISO_MILLISECOND), GetSlot(temporalTime, ISO_MICROSECOND), GetSlot(temporalTime, ISO_NANOSECOND), GetSlot(this, CALENDAR));
	  }
	  withCalendar(calendar) {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    calendar = ToTemporalCalendarIdentifier(calendar);
	    return CreateTemporalDateTime(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), GetSlot(this, ISO_HOUR), GetSlot(this, ISO_MINUTE), GetSlot(this, ISO_SECOND), GetSlot(this, ISO_MILLISECOND), GetSlot(this, ISO_MICROSECOND), GetSlot(this, ISO_NANOSECOND), calendar);
	  }
	  add(temporalDurationLike) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return AddDurationToOrSubtractDurationFromPlainDateTime('add', this, temporalDurationLike, options);
	  }
	  subtract(temporalDurationLike) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return AddDurationToOrSubtractDurationFromPlainDateTime('subtract', this, temporalDurationLike, options);
	  }
	  until(other) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return DifferenceTemporalPlainDateTime('until', this, other, options);
	  }
	  since(other) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return DifferenceTemporalPlainDateTime('since', this, other, options);
	  }
	  round(roundTo) {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    if (roundTo === undefined) throw new TypeError('options parameter is required');
	    if (Type$3(roundTo) === 'String') {
	      const stringParam = roundTo;
	      roundTo = ObjectCreate$3(null);
	      roundTo.smallestUnit = stringParam;
	    } else {
	      roundTo = GetOptionsObject(roundTo);
	    }
	    const roundingIncrement = GetRoundingIncrementOption(roundTo);
	    const roundingMode = GetRoundingModeOption(roundTo, 'halfExpand');
	    const smallestUnit = GetTemporalUnitValuedOption(roundTo, 'smallestUnit', 'time', REQUIRED, ['day']);
	    const maximumIncrements = {
	      day: 1,
	      hour: 24,
	      minute: 60,
	      second: 60,
	      millisecond: 1000,
	      microsecond: 1000,
	      nanosecond: 1000
	    };
	    const maximum = maximumIncrements[smallestUnit];
	    const inclusive = maximum === 1;
	    ValidateTemporalRoundingIncrement(roundingIncrement, maximum, inclusive);
	    let year = GetSlot(this, ISO_YEAR);
	    let month = GetSlot(this, ISO_MONTH);
	    let day = GetSlot(this, ISO_DAY);
	    let hour = GetSlot(this, ISO_HOUR);
	    let minute = GetSlot(this, ISO_MINUTE);
	    let second = GetSlot(this, ISO_SECOND);
	    let millisecond = GetSlot(this, ISO_MILLISECOND);
	    let microsecond = GetSlot(this, ISO_MICROSECOND);
	    let nanosecond = GetSlot(this, ISO_NANOSECOND);
	    if (roundingIncrement === 1 && smallestUnit === 'nanosecond') {
	      return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, GetSlot(this, CALENDAR));
	    }
	    ({
	      year,
	      month,
	      day,
	      hour,
	      minute,
	      second,
	      millisecond,
	      microsecond,
	      nanosecond
	    } = RoundISODateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, roundingIncrement, smallestUnit, roundingMode));
	    return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, GetSlot(this, CALENDAR));
	  }
	  equals(other) {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    other = ToTemporalDateTime(other);
	    if (CompareISODateTime(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), GetSlot(this, ISO_HOUR), GetSlot(this, ISO_MINUTE), GetSlot(this, ISO_SECOND), GetSlot(this, ISO_MILLISECOND), GetSlot(this, ISO_MICROSECOND), GetSlot(this, ISO_NANOSECOND), GetSlot(other, ISO_YEAR), GetSlot(other, ISO_MONTH), GetSlot(other, ISO_DAY), GetSlot(other, ISO_HOUR), GetSlot(other, ISO_MINUTE), GetSlot(other, ISO_SECOND), GetSlot(other, ISO_MILLISECOND), GetSlot(other, ISO_MICROSECOND), GetSlot(other, ISO_NANOSECOND)) !== 0) {
	      return false;
	    }
	    return CalendarEquals(GetSlot(this, CALENDAR), GetSlot(other, CALENDAR));
	  }
	  toString() {
	    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    options = GetOptionsObject(options);
	    const showCalendar = GetTemporalShowCalendarNameOption(options);
	    const digits = GetTemporalFractionalSecondDigitsOption(options);
	    const roundingMode = GetRoundingModeOption(options, 'trunc');
	    const smallestUnit = GetTemporalUnitValuedOption(options, 'smallestUnit', 'time', undefined);
	    if (smallestUnit === 'hour') throw new RangeError('smallestUnit must be a time unit other than "hour"');
	    const {
	      precision,
	      unit,
	      increment
	    } = ToSecondsStringPrecisionRecord(smallestUnit, digits);
	    const result = RoundISODateTime(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), GetSlot(this, ISO_HOUR), GetSlot(this, ISO_MINUTE), GetSlot(this, ISO_SECOND), GetSlot(this, ISO_MILLISECOND), GetSlot(this, ISO_MICROSECOND), GetSlot(this, ISO_NANOSECOND), increment, unit, roundingMode);
	    RejectDateTimeRange(result.year, result.month, result.day, result.hour, result.minute, result.second, result.millisecond, result.microsecond, result.nanosecond);
	    return TemporalDateTimeToString(result, GetSlot(this, CALENDAR), precision, showCalendar);
	  }
	  toJSON() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    const isoDateTime = {
	      year: GetSlot(this, ISO_YEAR),
	      month: GetSlot(this, ISO_MONTH),
	      day: GetSlot(this, ISO_DAY),
	      hour: GetSlot(this, ISO_HOUR),
	      minute: GetSlot(this, ISO_MINUTE),
	      second: GetSlot(this, ISO_SECOND),
	      millisecond: GetSlot(this, ISO_MILLISECOND),
	      microsecond: GetSlot(this, ISO_MICROSECOND),
	      nanosecond: GetSlot(this, ISO_NANOSECOND)
	    };
	    return TemporalDateTimeToString(isoDateTime, GetSlot(this, CALENDAR), 'auto');
	  }
	  toLocaleString() {
	    let locales = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return new DateTimeFormat(locales, options).format(this);
	  }
	  valueOf() {
	    ValueOfThrows('PlainDateTime');
	  }
	  toZonedDateTime(temporalTimeZoneLike) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    const timeZone = ToTemporalTimeZoneIdentifier(temporalTimeZoneLike);
	    options = GetOptionsObject(options);
	    const disambiguation = GetTemporalDisambiguationOption(options);
	    const isoDateTime = PlainDateTimeToISODateTimeRecord(this);
	    const epochNs = GetEpochNanosecondsFor(timeZone, isoDateTime, disambiguation);
	    return CreateTemporalZonedDateTime(epochNs, timeZone, GetSlot(this, CALENDAR));
	  }
	  toPlainDate() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return TemporalDateTimeToDate(this);
	  }
	  toPlainTime() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return TemporalDateTimeToTime(this);
	  }
	  static from(item) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (IsTemporalDateTime(item)) {
	      GetTemporalOverflowOption(GetOptionsObject(options));
	      return CreateTemporalDateTime(GetSlot(item, ISO_YEAR), GetSlot(item, ISO_MONTH), GetSlot(item, ISO_DAY), GetSlot(item, ISO_HOUR), GetSlot(item, ISO_MINUTE), GetSlot(item, ISO_SECOND), GetSlot(item, ISO_MILLISECOND), GetSlot(item, ISO_MICROSECOND), GetSlot(item, ISO_NANOSECOND), GetSlot(item, CALENDAR));
	    }
	    return ToTemporalDateTime(item, options);
	  }
	  static compare(one, two) {
	    one = ToTemporalDateTime(one);
	    two = ToTemporalDateTime(two);
	    return CompareISODateTime(GetSlot(one, ISO_YEAR), GetSlot(one, ISO_MONTH), GetSlot(one, ISO_DAY), GetSlot(one, ISO_HOUR), GetSlot(one, ISO_MINUTE), GetSlot(one, ISO_SECOND), GetSlot(one, ISO_MILLISECOND), GetSlot(one, ISO_MICROSECOND), GetSlot(one, ISO_NANOSECOND), GetSlot(two, ISO_YEAR), GetSlot(two, ISO_MONTH), GetSlot(two, ISO_DAY), GetSlot(two, ISO_HOUR), GetSlot(two, ISO_MINUTE), GetSlot(two, ISO_SECOND), GetSlot(two, ISO_MILLISECOND), GetSlot(two, ISO_MICROSECOND), GetSlot(two, ISO_NANOSECOND));
	  }
	}
	MakeIntrinsicClass(PlainDateTime, 'Temporal.PlainDateTime');

	/* global true */

	const NumberIsNaN = Number.isNaN;
	const ObjectCreate$2 = Object.create;
	class Duration {
	  constructor() {
	    let years = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	    let months = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	    let weeks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
	    let days = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
	    let hours = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
	    let minutes = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
	    let seconds = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
	    let milliseconds = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
	    let microseconds = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 0;
	    let nanoseconds = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : 0;
	    years = years === undefined ? 0 : ToIntegerIfIntegral(years);
	    months = months === undefined ? 0 : ToIntegerIfIntegral(months);
	    weeks = weeks === undefined ? 0 : ToIntegerIfIntegral(weeks);
	    days = days === undefined ? 0 : ToIntegerIfIntegral(days);
	    hours = hours === undefined ? 0 : ToIntegerIfIntegral(hours);
	    minutes = minutes === undefined ? 0 : ToIntegerIfIntegral(minutes);
	    seconds = seconds === undefined ? 0 : ToIntegerIfIntegral(seconds);
	    milliseconds = milliseconds === undefined ? 0 : ToIntegerIfIntegral(milliseconds);
	    microseconds = microseconds === undefined ? 0 : ToIntegerIfIntegral(microseconds);
	    nanoseconds = nanoseconds === undefined ? 0 : ToIntegerIfIntegral(nanoseconds);
	    RejectDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
	    CreateSlots(this);
	    SetSlot(this, YEARS, years);
	    SetSlot(this, MONTHS, months);
	    SetSlot(this, WEEKS, weeks);
	    SetSlot(this, DAYS, days);
	    SetSlot(this, HOURS, hours);
	    SetSlot(this, MINUTES, minutes);
	    SetSlot(this, SECONDS, seconds);
	    SetSlot(this, MILLISECONDS, milliseconds);
	    SetSlot(this, MICROSECONDS, microseconds);
	    SetSlot(this, NANOSECONDS, nanoseconds);
	    {
	      const normSeconds = TimeDuration.normalize(0, 0, seconds, milliseconds, microseconds, nanoseconds);
	      Object.defineProperty(this, '_repr_', {
	        value: `Temporal.Duration <${TemporalDurationToString(years, months, weeks, days, hours, minutes, normSeconds)}>`,
	        writable: false,
	        enumerable: false,
	        configurable: false
	      });
	    }
	  }
	  get years() {
	    if (!IsTemporalDuration(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, YEARS);
	  }
	  get months() {
	    if (!IsTemporalDuration(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, MONTHS);
	  }
	  get weeks() {
	    if (!IsTemporalDuration(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, WEEKS);
	  }
	  get days() {
	    if (!IsTemporalDuration(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, DAYS);
	  }
	  get hours() {
	    if (!IsTemporalDuration(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, HOURS);
	  }
	  get minutes() {
	    if (!IsTemporalDuration(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, MINUTES);
	  }
	  get seconds() {
	    if (!IsTemporalDuration(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, SECONDS);
	  }
	  get milliseconds() {
	    if (!IsTemporalDuration(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, MILLISECONDS);
	  }
	  get microseconds() {
	    if (!IsTemporalDuration(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, MICROSECONDS);
	  }
	  get nanoseconds() {
	    if (!IsTemporalDuration(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, NANOSECONDS);
	  }
	  get sign() {
	    if (!IsTemporalDuration(this)) throw new TypeError('invalid receiver');
	    return DurationSign(GetSlot(this, YEARS), GetSlot(this, MONTHS), GetSlot(this, WEEKS), GetSlot(this, DAYS), GetSlot(this, HOURS), GetSlot(this, MINUTES), GetSlot(this, SECONDS), GetSlot(this, MILLISECONDS), GetSlot(this, MICROSECONDS), GetSlot(this, NANOSECONDS));
	  }
	  get blank() {
	    if (!IsTemporalDuration(this)) throw new TypeError('invalid receiver');
	    return DurationSign(GetSlot(this, YEARS), GetSlot(this, MONTHS), GetSlot(this, WEEKS), GetSlot(this, DAYS), GetSlot(this, HOURS), GetSlot(this, MINUTES), GetSlot(this, SECONDS), GetSlot(this, MILLISECONDS), GetSlot(this, MICROSECONDS), GetSlot(this, NANOSECONDS)) === 0;
	  }
	  with(durationLike) {
	    if (!IsTemporalDuration(this)) throw new TypeError('invalid receiver');
	    const partialDuration = ToTemporalPartialDurationRecord(durationLike);
	    const {
	      years = GetSlot(this, YEARS),
	      months = GetSlot(this, MONTHS),
	      weeks = GetSlot(this, WEEKS),
	      days = GetSlot(this, DAYS),
	      hours = GetSlot(this, HOURS),
	      minutes = GetSlot(this, MINUTES),
	      seconds = GetSlot(this, SECONDS),
	      milliseconds = GetSlot(this, MILLISECONDS),
	      microseconds = GetSlot(this, MICROSECONDS),
	      nanoseconds = GetSlot(this, NANOSECONDS)
	    } = partialDuration;
	    return new Duration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
	  }
	  negated() {
	    if (!IsTemporalDuration(this)) throw new TypeError('invalid receiver');
	    return CreateNegatedTemporalDuration(this);
	  }
	  abs() {
	    if (!IsTemporalDuration(this)) throw new TypeError('invalid receiver');
	    return new Duration(Math.abs(GetSlot(this, YEARS)), Math.abs(GetSlot(this, MONTHS)), Math.abs(GetSlot(this, WEEKS)), Math.abs(GetSlot(this, DAYS)), Math.abs(GetSlot(this, HOURS)), Math.abs(GetSlot(this, MINUTES)), Math.abs(GetSlot(this, SECONDS)), Math.abs(GetSlot(this, MILLISECONDS)), Math.abs(GetSlot(this, MICROSECONDS)), Math.abs(GetSlot(this, NANOSECONDS)));
	  }
	  add(other) {
	    if (!IsTemporalDuration(this)) throw new TypeError('invalid receiver');
	    return AddDurations('add', this, other);
	  }
	  subtract(other) {
	    if (!IsTemporalDuration(this)) throw new TypeError('invalid receiver');
	    return AddDurations('subtract', this, other);
	  }
	  round(roundTo) {
	    if (!IsTemporalDuration(this)) throw new TypeError('invalid receiver');
	    if (roundTo === undefined) throw new TypeError('options parameter is required');
	    let years = GetSlot(this, YEARS);
	    let months = GetSlot(this, MONTHS);
	    let weeks = GetSlot(this, WEEKS);
	    let days = GetSlot(this, DAYS);
	    let hours = GetSlot(this, HOURS);
	    let minutes = GetSlot(this, MINUTES);
	    let seconds = GetSlot(this, SECONDS);
	    let milliseconds = GetSlot(this, MILLISECONDS);
	    let microseconds = GetSlot(this, MICROSECONDS);
	    let nanoseconds = GetSlot(this, NANOSECONDS);
	    const existingLargestUnit = DefaultTemporalLargestUnit(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds);
	    if (Type$3(roundTo) === 'String') {
	      const stringParam = roundTo;
	      roundTo = ObjectCreate$2(null);
	      roundTo.smallestUnit = stringParam;
	    } else {
	      roundTo = GetOptionsObject(roundTo);
	    }
	    let largestUnit = GetTemporalUnitValuedOption(roundTo, 'largestUnit', 'datetime', undefined, ['auto']);
	    let {
	      plainRelativeTo,
	      zonedRelativeTo
	    } = GetTemporalRelativeToOption(roundTo);
	    const roundingIncrement = GetRoundingIncrementOption(roundTo);
	    const roundingMode = GetRoundingModeOption(roundTo, 'halfExpand');
	    let smallestUnit = GetTemporalUnitValuedOption(roundTo, 'smallestUnit', 'datetime', undefined);
	    let smallestUnitPresent = true;
	    if (!smallestUnit) {
	      smallestUnitPresent = false;
	      smallestUnit = 'nanosecond';
	    }
	    const defaultLargestUnit = LargerOfTwoTemporalUnits(existingLargestUnit, smallestUnit);
	    let largestUnitPresent = true;
	    if (!largestUnit) {
	      largestUnitPresent = false;
	      largestUnit = defaultLargestUnit;
	    }
	    if (largestUnit === 'auto') largestUnit = defaultLargestUnit;
	    if (!smallestUnitPresent && !largestUnitPresent) {
	      throw new RangeError('at least one of smallestUnit or largestUnit is required');
	    }
	    if (LargerOfTwoTemporalUnits(largestUnit, smallestUnit) !== largestUnit) {
	      throw new RangeError(`largestUnit ${largestUnit} cannot be smaller than smallestUnit ${smallestUnit}`);
	    }
	    const maximumIncrements = {
	      hour: 24,
	      minute: 60,
	      second: 60,
	      millisecond: 1000,
	      microsecond: 1000,
	      nanosecond: 1000
	    };
	    const maximum = maximumIncrements[smallestUnit];
	    if (maximum !== undefined) ValidateTemporalRoundingIncrement(roundingIncrement, maximum, false);
	    if (roundingIncrement > 1 && (IsCalendarUnit(smallestUnit) || smallestUnit === 'day') && largestUnit !== smallestUnit) {
	      throw new RangeError('For calendar units with roundingIncrement > 1, use largestUnit = smallestUnit');
	    }
	    let norm = TimeDuration.normalize(hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
	    if (zonedRelativeTo) {
	      const timeZone = GetSlot(zonedRelativeTo, TIME_ZONE);
	      const calendar = GetSlot(zonedRelativeTo, CALENDAR);
	      const relativeEpochNs = GetSlot(zonedRelativeTo, EPOCHNANOSECONDS);
	      const targetEpochNs = AddZonedDateTime(relativeEpochNs, timeZone, calendar, years, months, weeks, days, norm);
	      ({
	        years,
	        months,
	        weeks,
	        days,
	        hours,
	        minutes,
	        seconds,
	        milliseconds,
	        microseconds,
	        nanoseconds
	      } = DifferenceZonedDateTimeWithRounding(relativeEpochNs, targetEpochNs, calendar, timeZone, largestUnit, roundingIncrement, smallestUnit, roundingMode));
	    } else if (plainRelativeTo) {
	      let targetTime = AddTime(0, 0, 0, 0, 0, 0, norm);

	      // Delegate the date part addition to the calendar
	      RejectDuration(years, months, weeks, days + targetTime.deltaDays, 0, 0, 0, 0, 0, 0);
	      const isoRelativeToDate = TemporalObjectToISODateRecord(plainRelativeTo);
	      const calendar = GetSlot(plainRelativeTo, CALENDAR);
	      const dateDuration = {
	        years,
	        months,
	        weeks,
	        days: days + targetTime.deltaDays
	      };
	      const targetDate = CalendarDateAdd(calendar, isoRelativeToDate, dateDuration, 'constrain');
	      ({
	        years,
	        months,
	        weeks,
	        days,
	        hours,
	        minutes,
	        seconds,
	        milliseconds,
	        microseconds,
	        nanoseconds
	      } = DifferencePlainDateTimeWithRounding(isoRelativeToDate.year, isoRelativeToDate.month, isoRelativeToDate.day, 0, 0, 0, 0, 0, 0, targetDate.year, targetDate.month, targetDate.day, targetTime.hour, targetTime.minute, targetTime.second, targetTime.millisecond, targetTime.microsecond, targetTime.nanosecond, calendar, largestUnit, roundingIncrement, smallestUnit, roundingMode));
	    } else {
	      // No reference date to calculate difference relative to
	      if (years !== 0 || months !== 0 || weeks !== 0) {
	        throw new RangeError('a starting point is required for years, months, or weeks balancing');
	      }
	      if (IsCalendarUnit(largestUnit)) {
	        throw new RangeError(`a starting point is required for ${largestUnit}s balancing`);
	      }
	      if (IsCalendarUnit(smallestUnit)) {
	        throw new Error('assertion failed: smallestUnit was larger than largestUnit');
	      }
	      ({
	        days,
	        norm
	      } = RoundTimeDuration(days, norm, roundingIncrement, smallestUnit, roundingMode));
	      ({
	        days,
	        hours,
	        minutes,
	        seconds,
	        milliseconds,
	        microseconds,
	        nanoseconds
	      } = BalanceTimeDuration(norm.add24HourDays(days), largestUnit));
	    }
	    return new Duration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
	  }
	  total(totalOf) {
	    if (!IsTemporalDuration(this)) throw new TypeError('invalid receiver');
	    let years = GetSlot(this, YEARS);
	    let months = GetSlot(this, MONTHS);
	    let weeks = GetSlot(this, WEEKS);
	    let days = GetSlot(this, DAYS);
	    let hours = GetSlot(this, HOURS);
	    let minutes = GetSlot(this, MINUTES);
	    let seconds = GetSlot(this, SECONDS);
	    let milliseconds = GetSlot(this, MILLISECONDS);
	    let microseconds = GetSlot(this, MICROSECONDS);
	    let nanoseconds = GetSlot(this, NANOSECONDS);
	    if (totalOf === undefined) throw new TypeError('options argument is required');
	    if (Type$3(totalOf) === 'String') {
	      const stringParam = totalOf;
	      totalOf = ObjectCreate$2(null);
	      totalOf.unit = stringParam;
	    } else {
	      totalOf = GetOptionsObject(totalOf);
	    }
	    let {
	      plainRelativeTo,
	      zonedRelativeTo
	    } = GetTemporalRelativeToOption(totalOf);
	    const unit = GetTemporalUnitValuedOption(totalOf, 'unit', 'datetime', REQUIRED);
	    let norm = TimeDuration.normalize(hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
	    if (zonedRelativeTo) {
	      const timeZone = GetSlot(zonedRelativeTo, TIME_ZONE);
	      const calendar = GetSlot(zonedRelativeTo, CALENDAR);
	      const relativeEpochNs = GetSlot(zonedRelativeTo, EPOCHNANOSECONDS);
	      const targetEpochNs = AddZonedDateTime(relativeEpochNs, timeZone, calendar, years, months, weeks, days, norm);
	      const {
	        total
	      } = DifferenceZonedDateTimeWithRounding(relativeEpochNs, targetEpochNs, calendar, timeZone, unit, 1, unit, 'trunc');
	      if (NumberIsNaN(total)) throw new Error('assertion failed: total hit unexpected code path');
	      return total;
	    }
	    if (plainRelativeTo) {
	      let targetTime = AddTime(0, 0, 0, 0, 0, 0, norm);

	      // Delegate the date part addition to the calendar
	      RejectDuration(years, months, weeks, days + targetTime.deltaDays, 0, 0, 0, 0, 0, 0);
	      const isoRelativeToDate = TemporalObjectToISODateRecord(plainRelativeTo);
	      const calendar = GetSlot(plainRelativeTo, CALENDAR);
	      const dateDuration = {
	        years,
	        months,
	        weeks,
	        days: days + targetTime.deltaDays
	      };
	      const targetDate = CalendarDateAdd(calendar, isoRelativeToDate, dateDuration, 'constrain');
	      const {
	        total
	      } = DifferencePlainDateTimeWithRounding(isoRelativeToDate.year, isoRelativeToDate.month, isoRelativeToDate.day, 0, 0, 0, 0, 0, 0, targetDate.year, targetDate.month, targetDate.day, targetTime.hour, targetTime.minute, targetTime.second, targetTime.millisecond, targetTime.microsecond, targetTime.nanosecond, calendar, unit, 1, unit, 'trunc');
	      if (NumberIsNaN(total)) throw new Error('assertion failed: total hit unexpected code path');
	      return total;
	    }

	    // No reference date to calculate difference relative to
	    if (years !== 0 || months !== 0 || weeks !== 0) {
	      throw new RangeError('a starting point is required for years, months, or weeks total');
	    }
	    if (IsCalendarUnit(unit)) {
	      throw new RangeError(`a starting point is required for ${unit}s total`);
	    }
	    norm = norm.add24HourDays(days);
	    const {
	      total
	    } = RoundTimeDuration(0, norm, 1, unit, 'trunc');
	    return total;
	  }
	  toString() {
	    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	    if (!IsTemporalDuration(this)) throw new TypeError('invalid receiver');
	    options = GetOptionsObject(options);
	    const digits = GetTemporalFractionalSecondDigitsOption(options);
	    const roundingMode = GetRoundingModeOption(options, 'trunc');
	    const smallestUnit = GetTemporalUnitValuedOption(options, 'smallestUnit', 'time', undefined);
	    if (smallestUnit === 'hour' || smallestUnit === 'minute') {
	      throw new RangeError('smallestUnit must be a time unit other than "hours" or "minutes"');
	    }
	    const {
	      precision,
	      unit,
	      increment
	    } = ToSecondsStringPrecisionRecord(smallestUnit, digits);
	    let years = GetSlot(this, YEARS);
	    let months = GetSlot(this, MONTHS);
	    let weeks = GetSlot(this, WEEKS);
	    let days = GetSlot(this, DAYS);
	    let hours = GetSlot(this, HOURS);
	    let minutes = GetSlot(this, MINUTES);
	    let seconds = GetSlot(this, SECONDS);
	    let milliseconds = GetSlot(this, MILLISECONDS);
	    let microseconds = GetSlot(this, MICROSECONDS);
	    let nanoseconds = GetSlot(this, NANOSECONDS);
	    if (unit !== 'nanosecond' || increment !== 1) {
	      let norm = TimeDuration.normalize(hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
	      const largestUnit = DefaultTemporalLargestUnit(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds);
	      ({
	        norm
	      } = RoundTimeDuration(0, norm, increment, unit, roundingMode));
	      let deltaDays;
	      ({
	        days: deltaDays,
	        hours,
	        minutes,
	        seconds,
	        milliseconds,
	        microseconds,
	        nanoseconds
	      } = BalanceTimeDuration(norm, LargerOfTwoTemporalUnits(largestUnit, 'second')));
	      // Keeping sub-second units separate avoids losing precision after
	      // resolving any overflows from rounding
	      days += deltaDays;
	    }
	    const normSeconds = TimeDuration.normalize(0, 0, seconds, milliseconds, microseconds, nanoseconds);
	    return TemporalDurationToString(years, months, weeks, days, hours, minutes, normSeconds, precision);
	  }
	  toJSON() {
	    if (!IsTemporalDuration(this)) throw new TypeError('invalid receiver');
	    const normSeconds = TimeDuration.normalize(0, 0, GetSlot(this, SECONDS), GetSlot(this, MILLISECONDS), GetSlot(this, MICROSECONDS), GetSlot(this, NANOSECONDS));
	    return TemporalDurationToString(GetSlot(this, YEARS), GetSlot(this, MONTHS), GetSlot(this, WEEKS), GetSlot(this, DAYS), GetSlot(this, HOURS), GetSlot(this, MINUTES), normSeconds);
	  }
	  toLocaleString() {
	    let locales = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalDuration(this)) throw new TypeError('invalid receiver');
	    if (typeof Intl !== 'undefined' && typeof Intl.DurationFormat !== 'undefined') {
	      return new Intl.DurationFormat(locales, options).format(this);
	    }
	    console.warn('Temporal.Duration.prototype.toLocaleString() requires Intl.DurationFormat.');
	    const normSeconds = TimeDuration.normalize(0, 0, GetSlot(this, SECONDS), GetSlot(this, MILLISECONDS), GetSlot(this, MICROSECONDS), GetSlot(this, NANOSECONDS));
	    return TemporalDurationToString(GetSlot(this, YEARS), GetSlot(this, MONTHS), GetSlot(this, WEEKS), GetSlot(this, DAYS), GetSlot(this, HOURS), GetSlot(this, MINUTES), normSeconds);
	  }
	  valueOf() {
	    ValueOfThrows('Duration');
	  }
	  static from(item) {
	    if (IsTemporalDuration(item)) {
	      return new Duration(GetSlot(item, YEARS), GetSlot(item, MONTHS), GetSlot(item, WEEKS), GetSlot(item, DAYS), GetSlot(item, HOURS), GetSlot(item, MINUTES), GetSlot(item, SECONDS), GetSlot(item, MILLISECONDS), GetSlot(item, MICROSECONDS), GetSlot(item, NANOSECONDS));
	    }
	    return ToTemporalDuration(item);
	  }
	  static compare(one, two) {
	    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
	    one = ToTemporalDuration(one);
	    two = ToTemporalDuration(two);
	    options = GetOptionsObject(options);
	    const {
	      plainRelativeTo,
	      zonedRelativeTo
	    } = GetTemporalRelativeToOption(options);
	    const y1 = GetSlot(one, YEARS);
	    const mon1 = GetSlot(one, MONTHS);
	    const w1 = GetSlot(one, WEEKS);
	    let d1 = GetSlot(one, DAYS);
	    let h1 = GetSlot(one, HOURS);
	    const min1 = GetSlot(one, MINUTES);
	    const s1 = GetSlot(one, SECONDS);
	    const ms1 = GetSlot(one, MILLISECONDS);
	    const µs1 = GetSlot(one, MICROSECONDS);
	    let ns1 = GetSlot(one, NANOSECONDS);
	    const y2 = GetSlot(two, YEARS);
	    const mon2 = GetSlot(two, MONTHS);
	    const w2 = GetSlot(two, WEEKS);
	    let d2 = GetSlot(two, DAYS);
	    let h2 = GetSlot(two, HOURS);
	    const min2 = GetSlot(two, MINUTES);
	    const s2 = GetSlot(two, SECONDS);
	    const ms2 = GetSlot(two, MILLISECONDS);
	    const µs2 = GetSlot(two, MICROSECONDS);
	    let ns2 = GetSlot(two, NANOSECONDS);
	    if (y1 === y2 && mon1 === mon2 && w1 === w2 && d1 === d2 && h1 === h2 && min1 === min2 && s1 === s2 && ms1 === ms2 && µs1 === µs2 && ns1 === ns2) {
	      return 0;
	    }
	    const calendarUnitsPresent = y1 !== 0 || y2 !== 0 || mon1 !== 0 || mon2 !== 0 || w1 !== 0 || w2 !== 0;
	    if (zonedRelativeTo && (calendarUnitsPresent || d1 != 0 || d2 !== 0)) {
	      const timeZone = GetSlot(zonedRelativeTo, TIME_ZONE);
	      const calendar = GetSlot(zonedRelativeTo, CALENDAR);
	      const epochNs = GetSlot(zonedRelativeTo, EPOCHNANOSECONDS);
	      const norm1 = TimeDuration.normalize(h1, min1, s1, ms1, µs1, ns1);
	      const norm2 = TimeDuration.normalize(h2, min2, s2, ms2, µs2, ns2);
	      const after1 = AddZonedDateTime(epochNs, timeZone, calendar, y1, mon1, w1, d1, norm1);
	      const after2 = AddZonedDateTime(epochNs, timeZone, calendar, y2, mon2, w2, d2, norm2);
	      return ComparisonResult(after1.minus(after2).toJSNumber());
	    }
	    if (calendarUnitsPresent) {
	      if (!plainRelativeTo) {
	        throw new RangeError('A starting point is required for years, months, or weeks comparison');
	      }
	      d1 = UnbalanceDateDurationRelative(y1, mon1, w1, d1, plainRelativeTo);
	      d2 = UnbalanceDateDurationRelative(y2, mon2, w2, d2, plainRelativeTo);
	    }
	    const norm1 = TimeDuration.normalize(h1, min1, s1, ms1, µs1, ns1).add24HourDays(d1);
	    const norm2 = TimeDuration.normalize(h2, min2, s2, ms2, µs2, ns2).add24HourDays(d2);
	    return norm1.cmp(norm2);
	  }
	}
	MakeIntrinsicClass(Duration, 'Temporal.Duration');

	class PlainMonthDay {
	  constructor(isoMonth, isoDay) {
	    let calendar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'iso8601';
	    let referenceISOYear = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1972;
	    isoMonth = ToIntegerWithTruncation(isoMonth);
	    isoDay = ToIntegerWithTruncation(isoDay);
	    calendar = calendar === undefined ? 'iso8601' : RequireString(calendar);
	    if (!IsBuiltinCalendar(calendar)) throw new RangeError(`unknown calendar ${calendar}`);
	    calendar = CanonicalizeCalendar(calendar);
	    referenceISOYear = ToIntegerWithTruncation(referenceISOYear);
	    CreateTemporalMonthDaySlots(this, isoMonth, isoDay, calendar, referenceISOYear);
	  }
	  get monthCode() {
	    if (!IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarMonthCode(GetSlot(this, CALENDAR), isoDate);
	  }
	  get day() {
	    if (!IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarDay(GetSlot(this, CALENDAR), isoDate);
	  }
	  get calendarId() {
	    if (!IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, CALENDAR);
	  }
	  with(temporalMonthDayLike) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
	    if (Type$3(temporalMonthDayLike) !== 'Object') {
	      throw new TypeError('invalid argument');
	    }
	    RejectTemporalLikeObject(temporalMonthDayLike);
	    const calendar = GetSlot(this, CALENDAR);
	    let fields = TemporalObjectToFields(this);
	    const partialMonthDay = PrepareCalendarFields(calendar, temporalMonthDayLike, ['day', 'month', 'monthCode', 'year'], [], 'partial');
	    fields = CalendarMergeFields(calendar, fields, partialMonthDay);
	    const overflow = GetTemporalOverflowOption(GetOptionsObject(options));
	    const {
	      year,
	      month,
	      day
	    } = CalendarMonthDayFromFields(calendar, fields, overflow);
	    return CreateTemporalMonthDay(month, day, calendar, year);
	  }
	  equals(other) {
	    if (!IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
	    other = ToTemporalMonthDay(other);
	    if (GetSlot(this, ISO_YEAR) !== GetSlot(other, ISO_YEAR)) return false;
	    if (GetSlot(this, ISO_MONTH) !== GetSlot(other, ISO_MONTH)) return false;
	    if (GetSlot(this, ISO_DAY) !== GetSlot(other, ISO_DAY)) return false;
	    return CalendarEquals(GetSlot(this, CALENDAR), GetSlot(other, CALENDAR));
	  }
	  toString() {
	    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	    if (!IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
	    options = GetOptionsObject(options);
	    const showCalendar = GetTemporalShowCalendarNameOption(options);
	    return TemporalMonthDayToString(this, showCalendar);
	  }
	  toJSON() {
	    if (!IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
	    return TemporalMonthDayToString(this);
	  }
	  toLocaleString() {
	    let locales = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
	    return new DateTimeFormat(locales, options).format(this);
	  }
	  valueOf() {
	    ValueOfThrows('PlainMonthDay');
	  }
	  toPlainDate(item) {
	    if (!IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
	    if (Type$3(item) !== 'Object') throw new TypeError('argument should be an object');
	    const calendar = GetSlot(this, CALENDAR);
	    const fields = TemporalObjectToFields(this);
	    const inputFields = PrepareCalendarFields(calendar, item, ['year'], [], []);
	    let mergedFields = CalendarMergeFields(calendar, fields, inputFields);
	    const {
	      year,
	      month,
	      day
	    } = CalendarDateFromFields(calendar, mergedFields, 'constrain');
	    return CreateTemporalDate(year, month, day, calendar);
	  }
	  static from(item) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (IsTemporalMonthDay(item)) {
	      GetTemporalOverflowOption(GetOptionsObject(options));
	      return CreateTemporalMonthDay(GetSlot(item, ISO_MONTH), GetSlot(item, ISO_DAY), GetSlot(item, CALENDAR), GetSlot(item, ISO_YEAR));
	    }
	    return ToTemporalMonthDay(item, options);
	  }
	}
	MakeIntrinsicClass(PlainMonthDay, 'Temporal.PlainMonthDay');

	const instant = () => {
	  const Instant = GetIntrinsic('%Temporal.Instant%');
	  return new Instant(SystemUTCEpochNanoSeconds());
	};
	const plainDateTimeISO = function () {
	  let temporalTimeZoneLike = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DefaultTimeZone();
	  const timeZone = ToTemporalTimeZoneIdentifier(temporalTimeZoneLike);
	  const iso = GetISODateTimeFor(timeZone, SystemUTCEpochNanoSeconds());
	  return CreateTemporalDateTime(iso.year, iso.month, iso.day, iso.hour, iso.minute, iso.second, iso.millisecond, iso.microsecond, iso.nanosecond, 'iso8601');
	};
	const zonedDateTimeISO = function () {
	  let temporalTimeZoneLike = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DefaultTimeZone();
	  const timeZone = ToTemporalTimeZoneIdentifier(temporalTimeZoneLike);
	  return CreateTemporalZonedDateTime(SystemUTCEpochNanoSeconds(), timeZone, 'iso8601');
	};
	const plainDateISO = function () {
	  let temporalTimeZoneLike = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DefaultTimeZone();
	  return TemporalDateTimeToDate(plainDateTimeISO(temporalTimeZoneLike));
	};
	const plainTimeISO = function () {
	  let temporalTimeZoneLike = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DefaultTimeZone();
	  return TemporalDateTimeToTime(plainDateTimeISO(temporalTimeZoneLike));
	};
	const timeZoneId = () => {
	  return DefaultTimeZone();
	};
	const Now = {
	  instant,
	  plainDateTimeISO,
	  plainDateISO,
	  plainTimeISO,
	  timeZoneId,
	  zonedDateTimeISO
	};
	Object.defineProperty(Now, Symbol.toStringTag, {
	  value: 'Temporal.Now',
	  writable: false,
	  enumerable: false,
	  configurable: true
	});

	/* global true */

	const ObjectAssign = Object.assign;
	const ObjectCreate$1 = Object.create;
	function TemporalTimeToString(time, precision) {
	  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
	  let hour = GetSlot(time, ISO_HOUR);
	  let minute = GetSlot(time, ISO_MINUTE);
	  let second = GetSlot(time, ISO_SECOND);
	  let millisecond = GetSlot(time, ISO_MILLISECOND);
	  let microsecond = GetSlot(time, ISO_MICROSECOND);
	  let nanosecond = GetSlot(time, ISO_NANOSECOND);
	  if (options) {
	    const {
	      unit,
	      increment,
	      roundingMode
	    } = options;
	    ({
	      hour,
	      minute,
	      second,
	      millisecond,
	      microsecond,
	      nanosecond
	    } = RoundTime(hour, minute, second, millisecond, microsecond, nanosecond, increment, unit, roundingMode));
	  }
	  const subSecondNanoseconds = millisecond * 1e6 + microsecond * 1e3 + nanosecond;
	  return FormatTimeString(hour, minute, second, subSecondNanoseconds, precision);
	}
	class PlainTime {
	  constructor() {
	    let isoHour = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	    let isoMinute = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	    let isoSecond = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
	    let isoMillisecond = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
	    let isoMicrosecond = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
	    let isoNanosecond = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
	    isoHour = isoHour === undefined ? 0 : ToIntegerWithTruncation(isoHour);
	    isoMinute = isoMinute === undefined ? 0 : ToIntegerWithTruncation(isoMinute);
	    isoSecond = isoSecond === undefined ? 0 : ToIntegerWithTruncation(isoSecond);
	    isoMillisecond = isoMillisecond === undefined ? 0 : ToIntegerWithTruncation(isoMillisecond);
	    isoMicrosecond = isoMicrosecond === undefined ? 0 : ToIntegerWithTruncation(isoMicrosecond);
	    isoNanosecond = isoNanosecond === undefined ? 0 : ToIntegerWithTruncation(isoNanosecond);
	    RejectTime(isoHour, isoMinute, isoSecond, isoMillisecond, isoMicrosecond, isoNanosecond);
	    CreateSlots(this);
	    SetSlot(this, ISO_HOUR, isoHour);
	    SetSlot(this, ISO_MINUTE, isoMinute);
	    SetSlot(this, ISO_SECOND, isoSecond);
	    SetSlot(this, ISO_MILLISECOND, isoMillisecond);
	    SetSlot(this, ISO_MICROSECOND, isoMicrosecond);
	    SetSlot(this, ISO_NANOSECOND, isoNanosecond);
	    {
	      Object.defineProperty(this, '_repr_', {
	        value: `${this[Symbol.toStringTag]} <${TemporalTimeToString(this, 'auto')}>`,
	        writable: false,
	        enumerable: false,
	        configurable: false
	      });
	    }
	  }
	  get hour() {
	    if (!IsTemporalTime(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, ISO_HOUR);
	  }
	  get minute() {
	    if (!IsTemporalTime(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, ISO_MINUTE);
	  }
	  get second() {
	    if (!IsTemporalTime(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, ISO_SECOND);
	  }
	  get millisecond() {
	    if (!IsTemporalTime(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, ISO_MILLISECOND);
	  }
	  get microsecond() {
	    if (!IsTemporalTime(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, ISO_MICROSECOND);
	  }
	  get nanosecond() {
	    if (!IsTemporalTime(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, ISO_NANOSECOND);
	  }
	  with(temporalTimeLike) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalTime(this)) throw new TypeError('invalid receiver');
	    if (Type$3(temporalTimeLike) !== 'Object') {
	      throw new TypeError('invalid argument');
	    }
	    RejectTemporalLikeObject(temporalTimeLike);
	    const partialTime = ToTemporalTimeRecord(temporalTimeLike, 'partial');
	    const fields = ToTemporalTimeRecord(this);
	    let {
	      hour,
	      minute,
	      second,
	      millisecond,
	      microsecond,
	      nanosecond
	    } = ObjectAssign(fields, partialTime);
	    const overflow = GetTemporalOverflowOption(GetOptionsObject(options));
	    ({
	      hour,
	      minute,
	      second,
	      millisecond,
	      microsecond,
	      nanosecond
	    } = RegulateTime(hour, minute, second, millisecond, microsecond, nanosecond, overflow));
	    return new PlainTime(hour, minute, second, millisecond, microsecond, nanosecond);
	  }
	  add(temporalDurationLike) {
	    if (!IsTemporalTime(this)) throw new TypeError('invalid receiver');
	    return AddDurationToOrSubtractDurationFromPlainTime('add', this, temporalDurationLike);
	  }
	  subtract(temporalDurationLike) {
	    if (!IsTemporalTime(this)) throw new TypeError('invalid receiver');
	    return AddDurationToOrSubtractDurationFromPlainTime('subtract', this, temporalDurationLike);
	  }
	  until(other) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalTime(this)) throw new TypeError('invalid receiver');
	    return DifferenceTemporalPlainTime('until', this, other, options);
	  }
	  since(other) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalTime(this)) throw new TypeError('invalid receiver');
	    return DifferenceTemporalPlainTime('since', this, other, options);
	  }
	  round(roundTo) {
	    if (!IsTemporalTime(this)) throw new TypeError('invalid receiver');
	    if (roundTo === undefined) throw new TypeError('options parameter is required');
	    if (Type$3(roundTo) === 'String') {
	      const stringParam = roundTo;
	      roundTo = ObjectCreate$1(null);
	      roundTo.smallestUnit = stringParam;
	    } else {
	      roundTo = GetOptionsObject(roundTo);
	    }
	    const roundingIncrement = GetRoundingIncrementOption(roundTo);
	    const roundingMode = GetRoundingModeOption(roundTo, 'halfExpand');
	    const smallestUnit = GetTemporalUnitValuedOption(roundTo, 'smallestUnit', 'time', REQUIRED);
	    const MAX_INCREMENTS = {
	      hour: 24,
	      minute: 60,
	      second: 60,
	      millisecond: 1000,
	      microsecond: 1000,
	      nanosecond: 1000
	    };
	    ValidateTemporalRoundingIncrement(roundingIncrement, MAX_INCREMENTS[smallestUnit], false);
	    let hour = GetSlot(this, ISO_HOUR);
	    let minute = GetSlot(this, ISO_MINUTE);
	    let second = GetSlot(this, ISO_SECOND);
	    let millisecond = GetSlot(this, ISO_MILLISECOND);
	    let microsecond = GetSlot(this, ISO_MICROSECOND);
	    let nanosecond = GetSlot(this, ISO_NANOSECOND);
	    ({
	      hour,
	      minute,
	      second,
	      millisecond,
	      microsecond,
	      nanosecond
	    } = RoundTime(hour, minute, second, millisecond, microsecond, nanosecond, roundingIncrement, smallestUnit, roundingMode));
	    return new PlainTime(hour, minute, second, millisecond, microsecond, nanosecond);
	  }
	  equals(other) {
	    if (!IsTemporalTime(this)) throw new TypeError('invalid receiver');
	    other = ToTemporalTime(other);
	    for (const slot of [ISO_HOUR, ISO_MINUTE, ISO_SECOND, ISO_MILLISECOND, ISO_MICROSECOND, ISO_NANOSECOND]) {
	      const val1 = GetSlot(this, slot);
	      const val2 = GetSlot(other, slot);
	      if (val1 !== val2) return false;
	    }
	    return true;
	  }
	  toString() {
	    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	    if (!IsTemporalTime(this)) throw new TypeError('invalid receiver');
	    options = GetOptionsObject(options);
	    const digits = GetTemporalFractionalSecondDigitsOption(options);
	    const roundingMode = GetRoundingModeOption(options, 'trunc');
	    const smallestUnit = GetTemporalUnitValuedOption(options, 'smallestUnit', 'time', undefined);
	    if (smallestUnit === 'hour') throw new RangeError('smallestUnit must be a time unit other than "hour"');
	    const {
	      precision,
	      unit,
	      increment
	    } = ToSecondsStringPrecisionRecord(smallestUnit, digits);
	    return TemporalTimeToString(this, precision, {
	      unit,
	      increment,
	      roundingMode
	    });
	  }
	  toJSON() {
	    if (!IsTemporalTime(this)) throw new TypeError('invalid receiver');
	    return TemporalTimeToString(this, 'auto');
	  }
	  toLocaleString() {
	    let locales = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalTime(this)) throw new TypeError('invalid receiver');
	    return new DateTimeFormat(locales, options).format(this);
	  }
	  valueOf() {
	    ValueOfThrows('PlainTime');
	  }
	  static from(item) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (IsTemporalTime(item)) {
	      GetTemporalOverflowOption(GetOptionsObject(options));
	      return new PlainTime(GetSlot(item, ISO_HOUR), GetSlot(item, ISO_MINUTE), GetSlot(item, ISO_SECOND), GetSlot(item, ISO_MILLISECOND), GetSlot(item, ISO_MICROSECOND), GetSlot(item, ISO_NANOSECOND));
	    }
	    return ToTemporalTime(item, options);
	  }
	  static compare(one, two) {
	    one = ToTemporalTime(one);
	    two = ToTemporalTime(two);
	    return CompareTemporalTime(GetSlot(one, ISO_HOUR), GetSlot(one, ISO_MINUTE), GetSlot(one, ISO_SECOND), GetSlot(one, ISO_MILLISECOND), GetSlot(one, ISO_MICROSECOND), GetSlot(one, ISO_NANOSECOND), GetSlot(two, ISO_HOUR), GetSlot(two, ISO_MINUTE), GetSlot(two, ISO_SECOND), GetSlot(two, ISO_MILLISECOND), GetSlot(two, ISO_MICROSECOND), GetSlot(two, ISO_NANOSECOND));
	  }
	}
	MakeIntrinsicClass(PlainTime, 'Temporal.PlainTime');

	class PlainYearMonth {
	  constructor(isoYear, isoMonth) {
	    let calendar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'iso8601';
	    let referenceISODay = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
	    isoYear = ToIntegerWithTruncation(isoYear);
	    isoMonth = ToIntegerWithTruncation(isoMonth);
	    calendar = calendar === undefined ? 'iso8601' : RequireString(calendar);
	    if (!IsBuiltinCalendar(calendar)) throw new RangeError(`unknown calendar ${calendar}`);
	    calendar = CanonicalizeCalendar(calendar);
	    referenceISODay = ToIntegerWithTruncation(referenceISODay);
	    CreateTemporalYearMonthSlots(this, isoYear, isoMonth, calendar, referenceISODay);
	  }
	  get year() {
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarYear(GetSlot(this, CALENDAR), isoDate);
	  }
	  get month() {
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarMonth(GetSlot(this, CALENDAR), isoDate);
	  }
	  get monthCode() {
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarMonthCode(GetSlot(this, CALENDAR), isoDate);
	  }
	  get calendarId() {
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, CALENDAR);
	  }
	  get era() {
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarEra(GetSlot(this, CALENDAR), isoDate);
	  }
	  get eraYear() {
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarEraYear(GetSlot(this, CALENDAR), isoDate);
	  }
	  get daysInMonth() {
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarDaysInMonth(GetSlot(this, CALENDAR), isoDate);
	  }
	  get daysInYear() {
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarDaysInYear(GetSlot(this, CALENDAR), isoDate);
	  }
	  get monthsInYear() {
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarMonthsInYear(GetSlot(this, CALENDAR), isoDate);
	  }
	  get inLeapYear() {
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    const isoDate = TemporalObjectToISODateRecord(this);
	    return CalendarInLeapYear(GetSlot(this, CALENDAR), isoDate);
	  }
	  with(temporalYearMonthLike) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    if (Type$3(temporalYearMonthLike) !== 'Object') {
	      throw new TypeError('invalid argument');
	    }
	    RejectTemporalLikeObject(temporalYearMonthLike);
	    const calendar = GetSlot(this, CALENDAR);
	    let fields = TemporalObjectToFields(this);
	    const partialYearMonth = PrepareCalendarFields(calendar, temporalYearMonthLike, ['month', 'monthCode', 'year'], [], 'partial');
	    fields = CalendarMergeFields(calendar, fields, partialYearMonth);
	    const overflow = GetTemporalOverflowOption(GetOptionsObject(options));
	    const {
	      year,
	      month,
	      day
	    } = CalendarYearMonthFromFields(calendar, fields, overflow);
	    return CreateTemporalYearMonth(year, month, calendar, day);
	  }
	  add(temporalDurationLike) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    return AddDurationToOrSubtractDurationFromPlainYearMonth('add', this, temporalDurationLike, options);
	  }
	  subtract(temporalDurationLike) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    return AddDurationToOrSubtractDurationFromPlainYearMonth('subtract', this, temporalDurationLike, options);
	  }
	  until(other) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    return DifferenceTemporalPlainYearMonth('until', this, other, options);
	  }
	  since(other) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    return DifferenceTemporalPlainYearMonth('since', this, other, options);
	  }
	  equals(other) {
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    other = ToTemporalYearMonth(other);
	    if (GetSlot(this, ISO_YEAR) !== GetSlot(other, ISO_YEAR)) return false;
	    if (GetSlot(this, ISO_MONTH) !== GetSlot(other, ISO_MONTH)) return false;
	    if (GetSlot(this, ISO_DAY) !== GetSlot(other, ISO_DAY)) return false;
	    return CalendarEquals(GetSlot(this, CALENDAR), GetSlot(other, CALENDAR));
	  }
	  toString() {
	    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    options = GetOptionsObject(options);
	    const showCalendar = GetTemporalShowCalendarNameOption(options);
	    return TemporalYearMonthToString(this, showCalendar);
	  }
	  toJSON() {
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    return TemporalYearMonthToString(this);
	  }
	  toLocaleString() {
	    let locales = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    return new DateTimeFormat(locales, options).format(this);
	  }
	  valueOf() {
	    ValueOfThrows('PlainYearMonth');
	  }
	  toPlainDate(item) {
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    if (Type$3(item) !== 'Object') throw new TypeError('argument should be an object');
	    const calendar = GetSlot(this, CALENDAR);
	    const fields = TemporalObjectToFields(this);
	    const inputFields = PrepareCalendarFields(calendar, item, ['day'], [], []);
	    const mergedFields = CalendarMergeFields(calendar, fields, inputFields);
	    const {
	      year,
	      month,
	      day
	    } = CalendarDateFromFields(calendar, mergedFields, 'constrain');
	    return CreateTemporalDate(year, month, day, calendar);
	  }
	  static from(item) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (IsTemporalYearMonth(item)) {
	      GetTemporalOverflowOption(GetOptionsObject(options));
	      return CreateTemporalYearMonth(GetSlot(item, ISO_YEAR), GetSlot(item, ISO_MONTH), GetSlot(item, CALENDAR), GetSlot(item, ISO_DAY));
	    }
	    return ToTemporalYearMonth(item, options);
	  }
	  static compare(one, two) {
	    one = ToTemporalYearMonth(one);
	    two = ToTemporalYearMonth(two);
	    return CompareISODate(GetSlot(one, ISO_YEAR), GetSlot(one, ISO_MONTH), GetSlot(one, ISO_DAY), GetSlot(two, ISO_YEAR), GetSlot(two, ISO_MONTH), GetSlot(two, ISO_DAY));
	  }
	}
	MakeIntrinsicClass(PlainYearMonth, 'Temporal.PlainYearMonth');

	const customResolvedOptions = DateTimeFormat.prototype.resolvedOptions;
	const ObjectCreate = Object.create;
	class ZonedDateTime {
	  constructor(epochNanoseconds, timeZone) {
	    let calendar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'iso8601';
	    // Note: if the argument is not passed, ToBigInt(undefined) will throw. This check exists only
	    //       to improve the error message.
	    if (arguments.length < 1) {
	      throw new TypeError('missing argument: epochNanoseconds is required');
	    }
	    epochNanoseconds = ToBigInt(epochNanoseconds);
	    timeZone = RequireString(timeZone);
	    const {
	      tzName,
	      offsetMinutes
	    } = ParseTimeZoneIdentifier(timeZone);
	    if (offsetMinutes === undefined) {
	      // if offsetMinutes is undefined, then tzName must be present
	      const record = GetAvailableNamedTimeZoneIdentifier(tzName);
	      if (!record) throw new RangeError(`unknown time zone ${tzName}`);
	      timeZone = record.identifier;
	    } else {
	      timeZone = FormatOffsetTimeZoneIdentifier(offsetMinutes);
	    }
	    calendar = calendar === undefined ? 'iso8601' : RequireString(calendar);
	    if (!IsBuiltinCalendar(calendar)) throw new RangeError(`unknown calendar ${calendar}`);
	    calendar = CanonicalizeCalendar(calendar);
	    CreateTemporalZonedDateTimeSlots(this, epochNanoseconds, timeZone, calendar);
	  }
	  get calendarId() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, CALENDAR);
	  }
	  get timeZoneId() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, TIME_ZONE);
	  }
	  get year() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarYear(GetSlot(this, CALENDAR), dateTime(this));
	  }
	  get month() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarMonth(GetSlot(this, CALENDAR), dateTime(this));
	  }
	  get monthCode() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarMonthCode(GetSlot(this, CALENDAR), dateTime(this));
	  }
	  get day() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarDay(GetSlot(this, CALENDAR), dateTime(this));
	  }
	  get hour() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return dateTime(this).hour;
	  }
	  get minute() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return dateTime(this).minute;
	  }
	  get second() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return dateTime(this).second;
	  }
	  get millisecond() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return dateTime(this).millisecond;
	  }
	  get microsecond() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return dateTime(this).microsecond;
	  }
	  get nanosecond() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return dateTime(this).nanosecond;
	  }
	  get era() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarEra(GetSlot(this, CALENDAR), dateTime(this));
	  }
	  get eraYear() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarEraYear(GetSlot(this, CALENDAR), dateTime(this));
	  }
	  get epochMilliseconds() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    const value = GetSlot(this, EPOCHNANOSECONDS);
	    return BigIntFloorDiv(value, 1e6).toJSNumber();
	  }
	  get epochNanoseconds() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return BigIntIfAvailable(GetSlot(this, EPOCHNANOSECONDS));
	  }
	  get dayOfWeek() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarDayOfWeek(GetSlot(this, CALENDAR), dateTime(this));
	  }
	  get dayOfYear() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarDayOfYear(GetSlot(this, CALENDAR), dateTime(this));
	  }
	  get weekOfYear() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarWeekOfYear(GetSlot(this, CALENDAR), dateTime(this));
	  }
	  get yearOfWeek() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarYearOfWeek(GetSlot(this, CALENDAR), dateTime(this));
	  }
	  get hoursInDay() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    const timeZone = GetSlot(this, TIME_ZONE);
	    const {
	      year,
	      month,
	      day
	    } = GetISODateTimeFor(timeZone, GetSlot(this, EPOCHNANOSECONDS));
	    const today = {
	      year,
	      month,
	      day
	    };
	    const tomorrow = BalanceISODate(year, month, day + 1);
	    const todayNs = GetStartOfDay(timeZone, today);
	    const tomorrowNs = GetStartOfDay(timeZone, tomorrow);
	    const diff = TimeDuration.fromEpochNsDiff(tomorrowNs, todayNs);
	    return diff.fdiv(3.6e12);
	  }
	  get daysInWeek() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarDaysInWeek(GetSlot(this, CALENDAR), dateTime(this));
	  }
	  get daysInMonth() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarDaysInMonth(GetSlot(this, CALENDAR), dateTime(this));
	  }
	  get daysInYear() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarDaysInYear(GetSlot(this, CALENDAR), dateTime(this));
	  }
	  get monthsInYear() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarMonthsInYear(GetSlot(this, CALENDAR), dateTime(this));
	  }
	  get inLeapYear() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarInLeapYear(GetSlot(this, CALENDAR), dateTime(this));
	  }
	  get offset() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    const offsetNs = GetOffsetNanosecondsFor(GetSlot(this, TIME_ZONE), GetSlot(this, EPOCHNANOSECONDS));
	    return FormatUTCOffsetNanoseconds(offsetNs);
	  }
	  get offsetNanoseconds() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return GetOffsetNanosecondsFor(GetSlot(this, TIME_ZONE), GetSlot(this, EPOCHNANOSECONDS));
	  }
	  with(temporalZonedDateTimeLike) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    if (Type$3(temporalZonedDateTimeLike) !== 'Object') {
	      throw new TypeError('invalid zoned-date-time-like');
	    }
	    RejectTemporalLikeObject(temporalZonedDateTimeLike);
	    const calendar = GetSlot(this, CALENDAR);
	    const timeZone = GetSlot(this, TIME_ZONE);
	    const epochNs = GetSlot(this, EPOCHNANOSECONDS);
	    const offsetNs = GetOffsetNanosecondsFor(timeZone, epochNs);
	    const isoDateTime = GetISODateTimeFor(timeZone, epochNs);
	    let fields = ISODateToFields(calendar, isoDateTime);
	    fields.hour = isoDateTime.hour;
	    fields.minute = isoDateTime.minute;
	    fields.second = isoDateTime.second;
	    fields.millisecond = isoDateTime.millisecond;
	    fields.microsecond = isoDateTime.microsecond;
	    fields.nanosecond = isoDateTime.nanosecond;
	    fields.offset = FormatUTCOffsetNanoseconds(offsetNs);
	    const partialZonedDateTime = PrepareCalendarFields(calendar, temporalZonedDateTimeLike, ['day', 'month', 'monthCode', 'year'], ['hour', 'microsecond', 'millisecond', 'minute', 'nanosecond', 'offset', 'second'], 'partial');
	    fields = CalendarMergeFields(calendar, fields, partialZonedDateTime);
	    const resolvedOptions = GetOptionsObject(options);
	    const disambiguation = GetTemporalDisambiguationOption(resolvedOptions);
	    const offset = GetTemporalOffsetOption(resolvedOptions, 'prefer');
	    const overflow = GetTemporalOverflowOption(resolvedOptions);
	    const {
	      year,
	      month,
	      day,
	      time
	    } = InterpretTemporalDateTimeFields(calendar, fields, overflow);
	    const newOffsetNs = ParseDateTimeUTCOffset(fields.offset);
	    const epochNanoseconds = InterpretISODateTimeOffset(year, month, day, time, 'option', newOffsetNs, timeZone, disambiguation, offset, /* matchMinute = */false);
	    return CreateTemporalZonedDateTime(epochNanoseconds, timeZone, calendar);
	  }
	  withPlainTime() {
	    let temporalTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    const timeZone = GetSlot(this, TIME_ZONE);
	    const calendar = GetSlot(this, CALENDAR);
	    const iso = GetISODateTimeFor(timeZone, GetSlot(this, EPOCHNANOSECONDS));
	    let epochNs;
	    if (temporalTime === undefined) {
	      epochNs = GetStartOfDay(timeZone, iso);
	    } else {
	      temporalTime = ToTemporalTime(temporalTime);
	      const time = {
	        hour: GetSlot(temporalTime, ISO_HOUR),
	        minute: GetSlot(temporalTime, ISO_MINUTE),
	        second: GetSlot(temporalTime, ISO_SECOND),
	        millisecond: GetSlot(temporalTime, ISO_MILLISECOND),
	        microsecond: GetSlot(temporalTime, ISO_MICROSECOND),
	        nanosecond: GetSlot(temporalTime, ISO_NANOSECOND)
	      };
	      const dt = CombineISODateAndTimeRecord(iso, time);
	      epochNs = GetEpochNanosecondsFor(timeZone, dt, 'compatible');
	    }
	    return CreateTemporalZonedDateTime(epochNs, timeZone, calendar);
	  }
	  withTimeZone(timeZone) {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    timeZone = ToTemporalTimeZoneIdentifier(timeZone);
	    return CreateTemporalZonedDateTime(GetSlot(this, EPOCHNANOSECONDS), timeZone, GetSlot(this, CALENDAR));
	  }
	  withCalendar(calendar) {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    calendar = ToTemporalCalendarIdentifier(calendar);
	    return CreateTemporalZonedDateTime(GetSlot(this, EPOCHNANOSECONDS), GetSlot(this, TIME_ZONE), calendar);
	  }
	  add(temporalDurationLike) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return AddDurationToOrSubtractDurationFromZonedDateTime('add', this, temporalDurationLike, options);
	  }
	  subtract(temporalDurationLike) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return AddDurationToOrSubtractDurationFromZonedDateTime('subtract', this, temporalDurationLike, options);
	  }
	  until(other) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return DifferenceTemporalZonedDateTime('until', this, other, options);
	  }
	  since(other) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return DifferenceTemporalZonedDateTime('since', this, other, options);
	  }
	  round(roundTo) {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    if (roundTo === undefined) throw new TypeError('options parameter is required');
	    if (Type$3(roundTo) === 'String') {
	      const stringParam = roundTo;
	      roundTo = ObjectCreate(null);
	      roundTo.smallestUnit = stringParam;
	    } else {
	      roundTo = GetOptionsObject(roundTo);
	    }
	    const roundingIncrement = GetRoundingIncrementOption(roundTo);
	    const roundingMode = GetRoundingModeOption(roundTo, 'halfExpand');
	    const smallestUnit = GetTemporalUnitValuedOption(roundTo, 'smallestUnit', 'time', REQUIRED, ['day']);
	    const maximumIncrements = {
	      day: 1,
	      hour: 24,
	      minute: 60,
	      second: 60,
	      millisecond: 1000,
	      microsecond: 1000,
	      nanosecond: 1000
	    };
	    const maximum = maximumIncrements[smallestUnit];
	    const inclusive = maximum === 1;
	    ValidateTemporalRoundingIncrement(roundingIncrement, maximum, inclusive);
	    if (smallestUnit === 'nanosecond' && roundingIncrement === 1) {
	      return CreateTemporalZonedDateTime(GetSlot(this, EPOCHNANOSECONDS), GetSlot(this, TIME_ZONE), GetSlot(this, CALENDAR));
	    }

	    // first, round the underlying DateTime fields
	    const timeZone = GetSlot(this, TIME_ZONE);
	    const thisNs = GetSlot(this, EPOCHNANOSECONDS);
	    const iso = GetISODateTimeFor(timeZone, thisNs);
	    let epochNanoseconds;
	    if (smallestUnit === 'day') {
	      // Compute Instants for start-of-day and end-of-day
	      // Determine how far the current instant has progressed through this span.
	      const {
	        year,
	        month,
	        day
	      } = iso;
	      const dtStart = {
	        year,
	        month,
	        day
	      };
	      const dtEnd = BalanceISODate(year, month, day + 1);
	      const startNs = GetStartOfDay(timeZone, dtStart);
	      if (thisNs.lesser(startNs)) {
	        throw new Error('assertion failure: cannot produce an instant during a day that ' + 'occurs before another instant it deems start-of-day');
	      }
	      const endNs = GetStartOfDay(timeZone, dtEnd);
	      if (thisNs.greaterOrEquals(endNs)) {
	        throw new Error('assertion failure: cannot produce an instant during a day that ' + 'occurs on or after another instant it deems end-of-day');
	      }
	      const dayLengthNs = endNs.subtract(startNs);
	      const dayProgressNs = TimeDuration.fromEpochNsDiff(thisNs, startNs);
	      epochNanoseconds = dayProgressNs.round(dayLengthNs, roundingMode).add(new TimeDuration(startNs)).totalNs;
	    } else {
	      // smallestUnit < day
	      // Round based on ISO-calendar time units
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
	      } = RoundISODateTime(iso.year, iso.month, iso.day, iso.hour, iso.minute, iso.second, iso.millisecond, iso.microsecond, iso.nanosecond, roundingIncrement, smallestUnit, roundingMode);

	      // Now reset all DateTime fields but leave the TimeZone. The offset will
	      // also be retained if the new date/time values are still OK with the old
	      // offset. Otherwise the offset will be changed to be compatible with the
	      // new date/time values. If DST disambiguation is required, the `compatible`
	      // disambiguation algorithm will be used.
	      const offsetNs = GetOffsetNanosecondsFor(timeZone, thisNs);
	      epochNanoseconds = InterpretISODateTimeOffset(year, month, day, {
	        hour,
	        minute,
	        second,
	        millisecond,
	        microsecond,
	        nanosecond
	      }, 'option', offsetNs, timeZone, 'compatible', 'prefer', /* matchMinute = */false);
	    }
	    return CreateTemporalZonedDateTime(epochNanoseconds, timeZone, GetSlot(this, CALENDAR));
	  }
	  equals(other) {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    other = ToTemporalZonedDateTime(other);
	    const one = GetSlot(this, EPOCHNANOSECONDS);
	    const two = GetSlot(other, EPOCHNANOSECONDS);
	    if (!bigInt(one).equals(two)) return false;
	    if (!TimeZoneEquals(GetSlot(this, TIME_ZONE), GetSlot(other, TIME_ZONE))) return false;
	    return CalendarEquals(GetSlot(this, CALENDAR), GetSlot(other, CALENDAR));
	  }
	  toString() {
	    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    options = GetOptionsObject(options);
	    const showCalendar = GetTemporalShowCalendarNameOption(options);
	    const digits = GetTemporalFractionalSecondDigitsOption(options);
	    const showOffset = GetTemporalShowOffsetOption(options);
	    const roundingMode = GetRoundingModeOption(options, 'trunc');
	    const smallestUnit = GetTemporalUnitValuedOption(options, 'smallestUnit', 'time', undefined);
	    if (smallestUnit === 'hour') throw new RangeError('smallestUnit must be a time unit other than "hour"');
	    const showTimeZone = GetTemporalShowTimeZoneNameOption(options);
	    const {
	      precision,
	      unit,
	      increment
	    } = ToSecondsStringPrecisionRecord(smallestUnit, digits);
	    return TemporalZonedDateTimeToString(this, precision, showCalendar, showTimeZone, showOffset, {
	      unit,
	      increment,
	      roundingMode
	    });
	  }
	  toLocaleString() {
	    let locales = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    options = GetOptionsObject(options);

	    // This is not quite per specification, but this polyfill's DateTimeFormat
	    // already doesn't match the InitializeDateTimeFormat operation, and the
	    // access order might change anyway;
	    // see https://github.com/tc39/ecma402/issues/747
	    const optionsCopy = ObjectCreate(null);
	    CopyDataProperties$1(optionsCopy, options, ['timeZone']);
	    if (options.timeZone !== undefined) {
	      throw new TypeError('ZonedDateTime toLocaleString does not accept a timeZone option');
	    }
	    if (optionsCopy.year === undefined && optionsCopy.month === undefined && optionsCopy.day === undefined && optionsCopy.weekday === undefined && optionsCopy.dateStyle === undefined && optionsCopy.hour === undefined && optionsCopy.minute === undefined && optionsCopy.second === undefined && optionsCopy.timeStyle === undefined && optionsCopy.dayPeriod === undefined && optionsCopy.timeZoneName === undefined) {
	      optionsCopy.timeZoneName = 'short';
	      // The rest of the defaults will be filled in by formatting the Instant
	    }
	    const timeZoneIdentifier = GetSlot(this, TIME_ZONE);
	    if (IsOffsetTimeZoneIdentifier(timeZoneIdentifier)) {
	      // Note: https://github.com/tc39/ecma402/issues/683 will remove this
	      throw new RangeError('toLocaleString does not currently support offset time zones');
	    } else {
	      const record = GetAvailableNamedTimeZoneIdentifier(timeZoneIdentifier);
	      if (!record) throw new RangeError(`toLocaleString formats built-in time zones, not ${timeZoneIdentifier}`);
	      optionsCopy.timeZone = record.identifier;
	    }
	    const formatter = new DateTimeFormat(locales, optionsCopy);
	    const localeCalendarIdentifier = Call$1(customResolvedOptions, formatter, []).calendar;
	    const calendarIdentifier = GetSlot(this, CALENDAR);
	    if (calendarIdentifier !== 'iso8601' && localeCalendarIdentifier !== 'iso8601' && !CalendarEquals(localeCalendarIdentifier, calendarIdentifier)) {
	      throw new RangeError(`cannot format ZonedDateTime with calendar ${calendarIdentifier}` + ` in locale with calendar ${localeCalendarIdentifier}`);
	    }
	    const Instant = GetIntrinsic('%Temporal.Instant%');
	    return formatter.format(new Instant(GetSlot(this, EPOCHNANOSECONDS)));
	  }
	  toJSON() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return TemporalZonedDateTimeToString(this, 'auto');
	  }
	  valueOf() {
	    ValueOfThrows('ZonedDateTime');
	  }
	  startOfDay() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    const timeZone = GetSlot(this, TIME_ZONE);
	    const calendar = GetSlot(this, CALENDAR);
	    const {
	      year,
	      month,
	      day
	    } = GetISODateTimeFor(timeZone, GetSlot(this, EPOCHNANOSECONDS));
	    const epochNanoseconds = GetStartOfDay(timeZone, {
	      year,
	      month,
	      day
	    });
	    return CreateTemporalZonedDateTime(epochNanoseconds, timeZone, calendar);
	  }
	  getTimeZoneTransition(directionParam) {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    const timeZone = GetSlot(this, TIME_ZONE);
	    if (directionParam === undefined) throw new TypeError('options parameter is required');
	    if (Type$3(directionParam) === 'String') {
	      const stringParam = directionParam;
	      directionParam = ObjectCreate(null);
	      directionParam.direction = stringParam;
	    } else {
	      directionParam = GetOptionsObject(directionParam);
	    }
	    const direction = GetDirectionOption(directionParam);
	    if (direction === undefined) throw new TypeError('direction option is required');

	    // Offset time zones or UTC have no transitions
	    if (IsOffsetTimeZoneIdentifier(timeZone) || timeZone === 'UTC') {
	      return null;
	    }
	    const thisEpochNanoseconds = GetSlot(this, EPOCHNANOSECONDS);
	    const epochNanoseconds = direction === 'next' ? GetNamedTimeZoneNextTransition(timeZone, thisEpochNanoseconds) : GetNamedTimeZonePreviousTransition(timeZone, thisEpochNanoseconds);
	    return epochNanoseconds === null ? null : new ZonedDateTime(epochNanoseconds, timeZone, GetSlot(this, CALENDAR));
	  }
	  toInstant() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
	    return new TemporalInstant(GetSlot(this, EPOCHNANOSECONDS));
	  }
	  toPlainDate() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    const {
	      year,
	      month,
	      day
	    } = dateTime(this);
	    return CreateTemporalDate(year, month, day, GetSlot(this, CALENDAR));
	  }
	  toPlainTime() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    const {
	      hour,
	      minute,
	      second,
	      millisecond,
	      microsecond,
	      nanosecond
	    } = dateTime(this);
	    const PlainTime = GetIntrinsic('%Temporal.PlainTime%');
	    return new PlainTime(hour, minute, second, millisecond, microsecond, nanosecond);
	  }
	  toPlainDateTime() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    const isoDateTime = dateTime(this);
	    return CreateTemporalDateTime(isoDateTime.year, isoDateTime.month, isoDateTime.day, isoDateTime.hour, isoDateTime.minute, isoDateTime.second, isoDateTime.millisecond, isoDateTime.microsecond, isoDateTime.nanosecond, GetSlot(this, CALENDAR));
	  }
	  static from(item) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (IsTemporalZonedDateTime(item)) {
	      options = GetOptionsObject(options);
	      GetTemporalDisambiguationOption(options); // validate and ignore
	      GetTemporalOffsetOption(options, 'reject');
	      GetTemporalOverflowOption(options);
	      return CreateTemporalZonedDateTime(GetSlot(item, EPOCHNANOSECONDS), GetSlot(item, TIME_ZONE), GetSlot(item, CALENDAR));
	    }
	    return ToTemporalZonedDateTime(item, options);
	  }
	  static compare(one, two) {
	    one = ToTemporalZonedDateTime(one);
	    two = ToTemporalZonedDateTime(two);
	    const ns1 = GetSlot(one, EPOCHNANOSECONDS);
	    const ns2 = GetSlot(two, EPOCHNANOSECONDS);
	    if (bigInt(ns1).lesser(ns2)) return -1;
	    if (bigInt(ns1).greater(ns2)) return 1;
	    return 0;
	  }
	}
	MakeIntrinsicClass(ZonedDateTime, 'Temporal.ZonedDateTime');
	function dateTime(zdt) {
	  return GetISODateTimeFor(GetSlot(zdt, TIME_ZONE), GetSlot(zdt, EPOCHNANOSECONDS));
	}

	/* global false */

	{
	  // eslint-disable-next-line no-console
	  console.warn('This polyfill should only be used to run tests or to experiment in the browser devtools console.\n' + 'To polyfill Temporal in your own projects, see https://github.com/tc39/proposal-temporal#polyfills.');
	}

	var Temporal = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Duration: Duration,
		Instant: Instant,
		Now: Now,
		PlainDate: PlainDate,
		PlainDateTime: PlainDateTime,
		PlainMonthDay: PlainMonthDay,
		PlainTime: PlainTime,
		PlainYearMonth: PlainYearMonth,
		ZonedDateTime: ZonedDateTime
	});

	const DatePrototypeValueOf = Date.prototype.valueOf;
	function toTemporalInstant() {
	  const epochNanoseconds = bigInt(Call$1(DatePrototypeValueOf, this, [])).multiply(1e6);
	  return new Instant(BigIntIfAvailable(epochNanoseconds));
	}

	// This is an alternate entry point that polyfills Temporal onto the global
	// object. This is used only for the browser playground and the test262 tests.
	// See the note in index.mjs.

	Object.defineProperty(globalThis, 'Temporal', {
	  value: {},
	  writable: true,
	  enumerable: false,
	  configurable: true
	});
	copy(globalThis.Temporal, Temporal);
	Object.defineProperty(globalThis.Temporal, Symbol.toStringTag, {
	  value: 'Temporal',
	  writable: false,
	  enumerable: false,
	  configurable: true
	});
	copy(globalThis.Temporal.Now, Now);
	copy(globalThis.Intl, Intl$1);
	Object.defineProperty(globalThis.Date.prototype, 'toTemporalInstant', {
	  value: toTemporalInstant,
	  writable: true,
	  enumerable: false,
	  configurable: true
	});
	function copy(target, source) {
	  for (const prop of Object.getOwnPropertyNames(source)) {
	    Object.defineProperty(target, prop, {
	      value: source[prop],
	      writable: true,
	      enumerable: false,
	      configurable: true
	    });
	  }
	}

	// Work around https://github.com/babel/babel/issues/2025.
	const types = [globalThis.Temporal.Instant, globalThis.Temporal.PlainDate, globalThis.Temporal.PlainDateTime, globalThis.Temporal.Duration, globalThis.Temporal.PlainMonthDay,
	// globalThis.Temporal.Now, // plain object (not a constructor), so no `prototype`
	globalThis.Temporal.PlainTime, globalThis.Temporal.PlainYearMonth, globalThis.Temporal.ZonedDateTime];
	for (const type of types) {
	  const descriptor = Object.getOwnPropertyDescriptor(type, 'prototype');
	  if (descriptor.configurable || descriptor.enumerable || descriptor.writable) {
	    descriptor.configurable = false;
	    descriptor.enumerable = false;
	    descriptor.writable = false;
	    Object.defineProperty(type, 'prototype', descriptor);
	  }
	}

	exports.Intl = Intl$1;
	exports.Temporal = Temporal;
	exports.toTemporalInstant = toTemporalInstant;

}));
//# sourceMappingURL=playground.js.map
