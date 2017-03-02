const CROPPER_OPTS = {
  autoCrop: true,
  autoCropArea: 1,
  viewMode: 3,
  dragMode: 'move',
  cropBoxMovable: false,
  cropBoxResisable: false,
  toggleDragModeOnDblclick: false,
  responsive: false,
  restore: false,
  modal: false,
  guides: false,
  center: false,
  background: false,
  checkCrossOrigin: false
};

export default {
  observers: [
    '_replaceSrc(src)',
    '_updateCropperFromZoom(zoom)',
    '_refresh(width, height)',
    '_render(src)'
  ],

  /**
   * Init Cropper.js
   * Called by Polymer on attach
   * @return {undefined}
   */
  attached() {
    this._cropper = new Cropper(this.$.src,
      Object.assign({}, CROPPER_OPTS, {
        zoom: (e) => this._updateZoomFromCropper(e.detail.ratio),
        crop: () => this._render(),
        ready: () => {
          this._updateCropperFromZoom(this.zoom);
        }
      })
    );
  },

  /**
   * Clean up Cropper instance on detach
   * @return {undefined}
   */
  detached() {
    this._cropper && this._cropper.destroy();
  },

  /**
   * Replace the src in the cropper instance
   * @param {String} src Img source string
   * @return {undefined}
   */
  _replaceSrc(src) {
    this._cropper && this._cropper.replace(src);
  },

  /**
   * Converts between absolute and scaled zooms. A scaled zoom is at 1 when the
   *  absolute zoom results in the image completely filling (but not overflowing)
   *  the canvas. e.g. if the image is 800x800 but the canvas is 400x400. A
   *  scaled zoom of 1 would translate to an absolute zoom of 0.5
   * @param  {Number} input Input number (factor or value)
   * @param  {String} to    Conversion to perform ('absolute'|'scaled')
   * @return {Number}       Converted zoom
   */
  _transformZoom(input, to) {
    let { naturalWidth } = this._cropper.getCanvasData(),
        width = this.width,
        ratio = width / naturalWidth;

    return to === 'absolute' ? input * ratio : input / ratio;
  },

  /**
   * Update's croppers internal zoom from given scaled zoom
   * @see _transformZoom
   * @param  {Number} zoom Scaled zoom value
   * @return {undefined}
   */
  _updateCropperFromZoom(zoom) {
    this._cropper && this._cropper.zoomTo(this._transformZoom(zoom, 'absolute'));
  },

  /**
   * Update's zoom prop from given absolute zoom value
   * @see _transformZoom
   * @param  {Number} zoom Absolute zoom value
   * @return {undefined}
   */
  _updateZoomFromCropper(zoom) {
    // If we're currently dragging, there's no need to do this - i.e. the zoom
    //  is currently coming from the slider and doing this would try to overwrite
    //  it
    if (!this.$.slider.dragging) {
      this.zoom = this._transformZoom(zoom, 'scaled');
    }
  },

  /**
   * Render the current cropper canvas out to output as base64 encoded image
   * @return {undefined}
   */
  _render() {
    this.debounce('render-cropped', () => {
      let { naturalWidth, naturalHeight } = this._cropper.getImageData(),
          cropped = this._cropper.getCroppedCanvas({
            width: naturalWidth,
            height: naturalHeight
          });

      this._setOutput(cropped.toDataURL());
    }, 200);
  },

  /**
   * Refresh the internal cropper. Good for if you need to refresh the sizing
   * @return {undefined}
   */
  _refresh() {
    this._cropper && this._cropper.replace(this.src);
  }
}
