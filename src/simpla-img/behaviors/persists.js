let corePersists,
    customPersists;

corePersists = simpla.behaviors.persists('api');
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
          MORE_OPAQUE = 0.7,
          MORE_TRANSPARENT = 1.5,
          DURATION = 1750;

    let opacity,
        pulseOpacity,
        animation;

    opacity = window.getComputedStyle(this).opacity;

    if (opacity > OPACITY_THRESHOLD) {
      pulseOpacity = opacity * MORE_OPAQUE;
    } else {
      pulseOpacity = opacity * MORE_TRANSPARENT;
    }

    animation = this.animate([
      { opacity: opacity },
      { opacity: pulseOpacity },
      { opacity: opacity }
    ], {
      easing: 'ease-in-out',
      duration: DURATION
    });

    animation.pause();

    return animation;
  },

  _toObject() {
    let { src, position, title, scale } = this,
        { x, y } = position;
    return { src, position: { x, y }, title, scale };
  },

  _fromObject(value) {
    const pastEditable = this._canvas.editable;
    this._canvas.editable = true;

    this.src = value.src;
    this.position = value.position ? {
      x: value.position.x,
      y: value.position.y
    } : { x: 0, y: 0 };
    this.title = value.title;
    this.scale = value.scale || 1;

    this._canvas.editable = pastEditable;
  },

  _equal(imageA, imageB) {
    return !!(imageA && imageB) &&
          imageA.src === imageB.src &&
          imageA.position && imageB.position &&
          imageA.position.x === imageB.position.x &&
          imageA.position.y === imageB.position.y &&
          imageA.title === imageB.title &&
          imageA.scale === imageB.scale;
  },

  _updateFromLoad({ detail }) {
    this._fromObject(detail.value);
  },

  _uidChanged() {
    this.load();
  },

  _savingChanged(saving) {
    let animation = this._uploadingAnimation;

    if (saving) {
      this.active = false
      animation.play();
      animation.onfinish = () => {
        if (saving){
          animation.play();
        }
      }
    }
  }

};

export default [ corePersists, customPersists ];
