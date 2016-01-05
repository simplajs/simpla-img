const ANIMATION_OPTS = {
        easing: simpla.constants.easings.easeOutCubic,
        fill: 'both',
        duration: 150
      },
      ZOOM_FACTOR = 1.02,
      IMG_GUTTER = 12,
      THRESHOLD = 15;

/**
 * Popout behavior transforms image into the view of the image when editable
 * 	using animation for transitions
 */
export default {

  properties: {
    /**
     * Whether to popout or not
     * @type {Boolean}
     */
    popout: {
      type: Boolean,
      reflectToAttribute: true,
      value: false
    },

    /**
     * Whether is popped out or not
     * @type {Boolean}
     */
    popped: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },

    /**
     * Object to store information about image before popping out
     * @type {Object}
     */
    _prePopped: {
      type: Object,
      value: {
        inlineWidth: '',
        inlineHeight: ''
      }
    }
  },

  observers: [
    '_togglePopped(active, popout, popped)'
  ],

  ready() {
    // On scolling, force img to become inactive and un-popped
    window.addEventListener('scroll', () => {
      if (this.popped) {
        this.active = this.popped = false;
      }
    });
  },

  /**
   * Toggle whether popper or not based on given parameters.
   *  Should popout if active and (it should popout or its outside the viewport),
   *  otherwise pops back in
   * @param  {Boolean} active Value of active property
   * @param  {Boolean} popout Value of popout property
   * @param  {Boolean} popped Value of popped property
   * @return {undefined}
   */
  _togglePopped(active, popout, popped) {
    if (active && (popout || !this._inViewport())) {
      this._popOut();
    } else if (popped) {
      this._popBack()
    }
  },

  /**
   * Getter for _poppedFrames
   * @return {Array} Frames for popping out
   */
  get _poppedFrames() {
    let img = this.getBoundingClientRect(),
        offset = {
          top: img.top,
          left: img.left
        };

    if (img.right > window.innerWidth) {
      offset.left = window.innerWidth - img.width - IMG_GUTTER;
    } else if (img.left < IMG_GUTTER) {
      offset.left = IMG_GUTTER;
    }

    if (img.bottom > window.innerHeight) {
      offset.top = window.innerHeight - img.height - IMG_GUTTER;
    } else if (img.top < IMG_GUTTER) {
      offset.top = IMG_GUTTER;
    }

    return [
      { top: `${img.top}px`, left: `${img.left}px`, transform: 'scale(1)' },
      { top: `${offset.top}px`, left: `${offset.left}px`, transform: `scale(${ZOOM_FACTOR})` }
    ];
  },

  /**
   * Popout the current image
   * @return {undefined}
   */
  _popOut() {
    let frames = this._poppedFrames,
        img = this.getBoundingClientRect(),
        editor = this.$.editor;

    this.popped = true;

    // Cache any existing inline styles
    this._prePopped.inlineWidth = this.style.width;
    this._prePopped.inlineHeight = this.style.height;

    this.style.width = `${img.width}px`;
    this.style.height = `${img.height}px`;

    // Set fixed position after img has width/height
    editor.style.position = 'fixed';

    editor.animate(frames, ANIMATION_OPTS);

  },

  /**
   * Pop image back into place
   * @return {undefined}
   */
  _popBack() {
    let { inlineWidth, inlineHeight } = this._prePopped,
        frames = this._poppedFrames,
        editor = this.$.editor,
        animation;

    animation = editor.animate(frames.reverse(), ANIMATION_OPTS);
    animation.onfinish = () => {
      this.style.width = inlineWidth;
      this.style.height = inlineHeight;
      editor.style.position = '';
      this.popped = false;
    }

  },

  /**
   * Helper for toggling popout mode on tap
   * @return {Boolean} if img is in viewport or not
   */
  _inViewport() {
    const bounds = this.getBoundingClientRect(),
          topInside = bounds.top >= -THRESHOLD,
          leftInside = bounds.left >= -THRESHOLD,
          bottomInside = bounds.bottom <= window.innerHeight + THRESHOLD,
          rightInside = bounds.right <= window.innerWidth + THRESHOLD;

    return topInside && leftInside && bottomInside && rightInside;
  }

}
