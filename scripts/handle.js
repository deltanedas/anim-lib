const anim = this.global.anim;

const properties = require("anim-lib/props");

module.exports = (an, elem, loop) => {
	if (an.handles[elem]) {
		const handle = an.handles[elem];
		handle.set(elem);
		return handle;
	}

	const handle = extend(java.lang.Object, {
		set(element) {
			if (this.element) {
				this.reset();
			}

			this.element = element;
			this.save();
			this.start();
		},

		stop() {
			if (!this.stopped) {
				this.reset();
				delete an.handles[this.element];
			}

			this.frame = an.length;
			this.stopped = true;
		},

		// Don't call before step() has run
		start() {
			if (this.stopped) {
				anim.animating.push(this);
				an.handles[this.element] = this;
			}

			this.frame = 0;
			this.stopped = false;
		},

		reset() {
			for (var i in this.initial) {
				this.element[i] = this.initial[i];
			}
		},

		save() {
			const el = this.element;
			this.initial = {
				color: new Color(el.color),
				scaleX: el.scaleX,
				scaleY: el.scaleY,
				x: el.x, y: el.y,
				width: el.width,
				height: el.height
			};
		},

		processFrame(frame) {
			const progress = frame.interp.apply((this.frame - frame.index) / frame.length);
			for (var name in frame.props) {
				if (frame.next[name] == undefined) continue;

				properties[name](this.element,
					frame.props[name], frame.next[name],
					progress);
			}
		},

		process() {
			for (var frame of an.frames) {
				if (frame.end < this.frame) continue;
				if (frame.index > this.frame) break;

				this.processFrame(frame);
			}
		},

		step: loop ? function() {
			this.frame++;
			this.process();
			this.frame %= an.length;
		} : function() {
			this.frame++;
			this.process();
			if (this.frame >= an.length) this.stop();
		},

		stopped: true,
		frame: an.length,
		element: null
	});

	handle.set(elem);
	return handle;
};
