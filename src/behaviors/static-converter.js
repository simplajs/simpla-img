const isBase64 = (subject) => subject && subject.indexOf('data:image') === 0,
      isNotSimpla = (url) => !/^https:\/\/storage.googleapis.*simpla/.test(url);

const convertToBase64 = (url) => {
  let img = new Image(),
      canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d');

  img.setAttribute('crossOrigin', 'anonymous');

  return new Promise((resolve, reject) => {
    img.onload = () => {
      let dataUrl;

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = reject;

    img.src = url;
  });
}

export default {
  observers: [
    '_ensureIsBase64(src)'
  ],

  created() {
    this.__staticSrc = this.getAttribute('src');
  },

  _ensureIsBase64(src) {
    let isStatic = this.__staticSrc && this.__staticSrc === src;

    if (isStatic && !isBase64(src) && isNotSimpla(src)) {
      convertToBase64(src).then(asDataUrl => {
        if (src === this.src) {
          this.src = asDataUrl;
        }
      });
    }
  }
}
