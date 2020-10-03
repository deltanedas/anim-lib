const anim = require("anim-lib/library");
require("anim-lib/animator");

const ui = require("ui-lib/library");

anim.addAnimation("test");
ui.addTable("side", "waffles", t => {
	const img = t.image(new TextureRegionDrawable(Core.atlas.find("router"))).get();
	img.size = 64;
	img.setOrigin(32, 32);
	anim.animate(img, "test", true);
});
