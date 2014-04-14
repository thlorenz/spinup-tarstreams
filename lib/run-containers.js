'use strict';

var xtend        = require('xtend')
  , runnel       = require('runnel')
  , portBindings = require('dockops').portBindings

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
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
 * @param {Object=} opts.removeExisting (default: `true`) if `true` all existing containers for the group are stopped and removed before new ones are created
 * @param {Object} opts.create        container creation options passed to dockerode
 * @param {Object} opts.start         container start options passed to dockerode's `container.start`
 * @param {Array.<string>} imageNames names of all images, in form `'group:tag'` that were added to docker before for which to run a container
 * @param {function} cb               called back when all containers were created or with an error if it failed
 */
function runContainers(containers, opts, imageNames, cb) {
  if (!imageNames.length) return cb(null, []);

  // TODO: remove existing containers for group by default
  var tasks = imageNames
    .map(function (imageName, idx) {
      return function (cb_) {
        var pb = {}, hostPort = null;
        if (opts.hostPortStart) hostPort = opts.hostPortStart + idx;
        inspect({ opts: opts, hostPort: hostPort});

        // ensure we expose port properly as well as binding it 
        if (opts.exposePort && opts.create) {
          pb = portBindings(opts.exposePort, hostPort);
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

