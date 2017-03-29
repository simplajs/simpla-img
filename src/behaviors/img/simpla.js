import { DEFAULT_SRC } from '../constants';

export default {
  properties: {
    /**
     * Simpla data ID
     * @type {String}
     */
    path: {
      type: String,
      observer: '_initPath'
    },

    /**
     * Stored Simpla observers
     * @type {Object}
     */
    _simplaObservers: {
      type: Object,
      value: () => ({})
    }
  },

  observers: [
    '_setData(src, alt, path)'
  ],

   /**
   * Check for Simpla on element creation
   * @return {undefined}
   */
  created() {
    if (!window.Simpla) {
      console.error('Cannot find Simpla global');
    }
  },

  /**
   * Setup editable state observer on attach
   * @return {undefined}
   */
  attached() {
    this.editable = this.editable || Simpla.getState('editable');
    this._observeEditable();
  },

  /**
   * Clean up Simpla observers on detach
   * @return {undefined}
   */
  detached() {
    Object.keys(this._simplaObservers)
      .forEach(observer => {
        this._simplaObservers[observer].unobserve();
      });
    this._simplaObservers = [];
  },

  /**
   * Init the path whenever it changes
   * @param  {String} path Current value of path prop
   * @return {undefined}
   */
  _initPath(path) {
    Simpla.get(path)
      .then(item => this._setPropsFromSimpla(item));

    this._observeBuffer(path);
  },

  /**
   * Set internal value to Simpla on change
   * @param {String} src    Internal img source
   * @param {String} alt    Internal img alt
   * @param {String} path   Element Path
   * @return {Promise}      Promise which resolves once successfully set to Simpla
   */
  _setData(src, alt, path) {
    if (this.__comingFromSimpla || src === DEFAULT_SRC) {
      return;
    }

    return Simpla.set(path, {
      type: 'Image',
      data: {
        src: this.src,
        alt: this.alt
      }
    });
  },

  /**
   * Data buffer observer
   * @param  {String} path Path to observe in buffer
   * @return {undefined}
   */
  _observeBuffer(path) {
    let observers = this._simplaObservers;

    if (!path) {
      return;
    }

    if (observers.buffer) {
      observers.buffer.unobserve();
    }

    observers.buffer = Simpla.observe(path, (item) => this._setPropsFromSimpla(item));
  },

  /**
   * Set own properties from Simpla item
   * @param  {Object} item Item from Simpla. Should have `data` prop
   * @return {undefined}
   */
  _setPropsFromSimpla(item) {
    if (item && item.data) {
      this.__comingFromSimpla = true;
      Object.assign(this, item.data);
      this.__comingFromSimpla = false;
    }
  },

  /**
   * Editable state observer
   * @return {undefined}
   */
  _observeEditable() {
    let observers = this._simplaObservers;

    if (observers.editable) {
      observers.editable.unobserve();
    }

    observers.editable = Simpla.observeState('editable',
      editable => this.editable = editable
    );
  }
}
