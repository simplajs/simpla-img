const easings = simpla.constants.easings,
      opts = {
        open: {
          easing: easings.easeOutBack,
          fill: 'both',
          duration: 180,
          delay: 15
        },
        close: {
          easing: easings.easeOutCubic,
          fill: 'both',
          duration: 125
        }
      };

export default {
  observers: [
    '_toggleControls(active)'
  ],

  _toggleControls(active) {
    if (active){
      this._setPosition();
      this._openControls();
    } else {
      this._closeControls();
    }
  },

  get _controlAnimations() {
    let topControls = this.$['controls-top'],
        bottomControls = this.$['controls-bottom'];

    return [
      {
        target: topControls,
        begin: { transform: 'translateY(-100%)', opacity: 0.5 },
        end: { transform: 'translateY(0)', opacity: 1 }
      },
      {
        target: bottomControls,
        begin: { transform: 'translateY(100%)', opacity: 0.5 },
        end: { transform: 'translateY(0)', opacity: 1 }
      }
    ]
  },

  _openControls(){
    this._controlAnimations.forEach(({ target, begin, end }) => {
      this.toggleAttribute('visible', true, target);
      target.animate([begin, end], opts.open);
    });
  },

  _closeControls() {
    this._controlAnimations.forEach(({ target, begin, end, }) => {
      let animation = target.animate([end, begin], opts.close);
      animation.onfinish = () => {
        this.toggleAttribute('visible', false, target);
      };
    });
  }

};
