let corePersists,
    customPersists;

corePersists = simpla.behaviors.persists('api');
customPersists = {
  listeners: {
    'loaded': '_updateFromLoad'
  },

  observers: [
    '_uidChanged(uid)',
    '_savingChanged(saving)'
  ],

  _savingChanged(saving) {
    if (saving) {
      this.$.controls.active = false
    }
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
  }
};

export default [ corePersists, customPersists ];
