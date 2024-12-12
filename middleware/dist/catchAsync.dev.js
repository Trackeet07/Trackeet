"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(fn) {
  return function (req, res, next) {
    fn(req, res, next)["catch"](next);
  };
};

exports["default"] = _default;