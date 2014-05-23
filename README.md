# spinup-tarstreams

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
<td class="description last"><p>(default: <code>'info'</code>) if set logs will be written to <code>stderr</code> (@see dockops:logEvents)</p></td>
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
<td class="description last"><p>when finished, calls back with <strong>all</strong> currently running containers for the given group or with an error</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/index.js">index.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/index.js#L38">lineno 38</a>
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
<th>Argument</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>exposePort</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="attributes">
</td>
<td class="description last"><p>port to expose from the running docker process, the needed port bindings are set up as well</p></td>
</tr>
<tr>
<td class="name"><code>hostPortStart</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>each docker container binds the exposed port to a host port starting at this port</p></td>
</tr>
<tr>
<td class="name"><code>removeExisting</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>(default: <code>true</code>) if <code>true</code> all existing containers for the groups the images belong to are stopped and removed before new ones are created</p></td>
</tr>
<tr>
<td class="name"><code>create</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="attributes">
</td>
<td class="description last"><p>container creation options passed to dockerode</p></td>
</tr>
<tr>
<td class="name"><code>start</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="attributes">
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
<td class="description last"><p>called back when all containers were created or with an error if it failed</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/run-containers.js">lib/run-containers.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/lib/run-containers.js#L39">lineno 39</a>
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
<td class="description last"><p>when finished, calls back with <strong>all</strong> currently running containers for the group or with an error</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/index.js">index.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/index.js#L105">lineno 105</a>
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
<td class="description last"><p>instance of initialized <code>{dockops.Containers}</code></p></td>
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
<a href="https://github.com/thlorenz/spinup-tarstreams/blob/master/index.js#L89">lineno 89</a>
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
