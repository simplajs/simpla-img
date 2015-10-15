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
        easing: 'ease-out',
        fill: 'both',
        duration: 150
      },
      'out': {
        easing: 'ease-in',
        fill: 'both',
        duration: 150
      }
    };
  },

  _animateIn() {
    let { top, bottom } = this._animateControls,
        opts = this._animateOptions,
        topAnimate,
        bottomAnimate;

    topAnimate = top.animate([
      { transform: 'translateY(-100%)' },
      { transform: 'translateY(0)' }
    ], opts.in);

    bottomAnimate = bottom.animate([
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
