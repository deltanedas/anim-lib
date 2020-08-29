const properties = require("anim-lib/props");

const getInterp = name => {
	const interp = Interp[name];
	// Static field like "class" is not allowed
	if (!(interp instanceof Interp)) {
		throw "h";
	}
	return interp;
};

const dealiasProps = (fbase, props) => {
	const check = (name, func) => {
		if (props[name] != undefined) {
			const old = props[name];
			delete props[name];
			func(old);
		}
	};

	check("color", str => {
		try {
			props.color = Colors.get(str) || Color.valueOf(str);
		} catch(e) {}

		if (!props.color) {
			throw fbase + "property is invalid: color";
		}
	});

	check("scale", scl => {
		props.scaleX = props.scaleY = scl;
	});
	check("pos", pos => {
		props.x = props.y = pos;
	});
	check("size", size => {
		props.width = props.height = size;
	});
};

const validateProps = (anim, frames) => {
	for (var i in frames) {
		var fbase = "Animation " + anim.name + " frame #" + i + " ";
		var frame = frames[i];

		frame.next = {};
		frame.length = -1;
		for (var name in frame.props) {
			if (!properties[name]) {
				Log.warn(fbase + "property is unused: " + name);
				continue;
			}

			// Currently color is the only non-numeric property
			if (name != "color" && typeof(frame.props[name]) != "number") {
				throw fbase + "property is invalid: " + name;
			}

			var idx = i;
			while (++idx < frames.length) {
				var other = frames[idx];
				if (other.props[name]) {
					frame.next[name] = other.props[name];
					var len = other.index - frame.index;
					if (len > frame.length) {
						frame.length = len;
					}
				}
			}
		}

		if (frame.length == -1) {
			frame.length = anim.length - frame.index;
		}
		frame.end = frame.index + frame.length++;
	}
};

module.exports = (anim, name) => {
	const base = "Animation " + name + " ";
	if (!anim || typeof(anim) != "object" || Array.isArray(anim)) {
		throw base + "is not an object";
	}

	if (!anim.length) throw base + "has no length";

	const frames = anim.frames;
	if (!frames) throw base + "has no frames";
	if (!Array.isArray(frames)) {
		throw base + "frames are not an array";
	}

	const def = anim.defaultInterp;
	if (def) {
		try {
			anim.defaultInterp = getInterp(def);
		} catch (e) {
			throw base + "has invalid default interpolation: " + def;
		}
	} else {
		anim.defaultInterp = Interp.linear;
	}

	for (var i in frames) {
		var fbase = base + "frame #" + i + " ";
		var frame = frames[i];

		if (!frame || typeof(frame) != "object" || Array.isArray(frame)) {
			throw fbase + "is not an object";
		}
		if (isNaN(parseInt(frame.index))) {
			throw fbase + "has no index integer";
		}

		if (frames[i - 1] && frames[i - 1].index > frame.index) {
			throw fbase + "is out of order";
		}

		if (frame.interp) {
			try {
				frame.interp = getInterp(frame.interp);
			} catch (e) {
				throw fbase + "has invalid interpolation: " + frame.interp;
			}
		} else {
			frame.interp = anim.defaultInterp;
		}

		if (typeof(frame.props) != "object"
				|| Array.isArray(frame.props)) {
			throw fbase + "properties are not an object";
		}

		if (!frame.props || Object.keys(frame.props).length == 0) {
			throw fbase + "has no properties";
		}

		dealiasProps(fbase, frame.props);
	}

	validateProps(anim, anim.frames);
};
