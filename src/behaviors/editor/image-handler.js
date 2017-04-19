import { DEFAULT_SRC } from '../constants';

const cache = ((store) => ({
  get: (key) => {
    return store[key]
  },
  set: (key, value) => {
    store[key] = value
  }
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
    '_maybeAskForFilePicker(image)',
    '_updateImageData(output, alt)',
    '_debouncedUpdateCache(src, alt, position, lockTransform, zoom)',
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
      let {
        src,
        alt = '',
        position = { x: 0, y: 0},
        zoom = 1,
        lockTransform = false
      } = cache.get(this._getImageKey(image)) || {},
          imageData = this._getImageData(image),
          cachedData = { alt, position, zoom };

      if (src) {
        cachedData.src = src;
      }

      // lockTransform is readOnly, so can't use it in the assign
      this._setLockTransform(lockTransform);

      Object.assign(this, imageData, cachedData);
    }
  },

  _debouncedUpdateCache(src, alt, position, lockTransform, zoom) {
    let { image } = this;

    if (image) {
      let key = this._getImageKey(image);
      this.debounce(`set-cache-${key}`, () => {
        cache.set(key, { src, alt, position, lockTransform, zoom });
      });
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

  _restoreImageFocus(event) {
    let image = this.image,
        blurHandler;

    blurHandler = () => {
      this.__restoringFocus = true;
      this._editImage(image);
      this.__restoringFocus = false;
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

  _maybeAskForFilePicker(image) {
    if (image && image.src === DEFAULT_SRC && !this.__restoringFocus) {
      this.openFilePicker();
    }
  },

  _getImageData(image) {
    return { src: image.src, alt: image.alt };
  },

  _setImageData(image, { output: src, alt }) {
    Object.assign(image, { src, alt });
  },

  _closeImage(image) {
    image.active = false;
  },

  _getImageKey(image) {
    return image.path;
  },

  _editImage(image) {
    image.active = true;
  }
}
