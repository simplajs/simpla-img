let cache = {};

/**
 * Save the properties of the editor to the cache. Uses the image's UID as the
 *  cache key
 * @param  {HTMLElement} editor Editor to cache
 * @param  {HTMLElement} image  Image to use as key
 * @return {undefined}
 */
export function saveToCache(editor, image) {
  cache[image.uid] = { src: editor.src, zoom: editor.zoom, position: editor.position };
};

/**
 * Restore values to editor from cache. Fetches data stored at image's UID
 * @param  {HTMLElement} editor Editor to restore from cache
 * @param  {HTMLElement} image  Image to use as key
 * @return {undefined}
 */
export function restoreFromCache(editor, image) {
  if (cache[image.uid]) {
    Object.assign(editor, cache[image.uid]);
  }
}
