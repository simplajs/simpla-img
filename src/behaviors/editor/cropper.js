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

  _replaceSrc(src) {
    this._cropper && this._cropper.replace(src);
  },

  /**
   * Converts between zoom value and factor
   * @param  {Number} input Input number (factor or value)
   * @param  {String} to    Conversion to perform ('value'|'factor')
   * @return {Number}       Converted zoom
   */
  _translateZoom(input, to) {
    let { naturalWidth } = this._cropper.getCanvasData(),
        width = this.width,
        ratio = width / naturalWidth;

    return to === 'value' ? input * ratio : input / ratio;
  },

  _propZoomToCropper(input) {
    return this._translateZoom(input, 'value');
  },

  _cropperZoomToProp(input) {
    return this._translateZoom(input, 'factor');
  },

  /**
   * Zoom to absolute ratio given.
   * @param  {Number} ratio Value of the ratio to zoom to i.e. 2 would be 2x
   *                        original image size
   * @return {undefined}
   */
  _updateCropperFromZoom(ratio) {
    this._cropper && this._cropper.zoomTo(this._propZoomToCropper(ratio));
  },

  _updateZoomFromCropper(ratio) {
    if (!this.$.slider.dragging) {
      this.zoom = this._cropperZoomToProp(ratio);
    }
  },

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

  _refresh() {
    this._cropper && this._cropper.replace(this.src);
  }
}
