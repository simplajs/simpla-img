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
    ['output-changed']: function outputChangedHandler(event) {
      image.src = event.detail.value;
    },

    ['alt-changed']: function altChangedHandler(event) {
      image.alt = event.detail.value;
    },

    ['active-changed']: function activeChangedHandler(event) {
      if (!event.detail.value) {
        image.editing = false;
      }
    },

    ['src-changed']: function srcChangedHandler(event) {
      let updateEditorSize = () => {
        resizeToImage(editor, image);
        image.removeEventListener('load', updateEditorSize);
      }

      image.addEventListener('load', updateEditorSize);
      image.src = event.detail.value;
    },

    ['keyup']: function keyupHandler(event) {
      let cmdEnter = event.keyCode === 13 && event.metaKey,
          escape = event.keyCode === 27;

      if (cmdEnter || escape) {
        image.editing = false;
      }
    },

    ['blur']: function blurHandler(event) {
      editor.active = false;
    },

    ['opening-filepicker']: function openingFilePickerHandler(event) {
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
