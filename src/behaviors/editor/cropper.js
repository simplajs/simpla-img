const DEFAULT_SCALE = 1,
      DEFAULT_TRANSLATE_X = 0,
      DEFAULT_TRANSLATE_Y = 0,
      DEFAULT_SIZING = 'length',
      RESET_CTX_TRANSFORM = [ 1, 0, 0, 1, 0, 0 ],
      PAN_FINISHED = 'pan-finished';

import { DEFAULT_SRC, EMPTY_DATA_URL } from '../constants';

let canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');

/**
 * Fit a value inside a range
 * @param  {Number} value Value to fit
 * @param  {Object} range Range, has min and max properties
 * @return {Number}       Value, or min if value is below min, or max if value is
 *                          greater than max
 */
function fitInside(value, range) {
  if (value < range.min) {
    return range.min;
  }

  if (value > range.max) {
    return range.max;
  }

  return value;
}

/**
 * Round given number to given precision e.g. round(1.54, 1) === 1.5
 * @param  {Number} number        Number to round
 * @param  {Number} [precision=0] Decimal places to round to
 * @return {Number}               Rounded number
 */
function round(number, precision = 0) {
  let factor = Math.pow(10, precision);

  // Move decimal back precision places, round, then move decimal to original
  //  position
  return Math.round(number * factor) / factor;
};

/**
 * 	Manipulable img canvas
 * 	emits 'pan-finished'
 */
export default {
  properties: {
    /**
     * Rendered output img in base64 encoding
     * @type {String}
     */
    output: {
      type: String,
      notify: true
    },

    /**
     * Position of image in x, y coordinates
     * @type {Object}
     */
    position: {
      type: Object,
      value: () => ({ x: 0, y: 0 }),
      observer: '_positionChanged',
      notify: true
    },

    /**
     * Duration of render debouncing. Increase for better performance,
     *  decrease for smoother syncing of image data
     * @type {Object}
     */
    debounceDuration: {
      type: Number,
      value: 100
    },

    /**
     * Current transform string being applied to image
     * @type {Object}
     */
    _transform: {
      type: String,
      value: ''
    }
  },

  observers: [
    '_updateStyles(_transform)',
    '_debouncedRender(_transform, src)',
    '_updatePosition(_transform)',
    '_updateScale(zoom)'
  ],

  attached() {
    this.setScrollDirection('all', this.$.source);
  },

  /**
   * Updates UI with current scale / translateX / translateY
   * will not happen instantly, happens on next animationFrame
   * @return {undefined}
   */
  _paint() {
    // Cancel the last tick if there is one waiting
    if (this._tick) {
      cancelAnimationFrame(this._tick);
      this._tick = null;
    }

    // The next tick is the requestAnimationFrame result, so it can be cancelled
    this._tick = requestAnimationFrame(() => {
      let { scale, translateX, translateY } = this;

      this._transform = `scale(${scale}) translateX(${translateX}px) translateY(${translateY}px)`;
    });
  },

  _updateScale(zoom) {
    this.scale = zoom;
  },

  /**
   * @type {Number}
   */
  get scale() {
    return this._scale || DEFAULT_SCALE;
  },

  /**
   * @param {Number} value to set scale
   * @type {Number}
   * @return {undefined}
   */
  set scale(value) {
    let min = this.minScale;

    if (value < min) {
      this._scale = round(parseFloat(min), 2);
    } else {
      this._scale = round(parseFloat(value), 2);
    }

    // Trigger a change to translateX / translateY, incase they haven't been
    //  set yet
    this.translateX += 0;
    this.translateY += 0;

    // Trigger a paint
    this._paint();
  },

  /**
   * @type {Number}
   */
  get translateX() {
    return this._translateX || DEFAULT_TRANSLATE_X;
  },

  /**
   * @param {Number} value Value to set translateX
   * @type {Number}
   * @return {undefined}
   */
  set translateX(value) {
    this._translateX = round(fitInside(value, this._bounds.x));
    this._paint();
  },

  /**
   * @type {Number}
   */
  get translateY() {
    return this._translateY || DEFAULT_TRANSLATE_Y;
  },

  /**
   * @param {Number} value Value to set translateY
   * @type {Number}
   * @return {undefined}
   */
  set translateY(value) {
    this._translateY = round(fitInside(value, this._bounds.y));
    this._paint();
  },

  /**
   * @type {Number}
   */
  get minScale() {
    let scaleHeight = this.height / this.$.source.height,
        scaleWidth = this.width / this.$.source.width;


    if (isNaN(scaleHeight) || isNaN(scaleWidth)) {
      return 1;
    }

    // minScale is the smaller of scaleHeight and scaleWidth. Which are the
    //  ratios between this height / width and the native img height / width,
    //  respectively.
    return scaleHeight < scaleWidth ? scaleHeight : scaleWidth;
  },

  /**
   * The allowed bounds that the image can be transformed within, in both the
   * x and y directions
   * @type {Object}
   */
  get _bounds() {
    let getMinAndMax = (overflow) => ({ min: - overflow / 2, max: overflow / 2 }),
        overflowX,
        overflowY;

    if (!(this._imgWidth && this._width && this._imgHeight && this._height)) {
      return {
        x: { min: Number.NEGATIVE_INFINITY, max: Number.POSITIVE_INFINITY },
        y: { min: Number.NEGATIVE_INFINITY, max: Number.POSITIVE_INFINITY }
      };
    }

    overflowX = this._imgWidth - this._width / this.scale;
    overflowY = this._imgHeight - this._height / this.scale;

    return {
      x: getMinAndMax(overflowX),
      y: getMinAndMax(overflowY)
    };
  },

  /**
   * Reset the internal dimensions to the offsetWidth / offsetHeights of this and
   * the internal img
   * @return {undefined}
   */
  _resetDimensions() {
    this._width = this.offsetWidth;
    this._height = this.offsetHeight;

    this._imgWidth = this.$.source.offsetWidth;
    this._imgHeight = this.$.source.offsetHeight;
  },

  /**
   * Takes tracking event and updates coordinates.
   * @param {CustomEvent} event Tracking event as specified by polymer
   * @return {undefined}
   */
  _dragImage(event) {
    let { dx, dy, ddx, ddy, state } = event.detail;

    if (this.lockTransform) {
      return;
    }

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
  },

  /**
   * Called whenever image is loaded, resets the dimensions
   * @return {undefined}
   */
  _imageLoaded() {
    this._resetDimensions();
  },

  /**
   * Update translateX and translateY values with position
   * @param  {Object} position Position with x y coords
   * @return {undefined}
   */
  _positionChanged(position) {
    if (position) {
      let { x, y } = position;
      this.translateX = x;
      this.translateY = y;
    }
  },

  /**
   * Update position with current translateX and translateY values
   * @return {undefined}
   */
  _updatePosition() {
    this.position = {
      x: this.translateX,
      y: this.translateY
    };
  },

  /**
   * Update the styles with new transform string
   * @param {String} transform Transform CSS String
   * @return {undefined}
   */
  _updateStyles(transform) {
    this.$.source.style.transform = transform;
  },

  /**
   * Debounces rendering
   * @return {undefined}
   */
  _debouncedRender() {
    if (this.lockTransform) {
      return;
    }

    this.debounce('render', this._render, this.debounceDuration);
  },

  /**
   * Render image to output
   * @return {undefined}
   */
  _render() {
    let { width, height, scale, translateX, translateY } = this,
        { naturalWidth, naturalHeight } = this.$.source,
        naturalTranslateX = translateX / (width / naturalWidth),
        naturalTranslateY = translateY / (height / naturalHeight),
        getMidpointOf = (dimension) => dimension / scale * (1 - scale) / 2,
        output;

    canvas.width = naturalWidth;
    canvas.height = naturalHeight;

    ctx.setTransform(...RESET_CTX_TRANSFORM);
    ctx.scale(scale, scale);
    ctx.translate(naturalTranslateX, naturalTranslateY);
    ctx.drawImage(this.$.source, getMidpointOf(naturalWidth), getMidpointOf(naturalHeight));

    output = canvas.toDataURL();

    console.log(output)

    this.output = output === EMPTY_DATA_URL ? DEFAULT_SRC : output;
  }
}
