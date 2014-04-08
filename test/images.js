'use strict';

var test         = require('tap').test
  , createDocker = require('../lib/create-docker')
  , logEvents    = require('../lib/log-events')
  , Images       = require('../lib/images')
  , Containers   = require('../lib/containers')
  , dockerhost   = 'tcp://127.0.0.1:4243'
  , group        = 'test'

var docker = createDocker({ dockerhost: dockerhost });

var images = new Images(docker);
logEvents(images, 'silly');

var containers = new Containers(docker);
logEvents(containers, 'silly');

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

function setup(cb) {
  // stop all containers for group 'test', remove them and then remove all images of that group as well
  containers
    .stopRemoveGroup(group, function (err, res) {
      if (err) return cb(err);
      images.removeGroup(group, cb);
    });
}

setup(function (err) {
  if (err) return console.error(err);
});

function createStreams() {
  // TODO:
}

function createImages() {
  createStreams('', function (err, streams) {
    if (err) return console.error(err);

    images.build(streams[0], 'bmarkdown', function (err, res) {
      if (err) return console.error(err);
      console.log(res);
    });
  });
}

// TODO; test
// - remove all images
// - create images multi group
// - list images for group
// - remove images for group (needs impl as well)

/*var opts = xtend(defaultOpts, {});
var images = new Images(createDocker(opts));
images.listGroup('bmarkdown', function (err, res) {
  if (err) return console.error(err);
  console.log(res);  
});*/
