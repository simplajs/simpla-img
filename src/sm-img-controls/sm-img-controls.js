import animation from './behaviors/animation';

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
      title: {
        type: String,
        notify: true
      },
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
      simpla.behaviors.active()
    ];
  }

  toggleTitle() {
    let title = this.$.title,
        titleButton = this.$.titleButton,
        has = !!title.className.match(`\\b${TITLE_OPEN_CLASS}\\b`);

    titleButton.active = !has;
    this.toggleClass(TITLE_OPEN_CLASS, !has, title);
  }

  openFilePicker(event) {
    if (event) {
      event.stopPropagation();
    }

    this.$.file.click();
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

    this.position = center.x < windowCenter.x ? 'right' : 'left';
  }

  _filesChanged(event) {
    let files = event.target.files;

    if (files && files[0]) {
      this.file = files[0];
    }
  }

}

Polymer(SmImgControls);
