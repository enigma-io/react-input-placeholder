/*global define*/
var reactInputPlaceholder = require('./react-input-placeholder');
if (typeof define === 'function' && define.amd) {
  define(['react'], function (React) {
    return reactInputPlaceholder(React);
  });
} else {
  window.PlaceholderShim = reactInputPlaceholder(window.React);
}