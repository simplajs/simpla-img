export default {
  listeners: {
    'activated': '_animateIn',
    'deactivated': '_animateOut'
  },

  get _animateControls() {
    return {
      top: this.$['controls-top'],
      bottom: this.$['controls-bottom']
    };
  },

  get _animateOptions() {
    return {
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
  },

  _animateIn() {
    let { top, bottom } = this._animateControls,
        opts = this._animateOptions;

    top.animate([
      { transform: 'translateY(-100%)' },
      { transform: 'translateY(0)' }
    ], opts.in);

    bottom.animate([
      { transform: 'translateY(100%)' },
      { transform: 'translateY(0)' }
    ], opts.in);
  },

  _animateOut() {
    let { top, bottom } = this._animateControls,
        opts = this._animateOptions;

    top.animate([
      { transform: 'translateY(0)' },
      { transform: 'translateY(-100%)' }
    ], opts.out);

    bottom.animate([
      { transform: 'translateY(0)' },
      { transform: 'translateY(100%)' }
    ], opts.out);
  }
};
