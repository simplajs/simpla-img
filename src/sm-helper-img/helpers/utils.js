export function fitInside(value, range) {
  if (value < range.min) {
    return range.min;
  }

  if (value > range.max) {
    return range.max;
  }

  return value;
}
