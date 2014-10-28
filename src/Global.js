define(function(require) {
	var Rectangle = require('Rectangle');
	
	var Global = {
		blendModes: {
			NORMAL:0,
			ADD:1,
			MULTIPLY:2,
			SCREEN:3,
			OVERLAY:4,
			DARKEN:5,
			LIGHTEN:6,
			COLOR_DODGE:7,
			COLOR_BURN:8,
			HARD_LIGHT:9,
			SOFT_LIGHT:10,
			DIFFERENCE:11,
			EXCLUSION:12,
			HUE:13,
			SATURATION:14,
			COLOR:15,
			LUMINOSITY:16
		},
		
		blendModesCanvas: [
			'source-over',
			'lighter',
			'multiply',
			'screen',
			'overlay',
			'darken',
			'lighten',
			'color-dodge',
			'color-burn',
			'hard-light',
			'soft-light',
			'difference',
			'exclusion',
			'hue',
			'saturation',
			'color',
			'luminosity'
		],
		
		currentBlendMode: 0,
		
		scaleModes: {
			DEFAULT:0,
			LINEAR:0,
			NEAREST:1
		},
		
		EmptyRectangle: new Rectangle()
	};
	
	return Global;
	
});