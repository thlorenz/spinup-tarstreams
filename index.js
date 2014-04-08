'use strict';

var path          = require('path')
  , log           = require('npmlog')
  , xtend         = require('xtend')
  , createDocker  = require('./lib/create-docker')
  , logEvents     = require('./lib/log-events')
  , Images        = require('./lib/images')
  , Containers    = require('./lib/containers')
  , buildImages   = require('./lib/build-images')
  , runContainers = require('./lib/run-containers')

var defaultOpts = {
    dockerhost        : process.env.DOCKER_HOST || 'tcp://127.0.0.1:4243'
  , group             : 'ungrouped'
  , useExistingImages : true
  , loglevel          : 'info'            
}

var defaultContainerOpts = {
    hostPortStart   : 49222
  , exposePort      : 8080
  , startRetries    : 5
  , create: {
      AttachStdout    : true
    , AttachStderr    : true
    , WorkingDir      : 'src'
    }
  , start: {
      PublishAllPorts : true
    }
}

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

exports = module.exports = 

/**
 * Creates images for each provided tar stream and then starts a container for each image that matches the given group.
 *
 * This means that containers for already existing images can be started as well in order to allow
 * reusing existing images instead of having to rebuild them for each run.
 * 
 * Containers are exposing the provided port and bind it to a unique port on the host machine.
 *
 * This is the only API you will need most likely, **all other functions are considered advanced API**.
 * 
 * @name spinupTarstreams
 * @function
 * @param {Array.<function>} streamfns functions that return a tar stream each
 * @param {Object=} opts             options that describe how each image and container is created and started
 * @param {string=} opts.loglevel    (default: `'info'`) if set logs will be written to `stderr` (@see spinupTarstreams:logEvents)
 * @param {Object=} opts.container   options that describe how each container is created and started (@see spinupTarstreams::runContainers)
 * @param {string=} opts.dockerhost  (default: `$DOCKER_HOST or 'tcp://127.0.0.1:4243'`) the host that docker is running on 
 * @param {string=} opts.group       (default: `'ungrouped'`) the group aka REPOSITORY to which the add the created images and whose containers to start
 * @param {boolean=} opts.useExistingImages (default: `true`) if false all images are created, even if one for the group and tag exists 
 * @param {function} cb              called back when all images were created or with an error
 */
function spinupTarstreams(streamfns, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = null;
  }

  opts                  = xtend(defaultOpts, opts);
  opts.docker           = opts.docker || createDocker(opts);
  opts.container        = opts.container || {};
  opts.container.create = xtend(defaultContainerOpts.create, opts.container.create);
  opts.container.start  = xtend(defaultContainerOpts.start, opts.container.start);

  var images = new Images(opts.docker);
  if (opts.loglevel) logEvents(images, opts.loglevel);

  buildImages(images, streamfns, opts.group, opts.useExistingImages, function (err, res) {
    if (err) return cb(err);
    var containers = new Containers(opts.docker);
    if (opts.loglevel) logEvents(containers, opts.loglevel);
    runGroup(images, containers, opts.group, opts.container, cb)
  });
}

//
// Images
//
exports.Images      = Images;
exports.buildImages = buildImages;

var runImages = exports.runImages = 

/**
 * Starts up a container for each given image.
 *
 * @name spinupTarstreams::runImages
 * @function
 * @param {Object} containers         instance of initialized `{Containers}`
 * @param {Array.<string>} imagesToRun names of images to run of the form `'group:tag'`
 * @param {Object=} containerOpts options that describe how each container is created and started (@see spinupTarstreams::runContainers)
 * @param {function} cb called back when all containers for the images were started or with an error
 */
function (containers, imagesToRun, containerOpts, cb) {
  runContainers(containers, containerOpts, imagesToRun, cb);
}

var runGroup = exports.runGroup = 

/**
 * Starts up a container for each image of the given group that is found.
 * 
 * @name spinupTarstreams::runGroup
 * @function
 * @param {Object} images      instance of initialized `{Images}`
 * @param {Object} containers  instance of initialized `{Containers}`
 * @param {string} group       group of images for which to start containers
 * @param {Object=} containerOpts options that describe how each container is created and started (@see spinupTarstreams::runContainers)
 * @param {function} cb        called back when all containers for the group were started or with an error
 */
function (images, containers, group, containerOpts, cb) {
  images.listGroup(group, function (err, imagesOfGroup) {
    if (err) return cb(err);
    var imageNames = imagesOfGroup.map(function (x) { return x.RepoTags[0] });
    runImages(containers, imageNames, containerOpts, cb); 
  });
}

//
// Containers
// 
exports.Containers    = Containers;
exports.runContainers = runContainers;

//
// Misc
//
exports.logEvents = logEvents;

// TODO:
// provide way to query for all containers/images for a given repo

// provide a way to stop all containers for a matching group (i.e. repo name)

// provide a way to remove all containers for a group

// provide a way to remove all images for a group
