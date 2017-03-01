export default {
  properties: {
    /**
     * Simpla data ID
     * @type {String}
     */
    uid: {
      type: String,
      observer: '_initUid'
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
    '_setData(src, alt, uid)'
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
   * Init the UID whenever it changes
   * @param  {String} uid Current value of UID prop
   * @return {undefined}
   */
  _initUid(uid) {
    Simpla.get(uid)
      .then(item => {
        if (item && item.data) {
          Object.assign(this.data, item.data);
        }
      });

    this._observeBuffer(uid);
  },

  /**
   * Set internal value to Simpla on change
   * @param {String} value Internal markdown source
   * @param {String} uid   Element UID
   * @return {Promise}
   */
  _setData(src, alt, uid) {
    return Simpla.set(uid, {
      type: 'Image',
      data: {
        src: src,
        alt: alt
      }
    });
  },

  /**
   * Data buffer observer
   * @param  {String} uid UID to observe in buffer
   * @return {undefined}
   */
  _observeBuffer(uid) {
    let observers = this._simplaObservers,
        setProps = (item) => {
          if (item && item.data) {
            Object.assign(this, item.data);
          }
        };

    if (!uid) {
      return;
    }

    if (observers.buffer) {
      observers.buffer.unobserve();
    }

    observers.buffer = Simpla.observe(uid, setProps);
  },

  /**
   * Editable state observer
   * @return {undefined}
   */
  _observeEditable() {
    let observers = this._simplaObservers;

    this.editable = Simpla.getState('editable');

    if (observers.editable) {
      observers.editable.unobserve();
    }

    observers.editable = Simpla.observeState('editable',
      editable => this.editable = editable
    );
  }
}
