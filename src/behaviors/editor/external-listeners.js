export default {
  observers: [
    '_stopEditingOnResize(active)'
  ],

  listeners: {
    'keyup': '_keyupHandler',
    'blur': '_blurHandler'
  },

  /**
   * Go inactive on viewport resize
   * (Since we're fixed width and abspos)
   * @param  {Boolean} active Current value of the active property
   * @return {undefined}
   */
  _stopEditingOnResize(active) {
    let exit = () => {
      window.removeEventListener('resize', exit);
      this.active = false;
    }

    if (active) {
      window.addEventListener('resize', exit);
    }
  },

  _keyupHandler(event) {
    let cmdEnter = event.keyCode === 13 && event.metaKey,
        escape = event.keyCode === 27;

    if (cmdEnter || escape) {
      this.active = false;
    }
  },

  _blurHandler(event) {
    let handleBlurOnChild;

    if (Polymer.Settings.useShadow) {
      this.active = false;

      // The rest of the function deals with a lovely bug that only happens in
      //  ShadyDOM, so if we've got ShadowDOM, we return and skip the rest
      return;
    }

    handleBlurOnChild = (event) => {
      let previouslyFocusedNode = event.target,
          newlyFocusedNode = event.relatedTarget,
          thisContains = (node) => {
            return this.compareDocumentPosition(node)
              & Node.DOCUMENT_POSITION_CONTAINED_BY;
          };

      if (newlyFocusedNode && thisContains(newlyFocusedNode)) {
        newlyFocusedNode.addEventListener('blur', handleBlurOnChild);
      } else if (this !== newlyFocusedNode) {
        this.active = false;
      }

      previouslyFocusedNode.removeEventListener('blur', handleBlurOnChild);
    }

    handleBlurOnChild(event);
  }
}
