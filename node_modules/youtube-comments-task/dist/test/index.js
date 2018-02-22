'use strict';

var _require = require('chai'),
    expect = _require.expect;

var fetchComments = require('../index');

describe('/index.js', function () {
  it('exports a function', function () {
    expect(fetchComments).to.be.a('function');
  });
});