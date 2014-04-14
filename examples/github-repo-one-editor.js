'use strict';

var path = require('path') 
  , dockerifyRepo = require('dockerify-github-repo')
  , spinup = require('../')

var group = 'bmarkdown';

function filter(tag) {
  var num = parseInt(tag.split('-')[0], 10);
  return num === 9;
}

dockerifyRepo(
    'thlorenz/browserify-markdown-editor'
  , { filter: filter, dockerify: {  dockerfile: path.join(__dirname, 'Dockerfile') } }
  , function (err, streamfns) {
      if (err) return console.error(err);
      launch(group, streamfns)
  }
);

function launch(group, streamfns) {
  spinup(streamfns, { group: group, loglevel: 'silly', container: { exposePort: 3000 } }, function (err, res) {
    if (err) return console.error(err);
    console.log('The following containers are now running for group ', group);
    console.log(res);
  });
}
