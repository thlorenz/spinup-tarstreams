'use strict';

var path          = require('path')
  , log           = require('npmlog')
  , dockerode     = require('dockerode')
  , xtend         = require('xtend')
  , logEvents     = require('./lib/log-events')
  , Images        = require('./lib/images')
  , Containers    = require('./lib/containers')
  , buildImages   = require('./lib/build-images')
  , runContainers = require('./lib/run-containers')

function createDocker(opts) {
  var dockerhost = opts.dockerhost
    , parts      = dockerhost.split(':')
    , host       = parts.slice(0, -1).join(':').replace(/^tcp/, 'http')
    , port       = parts[parts.length - 1]

  return dockerode({ host: host, port: port });
}

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

exports = module.exports = 

/**
 * Creates images for each provided tar stream and then starts a container for each.
 * Containers are exposing the provided port and bind it to a unique port on the host machine.
 *
 * This is the only API you will need most likely, all that follows is considered advanced API.
 * 
 * @name spinupTarstreams
 * @function
 * @param {Array.<function>} streamfns functions that return a tar stream each
 * @param {Object} opts             options that describe how each image and container is created and started
 * @param {string} opts.loglevel    (default: `'info'`) if set logs will be written to `stderr` (@see spinupTarstreams:logEvents)
 * @param {Object} opts.container   options that describe how each container is created and started (@see spinupTarstreams::runContainers)
 * @param {string} opts.dockerhost  (default: `$DOCKER_HOST or 'tcp://127.0.0.1:4243'`) the host that docker is running on 
 * @param {string} opts.group       (default: `'ungrouped'`) the group aka REPOSITORY to which the add the created images
 * @param {boolean} opts.useExistingImages (default: `true`) if false all images are created, even if one for the group and tag exists 
 * @param {function} cb             called back when all images were created or with an error
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
  logEvents(images);

  buildImages(images, streamfns, opts.group, opts.useExistingImages, function (err, res) {
    if (err) return cb(err);
    cb(null, res);
  });
}

//
// Images
//
exports.Images      = Images;
exports.buildImages = buildImages;

var runImages = exports.runImages = 

/**
 * todo: fix, doc and expose
 *
 * @name 
 * @function
 * @param images 
 * @param opts 
 * @param cb 
 */
function (images, opts, cb) {
  var imageNames = images.map(function (x) { return x.RepoTags[0] });
  var containers = new Containers(createDocker(defaultOpts));
  logEvents(containers);

  runContainers(containers, opts, imageNames, cb);
}

exports.runGroup = 

/**
 * todo: fix, doc and expose
 * 
 * @name 
 * @function
 * @private
 * @param group 
 * @param opts 
 */
function (group, opts) {
  var images = new Images(createDocker(defaultOpts));
  images.listGroup(group, function (err, res) {
    if (err) return console.error(err);

    runImages(res, opts, function (err, res) {
      if (err) return console.error(err);
      console.log(res);    
    })
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

// Test
function createImages() {

  var path = require('path') 
    , dockerifyRepo = require('dockerify-github-repo')

  var group = 'bmarkdown';

  function filter(tag) {
    var num = parseInt(tag.split('-')[0], 10);
    return num > 8;
  }

  dockerifyRepo(
      'thlorenz/browserify-markdown-editor'
    , { filter: filter, dockerify: {  dockerfile: path.join(__dirname, 'examples', 'Dockerfile') } }
    , function (err, streamfns) {
        if (err) return console.error(err);
        exports(streamfns,{ group: group }, function (err, res) {
          if (err) return console.error(err);
          console.log(res);
        });
      }
  );
}

if (!module.parent && typeof window === 'undefined') {
  var containerOpts = xtend(defaultContainerOpts, { exposePort: 3000 });
  createImages();
  // TODO: port forwarding broken, needs to look like this:
  // 9186065b0292        bmarkdown:009-improved-styling   bash About a minute ago   Up About a minute   0.0.0.0:49222->3000/tcp   high_davinci
  //createContainersForGroup('bmarkdown', containerOpts);
}
