'use strict';

var runnel = require('runnel');

var si = typeof setImmediate === 'function' ? setImmediate : function (fn) { setTimeout(fn, 0) };

function imageName(group, id) {
  return group + ':' + id;
}

module.exports =
  
/**
 * Builds images from the given specs
 * 
 * @name buildImages
 * @function
 * @private
 * @param {Object}  images      instance of initiliazed `{Images}`, it is also used to emit progress events over
 * @param {Object}  streamfns   functions returning tar streams hashed by tag name
 * @param {string}  group       group for which to build images (i.e. repo name)
 * @param {boolean} useExisting (default: true) if false existing all images will be built even if one for group and tag exists
 * @param {function} cb         called back with error or an array of images that were built
 * @return 
 */
function buildImages(images, streamfns, group, useExisting, cb) {
  if (!useExisting) return build(streamfns, cb);

  images.listGroup(group, function (err, res) {
    if (err) return cb(err);

    var existingImageTags = res.map(function (x) { 
      return images.deserializeImageName(x.RepoTags[0]).tag 
    })

    var tobuild = Object.keys(streamfns)
      .filter(function (k) { return !~existingImageTags.indexOf(k) })
      .reduce(function (acc, k) { 
        acc[k] = streamfns[k];
        return acc;
      }, {})

    images.emit('verbose', 'images', 'only building not yet existing images');
    build(tobuild, cb);
  })

  function build(fns, built) {
    var keys = Object.keys(fns);
    if (!keys.length) { 
      images.emit('warn', 'No images need to be built');
      return si(built.bind(null, null, []));
    }

    images.emit('info', 'images', 'will build', keys);

    var tasks = keys 
      .map(function (k) {
        var image = imageName(group, k)
          , streamfn = fns[k];

        return function (cb_) {
            images.build(streamfn(), image, cb_);
          }
      });

    runnel(tasks.concat(built));
  }
}
