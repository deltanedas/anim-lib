const anim = global.anim;

const animator = {
	process() {
		anim.animating = anim.animating.filter(handle => {
			if (handle.element.visible) {
				handle.step();
			}
			return !handle.stopped;
		});
	}
};

Events.run(Trigger.update, () => {
	animator.process();
});

module.exports = animator;
