const lerp = name => {
	props[name] = (elem, a, b, t) => {
		elem[name] = Mathf.lerp(a, b, t);
	};
};
const lerped = names => {
	for (var name of names) {
		lerp(name);
	}
};

const props = {
	color(elem, a, b, t) {
		elem.color.set(a);
		elem.color.lerp(b, t);
	}
};

lerped(["scaleX", "scaleY", "x", "y",
	"width", "height", "rotation"]);

module.exports = props;
