'use strict';

var xtend   = require('xtend')
  , runnel  = require('runnel')
  , dockops = require('dockops')

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

function run(containers, opts, imageNames, cb) {
  var tasks = imageNames
    .map(function (imageName, idx) {
      return function (cb_) {
        var pb = {}, hostPort = null;
        if (opts.hostPortStart) hostPort = opts.hostPortStart + idx;

        // ensure we expose port properly as well as binding it 
        if (opts.exposePort && opts.create) {
          pb = dockops.portBindings(opts.exposePort, hostPort);
        }

        containers.run({ 
              create : xtend(opts.create, { Image : imageName, ExposedPorts: pb })
            , start  : xtend(opts.start, { PortBindings: pb })
            }
          , function (err, cont) {
              cb_(err);     
            }
        );
      }
    })

  runnel(tasks.concat(cb));
}

var go = module.exports = 

/**
 * Creates and starts containers for the given images according to the options.
 * 
 * @name spinupTarstreams::runContainers
 * @function
 * @param {Object} containers         instance of initialized `{Containers}`
 * @param {Object} opts               options that describe how each container is created and started
 * @param {Object} opts.exposePort    port to expose from the running docker process, the needed port bindings are set up as well 
 * @param {Object=} opts.hostPortStart each docker container binds the exposed port to a host port starting at this port 
 * @param {Object=} opts.removeExisting (default: `true`) if `true` all existing containers for the groups the images belong to are stopped and removed before new ones are created
 * @param {Object} opts.create        container creation options passed to dockerode
 * @param {Object} opts.start         container start options passed to dockerode's `container.start`
 * @param {Array.<string>} imageNames names of all images, in form `'group:tag'` that were added to docker before for which to run a container
 * @param {function} cb               called back when all containers were created or with an error if it failed
 */
function runContainers(containers, opts, imageNames, cb) {
  if (!imageNames.length) return cb(null, []);
  if (opts.removeExisting === false) return run(containers, opts, imageNames, cb);

  var groups = imageNames.map(function (x) { 
    var info = dockops.Images.deserializeImageName(x);
    return info ? info.group : 'ungrouped';
  })

  var tasks = groups.map(function (x) {
    return function (cb_) { containers.stopRemoveGroup(x, cb_) }
  })

  runnel(tasks.concat(run.bind(null, containers, opts, imageNames, cb)));
}

