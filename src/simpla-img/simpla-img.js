class SimplaImg {
  beforeRegister() {
    this.is = 'simpla-img';

    this.properties = {
      src: String,
      width: String,
      height: String,
      scale: {
        type: Number,
        value: 1
      },
      position: {
        type: Object,
        value: { x: 0, y: 0}
      }
    }
  }

  ready() {
    // Setup the minimum on the zoom
    this.$.zoom.min = this._helper.minScale;
  }

  updatePosition() {
    const image = this._helper;

    this.position = { x: image.translateX, y: image.translateY };
  }

  get _helper() {
    return this.$.image;
  }

  _fileChosen(event) {
    let filePicker = event.target,
        files = filePicker.files;

    if (files) {
      this._loadFile(files[0]);
    } else {
      throw new Error('Could not load file');
    }
  }

  _loadFile(file) {
    let reader = new FileReader();

    reader.onloadend = () => this.src = reader.result;

    reader.readAsDataURL(file);
  }
}

Polymer(SimplaImg);
