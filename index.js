'use strict';

var path         = require('path')
  , runnel       = require('runnel')
  , dockerode    = require('dockerode')
  , xtend        = require('xtend')
  , logEvents    = require('./lib/log-events')
  , Images       = require('./lib/images')
  , Containers   = require('./lib/containers')
  , portBindings = require('./lib/port-bindings')

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

function buildImages(images, streamfns, group, cb) {
  var tasks = Object.keys(streamfns)
    .map(function (k) {
      var image = imageName(group, k)
        , streamfn = streamfns[k];

      return function (cb_) {
        images.build(streamfn(), image, cb_);
      }
    });

  runnel(tasks.concat(cb));
}

// containers
function runContainers(containers, opts, imageNames, cb) {
  var created = {};

  // todo: async-reduce
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

        containers.run(
          { create : xtend(opts.create, { Image : imageName })
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
    dockerhost    : process.env.DOCKER_HOST || 'tcp : //127.0.0.1 : 4243'
  , group         : 'ungrouped'
};

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

var go = module.exports = function (streamfns, opts, cb) {
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

  buildImages(images, streamfns, opts.group, function (err, res) {
    if (err) return cb(err);
    cb(null, res);
  });
}

// provide way to query for all containers/images for a given repo

// provide a way to stop all containers for a matching group (i.e. repo name)

// provide a way to remove all containers for a group

// provide a way to remove all images for a group

// Test

var dockerifyRepo = require('dockerify-github-repo');
function filter(tag) {
  return /*tag === '000-nstarted' || */ tag === '009-improved-styling';
}

function createImages() {
  dockerifyRepo(
      'thlorenz/browserify-markdown-editor'
    , { filter: filter, dockerify: {  dockerfile: path.join(__dirname, 'lib', 'Dockerfile') } }
    , function (err, streamfns) {
        if (err) return console.error(err);
        go(streamfns,{ group: 'bmarkdown' }, function (err, res) {
          if (err) return console.error(err);
          console.log(res);
        });
      });
}

function createContainers(images, opts, cb) {
  var imageNames = images.map(function (x) { return x.RepoTags[0] });
  var containers = new Containers(createDocker(defaultOpts));
  logEvents(containers);

  runContainers(containers, opts, imageNames, cb);
}

function createContainersForGroup(group, opts) {
  var images = new Images(createDocker(defaultOpts));
  images.listGroup(group, function (err, res) {
    if (err) return console.error(err);

    createContainers(res, opts, function (err, res) {
      if (err) return console.error(err);
      console.log(res);    
    })
  });
}

if (!module.parent && typeof window === 'undefined') {
  var containerOpts = xtend(defaultContainerOpts, { exposePort: 3000 });
  //createImages();
  // TODO: port forwarding broken, needs to look like this:
  // 9186065b0292        bmarkdown:009-improved-styling   bash About a minute ago   Up About a minute   0.0.0.0:49222->3000/tcp   high_davinci
  createContainersForGroup('bmarkdown', containerOpts);
}
