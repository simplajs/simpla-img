import placeholder from './behaviors/placeholder';
import customDefault from './behaviors/default';
import persists from './behaviors/persists';

class SimplaImg {
  beforeRegister() {
    this.is = 'simpla-img';

    this.properties = {
      src: {
        type: String,
        // Must have a value so that multi-param observers will get triggered
        //  straight away, see placeholder
        value: ''
      },
      width: Number,
      height: Number,
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
      simpla.behaviors.editable(),
      simpla.behaviors.active({
        observer: '_activeChanged'
      })
    ]
    .concat(placeholder)
    .concat(customDefault)
    .concat(persists);
  }

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

  get _placeholder() {
    return this.$.placeholder;
  }

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
    const target = event.target;

    if (target.type === 'file') {
      return;
    }

    if (target === this._placeholder) {
      this._controls.openFilePicker();
    } else {
      this.active = true;
    }
  }

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
