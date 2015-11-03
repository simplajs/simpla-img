export function fitInside(value, range) {
  if (value < range.min) {
    return range.min;
  }

  if (value > range.max) {
    return range.max;
  }

  return value;
};

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
