# spinup-tarstreams [![build status](https://secure.travis-ci.org/thlorenz/spinup-tarstreams.png)](http://travis-ci.org/thlorenz/spinup-tarstreams)

Spins up tar streams each in it's own docker container.

```js
var path          = require('path')
  , dockerifyRepo = require('dockerify-github-repo')
  , spinup        = require('spinup-tarstreams')

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
    console.log('Started the following containers: ', res);
  });
}
```

[full exampe](https://github.com/thlorenz/spinup-tarstreams/blob/master/examples/github-repo-all-editors.js)

## Status

Working, but **has no tests** and therefore considered alpha **USE AT YOUR OWN RISK**.


## Installation

    npm install spinup-tarstreams

## API

<!-- START docme generated API please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN docme TO UPDATE -->

<div>
<div class="jsdoc-githubify">
<section>
<article>
<div class="container-overview">
<dl class="details">
</dl>
</div>
<dl>
<dt>
<h4 class="name" id="spinupTarstreams"><span class="type-signature"></span>spinupTarstreams<span class="signature">(streamfns, <span class="optional">opts</span>, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Creates images for each provided tar stream and then starts a container for each image that matches the given group.</p>
<p>This means that containers for already existing images can be started as well in order to allow
reusing existing images instead of having to rebuild them for each run.</p>
<p>Containers are exposing the provided port and bind it to a unique port on the host machine.</p>
<p>This is the only API you will need most likely, <strong>all other functions are considered advanced API</strong>.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Argument</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>streamfns</code></td>
<td class="type">
<span class="param-type">Array.&lt;function()></span>
</td>
<td class="attributes">
</td>
<td class="description last"><p>functions that return a tar stream each</p></td>
</tr>
<tr>
<td class="name"><code>opts</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>options that describe how each image and container is created and started</p>
<h6>Properties</h6>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Argument</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>loglevel</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>(default: <code>'info'</code>) if set logs will be written to <code>stderr</code> (@see spinupTarstreams:logEvents)</p></td>
</tr>
<tr>
<td class="name"><code>container</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>options that describe how each container is created and started (@see spinupTarstreams::runContainers)</p></td>
</tr>
<tr>
<td class="name"><code>dockerhost</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>(default: <code>$DOCKER_HOST or 'tcp://127.0.0.1:4243'</code>) the host that docker is running on</p></td>
</tr>
<tr>
<td class="name"><code>group</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>(default: <code>'ungrouped'</code>) the group aka REPOSITORY to which the add the created images and whose containers to start</p></td>
</tr>
<tr>
<td class="name"><code>useExistingImages</code></td>
<td class="type">
<span class="param-type">boolean</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>(default: <code>true</code>) if false all images are created, even if one for the group and tag exists</p></td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="attributes">
</td>
<td class="description last"><p>called back when all images were created or with an error</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/index.js">index.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/index.js#L49">lineno 49</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="spinupTarstreams::buildImages"><span class="type-signature"></span>spinupTarstreams::buildImages<span class="signature">(images, streamfns, group, useExisting, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Builds an image for each <code>streamfn</code> for the given configuration.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>images</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="description last"><p>instance of initialized <code>{Images}</code>, it is also used to emit progress events over</p></td>
</tr>
<tr>
<td class="name"><code>streamfns</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="description last"><p>functions returning tar streams hashed by tag name</p></td>
</tr>
<tr>
<td class="name"><code>group</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>group for which to build images (i.e. repo name)</p></td>
</tr>
<tr>
<td class="name"><code>useExisting</code></td>
<td class="type">
<span class="param-type">boolean</span>
</td>
<td class="description last"><p>(default: true) if false existing all images will be built even if one for group and tag exists</p></td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back with error or an array of images that were built</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/build-images.js">lib/build-images.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/build-images.js#L13">lineno 13</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="spinupTarstreams::Containers"><span class="type-signature"></span>spinupTarstreams::Containers<span class="signature">(docker)</span><span class="type-signature"> &rarr; {Object}</span></h4>
</dt>
<dd>
<div class="description">
<p>Creates a new containers instance that will use the given docker instance to communicate with docker.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>docker</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="description last"><p>dockerode instance to communicate with docker</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/containers.js">lib/containers.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/containers.js#L16">lineno 16</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>initialized containers</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Object</span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="spinupTarstreams::Containers::activePorts"><span class="type-signature"></span>spinupTarstreams::Containers::activePorts<span class="signature">(cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Lists all running containers by the ports they expose.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back with list of containers hashed by their port number</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/containers.js">lib/containers.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/containers.js#L216">lineno 216</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="spinupTarstreams::Containers::clean"><span class="type-signature"></span>spinupTarstreams::Containers::clean<span class="signature">(id, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Stops and/or kills and then removes a container.</p>
<p>Heavy machinery clean operation.
It was useful when running on arch with docker not always working as promised.
This may not be needed anymore as docker got more stable.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>id</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>container id</p></td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back after container was cleaned or maximum attempts were exceeded</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/containers.js">lib/containers.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/containers.js#L89">lineno 89</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="spinupTarstreams::Containers::create"><span class="type-signature"></span>spinupTarstreams::Containers::create<span class="signature">(opts, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Creates a docker container according to given opts.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>opts</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="description last"><p>creation options passed to dockerode</p></td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back when container was created</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/containers.js">lib/containers.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/containers.js#L34">lineno 34</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="spinupTarstreams::Containers::list"><span class="type-signature"></span>spinupTarstreams::Containers::list<span class="signature">(all, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Lists docker containers.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>all</code></td>
<td class="type">
<span class="param-type">boolean</span>
</td>
<td class="description last"><p>if true, all containers are listed</p></td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back with list of containers</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/containers.js">lib/containers.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/containers.js#L155">lineno 155</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="spinupTarstreams::Containers::list"><span class="type-signature"></span>spinupTarstreams::Containers::list<span class="signature">(cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Lists all docker containers.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back with list of containers</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/containers.js">lib/containers.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/containers.js#L171">lineno 171</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="spinupTarstreams::Containers::listRunning"><span class="type-signature"></span>spinupTarstreams::Containers::listRunning<span class="signature">(cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Lists all running docker containers</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back with list of running containers</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/containers.js">lib/containers.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/containers.js#L199">lineno 199</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="spinupTarstreams::Containers::listStopped"><span class="type-signature"></span>spinupTarstreams::Containers::listStopped<span class="signature">(cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Lists all stopped docker containers</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back with list of stopped containers</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/containers.js">lib/containers.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/containers.js#L182">lineno 182</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="spinupTarstreams::Containers::removeStopped"><span class="type-signature"></span>spinupTarstreams::Containers::removeStopped<span class="signature">(cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Removes all stopped containers.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back when all stopped containers where removed.</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/containers.js">lib/containers.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/containers.js#L240">lineno 240</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="spinupTarstreams::Containers::run"><span class="type-signature"></span>spinupTarstreams::Containers::run<span class="signature">(opts, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Creates and starts a container.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>opts</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="description last"><p>container creation and start options</p>
<h6>Properties</h6>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Argument</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>create</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="attributes">
</td>
<td class="description last"><p>creation options passed to dockerode</p></td>
</tr>
<tr>
<td class="name"><code>start</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="attributes">
</td>
<td class="description last"><p>start options passed to <code>container.start</code></p></td>
</tr>
<tr>
<td class="name"><code>startRetries</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>(default: 0) determines how many times we retry to start the container in case it fails</p></td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called when the container was started - with an error if it failed</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/containers.js">lib/containers.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/containers.js#L53">lineno 53</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="spinupTarstreams::Images"><span class="type-signature"></span>spinupTarstreams::Images<span class="signature">(docker)</span><span class="type-signature"> &rarr; {Object}</span></h4>
</dt>
<dd>
<div class="description">
<p>Creates a new images instance that will use the given docker instance to communicate with docker.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>docker</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="description last"><p>dockerode instance to communicate with docker</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/images.js">lib/images.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/images.js#L13">lineno 13</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>initialized images</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Object</span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="spinupTarstreams::Images::build"><span class="type-signature"></span>spinupTarstreams::Images::build<span class="signature">(tarStream, image, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Builds an image from the stream provided.
All intermediate containers are removed after the image was created.</p>
<p>All events from the tar stream are re-emitted, especially useful if it was created with dockerify.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>tarStream</code></td>
<td class="type">
<span class="param-type">Stream</span>
</td>
<td class="description last"><p>the tar stream that contains the project files and a <code>Dockerfile</code></p></td>
</tr>
<tr>
<td class="name"><code>image</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>then name under which to tag the created image</p></td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back when image is created or with an error if one occurred</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/images.js">lib/images.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/images.js#L64">lineno 64</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="spinupTarstreams::Images::buildStream"><span class="type-signature"></span>spinupTarstreams::Images::buildStream<span class="signature">(tarStream, image, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Builds an image from the stream provided.
All intermediate containers are removed after the image was created.</p>
<p>Note: if you want all events from the tar stream to be propagated, i.e. if it was created with dockerify, use <code>build</code> instead.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>tarStream</code></td>
<td class="type">
<span class="param-type">Stream</span>
</td>
<td class="description last"><p>the tar stream that contains the project files and a <code>Dockerfile</code></p></td>
</tr>
<tr>
<td class="name"><code>image</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>then name under which to tag the created image</p></td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back when image is created or with an error if one occurred</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/images.js">lib/images.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/images.js#L31">lineno 31</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="spinupTarstreams::Images::deserializeImageName"><span class="type-signature"></span>spinupTarstreams::Images::deserializeImageName<span class="signature">(name)</span><span class="type-signature"> &rarr; {Object}</span></h4>
</dt>
<dd>
<div class="description">
<p>Deserializes the given image name into an object.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>name</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>the name of the image, expected to be in the format: <code>'group:tag'</code>.</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/images.js">lib/images.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/images.js#L103">lineno 103</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>object of the format: <code>{ group: 'group', tag: 'tag' }</code></p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Object</span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="spinupTarstreams::Images::list"><span class="type-signature"></span>spinupTarstreams::Images::list<span class="signature">(cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Lists docker images.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back with list of images</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/images.js">lib/images.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/images.js#L118">lineno 118</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="spinupTarstreams::Images::listGroup"><span class="type-signature"></span>spinupTarstreams::Images::listGroup<span class="signature">(group, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Lists docker images for given group.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>group</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>name of teh group of images to list</p></td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back with list of images</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/images.js">lib/images.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/images.js#L129">lineno 129</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="spinupTarstreams::logEvents"><span class="type-signature"></span>spinupTarstreams::logEvents<span class="signature">(events, level)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Logs events emitted with npm log at the given level.</p>
<p><code>debug</code> events are logged as <code>verbose</code>.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>events</code></td>
<td class="type">
<span class="param-type">EventEmitter</span>
</td>
<td class="description last"><p>events that should be logged</p></td>
</tr>
<tr>
<td class="name"><code>level</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>(default: verbose) level of logging <code>error|warn|info|verbose|silly</code></p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/log-events.js">lib/log-events.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/log-events.js#L7">lineno 7</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="spinupTarstreams::runContainers"><span class="type-signature"></span>spinupTarstreams::runContainers<span class="signature">(containers, opts, imageNames, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Creates and starts containers for the given images according to the options.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>containers</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="description last"><p>instance of initialized <code>{Containers}</code></p></td>
</tr>
<tr>
<td class="name"><code>opts</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="description last"><p>options that describe how each container is created and started</p>
<h6>Properties</h6>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>exposePort</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="description last"><p>port to expose from the running docker process, the needed port bindings are set up as well</p></td>
</tr>
<tr>
<td class="name"><code>hostPortStart</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="description last"><p>each docker container binds the exposed port to a host port starting at this port</p></td>
</tr>
<tr>
<td class="name"><code>create</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="description last"><p>container creation options passed to dockerode</p></td>
</tr>
<tr>
<td class="name"><code>start</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="description last"><p>container start options passed to dockerode's <code>container.start</code></p></td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
<td class="name"><code>imageNames</code></td>
<td class="type">
<span class="param-type">Array.&lt;string></span>
</td>
<td class="description last"><p>names of all images, in form <code>'group:tag'</code> that were added to docker before for which to run a container</p></td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back with an error or a list of created containers</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/run-containers.js">lib/run-containers.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/run-containers.js#L9">lineno 9</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="spinupTarstreams::runGroup"><span class="type-signature"></span>spinupTarstreams::runGroup<span class="signature">(images, containers, group, <span class="optional">containerOpts</span>, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Starts up a container for each image of the given group that is found.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Argument</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>images</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="attributes">
</td>
<td class="description last"><p>instance of initialized <code>{Images}</code></p></td>
</tr>
<tr>
<td class="name"><code>containers</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="attributes">
</td>
<td class="description last"><p>instance of initialized <code>{Containers}</code></p></td>
</tr>
<tr>
<td class="name"><code>group</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="attributes">
</td>
<td class="description last"><p>group of images for which to start containers</p></td>
</tr>
<tr>
<td class="name"><code>containerOpts</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>options that describe how each container is created and started (@see spinupTarstreams::runContainers)</p></td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="attributes">
</td>
<td class="description last"><p>called back when all containers for the group were started or with an error</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/index.js">index.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/index.js#L117">lineno 117</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="spinupTarstreams::runImages"><span class="type-signature"></span>spinupTarstreams::runImages<span class="signature">(containers, imagesToRun, <span class="optional">containerOpts</span>, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Starts up a container for each given image.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Argument</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>containers</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="attributes">
</td>
<td class="description last"><p>instance of initialized <code>{Containers}</code></p></td>
</tr>
<tr>
<td class="name"><code>imagesToRun</code></td>
<td class="type">
<span class="param-type">Array.&lt;string></span>
</td>
<td class="attributes">
</td>
<td class="description last"><p>names of images to run of the form <code>'group:tag'</code></p></td>
</tr>
<tr>
<td class="name"><code>containerOpts</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>options that describe how each container is created and started (@see spinupTarstreams::runContainers)</p></td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="attributes">
</td>
<td class="description last"><p>called back when all containers for the images were started or with an error</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/index.js">index.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/index.js#L101">lineno 101</a>
</li>
</ul></dd>
</dl>
</dd>
</dl>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->

## License

MIT
