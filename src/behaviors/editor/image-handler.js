const cache = ((store) => ({
  get: (key) => store[key],
  set: (key, value) => store[key] = value
}))({});

export default {
  properties: {
    image: {
      type: Object,
      value: null
    }
  },

  observers: [
    '_updateImageFromActive(active)',
    '_updateActiveFromImage(image)',
    '_updateImageData(output, alt)',
    '_updateCache(src, alt, position)',
    '_loadDataFromImage(active, image)',
    '_resizeFromImage(image)'
  ],

  listeners: {
    'opening-filepicker': '_restoreImageFocus',
    'image-uploaded': '_updateImageSrc'
  },

  _resizeFromImage(image) {
    if (image) {
      Object.assign(this, this._getImageBounds(image));
    }
  },

  _loadDataFromImage(active, image) {
    if (active && image) {
      Object.assign(this, this._getImageData(image), cache.get(this._getImageKey(image)));
    }
  },

  _updateImageFromActive(active) {
    if (!active && this.image) {
      this._closeImage(this.image);
    }
  },

  _updateActiveFromImage(image) {
    this.active = !!image;
  },

  _updateImageData(output, alt) {
    if (this.image) {
      this._setImageData(this.image, { output, alt });
    }
  },

  _updateCache(src, alt, position) {
    let { image } = this;

    image && cache.set(this._getImageKey(image), { src, alt, position });
  },

  _restoreImageFocus(event) {
    let image = this.image,
        blurHandler;

    blurHandler = () => {
      this._editImage(image);
      this.removeEventListener('blur', blurHandler);
    };

    this.addEventListener('blur', blurHandler);
  },

  _updateImageSrc() {
    let image = this.image,
        updateSize;

    updateSize = (event) => {
      this._resizeFromImage(image);
      image.removeEventListener('load', updateSize);
    };

    image.addEventListener('load', updateSize);
    this._updateImageData(this.src, this.alt);
  },

  /**
   * Image utilities
   */

  _getImageBounds(image) {
    let { top, left, width, height } = image.getBoundingClientRect(),
        { scrollX, scrollY } = window;

    top += scrollY;
    left += scrollX;

    return { top, left, width, height };
  },

  _getImageData(image) {
    return { src: image.src, alt: image.alt };
  },

  _setImageData(image, { output: src, alt }) {
    Object.assign(image, { src, alt });
  },

  _closeImage(image) {
    image.editing = false;
  },

  _getImageKey(image) {
    return image.uid;
  },

  _editImage(image) {
    image.editing = true;
  }
}
