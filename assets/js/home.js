'use strict';

var $ = require('jquery');
var iframe = require('iframe');
var _ = require('lodash');

function getEditor(el, mode) {
  var ctrl = CodeMirror.keyMap["default"] == CodeMirror.keyMap.pcDefault ? "Ctrl-" : "Cmd-";
  var opt = {
    value: $('textarea', el).val(),
    mode: mode,
    lineNumbers: true,
    matchBrackets: true,
    indentWithTabs: true,
    tabSize: 2,
    indentUnit: 2,
    styleActiveLine: true,
    extraKeys: {}
  };
  opt.extraKeys[ctrl+'B'] = build;
  opt.extraKeys[ctrl+'S'] = save;
  var editor = CodeMirror(el, opt);
  editor.on('focus', function() {
    $(el).addClass('focus').siblings('.focus').removeClass('focus');
  });
  return editor;
}

var htmlEditor = getEditor($('#html')[0], 'html');
var cssEditor = getEditor($('#css')[0], 'css');
var jsEditor = getEditor($('#js')[0], 'javascript');

var errorLines = [];
var widgets = [];

build();

////////////////////
// Helpers.

function save() {
  var data = getEditorVals();
  if (validate(data.js, jsEditor)) {
    remoteSave(data);
  }
}

function build() {
  var data = getEditorVals();
  if (validate(data.js, jsEditor)) {
    remoteBuild(data);
  }
}

function getId() {
  var m = location.pathname.match(/bins\/([^\/]+)/);
  if (m && m[1]) {
    return m[1];
  } else {
    return null;
  }
}

function remoteSave(data) {
  // Update exist bin
  var id = getId();
  if (id) {
    _.extend(data, {
      id: id
    });
  }

  $.ajax({
    url: '/save',
    method: 'post',
    data: data,
    success: function(html, status, xhr) {
      if (!getId()) {
        var id = xhr.getResponseHeader('bin_id');
        history.pushState(null, 'edit', '/bins/'+id+'/edit');
      }
      updatePlay(html);
    },
    error: function(xhr, statusCode, errorCode) {
      if (errorCode === 'Unauthorized') {
        alert('Unauthorized. Please login first.');
      } else if (errorCode === 'Forbidden') {
        alert('Forbidden. It\'s not your bin.');
      } else {
        console.log('errorCode: ' + errorCode);
        alert('404');
      }
    }
  });
}

function remoteBuild(data) {
  $.ajax({
    url: '/build',
    method: 'post',
    data: data,
    success: updatePlay,
    error: function(xhr, statusCode) {
      console.log(statusCode);
    }
  });
}

function getEditorVals() {
  return {
    html: htmlEditor.getValue(),
    css: cssEditor.getValue(),
    js: jsEditor.getValue()
  };
}

function validate(val, editor) {
  return editor.operation(function() {
    while ( errorLines.length > 0 ) {
      editor.removeLineClass( errorLines.shift(), 'background', 'errorLine' );
    }

    for ( var i = 0; i < widgets.length; i ++ ) {
      editor.removeLineWidget( widgets[ i ] );
    }

    widgets.length = 0;

    try {
      var result = esprima.parse( val, { tolerant: true } ).errors;
      for ( var i = 0; i < result.length; i ++ ) {
        var error = result[ i ];
        var message = document.createElement( 'div' );
        message.className = 'esprima-error';
        message.textContent = error.message.replace(/Line [0-9]+: /, '');

        var lineNumber = error.lineNumber - 1;
        errorLines.push( lineNumber );
        editor.addLineClass( lineNumber, 'background', 'errorLine' );
        var widget = editor.addLineWidget(
          lineNumber,
          message
        );
        widgets.push( widget );
      }
    } catch ( error ) {
      var message = document.createElement( 'div' );
      message.className = 'esprima-error';
      message.textContent = error.message.replace(/Line [0-9]+: /, '');
      var lineNumber = error.lineNumber - 1;
      errorLines.push( lineNumber );
      editor.addLineClass( lineNumber, 'background', 'errorLine' );
      var widget = editor.addLineWidget(
        lineNumber,
        message
      );
      widgets.push( widget );
    }

    return errorLines.length === 0;
  });
}

var playIframe = iframe({
  container: document.getElementById('play')
});

function updatePlay(html) {
  playIframe.setHTML({
    body: html,
    sandboxAttributes: ['allow-scripts', 'allow-same-origin']
  });
}
