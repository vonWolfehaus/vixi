/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 * @author Corey Birnbaum http://coldconstructs.com/ @vonWolfehaus
 */
define(function(require) {
	
	var GS = require('GS');
	var Container = require('Container');
	var Matrix = require('Matrix2');

	/**
	 * A Stage represents the root of the display tree. Everything connected to the stage is rendered
	 *
	 * @class Stage
	 * @extends Container
	 * @constructor
	 * 
	 * Creating a stage is a mandatory process when you use Pixi, which is as simple as this : 
	 * var stage = new Stage();
	 * where the parameter given is the background colour of the stage, in hex
	 * you will use this stage instance to add your sprites to it and therefore to the renderer
	 * Here is how to add a sprite to the stage : 
	 * stage.addChild(sprite);
	 */
	var Stage = function(width, height, view) {
		Container.call(this);
		
		/**
		 * This sets if the CanvasRenderer will clear the canvas or not before the new render pass.
		 *
		 * @property clearBeforeRender
		 * @type Boolean
		 * @default
		 */
		this.clearBeforeRender = true;
		
		// MY EYES, THEY BLEED
		GS.blendModesCanvas[GS.blendModes.NORMAL]   = 'source-over';
		GS.blendModesCanvas[GS.blendModes.ADD]      = 'lighter'; //IS THIS OK???
		GS.blendModesCanvas[GS.blendModes.MULTIPLY] = 'multiply';
		GS.blendModesCanvas[GS.blendModes.SCREEN]   = 'screen';
		GS.blendModesCanvas[GS.blendModes.OVERLAY]  = 'overlay';
		GS.blendModesCanvas[GS.blendModes.DARKEN]   = 'darken';
		GS.blendModesCanvas[GS.blendModes.LIGHTEN]  = 'lighten';
		GS.blendModesCanvas[GS.blendModes.COLOR_DODGE] = 'color-dodge';
		GS.blendModesCanvas[GS.blendModes.COLOR_BURN] = 'color-burn';
		GS.blendModesCanvas[GS.blendModes.HARD_LIGHT] = 'hard-light';
		GS.blendModesCanvas[GS.blendModes.SOFT_LIGHT] = 'soft-light';
		GS.blendModesCanvas[GS.blendModes.DIFFERENCE] = 'difference';
		GS.blendModesCanvas[GS.blendModes.EXCLUSION] = 'exclusion';
		GS.blendModesCanvas[GS.blendModes.HUE]       = 'hue';
		GS.blendModesCanvas[GS.blendModes.SATURATION] = 'saturation';
		GS.blendModesCanvas[GS.blendModes.COLOR]      = 'color';
		GS.blendModesCanvas[GS.blendModes.LUMINOSITY] = 'luminosity';
		
		/**
		 * The width of the canvas view
		 *
		 * @property width
		 * @type Number
		 * @default 800
		 */
		this.width = width || 800;

		/**
		 * The height of the canvas view
		 *
		 * @property height
		 * @type Number
		 * @default 600
		 */
		this.height = height || 600;

		/**
		 * The canvas element that everything is drawn to
		 *
		 * @property view
		 * @type HTMLCanvasElement
		 */
		this.view = view || document.createElement('canvas');

		/**
		 * The canvas 2d context that everything is drawn with
		 * @property context
		 * @type HTMLCanvasElement 2d Context
		 */
		this.context = this.view.getContext('2d');
		
		this.view.width = this.width;
		this.view.height = this.height;
		
		/**
		 * [read-only] Current transform of the object based on world (parent) factors
		 *
		 * @property worldTransform
		 * @type Mat3
		 * @readOnly
		 * @private
		 */
		this.worldTransform = new Matrix();
		
		// the stage is its own stage
		this.stage = this;
		
		// private
		this._scratch = null;
	};

	// constructor
	Stage.prototype = Object.create(Container.prototype);
	Stage.prototype.constructor = Stage;
	
	Stage.prototype.draw = function() {
		this._scratch = this.children.first;
		
		this.worldAlpha = 1;
		
		while (this._scratch) {
			this._scratch.obj.updateTransform();
			this._scratch = this._scratch.next;
		}
		
		this.context.setTransform(1,0,0,1,0,0);
		this.context.globalAlpha = 1;
		
		if (this.clearBeforeRender) {
			this.context.clearRect(0, 0, this.width, this.height);
		}
		
		this._scratch = this.children.first;
		while (this._scratch) {
			if (this._scratch.obj.visible && this._scratch.obj.alpha > 0) {
				this._scratch.obj.draw(this.context);
			}
			this._scratch = this._scratch.next;
		}
	};
	
	Stage.prototype.resize = function(width, height) {
		this.width = width;
		this.height = height;

		this.view.width = width;
		this.view.height = height;
	};

	/**
	 * Sets another DOM element which can receive mouse/touch interactions instead of the default Canvas element.
	 * This is useful for when you have other DOM elements on top of the Canvas element.
	 *
	 * @method setInteractionDelegate
	 * @param domElement {DOMElement} This new domElement which will receive mouse/touch events
	 */
	/*Stage.prototype.setInteractionDelegate = function(domElement) {
		this.interactionManager.setTargetDomElement(domElement);
	};*/
	
	return Stage;

});
