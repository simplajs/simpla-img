import { fitInside, prefixStyle } from './helpers/utils.js';

const DEFAULT_SCALE = 1,
      DEFAULT_TRANSLATE_X = 0,
      DEFAULT_TRANSLATE_Y = 0,
      DEFAULT_SIZING = 'length',
      PAN_FINISHED = 'pan-finished';

/**
 * 	Manipulable img canvas
 * 	emits 'pan-finished'
 */
class smImgCanvas {
  beforeRegister() {
    this.is = 'sm-img-canvas';

    this.properties = {
      width: Number,
      height: Number,
      src: String,
      scale: Number,
      translateX: Number,
      translateY: Number
    };
  }

  get behaviors() {
    return [
      simpla.behaviors.editable({
        reflectToAttribute: true,
        notify: false
      }),
      simpla.behaviors.active({
        reflectToAttribute: true
      })
    ];
  }

  /**
   * Updates UI with current scale / translateX / translateY
   * will not happen instantly, happens on next animationFrame
   * @return {Integer} result of requestAnimationFrame
   */
  _paint() {
    if (this._tick) {
      cancelAnimationFrame(this._tick);
      this._tick = null;
    }

    this._tick = requestAnimationFrame(() => {
      let { scale, translateX, translateY } = this,
          transform = `scale(${scale}) translateX(${translateX}px) translateY(${translateY}px)`;

      prefixStyle('Transform').concat('transform').forEach(style => {
        this.$.source.style[style] = transform;
      });
    });
  }

  /**
   * @type {Number}
   */
  get scale() {
    return this._scale || DEFAULT_SCALE;
  }

  /**
   * @type {Number}
   */
  set scale(value) {
    if (!this.editable) {
      return;
    }

    let min = this.minScale;

    if (value < min) {
      this._scale = parseFloat(min);
    } else {
      this._scale = parseFloat(value);
    }

    this.translateX += 0;
    this.translateY += 0;

    this._paint();
  }

  /**
   * @type {Number}
   */
  get translateX() {
    return this._translateX || DEFAULT_TRANSLATE_X;
  }

  /**
   * @type {Number}
   */
  set translateX(value) {
    if (!this.editable) {
      return;
    }

    this._translateX = fitInside(value, this._bounds.x);
    this._paint();
  }

  /**
   * @type {Number}
   */
  get translateY() {
    return this._translateY || DEFAULT_TRANSLATE_Y;
  }

  /**
   * @type {Number}
   */
  set translateY(value) {
    if (!this.editable) {
      return;
    }

    this._translateY = fitInside(value, this._bounds.y);
    this._paint();
  }

  /**
   * @type {Number}
   */
  get minScale() {
    let scaleHeight = this.height / this.$.source.height,
        scaleWidth = this.width / this.$.source.width;


    if (isNaN(scaleHeight) || isNaN(scaleWidth)) {
      return 1;
    }

    return scaleHeight < scaleWidth ? scaleHeight : scaleWidth;
  }

  get _bounds() {
    if (!(this._imgWidth && this._width && this._imgHeight && this._height)) {
      return {
        x: { min: Number.NEGATIVE_INFINITY, max: Number.POSITIVE_INFINITY },
        y: { min: Number.NEGATIVE_INFINITY, max: Number.POSITIVE_INFINITY }
      };
    }

    return {
      x: { min: -(this._imgWidth * this.scale - this._width) / this.scale, max: 0 },
      y: { min: -(this._imgHeight * this.scale - this._height) / this.scale, max: 0 }
    };
  }

  _resetDimensions() {
    this._width = this.offsetWidth;
    this._height = this.offsetHeight;

    this._imgWidth = this.$.source.offsetWidth;
    this._imgHeight = this.$.source.offsetHeight;
  }

  /**
   * Takes tracking event and updates coordinates.
   * @param {CustomEvent} event Tracking event as specified by polymer
   */
  _dragImage(event) {
    let { dx, dy, ddx, ddy, state } = event.detail;

    // Only set the bounds on start to reduce calls to getBoundingClientRect
    if ( state === 'start' ) {
      this._resetDimensions();
    }

    // At the start, we want dx incase it traveled. Just a precaution - probably unecessary.
    this.translateX += (state === 'start' ? dx : ddx) / this.scale;
    this.translateY += (state === 'start' ? dy : ddy) / this.scale;

    if ( state === 'end' ) {
      this.fire(PAN_FINISHED);
    }
  }

  /**
   * Stops any event given to it by calling event.preventDefault()
   * @param {Event} event Event to stop
   */
  _stopEvent(event) {
    event.preventDefault();
  }

  _imageLoaded() {
    this._resetDimensions();
  }
}

Polymer(smImgCanvas);
