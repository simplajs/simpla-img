import { resizeToImage } from './utils';

let bindings,
    tagEvent,
    closeEditor;

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
};

export function detachListeners(editor, image) {
  Object.keys(bindings).forEach(event => {
    editor.removeEventListener(event, bindings[event]);
  });

  window.removeEventListener('tap', closeEditor);
  window.removeEventListener('mouseup', closeEditor);
  window.removeEventListener('touchend', closeEditor);
};
