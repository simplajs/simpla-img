const EDITOR_COMPONENT = 'simpla-img-editor.html';
const editor = document.createElement('simpla-img-editor');

let editorAttached = false;

export default {
  observers: [
    '_updateEditorImage(editing)',
    '_ensureEditorReady(editable)'
  ],

  _updateEditorImage(editing) {
    editor.image = editing ? this : null;
  },

  _ensureEditorReady(editable) {
    if (editable && !editorAttached) {
      let editorUrl = this.resolveUrl(EDITOR_COMPONENT),
          link = document.createElement('link');

      link.rel = 'import';
      link.setAttribute('async', true);
      link.href = editorUrl;

      document.head.appendChild(link);
      document.body.appendChild(editor);

      editorAttached = true;
    }
  }
}
