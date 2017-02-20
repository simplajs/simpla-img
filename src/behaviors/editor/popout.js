const POPOUT_GUTTER = 8;

export default {
  observers: [
    '_popIfOutsideViewport(bounds.*, visible)'
  ],

  /**
   * Translate bounds back into viewport if any are outside it
   * @param  {Object} bounds   Value of the bounds property
   * @param  {Boolean} visible Value of the visible property
   * @return {undefined}
   */
  _popIfOutsideViewport(bounds, visible) {
    let { top, left, width, height } = bounds.value,
        { innerWidth: viewportWidth, innerHeight: viewportHeight } = window,
        translateX = 0,
        translateY = 0;

    if (!bounds) {
      return;
    }

    if (left < 0) {
      translateX = Math.abs(left) + POPOUT_GUTTER;
    } else if (left > viewportWidth - width) {
      translateX = -(left - (viewportWidth - width) + POPOUT_GUTTER);
    }

    if (top < 0) {
      translateY = Math.abs(top) + POPOUT_GUTTER;
    } else if (top > viewportHeight - height) {
      translateY = -(top - (viewportHeight - height) + POPOUT_GUTTER);
    }

    // Transform transitioned with CSS
    this.style.transform = visible ? `translate(${translateX}px, ${translateY}px)` : '';
  }

}