'use strict';

var binModel = require('../models/bin');

describe('bin', function() {

  it('getById', function(done) {

    binModel.getById('2HTh7p8deXG4BrOL', function(err, result) {
      console.log(result);
      done();
    });
  });
});
