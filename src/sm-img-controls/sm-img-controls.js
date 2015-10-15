import animation from './helpers/animation';

class SmImgControls {
  beforeRegister() {
    this.is = 'sm-img-controls';

    this.properties = {
      position: {
        type: String,
        reflectToAttribute: true,
        value: 'right'
      },
      active: {
        type: Boolean,
        observer: '_activeObserver'
      },
      title: String,
      files: Object,
      zoom: Number
    };
  }

  get behaviors() {
    return [
      animation
    ];
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

}

Polymer(SmImgControls);
