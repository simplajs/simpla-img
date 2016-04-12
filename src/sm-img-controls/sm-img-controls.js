import animation from './behaviors/animation';

const TITLE_OPEN_CLASS = 'toolbox__title--expanded';

class SmImgControls {
  beforeRegister() {
    this.is = 'sm-img-controls';

    this.properties = {
      /**
       * Position of controls, whether they should be on the left or right
       * @type {String}
       */
      position: {
        type: String,
        reflectToAttribute: true,
        value: 'right'
      },

      /**
       * Current title bound to title input
       * @type {String}
       */
      title: {
        type: String,
        notify: true
      },

      /**
       * Current file in the file picker
       * @type {Object}
       */
      file: {
        type: Object,
        readonly: true,
        notify: true
      },

      /**
       * Current zoom level bound to the range
       * @type {Number}
       */
      zoom: {
        type: Number,
        notify: true
      },

      /**
       * If currently active or not
       * @type {Boolean}
       */
      active: {
        type: Boolean,
        notify: true,
        value: false
      }
    };
  }

  get behaviors() {
    return [
      animation
    ];
  }

  /**
   * Toggle the title open or closed, adds the TITLE_OPEN_CLASS when open
   * Also makes title button active as per open
   * @return {undefined}
   */
  toggleTitle() {
    let title = this.$.title,
        titleButton = this.$.titleButton,
        has = !!title.className.match(`\\b${TITLE_OPEN_CLASS}\\b`);

    titleButton.active = !has;
    this.toggleClass(TITLE_OPEN_CLASS, !has, title);
  }

  /**
   * Open the file picker prompt
   * @param  {HTMLEvent} event Stops propagation on given event
   * @return {undefined}
   */
  openFilePicker(event) {
    if (event) {
      event.stopPropagation();
    }

    this.$.file.click();
  }

  /**
   * Sets position (left/right) of main control toolbox based on position in
   * 	viewport; position is right if on the left hand side of the screen, and
   * 	left otherwise
   * @return {undefined}
   */
  _setPosition() {
    let windowCenter,
        bounds,
        center;

    windowCenter = {
      x: window.outerWidth / 2,
      y: window.outerHeight / 2
    };

    bounds = this.getBoundingClientRect();

    center = {
      x: bounds.left + bounds.width / 2,
      y: bounds.top + bounds.height / 2
    };

    this.position = center.x < windowCenter.x ? 'right' : 'left';
  }

  /**
   * Triggered whenever the file input changes,
   * 	updates this.file to the first file of the input's files
   * @param  {HTMLEvent} event File input event
   * @return {undefined}
   */
  _filesChanged(event) {
    let files = event.target.files;

    if (files && files[0]) {
      this.file = files[0];
    }
  }

  /**
   * Update this.zoom to the value of range this.$.zoom's value
   *  NOTE: This function is only to account for change (rather than input)
   *  event for IE
   *  @return {undefined}
   */
  _updateZoom() {
    this.zoom = this.$.zoom.value;
  }

}

Polymer(SmImgControls);
