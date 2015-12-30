/**
 * Setup animation easings and options
 */
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

  /**
   * Toggle whether controls are showing or not
   * @param  {Boolean} active Whether to show controls or not
   * @return undefined
   */
  _toggleControls(active) {
    if (active){
      this._setPosition();
      this._openControls();
    } else {
      this._closeControls();
    }
  },

  /**
   * Animations for control elements
   * @type {Array}
   */
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

  /**
   * Run animation to open controls, adds visible attribute before animating
   * @return undefined
   */
  _openControls(){
    this._controlAnimations.forEach(({ target, begin, end }) => {
      this.toggleAttribute('visible', true, target);
      target.animate([begin, end], opts.open);
    });
  },

  /**
   * Run animation to close controls, removes visible attribute on finish
   * @return undefined
   */
  _closeControls() {
    this._controlAnimations.forEach(({ target, begin, end, }) => {
      let animation = target.animate([end, begin], opts.close);
      animation.onfinish = () => {
        this.toggleAttribute('visible', false, target);
      };
    });
  }

};
