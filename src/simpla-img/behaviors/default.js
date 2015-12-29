let coreDefault,
    customDefault;

coreDefault = simpla.behaviors.default();

// Custom default that extends core default behavior
customDefault = {
  properties: {
    /**
     * Set to true if it should use the default value
     * @type {Boolean}
     */
    useDefault: {
      type: Boolean,
      observer: '_useDefaultChanged',
      value: false
    }
  },

  observers: [
    '_updateDefault(useDefault, _default)'
  ],

  /**
   * Sets this.src to default value if useDefault is valid and _default is set
   * 	Called everytime useDefault or _default changes
   * @param  {Boolean}  useDefault Whether or not to use default value
   * @param  {String}   _default   The default value to use
   * @return undefined
   */
  _updateDefault(useDefault, _default) {
    if (useDefault) {
      this.src = this._default;
    }
  },

  /**
   * Observes useDefault, sets the src to default if both are truthy
   * @param  {Boolean} value Value of useDefault
   * @return undefined
   */
  _useDefaultChanged(value) {
    if (value && this._default) {
      this.src = this._default;
    }
  },

  /**
   * Parse value of default attribute to default value
   *  Must be implemented to match the core behavior
   * @param {String} value Value of default attribute
   */
  _setDefaultAttribute(value) {
    this._default = value;
  },

  /**
   * Take the default value from a default element, takes the src attribute of
   *  an img inside default-content and sets it on _default
   * @param {HTMLElement} element Custom element of type default-content
   */
  _setDefaultElement(element) {
    let img = Polymer.dom(element).querySelector('img');
    this._default = img.src;
  }
};

export default [ coreDefault, customDefault ];
