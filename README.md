# Simpla Image
![Version][bower-badge] [![Build status][travis-badge]][travis-url] ![Size][size-badge] [![Published][webcomponents-badge]][webcomponents-url] [![Simpla slack group][slack-badge]][slack-url]

Simpla-img is an editable image built on the [Simpla](https://www.simpla.io) content system. It extends the `<img>` element and can be edited seamlessly inline on your page.

<!---
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="simpla-img.html">

    <script src="https://unpkg.com/simpla@2.0.0"></script>
    <script>
      Simpla.init('local');
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

<script>
  Simpla.editable(true);
</script>
```

## Installation and setup

Install simpla-img with Bower (Yarn support coming soon)

```sh
$ bower install simpla-img --save
```

Then include the Simpla library and setup a project (read more about [setting up Simpla](https://www.simpla.io/docs/guides/get-started))

```html
<script src="https://unpkg.com/simpla@^2.0.0"></script>
<script>
  // TODO: replace 'project-id' with your project ID
  Simpla.init('project-id')
</script>
```

Import simpla-img into the `<head>` of your document

```html
<link rel="import" href="/bower_components/simpla-img/simpla-img.html">
```

And create an editable image by extending `<img>` with the `is` attribute. You must also specify a content path (where the image's data will be stored on Simpla's API) in a `path` attribute.

```html
<img is="simpla-img" path="/img">
```

### Polyfills for cross-browser support

`simpla-img` relies on emerging standards, for full cross-browser support make sure you include the [Web Components Lite](https://github.com/webcomponents/webcomponentsjs) polyfill.

```html
<script src="https://unpkg.com/webcomponents.js@^0.7.24/webcomponents-lite.min.js"></script>
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

> If you include the [simpla-admin](https://webcomponents.org/element/SimplaElements/simpla-admin) component on your page, you can also enter edit mode by adding #edit to the end of your URL

## Saving content

Save a `simpla-img` by calling Simpla's `save` method, which will save all modified content on the page. It returns a promise.

```js
// Save all modified Simpla content
Simpla.save();
```

Note you must be authenticated before saving content - either login with `simpla-admin` or the `Simpla.login()` method.

> If you have included the [simpla-admin](http://webcomponents.org/element/SimplaElements/simpla-admin) component on your site, you can save content by entering edit mode and just pressing the 'save' button.

## Initializing with static content

You can set the `src` of simpla-img just like you would with a regular `<img>`. If content for the image's `path` exists on Simpla's API, the locally set `src` will be overwritten

```html
<img is="simpla-img" src="/local/img.jpg" path="/img">
```

Initializing with static content is useful for converting existing images to Simpla images, or bootstrapping a project with predefined content. By setting `src` and then calling `Simpla.save()` you can easily set content directly to Simpla.

**Note:** Since `src` is always overwritten by remote data, you should not have `src` set in production, because if a newer image gets saved you will experience FOUC (Flash Of Unformatted Content) when the old one is overwritten

## Custom placeholders

You can set custom placeholders (displayed when simpla-img is editable and does not have content) the same way as native elements, with a `placeholder` attribute

```html
<img is="simpla-img" path="/img" placeholder="url(https://placehold.it/200x200)">
```

`placeholder` takes any valid CSS `background` value (colors, `url()`, etc). The placeholder does not impact the image's default size or aspect ratio.


## API reference

### Properties

Property      | Type    | Default           | Description                                                   
------------- | ------- | ----------------- | -----------                                                   
`src`         | String  | data URI          | Src of the image (defaults to transparent pixel)                                             
`alt`         | String  | `undefined`       | Alt text for the image                                        
`path`        | String  | `undefined`       | Path to the content for this image on Simpla's API            
`placeholder` | String  | `'placeholder.svg'` | Placeholder to show when image is editable and has no content 
`editable`    | Boolean | `false`           | Whether the image is editable                                 
`active`      | Boolean | `false`           | Whether the image is currently being edited                   

Properties can be set either directly with JavaScript or as attributes on the element

```html
<img is="simpla-img" id="img" path="/img" placeholder="pink">

<script>
  document.querySelector('#img').editable = true;
</script>
```

### Events

Event              | Description                                    
------------------ | -----------                                    
`src-changed`      | Fired whenever the `src` property changes      
`alt-changed`      | Fired whenever the `alt` property changes      
`editable-changed` | Fired whenever the `editable` property changes 
`active-changed`   | Fired whenever the `active` property changes   

## Contributing

If you find any issues with simpla-img please report them! If you'd like to see a new feature in supported file an issue or let us know in Simpla's public [Slack group](https://slack.simpla.io). We also happily accept PRs. 

***

MIT © Simpla

[bower-badge]: https://img.shields.io/bower/v/simpla-img.svg
[travis-badge]: https://img.shields.io/travis/SimplaElements/simpla-img.svg
[travis-url]: https://travis-ci.org/SimplaElements/simpla-img
[size-badge]: https://badges.herokuapp.com/size/github/SimplaElements/simpla-img/master/simpla-img.html?gzip=true
[webcomponents-badge]: https://img.shields.io/badge/webcomponents.org-published-blue.svg
[webcomponents-url]: https://www.webcomponents.org/element/SimplaElements/simpla-img
[slack-badge]: http://slack.simpla.io/badge.svg
[slack-url]: https://slack.simpla.io

