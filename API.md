# API reference

## Properties

Property      | Type      | Default             | Description                                                   
------------- | --------- | ------------------- | -----------                                                   
`path`        | `String`  | `undefined`         | Path to the content for this image on Simpla's API            
`src`         | `String`  | Data URI            | Src of the image (defaults to transparent pixel)                                             
`alt`         | `String`  | `undefined`         | Alt text for the image                                        
`placeholder` | `String`  | `'placeholder.svg'` | Placeholder to show when image is editable and has no content 
`editable`    | `Boolean` | `false`             | Whether the image is editable                                 
`active`      | `Boolean` | `false`             | Whether the image is currently being edited                   
`loaded`      | `Boolean` | `false`             | Whether the image src has been loaded

Properties can be set either directly with JavaScript or as attributes on the element

```html
<img is="simpla-img" path="/img" placeholder="pink">

<script>
  document.querySelector('img[is="simpla-img"]').editable = true;
</script>
```

## Schema

**Type:** `'Image'`

Data  | Type      | Description                                           
----- | --------- | -----------                                           
`src` | `String`  | Source string of the image
`alt` | `String`  | Alt string of the image

```json
{
  "path": "/img/path",
  "type": "Image",
  "data": {
    "src": "https://storage.googleapis.com...",
    "alt": "My image"
  },
  "createdAt": "2017-04-16T09:58:56.276Z",
  "updatedAt": "2017-05-09T09:25:36.835Z"
}
```

## Events

Event              | Properties       | Description                                    
------------------ | ---------------- | -----------                                    
`src-changed`      | `value{Array}`   | Fired when `src` property changes      
`alt-changed`      | `value{String}`  | Fired when `alt` property changes      
`editable-changed` | `value{Boolean}` | Fired when `editable` property changes 
`active-changed`   | `value{Boolean}` | Fired when `active` property changes   
`loaded-changed`   | `value{Boolean}` | Fired when `loaded` property changes   