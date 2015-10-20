let coreDefault,
    customDefault;

coreDefault = simpla.behaviors.default();
customDefault = {
  properties: {
    useDefault: {
      type: Boolean,
      observer: '_useDefaultChanged',
      value: false
    }
  },

  _useDefaultChanged(value) {
    if (value) {
      this.src = this._default;
    }
  },

  _setDefaultAttribute(value) {
    this._default = value;
  },

  _setDefaultElement(element) {
    let img = Polymer.dom(element).querySelector('img');
    this._default = img.src;
  }
};

export default [ coreDefault, customDefault ];
