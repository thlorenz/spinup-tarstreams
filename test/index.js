'use strict';

process.env.TAP_TIMEOUT = 240;

var test = require('tap').test
var path = require('path') 
  , dockerifyRepo = require('dockerify-github-repo')
  , dockops = require('dockops')
  , spinup = require('../')

var group = 'bmarkdown-test';

function filter(tag) {
  var num = parseInt(tag.split('-')[0], 10);
  return num === 9 || num === 10;
}

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

test('\nrunning two dockerified tags of a github repo', function (t) {
  t.plan(8)

  t.on('end', function () {
    new dockops.Containers(dockops.createDocker(spinup._defaultOpts.dockerhost))
      .stopRemoveGroup(group, function (err) {
        if (err) return console.error(err);
      })
  });
  
  dockerifyRepo(
      'thlorenz/browserify-markdown-editor'
    , { filter: filter, dockerify: {  dockerfile: path.join(__dirname, 'Dockerfile') } }
    , function (err, streamfns) {
        if (err) return console.error(err);
        launch(group, streamfns)
    }
  );

  function launch(group, streamfns) {
    spinup(streamfns, { 
          group: group
        , loglevel: 'silly'
        , container: { exposePort: 3000, /*hostPortStart: 49330*/ } 
      }
      , function (err, containers) {
          if (err) return console.error(err);

          // inspect(containers);

          containers.forEach(function (c) {

            t.equal(c.Command, 'node /src/index.js', 'container has correct command')
            t.similar(c.Status, /^Up/, 'container is up')
            t.similar(c.Image, /^bmarkdown-test/, 'container is from correct image')
            t.equal(c.Ports.length, 1, 'container has 1 port')
          })
        }
    )

  }
})
