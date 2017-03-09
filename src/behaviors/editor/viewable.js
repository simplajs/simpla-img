export const POPOUT_GUTTER = 8;
export const MIN_SIZE = {
  width: 180,
  height: 130
};

export function getConstraints(dimensions, maxSize, minSize) {
  let { width, height } = dimensions,
      scale;

  scale = Math.min(1, Math.min(maxSize.width / width, maxSize.height / height));

  if (scale * width < minSize.width || scale * height < minSize.height) {
    scale = Math.max(minSize.width / width, minSize.height / height)
  }

  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

export function getTranslationForPopout(imageRect, window, gutter) {
  let { top, left, width, height } = imageRect,
      right = left + width,
      bottom = top + height,
      translateX = 0,
      translateY = 0,
      boundaries;

  boundaries = {
    left: window.scrollX + gutter,
    top: window.scrollY + gutter,
    right: window.scrollX + window.innerWidth - gutter,
    bottom: window.scrollY + window.innerHeight - gutter
  };

  if (left < boundaries.left) {
    translateX = boundaries.left - left;
  } else if (right > boundaries.right) {
    translateX = boundaries.right - right;
  }

  if (top < boundaries.top) {
    translateY = boundaries.top - top;
  } else if (bottom > boundaries.bottom) {
    translateY = boundaries.bottom - bottom;
  }

  return { translateY, translateX };
}

export function getPositionAndScaleForWindow(imageRect, window, gutter = POPOUT_GUTTER, minSize = MIN_SIZE) {
  let maxSize,
      width,
      height,
      translateX,
      translateY;

  maxSize = {
    width: window.innerWidth - gutter * 2,
    height: window.innerHeight - gutter * 2
  };

  ({ width, height} = getConstraints(imageRect, maxSize, minSize));

  ({ translateX, translateY } = getTranslationForPopout({
    top: imageRect.top,
    left: imageRect.left,
    width,
    height
  }, window, gutter));

  return { width, height, translateX, translateY };
}

export default {
  observers: [
    '_fitIntoVisibleWindow(top, left, width, height, visible)'
  ],

  /**
   * Translates and scales dimensions to fit within the viewport. This means
   *  translating bounds back into viewport and scaling to width and height
   *  if required.
   * @param  {Number} top       Distance from top of viewport in px
   * @param  {Number} left      Distance from left side of viewport in px
   * @param  {Number} width     Width of image in px
   * @param  {Number} height    Height of image in px
   * @param  {Boolean} visible  If image is visible or not
   * @return {undefined}
   */
  _fitIntoVisibleWindow(top, left, width, height, visible) {
    if (!visible) {
      this.style.transform = '';
    }

    this.debounce('fit-to-window', () => {
      let rect = { top, left, width, height },
          translateX,
          translateY,
          popped;

      ({ width, height, translateX, translateY } = getPositionAndScaleForWindow(rect, window));

      this.width = width;
      this.height = height;
      this.style.transform = `translate(${translateX}px, ${translateY}px)`;

      // Popped essentially just means some position has changed
      popped = !!(width !== rect.width || height !== rect.height || translateX || translateY);

      if (popped) {
        this._closeOnScroll();
      }
    });
  },

  _closeOnScroll() {
    let exit = () => {
      window.removeEventListener('scroll', exit);
      this.active = false
    };

    // When the editor is focused (on activation), it will sometimes trigger a
    //  'scroll' event as the browser will automatically try scroll to the
    //  focused element. To stop that focus event from closing the editor
    //  straight away, this listener is attached 100ms after the editor is
    //  activated
    this.async(() => window.addEventListener('scroll', exit), 100);
  }
}
