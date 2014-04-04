'use strict';
var runnel    = require('runnel')
  , dockerode = require('dockerode')
  , xtend     = require('xtend')
  , logEvents = require('./lib/log-events')
  , Images    = require('./lib/images')

function imageName(group, id) {
  return group + ':' id;
}

function buildImages(images, streamfns, opts, cb) {
  var tasks = Object.keys(streamfns)
    .map(function (k) {
      var image = imageName(opts.group, k)
        , streamfn = streamfns[k];

      return function (cb_) {
        images.build(streamfn(), image, cb_);
      }
    });

  runnel(tasks.concat(cb));
}

function createDocker(opts) {
  var dockerhost = opts.dockerhost 
    , parts      = dockerhost.split(':')    
    , host       = parts.slice(0, -1).join(':').replace(/^tcp/, 'http')
    , port       = parts[parts.length - 1]

  return dockerode({ host: host, port: port });
}

var defaultOpts = { 
    dockerhost: process.env.DOCKER_HOST || 'tcp://127.0.0.1:4243'
  , group: 'ungrouped' 
};


  /*images
    .on('processing' , function (info) { log.silly  ('images', 'processing\n', inspect(info)); })
    .on('building'   , function (info) { log.verbose('images', 'building\n', inspect  (info)); })
    .on('built'      , function (info) { log.info   ('images', 'built\n', inspect     (info)); })
    .on('msg'        , function (msg)  { log.silly  ('images', 'msg', msg); })
    .on('warn'       , function (err)  { log.warn   ('images', 'warn', err); })
    .on('error'      , function (err)  { log.error  ('images', 'error', err); });*/

var go = module.exports = function (streamfns, opts) {
  opts = xtend(defaultOpts, opts);
  opts.docker = opts.docker || createDocker(opts)

  var images = new Images(opts.docker);
  logEvents(images);

  buildImages(images, streamfns, opts, function (err, res) {
    if (err) return console.error(err);
    console.log(res);  
  });
}

// create container for each

// provide way to query for all containers/images for a given repo

// provide a way to stop all containers for a matching group (i.e. repo name) 

// provide a way to remove all containers for a group

// provide a way to remove all images for a group

// Test
if (!module.parent && typeof window === 'undefined') {
  
}
