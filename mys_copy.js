const CURVE = {
	P: 1461501637330902918203687197606826779884643492439n
	// n: 2n ** 256n - 432420386565659656852420866394968145599n
};
class Point {
	static ZERO = new Point(0n, 0n); // Point at infinity aka identity point aka zero
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	multiplyDA(n) {
		n = BigInt(n)
		let p = Point.ZERO;
		let d = this;
		while (n > 0n) {
			if (n & 1n) p = p.add(d);
			d = d.double();
			n >>= 1n;
		}
		return p;
	}
	// Adds point to itself. httphyperelliptic.org/EFD/g1p/auto-shortw.html
	double() {
		const X1 = BigInt(this.x);
		const Y1 = BigInt(this.y);
		const lam = mod(((3n * X1 ** 2n) + 1461501637330902918203684832716283019653785059324n) * invert(2n * Y1, CURVE.P));
		const X3 = mod(lam * lam - 2n * X1);
		const Y3 = mod(lam * (X1 - X3) - Y1);
		return new Point(X3, Y3);
	}
	// Adds point to other point. httphyperelliptic.org/EFD/g1p/auto-shortw.html
	add(other) {
		const [a, b] = [this, other];
		const [X1, Y1, X2, Y2] = [a.x, a.y, b.x, b.y];
		if (X1 === 0n || Y1 === 0n) return b;
		if (X2 === 0n || Y2 === 0n) return a;
		if (X1 === X2 && Y1 === Y2) return this.double();
		if (X1 === X2 && Y1 === -Y2) return Point.ZERO;
		const lam = mod((Y2 - Y1) * invert(X2 - X1, CURVE.P));
		const X3 = mod(lam * lam - X1 - X2);
		const Y3 = mod(lam * (X1 - X3) - Y1);
		return new Point(X3, Y3);
	}
	print() {
		console.log("x : ", this.x)
		console.log("y : ", this.y)
	}
}
function mod(a, b = CURVE.P) {
	const result = a % b;
	return result >= 0 ? result : b + result;
}
// Inverses number over modulo
function invert(number, modulo = CURVE.P) {
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

let G = new Point(425826231723888350446541592701409065913635568770n, 203520114162904107873991457957346892027982641970n)
let P = G.multiplyDA(23)
P.print()

