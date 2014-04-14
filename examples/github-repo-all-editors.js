'use strict';

var path          = require('path')
  , dockerifyRepo = require('dockerify-github-repo')
  , spinup        = require('../')

var group = 'bmarkdown';

// we get a tar stream for each tagged release of thlorenz/browserify-markdown-editor
// and launch a docker container for each to be able to inspect multiple versions of it 
dockerifyRepo(
    'thlorenz/browserify-markdown-editor'
  , { dockerify: {  dockerfile: path.join(__dirname, 'Dockerfile') } }
  , function (err, streamfns) {
      if (err) return console.error(err);
      launch(group, streamfns)
  }
);

function launch(group, streamfns) {
  spinup(streamfns, { group: group, loglevel: 'verbose', container: { exposePort: 3000 } }, function (err, res) {
    if (err) return console.error(err);
    console.log('The following containers are now running for group ', group);
    console.log(res);
  });
}
