'use strict';

var test = require('tap').test
var path = require('path') 
  , dockerifyRepo = require('dockerify-github-repo')
  , spinup = require('../')

var group = 'bmarkdown-test';

function filter(tag) {
  var num = parseInt(tag.split('-')[0], 10);
  return num === 9;// || num === 10;
}

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

test('\nrunning two dockerified tags of a github repo', function (t) {
  
  dockerifyRepo(
      'thlorenz/browserify-markdown-editor'
    , { filter: filter, dockerify: {  dockerfile: path.join(__dirname, 'Dockerfile') } }
    , function (err, streamfns) {
        if (err) return console.error(err);
        launch(group, streamfns)
        t.pass('dockerified streams')
    }
  );

  function launch(group, streamfns) {
    spinup(streamfns, { 
          group: group
        , loglevel: 'silly'
        , container: { exposePort: 3000, /*hostPortStart: 49330*/ } 
      }
      , function (err, res) {
          if (err) return console.error(err);
          console.log('The following containers are now running for group ', group);
          inspect(res);
          t.end()
        }
    );
  }
})
