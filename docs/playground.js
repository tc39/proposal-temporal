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

	var shams$1;
	var hasRequiredShams$1;

	function requireShams$1 () {
		if (hasRequiredShams$1) return shams$1;
		hasRequiredShams$1 = 1;

		/* eslint complexity: [2, 18], max-statements: [2, 33] */
		shams$1 = function hasSymbols() {
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
		return shams$1;
	}

	var hasSymbols$4;
	var hasRequiredHasSymbols;

	function requireHasSymbols () {
		if (hasRequiredHasSymbols) return hasSymbols$4;
		hasRequiredHasSymbols = 1;

		var origSymbol = typeof Symbol !== 'undefined' && Symbol;
		var hasSymbolSham = requireShams$1();

		hasSymbols$4 = function hasNativeSymbols() {
			if (typeof origSymbol !== 'function') { return false; }
			if (typeof Symbol !== 'function') { return false; }
			if (typeof origSymbol('foo') !== 'symbol') { return false; }
			if (typeof Symbol('bar') !== 'symbol') { return false; }

			return hasSymbolSham();
		};
		return hasSymbols$4;
	}

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
	var $SyntaxError$4 = syntax;
	var $TypeError$t = type;
	var $URIError = uri;

	var $Function = Function;

	// eslint-disable-next-line consistent-return
	var getEvalledConstructor = function (expressionSyntax) {
		try {
			return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
		} catch (e) {}
	};

	var $gOPD$2 = Object.getOwnPropertyDescriptor;
	if ($gOPD$2) {
		try {
			$gOPD$2({}, '');
		} catch (e) {
			$gOPD$2 = null; // this is IE 8, which has a broken gOPD
		}
	}

	var throwTypeError = function () {
		throw new $TypeError$t();
	};
	var ThrowTypeError = $gOPD$2
		? (function () {
			try {
				// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
				arguments.callee; // IE 8 does not throw here
				return throwTypeError;
			} catch (calleeThrows) {
				try {
					// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
					return $gOPD$2(arguments, 'callee').get;
				} catch (gOPDthrows) {
					return throwTypeError;
				}
			}
		}())
		: throwTypeError;

	var hasSymbols$3 = requireHasSymbols()();
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
		'%SyntaxError%': $SyntaxError$4,
		'%ThrowTypeError%': ThrowTypeError,
		'%TypedArray%': TypedArray,
		'%TypeError%': $TypeError$t,
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
	var hasOwn$7 = hasown;
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
			throw new $SyntaxError$4('invalid intrinsic syntax, expected closing `%`');
		} else if (last === '%' && first !== '%') {
			throw new $SyntaxError$4('invalid intrinsic syntax, expected opening `%`');
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
		if (hasOwn$7(LEGACY_ALIASES, intrinsicName)) {
			alias = LEGACY_ALIASES[intrinsicName];
			intrinsicName = '%' + alias[0] + '%';
		}

		if (hasOwn$7(INTRINSICS$1, intrinsicName)) {
			var value = INTRINSICS$1[intrinsicName];
			if (value === needsEval) {
				value = doEval(intrinsicName);
			}
			if (typeof value === 'undefined' && !allowMissing) {
				throw new $TypeError$t('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
			}

			return {
				alias: alias,
				name: intrinsicName,
				value: value
			};
		}

		throw new $SyntaxError$4('intrinsic ' + name + ' does not exist!');
	};

	var getIntrinsic = function GetIntrinsic(name, allowMissing) {
		if (typeof name !== 'string' || name.length === 0) {
			throw new $TypeError$t('intrinsic name must be a non-empty string');
		}
		if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
			throw new $TypeError$t('"allowMissing" argument must be a boolean');
		}

		if ($exec(/^%?[^%]*%?$/, name) === null) {
			throw new $SyntaxError$4('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
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
				throw new $SyntaxError$4('property names with quotes must have matching quotes');
			}
			if (part === 'constructor' || !isOwn) {
				skipFurtherCaching = true;
			}

			intrinsicBaseName += '.' + part;
			intrinsicRealName = '%' + intrinsicBaseName + '%';

			if (hasOwn$7(INTRINSICS$1, intrinsicRealName)) {
				value = INTRINSICS$1[intrinsicRealName];
			} else if (value != null) {
				if (!(part in value)) {
					if (!allowMissing) {
						throw new $TypeError$t('base intrinsic for ' + name + ' exists, but the property is not available.');
					}
					return void undefined$1;
				}
				if ($gOPD$2 && (i + 1) >= parts.length) {
					var desc = $gOPD$2(value, part);
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
					isOwn = hasOwn$7(value, part);
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

	var GetIntrinsic$f = getIntrinsic;

	var $gOPD$1 = GetIntrinsic$f('%Object.getOwnPropertyDescriptor%', true);

	if ($gOPD$1) {
		try {
			$gOPD$1([], 'length');
		} catch (e) {
			// IE 8 has a broken gOPD
			$gOPD$1 = null;
		}
	}

	var gopd$1 = $gOPD$1;

	var $defineProperty$2 = requireEsDefineProperty();

	var $SyntaxError$3 = syntax;
	var $TypeError$s = type;

	var gopd = gopd$1;

	/** @type {import('.')} */
	var defineDataProperty = function defineDataProperty(
		obj,
		property,
		value
	) {
		if (!obj || (typeof obj !== 'object' && typeof obj !== 'function')) {
			throw new $TypeError$s('`obj` must be an object or a function`');
		}
		if (typeof property !== 'string' && typeof property !== 'symbol') {
			throw new $TypeError$s('`property` must be a string or a symbol`');
		}
		if (arguments.length > 3 && typeof arguments[3] !== 'boolean' && arguments[3] !== null) {
			throw new $TypeError$s('`nonEnumerable`, if provided, must be a boolean or null');
		}
		if (arguments.length > 4 && typeof arguments[4] !== 'boolean' && arguments[4] !== null) {
			throw new $TypeError$s('`nonWritable`, if provided, must be a boolean or null');
		}
		if (arguments.length > 5 && typeof arguments[5] !== 'boolean' && arguments[5] !== null) {
			throw new $TypeError$s('`nonConfigurable`, if provided, must be a boolean or null');
		}
		if (arguments.length > 6 && typeof arguments[6] !== 'boolean') {
			throw new $TypeError$s('`loose`, if provided, must be a boolean');
		}

		var nonEnumerable = arguments.length > 3 ? arguments[3] : null;
		var nonWritable = arguments.length > 4 ? arguments[4] : null;
		var nonConfigurable = arguments.length > 5 ? arguments[5] : null;
		var loose = arguments.length > 6 ? arguments[6] : false;

		/* @type {false | TypedPropertyDescriptor<unknown>} */
		var desc = !!gopd && gopd(obj, property);

		if ($defineProperty$2) {
			$defineProperty$2(obj, property, {
				configurable: nonConfigurable === null && desc ? desc.configurable : !nonConfigurable,
				enumerable: nonEnumerable === null && desc ? desc.enumerable : !nonEnumerable,
				value: value,
				writable: nonWritable === null && desc ? desc.writable : !nonWritable
			});
		} else if (loose || (!nonEnumerable && !nonWritable && !nonConfigurable)) {
			// must fall back to [[Set]], and was not explicitly asked to make non-enumerable, non-writable, or non-configurable
			obj[property] = value; // eslint-disable-line no-param-reassign
		} else {
			throw new $SyntaxError$3('This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.');
		}
	};

	var $defineProperty$1 = requireEsDefineProperty();

	var hasPropertyDescriptors$1 = function hasPropertyDescriptors() {
		return !!$defineProperty$1;
	};

	hasPropertyDescriptors$1.hasArrayLengthDefineBug = function hasArrayLengthDefineBug() {
		// node v0.6 has a bug where array lengths can be Set but not Defined
		if (!$defineProperty$1) {
			return null;
		}
		try {
			return $defineProperty$1([], 'length', { value: 1 }).length !== 1;
		} catch (e) {
			// In Firefox 4-22, defining length on an array throws an exception.
			return true;
		}
	};

	var hasPropertyDescriptors_1 = hasPropertyDescriptors$1;

	var GetIntrinsic$e = getIntrinsic;
	var define = defineDataProperty;
	var hasDescriptors = hasPropertyDescriptors_1();
	var gOPD = gopd$1;

	var $TypeError$r = type;
	var $floor$3 = GetIntrinsic$e('%Math.floor%');

	/** @type {import('.')} */
	var setFunctionLength = function setFunctionLength(fn, length) {
		if (typeof fn !== 'function') {
			throw new $TypeError$r('`fn` is not a function');
		}
		if (typeof length !== 'number' || length < 0 || length > 0xFFFFFFFF || $floor$3(length) !== length) {
			throw new $TypeError$r('`length` must be a positive 32-bit integer');
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

	var GetIntrinsic$d = getIntrinsic;

	var callBind$1 = callBindExports;

	var $indexOf = callBind$1(GetIntrinsic$d('String.prototype.indexOf'));

	var callBound$4 = function callBoundIntrinsic(name, allowMissing) {
		var intrinsic = GetIntrinsic$d(name, !!allowMissing);
		if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
			return callBind$1(intrinsic);
		}
		return intrinsic;
	};

	var callBound$5 = /*@__PURE__*/getDefaultExportFromCjs(callBound$4);

	var GetIntrinsic$c = getIntrinsic;

	var $Array = GetIntrinsic$c('%Array%');

	// eslint-disable-next-line global-require
	var toStr$4 = !$Array.isArray && callBound$4('Object.prototype.toString');

	var IsArray$5 = $Array.isArray || function IsArray(argument) {
		return toStr$4(argument) === '[object Array]';
	};

	// https://262.ecma-international.org/6.0/#sec-isarray
	var IsArray$3 = IsArray$5;

	var IsArray$4 = /*@__PURE__*/getDefaultExportFromCjs(IsArray$3);

	var GetIntrinsic$b = getIntrinsic;
	var callBound$3 = callBound$4;

	var $TypeError$q = type;

	var IsArray$2 = IsArray$3;

	var $apply = GetIntrinsic$b('%Reflect.apply%', true) || callBound$3('Function.prototype.apply');

	// https://262.ecma-international.org/6.0/#sec-call

	var Call$3 = function Call(F, V) {
		var argumentsList = arguments.length > 2 ? arguments[2] : [];
		if (!IsArray$2(argumentsList)) {
			throw new $TypeError$q('Assertion failed: optional `argumentsList`, if provided, must be a List');
		}
		return $apply(F, V, argumentsList);
	};

	var Call$4 = /*@__PURE__*/getDefaultExportFromCjs(Call$3);

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

	var isArray$3 = Array.isArray || function (arr) {
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

	    if (obj.type === 'Buffer' && isArray$3(obj.data)) {
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
	  if (!isArray$3(list)) {
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
	  if (!isString$2(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect$5(arguments[i]));
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
	      str += ' ' + inspect$5(x);
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
	function inspect$5(obj, opts) {
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
	inspect$5.colors = {
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
	inspect$5.styles = {
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
	  var style = inspect$5.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect$5.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect$5.colors[style][1] + 'm';
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
	      value.inspect !== inspect$5 &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString$2(ret)) {
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
	  if (isArray$2(value)) {
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
	  if (isString$2(value)) {
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
	function isArray$2(ar) {
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

	function isString$2(arg) {
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

	function isPrimitive$5(arg) {
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
	  isPrimitive: isPrimitive$5,
	  isFunction: isFunction,
	  isError: isError$1,
	  isDate: isDate$2,
	  isObject: isObject,
	  isRegExp: isRegExp$1,
	  isUndefined: isUndefined,
	  isSymbol: isSymbol$3,
	  isString: isString$2,
	  isNumber: isNumber$1,
	  isNullOrUndefined: isNullOrUndefined,
	  isNull: isNull,
	  isBoolean: isBoolean$1,
	  isArray: isArray$2,
	  inspect: inspect$5,
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
		inspect: inspect$5,
		isArray: isArray$2,
		isBoolean: isBoolean$1,
		isBuffer: isBuffer,
		isDate: isDate$2,
		isError: isError$1,
		isFunction: isFunction,
		isNull: isNull,
		isNullOrUndefined: isNullOrUndefined,
		isNumber: isNumber$1,
		isObject: isObject,
		isPrimitive: isPrimitive$5,
		isRegExp: isRegExp$1,
		isString: isString$2,
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
	var $floor$2 = Math.floor;
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
	        var int = num < 0 ? -$floor$2(-num) : $floor$2(num); // trunc(num)
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
	        return isArray$1(obj) ? '[Array]' : '[Object]';
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
	    if (isArray$1(obj)) {
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
	    if (isString$1(obj)) {
	        return markBoxed(inspect(String(obj)));
	    }
	    // note: in IE 8, sometimes `global !== window` but both are the prototypes of each other
	    /* eslint-env browser */
	    if (typeof window !== 'undefined' && obj === window) {
	        return '{ [object Window] }';
	    }
	    if (obj === commonjsGlobal) {
	        return '{ [object globalThis] }';
	    }
	    if (!isDate$1(obj) && !isRegExp(obj)) {
	        var ys = arrObjKeys(obj, inspect);
	        var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
	        var protoTag = obj instanceof Object ? '' : 'null prototype';
	        var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr$3(obj), 8, -1) : protoTag ? 'Object' : '';
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

	function isArray$1(obj) { return toStr$3(obj) === '[object Array]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
	function isDate$1(obj) { return toStr$3(obj) === '[object Date]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
	function isRegExp(obj) { return toStr$3(obj) === '[object RegExp]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
	function isError(obj) { return toStr$3(obj) === '[object Error]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
	function isString$1(obj) { return toStr$3(obj) === '[object String]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
	function isNumber(obj) { return toStr$3(obj) === '[object Number]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
	function isBoolean(obj) { return toStr$3(obj) === '[object Boolean]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }

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

	var hasOwn$6 = Object.prototype.hasOwnProperty || function (key) { return key in this; };
	function has(obj, key) {
	    return hasOwn$6.call(obj, key);
	}

	function toStr$3(obj) {
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
	    var isArr = isArray$1(obj);
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

	var GetIntrinsic$a = getIntrinsic;
	var callBound$2 = callBound$4;
	var inspect$4 = objectInspect;

	var $TypeError$p = type;
	var $WeakMap = GetIntrinsic$a('%WeakMap%', true);
	var $Map = GetIntrinsic$a('%Map%', true);

	var $weakMapGet = callBound$2('WeakMap.prototype.get', true);
	var $weakMapSet = callBound$2('WeakMap.prototype.set', true);
	var $weakMapHas = callBound$2('WeakMap.prototype.has', true);
	var $mapGet = callBound$2('Map.prototype.get', true);
	var $mapSet = callBound$2('Map.prototype.set', true);
	var $mapHas = callBound$2('Map.prototype.has', true);

	/*
	* This function traverses the list returning the node corresponding to the given key.
	*
	* That node is also moved to the head of the list, so that if it's accessed again we don't need to traverse the whole list. By doing so, all the recently used nodes can be accessed relatively quickly.
	*/
	/** @type {import('.').listGetNode} */
	var listGetNode = function (list, key) { // eslint-disable-line consistent-return
		/** @type {typeof list | NonNullable<(typeof list)['next']>} */
		var prev = list;
		/** @type {(typeof list)['next']} */
		var curr;
		for (; (curr = prev.next) !== null; prev = curr) {
			if (curr.key === key) {
				prev.next = curr.next;
				// eslint-disable-next-line no-extra-parens
				curr.next = /** @type {NonNullable<typeof list.next>} */ (list.next);
				list.next = curr; // eslint-disable-line no-param-reassign
				return curr;
			}
		}
	};

	/** @type {import('.').listGet} */
	var listGet = function (objects, key) {
		var node = listGetNode(objects, key);
		return node && node.value;
	};
	/** @type {import('.').listSet} */
	var listSet = function (objects, key, value) {
		var node = listGetNode(objects, key);
		if (node) {
			node.value = value;
		} else {
			// Prepend the new node to the beginning of the list
			objects.next = /** @type {import('.').ListNode<typeof value>} */ ({ // eslint-disable-line no-param-reassign, no-extra-parens
				key: key,
				next: objects.next,
				value: value
			});
		}
	};
	/** @type {import('.').listHas} */
	var listHas = function (objects, key) {
		return !!listGetNode(objects, key);
	};

	/** @type {import('.')} */
	var sideChannel = function getSideChannel() {
		/** @type {WeakMap<object, unknown>} */ var $wm;
		/** @type {Map<object, unknown>} */ var $m;
		/** @type {import('.').RootNode<unknown>} */ var $o;

		/** @type {import('.').Channel} */
		var channel = {
			assert: function (key) {
				if (!channel.has(key)) {
					throw new $TypeError$p('Side channel does not contain ' + inspect$4(key));
				}
			},
			get: function (key) { // eslint-disable-line consistent-return
				if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
					if ($wm) {
						return $weakMapGet($wm, key);
					}
				} else if ($Map) {
					if ($m) {
						return $mapGet($m, key);
					}
				} else {
					if ($o) { // eslint-disable-line no-lonely-if
						return listGet($o, key);
					}
				}
			},
			has: function (key) {
				if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
					if ($wm) {
						return $weakMapHas($wm, key);
					}
				} else if ($Map) {
					if ($m) {
						return $mapHas($m, key);
					}
				} else {
					if ($o) { // eslint-disable-line no-lonely-if
						return listHas($o, key);
					}
				}
				return false;
			},
			set: function (key, value) {
				if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
					if (!$wm) {
						$wm = new $WeakMap();
					}
					$weakMapSet($wm, key, value);
				} else if ($Map) {
					if (!$m) {
						$m = new $Map();
					}
					$mapSet($m, key, value);
				} else {
					if (!$o) {
						// Initialize the linked list as an empty node, so that we don't have to special-case handling of the first node: we can always refer to it as (previous node).next, instead of something like (list).head
						$o = { key: {}, next: null };
					}
					listSet($o, key, value);
				}
			}
		};
		return channel;
	};

	var hasOwn$5 = hasown;
	var channel = sideChannel();

	var $TypeError$o = type;

	var SLOT$1 = {
		assert: function (O, slot) {
			if (!O || (typeof O !== 'object' && typeof O !== 'function')) {
				throw new $TypeError$o('`O` is not an object');
			}
			if (typeof slot !== 'string') {
				throw new $TypeError$o('`slot` must be a string');
			}
			channel.assert(O);
			if (!SLOT$1.has(O, slot)) {
				throw new $TypeError$o('`' + slot + '` is not present on `O`');
			}
		},
		get: function (O, slot) {
			if (!O || (typeof O !== 'object' && typeof O !== 'function')) {
				throw new $TypeError$o('`O` is not an object');
			}
			if (typeof slot !== 'string') {
				throw new $TypeError$o('`slot` must be a string');
			}
			var slots = channel.get(O);
			return slots && slots['$' + slot];
		},
		has: function (O, slot) {
			if (!O || (typeof O !== 'object' && typeof O !== 'function')) {
				throw new $TypeError$o('`O` is not an object');
			}
			if (typeof slot !== 'string') {
				throw new $TypeError$o('`slot` must be a string');
			}
			var slots = channel.get(O);
			return !!slots && hasOwn$5(slots, '$' + slot);
		},
		set: function (O, slot, V) {
			if (!O || (typeof O !== 'object' && typeof O !== 'function')) {
				throw new $TypeError$o('`O` is not an object');
			}
			if (typeof slot !== 'string') {
				throw new $TypeError$o('`slot` must be a string');
			}
			var slots = channel.get(O);
			if (!slots) {
				slots = {};
				channel.set(O, slots);
			}
			slots['$' + slot] = V;
		}
	};

	if (Object.freeze) {
		Object.freeze(SLOT$1);
	}

	var internalSlot = SLOT$1;

	var $SyntaxError$2 = syntax;

	var SLOT = internalSlot;

	// https://262.ecma-international.org/7.0/#sec-completion-record-specification-type

	var CompletionRecord$1 = function CompletionRecord(type, value) {
		if (!(this instanceof CompletionRecord)) {
			return new CompletionRecord(type, value);
		}
		if (type !== 'normal' && type !== 'break' && type !== 'continue' && type !== 'return' && type !== 'throw') {
			throw new $SyntaxError$2('Assertion failed: `type` must be one of "normal", "break", "continue", "return", or "throw"');
		}
		SLOT.set(this, '[[Type]]', type);
		SLOT.set(this, '[[Value]]', value);
		// [[Target]] slot?
	};

	CompletionRecord$1.prototype.type = function Type() {
		return SLOT.get(this, '[[Type]]');
	};

	CompletionRecord$1.prototype.value = function Value() {
		return SLOT.get(this, '[[Value]]');
	};

	CompletionRecord$1.prototype['?'] = function ReturnIfAbrupt() {
		var type = SLOT.get(this, '[[Type]]');
		var value = SLOT.get(this, '[[Value]]');

		if (type === 'normal') {
			return value;
		}
		if (type === 'throw') {
			throw value;
		}
		throw new $SyntaxError$2('Completion Record is not of type "normal" or "throw": other types not supported');
	};

	CompletionRecord$1.prototype['!'] = function assert() {
		var type = SLOT.get(this, '[[Type]]');

		if (type !== 'normal') {
			throw new $SyntaxError$2('Assertion failed: Completion Record is not of type "normal"');
		}
		return SLOT.get(this, '[[Value]]');
	};

	var CompletionRecord_1 = CompletionRecord$1;

	var CompletionRecord$2 = /*@__PURE__*/getDefaultExportFromCjs(CompletionRecord_1);

	// https://262.ecma-international.org/6.0/#sec-ispropertykey

	var IsPropertyKey$9 = function IsPropertyKey(argument) {
		return typeof argument === 'string' || typeof argument === 'symbol';
	};

	var IsPropertyKey$a = /*@__PURE__*/getDefaultExportFromCjs(IsPropertyKey$9);

	var $TypeError$n = type;

	var hasOwn$4 = hasown;

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

	var propertyDescriptor = function isPropertyDescriptor(Desc) {
		if (!Desc || typeof Desc !== 'object') {
			return false;
		}

		for (var key in Desc) { // eslint-disable-line
			if (hasOwn$4(Desc, key) && !allowed[key]) {
				return false;
			}
		}

		var isData = hasOwn$4(Desc, '[[Value]]') || hasOwn$4(Desc, '[[Writable]]');
		var IsAccessor = hasOwn$4(Desc, '[[Get]]') || hasOwn$4(Desc, '[[Set]]');
		if (isData && IsAccessor) {
			throw new $TypeError$n('Property Descriptors may not be both accessor and data descriptors');
		}
		return true;
	};

	var $TypeError$m = type;

	var hasOwn$3 = hasown;

	var isPropertyDescriptor$6 = propertyDescriptor;

	// https://262.ecma-international.org/5.1/#sec-8.10.1

	var IsAccessorDescriptor$3 = function IsAccessorDescriptor(Desc) {
		if (typeof Desc === 'undefined') {
			return false;
		}

		if (!isPropertyDescriptor$6(Desc)) {
			throw new $TypeError$m('Assertion failed: `Desc` must be a Property Descriptor');
		}

		if (!hasOwn$3(Desc, '[[Get]]') && !hasOwn$3(Desc, '[[Set]]')) {
			return false;
		}

		return true;
	};

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

	var GetIntrinsic$9 = getIntrinsic;

	var $preventExtensions = GetIntrinsic$9('%Object.preventExtensions%', true);
	var $isExtensible = GetIntrinsic$9('%Object.isExtensible%', true);

	var isPrimitive$3 = requireIsPrimitive();

	// https://262.ecma-international.org/6.0/#sec-isextensible-o

	var IsExtensible$1 = $preventExtensions
		? function IsExtensible(obj) {
			return !isPrimitive$3(obj) && $isExtensible(obj);
		}
		: function IsExtensible(obj) {
			return !isPrimitive$3(obj);
		};

	// https://262.ecma-international.org/5.1/#sec-8

	var Type$e = function Type(x) {
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

	var ES5Type = Type$e;

	// https://262.ecma-international.org/11.0/#sec-ecmascript-data-types-and-values

	var Type$c = function Type(x) {
		if (typeof x === 'symbol') {
			return 'Symbol';
		}
		if (typeof x === 'bigint') {
			return 'BigInt';
		}
		return ES5Type(x);
	};

	var Type$d = /*@__PURE__*/getDefaultExportFromCjs(Type$c);

	// http://262.ecma-international.org/5.1/#sec-9.2

	var ToBoolean$2 = function ToBoolean(value) { return !!value; };

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
	var toStr$2 = Object.prototype.toString;
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
		if (toStr$2.call(all) === toStr$2.call(document.all)) {
			isDDA = function isDocumentDotAll(value) {
				/* globals document: false */
				// in IE 6-8, typeof document.all is "object" and it's truthy
				if ((isIE68 || !value) && (typeof value === 'undefined' || typeof value === 'object')) {
					try {
						var str = toStr$2.call(value);
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
			var strClass = toStr$2.call(value);
			if (strClass !== fnClass && strClass !== genClass && !(/^\[object HTML/).test(strClass)) { return false; }
			return tryFunctionObject(value);
		};

	// http://262.ecma-international.org/5.1/#sec-9.11

	var IsCallable$3 = isCallable$1;

	var hasOwn$2 = hasown;

	var $TypeError$l = type;

	var Type$b = Type$c;
	var ToBoolean$1 = ToBoolean$2;
	var IsCallable$2 = IsCallable$3;

	// https://262.ecma-international.org/5.1/#sec-8.10.5

	var ToPropertyDescriptor$1 = function ToPropertyDescriptor(Obj) {
		if (Type$b(Obj) !== 'Object') {
			throw new $TypeError$l('ToPropertyDescriptor requires an object');
		}

		var desc = {};
		if (hasOwn$2(Obj, 'enumerable')) {
			desc['[[Enumerable]]'] = ToBoolean$1(Obj.enumerable);
		}
		if (hasOwn$2(Obj, 'configurable')) {
			desc['[[Configurable]]'] = ToBoolean$1(Obj.configurable);
		}
		if (hasOwn$2(Obj, 'value')) {
			desc['[[Value]]'] = Obj.value;
		}
		if (hasOwn$2(Obj, 'writable')) {
			desc['[[Writable]]'] = ToBoolean$1(Obj.writable);
		}
		if (hasOwn$2(Obj, 'get')) {
			var getter = Obj.get;
			if (typeof getter !== 'undefined' && !IsCallable$2(getter)) {
				throw new $TypeError$l('getter must be a function');
			}
			desc['[[Get]]'] = getter;
		}
		if (hasOwn$2(Obj, 'set')) {
			var setter = Obj.set;
			if (typeof setter !== 'undefined' && !IsCallable$2(setter)) {
				throw new $TypeError$l('setter must be a function');
			}
			desc['[[Set]]'] = setter;
		}

		if ((hasOwn$2(desc, '[[Get]]') || hasOwn$2(desc, '[[Set]]')) && (hasOwn$2(desc, '[[Value]]') || hasOwn$2(desc, '[[Writable]]'))) {
			throw new $TypeError$l('Invalid property descriptor. Cannot both specify accessors and a value or writable attribute');
		}
		return desc;
	};

	var _isNaN = Number.isNaN || function isNaN(a) {
		return a !== a;
	};

	var $isNaN$3 = _isNaN;

	// http://262.ecma-international.org/5.1/#sec-9.12

	var SameValue$2 = function SameValue(x, y) {
		if (x === y) { // 0 === -0, but they are not identical.
			if (x === 0) { return 1 / x === 1 / y; }
			return true;
		}
		return $isNaN$3(x) && $isNaN$3(y);
	};

	var SameValue$3 = /*@__PURE__*/getDefaultExportFromCjs(SameValue$2);

	var hasPropertyDescriptors = hasPropertyDescriptors_1;

	var $defineProperty = requireEsDefineProperty();

	var hasArrayLengthDefineBug = hasPropertyDescriptors.hasArrayLengthDefineBug();

	// eslint-disable-next-line global-require
	var isArray = hasArrayLengthDefineBug && IsArray$5;

	var callBound$1 = callBound$4;

	var $isEnumerable$1 = callBound$1('Object.prototype.propertyIsEnumerable');

	// eslint-disable-next-line max-params
	var DefineOwnProperty$1 = function DefineOwnProperty(IsDataDescriptor, SameValue, FromPropertyDescriptor, O, P, desc) {
		if (!$defineProperty) {
			if (!IsDataDescriptor(desc)) {
				// ES3 does not support getters/setters
				return false;
			}
			if (!desc['[[Configurable]]'] || !desc['[[Writable]]']) {
				return false;
			}

			// fallback for ES3
			if (P in O && $isEnumerable$1(O, P) !== !!desc['[[Enumerable]]']) {
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

	var isPropertyDescriptor$5 = propertyDescriptor;

	var isFullyPopulatedPropertyDescriptor$1 = function isFullyPopulatedPropertyDescriptor(ES, Desc) {
		return isPropertyDescriptor$5(Desc)
			&& typeof Desc === 'object'
			&& '[[Enumerable]]' in Desc
			&& '[[Configurable]]' in Desc
			&& (ES.IsAccessorDescriptor(Desc) || ES.IsDataDescriptor(Desc));
	};

	var fromPropertyDescriptor$1 = function fromPropertyDescriptor(Desc) {
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

	var $TypeError$k = type;

	var isPropertyDescriptor$4 = propertyDescriptor;
	var fromPropertyDescriptor = fromPropertyDescriptor$1;

	// https://262.ecma-international.org/6.0/#sec-frompropertydescriptor

	var FromPropertyDescriptor$1 = function FromPropertyDescriptor(Desc) {
		if (typeof Desc !== 'undefined' && !isPropertyDescriptor$4(Desc)) {
			throw new $TypeError$k('Assertion failed: `Desc` must be a Property Descriptor');
		}

		return fromPropertyDescriptor(Desc);
	};

	var $TypeError$j = type;

	var hasOwn$1 = hasown;

	var isPropertyDescriptor$3 = propertyDescriptor;

	// https://262.ecma-international.org/5.1/#sec-8.10.2

	var IsDataDescriptor$2 = function IsDataDescriptor(Desc) {
		if (typeof Desc === 'undefined') {
			return false;
		}

		if (!isPropertyDescriptor$3(Desc)) {
			throw new $TypeError$j('Assertion failed: `Desc` must be a Property Descriptor');
		}

		if (!hasOwn$1(Desc, '[[Value]]') && !hasOwn$1(Desc, '[[Writable]]')) {
			return false;
		}

		return true;
	};

	var $TypeError$i = type;

	var IsAccessorDescriptor$2 = IsAccessorDescriptor$3;
	var IsDataDescriptor$1 = IsDataDescriptor$2;

	var isPropertyDescriptor$2 = propertyDescriptor;

	// https://262.ecma-international.org/6.0/#sec-isgenericdescriptor

	var IsGenericDescriptor$1 = function IsGenericDescriptor(Desc) {
		if (typeof Desc === 'undefined') {
			return false;
		}

		if (!isPropertyDescriptor$2(Desc)) {
			throw new $TypeError$i('Assertion failed: `Desc` must be a Property Descriptor');
		}

		if (!IsAccessorDescriptor$2(Desc) && !IsDataDescriptor$1(Desc)) {
			return true;
		}

		return false;
	};

	var $TypeError$h = type;

	var DefineOwnProperty = DefineOwnProperty$1;
	var isFullyPopulatedPropertyDescriptor = isFullyPopulatedPropertyDescriptor$1;
	var isPropertyDescriptor$1 = propertyDescriptor;

	var FromPropertyDescriptor = FromPropertyDescriptor$1;
	var IsAccessorDescriptor$1 = IsAccessorDescriptor$3;
	var IsDataDescriptor = IsDataDescriptor$2;
	var IsGenericDescriptor = IsGenericDescriptor$1;
	var IsPropertyKey$8 = IsPropertyKey$9;
	var SameValue$1 = SameValue$2;
	var Type$a = Type$c;

	// https://262.ecma-international.org/13.0/#sec-validateandapplypropertydescriptor

	// see https://github.com/tc39/ecma262/pull/2468 for ES2022 changes

	// eslint-disable-next-line max-lines-per-function, max-statements
	var ValidateAndApplyPropertyDescriptor$1 = function ValidateAndApplyPropertyDescriptor(O, P, extensible, Desc, current) {
		var oType = Type$a(O);
		if (oType !== 'Undefined' && oType !== 'Object') {
			throw new $TypeError$h('Assertion failed: O must be undefined or an Object');
		}
		if (!IsPropertyKey$8(P)) {
			throw new $TypeError$h('Assertion failed: P must be a Property Key');
		}
		if (typeof extensible !== 'boolean') {
			throw new $TypeError$h('Assertion failed: extensible must be a Boolean');
		}
		if (!isPropertyDescriptor$1(Desc)) {
			throw new $TypeError$h('Assertion failed: Desc must be a Property Descriptor');
		}
		if (typeof current !== 'undefined' && !isPropertyDescriptor$1(current)) {
			throw new $TypeError$h('Assertion failed: current must be a Property Descriptor, or undefined');
		}

		if (typeof current === 'undefined') { // step 2
			if (!extensible) {
				return false; // step 2.a
			}
			if (oType === 'Undefined') {
				return true; // step 2.b
			}
			if (IsAccessorDescriptor$1(Desc)) { // step 2.c
				return DefineOwnProperty(
					IsDataDescriptor,
					SameValue$1,
					FromPropertyDescriptor,
					O,
					P,
					Desc
				);
			}
			// step 2.d
			return DefineOwnProperty(
				IsDataDescriptor,
				SameValue$1,
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
					IsAccessorDescriptor: IsAccessorDescriptor$1,
					IsDataDescriptor: IsDataDescriptor
				},
				current
			)
		) {
			throw new $TypeError$h('`current`, when present, must be a fully populated and valid Property Descriptor');
		}

		// 4. If every field in Desc is absent, return true.
		// this can't really match the assertion that it's a Property Descriptor in our JS implementation

		// 5. If current.[[Configurable]] is false, then
		if (!current['[[Configurable]]']) {
			if ('[[Configurable]]' in Desc && Desc['[[Configurable]]']) {
				// step 5.a
				return false;
			}
			if ('[[Enumerable]]' in Desc && !SameValue$1(Desc['[[Enumerable]]'], current['[[Enumerable]]'])) {
				// step 5.b
				return false;
			}
			if (!IsGenericDescriptor(Desc) && !SameValue$1(IsAccessorDescriptor$1(Desc), IsAccessorDescriptor$1(current))) {
				// step 5.c
				return false;
			}
			if (IsAccessorDescriptor$1(current)) { // step 5.d
				if ('[[Get]]' in Desc && !SameValue$1(Desc['[[Get]]'], current['[[Get]]'])) {
					return false;
				}
				if ('[[Set]]' in Desc && !SameValue$1(Desc['[[Set]]'], current['[[Set]]'])) {
					return false;
				}
			} else if (!current['[[Writable]]']) { // step 5.e
				if ('[[Writable]]' in Desc && Desc['[[Writable]]']) {
					return false;
				}
				if ('[[Value]]' in Desc && !SameValue$1(Desc['[[Value]]'], current['[[Value]]'])) {
					return false;
				}
			}
		}

		// 6. If O is not undefined, then
		if (oType !== 'Undefined') {
			var configurable;
			var enumerable;
			if (IsDataDescriptor(current) && IsAccessorDescriptor$1(Desc)) { // step 6.a
				configurable = ('[[Configurable]]' in Desc ? Desc : current)['[[Configurable]]'];
				enumerable = ('[[Enumerable]]' in Desc ? Desc : current)['[[Enumerable]]'];
				// Replace the property named P of object O with an accessor property having [[Configurable]] and [[Enumerable]] attributes as described by current and each other attribute set to its default value.
				return DefineOwnProperty(
					IsDataDescriptor,
					SameValue$1,
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
			} else if (IsAccessorDescriptor$1(current) && IsDataDescriptor(Desc)) {
				configurable = ('[[Configurable]]' in Desc ? Desc : current)['[[Configurable]]'];
				enumerable = ('[[Enumerable]]' in Desc ? Desc : current)['[[Enumerable]]'];
				// i. Replace the property named P of object O with a data property having [[Configurable]] and [[Enumerable]] attributes as described by current and each other attribute set to its default value.
				return DefineOwnProperty(
					IsDataDescriptor,
					SameValue$1,
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
				SameValue$1,
				FromPropertyDescriptor,
				O,
				P,
				Desc
			);
		}

		return true; // step 7
	};

	var $gOPD = gopd$1;
	var $SyntaxError$1 = syntax;
	var $TypeError$g = type;

	var isPropertyDescriptor = propertyDescriptor;

	var IsAccessorDescriptor = IsAccessorDescriptor$3;
	var IsExtensible = IsExtensible$1;
	var IsPropertyKey$7 = IsPropertyKey$9;
	var ToPropertyDescriptor = ToPropertyDescriptor$1;
	var SameValue = SameValue$2;
	var Type$9 = Type$c;
	var ValidateAndApplyPropertyDescriptor = ValidateAndApplyPropertyDescriptor$1;

	// https://262.ecma-international.org/6.0/#sec-ordinarydefineownproperty

	var OrdinaryDefineOwnProperty$1 = function OrdinaryDefineOwnProperty(O, P, Desc) {
		if (Type$9(O) !== 'Object') {
			throw new $TypeError$g('Assertion failed: O must be an Object');
		}
		if (!IsPropertyKey$7(P)) {
			throw new $TypeError$g('Assertion failed: P must be a Property Key');
		}
		if (!isPropertyDescriptor(Desc)) {
			throw new $TypeError$g('Assertion failed: Desc must be a Property Descriptor');
		}
		if (!$gOPD) {
			// ES3/IE 8 fallback
			if (IsAccessorDescriptor(Desc)) {
				throw new $SyntaxError$1('This environment does not support accessor property descriptors.');
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
			throw new $SyntaxError$1('This environment does not support defining non-writable, non-enumerable, or non-configurable properties');
		}
		var desc = $gOPD(O, P);
		var current = desc && ToPropertyDescriptor(desc);
		var extensible = IsExtensible(O);
		return ValidateAndApplyPropertyDescriptor(O, P, extensible, Desc, current);
	};

	var $TypeError$f = type;

	var IsPropertyKey$6 = IsPropertyKey$9;
	var OrdinaryDefineOwnProperty = OrdinaryDefineOwnProperty$1;
	var Type$8 = Type$c;

	// https://262.ecma-international.org/6.0/#sec-createdataproperty

	var CreateDataProperty$1 = function CreateDataProperty(O, P, V) {
		if (Type$8(O) !== 'Object') {
			throw new $TypeError$f('Assertion failed: Type(O) is not Object');
		}
		if (!IsPropertyKey$6(P)) {
			throw new $TypeError$f('Assertion failed: IsPropertyKey(P) is not true');
		}
		var newDesc = {
			'[[Configurable]]': true,
			'[[Enumerable]]': true,
			'[[Value]]': V,
			'[[Writable]]': true
		};
		return OrdinaryDefineOwnProperty(O, P, newDesc);
	};

	var $TypeError$e = type;

	var CreateDataProperty = CreateDataProperty$1;
	var IsPropertyKey$5 = IsPropertyKey$9;
	var Type$7 = Type$c;

	// // https://262.ecma-international.org/6.0/#sec-createdatapropertyorthrow

	var CreateDataPropertyOrThrow = function CreateDataPropertyOrThrow(O, P, V) {
		if (Type$7(O) !== 'Object') {
			throw new $TypeError$e('Assertion failed: Type(O) is not Object');
		}
		if (!IsPropertyKey$5(P)) {
			throw new $TypeError$e('Assertion failed: IsPropertyKey(P) is not true');
		}
		var success = CreateDataProperty(O, P, V);
		if (!success) {
			throw new $TypeError$e('unable to create data property');
		}
		return success;
	};

	var CreateDataPropertyOrThrow$1 = /*@__PURE__*/getDefaultExportFromCjs(CreateDataPropertyOrThrow);

	var $TypeError$d = type;

	var inspect$3 = objectInspect;

	var IsPropertyKey$4 = IsPropertyKey$9;
	var Type$6 = Type$c;

	// https://262.ecma-international.org/6.0/#sec-get-o-p

	var Get$2 = function Get(O, P) {
		// 7.3.1.1
		if (Type$6(O) !== 'Object') {
			throw new $TypeError$d('Assertion failed: Type(O) is not Object');
		}
		// 7.3.1.2
		if (!IsPropertyKey$4(P)) {
			throw new $TypeError$d('Assertion failed: IsPropertyKey(P) is not true, got ' + inspect$3(P));
		}
		// 7.3.1.3
		return O[P];
	};

	var Get$3 = /*@__PURE__*/getDefaultExportFromCjs(Get$2);

	var shams;
	var hasRequiredShams;

	function requireShams () {
		if (hasRequiredShams) return shams;
		hasRequiredShams = 1;

		var hasSymbols = requireShams$1();

		/** @type {import('.')} */
		shams = function hasToStringTagShams() {
			return hasSymbols() && !!Symbol.toStringTag;
		};
		return shams;
	}

	var isString;
	var hasRequiredIsString;

	function requireIsString () {
		if (hasRequiredIsString) return isString;
		hasRequiredIsString = 1;

		var strValue = String.prototype.valueOf;
		var tryStringObject = function tryStringObject(value) {
			try {
				strValue.call(value);
				return true;
			} catch (e) {
				return false;
			}
		};
		var toStr = Object.prototype.toString;
		var strClass = '[object String]';
		var hasToStringTag = requireShams()();

		isString = function isString(value) {
			if (typeof value === 'string') {
				return true;
			}
			if (typeof value !== 'object') {
				return false;
			}
			return hasToStringTag ? tryStringObject(value) : toStr.call(value) === strClass;
		};
		return isString;
	}

	var getIteratorMethod$1;
	var hasRequiredGetIteratorMethod;

	function requireGetIteratorMethod () {
		if (hasRequiredGetIteratorMethod) return getIteratorMethod$1;
		hasRequiredGetIteratorMethod = 1;

		var hasSymbols = requireHasSymbols()();
		var GetIntrinsic = getIntrinsic;
		var callBound = callBound$4;
		var isString = requireIsString();

		var $iterator = GetIntrinsic('%Symbol.iterator%', true);
		var $stringSlice = callBound('String.prototype.slice');
		var $String = GetIntrinsic('%String%');

		getIteratorMethod$1 = function getIteratorMethod(ES, iterable) {
			var usingIterator;
			if (hasSymbols) {
				usingIterator = ES.GetMethod(iterable, $iterator);
			} else if (ES.IsArray(iterable)) {
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
			} else if (isString(iterable)) {
				usingIterator = function () {
					var i = 0;
					return {
						next: function () {
							var nextIndex = ES.AdvanceStringIndex($String(iterable), i, true);
							var value = $stringSlice(iterable, i, nextIndex);
							i = nextIndex;
							return {
								done: nextIndex > iterable.length,
								value: value
							};
						}
					};
				};
			}
			return usingIterator;
		};
		return getIteratorMethod$1;
	}

	var isLeadingSurrogate;
	var hasRequiredIsLeadingSurrogate;

	function requireIsLeadingSurrogate () {
		if (hasRequiredIsLeadingSurrogate) return isLeadingSurrogate;
		hasRequiredIsLeadingSurrogate = 1;

		isLeadingSurrogate = function isLeadingSurrogate(charCode) {
			return typeof charCode === 'number' && charCode >= 0xD800 && charCode <= 0xDBFF;
		};
		return isLeadingSurrogate;
	}

	var isTrailingSurrogate;
	var hasRequiredIsTrailingSurrogate;

	function requireIsTrailingSurrogate () {
		if (hasRequiredIsTrailingSurrogate) return isTrailingSurrogate;
		hasRequiredIsTrailingSurrogate = 1;

		isTrailingSurrogate = function isTrailingSurrogate(charCode) {
			return typeof charCode === 'number' && charCode >= 0xDC00 && charCode <= 0xDFFF;
		};
		return isTrailingSurrogate;
	}

	var UTF16SurrogatePairToCodePoint;
	var hasRequiredUTF16SurrogatePairToCodePoint;

	function requireUTF16SurrogatePairToCodePoint () {
		if (hasRequiredUTF16SurrogatePairToCodePoint) return UTF16SurrogatePairToCodePoint;
		hasRequiredUTF16SurrogatePairToCodePoint = 1;

		var GetIntrinsic = getIntrinsic;

		var $TypeError = type;
		var $fromCharCode = GetIntrinsic('%String.fromCharCode%');

		var isLeadingSurrogate = requireIsLeadingSurrogate();
		var isTrailingSurrogate = requireIsTrailingSurrogate();

		// https://tc39.es/ecma262/2020/#sec-utf16decodesurrogatepair

		UTF16SurrogatePairToCodePoint = function UTF16SurrogatePairToCodePoint(lead, trail) {
			if (!isLeadingSurrogate(lead) || !isTrailingSurrogate(trail)) {
				throw new $TypeError('Assertion failed: `lead` must be a leading surrogate char code, and `trail` must be a trailing surrogate char code');
			}
			// var cp = (lead - 0xD800) * 0x400 + (trail - 0xDC00) + 0x10000;
			return $fromCharCode(lead) + $fromCharCode(trail);
		};
		return UTF16SurrogatePairToCodePoint;
	}

	var CodePointAt;
	var hasRequiredCodePointAt;

	function requireCodePointAt () {
		if (hasRequiredCodePointAt) return CodePointAt;
		hasRequiredCodePointAt = 1;

		var $TypeError = type;
		var callBound = callBound$4;
		var isLeadingSurrogate = requireIsLeadingSurrogate();
		var isTrailingSurrogate = requireIsTrailingSurrogate();

		var UTF16SurrogatePairToCodePoint = requireUTF16SurrogatePairToCodePoint();

		var $charAt = callBound('String.prototype.charAt');
		var $charCodeAt = callBound('String.prototype.charCodeAt');

		// https://262.ecma-international.org/12.0/#sec-codepointat

		CodePointAt = function CodePointAt(string, position) {
			if (typeof string !== 'string') {
				throw new $TypeError('Assertion failed: `string` must be a String');
			}
			var size = string.length;
			if (position < 0 || position >= size) {
				throw new $TypeError('Assertion failed: `position` must be >= 0, and < the length of `string`');
			}
			var first = $charCodeAt(string, position);
			var cp = $charAt(string, position);
			var firstIsLeading = isLeadingSurrogate(first);
			var firstIsTrailing = isTrailingSurrogate(first);
			if (!firstIsLeading && !firstIsTrailing) {
				return {
					'[[CodePoint]]': cp,
					'[[CodeUnitCount]]': 1,
					'[[IsUnpairedSurrogate]]': false
				};
			}
			if (firstIsTrailing || (position + 1 === size)) {
				return {
					'[[CodePoint]]': cp,
					'[[CodeUnitCount]]': 1,
					'[[IsUnpairedSurrogate]]': true
				};
			}
			var second = $charCodeAt(string, position + 1);
			if (!isTrailingSurrogate(second)) {
				return {
					'[[CodePoint]]': cp,
					'[[CodeUnitCount]]': 1,
					'[[IsUnpairedSurrogate]]': true
				};
			}

			return {
				'[[CodePoint]]': UTF16SurrogatePairToCodePoint(first, second),
				'[[CodeUnitCount]]': 2,
				'[[IsUnpairedSurrogate]]': false
			};
		};
		return CodePointAt;
	}

	var $isNaN$2 = _isNaN;

	var _isFinite = function (x) { return (typeof x === 'number' || typeof x === 'bigint') && !$isNaN$2(x) && x !== Infinity && x !== -Infinity; };

	var GetIntrinsic$8 = getIntrinsic;

	var $abs$1 = GetIntrinsic$8('%Math.abs%');
	var $floor$1 = GetIntrinsic$8('%Math.floor%');

	var $isNaN$1 = _isNaN;
	var $isFinite$1 = _isFinite;

	var isInteger$2 = function isInteger(argument) {
		if (typeof argument !== 'number' || $isNaN$1(argument) || !$isFinite$1(argument)) {
			return false;
		}
		var absValue = $abs$1(argument);
		return $floor$1(absValue) === absValue;
	};

	var maxSafeInteger;
	var hasRequiredMaxSafeInteger;

	function requireMaxSafeInteger () {
		if (hasRequiredMaxSafeInteger) return maxSafeInteger;
		hasRequiredMaxSafeInteger = 1;

		maxSafeInteger = Number.MAX_SAFE_INTEGER || 9007199254740991; // Math.pow(2, 53) - 1;
		return maxSafeInteger;
	}

	var AdvanceStringIndex$1;
	var hasRequiredAdvanceStringIndex;

	function requireAdvanceStringIndex () {
		if (hasRequiredAdvanceStringIndex) return AdvanceStringIndex$1;
		hasRequiredAdvanceStringIndex = 1;

		var CodePointAt = requireCodePointAt();

		var isInteger = isInteger$2;
		var MAX_SAFE_INTEGER = requireMaxSafeInteger();

		var $TypeError = type;

		// https://262.ecma-international.org/12.0/#sec-advancestringindex

		AdvanceStringIndex$1 = function AdvanceStringIndex(S, index, unicode) {
			if (typeof S !== 'string') {
				throw new $TypeError('Assertion failed: `S` must be a String');
			}
			if (!isInteger(index) || index < 0 || index > MAX_SAFE_INTEGER) {
				throw new $TypeError('Assertion failed: `length` must be an integer >= 0 and <= 2**53');
			}
			if (typeof unicode !== 'boolean') {
				throw new $TypeError('Assertion failed: `unicode` must be a Boolean');
			}
			if (!unicode) {
				return index + 1;
			}
			var length = S.length;
			if ((index + 1) >= length) {
				return index + 1;
			}
			var cp = CodePointAt(S, index);
			return index + cp['[[CodeUnitCount]]'];
		};
		return AdvanceStringIndex$1;
	}

	var $TypeError$c = type;

	var inspect$2 = objectInspect;

	var IsPropertyKey$3 = IsPropertyKey$9;
	// var ToObject = require('./ToObject');

	// https://262.ecma-international.org/6.0/#sec-getv

	var GetV$2 = function GetV(V, P) {
		// 7.3.2.1
		if (!IsPropertyKey$3(P)) {
			throw new $TypeError$c('Assertion failed: IsPropertyKey(P) is not true, got ' + inspect$2(P));
		}

		// 7.3.2.2-3
		// var O = ToObject(V);

		// 7.3.2.4
		return V[P];
	};

	var $TypeError$b = type;

	var GetV$1 = GetV$2;
	var IsCallable$1 = IsCallable$3;
	var IsPropertyKey$2 = IsPropertyKey$9;

	var inspect$1 = objectInspect;

	// https://262.ecma-international.org/6.0/#sec-getmethod

	var GetMethod$3 = function GetMethod(O, P) {
		// 7.3.9.1
		if (!IsPropertyKey$2(P)) {
			throw new $TypeError$b('Assertion failed: IsPropertyKey(P) is not true');
		}

		// 7.3.9.2
		var func = GetV$1(O, P);

		// 7.3.9.4
		if (func == null) {
			return void 0;
		}

		// 7.3.9.5
		if (!IsCallable$1(func)) {
			throw new $TypeError$b(inspect$1(P) + ' is not a function: ' + inspect$1(func));
		}

		// 7.3.9.6
		return func;
	};

	var GetMethod$4 = /*@__PURE__*/getDefaultExportFromCjs(GetMethod$3);

	var GetIntrinsic$7 = getIntrinsic;

	var $TypeError$a = type;
	var $SyntaxError = syntax;
	var $asyncIterator = GetIntrinsic$7('%Symbol.asyncIterator%', true);

	var inspect = objectInspect;
	var hasSymbols$2 = requireHasSymbols()();

	var getIteratorMethod = requireGetIteratorMethod();
	var AdvanceStringIndex = requireAdvanceStringIndex();
	var Call$2 = Call$3;
	var GetMethod$2 = GetMethod$3;
	var IsArray$1 = IsArray$3;
	var Type$5 = Type$c;

	// https://262.ecma-international.org/11.0/#sec-getiterator

	var GetIterator = function GetIterator(obj, hint, method) {
		var actualHint = hint;
		if (arguments.length < 2) {
			actualHint = 'sync';
		}
		if (actualHint !== 'sync' && actualHint !== 'async') {
			throw new $TypeError$a("Assertion failed: `hint` must be one of 'sync' or 'async', got " + inspect(hint));
		}

		var actualMethod = method;
		if (arguments.length < 3) {
			if (actualHint === 'async') {
				if (hasSymbols$2 && $asyncIterator) {
					actualMethod = GetMethod$2(obj, $asyncIterator);
				}
				if (actualMethod === undefined) {
					throw new $SyntaxError("async from sync iterators aren't currently supported");
				}
			} else {
				actualMethod = getIteratorMethod(
					{
						AdvanceStringIndex: AdvanceStringIndex,
						GetMethod: GetMethod$2,
						IsArray: IsArray$1
					},
					obj
				);
			}
		}
		var iterator = Call$2(actualMethod, obj);
		if (Type$5(iterator) !== 'Object') {
			throw new $TypeError$a('iterator must return an object');
		}

		return iterator;

		// TODO: This should return an IteratorRecord
		/*
		var nextMethod = GetV(iterator, 'next');
		return {
			'[[Iterator]]': iterator,
			'[[NextMethod]]': nextMethod,
			'[[Done]]': false
		};
		*/
	};

	var GetIterator$1 = /*@__PURE__*/getDefaultExportFromCjs(GetIterator);

	var $TypeError$9 = type;

	var hasOwn = hasown;

	var IsPropertyKey$1 = IsPropertyKey$9;
	var Type$4 = Type$c;

	// https://262.ecma-international.org/6.0/#sec-hasownproperty

	var HasOwnProperty = function HasOwnProperty(O, P) {
		if (Type$4(O) !== 'Object') {
			throw new $TypeError$9('Assertion failed: `O` must be an Object');
		}
		if (!IsPropertyKey$1(P)) {
			throw new $TypeError$9('Assertion failed: `P` must be a Property Key');
		}
		return hasOwn(O, P);
	};

	var HasOwnProperty$1 = /*@__PURE__*/getDefaultExportFromCjs(HasOwnProperty);

	var isInteger$1 = isInteger$2;

	// https://262.ecma-international.org/12.0/#sec-isinteger

	var IsIntegralNumber = function IsIntegralNumber(argument) {
		return isInteger$1(argument);
	};

	var IsIntegralNumber$1 = /*@__PURE__*/getDefaultExportFromCjs(IsIntegralNumber);

	var $TypeError$8 = type;

	var Call$1 = Call$3;
	var CompletionRecord = CompletionRecord_1;
	var GetMethod$1 = GetMethod$3;
	var IsCallable = IsCallable$3;
	var Type$3 = Type$c;

	// https://262.ecma-international.org/6.0/#sec-iteratorclose

	var IteratorClose = function IteratorClose(iterator, completion) {
		if (Type$3(iterator) !== 'Object') {
			throw new $TypeError$8('Assertion failed: Type(iterator) is not Object');
		}
		if (!IsCallable(completion) && !(completion instanceof CompletionRecord)) {
			throw new $TypeError$8('Assertion failed: completion is not a thunk representing a Completion Record, nor a Completion Record instance');
		}
		var completionThunk = completion instanceof CompletionRecord ? function () { return completion['?'](); } : completion;

		var iteratorReturn = GetMethod$1(iterator, 'return');

		if (typeof iteratorReturn === 'undefined') {
			return completionThunk();
		}

		var completionRecord;
		try {
			var innerResult = Call$1(iteratorReturn, iterator, []);
		} catch (e) {
			// if we hit here, then "e" is the innerResult completion that needs re-throwing

			// if the completion is of type "throw", this will throw.
			completionThunk();
			completionThunk = null; // ensure it's not called twice.

			// if not, then return the innerResult completion
			throw e;
		}
		completionRecord = completionThunk(); // if innerResult worked, then throw if the completion does
		completionThunk = null; // ensure it's not called twice.

		if (Type$3(innerResult) !== 'Object') {
			throw new $TypeError$8('iterator .return must return an object');
		}

		return completionRecord;
	};

	var IteratorClose$1 = /*@__PURE__*/getDefaultExportFromCjs(IteratorClose);

	var $TypeError$7 = type;

	var Get$1 = Get$2;
	var ToBoolean = ToBoolean$2;
	var Type$2 = Type$c;

	// https://262.ecma-international.org/6.0/#sec-iteratorcomplete

	var IteratorComplete$1 = function IteratorComplete(iterResult) {
		if (Type$2(iterResult) !== 'Object') {
			throw new $TypeError$7('Assertion failed: Type(iterResult) is not Object');
		}
		return ToBoolean(Get$1(iterResult, 'done'));
	};

	var $TypeError$6 = type;

	var Call = Call$3;
	var IsArray = IsArray$3;
	var GetV = GetV$2;
	var IsPropertyKey = IsPropertyKey$9;

	// https://262.ecma-international.org/6.0/#sec-invoke

	var Invoke$1 = function Invoke(O, P) {
		if (!IsPropertyKey(P)) {
			throw new $TypeError$6('Assertion failed: P must be a Property Key');
		}
		var argumentsList = arguments.length > 2 ? arguments[2] : [];
		if (!IsArray(argumentsList)) {
			throw new $TypeError$6('Assertion failed: optional `argumentsList`, if provided, must be a List');
		}
		var func = GetV(O, P);
		return Call(func, O, argumentsList);
	};

	var $TypeError$5 = type;

	var Invoke = Invoke$1;
	var Type$1 = Type$c;

	// https://262.ecma-international.org/6.0/#sec-iteratornext

	var IteratorNext$1 = function IteratorNext(iterator, value) {
		var result = Invoke(iterator, 'next', arguments.length < 2 ? [] : [value]);
		if (Type$1(result) !== 'Object') {
			throw new $TypeError$5('iterator next must return an object');
		}
		return result;
	};

	var IteratorComplete = IteratorComplete$1;
	var IteratorNext = IteratorNext$1;

	// https://262.ecma-international.org/6.0/#sec-iteratorstep

	var IteratorStep = function IteratorStep(iterator) {
		var result = IteratorNext(iterator);
		var done = IteratorComplete(result);
		return done === true ? false : result;
	};

	var IteratorStep$1 = /*@__PURE__*/getDefaultExportFromCjs(IteratorStep);

	var $TypeError$4 = type;

	var Get = Get$2;
	var Type = Type$c;

	// https://262.ecma-international.org/6.0/#sec-iteratorvalue

	var IteratorValue = function IteratorValue(iterResult) {
		if (Type(iterResult) !== 'Object') {
			throw new $TypeError$4('Assertion failed: Type(iterResult) is not Object');
		}
		return Get(iterResult, 'value');
	};

	var IteratorValue$1 = /*@__PURE__*/getDefaultExportFromCjs(IteratorValue);

	var GetIntrinsic$6 = getIntrinsic;

	var $abs = GetIntrinsic$6('%Math.abs%');

	// http://262.ecma-international.org/5.1/#sec-5.2

	var abs$1 = function abs(x) {
		return $abs(x);
	};

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

	var isPrimitive$2 = function isPrimitive(value) {
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

	var toStr$1 = Object.prototype.toString;
	var dateClass = '[object Date]';
	var hasToStringTag = requireShams()();

	var isDateObject = function isDateObject(value) {
		if (typeof value !== 'object' || value === null) {
			return false;
		}
		return hasToStringTag ? tryDateObject(value) : toStr$1.call(value) === dateClass;
	};

	var isSymbol$1 = {exports: {}};

	var toStr = Object.prototype.toString;
	var hasSymbols$1 = requireHasSymbols()();

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

		var callBound = callBound$4;
		var hasToStringTag = requireShams()();
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

		var callBound = callBound$4;
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

	var $TypeError$3 = type;

	/** @type {import('./RequireObjectCoercible')} */
	var RequireObjectCoercible$1 = function RequireObjectCoercible(value) {
		if (value == null) {
			throw new $TypeError$3((arguments.length > 0 && arguments[1]) || ('Cannot call method on ' + value));
		}
		return value;
	};

	var ToString$2;
	var hasRequiredToString;

	function requireToString () {
		if (hasRequiredToString) return ToString$2;
		hasRequiredToString = 1;

		var GetIntrinsic = getIntrinsic;

		var $String = GetIntrinsic('%String%');
		var $TypeError = type;

		// https://262.ecma-international.org/6.0/#sec-tostring

		ToString$2 = function ToString(argument) {
			if (typeof argument === 'symbol') {
				throw new $TypeError('Cannot convert a Symbol value to a string');
			}
			return $String(argument);
		};
		return ToString$2;
	}

	var implementation;
	var hasRequiredImplementation;

	function requireImplementation () {
		if (hasRequiredImplementation) return implementation;
		hasRequiredImplementation = 1;

		var RequireObjectCoercible = RequireObjectCoercible$1;
		var ToString = requireToString();
		var callBound = callBound$4;
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
			var S = ToString(RequireObjectCoercible(this));
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

		var callBound = callBound$4;
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

	var GetIntrinsic$5 = getIntrinsic;

	var $TypeError$2 = type;
	var $Number = GetIntrinsic$5('%Number%');
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

	var sign = function sign(number) {
		return number >= 0 ? 1 : -1;
	};

	var abs = abs$1;
	var floor = floor$1;
	var ToNumber = ToNumber$1;

	var $isNaN = _isNaN;
	var $isFinite = _isFinite;
	var $sign = sign;

	// https://262.ecma-international.org/12.0/#sec-tointegerorinfinity

	var ToIntegerOrInfinity = function ToIntegerOrInfinity(value) {
		var number = ToNumber(value);
		if ($isNaN(number) || number === 0) { return 0; }
		if (!$isFinite(number)) { return number; }
		var integer = floor(abs(number));
		if (integer === 0) { return 0; }
		return $sign(number) * integer;
	};

	var ToIntegerOrInfinity$1 = /*@__PURE__*/getDefaultExportFromCjs(ToIntegerOrInfinity);

	/** @type {import('.')} */
	var esObjectAtoms = Object;

	var $Object = esObjectAtoms;
	var RequireObjectCoercible = RequireObjectCoercible$1;

	/** @type {import('./ToObject')} */
	var ToObject$2 = function ToObject(value) {
		RequireObjectCoercible(value);
		return $Object(value);
	};

	// https://262.ecma-international.org/6.0/#sec-toobject

	var ToObject = ToObject$2;

	var ToObject$1 = /*@__PURE__*/getDefaultExportFromCjs(ToObject);

	var GetIntrinsic$4 = getIntrinsic;

	var $String$1 = GetIntrinsic$4('%String%');
	var $TypeError$1 = type;

	// https://262.ecma-international.org/6.0/#sec-tostring

	var ToString = function ToString(argument) {
		if (typeof argument === 'symbol') {
			throw new $TypeError$1('Cannot convert a Symbol value to a string');
		}
		return $String$1(argument);
	};

	var ToString$1 = /*@__PURE__*/getDefaultExportFromCjs(ToString);

	var ToLength;
	var hasRequiredToLength;

	function requireToLength () {
		if (hasRequiredToLength) return ToLength;
		hasRequiredToLength = 1;

		var MAX_SAFE_INTEGER = requireMaxSafeInteger();

		var ToIntegerOrInfinity$1 = ToIntegerOrInfinity;

		ToLength = function ToLength(argument) {
			var len = ToIntegerOrInfinity$1(argument);
			if (len <= 0) { return 0; } // includes converting -0 to +0
			if (len > MAX_SAFE_INTEGER) { return MAX_SAFE_INTEGER; }
			return len;
		};
		return ToLength;
	}

	var StringPad$1;
	var hasRequiredStringPad;

	function requireStringPad () {
		if (hasRequiredStringPad) return StringPad$1;
		hasRequiredStringPad = 1;

		var $TypeError = type;

		var callBound = callBound$4;

		var ToLength = requireToLength();
		var ToString$1 = ToString;

		var $strSlice = callBound('String.prototype.slice');

		// https://262.ecma-international.org/11.0/#sec-stringpad

		StringPad$1 = function StringPad(O, maxLength, fillString, placement) {
			if (placement !== 'start' && placement !== 'end') {
				throw new $TypeError('Assertion failed: `placement` must be "start" or "end"');
			}
			var S = ToString$1(O);
			var intMaxLength = ToLength(maxLength);
			var stringLength = S.length;
			if (intMaxLength <= stringLength) {
				return S;
			}
			var filler = typeof fillString === 'undefined' ? ' ' : ToString$1(fillString);
			if (filler === '') {
				return S;
			}
			var fillLen = intMaxLength - stringLength;

			// the String value consisting of repeated concatenations of filler truncated to length fillLen.
			var truncatedStringFiller = '';
			while (truncatedStringFiller.length < fillLen) {
				truncatedStringFiller += filler;
			}
			truncatedStringFiller = $strSlice(truncatedStringFiller, 0, fillLen);

			if (placement === 'start') {
				return truncatedStringFiller + S;
			}
			return S + truncatedStringFiller;
		};
		return StringPad$1;
	}

	var GetIntrinsic$3 = getIntrinsic;

	var $String = GetIntrinsic$3('%String%');
	var $RangeError = requireRange();

	var StringPad = requireStringPad();

	var isInteger = isInteger$2;

	// https://262.ecma-international.org/13.0/#sec-tozeropaddeddecimalstring

	var ToZeroPaddedDecimalString = function ToZeroPaddedDecimalString(n, minLength) {
		if (!isInteger(n) || n < 0) {
			throw new $RangeError('Assertion failed: `q` must be a non-negative integer');
		}
		var S = $String(n);
		return StringPad(S, minLength, '0', 'start');
	};

	var ToZeroPaddedDecimalString$1 = /*@__PURE__*/getDefaultExportFromCjs(ToZeroPaddedDecimalString);

	var every = function every(array, predicate) {
		for (var i = 0; i < array.length; i += 1) {
			if (!predicate(array[i], i, array)) {
				return false;
			}
		}
		return true;
	};

	var every$1 = /*@__PURE__*/getDefaultExportFromCjs(every);

	var forEach = function forEach(array, callback) {
		for (var i = 0; i < array.length; i += 1) {
			callback(array[i], i, array); // eslint-disable-line callback-return
		}
	};

	var forEach$1 = /*@__PURE__*/getDefaultExportFromCjs(forEach);

	var GetIntrinsic$2 = getIntrinsic;

	var callBind = callBindExports;
	var callBound = callBound$4;

	var $ownKeys = GetIntrinsic$2('%Reflect.ownKeys%', true);
	var $pushApply = callBind.apply(GetIntrinsic$2('%Array.prototype.push%'));
	var $SymbolValueOf = callBound('Symbol.prototype.valueOf', true);
	var $gOPN = GetIntrinsic$2('%Object.getOwnPropertyNames%', true);
	var $gOPS = $SymbolValueOf ? GetIntrinsic$2('%Object.getOwnPropertySymbols%') : null;

	var keys = requireObjectKeys();

	var OwnPropertyKeys = $ownKeys || function OwnPropertyKeys(source) {
		var ownKeys = ($gOPN || keys)(source);
		if ($gOPS) {
			$pushApply(ownKeys, $gOPS(source));
		}
		return ownKeys;
	};

	var OwnPropertyKeys$1 = /*@__PURE__*/getDefaultExportFromCjs(OwnPropertyKeys);

	var some = function some(array, predicate) {
		for (var i = 0; i < array.length; i += 1) {
			if (predicate(array[i], i, array)) {
				return true;
			}
		}
		return false;
	};

	var some$1 = /*@__PURE__*/getDefaultExportFromCjs(some);

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
	      if (this[prop] !== 0) entries.push("  ".concat(prop, ": ").concat(options.stylize(this[prop], 'number')));
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
	  DefineIntrinsic("".concat(name, ".prototype"), Class.prototype);
	}
	function DefineIntrinsic(name, value) {
	  const key = "%".concat(name, "%");
	  if (INTRINSICS[key] !== undefined) throw new Error("intrinsic ".concat(name, " already exists"));
	  INTRINSICS[key] = value;
	}
	function GetIntrinsic(intrinsic) {
	  return intrinsic in INTRINSICS ? INTRINSICS[intrinsic] : ESGetIntrinsic(intrinsic);
	}

	const MathAbs$4 = Math.abs;
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
	  x = MathAbs$4(x);
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
	  const xStr = Call$4(NumberPrototypeToPrecision, x, [xDigits]);
	  const div = sign * NumberParseInt(Call$4(StringPrototypeSlice$1, xStr, [0, xDigits - p]), 10);
	  const mod = sign * NumberParseInt(Call$4(StringPrototypeSlice$1, xStr, [xDigits - p]), 10);
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
	  x = MathAbs$4(x);
	  z = MathAbs$4(z);
	  const xStr = Call$4(NumberPrototypeToPrecision, x, [MathTrunc$1(1 + MathLog10(x))]);
	  if (z === 0) return sign * NumberParseInt(xStr + Call$4(StringPrototypeRepeat, '0', [p]), 10);
	  const zStr = Call$4(NumberPrototypeToPrecision, z, [MathTrunc$1(1 + MathLog10(z))]);
	  const resStr = xStr + Call$4(StringPrototypePadStart, zStr, [p, '0']);
	  return sign * NumberParseInt(resStr, 10);
	}

	// Instant
	const EPOCHNANOSECONDS = 'slot-epochNanoSeconds';

	// TimeZone
	const TIMEZONE_ID = 'slot-timezone-identifier';

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
	const INSTANT = 'slot-cached-instant';
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

	// Calendar
	const CALENDAR_ID = 'slot-calendar-identifier';
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

	class MethodRecord {
	  constructor(recordType, receiver, methodNames) {
	    this.recordType = recordType;
	    this.receiver = receiver;
	    const nMethods = methodNames.length;
	    for (let ix = 0; ix < nMethods; ix++) {
	      this.lookup(methodNames[ix]);
	    }
	  }
	  isBuiltIn() {
	    return typeof this.receiver === 'string';
	  }
	  hasLookedUp(methodName) {
	    return !!this["_".concat(methodName)];
	  }
	  lookup(methodName) {
	    if (this.hasLookedUp(methodName)) {
	      throw new Error("assertion failure: ".concat(methodName, " already looked up"));
	    }
	    if (this.isBuiltIn()) {
	      this["_".concat(methodName)] = GetIntrinsic("%Temporal.".concat(this.recordType, ".prototype.").concat(methodName, "%"));
	    } else {
	      const method = GetMethod$4(this.receiver, methodName);
	      if (!method) {
	        // GetMethod may return undefined if method is null or undefined
	        throw new TypeError("".concat(methodName, " should be present on ").concat(this.recordType));
	      }
	      this["_".concat(methodName)] = method;
	    }
	  }
	  call(methodName, args) {
	    if (!this.hasLookedUp(methodName)) {
	      throw new Error("assertion failure: ".concat(methodName, " should have been looked up"));
	    }
	    let receiver = this.receiver;
	    if (this.isBuiltIn()) {
	      const cls = GetIntrinsic("%Temporal.".concat(this.recordType, "%"));
	      receiver = new cls(receiver);
	    }
	    return this["_".concat(methodName)].apply(receiver, args);
	  }
	}
	class TimeZoneMethodRecord extends MethodRecord {
	  constructor(timeZone) {
	    let methodNames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	    super('TimeZone', timeZone, methodNames);
	  }
	  getOffsetNanosecondsFor(instant) {
	    return this.call('getOffsetNanosecondsFor', [instant]);
	  }
	  getPossibleInstantsFor(dateTime) {
	    return this.call('getPossibleInstantsFor', [dateTime]);
	  }
	}
	class CalendarMethodRecord extends MethodRecord {
	  constructor(calendar) {
	    let methodNames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	    super('Calendar', calendar, methodNames);
	  }
	  static CreateFromRelativeTo(plainRelativeTo, zonedRelativeTo) {
	    let methodNames = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
	    const relativeTo = zonedRelativeTo !== null && zonedRelativeTo !== void 0 ? zonedRelativeTo : plainRelativeTo;
	    if (!relativeTo) return undefined;
	    return new this(GetSlot(relativeTo, CALENDAR), methodNames);
	  }
	  dateAdd(date, duration, options) {
	    return this.call('dateAdd', [date, duration, options]);
	  }
	  dateFromFields(fields, options) {
	    return this.call('dateFromFields', [fields, options]);
	  }
	  dateUntil(one, two, options) {
	    return this.call('dateUntil', [one, two, options]);
	  }
	  day(date) {
	    return this.call('day', [date]);
	  }
	  fields(fieldNames) {
	    return this.call('fields', [fieldNames]);
	  }
	  mergeFields(fields, additionalFields) {
	    return this.call('mergeFields', [fields, additionalFields]);
	  }
	  monthDayFromFields(fields, options) {
	    return this.call('monthDayFromFields', [fields, options]);
	  }
	  yearMonthFromFields(fields, options) {
	    return this.call('yearMonthFromFields', [fields, options]);
	  }
	}

	function _toPrimitive(t, r) {
	  if ("object" != typeof t || !t) return t;
	  var e = t[Symbol.toPrimitive];
	  if (void 0 !== e) {
	    var i = e.call(t, r || "default");
	    if ("object" != typeof i) return i;
	    throw new TypeError("@@toPrimitive must return a primitive value.");
	  }
	  return ("string" === r ? String : Number)(t);
	}
	function _toPropertyKey(t) {
	  var i = _toPrimitive(t, "string");
	  return "symbol" == typeof i ? i : i + "";
	}
	function _defineProperty(obj, key, value) {
	  key = _toPropertyKey(key);
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

	var _TimeDuration;
	const MathAbs$3 = Math.abs;
	const MathSign$1 = Math.sign;
	const NumberIsInteger = Number.isInteger;
	const NumberIsSafeInteger$1 = Number.isSafeInteger;
	class TimeDuration {
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
	    if (MathAbs$3(this.subsec) > 999999999) throw new Error('assertion failed: subseconds too big');
	  }
	  static fromEpochNsDiff(epochNs1, epochNs2) {
	    const diff = bigInt(epochNs1).subtract(epochNs2);
	    // No extra validate step. Should instead fail assertion if too big
	    return new TimeDuration(diff);
	  }
	  static normalize(h, min, s, ms, µs, ns) {
	    const totalNs = bigInt(ns).add(bigInt(µs).multiply(1e3)).add(bigInt(ms).multiply(1e6)).add(bigInt(s).multiply(1e9)).add(bigInt(min).multiply(60e9)).add(bigInt(h).multiply(3600e9));
	    return _validateNew.call(TimeDuration, totalNs, 'total');
	  }
	  abs() {
	    return new TimeDuration(this.totalNs.abs());
	  }
	  add(other) {
	    return _validateNew.call(TimeDuration, this.totalNs.add(other.totalNs), 'sum');
	  }
	  add24HourDays(days) {
	    if (!NumberIsInteger(days)) throw new Error('assertion failed: days is an integer');
	    return _validateNew.call(TimeDuration, this.totalNs.add(bigInt(days).multiply(86400e9)), 'sum');
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
	    if (n === 0) throw new Error('division by zero');
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
	      decimalDigits.push(MathAbs$3(digit.toJSNumber()));
	    }
	    return sign * Number(quotient.abs().toString() + '.' + decimalDigits.join(''));
	  }
	  isZero() {
	    return this.totalNs.isZero();
	  }
	  round(increment, mode) {
	    if (increment === 1) return this;
	    let {
	      quotient,
	      remainder
	    } = this.totalNs.divmod(increment);
	    if (remainder.equals(bigInt.zero)) return this;
	    const sign = remainder.lt(bigInt.zero) ? -1 : 1;
	    const tiebreaker = remainder.multiply(2).abs();
	    const tie = tiebreaker.equals(increment);
	    const expandIsNearer = tiebreaker.gt(increment);
	    switch (mode) {
	      case 'ceil':
	        if (sign > 0) quotient = quotient.add(sign);
	        break;
	      case 'floor':
	        if (sign < 0) quotient = quotient.add(sign);
	        break;
	      case 'expand':
	        // always expand if there is a remainder
	        quotient = quotient.add(sign);
	        break;
	      case 'trunc':
	        // no change needed, because divmod is a truncation
	        break;
	      case 'halfCeil':
	        if (expandIsNearer || tie && sign > 0) quotient = quotient.add(sign);
	        break;
	      case 'halfFloor':
	        if (expandIsNearer || tie && sign < 0) quotient = quotient.add(sign);
	        break;
	      case 'halfExpand':
	        // "half up away from zero"
	        if (expandIsNearer || tie) quotient = quotient.add(sign);
	        break;
	      case 'halfTrunc':
	        if (expandIsNearer) quotient = quotient.add(sign);
	        break;
	      case 'halfEven':
	        {
	          if (expandIsNearer || tie && quotient.isOdd()) quotient = quotient.add(sign);
	          break;
	        }
	    }
	    return _validateNew.call(TimeDuration, quotient.multiply(increment), 'rounding');
	  }
	  sign() {
	    return this.cmp(new TimeDuration(0n));
	  }
	  subtract(other) {
	    return _validateNew.call(TimeDuration, this.totalNs.subtract(other.totalNs), 'difference');
	  }
	}
	_TimeDuration = TimeDuration;
	function _validateNew(totalNs, operation) {
	  if (totalNs.abs().greater(_TimeDuration.MAX)) {
	    throw new RangeError("".concat(operation, " of duration time units cannot exceed ").concat(_TimeDuration.MAX, " s"));
	  }
	  return new _TimeDuration(totalNs);
	}
	_defineProperty(TimeDuration, "MAX", bigInt('9007199254740991999999999'));
	_defineProperty(TimeDuration, "ZERO", new _TimeDuration(bigInt.zero));

	const offsetIdentifierNoCapture = /(?:[+\u2212-](?:[01][0-9]|2[0-3])(?::?[0-5][0-9])?)/;
	const tzComponent = /[A-Za-z._][A-Za-z._0-9+-]*/;
	const timeZoneID = new RegExp("(?:".concat(offsetIdentifierNoCapture.source, "|(?:").concat(tzComponent.source, ")(?:\\/(?:").concat(tzComponent.source, "))*)"));
	const yearpart = /(?:[+\u2212-]\d{6}|\d{4})/;
	const monthpart = /(?:0[1-9]|1[0-2])/;
	const daypart = /(?:0[1-9]|[12]\d|3[01])/;
	const datesplit = new RegExp("(".concat(yearpart.source, ")(?:-(").concat(monthpart.source, ")-(").concat(daypart.source, ")|(").concat(monthpart.source, ")(").concat(daypart.source, "))"));
	const timesplit = /(\d{2})(?::(\d{2})(?::(\d{2})(?:[.,](\d{1,9}))?)?|(\d{2})(?:(\d{2})(?:[.,](\d{1,9}))?)?)?/;
	const offsetWithParts = /([+\u2212-])([01][0-9]|2[0-3])(?::?([0-5][0-9])(?::?([0-5][0-9])(?:[.,](\d{1,9}))?)?)?/;
	const offset = /((?:[+\u2212-])(?:[01][0-9]|2[0-3])(?::?(?:[0-5][0-9])(?::?(?:[0-5][0-9])(?:[.,](?:\d{1,9}))?)?)?)/;
	const offsetpart = new RegExp("([zZ])|".concat(offset.source, "?"));
	const offsetIdentifier = /([+\u2212-])([01][0-9]|2[0-3])(?::?([0-5][0-9])?)?/;
	const annotation = /\[(!)?([a-z_][a-z0-9_-]*)=([A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)\]/g;
	const zoneddatetime = new RegExp(["^".concat(datesplit.source), "(?:(?:[tT]|\\s+)".concat(timesplit.source, "(?:").concat(offsetpart.source, ")?)?"), "(?:\\[!?(".concat(timeZoneID.source, ")\\])?"), "((?:".concat(annotation.source, ")*)$")].join(''));
	const time = new RegExp(["^[tT]?".concat(timesplit.source), "(?:".concat(offsetpart.source, ")?"), "(?:\\[!?".concat(timeZoneID.source, "\\])?"), "((?:".concat(annotation.source, ")*)$")].join(''));

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
	const yearmonth = new RegExp("^(".concat(yearpart.source, ")-?(").concat(monthpart.source, ")(?:\\[!?").concat(timeZoneID.source, "\\])?((?:").concat(annotation.source, ")*)$"));
	const monthday = new RegExp("^(?:--)?(".concat(monthpart.source, ")-?(").concat(daypart.source, ")(?:\\[!?").concat(timeZoneID.source, "\\])?((?:").concat(annotation.source, ")*)$"));
	const fraction = /(\d+)(?:[.,](\d{1,9}))?/;
	const durationDate = /(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?/;
	const durationTime = new RegExp("(?:".concat(fraction.source, "H)?(?:").concat(fraction.source, "M)?(?:").concat(fraction.source, "S)?"));
	const duration = new RegExp("^([+\u2212-])?P".concat(durationDate.source, "(?:T(?!$)").concat(durationTime.source, ")?$"), 'i');

	/* global true */

	const ArrayIncludes$1 = Array.prototype.includes;
	const ArrayPrototypeMap = Array.prototype.map;
	const ArrayPrototypePush$3 = Array.prototype.push;
	const ArrayPrototypeSort$1 = Array.prototype.sort;
	const ArrayPrototypeFind = Array.prototype.find;
	const IntlDateTimeFormat$2 = globalThis.Intl.DateTimeFormat;
	const IntlSupportedValuesOf = globalThis.Intl.supportedValuesOf;
	const MapCtor = Map;
	const MapPrototypeSet$1 = Map.prototype.set;
	const MathAbs$2 = Math.abs;
	const MathFloor$1 = Math.floor;
	const MathMax = Math.max;
	const MathMin = Math.min;
	const MathSign = Math.sign;
	const MathTrunc = Math.trunc;
	const NumberIsFinite = Number.isFinite;
	const NumberIsNaN = Number.isNaN;
	const NumberIsSafeInteger = Number.isSafeInteger;
	const NumberMaxSafeInteger = Number.MAX_SAFE_INTEGER;
	const ObjectCreate$7 = Object.create;
	const ObjectDefineProperty$1 = Object.defineProperty;
	const ObjectEntries$1 = Object.entries;
	const ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	const SetPrototypeHas$1 = Set.prototype.has;
	const StringCtor = String;
	const StringFromCharCode = String.fromCharCode;
	const StringPrototypeCharCodeAt = String.prototype.charCodeAt;
	const StringPrototypeMatchAll = String.prototype.matchAll;
	const StringPrototypeReplace = String.prototype.replace;
	const StringPrototypeSlice = String.prototype.slice;
	const $TypeError = GetIntrinsic('%TypeError%');
	const $isEnumerable = callBound$5('Object.prototype.propertyIsEnumerable');
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

	const BUILTIN_CALENDAR_IDS = ['iso8601', 'hebrew', 'islamic', 'islamic-umalqura', 'islamic-tbla', 'islamic-civil', 'islamic-rgsa', 'islamicc', 'persian', 'ethiopic', 'ethioaa', 'coptic', 'chinese', 'dangi', 'roc', 'indian', 'buddhist', 'japanese', 'gregory'];
	const ICU_LEGACY_TIME_ZONE_IDS = new Set(['ACT', 'AET', 'AGT', 'ART', 'AST', 'BET', 'BST', 'CAT', 'CNT', 'CST', 'CTT', 'EAT', 'ECT', 'IET', 'IST', 'JST', 'MIT', 'NET', 'NST', 'PLT', 'PNT', 'PRT', 'PST', 'SST', 'VST']);
	function ToIntegerWithTruncation(value) {
	  const number = ToNumber$2(value);
	  if (number === 0) return 0;
	  if (NumberIsNaN(number) || !NumberIsFinite(number)) {
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
	      throw new RangeError("property '".concat(property, "' cannot be a a number less than one"));
	    }
	    throw new RangeError('Cannot convert a number less than one to a positive integer');
	  }
	  return integer;
	}
	function ToIntegerIfIntegral(value) {
	  const number = ToNumber$2(value);
	  if (!NumberIsFinite(number)) throw new RangeError('infinity is out of range');
	  if (!IsIntegralNumber$1(number)) throw new RangeError("unsupported fractional value ".concat(value));
	  if (number === 0) return 0; // ℝ(value) in spec text; converts -0 to 0
	  return number;
	}

	// This convenience function isn't in the spec, but is useful in the polyfill
	// for DRY and better error messages.
	function RequireString(value) {
	  if (Type$d(value) !== 'String') {
	    // Use String() to ensure that Symbols won't throw
	    throw new TypeError("expected a string, not ".concat(StringCtor(value)));
	  }
	  return value;
	}

	// This function is an enum in the spec, but it's helpful to make it a
	// function in the polyfill.
	function ToPrimitiveAndRequireString(value) {
	  value = ToPrimitive$2(value, StringCtor);
	  return RequireString(value);
	}
	const BUILTIN_CASTS = new Map([['year', ToIntegerWithTruncation], ['month', ToPositiveIntegerWithTruncation], ['monthCode', ToPrimitiveAndRequireString], ['day', ToPositiveIntegerWithTruncation], ['hour', ToIntegerWithTruncation], ['minute', ToIntegerWithTruncation], ['second', ToIntegerWithTruncation], ['millisecond', ToIntegerWithTruncation], ['microsecond', ToIntegerWithTruncation], ['nanosecond', ToIntegerWithTruncation], ['years', ToIntegerIfIntegral], ['months', ToIntegerIfIntegral], ['weeks', ToIntegerIfIntegral], ['days', ToIntegerIfIntegral], ['hours', ToIntegerIfIntegral], ['minutes', ToIntegerIfIntegral], ['seconds', ToIntegerIfIntegral], ['milliseconds', ToIntegerIfIntegral], ['microseconds', ToIntegerIfIntegral], ['nanoseconds', ToIntegerIfIntegral], ['offset', ToPrimitiveAndRequireString]]);
	const BUILTIN_DEFAULTS = new Map([['hour', 0], ['minute', 0], ['second', 0], ['millisecond', 0], ['microsecond', 0], ['nanosecond', 0]]);

	// each item is [plural, singular, category]
	const SINGULAR_PLURAL_UNITS = [['years', 'year', 'date'], ['months', 'month', 'date'], ['weeks', 'week', 'date'], ['days', 'day', 'date'], ['hours', 'hour', 'time'], ['minutes', 'minute', 'time'], ['seconds', 'second', 'time'], ['milliseconds', 'millisecond', 'time'], ['microseconds', 'microsecond', 'time'], ['nanoseconds', 'nanosecond', 'time']];
	const SINGULAR_FOR = new Map(SINGULAR_PLURAL_UNITS);
	const PLURAL_FOR = new Map(SINGULAR_PLURAL_UNITS.map(_ref => {
	  let [p, s] = _ref;
	  return [s, p];
	}));
	const UNITS_DESCENDING = SINGULAR_PLURAL_UNITS.map(_ref2 => {
	  let [, s] = _ref2;
	  return s;
	});
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

	// copied from es-abstract/2022/CopyDataProperties.js
	// with modifications per Temporal spec/mainadditions.html

	function CopyDataProperties(target, source, excludedKeys, excludedValues) {
	  if (Type$d(target) !== 'Object') {
	    throw new $TypeError('Assertion failed: "target" must be an Object');
	  }
	  if (!IsArray$4(excludedKeys) || !every$1(excludedKeys, IsPropertyKey$a)) {
	    throw new $TypeError('Assertion failed: "excludedKeys" must be a List of Property Keys');
	  }
	  if (excludedValues !== undefined && !IsArray$4(excludedValues)) {
	    throw new $TypeError('Assertion failed: "excludedValues" must be a List of ECMAScript language values');
	  }
	  if (typeof source === 'undefined' || source === null) {
	    return;
	  }
	  var from = ToObject$1(source);
	  var keys = OwnPropertyKeys$1(from);
	  forEach$1(keys, function (nextKey) {
	    var excluded = some$1(excludedKeys, function (e) {
	      return SameValue$3(e, nextKey) === true;
	    });
	    if (excluded) return;
	    var enumerable = $isEnumerable(from, nextKey) ||
	    // this is to handle string keys being non-enumerable in older engines
	    typeof source === 'string' && nextKey >= 0 && IsIntegralNumber$1(ToNumber$2(nextKey));
	    if (enumerable) {
	      var propValue = Get$3(from, nextKey);
	      if (excludedValues !== undefined) {
	        forEach$1(excludedValues, function (e) {
	          if (SameValue$3(e, propValue) === true) {
	            excluded = true;
	          }
	        });
	      }
	      if (excluded === false) CreateDataPropertyOrThrow$1(target, nextKey, propValue);
	    }
	  });
	}
	function IsTemporalInstant(item) {
	  return HasSlot(item, EPOCHNANOSECONDS) && !HasSlot(item, TIME_ZONE, CALENDAR);
	}
	function IsTemporalTimeZone(item) {
	  return HasSlot(item, TIMEZONE_ID);
	}
	function IsTemporalCalendar(item) {
	  return HasSlot(item, CALENDAR_ID);
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
	  return FormatCalendarAnnotation(ToTemporalCalendarIdentifier(calendar), showCalendar);
	}
	function FormatCalendarAnnotation(id, showCalendar) {
	  if (showCalendar === 'never') return '';
	  if (showCalendar === 'auto' && id === 'iso8601') return '';
	  const flag = showCalendar === 'critical' ? '!' : '';
	  return "[".concat(flag, "u-ca=").concat(id, "]");
	}

	// Not a separate abstract operation in the spec, because it only occurs in one
	// place: ParseISODateTime. In the code it's more convenient to split up
	// ParseISODateTime for the YYYY-MM, MM-DD, and THH:MM:SS parse goals, so it's
	// repeated four times.
	function processAnnotations(annotations) {
	  let calendar;
	  let calendarWasCritical = false;
	  for (const [, critical, key, value] of Call$4(StringPrototypeMatchAll, annotations, [annotation])) {
	    if (key === 'u-ca') {
	      if (calendar === undefined) {
	        calendar = value;
	        calendarWasCritical = critical === '!';
	      } else if (critical === '!' || calendarWasCritical) {
	        throw new RangeError("Invalid annotations in ".concat(annotations, ": more than one u-ca present with critical flag"));
	      }
	    } else if (critical === '!') {
	      throw new RangeError("Unrecognized annotation: !".concat(key, "=").concat(value));
	    }
	  }
	  return calendar;
	}
	function ParseISODateTime(isoString) {
	  // ZDT is the superset of fields for every other Temporal type
	  const match = zoneddatetime.exec(isoString);
	  if (!match) throw new RangeError("invalid ISO 8601 string: ".concat(isoString));
	  let yearString = match[1];
	  if (yearString[0] === '\u2212') yearString = "-".concat(yearString.slice(1));
	  if (yearString === '-000000') throw new RangeError("invalid ISO 8601 string: ".concat(isoString));
	  const year = ToIntegerOrInfinity$1(yearString);
	  const month = ToIntegerOrInfinity$1(match[2] || match[4]);
	  const day = ToIntegerOrInfinity$1(match[3] || match[5]);
	  const hasTime = match[6] !== undefined;
	  const hour = ToIntegerOrInfinity$1(match[6]);
	  const minute = ToIntegerOrInfinity$1(match[7] || match[10]);
	  let second = ToIntegerOrInfinity$1(match[8] || match[11]);
	  if (second === 60) second = 59;
	  const fraction = (match[9] || match[12]) + '000000000';
	  const millisecond = ToIntegerOrInfinity$1(fraction.slice(0, 3));
	  const microsecond = ToIntegerOrInfinity$1(fraction.slice(3, 6));
	  const nanosecond = ToIntegerOrInfinity$1(fraction.slice(6, 9));
	  let offset;
	  let z = false;
	  if (match[13]) {
	    offset = undefined;
	    z = true;
	  } else if (match[14]) {
	    offset = match[14];
	  }
	  const tzAnnotation = match[15];
	  const calendar = processAnnotations(match[16]);
	  RejectDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
	  return {
	    year,
	    month,
	    day,
	    hasTime,
	    hour,
	    minute,
	    second,
	    millisecond,
	    microsecond,
	    nanosecond,
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
	    hour = ToIntegerOrInfinity$1(match[1]);
	    minute = ToIntegerOrInfinity$1(match[2] || match[5]);
	    second = ToIntegerOrInfinity$1(match[3] || match[6]);
	    if (second === 60) second = 59;
	    const fraction = (match[4] || match[7]) + '000000000';
	    millisecond = ToIntegerOrInfinity$1(fraction.slice(0, 3));
	    microsecond = ToIntegerOrInfinity$1(fraction.slice(3, 6));
	    nanosecond = ToIntegerOrInfinity$1(fraction.slice(6, 9));
	    processAnnotations(match[10]); // ignore found calendar
	    if (match[8]) throw new RangeError('Z designator not supported for PlainTime');
	  } else {
	    let z, hasTime;
	    ({
	      hasTime,
	      hour,
	      minute,
	      second,
	      millisecond,
	      microsecond,
	      nanosecond,
	      z
	    } = ParseISODateTime(isoString));
	    if (!hasTime) throw new RangeError("time is missing in string: ".concat(isoString));
	    if (z) throw new RangeError('Z designator not supported for PlainTime');
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
	  throw new RangeError("invalid ISO 8601 time-only string ".concat(isoString, "; may need a T prefix"));
	}
	function ParseTemporalYearMonthString(isoString) {
	  const match = yearmonth.exec(isoString);
	  let year, month, calendar, referenceISODay;
	  if (match) {
	    let yearString = match[1];
	    if (yearString[0] === '\u2212') yearString = "-".concat(yearString.slice(1));
	    if (yearString === '-000000') throw new RangeError("invalid ISO 8601 string: ".concat(isoString));
	    year = ToIntegerOrInfinity$1(yearString);
	    month = ToIntegerOrInfinity$1(match[2]);
	    calendar = processAnnotations(match[3]);
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
	    month = ToIntegerOrInfinity$1(match[1]);
	    day = ToIntegerOrInfinity$1(match[2]);
	    calendar = processAnnotations(match[3]);
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
	const TIMEZONE_IDENTIFIER = new RegExp("^".concat(timeZoneID.source, "$"), 'i');
	const OFFSET_IDENTIFIER = new RegExp("^".concat(offsetIdentifier.source, "$"));
	function throwBadTimeZoneStringError(timeZoneString) {
	  // Offset identifiers only support minute precision, but offsets in ISO
	  // strings support nanosecond precision. If the identifier is invalid but
	  // it's a valid ISO offset, then it has sub-minute precision. Show a clearer
	  // error message in that case.
	  const msg = OFFSET.test(timeZoneString) ? 'Seconds not allowed in offset time zone' : 'Invalid time zone';
	  throw new RangeError("".concat(msg, ": ").concat(timeZoneString));
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
	  if (!match) throw new RangeError("invalid duration: ".concat(isoString));
	  if (match.slice(2).every(element => element === undefined)) {
	    throw new RangeError("invalid duration: ".concat(isoString));
	  }
	  const sign = match[1] === '-' || match[1] === '\u2212' ? -1 : 1;
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
	    var _ref3, _ref4, _ref5;
	    if ((_ref3 = (_ref4 = (_ref5 = minutesStr !== null && minutesStr !== void 0 ? minutesStr : fMinutes) !== null && _ref5 !== void 0 ? _ref5 : secondsStr) !== null && _ref4 !== void 0 ? _ref4 : fSeconds) !== null && _ref3 !== void 0 ? _ref3 : false) {
	      throw new RangeError('only the smallest unit can be fractional');
	    }
	    excessNanoseconds = ToIntegerWithTruncation((fHours + '000000000').slice(0, 9)) * 3600 * sign;
	  } else {
	    minutes = minutesStr === undefined ? 0 : ToIntegerWithTruncation(minutesStr) * sign;
	    if (fMinutes !== undefined) {
	      var _ref6;
	      if ((_ref6 = secondsStr !== null && secondsStr !== void 0 ? secondsStr : fSeconds) !== null && _ref6 !== void 0 ? _ref6 : false) {
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
	  if (Type$d(item) !== 'Object') {
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
	  if (Type$d(temporalDurationLike) !== 'Object') {
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
	      throw new RangeError("Duration field ".concat(property, " not supported by Temporal.Instant. Try Temporal.ZonedDateTime instead."));
	    }
	  }
	  return record;
	}
	function ToTemporalOverflow(options) {
	  if (options === undefined) return 'constrain';
	  return GetOption(options, 'overflow', ['constrain', 'reject'], 'constrain');
	}
	function ToTemporalDisambiguation(options) {
	  if (options === undefined) return 'compatible';
	  return GetOption(options, 'disambiguation', ['compatible', 'earlier', 'later', 'reject'], 'compatible');
	}
	function ToTemporalRoundingMode(options, fallback) {
	  return GetOption(options, 'roundingMode', ['ceil', 'floor', 'expand', 'trunc', 'halfCeil', 'halfFloor', 'halfExpand', 'halfTrunc', 'halfEven'], fallback);
	}
	function NegateTemporalRoundingMode(roundingMode) {
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
	function ToTemporalOffset(options, fallback) {
	  if (options === undefined) return fallback;
	  return GetOption(options, 'offset', ['prefer', 'use', 'ignore', 'reject'], fallback);
	}
	function ToCalendarNameOption(options) {
	  return GetOption(options, 'calendarName', ['auto', 'always', 'never', 'critical'], 'auto');
	}
	function ToTimeZoneNameOption(options) {
	  return GetOption(options, 'timeZoneName', ['auto', 'never', 'critical'], 'auto');
	}
	function ToShowOffsetOption(options) {
	  return GetOption(options, 'offset', ['auto', 'never'], 'auto');
	}
	function ToTemporalRoundingIncrement(options) {
	  let increment = options.roundingIncrement;
	  if (increment === undefined) return 1;
	  increment = ToNumber$2(increment);
	  if (!NumberIsFinite(increment)) {
	    throw new RangeError('roundingIncrement must be finite');
	  }
	  const integerIncrement = MathTrunc(increment);
	  if (integerIncrement < 1 || integerIncrement > 1e9) {
	    throw new RangeError("roundingIncrement must be at least 1 and at most 1e9, not ".concat(increment));
	  }
	  return integerIncrement;
	}
	function ValidateTemporalRoundingIncrement(increment, dividend, inclusive) {
	  const maximum = inclusive ? dividend : dividend - 1;
	  if (increment > maximum) {
	    throw new RangeError("roundingIncrement must be at least 1 and less than ".concat(maximum, ", not ").concat(increment));
	  }
	  if (dividend % increment !== 0) {
	    throw new RangeError("Rounding increment must divide evenly into ".concat(dividend));
	  }
	}
	function ToFractionalSecondDigits(normalizedOptions) {
	  let digitsValue = normalizedOptions.fractionalSecondDigits;
	  if (digitsValue === undefined) return 'auto';
	  if (Type$d(digitsValue) !== 'Number') {
	    if (ToString$1(digitsValue) !== 'auto') {
	      throw new RangeError("fractionalSecondDigits must be 'auto' or 0 through 9, not ".concat(digitsValue));
	    }
	    return 'auto';
	  }
	  const digitCount = MathFloor$1(digitsValue);
	  if (!NumberIsFinite(digitCount) || digitCount < 0 || digitCount > 9) {
	    throw new RangeError("fractionalSecondDigits must be 'auto' or 0 through 9, not ".concat(digitsValue));
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
	function GetTemporalUnit(options, key, unitGroup, requiredOrDefault) {
	  let extraValues = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
	  const allowedSingular = [];
	  for (let index = 0; index < SINGULAR_PLURAL_UNITS.length; index++) {
	    const unitInfo = SINGULAR_PLURAL_UNITS[index];
	    const singular = unitInfo[1];
	    const category = unitInfo[2];
	    if (unitGroup === 'datetime' || unitGroup === category) {
	      allowedSingular.push(singular);
	    }
	  }
	  Call$4(ArrayPrototypePush$3, allowedSingular, extraValues);
	  let defaultVal = requiredOrDefault;
	  if (defaultVal === REQUIRED) {
	    defaultVal = undefined;
	  } else if (defaultVal !== undefined) {
	    allowedSingular.push(defaultVal);
	  }
	  const allowedValues = [];
	  Call$4(ArrayPrototypePush$3, allowedValues, allowedSingular);
	  for (let index = 0; index < allowedSingular.length; index++) {
	    const singular = allowedSingular[index];
	    const plural = PLURAL_FOR.get(singular);
	    if (plural !== undefined) allowedValues.push(plural);
	  }
	  let retval = GetOption(options, key, allowedValues, defaultVal);
	  if (retval === undefined && requiredOrDefault === REQUIRED) {
	    throw new RangeError("".concat(key, " is required"));
	  }
	  if (SINGULAR_FOR.has(retval)) retval = SINGULAR_FOR.get(retval);
	  return retval;
	}
	function ToRelativeTemporalObject(options) {
	  // returns: {
	  //   plainRelativeTo: Temporal.PlainDate | undefined
	  //   zonedRelativeTo: Temporal.ZonedDateTime | undefined
	  //   timeZoneRec: TimeZoneMethodRecord | undefined
	  // }
	  // plainRelativeTo and zonedRelativeTo are mutually exclusive.
	  // If zonedRelativeTo is defined, then timeZoneRec is defined.
	  const relativeTo = options.relativeTo;
	  if (relativeTo === undefined) return {};
	  let offsetBehaviour = 'option';
	  let matchMinutes = false;
	  let year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar, timeZone, offset;
	  if (Type$d(relativeTo) === 'Object') {
	    if (IsTemporalZonedDateTime(relativeTo)) {
	      const timeZoneRec = new TimeZoneMethodRecord(GetSlot(relativeTo, TIME_ZONE), ['getOffsetNanosecondsFor', 'getPossibleInstantsFor']);
	      return {
	        zonedRelativeTo: relativeTo,
	        timeZoneRec
	      };
	    }
	    if (IsTemporalDate(relativeTo)) return {
	      plainRelativeTo: relativeTo
	    };
	    if (IsTemporalDateTime(relativeTo)) return {
	      plainRelativeTo: TemporalDateTimeToDate(relativeTo)
	    };
	    calendar = GetTemporalCalendarSlotValueWithISODefault(relativeTo);
	    const calendarRec = new CalendarMethodRecord(calendar, ['dateFromFields', 'fields']);
	    const fieldNames = CalendarFields(calendarRec, ['day', 'month', 'monthCode', 'year']);
	    Call$4(ArrayPrototypePush$3, fieldNames, ['hour', 'microsecond', 'millisecond', 'minute', 'nanosecond', 'offset', 'second', 'timeZone']);
	    const fields = PrepareTemporalFields(relativeTo, fieldNames, []);
	    const dateOptions = ObjectCreate$7(null);
	    dateOptions.overflow = 'constrain';
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
	    } = InterpretTemporalDateTimeFields(calendarRec, fields, dateOptions));
	    offset = fields.offset;
	    if (offset === undefined) offsetBehaviour = 'wall';
	    timeZone = fields.timeZone;
	    if (timeZone !== undefined) timeZone = ToTemporalTimeZoneSlotValue(timeZone);
	  } else {
	    let tzAnnotation, z;
	    ({
	      year,
	      month,
	      day,
	      hour,
	      minute,
	      second,
	      millisecond,
	      microsecond,
	      nanosecond,
	      calendar,
	      tzAnnotation,
	      offset,
	      z
	    } = ParseISODateTime(RequireString(relativeTo)));
	    if (tzAnnotation) {
	      timeZone = ToTemporalTimeZoneSlotValue(tzAnnotation);
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
	    if (!IsBuiltinCalendar(calendar)) throw new RangeError("invalid calendar identifier ".concat(calendar));
	    calendar = ASCIILowercase(calendar);
	  }
	  if (timeZone === undefined) return {
	    plainRelativeTo: CreateTemporalDate(year, month, day, calendar)
	  };
	  const timeZoneRec = new TimeZoneMethodRecord(timeZone, ['getOffsetNanosecondsFor', 'getPossibleInstantsFor']);
	  const offsetNs = offsetBehaviour === 'option' ? ParseDateTimeUTCOffset(offset) : 0;
	  const epochNanoseconds = InterpretISODateTimeOffset(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, offsetBehaviour, offsetNs, timeZoneRec, 'compatible', 'reject', matchMinutes);
	  return {
	    zonedRelativeTo: CreateTemporalZonedDateTime(epochNanoseconds, timeZone, calendar),
	    timeZoneRec
	  };
	}
	function DefaultTemporalLargestUnit(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds) {
	  const entries = ObjectEntries$1({
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
	function PrepareTemporalFields(bag, fields, requiredFields) {
	  let extraFieldDescriptors = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
	  let duplicateBehaviour = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'throw';
	  let {
	    emptySourceErrorMessage = 'no supported properties found'
	  } = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
	  const result = ObjectCreate$7(null);
	  let any = false;
	  if (extraFieldDescriptors) {
	    for (let index = 0; index < extraFieldDescriptors.length; index++) {
	      let desc = extraFieldDescriptors[index];
	      Call$4(ArrayPrototypePush$3, fields, [desc.property]);
	      if (desc.required === true && requiredFields !== 'partial') {
	        Call$4(ArrayPrototypePush$3, requiredFields, [desc.property]);
	      }
	    }
	  }
	  Call$4(ArrayPrototypeSort$1, fields, []);
	  let previousProperty = undefined;
	  for (let index = 0; index < fields.length; index++) {
	    const property = fields[index];
	    if (property === 'constructor' || property === '__proto__') {
	      throw new RangeError("Calendar fields cannot be named ".concat(property));
	    }
	    if (property !== previousProperty) {
	      let value = bag[property];
	      if (value !== undefined) {
	        any = true;
	        if (BUILTIN_CASTS.has(property)) {
	          value = BUILTIN_CASTS.get(property)(value);
	        } else if (extraFieldDescriptors) {
	          const matchingDescriptor = Call$4(ArrayPrototypeFind, extraFieldDescriptors, [desc => desc.property === property]);
	          if (matchingDescriptor) {
	            const convertor = matchingDescriptor.conversion;
	            value = convertor(value);
	          }
	        }
	        result[property] = value;
	      } else if (requiredFields !== 'partial') {
	        if (Call$4(ArrayIncludes$1, requiredFields, [property])) {
	          throw new TypeError("required property '".concat(property, "' missing or undefined"));
	        }
	        value = BUILTIN_DEFAULTS.get(property);
	        result[property] = value;
	      }
	    } else if (duplicateBehaviour === 'throw') {
	      throw new RangeError('Duplicate calendar fields');
	    }
	    previousProperty = property;
	  }
	  if (requiredFields === 'partial' && !any) {
	    throw new TypeError(emptySourceErrorMessage);
	  }
	  return result;
	}
	function ToTemporalTimeRecord(bag) {
	  let completeness = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'complete';
	  const fields = ['hour', 'microsecond', 'millisecond', 'minute', 'nanosecond', 'second'];
	  const partial = PrepareTemporalFields(bag, fields, 'partial', undefined, undefined, {
	    emptySourceErrorMessage: 'invalid time-like'
	  });
	  const result = {};
	  for (let index = 0; index < fields.length; index++) {
	    const field = fields[index];
	    const valueDesc = ObjectGetOwnPropertyDescriptor(partial, field);
	    if (valueDesc !== undefined) {
	      result[field] = valueDesc.value;
	    } else if (completeness === 'complete') {
	      result[field] = 0;
	    }
	  }
	  return result;
	}
	function ToTemporalDate(item, options) {
	  if (options !== undefined) options = SnapshotOwnProperties(GetOptionsObject(options), null);
	  if (Type$d(item) === 'Object') {
	    if (IsTemporalDate(item)) return item;
	    if (IsTemporalZonedDateTime(item)) {
	      ToTemporalOverflow(options); // validate and ignore
	      const timeZoneRec = new TimeZoneMethodRecord(GetSlot(item, TIME_ZONE), ['getOffsetNanosecondsFor']);
	      item = GetPlainDateTimeFor(timeZoneRec, GetSlot(item, INSTANT), GetSlot(item, CALENDAR));
	      return CreateTemporalDate(GetSlot(item, ISO_YEAR), GetSlot(item, ISO_MONTH), GetSlot(item, ISO_DAY), GetSlot(item, CALENDAR));
	    }
	    if (IsTemporalDateTime(item)) {
	      ToTemporalOverflow(options); // validate and ignore
	      return CreateTemporalDate(GetSlot(item, ISO_YEAR), GetSlot(item, ISO_MONTH), GetSlot(item, ISO_DAY), GetSlot(item, CALENDAR));
	    }
	    const calendarRec = new CalendarMethodRecord(GetTemporalCalendarSlotValueWithISODefault(item), ['dateFromFields', 'fields']);
	    const fieldNames = CalendarFields(calendarRec, ['day', 'month', 'monthCode', 'year']);
	    const fields = PrepareTemporalFields(item, fieldNames, []);
	    return CalendarDateFromFields(calendarRec, fields, options);
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
	  if (!IsBuiltinCalendar(calendar)) throw new RangeError("invalid calendar identifier ".concat(calendar));
	  calendar = ASCIILowercase(calendar);
	  ToTemporalOverflow(options); // validate and ignore
	  return CreateTemporalDate(year, month, day, calendar);
	}
	function InterpretTemporalDateTimeFields(calendarRec, fields, options) {
	  // dateFromFields must be looked up
	  let {
	    hour,
	    minute,
	    second,
	    millisecond,
	    microsecond,
	    nanosecond
	  } = ToTemporalTimeRecord(fields);
	  const overflow = ToTemporalOverflow(options);
	  options.overflow = overflow; // options is always an internal object, so not observable
	  const date = CalendarDateFromFields(calendarRec, fields, options);
	  const year = GetSlot(date, ISO_YEAR);
	  const month = GetSlot(date, ISO_MONTH);
	  const day = GetSlot(date, ISO_DAY);
	  ({
	    hour,
	    minute,
	    second,
	    millisecond,
	    microsecond,
	    nanosecond
	  } = RegulateTime(hour, minute, second, millisecond, microsecond, nanosecond, overflow));
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
	function ToTemporalDateTime(item, options) {
	  let year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar;
	  const resolvedOptions = SnapshotOwnProperties(GetOptionsObject(options), null);
	  if (Type$d(item) === 'Object') {
	    if (IsTemporalDateTime(item)) return item;
	    if (IsTemporalZonedDateTime(item)) {
	      ToTemporalOverflow(resolvedOptions); // validate and ignore
	      const timeZoneRec = new TimeZoneMethodRecord(GetSlot(item, TIME_ZONE), ['getOffsetNanosecondsFor']);
	      return GetPlainDateTimeFor(timeZoneRec, GetSlot(item, INSTANT), GetSlot(item, CALENDAR));
	    }
	    if (IsTemporalDate(item)) {
	      ToTemporalOverflow(resolvedOptions); // validate and ignore
	      return CreateTemporalDateTime(GetSlot(item, ISO_YEAR), GetSlot(item, ISO_MONTH), GetSlot(item, ISO_DAY), 0, 0, 0, 0, 0, 0, GetSlot(item, CALENDAR));
	    }
	    calendar = GetTemporalCalendarSlotValueWithISODefault(item);
	    const calendarRec = new CalendarMethodRecord(calendar, ['dateFromFields', 'fields']);
	    const fieldNames = CalendarFields(calendarRec, ['day', 'month', 'monthCode', 'year']);
	    Call$4(ArrayPrototypePush$3, fieldNames, ['hour', 'microsecond', 'millisecond', 'minute', 'nanosecond', 'second']);
	    const fields = PrepareTemporalFields(item, fieldNames, []);
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
	    } = InterpretTemporalDateTimeFields(calendarRec, fields, resolvedOptions));
	  } else {
	    let z;
	    ({
	      year,
	      month,
	      day,
	      hour,
	      minute,
	      second,
	      millisecond,
	      microsecond,
	      nanosecond,
	      calendar,
	      z
	    } = ParseTemporalDateTimeString(RequireString(item)));
	    if (z) throw new RangeError('Z designator not supported for PlainDateTime');
	    RejectDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
	    if (!calendar) calendar = 'iso8601';
	    if (!IsBuiltinCalendar(calendar)) throw new RangeError("invalid calendar identifier ".concat(calendar));
	    calendar = ASCIILowercase(calendar);
	    ToTemporalOverflow(resolvedOptions); // validate and ignore
	  }
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
	  if (Type$d(item === 'Object')) {
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
	    hour,
	    minute,
	    second,
	    millisecond,
	    microsecond,
	    nanosecond,
	    offset,
	    z
	  } = ParseTemporalInstantString(RequireString(item));

	  // ParseTemporalInstantString ensures that either `z` is true or or `offset` is non-undefined
	  const offsetNanoseconds = z ? 0 : ParseDateTimeUTCOffset(offset);
	  const epochNanoseconds = GetUTCEpochNanoseconds(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, offsetNanoseconds);
	  ValidateEpochNanoseconds(epochNanoseconds);
	  const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
	  return new TemporalInstant(epochNanoseconds);
	}
	function ToTemporalMonthDay(item, options) {
	  if (options !== undefined) options = SnapshotOwnProperties(GetOptionsObject(options), null);
	  if (Type$d(item) === 'Object') {
	    if (IsTemporalMonthDay(item)) return item;
	    let calendar;
	    if (HasSlot(item, CALENDAR)) {
	      calendar = GetSlot(item, CALENDAR);
	    } else {
	      calendar = item.calendar;
	      if (calendar === undefined) calendar = 'iso8601';
	      calendar = ToTemporalCalendarSlotValue(calendar);
	    }
	    const calendarRec = new CalendarMethodRecord(calendar, ['fields', 'monthDayFromFields']);
	    const fieldNames = CalendarFields(calendarRec, ['day', 'month', 'monthCode', 'year']);
	    const fields = PrepareTemporalFields(item, fieldNames, []);
	    return CalendarMonthDayFromFields(calendarRec, fields, options);
	  }
	  let {
	    month,
	    day,
	    referenceISOYear,
	    calendar
	  } = ParseTemporalMonthDayString(RequireString(item));
	  if (calendar === undefined) calendar = 'iso8601';
	  if (!IsBuiltinCalendar(calendar)) throw new RangeError("invalid calendar identifier ".concat(calendar));
	  calendar = ASCIILowercase(calendar);
	  ToTemporalOverflow(options); // validate and ignore

	  if (referenceISOYear === undefined) {
	    if (calendar !== 'iso8601') {
	      throw new Error("assertion failed: missing year with non-\"iso8601\" calendar identifier ".concat(calendar));
	    }
	    RejectISODate(1972, month, day);
	    return CreateTemporalMonthDay(month, day, calendar);
	  }
	  const result = CreateTemporalMonthDay(month, day, calendar, referenceISOYear);
	  const calendarRec = new CalendarMethodRecord(calendar, ['monthDayFromFields']);
	  return CalendarMonthDayFromFields(calendarRec, result);
	}
	function ToTemporalTime(item) {
	  let overflow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'constrain';
	  let hour, minute, second, millisecond, microsecond, nanosecond;
	  if (Type$d(item) === 'Object') {
	    if (IsTemporalTime(item)) return item;
	    if (IsTemporalZonedDateTime(item)) {
	      const timeZoneRec = new TimeZoneMethodRecord(GetSlot(item, TIME_ZONE), ['getOffsetNanosecondsFor']);
	      item = GetPlainDateTimeFor(timeZoneRec, GetSlot(item, INSTANT), GetSlot(item, CALENDAR));
	    }
	    if (IsTemporalDateTime(item)) {
	      const TemporalPlainTime = GetIntrinsic('%Temporal.PlainTime%');
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
	  }
	  const TemporalPlainTime = GetIntrinsic('%Temporal.PlainTime%');
	  return new TemporalPlainTime(hour, minute, second, millisecond, microsecond, nanosecond);
	}
	function ToTemporalTimeOrMidnight(item) {
	  const TemporalPlainTime = GetIntrinsic('%Temporal.PlainTime%');
	  if (item === undefined) return new TemporalPlainTime();
	  return ToTemporalTime(item);
	}
	function ToTemporalYearMonth(item, options) {
	  if (options !== undefined) options = SnapshotOwnProperties(GetOptionsObject(options), null);
	  if (Type$d(item) === 'Object') {
	    if (IsTemporalYearMonth(item)) return item;
	    const calendar = GetTemporalCalendarSlotValueWithISODefault(item);
	    const calendarRec = new CalendarMethodRecord(calendar, ['fields', 'yearMonthFromFields']);
	    const fieldNames = CalendarFields(calendarRec, ['month', 'monthCode', 'year']);
	    const fields = PrepareTemporalFields(item, fieldNames, []);
	    return CalendarYearMonthFromFields(calendarRec, fields, options);
	  }
	  let {
	    year,
	    month,
	    referenceISODay,
	    calendar
	  } = ParseTemporalYearMonthString(RequireString(item));
	  if (calendar === undefined) calendar = 'iso8601';
	  if (!IsBuiltinCalendar(calendar)) throw new RangeError("invalid calendar identifier ".concat(calendar));
	  calendar = ASCIILowercase(calendar);
	  ToTemporalOverflow(options); // validate and ignore

	  const result = CreateTemporalYearMonth(year, month, calendar, referenceISODay);
	  const calendarRec = new CalendarMethodRecord(calendar, ['yearMonthFromFields']);
	  return CalendarYearMonthFromFields(calendarRec, result);
	}
	function InterpretISODateTimeOffset(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, offsetBehaviour, offsetNs, timeZoneRec, disambiguation, offsetOpt, matchMinute) {
	  // getPossibleInstantsFor and getOffsetNanosecondsFor should be looked up.
	  const dt = CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, 'iso8601');
	  if (offsetBehaviour === 'wall' || offsetOpt === 'ignore') {
	    // Simple case: ISO string without a TZ offset (or caller wants to ignore
	    // the offset), so just convert DateTime to Instant in the given time zone
	    const instant = GetInstantFor(timeZoneRec, dt, disambiguation);
	    return GetSlot(instant, EPOCHNANOSECONDS);
	  }

	  // The caller wants the offset to always win ('use') OR the caller is OK
	  // with the offset winning ('prefer' or 'reject') as long as it's valid
	  // for this timezone and date/time.
	  if (offsetBehaviour === 'exact' || offsetOpt === 'use') {
	    // Calculate the instant for the input's date/time and offset
	    const epochNs = GetUTCEpochNanoseconds(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, offsetNs);
	    ValidateEpochNanoseconds(epochNs);
	    return epochNs;
	  }

	  // "prefer" or "reject"
	  const possibleInstants = GetPossibleInstantsFor(timeZoneRec, dt);
	  if (possibleInstants.length > 0) {
	    for (let index = 0; index < possibleInstants.length; index++) {
	      const candidate = possibleInstants[index];
	      const candidateOffset = GetOffsetNanosecondsFor(timeZoneRec, candidate);
	      const roundedCandidateOffset = RoundNumberToIncrement(bigInt(candidateOffset), 60e9, 'halfExpand').toJSNumber();
	      if (candidateOffset === offsetNs || matchMinute && roundedCandidateOffset === offsetNs) {
	        return GetSlot(candidate, EPOCHNANOSECONDS);
	      }
	    }
	  }

	  // the user-provided offset doesn't match any instants for this time
	  // zone and date/time.
	  if (offsetOpt === 'reject') {
	    const offsetStr = FormatUTCOffsetNanoseconds(offsetNs);
	    const timeZoneString = IsTemporalTimeZone(timeZoneRec.receiver) ? GetSlot(timeZoneRec.receiver, TIMEZONE_ID) : typeof timeZoneRec.receiver === 'string' ? timeZoneRec.receiver : 'time zone';
	    throw new RangeError("Offset ".concat(offsetStr, " is invalid for ").concat(dt, " in ").concat(timeZoneString));
	  }
	  // fall through: offsetOpt === 'prefer', but the offset doesn't match
	  // so fall back to use the time zone instead.
	  const instant = DisambiguatePossibleInstants(possibleInstants, timeZoneRec, dt, disambiguation);
	  return GetSlot(instant, EPOCHNANOSECONDS);
	}
	function ToTemporalZonedDateTime(item, options) {
	  let year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, timeZone, offset, calendar;
	  const resolvedOptions = SnapshotOwnProperties(GetOptionsObject(options), null);
	  let disambiguation, offsetOpt;
	  let matchMinute = false;
	  let offsetBehaviour = 'option';
	  if (Type$d(item) === 'Object') {
	    if (IsTemporalZonedDateTime(item)) return item;
	    calendar = GetTemporalCalendarSlotValueWithISODefault(item);
	    const calendarRec = new CalendarMethodRecord(calendar, ['dateFromFields', 'fields']);
	    const fieldNames = CalendarFields(calendarRec, ['day', 'month', 'monthCode', 'year']);
	    Call$4(ArrayPrototypePush$3, fieldNames, ['hour', 'microsecond', 'millisecond', 'minute', 'nanosecond', 'offset', 'second', 'timeZone']);
	    const fields = PrepareTemporalFields(item, fieldNames, ['timeZone']);
	    timeZone = ToTemporalTimeZoneSlotValue(fields.timeZone);
	    offset = fields.offset;
	    if (offset === undefined) {
	      offsetBehaviour = 'wall';
	    }
	    disambiguation = ToTemporalDisambiguation(resolvedOptions);
	    offsetOpt = ToTemporalOffset(resolvedOptions, 'reject');
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
	    } = InterpretTemporalDateTimeFields(calendarRec, fields, resolvedOptions));
	  } else {
	    let tzAnnotation, z;
	    ({
	      year,
	      month,
	      day,
	      hour,
	      minute,
	      second,
	      millisecond,
	      microsecond,
	      nanosecond,
	      tzAnnotation,
	      offset,
	      z,
	      calendar
	    } = ParseTemporalZonedDateTimeString(RequireString(item)));
	    timeZone = ToTemporalTimeZoneSlotValue(tzAnnotation);
	    if (z) {
	      offsetBehaviour = 'exact';
	    } else if (!offset) {
	      offsetBehaviour = 'wall';
	    }
	    if (!calendar) calendar = 'iso8601';
	    if (!IsBuiltinCalendar(calendar)) throw new RangeError("invalid calendar identifier ".concat(calendar));
	    calendar = ASCIILowercase(calendar);
	    matchMinute = true; // ISO strings may specify offset with less precision
	    disambiguation = ToTemporalDisambiguation(resolvedOptions);
	    offsetOpt = ToTemporalOffset(resolvedOptions, 'reject');
	    ToTemporalOverflow(resolvedOptions); // validate and ignore
	  }
	  let offsetNs = 0;
	  if (offsetBehaviour === 'option') offsetNs = ParseDateTimeUTCOffset(offset);
	  const timeZoneRec = new TimeZoneMethodRecord(timeZone, ['getOffsetNanosecondsFor', 'getPossibleInstantsFor']);
	  const epochNanoseconds = InterpretISODateTimeOffset(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, offsetBehaviour, offsetNs, timeZoneRec, disambiguation, offsetOpt, matchMinute);
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
	    let repr = TemporalDateToString(result, 'never');
	    if (typeof calendar === 'string') {
	      repr += MaybeFormatCalendarAnnotation(calendar, 'auto');
	    } else {
	      repr += '[u-ca=<calendar object>]';
	    }
	    ObjectDefineProperty$1(result, '_repr_', {
	      value: "Temporal.PlainDate <".concat(repr, ">"),
	      writable: false,
	      enumerable: false,
	      configurable: false
	    });
	  }
	}
	function CreateTemporalDate(isoYear, isoMonth, isoDay) {
	  let calendar = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'iso8601';
	  const TemporalPlainDate = GetIntrinsic('%Temporal.PlainDate%');
	  const result = ObjectCreate$7(TemporalPlainDate.prototype);
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
	    let repr = TemporalDateTimeToString(result, 'auto', 'never');
	    if (typeof calendar === 'string') {
	      repr += MaybeFormatCalendarAnnotation(calendar, 'auto');
	    } else {
	      repr += '[u-ca=<calendar object>]';
	    }
	    Object.defineProperty(result, '_repr_', {
	      value: "Temporal.PlainDateTime <".concat(repr, ">"),
	      writable: false,
	      enumerable: false,
	      configurable: false
	    });
	  }
	}
	function CreateTemporalDateTime(isoYear, isoMonth, isoDay, h, min, s, ms, µs, ns) {
	  let calendar = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : 'iso8601';
	  const TemporalPlainDateTime = GetIntrinsic('%Temporal.PlainDateTime%');
	  const result = ObjectCreate$7(TemporalPlainDateTime.prototype);
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
	    let repr = TemporalMonthDayToString(result, 'never');
	    if (typeof calendar === 'string') {
	      repr += MaybeFormatCalendarAnnotation(calendar, 'auto');
	    } else {
	      repr += '[u-ca=<calendar object>]';
	    }
	    Object.defineProperty(result, '_repr_', {
	      value: "Temporal.PlainMonthDay <".concat(repr, ">"),
	      writable: false,
	      enumerable: false,
	      configurable: false
	    });
	  }
	}
	function CreateTemporalMonthDay(isoMonth, isoDay) {
	  let calendar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'iso8601';
	  let referenceISOYear = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1972;
	  const TemporalPlainMonthDay = GetIntrinsic('%Temporal.PlainMonthDay%');
	  const result = ObjectCreate$7(TemporalPlainMonthDay.prototype);
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
	    let repr = TemporalYearMonthToString(result, 'never');
	    if (typeof calendar === 'string') {
	      repr += MaybeFormatCalendarAnnotation(calendar, 'auto');
	    } else {
	      repr += '[u-ca=<calendar object>]';
	    }
	    Object.defineProperty(result, '_repr_', {
	      value: "Temporal.PlainYearMonth <".concat(repr, ">"),
	      writable: false,
	      enumerable: false,
	      configurable: false
	    });
	  }
	}
	function CreateTemporalYearMonth(isoYear, isoMonth) {
	  let calendar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'iso8601';
	  let referenceISODay = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
	  const TemporalPlainYearMonth = GetIntrinsic('%Temporal.PlainYearMonth%');
	  const result = ObjectCreate$7(TemporalPlainYearMonth.prototype);
	  CreateTemporalYearMonthSlots(result, isoYear, isoMonth, calendar, referenceISODay);
	  return result;
	}
	function CreateTemporalZonedDateTimeSlots(result, epochNanoseconds, timeZone, calendar) {
	  ValidateEpochNanoseconds(epochNanoseconds);
	  CreateSlots(result);
	  SetSlot(result, EPOCHNANOSECONDS, epochNanoseconds);
	  SetSlot(result, TIME_ZONE, timeZone);
	  SetSlot(result, CALENDAR, calendar);
	  const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
	  const instant = new TemporalInstant(GetSlot(result, EPOCHNANOSECONDS));
	  SetSlot(result, INSTANT, instant);
	  {
	    let repr;
	    if (typeof timeZone === 'string') {
	      let offsetNs;
	      const offsetMinutes = ParseTimeZoneIdentifier(timeZone).offsetMinutes;
	      if (offsetMinutes !== undefined) {
	        offsetNs = offsetMinutes * 60e9;
	      } else {
	        offsetNs = GetNamedTimeZoneOffsetNanoseconds(timeZone, epochNanoseconds);
	      }
	      const dateTime = GetPlainDateTimeFor(undefined, instant, 'iso8601', offsetNs);
	      repr = TemporalDateTimeToString(dateTime, 'auto', 'never');
	      repr += FormatDateTimeUTCOffsetRounded(offsetNs);
	      repr += "[".concat(timeZone, "]");
	    } else {
	      const dateTime = GetPlainDateTimeFor(undefined, instant, 'iso8601', 0);
	      repr = TemporalDateTimeToString(dateTime, 'auto', 'never') + 'Z[<time zone object>]';
	    }
	    if (typeof calendar === 'string') {
	      repr += MaybeFormatCalendarAnnotation(calendar, 'auto');
	    } else {
	      repr += '[u-ca=<calendar object>]';
	    }
	    Object.defineProperty(result, '_repr_', {
	      value: "Temporal.ZonedDateTime <".concat(repr, ">"),
	      writable: false,
	      enumerable: false,
	      configurable: false
	    });
	  }
	}
	function CreateTemporalZonedDateTime(epochNanoseconds, timeZone) {
	  let calendar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'iso8601';
	  const TemporalZonedDateTime = GetIntrinsic('%Temporal.ZonedDateTime%');
	  const result = ObjectCreate$7(TemporalZonedDateTime.prototype);
	  CreateTemporalZonedDateTimeSlots(result, epochNanoseconds, timeZone, calendar);
	  return result;
	}
	function CalendarFields(calendarRec, fieldNames) {
	  // Special-case built-in method, because we should skip the observable array
	  // iteration in Calendar.prototype.fields
	  if (calendarRec.isBuiltIn()) {
	    if (calendarRec.receiver === 'iso8601') return fieldNames;
	    return GetIntrinsic('%calendarFieldsImpl%')(calendarRec.receiver, fieldNames);
	  }
	  fieldNames = calendarRec.fields(fieldNames);
	  const result = [];
	  for (const name of fieldNames) {
	    if (Type$d(name) !== 'String') throw new TypeError('bad return from calendar.fields()');
	    Call$4(ArrayPrototypePush$3, result, [name]);
	  }
	  return result;
	}
	function CalendarMergeFields(calendarRec, fields, additionalFields) {
	  const result = calendarRec.mergeFields(fields, additionalFields);
	  if (!calendarRec.isBuiltIn() && Type$d(result) !== 'Object') {
	    throw new TypeError('bad return from calendar.mergeFields()');
	  }
	  return result;
	}
	function CalendarDateAdd(calendarRec, date, duration, options) {
	  const result = calendarRec.dateAdd(date, duration, options);
	  if (!calendarRec.isBuiltIn() && !IsTemporalDate(result)) throw new TypeError('invalid result');
	  return result;
	}
	function CalendarDateUntil(calendarRec, date, otherDate, options) {
	  const result = calendarRec.dateUntil(date, otherDate, options);
	  if (!calendarRec.isBuiltIn() && !IsTemporalDuration(result)) throw new TypeError('invalid result');
	  return result;
	}
	function CalendarYear(calendar, dateLike) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$4(GetIntrinsic('%Temporal.Calendar.prototype.year%'), calendar, [dateLike]);
	  }
	  const year = GetMethod$4(calendar, 'year');
	  const result = Call$4(year, calendar, [dateLike]);
	  if (typeof result !== 'number') {
	    throw new TypeError('calendar year result must be an integer');
	  }
	  if (!IsIntegralNumber$1(result)) {
	    throw new RangeError('calendar year result must be an integer');
	  }
	  return result;
	}
	function CalendarMonth(calendar, dateLike) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$4(GetIntrinsic('%Temporal.Calendar.prototype.month%'), calendar, [dateLike]);
	  }
	  const month = GetMethod$4(calendar, 'month');
	  const result = Call$4(month, calendar, [dateLike]);
	  if (typeof result !== 'number') {
	    throw new TypeError('calendar month result must be a positive integer');
	  }
	  if (!IsIntegralNumber$1(result) || result < 1) {
	    throw new RangeError('calendar month result must be a positive integer');
	  }
	  return result;
	}
	function CalendarMonthCode(calendar, dateLike) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$4(GetIntrinsic('%Temporal.Calendar.prototype.monthCode%'), calendar, [dateLike]);
	  }
	  const monthCode = GetMethod$4(calendar, 'monthCode');
	  const result = Call$4(monthCode, calendar, [dateLike]);
	  if (typeof result !== 'string') {
	    throw new TypeError('calendar monthCode result must be a string');
	  }
	  return result;
	}
	function CalendarDay(calendarRec, dateLike) {
	  const result = calendarRec.day(dateLike);
	  // No validation needed for built-in method
	  if (calendarRec.isBuiltIn()) return result;
	  if (typeof result !== 'number') {
	    throw new TypeError('calendar day result must be a positive integer');
	  }
	  if (!IsIntegralNumber$1(result) || result < 1) {
	    throw new RangeError('calendar day result must be a positive integer');
	  }
	  return result;
	}
	function CalendarEra(calendar, dateLike) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$4(GetIntrinsic('%Temporal.Calendar.prototype.era%'), calendar, [dateLike]);
	  }
	  const era = GetMethod$4(calendar, 'era');
	  let result = Call$4(era, calendar, [dateLike]);
	  if (result === undefined) {
	    return result;
	  }
	  if (typeof result !== 'string') {
	    throw new TypeError('calendar era result must be a string or undefined');
	  }
	  return result;
	}
	function CalendarEraYear(calendar, dateLike) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$4(GetIntrinsic('%Temporal.Calendar.prototype.eraYear%'), calendar, [dateLike]);
	  }
	  const eraYear = GetMethod$4(calendar, 'eraYear');
	  let result = Call$4(eraYear, calendar, [dateLike]);
	  if (result === undefined) {
	    return result;
	  }
	  if (typeof result !== 'number') {
	    throw new TypeError('calendar eraYear result must be an integer or undefined');
	  }
	  if (!IsIntegralNumber$1(result)) {
	    throw new RangeError('calendar eraYear result must be an integer or undefined');
	  }
	  return result;
	}
	function CalendarDayOfWeek(calendar, dateLike) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$4(GetIntrinsic('%Temporal.Calendar.prototype.dayOfWeek%'), calendar, [dateLike]);
	  }
	  const dayOfWeek = GetMethod$4(calendar, 'dayOfWeek');
	  const result = Call$4(dayOfWeek, calendar, [dateLike]);
	  if (typeof result !== 'number') {
	    throw new TypeError('calendar dayOfWeek result must be a positive integer');
	  }
	  if (!IsIntegralNumber$1(result) || result < 1) {
	    throw new RangeError('calendar dayOfWeek result must be a positive integer');
	  }
	  return result;
	}
	function CalendarDayOfYear(calendar, dateLike) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$4(GetIntrinsic('%Temporal.Calendar.prototype.dayOfYear%'), calendar, [dateLike]);
	  }
	  const dayOfYear = GetMethod$4(calendar, 'dayOfYear');
	  const result = Call$4(dayOfYear, calendar, [dateLike]);
	  if (typeof result !== 'number') {
	    throw new TypeError('calendar dayOfYear result must be a positive integer');
	  }
	  if (!IsIntegralNumber$1(result) || result < 1) {
	    throw new RangeError('calendar dayOfYear result must be a positive integer');
	  }
	  return result;
	}
	function CalendarWeekOfYear(calendar, dateLike) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$4(GetIntrinsic('%Temporal.Calendar.prototype.weekOfYear%'), calendar, [dateLike]);
	  }
	  const weekOfYear = GetMethod$4(calendar, 'weekOfYear');
	  const result = Call$4(weekOfYear, calendar, [dateLike]);
	  if (typeof result !== 'number' && result !== undefined) {
	    throw new TypeError('calendar weekOfYear result must be a positive integer');
	  }
	  if ((!IsIntegralNumber$1(result) || result < 1) && result !== undefined) {
	    throw new RangeError('calendar weekOfYear result must be a positive integer');
	  }
	  return result;
	}
	function CalendarYearOfWeek(calendar, dateLike) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$4(GetIntrinsic('%Temporal.Calendar.prototype.yearOfWeek%'), calendar, [dateLike]);
	  }
	  const yearOfWeek = GetMethod$4(calendar, 'yearOfWeek');
	  const result = Call$4(yearOfWeek, calendar, [dateLike]);
	  if (typeof result !== 'number' && result !== undefined) {
	    throw new TypeError('calendar yearOfWeek result must be an integer');
	  }
	  if (!IsIntegralNumber$1(result) && result !== undefined) {
	    throw new RangeError('calendar yearOfWeek result must be an integer');
	  }
	  return result;
	}
	function CalendarDaysInWeek(calendar, dateLike) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$4(GetIntrinsic('%Temporal.Calendar.prototype.daysInWeek%'), calendar, [dateLike]);
	  }
	  const daysInWeek = GetMethod$4(calendar, 'daysInWeek');
	  const result = Call$4(daysInWeek, calendar, [dateLike]);
	  if (typeof result !== 'number') {
	    throw new TypeError('calendar daysInWeek result must be a positive integer');
	  }
	  if (!IsIntegralNumber$1(result) || result < 1) {
	    throw new RangeError('calendar daysInWeek result must be a positive integer');
	  }
	  return result;
	}
	function CalendarDaysInMonth(calendar, dateLike) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$4(GetIntrinsic('%Temporal.Calendar.prototype.daysInMonth%'), calendar, [dateLike]);
	  }
	  const daysInMonth = GetMethod$4(calendar, 'daysInMonth');
	  const result = Call$4(daysInMonth, calendar, [dateLike]);
	  if (typeof result !== 'number') {
	    throw new TypeError('calendar daysInMonth result must be a positive integer');
	  }
	  if (!IsIntegralNumber$1(result) || result < 1) {
	    throw new RangeError('calendar daysInMonth result must be a positive integer');
	  }
	  return result;
	}
	function CalendarDaysInYear(calendar, dateLike) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$4(GetIntrinsic('%Temporal.Calendar.prototype.daysInYear%'), calendar, [dateLike]);
	  }
	  const daysInYear = GetMethod$4(calendar, 'daysInYear');
	  const result = Call$4(daysInYear, calendar, [dateLike]);
	  if (typeof result !== 'number') {
	    throw new TypeError('calendar daysInYear result must be a positive integer');
	  }
	  if (!IsIntegralNumber$1(result) || result < 1) {
	    throw new RangeError('calendar daysInYear result must be a positive integer');
	  }
	  return result;
	}
	function CalendarMonthsInYear(calendar, dateLike) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$4(GetIntrinsic('%Temporal.Calendar.prototype.monthsInYear%'), calendar, [dateLike]);
	  }
	  const monthsInYear = GetMethod$4(calendar, 'monthsInYear');
	  const result = Call$4(monthsInYear, calendar, [dateLike]);
	  if (typeof result !== 'number') {
	    throw new TypeError('calendar monthsInYear result must be a positive integer');
	  }
	  if (!IsIntegralNumber$1(result) || result < 1) {
	    throw new RangeError('calendar monthsInYear result must be a positive integer');
	  }
	  return result;
	}
	function CalendarInLeapYear(calendar, dateLike) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$4(GetIntrinsic('%Temporal.Calendar.prototype.inLeapYear%'), calendar, [dateLike]);
	  }
	  const inLeapYear = GetMethod$4(calendar, 'inLeapYear');
	  const result = Call$4(inLeapYear, calendar, [dateLike]);
	  if (typeof result !== 'boolean') {
	    throw new TypeError('calendar inLeapYear result must be a boolean');
	  }
	  return result;
	}
	function ObjectImplementsTemporalCalendarProtocol(object) {
	  if (IsTemporalCalendar(object)) return true;
	  return 'dateAdd' in object && 'dateFromFields' in object && 'dateUntil' in object && 'day' in object && 'dayOfWeek' in object && 'dayOfYear' in object && 'daysInMonth' in object && 'daysInWeek' in object && 'daysInYear' in object && 'fields' in object && 'id' in object && 'inLeapYear' in object && 'mergeFields' in object && 'month' in object && 'monthCode' in object && 'monthDayFromFields' in object && 'monthsInYear' in object && 'weekOfYear' in object && 'year' in object && 'yearMonthFromFields' in object && 'yearOfWeek' in object;
	}
	function ToTemporalCalendarSlotValue(calendarLike) {
	  if (Type$d(calendarLike) === 'Object') {
	    if (HasSlot(calendarLike, CALENDAR)) return GetSlot(calendarLike, CALENDAR);
	    if (!ObjectImplementsTemporalCalendarProtocol(calendarLike)) {
	      throw new TypeError('expected a Temporal.Calendar or object implementing the Temporal.Calendar protocol');
	    }
	    return calendarLike;
	  }
	  const identifier = RequireString(calendarLike);
	  if (IsBuiltinCalendar(identifier)) return ASCIILowercase(identifier);
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
	  if (!IsBuiltinCalendar(calendar)) throw new RangeError("invalid calendar identifier ".concat(calendar));
	  return ASCIILowercase(calendar);
	}
	function GetTemporalCalendarSlotValueWithISODefault(item) {
	  if (HasSlot(item, CALENDAR)) return GetSlot(item, CALENDAR);
	  const {
	    calendar
	  } = item;
	  if (calendar === undefined) return 'iso8601';
	  return ToTemporalCalendarSlotValue(calendar);
	}
	function ToTemporalCalendarIdentifier(slotValue) {
	  if (typeof slotValue === 'string') return slotValue;
	  const result = slotValue.id;
	  if (typeof result !== 'string') throw new TypeError('calendar.id should be a string');
	  return result;
	}
	function ToTemporalCalendarObject(slotValue) {
	  if (Type$d(slotValue) === 'Object') return slotValue;
	  const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	  return new TemporalCalendar(slotValue);
	}
	function CalendarEquals(one, two) {
	  if (one === two) return true;
	  const cal1 = ToTemporalCalendarIdentifier(one);
	  const cal2 = ToTemporalCalendarIdentifier(two);
	  return cal1 === cal2;
	}

	// This operation is not in the spec, it implements the following:
	// "If ? CalendarEquals(one, two) is false, throw a RangeError exception."
	// This is so that we can build an informative error message without
	// re-getting the .id properties.
	function ThrowIfCalendarsNotEqual(one, two, errorMessageAction) {
	  if (one === two) return;
	  const cal1 = ToTemporalCalendarIdentifier(one);
	  const cal2 = ToTemporalCalendarIdentifier(two);
	  if (cal1 !== cal2) {
	    throw new RangeError("cannot ".concat(errorMessageAction, " of ").concat(cal1, " and ").concat(cal2, " calendars"));
	  }
	}
	function ConsolidateCalendars(one, two) {
	  if (one === two) return two;
	  const sOne = ToTemporalCalendarIdentifier(one);
	  const sTwo = ToTemporalCalendarIdentifier(two);
	  if (sOne === sTwo || sOne === 'iso8601') {
	    return two;
	  } else if (sTwo === 'iso8601') {
	    return one;
	  } else {
	    throw new RangeError('irreconcilable calendars');
	  }
	}
	function CalendarDateFromFields(calendarRec, fields, options) {
	  const result = calendarRec.dateFromFields(fields, options);
	  if (!calendarRec.isBuiltIn() && !IsTemporalDate(result)) throw new TypeError('invalid result');
	  return result;
	}
	function CalendarYearMonthFromFields(calendarRec, fields, options) {
	  const result = calendarRec.yearMonthFromFields(fields, options);
	  if (!calendarRec.isBuiltIn() && !IsTemporalYearMonth(result)) throw new TypeError('invalid result');
	  return result;
	}
	function CalendarMonthDayFromFields(calendarRec, fields, options) {
	  const result = calendarRec.monthDayFromFields(fields, options);
	  if (!calendarRec.isBuiltIn() && !IsTemporalMonthDay(result)) throw new TypeError('invalid result');
	  return result;
	}
	function ObjectImplementsTemporalTimeZoneProtocol(object) {
	  if (IsTemporalTimeZone(object)) return true;
	  return 'getOffsetNanosecondsFor' in object && 'getPossibleInstantsFor' in object && 'id' in object;
	}
	function ToTemporalTimeZoneSlotValue(temporalTimeZoneLike) {
	  if (Type$d(temporalTimeZoneLike) === 'Object') {
	    if (IsTemporalZonedDateTime(temporalTimeZoneLike)) return GetSlot(temporalTimeZoneLike, TIME_ZONE);
	    if (!ObjectImplementsTemporalTimeZoneProtocol(temporalTimeZoneLike)) {
	      throw new TypeError('expected a Temporal.TimeZone or object implementing the Temporal.TimeZone protocol');
	    }
	    return temporalTimeZoneLike;
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
	  if (!record) throw new RangeError("Unrecognized time zone ".concat(tzName));
	  return record.identifier;
	}
	function ToTemporalTimeZoneIdentifier(slotValue) {
	  if (typeof slotValue === 'string') return slotValue;
	  const result = slotValue.id;
	  if (typeof result !== 'string') throw new TypeError('timeZone.id should be a string');
	  return result;
	}
	function ToTemporalTimeZoneObject(slotValue) {
	  if (Type$d(slotValue) === 'Object') return slotValue;
	  const TemporalTimeZone = GetIntrinsic('%Temporal.TimeZone%');
	  return new TemporalTimeZone(slotValue);
	}
	function TimeZoneEquals(one, two) {
	  if (one === two) return true;
	  const tz1 = ToTemporalTimeZoneIdentifier(one);
	  const tz2 = ToTemporalTimeZoneIdentifier(two);
	  if (tz1 === tz2) return true;
	  const offsetMinutes1 = ParseTimeZoneIdentifier(tz1).offsetMinutes;
	  const offsetMinutes2 = ParseTimeZoneIdentifier(tz2).offsetMinutes;
	  if (offsetMinutes1 === undefined && offsetMinutes2 === undefined) {
	    // Calling GetAvailableNamedTimeZoneIdentifier is costly, so (unlike the
	    // spec) the polyfill will early-return if one of them isn't recognized. Try
	    // the second ID first because it's more likely to be unknown, because it
	    // can come from the argument of TimeZone.p.equals as opposed to the first
	    // ID which comes from the receiver.
	    const idRecord2 = GetAvailableNamedTimeZoneIdentifier(tz2);
	    if (!idRecord2) return false;
	    const idRecord1 = GetAvailableNamedTimeZoneIdentifier(tz1);
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
	function GetOffsetNanosecondsFor(timeZoneRec, instant) {
	  const offsetNs = timeZoneRec.getOffsetNanosecondsFor(instant);
	  // No validation needed for built-in method
	  if (timeZoneRec.isBuiltIn()) return offsetNs;
	  if (typeof offsetNs !== 'number') {
	    throw new TypeError('bad return from getOffsetNanosecondsFor');
	  }
	  if (!IsIntegralNumber$1(offsetNs) || MathAbs$2(offsetNs) >= 86400e9) {
	    throw new RangeError('out-of-range return from getOffsetNanosecondsFor');
	  }
	  return offsetNs;
	}
	function GetOffsetStringFor(timeZoneRec, instant) {
	  const offsetNs = GetOffsetNanosecondsFor(timeZoneRec, instant);
	  return FormatUTCOffsetNanoseconds(offsetNs);
	}
	function FormatUTCOffsetNanoseconds(offsetNs) {
	  const sign = offsetNs < 0 ? '-' : '+';
	  const absoluteNs = MathAbs$2(offsetNs);
	  const hour = MathFloor$1(absoluteNs / 3600e9);
	  const minute = MathFloor$1(absoluteNs / 60e9) % 60;
	  const second = MathFloor$1(absoluteNs / 1e9) % 60;
	  const subSecondNs = absoluteNs % 1e9;
	  const precision = second === 0 && subSecondNs === 0 ? 'minute' : 'auto';
	  const timeString = FormatTimeString(hour, minute, second, subSecondNs, precision);
	  return "".concat(sign).concat(timeString);
	}
	function GetPlainDateTimeFor(timeZoneRec, instant, calendar) {
	  let precalculatedOffsetNs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
	  // Either getOffsetNanosecondsFor must be looked up, or
	  // precalculatedOffsetNs should be supplied
	  const ns = GetSlot(instant, EPOCHNANOSECONDS);
	  const offsetNs = precalculatedOffsetNs !== null && precalculatedOffsetNs !== void 0 ? precalculatedOffsetNs : GetOffsetNanosecondsFor(timeZoneRec, instant);
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
	  } = GetISOPartsFromEpoch(ns);
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
	  } = BalanceISODateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond + offsetNs));
	  return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
	}
	function GetInstantFor(timeZoneRec, dateTime, disambiguation) {
	  // getPossibleInstantsFor and getOffsetNanosecondsFor must be looked up.
	  const possibleInstants = GetPossibleInstantsFor(timeZoneRec, dateTime);
	  return DisambiguatePossibleInstants(possibleInstants, timeZoneRec, dateTime, disambiguation);
	}
	function DisambiguatePossibleInstants(possibleInstants, timeZoneRec, dateTime, disambiguation) {
	  // getPossibleInstantsFor must be looked up already.
	  // getOffsetNanosecondsFor must be be looked up if possibleInstants is empty
	  const Instant = GetIntrinsic('%Temporal.Instant%');
	  const numInstants = possibleInstants.length;
	  if (numInstants === 1) return possibleInstants[0];
	  if (numInstants) {
	    switch (disambiguation) {
	      case 'compatible':
	      // fall through because 'compatible' means 'earlier' for "fall back" transitions
	      case 'earlier':
	        return possibleInstants[0];
	      case 'later':
	        return possibleInstants[numInstants - 1];
	      case 'reject':
	        {
	          throw new RangeError('multiple instants found');
	        }
	    }
	  }
	  if (disambiguation === 'reject') throw new RangeError('multiple instants found');
	  const year = GetSlot(dateTime, ISO_YEAR);
	  const month = GetSlot(dateTime, ISO_MONTH);
	  const day = GetSlot(dateTime, ISO_DAY);
	  const hour = GetSlot(dateTime, ISO_HOUR);
	  const minute = GetSlot(dateTime, ISO_MINUTE);
	  const second = GetSlot(dateTime, ISO_SECOND);
	  const millisecond = GetSlot(dateTime, ISO_MILLISECOND);
	  const microsecond = GetSlot(dateTime, ISO_MICROSECOND);
	  const nanosecond = GetSlot(dateTime, ISO_NANOSECOND);
	  const utcns = GetUTCEpochNanoseconds(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);

	  // In the spec, range validation of `dayBefore` and `dayAfter` happens here.
	  // In the polyfill, it happens in the Instant constructor.
	  const dayBefore = new Instant(utcns.minus(DAY_NANOS));
	  const dayAfter = new Instant(utcns.plus(DAY_NANOS));
	  const offsetBefore = GetOffsetNanosecondsFor(timeZoneRec, dayBefore);
	  const offsetAfter = GetOffsetNanosecondsFor(timeZoneRec, dayAfter);
	  const nanoseconds = offsetAfter - offsetBefore;
	  if (MathAbs$2(nanoseconds) > DAY_NANOS) {
	    throw new RangeError('bad return from getOffsetNanosecondsFor: UTC offset shift longer than 24 hours');
	  }
	  switch (disambiguation) {
	    case 'earlier':
	      {
	        const norm = TimeDuration.normalize(0, 0, 0, 0, 0, -nanoseconds);
	        const earlierTime = AddTime(hour, minute, second, millisecond, microsecond, nanosecond, norm);
	        const earlierDate = BalanceISODate(year, month, day + earlierTime.deltaDays);
	        const earlierPlainDateTime = CreateTemporalDateTime(earlierDate.year, earlierDate.month, earlierDate.day, earlierTime.hour, earlierTime.minute, earlierTime.second, earlierTime.millisecond, earlierTime.microsecond, earlierTime.nanosecond);
	        return GetPossibleInstantsFor(timeZoneRec, earlierPlainDateTime)[0];
	      }
	    case 'compatible':
	    // fall through because 'compatible' means 'later' for "spring forward" transitions
	    case 'later':
	      {
	        const norm = TimeDuration.normalize(0, 0, 0, 0, 0, nanoseconds);
	        const laterTime = AddTime(hour, minute, second, millisecond, microsecond, nanosecond, norm);
	        const laterDate = BalanceISODate(year, month, day + laterTime.deltaDays);
	        const laterPlainDateTime = CreateTemporalDateTime(laterDate.year, laterDate.month, laterDate.day, laterTime.hour, laterTime.minute, laterTime.second, laterTime.millisecond, laterTime.microsecond, laterTime.nanosecond);
	        const possible = GetPossibleInstantsFor(timeZoneRec, laterPlainDateTime);
	        return possible[possible.length - 1];
	      }
	    case 'reject':
	      {
	        throw new Error('should not be reached: reject handled earlier');
	      }
	  }
	  throw new Error("assertion failed: invalid disambiguation value ".concat(disambiguation));
	}
	function GetPossibleInstantsFor(timeZoneRec, dateTime) {
	  const possibleInstants = timeZoneRec.getPossibleInstantsFor(dateTime);
	  // No validation needed for built-in method
	  if (timeZoneRec.isBuiltIn()) return possibleInstants;
	  const result = [];
	  for (const instant of possibleInstants) {
	    if (!IsTemporalInstant(instant)) {
	      throw new TypeError('bad return from getPossibleInstantsFor');
	    }
	    Call$4(ArrayPrototypePush$3, result, [instant]);
	  }
	  const numResults = result.length;
	  if (numResults > 1) {
	    const mapped = Call$4(ArrayPrototypeMap, result, [i => GetSlot(i, EPOCHNANOSECONDS)]);
	    const min = bigInt.min(...mapped);
	    const max = bigInt.max(...mapped);
	    if (bigInt(max).subtract(min).abs().greater(DAY_NANOS)) {
	      throw new RangeError('bad return from getPossibleInstantsFor: UTC offset shift longer than 24 hours');
	    }
	  }
	  return result;
	}
	function ISOYearString(year) {
	  let yearString;
	  if (year < 0 || year > 9999) {
	    const sign = year < 0 ? '-' : '+';
	    const yearNumber = MathAbs$2(year);
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
	    fraction = Call$4(StringPrototypeReplace, fractionFullPrecision, [/0+$/, '']);
	  } else {
	    if (precision === 0) return '';
	    const fractionFullPrecision = ToZeroPaddedDecimalString$1(subSecondNanoseconds, 9);
	    fraction = Call$4(StringPrototypeSlice, fractionFullPrecision, [0, precision]);
	  }
	  return ".".concat(fraction);
	}
	function FormatTimeString(hour, minute, second, subSecondNanoseconds, precision) {
	  let result = "".concat(ISODateTimePartString(hour), ":").concat(ISODateTimePartString(minute));
	  if (precision === 'minute') return result;
	  result += ":".concat(ISODateTimePartString(second));
	  result += FormatFractionalSeconds(subSecondNanoseconds, precision);
	  return result;
	}
	function TemporalInstantToString(instant, timeZone, precision) {
	  let outputTimeZone = timeZone;
	  if (outputTimeZone === undefined) outputTimeZone = 'UTC';
	  const timeZoneRec = new TimeZoneMethodRecord(outputTimeZone, ['getOffsetNanosecondsFor']);
	  const offsetNs = GetOffsetNanosecondsFor(timeZoneRec, instant);
	  const dateTime = GetPlainDateTimeFor(timeZoneRec, instant, 'iso8601', offsetNs);
	  const dateTimeString = TemporalDateTimeToString(dateTime, precision, 'never');
	  let timeZoneString = 'Z';
	  if (timeZone !== undefined) {
	    timeZoneString = FormatDateTimeUTCOffsetRounded(offsetNs);
	  }
	  return "".concat(dateTimeString).concat(timeZoneString);
	}
	function formatAsDecimalNumber(num) {
	  if (num <= NumberMaxSafeInteger) return num.toString(10);
	  return bigInt(num).toString();
	}
	function TemporalDurationToString(years, months, weeks, days, hours, minutes, normSeconds) {
	  let precision = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 'auto';
	  const sign = DurationSign(years, months, weeks, days, hours, minutes, normSeconds.sec, 0, 0, normSeconds.subsec);
	  let datePart = '';
	  if (years !== 0) datePart += "".concat(formatAsDecimalNumber(MathAbs$2(years)), "Y");
	  if (months !== 0) datePart += "".concat(formatAsDecimalNumber(MathAbs$2(months)), "M");
	  if (weeks !== 0) datePart += "".concat(formatAsDecimalNumber(MathAbs$2(weeks)), "W");
	  if (days !== 0) datePart += "".concat(formatAsDecimalNumber(MathAbs$2(days)), "D");
	  let timePart = '';
	  if (hours !== 0) timePart += "".concat(formatAsDecimalNumber(MathAbs$2(hours)), "H");
	  if (minutes !== 0) timePart += "".concat(formatAsDecimalNumber(MathAbs$2(minutes)), "M");
	  if (!normSeconds.isZero() || years === 0 && months === 0 && weeks === 0 && days === 0 && hours === 0 && minutes === 0 || precision !== 'auto') {
	    const secondsPart = formatAsDecimalNumber(MathAbs$2(normSeconds.sec));
	    const subSecondsPart = FormatFractionalSeconds(MathAbs$2(normSeconds.subsec), precision);
	    timePart += "".concat(secondsPart).concat(subSecondsPart, "S");
	  }
	  let result = "".concat(sign < 0 ? '-' : '', "P").concat(datePart);
	  if (timePart) result = "".concat(result, "T").concat(timePart);
	  return result;
	}
	function TemporalDateToString(date) {
	  let showCalendar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'auto';
	  const year = ISOYearString(GetSlot(date, ISO_YEAR));
	  const month = ISODateTimePartString(GetSlot(date, ISO_MONTH));
	  const day = ISODateTimePartString(GetSlot(date, ISO_DAY));
	  const calendar = MaybeFormatCalendarAnnotation(GetSlot(date, CALENDAR), showCalendar);
	  return "".concat(year, "-").concat(month, "-").concat(day).concat(calendar);
	}
	function TemporalDateTimeToString(dateTime, precision) {
	  let showCalendar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'auto';
	  let options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
	  let year = GetSlot(dateTime, ISO_YEAR);
	  let month = GetSlot(dateTime, ISO_MONTH);
	  let day = GetSlot(dateTime, ISO_DAY);
	  let hour = GetSlot(dateTime, ISO_HOUR);
	  let minute = GetSlot(dateTime, ISO_MINUTE);
	  let second = GetSlot(dateTime, ISO_SECOND);
	  let millisecond = GetSlot(dateTime, ISO_MILLISECOND);
	  let microsecond = GetSlot(dateTime, ISO_MICROSECOND);
	  let nanosecond = GetSlot(dateTime, ISO_NANOSECOND);
	  if (options) {
	    const {
	      unit,
	      increment,
	      roundingMode
	    } = options;
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
	    } = RoundISODateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, increment, unit, roundingMode));
	  }
	  const yearString = ISOYearString(year);
	  const monthString = ISODateTimePartString(month);
	  const dayString = ISODateTimePartString(day);
	  const subSecondNanoseconds = millisecond * 1e6 + microsecond * 1e3 + nanosecond;
	  const timeString = FormatTimeString(hour, minute, second, subSecondNanoseconds, precision);
	  const calendar = MaybeFormatCalendarAnnotation(GetSlot(dateTime, CALENDAR), showCalendar);
	  return "".concat(yearString, "-").concat(monthString, "-").concat(dayString, "T").concat(timeString).concat(calendar);
	}
	function TemporalMonthDayToString(monthDay) {
	  let showCalendar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'auto';
	  const month = ISODateTimePartString(GetSlot(monthDay, ISO_MONTH));
	  const day = ISODateTimePartString(GetSlot(monthDay, ISO_DAY));
	  let resultString = "".concat(month, "-").concat(day);
	  const calendar = GetSlot(monthDay, CALENDAR);
	  const calendarID = ToTemporalCalendarIdentifier(calendar);
	  if (showCalendar === 'always' || showCalendar === 'critical' || calendarID !== 'iso8601') {
	    const year = ISOYearString(GetSlot(monthDay, ISO_YEAR));
	    resultString = "".concat(year, "-").concat(resultString);
	  }
	  const calendarString = FormatCalendarAnnotation(calendarID, showCalendar);
	  if (calendarString) resultString += calendarString;
	  return resultString;
	}
	function TemporalYearMonthToString(yearMonth) {
	  let showCalendar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'auto';
	  const year = ISOYearString(GetSlot(yearMonth, ISO_YEAR));
	  const month = ISODateTimePartString(GetSlot(yearMonth, ISO_MONTH));
	  let resultString = "".concat(year, "-").concat(month);
	  const calendar = GetSlot(yearMonth, CALENDAR);
	  const calendarID = ToTemporalCalendarIdentifier(calendar);
	  if (showCalendar === 'always' || showCalendar === 'critical' || calendarID !== 'iso8601') {
	    const day = ISODateTimePartString(GetSlot(yearMonth, ISO_DAY));
	    resultString += "-".concat(day);
	  }
	  const calendarString = FormatCalendarAnnotation(calendarID, showCalendar);
	  if (calendarString) resultString += calendarString;
	  return resultString;
	}
	function TemporalZonedDateTimeToString(zdt, precision) {
	  let showCalendar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'auto';
	  let showTimeZone = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'auto';
	  let showOffset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'auto';
	  let options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
	  let instant = GetSlot(zdt, INSTANT);
	  if (options) {
	    const {
	      unit,
	      increment,
	      roundingMode
	    } = options;
	    const ns = RoundInstant(GetSlot(zdt, EPOCHNANOSECONDS), increment, unit, roundingMode);
	    const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
	    instant = new TemporalInstant(ns);
	  }
	  const tz = GetSlot(zdt, TIME_ZONE);
	  const timeZoneRec = new TimeZoneMethodRecord(tz, ['getOffsetNanosecondsFor']);
	  const offsetNs = GetOffsetNanosecondsFor(timeZoneRec, instant);
	  const dateTime = GetPlainDateTimeFor(timeZoneRec, instant, 'iso8601', offsetNs);
	  let dateTimeString = TemporalDateTimeToString(dateTime, precision, 'never');
	  if (showOffset !== 'never') {
	    dateTimeString += FormatDateTimeUTCOffsetRounded(offsetNs);
	  }
	  if (showTimeZone !== 'never') {
	    const identifier = ToTemporalTimeZoneIdentifier(tz);
	    const flag = showTimeZone === 'critical' ? '!' : '';
	    dateTimeString += "[".concat(flag).concat(identifier, "]");
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
	    throw new RangeError("invalid time zone offset: ".concat(string));
	  }
	  const sign = match[1] === '-' || match[1] === '\u2212' ? -1 : +1;
	  const hours = +match[2];
	  const minutes = +(match[3] || 0);
	  const seconds = +(match[4] || 0);
	  const nanoseconds = +((match[5] || 0) + '000000000').slice(0, 9);
	  const offsetNanoseconds = sign * (((hours * 60 + minutes) * 60 + seconds) * 1e9 + nanoseconds);
	  return offsetNanoseconds;
	}
	let canonicalTimeZoneIdsCache = undefined;
	function GetAvailableNamedTimeZoneIdentifier(identifier) {
	  var _canonicalTimeZoneIds, _specialCases$segment, _specialCases$segment2;
	  // The most common case is when the identifier is a canonical time zone ID.
	  // Fast-path that case by caching all canonical IDs. For old ECMAScript
	  // implementations lacking this API, set the cache to `null` to avoid retries.
	  if (canonicalTimeZoneIdsCache === undefined) {
	    const canonicalTimeZoneIds = IntlSupportedValuesOf === null || IntlSupportedValuesOf === void 0 ? void 0 : IntlSupportedValuesOf('timeZone');
	    if (canonicalTimeZoneIds) {
	      canonicalTimeZoneIdsCache = new MapCtor();
	      for (let ix = 0; ix < canonicalTimeZoneIds.length; ix++) {
	        const id = canonicalTimeZoneIds[ix];
	        Call$4(MapPrototypeSet$1, canonicalTimeZoneIdsCache, [ASCIILowercase(id), id]);
	      }
	    } else {
	      canonicalTimeZoneIdsCache = null;
	    }
	  }
	  const lower = ASCIILowercase(identifier);
	  let primaryIdentifier = (_canonicalTimeZoneIds = canonicalTimeZoneIdsCache) === null || _canonicalTimeZoneIds === void 0 ? void 0 : _canonicalTimeZoneIds.get(lower);
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
	  if (Call$4(SetPrototypeHas$1, ICU_LEGACY_TIME_ZONE_IDS, [identifier])) {
	    throw new RangeError("".concat(identifier, " is a legacy time zone identifier from ICU. Use ").concat(primaryIdentifier, " instead"));
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
	      identifier: "Etc/".concat(etcName),
	      primaryIdentifier
	    };
	  }

	  // Legacy US identifiers like US/Alaska or US/Indiana-Starke are 2 segments and use standard form.
	  if (segments[0] === 'Us') return {
	    identifier: "US/".concat(segments[1]),
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
	  segments[1] = (_specialCases$segment = specialCases[segments[1]]) !== null && _specialCases$segment !== void 0 ? _specialCases$segment : segments[1];
	  if (segments.length > 2) segments[2] = (_specialCases$segment2 = specialCases[segments[2]]) !== null && _specialCases$segment2 !== void 0 ? _specialCases$segment2 : segments[2];
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
	  const absoluteMinutes = MathAbs$2(offsetMinutes);
	  const hour = MathFloor$1(absoluteMinutes / 60);
	  const minute = absoluteMinutes % 60;
	  const timeString = FormatTimeString(hour, minute, 0, 0, 'minute');
	  return "".concat(sign).concat(timeString);
	}
	function FormatDateTimeUTCOffsetRounded(offsetNanoseconds) {
	  offsetNanoseconds = RoundNumberToIncrement(bigInt(offsetNanoseconds), 60e9, 'halfExpand').toJSNumber();
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
	function DayOfWeek(year, month, day) {
	  const m = month + (month < 3 ? 10 : -2);
	  const Y = year - (month < 3 ? 1 : 0);
	  const c = MathFloor$1(Y / 100);
	  const y = Y - c * 100;
	  const d = day;
	  const pD = d;
	  const pM = MathFloor$1(2.6 * m - 0.2);
	  const pY = y + MathFloor$1(y / 4);
	  const pC = MathFloor$1(c / 4) - 2 * c;
	  const dow = (pD + pM + pY + pC) % 7;
	  return dow + (dow <= 0 ? 7 : 0);
	}
	function DayOfYear(year, month, day) {
	  let days = day;
	  for (let m = month - 1; m > 0; m--) {
	    days += ISODaysInMonth(year, m);
	  }
	  return days;
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
	  if (MathAbs$2(day) > daysIn400YearCycle) {
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
	  let deltaDays;
	  ({
	    deltaDays,
	    hour,
	    minute,
	    second,
	    millisecond,
	    microsecond,
	    nanosecond
	  } = BalanceTime(hour, minute, second, millisecond, microsecond, nanosecond));
	  ({
	    year,
	    month,
	    day
	  } = BalanceISODate(year, month, day + deltaDays));
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
	function NormalizedTimeDurationToDays(norm, zonedRelativeTo, timeZoneRec, precalculatedPlainDateTime) {
	  // getOffsetNanosecondsFor and getPossibleInstantsFor must be looked up
	  const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
	  const sign = norm.sign();
	  if (sign === 0) return {
	    days: 0,
	    norm,
	    dayLengthNs: DAY_NANOS
	  };
	  const startNs = GetSlot(zonedRelativeTo, EPOCHNANOSECONDS);
	  const start = GetSlot(zonedRelativeTo, INSTANT);
	  const endNs = norm.addToEpochNs(startNs);
	  const end = new TemporalInstant(endNs);
	  const calendar = GetSlot(zonedRelativeTo, CALENDAR);

	  // Find the difference in days only. Inline DifferenceISODateTime because we
	  // don't need the path that potentially calls calendar methods.
	  const dtStart = precalculatedPlainDateTime !== null && precalculatedPlainDateTime !== void 0 ? precalculatedPlainDateTime : GetPlainDateTimeFor(timeZoneRec, start, 'iso8601');
	  const dtEnd = GetPlainDateTimeFor(timeZoneRec, end, 'iso8601');
	  const date1 = TemporalDateTimeToDate(dtStart);
	  const date2 = TemporalDateTimeToDate(dtEnd);
	  let days = DaysUntil(date1, date2);
	  const timeSign = CompareTemporalTime(GetSlot(dtStart, ISO_HOUR), GetSlot(dtStart, ISO_MINUTE), GetSlot(dtStart, ISO_SECOND), GetSlot(dtStart, ISO_MILLISECOND), GetSlot(dtStart, ISO_MICROSECOND), GetSlot(dtStart, ISO_NANOSECOND), GetSlot(dtEnd, ISO_HOUR), GetSlot(dtEnd, ISO_MINUTE), GetSlot(dtEnd, ISO_SECOND), GetSlot(dtEnd, ISO_MILLISECOND), GetSlot(dtEnd, ISO_MICROSECOND), GetSlot(dtEnd, ISO_NANOSECOND));
	  if (days > 0 && timeSign > 0) {
	    days--;
	  } else if (days < 0 && timeSign < 0) {
	    days++;
	  }
	  let relativeResult = AddDaysToZonedDateTime(start, dtStart, timeZoneRec, calendar, days);
	  // may disambiguate

	  // If clock time after addition was in the middle of a skipped period, the
	  // endpoint was disambiguated to a later clock time. So it's possible that
	  // the resulting disambiguated result is later than endNs. If so, then back
	  // up one day and try again. Repeat if necessary (some transitions are
	  // > 24 hours) until either there's zero days left or the date duration is
	  // back inside the period where it belongs. Note that this case only can
	  // happen for positive durations because the only direction that
	  // `disambiguation: 'compatible'` can change clock time is forwards.
	  if (sign === 1 && days > 0 && relativeResult.epochNs.greater(endNs)) {
	    days--;
	    relativeResult = AddDaysToZonedDateTime(start, dtStart, timeZoneRec, calendar, days);
	    // may do disambiguation
	    if (days > 0 && relativeResult.epochNs.greater(endNs)) {
	      throw new RangeError('inconsistent result from custom time zone getInstantFor()');
	    }
	  }
	  norm = TimeDuration.fromEpochNsDiff(endNs, relativeResult.epochNs);

	  // calculate length of the next day (day that contains the time remainder)
	  let oneDayFarther = AddDaysToZonedDateTime(relativeResult.instant, relativeResult.dateTime, timeZoneRec, calendar, sign);
	  let dayLengthNs = TimeDuration.fromEpochNsDiff(oneDayFarther.epochNs, relativeResult.epochNs);
	  const oneDayLess = norm.subtract(dayLengthNs);
	  let isOverflow = oneDayLess.sign() * sign >= 0;
	  if (isOverflow) {
	    norm = oneDayLess;
	    relativeResult = oneDayFarther;
	    days += sign;

	    // ensure there was no more overflow
	    oneDayFarther = AddDaysToZonedDateTime(relativeResult.instant, relativeResult.dateTime, timeZoneRec, calendar, sign);
	    dayLengthNs = TimeDuration.fromEpochNsDiff(oneDayFarther.epochNs, relativeResult.epochNs);
	    isOverflow = norm.subtract(dayLengthNs).sign() * sign >= 0;
	    if (isOverflow) throw new RangeError('inconsistent result from custom time zone getPossibleInstantsFor()');
	  }
	  if (days !== 0 && MathSign(days) != sign) {
	    throw new RangeError('Time zone or calendar converted nanoseconds into a number of days with the opposite sign');
	  }
	  if (sign === -1) {
	    if (norm.sign() === 1) {
	      throw new RangeError('Time zone or calendar ended up with a remainder of nanoseconds with the opposite sign');
	    }
	  } else if (norm.sign() === -1) {
	    throw new Error('assert not reached');
	  }
	  if (norm.abs().cmp(dayLengthNs.abs()) >= 0) {
	    throw new Error('assert not reached');
	  }
	  const daylen = dayLengthNs.abs().totalNs.toJSNumber();
	  if (!NumberIsSafeInteger(daylen)) {
	    const h = daylen / 3600e9;
	    throw new RangeError("Time zone calculated a day length of ".concat(h, " h, longer than ~2502 h causes precision loss"));
	  }
	  if (MathAbs$2(days) > NumberMaxSafeInteger / 86400) throw new Error('assert not reached');
	  return {
	    days,
	    norm,
	    dayLengthNs: daylen
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
	function BalanceTimeDurationRelative(days, norm, largestUnit, zonedRelativeTo, timeZoneRec, precalculatedPlainDateTime) {
	  const startNs = GetSlot(zonedRelativeTo, EPOCHNANOSECONDS);
	  const startInstant = GetSlot(zonedRelativeTo, INSTANT);
	  let intermediateNs = startNs;
	  if (days !== 0) {
	    var _precalculatedPlainDa;
	    (_precalculatedPlainDa = precalculatedPlainDateTime) !== null && _precalculatedPlainDa !== void 0 ? _precalculatedPlainDa : precalculatedPlainDateTime = GetPlainDateTimeFor(timeZoneRec, startInstant, 'iso8601');
	    intermediateNs = AddDaysToZonedDateTime(startInstant, precalculatedPlainDateTime, timeZoneRec, 'iso8601', days).epochNs;
	  }
	  const endNs = AddInstant(intermediateNs, norm);
	  norm = TimeDuration.fromEpochNsDiff(endNs, startNs);
	  if (norm.isZero()) {
	    return {
	      days: 0,
	      hours: 0,
	      minutes: 0,
	      seconds: 0,
	      milliseconds: 0,
	      microseconds: 0,
	      nanoseconds: 0
	    };
	  }
	  if (IsCalendarUnit(largestUnit) || largestUnit === 'day') {
	    var _precalculatedPlainDa2;
	    (_precalculatedPlainDa2 = precalculatedPlainDateTime) !== null && _precalculatedPlainDa2 !== void 0 ? _precalculatedPlainDa2 : precalculatedPlainDateTime = GetPlainDateTimeFor(timeZoneRec, startInstant, 'iso8601');
	    ({
	      days,
	      norm
	    } = NormalizedTimeDurationToDays(norm, zonedRelativeTo, timeZoneRec, precalculatedPlainDateTime));
	    largestUnit = 'hour';
	  } else {
	    days = 0;
	  }
	  const {
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds,
	    nanoseconds
	  } = BalanceTimeDuration(norm, largestUnit);
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
	function UnbalanceDateDurationRelative(years, months, weeks, days, largestUnit, plainRelativeTo, calendarRec) {
	  // calendarRec must have looked up dateAdd and dateUntil
	  const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
	  const defaultLargestUnit = DefaultTemporalLargestUnit(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
	  const effectiveLargestUnit = LargerOfTwoTemporalUnits(largestUnit, 'day');
	  if (LargerOfTwoTemporalUnits(defaultLargestUnit, effectiveLargestUnit) === effectiveLargestUnit) {
	    // no-op
	    return {
	      years,
	      months,
	      weeks,
	      days
	    };
	  }
	  if (!calendarRec) throw new RangeError("a starting point is required for ".concat(largestUnit, "s balancing"));
	  switch (effectiveLargestUnit) {
	    case 'year':
	      throw new Error('assert not reached');
	    case 'month':
	      {
	        // balance years down to months
	        const later = CalendarDateAdd(calendarRec, plainRelativeTo, new TemporalDuration(years));
	        const untilOptions = ObjectCreate$7(null);
	        untilOptions.largestUnit = 'month';
	        const untilResult = CalendarDateUntil(calendarRec, plainRelativeTo, later, untilOptions);
	        const yearsInMonths = GetSlot(untilResult, MONTHS);
	        return {
	          years: 0,
	          months: months + yearsInMonths,
	          weeks,
	          days
	        };
	      }
	    case 'week':
	      {
	        // balance years and months down to days
	        const later = CalendarDateAdd(calendarRec, plainRelativeTo, new TemporalDuration(years, months));
	        const yearsMonthsInDays = DaysUntil(plainRelativeTo, later);
	        return {
	          years: 0,
	          months: 0,
	          weeks,
	          days: days + yearsMonthsInDays
	        };
	      }
	    default:
	      {
	        // largestUnit is "day", or any time unit
	        // balance years, months, and weeks down to days
	        const later = CalendarDateAdd(calendarRec, plainRelativeTo, new TemporalDuration(years, months, weeks));
	        const yearsMonthsWeeksInDays = DaysUntil(plainRelativeTo, later);
	        return {
	          years: 0,
	          months: 0,
	          weeks: 0,
	          days: days + yearsMonthsWeeksInDays
	        };
	      }
	  }
	}
	function BalanceDateDurationRelative(years, months, weeks, days, largestUnit, smallestUnit, plainRelativeTo, calendarRec) {
	  // calendarRec must have looked up dateAdd and dateUntil
	  const TemporalDuration = GetIntrinsic('%Temporal.Duration%');

	  // If no nonzero calendar units, then there's nothing to balance.
	  // If largestUnit is 'day' or lower, then the balance is a no-op.
	  // In both cases, return early. Anything after this requires a calendar.
	  if (years === 0 && months === 0 && weeks === 0 && days === 0 || largestUnit !== 'year' && largestUnit !== 'month' && largestUnit !== 'week') {
	    return {
	      years,
	      months,
	      weeks,
	      days
	    };
	  }
	  if (!plainRelativeTo) throw new RangeError("a starting point is required for ".concat(largestUnit, "s balancing"));
	  const untilOptions = ObjectCreate$7(null);
	  untilOptions.largestUnit = largestUnit;
	  switch (largestUnit) {
	    case 'year':
	      {
	        // There is a special case for smallestUnit === week, because months and
	        // years aren't equal to an integer number of weeks. We don't want "1 year
	        // and 5 weeks" to balance to "1 year, 1 month, and 5 days" which would
	        // contravene the requested smallestUnit.
	        if (smallestUnit === 'week') {
	          // balance months up to years
	          const later = AddDate(calendarRec, plainRelativeTo, new TemporalDuration(years, months));
	          const untilResult = CalendarDateUntil(calendarRec, plainRelativeTo, later, untilOptions);
	          return {
	            years: GetSlot(untilResult, YEARS),
	            months: GetSlot(untilResult, MONTHS),
	            weeks,
	            days: 0
	          };
	        }
	        // balance weeks, months and days up to years
	        const later = AddDate(calendarRec, plainRelativeTo, new TemporalDuration(years, months, weeks, days));
	        const untilResult = CalendarDateUntil(calendarRec, plainRelativeTo, later, untilOptions);
	        return {
	          years: GetSlot(untilResult, YEARS),
	          months: GetSlot(untilResult, MONTHS),
	          weeks: GetSlot(untilResult, WEEKS),
	          days: GetSlot(untilResult, DAYS)
	        };
	      }
	    case 'month':
	      {
	        // Same special case for rounding to weeks as above; in this case we
	        // don't need to balance.
	        if (smallestUnit === 'week') {
	          return {
	            years: 0,
	            months,
	            weeks,
	            days: 0
	          };
	        }
	        // balance weeks and days up to months
	        const later = AddDate(calendarRec, plainRelativeTo, new TemporalDuration(0, months, weeks, days));
	        const untilResult = CalendarDateUntil(calendarRec, plainRelativeTo, later, untilOptions);
	        return {
	          years: 0,
	          months: GetSlot(untilResult, MONTHS),
	          weeks: GetSlot(untilResult, WEEKS),
	          days: GetSlot(untilResult, DAYS)
	        };
	      }
	    case 'week':
	      {
	        // balance days up to weeks
	        const later = AddDate(calendarRec, plainRelativeTo, new TemporalDuration(0, 0, weeks, days));
	        const untilResult = CalendarDateUntil(calendarRec, plainRelativeTo, later, untilOptions);
	        return {
	          years: 0,
	          months: 0,
	          weeks: GetSlot(untilResult, WEEKS),
	          days: GetSlot(untilResult, DAYS)
	        };
	      }
	    // not reached
	  }
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
	  if (value < min || value > max) throw new RangeError("value out of range: ".concat(min, " <= ").concat(value, " <= ").concat(max));
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
	  if (MathAbs$2(y) >= 2 ** 32 || MathAbs$2(mon) >= 2 ** 32 || MathAbs$2(w) >= 2 ** 32) {
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
	  if (smallestUnit === 'nanosecond' && increment === 1) return diff;
	  return RoundDuration(0, 0, 0, 0, diff, increment, smallestUnit, roundingMode).norm;
	}
	function DifferenceDate(calendarRec, plainDate1, plainDate2, options) {
	  const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
	  if (GetSlot(plainDate1, ISO_YEAR) === GetSlot(plainDate2, ISO_YEAR) && GetSlot(plainDate1, ISO_MONTH) === GetSlot(plainDate2, ISO_MONTH) && GetSlot(plainDate1, ISO_DAY) === GetSlot(plainDate2, ISO_DAY)) {
	    return new TemporalDuration();
	  }
	  if (options.largestUnit === 'day') {
	    return new TemporalDuration(0, 0, 0, DaysUntil(plainDate1, plainDate2));
	  }
	  return CalendarDateUntil(calendarRec, plainDate1, plainDate2, options);
	}
	function DifferenceISODateTime(y1, mon1, d1, h1, min1, s1, ms1, µs1, ns1, y2, mon2, d2, h2, min2, s2, ms2, µs2, ns2, calendarRec, largestUnit, options) {
	  // dateUntil must be looked up if date parts are not identical and largestUnit
	  // is greater than 'day'
	  let timeDuration = DifferenceTime(h1, min1, s1, ms1, µs1, ns1, h2, min2, s2, ms2, µs2, ns2);
	  const timeSign = timeDuration.sign();
	  const dateSign = CompareISODate(y2, mon2, d2, y1, mon1, d1);
	  if (dateSign === -timeSign) {
	    ({
	      year: y1,
	      month: mon1,
	      day: d1
	    } = BalanceISODate(y1, mon1, d1 - timeSign));
	    timeDuration = timeDuration.add24HourDays(-timeSign);
	  }
	  const date1 = CreateTemporalDate(y1, mon1, d1, calendarRec.receiver);
	  const date2 = CreateTemporalDate(y2, mon2, d2, calendarRec.receiver);
	  const dateLargestUnit = LargerOfTwoTemporalUnits('day', largestUnit);
	  const untilOptions = SnapshotOwnProperties(options, null);
	  untilOptions.largestUnit = dateLargestUnit;
	  const untilResult = DifferenceDate(calendarRec, date1, date2, untilOptions);
	  const years = GetSlot(untilResult, YEARS);
	  const months = GetSlot(untilResult, MONTHS);
	  const weeks = GetSlot(untilResult, WEEKS);
	  const days = GetSlot(untilResult, DAYS);
	  CombineDateAndNormalizedTimeDuration(years, months, weeks, days, timeDuration);
	  return {
	    years,
	    months,
	    weeks,
	    days,
	    norm: timeDuration
	  };
	}
	function DifferenceZonedDateTime(ns1, ns2, timeZoneRec, calendarRec, largestUnit, options) {
	  let precalculatedDtStart = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : undefined;
	  // getOffsetNanosecondsFor and getPossibleInstantsFor must be looked up
	  // dateAdd must be looked up if the instants are not identical (and the date
	  // difference has no years, months, or weeks, which can't be determined)
	  // dateUntil must be looked up if the instants are not identical, the date
	  // parts are not identical, and largestUnit is greater than 'day'
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
	  const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
	  const start = new TemporalInstant(ns1);
	  const end = new TemporalInstant(ns2);
	  const dtStart = precalculatedDtStart !== null && precalculatedDtStart !== void 0 ? precalculatedDtStart : GetPlainDateTimeFor(timeZoneRec, start, calendarRec.receiver);
	  const dtEnd = GetPlainDateTimeFor(timeZoneRec, end, calendarRec.receiver);

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
	  let timeDuration = DifferenceTime(GetSlot(dtStart, ISO_HOUR), GetSlot(dtStart, ISO_MINUTE), GetSlot(dtStart, ISO_SECOND), GetSlot(dtStart, ISO_MILLISECOND), GetSlot(dtStart, ISO_MICROSECOND), GetSlot(dtStart, ISO_NANOSECOND), GetSlot(dtEnd, ISO_HOUR), GetSlot(dtEnd, ISO_MINUTE), GetSlot(dtEnd, ISO_SECOND), GetSlot(dtEnd, ISO_MILLISECOND), GetSlot(dtEnd, ISO_MICROSECOND), GetSlot(dtEnd, ISO_NANOSECOND));
	  if (timeDuration.sign() === -sign) {
	    dayCorrection++;
	  }
	  for (; dayCorrection <= maxDayCorrection; dayCorrection++) {
	    const intermediateDate = BalanceISODate(GetSlot(dtEnd, ISO_YEAR), GetSlot(dtEnd, ISO_MONTH), GetSlot(dtEnd, ISO_DAY) - dayCorrection * sign);

	    // Incorporate time parts from dtStart
	    intermediateDateTime = CreateTemporalDateTime(intermediateDate.year, intermediateDate.month, intermediateDate.day, GetSlot(dtStart, ISO_HOUR), GetSlot(dtStart, ISO_MINUTE), GetSlot(dtStart, ISO_SECOND), GetSlot(dtStart, ISO_MILLISECOND), GetSlot(dtStart, ISO_MICROSECOND), GetSlot(dtStart, ISO_NANOSECOND), calendarRec.receiver);

	    // Convert intermediate datetime to epoch-nanoseconds (may disambiguate)
	    const intermediateInstant = GetInstantFor(timeZoneRec, intermediateDateTime, 'compatible');
	    const intermediateNs = GetSlot(intermediateInstant, EPOCHNANOSECONDS);

	    // Compute the nanosecond diff between the intermediate instant and the final destination
	    norm = TimeDuration.fromEpochNsDiff(ns2, intermediateNs);

	    // Did intermediateNs NOT surpass ns2?
	    // If so, exit the loop with success (without incrementing dayCorrection past maxDayCorrection)
	    if (norm.sign() !== -sign) {
	      break;
	    }
	  }
	  if (dayCorrection > maxDayCorrection) {
	    throw new RangeError("inconsistent return from calendar or time zone method: more than ".concat(maxDayCorrection, " day correction needed"));
	  }

	  // Similar to what happens in DifferenceISODateTime with date parts only:
	  const date1 = TemporalDateTimeToDate(dtStart);
	  const date2 = TemporalDateTimeToDate(intermediateDateTime);
	  const dateLargestUnit = LargerOfTwoTemporalUnits('day', largestUnit);
	  const untilOptions = SnapshotOwnProperties(options, null);
	  untilOptions.largestUnit = dateLargestUnit;
	  const dateDifference = DifferenceDate(calendarRec, date1, date2, untilOptions);
	  const years = GetSlot(dateDifference, YEARS);
	  const months = GetSlot(dateDifference, MONTHS);
	  const weeks = GetSlot(dateDifference, WEEKS);
	  const days = GetSlot(dateDifference, DAYS);
	  CombineDateAndNormalizedTimeDuration(years, months, weeks, days, norm);
	  return {
	    years,
	    months,
	    weeks,
	    days,
	    norm
	  };
	}
	function GetDifferenceSettings(op, options, group, disallowed, fallbackSmallest, smallestLargestDefaultUnit) {
	  const ALLOWED_UNITS = SINGULAR_PLURAL_UNITS.reduce((allowed, unitInfo) => {
	    const p = unitInfo[0];
	    const s = unitInfo[1];
	    const c = unitInfo[2];
	    if ((group === 'datetime' || c === group) && !Call$4(ArrayIncludes$1, disallowed, [s])) {
	      allowed.push(s, p);
	    }
	    return allowed;
	  }, []);
	  let largestUnit = GetTemporalUnit(options, 'largestUnit', group, 'auto');
	  if (Call$4(ArrayIncludes$1, disallowed, [largestUnit])) {
	    throw new RangeError("largestUnit must be one of ".concat(ALLOWED_UNITS.join(', '), ", not ").concat(largestUnit));
	  }
	  const roundingIncrement = ToTemporalRoundingIncrement(options);
	  let roundingMode = ToTemporalRoundingMode(options, 'trunc');
	  if (op === 'since') roundingMode = NegateTemporalRoundingMode(roundingMode);
	  const smallestUnit = GetTemporalUnit(options, 'smallestUnit', group, fallbackSmallest);
	  if (Call$4(ArrayIncludes$1, disallowed, [smallestUnit])) {
	    throw new RangeError("smallestUnit must be one of ".concat(ALLOWED_UNITS.join(', '), ", not ").concat(smallestUnit));
	  }
	  const defaultLargestUnit = LargerOfTwoTemporalUnits(smallestLargestDefaultUnit, smallestUnit);
	  if (largestUnit === 'auto') largestUnit = defaultLargestUnit;
	  if (LargerOfTwoTemporalUnits(largestUnit, smallestUnit) !== largestUnit) {
	    throw new RangeError("largestUnit ".concat(largestUnit, " cannot be smaller than smallestUnit ").concat(smallestUnit));
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
	  const resolvedOptions = SnapshotOwnProperties(GetOptionsObject(options), null);
	  const settings = GetDifferenceSettings(operation, resolvedOptions, 'time', [], 'nanosecond', 'second');
	  const onens = GetSlot(instant, EPOCHNANOSECONDS);
	  const twons = GetSlot(other, EPOCHNANOSECONDS);
	  const norm = DifferenceInstant(onens, twons, settings.roundingIncrement, settings.smallestUnit, settings.roundingMode);
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
	  ThrowIfCalendarsNotEqual(calendar, otherCalendar, 'compute difference between dates');
	  const resolvedOptions = SnapshotOwnProperties(GetOptionsObject(options), null);
	  const settings = GetDifferenceSettings(operation, resolvedOptions, 'date', [], 'day', 'day');
	  const Duration = GetIntrinsic('%Temporal.Duration%');
	  if (GetSlot(plainDate, ISO_YEAR) === GetSlot(other, ISO_YEAR) && GetSlot(plainDate, ISO_MONTH) === GetSlot(other, ISO_MONTH) && GetSlot(plainDate, ISO_DAY) === GetSlot(other, ISO_DAY)) {
	    return new Duration();
	  }
	  const calendarRec = new CalendarMethodRecord(calendar, ['dateAdd', 'dateUntil']);
	  resolvedOptions.largestUnit = settings.largestUnit;
	  const untilResult = DifferenceDate(calendarRec, plainDate, other, resolvedOptions);
	  let years = GetSlot(untilResult, YEARS);
	  let months = GetSlot(untilResult, MONTHS);
	  let weeks = GetSlot(untilResult, WEEKS);
	  let days = GetSlot(untilResult, DAYS);
	  const roundingIsNoop = settings.smallestUnit === 'day' && settings.roundingIncrement === 1;
	  if (!roundingIsNoop) {
	    ({
	      years,
	      months,
	      weeks,
	      days
	    } = RoundDuration(years, months, weeks, days, TimeDuration.ZERO, settings.roundingIncrement, settings.smallestUnit, settings.roundingMode, plainDate, calendarRec));
	    ({
	      years,
	      months,
	      weeks,
	      days
	    } = BalanceDateDurationRelative(years, months, weeks, days, settings.largestUnit, settings.smallestUnit, plainDate, calendarRec));
	  }
	  return new Duration(sign * years, sign * months, sign * weeks, sign * days, 0, 0, 0, 0, 0, 0);
	}
	function DifferenceTemporalPlainDateTime(operation, plainDateTime, other, options) {
	  const sign = operation === 'since' ? -1 : 1;
	  other = ToTemporalDateTime(other);
	  const calendar = GetSlot(plainDateTime, CALENDAR);
	  const otherCalendar = GetSlot(other, CALENDAR);
	  ThrowIfCalendarsNotEqual(calendar, otherCalendar, 'compute difference between dates');
	  const resolvedOptions = SnapshotOwnProperties(GetOptionsObject(options), null);
	  const settings = GetDifferenceSettings(operation, resolvedOptions, 'datetime', [], 'nanosecond', 'day');
	  const Duration = GetIntrinsic('%Temporal.Duration%');
	  const datePartsIdentical = GetSlot(plainDateTime, ISO_YEAR) === GetSlot(other, ISO_YEAR) && GetSlot(plainDateTime, ISO_MONTH) === GetSlot(other, ISO_MONTH) && GetSlot(plainDateTime, ISO_DAY) === GetSlot(other, ISO_DAY);
	  if (datePartsIdentical && GetSlot(plainDateTime, ISO_HOUR) == GetSlot(other, ISO_HOUR) && GetSlot(plainDateTime, ISO_MINUTE) == GetSlot(other, ISO_MINUTE) && GetSlot(plainDateTime, ISO_SECOND) == GetSlot(other, ISO_SECOND) && GetSlot(plainDateTime, ISO_MILLISECOND) == GetSlot(other, ISO_MILLISECOND) && GetSlot(plainDateTime, ISO_MICROSECOND) == GetSlot(other, ISO_MICROSECOND) && GetSlot(plainDateTime, ISO_NANOSECOND) == GetSlot(other, ISO_NANOSECOND)) {
	    return new Duration();
	  }
	  const calendarRec = new CalendarMethodRecord(calendar, ['dateAdd', 'dateUntil']);
	  let {
	    years,
	    months,
	    weeks,
	    days,
	    norm
	  } = DifferenceISODateTime(GetSlot(plainDateTime, ISO_YEAR), GetSlot(plainDateTime, ISO_MONTH), GetSlot(plainDateTime, ISO_DAY), GetSlot(plainDateTime, ISO_HOUR), GetSlot(plainDateTime, ISO_MINUTE), GetSlot(plainDateTime, ISO_SECOND), GetSlot(plainDateTime, ISO_MILLISECOND), GetSlot(plainDateTime, ISO_MICROSECOND), GetSlot(plainDateTime, ISO_NANOSECOND), GetSlot(other, ISO_YEAR), GetSlot(other, ISO_MONTH), GetSlot(other, ISO_DAY), GetSlot(other, ISO_HOUR), GetSlot(other, ISO_MINUTE), GetSlot(other, ISO_SECOND), GetSlot(other, ISO_MILLISECOND), GetSlot(other, ISO_MICROSECOND), GetSlot(other, ISO_NANOSECOND), calendarRec, settings.largestUnit, resolvedOptions);
	  let hours, minutes, seconds, milliseconds, microseconds, nanoseconds;
	  const roundingIsNoop = settings.smallestUnit === 'nanosecond' && settings.roundingIncrement === 1;
	  if (!roundingIsNoop) {
	    const relativeTo = TemporalDateTimeToDate(plainDateTime);
	    ({
	      years,
	      months,
	      weeks,
	      days,
	      norm
	    } = RoundDuration(years, months, weeks, days, norm, settings.roundingIncrement, settings.smallestUnit, settings.roundingMode, relativeTo, calendarRec));
	    ({
	      days,
	      hours,
	      minutes,
	      seconds,
	      milliseconds,
	      microseconds,
	      nanoseconds
	    } = BalanceTimeDuration(norm.add24HourDays(days), settings.largestUnit));
	    ({
	      years,
	      months,
	      weeks,
	      days
	    } = BalanceDateDurationRelative(years, months, weeks, days, settings.largestUnit, settings.smallestUnit, relativeTo, calendarRec));
	  } else {
	    ({
	      days,
	      hours,
	      minutes,
	      seconds,
	      milliseconds,
	      microseconds,
	      nanoseconds
	    } = BalanceTimeDuration(norm.add24HourDays(days), settings.largestUnit));
	  }
	  return new Duration(sign * years, sign * months, sign * weeks, sign * days, sign * hours, sign * minutes, sign * seconds, sign * milliseconds, sign * microseconds, sign * nanoseconds);
	}
	function DifferenceTemporalPlainTime(operation, plainTime, other, options) {
	  const sign = operation === 'since' ? -1 : 1;
	  other = ToTemporalTime(other);
	  const resolvedOptions = SnapshotOwnProperties(GetOptionsObject(options), null);
	  const settings = GetDifferenceSettings(operation, resolvedOptions, 'time', [], 'nanosecond', 'hour');
	  let norm = DifferenceTime(GetSlot(plainTime, ISO_HOUR), GetSlot(plainTime, ISO_MINUTE), GetSlot(plainTime, ISO_SECOND), GetSlot(plainTime, ISO_MILLISECOND), GetSlot(plainTime, ISO_MICROSECOND), GetSlot(plainTime, ISO_NANOSECOND), GetSlot(other, ISO_HOUR), GetSlot(other, ISO_MINUTE), GetSlot(other, ISO_SECOND), GetSlot(other, ISO_MILLISECOND), GetSlot(other, ISO_MICROSECOND), GetSlot(other, ISO_NANOSECOND));
	  if (settings.smallestUnit !== 'nanosecond' || settings.roundingIncrement !== 1) {
	    ({
	      norm
	    } = RoundDuration(0, 0, 0, 0, norm, settings.roundingIncrement, settings.smallestUnit, settings.roundingMode));
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
	  ThrowIfCalendarsNotEqual(calendar, otherCalendar, 'compute difference between months');
	  const resolvedOptions = SnapshotOwnProperties(GetOptionsObject(options), null);
	  const settings = GetDifferenceSettings(operation, resolvedOptions, 'date', ['week', 'day'], 'month', 'year');
	  const Duration = GetIntrinsic('%Temporal.Duration%');
	  if (GetSlot(yearMonth, ISO_YEAR) === GetSlot(other, ISO_YEAR) && GetSlot(yearMonth, ISO_MONTH) === GetSlot(other, ISO_MONTH) && GetSlot(yearMonth, ISO_DAY) === GetSlot(other, ISO_DAY)) {
	    return new Duration();
	  }
	  const calendarRec = new CalendarMethodRecord(calendar, ['dateAdd', 'dateFromFields', 'dateUntil', 'fields']);
	  const fieldNames = CalendarFields(calendarRec, ['monthCode', 'year']);
	  const thisFields = PrepareTemporalFields(yearMonth, fieldNames, []);
	  thisFields.day = 1;
	  const thisDate = CalendarDateFromFields(calendarRec, thisFields);
	  const otherFields = PrepareTemporalFields(other, fieldNames, []);
	  otherFields.day = 1;
	  const otherDate = CalendarDateFromFields(calendarRec, otherFields);
	  resolvedOptions.largestUnit = settings.largestUnit;
	  let {
	    years,
	    months
	  } = CalendarDateUntil(calendarRec, thisDate, otherDate, resolvedOptions);
	  if (settings.smallestUnit !== 'month' || settings.roundingIncrement !== 1) {
	    ({
	      years,
	      months
	    } = RoundDuration(years, months, 0, 0, TimeDuration.ZERO, settings.roundingIncrement, settings.smallestUnit, settings.roundingMode, thisDate, calendarRec));
	    ({
	      years,
	      months
	    } = BalanceDateDurationRelative(years, months, 0, 0, settings.largestUnit, settings.smallestUnit, thisDate, calendarRec));
	  }
	  return new Duration(sign * years, sign * months, 0, 0, 0, 0, 0, 0, 0, 0);
	}
	function DifferenceTemporalZonedDateTime(operation, zonedDateTime, other, options) {
	  const sign = operation === 'since' ? -1 : 1;
	  other = ToTemporalZonedDateTime(other);
	  const calendar = GetSlot(zonedDateTime, CALENDAR);
	  const otherCalendar = GetSlot(other, CALENDAR);
	  ThrowIfCalendarsNotEqual(calendar, otherCalendar, 'compute difference between dates');
	  const resolvedOptions = SnapshotOwnProperties(GetOptionsObject(options), null);
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
	    const norm = DifferenceInstant(ns1, ns2, settings.roundingIncrement, settings.smallestUnit, settings.roundingMode);
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
	    const timeZoneRec = new TimeZoneMethodRecord(timeZone, ['getOffsetNanosecondsFor', 'getPossibleInstantsFor']);
	    // dateAdd and dateUntil may not be needed if the two exact times resolve to
	    // the same wall-clock time in the time zone, but there's no way to predict
	    // that in advance
	    const calendarRec = new CalendarMethodRecord(calendar, ['dateAdd', 'dateUntil']);
	    const precalculatedPlainDateTime = GetPlainDateTimeFor(timeZoneRec, GetSlot(zonedDateTime, INSTANT), calendarRec.receiver);
	    const plainRelativeTo = TemporalDateTimeToDate(precalculatedPlainDateTime);
	    let norm;
	    ({
	      years,
	      months,
	      weeks,
	      days,
	      norm
	    } = DifferenceZonedDateTime(ns1, ns2, timeZoneRec, calendarRec, settings.largestUnit, resolvedOptions, precalculatedPlainDateTime));
	    const roundingIsNoop = settings.smallestUnit === 'nanosecond' && settings.roundingIncrement === 1;
	    if (!roundingIsNoop) {
	      ({
	        years,
	        months,
	        weeks,
	        days,
	        norm
	      } = RoundDuration(years, months, weeks, days, norm, settings.roundingIncrement, settings.smallestUnit, settings.roundingMode, plainRelativeTo, calendarRec, zonedDateTime, timeZoneRec, precalculatedPlainDateTime));
	      let deltaDays;
	      ({
	        days: deltaDays,
	        norm
	      } = NormalizedTimeDurationToDays(norm, zonedDateTime, timeZoneRec));
	      days += deltaDays;
	      ({
	        years,
	        months,
	        weeks,
	        days,
	        norm
	      } = AdjustRoundedDurationDays(years, months, weeks, days, norm, settings.roundingIncrement, settings.smallestUnit, settings.roundingMode, zonedDateTime, calendarRec, timeZoneRec, precalculatedPlainDateTime));
	      // BalanceTimeDuration already performed in AdjustRoundedDurationDays
	      ({
	        years,
	        months,
	        weeks,
	        days
	      } = BalanceDateDurationRelative(years, months, weeks, days, settings.largestUnit, settings.smallestUnit, plainRelativeTo, calendarRec));
	      CombineDateAndNormalizedTimeDuration(years, months, weeks, days, norm);
	    }
	    ({
	      hours,
	      minutes,
	      seconds,
	      milliseconds,
	      microseconds,
	      nanoseconds
	    } = BalanceTimeDuration(norm, 'hour'));
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
	  return {
	    year,
	    month,
	    day
	  };
	}
	function AddDate(calendarRec, plainDate, duration) {
	  let options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
	  // dateAdd must be looked up
	  const years = GetSlot(duration, YEARS);
	  const months = GetSlot(duration, MONTHS);
	  const weeks = GetSlot(duration, WEEKS);
	  if (years !== 0 || months !== 0 || weeks !== 0) {
	    return CalendarDateAdd(calendarRec, plainDate, duration, options);
	  }

	  // Fast path skipping the calendar call if we are only adding days
	  let year = GetSlot(plainDate, ISO_YEAR);
	  let month = GetSlot(plainDate, ISO_MONTH);
	  let day = GetSlot(plainDate, ISO_DAY);
	  const overflow = ToTemporalOverflow(options);
	  const norm = TimeDuration.normalize(GetSlot(duration, HOURS), GetSlot(duration, MINUTES), GetSlot(duration, SECONDS), GetSlot(duration, MILLISECONDS), GetSlot(duration, MICROSECONDS), GetSlot(duration, NANOSECONDS));
	  const days = GetSlot(duration, DAYS) + BalanceTimeDuration(norm, 'day').days;
	  ({
	    year,
	    month,
	    day
	  } = AddISODate(year, month, day, 0, 0, 0, days, overflow));
	  return CreateTemporalDate(year, month, day, calendarRec.receiver);
	}
	function AddTime(hour, minute, second, millisecond, microsecond, nanosecond, norm) {
	  second += norm.sec;
	  nanosecond += norm.subsec;
	  return BalanceTime(hour, minute, second, millisecond, microsecond, nanosecond);
	}
	function AddDuration(y1, mon1, w1, d1, h1, min1, s1, ms1, µs1, ns1, y2, mon2, w2, d2, h2, min2, s2, ms2, µs2, ns2, plainRelativeTo, zonedRelativeTo, calendarRec, timeZoneRec, precalculatedPlainDateTime) {
	  // dateAdd must be looked up if zonedRelativeTo or plainRelativeTo not
	  // undefined, and years...weeks != 0 in either duration
	  // dateUntil must additionally be looked up if duration 2 not zero
	  const largestUnit1 = DefaultTemporalLargestUnit(y1, mon1, w1, d1, h1, min1, s1, ms1, µs1, ns1);
	  const largestUnit2 = DefaultTemporalLargestUnit(y2, mon2, w2, d2, h2, min2, s2, ms2, µs2, ns2);
	  const largestUnit = LargerOfTwoTemporalUnits(largestUnit1, largestUnit2);
	  let years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds;
	  if (!zonedRelativeTo && !plainRelativeTo) {
	    if (IsCalendarUnit(largestUnit)) {
	      throw new RangeError('relativeTo is required for years, months, or weeks arithmetic');
	    }
	    years = months = weeks = 0;
	    const norm1 = TimeDuration.normalize(h1, min1, s1, ms1, µs1, ns1);
	    const norm2 = TimeDuration.normalize(h2, min2, s2, ms2, µs2, ns2);
	    ({
	      days,
	      hours,
	      minutes,
	      seconds,
	      milliseconds,
	      microseconds,
	      nanoseconds
	    } = BalanceTimeDuration(norm1.add(norm2).add24HourDays(d1 + d2), largestUnit));
	  } else if (plainRelativeTo) {
	    const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
	    const dateDuration1 = new TemporalDuration(y1, mon1, w1, d1, 0, 0, 0, 0, 0, 0);
	    const dateDuration2 = new TemporalDuration(y2, mon2, w2, d2, 0, 0, 0, 0, 0, 0);
	    const intermediate = AddDate(calendarRec, plainRelativeTo, dateDuration1);
	    const end = AddDate(calendarRec, intermediate, dateDuration2);
	    const dateLargestUnit = LargerOfTwoTemporalUnits('day', largestUnit);
	    const differenceOptions = ObjectCreate$7(null);
	    differenceOptions.largestUnit = dateLargestUnit;
	    const untilResult = DifferenceDate(calendarRec, plainRelativeTo, end, differenceOptions);
	    years = GetSlot(untilResult, YEARS);
	    months = GetSlot(untilResult, MONTHS);
	    weeks = GetSlot(untilResult, WEEKS);
	    days = GetSlot(untilResult, DAYS);
	    // Signs of date part and time part may not agree; balance them together
	    const norm1 = TimeDuration.normalize(h1, min1, s1, ms1, µs1, ns1);
	    const norm2 = TimeDuration.normalize(h2, min2, s2, ms2, µs2, ns2);
	    ({
	      days,
	      hours,
	      minutes,
	      seconds,
	      milliseconds,
	      microseconds,
	      nanoseconds
	    } = BalanceTimeDuration(norm1.add(norm2).add24HourDays(days), largestUnit));
	  } else {
	    // zonedRelativeTo is defined
	    const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
	    const calendar = GetSlot(zonedRelativeTo, CALENDAR);
	    const startInstant = GetSlot(zonedRelativeTo, INSTANT);
	    let startDateTime = precalculatedPlainDateTime;
	    if (IsCalendarUnit(largestUnit) || largestUnit === 'day') {
	      var _startDateTime;
	      (_startDateTime = startDateTime) !== null && _startDateTime !== void 0 ? _startDateTime : startDateTime = GetPlainDateTimeFor(timeZoneRec, startInstant, calendar);
	    }
	    const norm1 = TimeDuration.normalize(h1, min1, s1, ms1, µs1, ns1);
	    const norm2 = TimeDuration.normalize(h2, min2, s2, ms2, µs2, ns2);
	    const intermediateNs = AddZonedDateTime(startInstant, timeZoneRec, calendarRec, y1, mon1, w1, d1, norm1, startDateTime);
	    const endNs = AddZonedDateTime(new TemporalInstant(intermediateNs), timeZoneRec, calendarRec, y2, mon2, w2, d2, norm2);
	    if (largestUnit !== 'year' && largestUnit !== 'month' && largestUnit !== 'week' && largestUnit !== 'day') {
	      // The user is only asking for a time difference, so return difference of instants.
	      years = 0;
	      months = 0;
	      weeks = 0;
	      days = 0;
	      const norm = TimeDuration.fromEpochNsDiff(endNs, GetSlot(zonedRelativeTo, EPOCHNANOSECONDS));
	      ({
	        hours,
	        minutes,
	        seconds,
	        milliseconds,
	        microseconds,
	        nanoseconds
	      } = BalanceTimeDuration(norm, largestUnit));
	    } else {
	      let norm;
	      ({
	        years,
	        months,
	        weeks,
	        days,
	        norm
	      } = DifferenceZonedDateTime(GetSlot(zonedRelativeTo, EPOCHNANOSECONDS), endNs, timeZoneRec, calendarRec, largestUnit, ObjectCreate$7(null), startDateTime));
	      ({
	        hours,
	        minutes,
	        seconds,
	        milliseconds,
	        microseconds,
	        nanoseconds
	      } = BalanceTimeDuration(norm, 'hour'));
	    }
	  }
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
	function AddInstant(epochNanoseconds, norm) {
	  const result = norm.addToEpochNs(epochNanoseconds);
	  ValidateEpochNanoseconds(result);
	  return result;
	}
	function AddDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendarRec, years, months, weeks, days, norm, options) {
	  // dateAdd must be looked up if years, months, weeks != 0
	  // Add the time part
	  let deltaDays = 0;
	  ({
	    deltaDays,
	    hour,
	    minute,
	    second,
	    millisecond,
	    microsecond,
	    nanosecond
	  } = AddTime(hour, minute, second, millisecond, microsecond, nanosecond, norm));
	  days += deltaDays;

	  // Delegate the date part addition to the calendar
	  const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
	  const datePart = CreateTemporalDate(year, month, day, calendarRec.receiver);
	  const dateDuration = new TemporalDuration(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
	  const addedDate = AddDate(calendarRec, datePart, dateDuration, options);
	  return {
	    year: GetSlot(addedDate, ISO_YEAR),
	    month: GetSlot(addedDate, ISO_MONTH),
	    day: GetSlot(addedDate, ISO_DAY),
	    hour,
	    minute,
	    second,
	    millisecond,
	    microsecond,
	    nanosecond
	  };
	}
	function AddZonedDateTime(instant, timeZoneRec, calendarRec, years, months, weeks, days, norm) {
	  let precalculatedPlainDateTime = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : undefined;
	  let options = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : undefined;
	  // getPossibleInstantsFor must be looked up
	  // getOffsetNanosecondsFor must be looked up if precalculatedDateTime is not
	  // supplied
	  // getOffsetNanosecondsFor may be looked up and timeZoneRec modified, if
	  // precalculatedDateTime is supplied but converting to instant requires
	  // disambiguation
	  // dateAdd must be looked up if years, months, or weeks are not 0

	  // If only time is to be added, then use Instant math. It's not OK to fall
	  // through to the date/time code below because compatible disambiguation in
	  // the PlainDateTime=>Instant conversion will change the offset of any
	  // ZonedDateTime in the repeated clock time after a backwards transition.
	  // When adding/subtracting time units and not dates, this disambiguation is
	  // not expected and so is avoided below via a fast path for time-only
	  // arithmetic.
	  // BTW, this behavior is similar in spirit to offset: 'prefer' in `with`.
	  const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
	  if (DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0) === 0) {
	    return AddInstant(GetSlot(instant, EPOCHNANOSECONDS), norm);
	  }
	  const dt = precalculatedPlainDateTime !== null && precalculatedPlainDateTime !== void 0 ? precalculatedPlainDateTime : GetPlainDateTimeFor(timeZoneRec, instant, calendarRec.receiver);
	  if (DurationSign(years, months, weeks, 0, 0, 0, 0, 0, 0, 0) === 0) {
	    const overflow = ToTemporalOverflow(options);
	    const intermediate = AddDaysToZonedDateTime(instant, dt, timeZoneRec, calendarRec.receiver, days, overflow).epochNs;
	    return AddInstant(intermediate, norm);
	  }

	  // RFC 5545 requires the date portion to be added in calendar days and the
	  // time portion to be added in exact time.
	  const datePart = CreateTemporalDate(GetSlot(dt, ISO_YEAR), GetSlot(dt, ISO_MONTH), GetSlot(dt, ISO_DAY), calendarRec.receiver);
	  const dateDuration = new TemporalDuration(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
	  const addedDate = CalendarDateAdd(calendarRec, datePart, dateDuration, options);
	  const dtIntermediate = CreateTemporalDateTime(GetSlot(addedDate, ISO_YEAR), GetSlot(addedDate, ISO_MONTH), GetSlot(addedDate, ISO_DAY), GetSlot(dt, ISO_HOUR), GetSlot(dt, ISO_MINUTE), GetSlot(dt, ISO_SECOND), GetSlot(dt, ISO_MILLISECOND), GetSlot(dt, ISO_MICROSECOND), GetSlot(dt, ISO_NANOSECOND), calendarRec.receiver);

	  // Note that 'compatible' is used below because this disambiguation behavior
	  // is required by RFC 5545.
	  const instantIntermediate = GetInstantFor(timeZoneRec, dtIntermediate, 'compatible');
	  return AddInstant(GetSlot(instantIntermediate, EPOCHNANOSECONDS), norm);
	}
	function AddDaysToZonedDateTime(instant, dateTime, timeZoneRec, calendar, days) {
	  let overflow = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'constrain';
	  // getPossibleInstantsFor must be looked up
	  // getOffsetNanosecondsFor may be looked up for disambiguation, modifying timeZoneRec

	  // Same as AddZonedDateTime above, but an optimized version with fewer
	  // observable calls that only adds a number of days. Returns an object with
	  // all three versions of the ZonedDateTime: epoch nanoseconds, Instant, and
	  // PlainDateTime
	  if (days === 0) {
	    return {
	      instant,
	      dateTime,
	      epochNs: GetSlot(instant, EPOCHNANOSECONDS)
	    };
	  }
	  const addedDate = AddISODate(GetSlot(dateTime, ISO_YEAR), GetSlot(dateTime, ISO_MONTH), GetSlot(dateTime, ISO_DAY), 0, 0, 0, days, overflow);
	  const dateTimeResult = CreateTemporalDateTime(addedDate.year, addedDate.month, addedDate.day, GetSlot(dateTime, ISO_HOUR), GetSlot(dateTime, ISO_MINUTE), GetSlot(dateTime, ISO_SECOND), GetSlot(dateTime, ISO_MILLISECOND), GetSlot(dateTime, ISO_MICROSECOND), GetSlot(dateTime, ISO_NANOSECOND), calendar);
	  const instantResult = GetInstantFor(timeZoneRec, dateTimeResult, 'compatible');
	  return {
	    instant: instantResult,
	    dateTime: dateTimeResult,
	    epochNs: GetSlot(instantResult, EPOCHNANOSECONDS)
	  };
	}
	function AddDurationToOrSubtractDurationFromDuration(operation, duration, other, options) {
	  const sign = operation === 'subtract' ? -1 : 1;
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
	  } = ToTemporalDurationRecord(other);
	  options = GetOptionsObject(options);
	  const {
	    plainRelativeTo,
	    zonedRelativeTo,
	    timeZoneRec
	  } = ToRelativeTemporalObject(options);
	  const calendarRec = CalendarMethodRecord.CreateFromRelativeTo(plainRelativeTo, zonedRelativeTo, ['dateAdd', 'dateUntil']);
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
	  } = AddDuration(GetSlot(duration, YEARS), GetSlot(duration, MONTHS), GetSlot(duration, WEEKS), GetSlot(duration, DAYS), GetSlot(duration, HOURS), GetSlot(duration, MINUTES), GetSlot(duration, SECONDS), GetSlot(duration, MILLISECONDS), GetSlot(duration, MICROSECONDS), GetSlot(duration, NANOSECONDS), sign * years, sign * months, sign * weeks, sign * days, sign * hours, sign * minutes, sign * seconds, sign * milliseconds, sign * microseconds, sign * nanoseconds, plainRelativeTo, zonedRelativeTo, calendarRec, timeZoneRec));
	  const Duration = GetIntrinsic('%Temporal.Duration%');
	  return new Duration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
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
	  const calendarRec = new CalendarMethodRecord(GetSlot(dateTime, CALENDAR), ['dateAdd']);
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
	  } = AddDateTime(GetSlot(dateTime, ISO_YEAR), GetSlot(dateTime, ISO_MONTH), GetSlot(dateTime, ISO_DAY), GetSlot(dateTime, ISO_HOUR), GetSlot(dateTime, ISO_MINUTE), GetSlot(dateTime, ISO_SECOND), GetSlot(dateTime, ISO_MILLISECOND), GetSlot(dateTime, ISO_MICROSECOND), GetSlot(dateTime, ISO_NANOSECOND), calendarRec, sign * years, sign * months, sign * weeks, sign * days, norm, options);
	  return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendarRec.receiver);
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
	  const norm = TimeDuration.normalize(hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
	  days += BalanceTimeDuration(norm, 'day').days;
	  const sign = DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
	  const calendarRec = new CalendarMethodRecord(GetSlot(yearMonth, CALENDAR), ['dateAdd', 'dateFromFields', 'day', 'fields', 'yearMonthFromFields']);
	  const fieldNames = CalendarFields(calendarRec, ['monthCode', 'year']);
	  const fields = PrepareTemporalFields(yearMonth, fieldNames, []);
	  const fieldsCopy = SnapshotOwnProperties(fields, null);
	  fields.day = 1;
	  let startDate = CalendarDateFromFields(calendarRec, fields);
	  const Duration = GetIntrinsic('%Temporal.Duration%');
	  if (sign < 0) {
	    const oneMonthDuration = new Duration(0, 1, 0, 0, 0, 0, 0, 0, 0, 0);
	    const nextMonth = CalendarDateAdd(calendarRec, startDate, oneMonthDuration);
	    const endOfMonthISO = BalanceISODate(GetSlot(nextMonth, ISO_YEAR), GetSlot(nextMonth, ISO_MONTH), GetSlot(nextMonth, ISO_DAY) - 1);
	    const endOfMonth = CreateTemporalDate(endOfMonthISO.year, endOfMonthISO.month, endOfMonthISO.day, calendarRec.receiver);
	    fieldsCopy.day = CalendarDay(calendarRec, endOfMonth);
	    startDate = CalendarDateFromFields(calendarRec, fieldsCopy);
	  }
	  const durationToAdd = new Duration(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
	  const optionsCopy = SnapshotOwnProperties(options, null);
	  const addedDate = AddDate(calendarRec, startDate, durationToAdd, options);
	  const addedDateFields = PrepareTemporalFields(addedDate, fieldNames, []);
	  return CalendarYearMonthFromFields(calendarRec, addedDateFields, optionsCopy);
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
	  const timeZoneRec = new TimeZoneMethodRecord(GetSlot(zonedDateTime, TIME_ZONE), ['getOffsetNanosecondsFor', 'getPossibleInstantsFor']);
	  const calendarRec = new CalendarMethodRecord(GetSlot(zonedDateTime, CALENDAR), ['dateAdd']);
	  const norm = TimeDuration.normalize(sign * hours, sign * minutes, sign * seconds, sign * milliseconds, sign * microseconds, sign * nanoseconds);
	  const epochNanoseconds = AddZonedDateTime(GetSlot(zonedDateTime, INSTANT), timeZoneRec, calendarRec, sign * years, sign * months, sign * weeks, sign * days, norm, undefined, options);
	  return CreateTemporalZonedDateTime(epochNanoseconds, timeZoneRec.receiver, calendarRec.receiver);
	}
	function RoundNumberToIncrement(quantity, increment, mode) {
	  if (increment === 1) return quantity;
	  let {
	    quotient,
	    remainder
	  } = quantity.divmod(increment);
	  if (remainder.equals(bigInt.zero)) return quantity;
	  const sign = remainder.lt(bigInt.zero) ? -1 : 1;
	  const tiebreaker = remainder.multiply(2).abs();
	  const tie = tiebreaker.equals(increment);
	  const expandIsNearer = tiebreaker.gt(increment);
	  switch (mode) {
	    case 'ceil':
	      if (sign > 0) quotient = quotient.add(sign);
	      break;
	    case 'floor':
	      if (sign < 0) quotient = quotient.add(sign);
	      break;
	    case 'expand':
	      // always expand if there is a remainder
	      quotient = quotient.add(sign);
	      break;
	    case 'trunc':
	      // no change needed, because divmod is a truncation
	      break;
	    case 'halfCeil':
	      if (expandIsNearer || tie && sign > 0) quotient = quotient.add(sign);
	      break;
	    case 'halfFloor':
	      if (expandIsNearer || tie && sign < 0) quotient = quotient.add(sign);
	      break;
	    case 'halfExpand':
	      // "half up away from zero"
	      if (expandIsNearer || tie) quotient = quotient.add(sign);
	      break;
	    case 'halfTrunc':
	      if (expandIsNearer) quotient = quotient.add(sign);
	      break;
	    case 'halfEven':
	      {
	        if (expandIsNearer || tie && quotient.isOdd()) quotient = quotient.add(sign);
	        break;
	      }
	  }
	  return quotient.multiply(increment);
	}
	function RoundJSNumberToIncrement(quantity, increment, mode) {
	  let quotient = MathTrunc(quantity / increment);
	  const remainder = quantity % increment;
	  if (remainder === 0) return quantity;
	  const sign = remainder < 0 ? -1 : 1;
	  const tiebreaker = MathAbs$2(remainder * 2);
	  const tie = tiebreaker === increment;
	  const expandIsNearer = tiebreaker > increment;
	  switch (mode) {
	    case 'ceil':
	      if (sign > 0) quotient += sign;
	      break;
	    case 'floor':
	      if (sign < 0) quotient += sign;
	      break;
	    case 'expand':
	      // always expand if there is a remainder
	      quotient += sign;
	      break;
	    case 'trunc':
	      // no change needed, because divmod is a truncation
	      break;
	    case 'halfCeil':
	      if (expandIsNearer || tie && sign > 0) quotient += sign;
	      break;
	    case 'halfFloor':
	      if (expandIsNearer || tie && sign < 0) quotient += sign;
	      break;
	    case 'halfExpand':
	      // "half up away from zero"
	      if (expandIsNearer || tie) quotient += sign;
	      break;
	    case 'halfTrunc':
	      if (expandIsNearer) quotient += sign;
	      break;
	    case 'halfEven':
	      {
	        if (expandIsNearer || tie && quotient % 2 === 1) quotient += sign;
	        break;
	      }
	  }
	  return quotient * increment;
	}
	function RoundInstant(epochNs, increment, unit, roundingMode) {
	  let {
	    remainder
	  } = NonNegativeBigIntDivmod(epochNs, DAY_NANOS);
	  const wholeDays = epochNs.minus(remainder);
	  const roundedRemainder = RoundNumberToIncrement(remainder, nsPerTimeUnit[unit] * increment, roundingMode);
	  return wholeDays.plus(roundedRemainder);
	}
	function RoundISODateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, increment, unit, roundingMode) {
	  let deltaDays = 0;
	  ({
	    deltaDays,
	    hour,
	    minute,
	    second,
	    millisecond,
	    microsecond,
	    nanosecond
	  } = RoundTime(hour, minute, second, millisecond, microsecond, nanosecond, increment, unit, roundingMode));
	  ({
	    year,
	    month,
	    day
	  } = BalanceISODate(year, month, day + deltaDays));
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
	function RoundTime(hour, minute, second, millisecond, microsecond, nanosecond, increment, unit, roundingMode) {
	  let quantity = bigInt.zero;
	  switch (unit) {
	    case 'day':
	    case 'hour':
	      quantity = bigInt(hour);
	    // fall through
	    case 'minute':
	      quantity = quantity.multiply(60).plus(minute);
	    // fall through
	    case 'second':
	      quantity = quantity.multiply(60).plus(second);
	    // fall through
	    case 'millisecond':
	      quantity = quantity.multiply(1000).plus(millisecond);
	    // fall through
	    case 'microsecond':
	      quantity = quantity.multiply(1000).plus(microsecond);
	    // fall through
	    case 'nanosecond':
	      quantity = quantity.multiply(1000).plus(nanosecond);
	  }
	  const nsPerUnit = nsPerTimeUnit[unit];
	  const rounded = RoundNumberToIncrement(quantity, nsPerUnit * increment, roundingMode);
	  const result = rounded.divide(nsPerUnit).toJSNumber();
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
	function DaysUntil(earlier, later) {
	  return DifferenceISODate(GetSlot(earlier, ISO_YEAR), GetSlot(earlier, ISO_MONTH), GetSlot(earlier, ISO_DAY), GetSlot(later, ISO_YEAR), GetSlot(later, ISO_MONTH), GetSlot(later, ISO_DAY), 'day').days;
	}
	function MoveRelativeDate(calendarRec, relativeTo, duration) {
	  // dateAdd must be looked up if years, months, weeks != 0
	  const later = AddDate(calendarRec, relativeTo, duration);
	  const days = DaysUntil(relativeTo, later);
	  return {
	    relativeTo: later,
	    days
	  };
	}
	function MoveRelativeZonedDateTime(relativeTo, calendarRec, timeZoneRec, years, months, weeks, days, precalculatedPlainDateTime) {
	  // getOffsetNanosecondsFor and getPossibleInstantsFor must be looked up
	  // dateAdd must be looked up if years, months, weeks != 0
	  const intermediateNs = AddZonedDateTime(GetSlot(relativeTo, INSTANT), timeZoneRec, calendarRec, years, months, weeks, days, TimeDuration.ZERO, precalculatedPlainDateTime);
	  return CreateTemporalZonedDateTime(intermediateNs, timeZoneRec.receiver, calendarRec.receiver);
	}
	function AdjustRoundedDurationDays(years, months, weeks, days, norm, increment, unit, roundingMode, zonedRelativeTo, calendarRec, timeZoneRec, precalculatedPlainDateTime) {
	  // both dateAdd and dateUntil must be looked up if unit <= hour, any rounding
	  // is requested, and any of years...weeks != 0
	  if (IsCalendarUnit(unit) || unit === 'day' || unit === 'nanosecond' && increment === 1) {
	    return {
	      years,
	      months,
	      weeks,
	      days,
	      norm
	    };
	  }

	  // There's one more round of rounding possible: if relativeTo is a
	  // ZonedDateTime, the time units could have rounded up into enough hours
	  // to exceed the day length. If this happens, grow the date part by a
	  // single day and re-run exact time rounding on the smaller remainder. DO
	  // NOT RECURSE, because once the extra hours are sucked up into the date
	  // duration, there's no way for another full day to come from the next
	  // round of rounding. And if it were possible (e.g. contrived calendar
	  // with 30-minute-long "days") then it'd risk an infinite loop.
	  const direction = norm.sign();
	  const calendar = GetSlot(zonedRelativeTo, CALENDAR);
	  // requires dateAdd if years...weeks != 0
	  const dayStart = AddZonedDateTime(GetSlot(zonedRelativeTo, INSTANT), timeZoneRec, calendarRec, years, months, weeks, days, TimeDuration.ZERO, precalculatedPlainDateTime);
	  const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
	  const dayStartInstant = new TemporalInstant(dayStart);
	  const dayStartDateTime = GetPlainDateTimeFor(timeZoneRec, dayStartInstant, calendar);
	  const dayEnd = AddDaysToZonedDateTime(dayStartInstant, dayStartDateTime, timeZoneRec, calendar, direction).epochNs;
	  const dayLength = TimeDuration.fromEpochNsDiff(dayEnd, dayStart);
	  const oneDayLess = norm.subtract(dayLength);
	  if (oneDayLess.sign() * direction >= 0) {
	    // requires dateAdd and dateUntil if years...weeks != 0
	    ({
	      years,
	      months,
	      weeks,
	      days
	    } = AddDuration(years, months, weeks, days, 0, 0, 0, 0, 0, 0, 0, 0, 0, direction, 0, 0, 0, 0, 0, 0, /* plainRelativeTo = */undefined, zonedRelativeTo, calendarRec, timeZoneRec, precalculatedPlainDateTime));
	    ({
	      norm
	    } = RoundDuration(0, 0, 0, 0, oneDayLess, increment, unit, roundingMode));
	  }
	  CombineDateAndNormalizedTimeDuration(years, months, weeks, days, norm);
	  return {
	    years,
	    months,
	    weeks,
	    days,
	    norm
	  };
	}
	function RoundDuration(years, months, weeks, days, norm, increment, unit, roundingMode) {
	  let plainRelativeTo = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : undefined;
	  let calendarRec = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : undefined;
	  let zonedRelativeTo = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : undefined;
	  let timeZoneRec = arguments.length > 11 && arguments[11] !== undefined ? arguments[11] : undefined;
	  let precalculatedPlainDateTime = arguments.length > 12 && arguments[12] !== undefined ? arguments[12] : undefined;
	  // dateAdd and dateUntil must be looked up
	  const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
	  if (IsCalendarUnit(unit) && !plainRelativeTo) {
	    throw new RangeError("A starting point is required for ".concat(unit, "s rounding"));
	  }

	  // First convert time units up to days, if rounding to days or higher units.
	  // If rounding relative to a ZonedDateTime, then some days may not be 24h.
	  let dayLengthNs;
	  if (IsCalendarUnit(unit) || unit === 'day') {
	    let deltaDays;
	    if (zonedRelativeTo) {
	      const intermediate = MoveRelativeZonedDateTime(zonedRelativeTo, calendarRec, timeZoneRec, years, months, weeks, days, precalculatedPlainDateTime);
	      ({
	        days: deltaDays,
	        norm,
	        dayLengthNs
	      } = NormalizedTimeDurationToDays(norm, intermediate, timeZoneRec));
	    } else {
	      ({
	        quotient: deltaDays,
	        remainder: norm
	      } = norm.divmod(DAY_NANOS));
	      dayLengthNs = DAY_NANOS;
	    }
	    days += deltaDays;
	  }
	  let total;
	  switch (unit) {
	    case 'year':
	      {
	        // convert months and weeks to days by calculating difference(
	        // relativeTo + years, relativeTo + { years, months, weeks })
	        const yearsDuration = new TemporalDuration(years);
	        const yearsLater = AddDate(calendarRec, plainRelativeTo, yearsDuration);
	        const yearsMonthsWeeks = new TemporalDuration(years, months, weeks);
	        const yearsMonthsWeeksLater = AddDate(calendarRec, plainRelativeTo, yearsMonthsWeeks);
	        const monthsWeeksInDays = DaysUntil(yearsLater, yearsMonthsWeeksLater);
	        plainRelativeTo = yearsLater;
	        days += monthsWeeksInDays;
	        const isoResult = BalanceISODate(GetSlot(plainRelativeTo, ISO_YEAR), GetSlot(plainRelativeTo, ISO_MONTH), GetSlot(plainRelativeTo, ISO_DAY) + days);
	        const wholeDaysLater = CreateTemporalDate(isoResult.year, isoResult.month, isoResult.day, calendarRec.receiver);
	        const untilOptions = ObjectCreate$7(null);
	        untilOptions.largestUnit = 'year';
	        const yearsPassed = GetSlot(DifferenceDate(calendarRec, plainRelativeTo, wholeDaysLater, untilOptions), YEARS);
	        years += yearsPassed;
	        const yearsPassedDuration = new TemporalDuration(yearsPassed);
	        let daysPassed;
	        ({
	          relativeTo: plainRelativeTo,
	          days: daysPassed
	        } = MoveRelativeDate(calendarRec, plainRelativeTo, yearsPassedDuration));
	        days -= daysPassed;
	        const oneYear = new TemporalDuration(days < 0 ? -1 : 1);
	        let {
	          days: oneYearDays
	        } = MoveRelativeDate(calendarRec, plainRelativeTo, oneYear);
	        oneYearDays = MathAbs$2(oneYearDays);
	        if (oneYearDays === 0) throw new RangeError('custom calendar reported that a year is 0 days long');
	        total = years + (days + norm.fdiv(dayLengthNs)) / oneYearDays;
	        years = RoundJSNumberToIncrement(total, increment, roundingMode);
	        months = weeks = days = 0;
	        norm = TimeDuration.ZERO;
	        break;
	      }
	    case 'month':
	      {
	        // convert weeks to days by calculating difference(relativeTo +
	        //   { years, months }, relativeTo + { years, months, weeks })
	        const yearsMonths = new TemporalDuration(years, months);
	        const yearsMonthsLater = AddDate(calendarRec, plainRelativeTo, yearsMonths);
	        const yearsMonthsWeeks = new TemporalDuration(years, months, weeks);
	        const yearsMonthsWeeksLater = AddDate(calendarRec, plainRelativeTo, yearsMonthsWeeks);
	        const weeksInDays = DaysUntil(yearsMonthsLater, yearsMonthsWeeksLater);
	        plainRelativeTo = yearsMonthsLater;
	        days += weeksInDays;
	        const isoResult = BalanceISODate(GetSlot(plainRelativeTo, ISO_YEAR), GetSlot(plainRelativeTo, ISO_MONTH), GetSlot(plainRelativeTo, ISO_DAY) + days);
	        const wholeDaysLater = CreateTemporalDate(isoResult.year, isoResult.month, isoResult.day, calendarRec.receiver);
	        const untilOptions = ObjectCreate$7(null);
	        untilOptions.largestUnit = 'month';
	        const monthsPassed = GetSlot(DifferenceDate(calendarRec, plainRelativeTo, wholeDaysLater, untilOptions), MONTHS);
	        months += monthsPassed;
	        const monthsPassedDuration = new TemporalDuration(0, monthsPassed);
	        let daysPassed;
	        ({
	          relativeTo: plainRelativeTo,
	          days: daysPassed
	        } = MoveRelativeDate(calendarRec, plainRelativeTo, monthsPassedDuration));
	        days -= daysPassed;
	        const oneMonth = new TemporalDuration(0, days < 0 ? -1 : 1);
	        let {
	          days: oneMonthDays
	        } = MoveRelativeDate(calendarRec, plainRelativeTo, oneMonth);
	        oneMonthDays = MathAbs$2(oneMonthDays);
	        if (oneMonthDays === 0) throw new RangeError('custom calendar reported that a month is 0 days long');
	        total = months + (days + norm.fdiv(dayLengthNs)) / oneMonthDays;
	        months = RoundJSNumberToIncrement(total, increment, roundingMode);
	        weeks = days = 0;
	        norm = TimeDuration.ZERO;
	        break;
	      }
	    case 'week':
	      {
	        const isoResult = BalanceISODate(GetSlot(plainRelativeTo, ISO_YEAR), GetSlot(plainRelativeTo, ISO_MONTH), GetSlot(plainRelativeTo, ISO_DAY) + days);
	        const wholeDaysLater = CreateTemporalDate(isoResult.year, isoResult.month, isoResult.day, calendarRec.receiver);
	        const untilOptions = ObjectCreate$7(null);
	        untilOptions.largestUnit = 'week';
	        const weeksPassed = GetSlot(DifferenceDate(calendarRec, plainRelativeTo, wholeDaysLater, untilOptions), WEEKS);
	        weeks += weeksPassed;
	        const weeksPassedDuration = new TemporalDuration(0, 0, weeksPassed);
	        let daysPassed;
	        ({
	          relativeTo: plainRelativeTo,
	          days: daysPassed
	        } = MoveRelativeDate(calendarRec, plainRelativeTo, weeksPassedDuration));
	        days -= daysPassed;
	        const oneWeek = new TemporalDuration(0, 0, days < 0 ? -1 : 1);
	        let {
	          days: oneWeekDays
	        } = MoveRelativeDate(calendarRec, plainRelativeTo, oneWeek);
	        oneWeekDays = MathAbs$2(oneWeekDays);
	        if (oneWeekDays === 0) throw new RangeError('custom calendar reported that a week is 0 days long');
	        total = weeks + (days + norm.fdiv(dayLengthNs)) / oneWeekDays;
	        weeks = RoundJSNumberToIncrement(total, increment, roundingMode);
	        days = 0;
	        norm = TimeDuration.ZERO;
	        break;
	      }
	    case 'day':
	      {
	        total = days + norm.fdiv(dayLengthNs);
	        days = RoundJSNumberToIncrement(total, increment, roundingMode);
	        norm = TimeDuration.ZERO;
	        break;
	      }
	    case 'hour':
	      {
	        const divisor = 3600e9;
	        total = norm.fdiv(divisor);
	        norm = norm.round(divisor * increment, roundingMode);
	        break;
	      }
	    case 'minute':
	      {
	        const divisor = 60e9;
	        total = norm.fdiv(divisor);
	        norm = norm.round(divisor * increment, roundingMode);
	        break;
	      }
	    case 'second':
	      {
	        const divisor = 1e9;
	        total = norm.fdiv(divisor);
	        norm = norm.round(divisor * increment, roundingMode);
	        break;
	      }
	    case 'millisecond':
	      {
	        const divisor = 1e6;
	        total = norm.fdiv(divisor);
	        norm = norm.round(divisor * increment, roundingMode);
	        break;
	      }
	    case 'microsecond':
	      {
	        const divisor = 1e3;
	        total = norm.fdiv(divisor);
	        norm = norm.round(divisor * increment, roundingMode);
	        break;
	      }
	    case 'nanosecond':
	      {
	        total = norm.totalNs.toJSNumber();
	        norm = norm.round(increment, roundingMode);
	        break;
	      }
	  }
	  CombineDateAndNormalizedTimeDuration(years, months, weeks, days, norm);
	  return {
	    years,
	    months,
	    weeks,
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
	      throw new TypeError("cannot convert ".concat(typeof arg, " to bigint"));
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
	  if (options === undefined) return ObjectCreate$7(null);
	  if (Type$d(options) === 'Object') return options;
	  throw new TypeError("Options parameter must be an object, not ".concat(options === null ? 'null' : "a ".concat(typeof options)));
	}
	function SnapshotOwnProperties(source, proto) {
	  let excludedKeys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
	  let excludedValues = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
	  const copy = ObjectCreate$7(proto);
	  CopyDataProperties(copy, source, excludedKeys, excludedValues);
	  return copy;
	}
	function GetOption(options, property, allowedValues, fallback) {
	  let value = options[property];
	  if (value !== undefined) {
	    value = ToString$1(value);
	    if (!allowedValues.includes(value)) {
	      throw new RangeError("".concat(property, " must be one of ").concat(allowedValues.join(', '), ", not ").concat(value));
	    }
	    return value;
	  }
	  return fallback;
	}
	function IsBuiltinCalendar(id) {
	  return Call$4(ArrayIncludes$1, BUILTIN_CALENDAR_IDS, [ASCIILowercase(id)]);
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
	    const code = Call$4(StringPrototypeCharCodeAt, str, [ix]);
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
	  const compareCode = constructorName === 'PlainMonthDay' ? 'Temporal.PlainDate.compare(obj1.toPlainDate(year), obj2.toPlainDate(year))' : "Temporal.".concat(constructorName, ".compare(obj1, obj2)");
	  throw new TypeError('Do not use built-in arithmetic operators with Temporal objects. ' + "When comparing, use ".concat(compareCode, ", not obj1 > obj2. ") + "When coercing to strings, use `${obj}` or String(obj), not '' + obj. " + 'When coercing to numbers, use properties or methods of the object, not `+obj`. ' + 'When concatenating with strings, use `${str}${obj}` or str.concat(obj), not str + obj. ' + 'In React, coerce to a string before rendering a Temporal object.');
	}
	const OFFSET = new RegExp("^".concat(offset.source, "$"));
	const OFFSET_WITH_PARTS = new RegExp("^".concat(offsetWithParts.source, "$"));
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
	      throw new Error("invalid state in bisection ".concat(lstate, " - ").concat(mstate, " - ").concat(rstate));
	    }
	  }
	  return right;
	}
	const nsPerTimeUnit = {
	  day: 86400e9,
	  hour: 3600e9,
	  minute: 60e9,
	  second: 1e9,
	  millisecond: 1e6,
	  microsecond: 1e3,
	  nanosecond: 1
	};

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
	const IntlDateTimeFormat$1 = globalThis.Intl.DateTimeFormat;
	const ObjectAssign$2 = Object.assign;
	const ObjectCreate$6 = Object.create;
	const ObjectDefineProperty = Object.defineProperty;

	// Construction of built-in Intl.DateTimeFormat objects is sloooooow,
	// so we'll only create those instances when we need them.
	// See https://bugs.chromium.org/p/v8/issues/detail?id=6528
	function getSlotLazy(obj, slot) {
	  let val = GetSlot(obj, slot);
	  if (typeof val === 'function') {
	    val = new IntlDateTimeFormat$1(GetSlot(obj, LOCALE), val(GetSlot(obj, OPTIONS)));
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
	    options = ToObject$1(options);
	    const newOptions = ObjectCreate$6(null);
	    for (const prop of props) {
	      if (HasOwnProperty$1(options, prop)) {
	        newOptions[prop] = options[prop];
	      }
	    }
	    options = newOptions;
	  } else {
	    options = ObjectCreate$6(null);
	  }
	  const original = new IntlDateTimeFormat$1(locale, options);
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
	    const clonedResolved = ObjectAssign$2(ObjectCreate$6(null), ro);
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
	    if (!record) throw new RangeError("Intl.DateTimeFormat formats built-in time zones, not ".concat(id));
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
	      return Call$4(format, _this, [datetime, ...args]);
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
	    return Call$4(formatRange, this, [a, b]);
	  }
	  formatToParts(datetime) {
	    if (!HasSlot(this, ORIGINAL)) throw new TypeError('invalid receiver');
	    for (var _len2 = arguments.length, rest = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	      rest[_key2 - 1] = arguments[_key2];
	    }
	    return Call$4(formatToParts, this, [datetime, ...rest]);
	  }
	  formatRangeToParts(a, b) {
	    if (!HasSlot(this, ORIGINAL)) throw new TypeError('invalid receiver');
	    return Call$4(formatRangeToParts, this, [a, b]);
	  }
	  resolvedOptions() {
	    if (!HasSlot(this, ORIGINAL)) throw new TypeError('invalid receiver');
	    return Call$4(resolvedOptions, this, []);
	  }
	}
	if (!('formatToParts' in IntlDateTimeFormat$1.prototype)) {
	  delete DateTimeFormatImpl.prototype.formatToParts;
	}
	if (!('formatRangeToParts' in IntlDateTimeFormat$1.prototype)) {
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
	DateTimeFormat.supportedLocalesOf = IntlDateTimeFormat$1.supportedLocalesOf;
	MakeIntrinsicClass(DateTimeFormat, 'Intl.DateTimeFormat');
	function resolvedOptions() {
	  const resolved = GetSlot(this, ORIGINAL).resolvedOptions();
	  resolved.timeZone = GetSlot(this, TZ_ORIGINAL);
	  return resolved;
	}
	function format(datetime) {
	  let {
	    instant,
	    formatter
	  } = extractOverrides(datetime, this);
	  if (instant && formatter) {
	    return formatter.format(instant.epochMilliseconds);
	  }
	  for (var _len3 = arguments.length, rest = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
	    rest[_key3 - 1] = arguments[_key3];
	  }
	  return GetSlot(this, ORIGINAL).format(datetime, ...rest);
	}
	function formatToParts(datetime) {
	  let {
	    instant,
	    formatter
	  } = extractOverrides(datetime, this);
	  if (instant && formatter) {
	    return formatter.formatToParts(instant.epochMilliseconds);
	  }
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
	      instant: aa,
	      formatter: aformatter
	    } = extractOverrides(a, this);
	    const {
	      instant: bb,
	      formatter: bformatter
	    } = extractOverrides(b, this);
	    if (aa && bb && aformatter && bformatter && aformatter === bformatter) {
	      return aformatter.formatRange(aa.epochMilliseconds, bb.epochMilliseconds);
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
	      instant: aa,
	      formatter: aformatter
	    } = extractOverrides(a, this);
	    const {
	      instant: bb,
	      formatter: bformatter
	    } = extractOverrides(b, this);
	    if (aa && bb && aformatter && bformatter && aformatter === bformatter) {
	      return aformatter.formatRangeToParts(aa.epochMilliseconds, bb.epochMilliseconds);
	    }
	  }
	  return GetSlot(this, ORIGINAL).formatRangeToParts(a, b);
	}
	function amend() {
	  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	  let amended = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  options = ObjectAssign$2({}, options);
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
	    options = ObjectAssign$2({}, options, {
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
	    options = ObjectAssign$2(options, {
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
	    options = ObjectAssign$2({}, options, {
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
	    options = ObjectAssign$2({}, options, {
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
	    options = ObjectAssign$2({}, options, {
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
	    options = ObjectAssign$2({}, options, {
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
	    const hour = GetSlot(temporalObj, ISO_HOUR);
	    const minute = GetSlot(temporalObj, ISO_MINUTE);
	    const second = GetSlot(temporalObj, ISO_SECOND);
	    const millisecond = GetSlot(temporalObj, ISO_MILLISECOND);
	    const microsecond = GetSlot(temporalObj, ISO_MICROSECOND);
	    const nanosecond = GetSlot(temporalObj, ISO_NANOSECOND);
	    const datetime = CreateTemporalDateTime(1970, 1, 1, hour, minute, second, millisecond, microsecond, nanosecond, 'iso8601');
	    const timeZoneRec = new TimeZoneMethodRecord(GetSlot(main, TZ_CANONICAL), ['getOffsetNanosecondsFor', 'getPossibleInstantsFor']);
	    return {
	      instant: GetInstantFor(timeZoneRec, datetime, 'compatible'),
	      formatter: getSlotLazy(main, TIME)
	    };
	  }
	  if (IsTemporalYearMonth(temporalObj)) {
	    const isoYear = GetSlot(temporalObj, ISO_YEAR);
	    const isoMonth = GetSlot(temporalObj, ISO_MONTH);
	    const referenceISODay = GetSlot(temporalObj, ISO_DAY);
	    const calendar = ToTemporalCalendarIdentifier(GetSlot(temporalObj, CALENDAR));
	    const mainCalendar = GetSlot(main, CAL_ID);
	    if (calendar !== mainCalendar) {
	      throw new RangeError("cannot format PlainYearMonth with calendar ".concat(calendar, " in locale with calendar ").concat(mainCalendar));
	    }
	    const datetime = CreateTemporalDateTime(isoYear, isoMonth, referenceISODay, 12, 0, 0, 0, 0, 0, calendar);
	    const timeZoneRec = new TimeZoneMethodRecord(GetSlot(main, TZ_CANONICAL), ['getOffsetNanosecondsFor', 'getPossibleInstantsFor']);
	    return {
	      instant: GetInstantFor(timeZoneRec, datetime, 'compatible'),
	      formatter: getSlotLazy(main, YM)
	    };
	  }
	  if (IsTemporalMonthDay(temporalObj)) {
	    const referenceISOYear = GetSlot(temporalObj, ISO_YEAR);
	    const isoMonth = GetSlot(temporalObj, ISO_MONTH);
	    const isoDay = GetSlot(temporalObj, ISO_DAY);
	    const calendar = ToTemporalCalendarIdentifier(GetSlot(temporalObj, CALENDAR));
	    const mainCalendar = GetSlot(main, CAL_ID);
	    if (calendar !== mainCalendar) {
	      throw new RangeError("cannot format PlainMonthDay with calendar ".concat(calendar, " in locale with calendar ").concat(mainCalendar));
	    }
	    const datetime = CreateTemporalDateTime(referenceISOYear, isoMonth, isoDay, 12, 0, 0, 0, 0, 0, calendar);
	    const timeZoneRec = new TimeZoneMethodRecord(GetSlot(main, TZ_CANONICAL), ['getOffsetNanosecondsFor', 'getPossibleInstantsFor']);
	    return {
	      instant: GetInstantFor(timeZoneRec, datetime, 'compatible'),
	      formatter: getSlotLazy(main, MD)
	    };
	  }
	  if (IsTemporalDate(temporalObj)) {
	    const isoYear = GetSlot(temporalObj, ISO_YEAR);
	    const isoMonth = GetSlot(temporalObj, ISO_MONTH);
	    const isoDay = GetSlot(temporalObj, ISO_DAY);
	    const calendar = ToTemporalCalendarIdentifier(GetSlot(temporalObj, CALENDAR));
	    const mainCalendar = GetSlot(main, CAL_ID);
	    if (calendar !== 'iso8601' && calendar !== mainCalendar) {
	      throw new RangeError("cannot format PlainDate with calendar ".concat(calendar, " in locale with calendar ").concat(mainCalendar));
	    }
	    const datetime = CreateTemporalDateTime(isoYear, isoMonth, isoDay, 12, 0, 0, 0, 0, 0, mainCalendar);
	    const timeZoneRec = new TimeZoneMethodRecord(GetSlot(main, TZ_CANONICAL), ['getOffsetNanosecondsFor', 'getPossibleInstantsFor']);
	    return {
	      instant: GetInstantFor(timeZoneRec, datetime, 'compatible'),
	      formatter: getSlotLazy(main, DATE)
	    };
	  }
	  if (IsTemporalDateTime(temporalObj)) {
	    const calendar = ToTemporalCalendarIdentifier(GetSlot(temporalObj, CALENDAR));
	    const mainCalendar = GetSlot(main, CAL_ID);
	    if (calendar !== 'iso8601' && calendar !== mainCalendar) {
	      throw new RangeError("cannot format PlainDateTime with calendar ".concat(calendar, " in locale with calendar ").concat(mainCalendar));
	    }
	    const timeZoneRec = new TimeZoneMethodRecord(GetSlot(main, TZ_CANONICAL), ['getOffsetNanosecondsFor', 'getPossibleInstantsFor']);
	    return {
	      instant: GetInstantFor(timeZoneRec, temporalObj, 'compatible'),
	      formatter: getSlotLazy(main, DATETIME)
	    };
	  }
	  if (IsTemporalZonedDateTime(temporalObj)) {
	    throw new TypeError('Temporal.ZonedDateTime not supported in DateTimeFormat methods. Use toLocaleString() instead.');
	  }
	  if (IsTemporalInstant(temporalObj)) {
	    return {
	      instant: temporalObj,
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

	const ObjectCreate$5 = Object.create;
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
	      const dateTime = GetPlainDateTimeFor(undefined, this, 'iso8601', 0);
	      const repr = TemporalDateTimeToString(dateTime, 'auto', 'never') + 'Z';
	      Object.defineProperty(this, '_repr_', {
	        value: "".concat(this[Symbol.toStringTag], " <").concat(repr, ">"),
	        writable: false,
	        enumerable: false,
	        configurable: false
	      });
	    }
	  }
	  get epochSeconds() {
	    if (!IsTemporalInstant(this)) throw new TypeError('invalid receiver');
	    const value = GetSlot(this, EPOCHNANOSECONDS);
	    return BigIntFloorDiv(value, 1e9).toJSNumber();
	  }
	  get epochMilliseconds() {
	    if (!IsTemporalInstant(this)) throw new TypeError('invalid receiver');
	    const value = bigInt(GetSlot(this, EPOCHNANOSECONDS));
	    return BigIntFloorDiv(value, 1e6).toJSNumber();
	  }
	  get epochMicroseconds() {
	    if (!IsTemporalInstant(this)) throw new TypeError('invalid receiver');
	    const value = GetSlot(this, EPOCHNANOSECONDS);
	    return BigIntIfAvailable(BigIntFloorDiv(value, 1e3));
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
	    if (Type$d(roundTo) === 'String') {
	      const stringParam = roundTo;
	      roundTo = ObjectCreate$5(null);
	      roundTo.smallestUnit = stringParam;
	    } else {
	      roundTo = GetOptionsObject(roundTo);
	    }
	    const roundingIncrement = ToTemporalRoundingIncrement(roundTo);
	    const roundingMode = ToTemporalRoundingMode(roundTo, 'halfExpand');
	    const smallestUnit = GetTemporalUnit(roundTo, 'smallestUnit', 'time', REQUIRED);
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
	    const roundedNs = RoundInstant(ns, roundingIncrement, smallestUnit, roundingMode);
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
	    const digits = ToFractionalSecondDigits(options);
	    const roundingMode = ToTemporalRoundingMode(options, 'trunc');
	    const smallestUnit = GetTemporalUnit(options, 'smallestUnit', 'time', undefined);
	    if (smallestUnit === 'hour') throw new RangeError('smallestUnit must be a time unit other than "hour"');
	    let timeZone = options.timeZone;
	    if (timeZone !== undefined) timeZone = ToTemporalTimeZoneSlotValue(timeZone);
	    const {
	      precision,
	      unit,
	      increment
	    } = ToSecondsStringPrecisionRecord(smallestUnit, digits);
	    const ns = GetSlot(this, EPOCHNANOSECONDS);
	    const roundedNs = RoundInstant(ns, increment, unit, roundingMode);
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
	  toZonedDateTime(item) {
	    if (!IsTemporalInstant(this)) throw new TypeError('invalid receiver');
	    if (Type$d(item) !== 'Object') {
	      throw new TypeError('invalid argument in toZonedDateTime');
	    }
	    const calendarLike = item.calendar;
	    if (calendarLike === undefined) {
	      throw new TypeError('missing calendar property in toZonedDateTime');
	    }
	    const calendar = ToTemporalCalendarSlotValue(calendarLike);
	    const temporalTimeZoneLike = item.timeZone;
	    if (temporalTimeZoneLike === undefined) {
	      throw new TypeError('missing timeZone property in toZonedDateTime');
	    }
	    const timeZone = ToTemporalTimeZoneSlotValue(temporalTimeZoneLike);
	    return CreateTemporalZonedDateTime(GetSlot(this, EPOCHNANOSECONDS), timeZone, calendar);
	  }
	  toZonedDateTimeISO(timeZone) {
	    if (!IsTemporalInstant(this)) throw new TypeError('invalid receiver');
	    timeZone = ToTemporalTimeZoneSlotValue(timeZone);
	    return CreateTemporalZonedDateTime(GetSlot(this, EPOCHNANOSECONDS), timeZone, 'iso8601');
	  }
	  static fromEpochSeconds(epochSeconds) {
	    epochSeconds = ToNumber$2(epochSeconds);
	    const epochNanoseconds = bigInt(epochSeconds).multiply(1e9);
	    ValidateEpochNanoseconds(epochNanoseconds);
	    return new Instant(epochNanoseconds);
	  }
	  static fromEpochMilliseconds(epochMilliseconds) {
	    epochMilliseconds = ToNumber$2(epochMilliseconds);
	    const epochNanoseconds = bigInt(epochMilliseconds).multiply(1e6);
	    ValidateEpochNanoseconds(epochNanoseconds);
	    return new Instant(epochNanoseconds);
	  }
	  static fromEpochMicroseconds(epochMicroseconds) {
	    epochMicroseconds = ToBigInt(epochMicroseconds);
	    const epochNanoseconds = epochMicroseconds.multiply(1e3);
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

	/* global true */

	const ArrayFrom = Array.from;
	const ArrayIncludes = Array.prototype.includes;
	const ArrayPrototypePush$2 = Array.prototype.push;
	const ArrayPrototypeSort = Array.prototype.sort;
	const IntlDateTimeFormat = globalThis.Intl.DateTimeFormat;
	const MathAbs$1 = Math.abs;
	const MathFloor = Math.floor;
	const ObjectAssign$1 = Object.assign;
	const ObjectCreate$4 = Object.create;
	const ObjectEntries = Object.entries;
	const OriginalMap = Map;
	const OriginalSet = Set;
	const OriginalWeakMap = WeakMap;
	const ReflectOwnKeys = Reflect.ownKeys;
	const MapPrototypeEntries = Map.prototype.entries;
	const MapPrototypeGet = Map.prototype.get;
	const MapPrototypeSet = Map.prototype.set;
	const SetPrototypeAdd = Set.prototype.add;
	const SetPrototypeDelete = Set.prototype.delete;
	const SetPrototypeHas = Set.prototype.has;
	const SetPrototypeValues = Set.prototype.values;
	const SymbolIterator = Symbol.iterator;
	const WeakMapPrototypeGet = WeakMap.prototype.get;
	const WeakMapPrototypeSet = WeakMap.prototype.set;
	const MapIterator = Call$4(MapPrototypeEntries, new Map(), []);
	const MapIteratorPrototypeNext = MapIterator.next;
	const SetIterator = Call$4(SetPrototypeValues, new Set(), []);
	const SetIteratorPrototypeNext = SetIterator.next;
	function arrayFromSet(src) {
	  const valuesIterator = Call$4(SetPrototypeValues, src, []);
	  return ArrayFrom({
	    [SymbolIterator]() {
	      return this;
	    },
	    next() {
	      return Call$4(SetIteratorPrototypeNext, valuesIterator, []);
	    }
	  });
	}
	const impl = {};
	class Calendar {
	  constructor(id) {
	    let stringId = RequireString(id);
	    if (!IsBuiltinCalendar(stringId)) throw new RangeError("invalid calendar identifier ".concat(stringId));
	    CreateSlots(this);
	    stringId = ASCIILowercase(stringId);
	    SetSlot(this, CALENDAR_ID, stringId);
	    {
	      Object.defineProperty(this, '_repr_', {
	        value: "Temporal.Calendar <".concat(stringId, ">"),
	        writable: false,
	        enumerable: false,
	        configurable: false
	      });
	    }
	  }
	  get id() {
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, CALENDAR_ID);
	  }
	  dateFromFields(fields) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    if (Type$d(fields) !== 'Object') throw new TypeError('invalid fields');
	    options = GetOptionsObject(options);
	    const id = GetSlot(this, CALENDAR_ID);
	    return impl[id].dateFromFields(fields, options, id);
	  }
	  yearMonthFromFields(fields) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    if (Type$d(fields) !== 'Object') throw new TypeError('invalid fields');
	    options = GetOptionsObject(options);
	    const id = GetSlot(this, CALENDAR_ID);
	    return impl[id].yearMonthFromFields(fields, options, id);
	  }
	  monthDayFromFields(fields) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    if (Type$d(fields) !== 'Object') throw new TypeError('invalid fields');
	    options = GetOptionsObject(options);
	    const id = GetSlot(this, CALENDAR_ID);
	    return impl[id].monthDayFromFields(fields, options, id);
	  }
	  fields(fields) {
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    const fieldsArray = [];
	    const allowed = new OriginalSet(['year', 'month', 'monthCode', 'day']);
	    const iteratorRecord = GetIterator$1(fields, 'sync');
	    const abort = err => {
	      const completion = new CompletionRecord$2('throw', err);
	      return IteratorClose$1(iteratorRecord, completion)['?']();
	    };
	    let next = true;
	    while (next !== false) {
	      next = IteratorStep$1(iteratorRecord);
	      if (next !== false) {
	        let name = IteratorValue$1(next);
	        if (Type$d(name) !== 'String') return abort(new TypeError('invalid fields'));
	        if (!Call$4(SetPrototypeHas, allowed, [name])) {
	          return abort(new RangeError("invalid or duplicate field name ".concat(name)));
	        }
	        Call$4(SetPrototypeDelete, allowed, [name]);
	        Call$4(ArrayPrototypePush$2, fieldsArray, [name]);
	      }
	    }
	    return impl[GetSlot(this, CALENDAR_ID)].fields(fieldsArray);
	  }
	  mergeFields(fields, additionalFields) {
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    const fieldsCopy = SnapshotOwnProperties(ToObject$1(fields), null, [], [undefined]);
	    const additionalFieldsCopy = SnapshotOwnProperties(ToObject$1(additionalFields), null, [], [undefined]);
	    const additionalKeys = ReflectOwnKeys(additionalFieldsCopy);
	    const overriddenKeys = impl[GetSlot(this, CALENDAR_ID)].fieldKeysToIgnore(additionalKeys);
	    const merged = ObjectCreate$4(null);
	    const fieldsKeys = ReflectOwnKeys(fieldsCopy);
	    for (let ix = 0; ix < fieldsKeys.length; ix++) {
	      const key = fieldsKeys[ix];
	      let propValue = undefined;
	      if (Call$4(ArrayIncludes, overriddenKeys, [key])) propValue = additionalFieldsCopy[key];else propValue = fieldsCopy[key];
	      if (propValue !== undefined) merged[key] = propValue;
	    }
	    CopyDataProperties(merged, additionalFieldsCopy, []);
	    return merged;
	  }
	  dateAdd(date, duration) {
	    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    date = ToTemporalDate(date);
	    duration = ToTemporalDuration(duration);
	    options = GetOptionsObject(options);
	    const overflow = ToTemporalOverflow(options);
	    const norm = TimeDuration.normalize(GetSlot(duration, HOURS), GetSlot(duration, MINUTES), GetSlot(duration, SECONDS), GetSlot(duration, MILLISECONDS), GetSlot(duration, MICROSECONDS), GetSlot(duration, NANOSECONDS));
	    const days = GetSlot(duration, DAYS) + BalanceTimeDuration(norm, 'day').days;
	    const id = GetSlot(this, CALENDAR_ID);
	    return impl[id].dateAdd(date, GetSlot(duration, YEARS), GetSlot(duration, MONTHS), GetSlot(duration, WEEKS), days, overflow, id);
	  }
	  dateUntil(one, two) {
	    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    one = ToTemporalDate(one);
	    two = ToTemporalDate(two);
	    options = GetOptionsObject(options);
	    let largestUnit = GetTemporalUnit(options, 'largestUnit', 'date', 'auto');
	    if (largestUnit === 'auto') largestUnit = 'day';
	    const {
	      years,
	      months,
	      weeks,
	      days
	    } = impl[GetSlot(this, CALENDAR_ID)].dateUntil(one, two, largestUnit);
	    const Duration = GetIntrinsic('%Temporal.Duration%');
	    return new Duration(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
	  }
	  year(date) {
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    if (!IsTemporalYearMonth(date)) date = ToTemporalDate(date);
	    return impl[GetSlot(this, CALENDAR_ID)].year(date);
	  }
	  month(date) {
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    if (IsTemporalMonthDay(date)) throw new TypeError('use monthCode on PlainMonthDay instead');
	    if (!IsTemporalYearMonth(date)) date = ToTemporalDate(date);
	    return impl[GetSlot(this, CALENDAR_ID)].month(date);
	  }
	  monthCode(date) {
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    if (!IsTemporalYearMonth(date) && !IsTemporalMonthDay(date)) date = ToTemporalDate(date);
	    return impl[GetSlot(this, CALENDAR_ID)].monthCode(date);
	  }
	  day(date) {
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    if (!IsTemporalMonthDay(date)) date = ToTemporalDate(date);
	    return impl[GetSlot(this, CALENDAR_ID)].day(date);
	  }
	  era(date) {
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    if (!IsTemporalYearMonth(date)) date = ToTemporalDate(date);
	    return impl[GetSlot(this, CALENDAR_ID)].era(date);
	  }
	  eraYear(date) {
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    if (!IsTemporalYearMonth(date)) date = ToTemporalDate(date);
	    return impl[GetSlot(this, CALENDAR_ID)].eraYear(date);
	  }
	  dayOfWeek(date) {
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    date = ToTemporalDate(date);
	    return impl[GetSlot(this, CALENDAR_ID)].dayOfWeek(date);
	  }
	  dayOfYear(date) {
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    date = ToTemporalDate(date);
	    return impl[GetSlot(this, CALENDAR_ID)].dayOfYear(date);
	  }
	  calendarDateWeekOfYear(date) {
	    // Supports only Gregorian and ISO8601 calendar; can be updated to add support for other calendars.
	    // Returns undefined for calendars without a well-defined week calendar system.
	    // eslint-disable-next-line max-len
	    // Also see: https://github.com/unicode-org/icu/blob/ab72ab1d4a3c3f9beeb7d92b0c7817ca93dfdb04/icu4c/source/i18n/calendar.cpp#L1606
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    date = ToTemporalDate(date);
	    const id = GetSlot(this, CALENDAR_ID);
	    if (id !== 'gregory' && id !== 'iso8601') {
	      return {
	        week: undefined,
	        year: undefined
	      };
	    }
	    const calendar = impl[id];
	    let yow = GetSlot(date, ISO_YEAR);
	    const dayOfWeek = this.dayOfWeek(date);
	    const dayOfYear = this.dayOfYear(date);
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
	      var prevDoy = dayOfYear + this.daysInYear(this.dateAdd(date, {
	        years: -1
	      }));
	      woy = weekNumber(fdow, mdow, prevDoy, dayOfWeek);
	      yow--;
	    } else {
	      // For it to be week 1 of the next year, dayOfYear must be >= lastDoy - 5
	      //          L-5                  L
	      // doy: 359 360 361 362 363 364 365 001
	      // dow:      1   2   3   4   5   6   7
	      var lastDoy = this.daysInYear(date);
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
	  weekOfYear(date) {
	    return this.calendarDateWeekOfYear(date).week;
	  }
	  yearOfWeek(date) {
	    return this.calendarDateWeekOfYear(date).year;
	  }
	  daysInWeek(date) {
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    date = ToTemporalDate(date);
	    return impl[GetSlot(this, CALENDAR_ID)].daysInWeek(date);
	  }
	  daysInMonth(date) {
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    if (!IsTemporalYearMonth(date)) date = ToTemporalDate(date);
	    return impl[GetSlot(this, CALENDAR_ID)].daysInMonth(date);
	  }
	  daysInYear(date) {
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    if (!IsTemporalYearMonth(date)) date = ToTemporalDate(date);
	    return impl[GetSlot(this, CALENDAR_ID)].daysInYear(date);
	  }
	  monthsInYear(date) {
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    if (!IsTemporalYearMonth(date)) date = ToTemporalDate(date);
	    return impl[GetSlot(this, CALENDAR_ID)].monthsInYear(date);
	  }
	  inLeapYear(date) {
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    if (!IsTemporalYearMonth(date)) date = ToTemporalDate(date);
	    return impl[GetSlot(this, CALENDAR_ID)].inLeapYear(date);
	  }
	  toString() {
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, CALENDAR_ID);
	  }
	  toJSON() {
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, CALENDAR_ID);
	  }
	  static from(item) {
	    const calendarSlotValue = ToTemporalCalendarSlotValue(item);
	    return ToTemporalCalendarObject(calendarSlotValue);
	  }
	}
	MakeIntrinsicClass(Calendar, 'Temporal.Calendar');
	DefineIntrinsic('Temporal.Calendar.from', Calendar.from);
	DefineIntrinsic('Temporal.Calendar.prototype.dateAdd', Calendar.prototype.dateAdd);
	DefineIntrinsic('Temporal.Calendar.prototype.dateFromFields', Calendar.prototype.dateFromFields);
	DefineIntrinsic('Temporal.Calendar.prototype.dateUntil', Calendar.prototype.dateUntil);
	DefineIntrinsic('Temporal.Calendar.prototype.day', Calendar.prototype.day);
	DefineIntrinsic('Temporal.Calendar.prototype.dayOfWeek', Calendar.prototype.dayOfWeek);
	DefineIntrinsic('Temporal.Calendar.prototype.dayOfYear', Calendar.prototype.dayOfYear);
	DefineIntrinsic('Temporal.Calendar.prototype.daysInMonth', Calendar.prototype.daysInMonth);
	DefineIntrinsic('Temporal.Calendar.prototype.daysInWeek', Calendar.prototype.daysInWeek);
	DefineIntrinsic('Temporal.Calendar.prototype.daysInYear', Calendar.prototype.daysInYear);
	DefineIntrinsic('Temporal.Calendar.prototype.era', Calendar.prototype.era);
	DefineIntrinsic('Temporal.Calendar.prototype.eraYear', Calendar.prototype.eraYear);
	DefineIntrinsic('Temporal.Calendar.prototype.fields', Calendar.prototype.fields);
	DefineIntrinsic('Temporal.Calendar.prototype.inLeapYear', Calendar.prototype.inLeapYear);
	DefineIntrinsic('Temporal.Calendar.prototype.mergeFields', Calendar.prototype.mergeFields);
	DefineIntrinsic('Temporal.Calendar.prototype.month', Calendar.prototype.month);
	DefineIntrinsic('Temporal.Calendar.prototype.monthCode', Calendar.prototype.monthCode);
	DefineIntrinsic('Temporal.Calendar.prototype.monthDayFromFields', Calendar.prototype.monthDayFromFields);
	DefineIntrinsic('Temporal.Calendar.prototype.monthsInYear', Calendar.prototype.monthsInYear);
	DefineIntrinsic('Temporal.Calendar.prototype.weekOfYear', Calendar.prototype.weekOfYear);
	DefineIntrinsic('Temporal.Calendar.prototype.year', Calendar.prototype.year);
	DefineIntrinsic('Temporal.Calendar.prototype.yearMonthFromFields', Calendar.prototype.yearMonthFromFields);
	DefineIntrinsic('Temporal.Calendar.prototype.yearOfWeek', Calendar.prototype.yearOfWeek);
	impl['iso8601'] = {
	  dateFromFields(fields, options, calendarSlotValue) {
	    fields = PrepareTemporalFields(fields, ['day', 'month', 'monthCode', 'year'], ['year', 'day']);
	    const overflow = ToTemporalOverflow(options);
	    fields = resolveNonLunisolarMonth(fields);
	    let {
	      year,
	      month,
	      day
	    } = fields;
	    ({
	      year,
	      month,
	      day
	    } = RegulateISODate(year, month, day, overflow));
	    return CreateTemporalDate(year, month, day, calendarSlotValue);
	  },
	  yearMonthFromFields(fields, options, calendarSlotValue) {
	    fields = PrepareTemporalFields(fields, ['month', 'monthCode', 'year'], ['year']);
	    const overflow = ToTemporalOverflow(options);
	    fields = resolveNonLunisolarMonth(fields);
	    let {
	      year,
	      month
	    } = fields;
	    ({
	      year,
	      month
	    } = RegulateISOYearMonth(year, month, overflow));
	    return CreateTemporalYearMonth(year, month, calendarSlotValue, /* referenceISODay = */1);
	  },
	  monthDayFromFields(fields, options, calendarSlotValue) {
	    fields = PrepareTemporalFields(fields, ['day', 'month', 'monthCode', 'year'], ['day']);
	    const overflow = ToTemporalOverflow(options);
	    const referenceISOYear = 1972;
	    fields = resolveNonLunisolarMonth(fields);
	    let {
	      month,
	      day,
	      year
	    } = fields;
	    ({
	      month,
	      day
	    } = RegulateISODate(year !== undefined ? year : referenceISOYear, month, day, overflow));
	    return CreateTemporalMonthDay(month, day, calendarSlotValue, referenceISOYear);
	  },
	  fields(fields) {
	    return fields;
	  },
	  fieldKeysToIgnore(keys) {
	    const result = new OriginalSet();
	    for (let ix = 0; ix < keys.length; ix++) {
	      const key = keys[ix];
	      Call$4(SetPrototypeAdd, result, [key]);
	      if (key === 'month') {
	        Call$4(SetPrototypeAdd, result, ['monthCode']);
	      } else if (key === 'monthCode') {
	        Call$4(SetPrototypeAdd, result, ['month']);
	      }
	    }
	    return arrayFromSet(result);
	  },
	  dateAdd(date, years, months, weeks, days, overflow, calendarSlotValue) {
	    let year = GetSlot(date, ISO_YEAR);
	    let month = GetSlot(date, ISO_MONTH);
	    let day = GetSlot(date, ISO_DAY);
	    ({
	      year,
	      month,
	      day
	    } = AddISODate(year, month, day, years, months, weeks, days, overflow));
	    return CreateTemporalDate(year, month, day, calendarSlotValue);
	  },
	  dateUntil(one, two, largestUnit) {
	    return DifferenceISODate(GetSlot(one, ISO_YEAR), GetSlot(one, ISO_MONTH), GetSlot(one, ISO_DAY), GetSlot(two, ISO_YEAR), GetSlot(two, ISO_MONTH), GetSlot(two, ISO_DAY), largestUnit);
	  },
	  year(date) {
	    return GetSlot(date, ISO_YEAR);
	  },
	  era() {
	    return undefined;
	  },
	  eraYear() {
	    return undefined;
	  },
	  month(date) {
	    return GetSlot(date, ISO_MONTH);
	  },
	  monthCode(date) {
	    return buildMonthCode(GetSlot(date, ISO_MONTH));
	  },
	  day(date) {
	    return GetSlot(date, ISO_DAY);
	  },
	  dayOfWeek(date) {
	    return DayOfWeek(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH), GetSlot(date, ISO_DAY));
	  },
	  dayOfYear(date) {
	    return DayOfYear(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH), GetSlot(date, ISO_DAY));
	  },
	  daysInWeek() {
	    return 7;
	  },
	  daysInMonth(date) {
	    return ISODaysInMonth(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH));
	  },
	  daysInYear(date) {
	    if (!HasSlot(date, ISO_YEAR)) date = ToTemporalDate(date);
	    return LeapYear(GetSlot(date, ISO_YEAR)) ? 366 : 365;
	  },
	  monthsInYear() {
	    return 12;
	  },
	  inLeapYear(date) {
	    if (!HasSlot(date, ISO_YEAR)) date = ToTemporalDate(date);
	    return LeapYear(GetSlot(date, ISO_YEAR));
	  }
	};

	// Note: other built-in calendars than iso8601 are not part of the Temporal
	// proposal for ECMA-262. These calendars will be standardized as part of
	// ECMA-402.

	function monthCodeNumberPart(monthCode) {
	  if (!monthCode.startsWith('M')) {
	    throw new RangeError("Invalid month code: ".concat(monthCode, ".  Month codes must start with M."));
	  }
	  const month = +monthCode.slice(1);
	  if (isNaN(month)) throw new RangeError("Invalid month code: ".concat(monthCode));
	  return month;
	}
	function buildMonthCode(month) {
	  let leap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	  return "M".concat(month.toString().padStart(2, '0')).concat(leap ? 'L' : '');
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
	      throw new RangeError("monthCode ".concat(monthCode, " and month ").concat(month, " must match if both are present"));
	    }
	    if (monthCode !== buildMonthCode(numberPart)) {
	      throw new RangeError("Invalid month code: ".concat(monthCode));
	    }
	    month = numberPart;
	    if (month < 1 || month > monthsPerYear) throw new RangeError("Invalid monthCode: ".concat(monthCode));
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
	      const entriesIterator = Call$4(MapPrototypeEntries, cacheToClone.map, []);
	      for (;;) {
	        const iterResult = Call$4(MapIteratorPrototypeNext, entriesIterator, []);
	        if (iterResult.done) break;
	        if (++i > OneObjectCache.MAX_CACHE_ENTRIES) break;
	        Call$4(MapPrototypeSet, this.map, iterResult.value);
	      }
	    }
	  }
	  get(key) {
	    const result = Call$4(MapPrototypeGet, this.map, [key]);
	    if (result) {
	      this.hits++;
	      this.report();
	    }
	    this.calls++;
	    return result;
	  }
	  set(key, value) {
	    Call$4(MapPrototypeSet, this.map, [key, value]);
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
	    if (Call$4(WeakMapPrototypeGet, OneObjectCache.objectMap, [obj])) throw new RangeError('object already cached');
	    Call$4(WeakMapPrototypeSet, OneObjectCache.objectMap, [obj, this]);
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
	  let cache = Call$4(WeakMapPrototypeGet, OneObjectCache.objectMap, [obj]);
	  if (!cache) {
	    cache = new OneObjectCache();
	    Call$4(WeakMapPrototypeSet, OneObjectCache.objectMap, [obj, cache]);
	  }
	  return cache;
	};
	function toUtcIsoDateString(_ref) {
	  let {
	    isoYear,
	    isoMonth,
	    isoDay
	  } = _ref;
	  const yearString = ISOYearString(isoYear);
	  const monthString = ISODateTimePartString(isoMonth);
	  const dayString = ISODateTimePartString(isoDay);
	  return "".concat(yearString, "-").concat(monthString, "-").concat(dayString, "T00:00Z");
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
	      this.formatter = new IntlDateTimeFormat("en-US-u-ca-".concat(this.id), {
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
	      throw new RangeError("Invalid ISO date: ".concat(JSON.stringify({
	        isoYear,
	        isoMonth,
	        isoDay
	      })));
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
	          throw new RangeError("Unexpected month: ".concat(value));
	        }
	        // If the month has no numeric part (should only see this for the Hebrew
	        // calendar with newer FF / Chromium versions; see
	        // https://bugzilla.mozilla.org/show_bug.cgi?id=1751833) then set a
	        // placeholder month index of `1` and rely on the derived class to
	        // calculate the correct month index from the month name stored in
	        // `monthExtra`.
	        result.month = matches[1] ? +matches[1] : 1;
	        if (result.month < 1) {
	          throw new RangeError("Invalid month ".concat(value, " from ").concat(isoString, "[u-ca-").concat(this.id, "]") + ' (probably due to https://bugs.chromium.org/p/v8/issues/detail?id=10527)');
	        }
	        if (result.month > 13) {
	          throw new RangeError("Invalid month ".concat(value, " from ").concat(isoString, "[u-ca-").concat(this.id, "]") + ' (probably due to https://bugs.chromium.org/p/v8/issues/detail?id=10529)');
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
	      throw new RangeError("Intl.DateTimeFormat.formatToParts lacks relatedYear in ".concat(this.id, " calendar. Try Node 14+ or modern browsers."));
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
	    if (calendarDate.year === undefined) throw new RangeError("Missing year converting ".concat(JSON.stringify(isoDate)));
	    if (calendarDate.month === undefined) throw new RangeError("Missing month converting ".concat(JSON.stringify(isoDate)));
	    if (calendarDate.day === undefined) throw new RangeError("Missing day converting ".concat(JSON.stringify(isoDate)));
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
	        throw new RangeError("monthCode must be a string, not ".concat(Type$d(monthCode).toLowerCase()));
	      }
	      if (!/^M([01]?\d)(L?)$/.test(monthCode)) throw new RangeError("Invalid monthCode: ".concat(monthCode));
	    }
	    if (this.constantEra) {
	      if (era !== undefined && era !== this.constantEra) {
	        throw new RangeError("era must be ".concat(this.constantEra, ", not ").concat(era));
	      }
	      if (eraYear !== undefined && year !== undefined && eraYear !== year) {
	        throw new RangeError("eraYear ".concat(eraYear, " does not match year ").concat(year));
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
	            throw new RangeError("day ".concat(day, " does not exist in month ").concat(month, " of year ").concat(year));
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
	              throw new RangeError("Can't find ISO date from calendar date: ".concat(JSON.stringify({
	                ...originalDate
	              })));
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
	  temporalToCalendarDate(date, cache) {
	    const isoDate = {
	      year: GetSlot(date, ISO_YEAR),
	      month: GetSlot(date, ISO_MONTH),
	      day: GetSlot(date, ISO_DAY)
	    };
	    const result = this.isoToCalendarDate(isoDate, cache);
	    return result;
	  },
	  compareCalendarDates(date1, date2) {
	    // `date1` and `date2` are already records. The calls below simply validate
	    // that all three required fields are present.
	    date1 = PrepareTemporalFields(date1, ['day', 'month', 'year'], ['day', 'month', 'year']);
	    date2 = PrepareTemporalFields(date2, ['day', 'month', 'year'], ['day', 'month', 'year']);
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
	    for (let i = 0, absMonths = MathAbs$1(months); i < absMonths; i++) {
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
	      throw new RangeError("Day ".concat(day, " does not exist in resulting calendar month"));
	    }
	    return calendarDate;
	  },
	  addCalendar(calendarDate, _ref2, overflow, cache) {
	    let {
	      years = 0,
	      months = 0,
	      weeks = 0,
	      days = 0
	    } = _ref2;
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
	    throw new RangeError("No recent ".concat(this.id, " year with monthCode ").concat(monthCode, " and day ").concat(day));
	  }
	};
	const helperHebrew = ObjectAssign$1({}, nonIsoHelperBase, {
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
	    if (monthInfo === undefined) throw new RangeError("unmatched Hebrew month: ".concat(month));
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
	        if (!monthInfo) throw new RangeError("Unrecognized month from formatToParts: ".concat(monthExtra));
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
	            throw new RangeError("Hebrew leap month must have monthCode M05L, not ".concat(monthCode));
	          }
	          month = 6;
	          if (!this.inLeapYear({
	            year
	          })) {
	            if (overflow === 'reject') {
	              throw new RangeError("Hebrew monthCode M05L is invalid in year ".concat(year, " which is not a leap year"));
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
	          if (month < 1 || month > largestMonth) throw new RangeError("Invalid monthCode: ".concat(monthCode));
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
	            throw new RangeError("monthCode ".concat(monthCode, " doesn't correspond to month ").concat(month, " in Hebrew year ").concat(year));
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
	const helperIslamic = ObjectAssign$1({}, nonIsoHelperBase, {
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
	  monthsInYear( /* calendarYear, cache */
	  ) {
	    return 12;
	  },
	  minimumMonthLength: ( /* calendarDate */) => 29,
	  maximumMonthLength: ( /* calendarDate */) => 30,
	  DAYS_PER_ISLAMIC_YEAR: 354 + 11 / 30,
	  DAYS_PER_ISO_YEAR: 365.2425,
	  constantEra: 'ah',
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
	const helperPersian = ObjectAssign$1({}, nonIsoHelperBase, {
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
	  monthsInYear( /* calendarYear, cache */
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
	const helperIndian = ObjectAssign$1({}, nonIsoHelperBase, {
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
	  monthsInYear( /* calendarYear, cache */
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
	    if (monthInfo === undefined) throw new RangeError("Invalid month: ".concat(month));
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
	      throw new RangeError("calendar '".concat(this.id, "' is broken for ISO dates before 0001-01-01") + ' (see https://bugs.chromium.org/p/v8/issues/detail?id=10529)');
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
	      if (reversedEra === undefined) throw new RangeError("Invalid era data: unmatched reverseOf era: ".concat(reverseOf));
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
	  Call$4(ArrayPrototypeSort, eras, [(e1, e2) => {
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
	    e.genericName = "era".concat(eras.length - 1 - i);
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
	  return ObjectAssign$1({}, nonIsoHelperBase, {
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
	    monthsInYear( /* calendarDate */
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
	          throw new RangeError("Input ".concat(name, " ").concat(currentValue, " doesn't match calculated value ").concat(value));
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
	              if (year > 0) throw new RangeError("Signed year ".concat(year, " is invalid for era ").concat(e.name));
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
	        if (!matchingEra) throw new RangeError("Year ".concat(year, " was not matched by any era"));
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
	        if (!matchingEra) throw new RangeError("Era ".concat(era, " (ISO year ").concat(eraYear, ") was not matched by any era"));
	        if (eraYear < 1 && matchingEra.reverseOf) {
	          throw new RangeError("Years in ".concat(era, " era must be positive, not ").concat(year));
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
	      calendarDate = Call$4(nonIsoHelperBase.adjustCalendarDate, this, [calendarDate, cache, overflow]);
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
	  return ObjectAssign$1(base, {
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
	  return ObjectAssign$1(base, {
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
	    monthsInYear( /* calendarDate */
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
	const helperRoc = ObjectAssign$1({}, makeHelperSameMonthDayAsGregorian('roc', [{
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
	const helperBuddhist = ObjectAssign$1({}, makeHelperSameMonthDayAsGregorian('buddhist', [{
	  name: 'be',
	  hasYearZero: true,
	  isoEpoch: {
	    year: -543,
	    month: 1,
	    day: 1
	  }
	}]));
	const helperGregory = ObjectAssign$1({}, makeHelperSameMonthDayAsGregorian('gregory', [{
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
	const helperJapanese = ObjectAssign$1({},
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
	const helperChinese = ObjectAssign$1({}, nonIsoHelperBase, {
	  id: 'chinese',
	  calendarType: 'lunisolar',
	  inLeapYear(calendarDate, cache) {
	    const months = this.getMonthList(calendarDate.year, cache);
	    return ObjectEntries(months).length === 13;
	  },
	  monthsInYear(calendarDate, cache) {
	    return this.inLeapYear(calendarDate, cache) ? 13 : 12;
	  },
	  minimumMonthLength: ( /* calendarDate */) => 29,
	  maximumMonthLength: ( /* calendarDate */) => 30,
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
	        throw new RangeError("Intl.DateTimeFormat.formatToParts lacks relatedYear in ".concat(this.id, " calendar. Try Node 14+ or modern browsers."));
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
	      if (monthExtra && monthExtra !== 'bis') throw new RangeError("Unexpected leap month suffix: ".concat(monthExtra));
	      const monthCode = buildMonthCode(month, monthExtra !== undefined);
	      const monthString = "".concat(month).concat(monthExtra || '');
	      const months = this.getMonthList(year, cache);
	      const monthInfo = months[monthString];
	      if (monthInfo === undefined) throw new RangeError("Unmatched month ".concat(monthString, " in Chinese year ").concat(year));
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
	          throw new RangeError("Unmatched month ".concat(monthCode, " in Chinese year ").concat(year));
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
	        const matchingMonthEntry = monthEntries.find(_ref3 => {
	          let [, v] = _ref3;
	          return v.monthIndex === month;
	        });
	        if (matchingMonthEntry === undefined) {
	          throw new RangeError("Invalid month ".concat(month, " in Chinese year ").concat(year));
	        }
	        monthCode = buildMonthCode(matchingMonthEntry[0].replace('bis', ''), matchingMonthEntry[0].indexOf('bis') !== -1);
	      } else {
	        // Both month and monthCode are present. Make sure they don't conflict.
	        const months = this.getMonthList(year, cache);
	        let numberPart = monthCode.replace('L', 'bis').slice(1);
	        if (numberPart[0] === '0') numberPart = numberPart.slice(1);
	        const monthInfo = months[numberPart];
	        if (!monthInfo) throw new RangeError("Unmatched monthCode ".concat(monthCode, " in Chinese year ").concat(year));
	        if (month !== monthInfo.monthIndex) {
	          throw new RangeError("monthCode ".concat(monthCode, " doesn't correspond to month ").concat(month, " in Chinese year ").concat(year));
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
	const helperDangi = ObjectAssign$1({}, {
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
	  CalendarFieldDescriptors(type) {
	    let fieldDescriptors = [];
	    if (type !== 'month-day') {
	      fieldDescriptors = [{
	        property: 'era',
	        conversion: ToString$1,
	        required: false
	      }, {
	        property: 'eraYear',
	        conversion: ToIntegerWithTruncation,
	        required: false
	      }];
	    }
	    return fieldDescriptors;
	  },
	  dateFromFields(fields, options, calendarSlotValue) {
	    const cache = new OneObjectCache();
	    const fieldNames = ['day', 'month', 'monthCode', 'year'];
	    const extraFieldDescriptors = this.CalendarFieldDescriptors('date');
	    fields = PrepareTemporalFields(fields, fieldNames, [], extraFieldDescriptors);
	    const overflow = ToTemporalOverflow(options);
	    const {
	      year,
	      month,
	      day
	    } = this.helper.calendarToIsoDate(fields, overflow, cache);
	    const result = CreateTemporalDate(year, month, day, calendarSlotValue);
	    cache.setObject(result);
	    return result;
	  },
	  yearMonthFromFields(fields, options, calendarSlotValue) {
	    const cache = new OneObjectCache();
	    const fieldNames = ['month', 'monthCode', 'year'];
	    const extraFieldDescriptors = this.CalendarFieldDescriptors('year-month');
	    fields = PrepareTemporalFields(fields, fieldNames, [], extraFieldDescriptors);
	    const overflow = ToTemporalOverflow(options);
	    const {
	      year,
	      month,
	      day
	    } = this.helper.calendarToIsoDate({
	      ...fields,
	      day: 1
	    }, overflow, cache);
	    const result = CreateTemporalYearMonth(year, month, calendarSlotValue, /* referenceISODay = */day);
	    cache.setObject(result);
	    return result;
	  },
	  monthDayFromFields(fields, options, calendarSlotValue) {
	    const cache = new OneObjectCache();
	    // For lunisolar calendars, either `monthCode` or `year` must be provided
	    // because `month` is ambiguous without a year or a code.
	    const fieldNames = ['day', 'month', 'monthCode', 'year'];
	    const extraFieldDescriptors = this.CalendarFieldDescriptors('date');
	    fields = PrepareTemporalFields(fields, fieldNames, [], extraFieldDescriptors);
	    const overflow = ToTemporalOverflow(options);
	    const {
	      year,
	      month,
	      day
	    } = this.helper.monthDayFromFields(fields, overflow, cache);
	    // `year` is a reference year where this month/day exists in this calendar
	    const result = CreateTemporalMonthDay(month, day, calendarSlotValue, /* referenceISOYear = */year);
	    cache.setObject(result);
	    return result;
	  },
	  fields(fields) {
	    if (Call$4(ArrayIncludes, fields, ['year'])) {
	      Call$4(ArrayPrototypePush$2, fields, ['era', 'eraYear']);
	    }
	    return fields;
	  },
	  fieldKeysToIgnore(keys) {
	    const result = new OriginalSet();
	    for (let ix = 0; ix < keys.length; ix++) {
	      const key = keys[ix];
	      Call$4(SetPrototypeAdd, result, [key]);
	      switch (key) {
	        case 'era':
	          Call$4(SetPrototypeAdd, result, ['eraYear']);
	          Call$4(SetPrototypeAdd, result, ['year']);
	          break;
	        case 'eraYear':
	          Call$4(SetPrototypeAdd, result, ['era']);
	          Call$4(SetPrototypeAdd, result, ['year']);
	          break;
	        case 'year':
	          Call$4(SetPrototypeAdd, result, ['era']);
	          Call$4(SetPrototypeAdd, result, ['eraYear']);
	          break;
	        case 'month':
	          Call$4(SetPrototypeAdd, result, ['monthCode']);
	          // See https://github.com/tc39/proposal-temporal/issues/1784
	          if (this.helper.erasBeginMidYear) {
	            Call$4(SetPrototypeAdd, result, ['era']);
	            Call$4(SetPrototypeAdd, result, ['eraYear']);
	          }
	          break;
	        case 'monthCode':
	          Call$4(SetPrototypeAdd, result, ['month']);
	          if (this.helper.erasBeginMidYear) {
	            Call$4(SetPrototypeAdd, result, ['era']);
	            Call$4(SetPrototypeAdd, result, ['eraYear']);
	          }
	          break;
	        case 'day':
	          if (this.helper.erasBeginMidYear) {
	            Call$4(SetPrototypeAdd, result, ['era']);
	            Call$4(SetPrototypeAdd, result, ['eraYear']);
	          }
	          break;
	      }
	    }
	    return arrayFromSet(result);
	  },
	  dateAdd(date, years, months, weeks, days, overflow, calendarSlotValue) {
	    const cache = OneObjectCache.getCacheForObject(date);
	    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
	    const added = this.helper.addCalendar(calendarDate, {
	      years,
	      months,
	      weeks,
	      days
	    }, overflow, cache);
	    const isoAdded = this.helper.calendarToIsoDate(added, 'constrain', cache);
	    const {
	      year,
	      month,
	      day
	    } = isoAdded;
	    const newTemporalObject = CreateTemporalDate(year, month, day, calendarSlotValue);
	    // The new object's cache starts with the cache of the old object
	    const newCache = new OneObjectCache(cache);
	    newCache.setObject(newTemporalObject);
	    return newTemporalObject;
	  },
	  dateUntil(one, two, largestUnit) {
	    const cacheOne = OneObjectCache.getCacheForObject(one);
	    const cacheTwo = OneObjectCache.getCacheForObject(two);
	    const calendarOne = this.helper.temporalToCalendarDate(one, cacheOne);
	    const calendarTwo = this.helper.temporalToCalendarDate(two, cacheTwo);
	    const result = this.helper.untilCalendar(calendarOne, calendarTwo, largestUnit, cacheOne);
	    return result;
	  },
	  year(date) {
	    const cache = OneObjectCache.getCacheForObject(date);
	    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
	    return calendarDate.year;
	  },
	  month(date) {
	    const cache = OneObjectCache.getCacheForObject(date);
	    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
	    return calendarDate.month;
	  },
	  day(date) {
	    const cache = OneObjectCache.getCacheForObject(date);
	    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
	    return calendarDate.day;
	  },
	  era(date) {
	    if (!this.helper.hasEra) return undefined;
	    const cache = OneObjectCache.getCacheForObject(date);
	    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
	    return calendarDate.era;
	  },
	  eraYear(date) {
	    if (!this.helper.hasEra) return undefined;
	    const cache = OneObjectCache.getCacheForObject(date);
	    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
	    return calendarDate.eraYear;
	  },
	  monthCode(date) {
	    const cache = OneObjectCache.getCacheForObject(date);
	    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
	    return calendarDate.monthCode;
	  },
	  dayOfWeek(date) {
	    return impl['iso8601'].dayOfWeek(date);
	  },
	  dayOfYear(date) {
	    const cache = OneObjectCache.getCacheForObject(date);
	    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
	    const startOfYear = this.helper.startOfCalendarYear(calendarDate);
	    const diffDays = this.helper.calendarDaysUntil(startOfYear, calendarDate, cache);
	    return diffDays + 1;
	  },
	  daysInWeek(date) {
	    return impl['iso8601'].daysInWeek(date);
	  },
	  daysInMonth(date) {
	    const cache = OneObjectCache.getCacheForObject(date);
	    const calendarDate = this.helper.temporalToCalendarDate(date, cache);

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
	  daysInYear(date) {
	    if (!HasSlot(date, ISO_YEAR)) date = ToTemporalDate(date);
	    const cache = OneObjectCache.getCacheForObject(date);
	    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
	    const startOfYearCalendar = this.helper.startOfCalendarYear(calendarDate);
	    const startOfNextYearCalendar = this.helper.addCalendar(startOfYearCalendar, {
	      years: 1
	    }, 'constrain', cache);
	    const result = this.helper.calendarDaysUntil(startOfYearCalendar, startOfNextYearCalendar, cache);
	    return result;
	  },
	  monthsInYear(date) {
	    const cache = OneObjectCache.getCacheForObject(date);
	    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
	    const result = this.helper.monthsInYear(calendarDate, cache);
	    return result;
	  },
	  inLeapYear(date) {
	    if (!HasSlot(date, ISO_YEAR)) date = ToTemporalDate(date);
	    const cache = OneObjectCache.getCacheForObject(date);
	    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
	    const result = this.helper.inLeapYear(calendarDate, cache);
	    return result;
	  }
	};
	impl['hebrew'] = ObjectAssign$1({}, nonIsoGeneralImpl, {
	  helper: helperHebrew
	});
	impl['islamic'] = ObjectAssign$1({}, nonIsoGeneralImpl, {
	  helper: helperIslamic
	});
	['islamic-umalqura', 'islamic-tbla', 'islamic-civil', 'islamic-rgsa', 'islamicc'].forEach(id => {
	  impl[id] = ObjectAssign$1({}, nonIsoGeneralImpl, {
	    helper: {
	      ...helperIslamic,
	      id
	    }
	  });
	});
	impl['persian'] = ObjectAssign$1({}, nonIsoGeneralImpl, {
	  helper: helperPersian
	});
	impl['ethiopic'] = ObjectAssign$1({}, nonIsoGeneralImpl, {
	  helper: helperEthiopic
	});
	impl['ethioaa'] = ObjectAssign$1({}, nonIsoGeneralImpl, {
	  helper: helperEthioaa
	});
	impl['coptic'] = ObjectAssign$1({}, nonIsoGeneralImpl, {
	  helper: helperCoptic
	});
	impl['chinese'] = ObjectAssign$1({}, nonIsoGeneralImpl, {
	  helper: helperChinese
	});
	impl['dangi'] = ObjectAssign$1({}, nonIsoGeneralImpl, {
	  helper: helperDangi
	});
	impl['roc'] = ObjectAssign$1({}, nonIsoGeneralImpl, {
	  helper: helperRoc
	});
	impl['indian'] = ObjectAssign$1({}, nonIsoGeneralImpl, {
	  helper: helperIndian
	});
	impl['buddhist'] = ObjectAssign$1({}, nonIsoGeneralImpl, {
	  helper: helperBuddhist
	});
	impl['japanese'] = ObjectAssign$1({}, nonIsoGeneralImpl, {
	  helper: helperJapanese
	});
	impl['gregory'] = ObjectAssign$1({}, nonIsoGeneralImpl, {
	  helper: helperGregory
	});
	function calendarFieldsImpl(calendar, fieldNames) {
	  return impl[calendar].fields(fieldNames);
	}
	// Probably not what the intrinsics mechanism was intended for, but view this as
	// an export of calendarFieldsImpl while avoiding circular dependencies
	DefineIntrinsic('calendarFieldsImpl', calendarFieldsImpl);

	class PlainDate {
	  constructor(isoYear, isoMonth, isoDay) {
	    let calendar = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'iso8601';
	    isoYear = ToIntegerWithTruncation(isoYear);
	    isoMonth = ToIntegerWithTruncation(isoMonth);
	    isoDay = ToIntegerWithTruncation(isoDay);
	    calendar = ToTemporalCalendarSlotValue(calendar);
	    CreateTemporalDateSlots(this, isoYear, isoMonth, isoDay, calendar);
	  }
	  get calendarId() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    return ToTemporalCalendarIdentifier(GetSlot(this, CALENDAR));
	  }
	  get era() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    return CalendarEra(GetSlot(this, CALENDAR), this);
	  }
	  get eraYear() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    return CalendarEraYear(GetSlot(this, CALENDAR), this);
	  }
	  get year() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    return CalendarYear(GetSlot(this, CALENDAR), this);
	  }
	  get month() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    return CalendarMonth(GetSlot(this, CALENDAR), this);
	  }
	  get monthCode() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    return CalendarMonthCode(GetSlot(this, CALENDAR), this);
	  }
	  get day() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['day']);
	    return CalendarDay(calendarRec, this);
	  }
	  get dayOfWeek() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    return CalendarDayOfWeek(GetSlot(this, CALENDAR), this);
	  }
	  get dayOfYear() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    return CalendarDayOfYear(GetSlot(this, CALENDAR), this);
	  }
	  get weekOfYear() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    return CalendarWeekOfYear(GetSlot(this, CALENDAR), this);
	  }
	  get yearOfWeek() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    return CalendarYearOfWeek(GetSlot(this, CALENDAR), this);
	  }
	  get daysInWeek() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    return CalendarDaysInWeek(GetSlot(this, CALENDAR), this);
	  }
	  get daysInMonth() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    return CalendarDaysInMonth(GetSlot(this, CALENDAR), this);
	  }
	  get daysInYear() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    return CalendarDaysInYear(GetSlot(this, CALENDAR), this);
	  }
	  get monthsInYear() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    return CalendarMonthsInYear(GetSlot(this, CALENDAR), this);
	  }
	  get inLeapYear() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    return CalendarInLeapYear(GetSlot(this, CALENDAR), this);
	  }
	  with(temporalDateLike) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    if (Type$d(temporalDateLike) !== 'Object') {
	      throw new TypeError('invalid argument');
	    }
	    RejectTemporalLikeObject(temporalDateLike);
	    const resolvedOptions = SnapshotOwnProperties(GetOptionsObject(options), null);
	    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['dateFromFields', 'fields', 'mergeFields']);
	    const fieldNames = CalendarFields(calendarRec, ['day', 'month', 'monthCode', 'year']);
	    let fields = PrepareTemporalFields(this, fieldNames, []);
	    const partialDate = PrepareTemporalFields(temporalDateLike, fieldNames, 'partial');
	    fields = CalendarMergeFields(calendarRec, fields, partialDate);
	    fields = PrepareTemporalFields(fields, fieldNames, []);
	    return CalendarDateFromFields(calendarRec, fields, resolvedOptions);
	  }
	  withCalendar(calendar) {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    calendar = ToTemporalCalendarSlotValue(calendar);
	    return CreateTemporalDate(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), calendar);
	  }
	  add(temporalDurationLike) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    const duration = ToTemporalDuration(temporalDurationLike);
	    options = GetOptionsObject(options);
	    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['dateAdd']);
	    return AddDate(calendarRec, this, duration, options);
	  }
	  subtract(temporalDurationLike) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    const duration = CreateNegatedTemporalDuration(ToTemporalDuration(temporalDurationLike));
	    options = GetOptionsObject(options);
	    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['dateAdd']);
	    return AddDate(calendarRec, this, duration, options);
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
	    const showCalendar = ToCalendarNameOption(options);
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
	    if (Type$d(item) === 'Object') {
	      if (IsTemporalTimeZone(item)) {
	        timeZone = item;
	      } else {
	        let timeZoneLike = item.timeZone;
	        if (timeZoneLike === undefined) {
	          timeZone = ToTemporalTimeZoneSlotValue(item);
	        } else {
	          timeZone = ToTemporalTimeZoneSlotValue(timeZoneLike);
	          temporalTime = item.plainTime;
	        }
	      }
	    } else {
	      timeZone = ToTemporalTimeZoneSlotValue(item);
	    }
	    const calendar = GetSlot(this, CALENDAR);
	    temporalTime = ToTemporalTimeOrMidnight(temporalTime);
	    const dt = CreateTemporalDateTime(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), GetSlot(temporalTime, ISO_HOUR), GetSlot(temporalTime, ISO_MINUTE), GetSlot(temporalTime, ISO_SECOND), GetSlot(temporalTime, ISO_MILLISECOND), GetSlot(temporalTime, ISO_MICROSECOND), GetSlot(temporalTime, ISO_NANOSECOND), calendar);
	    const timeZoneRec = new TimeZoneMethodRecord(timeZone, ['getOffsetNanosecondsFor', 'getPossibleInstantsFor']);
	    const instant = GetInstantFor(timeZoneRec, dt, 'compatible');
	    return CreateTemporalZonedDateTime(GetSlot(instant, EPOCHNANOSECONDS), timeZone, calendar);
	  }
	  toPlainYearMonth() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['fields', 'yearMonthFromFields']);
	    const fieldNames = CalendarFields(calendarRec, ['monthCode', 'year']);
	    const fields = PrepareTemporalFields(this, fieldNames, []);
	    return CalendarYearMonthFromFields(calendarRec, fields);
	  }
	  toPlainMonthDay() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['fields', 'monthDayFromFields']);
	    const fieldNames = CalendarFields(calendarRec, ['day', 'monthCode']);
	    const fields = PrepareTemporalFields(this, fieldNames, []);
	    return CalendarMonthDayFromFields(calendarRec, fields);
	  }
	  getISOFields() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    return {
	      calendar: GetSlot(this, CALENDAR),
	      isoDay: GetSlot(this, ISO_DAY),
	      isoMonth: GetSlot(this, ISO_MONTH),
	      isoYear: GetSlot(this, ISO_YEAR)
	    };
	  }
	  getCalendar() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    return ToTemporalCalendarObject(GetSlot(this, CALENDAR));
	  }
	  static from(item) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    options = GetOptionsObject(options);
	    if (IsTemporalDate(item)) {
	      ToTemporalOverflow(options); // validate and ignore
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

	const ArrayPrototypePush$1 = Array.prototype.push;
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
	    calendar = ToTemporalCalendarSlotValue(calendar);
	    CreateTemporalDateTimeSlots(this, isoYear, isoMonth, isoDay, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
	  }
	  get calendarId() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return ToTemporalCalendarIdentifier(GetSlot(this, CALENDAR));
	  }
	  get year() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarYear(GetSlot(this, CALENDAR), this);
	  }
	  get month() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarMonth(GetSlot(this, CALENDAR), this);
	  }
	  get monthCode() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarMonthCode(GetSlot(this, CALENDAR), this);
	  }
	  get day() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['day']);
	    return CalendarDay(calendarRec, this);
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
	    return CalendarEra(GetSlot(this, CALENDAR), this);
	  }
	  get eraYear() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarEraYear(GetSlot(this, CALENDAR), this);
	  }
	  get dayOfWeek() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarDayOfWeek(GetSlot(this, CALENDAR), this);
	  }
	  get dayOfYear() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarDayOfYear(GetSlot(this, CALENDAR), this);
	  }
	  get weekOfYear() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarWeekOfYear(GetSlot(this, CALENDAR), this);
	  }
	  get yearOfWeek() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarYearOfWeek(GetSlot(this, CALENDAR), this);
	  }
	  get daysInWeek() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarDaysInWeek(GetSlot(this, CALENDAR), this);
	  }
	  get daysInYear() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarDaysInYear(GetSlot(this, CALENDAR), this);
	  }
	  get daysInMonth() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarDaysInMonth(GetSlot(this, CALENDAR), this);
	  }
	  get monthsInYear() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarMonthsInYear(GetSlot(this, CALENDAR), this);
	  }
	  get inLeapYear() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarInLeapYear(GetSlot(this, CALENDAR), this);
	  }
	  with(temporalDateTimeLike) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    if (Type$d(temporalDateTimeLike) !== 'Object') {
	      throw new TypeError('invalid argument');
	    }
	    RejectTemporalLikeObject(temporalDateTimeLike);
	    const resolvedOptions = SnapshotOwnProperties(GetOptionsObject(options), null);
	    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['dateFromFields', 'fields', 'mergeFields']);
	    const fieldNames = CalendarFields(calendarRec, ['day', 'month', 'monthCode', 'year']);
	    let fields = PrepareTemporalFields(this, fieldNames, []);
	    fields.hour = GetSlot(this, ISO_HOUR);
	    fields.minute = GetSlot(this, ISO_MINUTE);
	    fields.second = GetSlot(this, ISO_SECOND);
	    fields.millisecond = GetSlot(this, ISO_MILLISECOND);
	    fields.microsecond = GetSlot(this, ISO_MICROSECOND);
	    fields.nanosecond = GetSlot(this, ISO_NANOSECOND);
	    Call$4(ArrayPrototypePush$1, fieldNames, ['hour', 'microsecond', 'millisecond', 'minute', 'nanosecond', 'second']);
	    const partialDateTime = PrepareTemporalFields(temporalDateTimeLike, fieldNames, 'partial');
	    fields = CalendarMergeFields(calendarRec, fields, partialDateTime);
	    fields = PrepareTemporalFields(fields, fieldNames, []);
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
	    } = InterpretTemporalDateTimeFields(calendarRec, fields, resolvedOptions);
	    return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendarRec.receiver);
	  }
	  withPlainTime() {
	    let temporalTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    temporalTime = ToTemporalTimeOrMidnight(temporalTime);
	    return CreateTemporalDateTime(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), GetSlot(temporalTime, ISO_HOUR), GetSlot(temporalTime, ISO_MINUTE), GetSlot(temporalTime, ISO_SECOND), GetSlot(temporalTime, ISO_MILLISECOND), GetSlot(temporalTime, ISO_MICROSECOND), GetSlot(temporalTime, ISO_NANOSECOND), GetSlot(this, CALENDAR));
	  }
	  withPlainDate(temporalDate) {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    temporalDate = ToTemporalDate(temporalDate);
	    const year = GetSlot(temporalDate, ISO_YEAR);
	    const month = GetSlot(temporalDate, ISO_MONTH);
	    const day = GetSlot(temporalDate, ISO_DAY);
	    let calendar = GetSlot(temporalDate, CALENDAR);
	    const hour = GetSlot(this, ISO_HOUR);
	    const minute = GetSlot(this, ISO_MINUTE);
	    const second = GetSlot(this, ISO_SECOND);
	    const millisecond = GetSlot(this, ISO_MILLISECOND);
	    const microsecond = GetSlot(this, ISO_MICROSECOND);
	    const nanosecond = GetSlot(this, ISO_NANOSECOND);
	    calendar = ConsolidateCalendars(GetSlot(this, CALENDAR), calendar);
	    return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
	  }
	  withCalendar(calendar) {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    calendar = ToTemporalCalendarSlotValue(calendar);
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
	    if (Type$d(roundTo) === 'String') {
	      const stringParam = roundTo;
	      roundTo = ObjectCreate$3(null);
	      roundTo.smallestUnit = stringParam;
	    } else {
	      roundTo = GetOptionsObject(roundTo);
	    }
	    const roundingIncrement = ToTemporalRoundingIncrement(roundTo);
	    const roundingMode = ToTemporalRoundingMode(roundTo, 'halfExpand');
	    const smallestUnit = GetTemporalUnit(roundTo, 'smallestUnit', 'time', REQUIRED, ['day']);
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
	    const showCalendar = ToCalendarNameOption(options);
	    const digits = ToFractionalSecondDigits(options);
	    const roundingMode = ToTemporalRoundingMode(options, 'trunc');
	    const smallestUnit = GetTemporalUnit(options, 'smallestUnit', 'time', undefined);
	    if (smallestUnit === 'hour') throw new RangeError('smallestUnit must be a time unit other than "hour"');
	    const {
	      precision,
	      unit,
	      increment
	    } = ToSecondsStringPrecisionRecord(smallestUnit, digits);
	    return TemporalDateTimeToString(this, precision, showCalendar, {
	      unit,
	      increment,
	      roundingMode
	    });
	  }
	  toJSON() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return TemporalDateTimeToString(this, 'auto');
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
	    const timeZone = ToTemporalTimeZoneSlotValue(temporalTimeZoneLike);
	    options = GetOptionsObject(options);
	    const disambiguation = ToTemporalDisambiguation(options);
	    const timeZoneRec = new TimeZoneMethodRecord(timeZone, ['getOffsetNanosecondsFor', 'getPossibleInstantsFor']);
	    const instant = GetInstantFor(timeZoneRec, this, disambiguation);
	    return CreateTemporalZonedDateTime(GetSlot(instant, EPOCHNANOSECONDS), timeZone, GetSlot(this, CALENDAR));
	  }
	  toPlainDate() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return TemporalDateTimeToDate(this);
	  }
	  toPlainYearMonth() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['fields', 'yearMonthFromFields']);
	    const fieldNames = CalendarFields(calendarRec, ['monthCode', 'year']);
	    const fields = PrepareTemporalFields(this, fieldNames, []);
	    return CalendarYearMonthFromFields(calendarRec, fields);
	  }
	  toPlainMonthDay() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['fields', 'monthDayFromFields']);
	    const fieldNames = CalendarFields(calendarRec, ['day', 'monthCode']);
	    const fields = PrepareTemporalFields(this, fieldNames, []);
	    return CalendarMonthDayFromFields(calendarRec, fields);
	  }
	  toPlainTime() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return TemporalDateTimeToTime(this);
	  }
	  getISOFields() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return {
	      calendar: GetSlot(this, CALENDAR),
	      isoDay: GetSlot(this, ISO_DAY),
	      isoHour: GetSlot(this, ISO_HOUR),
	      isoMicrosecond: GetSlot(this, ISO_MICROSECOND),
	      isoMillisecond: GetSlot(this, ISO_MILLISECOND),
	      isoMinute: GetSlot(this, ISO_MINUTE),
	      isoMonth: GetSlot(this, ISO_MONTH),
	      isoNanosecond: GetSlot(this, ISO_NANOSECOND),
	      isoSecond: GetSlot(this, ISO_SECOND),
	      isoYear: GetSlot(this, ISO_YEAR)
	    };
	  }
	  getCalendar() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return ToTemporalCalendarObject(GetSlot(this, CALENDAR));
	  }
	  static from(item) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    options = GetOptionsObject(options);
	    if (IsTemporalDateTime(item)) {
	      ToTemporalOverflow(options); // validate and ignore
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

	const MathAbs = Math.abs;
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
	        value: "Temporal.Duration <".concat(TemporalDurationToString(years, months, weeks, days, hours, minutes, normSeconds), ">"),
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
	    const partialDuration = PrepareTemporalFields(durationLike, ['days', 'hours', 'microseconds', 'milliseconds', 'minutes', 'months', 'nanoseconds', 'seconds', 'weeks', 'years'], 'partial');
	    let {
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
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalDuration(this)) throw new TypeError('invalid receiver');
	    return AddDurationToOrSubtractDurationFromDuration('add', this, other, options);
	  }
	  subtract(other) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalDuration(this)) throw new TypeError('invalid receiver');
	    return AddDurationToOrSubtractDurationFromDuration('subtract', this, other, options);
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
	    const existingLargestUnit = DefaultTemporalLargestUnit(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
	    if (Type$d(roundTo) === 'String') {
	      const stringParam = roundTo;
	      roundTo = ObjectCreate$2(null);
	      roundTo.smallestUnit = stringParam;
	    } else {
	      roundTo = GetOptionsObject(roundTo);
	    }
	    let largestUnit = GetTemporalUnit(roundTo, 'largestUnit', 'datetime', undefined, ['auto']);
	    let {
	      plainRelativeTo,
	      zonedRelativeTo,
	      timeZoneRec
	    } = ToRelativeTemporalObject(roundTo);
	    const roundingIncrement = ToTemporalRoundingIncrement(roundTo);
	    const roundingMode = ToTemporalRoundingMode(roundTo, 'halfExpand');
	    let smallestUnit = GetTemporalUnit(roundTo, 'smallestUnit', 'datetime', undefined);
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
	      throw new RangeError("largestUnit ".concat(largestUnit, " cannot be smaller than smallestUnit ").concat(smallestUnit));
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
	    const roundingGranularityIsNoop = smallestUnit === 'nanosecond' && roundingIncrement === 1;
	    const balancingRequested = largestUnit !== existingLargestUnit;
	    const calendarUnitsPresent = years !== 0 || months !== 0 || weeks !== 0;
	    const timeUnitsOverflowWillOccur = MathAbs(minutes) >= 60 || MathAbs(seconds) >= 60 || MathAbs(milliseconds) >= 1000 || MathAbs(microseconds) >= 1000 || MathAbs(nanoseconds) >= 1000;
	    const hoursToDaysConversionMayOccur = days !== 0 && zonedRelativeTo || MathAbs(hours) >= 24;
	    if (roundingGranularityIsNoop && !balancingRequested && !calendarUnitsPresent && !timeUnitsOverflowWillOccur && !hoursToDaysConversionMayOccur) {
	      return new Duration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
	    }
	    let precalculatedPlainDateTime;
	    const plainDateTimeOrRelativeToWillBeUsed = !roundingGranularityIsNoop || IsCalendarUnit(largestUnit) || largestUnit === 'day' || calendarUnitsPresent || days !== 0;
	    if (zonedRelativeTo && plainDateTimeOrRelativeToWillBeUsed) {
	      // Convert a ZonedDateTime relativeTo to PlainDateTime and PlainDate only
	      // if either is needed in one of the operations below, because the
	      // conversion is user visible
	      precalculatedPlainDateTime = GetPlainDateTimeFor(timeZoneRec, GetSlot(zonedRelativeTo, INSTANT), GetSlot(zonedRelativeTo, CALENDAR));
	      plainRelativeTo = TemporalDateTimeToDate(precalculatedPlainDateTime);
	    }
	    const calendarRec = CalendarMethodRecord.CreateFromRelativeTo(plainRelativeTo, zonedRelativeTo, ['dateAdd', 'dateUntil']);
	    ({
	      years,
	      months,
	      weeks,
	      days
	    } = UnbalanceDateDurationRelative(years, months, weeks, days, largestUnit, plainRelativeTo, calendarRec));
	    let norm = TimeDuration.normalize(hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
	    ({
	      years,
	      months,
	      weeks,
	      days,
	      norm
	    } = RoundDuration(years, months, weeks, days, norm, roundingIncrement, smallestUnit, roundingMode, plainRelativeTo, calendarRec, zonedRelativeTo, timeZoneRec, precalculatedPlainDateTime));
	    if (zonedRelativeTo) {
	      ({
	        years,
	        months,
	        weeks,
	        days,
	        norm
	      } = AdjustRoundedDurationDays(years, months, weeks, days, norm, roundingIncrement, smallestUnit, roundingMode, zonedRelativeTo, calendarRec, timeZoneRec, precalculatedPlainDateTime));
	      ({
	        days,
	        hours,
	        minutes,
	        seconds,
	        milliseconds,
	        microseconds,
	        nanoseconds
	      } = BalanceTimeDurationRelative(days, norm, largestUnit, zonedRelativeTo, timeZoneRec, precalculatedPlainDateTime));
	    } else {
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
	    ({
	      years,
	      months,
	      weeks,
	      days
	    } = BalanceDateDurationRelative(years, months, weeks, days, largestUnit, smallestUnit, plainRelativeTo, calendarRec));
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
	    if (Type$d(totalOf) === 'String') {
	      const stringParam = totalOf;
	      totalOf = ObjectCreate$2(null);
	      totalOf.unit = stringParam;
	    } else {
	      totalOf = GetOptionsObject(totalOf);
	    }
	    let {
	      plainRelativeTo,
	      zonedRelativeTo,
	      timeZoneRec
	    } = ToRelativeTemporalObject(totalOf);
	    const unit = GetTemporalUnit(totalOf, 'unit', 'datetime', REQUIRED);
	    let precalculatedPlainDateTime;
	    const plainDateTimeOrRelativeToWillBeUsed = IsCalendarUnit(unit) || unit === 'day' || years !== 0 || months !== 0 || weeks !== 0 || days !== 0;
	    if (zonedRelativeTo && plainDateTimeOrRelativeToWillBeUsed) {
	      // Convert a ZonedDateTime relativeTo to PlainDate only if needed in one
	      // of the operations below, because the conversion is user visible
	      precalculatedPlainDateTime = GetPlainDateTimeFor(timeZoneRec, GetSlot(zonedRelativeTo, INSTANT), GetSlot(zonedRelativeTo, CALENDAR));
	      plainRelativeTo = TemporalDateTimeToDate(precalculatedPlainDateTime);
	    }
	    const calendarRec = CalendarMethodRecord.CreateFromRelativeTo(plainRelativeTo, zonedRelativeTo, ['dateAdd', 'dateUntil']);

	    // Convert larger units down to days
	    ({
	      years,
	      months,
	      weeks,
	      days
	    } = UnbalanceDateDurationRelative(years, months, weeks, days, unit, plainRelativeTo, calendarRec));
	    let norm;
	    // If the unit we're totalling is smaller than `days`, convert days down to that unit.
	    if (zonedRelativeTo) {
	      const intermediate = MoveRelativeZonedDateTime(zonedRelativeTo, calendarRec, timeZoneRec, years, months, weeks, 0, precalculatedPlainDateTime);
	      norm = TimeDuration.normalize(hours, minutes, seconds, milliseconds, microseconds, nanoseconds);

	      // Inline BalanceTimeDurationRelative, without the final balance step
	      const start = GetSlot(intermediate, INSTANT);
	      const startNs = GetSlot(intermediate, EPOCHNANOSECONDS);
	      let intermediateNs = startNs;
	      let startDt;
	      if (days !== 0) {
	        startDt = GetPlainDateTimeFor(timeZoneRec, start, 'iso8601');
	        intermediateNs = AddDaysToZonedDateTime(start, startDt, timeZoneRec, 'iso8601', days).epochNs;
	      }
	      const endNs = AddInstant(intermediateNs, norm);
	      norm = TimeDuration.fromEpochNsDiff(endNs, startNs);
	      if (IsCalendarUnit(unit) || unit === 'day') {
	        var _startDt;
	        if (!norm.isZero()) (_startDt = startDt) !== null && _startDt !== void 0 ? _startDt : startDt = GetPlainDateTimeFor(timeZoneRec, start, 'iso8601');
	        ({
	          days,
	          norm
	        } = NormalizedTimeDurationToDays(norm, intermediate, timeZoneRec, startDt));
	      } else {
	        days = 0;
	      }
	    } else {
	      norm = TimeDuration.normalize(hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
	      norm = norm.add24HourDays(days);
	      days = 0;
	    }
	    // Finally, truncate to the correct unit and calculate remainder
	    const {
	      total
	    } = RoundDuration(years, months, weeks, days, norm, 1, unit, 'trunc', plainRelativeTo, calendarRec, zonedRelativeTo, timeZoneRec, precalculatedPlainDateTime);
	    return total;
	  }
	  toString() {
	    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	    if (!IsTemporalDuration(this)) throw new TypeError('invalid receiver');
	    options = GetOptionsObject(options);
	    const digits = ToFractionalSecondDigits(options);
	    const roundingMode = ToTemporalRoundingMode(options, 'trunc');
	    const smallestUnit = GetTemporalUnit(options, 'smallestUnit', 'time', undefined);
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
	      const largestUnit = DefaultTemporalLargestUnit(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
	      ({
	        norm
	      } = RoundDuration(0, 0, 0, 0, norm, increment, unit, roundingMode));
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
	    const {
	      plainRelativeTo,
	      zonedRelativeTo,
	      timeZoneRec
	    } = ToRelativeTemporalObject(options);
	    const calendarUnitsPresent = y1 !== 0 || y2 !== 0 || mon1 !== 0 || mon2 !== 0 || w1 !== 0 || w2 !== 0;
	    const calendarRec = CalendarMethodRecord.CreateFromRelativeTo(plainRelativeTo, zonedRelativeTo, ['dateAdd']);
	    if (zonedRelativeTo && (calendarUnitsPresent || d1 != 0 || d2 !== 0)) {
	      const instant = GetSlot(zonedRelativeTo, INSTANT);
	      const precalculatedPlainDateTime = GetPlainDateTimeFor(timeZoneRec, instant, calendarRec.receiver);
	      const norm1 = TimeDuration.normalize(h1, min1, s1, ms1, µs1, ns1);
	      const norm2 = TimeDuration.normalize(h2, min2, s2, ms2, µs2, ns2);
	      const after1 = AddZonedDateTime(instant, timeZoneRec, calendarRec, y1, mon1, w1, d1, norm1, precalculatedPlainDateTime);
	      const after2 = AddZonedDateTime(instant, timeZoneRec, calendarRec, y2, mon2, w2, d2, norm2, precalculatedPlainDateTime);
	      return ComparisonResult(after1.minus(after2).toJSNumber());
	    }
	    if (calendarUnitsPresent) {
	      // plainRelativeTo may be undefined, and if so Unbalance will throw
	      ({
	        days: d1
	      } = UnbalanceDateDurationRelative(y1, mon1, w1, d1, 'day', plainRelativeTo, calendarRec));
	      ({
	        days: d2
	      } = UnbalanceDateDurationRelative(y2, mon2, w2, d2, 'day', plainRelativeTo, calendarRec));
	    }
	    const norm1 = TimeDuration.normalize(h1, min1, s1, ms1, µs1, ns1).add24HourDays(d1);
	    const norm2 = TimeDuration.normalize(h2, min2, s2, ms2, µs2, ns2).add24HourDays(d2);
	    return norm1.cmp(norm2);
	  }
	}
	MakeIntrinsicClass(Duration, 'Temporal.Duration');

	const ArrayPrototypeConcat$1 = Array.prototype.concat;
	class PlainMonthDay {
	  constructor(isoMonth, isoDay) {
	    let calendar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'iso8601';
	    let referenceISOYear = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1972;
	    isoMonth = ToIntegerWithTruncation(isoMonth);
	    isoDay = ToIntegerWithTruncation(isoDay);
	    calendar = ToTemporalCalendarSlotValue(calendar);
	    referenceISOYear = ToIntegerWithTruncation(referenceISOYear);
	    CreateTemporalMonthDaySlots(this, isoMonth, isoDay, calendar, referenceISOYear);
	  }
	  get monthCode() {
	    if (!IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
	    return CalendarMonthCode(GetSlot(this, CALENDAR), this);
	  }
	  get day() {
	    if (!IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
	    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['day']);
	    return CalendarDay(calendarRec, this);
	  }
	  get calendarId() {
	    if (!IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
	    return ToTemporalCalendarIdentifier(GetSlot(this, CALENDAR));
	  }
	  with(temporalMonthDayLike) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
	    if (Type$d(temporalMonthDayLike) !== 'Object') {
	      throw new TypeError('invalid argument');
	    }
	    RejectTemporalLikeObject(temporalMonthDayLike);
	    const resolvedOptions = SnapshotOwnProperties(GetOptionsObject(options), null);
	    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['fields', 'mergeFields', 'monthDayFromFields']);
	    const fieldNames = CalendarFields(calendarRec, ['day', 'month', 'monthCode', 'year']);
	    let fields = PrepareTemporalFields(this, fieldNames, []);
	    const partialMonthDay = PrepareTemporalFields(temporalMonthDayLike, fieldNames, 'partial');
	    fields = CalendarMergeFields(calendarRec, fields, partialMonthDay);
	    fields = PrepareTemporalFields(fields, fieldNames, []);
	    return CalendarMonthDayFromFields(calendarRec, fields, resolvedOptions);
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
	    const showCalendar = ToCalendarNameOption(options);
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
	    if (Type$d(item) !== 'Object') throw new TypeError('argument should be an object');
	    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['dateFromFields', 'fields', 'mergeFields']);
	    const receiverFieldNames = CalendarFields(calendarRec, ['day', 'monthCode']);
	    let fields = PrepareTemporalFields(this, receiverFieldNames, []);
	    const inputFieldNames = CalendarFields(calendarRec, ['year']);
	    const inputFields = PrepareTemporalFields(item, inputFieldNames, []);
	    let mergedFields = CalendarMergeFields(calendarRec, fields, inputFields);
	    const concatenatedFieldNames = Call$4(ArrayPrototypeConcat$1, receiverFieldNames, inputFieldNames);
	    mergedFields = PrepareTemporalFields(mergedFields, concatenatedFieldNames, [], [], 'ignore');
	    return CalendarDateFromFields(calendarRec, mergedFields);
	  }
	  getISOFields() {
	    if (!IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
	    return {
	      calendar: GetSlot(this, CALENDAR),
	      isoDay: GetSlot(this, ISO_DAY),
	      isoMonth: GetSlot(this, ISO_MONTH),
	      isoYear: GetSlot(this, ISO_YEAR)
	    };
	  }
	  getCalendar() {
	    if (!IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
	    return ToTemporalCalendarObject(GetSlot(this, CALENDAR));
	  }
	  static from(item) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    options = GetOptionsObject(options);
	    if (IsTemporalMonthDay(item)) {
	      ToTemporalOverflow(options); // validate and ignore
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
	const plainDateTime = function (calendarLike) {
	  let temporalTimeZoneLike = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DefaultTimeZone();
	  const timeZone = ToTemporalTimeZoneSlotValue(temporalTimeZoneLike);
	  const calendar = ToTemporalCalendarSlotValue(calendarLike);
	  const inst = instant();
	  const timeZoneRec = new TimeZoneMethodRecord(timeZone, ['getOffsetNanosecondsFor']);
	  return GetPlainDateTimeFor(timeZoneRec, inst, calendar);
	};
	const plainDateTimeISO = function () {
	  let temporalTimeZoneLike = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DefaultTimeZone();
	  const timeZone = ToTemporalTimeZoneSlotValue(temporalTimeZoneLike);
	  const inst = instant();
	  const timeZoneRec = new TimeZoneMethodRecord(timeZone, ['getOffsetNanosecondsFor']);
	  return GetPlainDateTimeFor(timeZoneRec, inst, 'iso8601');
	};
	const zonedDateTime = function (calendarLike) {
	  let temporalTimeZoneLike = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DefaultTimeZone();
	  const timeZone = ToTemporalTimeZoneSlotValue(temporalTimeZoneLike);
	  const calendar = ToTemporalCalendarSlotValue(calendarLike);
	  return CreateTemporalZonedDateTime(SystemUTCEpochNanoSeconds(), timeZone, calendar);
	};
	const zonedDateTimeISO = function () {
	  let temporalTimeZoneLike = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DefaultTimeZone();
	  return zonedDateTime('iso8601', temporalTimeZoneLike);
	};
	const plainDate = function (calendarLike) {
	  let temporalTimeZoneLike = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DefaultTimeZone();
	  return TemporalDateTimeToDate(plainDateTime(calendarLike, temporalTimeZoneLike));
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
	  plainDateTime,
	  plainDateTimeISO,
	  plainDate,
	  plainDateISO,
	  plainTimeISO,
	  timeZoneId,
	  zonedDateTime,
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
	        value: "".concat(this[Symbol.toStringTag], " <").concat(TemporalTimeToString(this, 'auto'), ">"),
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
	    if (Type$d(temporalTimeLike) !== 'Object') {
	      throw new TypeError('invalid argument');
	    }
	    RejectTemporalLikeObject(temporalTimeLike);
	    options = GetOptionsObject(options);
	    const overflow = ToTemporalOverflow(options);
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
	    if (Type$d(roundTo) === 'String') {
	      const stringParam = roundTo;
	      roundTo = ObjectCreate$1(null);
	      roundTo.smallestUnit = stringParam;
	    } else {
	      roundTo = GetOptionsObject(roundTo);
	    }
	    const roundingIncrement = ToTemporalRoundingIncrement(roundTo);
	    const roundingMode = ToTemporalRoundingMode(roundTo, 'halfExpand');
	    const smallestUnit = GetTemporalUnit(roundTo, 'smallestUnit', 'time', REQUIRED);
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
	    const digits = ToFractionalSecondDigits(options);
	    const roundingMode = ToTemporalRoundingMode(options, 'trunc');
	    const smallestUnit = GetTemporalUnit(options, 'smallestUnit', 'time', undefined);
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
	  toPlainDateTime(temporalDate) {
	    if (!IsTemporalTime(this)) throw new TypeError('invalid receiver');
	    temporalDate = ToTemporalDate(temporalDate);
	    const year = GetSlot(temporalDate, ISO_YEAR);
	    const month = GetSlot(temporalDate, ISO_MONTH);
	    const day = GetSlot(temporalDate, ISO_DAY);
	    const calendar = GetSlot(temporalDate, CALENDAR);
	    const hour = GetSlot(this, ISO_HOUR);
	    const minute = GetSlot(this, ISO_MINUTE);
	    const second = GetSlot(this, ISO_SECOND);
	    const millisecond = GetSlot(this, ISO_MILLISECOND);
	    const microsecond = GetSlot(this, ISO_MICROSECOND);
	    const nanosecond = GetSlot(this, ISO_NANOSECOND);
	    return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
	  }
	  toZonedDateTime(item) {
	    if (!IsTemporalTime(this)) throw new TypeError('invalid receiver');
	    if (Type$d(item) !== 'Object') {
	      throw new TypeError('invalid argument');
	    }
	    const dateLike = item.plainDate;
	    if (dateLike === undefined) {
	      throw new TypeError('missing date property');
	    }
	    const temporalDate = ToTemporalDate(dateLike);
	    const timeZoneLike = item.timeZone;
	    if (timeZoneLike === undefined) {
	      throw new TypeError('missing timeZone property');
	    }
	    const timeZone = ToTemporalTimeZoneSlotValue(timeZoneLike);
	    const year = GetSlot(temporalDate, ISO_YEAR);
	    const month = GetSlot(temporalDate, ISO_MONTH);
	    const day = GetSlot(temporalDate, ISO_DAY);
	    const calendar = GetSlot(temporalDate, CALENDAR);
	    const hour = GetSlot(this, ISO_HOUR);
	    const minute = GetSlot(this, ISO_MINUTE);
	    const second = GetSlot(this, ISO_SECOND);
	    const millisecond = GetSlot(this, ISO_MILLISECOND);
	    const microsecond = GetSlot(this, ISO_MICROSECOND);
	    const nanosecond = GetSlot(this, ISO_NANOSECOND);
	    const dt = CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
	    const timeZoneRec = new TimeZoneMethodRecord(timeZone, ['getOffsetNanosecondsFor', 'getPossibleInstantsFor']);
	    const instant = GetInstantFor(timeZoneRec, dt, 'compatible');
	    return CreateTemporalZonedDateTime(GetSlot(instant, EPOCHNANOSECONDS), timeZone, calendar);
	  }
	  getISOFields() {
	    if (!IsTemporalTime(this)) throw new TypeError('invalid receiver');
	    return {
	      isoHour: GetSlot(this, ISO_HOUR),
	      isoMicrosecond: GetSlot(this, ISO_MICROSECOND),
	      isoMillisecond: GetSlot(this, ISO_MILLISECOND),
	      isoMinute: GetSlot(this, ISO_MINUTE),
	      isoNanosecond: GetSlot(this, ISO_NANOSECOND),
	      isoSecond: GetSlot(this, ISO_SECOND)
	    };
	  }
	  static from(item) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    options = GetOptionsObject(options);
	    const overflow = ToTemporalOverflow(options);
	    if (IsTemporalTime(item)) {
	      return new PlainTime(GetSlot(item, ISO_HOUR), GetSlot(item, ISO_MINUTE), GetSlot(item, ISO_SECOND), GetSlot(item, ISO_MILLISECOND), GetSlot(item, ISO_MICROSECOND), GetSlot(item, ISO_NANOSECOND));
	    }
	    return ToTemporalTime(item, overflow);
	  }
	  static compare(one, two) {
	    one = ToTemporalTime(one);
	    two = ToTemporalTime(two);
	    return CompareTemporalTime(GetSlot(one, ISO_HOUR), GetSlot(one, ISO_MINUTE), GetSlot(one, ISO_SECOND), GetSlot(one, ISO_MILLISECOND), GetSlot(one, ISO_MICROSECOND), GetSlot(one, ISO_NANOSECOND), GetSlot(two, ISO_HOUR), GetSlot(two, ISO_MINUTE), GetSlot(two, ISO_SECOND), GetSlot(two, ISO_MILLISECOND), GetSlot(two, ISO_MICROSECOND), GetSlot(two, ISO_NANOSECOND));
	  }
	}
	MakeIntrinsicClass(PlainTime, 'Temporal.PlainTime');

	/* global true */

	class TimeZone {
	  constructor(identifier) {
	    let stringIdentifier = RequireString(identifier);
	    const parseResult = ParseTimeZoneIdentifier(identifier);
	    if (parseResult.offsetMinutes !== undefined) {
	      stringIdentifier = FormatOffsetTimeZoneIdentifier(parseResult.offsetMinutes);
	    } else {
	      const record = GetAvailableNamedTimeZoneIdentifier(stringIdentifier);
	      if (!record) throw new RangeError("Invalid time zone identifier: ".concat(stringIdentifier));
	      stringIdentifier = record.identifier;
	    }
	    CreateSlots(this);
	    SetSlot(this, TIMEZONE_ID, stringIdentifier);
	    {
	      Object.defineProperty(this, '_repr_', {
	        value: "Temporal.TimeZone <".concat(stringIdentifier, ">"),
	        writable: false,
	        enumerable: false,
	        configurable: false
	      });
	    }
	  }
	  get id() {
	    if (!IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, TIMEZONE_ID);
	  }
	  equals(other) {
	    if (!IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
	    const timeZoneSlotValue = ToTemporalTimeZoneSlotValue(other);
	    return TimeZoneEquals(this, timeZoneSlotValue);
	  }
	  getOffsetNanosecondsFor(instant) {
	    if (!IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
	    instant = ToTemporalInstant(instant);
	    const id = GetSlot(this, TIMEZONE_ID);
	    const offsetMinutes = ParseTimeZoneIdentifier(id).offsetMinutes;
	    if (offsetMinutes !== undefined) return offsetMinutes * 60e9;
	    return GetNamedTimeZoneOffsetNanoseconds(id, GetSlot(instant, EPOCHNANOSECONDS));
	  }
	  getOffsetStringFor(instant) {
	    if (!IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
	    instant = ToTemporalInstant(instant);
	    const timeZoneRec = new TimeZoneMethodRecord(this, ['getOffsetNanosecondsFor']);
	    return GetOffsetStringFor(timeZoneRec, instant);
	  }
	  getPlainDateTimeFor(instant) {
	    let calendar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'iso8601';
	    if (!IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
	    instant = ToTemporalInstant(instant);
	    calendar = ToTemporalCalendarSlotValue(calendar);
	    const timeZoneRec = new TimeZoneMethodRecord(this, ['getOffsetNanosecondsFor']);
	    return GetPlainDateTimeFor(timeZoneRec, instant, calendar);
	  }
	  getInstantFor(dateTime) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
	    dateTime = ToTemporalDateTime(dateTime);
	    options = GetOptionsObject(options);
	    const disambiguation = ToTemporalDisambiguation(options);
	    const timeZoneRec = new TimeZoneMethodRecord(this, ['getOffsetNanosecondsFor', 'getPossibleInstantsFor']);
	    return GetInstantFor(timeZoneRec, dateTime, disambiguation);
	  }
	  getPossibleInstantsFor(dateTime) {
	    if (!IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
	    dateTime = ToTemporalDateTime(dateTime);
	    const Instant = GetIntrinsic('%Temporal.Instant%');
	    const id = GetSlot(this, TIMEZONE_ID);
	    const offsetMinutes = ParseTimeZoneIdentifier(id).offsetMinutes;
	    if (offsetMinutes !== undefined) {
	      const epochNs = GetUTCEpochNanoseconds(GetSlot(dateTime, ISO_YEAR), GetSlot(dateTime, ISO_MONTH), GetSlot(dateTime, ISO_DAY), GetSlot(dateTime, ISO_HOUR), GetSlot(dateTime, ISO_MINUTE), GetSlot(dateTime, ISO_SECOND), GetSlot(dateTime, ISO_MILLISECOND), GetSlot(dateTime, ISO_MICROSECOND), GetSlot(dateTime, ISO_NANOSECOND), offsetMinutes * 60e9);
	      return [new Instant(epochNs)];
	    }
	    const possibleEpochNs = GetNamedTimeZoneEpochNanoseconds(id, GetSlot(dateTime, ISO_YEAR), GetSlot(dateTime, ISO_MONTH), GetSlot(dateTime, ISO_DAY), GetSlot(dateTime, ISO_HOUR), GetSlot(dateTime, ISO_MINUTE), GetSlot(dateTime, ISO_SECOND), GetSlot(dateTime, ISO_MILLISECOND), GetSlot(dateTime, ISO_MICROSECOND), GetSlot(dateTime, ISO_NANOSECOND));
	    return possibleEpochNs.map(ns => new Instant(ns));
	  }
	  getNextTransition(startingPoint) {
	    if (!IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
	    startingPoint = ToTemporalInstant(startingPoint);
	    const id = GetSlot(this, TIMEZONE_ID);

	    // Offset time zones or UTC have no transitions
	    if (IsOffsetTimeZoneIdentifier(id) || id === 'UTC') {
	      return null;
	    }
	    let epochNanoseconds = GetSlot(startingPoint, EPOCHNANOSECONDS);
	    const Instant = GetIntrinsic('%Temporal.Instant%');
	    epochNanoseconds = GetNamedTimeZoneNextTransition(id, epochNanoseconds);
	    return epochNanoseconds === null ? null : new Instant(epochNanoseconds);
	  }
	  getPreviousTransition(startingPoint) {
	    if (!IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
	    startingPoint = ToTemporalInstant(startingPoint);
	    const id = GetSlot(this, TIMEZONE_ID);

	    // Offset time zones or UTC have no transitions
	    if (IsOffsetTimeZoneIdentifier(id) || id === 'UTC') {
	      return null;
	    }
	    let epochNanoseconds = GetSlot(startingPoint, EPOCHNANOSECONDS);
	    const Instant = GetIntrinsic('%Temporal.Instant%');
	    epochNanoseconds = GetNamedTimeZonePreviousTransition(id, epochNanoseconds);
	    return epochNanoseconds === null ? null : new Instant(epochNanoseconds);
	  }
	  toString() {
	    if (!IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, TIMEZONE_ID);
	  }
	  toJSON() {
	    if (!IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
	    return GetSlot(this, TIMEZONE_ID);
	  }
	  static from(item) {
	    const timeZoneSlotValue = ToTemporalTimeZoneSlotValue(item);
	    return ToTemporalTimeZoneObject(timeZoneSlotValue);
	  }
	}
	MakeIntrinsicClass(TimeZone, 'Temporal.TimeZone');
	DefineIntrinsic('Temporal.TimeZone.prototype.getOffsetNanosecondsFor', TimeZone.prototype.getOffsetNanosecondsFor);
	DefineIntrinsic('Temporal.TimeZone.prototype.getPossibleInstantsFor', TimeZone.prototype.getPossibleInstantsFor);

	const ArrayPrototypeConcat = Array.prototype.concat;
	class PlainYearMonth {
	  constructor(isoYear, isoMonth) {
	    let calendar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'iso8601';
	    let referenceISODay = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
	    isoYear = ToIntegerWithTruncation(isoYear);
	    isoMonth = ToIntegerWithTruncation(isoMonth);
	    calendar = ToTemporalCalendarSlotValue(calendar);
	    referenceISODay = ToIntegerWithTruncation(referenceISODay);
	    CreateTemporalYearMonthSlots(this, isoYear, isoMonth, calendar, referenceISODay);
	  }
	  get year() {
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    return CalendarYear(GetSlot(this, CALENDAR), this);
	  }
	  get month() {
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    return CalendarMonth(GetSlot(this, CALENDAR), this);
	  }
	  get monthCode() {
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    return CalendarMonthCode(GetSlot(this, CALENDAR), this);
	  }
	  get calendarId() {
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    return ToTemporalCalendarIdentifier(GetSlot(this, CALENDAR));
	  }
	  get era() {
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    return CalendarEra(GetSlot(this, CALENDAR), this);
	  }
	  get eraYear() {
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    return CalendarEraYear(GetSlot(this, CALENDAR), this);
	  }
	  get daysInMonth() {
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    return CalendarDaysInMonth(GetSlot(this, CALENDAR), this);
	  }
	  get daysInYear() {
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    return CalendarDaysInYear(GetSlot(this, CALENDAR), this);
	  }
	  get monthsInYear() {
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    return CalendarMonthsInYear(GetSlot(this, CALENDAR), this);
	  }
	  get inLeapYear() {
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    return CalendarInLeapYear(GetSlot(this, CALENDAR), this);
	  }
	  with(temporalYearMonthLike) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    if (Type$d(temporalYearMonthLike) !== 'Object') {
	      throw new TypeError('invalid argument');
	    }
	    RejectTemporalLikeObject(temporalYearMonthLike);
	    const resolvedOptions = SnapshotOwnProperties(GetOptionsObject(options), null);
	    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['fields', 'mergeFields', 'yearMonthFromFields']);
	    const fieldNames = CalendarFields(calendarRec, ['month', 'monthCode', 'year']);
	    let fields = PrepareTemporalFields(this, fieldNames, []);
	    const partialYearMonth = PrepareTemporalFields(temporalYearMonthLike, fieldNames, 'partial');
	    fields = CalendarMergeFields(calendarRec, fields, partialYearMonth);
	    fields = PrepareTemporalFields(fields, fieldNames, []);
	    return CalendarYearMonthFromFields(calendarRec, fields, resolvedOptions);
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
	    const showCalendar = ToCalendarNameOption(options);
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
	    if (Type$d(item) !== 'Object') throw new TypeError('argument should be an object');
	    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['dateFromFields', 'fields', 'mergeFields']);
	    const receiverFieldNames = CalendarFields(calendarRec, ['monthCode', 'year']);
	    let fields = PrepareTemporalFields(this, receiverFieldNames, []);
	    const inputFieldNames = CalendarFields(calendarRec, ['day']);
	    const inputFields = PrepareTemporalFields(item, inputFieldNames, []);
	    let mergedFields = CalendarMergeFields(calendarRec, fields, inputFields);
	    const concatenatedFieldNames = Call$4(ArrayPrototypeConcat, receiverFieldNames, inputFieldNames);
	    mergedFields = PrepareTemporalFields(mergedFields, concatenatedFieldNames, [], [], 'ignore');
	    return CalendarDateFromFields(calendarRec, mergedFields);
	  }
	  getISOFields() {
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    return {
	      calendar: GetSlot(this, CALENDAR),
	      isoDay: GetSlot(this, ISO_DAY),
	      isoMonth: GetSlot(this, ISO_MONTH),
	      isoYear: GetSlot(this, ISO_YEAR)
	    };
	  }
	  getCalendar() {
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    return ToTemporalCalendarObject(GetSlot(this, CALENDAR));
	  }
	  static from(item) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    options = GetOptionsObject(options);
	    if (IsTemporalYearMonth(item)) {
	      ToTemporalOverflow(options); // validate and ignore
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

	const ArrayPrototypePush = Array.prototype.push;
	const customResolvedOptions = DateTimeFormat.prototype.resolvedOptions;
	const ObjectCreate = Object.create;
	class ZonedDateTime {
	  constructor(epochNanoseconds, timeZone) {
	    let calendar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'iso8601';
	    // Note: if the argument is not passed, ToBigInt(undefined) will throw. This check exists only
	    //       to improve the error message.
	    //       ToTemporalTimeZoneSlotValue(undefined) has a clear enough message.
	    if (arguments.length < 1) {
	      throw new TypeError('missing argument: epochNanoseconds is required');
	    }
	    epochNanoseconds = ToBigInt(epochNanoseconds);
	    timeZone = ToTemporalTimeZoneSlotValue(timeZone);
	    calendar = ToTemporalCalendarSlotValue(calendar);
	    CreateTemporalZonedDateTimeSlots(this, epochNanoseconds, timeZone, calendar);
	  }
	  get calendarId() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return ToTemporalCalendarIdentifier(GetSlot(this, CALENDAR));
	  }
	  get timeZoneId() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return ToTemporalTimeZoneIdentifier(GetSlot(this, TIME_ZONE));
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
	    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['day']);
	    return CalendarDay(calendarRec, dateTime(this));
	  }
	  get hour() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return GetSlot(dateTime(this), ISO_HOUR);
	  }
	  get minute() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return GetSlot(dateTime(this), ISO_MINUTE);
	  }
	  get second() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return GetSlot(dateTime(this), ISO_SECOND);
	  }
	  get millisecond() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return GetSlot(dateTime(this), ISO_MILLISECOND);
	  }
	  get microsecond() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return GetSlot(dateTime(this), ISO_MICROSECOND);
	  }
	  get nanosecond() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return GetSlot(dateTime(this), ISO_NANOSECOND);
	  }
	  get era() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarEra(GetSlot(this, CALENDAR), dateTime(this));
	  }
	  get eraYear() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return CalendarEraYear(GetSlot(this, CALENDAR), dateTime(this));
	  }
	  get epochSeconds() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    const value = GetSlot(this, EPOCHNANOSECONDS);
	    return BigIntFloorDiv(value, 1e9).toJSNumber();
	  }
	  get epochMilliseconds() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    const value = GetSlot(this, EPOCHNANOSECONDS);
	    return BigIntFloorDiv(value, 1e6).toJSNumber();
	  }
	  get epochMicroseconds() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    const value = GetSlot(this, EPOCHNANOSECONDS);
	    return BigIntIfAvailable(BigIntFloorDiv(value, 1e3));
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
	    const timeZoneRec = new TimeZoneMethodRecord(GetSlot(this, TIME_ZONE), ['getOffsetNanosecondsFor', 'getPossibleInstantsFor']);
	    const dt = GetPlainDateTimeFor(timeZoneRec, GetSlot(this, INSTANT), GetSlot(this, CALENDAR));
	    const year = GetSlot(dt, ISO_YEAR);
	    const month = GetSlot(dt, ISO_MONTH);
	    const day = GetSlot(dt, ISO_DAY);
	    const today = CreateTemporalDateTime(year, month, day, 0, 0, 0, 0, 0, 0, 'iso8601');
	    const tomorrowFields = AddISODate(year, month, day, 0, 0, 0, 1, 'reject');
	    const tomorrow = CreateTemporalDateTime(tomorrowFields.year, tomorrowFields.month, tomorrowFields.day, 0, 0, 0, 0, 0, 0, 'iso8601');
	    const todayNs = GetSlot(GetInstantFor(timeZoneRec, today, 'compatible'), EPOCHNANOSECONDS);
	    const tomorrowNs = GetSlot(GetInstantFor(timeZoneRec, tomorrow, 'compatible'), EPOCHNANOSECONDS);
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
	    const timeZoneRec = new TimeZoneMethodRecord(GetSlot(this, TIME_ZONE), ['getOffsetNanosecondsFor']);
	    return GetOffsetStringFor(timeZoneRec, GetSlot(this, INSTANT));
	  }
	  get offsetNanoseconds() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    const timeZoneRec = new TimeZoneMethodRecord(GetSlot(this, TIME_ZONE), ['getOffsetNanosecondsFor']);
	    return GetOffsetNanosecondsFor(timeZoneRec, GetSlot(this, INSTANT));
	  }
	  with(temporalZonedDateTimeLike) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    if (Type$d(temporalZonedDateTimeLike) !== 'Object') {
	      throw new TypeError('invalid zoned-date-time-like');
	    }
	    RejectTemporalLikeObject(temporalZonedDateTimeLike);
	    const resolvedOptions = SnapshotOwnProperties(GetOptionsObject(options), null);
	    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['dateFromFields', 'fields', 'mergeFields']);
	    const timeZoneRec = new TimeZoneMethodRecord(GetSlot(this, TIME_ZONE), ['getOffsetNanosecondsFor', 'getPossibleInstantsFor']);
	    const offsetNs = GetOffsetNanosecondsFor(timeZoneRec, GetSlot(this, INSTANT));
	    const dt = GetPlainDateTimeFor(timeZoneRec, GetSlot(this, INSTANT), GetSlot(this, CALENDAR), offsetNs);
	    const fieldNames = CalendarFields(calendarRec, ['day', 'month', 'monthCode', 'year']);
	    let fields = PrepareTemporalFields(dt, fieldNames, []);
	    fields.hour = GetSlot(dt, ISO_HOUR);
	    fields.minute = GetSlot(dt, ISO_MINUTE);
	    fields.second = GetSlot(dt, ISO_SECOND);
	    fields.millisecond = GetSlot(dt, ISO_MILLISECOND);
	    fields.microsecond = GetSlot(dt, ISO_MICROSECOND);
	    fields.nanosecond = GetSlot(dt, ISO_NANOSECOND);
	    fields.offset = FormatUTCOffsetNanoseconds(offsetNs);
	    Call$4(ArrayPrototypePush, fieldNames, ['hour', 'microsecond', 'millisecond', 'minute', 'nanosecond', 'offset', 'second']);
	    const partialZonedDateTime = PrepareTemporalFields(temporalZonedDateTimeLike, fieldNames, 'partial');
	    fields = CalendarMergeFields(calendarRec, fields, partialZonedDateTime);
	    fields = PrepareTemporalFields(fields, fieldNames, ['offset']);
	    const disambiguation = ToTemporalDisambiguation(resolvedOptions);
	    const offset = ToTemporalOffset(resolvedOptions, 'prefer');
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
	    } = InterpretTemporalDateTimeFields(calendarRec, fields, resolvedOptions);
	    const newOffsetNs = ParseDateTimeUTCOffset(fields.offset);
	    const epochNanoseconds = InterpretISODateTimeOffset(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, 'option', newOffsetNs, timeZoneRec, disambiguation, offset, /* matchMinute = */false);
	    return CreateTemporalZonedDateTime(epochNanoseconds, timeZoneRec.receiver, calendarRec.receiver);
	  }
	  withPlainDate(temporalDate) {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    temporalDate = ToTemporalDate(temporalDate);
	    const year = GetSlot(temporalDate, ISO_YEAR);
	    const month = GetSlot(temporalDate, ISO_MONTH);
	    const day = GetSlot(temporalDate, ISO_DAY);
	    let calendar = GetSlot(temporalDate, CALENDAR);
	    const timeZoneRec = new TimeZoneMethodRecord(GetSlot(this, TIME_ZONE), ['getOffsetNanosecondsFor', 'getPossibleInstantsFor']);
	    const thisDt = GetPlainDateTimeFor(timeZoneRec, GetSlot(this, INSTANT), GetSlot(this, CALENDAR));
	    const hour = GetSlot(thisDt, ISO_HOUR);
	    const minute = GetSlot(thisDt, ISO_MINUTE);
	    const second = GetSlot(thisDt, ISO_SECOND);
	    const millisecond = GetSlot(thisDt, ISO_MILLISECOND);
	    const microsecond = GetSlot(thisDt, ISO_MICROSECOND);
	    const nanosecond = GetSlot(thisDt, ISO_NANOSECOND);
	    calendar = ConsolidateCalendars(GetSlot(this, CALENDAR), calendar);
	    const dt = CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
	    const instant = GetInstantFor(timeZoneRec, dt, 'compatible');
	    return CreateTemporalZonedDateTime(GetSlot(instant, EPOCHNANOSECONDS), timeZoneRec.receiver, calendar);
	  }
	  withPlainTime() {
	    let temporalTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    temporalTime = ToTemporalTimeOrMidnight(temporalTime);
	    const timeZoneRec = new TimeZoneMethodRecord(GetSlot(this, TIME_ZONE), ['getOffsetNanosecondsFor', 'getPossibleInstantsFor']);
	    const calendar = GetSlot(this, CALENDAR);
	    const thisDt = GetPlainDateTimeFor(timeZoneRec, GetSlot(this, INSTANT), calendar);
	    const dt = CreateTemporalDateTime(GetSlot(thisDt, ISO_YEAR), GetSlot(thisDt, ISO_MONTH), GetSlot(thisDt, ISO_DAY), GetSlot(temporalTime, ISO_HOUR), GetSlot(temporalTime, ISO_MINUTE), GetSlot(temporalTime, ISO_SECOND), GetSlot(temporalTime, ISO_MILLISECOND), GetSlot(temporalTime, ISO_MICROSECOND), GetSlot(temporalTime, ISO_NANOSECOND), calendar);
	    const instant = GetInstantFor(timeZoneRec, dt, 'compatible');
	    return CreateTemporalZonedDateTime(GetSlot(instant, EPOCHNANOSECONDS), timeZoneRec.receiver, calendar);
	  }
	  withTimeZone(timeZone) {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    timeZone = ToTemporalTimeZoneSlotValue(timeZone);
	    return CreateTemporalZonedDateTime(GetSlot(this, EPOCHNANOSECONDS), timeZone, GetSlot(this, CALENDAR));
	  }
	  withCalendar(calendar) {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    calendar = ToTemporalCalendarSlotValue(calendar);
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
	    if (Type$d(roundTo) === 'String') {
	      const stringParam = roundTo;
	      roundTo = ObjectCreate(null);
	      roundTo.smallestUnit = stringParam;
	    } else {
	      roundTo = GetOptionsObject(roundTo);
	    }
	    const roundingIncrement = ToTemporalRoundingIncrement(roundTo);
	    const roundingMode = ToTemporalRoundingMode(roundTo, 'halfExpand');
	    const smallestUnit = GetTemporalUnit(roundTo, 'smallestUnit', 'time', REQUIRED, ['day']);
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
	    const timeZoneRec = new TimeZoneMethodRecord(GetSlot(this, TIME_ZONE), ['getOffsetNanosecondsFor', 'getPossibleInstantsFor']);
	    const offsetNs = GetOffsetNanosecondsFor(timeZoneRec, GetSlot(this, INSTANT));
	    const dt = GetPlainDateTimeFor(timeZoneRec, GetSlot(this, INSTANT), GetSlot(this, CALENDAR), offsetNs);
	    let year = GetSlot(dt, ISO_YEAR);
	    let month = GetSlot(dt, ISO_MONTH);
	    let day = GetSlot(dt, ISO_DAY);
	    let hour = GetSlot(dt, ISO_HOUR);
	    let minute = GetSlot(dt, ISO_MINUTE);
	    let second = GetSlot(dt, ISO_SECOND);
	    let millisecond = GetSlot(dt, ISO_MILLISECOND);
	    let microsecond = GetSlot(dt, ISO_MICROSECOND);
	    let nanosecond = GetSlot(dt, ISO_NANOSECOND);
	    let epochNanoseconds;
	    if (smallestUnit === 'day') {
	      // Compute Instants for start-of-day and end-of-day
	      // Determine how far the current instant has progressed through this span.
	      const dtStart = CreateTemporalDateTime(year, month, day, 0, 0, 0, 0, 0, 0, 'iso8601');
	      const dEnd = BalanceISODate(year, month, day + 1);
	      const dtEnd = CreateTemporalDateTime(dEnd.year, dEnd.month, dEnd.day, 0, 0, 0, 0, 0, 0, 'iso8601');
	      const thisNs = GetSlot(GetSlot(this, INSTANT), EPOCHNANOSECONDS);
	      const instantStart = GetInstantFor(timeZoneRec, dtStart, 'compatible');
	      const startNs = GetSlot(instantStart, EPOCHNANOSECONDS);
	      if (thisNs.lesser(startNs)) {
	        throw new RangeError('TimeZone protocol cannot produce an instant during a day that ' + 'occurs before another instant it deems start-of-day');
	      }
	      const instantEnd = GetInstantFor(timeZoneRec, dtEnd, 'compatible');
	      const endNs = GetSlot(instantEnd, EPOCHNANOSECONDS);
	      if (thisNs.greaterOrEquals(endNs)) {
	        throw new RangeError('TimeZone protocol cannot produce an instant during a day that ' + 'occurs on or after another instant it deems end-of-day');
	      }
	      const dayLengthNs = endNs.subtract(startNs);
	      const dayProgressNs = TimeDuration.fromEpochNsDiff(thisNs, startNs);
	      epochNanoseconds = dayProgressNs.round(dayLengthNs, roundingMode).add(new TimeDuration(startNs)).totalNs;
	    } else {
	      // smallestUnit < day
	      // Round based on ISO-calendar time units
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

	      // Now reset all DateTime fields but leave the TimeZone. The offset will
	      // also be retained if the new date/time values are still OK with the old
	      // offset. Otherwise the offset will be changed to be compatible with the
	      // new date/time values. If DST disambiguation is required, the `compatible`
	      // disambiguation algorithm will be used.
	      epochNanoseconds = InterpretISODateTimeOffset(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, 'option', offsetNs, timeZoneRec, 'compatible', 'prefer', /* matchMinute = */false);
	    }
	    return CreateTemporalZonedDateTime(epochNanoseconds, timeZoneRec.receiver, GetSlot(this, CALENDAR));
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
	    const showCalendar = ToCalendarNameOption(options);
	    const digits = ToFractionalSecondDigits(options);
	    const showOffset = ToShowOffsetOption(options);
	    const roundingMode = ToTemporalRoundingMode(options, 'trunc');
	    const smallestUnit = GetTemporalUnit(options, 'smallestUnit', 'time', undefined);
	    if (smallestUnit === 'hour') throw new RangeError('smallestUnit must be a time unit other than "hour"');
	    const showTimeZone = ToTimeZoneNameOption(options);
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
	    const optionsCopy = SnapshotOwnProperties(options, null, ['timeZone']);
	    if (options.timeZone !== undefined) {
	      throw new TypeError('ZonedDateTime toLocaleString does not accept a timeZone option');
	    }
	    if (optionsCopy.year === undefined && optionsCopy.month === undefined && optionsCopy.day === undefined && optionsCopy.weekday === undefined && optionsCopy.dateStyle === undefined && optionsCopy.hour === undefined && optionsCopy.minute === undefined && optionsCopy.second === undefined && optionsCopy.timeStyle === undefined && optionsCopy.dayPeriod === undefined && optionsCopy.timeZoneName === undefined) {
	      optionsCopy.timeZoneName = 'short';
	      // The rest of the defaults will be filled in by formatting the Instant
	    }
	    const timeZoneIdentifier = ToTemporalTimeZoneIdentifier(GetSlot(this, TIME_ZONE));
	    if (IsOffsetTimeZoneIdentifier(timeZoneIdentifier)) {
	      // Note: https://github.com/tc39/ecma402/issues/683 will remove this
	      throw new RangeError('toLocaleString does not currently support offset time zones');
	    } else {
	      const record = GetAvailableNamedTimeZoneIdentifier(timeZoneIdentifier);
	      if (!record) throw new RangeError("toLocaleString formats built-in time zones, not ".concat(timeZoneIdentifier));
	      optionsCopy.timeZone = record.identifier;
	    }
	    const formatter = new DateTimeFormat(locales, optionsCopy);
	    const localeCalendarIdentifier = Call$4(customResolvedOptions, formatter, []).calendar;
	    const calendarIdentifier = ToTemporalCalendarIdentifier(GetSlot(this, CALENDAR));
	    if (calendarIdentifier !== 'iso8601' && localeCalendarIdentifier !== 'iso8601' && localeCalendarIdentifier !== calendarIdentifier) {
	      throw new RangeError("cannot format ZonedDateTime with calendar ".concat(calendarIdentifier) + " in locale with calendar ".concat(localeCalendarIdentifier));
	    }
	    return formatter.format(GetSlot(this, INSTANT));
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
	    const timeZoneRec = new TimeZoneMethodRecord(GetSlot(this, TIME_ZONE), ['getOffsetNanosecondsFor', 'getPossibleInstantsFor']);
	    const dt = GetPlainDateTimeFor(timeZoneRec, GetSlot(this, INSTANT), GetSlot(this, CALENDAR));
	    const calendar = GetSlot(this, CALENDAR);
	    const dtStart = CreateTemporalDateTime(GetSlot(dt, ISO_YEAR), GetSlot(dt, ISO_MONTH), GetSlot(dt, ISO_DAY), 0, 0, 0, 0, 0, 0, calendar);
	    const instant = GetInstantFor(timeZoneRec, dtStart, 'compatible');
	    return CreateTemporalZonedDateTime(GetSlot(instant, EPOCHNANOSECONDS), timeZoneRec.receiver, calendar);
	  }
	  toInstant() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
	    return new TemporalInstant(GetSlot(this, EPOCHNANOSECONDS));
	  }
	  toPlainDate() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return TemporalDateTimeToDate(dateTime(this));
	  }
	  toPlainTime() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return TemporalDateTimeToTime(dateTime(this));
	  }
	  toPlainDateTime() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return dateTime(this);
	  }
	  toPlainYearMonth() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['fields', 'yearMonthFromFields']);
	    const dt = dateTime(this);
	    const fieldNames = CalendarFields(calendarRec, ['monthCode', 'year']);
	    const fields = PrepareTemporalFields(dt, fieldNames, []);
	    return CalendarYearMonthFromFields(calendarRec, fields);
	  }
	  toPlainMonthDay() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['fields', 'monthDayFromFields']);
	    const dt = dateTime(this);
	    const fieldNames = CalendarFields(calendarRec, ['day', 'monthCode']);
	    const fields = PrepareTemporalFields(dt, fieldNames, []);
	    return CalendarMonthDayFromFields(calendarRec, fields);
	  }
	  getISOFields() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    const timeZoneRec = new TimeZoneMethodRecord(GetSlot(this, TIME_ZONE), ['getOffsetNanosecondsFor']);
	    const offsetNanoseconds = GetOffsetNanosecondsFor(timeZoneRec, GetSlot(this, INSTANT));
	    const dt = GetPlainDateTimeFor(timeZoneRec, GetSlot(this, INSTANT), GetSlot(this, CALENDAR), offsetNanoseconds);
	    return {
	      calendar: GetSlot(this, CALENDAR),
	      isoDay: GetSlot(dt, ISO_DAY),
	      isoHour: GetSlot(dt, ISO_HOUR),
	      isoMicrosecond: GetSlot(dt, ISO_MICROSECOND),
	      isoMillisecond: GetSlot(dt, ISO_MILLISECOND),
	      isoMinute: GetSlot(dt, ISO_MINUTE),
	      isoMonth: GetSlot(dt, ISO_MONTH),
	      isoNanosecond: GetSlot(dt, ISO_NANOSECOND),
	      isoSecond: GetSlot(dt, ISO_SECOND),
	      isoYear: GetSlot(dt, ISO_YEAR),
	      offset: FormatUTCOffsetNanoseconds(offsetNanoseconds),
	      timeZone: timeZoneRec.receiver
	    };
	  }
	  getCalendar() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return ToTemporalCalendarObject(GetSlot(this, CALENDAR));
	  }
	  getTimeZone() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return ToTemporalTimeZoneObject(GetSlot(this, TIME_ZONE));
	  }
	  static from(item) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    options = GetOptionsObject(options);
	    if (IsTemporalZonedDateTime(item)) {
	      ToTemporalDisambiguation(options); // validate and ignore
	      ToTemporalOffset(options, 'reject');
	      ToTemporalOverflow(options);
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
	  const timeZoneRec = new TimeZoneMethodRecord(GetSlot(zdt, TIME_ZONE), ['getOffsetNanosecondsFor']);
	  return GetPlainDateTimeFor(timeZoneRec, GetSlot(zdt, INSTANT), GetSlot(zdt, CALENDAR));
	}

	/* global false */

	{
	  // eslint-disable-next-line no-console
	  console.warn('This polyfill should only be used to run tests or to experiment in the browser devtools console.\n' + 'To polyfill Temporal in your own projects, see https://github.com/tc39/proposal-temporal#polyfills.');
	}

	var Temporal = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Calendar: Calendar,
		Duration: Duration,
		Instant: Instant,
		Now: Now,
		PlainDate: PlainDate,
		PlainDateTime: PlainDateTime,
		PlainMonthDay: PlainMonthDay,
		PlainTime: PlainTime,
		PlainYearMonth: PlainYearMonth,
		TimeZone: TimeZone,
		ZonedDateTime: ZonedDateTime
	});

	const DatePrototypeValueOf = Date.prototype.valueOf;
	function toTemporalInstant() {
	  const epochNanoseconds = bigInt(Call$4(DatePrototypeValueOf, this, [])).multiply(1e6);
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
	const types = [globalThis.Temporal.Instant, globalThis.Temporal.Calendar, globalThis.Temporal.PlainDate, globalThis.Temporal.PlainDateTime, globalThis.Temporal.Duration, globalThis.Temporal.PlainMonthDay,
	// globalThis.Temporal.Now, // plain object (not a constructor), so no `prototype`
	globalThis.Temporal.PlainTime, globalThis.Temporal.TimeZone, globalThis.Temporal.PlainYearMonth, globalThis.Temporal.ZonedDateTime];
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
