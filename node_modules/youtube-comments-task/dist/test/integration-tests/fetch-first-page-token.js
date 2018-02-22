'use strict';

var _require = require('chai'),
    expect = _require.expect;

var fetchFirstPageToken = require('../../lib/fetch-first-page-token');

describe('/lib/fetch-first-page-token', function () {
  this.timeout(10000);

  it('fetches the first page token', function (done) {
    fetchFirstPageToken('h_tkIpwbsxY').fork(function (e) {
      return done('got an error ' + e);
    }, function (t) {
      expect(t).to.be.a('string').lengthOf.at.least(64).that.match(/^[\w\d]+=+$/);
      done();
    });
  });
});