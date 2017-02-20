const MIN_SIZE = {
  width: 180,
  height: 130
};

export default {
  observers: [
    '_fitWithinConstraints(bounds.*)'
  ],

  /**
   * Ensure bounds fit within size constraints
   * @param  {Object} bounds Value of bounds property
   * @return {undefined}
   */
  // TODO: Animate constraint change, to make
  // image appear to scale/pop out of old position
  _fitWithinConstraints(bounds) {
    let { width, height, top, left } = bounds.value,
        { width: minWidth, height: minHeight } = MIN_SIZE,
        scale = (direction, value) => {
          let isWidth = direction === 'width',
              changedValue = isWidth ? width : height,
              scaledBound = isWidth ? 'height' : 'width',
              scaledValue = isWidth ? height : width;

          this.set(`bounds.${direction}`, value);
          this.set(`bounds.${scaledBound}`, scaledValue * (value / changedValue));
        };

    if (width < minWidth) {
      scale('width', minWidth);
    }

    if (height < minHeight) {
      scale('height', minHeight);
    }

    if (width > window.innerWidth) {
      scale('width', window.innerWidth);
    }

    if (height > window.innerHeight) {
      scale('height', window.innerHeight);
    }
  }
}