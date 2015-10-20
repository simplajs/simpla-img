const validColor = (color) => {
  const black = 'rgb(0, 0, 0)',
        white = 'rgb(255, 255, 255)';

  let image = document.createElement('img'),
      tryOut = (base) => {
        image.style.color = base;
        image.style.color = color;
        return image.style.color !== base;
      };

  return tryOut(black) && tryOut(white);
};

export default function(test) {
  switch (test) {
  case '':
  case 'inherit':
  case 'transparent':
    return false;
  default:
    return validColor(test);
  }
};
