'use strict';

var test         = require('tap').test
  , createDocker = require('../lib/create-docker')
  , logEvents    = require('../lib/log-events')
  , Images       = require('../lib/images')
  , dockerhost   = 'tcp://127.0.0.1:4243';

var docker = createDocker({ dockerhost: dockerhost });

var images = new Images(docker);
logEvents(images, 'silly');

function setup(cb) {
  // stop all containers for group 'test', remove them and then remove all images of that group as well
  images.removeGroup('test', cb);
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
