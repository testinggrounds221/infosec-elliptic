// P = k * G = 6 * {15, 13} = {5, 8}
//  a = 0 and b = 7
let p = 17;
let a = 0; // Curve Equation a
let b = 7; // Curve Equation b


class ECpoint {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

function modInverse(a, b) {
	a %= b;
	for (var x = 1; x < b; x++) {
		if ((a * x) % b == 1) {
			return x;
		}
	}
	throw new Error("NO MI Exists")
}

function add(other) {
	let lamda = 0;
	let num, i, den;
	if (other.x === this.x) {
		num = (3 * this.x * this.x) + a;
		den = 2 * this.y
		// i = modInverse((2 * this.y), p)
	} else {
		num = other.y - this.y
		// i = modInverse((other.x - this.x), p)
		den = other.x - this.x
	}
	lamda = Math.round(num / den)
	console.log("lambda : ", lamda)
	let x3 = (lamda * lamda) - this.x - other.x
	let y3 = (lamda * (this.x - x3)) - this.y

	return new ECpoint(modulus(x3, p), modulus(y3, p))
}

function modulus(a, b) {
	let mod = a % b
	if (mod < 0) mod = mod * -1
	return mod
}

function multiply(x) { // x is integer
	let pt = new ECpoint(this.x, this.y)
	let mul = null
	x = x - 1
	while (x > 0) {
		mul = pt.add(pt)
		pt.x = mul.x
		pt.y = mul.y
		x = x - 1
	}
	pt.print()
}

function print() {
	console.log("X : " + this.x)
	console.log("Y : " + this.y)
}

function getPublicKey(x) { // x is integer, pvt Key
	if (!(x >= 1) && (x < p)) return

}

ECpoint.prototype.add = add;
ECpoint.prototype.print = print;
ECpoint.prototype.multiply = multiply;

// console.log(modInverse(23, 26))
let pt = new ECpoint(15, 13)

// let pt2 = new ECpoint(1, 2)
// let pt3 = new ECpoint(3, 4)
// let added = pt2.add(pt3)
// added.print()

// console.log(pt.multiply(2))
pt.multiply(2)
// let basePoint = new ECpoint(2, 3)