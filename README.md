# Simpla Image
[![Build status][travis-badge]][travis-url] ![Size][size-badge] ![Version][bower-badge] [![Published][webcomponents-badge]][webcomponents-url]

Simpla-img is an editable image that can updated seamlessly inline on your page. It extends `<img>` and is built on the [Simpla][simpla] content system.

<!---
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="simpla-img.html">

    <script src="https://unpkg.com/simpla@2.0.0"></script>
    <script>
      Simpla.init('local');
      Simpla.editable(true);
    </script>

    <style>
      img {
        max-width: 100%;
        max-height: 400px;
        margin-right: 5px;
      }
    </style>
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->

```html
<img is="simpla-img" path="/img">
```

### Contents

- [Installation and setup](#installation-and-setup)
- [Editing content](#editing-content)
- [Saving content](#saving-content)
- [Initializing with static content](#initializing-with-static-content)
- [Custom placeholders](#custom-placeholders)
- [Readonly](#readonly)
- [Contributing](#contributing)

### Resources

- [API reference][api]
- [Demo][demo]
- [License][license]

## Installation and setup

Install simpla-img with Bower (Yarn support coming soon)

```sh
$ bower i simpla-img --save
```

[Setup Simpla][simpla-setup] on your page, then import simpla-img into your `<head>`

```html
<link rel="import" href="/bower_components/simpla-img/simpla-img.html">
```

Create an editable image by extending `<img>` with the `is` attribute. Give each img a unique `path`, where it will store its content in your project

```html
<img is="simpla-img" path="/img">
```

## Editing content

Edit a simpla-img by entering edit mode with Simpla (which makes all Simpla elements on a page editable) or setting the `editable` property directly on an element.

```js
// Enter edit mode
Simpla.editable(true);
```

```html
<!-- Make only this image editable -->
<img is="simpla-img" path="/img" editable>
```

Entering edit mode with Simpla is the recommended way to edit images. It ensures all elements on a page remain in sync and updates Simpla's public `'editable'` state, which other elements may rely on.

## Saving content

Save a simpla-img by calling Simpla's `save` method, which will save all modified content on the page. It returns a promise.

```js
// Save all modified Simpla content
Simpla.save();
```

> You must be authenticated with Simpla before saving content

## Initializing with static content

You can set a static `src` of a simpla-img just like you would with a regular `<img>`. If content for the image's `path` exists on Simpla's API, the locally set `src` will be overwritten

```html
<img is="simpla-img" src="/local/img.jpg" path="/img">
```

Initializing with static content is useful for converting existing images to Simpla images, or bootstrapping a project with predefined content. By setting `src` and then calling `Simpla.save()` you can easily set content directly to Simpla.

> Since static content is always overwritten by remote data, you should not have `src` set in production. If a newer image gets saved you will experience FOUC (Flash Of Unformatted Content) when the old one is overwritten 

## Custom placeholders

You can set custom placeholders (displayed when simpla-img is editable and doesn't have content) with a `placeholder` attribute

```html
<img is="simpla-img" path="/img" placeholder="url(https://placehold.it/200x200)">
```

`placeholder` takes any valid CSS `background` value (colors, `url()`, etc). The placeholder does not impact the image's default size or aspect ratio.

## Readonly

Simpla-img has a `readonly` property that stops it from becoming editable, even if Simpla is in edit mode or you try to set `editable` on the element directly. This is useful for using simpla-img to purely consume and display content from Simpla's API.

```html
<img is="simpla-img" path="/img" readonly>
```

## Contributing

If you find any issues with simpla-img please report them! If you'd like to see a new feature in supported file an issue or let us know in Simpla's public [Slack group][slack-url]. We also happily accept PRs. 

***

MIT © [Simpla][simpla]

[simpla]: https://www.simpla.io
[simpla-setup]: https://docs.simpla.io/guides/get-started.htlm

[api]: https://www.webcomponents.org/element/simplaio/simpla-img/page/API.md
[demo]: https://www.webcomponents.org/element/simplaio/simpla-img/demo/demo/index.html
[license]: https://github.com/simplaio/simpla-img/blob/master/LICENSE

[bower-badge]: https://img.shields.io/bower/v/simpla-img.svg
[travis-badge]: https://img.shields.io/travis/simplaio/simpla-img.svg
[travis-url]: https://travis-ci.org/simplaio/simpla-img
[size-badge]: http://img.badgesize.io/simplaio/simpla-img/master/simpla-img.html?compression=gzip&label=render_bundle_%28gzip%29
[webcomponents-badge]: https://img.shields.io/badge/webcomponents.org-published-blue.svg
[webcomponents-url]: https://www.webcomponents.org/element/simplaio/simpla-img
