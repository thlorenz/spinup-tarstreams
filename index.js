'use strict';

var path         = require('path')
  , log          = require('npmlog')
  , runnel       = require('runnel')
  , dockerode    = require('dockerode')
  , xtend        = require('xtend')
  , logEvents    = require('./lib/log-events')
  , Images       = require('./lib/images')
  , Containers   = require('./lib/containers')
  , portBindings = require('./lib/port-bindings')

var si = typeof setImmediate === 'function' ? setImmediate : function (fn) { setTimeout(fn, 0) };

function createDocker(opts) {
  var dockerhost = opts.dockerhost
    , parts      = dockerhost.split(':')
    , host       = parts.slice(0, -1).join(':').replace(/^tcp/, 'http')
    , port       = parts[parts.length - 1]

  return dockerode({ host: host, port: port });
}

// images
function imageName(group, id) {
  return group + ':' + id;
}

function inspect(obj, depth) {
  return require('util').inspect(obj, false, depth || 5, true);
}

function buildImages(images, streamfns, group, useExisting, cb) {
  if (!useExisting) return build(streamfns, cb);

  images.listGroup(group, function (err, res) {
    if (err) return cb(err);

    var existingImageTags = res.map(function (x) { 
      return images.deserializeImageName(x.RepoTags[0]).tag 
    })

    inspect(streamfns);

    var tobuild = Object.keys(streamfns)
      .filter(function (k) { return !~existingImageTags.indexOf(k) })
      .reduce(function (acc, k) { 
        acc[k] = streamfns[k];
        return acc;
      }, {})

    log.info('images', 'Only building not yet existing images');
    build(tobuild, cb);
  })

  function build(fns, built) {
    var keys = Object.keys(fns);
    if (!keys.length) { 
      log.warn('images', 'No images need to be built');
      return si(built.bind(null, null, []));
    }

    log.info('images', 'building images', keys);

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

// containers
function runContainers(containers, opts, imageNames, cb) {
  var created = {};

  var tasks = imageNames
    .map(function (imageName, idx) {
      return function (cb_) {
        var pb = {};

        // ensure we expose port properly as well as binding it 
        if (opts.exposePort && opts.create) {
          pb = portBindings(opts.exposePort, opts.hostPortStart + idx);
          opts.create.ExposedPorts = opts.create.ExposedPorts || {};
          opts.create.ExposedPorts[opts.exposePort + '/tcp'] = {};
        }

        containers.run({ 
            create : xtend(opts.create, { Image : imageName })
          , start  : xtend(opts.start, { PortBindings: pb })
          }
        , function (err, container) { 
            if (err) return cb_(err);
            created[container.id] = { 
                container : container
              , image     : imageName
              , ports     : {
                    exposed : opts.exposePort
                  , host    : opts.hostPortStart + idx
                }
            }
            cb_() 
          }
        );
      }
    })

  runnel(tasks.concat(function (err) {
    if (err) return cb(err);
    cb(null, created);  
  }))
}

var defaultOpts = {
    dockerhost        : process.env.DOCKER_HOST || 'tcp : //127.0.0.1 : 4243'
  , group             : 'ungrouped'
  , useExistingImages : true
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

exports = module.exports = function (streamfns, opts, cb) {
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

exports.buildImages = buildImages;

var runImages = exports.runImages = function (images, opts, cb) {
  var imageNames = images.map(function (x) { return x.RepoTags[0] });
  var containers = new Containers(createDocker(defaultOpts));
  logEvents(containers);

  runContainers(containers, opts, imageNames, cb);
}

exports.runGroup = function (group, opts) {
  var images = new Images(createDocker(defaultOpts));
  images.listGroup(group, function (err, res) {
    if (err) return console.error(err);

    runImages(res, opts, function (err, res) {
      if (err) return console.error(err);
      console.log(res);    
    })
  });
}

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
