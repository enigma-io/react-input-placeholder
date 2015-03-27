var isPlaceholderSupported = (typeof document !== 'undefined') && 'placeholder' in document.createElement('input');

/**
 * Input is a wrapper around React.DOM.input with a `placeholder` shim for IE9.
 * NOTE: only supports "controlled" inputs (http://facebook.github.io/react/docs/forms.html#controlled-components)
 */
var createShimmedElement = function(React, elementConstructor, name) {
  return React.createClass({
    displayName: name,

    componentWillMount: function() {
      this.needsPlaceholding = this.props.placeholder && !isPlaceholderSupported;
    },
    componentWillReceiveProps: function(props) {
      this.needsPlaceholding = props.placeholder && !isPlaceholderSupported;
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
      this.setSelectionIfNeeded(this.getDOMNode());
    },

    render: function() {
      var element = this.transferPropsTo(elementConstructor());
      if (this.needsPlaceholding) {
        // override valueLink and event handlers
        element.props.onFocus = this.onFocus;
        element.props.onBlur = this.onBlur;
        element.props.onChange = this.onChange;
        element.props.onSelect = this.onSelect;
        element.props.valueLink = undefined;

        var value = this.getValue();
        if (!value) {
          this.isPlaceholding = true;
          value = this.props.placeholder;
          element.props.type = 'text';
          element.props.className += ' placeholder';
        } else {
          this.isPlaceholding = false;
        }
        element.props.value = value;
      }
      return element;
    }
  });
}

module.exports = function(React) {
  return {
    Input: createShimmedElement(React, React.DOM.input, "Input"),
    Textarea: createShimmedElement(React, React.DOM.textarea, "Textarea")
  }
};
