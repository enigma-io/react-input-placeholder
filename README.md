React Input and Textarea with Placeholder Shim
=======================

`PlaceholderShim` provides `Input` and `Textarea`, small wrappers around `React.DOM.input`  and `React.DOM.textarea` respectively that shims in `placeholder` functionality for browsers that don't natively support it. Currently only tested with IE9.

Demo: http://jsfiddle.net/gb4xq/12/

## Getting Started

### Browserify

Install: `npm install react-input-placeholder`

Require:
```
Input = require('react-input-placeholder')(React).Input;
Textarea = require('react-input-placeholder')(React).Textarea;
```

### No module

The compiled component sits in the `dist` folder.

```
<script src='dist/react-input-placeholder.min.js'></script>
<script>
  var Input = PlaceholderShim.Input;
  var Textarea = PlaceholderShim.Textarea;
</script>
```

## Usage

You can use `Input` or `Textarea` exactly the same way you'd use `React.DOM.Input`. All attributes will be passed on, and all event callbacks will be called. However, please note that the placeholder shim only works on [controlled](http://facebook.github.io/react/docs/forms.html#controlled-components) inputs (i.e., you must provide a `value` or `valueLink` prop).

When the placeholder text is visible, the `placeholder` CSS class will be added to the `input` element so you can style it, e.g.
```
input.placeholder, textarea.placeholder {
  color: gray;
  font-style: italic;
}
```

### Before

Placeholder doesn't show on IE9.

```
<input placeholder="Enter text here..." value={this.state.value} onChange={this.handleChange} />
```

### After

Works on IE9!

```
<Input placeholder="Enter text here..." value={this.state.value} onChange={this.handleChange} />
```

## Building yourself

```
npm install
grunt dist
```

## License

MIT
