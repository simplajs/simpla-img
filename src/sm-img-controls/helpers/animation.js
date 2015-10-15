/**
 * Return controls
 * @param  {SmImgControls} host HTML elements to look for controls on
 * @return {Object}             Control elements
 */
function getControls(host) {
  return {
    top: host.$['controls-top'],
    bottom: host.$['controls-bottom']
  };
};

/**
 * Return options for given host
 * @param  {SmImgControls} host HTML elements to setup opts for
 * @return {Object}             Options object
 */
function getOptions(host) {
  return {
    'in': {
      easing: host.customStyle['--ease-out-back'],
      fillMode: 'forward',
      duration: 250
    },
    'out': {
      easing: host.customStyle['--ease-in-cubic'],
      fillMode: 'forward',
      duration: 250
    }
  };
};

export default {
  ready() {
    let { top, bottom } = getControls(this),
        opts = getOptions(this);

    this.addEventListener('activated', () => {
      top.animate([
        { transform: 'translateY(-100%)' },
        { transform: 'translateY(0)' }
      ], opts.in);

      bottom.animate([
        { transform: 'translateY(100%)' },
        { transform: 'translateY(0)' }
      ], opts.in);
    });

    this.addEventListener('deactivated', () => {
      top.animate([
        { transform: 'translateY(0)' },
        { transform: 'translateY(-100%)' }
      ], opts.out);

      bottom.animate([
        { transform: 'translateY(0)' },
        { transform: 'translateY(100%)' }
      ], opts.out);
    });
  }
}
