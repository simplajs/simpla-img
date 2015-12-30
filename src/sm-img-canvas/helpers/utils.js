/**
 * Fit a value inside a range
 * @param  {Number} value Value to fit
 * @param  {Object} range Range, has min and max properties
 * @return {Number}       Value, or min if value is below min, or max if value is
 *                          greater than max
 */
export function fitInside(value, range) {
  if (value < range.min) {
    return range.min;
  }

  if (value > range.max) {
    return range.max;
  }

  return value;
};

/**
 * Give style vendor prefixes
 * @param  {String}   style   Style value to prefix
 * @param  {Boolean?} dashed  Whether to fit the prefixes with dashes or not.
 *                            	Defaults to false
 * @return {Array}            Array of vendor prefixed styles
 */
export function prefixStyle(style, dashed = false) {
  let prefixes = [
    'webkit',
    'moz',
    'o',
    'ms'
  ];

  if (dashed) {
    prefixes = prefixes.map(prefix => `-${prefix}-`);
  }

  return prefixes.map(prefix => `${prefix}${style}`);
};
