React Input and Textarea with Placeholder Shim
=======================

`PlaceholderShim` provides `Input` and `Textarea`, small wrappers around `React.createElement('input')` and `React.createElement('textarea')` respectively that shims in `placeholder` functionality for browsers that don't natively support it. Currently only tested with IE9.

Demo: https://jsfiddle.net/69z2wepo/16498/

## Getting Started
### Browserify

Install: `npm install react-input-placeholder`

Require:

```js
Input = require('react-input-placeholder')(React).Input;
Textarea = require('react-input-placeholder')(React).Textarea;

// React >= 14.0.0
Input = require('react-input-placeholder')(React, ReactDom).Input;
Textarea = require('react-input-placeholder')(React, ReactDom).Textarea;
```

### No module

The compiled bundle sits in the `dist/` folder.

```js
<script src='dist/react-input-placeholder.min.js'></script>
<script>
  var Input = PlaceholderShim.Input;
  var Textarea = PlaceholderShim.Textarea;
</script>
```

## Usage

You can use `Input` or `Textarea` exactly the same way you'd use `React.createElement('input')` or `<input />` in JSX. All attributes will be passed on, and all event callbacks will be called. However, please note that the placeholder shim only works on [controlled](http://facebook.github.io/react/docs/forms.html#controlled-components) inputs (i.e., you must provide a `value` or `valueLink` prop).

When the placeholder text is visible, the `placeholder` CSS class will be added to the `input` element so you can style it, e.g.

```css
input.placeholder,
textarea.placeholder {
  color: gray;
  font-style: italic;
}
```

### Before

Placeholder doesn't show on IE9.

```html
<input placeholder="Enter text here..." value={this.state.value} onChange={this.handleChange} />
```

### After

Works on IE9!

```html
<Input placeholder="Enter text here..." value={this.state.value} onChange={this.handleChange} />
```

## Building yourself

```shell
npm install
grunt dist
```

## License

MIT
