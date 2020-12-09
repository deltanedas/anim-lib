const anim = {
	animations: {},
	animating: []
};
module.exports = anim
global.anim = anim;

anim.createHandle = require("anim-lib/handle");

anim.validate = require("anim-lib/validate");

anim.addAnimation = (name, an) => {
	if (!an) {
		// an is a filename
		an = name;
	}

	// Inline JSON object
	if (typeof(an) != "object") {
		// Filename
		if (typeof(an) == "string") {
			try {
				an = JSON.parse(readString("animations/" + an + ".json"));
			} catch (e) {
				Log.err("Failed to read animation '" + an + "': " + e);
				return null;
			}
		} else {
			throw "Invalid animation " + an + " (must be filename or JSON object)";
		}
	}

	anim.validate(an, name);

	anim.animations[name] = an;
	an.name = name;
	an.handles = [];
	return an;
};

/*
	Animate a cell.

	Cell/Element elem:
		Element to be animated.
		Cells use .get() for simplicity.
	String/Animation an:
		JSON object or animation name that
		specifies how to animate the element.
	boolean loop:
		Whether to repeat until .stop()ped or not. */
anim.animate = (elem, an, loop) => {
	if (typeof(an) == "string") {
		const name = an;
		an = anim.animations[name];
		if (!an) {
			Log.err("Attempt to animate @ with unknown animation '@'", elem, name);
			return null;
		}
	}

	if (elem instanceof Cell) {
		elem = elem.get();
	}

	return anim.createHandle(an, elem, loop);
};
