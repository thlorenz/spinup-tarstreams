'use strict';

var test = require('tap').test
  , images = require('../lib/images')

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
