import isColor from '../utils/isColor';

const backgroundVar = '--placeholder-background';

let corePlaceholder,
    placeholder;

corePlaceholder = simpla.behaviors.placeholder({
  observer: '_placeholderChanged',
  value: 'rgb(200,200,200)'
}, {
  observer: '_usePlaceholderChanged'
});

placeholder = {
  observers: [
    '_setPlaceholderFromEditable(editable)',
    '_setPlaceholderFromSrc(src)'
  ],

  _setPlaceholderFromEditable(editable) {
    this.usePlaceholder = editable && (!this.src || this.src === '');
  },

  _setPlaceholderFromSrc(src) {
    this.usePlaceholder = this.editable && (!src || src === '');
  },

  _usePlaceholderChanged(value) {
    this._canvas.style.display = value ? 'none' : '';
  },

  _placeholderChanged(value) {
    this.customStyle[backgroundVar] = isColor(value) ? value : `url(${value})`;
    this.updateStyles();
  }
};

export default [ corePlaceholder, placeholder ];
