let opts,
    controls;

opts = {
  'in': {
    easing: this.customStyle['--ease-out-back'],
    fillMode: 'forward',
    duration: 250
  },
  'out': {
    easing: this.customStyle['--ease-in-cubic'],
    fillMode: 'forward',
    duration: 250
  }
};

controls = {
  'top': this.$['controls-top'],
  'bottom': this.$['controls-bottom']
}

export default {

  listeners: {
    'activated': '_animateIn',
    'deactivated': '_animateOut'
  },

  _animateIn() {

    controls['top'].animate([
      { transform: 'translateY(-100%)' },
      { transform: 'translateY(0)' }
    ], opts.in);

    controls['bottom'].animate([
      { transform: 'translateY(100%)' },
      { transform: 'translateY(0)' }
    ], opts.in);

  },

  _animateOut() {

    let opts = {
      easing: this.customStyle['--ease-in-cubic'],
      fillMode: 'forward',
      duration: 250
    };

    controls['top'].animate([
      { transform: 'translateY(0)' },
      { transform: 'translateY(-100%)' }
    ], opts.out);

    controls['bottom'].animate([
      { transform: 'translateY(0)' },
      { transform: 'translateY(100%)' }
    ], opts.out);

  }

}
