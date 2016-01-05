/**
 * Check if string is a valid CSS color property
 * @param  {String} color Color string to test
 * @return {Boolean}       True if is valid CSS color, false otherwise
 */
const validColor = (color) => {
  // We know these are valid, use them as bases
  const black = 'rgb(0, 0, 0)',
        white = 'rgb(255, 255, 255)';

  // Create a dummy img to test on
  let image = document.createElement('img'),
      // Try out color with a given base, returns true if when applying the color
      //  the returned style is not the base color i.e. the applied is valid
      tryOut = (base) => {
        image.style.color = base;
        image.style.color = color;
        return image.style.color !== base;
      };

  // Try out color against both black and white, if both return true then the color
  //  is a valid CSS color.
  return tryOut(black) && tryOut(white);
};

/**
 * Check if string is a valid CSS color property
 * @param  {String} test    Color string to test
 * @return {Boolean}        True if is valid CSS color, false otherwise
 */
export default function(test) {
  switch (test) {
    // Check low hanging fruit
  case '':
  case 'inherit':
  case 'transparent':
    return false;
  default:
    return validColor(test);
  }
};
