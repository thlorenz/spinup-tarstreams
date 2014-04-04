'use strict';

var util         = require('util')
  , EE           = require('events').EventEmitter
  , stringifyMsg = require('./stringify-msg')

function inspect(obj, depth) {
  require('util').inspect(obj, false, depth || 5, true);
}

module.exports = Images; 

function Images(docker) {
  if (!(this instanceof Images)) return new Images(docker);

  this.docker = docker;
}

util.inherits(Images, EE);
 
var proto = Images.prototype;

proto.buildStream = function (tarStream, image, cb) {
  var self = this;

  self.docker.buildImage(
      tarStream
    , { t: image }
    , function (err, res) {
        if (err) return cb(err);
        res
          .on('error', cb)
          .on('end', cb)
          // TODO: make progress show nicer i.e. move cursor
          .on('data', function (d) { self.emit('debug', stringifyMsg(d)) });
      }
  );
}

proto.build = function (tarStream, image, cb) {
  var self = this;

  self.emit('debug', 'building', image);

  // some of these events are only emitted by streams that have been dockerified
  // @see https://github.com/thlorenz/dockerify
  tarStream
    .on('error', cb)
    .on('entry', function (x) { 
      self.emit('info', 'processing', inspect(x)) 
    })
    .on('data', function (x) { 
      self.emit('info', 'processing', inspect(x)) 
    })
    .on('overriding-dockerfile', function (x) { 
      self.emit('debug', 'overriding existing dockerfile') 
    })
    .on('existing-dockerfile', function (x) { 
      self.emit('debug', 'using dockerfile found inside the tarball instead of the one provided, use opts.override:true to change that') 
    })
    .on('info', self.emit.bind('info'))
    .on('debug', self.emit.bind('debug'))
    .on('end', function () {
      self.emit('info', 'built', image);
    });

  self.buildStream(tarStream, image, cb);
}
