import { resizeToImage } from './utils';

let bindings,
    tagEvent,
    closeEditor;

/**
 * Attach listeners to sync data from editor to image
 * @param  {HTMLElement} editor Editor to listen to
 * @param  {HTMLElement} image  Image to perform actions on
 * @return {undefined}
 */
export function attachListeners(editor, image) {
  bindings = {
    ['output-changed']: (e) => {
      image.src = e.detail.value;
    },
    ['alt-changed']: (e) => {
      image.alt = e.detail.value;
    },
    ['active-changed']: (e) => {
      if (!e.detail.value) {
        image.editing = false;
      }
    },
    ['src-changed']: (e) => {
      image.src = e.detail.value;
      resizeToImage(editor, image);
    },
    ['keyup']: (e) => {
      let cmdEnter = e.keyCode === 13 && e.metaKey,
          escape = e.keyCode === 27;

      if (cmdEnter || escape) {
        image.editing = false;
      }
    }
  };

  Object.keys(bindings).forEach(event => {
    editor.addEventListener(event, bindings[event]);
  });

  closeEditor = (e) => {
    if (e.path.indexOf(image) === -1 && e.path.indexOf(editor) === -1) {
      editor.active = false;
    }
  };

  window.addEventListener('tap', closeEditor);
  window.addEventListener('mouseup', closeEditor);
  window.addEventListener('touchend', closeEditor);
}

/**
 * Detach all previously attached listeners on the editor
 * @param  {HTMLElement} editor Editor to remove listeners from
 * @return {undefined}
 */
export function detachListeners(editor) {
  Object.keys(bindings).forEach(event => {
    editor.removeEventListener(event, bindings[event]);
  });

  window.removeEventListener('tap', closeEditor);
  window.removeEventListener('mouseup', closeEditor);
  window.removeEventListener('touchend', closeEditor);
};
