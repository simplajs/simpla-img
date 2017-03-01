const EDITOR_COMPONENT = 'simpla-img-editor.html';

let editorAttached = false;

export function ensureEditorReady(editor, image) {
  if (!editorAttached) {
    let editorUrl = image.resolveUrl(EDITOR_COMPONENT),
        link = document.createElement('link');

    link.rel = 'import';
    link.setAttribute('async', true);
    link.href = editorUrl;

    document.head.appendChild(link);
    document.body.appendChild(editor);

    editorAttached = true;
  }
}

export function resizeToImage(editor, image) {
  let { top, left, width, height } = image.getBoundingClientRect(),
      { src } = image;

  Object.assign(editor.style, { top: `${top}px`, left: `${left}px` });
  Object.assign(editor, { width, height });
}

export function passPropsToEditor(editor, image) {
  let { src, alt } = image;

  Object.assign(editor, { src, alt });
}

export function resetEditor(editor) {
  editor.src = '';
  editor.alt = '';
  editor.zoom = 1;
}
