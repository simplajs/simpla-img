import { getConstraints, getTranslationForPopout, getPositionAndScaleForWindow } from '../../src/behaviors/editor/viewable';

const TEST_MIN_SIZE = { width: 0, height: 0 };
const TEST_GUTTER = 10;

function buildWindow(innerWidth, innerHeight, scrollX = 0, scrollY = 0) {
  return {
    innerHeight,
    innerWidth,
    scrollX,
    scrollY
  };
}

describe('viewable behavior', () => {
  describe('getContraints', () => {
    it('should return the original dimensions size if no change necessary', () => {
      let bounds = { width: 500, height: 500 },
          fittingDimensions = { width: 250, height: 250 };

      expect(getConstraints(fittingDimensions, bounds, TEST_MIN_SIZE)).to.deep.equal(fittingDimensions);
    });

    it('should scale to fit the given bounds', () => {
      let bounds = { width: 500, height: 500 },
          oversized = { width: 600, height: 600 };

      expect(getConstraints(oversized, bounds, TEST_MIN_SIZE)).to.deep.equal({
        width: bounds.width,
        height: bounds.height
      });
    });

    it('should retain dimensions ratio', () => {
      let bounds = { width: 1000, height: 1000 },
          portraitImage = { width: 2000, height: 1000 },
          landscapeImage = { width: 1000, height: 2000 };

      expect(getConstraints(portraitImage, bounds, TEST_MIN_SIZE)).to.deep.equal({
        width: 1000,
        height: 500
      });

      expect(getConstraints(landscapeImage, bounds, TEST_MIN_SIZE)).to.deep.equal({
        width: 500,
        height: 1000
      });
    });

    it('should return rounded values', () => {
      let bounds = { width: 200, height: 200 },
          dimensions = { width: 145, height: 400 };

      expect(getConstraints(dimensions, bounds, TEST_MIN_SIZE)).to.deep.equal({
        width: 73,
        height: 200
      });
    });

    it('should scale up to minimum size if smaller than', () => {
      let bounds = { width: 1000, height: 1000 },
          smallImageDimensions = { width: 50, height: 75 },
          minSize = { width: 200, height: 100 };

      // Note here that width had to meet minimum, so height is much larger
      //  than min height so as to retain correct dimensions ratio
      expect(getConstraints(smallImageDimensions, bounds, minSize)).to.deep.equal({
        width: 200,
        height: 300
      });
    });

    it('should scale along shorter side if both can be scaled', () => {
      let bounds = { width: 200, height: 400 },
          dimensions = { width: 400, height: 600 };

      expect(getConstraints(dimensions, bounds, TEST_MIN_SIZE)).to.deep.equal({
        width: 200,
        height: 300
      });
    });
  });

  describe('getTranslationForPopout', () => {
    it('should move into window with popout gutter if out of bounds', () => {
      let window = buildWindow(800, 800),
          imageOutOfBounds = { top: -10, left: -100, width: 200, height: 400 };

      expect(getTranslationForPopout(imageOutOfBounds, window, TEST_GUTTER)).to.deep.equal({
        translateX: TEST_GUTTER + 100,
        translateY: TEST_GUTTER + 10
      });
    });

    it('should move into window if scrolled out of view', () => {
      let window = buildWindow(800, 800, 0, 100),
          imageOutOfScroll = { top: 0, left: 0, width: 200, height: 200 };

      expect(getTranslationForPopout(imageOutOfScroll, window, TEST_GUTTER)).to.deep.equal({
        translateX: TEST_GUTTER,
        translateY: TEST_GUTTER + 100
      });
    });

    it('should translate so top left is in view, if all out of view', () => {
      let window = buildWindow(400, 400, 100, 100),
          oversizedImage = { top: -10, left: -10, width: 500, height: 600 };

      // Should equal scroll value + gutter + distance out from window
      expect(getTranslationForPopout(oversizedImage, window, TEST_GUTTER)).to.deep.equal({
        translateX: 100 + TEST_GUTTER + 10,
        translateY: 100 + TEST_GUTTER + 10
      });
    });

    it('should have 0 value translations if translate not needed', () => {
      let window = buildWindow(800, 800),
          normalImage = { top: 100, left: 100, height: 200, width: 200 };

      expect(getTranslationForPopout(normalImage, window, TEST_GUTTER)).to.deep.equal({
        translateX: 0,
        translateY: 0
      });
    });

    it('should translate at least to gutter', () => {
      let window = buildWindow(800, 800, 100, 100),
          imageOnGutter = { top: 100, left: 100, width: 200, height: 200 };

      expect(getTranslationForPopout(imageOnGutter, window, TEST_GUTTER)).to.deep.equal({
        translateX: TEST_GUTTER,
        translateY: TEST_GUTTER
      });
    });
  });

  describe('getPositionAndScaleForWindow', () => {
    it('should set width, height and translations to fit entire image in window', () => {
      let window = buildWindow(800, 800, 100, 100),
          imageRect = { width: 1000, height: 500, top: 50, left: 400 },
          // Width should be window width - both gutters
          expectedWidth = 800 - TEST_GUTTER * 2,
          // Just follow width to retain ratio
          expectedHeight = expectedWidth / 1000 * 500,
          results,
          expected;

      results = getPositionAndScaleForWindow(imageRect, window, TEST_GUTTER, TEST_MIN_SIZE);
      expected = {
        // Window is scrolled 100 in Y, and top is 50.
        translateY: -50 + 100 + TEST_GUTTER,
        // Window is scrolled 100 in X, and (left + width) is beyond right hand
        //  window bound. Need to get left side of image to a gutters width from
        //  window left: - left + scroll X + TEST_GUTTER
        translateX: -400 + 100 + TEST_GUTTER,
        width: expectedWidth,
        height: expectedHeight
      };

      // Checking each individual prop gives more descriptive results
      Object.keys(expected).forEach(prop => {
        expect(results[prop]).to.equal(expected[prop], prop);
      });
    });
  });
});
