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

// Custom placeholder that extends core placeholder behavior
placeholder = {
  observers: [
    '_setPlaceholderFromEditable(editable)',
    '_setPlaceholderFromSrc(src)'
  ],

  /**
   * Editable observer, sets usePlaceholder based on editable and src properties
   * @param {String} editable Value of editable
   */
  _setPlaceholderFromEditable(editable) {
    this.usePlaceholder = editable && (!this.src || this.src === '');
  },

  /**
   * Src observer, sets usePlaceholder based on editable and src properties
   * @param {[type]} src [description]
   */
  _setPlaceholderFromSrc(src) {
    this.usePlaceholder = this.editable && (!src || src === '');
  },

  /**
   * Setup the placeholder whenever usePlaceholder changes
   * 	hides / shows the canvas element if usePlaceholder is true / false respectively
   * @param  {Boolean} value Value of placeholder
   * @return undefined
   */
  _usePlaceholderChanged(value) {
    this._canvas.style.display = value ? 'none' : '';
  },

  /**
   * Placeholder observer, updates the current background based on the placeholder
   * @param  {String} value CSS background compatible string
   * @return undefined
   */
  _placeholderChanged(value) {
    this.customStyle[backgroundVar] = isColor(value) ? value : `url(${value})`;
    this.updateStyles();
  }
};

export default [ corePlaceholder, placeholder ];
