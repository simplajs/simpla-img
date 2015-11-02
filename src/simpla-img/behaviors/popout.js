const ANIMATION_OPTS = {
        easing: simpla.constants.easings.easeOutCubic,
        fill: 'both',
        duration: 150
      },
      ZOOM_FACTOR = 1.02,
      IMG_GUTTER = 12;

export default {

  observers: [
    '_togglePopped(active)'
  ],

  _togglePopped(active) {
    if (active && this.popout) {
      this._popOut();
    } else if (this.popout) {
      this._popBack();
    }
  },

  get _poppedFrames() {
    let img = this.getBoundingClientRect(),
        offset = {
          top: img.top,
          left: img.left
        };

    if (img.left < IMG_GUTTER) {
      offset.left = IMG_GUTTER;
    }

    if (img.right > window.innerWidth) {
      offset.left = window.innerWidth - img.width - IMG_GUTTER;
    }

    if (img.top < IMG_GUTTER) {
      offset.top = IMG_GUTTER;
    }

    if (img.bottom > window.innerHeight) {
      offset.top = window.innerHeight - img.height - IMG_GUTTER;
    }

    return [
      { top: `${img.top}px`, left: `${img.left}px`, transform: 'scale(1)' },
      { top: `${offset.top}px`, left: `${offset.left}px`, transform: `scale(${ZOOM_FACTOR})` }
    ];
  },

  _popOut() {
    let frames = this._poppedFrames,
        img = this.getBoundingClientRect(),
        editor = this.$.editor;

    this.style.width = img.width + 'px';
    this.style.height = img.height + 'px';

    // Set fixed position after img has width/height
    editor.style.position = 'fixed';

    editor.animate(frames, ANIMATION_OPTS);
  },

  _popBack() {
    let frames = this._poppedFrames,
        img = this.getBoundingClientRect(),
        editor = this.$.editor,
        animation;

    animation = editor.animate(frames.reverse(), ANIMATION_OPTS);
    animation.onfinish = () => {
      editor.style.position = '';
      this.style.width = '';
      this.style.height = '';

    }

  },

  /**
   * Helper for toggling popout mode on tap
   * @return {Boolean} if img is in viewport or not
   */
  _inViewport() {
    let bounds = this.getBoundingClientRect();
    return bounds.top >= 0 && bounds.left >= 0 && bounds.bottom <= window.innerHeight && bounds.right <= window.innerWidth;
  }




}
