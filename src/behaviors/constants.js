// Don't try and optimize this, CropperJS spits back this 1px transparent
// PNG when you feed it any format of 1px transparent data URI. And we
// must use a consistent default for 'empty' checks
export const DEFAULT_SRC = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAYAAACddGYaAAAADklEQVQYV2NkQAKMyBwAAEEAA8aUUQIAAAAASUVORK5CYII=';

export const MIN_SIZE = {
  width: 180,
  height: 130
};