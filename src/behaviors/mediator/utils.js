const EDITOR_COMPONENT = 'simpla-img-editor.html';

let editorAttached = false;

/**
 * Ensures the editor component definition is imported and the given editor
 *  is attached
 * @param  {HTMLElement} editor The editor element to attach to the document
 * @param  {HTMLElement} image  The simpla-img thta needs the editor - used to
 *                                find the correct relative url
 * @return {undefined}
 */
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

/**
 * Resize the given editor to the same dimensions and position as the given image
 * @param  {HTMLElement} editor The editor to be resized
 * @param  {HTMLElement} image  The image to resize the editor to
 * @return {undefined}
 */
export function resizeToImage(editor, image) {
  let { top, left, width, height } = image.getBoundingClientRect();
  Object.assign(editor, { top, left, width, height });
}

/**
 * Pass the image properties to the editor. Passes 'alt' and 'src' from image to
 *  editor
 * @param  {HTMLElement} editor Editor element to receive props
 * @param  {HTMLElement} image  Source image to retrieve props from
 * @return {undefined}
 */
export function passPropsToEditor(editor, image) {
  let { src, alt } = image;

  Object.assign(editor, { src, alt });
}
