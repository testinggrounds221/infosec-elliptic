const CURVE = {
	P: 1461501637330902918203684832716283019653785059327n,
	n: 1461501637330902918203687197606826779884643492439n,
	a: 1461501637330902918203684832716283019653785059324n,
	b: 163235791306168110546604919403271579530548345413n
};

class Curve {
	constructor(P, a, b) {
		this.P = P
		this.a = a
		this.b = b
	}
}

class Point {

	constructor(x, y, curve) {
		this.x = x;
		this.y = y;
		this.curve = curve
		// ZERO = new Point(0n, 0n, curve)
	}
	multiplyDA(n) {
		n = BigInt(n)
		let p = new Point(0n, 0n, this.curve);
		let d = this;
		while (n > 0n) {
			if (n & 1n) p = p.add(d);
			d = d.double();
			n >>= 1n;
		}
		return p;
	}

	double() {
		const X1 = this.x;
		const Y1 = this.y;
		const lam = this.mod(((3n * X1 ** 2n) + this.curve.a) * invert(2n * Y1, this.curve.P));
		const X3 = this.mod(lam * lam - 2n * X1);
		const Y3 = this.mod(lam * (X1 - X3) - Y1);
		return new Point(X3, Y3, this.curve);
	}

	add(other) {
		const [a, b] = [this, other];
		const [X1, Y1, X2, Y2] = [a.x, a.y, b.x, b.y];
		if (X1 === 0n || Y1 === 0n) return b;
		if (X2 === 0n || Y2 === 0n) return a;
		if (X1 === X2 && Y1 === Y2) return this.double();
		if (X1 === X2 && Y1 === -Y2) return new Point(0n, 0n, this.curve);
		const lam = this.mod((Y2 - Y1) * invert(X2 - X1, this.curve.P), this.curve.P);
		const X3 = this.mod(lam * lam - X1 - X2, this.curve.P);
		const Y3 = this.mod(lam * (X1 - X3) - Y1, this.curve.P);
		return new Point(X3, Y3, this.curve);
	}
	print() {
		console.log("X : ", this.x)
		console.log("Y : ", this.y)
	}
	mod(a, b = this.curve.P) {
		const result = a % b;
		return result >= 0 ? result : b + result;
	}

}
function mod(a, b = this.curve.P) {
	const result = a % b;
	return result >= 0 ? result : b + result;
}
// Inverses number over modulo
function invert(number, modulo = this.curve.P) {
	if (number === 0n || modulo <= 0n) {
		throw new Error(`invert positive integers, got n=${number} mod=${modulo}`);
	}
	// Eucledian GCD httpsbrilliant.org/wiki/extended-euclidean-algorithm/
	let a = mod(number, modulo);
	let b = modulo;
	let [x, y, u, v] = [0n, 1n, 1n, 0n];
	while (a !== 0n) {
		const q = b / a;
		const r = b % a;
		const m = x - u * q;
		const n = y - v * q;
		[b, a] = [a, r];
		[x, y] = [u, v];
		[u, v] = [m, n];
	}
	const gcd = b;
	if (gcd !== 1n) throw new Error('invert not exist');
	return mod(x, modulo);
}

// let p = new Point(425826231723888350446541592701409065913635568770n, 203520114162904107873991457957346892027982641970n)
// p.multiplyDA(23n).print()

// ------------------------------------------------
function get_curve() {

	console.log(document.ecdhtest.n.value)
	console.log(document.ecdhtest.a.value)
	console.log(document.ecdhtest.b.value)
	return new Curve(BigInt(document.ecdhtest.n.value),
		BigInt(document.ecdhtest.a.value),
		BigInt(document.ecdhtest.b.value));
}

function do_alice_pub() {
	if (document.ecdhtest.alice_priv.value.length == 0) {
		alert("Please generate Alice's private value first");
		return;
	}
	var curve = get_curve();
	var a = BigInt(document.ecdhtest.alice_priv.value);
	let G = new Point(BigInt(document.ecdhtest.gx.value), BigInt(document.ecdhtest.gy.value), curve)
	var P = G.multiplyDA(a)
	P.print()
	document.ecdhtest.alice_pub_x.value = P.x.toString();
	document.ecdhtest.alice_pub_y.value = P.y.toString();
	document.ecdhtest.bob_key_x.value = "";
	document.ecdhtest.bob_key_y.value = "";
}

function do_bob_pub() {
	if (document.ecdhtest.bob_priv.value.length == 0) {
		alert("Please generate Alice's private value first");
		return;
	}
	var curve = get_curve();
	var a = BigInt(document.ecdhtest.bob_priv.value);
	let G = new Point(BigInt(document.ecdhtest.gx.value), BigInt(document.ecdhtest.gy.value), curve)
	var P = G.multiplyDA(a)
	P.print()
	document.ecdhtest.bob_pub_x.value = P.x.toString();
	document.ecdhtest.bob_pub_y.value = P.y.toString();
	document.ecdhtest.alice_key_x.value = "";
	document.ecdhtest.alice_key_y.value = "";
}

function do_alice_key() {
	if (document.ecdhtest.alice_priv.value.length == 0) {
		alert("Please generate Alice's private value first");
		return;
	}
	if (document.ecdhtest.bob_pub_x.value.length == 0) {
		alert("Please compute Bob's public value first");
		return;
	}
	var curve = get_curve();
	let P = new Point(BigInt(document.ecdhtest.bob_pub_x.value), BigInt(document.ecdhtest.bob_pub_y.value), curve)
	var a = BigInt(document.ecdhtest.alice_priv.value);
	var S = P.multiplyDA(a);
	document.ecdhtest.alice_key_x.value = S.x.toString();
	document.ecdhtest.alice_key_y.value = S.y.toString();

}

function do_bob_key() {
	if (document.ecdhtest.bob_priv.value.length == 0) {
		alert("Please generate Bob's private value first");
		return;
	}
	if (document.ecdhtest.alice_pub_x.value.length == 0) {
		alert("Please compute Alice's public value first");
		return;
	}

	var curve = get_curve();
	let P = new Point(BigInt(document.ecdhtest.alice_pub_x.value), BigInt(document.ecdhtest.alice_pub_y.value), curve)

	var a = BigInt(document.ecdhtest.bob_priv.value);
	var S = P.multiplyDA(a);


	document.ecdhtest.bob_key_x.value = S.x.toString();
	document.ecdhtest.bob_key_y.value = S.y.toString();

}









