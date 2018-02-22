'use strict';

var _require = require('chai'),
    expect = _require.expect;

var cheerioUtils = require('../../../lib/utils/cheerio-utils');

var html = '\n  <div>\n    <h1 id="test" farts="smell">TITLE</h1>\n    <ul>\n      <li class="many">many_1</li>\n      <li class="many">many_2</li>\n      <li class="many">many_3</li>\n    </ul>\n  </div>';

describe('/lib/utils/cheerio-utils.js', function () {
  it('exports an object with methods', function () {
    expect(cheerioUtils).to.be.a('object');
    expect(cheerioUtils.cheerio).to.be.a('function');
    expect(cheerioUtils.cheerioLoad).to.be.a('function');
    expect(cheerioUtils.cheerioFind).to.be.a('function');
    expect(cheerioUtils.cheerioFindAll).to.be.a('function');
    expect(cheerioUtils.cheerioAttr).to.be.a('function');
    expect(cheerioUtils.cheerioFindText).to.be.a('function');
    expect(cheerioUtils.cheerioFindAttr).to.be.a('function');
  });

  it('cheerioLoad retuns a cheerio object', function () {
    cheerioUtils.cheerioLoad(html).fold(function (e) {
      return expect.fail('Got an error ' + e);
    }, function ($) {
      expect($).to.be.a('object').that.has.property('find');
      expect($.find('#test').text()).to.equal('TITLE');
    });
  });

  it('cheerioFind finds a DOM node', function () {
    cheerioUtils.cheerioLoad(html).chain(function ($) {
      return cheerioUtils.cheerioFind($, '#test');
    }).fold(function (e) {
      return expect.fail('Got an error ' + e);
    }, function ($t) {
      expect($t).to.be.a('object').that.has.property('find');
      expect($t.text()).to.equal('TITLE');
    });
  });

  it("cheerioFind fails if it can't find a DOM node", function () {
    cheerioUtils.cheerioLoad(html).chain(function ($) {
      return cheerioUtils.cheerioFind($, '#nothing');
    }).fold(function (e) {
      expect(e).to.equal('No matches for #nothing');
    }, function ($t) {
      expect.fail('expected to fail ' + $t);
    });
  });

  it('cheerioFindAll finds an array of DOM nodes', function () {
    cheerioUtils.cheerioLoad(html).chain(function ($) {
      return cheerioUtils.cheerioFindAll($, '.many');
    }).fold(function (e) {
      return expect.fail('Got an error ' + e);
    }, function ($ts) {
      $ts.forEach(function ($t) {
        expect($t).to.be.a('object').that.has.property('find');
        expect($t.text()).to.be.a('string').that.matches(/many_/);
      });
    });
  });

  it('cheerioAttr returns an attribute of a DOM node', function () {
    cheerioUtils.cheerioLoad(html).chain(function ($) {
      return cheerioUtils.cheerioFind($, '#test');
    }).chain(function ($t) {
      return cheerioUtils.cheerioAttr($t, 'farts');
    }).fold(function (e) {
      return expect.fail('Got an error ' + e);
    }, function (t) {
      expect(t).to.equal('smell');
    });
  });

  it('cheerioAttr fails if a DOM node is missing an attribute', function () {
    cheerioUtils.cheerioLoad(html).chain(function ($) {
      return cheerioUtils.cheerioFind($, '#test');
    }).chain(function ($t) {
      return cheerioUtils.cheerioAttr($t, 'blah');
    }).fold(function (e) {
      expect(e).to.be.a('string').that.match(/Attribute blah not found on/);
    }, function ($t) {
      expect.fail('expected to fail ' + $t);
    });
  });

  it('cheerioFindText finds the text of a DOM node', function () {
    cheerioUtils.cheerioLoad(html).chain(function ($) {
      return cheerioUtils.cheerioFindText($, '#test');
    }).fold(function (e) {
      return expect.fail('Got an error ' + e);
    }, function (t) {
      expect(t).to.equal('TITLE');
    });
  });

  it('cheerioFindAttr finds an attribute of a DOM node', function () {
    cheerioUtils.cheerioLoad(html).chain(function ($) {
      return cheerioUtils.cheerioFindAttr($, '#test', 'farts');
    }).fold(function (e) {
      return expect.fail('Got an error ' + e);
    }, function (t) {
      expect(t).to.equal('smell');
    });
  });
});