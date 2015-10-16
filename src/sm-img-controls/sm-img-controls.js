import animation from './helpers/animation';

const TITLE_OPEN_CLASS = 'toolbox__title--expanded';

class SmImgControls {
  beforeRegister() {
    this.is = 'sm-img-controls';

    this.properties = {
      position: {
        type: String,
        reflectToAttribute: true,
        value: 'right'
      },
      title: String,
      file: {
        type: Object,
        readonly: true,
        notify: true
      },
      zoom: {
        type: Number,
        notify: true
      }
    };
  }

  get behaviors() {
    return [
      animation,
      simpla.behaviors.active({
        observer: '_activeObserver',
        notify: false
      })
    ];
  }

  toggleTitle() {
    let title = this.$.title,
        has = !!title.className.match(`\\b${TITLE_OPEN_CLASS}\\b`);

    this.toggleClass(TITLE_OPEN_CLASS, !has, title);
  }

  _activeObserver(active) {
    if (active){
      this._setPosition();
      this.fire('activated');
    } else {
      this.fire('deactivated');
    }
  }

  /**
   * Sets position (left/right) of main control toolbox
   * based on position in viewport
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

    this.position = center.x < windowCenter.x ? 'left' : 'right';
  }

  _filesChanged(event) {
    let files = event.target.files;

    if (files && files[0]) {
      this.file = files[0];
    }
  }

}

Polymer(SmImgControls);
