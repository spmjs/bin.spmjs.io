'use strict';

var build = require('../lib/build');

describe('build', function() {

  it('js deps', function() {
    var result = build({
      html: '',
      css: '',
      js: 'require(\'query-string\');'
    });
    result.alias["query-string"].should.be.containEql('sea-modules/query-string/');
  });

  it('css deps [TODO]', function() {
    // TODO
  });
});
