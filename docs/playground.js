(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.temporal = {}));
})(this, (function (exports) { 'use strict';

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function getAugmentedNamespace(n) {
	  if (n.__esModule) return n;
	  var f = n.default;
		if (typeof f == "function") {
			var a = function a () {
				if (this instanceof a) {
					var args = [null];
					args.push.apply(args, arguments);
					var Ctor = Function.bind.apply(f, args);
					return new Ctor();
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
		if (module.hasOwnProperty("exports")) {
		    module.exports = bigInt;
		}
	} (BigInteger));

	var BigIntegerExports = BigInteger.exports;
	var bigInt = /*@__PURE__*/getDefaultExportFromCjs(BigIntegerExports);

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
		foo: {}
	};

	var $Object$1 = Object;

	var hasProto$1 = function hasProto() {
		return { __proto__: test }.foo === test.foo && !({ __proto__: null } instanceof $Object$1);
	};

	/* eslint no-invalid-this: 1 */

	var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
	var slice = Array.prototype.slice;
	var toStr$4 = Object.prototype.toString;
	var funcType = '[object Function]';

	var implementation$3 = function bind(that) {
	    var target = this;
	    if (typeof target !== 'function' || toStr$4.call(target) !== funcType) {
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

	var implementation$2 = implementation$3;

	var functionBind = Function.prototype.bind || implementation$2;

	var src;
	var hasRequiredSrc;

	function requireSrc () {
		if (hasRequiredSrc) return src;
		hasRequiredSrc = 1;

		var bind = functionBind;

		src = bind.call(Function.call, Object.prototype.hasOwnProperty);
		return src;
	}

	var undefined$1;

	var $SyntaxError = SyntaxError;
	var $Function = Function;
	var $TypeError$8 = TypeError;

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
		throw new $TypeError$8();
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
		'%Error%': Error,
		'%eval%': eval, // eslint-disable-line no-eval
		'%EvalError%': EvalError,
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
		'%RangeError%': RangeError,
		'%ReferenceError%': ReferenceError,
		'%Reflect%': typeof Reflect === 'undefined' ? undefined$1 : Reflect,
		'%RegExp%': RegExp,
		'%Set%': typeof Set === 'undefined' ? undefined$1 : Set,
		'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols$3 || !getProto ? undefined$1 : getProto(new Set()[Symbol.iterator]()),
		'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined$1 : SharedArrayBuffer,
		'%String%': String,
		'%StringIteratorPrototype%': hasSymbols$3 && getProto ? getProto(''[Symbol.iterator]()) : undefined$1,
		'%Symbol%': hasSymbols$3 ? Symbol : undefined$1,
		'%SyntaxError%': $SyntaxError,
		'%ThrowTypeError%': ThrowTypeError,
		'%TypedArray%': TypedArray,
		'%TypeError%': $TypeError$8,
		'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined$1 : Uint8Array,
		'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined$1 : Uint8ClampedArray,
		'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined$1 : Uint16Array,
		'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined$1 : Uint32Array,
		'%URIError%': URIError,
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
	var hasOwn = requireSrc();
	var $concat = bind.call(Function.call, Array.prototype.concat);
	var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
	var $replace = bind.call(Function.call, String.prototype.replace);
	var $strSlice = bind.call(Function.call, String.prototype.slice);
	var $exec = bind.call(Function.call, RegExp.prototype.exec);

	/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
	var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
	var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
	var stringToPath = function stringToPath(string) {
		var first = $strSlice(string, 0, 1);
		var last = $strSlice(string, -1);
		if (first === '%' && last !== '%') {
			throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
		} else if (last === '%' && first !== '%') {
			throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
		}
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
		if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
			alias = LEGACY_ALIASES[intrinsicName];
			intrinsicName = '%' + alias[0] + '%';
		}

		if (hasOwn(INTRINSICS$1, intrinsicName)) {
			var value = INTRINSICS$1[intrinsicName];
			if (value === needsEval) {
				value = doEval(intrinsicName);
			}
			if (typeof value === 'undefined' && !allowMissing) {
				throw new $TypeError$8('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
			}

			return {
				alias: alias,
				name: intrinsicName,
				value: value
			};
		}

		throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
	};

	var getIntrinsic = function GetIntrinsic(name, allowMissing) {
		if (typeof name !== 'string' || name.length === 0) {
			throw new $TypeError$8('intrinsic name must be a non-empty string');
		}
		if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
			throw new $TypeError$8('"allowMissing" argument must be a boolean');
		}

		if ($exec(/^%?[^%]*%?$/, name) === null) {
			throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
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
			var first = $strSlice(part, 0, 1);
			var last = $strSlice(part, -1);
			if (
				(
					(first === '"' || first === "'" || first === '`')
					|| (last === '"' || last === "'" || last === '`')
				)
				&& first !== last
			) {
				throw new $SyntaxError('property names with quotes must have matching quotes');
			}
			if (part === 'constructor' || !isOwn) {
				skipFurtherCaching = true;
			}

			intrinsicBaseName += '.' + part;
			intrinsicRealName = '%' + intrinsicBaseName + '%';

			if (hasOwn(INTRINSICS$1, intrinsicRealName)) {
				value = INTRINSICS$1[intrinsicRealName];
			} else if (value != null) {
				if (!(part in value)) {
					if (!allowMissing) {
						throw new $TypeError$8('base intrinsic for ' + name + ' exists, but the property is not available.');
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
					isOwn = hasOwn(value, part);
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

	(function (module) {

		var bind = functionBind;
		var GetIntrinsic = getIntrinsic;

		var $apply = GetIntrinsic('%Function.prototype.apply%');
		var $call = GetIntrinsic('%Function.prototype.call%');
		var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

		var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
		var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
		var $max = GetIntrinsic('%Math.max%');

		if ($defineProperty) {
			try {
				$defineProperty({}, 'a', { value: 1 });
			} catch (e) {
				// IE 8 has a broken defineProperty
				$defineProperty = null;
			}
		}

		module.exports = function callBind(originalFunction) {
			var func = $reflectApply(bind, $call, arguments);
			if ($gOPD && $defineProperty) {
				var desc = $gOPD(func, 'length');
				if (desc.configurable) {
					// original length, plus the receiver, minus any additional arguments (after the receiver)
					$defineProperty(
						func,
						'length',
						{ value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
					);
				}
			}
			return func;
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

	var GetIntrinsic$e = getIntrinsic;

	var callBind$1 = callBindExports;

	var $indexOf = callBind$1(GetIntrinsic$e('String.prototype.indexOf'));

	var callBound$2 = function callBoundIntrinsic(name, allowMissing) {
		var intrinsic = GetIntrinsic$e(name, !!allowMissing);
		if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
			return callBind$1(intrinsic);
		}
		return intrinsic;
	};

	var callBound$3 = /*@__PURE__*/getDefaultExportFromCjs(callBound$2);

	var GetIntrinsic$d = getIntrinsic;

	var $Array = GetIntrinsic$d('%Array%');

	// eslint-disable-next-line global-require
	var toStr$3 = !$Array.isArray && callBound$2('Object.prototype.toString');

	var IsArray$3 = $Array.isArray || function IsArray(argument) {
		return toStr$3(argument) === '[object Array]';
	};

	// https://262.ecma-international.org/6.0/#sec-isarray
	var IsArray$1 = IsArray$3;

	var IsArray$2 = /*@__PURE__*/getDefaultExportFromCjs(IsArray$1);

	var GetIntrinsic$c = getIntrinsic;
	var callBound$1 = callBound$2;

	var $TypeError$7 = GetIntrinsic$c('%TypeError%');

	var IsArray = IsArray$1;

	var $apply = GetIntrinsic$c('%Reflect.apply%', true) || callBound$1('Function.prototype.apply');

	// https://262.ecma-international.org/6.0/#sec-call

	var Call = function Call(F, V) {
		var argumentsList = arguments.length > 2 ? arguments[2] : [];
		if (!IsArray(argumentsList)) {
			throw new $TypeError$7('Assertion failed: optional `argumentsList`, if provided, must be a List');
		}
		return $apply(F, V, argumentsList);
	};

	var Call$1 = /*@__PURE__*/getDefaultExportFromCjs(Call);

	// https://262.ecma-international.org/6.0/#sec-ispropertykey

	var IsPropertyKey$4 = function IsPropertyKey(argument) {
		return typeof argument === 'string' || typeof argument === 'symbol';
	};

	var IsPropertyKey$5 = /*@__PURE__*/getDefaultExportFromCjs(IsPropertyKey$4);

	var gopd;
	var hasRequiredGopd;

	function requireGopd () {
		if (hasRequiredGopd) return gopd;
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

		gopd = $gOPD;
		return gopd;
	}

	var isPropertyDescriptor;
	var hasRequiredIsPropertyDescriptor;

	function requireIsPropertyDescriptor () {
		if (hasRequiredIsPropertyDescriptor) return isPropertyDescriptor;
		hasRequiredIsPropertyDescriptor = 1;

		var GetIntrinsic = getIntrinsic;

		var has = requireSrc();
		var $TypeError = GetIntrinsic('%TypeError%');

		isPropertyDescriptor = function IsPropertyDescriptor(ES, Desc) {
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
				if (has(Desc, key) && !allowed[key]) {
					return false;
				}
			}

			if (ES.IsDataDescriptor(Desc) && ES.IsAccessorDescriptor(Desc)) {
				throw new $TypeError('Property Descriptors may not be both accessor and data descriptors');
			}
			return true;
		};
		return isPropertyDescriptor;
	}

	// https://262.ecma-international.org/5.1/#sec-8

	var Type$7 = function Type(x) {
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

	var ES5Type = Type$7;

	// https://262.ecma-international.org/11.0/#sec-ecmascript-data-types-and-values

	var Type$5 = function Type(x) {
		if (typeof x === 'symbol') {
			return 'Symbol';
		}
		if (typeof x === 'bigint') {
			return 'BigInt';
		}
		return ES5Type(x);
	};

	var Type$6 = /*@__PURE__*/getDefaultExportFromCjs(Type$5);

	var isMatchRecord;
	var hasRequiredIsMatchRecord;

	function requireIsMatchRecord () {
		if (hasRequiredIsMatchRecord) return isMatchRecord;
		hasRequiredIsMatchRecord = 1;

		var has = requireSrc();

		// https://262.ecma-international.org/13.0/#sec-match-records

		isMatchRecord = function isMatchRecord(record) {
			return (
				has(record, '[[StartIndex]]')
		        && has(record, '[[EndIndex]]')
		        && record['[[StartIndex]]'] >= 0
		        && record['[[EndIndex]]'] >= record['[[StartIndex]]']
		        && String(parseInt(record['[[StartIndex]]'], 10)) === String(record['[[StartIndex]]'])
		        && String(parseInt(record['[[EndIndex]]'], 10)) === String(record['[[EndIndex]]'])
			);
		};
		return isMatchRecord;
	}

	var assertRecord;
	var hasRequiredAssertRecord;

	function requireAssertRecord () {
		if (hasRequiredAssertRecord) return assertRecord;
		hasRequiredAssertRecord = 1;

		var GetIntrinsic = getIntrinsic;

		var $TypeError = GetIntrinsic('%TypeError%');
		var $SyntaxError = GetIntrinsic('%SyntaxError%');

		var has = requireSrc();

		var isMatchRecord = requireIsMatchRecord();

		var predicates = {
			// https://262.ecma-international.org/6.0/#sec-property-descriptor-specification-type
			'Property Descriptor': function isPropertyDescriptor(Desc) {
				var allowed = {
					'[[Configurable]]': true,
					'[[Enumerable]]': true,
					'[[Get]]': true,
					'[[Set]]': true,
					'[[Value]]': true,
					'[[Writable]]': true
				};

				if (!Desc) {
					return false;
				}
				for (var key in Desc) { // eslint-disable-line
					if (has(Desc, key) && !allowed[key]) {
						return false;
					}
				}

				var isData = has(Desc, '[[Value]]');
				var IsAccessor = has(Desc, '[[Get]]') || has(Desc, '[[Set]]');
				if (isData && IsAccessor) {
					throw new $TypeError('Property Descriptors may not be both accessor and data descriptors');
				}
				return true;
			},
			// https://262.ecma-international.org/13.0/#sec-match-records
			'Match Record': isMatchRecord,
			'Iterator Record': function isIteratorRecord(value) {
				return has(value, '[[Iterator]]') && has(value, '[[NextMethod]]') && has(value, '[[Done]]');
			},
			'PromiseCapability Record': function isPromiseCapabilityRecord(value) {
				return !!value
					&& has(value, '[[Resolve]]')
					&& typeof value['[[Resolve]]'] === 'function'
					&& has(value, '[[Reject]]')
					&& typeof value['[[Reject]]'] === 'function'
					&& has(value, '[[Promise]]')
					&& value['[[Promise]]']
					&& typeof value['[[Promise]]'].then === 'function';
			},
			'AsyncGeneratorRequest Record': function isAsyncGeneratorRequestRecord(value) {
				return !!value
					&& has(value, '[[Completion]]') // TODO: confirm is a completion record
					&& has(value, '[[Capability]]')
					&& predicates['PromiseCapability Record'](value['[[Capability]]']);
			}
		};

		assertRecord = function assertRecord(Type, recordType, argumentName, value) {
			var predicate = predicates[recordType];
			if (typeof predicate !== 'function') {
				throw new $SyntaxError('unknown record type: ' + recordType);
			}
			if (Type(value) !== 'Object' || !predicate(value)) {
				throw new $TypeError(argumentName + ' must be a ' + recordType);
			}
		};
		return assertRecord;
	}

	var IsAccessorDescriptor;
	var hasRequiredIsAccessorDescriptor;

	function requireIsAccessorDescriptor () {
		if (hasRequiredIsAccessorDescriptor) return IsAccessorDescriptor;
		hasRequiredIsAccessorDescriptor = 1;

		var has = requireSrc();

		var Type = Type$5;

		var assertRecord = requireAssertRecord();

		// https://262.ecma-international.org/5.1/#sec-8.10.1

		IsAccessorDescriptor = function IsAccessorDescriptor(Desc) {
			if (typeof Desc === 'undefined') {
				return false;
			}

			assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

			if (!has(Desc, '[[Get]]') && !has(Desc, '[[Set]]')) {
				return false;
			}

			return true;
		};
		return IsAccessorDescriptor;
	}

	var IsDataDescriptor;
	var hasRequiredIsDataDescriptor;

	function requireIsDataDescriptor () {
		if (hasRequiredIsDataDescriptor) return IsDataDescriptor;
		hasRequiredIsDataDescriptor = 1;

		var has = requireSrc();

		var Type = Type$5;

		var assertRecord = requireAssertRecord();

		// https://262.ecma-international.org/5.1/#sec-8.10.2

		IsDataDescriptor = function IsDataDescriptor(Desc) {
			if (typeof Desc === 'undefined') {
				return false;
			}

			assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

			if (!has(Desc, '[[Value]]') && !has(Desc, '[[Writable]]')) {
				return false;
			}

			return true;
		};
		return IsDataDescriptor;
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

	var IsCallable$1;
	var hasRequiredIsCallable;

	function requireIsCallable () {
		if (hasRequiredIsCallable) return IsCallable$1;
		hasRequiredIsCallable = 1;

		// http://262.ecma-international.org/5.1/#sec-9.11

		IsCallable$1 = isCallable$1;
		return IsCallable$1;
	}

	var ToPropertyDescriptor;
	var hasRequiredToPropertyDescriptor;

	function requireToPropertyDescriptor () {
		if (hasRequiredToPropertyDescriptor) return ToPropertyDescriptor;
		hasRequiredToPropertyDescriptor = 1;

		var has = requireSrc();

		var GetIntrinsic = getIntrinsic;

		var $TypeError = GetIntrinsic('%TypeError%');

		var Type = Type$5;
		var ToBoolean = requireToBoolean();
		var IsCallable = requireIsCallable();

		// https://262.ecma-international.org/5.1/#sec-8.10.5

		ToPropertyDescriptor = function ToPropertyDescriptor(Obj) {
			if (Type(Obj) !== 'Object') {
				throw new $TypeError('ToPropertyDescriptor requires an object');
			}

			var desc = {};
			if (has(Obj, 'enumerable')) {
				desc['[[Enumerable]]'] = ToBoolean(Obj.enumerable);
			}
			if (has(Obj, 'configurable')) {
				desc['[[Configurable]]'] = ToBoolean(Obj.configurable);
			}
			if (has(Obj, 'value')) {
				desc['[[Value]]'] = Obj.value;
			}
			if (has(Obj, 'writable')) {
				desc['[[Writable]]'] = ToBoolean(Obj.writable);
			}
			if (has(Obj, 'get')) {
				var getter = Obj.get;
				if (typeof getter !== 'undefined' && !IsCallable(getter)) {
					throw new $TypeError('getter must be a function');
				}
				desc['[[Get]]'] = getter;
			}
			if (has(Obj, 'set')) {
				var setter = Obj.set;
				if (typeof setter !== 'undefined' && !IsCallable(setter)) {
					throw new $TypeError('setter must be a function');
				}
				desc['[[Set]]'] = setter;
			}

			if ((has(desc, '[[Get]]') || has(desc, '[[Set]]')) && (has(desc, '[[Value]]') || has(desc, '[[Writable]]'))) {
				throw new $TypeError('Invalid property descriptor. Cannot both specify accessors and a value or writable attribute');
			}
			return desc;
		};
		return ToPropertyDescriptor;
	}

	var _isNaN = Number.isNaN || function isNaN(a) {
		return a !== a;
	};

	var $isNaN$3 = _isNaN;

	// http://262.ecma-international.org/5.1/#sec-9.12

	var SameValue = function SameValue(x, y) {
		if (x === y) { // 0 === -0, but they are not identical.
			if (x === 0) { return 1 / x === 1 / y; }
			return true;
		}
		return $isNaN$3(x) && $isNaN$3(y);
	};

	var SameValue$1 = /*@__PURE__*/getDefaultExportFromCjs(SameValue);

	var hasPropertyDescriptors_1;
	var hasRequiredHasPropertyDescriptors;

	function requireHasPropertyDescriptors () {
		if (hasRequiredHasPropertyDescriptors) return hasPropertyDescriptors_1;
		hasRequiredHasPropertyDescriptors = 1;

		var GetIntrinsic = getIntrinsic;

		var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);

		var hasPropertyDescriptors = function hasPropertyDescriptors() {
			if ($defineProperty) {
				try {
					$defineProperty({}, 'a', { value: 1 });
					return true;
				} catch (e) {
					// IE 8 has a broken defineProperty
					return false;
				}
			}
			return false;
		};

		hasPropertyDescriptors.hasArrayLengthDefineBug = function hasArrayLengthDefineBug() {
			// node v0.6 has a bug where array lengths can be Set but not Defined
			if (!hasPropertyDescriptors()) {
				return null;
			}
			try {
				return $defineProperty([], 'length', { value: 1 }).length !== 1;
			} catch (e) {
				// In Firefox 4-22, defining length on an array throws an exception.
				return true;
			}
		};

		hasPropertyDescriptors_1 = hasPropertyDescriptors;
		return hasPropertyDescriptors_1;
	}

	var DefineOwnProperty;
	var hasRequiredDefineOwnProperty;

	function requireDefineOwnProperty () {
		if (hasRequiredDefineOwnProperty) return DefineOwnProperty;
		hasRequiredDefineOwnProperty = 1;

		var hasPropertyDescriptors = requireHasPropertyDescriptors();

		var GetIntrinsic = getIntrinsic;

		var $defineProperty = hasPropertyDescriptors() && GetIntrinsic('%Object.defineProperty%', true);

		var hasArrayLengthDefineBug = hasPropertyDescriptors.hasArrayLengthDefineBug();

		// eslint-disable-next-line global-require
		var isArray = hasArrayLengthDefineBug && IsArray$3;

		var callBound = callBound$2;

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

		isFullyPopulatedPropertyDescriptor = function isFullyPopulatedPropertyDescriptor(ES, Desc) {
			return !!Desc
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

		var assertRecord = requireAssertRecord();
		var fromPropertyDescriptor = requireFromPropertyDescriptor$1();

		var Type = Type$5;

		// https://262.ecma-international.org/6.0/#sec-frompropertydescriptor

		FromPropertyDescriptor = function FromPropertyDescriptor(Desc) {
			if (typeof Desc !== 'undefined') {
				assertRecord(Type, 'Property Descriptor', 'Desc', Desc);
			}

			return fromPropertyDescriptor(Desc);
		};
		return FromPropertyDescriptor;
	}

	var IsGenericDescriptor;
	var hasRequiredIsGenericDescriptor;

	function requireIsGenericDescriptor () {
		if (hasRequiredIsGenericDescriptor) return IsGenericDescriptor;
		hasRequiredIsGenericDescriptor = 1;

		var assertRecord = requireAssertRecord();

		var IsAccessorDescriptor = requireIsAccessorDescriptor();
		var IsDataDescriptor = requireIsDataDescriptor();
		var Type = Type$5;

		// https://262.ecma-international.org/6.0/#sec-isgenericdescriptor

		IsGenericDescriptor = function IsGenericDescriptor(Desc) {
			if (typeof Desc === 'undefined') {
				return false;
			}

			assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

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

		var GetIntrinsic = getIntrinsic;

		var $TypeError = GetIntrinsic('%TypeError%');

		var DefineOwnProperty = requireDefineOwnProperty();
		var isFullyPopulatedPropertyDescriptor = requireIsFullyPopulatedPropertyDescriptor();
		var isPropertyDescriptor = requireIsPropertyDescriptor();

		var FromPropertyDescriptor = requireFromPropertyDescriptor();
		var IsAccessorDescriptor = requireIsAccessorDescriptor();
		var IsDataDescriptor = requireIsDataDescriptor();
		var IsGenericDescriptor = requireIsGenericDescriptor();
		var IsPropertyKey = IsPropertyKey$4;
		var SameValue$1 = SameValue;
		var Type = Type$5;

		// https://262.ecma-international.org/13.0/#sec-validateandapplypropertydescriptor

		// see https://github.com/tc39/ecma262/pull/2468 for ES2022 changes

		// eslint-disable-next-line max-lines-per-function, max-statements, max-params
		ValidateAndApplyPropertyDescriptor = function ValidateAndApplyPropertyDescriptor(O, P, extensible, Desc, current) {
			var oType = Type(O);
			if (oType !== 'Undefined' && oType !== 'Object') {
				throw new $TypeError('Assertion failed: O must be undefined or an Object');
			}
			if (!IsPropertyKey(P)) {
				throw new $TypeError('Assertion failed: P must be a Property Key');
			}
			if (Type(extensible) !== 'Boolean') {
				throw new $TypeError('Assertion failed: extensible must be a Boolean');
			}
			if (!isPropertyDescriptor({
				Type: Type,
				IsDataDescriptor: IsDataDescriptor,
				IsAccessorDescriptor: IsAccessorDescriptor
			}, Desc)) {
				throw new $TypeError('Assertion failed: Desc must be a Property Descriptor');
			}
			if (Type(current) !== 'Undefined' && !isPropertyDescriptor({
				Type: Type,
				IsDataDescriptor: IsDataDescriptor,
				IsAccessorDescriptor: IsAccessorDescriptor
			}, current)) {
				throw new $TypeError('Assertion failed: current must be a Property Descriptor, or undefined');
			}

			if (Type(current) === 'Undefined') { // step 2
				if (!extensible) {
					return false; // step 2.a
				}
				if (oType === 'Undefined') {
					return true; // step 2.b
				}
				if (IsAccessorDescriptor(Desc)) { // step 2.c
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
			if (!isFullyPopulatedPropertyDescriptor({
				IsAccessorDescriptor: IsAccessorDescriptor,
				IsDataDescriptor: IsDataDescriptor
			}, current)) {
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
				if ('[[Enumerable]]' in Desc && !SameValue$1(Desc['[[Enumerable]]'], current['[[Enumerable]]'])) {
					// step 5.b
					return false;
				}
				if (!IsGenericDescriptor(Desc) && !SameValue$1(IsAccessorDescriptor(Desc), IsAccessorDescriptor(current))) {
					// step 5.c
					return false;
				}
				if (IsAccessorDescriptor(current)) { // step 5.d
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
				if (IsDataDescriptor(current) && IsAccessorDescriptor(Desc)) { // step 6.a
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
				} else if (IsAccessorDescriptor(current) && IsDataDescriptor(Desc)) {
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
		return ValidateAndApplyPropertyDescriptor;
	}

	var OrdinaryDefineOwnProperty;
	var hasRequiredOrdinaryDefineOwnProperty;

	function requireOrdinaryDefineOwnProperty () {
		if (hasRequiredOrdinaryDefineOwnProperty) return OrdinaryDefineOwnProperty;
		hasRequiredOrdinaryDefineOwnProperty = 1;

		var GetIntrinsic = getIntrinsic;

		var $gOPD = requireGopd();
		var $SyntaxError = GetIntrinsic('%SyntaxError%');
		var $TypeError = GetIntrinsic('%TypeError%');

		var isPropertyDescriptor = requireIsPropertyDescriptor();

		var IsAccessorDescriptor = requireIsAccessorDescriptor();
		var IsDataDescriptor = requireIsDataDescriptor();
		var IsExtensible = requireIsExtensible();
		var IsPropertyKey = IsPropertyKey$4;
		var ToPropertyDescriptor = requireToPropertyDescriptor();
		var SameValue$1 = SameValue;
		var Type = Type$5;
		var ValidateAndApplyPropertyDescriptor = requireValidateAndApplyPropertyDescriptor();

		// https://262.ecma-international.org/6.0/#sec-ordinarydefineownproperty

		OrdinaryDefineOwnProperty = function OrdinaryDefineOwnProperty(O, P, Desc) {
			if (Type(O) !== 'Object') {
				throw new $TypeError('Assertion failed: O must be an Object');
			}
			if (!IsPropertyKey(P)) {
				throw new $TypeError('Assertion failed: P must be a Property Key');
			}
			if (!isPropertyDescriptor({
				Type: Type,
				IsDataDescriptor: IsDataDescriptor,
				IsAccessorDescriptor: IsAccessorDescriptor
			}, Desc)) {
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
					return SameValue$1(O[P], Desc['[[Value]]']);
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

	var CreateDataProperty$1;
	var hasRequiredCreateDataProperty;

	function requireCreateDataProperty () {
		if (hasRequiredCreateDataProperty) return CreateDataProperty$1;
		hasRequiredCreateDataProperty = 1;

		var GetIntrinsic = getIntrinsic;

		var $TypeError = GetIntrinsic('%TypeError%');

		var IsPropertyKey = IsPropertyKey$4;
		var OrdinaryDefineOwnProperty = requireOrdinaryDefineOwnProperty();
		var Type = Type$5;

		// https://262.ecma-international.org/6.0/#sec-createdataproperty

		CreateDataProperty$1 = function CreateDataProperty(O, P, V) {
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
		return CreateDataProperty$1;
	}

	var GetIntrinsic$b = getIntrinsic;

	var $TypeError$6 = GetIntrinsic$b('%TypeError%');

	var CreateDataProperty = requireCreateDataProperty();
	var IsPropertyKey$3 = IsPropertyKey$4;
	var Type$4 = Type$5;

	// // https://262.ecma-international.org/6.0/#sec-createdatapropertyorthrow

	var CreateDataPropertyOrThrow = function CreateDataPropertyOrThrow(O, P, V) {
		if (Type$4(O) !== 'Object') {
			throw new $TypeError$6('Assertion failed: Type(O) is not Object');
		}
		if (!IsPropertyKey$3(P)) {
			throw new $TypeError$6('Assertion failed: IsPropertyKey(P) is not true');
		}
		var success = CreateDataProperty(O, P, V);
		if (!success) {
			throw new $TypeError$6('unable to create data property');
		}
		return success;
	};

	var CreateDataPropertyOrThrow$1 = /*@__PURE__*/getDefaultExportFromCjs(CreateDataPropertyOrThrow);

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

	var isArray$1 = Array.isArray || function (arr) {
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

	    if (obj.type === 'Buffer' && isArray$1(obj.data)) {
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
	  if (!isArray$1(list)) {
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
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect$2(arguments[i]));
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
	      str += ' ' + inspect$2(x);
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
	function inspect$2(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
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
	inspect$2.colors = {
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
	inspect$2.styles = {
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
	  var style = inspect$2.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect$2.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect$2.colors[style][1] + 'm';
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
	      value.inspect !== inspect$2 &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
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
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate$1(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '', array = false, braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate$1(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
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
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
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
	function isArray(ar) {
	  return Array.isArray(ar);
	}

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}

	function isNull(arg) {
	  return arg === null;
	}

	function isNullOrUndefined(arg) {
	  return arg == null;
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isString(arg) {
	  return typeof arg === 'string';
	}

	function isSymbol$2(arg) {
	  return typeof arg === 'symbol';
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isDate$1(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}

	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
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

	function objectToString(o) {
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
	  isError: isError,
	  isDate: isDate$1,
	  isObject: isObject,
	  isRegExp: isRegExp,
	  isUndefined: isUndefined,
	  isSymbol: isSymbol$2,
	  isString: isString,
	  isNumber: isNumber,
	  isNullOrUndefined: isNullOrUndefined,
	  isNull: isNull,
	  isBoolean: isBoolean,
	  isArray: isArray,
	  inspect: inspect$2,
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
		inspect: inspect$2,
		isArray: isArray,
		isBoolean: isBoolean,
		isBuffer: isBuffer,
		isDate: isDate$1,
		isError: isError,
		isFunction: isFunction,
		isNull: isNull,
		isNullOrUndefined: isNullOrUndefined,
		isNumber: isNumber,
		isObject: isObject,
		isPrimitive: isPrimitive$3,
		isRegExp: isRegExp,
		isString: isString,
		isSymbol: isSymbol$2,
		isUndefined: isUndefined,
		log: log
	});

	var require$$0 = /*@__PURE__*/getAugmentedNamespace(util$1);

	var util_inspect;
	var hasRequiredUtil_inspect;

	function requireUtil_inspect () {
		if (hasRequiredUtil_inspect) return util_inspect;
		hasRequiredUtil_inspect = 1;
		util_inspect = require$$0.inspect;
		return util_inspect;
	}

	var objectInspect;
	var hasRequiredObjectInspect;

	function requireObjectInspect () {
		if (hasRequiredObjectInspect) return objectInspect;
		hasRequiredObjectInspect = 1;
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
		var $floor = Math.floor;
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
		        var int = num < 0 ? -$floor(-num) : $floor(num); // trunc(num)
		        if (int !== num) {
		            var intStr = String(int);
		            var dec = $slice.call(str, intStr.length + 1);
		            return $replace.call(intStr, sepRegex, '$&_') + '.' + $replace.call($replace.call(dec, /([0-9]{3})/g, '$&_'), /_$/, '');
		        }
		    }
		    return $replace.call(str, sepRegex, '$&_');
		}

		var utilInspect = requireUtil_inspect();
		var inspectCustom = utilInspect.custom;
		var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;

		objectInspect = function inspect_(obj, options, depth, seen) {
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
		    if (isSymbol(obj)) {
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
		    if (!isDate(obj) && !isRegExp(obj)) {
		        var ys = arrObjKeys(obj, inspect);
		        var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
		        var protoTag = obj instanceof Object ? '' : 'null prototype';
		        var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? 'Object' : '';
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

		function isArray(obj) { return toStr(obj) === '[object Array]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
		function isDate(obj) { return toStr(obj) === '[object Date]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
		function isRegExp(obj) { return toStr(obj) === '[object RegExp]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
		function isError(obj) { return toStr(obj) === '[object Error]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
		function isString(obj) { return toStr(obj) === '[object String]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
		function isNumber(obj) { return toStr(obj) === '[object Number]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
		function isBoolean(obj) { return toStr(obj) === '[object Boolean]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }

		// Symbol and BigInt do have Symbol.toStringTag by spec, so that can't be used to eliminate false positives
		function isSymbol(obj) {
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

		var hasOwn = Object.prototype.hasOwnProperty || function (key) { return key in this; };
		function has(obj, key) {
		    return hasOwn.call(obj, key);
		}

		function toStr(obj) {
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
		return objectInspect;
	}

	var GetIntrinsic$a = getIntrinsic;

	var $TypeError$5 = GetIntrinsic$a('%TypeError%');

	var inspect$1 = requireObjectInspect();

	var IsPropertyKey$2 = IsPropertyKey$4;
	var Type$3 = Type$5;

	// https://262.ecma-international.org/6.0/#sec-get-o-p

	var Get = function Get(O, P) {
		// 7.3.1.1
		if (Type$3(O) !== 'Object') {
			throw new $TypeError$5('Assertion failed: Type(O) is not Object');
		}
		// 7.3.1.2
		if (!IsPropertyKey$2(P)) {
			throw new $TypeError$5('Assertion failed: IsPropertyKey(P) is not true, got ' + inspect$1(P));
		}
		// 7.3.1.3
		return O[P];
	};

	var Get$1 = /*@__PURE__*/getDefaultExportFromCjs(Get);

	var CheckObjectCoercible;
	var hasRequiredCheckObjectCoercible;

	function requireCheckObjectCoercible () {
		if (hasRequiredCheckObjectCoercible) return CheckObjectCoercible;
		hasRequiredCheckObjectCoercible = 1;

		var GetIntrinsic = getIntrinsic;

		var $TypeError = GetIntrinsic('%TypeError%');

		// http://262.ecma-international.org/5.1/#sec-9.10

		CheckObjectCoercible = function CheckObjectCoercible(value, optMessage) {
			if (value == null) {
				throw new $TypeError(optMessage || ('Cannot call method on ' + value));
			}
			return value;
		};
		return CheckObjectCoercible;
	}

	var RequireObjectCoercible$1;
	var hasRequiredRequireObjectCoercible;

	function requireRequireObjectCoercible () {
		if (hasRequiredRequireObjectCoercible) return RequireObjectCoercible$1;
		hasRequiredRequireObjectCoercible = 1;

		RequireObjectCoercible$1 = requireCheckObjectCoercible();
		return RequireObjectCoercible$1;
	}

	var GetIntrinsic$9 = getIntrinsic;

	var $Object = GetIntrinsic$9('%Object%');

	var RequireObjectCoercible = requireRequireObjectCoercible();

	// https://262.ecma-international.org/6.0/#sec-toobject

	var ToObject = function ToObject(value) {
		RequireObjectCoercible(value);
		return $Object(value);
	};

	var ToObject$1 = /*@__PURE__*/getDefaultExportFromCjs(ToObject);

	var GetV$1;
	var hasRequiredGetV;

	function requireGetV () {
		if (hasRequiredGetV) return GetV$1;
		hasRequiredGetV = 1;

		var GetIntrinsic = getIntrinsic;

		var $TypeError = GetIntrinsic('%TypeError%');

		var IsPropertyKey = IsPropertyKey$4;
		var ToObject$1 = ToObject;

		// https://262.ecma-international.org/6.0/#sec-getv

		GetV$1 = function GetV(V, P) {
			// 7.3.2.1
			if (!IsPropertyKey(P)) {
				throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
			}

			// 7.3.2.2-3
			var O = ToObject$1(V);

			// 7.3.2.4
			return O[P];
		};
		return GetV$1;
	}

	var GetIntrinsic$8 = getIntrinsic;

	var $TypeError$4 = GetIntrinsic$8('%TypeError%');

	var GetV = requireGetV();
	var IsCallable = requireIsCallable();
	var IsPropertyKey$1 = IsPropertyKey$4;

	var inspect = requireObjectInspect();

	// https://262.ecma-international.org/6.0/#sec-getmethod

	var GetMethod$1 = function GetMethod(O, P) {
		// 7.3.9.1
		if (!IsPropertyKey$1(P)) {
			throw new $TypeError$4('Assertion failed: IsPropertyKey(P) is not true');
		}

		// 7.3.9.2
		var func = GetV(O, P);

		// 7.3.9.4
		if (func == null) {
			return void 0;
		}

		// 7.3.9.5
		if (!IsCallable(func)) {
			throw new $TypeError$4(inspect(P) + ' is not a function: ' + inspect(func));
		}

		// 7.3.9.6
		return func;
	};

	var GetMethod$2 = /*@__PURE__*/getDefaultExportFromCjs(GetMethod$1);

	var GetIntrinsic$7 = getIntrinsic;

	var $TypeError$3 = GetIntrinsic$7('%TypeError%');

	var has = requireSrc();

	var IsPropertyKey = IsPropertyKey$4;
	var Type$2 = Type$5;

	// https://262.ecma-international.org/6.0/#sec-hasownproperty

	var HasOwnProperty = function HasOwnProperty(O, P) {
		if (Type$2(O) !== 'Object') {
			throw new $TypeError$3('Assertion failed: `O` must be an Object');
		}
		if (!IsPropertyKey(P)) {
			throw new $TypeError$3('Assertion failed: `P` must be a Property Key');
		}
		return has(O, P);
	};

	var HasOwnProperty$1 = /*@__PURE__*/getDefaultExportFromCjs(HasOwnProperty);

	var GetIntrinsic$6 = getIntrinsic;

	var $abs = GetIntrinsic$6('%Math.abs%');

	// http://262.ecma-international.org/5.1/#sec-5.2

	var abs$2 = function abs(x) {
		return $abs(x);
	};

	var Type$1 = Type$5;

	// var modulo = require('./modulo');
	var $floor = Math.floor;

	// http://262.ecma-international.org/11.0/#eqn-floor

	var floor$2 = function floor(x) {
		// return x - modulo(x, 1);
		if (Type$1(x) === 'BigInt') {
			return x;
		}
		return $floor(x);
	};

	var $isNaN$2 = _isNaN;

	var _isFinite = function (x) { return (typeof x === 'number' || typeof x === 'bigint') && !$isNaN$2(x) && x !== Infinity && x !== -Infinity; };

	var abs$1 = abs$2;
	var floor$1 = floor$2;
	var Type = Type$5;

	var $isNaN$1 = _isNaN;
	var $isFinite$1 = _isFinite;

	// https://tc39.es/ecma262/#sec-isintegralnumber

	var IsIntegralNumber$1 = function IsIntegralNumber(argument) {
		if (Type(argument) !== 'Number' || $isNaN$1(argument) || !$isFinite$1(argument)) {
			return false;
		}
		var absValue = abs$1(argument);
		return floor$1(absValue) === absValue;
	};

	var IsIntegralNumber$2 = /*@__PURE__*/getDefaultExportFromCjs(IsIntegralNumber$1);

	var isPrimitive$2 = function isPrimitive(value) {
		return value === null || (typeof value !== 'function' && typeof value !== 'object');
	};

	var hasSymbols$2 = shams$1;

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

		var callBound = callBound$2;
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

		var callBound = callBound$2;
		var GetIntrinsic = getIntrinsic;
		var isRegex = requireIsRegex();

		var $exec = callBound('RegExp.prototype.exec');
		var $TypeError = GetIntrinsic('%TypeError%');

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
		var origDefineProperty = Object.defineProperty;

		var isFunction = function (fn) {
			return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
		};

		var hasPropertyDescriptors = requireHasPropertyDescriptors()();

		var supportsDescriptors = origDefineProperty && hasPropertyDescriptors;

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
				origDefineProperty(object, name, {
					configurable: true,
					enumerable: false,
					value: value,
					writable: true
				});
			} else {
				object[name] = value; // eslint-disable-line no-param-reassign
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

	var GetIntrinsic$5 = getIntrinsic;

	var $String$1 = GetIntrinsic$5('%String%');
	var $TypeError$2 = GetIntrinsic$5('%TypeError%');

	// https://262.ecma-international.org/6.0/#sec-tostring

	var ToString = function ToString(argument) {
		if (typeof argument === 'symbol') {
			throw new $TypeError$2('Cannot convert a Symbol value to a string');
		}
		return $String$1(argument);
	};

	var ToString$1 = /*@__PURE__*/getDefaultExportFromCjs(ToString);

	var implementation;
	var hasRequiredImplementation;

	function requireImplementation () {
		if (hasRequiredImplementation) return implementation;
		hasRequiredImplementation = 1;

		var RequireObjectCoercible = requireRequireObjectCoercible();
		var ToString$1 = ToString;
		var callBound = callBound$2;
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
		var RequireObjectCoercible = requireRequireObjectCoercible();

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
		var $TypeError = GetIntrinsic('%TypeError%');
		var $parseInteger = GetIntrinsic('%parseInt%');

		var callBound = callBound$2;
		var regexTester = requireSafeRegexTest();

		var $strSlice = callBound('String.prototype.slice');
		var isBinary = regexTester(/^0b[01]+$/i);
		var isOctal = regexTester(/^0o[0-7]+$/i);
		var isInvalidHexLiteral = regexTester(/^[-+]0x[0-9a-f]+$/i);
		var nonWS = ['\u0085', '\u200b', '\ufffe'].join('');
		var nonWSregex = new $RegExp('[' + nonWS + ']', 'g');
		var hasNonWS = regexTester(nonWSregex);

		var $trim = requireString_prototype_trim();

		var Type = Type$5;

		// https://262.ecma-international.org/13.0/#sec-stringtonumber

		StringToNumber$1 = function StringToNumber(argument) {
			if (Type(argument) !== 'String') {
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

	var GetIntrinsic$4 = getIntrinsic;

	var $TypeError$1 = GetIntrinsic$4('%TypeError%');
	var $Number = GetIntrinsic$4('%Number%');
	var isPrimitive = requireIsPrimitive();

	var ToPrimitive = ToPrimitive$1;
	var StringToNumber = requireStringToNumber();

	// https://262.ecma-international.org/13.0/#sec-tonumber

	var ToNumber$1 = function ToNumber(argument) {
		var value = isPrimitive(argument) ? argument : ToPrimitive(argument, $Number);
		if (typeof value === 'symbol') {
			throw new $TypeError$1('Cannot convert a Symbol value to a number');
		}
		if (typeof value === 'bigint') {
			throw new $TypeError$1('Conversion from \'BigInt\' to \'number\' is not allowed.');
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

	var abs = abs$2;
	var floor = floor$2;
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

	var maxSafeInteger;
	var hasRequiredMaxSafeInteger;

	function requireMaxSafeInteger () {
		if (hasRequiredMaxSafeInteger) return maxSafeInteger;
		hasRequiredMaxSafeInteger = 1;

		var GetIntrinsic = getIntrinsic;

		var $Math = GetIntrinsic('%Math%');
		var $Number = GetIntrinsic('%Number%');

		maxSafeInteger = $Number.MAX_SAFE_INTEGER || $Math.pow(2, 53) - 1;
		return maxSafeInteger;
	}

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

		var GetIntrinsic = getIntrinsic;

		var $TypeError = GetIntrinsic('%TypeError%');

		var callBound = callBound$2;

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
	var $RangeError = GetIntrinsic$3('%RangeError%');

	var IsIntegralNumber = IsIntegralNumber$1;
	var StringPad = requireStringPad();

	// https://262.ecma-international.org/13.0/#sec-tozeropaddeddecimalstring

	var ToZeroPaddedDecimalString = function ToZeroPaddedDecimalString(n, minLength) {
		if (!IsIntegralNumber(n) || n < 0) {
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
	var callBound = callBound$2;

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
	    const descr = options.stylize("".concat(this[Symbol.toStringTag], " <").concat(this, ">"), 'special');
	    if (depth < 1) return descr;
	    const entries = [];
	    for (const prop of ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds']) {
	      if (this[prop] !== 0) entries.push("  ".concat(prop, ": ").concat(options.stylize(this[prop], 'number')));
	    }
	    return descr + ' {\n' + entries.join(',\n') + '\n}';
	  }
	};
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

	const tzComponent = /\.[-A-Za-z_]|\.\.[-A-Za-z._]{1,12}|\.[-A-Za-z_][-A-Za-z._]{0,12}|[A-Za-z_][-A-Za-z._]{0,13}/;
	const offsetNoCapture = /(?:[+\u2212-][0-2][0-9](?::?[0-5][0-9](?::?[0-5][0-9](?:[.,]\d{1,9})?)?)?)/;
	const timeZoneID = new RegExp('(?:' + ["(?:".concat(tzComponent.source, ")(?:\\/(?:").concat(tzComponent.source, "))*"), 'Etc/GMT(?:0|[-+]\\d{1,2})', 'GMT[-+]?0', 'EST5EDT', 'CST6CDT', 'MST7MDT', 'PST8PDT', offsetNoCapture.source].join('|') + ')');
	const yearpart = /(?:[+\u2212-]\d{6}|\d{4})/;
	const monthpart = /(?:0[1-9]|1[0-2])/;
	const daypart = /(?:0[1-9]|[12]\d|3[01])/;
	const datesplit = new RegExp("(".concat(yearpart.source, ")(?:-(").concat(monthpart.source, ")-(").concat(daypart.source, ")|(").concat(monthpart.source, ")(").concat(daypart.source, "))"));
	const timesplit = /(\d{2})(?::(\d{2})(?::(\d{2})(?:[.,](\d{1,9}))?)?|(\d{2})(?:(\d{2})(?:[.,](\d{1,9}))?)?)?/;
	const offset = /([+\u2212-])([01][0-9]|2[0-3])(?::?([0-5][0-9])(?::?([0-5][0-9])(?:[.,](\d{1,9}))?)?)?/;
	const offsetpart = new RegExp("([zZ])|".concat(offset.source, "?"));
	const annotation = /\[(!)?([a-z_][a-z0-9_-]*)=([A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)\]/g;
	const zoneddatetime = new RegExp(["^".concat(datesplit.source), "(?:(?:T|\\s+)".concat(timesplit.source, "(?:").concat(offsetpart.source, ")?)?"), "(?:\\[!?(".concat(timeZoneID.source, ")\\])?"), "((?:".concat(annotation.source, ")*)$")].join(''), 'i');
	const time = new RegExp(["^T?".concat(timesplit.source), "(?:".concat(offsetpart.source, ")?"), "(?:\\[!?".concat(timeZoneID.source, "\\])?"), "((?:".concat(annotation.source, ")*)$")].join(''), 'i');

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
	const ArrayPrototypePush$4 = Array.prototype.push;
	const ArrayPrototypeSort = Array.prototype.sort;
	const IntlDateTimeFormat$2 = globalThis.Intl.DateTimeFormat;
	const IntlSupportedValuesOf = globalThis.Intl.supportedValuesOf;
	const MathAbs$1 = Math.abs;
	const MathFloor$1 = Math.floor;
	const MathMax = Math.max;
	const MathMin = Math.min;
	const MathSign = Math.sign;
	const MathTrunc = Math.trunc;
	const NumberIsFinite = Number.isFinite;
	const NumberIsNaN = Number.isNaN;
	const NumberMaxSafeInteger = Number.MAX_SAFE_INTEGER;
	const ObjectCreate$8 = Object.create;
	const ObjectDefineProperty = Object.defineProperty;
	const ObjectEntries$1 = Object.entries;
	const ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	const StringFromCharCode = String.fromCharCode;
	const StringPrototypeCharCodeAt = String.prototype.charCodeAt;
	const StringPrototypeMatchAll = String.prototype.matchAll;
	const StringPrototypeReplace = String.prototype.replace;
	const $TypeError = GetIntrinsic('%TypeError%');
	const $isEnumerable = callBound$3('Object.prototype.propertyIsEnumerable');
	const DAY_SECONDS = 86400;
	const DAY_NANOS = bigInt(DAY_SECONDS).multiply(1e9);
	const NS_MIN = bigInt(-DAY_SECONDS).multiply(1e17);
	const NS_MAX = bigInt(DAY_SECONDS).multiply(1e17);
	const YEAR_MIN = -271821;
	const YEAR_MAX = 275760;
	const BEFORE_FIRST_DST = bigInt(-388152).multiply(1e13); // 1847-01-01T00:00:00Z

	const BUILTIN_CALENDAR_IDS = ['iso8601', 'hebrew', 'islamic', 'islamic-umalqura', 'islamic-tbla', 'islamic-civil', 'islamic-rgsa', 'islamicc', 'persian', 'ethiopic', 'ethioaa', 'coptic', 'chinese', 'dangi', 'roc', 'indian', 'buddhist', 'japanese', 'gregory'];
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
	  if (!IsIntegralNumber$2(number)) throw new RangeError("unsupported fractional value ".concat(value));
	  if (number === 0) return 0; // ℝ(value) in spec text; converts -0 to 0
	  return number;
	}
	const BUILTIN_CASTS = new Map([['year', ToIntegerWithTruncation], ['month', ToPositiveIntegerWithTruncation], ['monthCode', ToString$1], ['day', ToPositiveIntegerWithTruncation], ['hour', ToIntegerWithTruncation], ['minute', ToIntegerWithTruncation], ['second', ToIntegerWithTruncation], ['millisecond', ToIntegerWithTruncation], ['microsecond', ToIntegerWithTruncation], ['nanosecond', ToIntegerWithTruncation], ['years', ToIntegerIfIntegral], ['months', ToIntegerIfIntegral], ['weeks', ToIntegerIfIntegral], ['days', ToIntegerIfIntegral], ['hours', ToIntegerIfIntegral], ['minutes', ToIntegerIfIntegral], ['seconds', ToIntegerIfIntegral], ['milliseconds', ToIntegerIfIntegral], ['microseconds', ToIntegerIfIntegral], ['nanoseconds', ToIntegerIfIntegral], ['era', ToString$1], ['eraYear', ToIntegerOrInfinity$1], ['offset', ToString$1]]);
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
	  if (Type$6(target) !== 'Object') {
	    throw new $TypeError('Assertion failed: "target" must be an Object');
	  }
	  if (!IsArray$2(excludedKeys) || !every$1(excludedKeys, IsPropertyKey$5)) {
	    throw new $TypeError('Assertion failed: "excludedKeys" must be a List of Property Keys');
	  }
	  if (typeof source === 'undefined' || source === null) {
	    return;
	  }
	  var from = ToObject$1(source);
	  var keys = OwnPropertyKeys$1(from);
	  forEach$1(keys, function (nextKey) {
	    var excluded = some$1(excludedKeys, function (e) {
	      return SameValue$1(e, nextKey) === true;
	    });
	    if (excluded) return;
	    var enumerable = $isEnumerable(from, nextKey) ||
	    // this is to handle string keys being non-enumerable in older engines
	    typeof source === 'string' && nextKey >= 0 && IsIntegralNumber$2(ToNumber$2(nextKey));
	    if (enumerable) {
	      var propValue = Get$1(from, nextKey);
	      if (excludedValues !== undefined) {
	        forEach$1(excludedValues, function (e) {
	          if (SameValue$1(e, propValue) === true) {
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
	function CanonicalizeTimeZoneOffsetString(offsetString) {
	  const offsetNs = ParseTimeZoneOffsetString(offsetString);
	  return FormatTimeZoneOffsetString(offsetNs);
	}
	function ParseTemporalTimeZone(stringIdent) {
	  const {
	    tzName,
	    offset,
	    z
	  } = ParseTemporalTimeZoneString(stringIdent);
	  if (tzName) {
	    if (IsTimeZoneOffsetString(tzName)) return CanonicalizeTimeZoneOffsetString(tzName);
	    const record = GetAvailableNamedTimeZoneIdentifier(tzName);
	    if (!record) throw new RangeError("Unrecognized time zone ".concat(tzName));
	    return record.primaryIdentifier;
	  }
	  if (z) return 'UTC';
	  // if !tzName && !z then offset must be present
	  return CanonicalizeTimeZoneOffsetString(offset);
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
	  for (const [, critical, key, value] of Call$1(StringPrototypeMatchAll, annotations, [annotation])) {
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
	  } else if (match[14] && match[15]) {
	    const offsetSign = match[14] === '-' || match[14] === '\u2212' ? '-' : '+';
	    const offsetHours = match[15] || '00';
	    const offsetMinutes = match[16] || '00';
	    const offsetSeconds = match[17] || '00';
	    let offsetFraction = match[18] || '0';
	    offset = "".concat(offsetSign).concat(offsetHours, ":").concat(offsetMinutes);
	    if (+offsetFraction) {
	      while (offsetFraction.endsWith('0')) offsetFraction = offsetFraction.slice(0, -1);
	      offset += ":".concat(offsetSeconds, ".").concat(offsetFraction);
	    } else if (+offsetSeconds) {
	      offset += ":".concat(offsetSeconds);
	    }
	    if (offset === '-00:00') offset = '+00:00';
	  }
	  const tzName = match[19];
	  const calendar = processAnnotations(match[20]);
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
	    tzName,
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
	  if (!result.tzName) throw new RangeError('Temporal.ZonedDateTime requires a time zone ID in brackets');
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
	    processAnnotations(match[14]); // ignore found calendar
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
	function ParseTemporalTimeZoneString(stringIdent) {
	  const bareID = new RegExp("^".concat(timeZoneID.source, "$"), 'i');
	  if (bareID.test(stringIdent)) return {
	    tzName: stringIdent
	  };
	  try {
	    // Try parsing ISO string instead
	    const result = ParseISODateTime(stringIdent);
	    if (result.z || result.offset || result.tzName) {
	      return result;
	    }
	  } catch {
	    // fall through
	  }
	  throw new RangeError("Invalid time zone: ".concat(stringIdent));
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
	  minutes += MathTrunc(excessNanoseconds / 6e10);
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
	function ParseTemporalInstant(isoString) {
	  let {
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
	  } = ParseTemporalInstantString(isoString);
	  if (!z && !offset) throw new RangeError('Temporal.Instant requires a time zone offset');
	  const offsetNs = z ? 0 : ParseTimeZoneOffsetString(offset);
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
	  } = BalanceISODateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond - offsetNs));
	  const epochNs = GetUTCEpochNanoseconds(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
	  if (epochNs === null) throw new RangeError('DateTime outside of supported range');
	  return epochNs;
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
	  if (Type$6(item) !== 'Object') {
	    return ParseTemporalDurationString(ToString$1(item));
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
	  if (Type$6(temporalDurationLike) !== 'Object') {
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
	  if (Type$6(digitsValue) !== 'Number') {
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
	  Call$1(ArrayPrototypePush$4, allowedSingular, extraValues);
	  let defaultVal = requiredOrDefault;
	  if (defaultVal === REQUIRED) {
	    defaultVal = undefined;
	  } else if (defaultVal !== undefined) {
	    allowedSingular.push(defaultVal);
	  }
	  const allowedValues = [];
	  Call$1(ArrayPrototypePush$4, allowedValues, allowedSingular);
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
	  const relativeTo = options.relativeTo;
	  if (relativeTo === undefined) return relativeTo;
	  let offsetBehaviour = 'option';
	  let matchMinutes = false;
	  let year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar, timeZone, offset;
	  if (Type$6(relativeTo) === 'Object') {
	    if (IsTemporalZonedDateTime(relativeTo) || IsTemporalDate(relativeTo)) return relativeTo;
	    if (IsTemporalDateTime(relativeTo)) return TemporalDateTimeToDate(relativeTo);
	    calendar = GetTemporalCalendarSlotValueWithISODefault(relativeTo);
	    const fieldNames = CalendarFields(calendar, ['day', 'hour', 'microsecond', 'millisecond', 'minute', 'month', 'monthCode', 'nanosecond', 'second', 'year']);
	    Call$1(ArrayPrototypePush$4, fieldNames, ['timeZone', 'offset']);
	    const fields = PrepareTemporalFields(relativeTo, fieldNames, []);
	    const dateOptions = ObjectCreate$8(null);
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
	    } = InterpretTemporalDateTimeFields(calendar, fields, dateOptions));
	    offset = fields.offset;
	    if (offset === undefined) offsetBehaviour = 'wall';
	    timeZone = fields.timeZone;
	    if (timeZone !== undefined) timeZone = ToTemporalTimeZoneSlotValue(timeZone);
	  } else {
	    let tzName, z;
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
	      tzName,
	      offset,
	      z
	    } = ParseISODateTime(ToString$1(relativeTo)));
	    if (tzName) {
	      timeZone = ToTemporalTimeZoneSlotValue(tzName);
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
	  if (timeZone === undefined) return CreateTemporalDate(year, month, day, calendar);
	  const offsetNs = offsetBehaviour === 'option' ? ParseTimeZoneOffsetString(offset) : 0;
	  const epochNanoseconds = InterpretISODateTimeOffset(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, offsetBehaviour, offsetNs, timeZone, 'compatible', 'reject', matchMinutes);
	  return CreateTemporalZonedDateTime(epochNanoseconds, timeZone, calendar);
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
	function PrepareTemporalFields(bag, fields, requiredFields) {
	  let {
	    emptySourceErrorMessage = 'no supported properties found'
	  } = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	  const result = ObjectCreate$8(null);
	  let any = false;
	  Call$1(ArrayPrototypeSort, fields, []);
	  for (let index = 0; index < fields.length; index++) {
	    const property = fields[index];
	    let value = bag[property];
	    if (value !== undefined) {
	      any = true;
	      if (BUILTIN_CASTS.has(property)) {
	        value = BUILTIN_CASTS.get(property)(value);
	      }
	      result[property] = value;
	    } else if (requiredFields !== 'partial') {
	      if (Call$1(ArrayIncludes$1, requiredFields, [property])) {
	        throw new TypeError("required property '".concat(property, "' missing or undefined"));
	      }
	      value = BUILTIN_DEFAULTS.get(property);
	      result[property] = value;
	    }
	  }
	  if (requiredFields === 'partial' && !any) {
	    throw new TypeError(emptySourceErrorMessage);
	  }
	  return result;
	}
	function ToTemporalTimeRecord(bag) {
	  let completeness = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'complete';
	  const fields = ['hour', 'microsecond', 'millisecond', 'minute', 'nanosecond', 'second'];
	  const partial = PrepareTemporalFields(bag, fields, 'partial', {
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
	  if (Type$6(item) === 'Object') {
	    if (IsTemporalDate(item)) return item;
	    if (IsTemporalZonedDateTime(item)) {
	      ToTemporalOverflow(options); // validate and ignore
	      item = GetPlainDateTimeFor(GetSlot(item, TIME_ZONE), GetSlot(item, INSTANT), GetSlot(item, CALENDAR));
	    }
	    if (IsTemporalDateTime(item)) {
	      ToTemporalOverflow(options); // validate and ignore
	      return CreateTemporalDate(GetSlot(item, ISO_YEAR), GetSlot(item, ISO_MONTH), GetSlot(item, ISO_DAY), GetSlot(item, CALENDAR));
	    }
	    const calendar = GetTemporalCalendarSlotValueWithISODefault(item);
	    const fieldNames = CalendarFields(calendar, ['day', 'month', 'monthCode', 'year']);
	    const fields = PrepareTemporalFields(item, fieldNames, []);
	    return CalendarDateFromFields(calendar, fields, options);
	  }
	  ToTemporalOverflow(options); // validate and ignore
	  let {
	    year,
	    month,
	    day,
	    calendar,
	    z
	  } = ParseTemporalDateString(ToString$1(item));
	  if (z) throw new RangeError('Z designator not supported for PlainDate');
	  if (!calendar) calendar = 'iso8601';
	  if (!IsBuiltinCalendar(calendar)) throw new RangeError("invalid calendar identifier ".concat(calendar));
	  calendar = ASCIILowercase(calendar);
	  return CreateTemporalDate(year, month, day, calendar);
	}
	function InterpretTemporalDateTimeFields(calendar, fields, options) {
	  let {
	    hour,
	    minute,
	    second,
	    millisecond,
	    microsecond,
	    nanosecond
	  } = ToTemporalTimeRecord(fields);
	  const overflow = ToTemporalOverflow(options);
	  const date = CalendarDateFromFields(calendar, fields, options);
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
	  if (Type$6(item) === 'Object') {
	    if (IsTemporalDateTime(item)) return item;
	    if (IsTemporalZonedDateTime(item)) {
	      ToTemporalOverflow(options); // validate and ignore
	      return GetPlainDateTimeFor(GetSlot(item, TIME_ZONE), GetSlot(item, INSTANT), GetSlot(item, CALENDAR));
	    }
	    if (IsTemporalDate(item)) {
	      ToTemporalOverflow(options); // validate and ignore
	      return CreateTemporalDateTime(GetSlot(item, ISO_YEAR), GetSlot(item, ISO_MONTH), GetSlot(item, ISO_DAY), 0, 0, 0, 0, 0, 0, GetSlot(item, CALENDAR));
	    }
	    calendar = GetTemporalCalendarSlotValueWithISODefault(item);
	    const fieldNames = CalendarFields(calendar, ['day', 'hour', 'microsecond', 'millisecond', 'minute', 'month', 'monthCode', 'nanosecond', 'second', 'year']);
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
	    } = InterpretTemporalDateTimeFields(calendar, fields, options));
	  } else {
	    ToTemporalOverflow(options); // validate and ignore
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
	    } = ParseTemporalDateTimeString(ToString$1(item)));
	    if (z) throw new RangeError('Z designator not supported for PlainDateTime');
	    RejectDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
	    if (!calendar) calendar = 'iso8601';
	    if (!IsBuiltinCalendar(calendar)) throw new RangeError("invalid calendar identifier ".concat(calendar));
	    calendar = ASCIILowercase(calendar);
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
	  if (IsTemporalInstant(item)) return item;
	  if (IsTemporalZonedDateTime(item)) {
	    const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
	    return new TemporalInstant(GetSlot(item, EPOCHNANOSECONDS));
	  }
	  const ns = ParseTemporalInstant(ToString$1(item));
	  const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
	  return new TemporalInstant(ns);
	}
	function ToTemporalMonthDay(item, options) {
	  if (Type$6(item) === 'Object') {
	    if (IsTemporalMonthDay(item)) return item;
	    let calendar, calendarAbsent;
	    if (HasSlot(item, CALENDAR)) {
	      calendar = GetSlot(item, CALENDAR);
	      calendarAbsent = false;
	    } else {
	      calendar = item.calendar;
	      calendarAbsent = calendar === undefined;
	      if (calendar === undefined) calendar = 'iso8601';
	      calendar = ToTemporalCalendarSlotValue(calendar);
	    }
	    const fieldNames = CalendarFields(calendar, ['day', 'month', 'monthCode', 'year']);
	    const fields = PrepareTemporalFields(item, fieldNames, []);
	    // Callers who omit the calendar are not writing calendar-independent
	    // code. In that case, `monthCode`/`year` can be omitted; `month` and
	    // `day` are sufficient. Add a `year` to satisfy calendar validation.
	    if (calendarAbsent && fields.month !== undefined && fields.monthCode === undefined && fields.year === undefined) {
	      fields.year = 1972;
	    }
	    return CalendarMonthDayFromFields(calendar, fields, options);
	  }
	  ToTemporalOverflow(options); // validate and ignore
	  let {
	    month,
	    day,
	    referenceISOYear,
	    calendar
	  } = ParseTemporalMonthDayString(ToString$1(item));
	  if (calendar === undefined) calendar = 'iso8601';
	  if (!IsBuiltinCalendar(calendar)) throw new RangeError("invalid calendar identifier ".concat(calendar));
	  calendar = ASCIILowercase(calendar);
	  if (referenceISOYear === undefined) {
	    RejectISODate(1972, month, day);
	    return CreateTemporalMonthDay(month, day, calendar);
	  }
	  const result = CreateTemporalMonthDay(month, day, calendar, referenceISOYear);
	  return CalendarMonthDayFromFields(calendar, result);
	}
	function ToTemporalTime(item) {
	  let overflow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'constrain';
	  let hour, minute, second, millisecond, microsecond, nanosecond;
	  if (Type$6(item) === 'Object') {
	    if (IsTemporalTime(item)) return item;
	    if (IsTemporalZonedDateTime(item)) {
	      item = GetPlainDateTimeFor(GetSlot(item, TIME_ZONE), GetSlot(item, INSTANT), GetSlot(item, CALENDAR));
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
	    } = ParseTemporalTimeString(ToString$1(item)));
	    RejectTime(hour, minute, second, millisecond, microsecond, nanosecond);
	  }
	  const TemporalPlainTime = GetIntrinsic('%Temporal.PlainTime%');
	  return new TemporalPlainTime(hour, minute, second, millisecond, microsecond, nanosecond);
	}
	function ToTemporalYearMonth(item, options) {
	  if (Type$6(item) === 'Object') {
	    if (IsTemporalYearMonth(item)) return item;
	    const calendar = GetTemporalCalendarSlotValueWithISODefault(item);
	    const fieldNames = CalendarFields(calendar, ['month', 'monthCode', 'year']);
	    const fields = PrepareTemporalFields(item, fieldNames, []);
	    return CalendarYearMonthFromFields(calendar, fields, options);
	  }
	  ToTemporalOverflow(options); // validate and ignore
	  let {
	    year,
	    month,
	    referenceISODay,
	    calendar
	  } = ParseTemporalYearMonthString(ToString$1(item));
	  if (calendar === undefined) calendar = 'iso8601';
	  if (!IsBuiltinCalendar(calendar)) throw new RangeError("invalid calendar identifier ".concat(calendar));
	  calendar = ASCIILowercase(calendar);
	  if (referenceISODay === undefined) {
	    RejectISODate(year, month, 1);
	    return CreateTemporalYearMonth(year, month, calendar);
	  }
	  const result = CreateTemporalYearMonth(year, month, calendar, referenceISODay);
	  return CalendarYearMonthFromFields(calendar, result);
	}
	function InterpretISODateTimeOffset(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, offsetBehaviour, offsetNs, timeZone, disambiguation, offsetOpt, matchMinute) {
	  const DateTime = GetIntrinsic('%Temporal.PlainDateTime%');
	  const dt = new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
	  if (offsetBehaviour === 'wall' || offsetOpt === 'ignore') {
	    // Simple case: ISO string without a TZ offset (or caller wants to ignore
	    // the offset), so just convert DateTime to Instant in the given time zone
	    const instant = GetInstantFor(timeZone, dt, disambiguation);
	    return GetSlot(instant, EPOCHNANOSECONDS);
	  }

	  // The caller wants the offset to always win ('use') OR the caller is OK
	  // with the offset winning ('prefer' or 'reject') as long as it's valid
	  // for this timezone and date/time.
	  if (offsetBehaviour === 'exact' || offsetOpt === 'use') {
	    // Calculate the instant for the input's date/time and offset
	    const epochNs = GetUTCEpochNanoseconds(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
	    if (epochNs === null) throw new RangeError('ZonedDateTime outside of supported range');
	    return epochNs.minus(offsetNs);
	  }

	  // "prefer" or "reject"
	  const possibleInstants = GetPossibleInstantsFor(timeZone, dt);
	  for (let index = 0; index < possibleInstants.length; index++) {
	    const candidate = possibleInstants[index];
	    const candidateOffset = GetOffsetNanosecondsFor(timeZone, candidate);
	    const roundedCandidateOffset = RoundNumberToIncrement(bigInt(candidateOffset), 60e9, 'halfExpand').toJSNumber();
	    if (candidateOffset === offsetNs || matchMinute && roundedCandidateOffset === offsetNs) {
	      return GetSlot(candidate, EPOCHNANOSECONDS);
	    }
	  }

	  // the user-provided offset doesn't match any instants for this time
	  // zone and date/time.
	  if (offsetOpt === 'reject') {
	    const offsetStr = FormatTimeZoneOffsetString(offsetNs);
	    const timeZoneString = IsTemporalTimeZone(timeZone) ? GetSlot(timeZone, TIMEZONE_ID) : 'time zone';
	    throw new RangeError("Offset ".concat(offsetStr, " is invalid for ").concat(dt, " in ").concat(timeZoneString));
	  }
	  // fall through: offsetOpt === 'prefer', but the offset doesn't match
	  // so fall back to use the time zone instead.
	  const instant = DisambiguatePossibleInstants(possibleInstants, timeZone, dt, disambiguation);
	  return GetSlot(instant, EPOCHNANOSECONDS);
	}
	function ToTemporalZonedDateTime(item, options) {
	  let year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, timeZone, offset, calendar;
	  let disambiguation, offsetOpt;
	  let matchMinute = false;
	  let offsetBehaviour = 'option';
	  if (Type$6(item) === 'Object') {
	    if (IsTemporalZonedDateTime(item)) return item;
	    calendar = GetTemporalCalendarSlotValueWithISODefault(item);
	    const fieldNames = CalendarFields(calendar, ['day', 'hour', 'microsecond', 'millisecond', 'minute', 'month', 'monthCode', 'nanosecond', 'second', 'year']);
	    Call$1(ArrayPrototypePush$4, fieldNames, ['timeZone', 'offset']);
	    const fields = PrepareTemporalFields(item, fieldNames, ['timeZone']);
	    timeZone = ToTemporalTimeZoneSlotValue(fields.timeZone);
	    offset = fields.offset;
	    if (offset === undefined) {
	      offsetBehaviour = 'wall';
	    }
	    disambiguation = ToTemporalDisambiguation(options);
	    offsetOpt = ToTemporalOffset(options, 'reject');
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
	    } = InterpretTemporalDateTimeFields(calendar, fields, options));
	  } else {
	    let tzName, z;
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
	      tzName,
	      offset,
	      z,
	      calendar
	    } = ParseTemporalZonedDateTimeString(ToString$1(item)));
	    timeZone = ToTemporalTimeZoneSlotValue(tzName);
	    if (z) {
	      offsetBehaviour = 'exact';
	    } else if (!offset) {
	      offsetBehaviour = 'wall';
	    }
	    if (!calendar) calendar = 'iso8601';
	    if (!IsBuiltinCalendar(calendar)) throw new RangeError("invalid calendar identifier ".concat(calendar));
	    calendar = ASCIILowercase(calendar);
	    matchMinute = true; // ISO strings may specify offset with less precision
	    disambiguation = ToTemporalDisambiguation(options);
	    offsetOpt = ToTemporalOffset(options, 'reject');
	    ToTemporalOverflow(options); // validate and ignore
	  }

	  let offsetNs = 0;
	  if (offsetBehaviour === 'option') offsetNs = ParseTimeZoneOffsetString(offset);
	  const epochNanoseconds = InterpretISODateTimeOffset(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, offsetBehaviour, offsetNs, timeZone, disambiguation, offsetOpt, matchMinute);
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
	    ObjectDefineProperty(result, '_repr_', {
	      value: "".concat(result[Symbol.toStringTag], " <").concat(TemporalDateToString(result), ">"),
	      writable: false,
	      enumerable: false,
	      configurable: false
	    });
	  }
	}
	function CreateTemporalDate(isoYear, isoMonth, isoDay) {
	  let calendar = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'iso8601';
	  const TemporalPlainDate = GetIntrinsic('%Temporal.PlainDate%');
	  const result = ObjectCreate$8(TemporalPlainDate.prototype);
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
	    Object.defineProperty(result, '_repr_', {
	      value: "".concat(result[Symbol.toStringTag], " <").concat(TemporalDateTimeToString(result, 'auto'), ">"),
	      writable: false,
	      enumerable: false,
	      configurable: false
	    });
	  }
	}
	function CreateTemporalDateTime(isoYear, isoMonth, isoDay, h, min, s, ms, µs, ns) {
	  let calendar = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : 'iso8601';
	  const TemporalPlainDateTime = GetIntrinsic('%Temporal.PlainDateTime%');
	  const result = ObjectCreate$8(TemporalPlainDateTime.prototype);
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
	    Object.defineProperty(result, '_repr_', {
	      value: "".concat(result[Symbol.toStringTag], " <").concat(TemporalMonthDayToString(result), ">"),
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
	  const result = ObjectCreate$8(TemporalPlainMonthDay.prototype);
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
	    Object.defineProperty(result, '_repr_', {
	      value: "".concat(result[Symbol.toStringTag], " <").concat(TemporalYearMonthToString(result), ">"),
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
	  const result = ObjectCreate$8(TemporalPlainYearMonth.prototype);
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
	    Object.defineProperty(result, '_repr_', {
	      value: "".concat(result[Symbol.toStringTag], " <").concat(TemporalZonedDateTimeToString(result, 'auto'), ">"),
	      writable: false,
	      enumerable: false,
	      configurable: false
	    });
	  }
	}
	function CreateTemporalZonedDateTime(epochNanoseconds, timeZone) {
	  let calendar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'iso8601';
	  const TemporalZonedDateTime = GetIntrinsic('%Temporal.ZonedDateTime%');
	  const result = ObjectCreate$8(TemporalZonedDateTime.prototype);
	  CreateTemporalZonedDateTimeSlots(result, epochNanoseconds, timeZone, calendar);
	  return result;
	}
	function CalendarFields(calendar, fieldNames) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$1(GetIntrinsic('%Temporal.Calendar.prototype.fields%'), calendar, [fieldNames]);
	  }
	  const fields = GetMethod$2(calendar, 'fields');
	  fieldNames = Call$1(fields, calendar, [fieldNames]);
	  const result = [];
	  for (const name of fieldNames) {
	    if (Type$6(name) !== 'String') throw new TypeError('bad return from calendar.fields()');
	    Call$1(ArrayPrototypePush$4, result, [name]);
	  }
	  return result;
	}
	function CalendarMergeFields(calendar, fields, additionalFields) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$1(GetIntrinsic('%Temporal.Calendar.prototype.mergeFields%'), calendar, [fields, additionalFields]);
	  }
	  const mergeFields = GetMethod$2(calendar, 'mergeFields');
	  const result = Call$1(mergeFields, calendar, [fields, additionalFields]);
	  if (Type$6(result) !== 'Object') throw new TypeError('bad return from calendar.mergeFields()');
	  return result;
	}
	function CalendarDateAdd(calendar, date, duration, options, dateAdd) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$1(GetIntrinsic('%Temporal.Calendar.prototype.dateAdd%'), calendar, [date, duration, options]);
	  }
	  if (dateAdd === undefined) {
	    dateAdd = GetMethod$2(calendar, 'dateAdd');
	  }
	  const result = Call$1(dateAdd, calendar, [date, duration, options]);
	  if (!IsTemporalDate(result)) throw new TypeError('invalid result');
	  return result;
	}
	function CalendarDateUntil(calendar, date, otherDate, options, dateUntil) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$1(GetIntrinsic('%Temporal.Calendar.prototype.dateUntil%'), calendar, [date, otherDate, options]);
	  }
	  if (dateUntil === undefined) {
	    dateUntil = GetMethod$2(calendar, 'dateUntil');
	  }
	  const result = Call$1(dateUntil, calendar, [date, otherDate, options]);
	  if (!IsTemporalDuration(result)) throw new TypeError('invalid result');
	  return result;
	}
	function CalendarYear(calendar, dateLike) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$1(GetIntrinsic('%Temporal.Calendar.prototype.year%'), calendar, [dateLike]);
	  }
	  const year = GetMethod$2(calendar, 'year');
	  const result = Call$1(year, calendar, [dateLike]);
	  if (typeof result !== 'number') {
	    throw new TypeError('calendar year result must be an integer');
	  }
	  if (!IsIntegralNumber$2(result)) {
	    throw new RangeError('calendar year result must be an integer');
	  }
	  return result;
	}
	function CalendarMonth(calendar, dateLike) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$1(GetIntrinsic('%Temporal.Calendar.prototype.month%'), calendar, [dateLike]);
	  }
	  const month = GetMethod$2(calendar, 'month');
	  const result = Call$1(month, calendar, [dateLike]);
	  if (typeof result !== 'number') {
	    throw new TypeError('calendar month result must be a positive integer');
	  }
	  if (!IsIntegralNumber$2(result) || result < 1) {
	    throw new RangeError('calendar month result must be a positive integer');
	  }
	  return result;
	}
	function CalendarMonthCode(calendar, dateLike) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$1(GetIntrinsic('%Temporal.Calendar.prototype.monthCode%'), calendar, [dateLike]);
	  }
	  const monthCode = GetMethod$2(calendar, 'monthCode');
	  const result = Call$1(monthCode, calendar, [dateLike]);
	  if (typeof result !== 'string') {
	    throw new TypeError('calendar monthCode result must be a string');
	  }
	  return result;
	}
	function CalendarDay(calendar, dateLike) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$1(GetIntrinsic('%Temporal.Calendar.prototype.day%'), calendar, [dateLike]);
	  }
	  const day = GetMethod$2(calendar, 'day');
	  const result = Call$1(day, calendar, [dateLike]);
	  if (typeof result !== 'number') {
	    throw new TypeError('calendar day result must be a positive integer');
	  }
	  if (!IsIntegralNumber$2(result) || result < 1) {
	    throw new RangeError('calendar day result must be a positive integer');
	  }
	  return result;
	}
	function CalendarEra(calendar, dateLike) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$1(GetIntrinsic('%Temporal.Calendar.prototype.era%'), calendar, [dateLike]);
	  }
	  const era = GetMethod$2(calendar, 'era');
	  let result = Call$1(era, calendar, [dateLike]);
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
	    return Call$1(GetIntrinsic('%Temporal.Calendar.prototype.eraYear%'), calendar, [dateLike]);
	  }
	  const eraYear = GetMethod$2(calendar, 'eraYear');
	  let result = Call$1(eraYear, calendar, [dateLike]);
	  if (result === undefined) {
	    return result;
	  }
	  if (typeof result !== 'number') {
	    throw new TypeError('calendar eraYear result must be an integer or undefined');
	  }
	  if (!IsIntegralNumber$2(result)) {
	    throw new RangeError('calendar eraYear result must be an integer or undefined');
	  }
	  return result;
	}
	function CalendarDayOfWeek(calendar, dateLike) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$1(GetIntrinsic('%Temporal.Calendar.prototype.dayOfWeek%'), calendar, [dateLike]);
	  }
	  const dayOfWeek = GetMethod$2(calendar, 'dayOfWeek');
	  const result = Call$1(dayOfWeek, calendar, [dateLike]);
	  if (typeof result !== 'number') {
	    throw new TypeError('calendar dayOfWeek result must be a positive integer');
	  }
	  if (!IsIntegralNumber$2(result) || result < 1) {
	    throw new RangeError('calendar dayOfWeek result must be a positive integer');
	  }
	  return result;
	}
	function CalendarDayOfYear(calendar, dateLike) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$1(GetIntrinsic('%Temporal.Calendar.prototype.dayOfYear%'), calendar, [dateLike]);
	  }
	  const dayOfYear = GetMethod$2(calendar, 'dayOfYear');
	  const result = Call$1(dayOfYear, calendar, [dateLike]);
	  if (typeof result !== 'number') {
	    throw new TypeError('calendar dayOfYear result must be a positive integer');
	  }
	  if (!IsIntegralNumber$2(result) || result < 1) {
	    throw new RangeError('calendar dayOfYear result must be a positive integer');
	  }
	  return result;
	}
	function CalendarWeekOfYear(calendar, dateLike) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$1(GetIntrinsic('%Temporal.Calendar.prototype.weekOfYear%'), calendar, [dateLike]);
	  }
	  const weekOfYear = GetMethod$2(calendar, 'weekOfYear');
	  const result = Call$1(weekOfYear, calendar, [dateLike]);
	  if (typeof result !== 'number') {
	    throw new TypeError('calendar weekOfYear result must be a positive integer');
	  }
	  if (!IsIntegralNumber$2(result) || result < 1) {
	    throw new RangeError('calendar weekOfYear result must be a positive integer');
	  }
	  return result;
	}
	function CalendarYearOfWeek(calendar, dateLike) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$1(GetIntrinsic('%Temporal.Calendar.prototype.yearOfWeek%'), calendar, [dateLike]);
	  }
	  const yearOfWeek = GetMethod$2(calendar, 'yearOfWeek');
	  const result = Call$1(yearOfWeek, calendar, [dateLike]);
	  if (typeof result !== 'number') {
	    throw new TypeError('calendar yearOfWeek result must be an integer');
	  }
	  if (!IsIntegralNumber$2(result)) {
	    throw new RangeError('calendar yearOfWeek result must be an integer');
	  }
	  return result;
	}
	function CalendarDaysInWeek(calendar, dateLike) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$1(GetIntrinsic('%Temporal.Calendar.prototype.daysInWeek%'), calendar, [dateLike]);
	  }
	  const daysInWeek = GetMethod$2(calendar, 'daysInWeek');
	  const result = Call$1(daysInWeek, calendar, [dateLike]);
	  if (typeof result !== 'number') {
	    throw new TypeError('calendar daysInWeek result must be a positive integer');
	  }
	  if (!IsIntegralNumber$2(result) || result < 1) {
	    throw new RangeError('calendar daysInWeek result must be a positive integer');
	  }
	  return result;
	}
	function CalendarDaysInMonth(calendar, dateLike) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$1(GetIntrinsic('%Temporal.Calendar.prototype.daysInMonth%'), calendar, [dateLike]);
	  }
	  const daysInMonth = GetMethod$2(calendar, 'daysInMonth');
	  const result = Call$1(daysInMonth, calendar, [dateLike]);
	  if (typeof result !== 'number') {
	    throw new TypeError('calendar daysInMonth result must be a positive integer');
	  }
	  if (!IsIntegralNumber$2(result) || result < 1) {
	    throw new RangeError('calendar daysInMonth result must be a positive integer');
	  }
	  return result;
	}
	function CalendarDaysInYear(calendar, dateLike) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$1(GetIntrinsic('%Temporal.Calendar.prototype.daysInYear%'), calendar, [dateLike]);
	  }
	  const daysInYear = GetMethod$2(calendar, 'daysInYear');
	  const result = Call$1(daysInYear, calendar, [dateLike]);
	  if (typeof result !== 'number') {
	    throw new TypeError('calendar daysInYear result must be a positive integer');
	  }
	  if (!IsIntegralNumber$2(result) || result < 1) {
	    throw new RangeError('calendar daysInYear result must be a positive integer');
	  }
	  return result;
	}
	function CalendarMonthsInYear(calendar, dateLike) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$1(GetIntrinsic('%Temporal.Calendar.prototype.monthsInYear%'), calendar, [dateLike]);
	  }
	  const monthsInYear = GetMethod$2(calendar, 'monthsInYear');
	  const result = Call$1(monthsInYear, calendar, [dateLike]);
	  if (typeof result !== 'number') {
	    throw new TypeError('calendar monthsInYear result must be a positive integer');
	  }
	  if (!IsIntegralNumber$2(result) || result < 1) {
	    throw new RangeError('calendar monthsInYear result must be a positive integer');
	  }
	  return result;
	}
	function CalendarInLeapYear(calendar, dateLike) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$1(GetIntrinsic('%Temporal.Calendar.prototype.inLeapYear%'), calendar, [dateLike]);
	  }
	  const inLeapYear = GetMethod$2(calendar, 'inLeapYear');
	  const result = Call$1(inLeapYear, calendar, [dateLike]);
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
	  if (Type$6(calendarLike) === 'Object') {
	    if (HasSlot(calendarLike, CALENDAR)) return GetSlot(calendarLike, CALENDAR);
	    if (!ObjectImplementsTemporalCalendarProtocol(calendarLike)) {
	      throw new TypeError('expected a Temporal.Calendar or object implementing the Temporal.Calendar protocol');
	    }
	    return calendarLike;
	  }
	  const identifier = ToString$1(calendarLike);
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
	  if (Type$6(slotValue) === 'Object') return slotValue;
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
	function CalendarDateFromFields(calendar, fields, options, dateFromFields) {
	  var _dateFromFields;
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$1(GetIntrinsic('%Temporal.Calendar.prototype.dateFromFields%'), calendar, [fields, options]);
	  }
	  (_dateFromFields = dateFromFields) !== null && _dateFromFields !== void 0 ? _dateFromFields : dateFromFields = GetMethod$2(calendar, 'dateFromFields');
	  const result = Call$1(dateFromFields, calendar, [fields, options]);
	  if (!IsTemporalDate(result)) throw new TypeError('invalid result');
	  return result;
	}
	function CalendarYearMonthFromFields(calendar, fields, options) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$1(GetIntrinsic('%Temporal.Calendar.prototype.yearMonthFromFields%'), calendar, [fields, options]);
	  }
	  const yearMonthFromFields = GetMethod$2(calendar, 'yearMonthFromFields');
	  const result = Call$1(yearMonthFromFields, calendar, [fields, options]);
	  if (!IsTemporalYearMonth(result)) throw new TypeError('invalid result');
	  return result;
	}
	function CalendarMonthDayFromFields(calendar, fields, options) {
	  if (typeof calendar === 'string') {
	    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
	    calendar = new TemporalCalendar(calendar);
	    return Call$1(GetIntrinsic('%Temporal.Calendar.prototype.monthDayFromFields%'), calendar, [fields, options]);
	  }
	  const monthDayFromFields = GetMethod$2(calendar, 'monthDayFromFields');
	  const result = Call$1(monthDayFromFields, calendar, [fields, options]);
	  if (!IsTemporalMonthDay(result)) throw new TypeError('invalid result');
	  return result;
	}
	function ObjectImplementsTemporalTimeZoneProtocol(object) {
	  if (IsTemporalTimeZone(object)) return true;
	  return 'getOffsetNanosecondsFor' in object && 'getPossibleInstantsFor' in object && 'id' in object;
	}
	function ToTemporalTimeZoneSlotValue(temporalTimeZoneLike) {
	  if (Type$6(temporalTimeZoneLike) === 'Object') {
	    if (IsTemporalZonedDateTime(temporalTimeZoneLike)) return GetSlot(temporalTimeZoneLike, TIME_ZONE);
	    if (!ObjectImplementsTemporalTimeZoneProtocol(temporalTimeZoneLike)) {
	      throw new TypeError('expected a Temporal.TimeZone or object implementing the Temporal.TimeZone protocol');
	    }
	    return temporalTimeZoneLike;
	  }
	  const identifier = ToString$1(temporalTimeZoneLike);
	  return ParseTemporalTimeZone(identifier);
	}
	function ToTemporalTimeZoneIdentifier(slotValue) {
	  if (typeof slotValue === 'string') return slotValue;
	  const result = slotValue.id;
	  if (typeof result !== 'string') throw new TypeError('timeZone.id should be a string');
	  return result;
	}
	function ToTemporalTimeZoneObject(slotValue) {
	  if (Type$6(slotValue) === 'Object') return slotValue;
	  const TemporalTimeZone = GetIntrinsic('%Temporal.TimeZone%');
	  return new TemporalTimeZone(slotValue);
	}
	function TimeZoneEquals(one, two) {
	  if (one === two) return true;
	  const tz1 = ToTemporalTimeZoneIdentifier(one);
	  const tz2 = ToTemporalTimeZoneIdentifier(two);
	  return tz1 === tz2;
	}
	function TemporalDateTimeToDate(dateTime) {
	  return CreateTemporalDate(GetSlot(dateTime, ISO_YEAR), GetSlot(dateTime, ISO_MONTH), GetSlot(dateTime, ISO_DAY), GetSlot(dateTime, CALENDAR));
	}
	function TemporalDateTimeToTime(dateTime) {
	  const Time = GetIntrinsic('%Temporal.PlainTime%');
	  return new Time(GetSlot(dateTime, ISO_HOUR), GetSlot(dateTime, ISO_MINUTE), GetSlot(dateTime, ISO_SECOND), GetSlot(dateTime, ISO_MILLISECOND), GetSlot(dateTime, ISO_MICROSECOND), GetSlot(dateTime, ISO_NANOSECOND));
	}
	function GetOffsetNanosecondsFor(timeZone, instant, getOffsetNanosecondsFor) {
	  var _getOffsetNanoseconds;
	  if (typeof timeZone === 'string') {
	    const TemporalTimeZone = GetIntrinsic('%Temporal.TimeZone%');
	    timeZone = new TemporalTimeZone(timeZone);
	    return Call$1(GetIntrinsic('%Temporal.TimeZone.prototype.getOffsetNanosecondsFor%'), timeZone, [instant]);
	  }
	  (_getOffsetNanoseconds = getOffsetNanosecondsFor) !== null && _getOffsetNanoseconds !== void 0 ? _getOffsetNanoseconds : getOffsetNanosecondsFor = GetMethod$2(timeZone, 'getOffsetNanosecondsFor');
	  const offsetNs = Call$1(getOffsetNanosecondsFor, timeZone, [instant]);
	  if (typeof offsetNs !== 'number') {
	    throw new TypeError('bad return from getOffsetNanosecondsFor');
	  }
	  if (!IsIntegralNumber$2(offsetNs) || MathAbs$1(offsetNs) >= 86400e9) {
	    throw new RangeError('out-of-range return from getOffsetNanosecondsFor');
	  }
	  return offsetNs;
	}
	function GetOffsetStringFor(timeZone, instant) {
	  const offsetNs = GetOffsetNanosecondsFor(timeZone, instant);
	  return FormatTimeZoneOffsetString(offsetNs);
	}
	function GetPlainDateTimeFor(timeZone, instant, calendar) {
	  const ns = GetSlot(instant, EPOCHNANOSECONDS);
	  const offsetNs = GetOffsetNanosecondsFor(timeZone, instant);
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
	function GetInstantFor(timeZone, dateTime, disambiguation) {
	  const possibleInstants = GetPossibleInstantsFor(timeZone, dateTime);
	  return DisambiguatePossibleInstants(possibleInstants, timeZone, dateTime, disambiguation);
	}
	function DisambiguatePossibleInstants(possibleInstants, timeZone, dateTime, disambiguation) {
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
	  if (utcns === null) throw new RangeError('DateTime outside of supported range');
	  const dayBefore = new Instant(utcns.minus(86400e9));
	  const dayAfter = new Instant(utcns.plus(86400e9));
	  const offsetBefore = GetOffsetNanosecondsFor(timeZone, dayBefore);
	  const offsetAfter = GetOffsetNanosecondsFor(timeZone, dayAfter);
	  const nanoseconds = offsetAfter - offsetBefore;
	  switch (disambiguation) {
	    case 'earlier':
	      {
	        const calendar = GetSlot(dateTime, CALENDAR);
	        const PlainDateTime = GetIntrinsic('%Temporal.PlainDateTime%');
	        const earlier = AddDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar, 0, 0, 0, 0, 0, 0, 0, 0, 0, -nanoseconds, undefined);
	        const earlierPlainDateTime = new PlainDateTime(earlier.year, earlier.month, earlier.day, earlier.hour, earlier.minute, earlier.second, earlier.millisecond, earlier.microsecond, earlier.nanosecond, calendar);
	        return GetPossibleInstantsFor(timeZone, earlierPlainDateTime)[0];
	      }
	    case 'compatible':
	    // fall through because 'compatible' means 'later' for "spring forward" transitions
	    case 'later':
	      {
	        const calendar = GetSlot(dateTime, CALENDAR);
	        const PlainDateTime = GetIntrinsic('%Temporal.PlainDateTime%');
	        const later = AddDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar, 0, 0, 0, 0, 0, 0, 0, 0, 0, nanoseconds, undefined);
	        const laterPlainDateTime = new PlainDateTime(later.year, later.month, later.day, later.hour, later.minute, later.second, later.millisecond, later.microsecond, later.nanosecond, calendar);
	        const possible = GetPossibleInstantsFor(timeZone, laterPlainDateTime);
	        return possible[possible.length - 1];
	      }
	    case 'reject':
	      {
	        throw new RangeError('no such instant found');
	      }
	  }
	  throw new Error("assertion failed: invalid disambiguation value ".concat(disambiguation));
	}
	function GetPossibleInstantsFor(timeZone, dateTime) {
	  var _getPossibleInstantsF;
	  let getPossibleInstantsFor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
	  if (typeof timeZone === 'string') {
	    const TemporalTimeZone = GetIntrinsic('%Temporal.TimeZone%');
	    timeZone = new TemporalTimeZone(timeZone);
	    return Call$1(GetIntrinsic('%Temporal.TimeZone.prototype.getPossibleInstantsFor%'), timeZone, [dateTime]);
	  }
	  (_getPossibleInstantsF = getPossibleInstantsFor) !== null && _getPossibleInstantsF !== void 0 ? _getPossibleInstantsF : getPossibleInstantsFor = GetMethod$2(timeZone, 'getPossibleInstantsFor');
	  const possibleInstants = Call$1(getPossibleInstantsFor, timeZone, [dateTime]);
	  const result = [];
	  for (const instant of possibleInstants) {
	    if (!IsTemporalInstant(instant)) {
	      throw new TypeError('bad return from getPossibleInstantsFor');
	    }
	    Call$1(ArrayPrototypePush$4, result, [instant]);
	  }
	  return result;
	}
	function ISOYearString(year) {
	  let yearString;
	  if (year < 0 || year > 9999) {
	    let sign = year < 0 ? '-' : '+';
	    let yearNumber = MathAbs$1(year);
	    yearString = sign + "000000".concat(yearNumber).slice(-6);
	  } else {
	    yearString = "0000".concat(year).slice(-4);
	  }
	  return yearString;
	}
	function ISODateTimePartString(part) {
	  return "00".concat(part).slice(-2);
	}
	function FormatSecondsStringPart(second, millisecond, microsecond, nanosecond, precision) {
	  if (precision === 'minute') return '';
	  const secs = ":".concat(ISODateTimePartString(second));
	  let fraction = millisecond * 1e6 + microsecond * 1e3 + nanosecond;
	  if (precision === 'auto') {
	    if (fraction === 0) return secs;
	    fraction = "".concat(fraction).padStart(9, '0');
	    while (fraction[fraction.length - 1] === '0') fraction = fraction.slice(0, -1);
	  } else {
	    if (precision === 0) return secs;
	    fraction = "".concat(fraction).padStart(9, '0').slice(0, precision);
	  }
	  return "".concat(secs, ".").concat(fraction);
	}
	function TemporalInstantToString(instant, timeZone, precision) {
	  let outputTimeZone = timeZone;
	  if (outputTimeZone === undefined) outputTimeZone = 'UTC';
	  const dateTime = GetPlainDateTimeFor(outputTimeZone, instant, 'iso8601');
	  const year = ISOYearString(GetSlot(dateTime, ISO_YEAR));
	  const month = ISODateTimePartString(GetSlot(dateTime, ISO_MONTH));
	  const day = ISODateTimePartString(GetSlot(dateTime, ISO_DAY));
	  const hour = ISODateTimePartString(GetSlot(dateTime, ISO_HOUR));
	  const minute = ISODateTimePartString(GetSlot(dateTime, ISO_MINUTE));
	  const seconds = FormatSecondsStringPart(GetSlot(dateTime, ISO_SECOND), GetSlot(dateTime, ISO_MILLISECOND), GetSlot(dateTime, ISO_MICROSECOND), GetSlot(dateTime, ISO_NANOSECOND), precision);
	  let timeZoneString = 'Z';
	  if (timeZone !== undefined) {
	    const offsetNs = GetOffsetNanosecondsFor(outputTimeZone, instant);
	    timeZoneString = FormatISOTimeZoneOffsetString(offsetNs);
	  }
	  return "".concat(year, "-").concat(month, "-").concat(day, "T").concat(hour, ":").concat(minute).concat(seconds).concat(timeZoneString);
	}
	function formatAsDecimalNumber(num) {
	  if (num <= NumberMaxSafeInteger) return num.toString(10);
	  return bigInt(num).toString();
	}
	function TemporalDurationToString(years, months, weeks, days, hours, minutes, seconds, ms, µs, ns) {
	  let precision = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : 'auto';
	  const sign = DurationSign(years, months, weeks, days, hours, minutes, seconds, ms, µs, ns);
	  let total = TotalDurationNanoseconds(0, 0, 0, seconds, ms, µs, ns, 0);
	  ({
	    quotient: total,
	    remainder: ns
	  } = total.divmod(1000));
	  ({
	    quotient: total,
	    remainder: µs
	  } = total.divmod(1000));
	  ({
	    quotient: seconds,
	    remainder: ms
	  } = total.divmod(1000));
	  let datePart = '';
	  if (years !== 0) datePart += "".concat(formatAsDecimalNumber(MathAbs$1(years)), "Y");
	  if (months !== 0) datePart += "".concat(formatAsDecimalNumber(MathAbs$1(months)), "M");
	  if (weeks !== 0) datePart += "".concat(formatAsDecimalNumber(MathAbs$1(weeks)), "W");
	  if (days !== 0) datePart += "".concat(formatAsDecimalNumber(MathAbs$1(days)), "D");
	  let timePart = '';
	  if (hours !== 0) timePart += "".concat(formatAsDecimalNumber(MathAbs$1(hours)), "H");
	  if (minutes !== 0) timePart += "".concat(formatAsDecimalNumber(MathAbs$1(minutes)), "M");
	  if (!seconds.isZero() || !ms.isZero() || !µs.isZero() || !ns.isZero() || years === 0 && months === 0 && weeks === 0 && days === 0 && hours === 0 && minutes === 0 || precision !== 'auto') {
	    const fraction = MathAbs$1(ms.toJSNumber()) * 1e6 + MathAbs$1(µs.toJSNumber()) * 1e3 + MathAbs$1(ns.toJSNumber());
	    let decimalPart = ToZeroPaddedDecimalString$1(fraction, 9);
	    if (precision === 'auto') {
	      while (decimalPart[decimalPart.length - 1] === '0') {
	        decimalPart = decimalPart.slice(0, -1);
	      }
	    } else if (precision === 0) {
	      decimalPart = '';
	    } else {
	      decimalPart = decimalPart.slice(0, precision);
	    }
	    let secondsPart = seconds.abs().toString();
	    if (decimalPart) secondsPart += ".".concat(decimalPart);
	    timePart += "".concat(secondsPart, "S");
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
	  year = ISOYearString(year);
	  month = ISODateTimePartString(month);
	  day = ISODateTimePartString(day);
	  hour = ISODateTimePartString(hour);
	  minute = ISODateTimePartString(minute);
	  const seconds = FormatSecondsStringPart(second, millisecond, microsecond, nanosecond, precision);
	  const calendar = MaybeFormatCalendarAnnotation(GetSlot(dateTime, CALENDAR), showCalendar);
	  return "".concat(year, "-").concat(month, "-").concat(day, "T").concat(hour, ":").concat(minute).concat(seconds).concat(calendar);
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
	  const dateTime = GetPlainDateTimeFor(tz, instant, 'iso8601');
	  const year = ISOYearString(GetSlot(dateTime, ISO_YEAR));
	  const month = ISODateTimePartString(GetSlot(dateTime, ISO_MONTH));
	  const day = ISODateTimePartString(GetSlot(dateTime, ISO_DAY));
	  const hour = ISODateTimePartString(GetSlot(dateTime, ISO_HOUR));
	  const minute = ISODateTimePartString(GetSlot(dateTime, ISO_MINUTE));
	  const seconds = FormatSecondsStringPart(GetSlot(dateTime, ISO_SECOND), GetSlot(dateTime, ISO_MILLISECOND), GetSlot(dateTime, ISO_MICROSECOND), GetSlot(dateTime, ISO_NANOSECOND), precision);
	  let result = "".concat(year, "-").concat(month, "-").concat(day, "T").concat(hour, ":").concat(minute).concat(seconds);
	  if (showOffset !== 'never') {
	    const offsetNs = GetOffsetNanosecondsFor(tz, instant);
	    result += FormatISOTimeZoneOffsetString(offsetNs);
	  }
	  if (showTimeZone !== 'never') {
	    const identifier = ToTemporalTimeZoneIdentifier(tz);
	    const flag = showTimeZone === 'critical' ? '!' : '';
	    result += "[".concat(flag).concat(identifier, "]");
	  }
	  result += MaybeFormatCalendarAnnotation(GetSlot(zdt, CALENDAR), showCalendar);
	  return result;
	}
	function IsTimeZoneOffsetString(string) {
	  return OFFSET.test(string);
	}
	function ParseTimeZoneOffsetString(string) {
	  const match = OFFSET.exec(string);
	  if (!match) {
	    throw new RangeError("invalid time zone offset: ".concat(string));
	  }
	  const sign = match[1] === '-' || match[1] === '\u2212' ? -1 : +1;
	  const hours = +match[2];
	  const minutes = +(match[3] || 0);
	  const seconds = +(match[4] || 0);
	  const nanoseconds = +((match[5] || 0) + '000000000').slice(0, 9);
	  return sign * (((hours * 60 + minutes) * 60 + seconds) * 1e9 + nanoseconds);
	}
	let canonicalTimeZoneIdsCache = undefined;
	function GetAvailableNamedTimeZoneIdentifier(identifier) {
	  var _canonicalTimeZoneIds, _specialCases$segment, _specialCases$segment2;
	  // The most common case is when the identifier is a canonical time zone ID.
	  // Fast-path that case by caching all canonical IDs. For old ECMAScript
	  // implementations lacking this API, set the cache to `null` to avoid retries.
	  if (canonicalTimeZoneIdsCache === undefined) {
	    const canonicalTimeZoneIds = IntlSupportedValuesOf === null || IntlSupportedValuesOf === void 0 ? void 0 : IntlSupportedValuesOf('timeZone');
	    canonicalTimeZoneIdsCache = canonicalTimeZoneIds ? new Map(canonicalTimeZoneIds.map(id => [ASCIILowercase(id), id])) : null;
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

	  // The pattern of leap years in the ISO 8601 calendar repeats every 400
	  // years. To avoid overflowing at the edges of the range, we reduce the year
	  // to the remainder after dividing by 400, and then add back all the
	  // nanoseconds from the multiples of 400 years at the end.
	  const reducedYear = year % 400;
	  const yearCycles = (year - reducedYear) / 400;
	  const nsIn400YearCycle = bigInt(400 * 365 + 97).multiply(DAY_NANOS);
	  const reducedUTC = GetUTCEpochNanoseconds(reducedYear, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
	  const utc = reducedUTC.plus(nsIn400YearCycle.multiply(yearCycles));
	  return +utc.minus(epochNanoseconds);
	}
	function FormatTimeZoneOffsetString(offsetNanoseconds) {
	  const sign = offsetNanoseconds < 0 ? '-' : '+';
	  offsetNanoseconds = MathAbs$1(offsetNanoseconds);
	  const nanoseconds = offsetNanoseconds % 1e9;
	  const seconds = MathFloor$1(offsetNanoseconds / 1e9) % 60;
	  const minutes = MathFloor$1(offsetNanoseconds / 60e9) % 60;
	  const hours = MathFloor$1(offsetNanoseconds / 3600e9);
	  const hourString = ISODateTimePartString(hours);
	  const minuteString = ISODateTimePartString(minutes);
	  const secondString = ISODateTimePartString(seconds);
	  let post = '';
	  if (nanoseconds) {
	    let fraction = "".concat(nanoseconds).padStart(9, '0');
	    while (fraction[fraction.length - 1] === '0') fraction = fraction.slice(0, -1);
	    post = ":".concat(secondString, ".").concat(fraction);
	  } else if (seconds) {
	    post = ":".concat(secondString);
	  }
	  return "".concat(sign).concat(hourString, ":").concat(minuteString).concat(post);
	}
	function FormatISOTimeZoneOffsetString(offsetNanoseconds) {
	  offsetNanoseconds = RoundNumberToIncrement(bigInt(offsetNanoseconds), 60e9, 'halfExpand').toJSNumber();
	  const sign = offsetNanoseconds < 0 ? '-' : '+';
	  offsetNanoseconds = MathAbs$1(offsetNanoseconds);
	  const minutes = offsetNanoseconds / 60e9 % 60;
	  const hours = MathFloor$1(offsetNanoseconds / 3600e9);
	  const hourString = ISODateTimePartString(hours);
	  const minuteString = ISODateTimePartString(minutes);
	  return "".concat(sign).concat(hourString, ":").concat(minuteString);
	}
	function GetUTCEpochNanoseconds(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) {
	  // Note: Date.UTC() interprets one and two-digit years as being in the
	  // 20th century, so don't use it
	  const legacyDate = new Date();
	  legacyDate.setUTCHours(hour, minute, second, millisecond);
	  legacyDate.setUTCFullYear(year, month - 1, day);
	  const ms = legacyDate.getTime();
	  if (NumberIsNaN(ms)) return null;
	  let ns = bigInt(ms).multiply(1e6);
	  ns = ns.plus(bigInt(microsecond).multiply(1e3));
	  ns = ns.plus(bigInt(nanosecond));
	  if (ns.lesser(NS_MIN) || ns.greater(NS_MAX)) return null;
	  return ns;
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
	  const uppercap = SystemUTCEpochNanoSeconds().plus(DAY_NANOS.multiply(366));
	  let leftNanos = epochNanoseconds;
	  let leftOffsetNs = GetNamedTimeZoneOffsetNanoseconds(id, leftNanos);
	  let rightNanos = leftNanos;
	  let rightOffsetNs = leftOffsetNs;
	  while (leftOffsetNs === rightOffsetNs && bigInt(leftNanos).compare(uppercap) === -1) {
	    rightNanos = bigInt(leftNanos).plus(DAY_NANOS.multiply(2 * 7));
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
	  // Optimization: if the instant is more than a year in the future and there
	  // are no transitions between the present day and a year from now, assume
	  // there are none after
	  const now = SystemUTCEpochNanoSeconds();
	  const yearLater = now.plus(DAY_NANOS.multiply(366));
	  if (epochNanoseconds.gt(yearLater)) {
	    const prevBeforeNextYear = GetNamedTimeZonePreviousTransition(id, yearLater);
	    if (prevBeforeNextYear === null || prevBeforeNextYear.lt(now)) {
	      return prevBeforeNextYear;
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
	    leftNanos = bigInt(rightNanos).minus(DAY_NANOS.multiply(2 * 7));
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
	function GetNamedTimeZoneEpochNanoseconds(id, year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) {
	  let ns = GetUTCEpochNanoseconds(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
	  if (ns === null) throw new RangeError('DateTime outside of supported range');
	  let nsEarlier = ns.minus(DAY_NANOS);
	  if (nsEarlier.lesser(NS_MIN)) nsEarlier = ns;
	  let nsLater = ns.plus(DAY_NANOS);
	  if (nsLater.greater(NS_MAX)) nsLater = ns;
	  const earliest = GetNamedTimeZoneOffsetNanoseconds(id, nsEarlier);
	  const latest = GetNamedTimeZoneOffsetNanoseconds(id, nsLater);
	  const found = earliest === latest ? [earliest] : [earliest, latest];
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
	function WeekOfYear(year, month, day) {
	  let doy = DayOfYear(year, month, day);
	  let dow = DayOfWeek(year, month, day) || 7;
	  let doj = DayOfWeek(year, 1, 1);
	  const week = MathFloor$1((doy - dow + 10) / 7);
	  if (week < 1) {
	    if (doj === 5 || doj === 6 && LeapYear(year - 1)) {
	      return {
	        week: 53,
	        year: year - 1
	      };
	    } else {
	      return {
	        week: 52,
	        year: year - 1
	      };
	    }
	  }
	  if (week === 53) {
	    if ((LeapYear(year) ? 366 : 365) - doy < 4 - dow) {
	      return {
	        week: 1,
	        year: year + 1
	      };
	    }
	  }
	  return {
	    week,
	    year
	  };
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
	function TotalDurationNanoseconds(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, offsetShift) {
	  if (days !== 0) nanoseconds = bigInt(nanoseconds).subtract(offsetShift);
	  hours = bigInt(hours).add(bigInt(days).multiply(24));
	  minutes = bigInt(minutes).add(hours.multiply(60));
	  seconds = bigInt(seconds).add(minutes.multiply(60));
	  milliseconds = bigInt(milliseconds).add(seconds.multiply(1000));
	  microseconds = bigInt(microseconds).add(milliseconds.multiply(1000));
	  return bigInt(nanoseconds).add(microseconds.multiply(1000));
	}
	function NanosecondsToDays(nanoseconds, zonedRelativeTo) {
	  const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
	  const sign = MathSign(nanoseconds);
	  nanoseconds = bigInt(nanoseconds);
	  if (sign === 0) return {
	    days: 0,
	    nanoseconds: bigInt.zero,
	    dayLengthNs: DAY_NANOS.toJSNumber()
	  };
	  const startNs = GetSlot(zonedRelativeTo, EPOCHNANOSECONDS);
	  const start = GetSlot(zonedRelativeTo, INSTANT);
	  const endNs = startNs.add(nanoseconds);
	  const end = new TemporalInstant(endNs);
	  const timeZone = GetSlot(zonedRelativeTo, TIME_ZONE);
	  const calendar = GetSlot(zonedRelativeTo, CALENDAR);

	  // Find the difference in days only.
	  const dtStart = GetPlainDateTimeFor(timeZone, start, calendar);
	  const dtEnd = GetPlainDateTimeFor(timeZone, end, calendar);
	  let {
	    days
	  } = DifferenceISODateTime(GetSlot(dtStart, ISO_YEAR), GetSlot(dtStart, ISO_MONTH), GetSlot(dtStart, ISO_DAY), GetSlot(dtStart, ISO_HOUR), GetSlot(dtStart, ISO_MINUTE), GetSlot(dtStart, ISO_SECOND), GetSlot(dtStart, ISO_MILLISECOND), GetSlot(dtStart, ISO_MICROSECOND), GetSlot(dtStart, ISO_NANOSECOND), GetSlot(dtEnd, ISO_YEAR), GetSlot(dtEnd, ISO_MONTH), GetSlot(dtEnd, ISO_DAY), GetSlot(dtEnd, ISO_HOUR), GetSlot(dtEnd, ISO_MINUTE), GetSlot(dtEnd, ISO_SECOND), GetSlot(dtEnd, ISO_MILLISECOND), GetSlot(dtEnd, ISO_MICROSECOND), GetSlot(dtEnd, ISO_NANOSECOND), calendar, 'day', ObjectCreate$8(null));
	  let intermediateNs = AddZonedDateTime(start, timeZone, calendar, 0, 0, 0, days, 0, 0, 0, 0, 0, 0);
	  // may disambiguate

	  // If clock time after addition was in the middle of a skipped period, the
	  // endpoint was disambiguated to a later clock time. So it's possible that
	  // the resulting disambiguated result is later than endNs. If so, then back
	  // up one day and try again. Repeat if necessary (some transitions are
	  // > 24 hours) until either there's zero days left or the date duration is
	  // back inside the period where it belongs. Note that this case only can
	  // happen for positive durations because the only direction that
	  // `disambiguation: 'compatible'` can change clock time is forwards.
	  days = bigInt(days);
	  if (sign === 1) {
	    while (days.greater(0) && intermediateNs.greater(endNs)) {
	      days = days.prev();
	      intermediateNs = AddZonedDateTime(start, timeZone, calendar, 0, 0, 0, days.toJSNumber(), 0, 0, 0, 0, 0, 0);
	      // may do disambiguation
	    }
	  }

	  nanoseconds = endNs.subtract(intermediateNs);
	  let isOverflow = false;
	  let relativeInstant = new TemporalInstant(intermediateNs);
	  let dayLengthNs;
	  do {
	    // calculate length of the next day (day that contains the time remainder)
	    const oneDayFartherNs = AddZonedDateTime(relativeInstant, timeZone, calendar, 0, 0, 0, sign, 0, 0, 0, 0, 0, 0);
	    const relativeNs = GetSlot(relativeInstant, EPOCHNANOSECONDS);
	    dayLengthNs = oneDayFartherNs.subtract(relativeNs).toJSNumber();
	    isOverflow = nanoseconds.subtract(dayLengthNs).multiply(sign).geq(0);
	    if (isOverflow) {
	      nanoseconds = nanoseconds.subtract(dayLengthNs);
	      relativeInstant = new TemporalInstant(oneDayFartherNs);
	      days = days.add(sign);
	    }
	  } while (isOverflow);
	  if (!days.isZero() && MathSign(days.toJSNumber()) != sign) {
	    throw new RangeError('Time zone or calendar converted nanoseconds into a number of days with the opposite sign');
	  }
	  if (!nanoseconds.isZero() && MathSign(nanoseconds.toJSNumber()) != sign) {
	    if (nanoseconds.lt(0) && sign === 1) {
	      throw new Error('assert not reached');
	    }
	    throw new RangeError('Time zone or calendar ended up with a remainder of nanoseconds with the opposite sign');
	  }
	  if (nanoseconds.abs().geq(MathAbs$1(dayLengthNs))) {
	    throw new Error('assert not reached');
	  }
	  return {
	    days: days.toJSNumber(),
	    nanoseconds,
	    dayLengthNs: MathAbs$1(dayLengthNs)
	  };
	}
	function BalanceTimeDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, largestUnit) {
	  let result = BalancePossiblyInfiniteTimeDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, largestUnit);
	  if (result === 'positive overflow' || result === 'negative overflow') {
	    throw new RangeError('Duration out of range');
	  } else {
	    return result;
	  }
	}
	function BalancePossiblyInfiniteTimeDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, largestUnit) {
	  nanoseconds = TotalDurationNanoseconds(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 0);
	  const sign = nanoseconds.lesser(0) ? -1 : 1;
	  nanoseconds = nanoseconds.abs();
	  microseconds = milliseconds = seconds = minutes = hours = days = bigInt.zero;
	  switch (largestUnit) {
	    case 'year':
	    case 'month':
	    case 'week':
	    case 'day':
	      ({
	        quotient: microseconds,
	        remainder: nanoseconds
	      } = nanoseconds.divmod(1000));
	      ({
	        quotient: milliseconds,
	        remainder: microseconds
	      } = microseconds.divmod(1000));
	      ({
	        quotient: seconds,
	        remainder: milliseconds
	      } = milliseconds.divmod(1000));
	      ({
	        quotient: minutes,
	        remainder: seconds
	      } = seconds.divmod(60));
	      ({
	        quotient: hours,
	        remainder: minutes
	      } = minutes.divmod(60));
	      ({
	        quotient: days,
	        remainder: hours
	      } = hours.divmod(24));
	      break;
	    case 'hour':
	      ({
	        quotient: microseconds,
	        remainder: nanoseconds
	      } = nanoseconds.divmod(1000));
	      ({
	        quotient: milliseconds,
	        remainder: microseconds
	      } = microseconds.divmod(1000));
	      ({
	        quotient: seconds,
	        remainder: milliseconds
	      } = milliseconds.divmod(1000));
	      ({
	        quotient: minutes,
	        remainder: seconds
	      } = seconds.divmod(60));
	      ({
	        quotient: hours,
	        remainder: minutes
	      } = minutes.divmod(60));
	      break;
	    case 'minute':
	      ({
	        quotient: microseconds,
	        remainder: nanoseconds
	      } = nanoseconds.divmod(1000));
	      ({
	        quotient: milliseconds,
	        remainder: microseconds
	      } = microseconds.divmod(1000));
	      ({
	        quotient: seconds,
	        remainder: milliseconds
	      } = milliseconds.divmod(1000));
	      ({
	        quotient: minutes,
	        remainder: seconds
	      } = seconds.divmod(60));
	      break;
	    case 'second':
	      ({
	        quotient: microseconds,
	        remainder: nanoseconds
	      } = nanoseconds.divmod(1000));
	      ({
	        quotient: milliseconds,
	        remainder: microseconds
	      } = microseconds.divmod(1000));
	      ({
	        quotient: seconds,
	        remainder: milliseconds
	      } = milliseconds.divmod(1000));
	      break;
	    case 'millisecond':
	      ({
	        quotient: microseconds,
	        remainder: nanoseconds
	      } = nanoseconds.divmod(1000));
	      ({
	        quotient: milliseconds,
	        remainder: microseconds
	      } = microseconds.divmod(1000));
	      break;
	    case 'microsecond':
	      ({
	        quotient: microseconds,
	        remainder: nanoseconds
	      } = nanoseconds.divmod(1000));
	      break;
	    case 'nanosecond':
	      break;
	    default:
	      throw new Error('assert not reached');
	  }
	  days = days.toJSNumber() * sign;
	  hours = hours.toJSNumber() * sign;
	  minutes = minutes.toJSNumber() * sign;
	  seconds = seconds.toJSNumber() * sign;
	  milliseconds = milliseconds.toJSNumber() * sign;
	  microseconds = microseconds.toJSNumber() * sign;
	  nanoseconds = nanoseconds.toJSNumber() * sign;
	  if (!NumberIsFinite(days) || !NumberIsFinite(hours) || !NumberIsFinite(minutes) || !NumberIsFinite(seconds) || !NumberIsFinite(milliseconds) || !NumberIsFinite(microseconds) || !NumberIsFinite(nanoseconds)) {
	    if (sign === 1) {
	      return 'positive overflow';
	    } else if (sign === -1) {
	      return 'negative overflow';
	    }
	  }
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
	function BalanceTimeDurationRelative(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, largestUnit, zonedRelativeTo) {
	  let result = BalancePossiblyInfiniteTimeDurationRelative(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, largestUnit, zonedRelativeTo);
	  if (result === 'positive overflow' || result === 'negative overflow') {
	    throw new RangeError('Duration out of range');
	  }
	  return result;
	}
	function BalancePossiblyInfiniteTimeDurationRelative(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, largestUnit, zonedRelativeTo) {
	  const endNs = AddZonedDateTime(GetSlot(zonedRelativeTo, INSTANT), GetSlot(zonedRelativeTo, TIME_ZONE), GetSlot(zonedRelativeTo, CALENDAR), 0, 0, 0, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
	  const startNs = GetSlot(zonedRelativeTo, EPOCHNANOSECONDS);
	  nanoseconds = endNs.subtract(startNs);
	  if (largestUnit === 'year' || largestUnit === 'month' || largestUnit === 'week' || largestUnit === 'day') {
	    ({
	      days,
	      nanoseconds
	    } = NanosecondsToDays(nanoseconds, zonedRelativeTo));
	    largestUnit = 'hour';
	  } else {
	    days = 0;
	  }
	  ({
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds,
	    nanoseconds
	  } = BalancePossiblyInfiniteTimeDuration(0, 0, 0, 0, 0, 0, nanoseconds, largestUnit));
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
	function UnbalanceDateDurationRelative(years, months, weeks, days, largestUnit, relativeTo) {
	  const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
	  const sign = DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
	  if (sign === 0) return {
	    years,
	    months,
	    weeks,
	    days
	  };
	  let calendar;
	  if (relativeTo) {
	    relativeTo = ToTemporalDate(relativeTo);
	    calendar = GetSlot(relativeTo, CALENDAR);
	  }
	  const oneYear = new TemporalDuration(sign);
	  const oneMonth = new TemporalDuration(0, sign);
	  const oneWeek = new TemporalDuration(0, 0, sign);

	  // Perform arithmetic in the mathematical integer domain
	  years = bigInt(years);
	  months = bigInt(months);
	  weeks = bigInt(weeks);
	  days = bigInt(days);
	  switch (largestUnit) {
	    case 'year':
	      // no-op
	      break;
	    case 'month':
	      {
	        if (!calendar) throw new RangeError('a starting point is required for months balancing');
	        // balance years down to months
	        let dateAdd, dateUntil;
	        if (typeof calendar !== 'string') {
	          dateAdd = GetMethod$2(calendar, 'dateAdd');
	          dateUntil = GetMethod$2(calendar, 'dateUntil');
	        }
	        while (!years.isZero()) {
	          const newRelativeTo = CalendarDateAdd(calendar, relativeTo, oneYear, undefined, dateAdd);
	          const untilOptions = ObjectCreate$8(null);
	          untilOptions.largestUnit = 'month';
	          const untilResult = CalendarDateUntil(calendar, relativeTo, newRelativeTo, untilOptions, dateUntil);
	          const oneYearMonths = GetSlot(untilResult, MONTHS);
	          relativeTo = newRelativeTo;
	          months = months.add(oneYearMonths);
	          years = years.subtract(sign);
	        }
	      }
	      break;
	    case 'week':
	      {
	        if (!calendar) throw new RangeError('a starting point is required for weeks balancing');
	        const dateAdd = typeof calendar !== 'string' ? GetMethod$2(calendar, 'dateAdd') : undefined;
	        // balance years down to days
	        while (!years.isZero()) {
	          let oneYearDays;
	          ({
	            relativeTo,
	            days: oneYearDays
	          } = MoveRelativeDate(calendar, relativeTo, oneYear, dateAdd));
	          days = days.add(oneYearDays);
	          years = years.subtract(sign);
	        }

	        // balance months down to days
	        while (!months.isZero()) {
	          let oneMonthDays;
	          ({
	            relativeTo,
	            days: oneMonthDays
	          } = MoveRelativeDate(calendar, relativeTo, oneMonth, dateAdd));
	          days = days.add(oneMonthDays);
	          months = months.subtract(sign);
	        }
	      }
	      break;
	    default:
	      {
	        if (years.isZero() && months.isZero() && weeks.isZero()) break;
	        if (!calendar) throw new RangeError('a starting point is required for balancing calendar units');
	        const dateAdd = typeof calendar !== 'string' ? GetMethod$2(calendar, 'dateAdd') : undefined;
	        // balance years down to days
	        while (!years.isZero()) {
	          let oneYearDays;
	          ({
	            relativeTo,
	            days: oneYearDays
	          } = MoveRelativeDate(calendar, relativeTo, oneYear, dateAdd));
	          days = days.add(oneYearDays);
	          years = years.subtract(sign);
	        }

	        // balance months down to days
	        while (!months.isZero()) {
	          let oneMonthDays;
	          ({
	            relativeTo,
	            days: oneMonthDays
	          } = MoveRelativeDate(calendar, relativeTo, oneMonth, dateAdd));
	          days = days.add(oneMonthDays);
	          months = months.subtract(sign);
	        }

	        // balance weeks down to days
	        while (!weeks.isZero()) {
	          let oneWeekDays;
	          ({
	            relativeTo,
	            days: oneWeekDays
	          } = MoveRelativeDate(calendar, relativeTo, oneWeek, dateAdd));
	          days = days.add(oneWeekDays);
	          weeks = weeks.subtract(sign);
	        }
	      }
	      break;
	  }
	  return {
	    years: years.toJSNumber(),
	    months: months.toJSNumber(),
	    weeks: weeks.toJSNumber(),
	    days: days.toJSNumber()
	  };
	}
	function BalanceDateDurationRelative(years, months, weeks, days, largestUnit, relativeTo) {
	  const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
	  const sign = DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
	  if (sign === 0) return {
	    years,
	    months,
	    weeks,
	    days
	  };
	  let calendar;
	  if (relativeTo) {
	    relativeTo = ToTemporalDate(relativeTo);
	    calendar = GetSlot(relativeTo, CALENDAR);
	  }
	  const oneYear = new TemporalDuration(sign);
	  const oneMonth = new TemporalDuration(0, sign);
	  const oneWeek = new TemporalDuration(0, 0, sign);

	  // Perform arithmetic in the mathematical integer domain
	  years = bigInt(years);
	  months = bigInt(months);
	  weeks = bigInt(weeks);
	  days = bigInt(days);
	  switch (largestUnit) {
	    case 'year':
	      {
	        if (!calendar) throw new RangeError('a starting point is required for years balancing');
	        const dateAdd = typeof calendar !== 'string' ? GetMethod$2(calendar, 'dateAdd') : undefined;
	        // balance days up to years
	        let newRelativeTo, oneYearDays;
	        ({
	          relativeTo: newRelativeTo,
	          days: oneYearDays
	        } = MoveRelativeDate(calendar, relativeTo, oneYear, dateAdd));
	        while (days.abs().geq(MathAbs$1(oneYearDays))) {
	          days = days.subtract(oneYearDays);
	          years = years.add(sign);
	          relativeTo = newRelativeTo;
	          ({
	            relativeTo: newRelativeTo,
	            days: oneYearDays
	          } = MoveRelativeDate(calendar, relativeTo, oneYear, dateAdd));
	        }

	        // balance days up to months
	        let oneMonthDays;
	        ({
	          relativeTo: newRelativeTo,
	          days: oneMonthDays
	        } = MoveRelativeDate(calendar, relativeTo, oneMonth, dateAdd));
	        while (days.abs().geq(MathAbs$1(oneMonthDays))) {
	          days = days.subtract(oneMonthDays);
	          months = months.add(sign);
	          relativeTo = newRelativeTo;
	          ({
	            relativeTo: newRelativeTo,
	            days: oneMonthDays
	          } = MoveRelativeDate(calendar, relativeTo, oneMonth, dateAdd));
	        }

	        // balance months up to years
	        newRelativeTo = CalendarDateAdd(calendar, relativeTo, oneYear, undefined, dateAdd);
	        const dateUntil = typeof calendar !== 'string' ? GetMethod$2(calendar, 'dateUntil') : undefined;
	        const untilOptions = ObjectCreate$8(null);
	        untilOptions.largestUnit = 'month';
	        let untilResult = CalendarDateUntil(calendar, relativeTo, newRelativeTo, untilOptions, dateUntil);
	        let oneYearMonths = GetSlot(untilResult, MONTHS);
	        while (months.abs().geq(MathAbs$1(oneYearMonths))) {
	          months = months.subtract(oneYearMonths);
	          years = years.add(sign);
	          relativeTo = newRelativeTo;
	          newRelativeTo = CalendarDateAdd(calendar, relativeTo, oneYear, undefined, dateAdd);
	          const untilOptions = ObjectCreate$8(null);
	          untilOptions.largestUnit = 'month';
	          untilResult = CalendarDateUntil(calendar, relativeTo, newRelativeTo, untilOptions, dateUntil);
	          oneYearMonths = GetSlot(untilResult, MONTHS);
	        }
	        break;
	      }
	    case 'month':
	      {
	        if (!calendar) throw new RangeError('a starting point is required for months balancing');
	        const dateAdd = typeof calendar !== 'string' ? GetMethod$2(calendar, 'dateAdd') : undefined;
	        // balance days up to months
	        let newRelativeTo, oneMonthDays;
	        ({
	          relativeTo: newRelativeTo,
	          days: oneMonthDays
	        } = MoveRelativeDate(calendar, relativeTo, oneMonth, dateAdd));
	        while (days.abs().geq(MathAbs$1(oneMonthDays))) {
	          days = days.subtract(oneMonthDays);
	          months = months.add(sign);
	          relativeTo = newRelativeTo;
	          ({
	            relativeTo: newRelativeTo,
	            days: oneMonthDays
	          } = MoveRelativeDate(calendar, relativeTo, oneMonth, dateAdd));
	        }
	        break;
	      }
	    case 'week':
	      {
	        if (!calendar) throw new RangeError('a starting point is required for weeks balancing');
	        const dateAdd = typeof calendar !== 'string' ? GetMethod$2(calendar, 'dateAdd') : undefined;
	        // balance days up to weeks
	        let newRelativeTo, oneWeekDays;
	        ({
	          relativeTo: newRelativeTo,
	          days: oneWeekDays
	        } = MoveRelativeDate(calendar, relativeTo, oneWeek, dateAdd));
	        while (days.abs().geq(MathAbs$1(oneWeekDays))) {
	          days = days.subtract(oneWeekDays);
	          weeks = weeks.add(sign);
	          relativeTo = newRelativeTo;
	          ({
	            relativeTo: newRelativeTo,
	            days: oneWeekDays
	          } = MoveRelativeDate(calendar, relativeTo, oneWeek, dateAdd));
	        }
	        break;
	      }
	  }
	  return {
	    years: years.toJSNumber(),
	    months: months.toJSNumber(),
	    weeks: weeks.toJSNumber(),
	    days: days.toJSNumber()
	  };
	}
	function CalculateOffsetShift(relativeTo, y, mon, w, d) {
	  if (IsTemporalZonedDateTime(relativeTo)) {
	    const instant = GetSlot(relativeTo, INSTANT);
	    const timeZone = GetSlot(relativeTo, TIME_ZONE);
	    const calendar = GetSlot(relativeTo, CALENDAR);
	    const offsetBefore = GetOffsetNanosecondsFor(timeZone, instant);
	    const after = AddZonedDateTime(instant, timeZone, calendar, y, mon, w, d, 0, 0, 0, 0, 0, 0);
	    const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
	    const instantAfter = new TemporalInstant(after);
	    const offsetAfter = GetOffsetNanosecondsFor(timeZone, instantAfter);
	    return offsetAfter - offsetBefore;
	  }
	  return 0;
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
	  RejectToRange(year, YEAR_MIN, YEAR_MAX);
	  // Reject any DateTime 24 hours or more outside the Instant range
	  if (year === YEAR_MIN && null == GetUTCEpochNanoseconds(year, month, day + 1, hour, minute, second, millisecond, microsecond, nanosecond - 1) || year === YEAR_MAX && null == GetUTCEpochNanoseconds(year, month, day - 1, hour, minute, second, millisecond, microsecond, nanosecond + 1)) {
	    throw new RangeError('DateTime outside of supported range');
	  }
	}
	function ValidateEpochNanoseconds(epochNanoseconds) {
	  if (epochNanoseconds.lesser(NS_MIN) || epochNanoseconds.greater(NS_MAX)) {
	    throw new RangeError('Instant outside of supported range');
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
	}
	function DifferenceISODate(y1, m1, d1, y2, m2, d2) {
	  let largestUnit = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 'days';
	  switch (largestUnit) {
	    case 'year':
	    case 'month':
	      {
	        const sign = -CompareISODate(y1, m1, d1, y2, m2, d2);
	        if (sign === 0) return {
	          years: 0,
	          months: 0,
	          weeks: 0,
	          days: 0
	        };
	        const start = {
	          year: y1,
	          month: m1,
	          day: d1
	        };
	        const end = {
	          year: y2,
	          month: m2,
	          day: d2
	        };
	        let years = end.year - start.year;
	        let mid = AddISODate(y1, m1, d1, years, 0, 0, 0, 'constrain');
	        let midSign = -CompareISODate(mid.year, mid.month, mid.day, y2, m2, d2);
	        if (midSign === 0) {
	          return largestUnit === 'year' ? {
	            years,
	            months: 0,
	            weeks: 0,
	            days: 0
	          } : {
	            years: 0,
	            months: years * 12,
	            weeks: 0,
	            days: 0
	          };
	        }
	        let months = end.month - start.month;
	        if (midSign !== sign) {
	          years -= sign;
	          months += sign * 12;
	        }
	        mid = AddISODate(y1, m1, d1, years, months, 0, 0, 'constrain');
	        midSign = -CompareISODate(mid.year, mid.month, mid.day, y2, m2, d2);
	        if (midSign === 0) {
	          return largestUnit === 'year' ? {
	            years,
	            months,
	            weeks: 0,
	            days: 0
	          } : {
	            years: 0,
	            months: months + years * 12,
	            weeks: 0,
	            days: 0
	          };
	        }
	        if (midSign !== sign) {
	          // The end date is later in the month than mid date (or earlier for
	          // negative durations). Back up one month.
	          months -= sign;
	          if (months === -sign) {
	            years -= sign;
	            months = 11 * sign;
	          }
	          mid = AddISODate(y1, m1, d1, years, months, 0, 0, 'constrain');
	        }
	        let days = 0;
	        // If we get here, months and years are correct (no overflow), and `mid`
	        // is within the range from `start` to `end`. To count the days between
	        // `mid` and `end`, there are 3 cases:
	        // 1) same month: use simple subtraction
	        // 2) end is previous month from intermediate (negative duration)
	        // 3) end is next month from intermediate (positive duration)
	        if (mid.month === end.month) {
	          // 1) same month: use simple subtraction
	          days = end.day - mid.day;
	        } else if (sign < 0) {
	          // 2) end is previous month from intermediate (negative duration)
	          // Example: intermediate: Feb 1, end: Jan 30, DaysInMonth = 31, days = -2
	          days = -mid.day - (ISODaysInMonth(end.year, end.month) - end.day);
	        } else {
	          // 3) end is next month from intermediate (positive duration)
	          // Example: intermediate: Jan 29, end: Feb 1, DaysInMonth = 31, days = 3
	          days = end.day + (ISODaysInMonth(mid.year, mid.month) - mid.day);
	        }
	        if (largestUnit === 'month') {
	          months += years * 12;
	          years = 0;
	        }
	        return {
	          years,
	          months,
	          weeks: 0,
	          days
	        };
	      }
	    case 'week':
	    case 'day':
	      {
	        let larger, smaller, sign;
	        if (CompareISODate(y1, m1, d1, y2, m2, d2) < 0) {
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
	        let days = DayOfYear(larger.year, larger.month, larger.day) - DayOfYear(smaller.year, smaller.month, smaller.day);
	        for (let year = smaller.year; year < larger.year; ++year) {
	          days += LeapYear(year) ? 366 : 365;
	        }
	        let weeks = 0;
	        if (largestUnit === 'week') {
	          weeks = MathFloor$1(days / 7);
	          days %= 7;
	        }
	        weeks *= sign;
	        days *= sign;
	        return {
	          years: 0,
	          months: 0,
	          weeks,
	          days
	        };
	      }
	    default:
	      throw new Error('assert not reached');
	  }
	}
	function DifferenceTime(h1, min1, s1, ms1, µs1, ns1, h2, min2, s2, ms2, µs2, ns2) {
	  let hours = h2 - h1;
	  let minutes = min2 - min1;
	  let seconds = s2 - s1;
	  let milliseconds = ms2 - ms1;
	  let microseconds = µs2 - µs1;
	  let nanoseconds = ns2 - ns1;
	  const sign = DurationSign(0, 0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
	  hours *= sign;
	  minutes *= sign;
	  seconds *= sign;
	  milliseconds *= sign;
	  microseconds *= sign;
	  nanoseconds *= sign;
	  let deltaDays = 0;
	  ({
	    deltaDays,
	    hour: hours,
	    minute: minutes,
	    second: seconds,
	    millisecond: milliseconds,
	    microsecond: microseconds,
	    nanosecond: nanoseconds
	  } = BalanceTime(hours, minutes, seconds, milliseconds, microseconds, nanoseconds));
	  if (deltaDays != 0) throw new Error('assertion failure in DifferenceTime: _bt_.[[Days]] should be 0');
	  hours *= sign;
	  minutes *= sign;
	  seconds *= sign;
	  milliseconds *= sign;
	  microseconds *= sign;
	  nanoseconds *= sign;
	  return {
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds,
	    nanoseconds
	  };
	}
	function DifferenceInstant(ns1, ns2, increment, smallestUnit, largestUnit, roundingMode) {
	  const diff = ns2.minus(ns1);
	  let hours = 0;
	  let minutes = 0;
	  let nanoseconds = diff.mod(1e3).toJSNumber();
	  let microseconds = diff.divide(1e3).mod(1e3).toJSNumber();
	  let milliseconds = diff.divide(1e6).mod(1e3).toJSNumber();
	  let seconds = diff.divide(1e9).toJSNumber();
	  ({
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds,
	    nanoseconds
	  } = RoundDuration(0, 0, 0, 0, 0, 0, seconds, milliseconds, microseconds, nanoseconds, increment, smallestUnit, roundingMode));
	  return BalanceTimeDuration(0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, largestUnit);
	}
	function DifferenceISODateTime(y1, mon1, d1, h1, min1, s1, ms1, µs1, ns1, y2, mon2, d2, h2, min2, s2, ms2, µs2, ns2, calendar, largestUnit, options) {
	  let {
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds,
	    nanoseconds
	  } = DifferenceTime(h1, min1, s1, ms1, µs1, ns1, h2, min2, s2, ms2, µs2, ns2);
	  const timeSign = DurationSign(0, 0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
	  const dateSign = CompareISODate(y2, mon2, d2, y1, mon1, d1);
	  if (dateSign === -timeSign) {
	    ({
	      year: y1,
	      month: mon1,
	      day: d1
	    } = BalanceISODate(y1, mon1, d1 - timeSign));
	    ({
	      hours,
	      minutes,
	      seconds,
	      milliseconds,
	      microseconds,
	      nanoseconds
	    } = BalanceTimeDuration(-timeSign, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, largestUnit));
	  }
	  const date1 = CreateTemporalDate(y1, mon1, d1, calendar);
	  const date2 = CreateTemporalDate(y2, mon2, d2, calendar);
	  const dateLargestUnit = LargerOfTwoTemporalUnits('day', largestUnit);
	  const untilOptions = SnapshotOwnProperties(GetOptionsObject(options), null);
	  untilOptions.largestUnit = dateLargestUnit;
	  const untilResult = CalendarDateUntil(calendar, date1, date2, untilOptions);
	  const years = GetSlot(untilResult, YEARS);
	  const months = GetSlot(untilResult, MONTHS);
	  const weeks = GetSlot(untilResult, WEEKS);
	  let days = GetSlot(untilResult, DAYS);
	  // Signs of date part and time part may not agree; balance them together
	  ({
	    days,
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds,
	    nanoseconds
	  } = BalanceTimeDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, largestUnit));
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
	function DifferenceZonedDateTime(ns1, ns2, timeZone, calendar, largestUnit, options) {
	  const nsDiff = ns2.subtract(ns1);
	  if (nsDiff.isZero()) {
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
	      nanoseconds: 0
	    };
	  }

	  // Find the difference in dates only.
	  const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
	  const start = new TemporalInstant(ns1);
	  const end = new TemporalInstant(ns2);
	  const dtStart = GetPlainDateTimeFor(timeZone, start, calendar);
	  const dtEnd = GetPlainDateTimeFor(timeZone, end, calendar);
	  let {
	    years,
	    months,
	    weeks,
	    days
	  } = DifferenceISODateTime(GetSlot(dtStart, ISO_YEAR), GetSlot(dtStart, ISO_MONTH), GetSlot(dtStart, ISO_DAY), GetSlot(dtStart, ISO_HOUR), GetSlot(dtStart, ISO_MINUTE), GetSlot(dtStart, ISO_SECOND), GetSlot(dtStart, ISO_MILLISECOND), GetSlot(dtStart, ISO_MICROSECOND), GetSlot(dtStart, ISO_NANOSECOND), GetSlot(dtEnd, ISO_YEAR), GetSlot(dtEnd, ISO_MONTH), GetSlot(dtEnd, ISO_DAY), GetSlot(dtEnd, ISO_HOUR), GetSlot(dtEnd, ISO_MINUTE), GetSlot(dtEnd, ISO_SECOND), GetSlot(dtEnd, ISO_MILLISECOND), GetSlot(dtEnd, ISO_MICROSECOND), GetSlot(dtEnd, ISO_NANOSECOND), calendar, largestUnit, options);
	  let intermediateNs = AddZonedDateTime(start, timeZone, calendar, years, months, weeks, 0, 0, 0, 0, 0, 0, 0);
	  // may disambiguate
	  let timeRemainderNs = ns2.subtract(intermediateNs);
	  const intermediate = CreateTemporalZonedDateTime(intermediateNs, timeZone, calendar);
	  ({
	    nanoseconds: timeRemainderNs,
	    days
	  } = NanosecondsToDays(timeRemainderNs, intermediate));

	  // Finally, merge the date and time durations and return the merged result.
	  let {
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds,
	    nanoseconds
	  } = BalanceTimeDuration(0, 0, 0, 0, 0, 0, timeRemainderNs, 'hour');
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
	function GetDifferenceSettings(op, options, group, disallowed, fallbackSmallest, smallestLargestDefaultUnit) {
	  const ALLOWED_UNITS = SINGULAR_PLURAL_UNITS.reduce((allowed, unitInfo) => {
	    const p = unitInfo[0];
	    const s = unitInfo[1];
	    const c = unitInfo[2];
	    if ((group === 'datetime' || c === group) && !Call$1(ArrayIncludes$1, disallowed, [s])) {
	      allowed.push(s, p);
	    }
	    return allowed;
	  }, []);
	  let largestUnit = GetTemporalUnit(options, 'largestUnit', group, 'auto');
	  if (Call$1(ArrayIncludes$1, disallowed, [largestUnit])) {
	    throw new RangeError("largestUnit must be one of ".concat(ALLOWED_UNITS.join(', '), ", not ").concat(largestUnit));
	  }
	  const roundingIncrement = ToTemporalRoundingIncrement(options);
	  let roundingMode = ToTemporalRoundingMode(options, 'trunc');
	  if (op === 'since') roundingMode = NegateTemporalRoundingMode(roundingMode);
	  const smallestUnit = GetTemporalUnit(options, 'smallestUnit', group, fallbackSmallest);
	  if (Call$1(ArrayIncludes$1, disallowed, [smallestUnit])) {
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
	  let {
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds,
	    nanoseconds
	  } = DifferenceInstant(onens, twons, settings.roundingIncrement, settings.smallestUnit, settings.largestUnit, settings.roundingMode);
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
	  resolvedOptions.largestUnit = settings.largestUnit;
	  const untilResult = CalendarDateUntil(calendar, plainDate, other, resolvedOptions);
	  let years = GetSlot(untilResult, YEARS);
	  let months = GetSlot(untilResult, MONTHS);
	  let weeks = GetSlot(untilResult, WEEKS);
	  let days = GetSlot(untilResult, DAYS);
	  if (settings.smallestUnit !== 'day' || settings.roundingIncrement !== 1) {
	    ({
	      years,
	      months,
	      weeks,
	      days
	    } = RoundDuration(years, months, weeks, days, 0, 0, 0, 0, 0, 0, settings.roundingIncrement, settings.smallestUnit, settings.roundingMode, plainDate));
	  }
	  const Duration = GetIntrinsic('%Temporal.Duration%');
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
	  } = DifferenceISODateTime(GetSlot(plainDateTime, ISO_YEAR), GetSlot(plainDateTime, ISO_MONTH), GetSlot(plainDateTime, ISO_DAY), GetSlot(plainDateTime, ISO_HOUR), GetSlot(plainDateTime, ISO_MINUTE), GetSlot(plainDateTime, ISO_SECOND), GetSlot(plainDateTime, ISO_MILLISECOND), GetSlot(plainDateTime, ISO_MICROSECOND), GetSlot(plainDateTime, ISO_NANOSECOND), GetSlot(other, ISO_YEAR), GetSlot(other, ISO_MONTH), GetSlot(other, ISO_DAY), GetSlot(other, ISO_HOUR), GetSlot(other, ISO_MINUTE), GetSlot(other, ISO_SECOND), GetSlot(other, ISO_MILLISECOND), GetSlot(other, ISO_MICROSECOND), GetSlot(other, ISO_NANOSECOND), calendar, settings.largestUnit, resolvedOptions);
	  const relativeTo = TemporalDateTimeToDate(plainDateTime);
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
	  } = RoundDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, settings.roundingIncrement, settings.smallestUnit, settings.roundingMode, relativeTo));
	  ({
	    days,
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds,
	    nanoseconds
	  } = BalanceTimeDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, settings.largestUnit));
	  const Duration = GetIntrinsic('%Temporal.Duration%');
	  return new Duration(sign * years, sign * months, sign * weeks, sign * days, sign * hours, sign * minutes, sign * seconds, sign * milliseconds, sign * microseconds, sign * nanoseconds);
	}
	function DifferenceTemporalPlainTime(operation, plainTime, other, options) {
	  const sign = operation === 'since' ? -1 : 1;
	  other = ToTemporalTime(other);
	  const resolvedOptions = SnapshotOwnProperties(GetOptionsObject(options), null);
	  const settings = GetDifferenceSettings(operation, resolvedOptions, 'time', [], 'nanosecond', 'hour');
	  let {
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds,
	    nanoseconds
	  } = DifferenceTime(GetSlot(plainTime, ISO_HOUR), GetSlot(plainTime, ISO_MINUTE), GetSlot(plainTime, ISO_SECOND), GetSlot(plainTime, ISO_MILLISECOND), GetSlot(plainTime, ISO_MICROSECOND), GetSlot(plainTime, ISO_NANOSECOND), GetSlot(other, ISO_HOUR), GetSlot(other, ISO_MINUTE), GetSlot(other, ISO_SECOND), GetSlot(other, ISO_MILLISECOND), GetSlot(other, ISO_MICROSECOND), GetSlot(other, ISO_NANOSECOND));
	  ({
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds,
	    nanoseconds
	  } = RoundDuration(0, 0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, settings.roundingIncrement, settings.smallestUnit, settings.roundingMode));
	  ({
	    hours,
	    minutes,
	    seconds,
	    milliseconds,
	    microseconds,
	    nanoseconds
	  } = BalanceTimeDuration(0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, settings.largestUnit));
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
	  resolvedOptions.largestUnit = settings.largestUnit;
	  const fieldNames = CalendarFields(calendar, ['monthCode', 'year']);
	  const thisFields = PrepareTemporalFields(yearMonth, fieldNames, []);
	  thisFields.day = 1;
	  const thisDate = CalendarDateFromFields(calendar, thisFields);
	  const otherFields = PrepareTemporalFields(other, fieldNames, []);
	  otherFields.day = 1;
	  const otherDate = CalendarDateFromFields(calendar, otherFields);
	  let {
	    years,
	    months
	  } = CalendarDateUntil(calendar, thisDate, otherDate, resolvedOptions);
	  if (settings.smallestUnit !== 'month' || settings.roundingIncrement !== 1) {
	    ({
	      years,
	      months
	    } = RoundDuration(years, months, 0, 0, 0, 0, 0, 0, 0, 0, settings.roundingIncrement, settings.smallestUnit, settings.roundingMode, thisDate));
	  }
	  const Duration = GetIntrinsic('%Temporal.Duration%');
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
	  resolvedOptions.largestUnit = settings.largestUnit;
	  const ns1 = GetSlot(zonedDateTime, EPOCHNANOSECONDS);
	  const ns2 = GetSlot(other, EPOCHNANOSECONDS);
	  let years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds;
	  if (settings.largestUnit !== 'year' && settings.largestUnit !== 'month' && settings.largestUnit !== 'week' && settings.largestUnit !== 'day') {
	    // The user is only asking for a time difference, so return difference of instants.
	    years = 0;
	    months = 0;
	    weeks = 0;
	    days = 0;
	    ({
	      hours,
	      minutes,
	      seconds,
	      milliseconds,
	      microseconds,
	      nanoseconds
	    } = DifferenceInstant(ns1, ns2, settings.roundingIncrement, settings.smallestUnit, settings.largestUnit, settings.roundingMode));
	  } else {
	    const timeZone = GetSlot(zonedDateTime, TIME_ZONE);
	    if (!TimeZoneEquals(timeZone, GetSlot(other, TIME_ZONE))) {
	      throw new RangeError("When calculating difference between time zones, largestUnit must be 'hours' " + 'or smaller because day lengths can vary between time zones due to DST or time zone offset changes.');
	    }
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
	    } = DifferenceZonedDateTime(ns1, ns2, timeZone, calendar, settings.largestUnit, resolvedOptions));
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
	    } = RoundDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, settings.roundingIncrement, settings.smallestUnit, settings.roundingMode, zonedDateTime));
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
	    } = AdjustRoundedDurationDays(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, settings.roundingIncrement, settings.smallestUnit, settings.roundingMode, zonedDateTime));
	  }
	  const Duration = GetIntrinsic('%Temporal.Duration%');
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
	function AddTime(hour, minute, second, millisecond, microsecond, nanosecond, hours, minutes, seconds, milliseconds, microseconds, nanoseconds) {
	  hour += hours;
	  minute += minutes;
	  second += seconds;
	  millisecond += milliseconds;
	  microsecond += microseconds;
	  nanosecond += nanoseconds;
	  let deltaDays = 0;
	  ({
	    deltaDays,
	    hour,
	    minute,
	    second,
	    millisecond,
	    microsecond,
	    nanosecond
	  } = BalanceTime(hour, minute, second, millisecond, microsecond, nanosecond));
	  return {
	    deltaDays,
	    hour,
	    minute,
	    second,
	    millisecond,
	    microsecond,
	    nanosecond
	  };
	}
	function AddDuration(y1, mon1, w1, d1, h1, min1, s1, ms1, µs1, ns1, y2, mon2, w2, d2, h2, min2, s2, ms2, µs2, ns2, relativeTo) {
	  const largestUnit1 = DefaultTemporalLargestUnit(y1, mon1, w1, d1, h1, min1, s1, ms1, µs1, ns1);
	  const largestUnit2 = DefaultTemporalLargestUnit(y2, mon2, w2, d2, h2, min2, s2, ms2, µs2, ns2);
	  const largestUnit = LargerOfTwoTemporalUnits(largestUnit1, largestUnit2);
	  let years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds;
	  if (!relativeTo) {
	    if (largestUnit === 'year' || largestUnit === 'month' || largestUnit === 'week') {
	      throw new RangeError('relativeTo is required for years, months, or weeks arithmetic');
	    }
	    years = months = weeks = 0;
	    ({
	      days,
	      hours,
	      minutes,
	      seconds,
	      milliseconds,
	      microseconds,
	      nanoseconds
	    } = BalanceTimeDuration(d1 + d2, bigInt(h1).add(h2), bigInt(min1).add(min2), bigInt(s1).add(s2), bigInt(ms1).add(ms2), bigInt(µs1).add(µs2), bigInt(ns1).add(ns2), largestUnit));
	  } else if (IsTemporalDate(relativeTo)) {
	    const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
	    const calendar = GetSlot(relativeTo, CALENDAR);
	    const dateDuration1 = new TemporalDuration(y1, mon1, w1, d1, 0, 0, 0, 0, 0, 0);
	    const dateDuration2 = new TemporalDuration(y2, mon2, w2, d2, 0, 0, 0, 0, 0, 0);
	    const dateAdd = typeof calendar !== 'string' ? GetMethod$2(calendar, 'dateAdd') : undefined;
	    const intermediate = CalendarDateAdd(calendar, relativeTo, dateDuration1, undefined, dateAdd);
	    const end = CalendarDateAdd(calendar, intermediate, dateDuration2, undefined, dateAdd);
	    const dateLargestUnit = LargerOfTwoTemporalUnits('day', largestUnit);
	    const differenceOptions = ObjectCreate$8(null);
	    differenceOptions.largestUnit = dateLargestUnit;
	    const untilResult = CalendarDateUntil(calendar, relativeTo, end, differenceOptions);
	    years = GetSlot(untilResult, YEARS);
	    months = GetSlot(untilResult, MONTHS);
	    weeks = GetSlot(untilResult, WEEKS);
	    days = GetSlot(untilResult, DAYS);
	    // Signs of date part and time part may not agree; balance them together
	    ({
	      days,
	      hours,
	      minutes,
	      seconds,
	      milliseconds,
	      microseconds,
	      nanoseconds
	    } = BalanceTimeDuration(days, bigInt(h1).add(h2), bigInt(min1).add(min2), bigInt(s1).add(s2), bigInt(ms1).add(ms2), bigInt(µs1).add(µs2), bigInt(ns1).add(ns2), largestUnit));
	  } else {
	    // relativeTo is a ZonedDateTime
	    const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
	    const timeZone = GetSlot(relativeTo, TIME_ZONE);
	    const calendar = GetSlot(relativeTo, CALENDAR);
	    const intermediateNs = AddZonedDateTime(GetSlot(relativeTo, INSTANT), timeZone, calendar, y1, mon1, w1, d1, h1, min1, s1, ms1, µs1, ns1);
	    const endNs = AddZonedDateTime(new TemporalInstant(intermediateNs), timeZone, calendar, y2, mon2, w2, d2, h2, min2, s2, ms2, µs2, ns2);
	    if (largestUnit !== 'year' && largestUnit !== 'month' && largestUnit !== 'week' && largestUnit !== 'day') {
	      // The user is only asking for a time difference, so return difference of instants.
	      years = 0;
	      months = 0;
	      weeks = 0;
	      days = 0;
	      ({
	        hours,
	        minutes,
	        seconds,
	        milliseconds,
	        microseconds,
	        nanoseconds
	      } = DifferenceInstant(GetSlot(relativeTo, EPOCHNANOSECONDS), endNs, 1, 'nanosecond', largestUnit, 'halfExpand'));
	    } else {
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
	      } = DifferenceZonedDateTime(GetSlot(relativeTo, EPOCHNANOSECONDS), endNs, timeZone, calendar, largestUnit, ObjectCreate$8(null)));
	    }
	  }
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
	function AddInstant(epochNanoseconds, h, min, s, ms, µs, ns) {
	  let sum = bigInt.zero;
	  sum = sum.plus(bigInt(ns));
	  sum = sum.plus(bigInt(µs).multiply(1e3));
	  sum = sum.plus(bigInt(ms).multiply(1e6));
	  sum = sum.plus(bigInt(s).multiply(1e9));
	  sum = sum.plus(bigInt(min).multiply(60 * 1e9));
	  sum = sum.plus(bigInt(h).multiply(60 * 60 * 1e9));
	  const result = bigInt(epochNanoseconds).plus(sum);
	  ValidateEpochNanoseconds(result);
	  return result;
	}
	function AddDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar, years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, options) {
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
	  } = AddTime(hour, minute, second, millisecond, microsecond, nanosecond, hours, minutes, seconds, milliseconds, microseconds, nanoseconds));
	  days += deltaDays;

	  // Delegate the date part addition to the calendar
	  const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
	  const datePart = CreateTemporalDate(year, month, day, calendar);
	  const dateDuration = new TemporalDuration(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
	  const addedDate = CalendarDateAdd(calendar, datePart, dateDuration, options);
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
	function AddZonedDateTime(instant, timeZone, calendar, years, months, weeks, days, h, min, s, ms, µs, ns, options) {
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
	    return AddInstant(GetSlot(instant, EPOCHNANOSECONDS), h, min, s, ms, µs, ns);
	  }

	  // RFC 5545 requires the date portion to be added in calendar days and the
	  // time portion to be added in exact time.
	  let dt = GetPlainDateTimeFor(timeZone, instant, calendar);
	  const datePart = CreateTemporalDate(GetSlot(dt, ISO_YEAR), GetSlot(dt, ISO_MONTH), GetSlot(dt, ISO_DAY), calendar);
	  const dateDuration = new TemporalDuration(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
	  const addedDate = CalendarDateAdd(calendar, datePart, dateDuration, options);
	  const dtIntermediate = CreateTemporalDateTime(GetSlot(addedDate, ISO_YEAR), GetSlot(addedDate, ISO_MONTH), GetSlot(addedDate, ISO_DAY), GetSlot(dt, ISO_HOUR), GetSlot(dt, ISO_MINUTE), GetSlot(dt, ISO_SECOND), GetSlot(dt, ISO_MILLISECOND), GetSlot(dt, ISO_MICROSECOND), GetSlot(dt, ISO_NANOSECOND), calendar);

	  // Note that 'compatible' is used below because this disambiguation behavior
	  // is required by RFC 5545.
	  const instantIntermediate = GetInstantFor(timeZone, dtIntermediate, 'compatible');
	  return AddInstant(GetSlot(instantIntermediate, EPOCHNANOSECONDS), h, min, s, ms, µs, ns);
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
	  const relativeTo = ToRelativeTemporalObject(options);
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
	  } = AddDuration(GetSlot(duration, YEARS), GetSlot(duration, MONTHS), GetSlot(duration, WEEKS), GetSlot(duration, DAYS), GetSlot(duration, HOURS), GetSlot(duration, MINUTES), GetSlot(duration, SECONDS), GetSlot(duration, MILLISECONDS), GetSlot(duration, MICROSECONDS), GetSlot(duration, NANOSECONDS), sign * years, sign * months, sign * weeks, sign * days, sign * hours, sign * minutes, sign * seconds, sign * milliseconds, sign * microseconds, sign * nanoseconds, relativeTo));
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
	  const ns = AddInstant(GetSlot(instant, EPOCHNANOSECONDS), sign * hours, sign * minutes, sign * seconds, sign * milliseconds, sign * microseconds, sign * nanoseconds);
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
	  const calendar = GetSlot(dateTime, CALENDAR);
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
	  } = AddDateTime(GetSlot(dateTime, ISO_YEAR), GetSlot(dateTime, ISO_MONTH), GetSlot(dateTime, ISO_DAY), GetSlot(dateTime, ISO_HOUR), GetSlot(dateTime, ISO_MINUTE), GetSlot(dateTime, ISO_SECOND), GetSlot(dateTime, ISO_MILLISECOND), GetSlot(dateTime, ISO_MICROSECOND), GetSlot(dateTime, ISO_NANOSECOND), calendar, sign * years, sign * months, sign * weeks, sign * days, sign * hours, sign * minutes, sign * seconds, sign * milliseconds, sign * microseconds, sign * nanoseconds, options);
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
	  let {
	    hour,
	    minute,
	    second,
	    millisecond,
	    microsecond,
	    nanosecond
	  } = AddTime(GetSlot(temporalTime, ISO_HOUR), GetSlot(temporalTime, ISO_MINUTE), GetSlot(temporalTime, ISO_SECOND), GetSlot(temporalTime, ISO_MILLISECOND), GetSlot(temporalTime, ISO_MICROSECOND), GetSlot(temporalTime, ISO_NANOSECOND), sign * hours, sign * minutes, sign * seconds, sign * milliseconds, sign * microseconds, sign * nanoseconds);
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
	  ({
	    days
	  } = BalanceTimeDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 'day'));
	  options = GetOptionsObject(options);
	  const calendar = GetSlot(yearMonth, CALENDAR);
	  const fieldNames = CalendarFields(calendar, ['monthCode', 'year']);
	  const fields = PrepareTemporalFields(yearMonth, fieldNames, []);
	  const fieldsCopy = SnapshotOwnProperties(GetOptionsObject(fields), null);
	  fields.day = 1;
	  let startDate = CalendarDateFromFields(calendar, fields);
	  const sign = DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
	  const dateAdd = GetMethod$2(calendar, 'dateAdd');
	  const Duration = GetIntrinsic('%Temporal.Duration%');
	  if (sign < 0) {
	    const oneMonthDuration = new Duration(0, 1, 0, 0, 0, 0, 0, 0, 0, 0);
	    const nextMonth = CalendarDateAdd(calendar, startDate, oneMonthDuration, undefined, dateAdd);
	    const minusDayDuration = new Duration(0, 0, 0, -1, 0, 0, 0, 0, 0, 0);
	    const endOfMonth = CalendarDateAdd(calendar, nextMonth, minusDayDuration, undefined, dateAdd);
	    fieldsCopy.day = CalendarDay(calendar, endOfMonth);
	    startDate = CalendarDateFromFields(calendar, fieldsCopy);
	  }
	  const durationToAdd = new Duration(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
	  const optionsCopy = SnapshotOwnProperties(GetOptionsObject(options), null);
	  const addedDate = CalendarDateAdd(calendar, startDate, durationToAdd, options, dateAdd);
	  const addedDateFields = PrepareTemporalFields(addedDate, fieldNames, []);
	  return CalendarYearMonthFromFields(calendar, addedDateFields, optionsCopy);
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
	  const timeZone = GetSlot(zonedDateTime, TIME_ZONE);
	  const calendar = GetSlot(zonedDateTime, CALENDAR);
	  const epochNanoseconds = AddZonedDateTime(GetSlot(zonedDateTime, INSTANT), timeZone, calendar, sign * years, sign * months, sign * weeks, sign * days, sign * hours, sign * minutes, sign * seconds, sign * milliseconds, sign * microseconds, sign * nanoseconds, options);
	  return CreateTemporalZonedDateTime(epochNanoseconds, timeZone, calendar);
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
	function RoundInstant(epochNs, increment, unit, roundingMode) {
	  let {
	    remainder
	  } = NonNegativeBigIntDivmod(epochNs, 86400e9);
	  const wholeDays = epochNs.minus(remainder);
	  const roundedRemainder = RoundNumberToIncrement(remainder, nsPerTimeUnit[unit] * increment, roundingMode);
	  return wholeDays.plus(roundedRemainder);
	}
	function RoundISODateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, increment, unit, roundingMode) {
	  let dayLengthNs = arguments.length > 12 && arguments[12] !== undefined ? arguments[12] : 86400e9;
	  let deltaDays = 0;
	  ({
	    deltaDays,
	    hour,
	    minute,
	    second,
	    millisecond,
	    microsecond,
	    nanosecond
	  } = RoundTime(hour, minute, second, millisecond, microsecond, nanosecond, increment, unit, roundingMode, dayLengthNs));
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
	  let dayLengthNs = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : 86400e9;
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
	  const nsPerUnit = unit === 'day' ? dayLengthNs : nsPerTimeUnit[unit];
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
	function MoveRelativeDate(calendar, relativeTo, duration, dateAdd) {
	  const later = CalendarDateAdd(calendar, relativeTo, duration, undefined, dateAdd);
	  const days = DaysUntil(relativeTo, later);
	  return {
	    relativeTo: later,
	    days
	  };
	}
	function MoveRelativeZonedDateTime(relativeTo, years, months, weeks, days) {
	  const timeZone = GetSlot(relativeTo, TIME_ZONE);
	  const calendar = GetSlot(relativeTo, CALENDAR);
	  const intermediateNs = AddZonedDateTime(GetSlot(relativeTo, INSTANT), timeZone, calendar, years, months, weeks, days, 0, 0, 0, 0, 0, 0);
	  return CreateTemporalZonedDateTime(intermediateNs, timeZone, calendar);
	}
	function AdjustRoundedDurationDays(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, increment, unit, roundingMode, relativeTo) {
	  if (!IsTemporalZonedDateTime(relativeTo) || unit === 'year' || unit === 'month' || unit === 'week' || unit === 'day' || unit === 'nanosecond' && increment === 1) {
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

	  // There's one more round of rounding possible: if relativeTo is a
	  // ZonedDateTime, the time units could have rounded up into enough hours
	  // to exceed the day length. If this happens, grow the date part by a
	  // single day and re-run exact time rounding on the smaller remainder. DO
	  // NOT RECURSE, because once the extra hours are sucked up into the date
	  // duration, there's no way for another full day to come from the next
	  // round of rounding. And if it were possible (e.g. contrived calendar
	  // with 30-minute-long "days") then it'd risk an infinite loop.
	  let timeRemainderNs = TotalDurationNanoseconds(0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 0);
	  const direction = MathSign(timeRemainderNs.toJSNumber());
	  const timeZone = GetSlot(relativeTo, TIME_ZONE);
	  const calendar = GetSlot(relativeTo, CALENDAR);
	  const dayStart = AddZonedDateTime(GetSlot(relativeTo, INSTANT), timeZone, calendar, years, months, weeks, days, 0, 0, 0, 0, 0, 0);
	  const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
	  const dayEnd = AddZonedDateTime(new TemporalInstant(dayStart), timeZone, calendar, 0, 0, 0, direction, 0, 0, 0, 0, 0, 0);
	  const dayLengthNs = dayEnd.subtract(dayStart);
	  const oneDayLess = timeRemainderNs.subtract(dayLengthNs);
	  if (oneDayLess.multiply(direction).geq(0)) {
	    ({
	      years,
	      months,
	      weeks,
	      days
	    } = AddDuration(years, months, weeks, days, 0, 0, 0, 0, 0, 0, 0, 0, 0, direction, 0, 0, 0, 0, 0, 0, relativeTo));
	    ({
	      hours,
	      minutes,
	      seconds,
	      milliseconds,
	      microseconds,
	      nanoseconds
	    } = RoundDuration(years, months, weeks, days, 0, 0, 0, 0, 0, oneDayLess.toJSNumber(), increment, unit, roundingMode));
	    ({
	      hours,
	      minutes,
	      seconds,
	      milliseconds,
	      microseconds,
	      nanoseconds
	    } = BalanceTimeDuration(0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 'hour'));
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
	function RoundDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, increment, unit, roundingMode) {
	  let relativeTo = arguments.length > 13 && arguments[13] !== undefined ? arguments[13] : undefined;
	  const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
	  let calendar, zonedRelativeTo;
	  if (relativeTo) {
	    if (IsTemporalZonedDateTime(relativeTo)) {
	      zonedRelativeTo = relativeTo;
	      relativeTo = ToTemporalDate(relativeTo);
	    } else if (!IsTemporalDate(relativeTo)) {
	      throw new TypeError('starting point must be PlainDate or ZonedDateTime');
	    }
	    calendar = GetSlot(relativeTo, CALENDAR);
	  }

	  // First convert time units up to days, if rounding to days or higher units.
	  // If rounding relative to a ZonedDateTime, then some days may not be 24h.
	  let dayLengthNs;
	  if (unit === 'year' || unit === 'month' || unit === 'week' || unit === 'day') {
	    nanoseconds = TotalDurationNanoseconds(0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 0);
	    let deltaDays;
	    if (zonedRelativeTo) {
	      const intermediate = MoveRelativeZonedDateTime(zonedRelativeTo, years, months, weeks, days);
	      ({
	        days: deltaDays,
	        nanoseconds,
	        dayLengthNs
	      } = NanosecondsToDays(nanoseconds, intermediate));
	    } else {
	      ({
	        quotient: deltaDays,
	        remainder: nanoseconds
	      } = nanoseconds.divmod(DAY_NANOS));
	      deltaDays = deltaDays.toJSNumber();
	      dayLengthNs = DAY_NANOS.toJSNumber();
	    }
	    days += deltaDays;
	    hours = minutes = seconds = milliseconds = microseconds = 0;
	  }
	  let total;
	  switch (unit) {
	    case 'year':
	      {
	        if (!calendar) throw new RangeError('A starting point is required for years rounding');

	        // convert months and weeks to days by calculating difference(
	        // relativeTo + years, relativeTo + { years, months, weeks })
	        const yearsDuration = new TemporalDuration(years);
	        const dateAdd = typeof calendar !== 'string' ? GetMethod$2(calendar, 'dateAdd') : undefined;
	        const yearsLater = CalendarDateAdd(calendar, relativeTo, yearsDuration, undefined, dateAdd);
	        const yearsMonthsWeeks = new TemporalDuration(years, months, weeks);
	        const yearsMonthsWeeksLater = CalendarDateAdd(calendar, relativeTo, yearsMonthsWeeks, undefined, dateAdd);
	        const monthsWeeksInDays = DaysUntil(yearsLater, yearsMonthsWeeksLater);
	        relativeTo = yearsLater;
	        days += monthsWeeksInDays;
	        const wholeDays = new TemporalDuration(0, 0, 0, days);
	        const wholeDaysLater = CalendarDateAdd(calendar, relativeTo, wholeDays, undefined, dateAdd);
	        const untilOptions = ObjectCreate$8(null);
	        untilOptions.largestUnit = 'year';
	        const yearsPassed = GetSlot(CalendarDateUntil(calendar, relativeTo, wholeDaysLater, untilOptions), YEARS);
	        years += yearsPassed;
	        const yearsPassedDuration = new TemporalDuration(yearsPassed);
	        let daysPassed;
	        ({
	          relativeTo,
	          days: daysPassed
	        } = MoveRelativeDate(calendar, relativeTo, yearsPassedDuration, dateAdd));
	        days -= daysPassed;
	        const oneYear = new TemporalDuration(days < 0 ? -1 : 1);
	        let {
	          days: oneYearDays
	        } = MoveRelativeDate(calendar, relativeTo, oneYear, dateAdd);

	        // Note that `nanoseconds` below (here and in similar code for months,
	        // weeks, and days further below) isn't actually nanoseconds for the
	        // full date range.  Instead, it's a BigInt representation of total
	        // days multiplied by the number of nanoseconds in the last day of
	        // the duration. This lets us do days-or-larger rounding using BigInt
	        // math which reduces precision loss.
	        oneYearDays = MathAbs$1(oneYearDays);
	        const divisor = bigInt(oneYearDays).multiply(dayLengthNs);
	        nanoseconds = divisor.multiply(years).plus(bigInt(days).multiply(dayLengthNs)).plus(nanoseconds);
	        const rounded = RoundNumberToIncrement(nanoseconds, divisor.multiply(increment).toJSNumber(), roundingMode);
	        const {
	          quotient,
	          remainder
	        } = nanoseconds.divmod(divisor);
	        total = quotient.toJSNumber() + remainder.toJSNumber() / divisor;
	        years = rounded.divide(divisor).toJSNumber();
	        nanoseconds = months = weeks = days = 0;
	        break;
	      }
	    case 'month':
	      {
	        if (!calendar) throw new RangeError('A starting point is required for months rounding');

	        // convert weeks to days by calculating difference(relativeTo +
	        //   { years, months }, relativeTo + { years, months, weeks })
	        const yearsMonths = new TemporalDuration(years, months);
	        const dateAdd = typeof calendar !== 'string' ? GetMethod$2(calendar, 'dateAdd') : undefined;
	        const yearsMonthsLater = CalendarDateAdd(calendar, relativeTo, yearsMonths, undefined, dateAdd);
	        const yearsMonthsWeeks = new TemporalDuration(years, months, weeks);
	        const yearsMonthsWeeksLater = CalendarDateAdd(calendar, relativeTo, yearsMonthsWeeks, undefined, dateAdd);
	        const weeksInDays = DaysUntil(yearsMonthsLater, yearsMonthsWeeksLater);
	        relativeTo = yearsMonthsLater;
	        days += weeksInDays;

	        // Months may be different lengths of days depending on the calendar,
	        // convert days to months in a loop as described above under 'years'.
	        const sign = MathSign(days);
	        const oneMonth = new TemporalDuration(0, days < 0 ? -1 : 1);
	        let oneMonthDays;
	        ({
	          relativeTo,
	          days: oneMonthDays
	        } = MoveRelativeDate(calendar, relativeTo, oneMonth, dateAdd));
	        while (MathAbs$1(days) >= MathAbs$1(oneMonthDays)) {
	          months += sign;
	          days -= oneMonthDays;
	          ({
	            relativeTo,
	            days: oneMonthDays
	          } = MoveRelativeDate(calendar, relativeTo, oneMonth, dateAdd));
	        }
	        oneMonthDays = MathAbs$1(oneMonthDays);
	        const divisor = bigInt(oneMonthDays).multiply(dayLengthNs);
	        nanoseconds = divisor.multiply(months).plus(bigInt(days).multiply(dayLengthNs)).plus(nanoseconds);
	        const rounded = RoundNumberToIncrement(nanoseconds, divisor.multiply(increment), roundingMode);
	        const {
	          quotient,
	          remainder
	        } = nanoseconds.divmod(divisor);
	        total = quotient.toJSNumber() + remainder.toJSNumber() / divisor;
	        months = rounded.divide(divisor).toJSNumber();
	        nanoseconds = weeks = days = 0;
	        break;
	      }
	    case 'week':
	      {
	        if (!calendar) throw new RangeError('A starting point is required for weeks rounding');
	        // Weeks may be different lengths of days depending on the calendar,
	        // convert days to weeks in a loop as described above under 'years'.
	        const sign = MathSign(days);
	        const oneWeek = new TemporalDuration(0, 0, days < 0 ? -1 : 1);
	        const dateAdd = typeof calendar !== 'string' ? GetMethod$2(calendar, 'dateAdd') : undefined;
	        let oneWeekDays;
	        ({
	          relativeTo,
	          days: oneWeekDays
	        } = MoveRelativeDate(calendar, relativeTo, oneWeek, dateAdd));
	        while (MathAbs$1(days) >= MathAbs$1(oneWeekDays)) {
	          weeks += sign;
	          days -= oneWeekDays;
	          ({
	            relativeTo,
	            days: oneWeekDays
	          } = MoveRelativeDate(calendar, relativeTo, oneWeek, dateAdd));
	        }
	        oneWeekDays = MathAbs$1(oneWeekDays);
	        const divisor = bigInt(oneWeekDays).multiply(dayLengthNs);
	        nanoseconds = divisor.multiply(weeks).plus(bigInt(days).multiply(dayLengthNs)).plus(nanoseconds);
	        const rounded = RoundNumberToIncrement(nanoseconds, divisor.multiply(increment), roundingMode);
	        const {
	          quotient,
	          remainder
	        } = nanoseconds.divmod(divisor);
	        total = quotient.toJSNumber() + remainder.toJSNumber() / divisor;
	        weeks = rounded.divide(divisor).toJSNumber();
	        nanoseconds = days = 0;
	        break;
	      }
	    case 'day':
	      {
	        const divisor = bigInt(dayLengthNs);
	        nanoseconds = divisor.multiply(days).plus(nanoseconds);
	        const rounded = RoundNumberToIncrement(nanoseconds, divisor.multiply(increment), roundingMode);
	        const {
	          quotient,
	          remainder
	        } = nanoseconds.divmod(divisor);
	        total = quotient.toJSNumber() + remainder.toJSNumber() / divisor;
	        days = rounded.divide(divisor).toJSNumber();
	        nanoseconds = 0;
	        break;
	      }
	    case 'hour':
	      {
	        const divisor = 3600e9;
	        nanoseconds = bigInt(hours).multiply(3600e9).plus(bigInt(minutes).multiply(60e9)).plus(bigInt(seconds).multiply(1e9)).plus(bigInt(milliseconds).multiply(1e6)).plus(bigInt(microseconds).multiply(1e3)).plus(nanoseconds);
	        const {
	          quotient,
	          remainder
	        } = nanoseconds.divmod(divisor);
	        total = quotient.toJSNumber() + remainder.toJSNumber() / divisor;
	        const rounded = RoundNumberToIncrement(nanoseconds, divisor * increment, roundingMode);
	        hours = rounded.divide(divisor).toJSNumber();
	        minutes = seconds = milliseconds = microseconds = nanoseconds = 0;
	        break;
	      }
	    case 'minute':
	      {
	        const divisor = 60e9;
	        nanoseconds = bigInt(minutes).multiply(60e9).plus(bigInt(seconds).multiply(1e9)).plus(bigInt(milliseconds).multiply(1e6)).plus(bigInt(microseconds).multiply(1e3)).plus(nanoseconds);
	        const {
	          quotient,
	          remainder
	        } = nanoseconds.divmod(divisor);
	        total = quotient.toJSNumber() + remainder.toJSNumber() / divisor;
	        const rounded = RoundNumberToIncrement(nanoseconds, divisor * increment, roundingMode);
	        minutes = rounded.divide(divisor).toJSNumber();
	        seconds = milliseconds = microseconds = nanoseconds = 0;
	        break;
	      }
	    case 'second':
	      {
	        const divisor = 1e9;
	        nanoseconds = bigInt(seconds).multiply(1e9).plus(bigInt(milliseconds).multiply(1e6)).plus(bigInt(microseconds).multiply(1e3)).plus(nanoseconds);
	        const {
	          quotient,
	          remainder
	        } = nanoseconds.divmod(divisor);
	        total = quotient.toJSNumber() + remainder.toJSNumber() / divisor;
	        const rounded = RoundNumberToIncrement(nanoseconds, divisor * increment, roundingMode);
	        seconds = rounded.divide(divisor).toJSNumber();
	        milliseconds = microseconds = nanoseconds = 0;
	        break;
	      }
	    case 'millisecond':
	      {
	        const divisor = 1e6;
	        nanoseconds = bigInt(milliseconds).multiply(1e6).plus(bigInt(microseconds).multiply(1e3)).plus(nanoseconds);
	        const {
	          quotient,
	          remainder
	        } = nanoseconds.divmod(divisor);
	        total = quotient.toJSNumber() + remainder.toJSNumber() / divisor;
	        const rounded = RoundNumberToIncrement(nanoseconds, divisor * increment, roundingMode);
	        milliseconds = rounded.divide(divisor).toJSNumber();
	        microseconds = nanoseconds = 0;
	        break;
	      }
	    case 'microsecond':
	      {
	        const divisor = 1e3;
	        nanoseconds = bigInt(microseconds).multiply(1e3).plus(nanoseconds);
	        const {
	          quotient,
	          remainder
	        } = nanoseconds.divmod(divisor);
	        total = quotient.toJSNumber() + remainder.toJSNumber() / divisor;
	        const rounded = RoundNumberToIncrement(nanoseconds, divisor * increment, roundingMode);
	        microseconds = rounded.divide(divisor).toJSNumber();
	        nanoseconds = 0;
	        break;
	      }
	    case 'nanosecond':
	      {
	        total = nanoseconds;
	        nanoseconds = RoundNumberToIncrement(bigInt(nanoseconds), increment, roundingMode).toJSNumber();
	        break;
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
	    nanoseconds,
	    total
	  };
	}
	function CompareISODate(y1, m1, d1, y2, m2, d2) {
	  if (y1 !== y2) return ComparisonResult(y1 - y2);
	  if (m1 !== m2) return ComparisonResult(m1 - m2);
	  if (d1 !== d2) return ComparisonResult(d1 - d2);
	  return 0;
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
	  if (options === undefined) return ObjectCreate$8(null);
	  if (Type$6(options) === 'Object') return options;
	  throw new TypeError("Options parameter must be an object, not ".concat(options === null ? 'null' : "a ".concat(typeof options)));
	}
	function SnapshotOwnProperties(source, proto) {
	  let excludedKeys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
	  let excludedValues = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
	  const copy = ObjectCreate$8(proto);
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
	  return Call$1(ArrayIncludes$1, BUILTIN_CALENDAR_IDS, [ASCIILowercase(id)]);
	}
	function ASCIILowercase(str) {
	  // The spec defines this operation distinct from String.prototype.lowercase,
	  // so we'll follow the spec here. Note that nasty security issues that can
	  // happen for some use cases if you're comparing case-modified non-ASCII
	  // values. For example, Turkish's "I" character was the source of a security
	  // issue involving "file://" URLs. See
	  // https://haacked.com/archive/2012/07/05/turkish-i-problem-and-why-you-should-care.aspx/.
	  return Call$1(StringPrototypeReplace, str, [/[A-Z]/g, l => {
	    const code = Call$1(StringPrototypeCharCodeAt, l, [0]);
	    return StringFromCharCode(code + 0x20);
	  }]);
	}
	const OFFSET = new RegExp("^".concat(offset.source, "$"));
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
	const descriptor = value => {
	  return {
	    value,
	    enumerable: true,
	    writable: false,
	    configurable: true
	  };
	};
	const IntlDateTimeFormat$1 = globalThis.Intl.DateTimeFormat;
	const ObjectAssign$2 = Object.assign;

	// Construction of built-in Intl.DateTimeFormat objects is sloooooow,
	// so we'll only create those instances when we need them.
	// See https://bugs.chromium.org/p/v8/issues/detail?id=6528
	function getPropLazy(obj, prop) {
	  let val = obj[prop];
	  if (typeof val === 'function') {
	    val = new IntlDateTimeFormat$1(obj[LOCALE], val(obj[OPTIONS]));
	    obj[prop] = val;
	  }
	  return val;
	}
	function DateTimeFormat() {
	  let locale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	  if (!(this instanceof DateTimeFormat)) return new DateTimeFormat(locale, options);
	  const hasOptions = typeof options !== 'undefined';
	  options = hasOptions ? ObjectAssign$2({}, options) : {};
	  const original = new IntlDateTimeFormat$1(locale, options);
	  const ro = original.resolvedOptions();

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
	    const clonedResolved = ObjectAssign$2({}, ro);
	    for (const prop in clonedResolved) {
	      if (!HasOwnProperty$1(options, prop)) delete clonedResolved[prop];
	    }
	    this[OPTIONS] = clonedResolved;
	  } else {
	    this[OPTIONS] = options;
	  }
	  this[LOCALE] = ro.locale;
	  this[ORIGINAL] = original;
	  this[TZ_CANONICAL] = ro.timeZone;
	  this[CAL_ID] = ro.calendar;
	  this[DATE] = dateAmend;
	  this[YM] = yearMonthAmend;
	  this[MD] = monthDayAmend;
	  this[TIME] = timeAmend;
	  this[DATETIME] = datetimeAmend;
	  this[INST] = instantAmend;

	  // Save the original time zone, for a few reasons:
	  // - Clearer error messages
	  // - More clearly follows the spec for InitializeDateTimeFormat
	  // - Because it follows the spec more closely, will make it easier to integrate
	  //   support of offset strings and other potential changes like proposal-canonical-tz.
	  const timeZoneOption = hasOptions ? options.timeZone : undefined;
	  if (timeZoneOption === undefined) {
	    this[TZ_ORIGINAL] = ro.timeZone;
	  } else {
	    const id = ToString$1(timeZoneOption);
	    if (IsTimeZoneOffsetString(id)) {
	      // Note: https://github.com/tc39/ecma402/issues/683 will remove this
	      throw new RangeError('Intl.DateTimeFormat does not currently support offset time zones');
	    }
	    const record = GetAvailableNamedTimeZoneIdentifier(id);
	    if (!record) throw new RangeError("Intl.DateTimeFormat formats built-in time zones, not ".concat(id));
	    this[TZ_ORIGINAL] = record.identifier;
	  }
	}
	DateTimeFormat.supportedLocalesOf = function () {
	  return IntlDateTimeFormat$1.supportedLocalesOf(...arguments);
	};
	const properties = {
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
	Object.defineProperty(DateTimeFormat, 'prototype', {
	  writable: false,
	  enumerable: false,
	  configurable: false
	});
	function resolvedOptions() {
	  const resolved = this[ORIGINAL].resolvedOptions();
	  resolved.timeZone = this[TZ_CANONICAL];
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
	  for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    rest[_key - 1] = arguments[_key];
	  }
	  return this[ORIGINAL].format(datetime, ...rest);
	}
	function formatToParts(datetime) {
	  let {
	    instant,
	    formatter
	  } = extractOverrides(datetime, this);
	  if (instant && formatter) {
	    return formatter.formatToParts(instant.epochMilliseconds);
	  }
	  for (var _len2 = arguments.length, rest = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	    rest[_key2 - 1] = arguments[_key2];
	  }
	  return this[ORIGINAL].formatToParts(datetime, ...rest);
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
	  return this[ORIGINAL].formatRange(a, b);
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
	  return this[ORIGINAL].formatRangeToParts(a, b);
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
	  options = amend(options, {
	    day: false,
	    hour: false,
	    minute: false,
	    second: false,
	    weekday: false,
	    dayPeriod: false,
	    timeZoneName: false,
	    dateStyle: false,
	    timeStyle: false
	  });
	  if (!('year' in options || 'month' in options)) {
	    options = ObjectAssign$2(options, {
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
	    dayPeriod: false,
	    timeZoneName: false,
	    dateStyle: false,
	    timeStyle: false
	  });
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
	  const DateTime = GetIntrinsic('%Temporal.PlainDateTime%');
	  if (IsTemporalTime(temporalObj)) {
	    const hour = GetSlot(temporalObj, ISO_HOUR);
	    const minute = GetSlot(temporalObj, ISO_MINUTE);
	    const second = GetSlot(temporalObj, ISO_SECOND);
	    const millisecond = GetSlot(temporalObj, ISO_MILLISECOND);
	    const microsecond = GetSlot(temporalObj, ISO_MICROSECOND);
	    const nanosecond = GetSlot(temporalObj, ISO_NANOSECOND);
	    const datetime = new DateTime(1970, 1, 1, hour, minute, second, millisecond, microsecond, nanosecond, main[CAL_ID]);
	    return {
	      instant: GetInstantFor(main[TZ_CANONICAL], datetime, 'compatible'),
	      formatter: getPropLazy(main, TIME)
	    };
	  }
	  if (IsTemporalYearMonth(temporalObj)) {
	    const isoYear = GetSlot(temporalObj, ISO_YEAR);
	    const isoMonth = GetSlot(temporalObj, ISO_MONTH);
	    const referenceISODay = GetSlot(temporalObj, ISO_DAY);
	    const calendar = ToTemporalCalendarIdentifier(GetSlot(temporalObj, CALENDAR));
	    if (calendar !== main[CAL_ID]) {
	      throw new RangeError("cannot format PlainYearMonth with calendar ".concat(calendar, " in locale with calendar ").concat(main[CAL_ID]));
	    }
	    const datetime = new DateTime(isoYear, isoMonth, referenceISODay, 12, 0, 0, 0, 0, 0, calendar);
	    return {
	      instant: GetInstantFor(main[TZ_CANONICAL], datetime, 'compatible'),
	      formatter: getPropLazy(main, YM)
	    };
	  }
	  if (IsTemporalMonthDay(temporalObj)) {
	    const referenceISOYear = GetSlot(temporalObj, ISO_YEAR);
	    const isoMonth = GetSlot(temporalObj, ISO_MONTH);
	    const isoDay = GetSlot(temporalObj, ISO_DAY);
	    const calendar = ToTemporalCalendarIdentifier(GetSlot(temporalObj, CALENDAR));
	    if (calendar !== main[CAL_ID]) {
	      throw new RangeError("cannot format PlainMonthDay with calendar ".concat(calendar, " in locale with calendar ").concat(main[CAL_ID]));
	    }
	    const datetime = new DateTime(referenceISOYear, isoMonth, isoDay, 12, 0, 0, 0, 0, 0, calendar);
	    return {
	      instant: GetInstantFor(main[TZ_CANONICAL], datetime, 'compatible'),
	      formatter: getPropLazy(main, MD)
	    };
	  }
	  if (IsTemporalDate(temporalObj)) {
	    const isoYear = GetSlot(temporalObj, ISO_YEAR);
	    const isoMonth = GetSlot(temporalObj, ISO_MONTH);
	    const isoDay = GetSlot(temporalObj, ISO_DAY);
	    const calendar = ToTemporalCalendarIdentifier(GetSlot(temporalObj, CALENDAR));
	    if (calendar !== 'iso8601' && calendar !== main[CAL_ID]) {
	      throw new RangeError("cannot format PlainDate with calendar ".concat(calendar, " in locale with calendar ").concat(main[CAL_ID]));
	    }
	    const datetime = new DateTime(isoYear, isoMonth, isoDay, 12, 0, 0, 0, 0, 0, main[CAL_ID]);
	    return {
	      instant: GetInstantFor(main[TZ_CANONICAL], datetime, 'compatible'),
	      formatter: getPropLazy(main, DATE)
	    };
	  }
	  if (IsTemporalDateTime(temporalObj)) {
	    const isoYear = GetSlot(temporalObj, ISO_YEAR);
	    const isoMonth = GetSlot(temporalObj, ISO_MONTH);
	    const isoDay = GetSlot(temporalObj, ISO_DAY);
	    const hour = GetSlot(temporalObj, ISO_HOUR);
	    const minute = GetSlot(temporalObj, ISO_MINUTE);
	    const second = GetSlot(temporalObj, ISO_SECOND);
	    const millisecond = GetSlot(temporalObj, ISO_MILLISECOND);
	    const microsecond = GetSlot(temporalObj, ISO_MICROSECOND);
	    const nanosecond = GetSlot(temporalObj, ISO_NANOSECOND);
	    const calendar = ToTemporalCalendarIdentifier(GetSlot(temporalObj, CALENDAR));
	    if (calendar !== 'iso8601' && calendar !== main[CAL_ID]) {
	      throw new RangeError("cannot format PlainDateTime with calendar ".concat(calendar, " in locale with calendar ").concat(main[CAL_ID]));
	    }
	    let datetime = temporalObj;
	    if (calendar === 'iso8601') {
	      datetime = new DateTime(isoYear, isoMonth, isoDay, hour, minute, second, millisecond, microsecond, nanosecond, main[CAL_ID]);
	    }
	    return {
	      instant: GetInstantFor(main[TZ_CANONICAL], datetime, 'compatible'),
	      formatter: getPropLazy(main, DATETIME)
	    };
	  }
	  if (IsTemporalZonedDateTime(temporalObj)) {
	    throw new TypeError('Temporal.ZonedDateTime not supported in DateTimeFormat methods. Use toLocaleString() instead.');
	  }
	  if (IsTemporalInstant(temporalObj)) {
	    return {
	      instant: temporalObj,
	      formatter: getPropLazy(main, INST)
	    };
	  }
	  return {};
	}

	var Intl$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		DateTimeFormat: DateTimeFormat
	});

	/* global true */

	const ObjectCreate$7 = Object.create;
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
	      const repr = TemporalInstantToString(this, undefined, 'auto');
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
	    if (Type$6(roundTo) === 'String') {
	      const stringParam = roundTo;
	      roundTo = ObjectCreate$7(null);
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
	    throw new TypeError('use compare() or equals() to compare Temporal.Instant');
	  }
	  toZonedDateTime(item) {
	    if (!IsTemporalInstant(this)) throw new TypeError('invalid receiver');
	    if (Type$6(item) !== 'Object') {
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

	const ArrayIncludes = Array.prototype.includes;
	const ArrayPrototypePush$3 = Array.prototype.push;
	const IntlDateTimeFormat = globalThis.Intl.DateTimeFormat;
	const ArraySort = Array.prototype.sort;
	const MathAbs = Math.abs;
	const MathFloor = Math.floor;
	const ObjectAssign$1 = Object.assign;
	const ObjectCreate$6 = Object.create;
	const ObjectEntries = Object.entries;
	const OriginalSet = Set;
	const ReflectOwnKeys = Reflect.ownKeys;
	const SetPrototypeAdd$2 = Set.prototype.add;
	const SetPrototypeValues = Set.prototype.values;
	const impl = {};
	class Calendar {
	  constructor(id) {
	    // Note: if the argument is not passed, IsBuiltinCalendar("undefined") will fail. This check
	    //       exists only to improve the error message.
	    if (arguments.length < 1) {
	      throw new RangeError('missing argument: id is required');
	    }
	    id = ToString$1(id);
	    if (!IsBuiltinCalendar(id)) throw new RangeError("invalid calendar identifier ".concat(id));
	    CreateSlots(this);
	    SetSlot(this, CALENDAR_ID, ASCIILowercase(id));
	    {
	      Object.defineProperty(this, '_repr_', {
	        value: "".concat(this[Symbol.toStringTag], " <").concat(id, ">"),
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
	    if (Type$6(fields) !== 'Object') throw new TypeError('invalid fields');
	    options = GetOptionsObject(options);
	    const id = GetSlot(this, CALENDAR_ID);
	    return impl[id].dateFromFields(fields, options, id);
	  }
	  yearMonthFromFields(fields) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    if (Type$6(fields) !== 'Object') throw new TypeError('invalid fields');
	    options = GetOptionsObject(options);
	    const id = GetSlot(this, CALENDAR_ID);
	    return impl[id].yearMonthFromFields(fields, options, id);
	  }
	  monthDayFromFields(fields) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    if (Type$6(fields) !== 'Object') throw new TypeError('invalid fields');
	    options = GetOptionsObject(options);
	    const id = GetSlot(this, CALENDAR_ID);
	    return impl[id].monthDayFromFields(fields, options, id);
	  }
	  fields(fields) {
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    const fieldsArray = [];
	    const allowed = new Set(['year', 'month', 'monthCode', 'day', 'hour', 'minute', 'second', 'millisecond', 'microsecond', 'nanosecond']);
	    for (const name of fields) {
	      if (Type$6(name) !== 'String') throw new TypeError('invalid fields');
	      if (!allowed.has(name)) throw new RangeError("invalid field name ".concat(name));
	      allowed.delete(name);
	      Call$1(ArrayPrototypePush$3, fieldsArray, [name]);
	    }
	    return impl[GetSlot(this, CALENDAR_ID)].fields(fieldsArray);
	  }
	  mergeFields(fields, additionalFields) {
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    const fieldsCopy = SnapshotOwnProperties(ToObject$1(fields), null, [], [undefined]);
	    const additionalFieldsCopy = SnapshotOwnProperties(ToObject$1(additionalFields), null, [], [undefined]);
	    const additionalKeys = ReflectOwnKeys(additionalFieldsCopy);
	    const overriddenKeys = impl[GetSlot(this, CALENDAR_ID)].fieldKeysToIgnore(additionalKeys);
	    const merged = ObjectCreate$6(null);
	    const fieldsKeys = ReflectOwnKeys(fieldsCopy);
	    for (const key of fieldsKeys) {
	      let propValue = undefined;
	      if (Call$1(ArrayIncludes, overriddenKeys, [key])) propValue = additionalFieldsCopy[key];else propValue = fieldsCopy[key];
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
	    const {
	      days
	    } = BalanceTimeDuration(GetSlot(duration, DAYS), GetSlot(duration, HOURS), GetSlot(duration, MINUTES), GetSlot(duration, SECONDS), GetSlot(duration, MILLISECONDS), GetSlot(duration, MICROSECONDS), GetSlot(duration, NANOSECONDS), 'day');
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
	  weekOfYear(date) {
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    date = ToTemporalDate(date);
	    return impl[GetSlot(this, CALENDAR_ID)].weekOfYear(date);
	  }
	  yearOfWeek(date) {
	    if (!IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
	    date = ToTemporalDate(date);
	    return impl[GetSlot(this, CALENDAR_ID)].yearOfWeek(date);
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
	    if (fields.month !== undefined && fields.year === undefined && fields.monthCode === undefined) {
	      throw new TypeError('either year or monthCode required with month');
	    }
	    const useYear = fields.monthCode === undefined;
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
	    } = RegulateISODate(useYear ? year : referenceISOYear, month, day, overflow));
	    return CreateTemporalMonthDay(month, day, calendarSlotValue, referenceISOYear);
	  },
	  fields(fields) {
	    return fields;
	  },
	  fieldKeysToIgnore(keys) {
	    const result = new OriginalSet();
	    for (let ix = 0; ix < keys.length; ix++) {
	      const key = keys[ix];
	      Call$1(SetPrototypeAdd$2, result, [key]);
	      if (key === 'month') {
	        Call$1(SetPrototypeAdd$2, result, ['monthCode']);
	      } else if (key === 'monthCode') {
	        Call$1(SetPrototypeAdd$2, result, ['month']);
	      }
	    }
	    return [...Call$1(SetPrototypeValues, result, [])];
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
	  weekOfYear(date) {
	    return WeekOfYear(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH), GetSlot(date, ISO_DAY)).week;
	  },
	  yearOfWeek(date) {
	    return WeekOfYear(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH), GetSlot(date, ISO_DAY)).year;
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
	    this.map = new Map();
	    this.calls = 0;
	    this.now = globalThis.performance ? globalThis.performance.now() : Date.now();
	    this.hits = 0;
	    this.misses = 0;
	    if (cacheToClone !== undefined) {
	      let i = 0;
	      for (const entry of cacheToClone.map.entries()) {
	        if (++i > OneObjectCache.MAX_CACHE_ENTRIES) break;
	        this.map.set(...entry);
	      }
	    }
	  }
	  get(key) {
	    const result = this.map.get(key);
	    if (result) {
	      this.hits++;
	      this.report();
	    }
	    this.calls++;
	    return result;
	  }
	  set(key, value) {
	    this.map.set(key, value);
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
	    if (OneObjectCache.objectMap.get(obj)) throw new RangeError('object already cached');
	    OneObjectCache.objectMap.set(obj, this);
	    this.report();
	  }
	}
	OneObjectCache.objectMap = new WeakMap();
	OneObjectCache.MAX_CACHE_ENTRIES = 1000;
	/**
	 * Returns a WeakMap-backed cache that's used to store expensive results
	 * that are associated with a particular Temporal object instance.
	 *
	 * @param obj - object to associate with the cache
	 */
	OneObjectCache.getCacheForObject = function (obj) {
	  let cache = OneObjectCache.objectMap.get(obj);
	  if (!cache) {
	    cache = new OneObjectCache();
	    OneObjectCache.objectMap.set(obj, cache);
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
	    // into each each calendar's implementation before any cache is created, so
	    // each calendar gets its own separate cached formatter.
	    if (typeof this.formatter === 'undefined') {
	      this.formatter = new IntlDateTimeFormat("en-US-u-ca-".concat(this.id), {
	        day: 'numeric',
	        month: 'numeric',
	        year: 'numeric',
	        era: this.eraLength,
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
	        throw new RangeError("monthCode must be a string, not ".concat(Type$6(monthCode).toLowerCase()));
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
	        throw new RangeError("properties 'era' and 'eraYear' must be provided together");
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
	      // a calendar skipped days, like the Julian->Gregorian switchover. But the
	      // only ICU calendars that currently skip days (japanese/roc/buddhist) is
	      // a bug (https://bugs.chromium.org/p/chromium/issues/detail?id=1173158)
	      // that's currently detected by `checkIcuBugs()` which will throw. So
	      // this optimization should be safe for all ICU calendars.
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
	    // If the initial guess is not in the same month, then then bisect the
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
	    // calendar skipped days, like the Julian->Gregorian switchover. But the
	    // only ICU calendars that currently skip days (japanese/roc/buddhist) is a
	    // bug (https://bugs.chromium.org/p/chromium/issues/detail?id=1173158)
	    // that's currently detected by `checkIcuBugs()` which will throw. So this
	    // code should be safe for all ICU calendars.
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
	  // The short era format works for all calendars except Japanese, which will
	  // override.
	  eraLength: 'short',
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
	    // In leap years, the 12th month has 30 days. In non-leap years: 29.
	    const days = this.daysInMonth({
	      year: calendarDate.year,
	      month: 12,
	      day: 1
	    }, cache);
	    return days === 30;
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
	    // Same logic (count days in the last month) for Persian as for Islamic,
	    // even though Persian is solar and Islamic is lunar.
	    return helperIslamic.inLeapYear(calendarDate, cache);
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
	  Call$1(ArraySort, eras, [(e1, e2) => {
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
	    },
	    // Several calendars based on the Gregorian calendar use Julian dates (not
	    // proleptic Gregorian dates) before the Julian switchover in Oct 1582. See
	    // https://bugs.chromium.org/p/chromium/issues/detail?id=1173158.
	    v8IsVulnerableToJulianBug: new Date('+001001-01-01T00:00Z').toLocaleDateString('en-US-u-ca-japanese', {
	      timeZone: 'UTC'
	    }).startsWith('12'),
	    calendarIsVulnerableToJulianBug: false,
	    checkIcuBugs(isoDate) {
	      if (this.calendarIsVulnerableToJulianBug && this.v8IsVulnerableToJulianBug) {
	        const beforeJulianSwitch = CompareISODate(isoDate.year, isoDate.month, isoDate.day, 1582, 10, 15) < 0;
	        if (beforeJulianSwitch) {
	          throw new RangeError("calendar '".concat(this.id, "' is broken for ISO dates before 1582-10-15") + ' (see https://bugs.chromium.org/p/chromium/issues/detail?id=1173158)');
	        }
	      }
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
	const helperRoc = ObjectAssign$1({}, makeHelperGregorian('roc', [{
	  name: 'minguo',
	  isoEpoch: {
	    year: 1912,
	    month: 1,
	    day: 1
	  }
	}, {
	  name: 'before-roc',
	  reverseOf: 'minguo'
	}]), {
	  calendarIsVulnerableToJulianBug: true
	});
	const helperBuddhist = ObjectAssign$1({}, makeHelperGregorian('buddhist', [{
	  name: 'be',
	  hasYearZero: true,
	  isoEpoch: {
	    year: -543,
	    month: 1,
	    day: 1
	  }
	}]), {
	  calendarIsVulnerableToJulianBug: true
	});
	const helperGregory = ObjectAssign$1({}, makeHelperGregorian('gregory', [{
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
	makeHelperGregorian('japanese', [
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
	  // The last 3 Japanese eras confusingly return only one character in the
	  // default "short" era, so need to use the long format.
	  eraLength: 'long',
	  erasBeginMidYear: true,
	  calendarIsVulnerableToJulianBug: true,
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
	  dateFromFields(fields, options, calendarSlotValue) {
	    const cache = new OneObjectCache();
	    const fieldNames = this.fields(['day', 'month', 'monthCode', 'year']);
	    fields = PrepareTemporalFields(fields, fieldNames, []);
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
	    const fieldNames = this.fields(['month', 'monthCode', 'year']);
	    fields = PrepareTemporalFields(fields, fieldNames, []);
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
	    const fieldNames = this.fields(['day', 'month', 'monthCode', 'year']);
	    fields = PrepareTemporalFields(fields, fieldNames, []);
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
	    if (Call$1(ArrayIncludes, fields, ['year'])) fields = [...fields, 'era', 'eraYear'];
	    return fields;
	  },
	  fieldKeysToIgnore(keys) {
	    const result = new OriginalSet();
	    for (let ix = 0; ix < keys.length; ix++) {
	      const key = keys[ix];
	      Call$1(SetPrototypeAdd$2, result, [key]);
	      switch (key) {
	        case 'era':
	          Call$1(SetPrototypeAdd$2, result, ['eraYear']);
	          Call$1(SetPrototypeAdd$2, result, ['year']);
	          break;
	        case 'eraYear':
	          Call$1(SetPrototypeAdd$2, result, ['era']);
	          Call$1(SetPrototypeAdd$2, result, ['year']);
	          break;
	        case 'year':
	          Call$1(SetPrototypeAdd$2, result, ['era']);
	          Call$1(SetPrototypeAdd$2, result, ['eraYear']);
	          break;
	        case 'month':
	          Call$1(SetPrototypeAdd$2, result, ['monthCode']);
	          // See https://github.com/tc39/proposal-temporal/issues/1784
	          if (this.helper.erasBeginMidYear) {
	            Call$1(SetPrototypeAdd$2, result, ['era']);
	            Call$1(SetPrototypeAdd$2, result, ['eraYear']);
	          }
	          break;
	        case 'monthCode':
	          Call$1(SetPrototypeAdd$2, result, ['month']);
	          if (this.helper.erasBeginMidYear) {
	            Call$1(SetPrototypeAdd$2, result, ['era']);
	            Call$1(SetPrototypeAdd$2, result, ['eraYear']);
	          }
	          break;
	        case 'day':
	          if (this.helper.erasBeginMidYear) {
	            Call$1(SetPrototypeAdd$2, result, ['era']);
	            Call$1(SetPrototypeAdd$2, result, ['eraYear']);
	          }
	          break;
	      }
	    }
	    return [...Call$1(SetPrototypeValues, result, [])];
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
	    const calendarDate = this.helper.isoToCalendarDate(date, cache);
	    const startOfYear = this.helper.startOfCalendarYear(calendarDate);
	    const diffDays = this.helper.calendarDaysUntil(startOfYear, calendarDate, cache);
	    return diffDays + 1;
	  },
	  weekOfYear(date) {
	    return impl['iso8601'].weekOfYear(date);
	  },
	  yearOfWeek(date) {
	    return impl['iso8601'].yearOfWeek(date);
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
	    return CalendarDay(GetSlot(this, CALENDAR), this);
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
	    if (Type$6(temporalDateLike) !== 'Object') {
	      throw new TypeError('invalid argument');
	    }
	    RejectTemporalLikeObject(temporalDateLike);
	    options = GetOptionsObject(options);
	    const calendar = GetSlot(this, CALENDAR);
	    const fieldNames = CalendarFields(calendar, ['day', 'month', 'monthCode', 'year']);
	    let fields = PrepareTemporalFields(this, fieldNames, []);
	    const partialDate = PrepareTemporalFields(temporalDateLike, fieldNames, 'partial');
	    fields = CalendarMergeFields(calendar, fields, partialDate);
	    fields = PrepareTemporalFields(fields, fieldNames, []);
	    return CalendarDateFromFields(calendar, fields, options);
	  }
	  withCalendar(calendar) {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    calendar = ToTemporalCalendarSlotValue(calendar);
	    return new PlainDate(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), calendar);
	  }
	  add(temporalDurationLike) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    const duration = ToTemporalDuration(temporalDurationLike);
	    options = GetOptionsObject(options);
	    return CalendarDateAdd(GetSlot(this, CALENDAR), this, duration, options);
	  }
	  subtract(temporalDurationLike) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    const duration = CreateNegatedTemporalDuration(ToTemporalDuration(temporalDurationLike));
	    options = GetOptionsObject(options);
	    return CalendarDateAdd(GetSlot(this, CALENDAR), this, duration, options);
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
	    throw new TypeError('use compare() or equals() to compare Temporal.PlainDate');
	  }
	  toPlainDateTime() {
	    let temporalTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    const year = GetSlot(this, ISO_YEAR);
	    const month = GetSlot(this, ISO_MONTH);
	    const day = GetSlot(this, ISO_DAY);
	    const calendar = GetSlot(this, CALENDAR);
	    if (temporalTime === undefined) return CreateTemporalDateTime(year, month, day, 0, 0, 0, 0, 0, 0, calendar);
	    temporalTime = ToTemporalTime(temporalTime);
	    const hour = GetSlot(temporalTime, ISO_HOUR);
	    const minute = GetSlot(temporalTime, ISO_MINUTE);
	    const second = GetSlot(temporalTime, ISO_SECOND);
	    const millisecond = GetSlot(temporalTime, ISO_MILLISECOND);
	    const microsecond = GetSlot(temporalTime, ISO_MICROSECOND);
	    const nanosecond = GetSlot(temporalTime, ISO_NANOSECOND);
	    return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
	  }
	  toZonedDateTime(item) {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    let timeZone, temporalTime;
	    if (Type$6(item) === 'Object') {
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
	    const year = GetSlot(this, ISO_YEAR);
	    const month = GetSlot(this, ISO_MONTH);
	    const day = GetSlot(this, ISO_DAY);
	    const calendar = GetSlot(this, CALENDAR);
	    let hour = 0,
	      minute = 0,
	      second = 0,
	      millisecond = 0,
	      microsecond = 0,
	      nanosecond = 0;
	    if (temporalTime !== undefined) {
	      temporalTime = ToTemporalTime(temporalTime);
	      hour = GetSlot(temporalTime, ISO_HOUR);
	      minute = GetSlot(temporalTime, ISO_MINUTE);
	      second = GetSlot(temporalTime, ISO_SECOND);
	      millisecond = GetSlot(temporalTime, ISO_MILLISECOND);
	      microsecond = GetSlot(temporalTime, ISO_MICROSECOND);
	      nanosecond = GetSlot(temporalTime, ISO_NANOSECOND);
	    }
	    const dt = CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
	    const instant = GetInstantFor(timeZone, dt, 'compatible');
	    return CreateTemporalZonedDateTime(GetSlot(instant, EPOCHNANOSECONDS), timeZone, calendar);
	  }
	  toPlainYearMonth() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    const calendar = GetSlot(this, CALENDAR);
	    const fieldNames = CalendarFields(calendar, ['monthCode', 'year']);
	    const fields = PrepareTemporalFields(this, fieldNames, []);
	    return CalendarYearMonthFromFields(calendar, fields);
	  }
	  toPlainMonthDay() {
	    if (!IsTemporalDate(this)) throw new TypeError('invalid receiver');
	    const calendar = GetSlot(this, CALENDAR);
	    const fieldNames = CalendarFields(calendar, ['day', 'monthCode']);
	    const fields = PrepareTemporalFields(this, fieldNames, []);
	    return CalendarMonthDayFromFields(calendar, fields);
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

	const ObjectCreate$5 = Object.create;
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
	    return CalendarDay(GetSlot(this, CALENDAR), this);
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
	    if (Type$6(temporalDateTimeLike) !== 'Object') {
	      throw new TypeError('invalid argument');
	    }
	    RejectTemporalLikeObject(temporalDateTimeLike);
	    options = GetOptionsObject(options);
	    const calendar = GetSlot(this, CALENDAR);
	    const fieldNames = CalendarFields(calendar, ['day', 'hour', 'microsecond', 'millisecond', 'minute', 'month', 'monthCode', 'nanosecond', 'second', 'year']);
	    let fields = PrepareTemporalFields(this, fieldNames, []);
	    const partialDateTime = PrepareTemporalFields(temporalDateTimeLike, fieldNames, 'partial');
	    fields = CalendarMergeFields(calendar, fields, partialDateTime);
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
	    } = InterpretTemporalDateTimeFields(calendar, fields, options);
	    return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
	  }
	  withPlainTime() {
	    let temporalTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    const year = GetSlot(this, ISO_YEAR);
	    const month = GetSlot(this, ISO_MONTH);
	    const day = GetSlot(this, ISO_DAY);
	    const calendar = GetSlot(this, CALENDAR);
	    if (temporalTime === undefined) return CreateTemporalDateTime(year, month, day, 0, 0, 0, 0, 0, 0, calendar);
	    temporalTime = ToTemporalTime(temporalTime);
	    const hour = GetSlot(temporalTime, ISO_HOUR);
	    const minute = GetSlot(temporalTime, ISO_MINUTE);
	    const second = GetSlot(temporalTime, ISO_SECOND);
	    const millisecond = GetSlot(temporalTime, ISO_MILLISECOND);
	    const microsecond = GetSlot(temporalTime, ISO_MICROSECOND);
	    const nanosecond = GetSlot(temporalTime, ISO_NANOSECOND);
	    return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
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
	    return new PlainDateTime(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), GetSlot(this, ISO_HOUR), GetSlot(this, ISO_MINUTE), GetSlot(this, ISO_SECOND), GetSlot(this, ISO_MILLISECOND), GetSlot(this, ISO_MICROSECOND), GetSlot(this, ISO_NANOSECOND), calendar);
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
	    if (Type$6(roundTo) === 'String') {
	      const stringParam = roundTo;
	      roundTo = ObjectCreate$5(null);
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
	    if (GetSlot(this, ISO_YEAR) !== GetSlot(other, ISO_YEAR)) return false;
	    if (GetSlot(this, ISO_MONTH) !== GetSlot(other, ISO_MONTH)) return false;
	    if (GetSlot(this, ISO_DAY) !== GetSlot(other, ISO_DAY)) return false;
	    if (GetSlot(this, ISO_HOUR) !== GetSlot(other, ISO_HOUR)) return false;
	    if (GetSlot(this, ISO_MINUTE) !== GetSlot(other, ISO_MINUTE)) return false;
	    if (GetSlot(this, ISO_SECOND) !== GetSlot(other, ISO_SECOND)) return false;
	    if (GetSlot(this, ISO_MILLISECOND) !== GetSlot(other, ISO_MILLISECOND)) return false;
	    if (GetSlot(this, ISO_MICROSECOND) !== GetSlot(other, ISO_MICROSECOND)) return false;
	    if (GetSlot(this, ISO_NANOSECOND) !== GetSlot(other, ISO_NANOSECOND)) return false;
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
	    throw new TypeError('use compare() or equals() to compare Temporal.PlainDateTime');
	  }
	  toZonedDateTime(temporalTimeZoneLike) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    const timeZone = ToTemporalTimeZoneSlotValue(temporalTimeZoneLike);
	    options = GetOptionsObject(options);
	    const disambiguation = ToTemporalDisambiguation(options);
	    const instant = GetInstantFor(timeZone, this, disambiguation);
	    return CreateTemporalZonedDateTime(GetSlot(instant, EPOCHNANOSECONDS), timeZone, GetSlot(this, CALENDAR));
	  }
	  toPlainDate() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    return TemporalDateTimeToDate(this);
	  }
	  toPlainYearMonth() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    const calendar = GetSlot(this, CALENDAR);
	    const fieldNames = CalendarFields(calendar, ['monthCode', 'year']);
	    const fields = PrepareTemporalFields(this, fieldNames, []);
	    return CalendarYearMonthFromFields(calendar, fields);
	  }
	  toPlainMonthDay() {
	    if (!IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
	    const calendar = GetSlot(this, CALENDAR);
	    const fieldNames = CalendarFields(calendar, ['day', 'monthCode']);
	    const fields = PrepareTemporalFields(this, fieldNames, []);
	    return CalendarMonthDayFromFields(calendar, fields);
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
	    const slots = [ISO_YEAR, ISO_MONTH, ISO_DAY, ISO_HOUR, ISO_MINUTE, ISO_SECOND, ISO_MILLISECOND, ISO_MICROSECOND, ISO_NANOSECOND];
	    for (let index = 0; index < slots.length; index++) {
	      const slot = slots[index];
	      const val1 = GetSlot(one, slot);
	      const val2 = GetSlot(two, slot);
	      if (val1 !== val2) return ComparisonResult(val1 - val2);
	    }
	    return 0;
	  }
	}
	MakeIntrinsicClass(PlainDateTime, 'Temporal.PlainDateTime');

	/* global true */

	const ObjectCreate$4 = Object.create;
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
	      Object.defineProperty(this, '_repr_', {
	        value: "".concat(this[Symbol.toStringTag], " <").concat(TemporalDurationToString(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds), ">"),
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
	    let defaultLargestUnit = DefaultTemporalLargestUnit(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
	    if (Type$6(roundTo) === 'String') {
	      const stringParam = roundTo;
	      roundTo = ObjectCreate$4(null);
	      roundTo.smallestUnit = stringParam;
	    } else {
	      roundTo = GetOptionsObject(roundTo);
	    }
	    let largestUnit = GetTemporalUnit(roundTo, 'largestUnit', 'datetime', undefined, ['auto']);
	    let relativeTo = ToRelativeTemporalObject(roundTo);
	    const roundingIncrement = ToTemporalRoundingIncrement(roundTo);
	    const roundingMode = ToTemporalRoundingMode(roundTo, 'halfExpand');
	    let smallestUnit = GetTemporalUnit(roundTo, 'smallestUnit', 'datetime', undefined);
	    let smallestUnitPresent = true;
	    if (!smallestUnit) {
	      smallestUnitPresent = false;
	      smallestUnit = 'nanosecond';
	    }
	    defaultLargestUnit = LargerOfTwoTemporalUnits(defaultLargestUnit, smallestUnit);
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
	    ({
	      years,
	      months,
	      weeks,
	      days
	    } = UnbalanceDateDurationRelative(years, months, weeks, days, largestUnit, relativeTo));
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
	    } = RoundDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, roundingIncrement, smallestUnit, roundingMode, relativeTo));
	    if (IsTemporalZonedDateTime(relativeTo)) {
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
	      } = AdjustRoundedDurationDays(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, roundingIncrement, smallestUnit, roundingMode, relativeTo));
	      ({
	        days,
	        hours,
	        minutes,
	        seconds,
	        milliseconds,
	        microseconds,
	        nanoseconds
	      } = BalanceTimeDurationRelative(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, largestUnit, relativeTo));
	    } else {
	      ({
	        days,
	        hours,
	        minutes,
	        seconds,
	        milliseconds,
	        microseconds,
	        nanoseconds
	      } = BalanceTimeDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, largestUnit));
	    }
	    ({
	      years,
	      months,
	      weeks,
	      days
	    } = BalanceDateDurationRelative(years, months, weeks, days, largestUnit, relativeTo));
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
	    if (Type$6(totalOf) === 'String') {
	      const stringParam = totalOf;
	      totalOf = ObjectCreate$4(null);
	      totalOf.unit = stringParam;
	    } else {
	      totalOf = GetOptionsObject(totalOf);
	    }
	    const relativeTo = ToRelativeTemporalObject(totalOf);
	    const unit = GetTemporalUnit(totalOf, 'unit', 'datetime', REQUIRED);

	    // Convert larger units down to days
	    ({
	      years,
	      months,
	      weeks,
	      days
	    } = UnbalanceDateDurationRelative(years, months, weeks, days, unit, relativeTo));
	    // If the unit we're totalling is smaller than `days`, convert days down to that unit.
	    let balanceResult;
	    if (IsTemporalZonedDateTime(relativeTo)) {
	      const intermediate = MoveRelativeZonedDateTime(relativeTo, years, months, weeks, 0);
	      balanceResult = BalancePossiblyInfiniteTimeDurationRelative(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, unit, intermediate);
	    } else {
	      balanceResult = BalancePossiblyInfiniteTimeDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, unit);
	    }
	    if (balanceResult === 'positive overflow') {
	      return Infinity;
	    } else if (balanceResult === 'negative overflow') {
	      return -Infinity;
	    }
	    ({
	      days,
	      hours,
	      minutes,
	      seconds,
	      milliseconds,
	      microseconds,
	      nanoseconds
	    } = balanceResult);
	    // Finally, truncate to the correct unit and calculate remainder
	    const {
	      total
	    } = RoundDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 1, unit, 'trunc', relativeTo);
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
	    } = RoundDuration(GetSlot(this, YEARS), GetSlot(this, MONTHS), GetSlot(this, WEEKS), GetSlot(this, DAYS), GetSlot(this, HOURS), GetSlot(this, MINUTES), GetSlot(this, SECONDS), GetSlot(this, MILLISECONDS), GetSlot(this, MICROSECONDS), GetSlot(this, NANOSECONDS), increment, unit, roundingMode);
	    return TemporalDurationToString(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, precision);
	  }
	  toJSON() {
	    if (!IsTemporalDuration(this)) throw new TypeError('invalid receiver');
	    return TemporalDurationToString(GetSlot(this, YEARS), GetSlot(this, MONTHS), GetSlot(this, WEEKS), GetSlot(this, DAYS), GetSlot(this, HOURS), GetSlot(this, MINUTES), GetSlot(this, SECONDS), GetSlot(this, MILLISECONDS), GetSlot(this, MICROSECONDS), GetSlot(this, NANOSECONDS));
	  }
	  toLocaleString() {
	    let locales = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalDuration(this)) throw new TypeError('invalid receiver');
	    if (typeof Intl !== 'undefined' && typeof Intl.DurationFormat !== 'undefined') {
	      return new Intl.DurationFormat(locales, options).format(this);
	    }
	    console.warn('Temporal.Duration.prototype.toLocaleString() requires Intl.DurationFormat.');
	    return TemporalDurationToString(GetSlot(this, YEARS), GetSlot(this, MONTHS), GetSlot(this, WEEKS), GetSlot(this, DAYS), GetSlot(this, HOURS), GetSlot(this, MINUTES), GetSlot(this, SECONDS), GetSlot(this, MILLISECONDS), GetSlot(this, MICROSECONDS), GetSlot(this, NANOSECONDS));
	  }
	  valueOf() {
	    throw new TypeError('use compare() to compare Temporal.Duration');
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
	    const relativeTo = ToRelativeTemporalObject(options);
	    const y1 = GetSlot(one, YEARS);
	    const mon1 = GetSlot(one, MONTHS);
	    const w1 = GetSlot(one, WEEKS);
	    let d1 = GetSlot(one, DAYS);
	    const h1 = GetSlot(one, HOURS);
	    const min1 = GetSlot(one, MINUTES);
	    const s1 = GetSlot(one, SECONDS);
	    const ms1 = GetSlot(one, MILLISECONDS);
	    const µs1 = GetSlot(one, MICROSECONDS);
	    let ns1 = GetSlot(one, NANOSECONDS);
	    const y2 = GetSlot(two, YEARS);
	    const mon2 = GetSlot(two, MONTHS);
	    const w2 = GetSlot(two, WEEKS);
	    let d2 = GetSlot(two, DAYS);
	    const h2 = GetSlot(two, HOURS);
	    const min2 = GetSlot(two, MINUTES);
	    const s2 = GetSlot(two, SECONDS);
	    const ms2 = GetSlot(two, MILLISECONDS);
	    const µs2 = GetSlot(two, MICROSECONDS);
	    let ns2 = GetSlot(two, NANOSECONDS);
	    const shift1 = CalculateOffsetShift(relativeTo, y1, mon1, w1, d1);
	    const shift2 = CalculateOffsetShift(relativeTo, y2, mon2, w2, d2);
	    if (y1 !== 0 || y2 !== 0 || mon1 !== 0 || mon2 !== 0 || w1 !== 0 || w2 !== 0) {
	      ({
	        days: d1
	      } = UnbalanceDateDurationRelative(y1, mon1, w1, d1, 'day', relativeTo));
	      ({
	        days: d2
	      } = UnbalanceDateDurationRelative(y2, mon2, w2, d2, 'day', relativeTo));
	    }
	    ns1 = TotalDurationNanoseconds(d1, h1, min1, s1, ms1, µs1, ns1, shift1);
	    ns2 = TotalDurationNanoseconds(d2, h2, min2, s2, ms2, µs2, ns2, shift2);
	    return ComparisonResult(ns1.minus(ns2).toJSNumber());
	  }
	}
	MakeIntrinsicClass(Duration, 'Temporal.Duration');

	const ArrayPrototypePush$2 = Array.prototype.push;
	const ObjectCreate$3 = Object.create;
	const SetPrototypeAdd$1 = Set.prototype.add;
	const SetPrototypeForEach$1 = Set.prototype.forEach;
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
	    return CalendarDay(GetSlot(this, CALENDAR), this);
	  }
	  get calendarId() {
	    if (!IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
	    return ToTemporalCalendarIdentifier(GetSlot(this, CALENDAR));
	  }
	  with(temporalMonthDayLike) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
	    if (Type$6(temporalMonthDayLike) !== 'Object') {
	      throw new TypeError('invalid argument');
	    }
	    RejectTemporalLikeObject(temporalMonthDayLike);
	    options = GetOptionsObject(options);
	    const calendar = GetSlot(this, CALENDAR);
	    const fieldNames = CalendarFields(calendar, ['day', 'month', 'monthCode', 'year']);
	    let fields = PrepareTemporalFields(this, fieldNames, []);
	    const partialMonthDay = PrepareTemporalFields(temporalMonthDayLike, fieldNames, 'partial');
	    fields = CalendarMergeFields(calendar, fields, partialMonthDay);
	    fields = PrepareTemporalFields(fields, fieldNames, []);
	    return CalendarMonthDayFromFields(calendar, fields, options);
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
	    throw new TypeError('use equals() to compare Temporal.PlainMonthDay');
	  }
	  toPlainDate(item) {
	    if (!IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
	    if (Type$6(item) !== 'Object') throw new TypeError('argument should be an object');
	    const calendar = GetSlot(this, CALENDAR);
	    const receiverFieldNames = CalendarFields(calendar, ['day', 'monthCode']);
	    let fields = PrepareTemporalFields(this, receiverFieldNames, []);
	    const inputFieldNames = CalendarFields(calendar, ['year']);
	    const inputFields = PrepareTemporalFields(item, inputFieldNames, []);
	    let mergedFields = CalendarMergeFields(calendar, fields, inputFields);

	    // TODO: Use MergeLists abstract operation.
	    const uniqueFieldNames = new Set();
	    for (let index = 0; index < receiverFieldNames.length; index++) {
	      Call$1(SetPrototypeAdd$1, uniqueFieldNames, [receiverFieldNames[index]]);
	    }
	    for (let index = 0; index < inputFieldNames.length; index++) {
	      Call$1(SetPrototypeAdd$1, uniqueFieldNames, [inputFieldNames[index]]);
	    }
	    const mergedFieldNames = [];
	    Call$1(SetPrototypeForEach$1, uniqueFieldNames, [element => Call$1(ArrayPrototypePush$2, mergedFieldNames, [element])]);
	    mergedFields = PrepareTemporalFields(mergedFields, mergedFieldNames, []);
	    const options = ObjectCreate$3(null);
	    options.overflow = 'reject';
	    return CalendarDateFromFields(calendar, mergedFields, options);
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
	  return GetPlainDateTimeFor(timeZone, inst, calendar);
	};
	const plainDateTimeISO = function () {
	  let temporalTimeZoneLike = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DefaultTimeZone();
	  const timeZone = ToTemporalTimeZoneSlotValue(temporalTimeZoneLike);
	  const inst = instant();
	  return GetPlainDateTimeFor(timeZone, inst, 'iso8601');
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
	const ObjectCreate$2 = Object.create;
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
	  hour = ISODateTimePartString(hour);
	  minute = ISODateTimePartString(minute);
	  const seconds = FormatSecondsStringPart(second, millisecond, microsecond, nanosecond, precision);
	  return "".concat(hour, ":").concat(minute).concat(seconds);
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
	    if (Type$6(temporalTimeLike) !== 'Object') {
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
	    if (Type$6(roundTo) === 'String') {
	      const stringParam = roundTo;
	      roundTo = ObjectCreate$2(null);
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
	    throw new TypeError('use compare() or equals() to compare Temporal.PlainTime');
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
	    if (Type$6(item) !== 'Object') {
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
	    const PlainDateTime = GetIntrinsic('%Temporal.PlainDateTime%');
	    const dt = new PlainDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
	    const instant = GetInstantFor(timeZone, dt, 'compatible');
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
	    for (const slot of [ISO_HOUR, ISO_MINUTE, ISO_SECOND, ISO_MILLISECOND, ISO_MICROSECOND, ISO_NANOSECOND]) {
	      const val1 = GetSlot(one, slot);
	      const val2 = GetSlot(two, slot);
	      if (val1 !== val2) return ComparisonResult(val1 - val2);
	    }
	    return 0;
	  }
	}
	MakeIntrinsicClass(PlainTime, 'Temporal.PlainTime');

	/* global true */

	class TimeZone {
	  constructor(identifier) {
	    // Note: if the argument is not passed, GetCanonicalTimeZoneIdentifier(undefined) will throw.
	    //       This check exists only to improve the error message.
	    if (arguments.length < 1) {
	      throw new RangeError('missing argument: identifier is required');
	    }
	    let stringIdentifier = ToString$1(identifier);
	    if (IsTimeZoneOffsetString(stringIdentifier)) {
	      stringIdentifier = CanonicalizeTimeZoneOffsetString(stringIdentifier);
	    } else {
	      const record = GetAvailableNamedTimeZoneIdentifier(stringIdentifier);
	      if (!record) throw new RangeError("Invalid time zone identifier: ".concat(stringIdentifier));
	      stringIdentifier = record.primaryIdentifier;
	    }
	    CreateSlots(this);
	    SetSlot(this, TIMEZONE_ID, stringIdentifier);
	    {
	      Object.defineProperty(this, '_repr_', {
	        value: "".concat(this[Symbol.toStringTag], " <").concat(stringIdentifier, ">"),
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
	  getOffsetNanosecondsFor(instant) {
	    if (!IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
	    instant = ToTemporalInstant(instant);
	    const id = GetSlot(this, TIMEZONE_ID);
	    if (IsTimeZoneOffsetString(id)) {
	      return ParseTimeZoneOffsetString(id);
	    }
	    return GetNamedTimeZoneOffsetNanoseconds(id, GetSlot(instant, EPOCHNANOSECONDS));
	  }
	  getOffsetStringFor(instant) {
	    if (!IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
	    instant = ToTemporalInstant(instant);
	    return GetOffsetStringFor(this, instant);
	  }
	  getPlainDateTimeFor(instant) {
	    let calendar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'iso8601';
	    if (!IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
	    instant = ToTemporalInstant(instant);
	    calendar = ToTemporalCalendarSlotValue(calendar);
	    return GetPlainDateTimeFor(this, instant, calendar);
	  }
	  getInstantFor(dateTime) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
	    dateTime = ToTemporalDateTime(dateTime);
	    options = GetOptionsObject(options);
	    const disambiguation = ToTemporalDisambiguation(options);
	    return GetInstantFor(this, dateTime, disambiguation);
	  }
	  getPossibleInstantsFor(dateTime) {
	    if (!IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
	    dateTime = ToTemporalDateTime(dateTime);
	    const Instant = GetIntrinsic('%Temporal.Instant%');
	    const id = GetSlot(this, TIMEZONE_ID);
	    if (IsTimeZoneOffsetString(id)) {
	      const epochNs = GetUTCEpochNanoseconds(GetSlot(dateTime, ISO_YEAR), GetSlot(dateTime, ISO_MONTH), GetSlot(dateTime, ISO_DAY), GetSlot(dateTime, ISO_HOUR), GetSlot(dateTime, ISO_MINUTE), GetSlot(dateTime, ISO_SECOND), GetSlot(dateTime, ISO_MILLISECOND), GetSlot(dateTime, ISO_MICROSECOND), GetSlot(dateTime, ISO_NANOSECOND));
	      if (epochNs === null) throw new RangeError('DateTime outside of supported range');
	      const offsetNs = ParseTimeZoneOffsetString(id);
	      return [new Instant(epochNs.minus(offsetNs))];
	    }
	    const possibleEpochNs = GetNamedTimeZoneEpochNanoseconds(id, GetSlot(dateTime, ISO_YEAR), GetSlot(dateTime, ISO_MONTH), GetSlot(dateTime, ISO_DAY), GetSlot(dateTime, ISO_HOUR), GetSlot(dateTime, ISO_MINUTE), GetSlot(dateTime, ISO_SECOND), GetSlot(dateTime, ISO_MILLISECOND), GetSlot(dateTime, ISO_MICROSECOND), GetSlot(dateTime, ISO_NANOSECOND));
	    return possibleEpochNs.map(ns => new Instant(ns));
	  }
	  getNextTransition(startingPoint) {
	    if (!IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
	    startingPoint = ToTemporalInstant(startingPoint);
	    const id = GetSlot(this, TIMEZONE_ID);

	    // Offset time zones or UTC have no transitions
	    if (IsTimeZoneOffsetString(id) || id === 'UTC') {
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
	    if (IsTimeZoneOffsetString(id) || id === 'UTC') {
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

	const ArrayPrototypePush$1 = Array.prototype.push;
	const ObjectCreate$1 = Object.create;
	const SetPrototypeAdd = Set.prototype.add;
	const SetPrototypeForEach = Set.prototype.forEach;
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
	    if (Type$6(temporalYearMonthLike) !== 'Object') {
	      throw new TypeError('invalid argument');
	    }
	    RejectTemporalLikeObject(temporalYearMonthLike);
	    options = GetOptionsObject(options);
	    const calendar = GetSlot(this, CALENDAR);
	    const fieldNames = CalendarFields(calendar, ['month', 'monthCode', 'year']);
	    let fields = PrepareTemporalFields(this, fieldNames, []);
	    const partialYearMonth = PrepareTemporalFields(temporalYearMonthLike, fieldNames, 'partial');
	    fields = CalendarMergeFields(calendar, fields, partialYearMonth);
	    fields = PrepareTemporalFields(fields, fieldNames, []);
	    return CalendarYearMonthFromFields(calendar, fields, options);
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
	    throw new TypeError('use compare() or equals() to compare Temporal.PlainYearMonth');
	  }
	  toPlainDate(item) {
	    if (!IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
	    if (Type$6(item) !== 'Object') throw new TypeError('argument should be an object');
	    const calendar = GetSlot(this, CALENDAR);
	    const receiverFieldNames = CalendarFields(calendar, ['monthCode', 'year']);
	    let fields = PrepareTemporalFields(this, receiverFieldNames, []);
	    const inputFieldNames = CalendarFields(calendar, ['day']);
	    const inputFields = PrepareTemporalFields(item, inputFieldNames, []);
	    let mergedFields = CalendarMergeFields(calendar, fields, inputFields);

	    // TODO: Use MergeLists abstract operation.
	    const uniqueFieldNames = new Set();
	    for (let index = 0; index < receiverFieldNames.length; index++) {
	      Call$1(SetPrototypeAdd, uniqueFieldNames, [receiverFieldNames[index]]);
	    }
	    for (let index = 0; index < inputFieldNames.length; index++) {
	      Call$1(SetPrototypeAdd, uniqueFieldNames, [inputFieldNames[index]]);
	    }
	    const mergedFieldNames = [];
	    Call$1(SetPrototypeForEach, uniqueFieldNames, [element => Call$1(ArrayPrototypePush$1, mergedFieldNames, [element])]);
	    mergedFields = PrepareTemporalFields(mergedFields, mergedFieldNames, []);
	    const options = ObjectCreate$1(null);
	    options.overflow = 'reject';
	    return CalendarDateFromFields(calendar, mergedFields, options);
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
	    return CalendarDay(GetSlot(this, CALENDAR), dateTime(this));
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
	    const dt = dateTime(this);
	    const DateTime = GetIntrinsic('%Temporal.PlainDateTime%');
	    const year = GetSlot(dt, ISO_YEAR);
	    const month = GetSlot(dt, ISO_MONTH);
	    const day = GetSlot(dt, ISO_DAY);
	    const today = new DateTime(year, month, day, 0, 0, 0, 0, 0, 0);
	    const tomorrowFields = AddISODate(year, month, day, 0, 0, 0, 1, 'reject');
	    const tomorrow = new DateTime(tomorrowFields.year, tomorrowFields.month, tomorrowFields.day, 0, 0, 0, 0, 0, 0);
	    const timeZone = GetSlot(this, TIME_ZONE);
	    const todayNs = GetSlot(GetInstantFor(timeZone, today, 'compatible'), EPOCHNANOSECONDS);
	    const tomorrowNs = GetSlot(GetInstantFor(timeZone, tomorrow, 'compatible'), EPOCHNANOSECONDS);
	    const diffNs = tomorrowNs.subtract(todayNs);
	    const {
	      quotient,
	      remainder
	    } = diffNs.divmod(3.6e12);
	    return quotient.toJSNumber() + remainder.toJSNumber() / 3.6e12;
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
	    return GetOffsetStringFor(GetSlot(this, TIME_ZONE), GetSlot(this, INSTANT));
	  }
	  get offsetNanoseconds() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    return GetOffsetNanosecondsFor(GetSlot(this, TIME_ZONE), GetSlot(this, INSTANT));
	  }
	  with(temporalZonedDateTimeLike) {
	    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    if (Type$6(temporalZonedDateTimeLike) !== 'Object') {
	      throw new TypeError('invalid zoned-date-time-like');
	    }
	    RejectTemporalLikeObject(temporalZonedDateTimeLike);
	    options = GetOptionsObject(options);
	    const calendar = GetSlot(this, CALENDAR);
	    const fieldNames = CalendarFields(calendar, ['day', 'hour', 'microsecond', 'millisecond', 'minute', 'month', 'monthCode', 'nanosecond', 'second', 'year']);
	    Call$1(ArrayPrototypePush, fieldNames, ['offset']);
	    let fields = PrepareTemporalFields(this, fieldNames, ['offset']);
	    const partialZonedDateTime = PrepareTemporalFields(temporalZonedDateTimeLike, fieldNames, 'partial');
	    fields = CalendarMergeFields(calendar, fields, partialZonedDateTime);
	    fields = PrepareTemporalFields(fields, fieldNames, ['offset']);
	    const disambiguation = ToTemporalDisambiguation(options);
	    const offset = ToTemporalOffset(options, 'prefer');
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
	    } = InterpretTemporalDateTimeFields(calendar, fields, options);
	    const offsetNs = ParseTimeZoneOffsetString(fields.offset);
	    const timeZone = GetSlot(this, TIME_ZONE);
	    const epochNanoseconds = InterpretISODateTimeOffset(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, 'option', offsetNs, timeZone, disambiguation, offset, /* matchMinute = */false);
	    return CreateTemporalZonedDateTime(epochNanoseconds, timeZone, calendar);
	  }
	  withPlainDate(temporalDate) {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    temporalDate = ToTemporalDate(temporalDate);
	    const year = GetSlot(temporalDate, ISO_YEAR);
	    const month = GetSlot(temporalDate, ISO_MONTH);
	    const day = GetSlot(temporalDate, ISO_DAY);
	    let calendar = GetSlot(temporalDate, CALENDAR);
	    const thisDt = dateTime(this);
	    const hour = GetSlot(thisDt, ISO_HOUR);
	    const minute = GetSlot(thisDt, ISO_MINUTE);
	    const second = GetSlot(thisDt, ISO_SECOND);
	    const millisecond = GetSlot(thisDt, ISO_MILLISECOND);
	    const microsecond = GetSlot(thisDt, ISO_MICROSECOND);
	    const nanosecond = GetSlot(thisDt, ISO_NANOSECOND);
	    calendar = ConsolidateCalendars(GetSlot(this, CALENDAR), calendar);
	    const timeZone = GetSlot(this, TIME_ZONE);
	    const PlainDateTime = GetIntrinsic('%Temporal.PlainDateTime%');
	    const dt = new PlainDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
	    const instant = GetInstantFor(timeZone, dt, 'compatible');
	    return CreateTemporalZonedDateTime(GetSlot(instant, EPOCHNANOSECONDS), timeZone, calendar);
	  }
	  withPlainTime() {
	    let temporalTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    const PlainTime = GetIntrinsic('%Temporal.PlainTime%');
	    temporalTime = temporalTime === undefined ? new PlainTime() : ToTemporalTime(temporalTime);
	    const thisDt = dateTime(this);
	    const year = GetSlot(thisDt, ISO_YEAR);
	    const month = GetSlot(thisDt, ISO_MONTH);
	    const day = GetSlot(thisDt, ISO_DAY);
	    const calendar = GetSlot(this, CALENDAR);
	    const hour = GetSlot(temporalTime, ISO_HOUR);
	    const minute = GetSlot(temporalTime, ISO_MINUTE);
	    const second = GetSlot(temporalTime, ISO_SECOND);
	    const millisecond = GetSlot(temporalTime, ISO_MILLISECOND);
	    const microsecond = GetSlot(temporalTime, ISO_MICROSECOND);
	    const nanosecond = GetSlot(temporalTime, ISO_NANOSECOND);
	    const timeZone = GetSlot(this, TIME_ZONE);
	    const PlainDateTime = GetIntrinsic('%Temporal.PlainDateTime%');
	    const dt = new PlainDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
	    const instant = GetInstantFor(timeZone, dt, 'compatible');
	    return CreateTemporalZonedDateTime(GetSlot(instant, EPOCHNANOSECONDS), timeZone, calendar);
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
	    if (Type$6(roundTo) === 'String') {
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

	    // first, round the underlying DateTime fields
	    const dt = dateTime(this);
	    let year = GetSlot(dt, ISO_YEAR);
	    let month = GetSlot(dt, ISO_MONTH);
	    let day = GetSlot(dt, ISO_DAY);
	    let hour = GetSlot(dt, ISO_HOUR);
	    let minute = GetSlot(dt, ISO_MINUTE);
	    let second = GetSlot(dt, ISO_SECOND);
	    let millisecond = GetSlot(dt, ISO_MILLISECOND);
	    let microsecond = GetSlot(dt, ISO_MICROSECOND);
	    let nanosecond = GetSlot(dt, ISO_NANOSECOND);
	    const DateTime = GetIntrinsic('%Temporal.PlainDateTime%');
	    const timeZone = GetSlot(this, TIME_ZONE);
	    const calendar = GetSlot(this, CALENDAR);
	    const dtStart = new DateTime(GetSlot(dt, ISO_YEAR), GetSlot(dt, ISO_MONTH), GetSlot(dt, ISO_DAY), 0, 0, 0, 0, 0, 0);
	    const instantStart = GetInstantFor(timeZone, dtStart, 'compatible');
	    const endNs = AddZonedDateTime(instantStart, timeZone, calendar, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0);
	    const dayLengthNs = endNs.subtract(GetSlot(instantStart, EPOCHNANOSECONDS));
	    if (dayLengthNs.leq(0)) {
	      throw new RangeError('cannot round a ZonedDateTime in a calendar with zero- or negative-length days');
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
	    } = RoundISODateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, roundingIncrement, smallestUnit, roundingMode, dayLengthNs));

	    // Now reset all DateTime fields but leave the TimeZone. The offset will
	    // also be retained if the new date/time values are still OK with the old
	    // offset. Otherwise the offset will be changed to be compatible with the
	    // new date/time values. If DST disambiguation is required, the `compatible`
	    // disambiguation algorithm will be used.
	    const offsetNs = GetOffsetNanosecondsFor(timeZone, GetSlot(this, INSTANT));
	    const epochNanoseconds = InterpretISODateTimeOffset(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, 'option', offsetNs, timeZone, 'compatible', 'prefer', /* matchMinute = */false);
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
	    if (IsTimeZoneOffsetString(timeZoneIdentifier)) {
	      // Note: https://github.com/tc39/ecma402/issues/683 will remove this
	      throw new RangeError('toLocaleString does not currently support offset time zones');
	    } else {
	      const record = GetAvailableNamedTimeZoneIdentifier(timeZoneIdentifier);
	      if (!record) throw new RangeError("toLocaleString formats built-in time zones, not ".concat(timeZoneIdentifier));
	      optionsCopy.timeZone = record.primaryIdentifier;
	    }
	    const formatter = new DateTimeFormat(locales, optionsCopy);
	    const localeCalendarIdentifier = Call$1(customResolvedOptions, formatter, []).calendar;
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
	    throw new TypeError('use compare() or equals() to compare Temporal.ZonedDateTime');
	  }
	  startOfDay() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    const dt = dateTime(this);
	    const DateTime = GetIntrinsic('%Temporal.PlainDateTime%');
	    const calendar = GetSlot(this, CALENDAR);
	    const dtStart = new DateTime(GetSlot(dt, ISO_YEAR), GetSlot(dt, ISO_MONTH), GetSlot(dt, ISO_DAY), 0, 0, 0, 0, 0, 0, calendar);
	    const timeZone = GetSlot(this, TIME_ZONE);
	    const instant = GetInstantFor(timeZone, dtStart, 'compatible');
	    return CreateTemporalZonedDateTime(GetSlot(instant, EPOCHNANOSECONDS), timeZone, calendar);
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
	    const calendar = GetSlot(this, CALENDAR);
	    const fieldNames = CalendarFields(calendar, ['monthCode', 'year']);
	    const fields = PrepareTemporalFields(this, fieldNames, []);
	    return CalendarYearMonthFromFields(calendar, fields);
	  }
	  toPlainMonthDay() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    const calendar = GetSlot(this, CALENDAR);
	    const fieldNames = CalendarFields(calendar, ['day', 'monthCode']);
	    const fields = PrepareTemporalFields(this, fieldNames, []);
	    return CalendarMonthDayFromFields(calendar, fields);
	  }
	  getISOFields() {
	    if (!IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
	    const dt = dateTime(this);
	    const tz = GetSlot(this, TIME_ZONE);
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
	      offset: GetOffsetStringFor(tz, GetSlot(this, INSTANT)),
	      timeZone: tz
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
	  return GetPlainDateTimeFor(GetSlot(zdt, TIME_ZONE), GetSlot(zdt, INSTANT), GetSlot(zdt, CALENDAR));
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
