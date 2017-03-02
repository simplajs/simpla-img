import { resizeToImage } from './utils';

let bindings,
    tagEvent,
    closeEditor,
    filePickerOrphan;

/**
 * Attach listeners to sync data from editor to image
 * @param  {HTMLElement} editor Editor to listen to
 * @param  {HTMLElement} image  Image to perform actions on
 * @return {undefined}
 */
export function attachListeners(editor, image) {
  let restoreOnceOffEditor = () => {
    if (filePickerOrphan) {
      image.editing = true;
    }

    editor.removeEventListener('image-loaded', restoreOnceOffEditor);
  };

  filePickerOrphan = null;

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
    },
    ['blur']: () => {
      editor.active = false;
    },
    ['opening-filepicker']: () => {
      // Store the last known image to have had a filepicker pulled on it
      filePickerOrphan = image;
      editor.addEventListener('image-loaded', restoreOnceOffEditor);
    }
  };

  Object.keys(bindings).forEach(event => {
    editor.addEventListener(event, bindings[event]);
  });
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
};
