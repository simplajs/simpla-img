(function() {
  var NAME = 'sm-img-canvas';

  window.componentFixtures = window.componentFixtures || {};
  window.componentFixtures[NAME] = {
    sourceBounds: {
      height: 600,
      width: 600
    },

    componentBounds: {
      height: 400,
      width: 400
    },

    defaultTransforms: {
      scale: 1,
      translateX: 100,
      translateY: 100,
      asString: 'scale(1) translateX(100px) translateY(100px)',
      asObject: {
        scale: 1,
        translateX: 100,
        translateY: 100
      }
    },

    alternateTransforms: {
      scale: 2,
      translateX: 150,
      translateY: 250,
      asString: 'scale(2) translateX(150px) translateY(250px)',
      asObject: {
        scale: 2,
        translateX: 150,
        translateY: 250
      }
    },

    startEvent: {
      detail: {
        state: 'start',
        dx: 10,
        dy: 15,
        ddx: 20,
        ddy: 25
      }
    },

    trackEvent: {
      detail: {
        state: 'track',
        dx: 10,
        dy: 15,
        ddx: 20,
        ddy: 25
      }
    },

    endEvent: {
      detail: {
        state: 'end',
        dx: 10,
        dy: 15,
        ddx: 20,
        ddy: 25
      }
    },

    fakeTick: 10
  };
})();
