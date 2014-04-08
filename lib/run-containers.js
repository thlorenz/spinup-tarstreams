'use strict';

var xtend        = require('xtend')
  , runnel       = require('runnel')
  , portBindings = require('./port-bindings')

var go = module.exports = 

/**
 * Creates and starts containers for the given images according to the options.
 * 
 * @name spinupTarstreams::runContainers
 * @function
 * @param {Object} containers         instance of initialized `{Containers}`
 * @param {Object} opts               options that describe how each container is created and started
 * @param {Object} opts.exposePort    port to expose from the running docker process, the needed port bindings are set up as well 
 * @param {Object} opts.hostPortStart each docker container binds the exposed port to a host port starting at this port 
 * @param {Object} opts.create        container creation options passed to dockerode
 * @param {Object} opts.start         container start options passed to dockerode's `container.start`
 * @param {Array.<string>} imageNames names of all images, in form `'group:tag'` that were added to docker before for which to run a container
 * @param {function} cb               called back with an error or a list of created containers
 */
function runContainers(containers, opts, imageNames, cb) {
  var created = {};

  if (!imageNames.length) return cb(null, []);

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

