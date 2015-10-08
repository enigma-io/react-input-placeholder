var isPlaceholderSupported =    (typeof document !== 'undefined')
                             && 'placeholder' in document.createElement('input');

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

            if (this.props.onFocus) {
                return this.props.onFocus(e);
            }
        },
        onBlur: function(e) {
            this.hasFocus = false;

            if (this.props.onBlur) {
                return this.props.onBlur(e);
            }
        },

        setSelectionIfNeeded: function(node) {
            if (   this.needsPlaceholding
                && 'setSelectionRange' in node
                && this.hasFocus
                && this.isPlaceholding
                && (node.selectionStart !== 0 || node.selectionEnd !== 0)) {
                node.setSelectionRange(0, 0);
            } // if placeholder is visible, ensure cursor is at start of input
        },

        onChange: function(e) {
            var onChange = this.getOnChange();
            var value;
            var index;

            if (this.isPlaceholding) {
                // remove placeholder when text is added
                value = e.target.value;
                index = value.indexOf(this.props.placeholder);

                if (index !== -1) {
                    e.target.value = value.slice(0, index);
                }
            }

            if (onChange) {
                return onChange(e);
            }
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
            var props = {};
            var value;
            var key;

            for (key in this.props) {
                if (this.props.hasOwnProperty(key)) {
                    props[key] = this.props[key];
                }
            }

            if (this.needsPlaceholding) {
                // override valueLink and event handlers
                props.onFocus = this.onFocus;
                props.onBlur = this.onBlur;
                props.onChange = this.onChange;
                props.onSelect = this.onSelect;
                props.valueLink = undefined;

                value = this.getValue();

                if (!value) {
                    this.isPlaceholding = true;
                    value = this.props.placeholder;
                    props.className += ' placeholder';
                    // Password inputs will show dots in place of characters -
                    // to present the placeholder text we fall back to a
                    // standard text input.
                    if (props.type === 'password') {
                      props.type = 'text';
                    }
                } else {
                    this.isPlaceholding = false;
                }

                props.value = value;
            }

            if (!('createElement' in React)) { /* start -- to be removed in 2.0.0 */
                return this.transferPropsTo(elementConstructor());
            } else { /* -- end */
                return React.createElement(elementConstructor, props, this.props.children);
            }
        }
    });
};

module.exports = function(React) {
    if (!('createElement' in React)) { /* start -- to be removed in 2.0.0 */
        return {
            Input: createShimmedElement(React, React.DOM.input, 'Input'),
            Textarea: createShimmedElement(React, React.DOM.textarea, 'Textarea')
        };
    } else { /* -- end */
        return {
            Input: createShimmedElement(React, 'input', 'Input'),
            Textarea: createShimmedElement(React, 'textarea', 'Textarea')
        };
    }
};
