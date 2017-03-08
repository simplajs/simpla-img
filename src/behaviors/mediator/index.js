import { saveToCache, restoreFromCache } from './cache';
import { attachListeners, detachListeners } from './listeners';
import { ensureEditorReady, resizeToImage, passPropsToEditor } from './utils';

const editor = document.createElement('simpla-img-editor');
let activeImage;

export default {
  observers: [
    '_stopEditingOnResize(editing)',
    '_toggleEditorBindings(editing)',
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

      // If there's no image, it should go straight to picking a file
      if (!editor.src) {
        editor.openFilePicker();
      }

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
   * Stop editing on viewport resize
   * (Since we're fixed width and abspos)
   * @param  {Boolean} editing Current value of the editing property
   * @return {undefined}
   */
  _stopEditingOnResize(editing) {
    let exit = () => {
      window.removeEventListener('resize', exit);
      this.editing = false;
    }

    if (editing) {
      window.addEventListener('resize', exit);
    }
  }
}
