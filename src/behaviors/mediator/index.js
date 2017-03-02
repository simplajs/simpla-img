import { saveToCache, restoreFromCache } from './cache';
import { attachListeners, detachListeners } from './listeners';
import { ensureEditorReady, resizeToImage, passPropsToEditor } from './utils';

const editor = document.createElement('simpla-img-editor');
let activeImage;

export default {
  observers: [
    '_toggleEditorBindings(editing)',
    '_stopEditingOnResizeOrScroll(editing)',
    '_ensureEditorReady(editable)'
  ],

  listeners: {
    'tap': '_tapHandler'
  },

  _tapHandler() {
    if (this.editable) {
      this.editing = true;
    }
  },

  _toggleEditorBindings(editing) {
    if (editing) {
      if (activeImage) {
        activeImage.editing = false;
      }

      attachListeners(editor, this);
      resizeToImage(editor, this);
      passPropsToEditor(editor, this);
      restoreFromCache(editor, this);

      activeImage = this;
      editor.active = true;
    } else {
      if (!activeImage) {
        return;
      }

      editor.active = false;

      detachListeners(editor, activeImage);
      saveToCache(editor, activeImage);

      editor.clear();
      activeImage = null;
    }
  },

  _ensureEditorReady(editable) {
    if (editable) {
      ensureEditorReady(editor, this);
    }
  },

  /**
   * CONTROLS
   */

  /**
   * Stop editing on viewport resize
   * (Since we're fixed width and abspos)
   * @param  {Boolean} editing Current value of the editing property
   * @return {undefined}
   */
  _stopEditingOnResizeOrScroll(editing) {
    let exit = this.__exitHandler = this.__exitHandler || (() => this.editing = false);

    if (editing) {
      window.addEventListener('resize', exit);
      window.addEventListener('scroll', exit);
    } else {
      window.removeEventListener('resize', exit);
      window.removeEventListener('scroll', exit);
    }
  }
}
