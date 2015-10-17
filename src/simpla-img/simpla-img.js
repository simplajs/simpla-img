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
    };
  }

  get behaviors() {
    return [
      simpla.behaviors.active({
        observer: '_activeChanged'
      })
    ];
  }

  get listeners() {
    return {
      'tap': '_handleTap'
    };
  }

  ready() {
    // TODO: Move this to controls
    // Setup the minimum on the zoom
    // this.$.zoom.min = this._canvas.minScale;
  }

  updatePosition() {
    const image = this._canvas;

    this.position = { x: image.translateX, y: image.translateY };
  }

  get _canvas() {
    return this.$.image;
  }

  get _controls() {
    return this.$.controls;
  }

  _fileChanged(event) {
    let reader = new FileReader(),
        file = event.detail.value,
        src;

    reader.onloadend = () => this.src = reader.result;

    reader.readAsDataURL(file);
  }

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

  _handleTap(event) {
    if (!this.active) {
      this.active = true;
    }
  }
}

Polymer(SimplaImg);
