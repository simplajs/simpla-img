const easings = simpla.constants.easings;

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
        easing: easings.easeOutBack,
        fill: 'both',
        duration: 180,
        delay: 15
      },
      'out': {
        easing: easings.easeOutCubic,
        fill: 'both',
        duration: 125
      }
    };
  },

  _animateIn() {
    let { top, bottom } = this._animateControls,
        opts = this._animateOptions;

    this.toggleAttribute('visible', true, top);
    this.toggleAttribute('visible', true, bottom);

    top.animate([
      { transform: 'translateY(-100%)', opacity: 0.5 },
      { transform: 'translateY(0)', opacity: 1 }
    ], opts.in);

    bottom.animate([
      { transform: 'translateY(100%)', opacity: 0.5 },
      { transform: 'translateY(0)', opacity: 1 }
    ], opts.in);

  },

  _animateOut() {
    let { top, bottom } = this._animateControls,
        opts = this._animateOptions,
        topAnimate,
        bottomAnimate;

    topAnimate = top.animate([
      { transform: 'translateY(0)', opacity: 1 },
      { transform: 'translateY(-100%)', opacity: 0.5 }
    ], opts.out);

    bottomAnimate = bottom.animate([
      { transform: 'translateY(0)', opacity: 1 },
      { transform: 'translateY(100%)', opacity: 0.5 }
    ], opts.out);

    topAnimate.onfinish = () => {
      this.toggleAttribute('visible', false, top);
    }
    bottomAnimate.onfinish = () => {
      this.toggleAttribute('visible', false, bottom);
    }
  }
};
