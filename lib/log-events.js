'use strict';

var log = require('npmlog');

var go = module.exports = function (events, level) {
  log.level = level || 'verbose';
  [ 'error', 'info', 'warn' ].forEach(function (x) { 
    events.on(x, log.bind(log, x))
  });
  events.on('debug', log.bind(log, 'verbose'))
};
