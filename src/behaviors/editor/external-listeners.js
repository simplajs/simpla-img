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
    this.active = false;
  }
}
