var React = require('react');
var ReactDOM = require('react-dom');
var assign = require('lodash.assign');

var isPlaceholderSupported = 'placeholder' in document.createElement('input');

/**
 * Input is a wrapper around React.DOM.input with a `placeholder` shim for IE9.
 * NOTE: only supports "controlled" inputs (http://facebook.github.io/react/docs/forms.html#controlled-components)
 */
function createShimmedElement(elementConstructor, name) {
  return React.createClass({
    displayName: name,

    propTypes: {
      placeholderStyle: React.PropTypes.object
    },

    componentWillMount: function() {
      this.needsPlaceholding = this._needsPlaceholding(this.props.placeholder);
    },
    componentWillReceiveProps: function(props) {
      this.needsPlaceholding = this._needsPlaceholding(props.placeholder);
    },

    _needsPlaceholding: function(placeholder) {
      if (!placeholder) { return false; }

      // need to manually apply placeholders with newlines in textarea
      if (!this._isChrome() && name === 'Textarea' && placeholder.indexOf('\n') !== -1) {
        return true;
      }

      return !isPlaceholderSupported;
    },

    _isChrome: function() {
      return !!window.chrome && !!window.chrome.webstore;
    },

    // this component supports valueLink or value/onChange.
    // borrowed from LinkedValueMixin.js
    getValue: function() {
      if (this.props.valueLink) {
        return this.props.valueLink.value;
      }
      return this.props.value;
    },
    getOnChange: function() {
      if (this.props.valueLink) {
        return this._handleLinkedValueChange;
      }
      return this.props.onChange;
    },
    _handleLinkedValueChange: function(e) {
      this.props.valueLink.requestChange(e.target.value);
    },

    // keep track of focus
    onFocus: function(e) {
      this.hasFocus = true;
      this.setSelectionIfNeeded(e.target);
      if (this.props.onFocus) { return this.props.onFocus(e); }
    },
    onBlur: function(e) {
      this.hasFocus = false;
      if (this.props.onBlur) { return this.props.onBlur(e); }
    },

    // this event handler prevents user from selecting placeholder text while
    // ensuring the input gets focus
    onMouseDownWhilePlaceholding: function(e) {
      e.preventDefault();
      e.target.focus();
    },

    setSelectionIfNeeded: function(node) {
      // if placeholder is visible, ensure cursor is at start of input
      if (this.needsPlaceholding && this.hasFocus && this.isPlaceholding &&
          (node.selectionStart !== 0 || node.selectionEnd !== 0)) {
        node.setSelectionRange(0, 0);
        return true;
      }
      return false;
    },

    onChange: function(e) {
      if (this.isPlaceholding) {
        // remove placeholder when text is added
        var value = e.target.value,
            i = value.indexOf(this.props.placeholder);
        if (i !== -1) {
          e.target.value = value.slice(0, i);
        }
      }
      var onChange = this.getOnChange();
      if (onChange) { return onChange(e); }
    },

    onSelect: function(e) {
      if (this.isPlaceholding) {
        this.setSelectionIfNeeded(e.target);
        return false;
      } else if (this.props.onSelect) {
        return this.props.onSelect(e);
      }
    },

    componentDidUpdate: function() {
      this.setSelectionIfNeeded(ReactDOM.findDOMNode(this));
    },

    render: function() {
      var props = assign({}, this.props);

      if (this.needsPlaceholding) {
        // override valueLink and event handlers
        props.onFocus = this.onFocus;
        props.onBlur = this.onBlur;
        props.onChange = this.onChange;
        props.onSelect = this.onSelect;
        props.valueLink = undefined;

        var value = this.getValue();
        if (!value) {
          this.isPlaceholding = true;
          value = this.props.placeholder;
          if (name === 'Input') {
            props.type = 'text';
          }
          props.className += ' placeholder';

          props.onMouseDown = this.onMouseDownWhilePlaceholding;

          if (this.props.placeholderStyle) {
            props.style = assign({}, this.props.style, this.props.placeholderStyle);
          }
        } else {
          this.isPlaceholding = false;
        }
        props.value = value;
      }

      var element = React.createElement(elementConstructor, props, this.props.children);
      return element;
    }
  });
}

module.exports = {
  Input: createShimmedElement('input', 'Input'),
  Textarea: createShimmedElement('textarea', 'Textarea')
};
