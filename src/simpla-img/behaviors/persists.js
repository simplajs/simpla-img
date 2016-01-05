let corePersists,
    customPersists;

corePersists = simpla.behaviors.persists('api');

// Custom persists that extends core persists behavior
customPersists = {
  listeners: {
    'api.loaded': '_updateFromLoad'
  },

  observers: [
    '_uidChanged(uid)',
    '_savingChanged(saving)'
  ],

  get _uploadingAnimation() {
    const OPACITY_THRESHOLD = 0.3,
          PULSE_DOWN = 0.7,
          PULSE_UP = 1.5,
          DURATION = 875;

    let opacity,
        pulseOpacity,
        pulse,
        animation;

    opacity = parseFloat(window.getComputedStyle(this).opacity);

    if (opacity > OPACITY_THRESHOLD) {
      pulseOpacity = opacity * PULSE_DOWN;
    } else {
      pulseOpacity = opacity * PULSE_UP;
    }

    animation = this.animate([
      { opacity: opacity },
      { opacity: pulseOpacity }
    ], {
      easing: 'ease-in-out',
      duration: DURATION,
      direction: 'alternate',
      iterations: 2
    });

    // Force finish the animation straight away; we just want the animation object
    animation.finish();

    return animation;
  },

  /**
   * Convert current object to JSON serializable Object.
   * @return {Object} object representation of current value
   */
  _toObject() {
    let { src, position, title, scale } = this,
        { x, y } = position;
    return { src, position: { x, y }, title, scale };
  },

  /**
   * Setup self from given object
   * @param  {Object} value Value loaded from backend to setup all current img
   * @return {undefined}
   */
  _fromObject(value) {
    // If it doesn't have any information from the backend, use the default
    if (!value || Object.keys(value).length === 0) {
      this.useDefault = true;
    } else {
      // Store whether or not it's currently editable
      const pastEditable = this._canvas.editable;

      // Make sure the canvas is editable so changing the current values will
      //  update on the canvas
      this._canvas.editable = true;

      this.src = value.src;
      this.position = value.position ? {
        x: value.position.x,
        y: value.position.y
      } : { x: 0, y: 0 };
      this.title = value.title;
      this.scale = value.scale || 1;

      // Restore canvas editable status
      this._canvas.editable = pastEditable;
    }
  },

  /**
   * Check if two image elements / values are equal
   * @param  {mixed} imageA Img element object or value
   * @param  {mixed} imageB Img element object or value
   * @return {Boolean}      True if all persistent properties are deeply equal
   *                            between both images. False if otherwise
   */
  _equal(imageA, imageB) {
    return !!(imageA && imageB) &&
          imageA.src === imageB.src &&
          imageA.position && imageB.position &&
          imageA.position.x === imageB.position.x &&
          imageA.position.y === imageB.position.y &&
          imageA.title === imageB.title &&
          imageA.scale === imageB.scale;
  },

  /**
   * Sets up the current object from the given load event
   * @param  {CustomEvent} event Custom event with detail property
   * @return {undefined}
   */
  _updateFromLoad({ detail }) {
    this._fromObject(detail.value);
  },

  /**
   * uid observer, simply calls load() to reload data from server
   * @return {undefined}
   */
  _uidChanged() {
    this.load();
  },

  /**
   * saving observer, runs saving animation while saving is true
   * @param  {Boolean} saving Value of this.saving
   * @return {undefined}
   */
  _savingChanged(saving) {
    let animation = this._uploadingAnimation;

    if (saving) {
      this.active = false;
      animation.play();
      // Manually cause an infinite loop as long as saving is true
      animation.onfinish = () => {
        if (this.saving) {
          animation.play();
        }
      }
    }
  }

};

export default [ corePersists, customPersists ];
