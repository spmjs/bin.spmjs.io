
var $ = window.jQuery = require('jquery');
require('messenger');

Messenger.options = {
  extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
  theme: 'flat'
};

exports.error = function(msg) {
  var m = Messenger();
  m.post({
    message: msg,
    type: 'error',
    showCloseButton: true
  });
};
