import { saveToCache, restoreFromCache } from './cache';
import { attachListeners, detachListeners } from './listeners';
import { ensureEditorReady, resizeToImage, passPropsToEditor } from './utils';

const editor = document.createElement('simpla-img-editor');
let activeImage;

export default {
  observers: [
    '_stopEditingOnResizeOrScroll(editing)',
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
  _stopEditingOnResizeOrScroll(editing) {
    let exit = this.__exitHandler = this.__exitHandler || (() => this.editing = false);

    if (editing) {
      window.addEventListener('resize', exit);

      // When the editor is focused (on activation), it will sometimes trigger a
      //  'scroll' event as the browser will automatically try scroll to the
      //  focused element. To stop that focus event from closing the editor
      //  straight away, this listener is attached 100ms after the editor is
      //  activated
      this.async(() => window.addEventListener('scroll', exit), 100);
    } else {
      window.removeEventListener('resize', exit);
      window.removeEventListener('scroll', exit);
    }
  }
}
