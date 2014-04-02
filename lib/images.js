'use strict';

var util         = require('util')
  , EE           = require('events').EventEmitter
  , stringifyMsg = require('./stringify-msg')

module.exports = Images; 

function Images(docker) {
  if (!(this instanceof Images)) return new Images(docker);

  this.docker = docker;
}

util.inherits(Images, EE);
 
var proto = Images.prototype;

proto.buildStream = function (tarstream, opts, cb) {
  var self = this;

  self.docker.buildImage(
      tarstream
    , { t: opts.Image }
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

function inspect(obj, depth) {
  require('util').inspect(obj, false, depth || 5, true);
}

proto.build = function (opts, cb) {
  var self = this;
  var tarstream = opts.tarStream;
  delete opts.tarStream;

  self.emit('debug', 'building', inspect(opts));

  tarstream
    .on('error', cb)
    .on('entry', function (x) { 
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
      self.emit('info', 'built', inspect(opts));
    });

  self.buildStream(tarstream, opts, cb);
}
