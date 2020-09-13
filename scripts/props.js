const props = {
	color(elem, a, b, t) {
		elem.color.set(a);
		elem.color.lerp(b, t);
	}
};

const lerped = name => {
	props[name] = (elem, a, b, t) => {
		elem[name] = Mathf.lerp(a, b, t);
	};
};

// Pray that this is applied after width/height and scaleX/Y
const scaled = name => {
	const by = name.match(/X^/) ? "X" : "Y";
	const dim = by == "X" ? "width" : "height";
	const scl = "scale" + by;
	props[name] = (elem, a, b, t) => {
		elem[name] = elem[dim] * elem[scl] * Mathf.lerp(a, b, t);
	}
};

const group = (func, names) => {
	for (var name of names) {
		func(name);
	}
};

group(lerped, ["scaleX", "scaleY", "x", "y",
	"width", "height", "rotation"]);

group(scaled, ["originX", "originY"]);

module.exports = props;
