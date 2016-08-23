/*global define*/
var reactInputPlaceholder = require('./react-input-placeholder');
if (typeof define === 'function' && define.amd) {
  define(['react', 'react-dom'], function (React, ReactDom) {
    return reactInputPlaceholder(React, ReactDom);
  });
} else {
  window.PlaceholderShim = reactInputPlaceholder(window.React, window.ReactDom);
}
