'use strict';

var _require = require('chai'),
    expect = _require.expect;

var errorTypes = require('../error-types');

describe('/error-types.js', function () {
  it('exports an errorTypes object', function () {
    expect(errorTypes).to.be.an('object');
    expect(errorTypes.SCRAPER_ERROR).to.equal('scraper-error');
    expect(errorTypes.VIDEO_ERROR).to.equal('video-error');
  });
});