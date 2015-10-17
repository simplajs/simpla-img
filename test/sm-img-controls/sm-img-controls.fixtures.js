(function() {
  var NAME = 'sm-img-controls',
      file = { src: 'foo' },
      files = [file];

  window.fixtures = window.fixtures || {};
  window.fixtures[NAME] = {

    windowSize: {
      outerWidth: 800,
      outerHeight: 500
    },

    centreLeft: {
      left: 100,
      width: 100
    },

    centreRight: {
      left: 600,
      width: 100
    },

    file: file,
    files: files

  };
})();
