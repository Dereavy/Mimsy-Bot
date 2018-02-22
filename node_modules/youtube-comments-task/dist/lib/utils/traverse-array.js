"use strict";

/*
 * Source: https://github.com/DrBoolean/immutable-ext
 */

var traverse = function traverse(arr, point, f) {
  return arr.reduce(function (ys, x) {
    return f(x).map(function (x) {
      return function (y) {
        return y.concat([x]);
      };
    }).ap(ys);
  }, point([]));
};

module.exports = traverse;