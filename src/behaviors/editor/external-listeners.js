export default {
  observers: [
    '_stopEditingOnResize(editing)'
  ],

  listeners: {
    'keyup': '_keyupHandler',
    'blur': '_blurHandler'
  },

  /**
   * Stop editing on viewport resize
   * (Since we're fixed width and abspos)
   * @param  {Boolean} editing Current value of the editing property
   * @return {undefined}
   */
  _stopEditingOnResize(editing) {
    let exit = () => {
      window.removeEventListener('resize', exit);
      this.active = false;
    }

    if (editing) {
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
