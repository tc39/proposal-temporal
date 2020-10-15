(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.temporal = {}));
}(this, (function (exports) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = o[Symbol.iterator]();
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, basedir, module) {
  	return module = {
  		path: basedir,
  		exports: {},
  		require: function (path, base) {
  			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
  		}
  	}, fn(module, module.exports), module.exports;
  }

  function commonjsRequire () {
  	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
  }

  var BigInteger = createCommonjsModule(function (module) {
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
              var top = restricted ? digits[i] : BASE;
              var digit = truncate(usedRNG() * top);
              result.push(digit);
              if (digit < top) restricted = false;
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
          if (radix !== 10) return toBaseString(this, radix, alphabet);
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
          if (radix != 10) return toBaseString(this, radix, alphabet);
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
  if ( module.hasOwnProperty("exports")) {
      module.exports = bigInt;
  }
  });

  /* eslint complexity: [2, 18], max-statements: [2, 33] */
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

  var origSymbol = commonjsGlobal.Symbol;


  var hasSymbols = function hasNativeSymbols() {
  	if (typeof origSymbol !== 'function') { return false; }
  	if (typeof Symbol !== 'function') { return false; }
  	if (typeof origSymbol('foo') !== 'symbol') { return false; }
  	if (typeof Symbol('bar') !== 'symbol') { return false; }

  	return shams();
  };

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

  var src = functionBind.call(Function.call, Object.prototype.hasOwnProperty);

  /* globals
  	AggregateError,
  	Atomics,
  	FinalizationRegistry,
  	SharedArrayBuffer,
  	WeakRef,
  */

  var undefined$1;

  var $SyntaxError = SyntaxError;
  var $Function = Function;
  var $TypeError = TypeError;

  // eslint-disable-next-line consistent-return
  var getEvalledConstructor = function (expressionSyntax) {
  	try {
  		// eslint-disable-next-line no-new-func
  		return Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
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

  var throwTypeError = function () { throw new $TypeError(); };
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

  var hasSymbols$1 = hasSymbols();

  var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto

  var asyncGenFunction = getEvalledConstructor('async function* () {}');
  var asyncGenFunctionPrototype = asyncGenFunction ? asyncGenFunction.prototype : undefined$1;
  var asyncGenPrototype = asyncGenFunctionPrototype ? asyncGenFunctionPrototype.prototype : undefined$1;

  var TypedArray = typeof Uint8Array === 'undefined' ? undefined$1 : getProto(Uint8Array);

  var INTRINSICS = {
  	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined$1 : AggregateError,
  	'%Array%': Array,
  	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined$1 : ArrayBuffer,
  	'%ArrayIteratorPrototype%': hasSymbols$1 ? getProto([][Symbol.iterator]()) : undefined$1,
  	'%AsyncFromSyncIteratorPrototype%': undefined$1,
  	'%AsyncFunction%': getEvalledConstructor('async function () {}'),
  	'%AsyncGenerator%': asyncGenFunctionPrototype,
  	'%AsyncGeneratorFunction%': asyncGenFunction,
  	'%AsyncIteratorPrototype%': asyncGenPrototype ? getProto(asyncGenPrototype) : undefined$1,
  	'%Atomics%': typeof Atomics === 'undefined' ? undefined$1 : Atomics,
  	'%BigInt%': typeof BigInt === 'undefined' ? undefined$1 : BigInt,
  	'%Boolean%': Boolean,
  	'%DataView%': typeof DataView === 'undefined' ? undefined$1 : DataView,
  	'%Date%': Date,
  	'%decodeURI%': decodeURI,
  	'%decodeURIComponent%': decodeURIComponent,
  	'%encodeURI%': encodeURI,
  	'%encodeURIComponent%': encodeURIComponent,
  	'%Error%': Error,
  	'%eval%': eval, // eslint-disable-line no-eval
  	'%EvalError%': EvalError,
  	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined$1 : Float32Array,
  	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined$1 : Float64Array,
  	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined$1 : FinalizationRegistry,
  	'%Function%': $Function,
  	'%GeneratorFunction%': getEvalledConstructor('function* () {}'),
  	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined$1 : Int8Array,
  	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined$1 : Int16Array,
  	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined$1 : Int32Array,
  	'%isFinite%': isFinite,
  	'%isNaN%': isNaN,
  	'%IteratorPrototype%': hasSymbols$1 ? getProto(getProto([][Symbol.iterator]())) : undefined$1,
  	'%JSON%': typeof JSON === 'object' ? JSON : undefined$1,
  	'%Map%': typeof Map === 'undefined' ? undefined$1 : Map,
  	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols$1 ? undefined$1 : getProto(new Map()[Symbol.iterator]()),
  	'%Math%': Math,
  	'%Number%': Number,
  	'%Object%': Object,
  	'%parseFloat%': parseFloat,
  	'%parseInt%': parseInt,
  	'%Promise%': typeof Promise === 'undefined' ? undefined$1 : Promise,
  	'%Proxy%': typeof Proxy === 'undefined' ? undefined$1 : Proxy,
  	'%RangeError%': RangeError,
  	'%ReferenceError%': ReferenceError,
  	'%Reflect%': typeof Reflect === 'undefined' ? undefined$1 : Reflect,
  	'%RegExp%': RegExp,
  	'%Set%': typeof Set === 'undefined' ? undefined$1 : Set,
  	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols$1 ? undefined$1 : getProto(new Set()[Symbol.iterator]()),
  	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined$1 : SharedArrayBuffer,
  	'%String%': String,
  	'%StringIteratorPrototype%': hasSymbols$1 ? getProto(''[Symbol.iterator]()) : undefined$1,
  	'%Symbol%': hasSymbols$1 ? Symbol : undefined$1,
  	'%SyntaxError%': $SyntaxError,
  	'%ThrowTypeError%': ThrowTypeError,
  	'%TypedArray%': TypedArray,
  	'%TypeError%': $TypeError,
  	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined$1 : Uint8Array,
  	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined$1 : Uint8ClampedArray,
  	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined$1 : Uint16Array,
  	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined$1 : Uint32Array,
  	'%URIError%': URIError,
  	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined$1 : WeakMap,
  	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined$1 : WeakRef,
  	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined$1 : WeakSet
  };

  var LEGACY_ALIASES = {
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



  var $concat = functionBind.call(Function.call, Array.prototype.concat);
  var $spliceApply = functionBind.call(Function.apply, Array.prototype.splice);
  var $replace = functionBind.call(Function.call, String.prototype.replace);

  /* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
  var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
  var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
  var stringToPath = function stringToPath(string) {
  	var result = [];
  	$replace(string, rePropName, function (match, number, quote, subString) {
  		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
  	});
  	return result;
  };
  /* end adaptation */

  var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
  	var intrinsicName = name;
  	var alias;
  	if (src(LEGACY_ALIASES, intrinsicName)) {
  		alias = LEGACY_ALIASES[intrinsicName];
  		intrinsicName = '%' + alias[0] + '%';
  	}

  	if (src(INTRINSICS, intrinsicName)) {
  		var value = INTRINSICS[intrinsicName];
  		if (typeof value === 'undefined' && !allowMissing) {
  			throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
  		}

  		return {
  			alias: alias,
  			name: intrinsicName,
  			value: value
  		};
  	}

  	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
  };

  var GetIntrinsic = function GetIntrinsic(name, allowMissing) {
  	if (typeof name !== 'string' || name.length === 0) {
  		throw new $TypeError('intrinsic name must be a non-empty string');
  	}
  	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
  		throw new $TypeError('"allowMissing" argument must be a boolean');
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
  		$spliceApply(parts, $concat([0, 1], alias));
  	}

  	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
  		var part = parts[i];
  		if (part === 'constructor' || !isOwn) {
  			skipFurtherCaching = true;
  		}

  		intrinsicBaseName += '.' + part;
  		intrinsicRealName = '%' + intrinsicBaseName + '%';

  		if (src(INTRINSICS, intrinsicRealName)) {
  			value = INTRINSICS[intrinsicRealName];
  		} else if (value != null) {
  			if ($gOPD && (i + 1) >= parts.length) {
  				var desc = $gOPD(value, part);
  				isOwn = !!desc;

  				if (!allowMissing && !(part in value)) {
  					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
  				}
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
  				isOwn = src(value, part);
  				value = value[part];
  			}

  			if (isOwn && !skipFurtherCaching) {
  				INTRINSICS[intrinsicRealName] = value;
  			}
  		}
  	}
  	return value;
  };

  var callBind = createCommonjsModule(function (module) {





  var $apply = GetIntrinsic('%Function.prototype.apply%');
  var $call = GetIntrinsic('%Function.prototype.call%');
  var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || functionBind.call($call, $apply);

  var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);

  if ($defineProperty) {
  	try {
  		$defineProperty({}, 'a', { value: 1 });
  	} catch (e) {
  		// IE 8 has a broken defineProperty
  		$defineProperty = null;
  	}
  }

  module.exports = function callBind() {
  	return $reflectApply(functionBind, $call, arguments);
  };

  var applyBind = function applyBind() {
  	return $reflectApply(functionBind, $apply, arguments);
  };

  if ($defineProperty) {
  	$defineProperty(module.exports, 'apply', { value: applyBind });
  } else {
  	module.exports.apply = applyBind;
  }
  });

  var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

  var callBound = function callBoundIntrinsic(name, allowMissing) {
  	var intrinsic = GetIntrinsic(name, !!allowMissing);
  	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.')) {
  		return callBind(intrinsic);
  	}
  	return intrinsic;
  };

  var $apply = GetIntrinsic('%Reflect.apply%', true) || callBound('%Function.prototype.apply%');

  // https://www.ecma-international.org/ecma-262/6.0/#sec-call

  var Call = function Call(F, V) {
  	var args = arguments.length > 2 ? arguments[2] : [];
  	return $apply(F, V, args);
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

  	for (var key in Desc) { // eslint-disable-line no-restricted-syntax
  		if (src(Desc, key) && !allowed[key]) {
  			return false;
  		}
  	}

  	if (ES.IsDataDescriptor(Desc) && ES.IsAccessorDescriptor(Desc)) {
  		throw new $TypeError$1('Property Descriptors may not be both accessor and data descriptors');
  	}
  	return true;
  };

  var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);

  if ($defineProperty) {
  	try {
  		$defineProperty({}, 'a', { value: 1 });
  	} catch (e) {
  		// IE 8 has a broken defineProperty
  		$defineProperty = null;
  	}
  }



  var $isEnumerable = callBound('Object.prototype.propertyIsEnumerable');

  // eslint-disable-next-line max-params
  var DefineOwnProperty = function DefineOwnProperty(IsDataDescriptor, SameValue, FromPropertyDescriptor, O, P, desc) {
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
  	$defineProperty(O, P, FromPropertyDescriptor(desc));
  	return true;
  };

  var $TypeError$2 = GetIntrinsic('%TypeError%');
  var $SyntaxError$1 = GetIntrinsic('%SyntaxError%');



  var predicates = {
  	// https://ecma-international.org/ecma-262/6.0/#sec-property-descriptor-specification-type
  	'Property Descriptor': function isPropertyDescriptor(Type, Desc) {
  		if (Type(Desc) !== 'Object') {
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
  			throw new $TypeError$2('Property Descriptors may not be both accessor and data descriptors');
  		}
  		return true;
  	}
  };

  var assertRecord = function assertRecord(Type, recordType, argumentName, value) {
  	var predicate = predicates[recordType];
  	if (typeof predicate !== 'function') {
  		throw new $SyntaxError$1('unknown record type: ' + recordType);
  	}
  	if (!predicate(Type, value)) {
  		throw new $TypeError$2(argumentName + ' must be a ' + recordType);
  	}
  };

  // https://www.ecma-international.org/ecma-262/5.1/#sec-8

  var Type = function Type(x) {
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

  // https://tc39.es/ecma262/2020/#sec-ecmascript-data-types-and-values

  var Type$1 = function Type$1(x) {
  	if (typeof x === 'symbol') {
  		return 'Symbol';
  	}
  	if (typeof x === 'bigint') {
  		return 'BigInt';
  	}
  	return Type(x);
  };

  // https://www.ecma-international.org/ecma-262/6.0/#sec-frompropertydescriptor

  var FromPropertyDescriptor = function FromPropertyDescriptor(Desc) {
  	if (typeof Desc === 'undefined') {
  		return Desc;
  	}

  	assertRecord(Type$1, 'Property Descriptor', 'Desc', Desc);

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
  };

  // https://www.ecma-international.org/ecma-262/6.0/#sec-isaccessordescriptor

  var IsAccessorDescriptor = function IsAccessorDescriptor(Desc) {
  	if (typeof Desc === 'undefined') {
  		return false;
  	}

  	assertRecord(Type$1, 'Property Descriptor', 'Desc', Desc);

  	if (!src(Desc, '[[Get]]') && !src(Desc, '[[Set]]')) {
  		return false;
  	}

  	return true;
  };

  // https://www.ecma-international.org/ecma-262/6.0/#sec-isdatadescriptor

  var IsDataDescriptor = function IsDataDescriptor(Desc) {
  	if (typeof Desc === 'undefined') {
  		return false;
  	}

  	assertRecord(Type$1, 'Property Descriptor', 'Desc', Desc);

  	if (!src(Desc, '[[Value]]') && !src(Desc, '[[Writable]]')) {
  		return false;
  	}

  	return true;
  };

  // https://www.ecma-international.org/ecma-262/6.0/#sec-ispropertykey

  var IsPropertyKey = function IsPropertyKey(argument) {
  	return typeof argument === 'string' || typeof argument === 'symbol';
  };

  var _isNaN = Number.isNaN || function isNaN(a) {
  	return a !== a;
  };

  // http://www.ecma-international.org/ecma-262/5.1/#sec-9.12

  var SameValue = function SameValue(x, y) {
  	if (x === y) { // 0 === -0, but they are not identical.
  		if (x === 0) { return 1 / x === 1 / y; }
  		return true;
  	}
  	return _isNaN(x) && _isNaN(y);
  };

  // http://www.ecma-international.org/ecma-262/5.1/#sec-9.2

  var ToBoolean = function ToBoolean(value) { return !!value; };

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
  var toStr$1 = Object.prototype.toString;
  var fnClass = '[object Function]';
  var genClass = '[object GeneratorFunction]';
  var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

  var isCallable = reflectApply
  	? function isCallable(value) {
  		if (!value) { return false; }
  		if (typeof value !== 'function' && typeof value !== 'object') { return false; }
  		if (typeof value === 'function' && !value.prototype) { return true; }
  		try {
  			reflectApply(value, null, badArrayLike);
  		} catch (e) {
  			if (e !== isCallableMarker) { return false; }
  		}
  		return !isES6ClassFn(value);
  	}
  	: function isCallable(value) {
  		if (!value) { return false; }
  		if (typeof value !== 'function' && typeof value !== 'object') { return false; }
  		if (typeof value === 'function' && !value.prototype) { return true; }
  		if (hasToStringTag) { return tryFunctionObject(value); }
  		if (isES6ClassFn(value)) { return false; }
  		var strClass = toStr$1.call(value);
  		return strClass === fnClass || strClass === genClass;
  	};

  // http://www.ecma-international.org/ecma-262/5.1/#sec-9.11

  var IsCallable = isCallable;

  var $TypeError$3 = GetIntrinsic('%TypeError%');





  // https://ecma-international.org/ecma-262/5.1/#sec-8.10.5

  var ToPropertyDescriptor = function ToPropertyDescriptor(Obj) {
  	if (Type$1(Obj) !== 'Object') {
  		throw new $TypeError$3('ToPropertyDescriptor requires an object');
  	}

  	var desc = {};
  	if (src(Obj, 'enumerable')) {
  		desc['[[Enumerable]]'] = ToBoolean(Obj.enumerable);
  	}
  	if (src(Obj, 'configurable')) {
  		desc['[[Configurable]]'] = ToBoolean(Obj.configurable);
  	}
  	if (src(Obj, 'value')) {
  		desc['[[Value]]'] = Obj.value;
  	}
  	if (src(Obj, 'writable')) {
  		desc['[[Writable]]'] = ToBoolean(Obj.writable);
  	}
  	if (src(Obj, 'get')) {
  		var getter = Obj.get;
  		if (typeof getter !== 'undefined' && !IsCallable(getter)) {
  			throw new $TypeError$3('getter must be a function');
  		}
  		desc['[[Get]]'] = getter;
  	}
  	if (src(Obj, 'set')) {
  		var setter = Obj.set;
  		if (typeof setter !== 'undefined' && !IsCallable(setter)) {
  			throw new $TypeError$3('setter must be a function');
  		}
  		desc['[[Set]]'] = setter;
  	}

  	if ((src(desc, '[[Get]]') || src(desc, '[[Set]]')) && (src(desc, '[[Value]]') || src(desc, '[[Writable]]'))) {
  		throw new $TypeError$3('Invalid property descriptor. Cannot both specify accessors and a value or writable attribute');
  	}
  	return desc;
  };

  var $TypeError$4 = GetIntrinsic('%TypeError%');












  // https://www.ecma-international.org/ecma-262/6.0/#sec-definepropertyorthrow

  var DefinePropertyOrThrow = function DefinePropertyOrThrow(O, P, desc) {
  	if (Type$1(O) !== 'Object') {
  		throw new $TypeError$4('Assertion failed: Type(O) is not Object');
  	}

  	if (!IsPropertyKey(P)) {
  		throw new $TypeError$4('Assertion failed: IsPropertyKey(P) is not true');
  	}

  	var Desc = isPropertyDescriptor({
  		Type: Type$1,
  		IsDataDescriptor: IsDataDescriptor,
  		IsAccessorDescriptor: IsAccessorDescriptor
  	}, desc) ? desc : ToPropertyDescriptor(desc);
  	if (!isPropertyDescriptor({
  		Type: Type$1,
  		IsDataDescriptor: IsDataDescriptor,
  		IsAccessorDescriptor: IsAccessorDescriptor
  	}, Desc)) {
  		throw new $TypeError$4('Assertion failed: Desc is not a valid Property Descriptor');
  	}

  	return DefineOwnProperty(
  		IsDataDescriptor,
  		SameValue,
  		FromPropertyDescriptor,
  		O,
  		P,
  		Desc
  	);
  };

  var IsConstructor = createCommonjsModule(function (module) {



  var $construct = GetIntrinsic('%Reflect.construct%', true);

  var DefinePropertyOrThrow$1 = DefinePropertyOrThrow;
  try {
  	DefinePropertyOrThrow$1({}, '', { '[[Get]]': function () {} });
  } catch (e) {
  	// Accessor properties aren't supported
  	DefinePropertyOrThrow$1 = null;
  }

  // https://www.ecma-international.org/ecma-262/6.0/#sec-isconstructor

  if (DefinePropertyOrThrow$1 && $construct) {
  	var isConstructorMarker = {};
  	var badArrayLike = {};
  	DefinePropertyOrThrow$1(badArrayLike, 'length', {
  		'[[Get]]': function () {
  			throw isConstructorMarker;
  		},
  		'[[Enumerable]]': true
  	});

  	module.exports = function IsConstructor(argument) {
  		try {
  			// `Reflect.construct` invokes `IsConstructor(target)` before `Get(args, 'length')`:
  			$construct(argument, badArrayLike);
  		} catch (err) {
  			return err === isConstructorMarker;
  		}
  	};
  } else {
  	module.exports = function IsConstructor(argument) {
  		// unfortunately there's no way to truly check this without try/catch `new argument` in old environments
  		return typeof argument === 'function' && !!argument.prototype;
  	};
  }
  });

  var $species = GetIntrinsic('%Symbol.species%', true);
  var $TypeError$5 = GetIntrinsic('%TypeError%');




  // https://ecma-international.org/ecma-262/6.0/#sec-speciesconstructor

  var SpeciesConstructor = function SpeciesConstructor(O, defaultConstructor) {
  	if (Type$1(O) !== 'Object') {
  		throw new $TypeError$5('Assertion failed: Type(O) is not Object');
  	}
  	var C = O.constructor;
  	if (typeof C === 'undefined') {
  		return defaultConstructor;
  	}
  	if (Type$1(C) !== 'Object') {
  		throw new $TypeError$5('O.constructor is not an Object');
  	}
  	var S = $species ? C[$species] : void 0;
  	if (S == null) {
  		return defaultConstructor;
  	}
  	if (IsConstructor(S)) {
  		return S;
  	}
  	throw new $TypeError$5('no constructor found');
  };

  var $abs = GetIntrinsic('%Math.abs%');

  // http://www.ecma-international.org/ecma-262/5.1/#sec-5.2

  var abs = function abs(x) {
  	return $abs(x);
  };

  // var modulo = require('./modulo');
  var $floor = Math.floor;

  // http://www.ecma-international.org/ecma-262/5.1/#sec-5.2

  var floor = function floor(x) {
  	// return x - modulo(x, 1);
  	return $floor(x);
  };

  // http://www.ecma-international.org/ecma-262/5.1/#sec-9.3

  var ToNumber = function ToNumber(value) {
  	return +value; // eslint-disable-line no-implicit-coercion
  };

  var $isNaN = Number.isNaN || function (a) { return a !== a; };

  var _isFinite = Number.isFinite || function (x) { return typeof x === 'number' && !$isNaN(x) && x !== Infinity && x !== -Infinity; };

  var sign = function sign(number) {
  	return number >= 0 ? 1 : -1;
  };

  // http://www.ecma-international.org/ecma-262/5.1/#sec-9.4

  var ToInteger = function ToInteger(value) {
  	var number = ToNumber(value);
  	if (_isNaN(number)) { return 0; }
  	if (number === 0 || !_isFinite(number)) { return number; }
  	return sign(number) * floor(abs(number));
  };

  var $test = GetIntrinsic('RegExp.prototype.test');



  var regexTester = function regexTester(regex) {
  	return callBind($test, regex);
  };

  var isPrimitive = function isPrimitive(value) {
  	return value === null || (typeof value !== 'function' && typeof value !== 'object');
  };

  var isPrimitive$1 = function isPrimitive(value) {
  	return value === null || (typeof value !== 'function' && typeof value !== 'object');
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

  var toStr$2 = Object.prototype.toString;
  var dateClass = '[object Date]';
  var hasToStringTag$1 = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

  var isDateObject = function isDateObject(value) {
  	if (typeof value !== 'object' || value === null) {
  		return false;
  	}
  	return hasToStringTag$1 ? tryDateObject(value) : toStr$2.call(value) === dateClass;
  };

  var isSymbol = createCommonjsModule(function (module) {

  var toStr = Object.prototype.toString;
  var hasSymbols$1 = hasSymbols();

  if (hasSymbols$1) {
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

  var hasSymbols$2 = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';






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
  	if (hasSymbols$2) {
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
  	if (hint === 'default' && (isDateObject(input) || isSymbol(input))) {
  		hint = 'string';
  	}
  	return ordinaryToPrimitive(input, hint === 'default' ? 'number' : hint);
  };

  // https://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive

  var ToPrimitive = function ToPrimitive(input) {
  	if (arguments.length > 1) {
  		return es2015(input, arguments[1]);
  	}
  	return es2015(input);
  };

  var $TypeError$6 = GetIntrinsic('%TypeError%');
  var $Number = GetIntrinsic('%Number%');
  var $RegExp = GetIntrinsic('%RegExp%');
  var $parseInteger = GetIntrinsic('%parseInt%');





  var $strSlice = callBound('String.prototype.slice');
  var isBinary = regexTester(/^0b[01]+$/i);
  var isOctal = regexTester(/^0o[0-7]+$/i);
  var isInvalidHexLiteral = regexTester(/^[-+]0x[0-9a-f]+$/i);
  var nonWS = ['\u0085', '\u200b', '\ufffe'].join('');
  var nonWSregex = new $RegExp('[' + nonWS + ']', 'g');
  var hasNonWS = regexTester(nonWSregex);

  // whitespace from: https://es5.github.io/#x15.5.4.20
  // implementation from https://github.com/es-shims/es5-shim/blob/v3.4.0/es5-shim.js#L1304-L1324
  var ws = [
  	'\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003',
  	'\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028',
  	'\u2029\uFEFF'
  ].join('');
  var trimRegex = new RegExp('(^[' + ws + ']+)|([' + ws + ']+$)', 'g');
  var $replace$1 = callBound('String.prototype.replace');
  var $trim = function (value) {
  	return $replace$1(value, trimRegex, '');
  };



  // https://www.ecma-international.org/ecma-262/6.0/#sec-tonumber

  var ToNumber$1 = function ToNumber(argument) {
  	var value = isPrimitive(argument) ? argument : ToPrimitive(argument, $Number);
  	if (typeof value === 'symbol') {
  		throw new $TypeError$6('Cannot convert a Symbol value to a number');
  	}
  	if (typeof value === 'string') {
  		if (isBinary(value)) {
  			return ToNumber($parseInteger($strSlice(value, 2), 2));
  		} else if (isOctal(value)) {
  			return ToNumber($parseInteger($strSlice(value, 2), 8));
  		} else if (hasNonWS(value) || isInvalidHexLiteral(value)) {
  			return NaN;
  		} else {
  			var trimmed = $trim(value);
  			if (trimmed !== value) {
  				return ToNumber(trimmed);
  			}
  		}
  	}
  	return $Number(value);
  };

  // https://www.ecma-international.org/ecma-262/11.0/#sec-tointeger

  var ToInteger$1 = function ToInteger$1(value) {
  	var number = ToNumber$1(value);
  	if (number !== 0) {
  		number = ToInteger(number);
  	}
  	return number === 0 ? 0 : number;
  };

  var $String = GetIntrinsic('%String%');
  var $TypeError$7 = GetIntrinsic('%TypeError%');

  // https://www.ecma-international.org/ecma-262/6.0/#sec-tostring

  var ToString = function ToString(argument) {
  	if (typeof argument === 'symbol') {
  		throw new $TypeError$7('Cannot convert a Symbol value to a string');
  	}
  	return $String(argument);
  };

  var INTRINSICS$1 = {};

  var customUtilInspectFormatters = _defineProperty({}, 'Temporal.Duration', function TemporalDuration(depth, options) {
    var descr = options.stylize("".concat(this[Symbol.toStringTag], " <").concat(this, ">"), 'special');
    if (depth < 1) return descr;
    var entries = [];

    for (var _i = 0, _arr = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds']; _i < _arr.length; _i++) {
      var prop = _arr[_i];
      if (this[prop] !== 0) entries.push("  ".concat(prop, ": ").concat(options.stylize(this[prop], 'number')));
    }

    return descr + ' {\n' + entries.join(',\n') + '\n}';
  });

  function defaultUtilInspectFormatter(depth, options) {
    return options.stylize("".concat(this[Symbol.toStringTag], " <").concat(this, ">"), 'special');
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

    var species = function species() {
      return this;
    };

    Object.defineProperty(species, 'name', {
      value: 'get [Symbol.species]',
      writable: false,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Class, Symbol.species, {
      get: species,
      enumerable: false,
      configurable: true
    });

    var _iterator = _createForOfIteratorHelper(Object.getOwnPropertyNames(Class)),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var prop = _step.value;
        var desc = Object.getOwnPropertyDescriptor(Class, prop);
        if (!desc.configurable || !desc.enumerable) continue;
        desc.enumerable = false;
        Object.defineProperty(Class, prop, desc);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    var _iterator2 = _createForOfIteratorHelper(Object.getOwnPropertyNames(Class.prototype)),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _prop = _step2.value;

        var _desc = Object.getOwnPropertyDescriptor(Class.prototype, _prop);

        if (!_desc.configurable || !_desc.enumerable) continue;
        _desc.enumerable = false;
        Object.defineProperty(Class.prototype, _prop, _desc);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    DefineIntrinsic(name, Class);
  }
  function DefineIntrinsic(name, value) {
    var key = "%".concat(name, "%");
    if (INTRINSICS$1[key] !== undefined) throw new Error("intrinsic ".concat(name, " already exists"));
    INTRINSICS$1[key] = value;
  }
  function GetIntrinsic$1(intrinsic) {
    return intrinsic in INTRINSICS$1 ? INTRINSICS$1[intrinsic] : GetIntrinsic(intrinsic);
  }

  // Instant
  var EPOCHNANOSECONDS = 'slot-epochNanoSeconds'; // TimeZone

  var TIMEZONE_ID = 'slot-timezone-identifier'; // DateTime, Date, Time, YearMonth, MonthDay

  var ISO_YEAR = 'slot-year';
  var ISO_MONTH = 'slot-month';
  var ISO_DAY = 'slot-day';
  var HOUR = 'slot-hour';
  var MINUTE = 'slot-minute';
  var SECOND = 'slot-second';
  var MILLISECOND = 'slot-millisecond';
  var MICROSECOND = 'slot-microsecond';
  var NANOSECOND = 'slot-nanosecond';
  var CALENDAR = 'slot-calendar'; // Date, YearMonth, and MonthDay all have the same slots, disambiguation needed:

  var DATE_BRAND = 'slot-date-brand';
  var YEAR_MONTH_BRAND = 'slot-year-month-brand';
  var MONTH_DAY_BRAND = 'slot-month-day-brand'; // Duration

  var YEARS = 'slot-years';
  var MONTHS = 'slot-months';
  var WEEKS = 'slot-weeks';
  var DAYS = 'slot-days';
  var HOURS = 'slot-hours';
  var MINUTES = 'slot-minutes';
  var SECONDS = 'slot-seconds';
  var MILLISECONDS = 'slot-milliseconds';
  var MICROSECONDS = 'slot-microseconds';
  var NANOSECONDS = 'slot-nanoseconds'; // Calendar

  var CALENDAR_ID = 'slot-calendar-identifier';
  var slots = new WeakMap();
  function CreateSlots(container) {
    slots.set(container, Object.create(null));
  }

  function GetSlots(container) {
    return slots.get(container);
  }

  function HasSlot(container) {
    if (!container || 'object' !== _typeof(container)) return false;
    var myslots = GetSlots(container);

    for (var _len = arguments.length, ids = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      ids[_key - 1] = arguments[_key];
    }

    return !!myslots && ids.reduce(function (all, id) {
      return all && id in myslots;
    }, true);
  }
  function GetSlot(container, id) {
    return GetSlots(container)[id];
  }
  function SetSlot(container, id, value) {
    GetSlots(container)[id] = value;
  }

  var yearpart = /(?:[+-\u2212]\d{6}|\d{4})/;
  var datesplit = new RegExp("(".concat(yearpart.source, ")(?:-(\\d{2})-(\\d{2})|(\\d{2})(\\d{2}))"));
  var timesplit = /(\d{2})(?::(\d{2})(?::(\d{2})(?:[.,](\d{1,9}))?)?|(\d{2})(?:(\d{2})(?:[.,](\d{1,9}))?)?)?/;
  var offset = /([+-\u2212])([0-2][0-9])(?::?([0-5][0-9]))?/;
  var zonesplit = new RegExp("(?:([zZ])|(?:".concat(offset.source, "?(?:\\[(?!c=)([^\\]\\s]*)?\\])?))"));
  var calendar = /\[c=([^\]\s]+)\]/;
  var absolute = new RegExp("^".concat(datesplit.source, "(?:T|\\s+)").concat(timesplit.source).concat(zonesplit.source, "(?:").concat(calendar.source, ")?$"), 'i');
  var datetime = new RegExp("^".concat(datesplit.source, "(?:(?:T|\\s+)").concat(timesplit.source, "(?:").concat(zonesplit.source, ")?)?(?:").concat(calendar.source, ")?$"), 'i');
  var time = new RegExp("^".concat(timesplit.source, "(?:").concat(zonesplit.source, ")?(?:").concat(calendar.source, ")?$"), 'i'); // The short forms of YearMonth and MonthDay are only for the ISO calendar.
  // Non-ISO calendar YearMonth and MonthDay have to parse as a Temporal.Date,
  // with the reference fields.
  // YYYYMM forbidden by ISO 8601, but since it is not ambiguous with anything
  // else we could parse in a YearMonth context, we allow it

  var yearmonth = new RegExp("^(".concat(yearpart.source, ")-?(\\d{2})$"));
  var monthday = /^(?:--)?(\d{2})-?(\d{2})$/;
  var duration = /^([+-\u2212])?P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?!$)(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)(?:[.,](\d{1,9}))?S)?)?$/i;

  var IntlDateTimeFormat = globalThis.Intl.DateTimeFormat;
  var MathAbs = Math.abs;
  var MathCeil = Math.ceil;
  var MathFloor = Math.floor;
  var MathSign = Math.sign;
  var MathTrunc = Math.trunc;
  var NumberIsNaN = Number.isNaN;
  var ObjectAssign = Object.assign;
  var ObjectCreate = Object.create;
  var DAYMILLIS = 86400000;
  var NS_MIN = BigInteger(-86400).multiply(1e17);
  var NS_MAX = BigInteger(86400).multiply(1e17);
  var YEAR_MIN = -271821;
  var YEAR_MAX = 275760;
  var BEFORE_FIRST_DST = BigInteger(-388152).multiply(1e13); // 1847-01-01T00:00:00Z
  var ES2019 = {
    Call: Call,
    SpeciesConstructor: SpeciesConstructor,
    ToInteger: ToInteger$1,
    ToNumber: ToNumber$1,
    ToPrimitive: ToPrimitive,
    ToString: ToString,
    Type: Type$1
  };
  var ES = ObjectAssign({}, ES2019, {
    IsTemporalInstant: function IsTemporalInstant(item) {
      return HasSlot(item, EPOCHNANOSECONDS);
    },
    IsTemporalTimeZone: function IsTemporalTimeZone(item) {
      return HasSlot(item, TIMEZONE_ID);
    },
    IsTemporalCalendar: function IsTemporalCalendar(item) {
      return HasSlot(item, CALENDAR_ID);
    },
    IsTemporalDuration: function IsTemporalDuration(item) {
      return HasSlot(item, YEARS, MONTHS, DAYS, HOURS, MINUTES, SECONDS, MILLISECONDS, MICROSECONDS, NANOSECONDS);
    },
    IsTemporalDate: function IsTemporalDate(item) {
      return HasSlot(item, DATE_BRAND);
    },
    IsTemporalTime: function IsTemporalTime(item) {
      return HasSlot(item, HOUR, MINUTE, SECOND, MILLISECOND, MICROSECOND, NANOSECOND) && !HasSlot(item, ISO_YEAR, ISO_MONTH, ISO_DAY);
    },
    IsTemporalDateTime: function IsTemporalDateTime(item) {
      return HasSlot(item, ISO_YEAR, ISO_MONTH, ISO_DAY, HOUR, MINUTE, SECOND, MILLISECOND, MICROSECOND, NANOSECOND);
    },
    IsTemporalYearMonth: function IsTemporalYearMonth(item) {
      return HasSlot(item, YEAR_MONTH_BRAND);
    },
    IsTemporalMonthDay: function IsTemporalMonthDay(item) {
      return HasSlot(item, MONTH_DAY_BRAND);
    },
    TemporalTimeZoneFromString: function TemporalTimeZoneFromString(stringIdent) {
      var _ES$ParseTemporalTime = ES.ParseTemporalTimeZoneString(stringIdent),
          zone = _ES$ParseTemporalTime.zone,
          ianaName = _ES$ParseTemporalTime.ianaName,
          offset = _ES$ParseTemporalTime.offset;

      var result = ES.GetCanonicalTimeZoneIdentifier(zone);

      if (offset && ianaName) {
        var ns = ES.ParseTemporalInstant(stringIdent);
        var offsetNs = ES.GetIANATimeZoneOffsetNanoseconds(ns, result);

        if (ES.FormatTimeZoneOffsetString(offsetNs) !== offset) {
          throw new RangeError("invalid offset ".concat(offset, "[").concat(ianaName, "]"));
        }
      }

      return result;
    },
    FormatCalendarAnnotation: function FormatCalendarAnnotation(calendar) {
      if (calendar.id === 'iso8601') return '';
      return "[c=".concat(calendar.id, "]");
    },
    ParseISODateTime: function ParseISODateTime(isoString, _ref) {
      var zoneRequired = _ref.zoneRequired;
      var regex = zoneRequired ? absolute : datetime;
      var match = regex.exec(isoString);
      if (!match) throw new RangeError("invalid ISO 8601 string: ".concat(isoString));
      var yearString = match[1];
      if (yearString[0] === "\u2212") yearString = "-".concat(yearString.slice(1));
      var year = ES.ToInteger(yearString);
      var month = ES.ToInteger(match[2] || match[4]);
      var day = ES.ToInteger(match[3] || match[5]);
      var hour = ES.ToInteger(match[6]);
      var minute = ES.ToInteger(match[7] || match[10]);
      var second = ES.ToInteger(match[8] || match[11]);
      if (second === 60) second = 59;
      var fraction = (match[9] || match[12]) + '000000000';
      var millisecond = ES.ToInteger(fraction.slice(0, 3));
      var microsecond = ES.ToInteger(fraction.slice(3, 6));
      var nanosecond = ES.ToInteger(fraction.slice(6, 9));
      var offsetSign = match[14] === '-' || match[14] === "\u2212" ? '-' : '+';
      var offset = "".concat(offsetSign).concat(match[15] || '00', ":").concat(match[16] || '00');
      var ianaName = match[17];

      if (ianaName) {
        try {
          // Canonicalize name if it is an IANA link name or is capitalized wrong
          ianaName = ES.GetCanonicalTimeZoneIdentifier(ianaName).toString();
        } catch (_unused) {// Not an IANA name, may be a custom ID, pass through unchanged
        }
      }

      var zone = match[13] ? 'UTC' : ianaName || offset;
      var calendar = match[18] || null;
      return {
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
        second: second,
        millisecond: millisecond,
        microsecond: microsecond,
        nanosecond: nanosecond,
        zone: zone,
        ianaName: ianaName,
        offset: offset,
        calendar: calendar
      };
    },
    ParseTemporalInstantString: function ParseTemporalInstantString(isoString) {
      return ES.ParseISODateTime(isoString, {
        zoneRequired: true
      });
    },
    ParseTemporalDateTimeString: function ParseTemporalDateTimeString(isoString) {
      return ES.ParseISODateTime(isoString, {
        zoneRequired: false
      });
    },
    ParseTemporalDateString: function ParseTemporalDateString(isoString) {
      return ES.ParseISODateTime(isoString, {
        zoneRequired: false
      });
    },
    ParseTemporalTimeString: function ParseTemporalTimeString(isoString) {
      var match = time.exec(isoString);
      var hour, minute, second, millisecond, microsecond, nanosecond;

      if (match) {
        hour = ES.ToInteger(match[1]);
        minute = ES.ToInteger(match[2] || match[5]);
        second = ES.ToInteger(match[3] || match[6]);
        if (second === 60) second = 59;
        var fraction = (match[4] || match[7]) + '000000000';
        millisecond = ES.ToInteger(fraction.slice(0, 3));
        microsecond = ES.ToInteger(fraction.slice(3, 6));
        nanosecond = ES.ToInteger(fraction.slice(6, 9));
      } else {
        var _ES$ParseISODateTime = ES.ParseISODateTime(isoString, {
          zoneRequired: false
        });

        hour = _ES$ParseISODateTime.hour;
        minute = _ES$ParseISODateTime.minute;
        second = _ES$ParseISODateTime.second;
        millisecond = _ES$ParseISODateTime.millisecond;
        microsecond = _ES$ParseISODateTime.microsecond;
        nanosecond = _ES$ParseISODateTime.nanosecond;
      }

      return {
        hour: hour,
        minute: minute,
        second: second,
        millisecond: millisecond,
        microsecond: microsecond,
        nanosecond: nanosecond
      };
    },
    ParseTemporalYearMonthString: function ParseTemporalYearMonthString(isoString) {
      var match = yearmonth.exec(isoString);
      var year, month, calendar, referenceISODay;

      if (match) {
        var yearString = match[1];
        if (yearString[0] === "\u2212") yearString = "-".concat(yearString.slice(1));
        year = ES.ToInteger(yearString);
        month = ES.ToInteger(match[2]);
        calendar = match[3] || null;
      } else {
        var _ES$ParseISODateTime2 = ES.ParseISODateTime(isoString, {
          zoneRequired: false
        });

        year = _ES$ParseISODateTime2.year;
        month = _ES$ParseISODateTime2.month;
        calendar = _ES$ParseISODateTime2.calendar;
        referenceISODay = _ES$ParseISODateTime2.day;
        if (!calendar) referenceISODay = undefined;
      }

      return {
        year: year,
        month: month,
        calendar: calendar,
        referenceISODay: referenceISODay
      };
    },
    ParseTemporalMonthDayString: function ParseTemporalMonthDayString(isoString) {
      var match = monthday.exec(isoString);
      var month, day, calendar, referenceISOYear;

      if (match) {
        month = ES.ToInteger(match[1]);
        day = ES.ToInteger(match[2]);
      } else {
        var _ES$ParseISODateTime3 = ES.ParseISODateTime(isoString, {
          zoneRequired: false
        });

        month = _ES$ParseISODateTime3.month;
        day = _ES$ParseISODateTime3.day;
        calendar = _ES$ParseISODateTime3.calendar;
        referenceISOYear = _ES$ParseISODateTime3.year;
        if (!calendar) referenceISOYear = undefined;
      }

      return {
        month: month,
        day: day,
        calendar: calendar,
        referenceISOYear: referenceISOYear
      };
    },
    ParseTemporalTimeZoneString: function ParseTemporalTimeZoneString(stringIdent) {
      try {
        var canonicalIdent = ES.GetCanonicalTimeZoneIdentifier(stringIdent);
        if (canonicalIdent) return {
          zone: canonicalIdent.toString()
        };
      } catch (_unused2) {// fall through
      }

      try {
        // Try parsing ISO string instead
        return ES.ParseISODateTime(stringIdent, {
          zoneRequired: true
        });
      } catch (_unused3) {
        throw new RangeError("Invalid time zone: ".concat(stringIdent));
      }
    },
    ParseTemporalDurationString: function ParseTemporalDurationString(isoString) {
      var match = duration.exec(isoString);
      if (!match) throw new RangeError("invalid duration: ".concat(isoString));

      if (match.slice(2).every(function (element) {
        return element === undefined;
      })) {
        throw new RangeError("invalid duration: ".concat(isoString));
      }

      var sign = match[1] === '-' || match[1] === "\u2212" ? -1 : 1;
      var years = ES.ToInteger(match[2]) * sign;
      var months = ES.ToInteger(match[3]) * sign;
      var weeks = ES.ToInteger(match[4]) * sign;
      var days = ES.ToInteger(match[5]) * sign;
      var hours = ES.ToInteger(match[6]) * sign;
      var minutes = ES.ToInteger(match[7]) * sign;
      var seconds = ES.ToInteger(match[8]) * sign;
      var fraction = match[9] + '000000000';
      var milliseconds = ES.ToInteger(fraction.slice(0, 3)) * sign;
      var microseconds = ES.ToInteger(fraction.slice(3, 6)) * sign;
      var nanoseconds = ES.ToInteger(fraction.slice(6, 9)) * sign;
      return {
        years: years,
        months: months,
        weeks: weeks,
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        milliseconds: milliseconds,
        microseconds: microseconds,
        nanoseconds: nanoseconds
      };
    },
    ParseTemporalInstant: function ParseTemporalInstant(isoString) {
      var _ES$ParseTemporalInst = ES.ParseTemporalInstantString(isoString),
          year = _ES$ParseTemporalInst.year,
          month = _ES$ParseTemporalInst.month,
          day = _ES$ParseTemporalInst.day,
          hour = _ES$ParseTemporalInst.hour,
          minute = _ES$ParseTemporalInst.minute,
          second = _ES$ParseTemporalInst.second,
          millisecond = _ES$ParseTemporalInst.millisecond,
          microsecond = _ES$ParseTemporalInst.microsecond,
          nanosecond = _ES$ParseTemporalInst.nanosecond,
          offset = _ES$ParseTemporalInst.offset,
          zone = _ES$ParseTemporalInst.zone;

      var DateTime = GetIntrinsic$1('%Temporal.DateTime%');
      var dt = new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
      var tz = ES.TimeZoneFrom(zone);
      var possibleInstants = tz.getPossibleInstantsFor(dt);
      if (possibleInstants.length === 1) return GetSlot(possibleInstants[0], EPOCHNANOSECONDS);

      var _iterator = _createForOfIteratorHelper(possibleInstants),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var absolute = _step.value;
          var possibleOffsetNs = tz.getOffsetNanosecondsFor(absolute);
          if (ES.FormatTimeZoneOffsetString(possibleOffsetNs) === offset) return GetSlot(absolute, EPOCHNANOSECONDS);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      throw new RangeError("'".concat(isoString, "' doesn't uniquely identify a Temporal.Instant"));
    },
    RegulateDateTime: function RegulateDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, overflow) {
      switch (overflow) {
        case 'reject':
          ES.RejectDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
          break;

        case 'constrain':
          var _ES$ConstrainDateTime = ES.ConstrainDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);

          year = _ES$ConstrainDateTime.year;
          month = _ES$ConstrainDateTime.month;
          day = _ES$ConstrainDateTime.day;
          hour = _ES$ConstrainDateTime.hour;
          minute = _ES$ConstrainDateTime.minute;
          second = _ES$ConstrainDateTime.second;
          millisecond = _ES$ConstrainDateTime.millisecond;
          microsecond = _ES$ConstrainDateTime.microsecond;
          nanosecond = _ES$ConstrainDateTime.nanosecond;
          break;
      }

      return {
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
        second: second,
        millisecond: millisecond,
        microsecond: microsecond,
        nanosecond: nanosecond
      };
    },
    RegulateDate: function RegulateDate(year, month, day, overflow) {
      switch (overflow) {
        case 'reject':
          ES.RejectDate(year, month, day);
          break;

        case 'constrain':
          var _ES$ConstrainDate = ES.ConstrainDate(year, month, day);

          year = _ES$ConstrainDate.year;
          month = _ES$ConstrainDate.month;
          day = _ES$ConstrainDate.day;
          break;
      }

      return {
        year: year,
        month: month,
        day: day
      };
    },
    RegulateTime: function RegulateTime(hour, minute, second, millisecond, microsecond, nanosecond, overflow) {
      switch (overflow) {
        case 'reject':
          ES.RejectTime(hour, minute, second, millisecond, microsecond, nanosecond);
          break;

        case 'constrain':
          var _ES$ConstrainTime = ES.ConstrainTime(hour, minute, second, millisecond, microsecond, nanosecond);

          hour = _ES$ConstrainTime.hour;
          minute = _ES$ConstrainTime.minute;
          second = _ES$ConstrainTime.second;
          millisecond = _ES$ConstrainTime.millisecond;
          microsecond = _ES$ConstrainTime.microsecond;
          nanosecond = _ES$ConstrainTime.nanosecond;
          break;
      }

      return {
        hour: hour,
        minute: minute,
        second: second,
        millisecond: millisecond,
        microsecond: microsecond,
        nanosecond: nanosecond
      };
    },
    RegulateYearMonth: function RegulateYearMonth(year, month, overflow) {
      var referenceISODay = 1;

      switch (overflow) {
        case 'reject':
          ES.RejectDate(year, month, referenceISODay);
          break;

        case 'constrain':
          var _ES$ConstrainDate2 = ES.ConstrainDate(year, month);

          year = _ES$ConstrainDate2.year;
          month = _ES$ConstrainDate2.month;
          break;
      }

      return {
        year: year,
        month: month
      };
    },
    RegulateMonthDay: function RegulateMonthDay(month, day, overflow) {
      var referenceISOYear = 1972;

      switch (overflow) {
        case 'reject':
          ES.RejectDate(referenceISOYear, month, day);
          break;

        case 'constrain':
          var _ES$ConstrainDate3 = ES.ConstrainDate(referenceISOYear, month, day);

          month = _ES$ConstrainDate3.month;
          day = _ES$ConstrainDate3.day;
          break;
      }

      return {
        month: month,
        day: day
      };
    },
    ToTemporalDurationRecord: function ToTemporalDurationRecord(item) {
      if (ES.IsTemporalDuration(item)) {
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

      return ES.ToRecord(item, [['days', 0], ['hours', 0], ['microseconds', 0], ['milliseconds', 0], ['minutes', 0], ['months', 0], ['nanoseconds', 0], ['seconds', 0], ['weeks', 0], ['years', 0]]);
    },
    RegulateDuration: function RegulateDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, overflow) {
      for (var _i = 0, _arr = [years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds]; _i < _arr.length; _i++) {
        var prop = _arr[_i];
        if (!Number.isFinite(prop)) throw new RangeError('infinite values not allowed as duration fields');
      }

      ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);

      if (overflow === 'balance') {
        var _ES$BalanceDuration = ES.BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 'days');

        days = _ES$BalanceDuration.days;
        hours = _ES$BalanceDuration.hours;
        minutes = _ES$BalanceDuration.minutes;
        seconds = _ES$BalanceDuration.seconds;
        milliseconds = _ES$BalanceDuration.milliseconds;
        microseconds = _ES$BalanceDuration.microseconds;
        nanoseconds = _ES$BalanceDuration.nanoseconds;

        for (var _i2 = 0, _arr2 = [years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds]; _i2 < _arr2.length; _i2++) {
          var _prop = _arr2[_i2];
          if (!Number.isFinite(_prop)) throw new RangeError('infinite values not allowed as duration fields');
        }
      }

      return {
        years: years,
        months: months,
        weeks: weeks,
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        milliseconds: milliseconds,
        microseconds: microseconds,
        nanoseconds: nanoseconds
      };
    },
    ToLimitedTemporalDuration: function ToLimitedTemporalDuration(item) {
      var disallowedProperties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      if (_typeof(item) !== 'object' || item === null) {
        throw new TypeError('Unexpected type for duration');
      }

      var _ES$ToTemporalDuratio = ES.ToTemporalDurationRecord(item),
          years = _ES$ToTemporalDuratio.years,
          months = _ES$ToTemporalDuratio.months,
          weeks = _ES$ToTemporalDuratio.weeks,
          days = _ES$ToTemporalDuratio.days,
          hours = _ES$ToTemporalDuratio.hours,
          minutes = _ES$ToTemporalDuratio.minutes,
          seconds = _ES$ToTemporalDuratio.seconds,
          milliseconds = _ES$ToTemporalDuratio.milliseconds,
          microseconds = _ES$ToTemporalDuratio.microseconds,
          nanoseconds = _ES$ToTemporalDuratio.nanoseconds;

      var duration = ES.RegulateDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 'reject');

      var _iterator2 = _createForOfIteratorHelper(disallowedProperties),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var property = _step2.value;

          if (duration[property] !== 0) {
            throw new RangeError("invalid duration field ".concat(property));
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return duration;
    },
    ToTemporalDurationOverflow: function ToTemporalDurationOverflow(options) {
      return ES.GetOption(options, 'overflow', ['constrain', 'balance'], 'constrain');
    },
    ToTemporalOverflow: function ToTemporalOverflow(options) {
      return ES.GetOption(options, 'overflow', ['constrain', 'reject'], 'constrain');
    },
    ToTemporalDisambiguation: function ToTemporalDisambiguation(options) {
      return ES.GetOption(options, 'disambiguation', ['compatible', 'earlier', 'later', 'reject'], 'compatible');
    },
    ToTemporalRoundingMode: function ToTemporalRoundingMode(options) {
      return ES.GetOption(options, 'roundingMode', ['ceil', 'floor', 'trunc', 'nearest'], 'nearest');
    },
    ToTemporalRoundingIncrement: function ToTemporalRoundingIncrement(options, dividend, inclusive) {
      var maximum = Infinity;
      if (dividend !== undefined) maximum = dividend;
      if (!inclusive && dividend !== undefined) maximum = dividend > 1 ? dividend - 1 : 1;
      var increment = ES.GetNumberOption(options, 'roundingIncrement', 1, maximum, 1);

      if (dividend !== undefined && dividend % increment !== 0) {
        throw new RangeError("Rounding increment must divide evenly into ".concat(dividend));
      }

      return increment;
    },
    ToLargestTemporalUnit: function ToLargestTemporalUnit(options, fallback) {
      var disallowedStrings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var allowed = new Set(['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds']);

      var _iterator3 = _createForOfIteratorHelper(disallowedStrings),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var s = _step3.value;
          allowed.delete(s);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      var retval = ES.GetOption(options, 'largestUnit', ['auto'].concat(_toConsumableArray(allowed)), 'auto');
      if (retval === 'auto') return fallback;
      return retval;
    },
    ToSmallestTemporalUnit: function ToSmallestTemporalUnit(options) {
      var disallowedStrings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var singular = new Map([['days', 'day'], ['hours', 'hour'], ['minutes', 'minute'], ['seconds', 'second'], ['milliseconds', 'millisecond'], ['microseconds', 'microsecond'], ['nanoseconds', 'nanosecond']]);
      var allowed = new Set(['day', 'hour', 'minute', 'second', 'millisecond', 'microsecond', 'nanosecond']);

      var _iterator4 = _createForOfIteratorHelper(disallowedStrings),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var s = _step4.value;
          allowed.delete(s);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      var allowedValues = _toConsumableArray(allowed);

      var value = options.smallestUnit;
      if (value === undefined) throw new RangeError('smallestUnit option is required');
      value = ES.ToString(value);
      if (singular.has(value)) value = singular.get(value);

      if (!allowedValues.includes(value)) {
        throw new RangeError("smallestUnit must be one of ".concat(allowedValues.join(', '), ", not ").concat(value));
      }

      return value;
    },
    ToSmallestTemporalDurationUnit: function ToSmallestTemporalDurationUnit(options, fallback) {
      var disallowedStrings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var plural = new Map([['year', 'years'], ['month', 'months'], ['week', 'weeks'], ['day', 'days'], ['hour', 'hours'], ['minute', 'minutes'], ['second', 'seconds'], ['millisecond', 'milliseconds'], ['microsecond', 'microseconds'], ['nanosecond', 'nanoseconds']]);
      var allowed = new Set(['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds']);

      var _iterator5 = _createForOfIteratorHelper(disallowedStrings),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var s = _step5.value;
          allowed.delete(s);
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      var allowedValues = _toConsumableArray(allowed);

      var value = options.smallestUnit;
      if (value === undefined) return fallback;
      value = ES.ToString(value);
      if (plural.has(value)) value = plural.get(value);

      if (!allowedValues.includes(value)) {
        throw new RangeError("smallestUnit must be one of ".concat(allowedValues.join(', '), ", not ").concat(value));
      }

      return value;
    },
    ToRelativeTemporalObject: function ToRelativeTemporalObject(options) {
      var relativeTo = options.relativeTo;
      if (relativeTo === undefined) return relativeTo;
      var year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar;

      if (ES.Type(relativeTo) === 'Object') {
        if (ES.IsTemporalDateTime(relativeTo)) return relativeTo;
        calendar = relativeTo.calendar;
        if (calendar === undefined) calendar = GetISO8601Calendar();
        calendar = ES.ToTemporalCalendar(calendar);
        var fields = ES.ToTemporalDateTimeRecord(relativeTo);
        var TemporalDate = GetIntrinsic$1('%Temporal.Date%');
        var date = calendar.dateFromFields(fields, {}, TemporalDate);
        year = GetSlot(date, ISO_YEAR);
        month = GetSlot(date, ISO_MONTH);
        day = GetSlot(date, ISO_DAY);
        hour = fields.hour;
        minute = fields.minute;
        second = fields.second;
        millisecond = fields.millisecond;
        microsecond = fields.microsecond;
        nanosecond = fields.nanosecond;
      } else {
        var _ES$ParseTemporalDate = ES.ParseTemporalDateTimeString(ES.ToString(relativeTo));

        year = _ES$ParseTemporalDate.year;
        month = _ES$ParseTemporalDate.month;
        day = _ES$ParseTemporalDate.day;
        hour = _ES$ParseTemporalDate.hour;
        minute = _ES$ParseTemporalDate.minute;
        second = _ES$ParseTemporalDate.second;
        millisecond = _ES$ParseTemporalDate.millisecond;
        microsecond = _ES$ParseTemporalDate.microsecond;
        nanosecond = _ES$ParseTemporalDate.nanosecond;
        calendar = _ES$ParseTemporalDate.calendar;
        if (!calendar) calendar = GetISO8601Calendar();
        calendar = ES.ToTemporalCalendar(calendar);
      }

      var TemporalDateTime = GetIntrinsic$1('%Temporal.DateTime%');
      return new TemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
    },
    ValidateTemporalUnitRange: function ValidateTemporalUnitRange(largestUnit, smallestUnit) {
      var validUnits = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds'];

      if (validUnits.indexOf(largestUnit) > validUnits.indexOf(smallestUnit)) {
        throw new RangeError("largestUnit ".concat(largestUnit, " cannot be smaller than smallestUnit ").concat(smallestUnit));
      }
    },
    LargerOfTwoTemporalDurationUnits: function LargerOfTwoTemporalDurationUnits(unit1, unit2) {
      var validUnits = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds'];
      if (validUnits.indexOf(unit1) > validUnits.indexOf(unit2)) return unit2;
      return unit1;
    },
    ToPartialRecord: function ToPartialRecord(bag, fields) {
      if (!bag || 'object' !== _typeof(bag)) return false;
      var any;

      var _iterator6 = _createForOfIteratorHelper(fields),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var property = _step6.value;
          var value = bag[property];

          if (value !== undefined) {
            any = any || {};

            if (property === 'era') {
              // FIXME: this is terrible
              any.era = value;
            } else {
              any[property] = ES.ToInteger(value);
            }
          }
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }

      return any ? any : false;
    },
    ToRecord: function ToRecord(bag, fields) {
      if (!bag || 'object' !== _typeof(bag)) return false;
      var result = {};

      var _iterator7 = _createForOfIteratorHelper(fields),
          _step7;

      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var fieldRecord = _step7.value;

          var _fieldRecord = _slicedToArray(fieldRecord, 2),
              property = _fieldRecord[0],
              defaultValue = _fieldRecord[1];

          var value = bag[property];

          if (value === undefined) {
            if (fieldRecord.length === 1) {
              throw new TypeError("required property '".concat(property, "' missing or undefined"));
            }

            value = defaultValue;
          }

          if (property === 'era') {
            // FIXME: this is terrible
            result.era = value;
          } else {
            result[property] = ES.ToInteger(value);
          }
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }

      return result;
    },
    // field access in the following operations is intentionally alphabetical
    ToTemporalDateRecord: function ToTemporalDateRecord(bag) {
      return ES.ToRecord(bag, [['day'], ['era', undefined], ['month'], ['year']]);
    },
    ToTemporalDateTimeRecord: function ToTemporalDateTimeRecord(bag) {
      return ES.ToRecord(bag, [['day'], ['era', undefined], ['hour', 0], ['microsecond', 0], ['millisecond', 0], ['minute', 0], ['month'], ['nanosecond', 0], ['second', 0], ['year']]);
    },
    ToTemporalMonthDayRecord: function ToTemporalMonthDayRecord(bag) {
      return ES.ToRecord(bag, [['day'], ['month']]);
    },
    ToTemporalTimeRecord: function ToTemporalTimeRecord(bag) {
      return ES.ToRecord(bag, [['hour', 0], ['microsecond', 0], ['millisecond', 0], ['minute', 0], ['nanosecond', 0], ['second', 0]]);
    },
    ToTemporalYearMonthRecord: function ToTemporalYearMonthRecord(bag) {
      return ES.ToRecord(bag, [['era', undefined], ['month'], ['year']]);
    },
    CalendarFrom: function CalendarFrom(calendarLike) {
      var TemporalCalendar = GetIntrinsic$1('%Temporal.Calendar%');
      var from = TemporalCalendar.from;

      if (from === undefined) {
        from = GetIntrinsic$1('%Temporal.Calendar.from%');
      }

      var calendar = ES.Call(from, TemporalCalendar, [calendarLike]);

      if (ES.Type(calendar) !== 'Object') {
        throw new TypeError('Temporal.Calendar.from should return an object');
      }

      return calendar;
    },
    CalendarToString: function CalendarToString(calendar) {
      var toString = calendar.toString;
      if (toString === undefined) toString = GetIntrinsic$1('%Temporal.Calendar.prototype.toString%');
      return ES.ToString(ES.Call(toString, calendar));
    },
    ToTemporalCalendar: function ToTemporalCalendar(calendarLike) {
      if (ES.Type(calendarLike) === 'Object') {
        return calendarLike;
      }

      var identifier = ES.ToString(calendarLike);
      return ES.CalendarFrom(identifier);
    },
    TimeZoneFrom: function TimeZoneFrom(temporalTimeZoneLike) {
      var TemporalTimeZone = GetIntrinsic$1('%Temporal.TimeZone%');
      var from = TemporalTimeZone.from;

      if (from === undefined) {
        from = GetIntrinsic$1('%Temporal.TimeZone.from%');
      }

      return ES.Call(from, TemporalTimeZone, [temporalTimeZoneLike]);
    },
    ToTemporalTimeZone: function ToTemporalTimeZone(temporalTimeZoneLike) {
      if (_typeof(temporalTimeZoneLike) === 'object' && temporalTimeZoneLike) {
        return temporalTimeZoneLike;
      }

      var identifier = ES.ToString(temporalTimeZoneLike);
      return ES.TimeZoneFrom(identifier);
    },
    TemporalDateTimeToDate: function TemporalDateTimeToDate(dateTime) {
      var Date = GetIntrinsic$1('%Temporal.Date%');
      return new Date(GetSlot(dateTime, ISO_YEAR), GetSlot(dateTime, ISO_MONTH), GetSlot(dateTime, ISO_DAY), GetSlot(dateTime, CALENDAR));
    },
    TemporalDateTimeToTime: function TemporalDateTimeToTime(dateTime) {
      var Time = GetIntrinsic$1('%Temporal.Time%');
      return new Time(GetSlot(dateTime, HOUR), GetSlot(dateTime, MINUTE), GetSlot(dateTime, SECOND), GetSlot(dateTime, MILLISECOND), GetSlot(dateTime, MICROSECOND), GetSlot(dateTime, NANOSECOND));
    },
    GetOffsetNanosecondsFor: function GetOffsetNanosecondsFor(timeZone, absolute) {
      var getOffsetNanosecondsFor = timeZone.getOffsetNanosecondsFor;

      if (getOffsetNanosecondsFor === undefined) {
        getOffsetNanosecondsFor = GetIntrinsic$1('%Temporal.TimeZone.prototype.getOffsetNanosecondsFor%');
      }

      var offsetNs = ES.Call(getOffsetNanosecondsFor, timeZone, [absolute]);

      if (typeof offsetNs !== 'number') {
        throw new TypeError('bad return from getOffsetNanosecondsFor');
      }

      if (!Number.isInteger(offsetNs) || Math.abs(offsetNs) > 86400e9) {
        throw new RangeError('out-of-range return from getOffsetNanosecondsFor');
      }

      return offsetNs;
    },
    GetOffsetStringFor: function GetOffsetStringFor(timeZone, absolute) {
      var getOffsetStringFor = timeZone.getOffsetStringFor;

      if (getOffsetStringFor === undefined) {
        getOffsetStringFor = GetIntrinsic$1('%Temporal.TimeZone.prototype.getOffsetStringFor%');
      }

      return ES.ToString(ES.Call(getOffsetStringFor, timeZone, [absolute]));
    },
    GetTemporalDateTimeFor: function GetTemporalDateTimeFor(timeZone, absolute, calendar) {
      var getDateTimeFor = timeZone.getDateTimeFor;

      if (getDateTimeFor === undefined) {
        getDateTimeFor = GetIntrinsic$1('%Temporal.TimeZone.prototype.getDateTimeFor%');
      }

      var dateTime = ES.Call(getDateTimeFor, timeZone, [absolute, calendar]);

      if (!ES.IsTemporalDateTime(dateTime)) {
        throw new TypeError('Unexpected result from getDateTimeFor');
      }

      return dateTime;
    },
    GetTemporalInstantFor: function GetTemporalInstantFor(timeZone, dateTime, disambiguation) {
      var getInstantFor = timeZone.getInstantFor;

      if (getInstantFor === undefined) {
        getInstantFor = GetIntrinsic$1('%Temporal.TimeZone.prototype.getInstantFor%');
      }

      return ES.Call(getInstantFor, timeZone, [dateTime, {
        disambiguation: disambiguation
      }]);
    },
    TimeZoneToString: function TimeZoneToString(timeZone) {
      var toString = timeZone.toString;

      if (toString === undefined) {
        toString = GetIntrinsic$1('%Temporal.TimeZone.prototype.toString%');
      }

      return ES.ToString(ES.Call(toString, timeZone));
    },
    ISOTimeZoneString: function ISOTimeZoneString(timeZone, absolute) {
      var name = ES.TimeZoneToString(timeZone);
      var offset = ES.GetOffsetStringFor(timeZone, absolute);

      if (name === 'UTC') {
        return 'Z';
      }

      if (name === offset) {
        return offset;
      }

      return "".concat(offset, "[").concat(name, "]");
    },
    ISOYearString: function ISOYearString(year) {
      var yearString;

      if (year < 1000 || year > 9999) {
        var sign = year < 0 ? '-' : '+';
        var yearNumber = Math.abs(year);
        yearString = sign + "000000".concat(yearNumber).slice(-6);
      } else {
        yearString = "".concat(year);
      }

      return yearString;
    },
    ISODateTimePartString: function ISODateTimePartString(part) {
      return "00".concat(part).slice(-2);
    },
    FormatSecondsStringPart: function FormatSecondsStringPart(seconds, millis, micros, nanos) {
      if (!seconds && !millis && !micros && !nanos) return '';
      var parts = [];
      if (nanos) parts.unshift("000".concat(nanos || 0).slice(-3));
      if (micros || parts.length) parts.unshift("000".concat(micros || 0).slice(-3));
      if (millis || parts.length) parts.unshift("000".concat(millis || 0).slice(-3));
      var secs = "00".concat(seconds).slice(-2);
      var post = parts.length ? ".".concat(parts.join('')) : '';
      return ":".concat(secs).concat(post);
    },
    TemporalInstantToString: function TemporalInstantToString(absolute, timeZone) {
      var dateTime = ES.GetTemporalDateTimeFor(timeZone, absolute);
      var year = ES.ISOYearString(dateTime.year);
      var month = ES.ISODateTimePartString(dateTime.month);
      var day = ES.ISODateTimePartString(dateTime.day);
      var hour = ES.ISODateTimePartString(dateTime.hour);
      var minute = ES.ISODateTimePartString(dateTime.minute);
      var seconds = ES.FormatSecondsStringPart(dateTime.second, dateTime.millisecond, dateTime.microsecond, dateTime.nanosecond);
      var timeZoneString = ES.ISOTimeZoneString(timeZone, absolute);
      return "".concat(year, "-").concat(month, "-").concat(day, "T").concat(hour, ":").concat(minute).concat(seconds).concat(timeZoneString);
    },
    TemporalDurationToString: function TemporalDurationToString(duration) {
      function formatNumber(num) {
        if (num <= Number.MAX_SAFE_INTEGER) return num.toString(10);
        return BigInteger(num).toString();
      }

      var years = GetSlot(duration, YEARS);
      var months = GetSlot(duration, MONTHS);
      var weeks = GetSlot(duration, WEEKS);
      var days = GetSlot(duration, DAYS);
      var hours = GetSlot(duration, HOURS);
      var minutes = GetSlot(duration, MINUTES);
      var seconds = GetSlot(duration, SECONDS);
      var ms = GetSlot(duration, MILLISECONDS);
      var µs = GetSlot(duration, MICROSECONDS);
      var ns = GetSlot(duration, NANOSECONDS);
      var sign = ES.DurationSign(years, months, weeks, days, hours, minutes, seconds, ms, µs, ns);
      var dateParts = [];
      if (years) dateParts.push("".concat(formatNumber(Math.abs(years)), "Y"));
      if (months) dateParts.push("".concat(formatNumber(Math.abs(months)), "M"));
      if (weeks) dateParts.push("".concat(formatNumber(Math.abs(weeks)), "W"));
      if (days) dateParts.push("".concat(formatNumber(Math.abs(days)), "D"));
      var timeParts = [];
      if (hours) timeParts.push("".concat(formatNumber(Math.abs(hours)), "H"));
      if (minutes) timeParts.push("".concat(formatNumber(Math.abs(minutes)), "M"));
      var secondParts = [];
      var total = BigInteger(seconds).times(1000).plus(ms).times(1000).plus(µs).times(1000).plus(ns);

      var _total$divmod = total.divmod(1000);

      total = _total$divmod.quotient;
      ns = _total$divmod.remainder;

      var _total$divmod2 = total.divmod(1000);

      total = _total$divmod2.quotient;
      µs = _total$divmod2.remainder;

      var _total$divmod3 = total.divmod(1000);

      seconds = _total$divmod3.quotient;
      ms = _total$divmod3.remainder;
      ms = ms.toJSNumber();
      µs = µs.toJSNumber();
      ns = ns.toJSNumber();
      if (ns) secondParts.unshift("".concat(Math.abs(ns)).padStart(3, '0'));
      if (µs || secondParts.length) secondParts.unshift("".concat(Math.abs(µs)).padStart(3, '0'));
      if (ms || secondParts.length) secondParts.unshift("".concat(Math.abs(ms)).padStart(3, '0'));
      if (secondParts.length) secondParts.unshift('.');
      if (!seconds.isZero() || secondParts.length) secondParts.unshift(seconds.abs().toString());
      if (secondParts.length) timeParts.push("".concat(secondParts.join(''), "S"));
      if (timeParts.length) timeParts.unshift('T');
      if (!dateParts.length && !timeParts.length) return 'PT0S';
      return "".concat(sign < 0 ? '-' : '', "P").concat(dateParts.join('')).concat(timeParts.join(''));
    },
    GetCanonicalTimeZoneIdentifier: function GetCanonicalTimeZoneIdentifier(timeZoneIdentifier) {
      var offsetNs = parseOffsetString(timeZoneIdentifier);
      if (offsetNs !== null) return ES.FormatTimeZoneOffsetString(offsetNs);
      var formatter = new IntlDateTimeFormat('en-us', {
        timeZone: String(timeZoneIdentifier),
        hour12: false,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      });
      return formatter.resolvedOptions().timeZone;
    },
    GetIANATimeZoneOffsetNanoseconds: function GetIANATimeZoneOffsetNanoseconds(epochNanoseconds, id) {
      var _ES$GetIANATimeZoneDa = ES.GetIANATimeZoneDateTimeParts(epochNanoseconds, id),
          year = _ES$GetIANATimeZoneDa.year,
          month = _ES$GetIANATimeZoneDa.month,
          day = _ES$GetIANATimeZoneDa.day,
          hour = _ES$GetIANATimeZoneDa.hour,
          minute = _ES$GetIANATimeZoneDa.minute,
          second = _ES$GetIANATimeZoneDa.second,
          millisecond = _ES$GetIANATimeZoneDa.millisecond,
          microsecond = _ES$GetIANATimeZoneDa.microsecond,
          nanosecond = _ES$GetIANATimeZoneDa.nanosecond;

      var utc = ES.GetEpochFromParts(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
      if (utc === null) throw new RangeError('Date outside of supported range');
      return +utc.minus(epochNanoseconds);
    },
    FormatTimeZoneOffsetString: function FormatTimeZoneOffsetString(offsetNanoseconds) {
      var sign = offsetNanoseconds < 0 ? '-' : '+';
      offsetNanoseconds = Math.abs(offsetNanoseconds);
      var offsetMinutes = Math.floor(offsetNanoseconds / 60e9);
      var offsetMinuteString = "00".concat(offsetMinutes % 60).slice(-2);
      var offsetHourString = "00".concat(Math.floor(offsetMinutes / 60)).slice(-2);
      return "".concat(sign).concat(offsetHourString, ":").concat(offsetMinuteString);
    },
    GetEpochFromParts: function GetEpochFromParts(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) {
      // Note: Date.UTC() interprets one and two-digit years as being in the
      // 20th century, so don't use it
      var legacyDate = new Date();
      legacyDate.setUTCHours(hour, minute, second, millisecond);
      legacyDate.setUTCFullYear(year, month - 1, day);
      var ms = legacyDate.getTime();
      if (Number.isNaN(ms)) return null;
      var ns = BigInteger(ms).multiply(1e6);
      ns = ns.plus(BigInteger(microsecond).multiply(1e3));
      ns = ns.plus(BigInteger(nanosecond));
      if (ns.lesser(NS_MIN) || ns.greater(NS_MAX)) return null;
      return ns;
    },
    GetPartsFromEpoch: function GetPartsFromEpoch(epochNanoseconds) {
      var _bigInt$divmod = BigInteger(epochNanoseconds).divmod(1e6),
          quotient = _bigInt$divmod.quotient,
          remainder = _bigInt$divmod.remainder;

      var epochMilliseconds = +quotient;
      var nanos = +remainder;

      if (nanos < 0) {
        nanos += 1e6;
        epochMilliseconds -= 1;
      }

      var microsecond = Math.floor(nanos / 1e3) % 1e3;
      var nanosecond = nanos % 1e3;
      var item = new Date(epochMilliseconds);
      var year = item.getUTCFullYear();
      var month = item.getUTCMonth() + 1;
      var day = item.getUTCDate();
      var hour = item.getUTCHours();
      var minute = item.getUTCMinutes();
      var second = item.getUTCSeconds();
      var millisecond = item.getUTCMilliseconds();
      return {
        epochMilliseconds: epochMilliseconds,
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
        second: second,
        millisecond: millisecond,
        microsecond: microsecond,
        nanosecond: nanosecond
      };
    },
    GetIANATimeZoneDateTimeParts: function GetIANATimeZoneDateTimeParts(epochNanoseconds, id) {
      var _ES$GetPartsFromEpoch = ES.GetPartsFromEpoch(epochNanoseconds),
          epochMilliseconds = _ES$GetPartsFromEpoch.epochMilliseconds,
          millisecond = _ES$GetPartsFromEpoch.millisecond,
          microsecond = _ES$GetPartsFromEpoch.microsecond,
          nanosecond = _ES$GetPartsFromEpoch.nanosecond;

      var _ES$GetFormatterParts = ES.GetFormatterParts(id, epochMilliseconds),
          year = _ES$GetFormatterParts.year,
          month = _ES$GetFormatterParts.month,
          day = _ES$GetFormatterParts.day,
          hour = _ES$GetFormatterParts.hour,
          minute = _ES$GetFormatterParts.minute,
          second = _ES$GetFormatterParts.second;

      return ES.BalanceDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
    },
    GetIANATimeZoneNextTransition: function GetIANATimeZoneNextTransition(epochNanoseconds, id) {
      var uppercap = ES.SystemUTCEpochNanoSeconds() + 366 * DAYMILLIS * 1e6;
      var leftNanos = epochNanoseconds;
      var leftOffsetNs = ES.GetIANATimeZoneOffsetNanoseconds(leftNanos, id);
      var rightNanos = leftNanos;
      var rightOffsetNs = leftOffsetNs;

      while (leftOffsetNs === rightOffsetNs && BigInteger(leftNanos).compare(uppercap) === -1) {
        rightNanos = BigInteger(leftNanos).plus(2 * 7 * DAYMILLIS * 1e6);
        rightOffsetNs = ES.GetIANATimeZoneOffsetNanoseconds(rightNanos, id);

        if (leftOffsetNs === rightOffsetNs) {
          leftNanos = rightNanos;
        }
      }

      if (leftOffsetNs === rightOffsetNs) return null;
      var result = bisect(function (epochNs) {
        return ES.GetIANATimeZoneOffsetNanoseconds(epochNs, id);
      }, leftNanos, rightNanos, leftOffsetNs, rightOffsetNs);
      return result;
    },
    GetIANATimeZonePreviousTransition: function GetIANATimeZonePreviousTransition(epochNanoseconds, id) {
      var lowercap = BEFORE_FIRST_DST; // 1847-01-01T00:00:00Z

      var rightNanos = epochNanoseconds;
      var rightOffsetNs = ES.GetIANATimeZoneOffsetNanoseconds(rightNanos, id);
      var leftNanos = rightNanos;
      var leftOffsetNs = rightOffsetNs;

      while (rightOffsetNs === leftOffsetNs && BigInteger(rightNanos).compare(lowercap) === 1) {
        leftNanos = BigInteger(rightNanos).minus(2 * 7 * DAYMILLIS * 1e6);
        leftOffsetNs = ES.GetIANATimeZoneOffsetNanoseconds(leftNanos, id);

        if (rightOffsetNs === leftOffsetNs) {
          rightNanos = leftNanos;
        }
      }

      if (rightOffsetNs === leftOffsetNs) return null;
      var result = bisect(function (epochNs) {
        return ES.GetIANATimeZoneOffsetNanoseconds(epochNs, id);
      }, leftNanos, rightNanos, leftOffsetNs, rightOffsetNs);
      return result;
    },
    GetFormatterParts: function GetFormatterParts(timeZone, epochMilliseconds) {
      var formatter = new IntlDateTimeFormat('en-us', {
        timeZone: timeZone,
        hour12: false,
        era: 'short',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }); // FIXME: can this use formatToParts instead?

      var datetime = formatter.format(new Date(epochMilliseconds));

      var _datetime$split = datetime.split(/,\s+/),
          _datetime$split2 = _slicedToArray(_datetime$split, 3),
          date = _datetime$split2[0],
          fullYear = _datetime$split2[1],
          time = _datetime$split2[2];

      var _date$split = date.split(' '),
          _date$split2 = _slicedToArray(_date$split, 2),
          month = _date$split2[0],
          day = _date$split2[1];

      var _fullYear$split = fullYear.split(' '),
          _fullYear$split2 = _slicedToArray(_fullYear$split, 2),
          year = _fullYear$split2[0],
          era = _fullYear$split2[1];

      var _time$split = time.split(':'),
          _time$split2 = _slicedToArray(_time$split, 3),
          hour = _time$split2[0],
          minute = _time$split2[1],
          second = _time$split2[2];

      return {
        year: era === 'BC' ? -year + 1 : +year,
        month: +month,
        day: +day,
        hour: hour === '24' ? 0 : +hour,
        // bugs.chromium.org/p/chromium/issues/detail?id=1045791
        minute: +minute,
        second: +second
      };
    },
    GetIANATimeZoneEpochValue: function GetIANATimeZoneEpochValue(id, year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) {
      var ns = ES.GetEpochFromParts(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
      if (ns === null) throw new RangeError('DateTime outside of supported range');
      var dayNanos = BigInteger(DAYMILLIS).multiply(1e6);
      var nsEarlier = ns.minus(dayNanos);
      if (nsEarlier.lesser(NS_MIN)) nsEarlier = ns;
      var nsLater = ns.plus(dayNanos);
      if (nsLater.greater(NS_MAX)) nsLater = ns;
      var earliest = ES.GetIANATimeZoneOffsetNanoseconds(nsEarlier, id);
      var latest = ES.GetIANATimeZoneOffsetNanoseconds(nsLater, id);
      var found = earliest === latest ? [earliest] : [earliest, latest];
      return found.map(function (offsetNanoseconds) {
        var epochNanoseconds = BigInteger(ns).minus(offsetNanoseconds);
        var parts = ES.GetIANATimeZoneDateTimeParts(epochNanoseconds, id);

        if (year !== parts.year || month !== parts.month || day !== parts.day || hour !== parts.hour || minute !== parts.minute || second !== parts.second || millisecond !== parts.millisecond || microsecond !== parts.microsecond || nanosecond !== parts.nanosecond) {
          return undefined;
        }

        return epochNanoseconds;
      }).filter(function (x) {
        return x !== undefined;
      });
    },
    LeapYear: function LeapYear(year) {
      if (undefined === year) return false;
      var isDiv4 = year % 4 === 0;
      var isDiv100 = year % 100 === 0;
      var isDiv400 = year % 400 === 0;
      return isDiv4 && (!isDiv100 || isDiv400);
    },
    DaysInMonth: function DaysInMonth(year, month) {
      var DoM = {
        standard: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        leapyear: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      };
      return DoM[ES.LeapYear(year) ? 'leapyear' : 'standard'][month - 1];
    },
    DayOfWeek: function DayOfWeek(year, month, day) {
      var m = month + (month < 3 ? 10 : -2);
      var Y = year - (month < 3 ? 1 : 0);
      var c = Math.floor(Y / 100);
      var y = Y - c * 100;
      var d = day;
      var pD = d;
      var pM = Math.floor(2.6 * m - 0.2);
      var pY = y + Math.floor(y / 4);
      var pC = Math.floor(c / 4) - 2 * c;
      var dow = (pD + pM + pY + pC) % 7;
      return dow + (dow <= 0 ? 7 : 0);
    },
    DayOfYear: function DayOfYear(year, month, day) {
      var days = day;

      for (var m = month - 1; m > 0; m--) {
        days += ES.DaysInMonth(year, m);
      }

      return days;
    },
    WeekOfYear: function WeekOfYear(year, month, day) {
      var doy = ES.DayOfYear(year, month, day);
      var dow = ES.DayOfWeek(year, month, day) || 7;
      var doj = ES.DayOfWeek(year, 1, 1);
      var week = Math.floor((doy - dow + 10) / 7);

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
    DurationSign: function DurationSign(y, mon, w, d, h, min, s, ms, µs, ns) {
      for (var _i3 = 0, _arr3 = [y, mon, w, d, h, min, s, ms, µs, ns]; _i3 < _arr3.length; _i3++) {
        var prop = _arr3[_i3];
        if (prop !== 0) return prop < 0 ? -1 : 1;
      }

      return 0;
    },
    BalanceYearMonth: function BalanceYearMonth(year, month) {
      if (!Number.isFinite(year) || !Number.isFinite(month)) throw new RangeError('infinity is out of range');
      month -= 1;
      year += Math.floor(month / 12);
      month %= 12;
      if (month < 0) month += 12;
      month += 1;
      return {
        year: year,
        month: month
      };
    },
    BalanceDate: function BalanceDate(year, month, day) {
      if (!Number.isFinite(day)) throw new RangeError('infinity is out of range');

      var _ES$BalanceYearMonth = ES.BalanceYearMonth(year, month);

      year = _ES$BalanceYearMonth.year;
      month = _ES$BalanceYearMonth.month;
      var daysInYear = 0;
      var testYear = month > 2 ? year : year - 1;

      while (daysInYear = ES.LeapYear(testYear) ? 366 : 365, day < -daysInYear) {
        year -= 1;
        testYear -= 1;
        day += daysInYear;
      }

      testYear += 1;

      while (daysInYear = ES.LeapYear(testYear) ? 366 : 365, day > daysInYear) {
        year += 1;
        testYear += 1;
        day -= daysInYear;
      }

      while (day < 1) {
        var _ES$BalanceYearMonth2 = ES.BalanceYearMonth(year, month - 1);

        year = _ES$BalanceYearMonth2.year;
        month = _ES$BalanceYearMonth2.month;
        day += ES.DaysInMonth(year, month);
      }

      while (day > ES.DaysInMonth(year, month)) {
        day -= ES.DaysInMonth(year, month);

        var _ES$BalanceYearMonth3 = ES.BalanceYearMonth(year, month + 1);

        year = _ES$BalanceYearMonth3.year;
        month = _ES$BalanceYearMonth3.month;
      }

      return {
        year: year,
        month: month,
        day: day
      };
    },
    BalanceDateTime: function BalanceDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) {
      var deltaDays;

      var _ES$BalanceTime = ES.BalanceTime(hour, minute, second, millisecond, microsecond, nanosecond);

      deltaDays = _ES$BalanceTime.deltaDays;
      hour = _ES$BalanceTime.hour;
      minute = _ES$BalanceTime.minute;
      second = _ES$BalanceTime.second;
      millisecond = _ES$BalanceTime.millisecond;
      microsecond = _ES$BalanceTime.microsecond;
      nanosecond = _ES$BalanceTime.nanosecond;

      var _ES$BalanceDate = ES.BalanceDate(year, month, day + deltaDays);

      year = _ES$BalanceDate.year;
      month = _ES$BalanceDate.month;
      day = _ES$BalanceDate.day;
      return {
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
        second: second,
        millisecond: millisecond,
        microsecond: microsecond,
        nanosecond: nanosecond
      };
    },
    BalanceTime: function BalanceTime(hour, minute, second, millisecond, microsecond, nanosecond) {
      if (!Number.isFinite(hour) || !Number.isFinite(minute) || !Number.isFinite(second) || !Number.isFinite(millisecond) || !Number.isFinite(microsecond) || !Number.isFinite(nanosecond)) {
        throw new RangeError('infinity is out of range');
      }

      microsecond += Math.floor(nanosecond / 1000);
      nanosecond = ES.NonNegativeModulo(nanosecond, 1000);
      millisecond += Math.floor(microsecond / 1000);
      microsecond = ES.NonNegativeModulo(microsecond, 1000);
      second += Math.floor(millisecond / 1000);
      millisecond = ES.NonNegativeModulo(millisecond, 1000);
      minute += Math.floor(second / 60);
      second = ES.NonNegativeModulo(second, 60);
      hour += Math.floor(minute / 60);
      minute = ES.NonNegativeModulo(minute, 60);
      var deltaDays = Math.floor(hour / 24);
      hour = ES.NonNegativeModulo(hour, 24);
      return {
        deltaDays: deltaDays,
        hour: hour,
        minute: minute,
        second: second,
        millisecond: millisecond,
        microsecond: microsecond,
        nanosecond: nanosecond
      };
    },
    BalanceDurationDate: function BalanceDurationDate(years, months, startYear, startMonth, startDay) {
      if (months < 0) {
        years -= 1;
        months += 12;
      }

      var _ES$BalanceYearMonth4 = ES.BalanceYearMonth(startYear + years, startMonth + months),
          year = _ES$BalanceYearMonth4.year,
          month = _ES$BalanceYearMonth4.month;

      while (startDay > ES.DaysInMonth(year, month)) {
        months -= 1;

        if (months < 0) {
          years -= 1;
          months += 12;
        }

        var _ES$BalanceYearMonth5 = ES.BalanceYearMonth(startYear + years, startMonth + months);

        year = _ES$BalanceYearMonth5.year;
        month = _ES$BalanceYearMonth5.month;
      }

      return {
        year: year,
        month: month,
        years: years,
        months: months
      };
    },
    BalanceDuration: function BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, largestUnit) {
      var sign = ES.DurationSign(0, 0, 0, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
      days *= sign;
      hours *= sign;
      minutes *= sign;
      seconds *= sign;
      milliseconds *= sign;
      microseconds *= sign;
      nanoseconds *= sign;
      var deltaDays;

      var _ES$BalanceTime2 = ES.BalanceTime(hours, minutes, seconds, milliseconds, microseconds, nanoseconds);

      deltaDays = _ES$BalanceTime2.deltaDays;
      hours = _ES$BalanceTime2.hour;
      minutes = _ES$BalanceTime2.minute;
      seconds = _ES$BalanceTime2.second;
      milliseconds = _ES$BalanceTime2.millisecond;
      microseconds = _ES$BalanceTime2.microsecond;
      nanoseconds = _ES$BalanceTime2.nanosecond;
      days += deltaDays;

      switch (largestUnit) {
        case 'hours':
          hours += 24 * days;
          days = 0;
          break;

        case 'minutes':
          minutes += 60 * (hours + 24 * days);
          hours = days = 0;
          break;

        case 'seconds':
          seconds += 60 * (minutes + 60 * (hours + 24 * days));
          minutes = hours = days = 0;
          break;

        case 'milliseconds':
          milliseconds += 1000 * (seconds + 60 * (minutes + 60 * (hours + 24 * days)));
          seconds = minutes = hours = days = 0;
          break;

        case 'microseconds':
          microseconds += 1000 * (milliseconds + 1000 * (seconds + 60 * (minutes + 60 * (hours + 24 * days))));
          milliseconds = seconds = minutes = hours = days = 0;
          break;

        case 'nanoseconds':
          nanoseconds += 1000 * (microseconds + 1000 * (milliseconds + 1000 * (seconds + 60 * (minutes + 60 * (hours + 24 * days)))));
          microseconds = milliseconds = seconds = minutes = hours = days = 0;
          break;

        case 'years':
        case 'months':
        case 'weeks':
        case 'days':
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
      return {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        milliseconds: milliseconds,
        microseconds: microseconds,
        nanoseconds: nanoseconds
      };
    },
    UnbalanceDurationRelative: function UnbalanceDurationRelative(years, months, weeks, days, largestUnit, relativeTo) {
      var TemporalDate = GetIntrinsic$1('%Temporal.Date%');
      var TemporalDuration = GetIntrinsic$1('%Temporal.Duration%');
      var sign = ES.DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
      years *= sign;
      months *= sign;
      weeks *= sign;
      days *= sign;
      var calendar;

      if (relativeTo) {
        if (!ES.IsTemporalDateTime(relativeTo)) throw new TypeError('starting point must be DateTime');
        calendar = GetSlot(relativeTo, CALENDAR);
      }

      var oneYear = new TemporalDuration(1);
      var oneMonth = new TemporalDuration(0, 1);
      var oneWeek = new TemporalDuration(0, 0, 1);

      switch (largestUnit) {
        case 'years':
          // no-op
          break;

        case 'months':
          if (!calendar) throw new RangeError('a starting point is required for months balancing'); // balance years down to months

          while (years > 0) {
            var oneYearMonths = calendar.monthsInYear(relativeTo);
            months += oneYearMonths;
            years--;
            relativeTo = calendar.dateAdd(relativeTo, oneYear, {}, TemporalDate);
          }

          break;

        case 'weeks':
          if (!calendar) throw new RangeError('a starting point is required for weeks balancing'); // balance years down to days

          while (years > 0) {
            var oneYearDays = calendar.daysInYear(relativeTo);
            days += oneYearDays;
            years--;
            relativeTo = calendar.dateAdd(relativeTo, oneYear, {}, TemporalDate);
          } // balance months down to days


          while (months > 0) {
            var oneMonthDays = calendar.daysInMonth(relativeTo);
            days += oneMonthDays;
            months--;
            relativeTo = calendar.dateAdd(relativeTo, oneMonth, {}, TemporalDate);
          }

          break;

        default:
          // balance years down to days
          while (years > 0) {
            if (!calendar) throw new RangeError('a starting point is required for balancing calendar units');

            var _oneYearDays = calendar.daysInYear(relativeTo);

            days += _oneYearDays;
            years--;
            relativeTo = calendar.dateAdd(relativeTo, oneYear, {}, TemporalDate);
          } // balance months down to days


          while (months > 0) {
            if (!calendar) throw new RangeError('a starting point is required for balancing calendar units');

            var _oneMonthDays = calendar.daysInMonth(relativeTo);

            days += _oneMonthDays;
            months--;
            relativeTo = calendar.dateAdd(relativeTo, oneMonth, {}, TemporalDate);
          } // balance weeks down to days


          while (weeks > 0) {
            if (!calendar) throw new RangeError('a starting point is required for balancing calendar units');
            var oneWeekDays = calendar.daysInWeek(relativeTo);
            days += oneWeekDays;
            weeks--;
            relativeTo = calendar.dateAdd(relativeTo, oneWeek, {}, TemporalDate);
          }

          break;
      }

      years *= sign;
      months *= sign;
      weeks *= sign;
      days *= sign;
      return {
        years: years,
        months: months,
        weeks: weeks,
        days: days
      };
    },
    BalanceDurationRelative: function BalanceDurationRelative(years, months, weeks, days, largestUnit, relativeTo) {
      var TemporalDate = GetIntrinsic$1('%Temporal.Date%');
      var TemporalDuration = GetIntrinsic$1('%Temporal.Duration%');
      var sign = ES.DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
      years *= sign;
      months *= sign;
      weeks *= sign;
      days *= sign;
      var calendar;

      if (relativeTo) {
        if (!ES.IsTemporalDateTime(relativeTo)) throw new TypeError('starting point must be DateTime');
        calendar = GetSlot(relativeTo, CALENDAR);
      }

      var oneYear = new TemporalDuration(1);
      var oneMonth = new TemporalDuration(0, 1);
      var oneWeek = new TemporalDuration(0, 0, 1);

      switch (largestUnit) {
        case 'years':
          {
            if (!calendar) throw new RangeError('a starting point is required for years balancing'); // balance days up to years

            var oneYearDays = calendar.daysInYear(relativeTo);

            while (days >= oneYearDays) {
              days -= oneYearDays;
              years++;
              relativeTo = calendar.dateSubtract(relativeTo, oneYear, {}, TemporalDate);
              oneYearDays = calendar.daysInYear(relativeTo);
            } // balance days up to months


            var oneMonthDays = calendar.daysInMonth(relativeTo);

            while (days >= oneMonthDays) {
              days -= oneMonthDays;
              months++;
              relativeTo = calendar.dateSubtract(relativeTo, oneMonth, {}, TemporalDate);
              oneMonthDays = calendar.daysInMonth(relativeTo);
            } // balance months up to years


            var oneYearMonths = calendar.monthsInYear(relativeTo);

            while (months >= oneYearMonths) {
              months -= oneYearMonths;
              years++;
              relativeTo = calendar.dateSubtract(relativeTo, oneYear, {}, TemporalDate);
              oneYearMonths = calendar.monthsInYear(relativeTo);
            }

            break;
          }

        case 'months':
          {
            if (!calendar) throw new RangeError('a starting point is required for months balancing'); // balance days up to months

            var _oneMonthDays2 = calendar.daysInMonth(relativeTo);

            while (days >= _oneMonthDays2) {
              days -= _oneMonthDays2;
              months++;
              relativeTo = calendar.dateSubtract(relativeTo, oneMonth, {}, TemporalDate);
              _oneMonthDays2 = calendar.daysInMonth(relativeTo);
            }

            break;
          }

        case 'weeks':
          {
            if (!calendar) throw new RangeError('a starting point is required for weeks balancing'); // balance days up to weeks

            var oneWeekDays = calendar.daysInWeek(relativeTo);

            while (days >= oneWeekDays) {
              days -= oneWeekDays;
              weeks++;
              relativeTo = calendar.dateSubtract(relativeTo, oneWeek, {}, TemporalDate);
              oneWeekDays = calendar.daysInWeek(relativeTo);
            }

            break;
          }
      }

      years *= sign;
      months *= sign;
      weeks *= sign;
      days *= sign;
      return {
        years: years,
        months: months,
        weeks: weeks,
        days: days
      };
    },
    ConstrainToRange: function ConstrainToRange(value, min, max) {
      return Math.min(max, Math.max(min, value));
    },
    ConstrainDate: function ConstrainDate(year, month, day) {
      month = ES.ConstrainToRange(month, 1, 12);
      day = ES.ConstrainToRange(day, 1, ES.DaysInMonth(year, month));
      return {
        year: year,
        month: month,
        day: day
      };
    },
    ConstrainTime: function ConstrainTime(hour, minute, second, millisecond, microsecond, nanosecond) {
      hour = ES.ConstrainToRange(hour, 0, 23);
      minute = ES.ConstrainToRange(minute, 0, 59);
      second = ES.ConstrainToRange(second, 0, 59);
      millisecond = ES.ConstrainToRange(millisecond, 0, 999);
      microsecond = ES.ConstrainToRange(microsecond, 0, 999);
      nanosecond = ES.ConstrainToRange(nanosecond, 0, 999);
      return {
        hour: hour,
        minute: minute,
        second: second,
        millisecond: millisecond,
        microsecond: microsecond,
        nanosecond: nanosecond
      };
    },
    ConstrainDateTime: function ConstrainDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) {
      var _ES$ConstrainDate4 = ES.ConstrainDate(year, month, day);

      year = _ES$ConstrainDate4.year;
      month = _ES$ConstrainDate4.month;
      day = _ES$ConstrainDate4.day;

      var _ES$ConstrainTime2 = ES.ConstrainTime(hour, minute, second, millisecond, microsecond, nanosecond);

      hour = _ES$ConstrainTime2.hour;
      minute = _ES$ConstrainTime2.minute;
      second = _ES$ConstrainTime2.second;
      millisecond = _ES$ConstrainTime2.millisecond;
      microsecond = _ES$ConstrainTime2.microsecond;
      nanosecond = _ES$ConstrainTime2.nanosecond;
      return {
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
        second: second,
        millisecond: millisecond,
        microsecond: microsecond,
        nanosecond: nanosecond
      };
    },
    RejectToRange: function RejectToRange(value, min, max) {
      if (value < min || value > max) throw new RangeError("value out of range: ".concat(min, " <= ").concat(value, " <= ").concat(max));
    },
    RejectDate: function RejectDate(year, month, day) {
      ES.RejectToRange(month, 1, 12);
      ES.RejectToRange(day, 1, ES.DaysInMonth(year, month));
    },
    RejectDateRange: function RejectDateRange(year, month, day) {
      // Noon avoids trouble at edges of DateTime range (excludes midnight)
      ES.RejectDateTimeRange(year, month, day, 12, 0, 0, 0, 0, 0);
    },
    RejectTime: function RejectTime(hour, minute, second, millisecond, microsecond, nanosecond) {
      ES.RejectToRange(hour, 0, 23);
      ES.RejectToRange(minute, 0, 59);
      ES.RejectToRange(second, 0, 59);
      ES.RejectToRange(millisecond, 0, 999);
      ES.RejectToRange(microsecond, 0, 999);
      ES.RejectToRange(nanosecond, 0, 999);
    },
    RejectDateTime: function RejectDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) {
      ES.RejectDate(year, month, day);
      ES.RejectTime(hour, minute, second, millisecond, microsecond, nanosecond);
    },
    RejectDateTimeRange: function RejectDateTimeRange(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) {
      ES.RejectToRange(year, YEAR_MIN, YEAR_MAX); // Reject any DateTime 24 hours or more outside the Instant range

      if (year === YEAR_MIN && null == ES.GetEpochFromParts(year, month, day + 1, hour, minute, second, millisecond, microsecond, nanosecond - 1) || year === YEAR_MAX && null == ES.GetEpochFromParts(year, month, day - 1, hour, minute, second, millisecond, microsecond, nanosecond + 1)) {
        throw new RangeError('DateTime outside of supported range');
      }
    },
    RejectInstantRange: function RejectInstantRange(epochNanoseconds) {
      if (epochNanoseconds.lesser(NS_MIN) || epochNanoseconds.greater(NS_MAX)) {
        throw new RangeError('Instant outside of supported range');
      }
    },
    RejectYearMonthRange: function RejectYearMonthRange(year, month) {
      ES.RejectToRange(year, YEAR_MIN, YEAR_MAX);

      if (year === YEAR_MIN) {
        ES.RejectToRange(month, 4, 12);
      } else if (year === YEAR_MAX) {
        ES.RejectToRange(month, 1, 9);
      }
    },
    RejectDurationSign: function RejectDurationSign(y, mon, w, d, h, min, s, ms, µs, ns) {
      var sign = ES.DurationSign(y, mon, w, d, h, min, s, ms, µs, ns);

      for (var _i4 = 0, _arr4 = [y, mon, w, d, h, min, s, ms, µs, ns]; _i4 < _arr4.length; _i4++) {
        var prop = _arr4[_i4];
        var propSign = Math.sign(prop);
        if (propSign !== 0 && propSign !== sign) throw new RangeError('mixed-sign values not allowed as duration fields');
      }
    },
    DifferenceDate: function DifferenceDate(y1, m1, d1, y2, m2, d2) {
      var largestUnit = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 'days';
      var larger, smaller, sign;

      if (ES.CompareTemporalDate(y1, m1, d1, y2, m2, d2) < 0) {
        smaller = {
          year: y1,
          month: m1,
          day: d1
        };
        larger = {
          year: y2,
          month: m2,
          day: d2
        };
        sign = 1;
      } else {
        smaller = {
          year: y2,
          month: m2,
          day: d2
        };
        larger = {
          year: y1,
          month: m1,
          day: d1
        };
        sign = -1;
      }

      var years = larger.year - smaller.year;
      var weeks = 0;
      var months, days;

      switch (largestUnit) {
        case 'years':
        case 'months':
          {
            months = larger.month - smaller.month;
            var year, month;

            var _ES$BalanceDurationDa = ES.BalanceDurationDate(years, months, smaller.year, smaller.month, smaller.day);

            year = _ES$BalanceDurationDa.year;
            month = _ES$BalanceDurationDa.month;
            years = _ES$BalanceDurationDa.years;
            months = _ES$BalanceDurationDa.months;
            days = ES.DayOfYear(larger.year, larger.month, larger.day) - ES.DayOfYear(year, month, smaller.day);

            if (days < 0) {
              months -= 1;

              var _ES$BalanceDurationDa2 = ES.BalanceDurationDate(years, months, smaller.year, smaller.month, smaller.day);

              year = _ES$BalanceDurationDa2.year;
              month = _ES$BalanceDurationDa2.month;
              years = _ES$BalanceDurationDa2.years;
              months = _ES$BalanceDurationDa2.months;
              days = ES.DayOfYear(larger.year, larger.month, larger.day) - ES.DayOfYear(year, month, smaller.day);
              if (larger.year > year) days += ES.LeapYear(year) ? 366 : 365;
            }

            if (largestUnit === 'months') {
              months += years * 12;
              years = 0;
            }

            break;
          }

        case 'weeks':
        case 'days':
          months = 0;
          days = ES.DayOfYear(larger.year, larger.month, larger.day) - ES.DayOfYear(smaller.year, smaller.month, smaller.day);

          while (years > 0) {
            days += ES.LeapYear(smaller.year + years - 1) ? 366 : 365;
            years -= 1;
          }

          if (largestUnit === 'weeks') {
            weeks = Math.floor(days / 7);
            days %= 7;
          }

          break;

        default:
          throw new Error('assert not reached');
      }

      years *= sign;
      months *= sign;
      weeks *= sign;
      days *= sign;
      return {
        years: years,
        months: months,
        weeks: weeks,
        days: days
      };
    },
    DifferenceTime: function DifferenceTime(h1, min1, s1, ms1, µs1, ns1, h2, min2, s2, ms2, µs2, ns2) {
      var hours = h2 - h1;
      var minutes = min2 - min1;
      var seconds = s2 - s1;
      var milliseconds = ms2 - ms1;
      var microseconds = µs2 - µs1;
      var nanoseconds = ns2 - ns1;
      var sign = ES.DurationSign(0, 0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
      hours *= sign;
      minutes *= sign;
      seconds *= sign;
      milliseconds *= sign;
      microseconds *= sign;
      nanoseconds *= sign;
      var deltaDays = 0;

      var _ES$BalanceTime3 = ES.BalanceTime(hours, minutes, seconds, milliseconds, microseconds, nanoseconds);

      deltaDays = _ES$BalanceTime3.deltaDays;
      hours = _ES$BalanceTime3.hour;
      minutes = _ES$BalanceTime3.minute;
      seconds = _ES$BalanceTime3.second;
      milliseconds = _ES$BalanceTime3.millisecond;
      microseconds = _ES$BalanceTime3.microsecond;
      nanoseconds = _ES$BalanceTime3.nanosecond;
      deltaDays *= sign;
      hours *= sign;
      minutes *= sign;
      seconds *= sign;
      milliseconds *= sign;
      microseconds *= sign;
      nanoseconds *= sign;
      return {
        deltaDays: deltaDays,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        milliseconds: milliseconds,
        microseconds: microseconds,
        nanoseconds: nanoseconds
      };
    },
    AddDate: function AddDate(year, month, day, years, months, weeks, days, overflow) {
      year += years;
      month += months;

      var _ES$BalanceYearMonth6 = ES.BalanceYearMonth(year, month);

      year = _ES$BalanceYearMonth6.year;
      month = _ES$BalanceYearMonth6.month;

      var _ES$RegulateDate = ES.RegulateDate(year, month, day, overflow);

      year = _ES$RegulateDate.year;
      month = _ES$RegulateDate.month;
      day = _ES$RegulateDate.day;
      days += 7 * weeks;
      day += days;

      var _ES$BalanceDate2 = ES.BalanceDate(year, month, day);

      year = _ES$BalanceDate2.year;
      month = _ES$BalanceDate2.month;
      day = _ES$BalanceDate2.day;
      return {
        year: year,
        month: month,
        day: day
      };
    },
    AddTime: function AddTime(hour, minute, second, millisecond, microsecond, nanosecond, hours, minutes, seconds, milliseconds, microseconds, nanoseconds) {
      hour += hours;
      minute += minutes;
      second += seconds;
      millisecond += milliseconds;
      microsecond += microseconds;
      nanosecond += nanoseconds;
      var deltaDays = 0;

      var _ES$BalanceTime4 = ES.BalanceTime(hour, minute, second, millisecond, microsecond, nanosecond);

      deltaDays = _ES$BalanceTime4.deltaDays;
      hour = _ES$BalanceTime4.hour;
      minute = _ES$BalanceTime4.minute;
      second = _ES$BalanceTime4.second;
      millisecond = _ES$BalanceTime4.millisecond;
      microsecond = _ES$BalanceTime4.microsecond;
      nanosecond = _ES$BalanceTime4.nanosecond;
      return {
        deltaDays: deltaDays,
        hour: hour,
        minute: minute,
        second: second,
        millisecond: millisecond,
        microsecond: microsecond,
        nanosecond: nanosecond
      };
    },
    SubtractDate: function SubtractDate(year, month, day, years, months, weeks, days, overflow) {
      days += 7 * weeks;
      day -= days;

      var _ES$BalanceDate3 = ES.BalanceDate(year, month, day);

      year = _ES$BalanceDate3.year;
      month = _ES$BalanceDate3.month;
      day = _ES$BalanceDate3.day;
      month -= months;
      year -= years;

      var _ES$BalanceYearMonth7 = ES.BalanceYearMonth(year, month);

      year = _ES$BalanceYearMonth7.year;
      month = _ES$BalanceYearMonth7.month;

      var _ES$RegulateDate2 = ES.RegulateDate(year, month, day, overflow);

      year = _ES$RegulateDate2.year;
      month = _ES$RegulateDate2.month;
      day = _ES$RegulateDate2.day;
      return {
        year: year,
        month: month,
        day: day
      };
    },
    SubtractTime: function SubtractTime(hour, minute, second, millisecond, microsecond, nanosecond, hours, minutes, seconds, milliseconds, microseconds, nanoseconds) {
      hour -= hours;
      minute -= minutes;
      second -= seconds;
      millisecond -= milliseconds;
      microsecond -= microseconds;
      nanosecond -= nanoseconds;
      var deltaDays = 0;

      var _ES$BalanceTime5 = ES.BalanceTime(hour, minute, second, millisecond, microsecond, nanosecond);

      deltaDays = _ES$BalanceTime5.deltaDays;
      hour = _ES$BalanceTime5.hour;
      minute = _ES$BalanceTime5.minute;
      second = _ES$BalanceTime5.second;
      millisecond = _ES$BalanceTime5.millisecond;
      microsecond = _ES$BalanceTime5.microsecond;
      nanosecond = _ES$BalanceTime5.nanosecond;
      return {
        deltaDays: deltaDays,
        hour: hour,
        minute: minute,
        second: second,
        millisecond: millisecond,
        microsecond: microsecond,
        nanosecond: nanosecond
      };
    },
    DurationArithmetic: function DurationArithmetic(y1, mon1, w1, d1, h1, min1, s1, ms1, µs1, ns1, y2, mon2, w2, d2, h2, min2, s2, ms2, µs2, ns2, overflow) {
      var years = y1 + y2;
      var months = mon1 + mon2;
      var weeks = w1 + w2;
      var days = d1 + d2;
      var hours = h1 + h2;
      var minutes = min1 + min2;
      var seconds = s1 + s2;
      var milliseconds = ms1 + ms2;
      var microseconds = µs1 + µs2;
      var nanoseconds = ns1 + ns2;
      var sign = ES.DurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
      years *= sign;
      months *= sign;
      weeks *= sign;
      days *= sign;
      hours *= sign;
      minutes *= sign;
      seconds *= sign;
      milliseconds *= sign;
      microseconds *= sign;
      nanoseconds *= sign;

      if (nanoseconds < 0) {
        microseconds += Math.floor(nanoseconds / 1000);
        nanoseconds = ES.NonNegativeModulo(nanoseconds, 1000);
      }

      if (microseconds < 0) {
        milliseconds += Math.floor(microseconds / 1000);
        microseconds = ES.NonNegativeModulo(microseconds, 1000);
      }

      if (milliseconds < 0) {
        seconds += Math.floor(milliseconds / 1000);
        milliseconds = ES.NonNegativeModulo(milliseconds, 1000);
      }

      if (seconds < 0) {
        minutes += Math.floor(seconds / 60);
        seconds = ES.NonNegativeModulo(seconds, 60);
      }

      if (minutes < 0) {
        hours += Math.floor(minutes / 60);
        minutes = ES.NonNegativeModulo(minutes, 60);
      }

      if (hours < 0) {
        days += Math.floor(hours / 24);
        hours = ES.NonNegativeModulo(hours, 24);
      }

      for (var _i5 = 0, _arr5 = [months, weeks, days]; _i5 < _arr5.length; _i5++) {
        var prop = _arr5[_i5];
        if (prop < 0) throw new RangeError('mixed sign not allowed in duration fields');
      }

      years *= sign;
      months *= sign;
      weeks *= sign;
      days *= sign;
      hours *= sign;
      minutes *= sign;
      seconds *= sign;
      milliseconds *= sign;
      microseconds *= sign;
      nanoseconds *= sign;
      return ES.RegulateDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, overflow);
    },
    RoundNumberToIncrement: function RoundNumberToIncrement(quantity, increment, mode) {
      var quotient = quantity / increment;
      var round;

      switch (mode) {
        case 'ceil':
          round = MathCeil(quotient);
          break;

        case 'floor':
          round = MathFloor(quotient);
          break;

        case 'trunc':
          round = MathTrunc(quotient);
          break;

        case 'nearest':
          // "half away from zero"
          round = MathSign(quotient) * MathFloor(MathAbs(quotient) + 0.5);
          break;
      }

      return round * increment;
    },
    RoundTime: function RoundTime(hour, minute, second, millisecond, microsecond, nanosecond, increment, unit, roundingMode) {
      var quantity = 0;

      switch (unit) {
        case 'day':
          quantity = (((second + millisecond * 1e-3 + microsecond * 1e-6 + nanosecond * 1e-9) / 60 + minute) / 60 + hour) / 24;
          break;

        case 'hour':
          quantity = ((second + millisecond * 1e-3 + microsecond * 1e-6 + nanosecond * 1e-9) / 60 + minute) / 60 + hour;
          break;

        case 'minute':
          quantity = (second + millisecond * 1e-3 + microsecond * 1e-6 + nanosecond * 1e-9) / 60 + minute;
          break;

        case 'second':
          quantity = second + millisecond * 1e-3 + microsecond * 1e-6 + nanosecond * 1e-9;
          break;

        case 'millisecond':
          quantity = millisecond + microsecond * 1e-3 + nanosecond * 1e-9;
          break;

        case 'microsecond':
          quantity = microsecond + nanosecond * 1e-3;
          break;

        case 'nanosecond':
          quantity = nanosecond;
          break;
      }

      var result = ES.RoundNumberToIncrement(quantity, increment, roundingMode);

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
          return ES.BalanceTime(result, 0, 0, 0, 0, 0);

        case 'minute':
          return ES.BalanceTime(hour, result, 0, 0, 0, 0);

        case 'second':
          return ES.BalanceTime(hour, minute, result, 0, 0, 0);

        case 'millisecond':
          return ES.BalanceTime(hour, minute, second, result, 0, 0);

        case 'microsecond':
          return ES.BalanceTime(hour, minute, second, millisecond, result, 0);

        case 'nanosecond':
          return ES.BalanceTime(hour, minute, second, millisecond, microsecond, result);
      }
    },
    RoundDuration: function RoundDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, increment, unit, roundingMode, relativeTo) {
      var TemporalDate = GetIntrinsic$1('%Temporal.Date%');
      var TemporalDuration = GetIntrinsic$1('%Temporal.Duration%');
      var calendar;

      if (relativeTo) {
        if (!ES.IsTemporalDateTime(relativeTo)) throw new TypeError('starting point must be DateTime');
        calendar = GetSlot(relativeTo, CALENDAR);
      }

      switch (unit) {
        case 'years':
          {
            if (!calendar) throw new RangeError('A starting point is required for years rounding'); // convert months and weeks to days by calculating difference(
            // relativeTo - years, relativeTo - { years, months, weeks })

            var yearsBefore = calendar.dateSubtract(relativeTo, new TemporalDuration(years), {}, TemporalDate);
            var yearsMonthsWeeks = new TemporalDuration(years, months, weeks);
            var yearsMonthsWeeksBefore = calendar.dateSubtract(relativeTo, yearsMonthsWeeks, {}, TemporalDate);
            var monthsWeeksInDays = ES.DifferenceDate(GetSlot(yearsMonthsWeeksBefore, ISO_YEAR), GetSlot(yearsMonthsWeeksBefore, ISO_MONTH), GetSlot(yearsMonthsWeeksBefore, ISO_DAY), GetSlot(yearsBefore, ISO_YEAR), GetSlot(yearsBefore, ISO_MONTH), GetSlot(yearsBefore, ISO_DAY), 'days');
            seconds += milliseconds * 1e-3 + microseconds * 1e-6 + nanoseconds * 1e-9;
            days += monthsWeeksInDays.days;
            days += ((seconds / 60 + minutes) / 60 + hours) / 24; // Years may be different lengths of days depending on the calendar, so
            // we need to convert days to years in a loop. We get the number of days
            // in the one-year period preceding the relativeTo date, and convert
            // that number of days to one year, repeating until the number of days
            // is less than a year.

            var oneYear = new TemporalDuration(1);
            var sign = Math.sign(days);
            relativeTo = calendar.dateSubtract(relativeTo, oneYear, {}, TemporalDate);
            var oneYearDays = calendar.daysInYear(relativeTo);

            while (Math.abs(days) > oneYearDays) {
              years += sign;
              days -= oneYearDays * sign;
              relativeTo = calendar.dateSubtract(relativeTo, oneYear, {}, TemporalDate);
              oneYearDays = calendar.daysInYear(relativeTo);
            }

            years += days / oneYearDays;
            years = ES.RoundNumberToIncrement(years, increment, roundingMode);
            months = weeks = days = hours = minutes = seconds = milliseconds = microseconds = nanoseconds = 0;
            break;
          }

        case 'months':
          {
            if (!calendar) throw new RangeError('A starting point is required for months rounding'); // convert weeks to days by calculating difference(relativeTo -
            //   { years, months }, relativeTo - { years, months, weeks })

            var yearsMonths = new TemporalDuration(years, months);
            var yearsMonthsBefore = calendar.dateSubtract(relativeTo, yearsMonths, {}, TemporalDate);

            var _yearsMonthsWeeks = new TemporalDuration(years, months, weeks);

            var _yearsMonthsWeeksBefore = calendar.dateSubtract(relativeTo, _yearsMonthsWeeks, {}, TemporalDate);

            var weeksInDays = ES.DifferenceDate(GetSlot(_yearsMonthsWeeksBefore, ISO_YEAR), GetSlot(_yearsMonthsWeeksBefore, ISO_MONTH), GetSlot(_yearsMonthsWeeksBefore, ISO_DAY), GetSlot(yearsMonthsBefore, ISO_YEAR), GetSlot(yearsMonthsBefore, ISO_MONTH), GetSlot(yearsMonthsBefore, ISO_DAY), 'days');
            seconds += milliseconds * 1e-3 + microseconds * 1e-6 + nanoseconds * 1e-9;
            days += weeksInDays.days;
            days += ((seconds / 60 + minutes) / 60 + hours) / 24; // Months may be different lengths of days depending on the calendar,
            // convert days to months in a loop as described above under 'years'.

            var oneMonth = new TemporalDuration(0, 1);

            var _sign = Math.sign(days);

            relativeTo = calendar.dateSubtract(relativeTo, oneMonth, {}, TemporalDate);
            var oneMonthDays = calendar.daysInMonth(relativeTo);

            while (Math.abs(days) > oneMonthDays) {
              months += _sign;
              days -= oneMonthDays * _sign;
              relativeTo = calendar.dateSubtract(relativeTo, oneMonth, {}, TemporalDate);
              oneMonthDays = calendar.daysInMonth(relativeTo);
            }

            months += days / oneMonthDays;
            months = ES.RoundNumberToIncrement(months, increment, roundingMode);
            weeks = days = hours = minutes = seconds = milliseconds = microseconds = nanoseconds = 0;
            break;
          }

        case 'weeks':
          {
            if (!calendar) throw new RangeError('A starting point is required for weeks rounding');
            seconds += milliseconds * 1e-3 + microseconds * 1e-6 + nanoseconds * 1e-9;
            days += ((seconds / 60 + minutes) / 60 + hours) / 24; // Weeks may be different lengths of days depending on the calendar,
            // convert days to weeks in a loop as described above under 'years'.

            var oneWeek = new TemporalDuration(0, 0, 1);

            var _sign2 = Math.sign(days);

            relativeTo = calendar.dateSubtract(relativeTo, oneWeek, {}, TemporalDate);
            var oneWeekDays = calendar.daysInWeek(relativeTo);

            while (Math.abs(days) > oneWeekDays) {
              weeks += _sign2;
              days -= oneWeekDays * _sign2;
              relativeTo = calendar.dateSubtract(relativeTo, oneWeek, {}, TemporalDate);
              oneWeekDays = calendar.daysInWeek(relativeTo);
            }

            weeks += days / oneWeekDays;
            weeks = ES.RoundNumberToIncrement(weeks, increment, roundingMode);
            days = hours = minutes = seconds = milliseconds = microseconds = nanoseconds = 0;
            break;
          }

        case 'days':
          seconds += milliseconds * 1e-3 + microseconds * 1e-6 + nanoseconds * 1e-9;
          days += ((seconds / 60 + minutes) / 60 + hours) / 24;
          days = ES.RoundNumberToIncrement(days, increment, roundingMode);
          hours = minutes = seconds = milliseconds = microseconds = nanoseconds = 0;
          break;

        case 'hours':
          seconds += milliseconds * 1e-3 + microseconds * 1e-6 + nanoseconds * 1e-9;
          hours += (minutes + seconds / 60) / 60;
          hours = ES.RoundNumberToIncrement(hours, increment, roundingMode);
          minutes = seconds = milliseconds = microseconds = nanoseconds = 0;
          break;

        case 'minutes':
          seconds += milliseconds * 1e-3 + microseconds * 1e-6 + nanoseconds * 1e-9;
          minutes += seconds / 60;
          minutes = ES.RoundNumberToIncrement(minutes, increment, roundingMode);
          seconds = milliseconds = microseconds = nanoseconds = 0;
          break;

        case 'seconds':
          seconds += milliseconds * 1e-3 + microseconds * 1e-6 + nanoseconds * 1e-9;
          seconds = ES.RoundNumberToIncrement(seconds, increment, roundingMode);
          milliseconds = microseconds = nanoseconds = 0;
          break;

        case 'milliseconds':
          milliseconds += microseconds * 1e-3 + nanoseconds * 1e-6;
          milliseconds = ES.RoundNumberToIncrement(milliseconds, increment, roundingMode);
          microseconds = nanoseconds = 0;
          break;

        case 'microseconds':
          microseconds += nanoseconds * 1e-3;
          microseconds = ES.RoundNumberToIncrement(microseconds, increment, roundingMode);
          nanoseconds = 0;
          break;

        case 'nanoseconds':
          nanoseconds = ES.RoundNumberToIncrement(nanoseconds, increment, roundingMode);
          break;
      }

      return {
        years: years,
        months: months,
        weeks: weeks,
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        milliseconds: milliseconds,
        microseconds: microseconds,
        nanoseconds: nanoseconds
      };
    },
    CompareTemporalDate: function CompareTemporalDate(y1, m1, d1, y2, m2, d2) {
      for (var _i6 = 0, _arr6 = [[y1, y2], [m1, m2], [d1, d2]]; _i6 < _arr6.length; _i6++) {
        var _arr6$_i = _slicedToArray(_arr6[_i6], 2),
            x = _arr6$_i[0],
            y = _arr6$_i[1];

        if (x !== y) return ES.ComparisonResult(x - y);
      }

      return 0;
    },
    AssertPositiveInteger: function AssertPositiveInteger(num) {
      if (!Number.isFinite(num) || Math.abs(num) !== num) throw new RangeError("invalid positive integer: ".concat(num));
      return num;
    },
    NonNegativeModulo: function NonNegativeModulo(x, y) {
      var result = x % y;
      if (Object.is(result, -0)) return 0;
      if (result < 0) result += y;
      return result;
    },
    ToBigInt: function ToBigInt(arg) {
      if (BigInteger.isInstance(arg)) {
        return arg;
      }

      var prim = ES.ToPrimitive(arg, Number);

      switch (_typeof(prim)) {
        case 'undefined':
        case 'object':
        case 'number':
        case 'symbol':
          throw new TypeError("cannot convert ".concat(_typeof(arg), " to bigint"));

        case 'string':
          if (!prim.match(/^\s*(?:[+-]?\d+\s*)?$/)) {
            throw new SyntaxError('invalid BigInt syntax');
          }

        // eslint: no-fallthrough: false

        case 'bigint':
          try {
            return BigInteger(prim);
          } catch (e) {
            if (e instanceof Error && e.message.startsWith('Invalid integer')) throw new SyntaxError(e.message);
            throw e;
          }

        case 'boolean':
          if (prim) {
            return BigInteger(1);
          } else {
            return BigInteger(0);
          }

      }
    },
    // Note: This method returns values with bogus nanoseconds based on the previous iteration's
    // milliseconds. That way there is a guarantee that the full nanoseconds are always going to be
    // increasing at least and that the microsecond and nanosecond fields are likely to be non-zero.
    SystemUTCEpochNanoSeconds: function () {
      var ns = Date.now() % 1e6;
      return function () {
        var ms = Date.now();
        var result = BigInteger(ms).multiply(1e6).plus(ns);
        ns = ms % 1e6;
        return result;
      };
    }(),
    SystemTimeZone: function SystemTimeZone() {
      var fmt = new IntlDateTimeFormat('en-us');
      var TemporalTimeZone = GetIntrinsic$1('%Temporal.TimeZone%');
      return new TemporalTimeZone(ES.TemporalTimeZoneFromString(fmt.resolvedOptions().timeZone));
    },
    ComparisonResult: function ComparisonResult(value) {
      return value < 0 ? -1 : value > 0 ? 1 : value;
    },
    NormalizeOptionsObject: function NormalizeOptionsObject(options) {
      if (options === undefined) return ObjectCreate(null);
      if (ES.Type(options) === 'Object') return options;
      throw new TypeError("Options parameter must be an object, not ".concat(options === null ? 'null' : "a ".concat(_typeof(options))));
    },
    GetOption: function GetOption(options, property, allowedValues, fallback) {
      var value = options[property];

      if (value !== undefined) {
        value = ES.ToString(value);

        if (!allowedValues.includes(value)) {
          throw new RangeError("".concat(property, " must be one of ").concat(allowedValues.join(', '), ", not ").concat(value));
        }

        return value;
      }

      return fallback;
    },
    GetNumberOption: function GetNumberOption(options, property, minimum, maximum, fallback) {
      var value = options[property];
      if (value === undefined) return fallback;
      value = ES.ToNumber(value);

      if (NumberIsNaN(value) || value < minimum || value > maximum) {
        throw new RangeError("".concat(property, " must be between ").concat(minimum, " and ").concat(maximum, ", not ").concat(value));
      }

      return MathFloor(value);
    }
  });
  var OFFSET = new RegExp("^".concat(offset.source, "$"));

  function parseOffsetString(string) {
    var match = OFFSET.exec(String(string));
    if (!match) return null;
    var sign = match[1] === '-' || match[1] === "\u2212" ? -1 : +1;
    var hours = +match[2];
    var minutes = +(match[3] || 0);
    return sign * (hours * 60 + minutes) * 60 * 1e9;
  }

  function bisect(getState, left, right) {
    var lstate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : getState(left);
    var rstate = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : getState(right);
    left = BigInteger(left);
    right = BigInteger(right);

    while (right.minus(left).greater(1)) {
      var middle = left.plus(right).divide(2);
      var mstate = getState(middle);

      if (mstate === lstate) {
        left = middle;
        lstate = mstate;
      } else if (mstate === rstate) {
        right = middle;
        rstate = mstate;
      } else {
        throw new Error("invalid state in bisection ".concat(lstate, " - ").concat(mstate, " - ").concat(rstate));
      }
    }

    return right;
  }

  var Calendar = /*#__PURE__*/function () {
    function Calendar(id) {
      _classCallCheck(this, Calendar);

      CreateSlots(this);
      SetSlot(this, CALENDAR_ID, id);

      {
        Object.defineProperty(this, '_repr_', {
          value: "".concat(this[Symbol.toStringTag], " <").concat(this, ">"),
          writable: false,
          enumerable: false,
          configurable: false
        });
      }
    }

    _createClass(Calendar, [{
      key: "dateFromFields",
      value: function dateFromFields(fields, options, constructor) {
        throw new Error('not implemented');
      }
    }, {
      key: "yearMonthFromFields",
      value: function yearMonthFromFields(fields, options, constructor) {
        throw new Error('not implemented');
      }
    }, {
      key: "monthDayFromFields",
      value: function monthDayFromFields(fields, options, constructor) {
        throw new Error('not implemented');
      }
    }, {
      key: "dateAdd",
      value: function dateAdd(date, duration, options, constructor) {
        throw new Error('not implemented');
      }
    }, {
      key: "dateSubtract",
      value: function dateSubtract(date, duration, options, constructor) {
        throw new Error('not implemented');
      }
    }, {
      key: "dateDifference",
      value: function dateDifference(one, two, options) {
        throw new Error('not implemented');
      }
    }, {
      key: "year",
      value: function year(date) {
        throw new Error('not implemented');
      }
    }, {
      key: "month",
      value: function month(date) {
        throw new Error('not implemented');
      }
    }, {
      key: "day",
      value: function day(date) {
        throw new Error('not implemented');
      }
    }, {
      key: "era",
      value: function era(date) {
        throw new Error('not implemented');
      }
    }, {
      key: "dayOfWeek",
      value: function dayOfWeek(date) {
        throw new Error('not implemented');
      }
    }, {
      key: "dayOfYear",
      value: function dayOfYear(date) {
        throw new Error('not implemented');
      }
    }, {
      key: "weekOfYear",
      value: function weekOfYear(date) {
        throw new Error('not implemented');
      }
    }, {
      key: "daysInWeek",
      value: function daysInWeek(date) {
        throw new Error('not implemented');
      }
    }, {
      key: "daysInMonth",
      value: function daysInMonth(date) {
        throw new Error('not implemented');
      }
    }, {
      key: "daysInYear",
      value: function daysInYear(date) {
        throw new Error('not implemented');
      }
    }, {
      key: "monthsInYear",
      value: function monthsInYear(date) {
        throw new Error('not implemented');
      }
    }, {
      key: "isLeapYear",
      value: function isLeapYear(date) {
        throw new Error('not implemented');
      }
    }, {
      key: "toString",
      value: function toString() {
        if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR_ID);
      }
    }, {
      key: "id",
      get: function get() {
        if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR_ID);
      }
    }], [{
      key: "from",
      value: function from(item) {
        if (ES.IsTemporalCalendar(item) || _typeof(item) === 'object' && item) return item;
        var stringIdent = ES.ToString(item);
        return GetBuiltinCalendar(stringIdent);
      }
    }]);

    return Calendar;
  }();
  MakeIntrinsicClass(Calendar, 'Temporal.Calendar');
  DefineIntrinsic('Temporal.Calendar.from', Calendar.from);
  DefineIntrinsic('Temporal.Calendar.prototype.toString', Calendar.prototype.toString);

  var ISO8601Calendar = /*#__PURE__*/function (_Calendar) {
    _inherits(ISO8601Calendar, _Calendar);

    var _super = _createSuper(ISO8601Calendar);

    function ISO8601Calendar() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'iso8601';

      _classCallCheck(this, ISO8601Calendar);

      // Needs to be subclassable, that's why the ID is a default argument
      return _super.call(this, id);
    }

    _createClass(ISO8601Calendar, [{
      key: "dateFromFields",
      value: function dateFromFields(fields, options, constructor) {
        if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
        options = ES.NormalizeOptionsObject(options);
        var overflow = ES.ToTemporalOverflow(options); // Intentionally alphabetical

        var _ES$ToTemporalDateRec = ES.ToTemporalDateRecord(fields),
            year = _ES$ToTemporalDateRec.year,
            month = _ES$ToTemporalDateRec.month,
            day = _ES$ToTemporalDateRec.day;

        var _ES$RegulateDate = ES.RegulateDate(year, month, day, overflow);

        year = _ES$RegulateDate.year;
        month = _ES$RegulateDate.month;
        day = _ES$RegulateDate.day;
        return new constructor(year, month, day, this);
      }
    }, {
      key: "yearMonthFromFields",
      value: function yearMonthFromFields(fields, options, constructor) {
        if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
        options = ES.NormalizeOptionsObject(options);
        var overflow = ES.ToTemporalOverflow(options); // Intentionally alphabetical

        var _ES$ToTemporalYearMon = ES.ToTemporalYearMonthRecord(fields),
            year = _ES$ToTemporalYearMon.year,
            month = _ES$ToTemporalYearMon.month;

        var _ES$RegulateYearMonth = ES.RegulateYearMonth(year, month, overflow);

        year = _ES$RegulateYearMonth.year;
        month = _ES$RegulateYearMonth.month;
        return new constructor(year, month, this,
        /* referenceISODay = */
        1);
      }
    }, {
      key: "monthDayFromFields",
      value: function monthDayFromFields(fields, options, constructor) {
        if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
        options = ES.NormalizeOptionsObject(options);
        var overflow = ES.ToTemporalOverflow(options); // Intentionally alphabetical

        var _ES$ToTemporalMonthDa = ES.ToTemporalMonthDayRecord(fields),
            month = _ES$ToTemporalMonthDa.month,
            day = _ES$ToTemporalMonthDa.day;

        var _ES$RegulateMonthDay = ES.RegulateMonthDay(month, day, overflow);

        month = _ES$RegulateMonthDay.month;
        day = _ES$RegulateMonthDay.day;
        return new constructor(month, day, this,
        /* referenceISOYear = */
        1972);
      }
    }, {
      key: "dateAdd",
      value: function dateAdd(date, duration, options, constructor) {
        if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
        options = ES.NormalizeOptionsObject(options);
        var overflow = ES.ToTemporalOverflow(options);
        var years = duration.years,
            months = duration.months,
            weeks = duration.weeks,
            days = duration.days;
        ES.RejectDurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
        var sign = ES.DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
        var year = GetSlot(date, ISO_YEAR);
        var month = GetSlot(date, ISO_MONTH);
        var day = GetSlot(date, ISO_DAY);

        if (sign < 0) {
          var _ES$SubtractDate = ES.SubtractDate(year, month, day, -years, -months, -weeks, -days, overflow);

          year = _ES$SubtractDate.year;
          month = _ES$SubtractDate.month;
          day = _ES$SubtractDate.day;
        } else {
          var _ES$AddDate = ES.AddDate(year, month, day, years, months, weeks, days, overflow);

          year = _ES$AddDate.year;
          month = _ES$AddDate.month;
          day = _ES$AddDate.day;
        }

        return new constructor(year, month, day, this);
      }
    }, {
      key: "dateSubtract",
      value: function dateSubtract(date, duration, options, constructor) {
        if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
        options = ES.NormalizeOptionsObject(options);
        var overflow = ES.ToTemporalOverflow(options);
        var years = duration.years,
            months = duration.months,
            weeks = duration.weeks,
            days = duration.days;
        ES.RejectDurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
        var sign = ES.DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
        var year = GetSlot(date, ISO_YEAR);
        var month = GetSlot(date, ISO_MONTH);
        var day = GetSlot(date, ISO_DAY);

        if (sign < 0) {
          var _ES$AddDate2 = ES.AddDate(year, month, day, -years, -months, -weeks, -days, overflow);

          year = _ES$AddDate2.year;
          month = _ES$AddDate2.month;
          day = _ES$AddDate2.day;
        } else {
          var _ES$SubtractDate2 = ES.SubtractDate(year, month, day, years, months, weeks, days, overflow);

          year = _ES$SubtractDate2.year;
          month = _ES$SubtractDate2.month;
          day = _ES$SubtractDate2.day;
        }

        return new constructor(year, month, day, this);
      }
    }, {
      key: "dateDifference",
      value: function dateDifference(one, two, options) {
        if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
        options = ES.NormalizeOptionsObject(options);
        var largestUnit = ES.ToLargestTemporalUnit(options, 'days', ['hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds']);

        var _ES$DifferenceDate = ES.DifferenceDate(GetSlot(one, ISO_YEAR), GetSlot(one, ISO_MONTH), GetSlot(one, ISO_DAY), GetSlot(two, ISO_YEAR), GetSlot(two, ISO_MONTH), GetSlot(two, ISO_DAY), largestUnit),
            years = _ES$DifferenceDate.years,
            months = _ES$DifferenceDate.months,
            weeks = _ES$DifferenceDate.weeks,
            days = _ES$DifferenceDate.days;

        var Duration = GetIntrinsic$1('%Temporal.Duration%');
        return new Duration(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
      }
    }, {
      key: "year",
      value: function year(date) {
        if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
        return GetSlot(date, ISO_YEAR);
      }
    }, {
      key: "month",
      value: function month(date) {
        if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
        return GetSlot(date, ISO_MONTH);
      }
    }, {
      key: "day",
      value: function day(date) {
        if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
        return GetSlot(date, ISO_DAY);
      }
    }, {
      key: "era",
      value: function era(date) {
        return undefined;
      }
    }, {
      key: "dayOfWeek",
      value: function dayOfWeek(date) {
        if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
        return ES.DayOfWeek(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH), GetSlot(date, ISO_DAY));
      }
    }, {
      key: "dayOfYear",
      value: function dayOfYear(date) {
        if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
        return ES.DayOfYear(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH), GetSlot(date, ISO_DAY));
      }
    }, {
      key: "weekOfYear",
      value: function weekOfYear(date) {
        if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
        return ES.WeekOfYear(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH), GetSlot(date, ISO_DAY));
      }
    }, {
      key: "daysInWeek",
      value: function daysInWeek(date) {
        return 7;
      }
    }, {
      key: "daysInMonth",
      value: function daysInMonth(date) {
        if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
        return ES.DaysInMonth(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH));
      }
    }, {
      key: "daysInYear",
      value: function daysInYear(date) {
        if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
        return ES.LeapYear(GetSlot(date, ISO_YEAR)) ? 366 : 365;
      }
    }, {
      key: "monthsInYear",
      value: function monthsInYear(date) {
        return 12;
      }
    }, {
      key: "isLeapYear",
      value: function isLeapYear(date) {
        if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
        return ES.LeapYear(GetSlot(date, ISO_YEAR));
      }
    }]);

    return ISO8601Calendar;
  }(Calendar);

  MakeIntrinsicClass(ISO8601Calendar, 'Temporal.ISO8601Calendar'); // According to documentation for Intl.Locale.prototype.calendar on MDN,
  // 'iso8601' calendar is equivalent to 'gregory' except for ISO 8601 week
  // numbering rules, which we do not currently use in Temporal.

  var Gregorian = /*#__PURE__*/function (_ISO8601Calendar) {
    _inherits(Gregorian, _ISO8601Calendar);

    var _super2 = _createSuper(Gregorian);

    function Gregorian() {
      _classCallCheck(this, Gregorian);

      return _super2.call(this, 'gregory');
    }

    return Gregorian;
  }(ISO8601Calendar); // Implementation details for Japanese calendar
  //
  // NOTE: For convenience, this hacky class only supports the most recent five
  // eras, those of the modern period. For the full list, see:
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


  var jpn = {
    eraStartDates: ['1868-09-08', '1912-07-30', '1926-12-25', '1989-01-08', '2019-05-01'],
    eraAddends: [1867, 1911, 1925, 1988, 2018],
    // This is what API consumers pass in as the value of the 'era' field. We use
    // string constants consisting of the romanized name
    // Unfortunately these are not unique throughout history, so this should be
    // solved: https://github.com/tc39/proposal-temporal/issues/526
    // Otherwise, we'd have to introduce some era numbering system, which (as far
    // as I can tell from Wikipedia) the calendar doesn't have, so would be
    // non-standard and confusing, requiring API consumers to figure out "now what
    // number is the Reiwa (current) era?" My understanding is also that this
    // starting point for eras (0645-06-19) is not the only possible one, since
    // there are unofficial eras before that.
    // https://en.wikipedia.org/wiki/Japanese_era_name
    eraNames: ['meiji', 'taisho', 'showa', 'heisei', 'reiwa'],
    // Note: C locale era names available at
    // https://github.com/unicode-org/icu/blob/master/icu4c/source/data/locales/root.txt#L1582-L1818
    compareDate: function compareDate(one, two) {
      for (var _i = 0, _arr = [ISO_YEAR, ISO_MONTH, ISO_DAY]; _i < _arr.length; _i++) {
        var slot = _arr[_i];
        var val1 = GetSlot(one, slot);
        var val2 = GetSlot(two, slot);
        if (val1 !== val2) return ES.ComparisonResult(val1 - val2);
      }
    },
    findEra: function findEra(date) {
      var TemporalDate = GetIntrinsic$1('%Temporal.Date%');
      var idx = jpn.eraStartDates.findIndex(function (dateStr) {
        var _ES$ParseTemporalDate = ES.ParseTemporalDateString(dateStr),
            year = _ES$ParseTemporalDate.year,
            month = _ES$ParseTemporalDate.month,
            day = _ES$ParseTemporalDate.day;

        var startDate = new TemporalDate(year, month, day);
        return jpn.compareDate(date, startDate) < 0;
      });
      if (idx === -1) return jpn.eraStartDates.length - 1;
      if (idx === 0) return 0;
      return idx - 1;
    },
    isoYear: function isoYear(year, era) {
      var eraIdx = jpn.eraNames.indexOf(era);
      if (eraIdx === -1) throw new RangeError("invalid era ".concat(era));
      return year + jpn.eraAddends[eraIdx];
    }
  };

  var Japanese = /*#__PURE__*/function (_ISO8601Calendar2) {
    _inherits(Japanese, _ISO8601Calendar2);

    var _super3 = _createSuper(Japanese);

    function Japanese() {
      _classCallCheck(this, Japanese);

      return _super3.call(this, 'japanese');
    }

    _createClass(Japanese, [{
      key: "era",
      value: function era(date) {
        return jpn.eraNames[jpn.findEra(date)];
      }
    }, {
      key: "year",
      value: function year(date) {
        var eraIdx = jpn.findEra(date);
        return GetSlot(date, ISO_YEAR) - jpn.eraAddends[eraIdx];
      }
    }, {
      key: "dateFromFields",
      value: function dateFromFields(fields, options, constructor) {
        // Intentionally alphabetical
        fields = ES.ToRecord(fields, [['day'], ['era'], ['month'], ['year']]);
        var isoYear = jpn.isoYear(fields.year, fields.era);
        return _get(_getPrototypeOf(Japanese.prototype), "dateFromFields", this).call(this, _objectSpread2(_objectSpread2({}, fields), {}, {
          year: isoYear
        }), options, constructor);
      }
    }, {
      key: "yearMonthFromFields",
      value: function yearMonthFromFields(fields, options, constructor) {
        // Intentionally alphabetical
        fields = ES.ToRecord(fields, [['era'], ['month'], ['year']]);
        var isoYear = jpn.isoYear(fields.year, fields.era);
        return _get(_getPrototypeOf(Japanese.prototype), "yearMonthFromFields", this).call(this, _objectSpread2(_objectSpread2({}, fields), {}, {
          year: isoYear
        }), options, constructor);
      }
    }]);

    return Japanese;
  }(ISO8601Calendar);

  var BUILTIN_CALENDARS = {
    gregory: Gregorian,
    iso8601: ISO8601Calendar,
    japanese: Japanese // To be filled in as builtin calendars are implemented

  };

  function GetBuiltinCalendar(id) {
    if (!(id in BUILTIN_CALENDARS)) throw new RangeError("unknown calendar ".concat(id));
    return new BUILTIN_CALENDARS[id]();
  }

  function GetISO8601Calendar() {
    return GetBuiltinCalendar('iso8601');
  }

  var Instant = /*#__PURE__*/function () {
    function Instant(epochNanoseconds) {
      _classCallCheck(this, Instant);

      var ns = ES.ToBigInt(epochNanoseconds);
      ES.RejectInstantRange(ns);
      CreateSlots(this);
      SetSlot(this, EPOCHNANOSECONDS, ns);

      {
        Object.defineProperty(this, '_repr_', {
          value: "".concat(this[Symbol.toStringTag], " <").concat(this, ">"),
          writable: false,
          enumerable: false,
          configurable: false
        });
      }
    }

    _createClass(Instant, [{
      key: "getEpochSeconds",
      value: function getEpochSeconds() {
        if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
        var value = GetSlot(this, EPOCHNANOSECONDS);
        return +value.divide(1e9);
      }
    }, {
      key: "getEpochMilliseconds",
      value: function getEpochMilliseconds() {
        if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
        var value = BigInteger(GetSlot(this, EPOCHNANOSECONDS));
        return +value.divide(1e6);
      }
    }, {
      key: "getEpochMicroseconds",
      value: function getEpochMicroseconds() {
        if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
        var value = GetSlot(this, EPOCHNANOSECONDS);
        return bigIntIfAvailable(value.divide(1e3));
      }
    }, {
      key: "getEpochNanoseconds",
      value: function getEpochNanoseconds() {
        if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
        return bigIntIfAvailable(GetSlot(this, EPOCHNANOSECONDS));
      }
    }, {
      key: "add",
      value: function add(temporalDurationLike) {
        if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');

        var _ES$ToLimitedTemporal = ES.ToLimitedTemporalDuration(temporalDurationLike, ['years', 'months', 'weeks', 'days']),
            hours = _ES$ToLimitedTemporal.hours,
            minutes = _ES$ToLimitedTemporal.minutes,
            seconds = _ES$ToLimitedTemporal.seconds,
            milliseconds = _ES$ToLimitedTemporal.milliseconds,
            microseconds = _ES$ToLimitedTemporal.microseconds,
            nanoseconds = _ES$ToLimitedTemporal.nanoseconds;

        ES.RejectDurationSign(0, 0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
        var sum = BigInteger(0);
        sum = sum.plus(BigInteger(nanoseconds));
        sum = sum.plus(BigInteger(microseconds).multiply(1e3));
        sum = sum.plus(BigInteger(milliseconds).multiply(1e6));
        sum = sum.plus(BigInteger(seconds).multiply(1e9));
        sum = sum.plus(BigInteger(minutes).multiply(60 * 1e9));
        sum = sum.plus(BigInteger(hours).multiply(60 * 60 * 1e9));
        var ns = BigInteger(GetSlot(this, EPOCHNANOSECONDS)).plus(sum);
        ES.RejectInstantRange(ns);
        var Construct = ES.SpeciesConstructor(this, Instant);
        var result = new Construct(bigIntIfAvailable(ns));
        if (!ES.IsTemporalInstant(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "subtract",
      value: function subtract(temporalDurationLike) {
        if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');

        var _ES$ToLimitedTemporal2 = ES.ToLimitedTemporalDuration(temporalDurationLike, ['years', 'months', 'weeks', 'days']),
            hours = _ES$ToLimitedTemporal2.hours,
            minutes = _ES$ToLimitedTemporal2.minutes,
            seconds = _ES$ToLimitedTemporal2.seconds,
            milliseconds = _ES$ToLimitedTemporal2.milliseconds,
            microseconds = _ES$ToLimitedTemporal2.microseconds,
            nanoseconds = _ES$ToLimitedTemporal2.nanoseconds;

        ES.RejectDurationSign(0, 0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
        var sum = BigInteger(0);
        sum = sum.plus(BigInteger(nanoseconds));
        sum = sum.plus(BigInteger(microseconds).multiply(1e3));
        sum = sum.plus(BigInteger(milliseconds).multiply(1e6));
        sum = sum.plus(BigInteger(seconds).multiply(1e9));
        sum = sum.plus(BigInteger(minutes).multiply(60 * 1e9));
        sum = sum.plus(BigInteger(hours).multiply(60 * 60 * 1e9));
        var ns = BigInteger(GetSlot(this, EPOCHNANOSECONDS)).minus(sum);
        ES.RejectInstantRange(ns);
        var Construct = ES.SpeciesConstructor(this, Instant);
        var result = new Construct(bigIntIfAvailable(ns));
        if (!ES.IsTemporalInstant(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "difference",
      value: function difference(other) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
        if (!ES.IsTemporalInstant(other)) throw new TypeError('invalid Instant object');
        var disallowedUnits = ['years', 'months', 'weeks', 'days'];
        options = ES.NormalizeOptionsObject(options);
        var smallestUnit = ES.ToSmallestTemporalDurationUnit(options, 'nanoseconds', disallowedUnits);
        var defaultLargestUnit = ES.LargerOfTwoTemporalDurationUnits('seconds', smallestUnit);
        var largestUnit = ES.ToLargestTemporalUnit(options, defaultLargestUnit, disallowedUnits);
        ES.ValidateTemporalUnitRange(largestUnit, smallestUnit);
        var roundingMode = ES.ToTemporalRoundingMode(options);
        var maximumIncrements = {
          hours: 24,
          minutes: 60,
          seconds: 60,
          milliseconds: 1000,
          microseconds: 1000,
          nanoseconds: 1000
        };
        var roundingIncrement = ES.ToTemporalRoundingIncrement(options, maximumIncrements[smallestUnit], false);
        var onens = GetSlot(other, EPOCHNANOSECONDS);
        var twons = GetSlot(this, EPOCHNANOSECONDS);
        var diff = twons.minus(onens);
        var incrementNs = roundingIncrement;

        switch (smallestUnit) {
          case 'hours':
            incrementNs *= 60;
          // fall through

          case 'minutes':
            incrementNs *= 60;
          // fall through

          case 'seconds':
            incrementNs *= 1000;
          // fall through

          case 'milliseconds':
            incrementNs *= 1000;
          // fall through

          case 'microseconds':
            incrementNs *= 1000;
        }

        var remainder = diff.mod(86400e9);
        var wholeDays = diff.minus(remainder);
        var roundedRemainder = ES.RoundNumberToIncrement(remainder.toJSNumber(), incrementNs, roundingMode);
        var roundedDiff = wholeDays.plus(roundedRemainder);
        var ns = +roundedDiff.mod(1e3);
        var us = +roundedDiff.divide(1e3).mod(1e3);
        var ms = +roundedDiff.divide(1e6).mod(1e3);
        var ss = +roundedDiff.divide(1e9);
        var Duration = GetIntrinsic$1('%Temporal.Duration%');

        var _ES$BalanceDuration = ES.BalanceDuration(0, 0, 0, ss, ms, us, ns, largestUnit),
            hours = _ES$BalanceDuration.hours,
            minutes = _ES$BalanceDuration.minutes,
            seconds = _ES$BalanceDuration.seconds,
            milliseconds = _ES$BalanceDuration.milliseconds,
            microseconds = _ES$BalanceDuration.microseconds,
            nanoseconds = _ES$BalanceDuration.nanoseconds;

        return new Duration(0, 0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
      }
    }, {
      key: "round",
      value: function round(options) {
        if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
        if (options === undefined) throw new TypeError('options parameter is required');
        options = ES.NormalizeOptionsObject(options);
        var smallestUnit = ES.ToSmallestTemporalUnit(options, ['day']);
        var roundingMode = ES.ToTemporalRoundingMode(options);
        var maximumIncrements = {
          hour: 24,
          minute: 1440,
          second: 86400,
          millisecond: 86400e3,
          microsecond: 86400e6,
          nanosecond: 86400e9
        };
        var roundingIncrement = ES.ToTemporalRoundingIncrement(options, maximumIncrements[smallestUnit], true);
        var incrementNs = roundingIncrement;

        switch (smallestUnit) {
          case 'hour':
            incrementNs *= 60;
          // fall through

          case 'minute':
            incrementNs *= 60;
          // fall through

          case 'second':
            incrementNs *= 1000;
          // fall through

          case 'millisecond':
            incrementNs *= 1000;
          // fall through

          case 'microsecond':
            incrementNs *= 1000;
        }

        var ns = GetSlot(this, EPOCHNANOSECONDS); // Note: NonNegativeModulo, but with BigInt

        var remainder = ns.mod(86400e9);
        if (remainder.lesser(0)) remainder = remainder.plus(86400e9);
        var wholeDays = ns.minus(remainder);
        var roundedRemainder = ES.RoundNumberToIncrement(remainder.toJSNumber(), incrementNs, roundingMode);
        var roundedNs = wholeDays.plus(roundedRemainder);
        var Construct = ES.SpeciesConstructor(this, Instant);
        var result = new Construct(bigIntIfAvailable(roundedNs));
        if (!ES.IsTemporalInstant(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "equals",
      value: function equals(other) {
        if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
        if (!ES.IsTemporalInstant(other)) throw new TypeError('invalid Instant object');
        var one = GetSlot(this, EPOCHNANOSECONDS);
        var two = GetSlot(other, EPOCHNANOSECONDS);
        return BigInteger(one).equals(two);
      }
    }, {
      key: "toString",
      value: function toString() {
        var temporalTimeZoneLike = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'UTC';
        if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
        var timeZone = ES.ToTemporalTimeZone(temporalTimeZoneLike);
        return ES.TemporalInstantToString(this, timeZone);
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
        var TemporalTimeZone = GetIntrinsic$1('%Temporal.TimeZone%');
        var timeZone = new TemporalTimeZone('UTC');
        return ES.TemporalInstantToString(this, timeZone);
      }
    }, {
      key: "toLocaleString",
      value: function toLocaleString() {
        if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _construct(Intl.DateTimeFormat, args).format(this);
      }
    }, {
      key: "valueOf",
      value: function valueOf() {
        throw new TypeError('use compare() or equals() to compare Temporal.Instant');
      }
    }, {
      key: "toDateTime",
      value: function toDateTime(temporalTimeZoneLike, calendarLike) {
        if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
        var timeZone = ES.ToTemporalTimeZone(temporalTimeZoneLike);
        var calendar = ES.ToTemporalCalendar(calendarLike);
        return ES.GetTemporalDateTimeFor(timeZone, this, calendar);
      }
    }, {
      key: "toDateTimeISO",
      value: function toDateTimeISO(temporalTimeZoneLike) {
        if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
        var timeZone = ES.ToTemporalTimeZone(temporalTimeZoneLike);
        var calendar = GetISO8601Calendar();
        return ES.GetTemporalDateTimeFor(timeZone, this, calendar);
      }
    }], [{
      key: "fromEpochSeconds",
      value: function fromEpochSeconds(epochSeconds) {
        epochSeconds = ES.ToNumber(epochSeconds);
        var epochNanoseconds = BigInteger(epochSeconds).multiply(1e9);
        ES.RejectInstantRange(epochNanoseconds);
        var result = new this(bigIntIfAvailable(epochNanoseconds));
        if (!ES.IsTemporalInstant(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "fromEpochMilliseconds",
      value: function fromEpochMilliseconds(epochMilliseconds) {
        epochMilliseconds = ES.ToNumber(epochMilliseconds);
        var epochNanoseconds = BigInteger(epochMilliseconds).multiply(1e6);
        ES.RejectInstantRange(epochNanoseconds);
        var result = new this(bigIntIfAvailable(epochNanoseconds));
        if (!ES.IsTemporalInstant(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "fromEpochMicroseconds",
      value: function fromEpochMicroseconds(epochMicroseconds) {
        epochMicroseconds = ES.ToBigInt(epochMicroseconds);
        var epochNanoseconds = epochMicroseconds.multiply(1e3);
        ES.RejectInstantRange(epochNanoseconds);
        var result = new this(bigIntIfAvailable(epochNanoseconds));
        if (!ES.IsTemporalInstant(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "fromEpochNanoseconds",
      value: function fromEpochNanoseconds(epochNanoseconds) {
        epochNanoseconds = ES.ToBigInt(epochNanoseconds);
        ES.RejectInstantRange(epochNanoseconds);
        var result = new this(bigIntIfAvailable(epochNanoseconds));
        if (!ES.IsTemporalInstant(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "from",
      value: function from(item) {
        var ns;

        if (ES.IsTemporalInstant(item)) {
          ns = GetSlot(item, EPOCHNANOSECONDS);
        } else {
          ns = ES.ParseTemporalInstant(ES.ToString(item));
        }

        var result = new this(bigIntIfAvailable(ns));
        if (!ES.IsTemporalInstant(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "compare",
      value: function compare(one, two) {
        if (!ES.IsTemporalInstant(one) || !ES.IsTemporalInstant(two)) throw new TypeError('invalid Instant object');
        one = GetSlot(one, EPOCHNANOSECONDS);
        two = GetSlot(two, EPOCHNANOSECONDS);
        if (BigInteger(one).lesser(two)) return -1;
        if (BigInteger(one).greater(two)) return 1;
        return 0;
      }
    }]);

    return Instant;
  }();
  MakeIntrinsicClass(Instant, 'Temporal.Instant');

  function bigIntIfAvailable(wrapper) {
    return typeof BigInt === 'undefined' ? wrapper : wrapper.value;
  }

  var ObjectAssign$1 = Object.assign;
  var Date$1 = /*#__PURE__*/function () {
    function Date(isoYear, isoMonth, isoDay) {
      var calendar = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : GetISO8601Calendar();

      _classCallCheck(this, Date);

      isoYear = ES.ToInteger(isoYear);
      isoMonth = ES.ToInteger(isoMonth);
      isoDay = ES.ToInteger(isoDay);
      calendar = ES.ToTemporalCalendar(calendar);
      ES.RejectDate(isoYear, isoMonth, isoDay);
      ES.RejectDateRange(isoYear, isoMonth, isoDay);
      CreateSlots(this);
      SetSlot(this, ISO_YEAR, isoYear);
      SetSlot(this, ISO_MONTH, isoMonth);
      SetSlot(this, ISO_DAY, isoDay);
      SetSlot(this, CALENDAR, calendar);
      SetSlot(this, DATE_BRAND, true);

      {
        Object.defineProperty(this, '_repr_', {
          value: "".concat(this[Symbol.toStringTag], " <").concat(this, ">"),
          writable: false,
          enumerable: false,
          configurable: false
        });
      }
    }

    _createClass(Date, [{
      key: "with",
      value: function _with(temporalDateLike) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
        var source;
        var calendar = temporalDateLike.calendar;

        if (calendar) {
          var TemporalCalendar = GetIntrinsic$1('%Temporal.Calendar%');
          calendar = TemporalCalendar.from(calendar);
          source = new Date(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), calendar);
        } else {
          calendar = GetSlot(this, CALENDAR);
          source = this;
        }

        var props = ES.ToPartialRecord(temporalDateLike, ['day', 'era', 'month', 'year']);

        if (!props) {
          throw new RangeError('invalid date-like');
        }

        var fields = ES.ToTemporalDateRecord(source);
        ObjectAssign$1(fields, props);
        var Construct = ES.SpeciesConstructor(this, Date);
        var result = calendar.dateFromFields(fields, options, Construct);
        if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "withCalendar",
      value: function withCalendar(calendar) {
        if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
        var TemporalCalendar = GetIntrinsic$1('%Temporal.Calendar%');
        calendar = TemporalCalendar.from(calendar);
        var Construct = ES.SpeciesConstructor(this, Date);
        var result = new Construct(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), calendar);
        if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "add",
      value: function add(temporalDurationLike) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
        var duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
        var _duration = duration,
            years = _duration.years,
            months = _duration.months,
            weeks = _duration.weeks,
            days = _duration.days,
            hours = _duration.hours,
            minutes = _duration.minutes,
            seconds = _duration.seconds,
            milliseconds = _duration.milliseconds,
            microseconds = _duration.microseconds,
            nanoseconds = _duration.nanoseconds;
        ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);

        var _ES$BalanceDuration = ES.BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 'days');

        days = _ES$BalanceDuration.days;
        duration = {
          years: years,
          months: months,
          weeks: weeks,
          days: days
        };
        var Construct = ES.SpeciesConstructor(this, Date);
        var result = GetSlot(this, CALENDAR).dateAdd(this, duration, options, Construct);
        if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "subtract",
      value: function subtract(temporalDurationLike) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
        var duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
        var _duration2 = duration,
            years = _duration2.years,
            months = _duration2.months,
            weeks = _duration2.weeks,
            days = _duration2.days,
            hours = _duration2.hours,
            minutes = _duration2.minutes,
            seconds = _duration2.seconds,
            milliseconds = _duration2.milliseconds,
            microseconds = _duration2.microseconds,
            nanoseconds = _duration2.nanoseconds;
        ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);

        var _ES$BalanceDuration2 = ES.BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 'days');

        days = _ES$BalanceDuration2.days;
        duration = {
          years: years,
          months: months,
          weeks: weeks,
          days: days
        };
        var Construct = ES.SpeciesConstructor(this, Date);
        var result = GetSlot(this, CALENDAR).dateSubtract(this, duration, options, Construct);
        if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "difference",
      value: function difference(other) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
        if (!ES.IsTemporalDate(other)) throw new TypeError('invalid Date object');
        var calendar = GetSlot(this, CALENDAR);
        var otherCalendar = GetSlot(other, CALENDAR);

        if (calendar.id !== otherCalendar.id) {
          throw new RangeError("cannot compute difference between dates of ".concat(calendar.id, " and ").concat(otherCalendar.id, " calendars"));
        }

        options = ES.NormalizeOptionsObject(options);
        var disallowedUnits = ['hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds'];
        var smallestUnit = ES.ToSmallestTemporalDurationUnit(options, 'days', disallowedUnits);
        var defaultLargestUnit = ES.LargerOfTwoTemporalDurationUnits('days', smallestUnit);
        var largestUnit = ES.ToLargestTemporalUnit(options, defaultLargestUnit, disallowedUnits);
        ES.ValidateTemporalUnitRange(largestUnit, smallestUnit);
        var roundingMode = ES.ToTemporalRoundingMode(options);
        var roundingIncrement = ES.ToTemporalRoundingIncrement(options, undefined, false);
        var result = calendar.dateDifference(other, this, {
          largestUnit: largestUnit
        });
        if (smallestUnit === 'days' && roundingIncrement === 1) return result;
        var years = result.years,
            months = result.months,
            weeks = result.weeks,
            days = result.days;
        var TemporalDateTime = GetIntrinsic$1('%Temporal.DateTime%');
        var relativeTo = new TemporalDateTime(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), 0, 0, 0, 0, 0, 0, GetSlot(this, CALENDAR));

        var _ES$RoundDuration = ES.RoundDuration(years, months, weeks, days, 0, 0, 0, 0, 0, 0, roundingIncrement, smallestUnit, roundingMode, relativeTo);

        years = _ES$RoundDuration.years;
        months = _ES$RoundDuration.months;
        weeks = _ES$RoundDuration.weeks;
        days = _ES$RoundDuration.days;
        var Duration = GetIntrinsic$1('%Temporal.Duration%');
        return new Duration(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
      }
    }, {
      key: "equals",
      value: function equals(other) {
        if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
        if (!ES.IsTemporalDate(other)) throw new TypeError('invalid Date object');

        for (var _i = 0, _arr = [ISO_YEAR, ISO_MONTH, ISO_DAY]; _i < _arr.length; _i++) {
          var slot = _arr[_i];
          var val1 = GetSlot(this, slot);
          var val2 = GetSlot(other, slot);
          if (val1 !== val2) return false;
        }

        return GetSlot(this, CALENDAR).id === GetSlot(other, CALENDAR).id;
      }
    }, {
      key: "toString",
      value: function toString() {
        if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
        var year = ES.ISOYearString(GetSlot(this, ISO_YEAR));
        var month = ES.ISODateTimePartString(GetSlot(this, ISO_MONTH));
        var day = ES.ISODateTimePartString(GetSlot(this, ISO_DAY));
        var calendar = ES.FormatCalendarAnnotation(GetSlot(this, CALENDAR));
        var resultString = "".concat(year, "-").concat(month, "-").concat(day).concat(calendar);
        return resultString;
      }
    }, {
      key: "toLocaleString",
      value: function toLocaleString() {
        if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _construct(Intl.DateTimeFormat, args).format(this);
      }
    }, {
      key: "valueOf",
      value: function valueOf() {
        throw new TypeError('use compare() or equals() to compare Temporal.Date');
      }
    }, {
      key: "toDateTime",
      value: function toDateTime() {
        var temporalTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
        if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
        var year = GetSlot(this, ISO_YEAR);
        var month = GetSlot(this, ISO_MONTH);
        var day = GetSlot(this, ISO_DAY);
        var calendar = GetSlot(this, CALENDAR);
        var DateTime = GetIntrinsic$1('%Temporal.DateTime%');
        if (!temporalTime) return new DateTime(year, month, day, 0, 0, 0, 0, 0, 0, calendar);
        if (!ES.IsTemporalTime(temporalTime)) throw new TypeError('invalid Temporal.Time object');
        var hour = GetSlot(temporalTime, HOUR);
        var minute = GetSlot(temporalTime, MINUTE);
        var second = GetSlot(temporalTime, SECOND);
        var millisecond = GetSlot(temporalTime, MILLISECOND);
        var microsecond = GetSlot(temporalTime, MICROSECOND);
        var nanosecond = GetSlot(temporalTime, NANOSECOND);
        return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
      }
    }, {
      key: "toYearMonth",
      value: function toYearMonth() {
        if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
        var YearMonth = GetIntrinsic$1('%Temporal.YearMonth%');
        var calendar = GetSlot(this, CALENDAR);
        var fields = ES.ToTemporalDateRecord(this);
        return calendar.yearMonthFromFields(fields, {}, YearMonth);
      }
    }, {
      key: "toMonthDay",
      value: function toMonthDay() {
        if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
        var MonthDay = GetIntrinsic$1('%Temporal.MonthDay%');
        var calendar = GetSlot(this, CALENDAR);
        var fields = ES.ToTemporalDateRecord(this);
        return calendar.monthDayFromFields(fields, {}, MonthDay);
      }
    }, {
      key: "getFields",
      value: function getFields() {
        var fields = ES.ToTemporalDateRecord(this);
        if (!fields) throw new TypeError('invalid receiver');
        fields.calendar = GetSlot(this, CALENDAR);
        return fields;
      }
    }, {
      key: "getISOFields",
      value: function getISOFields() {
        if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
        return {
          isoYear: GetSlot(this, ISO_YEAR),
          isoMonth: GetSlot(this, ISO_MONTH),
          isoDay: GetSlot(this, ISO_DAY),
          calendar: GetSlot(this, CALENDAR)
        };
      }
    }, {
      key: "year",
      get: function get() {
        if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).year(this);
      }
    }, {
      key: "month",
      get: function get() {
        if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).month(this);
      }
    }, {
      key: "day",
      get: function get() {
        if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).day(this);
      }
    }, {
      key: "calendar",
      get: function get() {
        if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR);
      }
    }, {
      key: "era",
      get: function get() {
        if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).era(this);
      }
    }, {
      key: "dayOfWeek",
      get: function get() {
        if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).dayOfWeek(this);
      }
    }, {
      key: "dayOfYear",
      get: function get() {
        if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).dayOfYear(this);
      }
    }, {
      key: "weekOfYear",
      get: function get() {
        if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).weekOfYear(this);
      }
    }, {
      key: "daysInWeek",
      get: function get() {
        if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).daysInWeek(this);
      }
    }, {
      key: "daysInYear",
      get: function get() {
        if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).daysInYear(this);
      }
    }, {
      key: "daysInMonth",
      get: function get() {
        if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).daysInMonth(this);
      }
    }, {
      key: "monthsInYear",
      get: function get() {
        if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).monthsInYear(this);
      }
    }, {
      key: "isLeapYear",
      get: function get() {
        if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).isLeapYear(this);
      }
    }], [{
      key: "from",
      value: function from(item) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        options = ES.NormalizeOptionsObject(options);
        var overflow = ES.ToTemporalOverflow(options);
        var TemporalCalendar = GetIntrinsic$1('%Temporal.Calendar%');
        var result;

        if (_typeof(item) === 'object' && item) {
          if (ES.IsTemporalDate(item)) {
            var year = GetSlot(item, ISO_YEAR);
            var month = GetSlot(item, ISO_MONTH);
            var day = GetSlot(item, ISO_DAY);
            var calendar = GetSlot(item, CALENDAR);
            result = new this(year, month, day, calendar);
          } else {
            var _calendar = item.calendar;
            if (_calendar === undefined) _calendar = GetISO8601Calendar();
            _calendar = TemporalCalendar.from(_calendar);
            var fields = ES.ToTemporalDateRecord(item);
            result = _calendar.dateFromFields(fields, options, this);
          }
        } else {
          var _ES$ParseTemporalDate = ES.ParseTemporalDateString(ES.ToString(item)),
              _year = _ES$ParseTemporalDate.year,
              _month = _ES$ParseTemporalDate.month,
              _day = _ES$ParseTemporalDate.day,
              _calendar2 = _ES$ParseTemporalDate.calendar;

          var _ES$RegulateDate = ES.RegulateDate(_year, _month, _day, overflow);

          _year = _ES$RegulateDate.year;
          _month = _ES$RegulateDate.month;
          _day = _ES$RegulateDate.day;
          if (!_calendar2) _calendar2 = GetISO8601Calendar();
          _calendar2 = TemporalCalendar.from(_calendar2);
          result = new this(_year, _month, _day, _calendar2);
        }

        if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "compare",
      value: function compare(one, two) {
        if (!ES.IsTemporalDate(one) || !ES.IsTemporalDate(two)) throw new TypeError('invalid Date object');
        var result = ES.CompareTemporalDate(GetSlot(one, ISO_YEAR), GetSlot(one, ISO_MONTH), GetSlot(one, ISO_DAY), GetSlot(two, ISO_YEAR), GetSlot(two, ISO_MONTH), GetSlot(two, ISO_DAY));
        if (result !== 0) return result;
        var calendarOne = ES.CalendarToString(GetSlot(one, CALENDAR));
        var calendarTwo = ES.CalendarToString(GetSlot(two, CALENDAR));
        if (calendarOne < calendarTwo) return -1;
        if (calendarOne > calendarTwo) return 1;
        return 0;
      }
    }]);

    return Date;
  }();
  Date$1.prototype.toJSON = Date$1.prototype.toString;
  MakeIntrinsicClass(Date$1, 'Temporal.Date');

  var ObjectAssign$2 = Object.assign;
  var DateTime = /*#__PURE__*/function () {
    function DateTime(isoYear, isoMonth, isoDay) {
      var hour = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var minute = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var second = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
      var millisecond = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
      var microsecond = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
      var nanosecond = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 0;
      var calendar = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : GetISO8601Calendar();

      _classCallCheck(this, DateTime);

      isoYear = ES.ToInteger(isoYear);
      isoMonth = ES.ToInteger(isoMonth);
      isoDay = ES.ToInteger(isoDay);
      hour = ES.ToInteger(hour);
      minute = ES.ToInteger(minute);
      second = ES.ToInteger(second);
      millisecond = ES.ToInteger(millisecond);
      microsecond = ES.ToInteger(microsecond);
      nanosecond = ES.ToInteger(nanosecond);
      calendar = ES.ToTemporalCalendar(calendar);
      ES.RejectDateTime(isoYear, isoMonth, isoDay, hour, minute, second, millisecond, microsecond, nanosecond);
      ES.RejectDateTimeRange(isoYear, isoMonth, isoDay, hour, minute, second, millisecond, microsecond, nanosecond);
      CreateSlots(this);
      SetSlot(this, ISO_YEAR, isoYear);
      SetSlot(this, ISO_MONTH, isoMonth);
      SetSlot(this, ISO_DAY, isoDay);
      SetSlot(this, HOUR, hour);
      SetSlot(this, MINUTE, minute);
      SetSlot(this, SECOND, second);
      SetSlot(this, MILLISECOND, millisecond);
      SetSlot(this, MICROSECOND, microsecond);
      SetSlot(this, NANOSECOND, nanosecond);
      SetSlot(this, CALENDAR, calendar);

      {
        Object.defineProperty(this, '_repr_', {
          value: "".concat(this[Symbol.toStringTag], " <").concat(this, ">"),
          writable: false,
          enumerable: false,
          configurable: false
        });
      }
    }

    _createClass(DateTime, [{
      key: "with",
      value: function _with(temporalDateTimeLike) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        options = ES.NormalizeOptionsObject(options);
        var overflow = ES.ToTemporalOverflow(options);
        var source;
        var calendar = temporalDateTimeLike.calendar;

        if (calendar) {
          var TemporalCalendar = GetIntrinsic$1('%Temporal.Calendar%');
          calendar = TemporalCalendar.from(calendar);
          source = new DateTime(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), GetSlot(this, HOUR), GetSlot(this, MINUTE), GetSlot(this, SECOND), GetSlot(this, MILLISECOND), GetSlot(this, MICROSECOND), GetSlot(this, NANOSECOND), calendar);
        } else {
          calendar = GetSlot(this, CALENDAR);
          source = this;
        }

        var props = ES.ToPartialRecord(temporalDateTimeLike, ['day', 'era', 'hour', 'microsecond', 'millisecond', 'minute', 'month', 'nanosecond', 'second', 'year']);

        if (!props) {
          throw new RangeError('invalid date-time-like');
        }

        var fields = ES.ToTemporalDateTimeRecord(source);
        ObjectAssign$2(fields, props);
        var date = calendar.dateFromFields(fields, options, GetIntrinsic$1('%Temporal.Date%'));
        var year = GetSlot(date, ISO_YEAR);
        var month = GetSlot(date, ISO_MONTH);
        var day = GetSlot(date, ISO_DAY);
        var hour = fields.hour,
            minute = fields.minute,
            second = fields.second,
            millisecond = fields.millisecond,
            microsecond = fields.microsecond,
            nanosecond = fields.nanosecond;

        var _ES$RegulateTime = ES.RegulateTime(hour, minute, second, millisecond, microsecond, nanosecond, overflow);

        hour = _ES$RegulateTime.hour;
        minute = _ES$RegulateTime.minute;
        second = _ES$RegulateTime.second;
        millisecond = _ES$RegulateTime.millisecond;
        microsecond = _ES$RegulateTime.microsecond;
        nanosecond = _ES$RegulateTime.nanosecond;
        var Construct = ES.SpeciesConstructor(this, DateTime);
        var result = new Construct(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
        if (!ES.IsTemporalDateTime(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "withCalendar",
      value: function withCalendar(calendar) {
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        var TemporalCalendar = GetIntrinsic$1('%Temporal.Calendar%');
        calendar = TemporalCalendar.from(calendar);
        var Construct = ES.SpeciesConstructor(this, DateTime);
        var result = new Construct(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), GetSlot(this, HOUR), GetSlot(this, MINUTE), GetSlot(this, SECOND), GetSlot(this, MILLISECOND), GetSlot(this, MICROSECOND), GetSlot(this, NANOSECOND), calendar);
        if (!ES.IsTemporalDateTime(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "add",
      value: function add(temporalDurationLike) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        var duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
        var _duration = duration,
            years = _duration.years,
            months = _duration.months,
            weeks = _duration.weeks,
            days = _duration.days,
            hours = _duration.hours,
            minutes = _duration.minutes,
            seconds = _duration.seconds,
            milliseconds = _duration.milliseconds,
            microseconds = _duration.microseconds,
            nanoseconds = _duration.nanoseconds;
        ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds); // For a negative duration, BalanceDuration() subtracts from days to make
        // all other units positive, so it's not needed to switch on the sign below

        var _ES$BalanceDuration = ES.BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 'days');

        days = _ES$BalanceDuration.days;
        hours = _ES$BalanceDuration.hours;
        minutes = _ES$BalanceDuration.minutes;
        seconds = _ES$BalanceDuration.seconds;
        milliseconds = _ES$BalanceDuration.milliseconds;
        microseconds = _ES$BalanceDuration.microseconds;
        nanoseconds = _ES$BalanceDuration.nanoseconds;
        duration = {
          years: years,
          months: months,
          weeks: weeks,
          days: days,
          hours: hours,
          minutes: minutes,
          seconds: seconds,
          milliseconds: milliseconds,
          microseconds: microseconds,
          nanoseconds: nanoseconds
        }; // Add the time part

        var hour = this.hour,
            minute = this.minute,
            second = this.second,
            millisecond = this.millisecond,
            microsecond = this.microsecond,
            nanosecond = this.nanosecond;
        var deltaDays = 0;

        var _ES$AddTime = ES.AddTime(hour, minute, second, millisecond, microsecond, nanosecond, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);

        deltaDays = _ES$AddTime.deltaDays;
        hour = _ES$AddTime.hour;
        minute = _ES$AddTime.minute;
        second = _ES$AddTime.second;
        millisecond = _ES$AddTime.millisecond;
        microsecond = _ES$AddTime.microsecond;
        nanosecond = _ES$AddTime.nanosecond;
        duration.days += deltaDays; // Delegate the date part addition to the calendar

        var calendar = GetSlot(this, CALENDAR);
        var TemporalDate = GetIntrinsic$1('%Temporal.Date%');
        var datePart = new TemporalDate(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), calendar);
        var addedDate = calendar.dateAdd(datePart, duration, options, TemporalDate);
        var year = GetSlot(addedDate, ISO_YEAR);
        var month = GetSlot(addedDate, ISO_MONTH);
        var day = GetSlot(addedDate, ISO_DAY);
        var Construct = ES.SpeciesConstructor(this, DateTime);
        var result = new Construct(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
        if (!ES.IsTemporalDateTime(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "subtract",
      value: function subtract(temporalDurationLike) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        var duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
        var _duration2 = duration,
            years = _duration2.years,
            months = _duration2.months,
            weeks = _duration2.weeks,
            days = _duration2.days,
            hours = _duration2.hours,
            minutes = _duration2.minutes,
            seconds = _duration2.seconds,
            milliseconds = _duration2.milliseconds,
            microseconds = _duration2.microseconds,
            nanoseconds = _duration2.nanoseconds;
        ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds); // For a negative duration, BalanceDuration() subtracts from days to make
        // all other units positive, so it's not needed to switch on the sign below

        var _ES$BalanceDuration2 = ES.BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 'days');

        days = _ES$BalanceDuration2.days;
        hours = _ES$BalanceDuration2.hours;
        minutes = _ES$BalanceDuration2.minutes;
        seconds = _ES$BalanceDuration2.seconds;
        milliseconds = _ES$BalanceDuration2.milliseconds;
        microseconds = _ES$BalanceDuration2.microseconds;
        nanoseconds = _ES$BalanceDuration2.nanoseconds;
        duration = {
          years: years,
          months: months,
          weeks: weeks,
          days: days,
          hours: hours,
          minutes: minutes,
          seconds: seconds,
          milliseconds: milliseconds,
          microseconds: microseconds,
          nanoseconds: nanoseconds
        }; // Subtract the time part

        var hour = this.hour,
            minute = this.minute,
            second = this.second,
            millisecond = this.millisecond,
            microsecond = this.microsecond,
            nanosecond = this.nanosecond;
        var deltaDays = 0;

        var _ES$SubtractTime = ES.SubtractTime(hour, minute, second, millisecond, microsecond, nanosecond, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);

        deltaDays = _ES$SubtractTime.deltaDays;
        hour = _ES$SubtractTime.hour;
        minute = _ES$SubtractTime.minute;
        second = _ES$SubtractTime.second;
        millisecond = _ES$SubtractTime.millisecond;
        microsecond = _ES$SubtractTime.microsecond;
        nanosecond = _ES$SubtractTime.nanosecond;
        duration.days -= deltaDays; // Delegate the date part subtraction to the calendar

        var calendar = GetSlot(this, CALENDAR);
        var TemporalDate = GetIntrinsic$1('%Temporal.Date%');
        var datePart = new TemporalDate(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), calendar);
        var subtractedDate = calendar.dateSubtract(datePart, duration, options, TemporalDate);
        var year = GetSlot(subtractedDate, ISO_YEAR);
        var month = GetSlot(subtractedDate, ISO_MONTH);
        var day = GetSlot(subtractedDate, ISO_DAY);
        var Construct = ES.SpeciesConstructor(this, DateTime);
        var result = new Construct(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
        if (!ES.IsTemporalDateTime(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "difference",
      value: function difference(other) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        if (!ES.IsTemporalDateTime(other)) throw new TypeError('invalid DateTime object');
        var calendar = GetSlot(this, CALENDAR);
        var otherCalendar = GetSlot(other, CALENDAR);

        if (calendar.id !== otherCalendar.id) {
          throw new RangeError("cannot compute difference between dates of ".concat(calendar.id, " and ").concat(otherCalendar.id, " calendars"));
        }

        options = ES.NormalizeOptionsObject(options);
        var smallestUnit = ES.ToSmallestTemporalDurationUnit(options, 'nanoseconds');
        var defaultLargestUnit = ES.LargerOfTwoTemporalDurationUnits('days', smallestUnit);
        var largestUnit = ES.ToLargestTemporalUnit(options, defaultLargestUnit);
        ES.ValidateTemporalUnitRange(largestUnit, smallestUnit);
        var roundingMode = ES.ToTemporalRoundingMode(options);
        var maximumIncrements = {
          years: undefined,
          months: undefined,
          weeks: undefined,
          days: undefined,
          hours: 24,
          minutes: 60,
          seconds: 60,
          milliseconds: 1000,
          microseconds: 1000,
          nanoseconds: 1000
        };
        var roundingIncrement = ES.ToTemporalRoundingIncrement(options, maximumIncrements[smallestUnit], false);

        var _ES$DifferenceTime = ES.DifferenceTime(GetSlot(other, HOUR), GetSlot(other, MINUTE), GetSlot(other, SECOND), GetSlot(other, MILLISECOND), GetSlot(other, MICROSECOND), GetSlot(other, NANOSECOND), GetSlot(this, HOUR), GetSlot(this, MINUTE), GetSlot(this, SECOND), GetSlot(this, MILLISECOND), GetSlot(this, MICROSECOND), GetSlot(this, NANOSECOND)),
            deltaDays = _ES$DifferenceTime.deltaDays,
            hours = _ES$DifferenceTime.hours,
            minutes = _ES$DifferenceTime.minutes,
            seconds = _ES$DifferenceTime.seconds,
            milliseconds = _ES$DifferenceTime.milliseconds,
            microseconds = _ES$DifferenceTime.microseconds,
            nanoseconds = _ES$DifferenceTime.nanoseconds;

        var year = GetSlot(this, ISO_YEAR);
        var month = GetSlot(this, ISO_MONTH);
        var day = GetSlot(this, ISO_DAY) + deltaDays;

        var _ES$BalanceDate = ES.BalanceDate(year, month, day);

        year = _ES$BalanceDate.year;
        month = _ES$BalanceDate.month;
        day = _ES$BalanceDate.day;
        var TemporalDate = GetIntrinsic$1('%Temporal.Date%');
        var adjustedDate = new TemporalDate(year, month, day, calendar);
        var otherDate = new TemporalDate(GetSlot(other, ISO_YEAR), GetSlot(other, ISO_MONTH), GetSlot(other, ISO_DAY), calendar);
        var dateLargestUnit = ES.LargerOfTwoTemporalDurationUnits('days', largestUnit);
        var dateOptions = ObjectAssign$2({}, options, {
          largestUnit: dateLargestUnit
        });
        var dateDifference = calendar.dateDifference(otherDate, adjustedDate, dateOptions);
        var years = dateDifference.years,
            months = dateDifference.months,
            weeks = dateDifference.weeks,
            days = dateDifference.days;

        var _ES$RoundDuration = ES.RoundDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, roundingIncrement, smallestUnit, roundingMode, this);

        years = _ES$RoundDuration.years;
        months = _ES$RoundDuration.months;
        weeks = _ES$RoundDuration.weeks;
        days = _ES$RoundDuration.days;
        hours = _ES$RoundDuration.hours;
        minutes = _ES$RoundDuration.minutes;
        seconds = _ES$RoundDuration.seconds;
        milliseconds = _ES$RoundDuration.milliseconds;
        microseconds = _ES$RoundDuration.microseconds;
        nanoseconds = _ES$RoundDuration.nanoseconds;

        var _ES$BalanceDuration3 = ES.BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, largestUnit);

        days = _ES$BalanceDuration3.days;
        hours = _ES$BalanceDuration3.hours;
        minutes = _ES$BalanceDuration3.minutes;
        seconds = _ES$BalanceDuration3.seconds;
        milliseconds = _ES$BalanceDuration3.milliseconds;
        microseconds = _ES$BalanceDuration3.microseconds;
        nanoseconds = _ES$BalanceDuration3.nanoseconds;
        var Duration = GetIntrinsic$1('%Temporal.Duration%');
        return new Duration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
      }
    }, {
      key: "round",
      value: function round(options) {
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        if (options === undefined) throw new TypeError('options parameter is required');
        options = ES.NormalizeOptionsObject(options);
        var smallestUnit = ES.ToSmallestTemporalUnit(options);
        var roundingMode = ES.ToTemporalRoundingMode(options);
        var maximumIncrements = {
          day: 1,
          hour: 24,
          minute: 60,
          second: 60,
          millisecond: 1000,
          microsecond: 1000,
          nanosecond: 1000
        };
        var roundingIncrement = ES.ToTemporalRoundingIncrement(options, maximumIncrements[smallestUnit], false);
        var year = GetSlot(this, ISO_YEAR);
        var month = GetSlot(this, ISO_MONTH);
        var day = GetSlot(this, ISO_DAY);
        var hour = GetSlot(this, HOUR);
        var minute = GetSlot(this, MINUTE);
        var second = GetSlot(this, SECOND);
        var millisecond = GetSlot(this, MILLISECOND);
        var microsecond = GetSlot(this, MICROSECOND);
        var nanosecond = GetSlot(this, NANOSECOND);
        var deltaDays = 0;

        var _ES$RoundTime = ES.RoundTime(hour, minute, second, millisecond, microsecond, nanosecond, roundingIncrement, smallestUnit, roundingMode);

        deltaDays = _ES$RoundTime.deltaDays;
        hour = _ES$RoundTime.hour;
        minute = _ES$RoundTime.minute;
        second = _ES$RoundTime.second;
        millisecond = _ES$RoundTime.millisecond;
        microsecond = _ES$RoundTime.microsecond;
        nanosecond = _ES$RoundTime.nanosecond;

        var _ES$BalanceDate2 = ES.BalanceDate(year, month, day + deltaDays);

        year = _ES$BalanceDate2.year;
        month = _ES$BalanceDate2.month;
        day = _ES$BalanceDate2.day;
        var Construct = ES.SpeciesConstructor(this, DateTime);
        var result = new Construct(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, GetSlot(this, CALENDAR));
        if (!ES.IsTemporalDateTime(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "equals",
      value: function equals(other) {
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        if (!ES.IsTemporalDateTime(other)) throw new TypeError('invalid Date object');

        for (var _i = 0, _arr = [ISO_YEAR, ISO_MONTH, ISO_DAY, HOUR, MINUTE, SECOND, MILLISECOND, MICROSECOND, NANOSECOND]; _i < _arr.length; _i++) {
          var slot = _arr[_i];
          var val1 = GetSlot(this, slot);
          var val2 = GetSlot(other, slot);
          if (val1 !== val2) return false;
        }

        return GetSlot(this, CALENDAR).id === GetSlot(other, CALENDAR).id;
      }
    }, {
      key: "toString",
      value: function toString() {
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        var year = ES.ISOYearString(GetSlot(this, ISO_YEAR));
        var month = ES.ISODateTimePartString(GetSlot(this, ISO_MONTH));
        var day = ES.ISODateTimePartString(GetSlot(this, ISO_DAY));
        var hour = ES.ISODateTimePartString(GetSlot(this, HOUR));
        var minute = ES.ISODateTimePartString(GetSlot(this, MINUTE));
        var seconds = ES.FormatSecondsStringPart(GetSlot(this, SECOND), GetSlot(this, MILLISECOND), GetSlot(this, MICROSECOND), GetSlot(this, NANOSECOND));
        var calendar = ES.FormatCalendarAnnotation(GetSlot(this, CALENDAR));
        var resultString = "".concat(year, "-").concat(month, "-").concat(day, "T").concat(hour, ":").concat(minute).concat(seconds).concat(calendar);
        return resultString;
      }
    }, {
      key: "toLocaleString",
      value: function toLocaleString() {
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _construct(Intl.DateTimeFormat, args).format(this);
      }
    }, {
      key: "valueOf",
      value: function valueOf() {
        throw new TypeError('use compare() or equals() to compare Temporal.DateTime');
      }
    }, {
      key: "toInstant",
      value: function toInstant(temporalTimeZoneLike) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        var timeZone = ES.ToTemporalTimeZone(temporalTimeZoneLike);
        options = ES.NormalizeOptionsObject(options);
        var disambiguation = ES.ToTemporalDisambiguation(options);
        return ES.GetTemporalInstantFor(timeZone, this, disambiguation);
      }
    }, {
      key: "toDate",
      value: function toDate() {
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        return ES.TemporalDateTimeToDate(this);
      }
    }, {
      key: "toYearMonth",
      value: function toYearMonth() {
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        var YearMonth = GetIntrinsic$1('%Temporal.YearMonth%');
        var calendar = GetSlot(this, CALENDAR);
        var fields = ES.ToTemporalDateTimeRecord(this);
        return calendar.yearMonthFromFields(fields, {}, YearMonth);
      }
    }, {
      key: "toMonthDay",
      value: function toMonthDay() {
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        var MonthDay = GetIntrinsic$1('%Temporal.MonthDay%');
        var calendar = GetSlot(this, CALENDAR);
        var fields = ES.ToTemporalDateTimeRecord(this);
        return calendar.monthDayFromFields(fields, {}, MonthDay);
      }
    }, {
      key: "toTime",
      value: function toTime() {
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        return ES.TemporalDateTimeToTime(this);
      }
    }, {
      key: "getFields",
      value: function getFields() {
        var fields = ES.ToTemporalDateTimeRecord(this);
        if (!fields) throw new TypeError('invalid receiver');
        fields.calendar = GetSlot(this, CALENDAR);
        return fields;
      }
    }, {
      key: "getISOFields",
      value: function getISOFields() {
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        return {
          isoYear: GetSlot(this, ISO_YEAR),
          isoMonth: GetSlot(this, ISO_MONTH),
          isoDay: GetSlot(this, ISO_DAY),
          hour: GetSlot(this, HOUR),
          minute: GetSlot(this, MINUTE),
          second: GetSlot(this, SECOND),
          millisecond: GetSlot(this, MILLISECOND),
          microsecond: GetSlot(this, MICROSECOND),
          nanosecond: GetSlot(this, NANOSECOND),
          calendar: GetSlot(this, CALENDAR)
        };
      }
    }, {
      key: "year",
      get: function get() {
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).year(this);
      }
    }, {
      key: "month",
      get: function get() {
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).month(this);
      }
    }, {
      key: "day",
      get: function get() {
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).day(this);
      }
    }, {
      key: "hour",
      get: function get() {
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, HOUR);
      }
    }, {
      key: "minute",
      get: function get() {
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, MINUTE);
      }
    }, {
      key: "second",
      get: function get() {
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, SECOND);
      }
    }, {
      key: "millisecond",
      get: function get() {
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, MILLISECOND);
      }
    }, {
      key: "microsecond",
      get: function get() {
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, MICROSECOND);
      }
    }, {
      key: "nanosecond",
      get: function get() {
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, NANOSECOND);
      }
    }, {
      key: "calendar",
      get: function get() {
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR);
      }
    }, {
      key: "era",
      get: function get() {
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).era(this);
      }
    }, {
      key: "dayOfWeek",
      get: function get() {
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).dayOfWeek(this);
      }
    }, {
      key: "dayOfYear",
      get: function get() {
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).dayOfYear(this);
      }
    }, {
      key: "weekOfYear",
      get: function get() {
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).weekOfYear(this);
      }
    }, {
      key: "daysInWeek",
      get: function get() {
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).daysInWeek(this);
      }
    }, {
      key: "daysInYear",
      get: function get() {
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).daysInYear(this);
      }
    }, {
      key: "daysInMonth",
      get: function get() {
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).daysInMonth(this);
      }
    }, {
      key: "monthsInYear",
      get: function get() {
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).monthsInYear(this);
      }
    }, {
      key: "isLeapYear",
      get: function get() {
        if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).isLeapYear(this);
      }
    }], [{
      key: "from",
      value: function from(item) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        options = ES.NormalizeOptionsObject(options);
        var overflow = ES.ToTemporalOverflow(options);
        var TemporalCalendar = GetIntrinsic$1('%Temporal.Calendar%');
        var result;

        if (_typeof(item) === 'object' && item) {
          if (ES.IsTemporalDateTime(item)) {
            var year = GetSlot(item, ISO_YEAR);
            var month = GetSlot(item, ISO_MONTH);
            var day = GetSlot(item, ISO_DAY);
            var hour = GetSlot(item, HOUR);
            var minute = GetSlot(item, MINUTE);
            var second = GetSlot(item, SECOND);
            var millisecond = GetSlot(item, MILLISECOND);
            var microsecond = GetSlot(item, MICROSECOND);
            var nanosecond = GetSlot(item, NANOSECOND);
            var calendar = GetSlot(item, CALENDAR);
            result = new this(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
          } else {
            var _calendar = item.calendar;
            if (_calendar === undefined) _calendar = GetISO8601Calendar();
            _calendar = TemporalCalendar.from(_calendar);
            var fields = ES.ToTemporalDateTimeRecord(item);
            var TemporalDate = GetIntrinsic$1('%Temporal.Date%');

            var date = _calendar.dateFromFields(fields, options, TemporalDate);

            var _year = GetSlot(date, ISO_YEAR);

            var _month = GetSlot(date, ISO_MONTH);

            var _day = GetSlot(date, ISO_DAY);

            var _hour = fields.hour,
                _minute = fields.minute,
                _second = fields.second,
                _millisecond = fields.millisecond,
                _microsecond = fields.microsecond,
                _nanosecond = fields.nanosecond;

            var _ES$RegulateTime2 = ES.RegulateTime(_hour, _minute, _second, _millisecond, _microsecond, _nanosecond, overflow);

            _hour = _ES$RegulateTime2.hour;
            _minute = _ES$RegulateTime2.minute;
            _second = _ES$RegulateTime2.second;
            _millisecond = _ES$RegulateTime2.millisecond;
            _microsecond = _ES$RegulateTime2.microsecond;
            _nanosecond = _ES$RegulateTime2.nanosecond;
            result = new this(_year, _month, _day, _hour, _minute, _second, _millisecond, _microsecond, _nanosecond, _calendar);
          }
        } else {
          var _ES$ParseTemporalDate = ES.ParseTemporalDateTimeString(ES.ToString(item)),
              _year2 = _ES$ParseTemporalDate.year,
              _month2 = _ES$ParseTemporalDate.month,
              _day2 = _ES$ParseTemporalDate.day,
              _hour2 = _ES$ParseTemporalDate.hour,
              _minute2 = _ES$ParseTemporalDate.minute,
              _second2 = _ES$ParseTemporalDate.second,
              _millisecond2 = _ES$ParseTemporalDate.millisecond,
              _microsecond2 = _ES$ParseTemporalDate.microsecond,
              _nanosecond2 = _ES$ParseTemporalDate.nanosecond,
              _calendar2 = _ES$ParseTemporalDate.calendar;

          if (!_calendar2) _calendar2 = GetISO8601Calendar();
          _calendar2 = TemporalCalendar.from(_calendar2);
          result = new this(_year2, _month2, _day2, _hour2, _minute2, _second2, _millisecond2, _microsecond2, _nanosecond2, _calendar2);
        }

        if (!ES.IsTemporalDateTime(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "compare",
      value: function compare(one, two) {
        if (!ES.IsTemporalDateTime(one) || !ES.IsTemporalDateTime(two)) throw new TypeError('invalid DateTime object');

        for (var _i2 = 0, _arr2 = [ISO_YEAR, ISO_MONTH, ISO_DAY, HOUR, MINUTE, SECOND, MILLISECOND, MICROSECOND, NANOSECOND]; _i2 < _arr2.length; _i2++) {
          var slot = _arr2[_i2];
          var val1 = GetSlot(one, slot);
          var val2 = GetSlot(two, slot);
          if (val1 !== val2) return ES.ComparisonResult(val1 - val2);
        }

        var cal1 = GetSlot(one, CALENDAR).id;
        var cal2 = GetSlot(two, CALENDAR).id;
        return ES.ComparisonResult(cal1 < cal2 ? -1 : cal1 > cal2 ? 1 : 0);
      }
    }]);

    return DateTime;
  }();
  DateTime.prototype.toJSON = DateTime.prototype.toString;
  MakeIntrinsicClass(DateTime, 'Temporal.DateTime');

  var Duration = /*#__PURE__*/function () {
    function Duration() {
      var years = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var months = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var weeks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var days = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var hours = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var minutes = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
      var seconds = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
      var milliseconds = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
      var microseconds = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 0;
      var nanoseconds = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : 0;

      _classCallCheck(this, Duration);

      years = ES.ToInteger(years);
      months = ES.ToInteger(months);
      weeks = ES.ToInteger(weeks);
      days = ES.ToInteger(days);
      hours = ES.ToInteger(hours);
      minutes = ES.ToInteger(minutes);
      seconds = ES.ToInteger(seconds);
      milliseconds = ES.ToInteger(milliseconds);
      microseconds = ES.ToInteger(microseconds);
      nanoseconds = ES.ToInteger(nanoseconds);
      var sign = ES.DurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);

      for (var _i = 0, _arr = [years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds]; _i < _arr.length; _i++) {
        var prop = _arr[_i];
        if (!Number.isFinite(prop)) throw new RangeError('infinite values not allowed as duration fields');
        var propSign = Math.sign(prop);
        if (propSign !== 0 && propSign !== sign) throw new RangeError('mixed-sign values not allowed as duration fields');
      }

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
        Object.defineProperty(this, '_repr_', {
          value: "".concat(this[Symbol.toStringTag], " <").concat(this, ">"),
          writable: false,
          enumerable: false,
          configurable: false
        });
      }
    }

    _createClass(Duration, [{
      key: "with",
      value: function _with(durationLike) {
        if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
        var props = ES.ToPartialRecord(durationLike, ['days', 'hours', 'microseconds', 'milliseconds', 'minutes', 'months', 'nanoseconds', 'seconds', 'weeks', 'years']);

        if (!props) {
          throw new RangeError('invalid duration-like');
        }

        var _props$years = props.years,
            years = _props$years === void 0 ? GetSlot(this, YEARS) : _props$years,
            _props$months = props.months,
            months = _props$months === void 0 ? GetSlot(this, MONTHS) : _props$months,
            _props$weeks = props.weeks,
            weeks = _props$weeks === void 0 ? GetSlot(this, WEEKS) : _props$weeks,
            _props$days = props.days,
            days = _props$days === void 0 ? GetSlot(this, DAYS) : _props$days,
            _props$hours = props.hours,
            hours = _props$hours === void 0 ? GetSlot(this, HOURS) : _props$hours,
            _props$minutes = props.minutes,
            minutes = _props$minutes === void 0 ? GetSlot(this, MINUTES) : _props$minutes,
            _props$seconds = props.seconds,
            seconds = _props$seconds === void 0 ? GetSlot(this, SECONDS) : _props$seconds,
            _props$milliseconds = props.milliseconds,
            milliseconds = _props$milliseconds === void 0 ? GetSlot(this, MILLISECONDS) : _props$milliseconds,
            _props$microseconds = props.microseconds,
            microseconds = _props$microseconds === void 0 ? GetSlot(this, MICROSECONDS) : _props$microseconds,
            _props$nanoseconds = props.nanoseconds,
            nanoseconds = _props$nanoseconds === void 0 ? GetSlot(this, NANOSECONDS) : _props$nanoseconds;
        var Construct = ES.SpeciesConstructor(this, Duration);
        var result = new Construct(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
        if (!ES.IsTemporalDuration(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "negated",
      value: function negated() {
        if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
        var Construct = ES.SpeciesConstructor(this, Duration);
        var result = new Construct(-GetSlot(this, YEARS), -GetSlot(this, MONTHS), -GetSlot(this, WEEKS), -GetSlot(this, DAYS), -GetSlot(this, HOURS), -GetSlot(this, MINUTES), -GetSlot(this, SECONDS), -GetSlot(this, MILLISECONDS), -GetSlot(this, MICROSECONDS), -GetSlot(this, NANOSECONDS));
        if (!ES.IsTemporalDuration(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "abs",
      value: function abs() {
        if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
        var Construct = ES.SpeciesConstructor(this, Duration);
        var result = new Construct(Math.abs(GetSlot(this, YEARS)), Math.abs(GetSlot(this, MONTHS)), Math.abs(GetSlot(this, WEEKS)), Math.abs(GetSlot(this, DAYS)), Math.abs(GetSlot(this, HOURS)), Math.abs(GetSlot(this, MINUTES)), Math.abs(GetSlot(this, SECONDS)), Math.abs(GetSlot(this, MILLISECONDS)), Math.abs(GetSlot(this, MICROSECONDS)), Math.abs(GetSlot(this, NANOSECONDS)));
        if (!ES.IsTemporalDuration(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "isZero",
      value: function isZero() {
        if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
        return ES.DurationSign(GetSlot(this, YEARS), GetSlot(this, MONTHS), GetSlot(this, WEEKS), GetSlot(this, DAYS), GetSlot(this, HOURS), GetSlot(this, MINUTES), GetSlot(this, SECONDS), GetSlot(this, MILLISECONDS), GetSlot(this, MICROSECONDS), GetSlot(this, NANOSECONDS)) === 0;
      }
    }, {
      key: "add",
      value: function add(other) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');

        var _ES$ToLimitedTemporal = ES.ToLimitedTemporalDuration(other),
            years = _ES$ToLimitedTemporal.years,
            months = _ES$ToLimitedTemporal.months,
            weeks = _ES$ToLimitedTemporal.weeks,
            days = _ES$ToLimitedTemporal.days,
            hours = _ES$ToLimitedTemporal.hours,
            minutes = _ES$ToLimitedTemporal.minutes,
            seconds = _ES$ToLimitedTemporal.seconds,
            milliseconds = _ES$ToLimitedTemporal.milliseconds,
            microseconds = _ES$ToLimitedTemporal.microseconds,
            nanoseconds = _ES$ToLimitedTemporal.nanoseconds;

        ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
        options = ES.NormalizeOptionsObject(options);
        var overflow = ES.ToTemporalDurationOverflow(options);

        var _ES$DurationArithmeti = ES.DurationArithmetic(GetSlot(this, YEARS), GetSlot(this, MONTHS), GetSlot(this, WEEKS), GetSlot(this, DAYS), GetSlot(this, HOURS), GetSlot(this, MINUTES), GetSlot(this, SECONDS), GetSlot(this, MILLISECONDS), GetSlot(this, MICROSECONDS), GetSlot(this, NANOSECONDS), years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, overflow);

        years = _ES$DurationArithmeti.years;
        months = _ES$DurationArithmeti.months;
        weeks = _ES$DurationArithmeti.weeks;
        days = _ES$DurationArithmeti.days;
        hours = _ES$DurationArithmeti.hours;
        minutes = _ES$DurationArithmeti.minutes;
        seconds = _ES$DurationArithmeti.seconds;
        milliseconds = _ES$DurationArithmeti.milliseconds;
        microseconds = _ES$DurationArithmeti.microseconds;
        nanoseconds = _ES$DurationArithmeti.nanoseconds;
        var Construct = ES.SpeciesConstructor(this, Duration);
        var result = new Construct(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
        if (!ES.IsTemporalDuration(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "subtract",
      value: function subtract(other) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');

        var _ES$ToLimitedTemporal2 = ES.ToLimitedTemporalDuration(other),
            years = _ES$ToLimitedTemporal2.years,
            months = _ES$ToLimitedTemporal2.months,
            weeks = _ES$ToLimitedTemporal2.weeks,
            days = _ES$ToLimitedTemporal2.days,
            hours = _ES$ToLimitedTemporal2.hours,
            minutes = _ES$ToLimitedTemporal2.minutes,
            seconds = _ES$ToLimitedTemporal2.seconds,
            milliseconds = _ES$ToLimitedTemporal2.milliseconds,
            microseconds = _ES$ToLimitedTemporal2.microseconds,
            nanoseconds = _ES$ToLimitedTemporal2.nanoseconds;

        ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
        options = ES.NormalizeOptionsObject(options);
        var overflow = ES.ToTemporalDurationOverflow(options);

        var _ES$DurationArithmeti2 = ES.DurationArithmetic(GetSlot(this, YEARS), GetSlot(this, MONTHS), GetSlot(this, WEEKS), GetSlot(this, DAYS), GetSlot(this, HOURS), GetSlot(this, MINUTES), GetSlot(this, SECONDS), GetSlot(this, MILLISECONDS), GetSlot(this, MICROSECONDS), GetSlot(this, NANOSECONDS), -years, -months, -weeks, -days, -hours, -minutes, -seconds, -milliseconds, -microseconds, -nanoseconds, overflow);

        years = _ES$DurationArithmeti2.years;
        months = _ES$DurationArithmeti2.months;
        weeks = _ES$DurationArithmeti2.weeks;
        days = _ES$DurationArithmeti2.days;
        hours = _ES$DurationArithmeti2.hours;
        minutes = _ES$DurationArithmeti2.minutes;
        seconds = _ES$DurationArithmeti2.seconds;
        milliseconds = _ES$DurationArithmeti2.milliseconds;
        microseconds = _ES$DurationArithmeti2.microseconds;
        nanoseconds = _ES$DurationArithmeti2.nanoseconds;
        var Construct = ES.SpeciesConstructor(this, Duration);
        var result = new Construct(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
        if (!ES.IsTemporalDuration(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "round",
      value: function round(options) {
        if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
        var years = GetSlot(this, YEARS);
        var months = GetSlot(this, MONTHS);
        var weeks = GetSlot(this, WEEKS);
        var days = GetSlot(this, DAYS);
        var hours = GetSlot(this, HOURS);
        var minutes = GetSlot(this, MINUTES);
        var seconds = GetSlot(this, SECONDS);
        var milliseconds = GetSlot(this, MILLISECONDS);
        var microseconds = GetSlot(this, MICROSECONDS);
        var nanoseconds = GetSlot(this, NANOSECONDS);
        var defaultLargestUnit = 'nanoseconds';

        for (var _i2 = 0, _Object$entries = Object.entries({
          years: years,
          months: months,
          weeks: weeks,
          days: days,
          hours: hours,
          minutes: minutes,
          seconds: seconds,
          milliseconds: milliseconds,
          microseconds: microseconds
        }); _i2 < _Object$entries.length; _i2++) {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
              prop = _Object$entries$_i[0],
              v = _Object$entries$_i[1];

          if (v !== 0) {
            defaultLargestUnit = prop;
            break;
          }
        }

        options = ES.NormalizeOptionsObject(options);
        var smallestUnit = ES.ToSmallestTemporalDurationUnit(options, 'nanoseconds');
        defaultLargestUnit = ES.LargerOfTwoTemporalDurationUnits(defaultLargestUnit, smallestUnit);
        var relativeTo = ES.ToRelativeTemporalObject(options);
        var largestUnit = ES.ToLargestTemporalUnit(options, defaultLargestUnit);
        ES.ValidateTemporalUnitRange(largestUnit, smallestUnit);
        var roundingMode = ES.ToTemporalRoundingMode(options);
        var maximumIncrements = {
          years: undefined,
          months: undefined,
          weeks: undefined,
          days: undefined,
          hours: 24,
          minutes: 60,
          seconds: 60,
          milliseconds: 1000,
          microseconds: 1000,
          nanoseconds: 1000
        };
        var roundingIncrement = ES.ToTemporalRoundingIncrement(options, maximumIncrements[smallestUnit], false);

        var _ES$UnbalanceDuration = ES.UnbalanceDurationRelative(years, months, weeks, days, largestUnit, relativeTo);

        years = _ES$UnbalanceDuration.years;
        months = _ES$UnbalanceDuration.months;
        weeks = _ES$UnbalanceDuration.weeks;
        days = _ES$UnbalanceDuration.days;

        var _ES$RoundDuration = ES.RoundDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, roundingIncrement, smallestUnit, roundingMode, relativeTo);

        years = _ES$RoundDuration.years;
        months = _ES$RoundDuration.months;
        weeks = _ES$RoundDuration.weeks;
        days = _ES$RoundDuration.days;
        hours = _ES$RoundDuration.hours;
        minutes = _ES$RoundDuration.minutes;
        seconds = _ES$RoundDuration.seconds;
        milliseconds = _ES$RoundDuration.milliseconds;
        microseconds = _ES$RoundDuration.microseconds;
        nanoseconds = _ES$RoundDuration.nanoseconds;

        var _ES$BalanceDurationRe = ES.BalanceDurationRelative(years, months, weeks, days, largestUnit, relativeTo);

        years = _ES$BalanceDurationRe.years;
        months = _ES$BalanceDurationRe.months;
        weeks = _ES$BalanceDurationRe.weeks;
        days = _ES$BalanceDurationRe.days;

        var _ES$BalanceDuration = ES.BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, largestUnit);

        days = _ES$BalanceDuration.days;
        hours = _ES$BalanceDuration.hours;
        minutes = _ES$BalanceDuration.minutes;
        seconds = _ES$BalanceDuration.seconds;
        milliseconds = _ES$BalanceDuration.milliseconds;
        microseconds = _ES$BalanceDuration.microseconds;
        nanoseconds = _ES$BalanceDuration.nanoseconds;
        var Construct = ES.SpeciesConstructor(this, Duration);
        var result = new Construct(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
        if (!ES.IsTemporalDuration(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "getFields",
      value: function getFields() {
        var fields = ES.ToRecord(this, [['days'], ['hours'], ['microseconds'], ['milliseconds'], ['minutes'], ['months'], ['nanoseconds'], ['seconds'], ['weeks'], ['years']]);
        if (!fields) throw new TypeError('invalid receiver');
        return fields;
      }
    }, {
      key: "toString",
      value: function toString() {
        if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
        return ES.TemporalDurationToString(this);
      }
    }, {
      key: "toLocaleString",
      value: function toLocaleString() {
        if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');

        if (typeof Intl !== 'undefined' && typeof Intl.DurationFormat !== 'undefined') {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return _construct(Intl.DurationFormat, args).format(this);
        }

        console.warn('Temporal.Duration.prototype.toLocaleString() requires Intl.DurationFormat.');
        return ES.TemporalDurationToString(this);
      }
    }, {
      key: "valueOf",
      value: function valueOf() {
        throw new TypeError('not possible to compare Temporal.Duration');
      }
    }, {
      key: "years",
      get: function get() {
        if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, YEARS);
      }
    }, {
      key: "months",
      get: function get() {
        if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, MONTHS);
      }
    }, {
      key: "weeks",
      get: function get() {
        if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, WEEKS);
      }
    }, {
      key: "days",
      get: function get() {
        if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, DAYS);
      }
    }, {
      key: "hours",
      get: function get() {
        if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, HOURS);
      }
    }, {
      key: "minutes",
      get: function get() {
        if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, MINUTES);
      }
    }, {
      key: "seconds",
      get: function get() {
        if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, SECONDS);
      }
    }, {
      key: "milliseconds",
      get: function get() {
        if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, MILLISECONDS);
      }
    }, {
      key: "microseconds",
      get: function get() {
        if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, MICROSECONDS);
      }
    }, {
      key: "nanoseconds",
      get: function get() {
        if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, NANOSECONDS);
      }
    }, {
      key: "sign",
      get: function get() {
        if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
        return ES.DurationSign(GetSlot(this, YEARS), GetSlot(this, MONTHS), GetSlot(this, WEEKS), GetSlot(this, DAYS), GetSlot(this, HOURS), GetSlot(this, MINUTES), GetSlot(this, SECONDS), GetSlot(this, MILLISECONDS), GetSlot(this, MICROSECONDS), GetSlot(this, NANOSECONDS));
      }
    }], [{
      key: "from",
      value: function from(item) {
        var years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds;

        if (_typeof(item) === 'object' && item) {
          var _ES$ToTemporalDuratio = ES.ToTemporalDurationRecord(item);

          years = _ES$ToTemporalDuratio.years;
          months = _ES$ToTemporalDuratio.months;
          weeks = _ES$ToTemporalDuratio.weeks;
          days = _ES$ToTemporalDuratio.days;
          hours = _ES$ToTemporalDuratio.hours;
          minutes = _ES$ToTemporalDuratio.minutes;
          seconds = _ES$ToTemporalDuratio.seconds;
          milliseconds = _ES$ToTemporalDuratio.milliseconds;
          microseconds = _ES$ToTemporalDuratio.microseconds;
          nanoseconds = _ES$ToTemporalDuratio.nanoseconds;
        } else {
          var _ES$ParseTemporalDura = ES.ParseTemporalDurationString(ES.ToString(item));

          years = _ES$ParseTemporalDura.years;
          months = _ES$ParseTemporalDura.months;
          weeks = _ES$ParseTemporalDura.weeks;
          days = _ES$ParseTemporalDura.days;
          hours = _ES$ParseTemporalDura.hours;
          minutes = _ES$ParseTemporalDura.minutes;
          seconds = _ES$ParseTemporalDura.seconds;
          milliseconds = _ES$ParseTemporalDura.milliseconds;
          microseconds = _ES$ParseTemporalDura.microseconds;
          nanoseconds = _ES$ParseTemporalDura.nanoseconds;
        }

        var result = new this(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
        if (!ES.IsTemporalDuration(result)) throw new TypeError('invalid result');
        return result;
      }
    }]);

    return Duration;
  }();
  Duration.prototype.toJSON = Duration.prototype.toString;
  MakeIntrinsicClass(Duration, 'Temporal.Duration');

  var ObjectAssign$3 = Object.assign;
  var MonthDay = /*#__PURE__*/function () {
    function MonthDay(isoMonth, isoDay) {
      var calendar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      var referenceISOYear = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1972;

      _classCallCheck(this, MonthDay);

      isoMonth = ES.ToInteger(isoMonth);
      isoDay = ES.ToInteger(isoDay);
      if (calendar === undefined) calendar = GetISO8601Calendar();
      referenceISOYear = ES.ToInteger(referenceISOYear);
      ES.RejectDate(referenceISOYear, isoMonth, isoDay);
      ES.RejectDateRange(referenceISOYear, isoMonth, isoDay);
      if (!calendar || _typeof(calendar) !== 'object') throw new RangeError('invalid calendar');
      CreateSlots(this);
      SetSlot(this, ISO_MONTH, isoMonth);
      SetSlot(this, ISO_DAY, isoDay);
      SetSlot(this, ISO_YEAR, referenceISOYear);
      SetSlot(this, CALENDAR, calendar);
      SetSlot(this, MONTH_DAY_BRAND, true);

      {
        Object.defineProperty(this, '_repr_', {
          value: "".concat(this[Symbol.toStringTag], " <").concat(this, ">"),
          writable: false,
          enumerable: false,
          configurable: false
        });
      }
    }

    _createClass(MonthDay, [{
      key: "with",
      value: function _with(temporalMonthDayLike) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');

        if ('calendar' in temporalMonthDayLike) {
          throw new RangeError('invalid calendar property in month-day-like');
        }

        var props = ES.ToPartialRecord(temporalMonthDayLike, ['day', 'month']);

        if (!props) {
          throw new RangeError('invalid month-day-like');
        }

        var fields = ES.ToTemporalMonthDayRecord(this);
        ObjectAssign$3(fields, props);
        var Construct = ES.SpeciesConstructor(this, MonthDay);
        var result = GetSlot(this, CALENDAR).monthDayFromFields(fields, options, Construct);
        if (!ES.IsTemporalMonthDay(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "equals",
      value: function equals(other) {
        if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
        if (!ES.IsTemporalMonthDay(other)) throw new TypeError('invalid MonthDay object');

        for (var _i = 0, _arr = [ISO_MONTH, ISO_DAY, ISO_YEAR]; _i < _arr.length; _i++) {
          var slot = _arr[_i];
          var val1 = GetSlot(this, slot);
          var val2 = GetSlot(other, slot);
          if (val1 !== val2) return false;
        }

        return GetSlot(this, CALENDAR).id === GetSlot(other, CALENDAR).id;
      }
    }, {
      key: "toString",
      value: function toString() {
        if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
        var month = ES.ISODateTimePartString(GetSlot(this, ISO_MONTH));
        var day = ES.ISODateTimePartString(GetSlot(this, ISO_DAY));
        var resultString = "".concat(month, "-").concat(day);
        var calendar = ES.FormatCalendarAnnotation(GetSlot(this, CALENDAR));

        if (calendar) {
          var year = ES.ISOYearString(GetSlot(this, ISO_YEAR));
          resultString = "".concat(year, "-").concat(resultString).concat(calendar);
        }

        return resultString;
      }
    }, {
      key: "toLocaleString",
      value: function toLocaleString() {
        if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _construct(Intl.DateTimeFormat, args).format(this);
      }
    }, {
      key: "valueOf",
      value: function valueOf() {
        throw new TypeError('use equals() to compare Temporal.MonthDay');
      }
    }, {
      key: "toDateInYear",
      value: function toDateInYear(item) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
        var era, year;

        if (_typeof(item) === 'object' && item !== null) {
          var _ES$ToRecord = ES.ToRecord(item, [['era', undefined], ['year']]);

          era = _ES$ToRecord.era;
          year = _ES$ToRecord.year;
        } else {
          year = ES.ToInteger(item);
        }

        var calendar = GetSlot(this, CALENDAR);
        var fields = ES.ToTemporalMonthDayRecord(this);
        var Date = GetIntrinsic$1('%Temporal.Date%');
        return calendar.dateFromFields(_objectSpread2(_objectSpread2({}, fields), {}, {
          era: era,
          year: year
        }), options, Date);
      }
    }, {
      key: "getFields",
      value: function getFields() {
        var fields = ES.ToTemporalMonthDayRecord(this);
        if (!fields) throw new TypeError('invalid receiver');
        fields.calendar = GetSlot(this, CALENDAR);
        return fields;
      }
    }, {
      key: "getISOFields",
      value: function getISOFields() {
        if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
        return {
          isoYear: GetSlot(this, ISO_YEAR),
          isoMonth: GetSlot(this, ISO_MONTH),
          isoDay: GetSlot(this, ISO_DAY),
          calendar: GetSlot(this, CALENDAR)
        };
      }
    }, {
      key: "month",
      get: function get() {
        if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).month(this);
      }
    }, {
      key: "day",
      get: function get() {
        if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).day(this);
      }
    }, {
      key: "calendar",
      get: function get() {
        if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR);
      }
    }], [{
      key: "from",
      value: function from(item) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        options = ES.NormalizeOptionsObject(options);
        var overflow = ES.ToTemporalOverflow(options);
        var TemporalCalendar = GetIntrinsic$1('%Temporal.Calendar%');
        var result;

        if (_typeof(item) === 'object' && item) {
          if (ES.IsTemporalMonthDay(item)) {
            var month = GetSlot(item, ISO_MONTH);
            var day = GetSlot(item, ISO_DAY);
            var calendar = GetSlot(item, CALENDAR);
            var referenceISOYear = GetSlot(item, ISO_YEAR);
            result = new this(month, day, calendar, referenceISOYear);
          } else {
            var _calendar = item.calendar;
            if (_calendar === undefined) _calendar = GetISO8601Calendar();
            _calendar = TemporalCalendar.from(_calendar);
            var fields = ES.ToTemporalMonthDayRecord(item);
            result = _calendar.monthDayFromFields(fields, options, this);
          }
        } else {
          var _ES$ParseTemporalMont = ES.ParseTemporalMonthDayString(ES.ToString(item)),
              _month = _ES$ParseTemporalMont.month,
              _day = _ES$ParseTemporalMont.day,
              _referenceISOYear = _ES$ParseTemporalMont.referenceISOYear,
              _calendar2 = _ES$ParseTemporalMont.calendar;

          var _ES$RegulateMonthDay = ES.RegulateMonthDay(_month, _day, overflow);

          _month = _ES$RegulateMonthDay.month;
          _day = _ES$RegulateMonthDay.day;
          if (!_calendar2) _calendar2 = GetISO8601Calendar();
          _calendar2 = TemporalCalendar.from(_calendar2);
          if (_referenceISOYear === undefined) _referenceISOYear = 1972;
          result = new this(_month, _day, _calendar2, _referenceISOYear);
        }

        if (!ES.IsTemporalMonthDay(result)) throw new TypeError('invalid result');
        return result;
      }
    }]);

    return MonthDay;
  }();
  MonthDay.prototype.toJSON = MonthDay.prototype.toString;
  MakeIntrinsicClass(MonthDay, 'Temporal.MonthDay');

  var now = {
    instant: instant,
    dateTime: dateTime,
    dateTimeISO: dateTimeISO,
    date: date,
    dateISO: dateISO,
    timeISO: timeISO,
    timeZone: timeZone
  };

  function instant() {
    var Instant = GetIntrinsic$1('%Temporal.Instant%');
    return new Instant(ES.SystemUTCEpochNanoSeconds());
  }

  function dateTime(calendarLike) {
    var temporalTimeZoneLike = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : timeZone();
    return function () {
      var timeZone = ES.ToTemporalTimeZone(temporalTimeZoneLike);
      var calendar = ES.ToTemporalCalendar(calendarLike);
      var abs = instant();
      return ES.GetTemporalDateTimeFor(timeZone, abs, calendar);
    }();
  }

  function dateTimeISO() {
    var temporalTimeZoneLike = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : timeZone();
    return function () {
      var timeZone = ES.ToTemporalTimeZone(temporalTimeZoneLike);
      var calendar = GetISO8601Calendar();
      var abs = instant();
      return ES.GetTemporalDateTimeFor(timeZone, abs, calendar);
    }();
  }

  function date(calendarLike) {
    var temporalTimeZoneLike = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : timeZone();
    return ES.TemporalDateTimeToDate(dateTime(calendarLike, temporalTimeZoneLike));
  }

  function dateISO() {
    var temporalTimeZoneLike = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : timeZone();
    return ES.TemporalDateTimeToDate(dateTimeISO(temporalTimeZoneLike));
  }

  function timeISO() {
    var temporalTimeZoneLike = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : timeZone();
    return ES.TemporalDateTimeToTime(dateTimeISO(temporalTimeZoneLike));
  }

  function timeZone() {
    return ES.SystemTimeZone();
  }

  var Time = /*#__PURE__*/function () {
    function Time() {
      var hour = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var minute = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var second = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var millisecond = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var microsecond = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var nanosecond = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

      _classCallCheck(this, Time);

      hour = ES.ToInteger(hour);
      minute = ES.ToInteger(minute);
      second = ES.ToInteger(second);
      millisecond = ES.ToInteger(millisecond);
      microsecond = ES.ToInteger(microsecond);
      nanosecond = ES.ToInteger(nanosecond);
      ES.RejectTime(hour, minute, second, millisecond, microsecond, nanosecond);
      CreateSlots(this);
      SetSlot(this, HOUR, hour);
      SetSlot(this, MINUTE, minute);
      SetSlot(this, SECOND, second);
      SetSlot(this, MILLISECOND, millisecond);
      SetSlot(this, MICROSECOND, microsecond);
      SetSlot(this, NANOSECOND, nanosecond);

      {
        Object.defineProperty(this, '_repr_', {
          value: "".concat(this[Symbol.toStringTag], " <").concat(this, ">"),
          writable: false,
          enumerable: false,
          configurable: false
        });
      }
    }

    _createClass(Time, [{
      key: "with",
      value: function _with(temporalTimeLike) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
        options = ES.NormalizeOptionsObject(options);
        var overflow = ES.ToTemporalOverflow(options);
        var props = ES.ToPartialRecord(temporalTimeLike, ['hour', 'microsecond', 'millisecond', 'minute', 'nanosecond', 'second']);

        if (!props) {
          throw new RangeError('invalid time-like');
        }

        var _props$hour = props.hour,
            hour = _props$hour === void 0 ? GetSlot(this, HOUR) : _props$hour,
            _props$minute = props.minute,
            minute = _props$minute === void 0 ? GetSlot(this, MINUTE) : _props$minute,
            _props$second = props.second,
            second = _props$second === void 0 ? GetSlot(this, SECOND) : _props$second,
            _props$millisecond = props.millisecond,
            millisecond = _props$millisecond === void 0 ? GetSlot(this, MILLISECOND) : _props$millisecond,
            _props$microsecond = props.microsecond,
            microsecond = _props$microsecond === void 0 ? GetSlot(this, MICROSECOND) : _props$microsecond,
            _props$nanosecond = props.nanosecond,
            nanosecond = _props$nanosecond === void 0 ? GetSlot(this, NANOSECOND) : _props$nanosecond;

        var _ES$RegulateTime = ES.RegulateTime(hour, minute, second, millisecond, microsecond, nanosecond, overflow);

        hour = _ES$RegulateTime.hour;
        minute = _ES$RegulateTime.minute;
        second = _ES$RegulateTime.second;
        millisecond = _ES$RegulateTime.millisecond;
        microsecond = _ES$RegulateTime.microsecond;
        nanosecond = _ES$RegulateTime.nanosecond;
        var Construct = ES.SpeciesConstructor(this, Time);
        var result = new Construct(hour, minute, second, millisecond, microsecond, nanosecond);
        if (!ES.IsTemporalTime(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "add",
      value: function add(temporalDurationLike) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
        var hour = this.hour,
            minute = this.minute,
            second = this.second,
            millisecond = this.millisecond,
            microsecond = this.microsecond,
            nanosecond = this.nanosecond;
        var duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
        options = ES.NormalizeOptionsObject(options);
        var overflow = ES.ToTemporalOverflow(options);
        var years = duration.years,
            months = duration.months,
            weeks = duration.weeks,
            days = duration.days,
            hours = duration.hours,
            minutes = duration.minutes,
            seconds = duration.seconds,
            milliseconds = duration.milliseconds,
            microseconds = duration.microseconds,
            nanoseconds = duration.nanoseconds;
        ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
        var sign = ES.DurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);

        if (sign < 0) {
          var _ES$SubtractTime = ES.SubtractTime(hour, minute, second, millisecond, microsecond, nanosecond, -hours, -minutes, -seconds, -milliseconds, -microseconds, -nanoseconds);

          hour = _ES$SubtractTime.hour;
          minute = _ES$SubtractTime.minute;
          second = _ES$SubtractTime.second;
          millisecond = _ES$SubtractTime.millisecond;
          microsecond = _ES$SubtractTime.microsecond;
          nanosecond = _ES$SubtractTime.nanosecond;
        } else {
          var _ES$AddTime = ES.AddTime(hour, minute, second, millisecond, microsecond, nanosecond, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);

          hour = _ES$AddTime.hour;
          minute = _ES$AddTime.minute;
          second = _ES$AddTime.second;
          millisecond = _ES$AddTime.millisecond;
          microsecond = _ES$AddTime.microsecond;
          nanosecond = _ES$AddTime.nanosecond;
        }

        var _ES$RegulateTime2 = ES.RegulateTime(hour, minute, second, millisecond, microsecond, nanosecond, overflow);

        hour = _ES$RegulateTime2.hour;
        minute = _ES$RegulateTime2.minute;
        second = _ES$RegulateTime2.second;
        millisecond = _ES$RegulateTime2.millisecond;
        microsecond = _ES$RegulateTime2.microsecond;
        nanosecond = _ES$RegulateTime2.nanosecond;
        var Construct = ES.SpeciesConstructor(this, Time);
        var result = new Construct(hour, minute, second, millisecond, microsecond, nanosecond);
        if (!ES.IsTemporalTime(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "subtract",
      value: function subtract(temporalDurationLike) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
        var hour = this.hour,
            minute = this.minute,
            second = this.second,
            millisecond = this.millisecond,
            microsecond = this.microsecond,
            nanosecond = this.nanosecond;
        var duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
        options = ES.NormalizeOptionsObject(options);
        var overflow = ES.ToTemporalOverflow(options);
        var years = duration.years,
            months = duration.months,
            weeks = duration.weeks,
            days = duration.days,
            hours = duration.hours,
            minutes = duration.minutes,
            seconds = duration.seconds,
            milliseconds = duration.milliseconds,
            microseconds = duration.microseconds,
            nanoseconds = duration.nanoseconds;
        ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
        var sign = ES.DurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);

        if (sign < 0) {
          var _ES$AddTime2 = ES.AddTime(hour, minute, second, millisecond, microsecond, nanosecond, -hours, -minutes, -seconds, -milliseconds, -microseconds, -nanoseconds);

          hour = _ES$AddTime2.hour;
          minute = _ES$AddTime2.minute;
          second = _ES$AddTime2.second;
          millisecond = _ES$AddTime2.millisecond;
          microsecond = _ES$AddTime2.microsecond;
          nanosecond = _ES$AddTime2.nanosecond;
        } else {
          var _ES$SubtractTime2 = ES.SubtractTime(hour, minute, second, millisecond, microsecond, nanosecond, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);

          hour = _ES$SubtractTime2.hour;
          minute = _ES$SubtractTime2.minute;
          second = _ES$SubtractTime2.second;
          millisecond = _ES$SubtractTime2.millisecond;
          microsecond = _ES$SubtractTime2.microsecond;
          nanosecond = _ES$SubtractTime2.nanosecond;
        }

        var _ES$RegulateTime3 = ES.RegulateTime(hour, minute, second, millisecond, microsecond, nanosecond, overflow);

        hour = _ES$RegulateTime3.hour;
        minute = _ES$RegulateTime3.minute;
        second = _ES$RegulateTime3.second;
        millisecond = _ES$RegulateTime3.millisecond;
        microsecond = _ES$RegulateTime3.microsecond;
        nanosecond = _ES$RegulateTime3.nanosecond;
        var Construct = ES.SpeciesConstructor(this, Time);
        var result = new Construct(hour, minute, second, millisecond, microsecond, nanosecond);
        if (!ES.IsTemporalTime(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "difference",
      value: function difference(other) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
        if (!ES.IsTemporalTime(other)) throw new TypeError('invalid Time object');
        options = ES.NormalizeOptionsObject(options);
        var largestUnit = ES.ToLargestTemporalUnit(options, 'hours', ['years', 'months', 'weeks', 'days']);
        var smallestUnit = ES.ToSmallestTemporalDurationUnit(options, 'nanoseconds');
        ES.ValidateTemporalUnitRange(largestUnit, smallestUnit);
        var roundingMode = ES.ToTemporalRoundingMode(options);
        var maximumIncrements = {
          hours: 24,
          minutes: 60,
          seconds: 60,
          milliseconds: 1000,
          microseconds: 1000,
          nanoseconds: 1000
        };
        var roundingIncrement = ES.ToTemporalRoundingIncrement(options, maximumIncrements[smallestUnit], false);

        var _ES$DifferenceTime = ES.DifferenceTime(GetSlot(other, HOUR), GetSlot(other, MINUTE), GetSlot(other, SECOND), GetSlot(other, MILLISECOND), GetSlot(other, MICROSECOND), GetSlot(other, NANOSECOND), GetSlot(this, HOUR), GetSlot(this, MINUTE), GetSlot(this, SECOND), GetSlot(this, MILLISECOND), GetSlot(this, MICROSECOND), GetSlot(this, NANOSECOND)),
            hours = _ES$DifferenceTime.hours,
            minutes = _ES$DifferenceTime.minutes,
            seconds = _ES$DifferenceTime.seconds,
            milliseconds = _ES$DifferenceTime.milliseconds,
            microseconds = _ES$DifferenceTime.microseconds,
            nanoseconds = _ES$DifferenceTime.nanoseconds;

        var _ES$RoundDuration = ES.RoundDuration(0, 0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, roundingIncrement, smallestUnit, roundingMode);

        hours = _ES$RoundDuration.hours;
        minutes = _ES$RoundDuration.minutes;
        seconds = _ES$RoundDuration.seconds;
        milliseconds = _ES$RoundDuration.milliseconds;
        microseconds = _ES$RoundDuration.microseconds;
        nanoseconds = _ES$RoundDuration.nanoseconds;

        var _ES$BalanceDuration = ES.BalanceDuration(0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, largestUnit);

        hours = _ES$BalanceDuration.hours;
        minutes = _ES$BalanceDuration.minutes;
        seconds = _ES$BalanceDuration.seconds;
        milliseconds = _ES$BalanceDuration.milliseconds;
        microseconds = _ES$BalanceDuration.microseconds;
        nanoseconds = _ES$BalanceDuration.nanoseconds;
        var Duration = GetIntrinsic$1('%Temporal.Duration%');
        return new Duration(0, 0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
      }
    }, {
      key: "round",
      value: function round(options) {
        if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
        if (options === undefined) throw new TypeError('options parameter is required');
        options = ES.NormalizeOptionsObject(options);
        var smallestUnit = ES.ToSmallestTemporalUnit(options, ['day']);
        var roundingMode = ES.ToTemporalRoundingMode(options);
        var maximumIncrements = {
          hour: 24,
          minute: 60,
          second: 60,
          millisecond: 1000,
          microsecond: 1000,
          nanosecond: 1000
        };
        var roundingIncrement = ES.ToTemporalRoundingIncrement(options, maximumIncrements[smallestUnit], false);
        var hour = GetSlot(this, HOUR);
        var minute = GetSlot(this, MINUTE);
        var second = GetSlot(this, SECOND);
        var millisecond = GetSlot(this, MILLISECOND);
        var microsecond = GetSlot(this, MICROSECOND);
        var nanosecond = GetSlot(this, NANOSECOND);

        var _ES$RoundTime = ES.RoundTime(hour, minute, second, millisecond, microsecond, nanosecond, roundingIncrement, smallestUnit, roundingMode);

        hour = _ES$RoundTime.hour;
        minute = _ES$RoundTime.minute;
        second = _ES$RoundTime.second;
        millisecond = _ES$RoundTime.millisecond;
        microsecond = _ES$RoundTime.microsecond;
        nanosecond = _ES$RoundTime.nanosecond;
        var Construct = ES.SpeciesConstructor(this, Time);
        var result = new Construct(hour, minute, second, millisecond, microsecond, nanosecond);
        if (!ES.IsTemporalTime(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "equals",
      value: function equals(other) {
        if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
        if (!ES.IsTemporalTime(other)) throw new TypeError('invalid Time object');

        for (var _i = 0, _arr = [HOUR, MINUTE, SECOND, MILLISECOND, MICROSECOND, NANOSECOND]; _i < _arr.length; _i++) {
          var slot = _arr[_i];
          var val1 = GetSlot(this, slot);
          var val2 = GetSlot(other, slot);
          if (val1 !== val2) return false;
        }

        return true;
      }
    }, {
      key: "toString",
      value: function toString() {
        if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
        var hour = ES.ISODateTimePartString(GetSlot(this, HOUR));
        var minute = ES.ISODateTimePartString(GetSlot(this, MINUTE));
        var seconds = ES.FormatSecondsStringPart(GetSlot(this, SECOND), GetSlot(this, MILLISECOND), GetSlot(this, MICROSECOND), GetSlot(this, NANOSECOND));
        var resultString = "".concat(hour, ":").concat(minute).concat(seconds);
        return resultString;
      }
    }, {
      key: "toLocaleString",
      value: function toLocaleString() {
        if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _construct(Intl.DateTimeFormat, args).format(this);
      }
    }, {
      key: "valueOf",
      value: function valueOf() {
        throw new TypeError('use compare() or equals() to compare Temporal.Time');
      }
    }, {
      key: "toDateTime",
      value: function toDateTime(temporalDate) {
        if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
        if (!ES.IsTemporalDate(temporalDate)) throw new TypeError('invalid Temporal.Date object');
        var year = GetSlot(temporalDate, ISO_YEAR);
        var month = GetSlot(temporalDate, ISO_MONTH);
        var day = GetSlot(temporalDate, ISO_DAY);
        var hour = GetSlot(this, HOUR);
        var minute = GetSlot(this, MINUTE);
        var second = GetSlot(this, SECOND);
        var millisecond = GetSlot(this, MILLISECOND);
        var microsecond = GetSlot(this, MICROSECOND);
        var nanosecond = GetSlot(this, NANOSECOND);
        var calendar = GetSlot(temporalDate, CALENDAR);
        var DateTime = GetIntrinsic$1('%Temporal.DateTime%');
        return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
      }
    }, {
      key: "getFields",
      value: function getFields() {
        var fields = ES.ToTemporalTimeRecord(this);
        if (!fields) throw new TypeError('invalid receiver');
        return fields;
      }
    }, {
      key: "hour",
      get: function get() {
        if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, HOUR);
      }
    }, {
      key: "minute",
      get: function get() {
        if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, MINUTE);
      }
    }, {
      key: "second",
      get: function get() {
        if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, SECOND);
      }
    }, {
      key: "millisecond",
      get: function get() {
        if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, MILLISECOND);
      }
    }, {
      key: "microsecond",
      get: function get() {
        if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, MICROSECOND);
      }
    }, {
      key: "nanosecond",
      get: function get() {
        if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, NANOSECOND);
      }
    }], [{
      key: "from",
      value: function from(item) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        options = ES.NormalizeOptionsObject(options);
        var overflow = ES.ToTemporalOverflow(options);
        var hour, minute, second, millisecond, microsecond, nanosecond;

        if (_typeof(item) === 'object' && item) {
          if (ES.IsTemporalTime(item)) {
            hour = GetSlot(item, HOUR);
            minute = GetSlot(item, MINUTE);
            second = GetSlot(item, SECOND);
            millisecond = GetSlot(item, MILLISECOND);
            microsecond = GetSlot(item, MICROSECOND);
            nanosecond = GetSlot(item, NANOSECOND);
          } else {
            // Intentionally largest to smallest units
            var _ES$ToTemporalTimeRec = ES.ToTemporalTimeRecord(item);

            hour = _ES$ToTemporalTimeRec.hour;
            minute = _ES$ToTemporalTimeRec.minute;
            second = _ES$ToTemporalTimeRec.second;
            millisecond = _ES$ToTemporalTimeRec.millisecond;
            microsecond = _ES$ToTemporalTimeRec.microsecond;
            nanosecond = _ES$ToTemporalTimeRec.nanosecond;
          }
        } else {
          var _ES$ParseTemporalTime = ES.ParseTemporalTimeString(ES.ToString(item));

          hour = _ES$ParseTemporalTime.hour;
          minute = _ES$ParseTemporalTime.minute;
          second = _ES$ParseTemporalTime.second;
          millisecond = _ES$ParseTemporalTime.millisecond;
          microsecond = _ES$ParseTemporalTime.microsecond;
          nanosecond = _ES$ParseTemporalTime.nanosecond;
        }

        var _ES$RegulateTime4 = ES.RegulateTime(hour, minute, second, millisecond, microsecond, nanosecond, overflow);

        hour = _ES$RegulateTime4.hour;
        minute = _ES$RegulateTime4.minute;
        second = _ES$RegulateTime4.second;
        millisecond = _ES$RegulateTime4.millisecond;
        microsecond = _ES$RegulateTime4.microsecond;
        nanosecond = _ES$RegulateTime4.nanosecond;
        var result = new this(hour, minute, second, millisecond, microsecond, nanosecond);
        if (!ES.IsTemporalTime(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "compare",
      value: function compare(one, two) {
        if (!ES.IsTemporalTime(one) || !ES.IsTemporalTime(two)) throw new TypeError('invalid Time object');

        for (var _i2 = 0, _arr2 = [HOUR, MINUTE, SECOND, MILLISECOND, MICROSECOND, NANOSECOND]; _i2 < _arr2.length; _i2++) {
          var slot = _arr2[_i2];
          var val1 = GetSlot(one, slot);
          var val2 = GetSlot(two, slot);
          if (val1 !== val2) return ES.ComparisonResult(val1 - val2);
        }

        return ES.ComparisonResult(0);
      }
    }]);

    return Time;
  }();
  Time.prototype.toJSON = Time.prototype.toString;
  MakeIntrinsicClass(Time, 'Temporal.Time');

  var OFFSET$1 = new RegExp("^".concat(offset.source, "$"));

  function parseOffsetString$1(string) {
    var match = OFFSET$1.exec(String(string));
    if (!match) return null;
    var sign = match[1] === '-' || match[1] === "\u2212" ? -1 : +1;
    var hours = +match[2];
    var minutes = +(match[3] || 0);
    return sign * (hours * 60 + minutes) * 60 * 1e9;
  }

  var TimeZone = /*#__PURE__*/function () {
    function TimeZone(timeZoneIdentifier) {
      _classCallCheck(this, TimeZone);

      if ((this instanceof TimeZone ? this.constructor : void 0) === TimeZone) {
        timeZoneIdentifier = ES.GetCanonicalTimeZoneIdentifier(timeZoneIdentifier);
      }

      CreateSlots(this);
      SetSlot(this, TIMEZONE_ID, timeZoneIdentifier);

      {
        Object.defineProperty(this, '_repr_', {
          value: "".concat(this[Symbol.toStringTag], " <").concat(this, ">"),
          writable: false,
          enumerable: false,
          configurable: false
        });
      }
    }

    _createClass(TimeZone, [{
      key: "getOffsetNanosecondsFor",
      value: function getOffsetNanosecondsFor(absolute) {
        if (!ES.IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
        if (!ES.IsTemporalInstant(absolute)) throw new TypeError('invalid Instant object');
        var id = GetSlot(this, TIMEZONE_ID);
        var offsetNs = parseOffsetString$1(id);
        if (offsetNs !== null) return offsetNs;
        return ES.GetIANATimeZoneOffsetNanoseconds(GetSlot(absolute, EPOCHNANOSECONDS), id);
      }
    }, {
      key: "getOffsetStringFor",
      value: function getOffsetStringFor(absolute) {
        if (!ES.IsTemporalInstant(absolute)) throw new TypeError('invalid Instant object');
        var offsetNs = ES.GetOffsetNanosecondsFor(this, absolute);
        return ES.FormatTimeZoneOffsetString(offsetNs);
      }
    }, {
      key: "getDateTimeFor",
      value: function getDateTimeFor(absolute) {
        var calendar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : GetISO8601Calendar();
        if (!ES.IsTemporalInstant(absolute)) throw new TypeError('invalid Instant object');
        calendar = ES.ToTemporalCalendar(calendar);
        var ns = GetSlot(absolute, EPOCHNANOSECONDS);
        var offsetNs = ES.GetOffsetNanosecondsFor(this, absolute);

        var _ES$GetPartsFromEpoch = ES.GetPartsFromEpoch(ns),
            year = _ES$GetPartsFromEpoch.year,
            month = _ES$GetPartsFromEpoch.month,
            day = _ES$GetPartsFromEpoch.day,
            hour = _ES$GetPartsFromEpoch.hour,
            minute = _ES$GetPartsFromEpoch.minute,
            second = _ES$GetPartsFromEpoch.second,
            millisecond = _ES$GetPartsFromEpoch.millisecond,
            microsecond = _ES$GetPartsFromEpoch.microsecond,
            nanosecond = _ES$GetPartsFromEpoch.nanosecond;

        var _ES$BalanceDateTime = ES.BalanceDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond + offsetNs);

        year = _ES$BalanceDateTime.year;
        month = _ES$BalanceDateTime.month;
        day = _ES$BalanceDateTime.day;
        hour = _ES$BalanceDateTime.hour;
        minute = _ES$BalanceDateTime.minute;
        second = _ES$BalanceDateTime.second;
        millisecond = _ES$BalanceDateTime.millisecond;
        microsecond = _ES$BalanceDateTime.microsecond;
        nanosecond = _ES$BalanceDateTime.nanosecond;
        var DateTime = GetIntrinsic$1('%Temporal.DateTime%');
        return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
      }
    }, {
      key: "getInstantFor",
      value: function getInstantFor(dateTime) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid DateTime object');
        options = ES.NormalizeOptionsObject(options);
        var disambiguation = ES.ToTemporalDisambiguation(options);
        var Instant = GetIntrinsic$1('%Temporal.Instant%');
        var possibleInstants = this.getPossibleInstantsFor(dateTime);

        if (!Array.isArray(possibleInstants)) {
          throw new TypeError('bad return from getPossibleInstantsFor');
        }

        var numInstants = possibleInstants.length;

        function validateInstant(absolute) {
          if (!ES.IsTemporalInstant(absolute)) {
            throw new TypeError('bad return from getPossibleInstantsFor');
          }

          return absolute;
        }

        if (numInstants === 1) return validateInstant(possibleInstants[0]);

        if (numInstants) {
          switch (disambiguation) {
            case 'compatible': // fall through because 'compatible' means 'earlier' for "fall back" transitions

            case 'earlier':
              return validateInstant(possibleInstants[0]);

            case 'later':
              return validateInstant(possibleInstants[numInstants - 1]);

            case 'reject':
              {
                throw new RangeError('multiple absolute found');
              }
          }
        }

        var utcns = ES.GetEpochFromParts(GetSlot(dateTime, ISO_YEAR), GetSlot(dateTime, ISO_MONTH), GetSlot(dateTime, ISO_DAY), GetSlot(dateTime, HOUR), GetSlot(dateTime, MINUTE), GetSlot(dateTime, SECOND), GetSlot(dateTime, MILLISECOND), GetSlot(dateTime, MICROSECOND), GetSlot(dateTime, NANOSECOND));
        if (utcns === null) throw new RangeError('DateTime outside of supported range');
        var dayBefore = new Instant(utcns.minus(86400e9));
        var dayAfter = new Instant(utcns.plus(86400e9));
        var offsetBefore = this.getOffsetNanosecondsFor(dayBefore);
        var offsetAfter = this.getOffsetNanosecondsFor(dayAfter);
        var nanoseconds = offsetAfter - offsetBefore;
        var diff = ES.ToTemporalDurationRecord({
          nanoseconds: nanoseconds
        }, 'reject');

        switch (disambiguation) {
          case 'earlier':
            {
              var earlier = dateTime.subtract(diff);
              return this.getPossibleInstantsFor(earlier)[0];
            }

          case 'compatible': // fall through because 'compatible' means 'later' for "spring forward" transitions

          case 'later':
            {
              var later = dateTime.add(diff);
              var possible = this.getPossibleInstantsFor(later);
              return possible[possible.length - 1];
            }

          case 'reject':
            {
              throw new RangeError('no such absolute found');
            }
        }
      }
    }, {
      key: "getPossibleInstantsFor",
      value: function getPossibleInstantsFor(dateTime) {
        if (!ES.IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
        if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid DateTime object');
        var Instant = GetIntrinsic$1('%Temporal.Instant%');
        var id = GetSlot(this, TIMEZONE_ID);
        var offsetNs = parseOffsetString$1(id);

        if (offsetNs !== null) {
          var epochNs = ES.GetEpochFromParts(GetSlot(dateTime, ISO_YEAR), GetSlot(dateTime, ISO_MONTH), GetSlot(dateTime, ISO_DAY), GetSlot(dateTime, HOUR), GetSlot(dateTime, MINUTE), GetSlot(dateTime, SECOND), GetSlot(dateTime, MILLISECOND), GetSlot(dateTime, MICROSECOND), GetSlot(dateTime, NANOSECOND));
          if (epochNs === null) throw new RangeError('DateTime outside of supported range');
          return [new Instant(epochNs.minus(offsetNs))];
        }

        var possibleEpochNs = ES.GetIANATimeZoneEpochValue(id, GetSlot(dateTime, ISO_YEAR), GetSlot(dateTime, ISO_MONTH), GetSlot(dateTime, ISO_DAY), GetSlot(dateTime, HOUR), GetSlot(dateTime, MINUTE), GetSlot(dateTime, SECOND), GetSlot(dateTime, MILLISECOND), GetSlot(dateTime, MICROSECOND), GetSlot(dateTime, NANOSECOND));
        return possibleEpochNs.map(function (ns) {
          return new Instant(ns);
        });
      }
    }, {
      key: "getNextTransition",
      value: function getNextTransition(startingPoint) {
        if (!ES.IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
        if (!ES.IsTemporalInstant(startingPoint)) throw new TypeError('invalid Instant object');
        var id = GetSlot(this, TIMEZONE_ID); // Offset time zones or UTC have no transitions

        if (parseOffsetString$1(id) !== null || id === 'UTC') {
          return null;
        }

        var epochNanoseconds = GetSlot(startingPoint, EPOCHNANOSECONDS);
        var Instant = GetIntrinsic$1('%Temporal.Instant%');
        epochNanoseconds = ES.GetIANATimeZoneNextTransition(epochNanoseconds, id);
        return epochNanoseconds === null ? null : new Instant(epochNanoseconds);
      }
    }, {
      key: "getPreviousTransition",
      value: function getPreviousTransition(startingPoint) {
        if (!ES.IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
        if (!ES.IsTemporalInstant(startingPoint)) throw new TypeError('invalid Instant object');
        var id = GetSlot(this, TIMEZONE_ID); // Offset time zones or UTC have no transitions

        if (parseOffsetString$1(id) !== null || id === 'UTC') {
          return null;
        }

        var epochNanoseconds = GetSlot(startingPoint, EPOCHNANOSECONDS);
        var Instant = GetIntrinsic$1('%Temporal.Instant%');
        epochNanoseconds = ES.GetIANATimeZonePreviousTransition(epochNanoseconds, id);
        return epochNanoseconds === null ? null : new Instant(epochNanoseconds);
      }
    }, {
      key: "toString",
      value: function toString() {
        if (!ES.IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
        return String(GetSlot(this, TIMEZONE_ID));
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        return ES.TimeZoneToString(this);
      }
    }, {
      key: "id",
      get: function get() {
        return ES.TimeZoneToString(this);
      }
    }], [{
      key: "from",
      value: function from(item) {
        if (_typeof(item) === 'object' && item) return item;
        var timeZone = ES.TemporalTimeZoneFromString(ES.ToString(item));
        var result = new this(timeZone);
        if (!ES.IsTemporalTimeZone(result)) throw new TypeError('invalid result');
        return result;
      }
    }]);

    return TimeZone;
  }();
  MakeIntrinsicClass(TimeZone, 'Temporal.TimeZone');
  DefineIntrinsic('Temporal.TimeZone.from', TimeZone.from);
  DefineIntrinsic('Temporal.TimeZone.prototype.getDateTimeFor', TimeZone.prototype.getDateTimeFor);
  DefineIntrinsic('Temporal.TimeZone.prototype.getInstantFor', TimeZone.prototype.getInstantFor);
  DefineIntrinsic('Temporal.TimeZone.prototype.getOffsetNanosecondsFor', TimeZone.prototype.getOffsetNanosecondsFor);
  DefineIntrinsic('Temporal.TimeZone.prototype.getOffsetStringFor', TimeZone.prototype.getOffsetStringFor);
  DefineIntrinsic('Temporal.TimeZone.prototype.toString', TimeZone.prototype.toString);

  var ObjectAssign$4 = Object.assign;
  var YearMonth = /*#__PURE__*/function () {
    function YearMonth(isoYear, isoMonth) {
      var calendar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      var referenceISODay = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

      _classCallCheck(this, YearMonth);

      isoYear = ES.ToInteger(isoYear);
      isoMonth = ES.ToInteger(isoMonth);
      if (calendar === undefined) calendar = GetISO8601Calendar();
      referenceISODay = ES.ToInteger(referenceISODay);
      ES.RejectDate(isoYear, isoMonth, referenceISODay);
      ES.RejectYearMonthRange(isoYear, isoMonth);
      if (!calendar || _typeof(calendar) !== 'object') throw new RangeError('invalid calendar');
      CreateSlots(this);
      SetSlot(this, ISO_YEAR, isoYear);
      SetSlot(this, ISO_MONTH, isoMonth);
      SetSlot(this, ISO_DAY, referenceISODay);
      SetSlot(this, CALENDAR, calendar);
      SetSlot(this, YEAR_MONTH_BRAND, true);

      {
        Object.defineProperty(this, '_repr_', {
          value: "".concat(this[Symbol.toStringTag], " <").concat(this, ">"),
          writable: false,
          enumerable: false,
          configurable: false
        });
      }
    }

    _createClass(YearMonth, [{
      key: "with",
      value: function _with(temporalYearMonthLike) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');

        if ('calendar' in temporalYearMonthLike) {
          throw new RangeError('invalid calendar property in year-month-like');
        }

        var props = ES.ToPartialRecord(temporalYearMonthLike, ['era', 'month', 'year']);

        if (!props) {
          throw new RangeError('invalid year-month-like');
        }

        var fields = ES.ToTemporalYearMonthRecord(this);
        ObjectAssign$4(fields, props);
        var Construct = ES.SpeciesConstructor(this, YearMonth);
        var result = GetSlot(this, CALENDAR).yearMonthFromFields(fields, options, Construct);
        if (!ES.IsTemporalYearMonth(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "add",
      value: function add(temporalDurationLike) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
        var duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
        var years = duration.years,
            months = duration.months,
            weeks = duration.weeks,
            days = duration.days,
            hours = duration.hours,
            minutes = duration.minutes,
            seconds = duration.seconds,
            milliseconds = duration.milliseconds,
            microseconds = duration.microseconds,
            nanoseconds = duration.nanoseconds;
        ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);

        var _ES$BalanceDuration = ES.BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 'days');

        days = _ES$BalanceDuration.days;
        var TemporalDate = GetIntrinsic$1('%Temporal.Date%');
        var calendar = GetSlot(this, CALENDAR);
        var fields = ES.ToTemporalYearMonthRecord(this);
        var sign = ES.DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
        var day = sign < 0 ? calendar.daysInMonth(this) : 1;
        var startDate = calendar.dateFromFields(_objectSpread2(_objectSpread2({}, fields), {}, {
          day: day
        }), {}, TemporalDate);
        var addedDate = calendar.dateAdd(startDate, _objectSpread2(_objectSpread2({}, duration), {}, {
          days: days
        }), options, TemporalDate);
        var Construct = ES.SpeciesConstructor(this, YearMonth);
        var result = calendar.yearMonthFromFields(addedDate, options, Construct);
        if (!ES.IsTemporalYearMonth(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "subtract",
      value: function subtract(temporalDurationLike) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
        var duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
        var years = duration.years,
            months = duration.months,
            weeks = duration.weeks,
            days = duration.days,
            hours = duration.hours,
            minutes = duration.minutes,
            seconds = duration.seconds,
            milliseconds = duration.milliseconds,
            microseconds = duration.microseconds,
            nanoseconds = duration.nanoseconds;
        ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);

        var _ES$BalanceDuration2 = ES.BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 'days');

        days = _ES$BalanceDuration2.days;
        var TemporalDate = GetIntrinsic$1('%Temporal.Date%');
        var calendar = GetSlot(this, CALENDAR);
        var fields = ES.ToTemporalYearMonthRecord(this);
        var sign = ES.DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
        var day = sign < 0 ? 1 : calendar.daysInMonth(this);
        var startDate = calendar.dateFromFields(_objectSpread2(_objectSpread2({}, fields), {}, {
          day: day
        }), {}, TemporalDate);
        var subtractedDate = calendar.dateSubtract(startDate, _objectSpread2(_objectSpread2({}, duration), {}, {
          days: days
        }), options, TemporalDate);
        var Construct = ES.SpeciesConstructor(this, YearMonth);
        var result = calendar.yearMonthFromFields(subtractedDate, options, Construct);
        if (!ES.IsTemporalYearMonth(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "difference",
      value: function difference(other) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
        if (!ES.IsTemporalYearMonth(other)) throw new TypeError('invalid YearMonth object');
        var calendar = GetSlot(this, CALENDAR);
        var otherCalendar = GetSlot(other, CALENDAR);

        if (calendar.id !== otherCalendar.id) {
          throw new RangeError("cannot compute difference between months of ".concat(calendar.id, " and ").concat(otherCalendar.id, " calendars"));
        }

        options = ES.NormalizeOptionsObject(options);
        var disallowedUnits = ['weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds'];
        var smallestUnit = ES.ToSmallestTemporalDurationUnit(options, 'months', disallowedUnits);
        var largestUnit = ES.ToLargestTemporalUnit(options, 'years', disallowedUnits);
        ES.ValidateTemporalUnitRange(largestUnit, smallestUnit);
        var roundingMode = ES.ToTemporalRoundingMode(options);
        var roundingIncrement = ES.ToTemporalRoundingIncrement(options, undefined, false);
        var otherFields = ES.ToTemporalYearMonthRecord(other);
        var thisFields = ES.ToTemporalYearMonthRecord(this);
        var TemporalDate = GetIntrinsic$1('%Temporal.Date%');
        var otherDate = calendar.dateFromFields(_objectSpread2(_objectSpread2({}, otherFields), {}, {
          day: 1
        }), {}, TemporalDate);
        var thisDate = calendar.dateFromFields(_objectSpread2(_objectSpread2({}, thisFields), {}, {
          day: 1
        }), {}, TemporalDate);
        var result = calendar.dateDifference(otherDate, thisDate, {
          largestUnit: largestUnit
        });
        if (smallestUnit === 'months' && roundingIncrement === 1) return result;
        var years = result.years,
            months = result.months;
        var TemporalDateTime = GetIntrinsic$1('%Temporal.DateTime%');
        var relativeTo = new TemporalDateTime(GetSlot(thisDate, ISO_YEAR), GetSlot(thisDate, ISO_MONTH), GetSlot(thisDate, ISO_DAY), 0, 0, 0, 0, 0, 0, calendar);

        var _ES$RoundDuration = ES.RoundDuration(years, months, 0, 0, 0, 0, 0, 0, 0, 0, roundingIncrement, smallestUnit, roundingMode, relativeTo);

        years = _ES$RoundDuration.years;
        months = _ES$RoundDuration.months;
        var Duration = GetIntrinsic$1('%Temporal.Duration%');
        return new Duration(years, months, 0, 0, 0, 0, 0, 0, 0, 0);
      }
    }, {
      key: "equals",
      value: function equals(other) {
        if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
        if (!ES.IsTemporalYearMonth(other)) throw new TypeError('invalid YearMonth object');

        for (var _i = 0, _arr = [ISO_YEAR, ISO_MONTH, ISO_DAY]; _i < _arr.length; _i++) {
          var slot = _arr[_i];
          var val1 = GetSlot(this, slot);
          var val2 = GetSlot(other, slot);
          if (val1 !== val2) return false;
        }

        return GetSlot(this, CALENDAR).id === GetSlot(other, CALENDAR).id;
      }
    }, {
      key: "toString",
      value: function toString() {
        if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
        var year = ES.ISOYearString(GetSlot(this, ISO_YEAR));
        var month = ES.ISODateTimePartString(GetSlot(this, ISO_MONTH));
        var resultString = "".concat(year, "-").concat(month);
        var calendar = ES.FormatCalendarAnnotation(GetSlot(this, CALENDAR));

        if (calendar) {
          var day = ES.ISODateTimePartString(GetSlot(this, ISO_DAY));
          resultString = "".concat(resultString, "-").concat(day).concat(calendar);
        }

        return resultString;
      }
    }, {
      key: "toLocaleString",
      value: function toLocaleString() {
        if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _construct(Intl.DateTimeFormat, args).format(this);
      }
    }, {
      key: "valueOf",
      value: function valueOf() {
        throw new TypeError('use compare() or equals() to compare Temporal.YearMonth');
      }
    }, {
      key: "toDateOnDay",
      value: function toDateOnDay(day) {
        if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
        var calendar = GetSlot(this, CALENDAR);
        var fields = ES.ToTemporalYearMonthRecord(this);
        var Date = GetIntrinsic$1('%Temporal.Date%');
        return calendar.dateFromFields(_objectSpread2(_objectSpread2({}, fields), {}, {
          day: day
        }), {
          overflow: 'reject'
        }, Date);
      }
    }, {
      key: "getFields",
      value: function getFields() {
        var fields = ES.ToTemporalYearMonthRecord(this);
        if (!fields) throw new TypeError('invalid receiver');
        fields.calendar = GetSlot(this, CALENDAR);
        return fields;
      }
    }, {
      key: "getISOFields",
      value: function getISOFields() {
        if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
        return {
          isoYear: GetSlot(this, ISO_YEAR),
          isoMonth: GetSlot(this, ISO_MONTH),
          isoDay: GetSlot(this, ISO_DAY),
          calendar: GetSlot(this, CALENDAR)
        };
      }
    }, {
      key: "year",
      get: function get() {
        if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).year(this);
      }
    }, {
      key: "month",
      get: function get() {
        if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).month(this);
      }
    }, {
      key: "calendar",
      get: function get() {
        if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR);
      }
    }, {
      key: "era",
      get: function get() {
        if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).era(this);
      }
    }, {
      key: "daysInMonth",
      get: function get() {
        if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).daysInMonth(this);
      }
    }, {
      key: "daysInYear",
      get: function get() {
        if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).daysInYear(this);
      }
    }, {
      key: "monthsInYear",
      get: function get() {
        if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).monthsInYear(this);
      }
    }, {
      key: "isLeapYear",
      get: function get() {
        if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
        return GetSlot(this, CALENDAR).isLeapYear(this);
      }
    }], [{
      key: "from",
      value: function from(item) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        options = ES.NormalizeOptionsObject(options);
        var overflow = ES.ToTemporalOverflow(options);
        var TemporalCalendar = GetIntrinsic$1('%Temporal.Calendar%');
        var result;

        if (_typeof(item) === 'object' && item) {
          if (ES.IsTemporalYearMonth(item)) {
            var year = GetSlot(item, ISO_YEAR);
            var month = GetSlot(item, ISO_MONTH);
            var calendar = GetSlot(item, CALENDAR);
            var referenceISODay = GetSlot(item, ISO_DAY);
            result = new this(year, month, calendar, referenceISODay);
          } else {
            var _calendar = item.calendar;
            if (_calendar === undefined) _calendar = GetISO8601Calendar();
            _calendar = TemporalCalendar.from(_calendar);
            var fields = ES.ToTemporalYearMonthRecord(item);
            result = _calendar.yearMonthFromFields(fields, options, this);
          }
        } else {
          var _ES$ParseTemporalYear = ES.ParseTemporalYearMonthString(ES.ToString(item)),
              _year = _ES$ParseTemporalYear.year,
              _month = _ES$ParseTemporalYear.month,
              _referenceISODay = _ES$ParseTemporalYear.referenceISODay,
              _calendar2 = _ES$ParseTemporalYear.calendar;

          var _ES$RegulateYearMonth = ES.RegulateYearMonth(_year, _month, overflow);

          _year = _ES$RegulateYearMonth.year;
          _month = _ES$RegulateYearMonth.month;
          if (!_calendar2) _calendar2 = GetISO8601Calendar();
          _calendar2 = TemporalCalendar.from(_calendar2);
          if (_referenceISODay === undefined) _referenceISODay = 1;
          result = new this(_year, _month, _calendar2, _referenceISODay);
        }

        if (!ES.IsTemporalYearMonth(result)) throw new TypeError('invalid result');
        return result;
      }
    }, {
      key: "compare",
      value: function compare(one, two) {
        if (!ES.IsTemporalYearMonth(one) || !ES.IsTemporalYearMonth(two)) throw new TypeError('invalid YearMonth object');

        for (var _i2 = 0, _arr2 = [ISO_YEAR, ISO_MONTH, ISO_DAY]; _i2 < _arr2.length; _i2++) {
          var slot = _arr2[_i2];
          var val1 = GetSlot(one, slot);
          var val2 = GetSlot(two, slot);
          if (val1 !== val2) return ES.ComparisonResult(val1 - val2);
        }

        var cal1 = GetSlot(one, CALENDAR).id;
        var cal2 = GetSlot(two, CALENDAR).id;
        return ES.ComparisonResult(cal1 < cal2 ? -1 : cal1 > cal2 ? 1 : 0);
      }
    }]);

    return YearMonth;
  }();
  YearMonth.prototype.toJSON = YearMonth.prototype.toString;
  MakeIntrinsicClass(YearMonth, 'Temporal.YearMonth');

  var Temporal = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Instant: Instant,
    Calendar: Calendar,
    Date: Date$1,
    DateTime: DateTime,
    Duration: Duration,
    MonthDay: MonthDay,
    now: now,
    Time: Time,
    TimeZone: TimeZone,
    YearMonth: YearMonth
  });

  var DATE = Symbol('date');
  var YM = Symbol('ym');
  var MD = Symbol('md');
  var TIME = Symbol('time');
  var DATETIME = Symbol('datetime');
  var ORIGINAL = Symbol('original');
  var TIMEZONE = Symbol('timezone');
  var CAL_ID = Symbol('calendar-id');

  var descriptor = function descriptor(value) {
    return {
      value: value,
      enumerable: true,
      writable: false,
      configurable: true
    };
  };

  var IntlDateTimeFormat$1 = globalThis.Intl.DateTimeFormat;
  var ObjectAssign$5 = Object.assign;
  function DateTimeFormat() {
    var locale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : IntlDateTimeFormat$1().resolvedOptions().locale;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!(this instanceof DateTimeFormat)) return new DateTimeFormat(locale, options);
    this[ORIGINAL] = new IntlDateTimeFormat$1(locale, options);
    this[TIMEZONE] = new TimeZone(this.resolvedOptions().timeZone);
    this[CAL_ID] = this.resolvedOptions().calendar;
    this[DATE] = new IntlDateTimeFormat$1(locale, dateAmend(options));
    this[YM] = new IntlDateTimeFormat$1(locale, yearMonthAmend(options));
    this[MD] = new IntlDateTimeFormat$1(locale, monthDayAmend(options));
    this[TIME] = new IntlDateTimeFormat$1(locale, timeAmend(options));
    this[DATETIME] = new IntlDateTimeFormat$1(locale, datetimeAmend(options));
  }

  DateTimeFormat.supportedLocalesOf = function () {
    return IntlDateTimeFormat$1.supportedLocalesOf.apply(IntlDateTimeFormat$1, arguments);
  };

  var properties = {
    resolvedOptions: descriptor(resolvedOptions),
    format: descriptor(format),
    formatRange: descriptor(formatRange)
  };

  if ('formatToParts' in IntlDateTimeFormat$1.prototype) {
    properties.formatToParts = descriptor(formatToParts);
  }

  if ('formatRangeToParts' in IntlDateTimeFormat$1.prototype) {
    properties.formatRangeToParts = descriptor(formatRangeToParts);
  }

  DateTimeFormat.prototype = Object.create(IntlDateTimeFormat$1.prototype, properties);

  function resolvedOptions() {
    return this[ORIGINAL].resolvedOptions();
  }

  function format(datetime) {
    var _this$ORIGINAL;

    var _extractOverrides = extractOverrides(datetime, this),
        instant = _extractOverrides.instant,
        formatter = _extractOverrides.formatter;

    if (instant && formatter) {
      return formatter.format(instant.getEpochMilliseconds());
    }

    for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }

    return (_this$ORIGINAL = this[ORIGINAL]).format.apply(_this$ORIGINAL, [datetime].concat(rest));
  }

  function formatToParts(datetime) {
    var _this$ORIGINAL2;

    var _extractOverrides2 = extractOverrides(datetime, this),
        instant = _extractOverrides2.instant,
        formatter = _extractOverrides2.formatter;

    if (instant && formatter) {
      return formatter.formatToParts(instant.getEpochMilliseconds());
    }

    for (var _len2 = arguments.length, rest = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      rest[_key2 - 1] = arguments[_key2];
    }

    return (_this$ORIGINAL2 = this[ORIGINAL]).formatToParts.apply(_this$ORIGINAL2, [datetime].concat(rest));
  }

  function formatRange(a, b) {
    if ('object' === _typeof(a) && 'object' === _typeof(b) && a && b) {
      if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) {
        throw new TypeError('Intl.DateTimeFormat accepts two values of the same type');
      }

      var _extractOverrides3 = extractOverrides(a, this),
          aa = _extractOverrides3.instant,
          aformatter = _extractOverrides3.formatter;

      var _extractOverrides4 = extractOverrides(b, this),
          bb = _extractOverrides4.instant,
          bformatter = _extractOverrides4.formatter;

      if (aa && bb && aformatter && bformatter && aformatter === bformatter) {
        return aformatter.formatRange(aa.getEpochMilliseconds(), bb.getEpochMilliseconds());
      }
    }

    return this[ORIGINAL].formatRange(a, b);
  }

  function formatRangeToParts(a, b) {
    if ('object' === _typeof(a) && 'object' === _typeof(b) && a && b) {
      if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) {
        throw new TypeError('Intl.DateTimeFormat accepts two values of the same type');
      }

      var _extractOverrides5 = extractOverrides(a, this),
          aa = _extractOverrides5.instant,
          aformatter = _extractOverrides5.formatter;

      var _extractOverrides6 = extractOverrides(b, this),
          bb = _extractOverrides6.instant,
          bformatter = _extractOverrides6.formatter;

      if (aa && bb && aformatter && bformatter && aformatter === bformatter) {
        return aformatter.formatRangeToParts(aa.getEpochMilliseconds(), bb.getEpochMilliseconds());
      }
    }

    return this[ORIGINAL].formatRangeToParts(a, b);
  }

  function amend() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var amended = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    options = ObjectAssign$5({}, options);

    for (var _i = 0, _arr = ['year', 'month', 'day', 'hour', 'minute', 'second', 'weekday', 'timeZoneName']; _i < _arr.length; _i++) {
      var opt = _arr[_i];
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
      timeZoneName: false
    });

    if (!hasTimeOptions(options)) {
      options = ObjectAssign$5(options, {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      });
    }

    return options;
  }

  function yearMonthAmend(options) {
    options = amend(options, {
      day: false,
      hour: false,
      minute: false,
      second: false,
      weekday: false,
      timeZoneName: false
    });

    if (!('year' in options || 'month' in options)) {
      options = ObjectAssign$5(options, {
        year: 'numeric',
        month: 'numeric'
      });
    }

    return options;
  }

  function monthDayAmend(options) {
    options = amend(options, {
      year: false,
      hour: false,
      minute: false,
      second: false,
      weekday: false,
      timeZoneName: false
    });

    if (!('month' in options || 'day' in options)) {
      options = ObjectAssign$5(options, {
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
      timeZoneName: false
    });

    if (!hasDateOptions(options)) {
      options = ObjectAssign$5(options, {
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
      ObjectAssign$5(options, {
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
    return 'year' in options || 'month' in options || 'day' in options || 'weekday' in options;
  }

  function hasTimeOptions(options) {
    return 'hour' in options || 'minute' in options || 'second' in options;
  }

  function extractOverrides(temporalObj, main) {
    var DateTime = GetIntrinsic$1('%Temporal.DateTime%');

    if (ES.IsTemporalTime(temporalObj)) {
      var hour = GetSlot(temporalObj, HOUR);
      var minute = GetSlot(temporalObj, MINUTE);
      var second = GetSlot(temporalObj, SECOND);
      var millisecond = GetSlot(temporalObj, MILLISECOND);
      var microsecond = GetSlot(temporalObj, MICROSECOND);
      var nanosecond = GetSlot(temporalObj, NANOSECOND);
      var datetime = new DateTime(1970, 1, 1, hour, minute, second, millisecond, microsecond, nanosecond, main[CAL_ID]);
      return {
        instant: main[TIMEZONE].getInstantFor(datetime),
        formatter: main[TIME]
      };
    }

    if (ES.IsTemporalYearMonth(temporalObj)) {
      var isoYear = GetSlot(temporalObj, ISO_YEAR);
      var isoMonth = GetSlot(temporalObj, ISO_MONTH);
      var referenceISODay = GetSlot(temporalObj, ISO_DAY);
      var calendar = GetSlot(temporalObj, CALENDAR);

      if (calendar.id !== main[CAL_ID]) {
        throw new RangeError("cannot format YearMonth with calendar ".concat(calendar.id, " in locale with calendar ").concat(main[CAL_ID]));
      }

      var _datetime = new DateTime(isoYear, isoMonth, referenceISODay, 12, 0, 0, 0, 0, 0, calendar);

      return {
        instant: main[TIMEZONE].getInstantFor(_datetime),
        formatter: main[YM]
      };
    }

    if (ES.IsTemporalMonthDay(temporalObj)) {
      var referenceISOYear = GetSlot(temporalObj, ISO_YEAR);

      var _isoMonth = GetSlot(temporalObj, ISO_MONTH);

      var isoDay = GetSlot(temporalObj, ISO_DAY);

      var _calendar = GetSlot(temporalObj, CALENDAR);

      if (_calendar.id !== main[CAL_ID]) {
        throw new RangeError("cannot format MonthDay with calendar ".concat(_calendar.id, " in locale with calendar ").concat(main[CAL_ID]));
      }

      var _datetime2 = new DateTime(referenceISOYear, _isoMonth, isoDay, 12, 0, 0, 0, 0, 0, _calendar);

      return {
        instant: main[TIMEZONE].getInstantFor(_datetime2),
        formatter: main[MD]
      };
    }

    if (ES.IsTemporalDate(temporalObj)) {
      var _isoYear = GetSlot(temporalObj, ISO_YEAR);

      var _isoMonth2 = GetSlot(temporalObj, ISO_MONTH);

      var _isoDay = GetSlot(temporalObj, ISO_DAY);

      var _calendar2 = GetSlot(temporalObj, CALENDAR);

      if (_calendar2.id !== 'iso8601' && _calendar2.id !== main[CAL_ID]) {
        throw new RangeError("cannot format Date with calendar ".concat(_calendar2.id, " in locale with calendar ").concat(main[CAL_ID]));
      }

      var _datetime3 = new DateTime(_isoYear, _isoMonth2, _isoDay, 12, 0, 0, 0, 0, 0, main[CAL_ID]);

      return {
        instant: main[TIMEZONE].getInstantFor(_datetime3),
        formatter: main[DATE]
      };
    }

    if (ES.IsTemporalDateTime(temporalObj)) {
      var _isoYear2 = GetSlot(temporalObj, ISO_YEAR);

      var _isoMonth3 = GetSlot(temporalObj, ISO_MONTH);

      var _isoDay2 = GetSlot(temporalObj, ISO_DAY);

      var _hour = GetSlot(temporalObj, HOUR);

      var _minute = GetSlot(temporalObj, MINUTE);

      var _second = GetSlot(temporalObj, SECOND);

      var _millisecond = GetSlot(temporalObj, MILLISECOND);

      var _microsecond = GetSlot(temporalObj, MICROSECOND);

      var _nanosecond = GetSlot(temporalObj, NANOSECOND);

      var _calendar3 = GetSlot(temporalObj, CALENDAR);

      if (_calendar3.id !== 'iso8601' && _calendar3.id !== main[CAL_ID]) {
        throw new RangeError("cannot format Date with calendar ".concat(_calendar3.id, " in locale with calendar ").concat(main[CAL_ID]));
      }

      var _datetime4 = temporalObj;

      if (_calendar3.id === 'iso8601') {
        _datetime4 = new DateTime(_isoYear2, _isoMonth3, _isoDay2, _hour, _minute, _second, _millisecond, _microsecond, _nanosecond, main[CAL_ID]);
      }

      return {
        instant: main[TIMEZONE].getInstantFor(_datetime4),
        formatter: main[DATETIME]
      };
    }

    if (ES.IsTemporalInstant(temporalObj)) {
      return {
        instant: temporalObj,
        formatter: main[DATETIME]
      };
    }

    return {};
  }

  var Intl$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    DateTimeFormat: DateTimeFormat
  });

  function toTemporalInstant() {
    // Observable access to valueOf is not correct here, but unavoidable
    var epochNanoseconds = BigInteger(+this).multiply(1e6);
    return new Instant(bigIntIfAvailable$1(epochNanoseconds));
  }

  function bigIntIfAvailable$1(wrapper) {
    return typeof BigInt === 'undefined' ? wrapper : wrapper.value;
  }

  Object.defineProperty(globalThis, 'Temporal', {
    value: {},
    writable: true,
    enumerable: false,
    configurable: true
  });
  copy(globalThis.Temporal, Temporal);
  copy(globalThis.Intl, Intl$1);
  Object.defineProperty(globalThis.Date.prototype, 'toTemporalInstant', {
    value: toTemporalInstant,
    writable: true,
    enumerable: false,
    configurable: true
  });

  function copy(target, source) {
    var _iterator = _createForOfIteratorHelper(Object.getOwnPropertyNames(source)),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var prop = _step.value;
        Object.defineProperty(target, prop, {
          value: source[prop],
          writable: true,
          enumerable: false,
          configurable: true
        });
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }

  exports.Intl = Intl$1;
  exports.Temporal = Temporal;
  exports.toTemporalInstant = toTemporalInstant;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=playground.js.map
