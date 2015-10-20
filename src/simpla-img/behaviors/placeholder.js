import { DEFAULT_PLACEHOLDER, DEFAULT_WIDTH, DEFAULT_HEIGHT } from '../constants/defaults';

export default {
  behaviors: [
    simpla.behaviors.placeholder()
  ],

  properties: {
    _placeholderSrc: {
      type: String,
      computed: '_computePlaceholderSrc(placeholder)',
      value: DEFAULT_PLACEHOLDER
    },
    _placeholderWidth: {
      type: Number,
      computed: '_computePlaceholderWidth(width)',
      value: DEFAULT_WIDTH
    },
    _placeholderHeight: {
      type: Number,
      computed: '_computePlaceholderHeight(height)',
      value: DEFAULT_HEIGHT
    }
  },

  observers: [
    '_updatePlaceholder(src, editable)',
    '_usePlaceholderChanged(usePlaceholder)'
  ],

  _updatePlaceholder(src, editable) {
    this.usePlaceholder = editable && (!src || src === '');
  },

  _computePlaceholderSrc(placeholder) {
    return placeholder || DEFAULT_PLACEHOLDER
  },

  _computePlaceholderWidth(width) {
    return width || DEFAULT_WIDTH;
  },

  _computePlaceholderHeight(height) {
    return height || DEFAULT_HEIGHT;
  },

  _usePlaceholderChanged(value) {
    this._canvas.style.display = value ? 'none' : '';
  }
}
