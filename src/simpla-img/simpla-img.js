import placeholder from './behaviors/placeholder';
import customDefault from './behaviors/default';
import persists from './behaviors/persists';
import popout from './behaviors/popout';

class SimplaImg {
  beforeRegister() {
    this.is = 'simpla-img';

    this.properties = {
      /**
       * Src string to be used for image. Must be compatible with a native img
       * 	element's src property.
       * @type {String}
       */
      src: {
        type: String,
        // Must have a value so that multi-param observers will get triggered
        //  straight away, see placeholder
        value: ''
      },

      /**
       * Set pixel width of image
       * @type {Number}
       */
      width: Number,

      /**
       * Set pixel height of image
       * @type {Number}
       */
      height: Number,

      /**
       * Set scale of image. Note that this doesn't make it larger than the width
       *  or height, scales above the height / width will crop the image at the edges.
       * @type {Number}
       */
      scale: {
        type: Number,
        value: 1
      },

      /**
       * Position object. Has properties x and y, this is the internal offset
       *  coordinates of the image. Defaults to x = 0, y = 0.
       * @type {Object}
       */
      position: {
        type: Object,
        value: { x: 0, y: 0 },
        observer: '_positionChanged'
      },

      /**
       * Whether image is active or not. This means that the img controls are
       * 	showing and it's being interacted with
       * @type {Boolean}
       */
      active: {
        type: Boolean,
        notify: true,
        value: false,
        observer: '_activeChanged'
      },

      /**
       * Whether it can be edited or not. This means it can be activated and
       * 	interacted with.
       * Note: It's initial value is a function, as it should check on each
       *  creation of an instance, otherwise hard core it at element registration
       * @type {Boolean}
       */
      editable: {
        type: Boolean,
        notify: true,
        value: () => Simpla.getState().editing
      }
    };
  }

  /**
   * Position observer. Updates the position of the internal canvas
   * @param  {Object} position Position object
   * @return {undefined}
   */
  _positionChanged(position) {
    this._canvas.translateX = position.x;
    this._canvas.translateY = position.y;
  }

  /**
   * Get current behaviors
   * See https://github.com/Polymer/polymer/issues/2451 as to why this isn't currently
   * inside beforeRegister
   * @return {Array} behaviors
   */
  get behaviors() {
    return [].concat(
      simpla.behaviors.blockNamespaceChild,
      popout,
      placeholder,
      customDefault,
      persists
    );
  }

  /**
   * Get event listeners
   * @return {Object} Keys are events, their values are listener functions on this
   */
  get listeners() {
    return {
      'tap': '_handleTap'
    };
  }

  ready() {
    // Sync image sizes is working appropriately
    this._syncImgSizing();
    window.addEventListener('resize', () => {
      this.debounce('syncImgSizing', this._syncImgSizing.bind(this));
    });

    // Bind editable to Simplas editing
    Simpla.observe('editing', (editing) => {
      this.editable = editing;
    });
  }

  /**
   * Update the this.position based on the current canvas translation
   * @return {undefined}
   */
  updatePosition() {
    const image = this._canvas;
    this.position = { x: image.translateX, y: image.translateY };
  }

  /**
   * Open file picker dialog as per sm-img-controls' openFilePicker function
   * 	Must be run inside a click event to conform to file input security
   * @param  {CustomEvent?} event Optional event to be passed, will stop propagation
   * @return {undefined}
   */
  chooseFile(event) {
    if (event) {
      event.stopPropagation();
    }

    this._controls.openFilePicker();
  }

  /**
   * Current canvas element
   * @type {SmImgCanvas}
   */
  get _canvas() {
    return this.$.image;
  }

  /**
   * Current controls element
   * @type {SmImgControls}
   */
  get _controls() {
    return this.$.controls;
  }

  /**
   * Current placeholder element
   * @type {SmUtilityPlaceholder}
   */
  get _placeholder() {
    return this.$.placeholder;
  }

  /**
   * File change listener. Takes value of event, parses it as base64 and sets
   * 	src to base64 encoded image. Also sets active to true, as any time the file
   * 	changes via the input, this should be active
   * @param  {Event} event File input changed event with new file value
   * @return {undefined}
   */
  _fileChanged(event) {
    let reader = new FileReader(),
        file = event.detail.value,
        src;

    reader.onloadend = () => {
      this.src = reader.result
      this.active = true;
    };

    reader.readAsDataURL(file);
  }

  /**
   * Active property observer.
   * 	When active, adds a listener to the window to close all non-img events,
   * 	otherwise removes listener.
   * @param  {Boolean} value Value of this.active
   * @return {undefined}
   */
  _activeChanged(value) {
    const makeInactive = (event) => {
      if (!event.__polymerGesturesHandled) {
        this.active = false;
      }
    };

    if (!this.active) {
      window.addEventListener('click', makeInactive, false);
    } else {
      window.removeEventListener('click', makeInactive, false);
    }
  }

  /**
   * Tap event handler. If this is editable, does one of two things, opens the
   * 	file picker if the placeholder is currently showing, otherwise just becomes
   * 	active.
   * @param  {CustomEvent} event Tap event
   * @return {undefined}
   */
  _handleTap(event) {
    const target = event.target;

    // If editing is disable, don't do anything.
    // If the target was the filepicker, let it deal with it itself
    if (!this.editable || target.type === 'file') {
      return;
    }

    if (target === this._placeholder) {
      this._controls.openFilePicker();
    } else {
      this.active = true;
    }
  }

  /**
   * Sync the sizing applied to this to the canvas to make sure this mimics sizing
   * 	sizing behavior of native img.
   * 	Native img will automatically adjust its height / width based on its other
   * 	height / width to keep its aspect ratio. To replicate this, we need to switch
   * 	between 100% / inherit on the below canvas depending on if there is an applied
   * 	percentage to this width / height
   * @return {undefined}
   */
  _syncImgSizing() {
    let image = this.$.image,
        isPercentage = (dimension) => {
          const oldDisplay = this.style.display;
          let computed,
              value;

          // Stop page from rendering, thus computed will be inherited value, rather
          //  than absolute value
          this.style.display = 'none';
          computed = window.getComputedStyle(this);
          value = computed[dimension];
          this.style.display = oldDisplay;

          return value.match(/%/);
        };

    image.style['width'] = isPercentage('width') ? '100%' : 'inherit';
    image.style['height'] = isPercentage('height') ? '100%' : 'inherit';
  }
}

Polymer(SimplaImg);
