'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var debug = require('debug')('request');
var req = require('request');
var Task = require('data.task');

module.exports = function (opts) {
  return new Task(function (rej, res) {
    var optsWithJar = typeof opts === 'string' ? _extends({}, { jar: req.jar() }, { url: opts }) : _extends({}, { jar: req.jar() }, opts);

    debug('sending request: %o', optsWithJar);

    req(optsWithJar, function (err, response, body) {
      if (err) {
        debug('request failed', err);
        rej(err);
      } else if (response.statusCode !== 200) {
        debug('request failed', response.statusCode);
        rej('Request failed, Status ' + response.statusCode);
      } else {
        res({ body: body, cookieJar: optsWithJar.jar });
      }
    });
  });
};