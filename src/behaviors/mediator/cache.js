let cache = {};

export function saveToCache(editor, image) {
  cache[image.uid] = { src: editor.src, zoom: editor.zoom };
};

export function restoreFromCache(editor, image) {
  if (cache[image.uid]) {
    Object.assign(editor, cache[image.uid]);
  }
}
