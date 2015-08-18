# DOPS React

## THIS REPO IS DEPRECATED

This approach has been abandoned in favour of one which separates (S)CSS from components while still allowing full componentisation of style and javascription, using Webpack text extraction. We will open source the new components when they're ready for public consumption, but in the meantime this repo is left here in case it's useful to others wishing to pursue the inline style approach (which is still great! but didn't work for all the internal users of this library).

Also, gulp and webpack are amazing, just FYI.

## TL/DR

A bunch of useful, opinionated React components that include their own styling and try to do the "right thing" on mobile and desktop browsers.

### [Check out the live demo](http://automattic.github.io/dops-react/demo.html)

```bash
npm install dops-react --save-dev
```

In your code (let's imagine you've built a Facebook and Twitter history browser):

```jsx
var Card = require('@automattic/dops-react/js/components/card'),
	Tabs = require('@automattic/dops-react/js/components/tabs'),
	TweetHistory = require('./tweet-history'),
	FacebookHistory = require('./facebook-history');

render: function() {
	return (
      	<Card title="Welcome to my UI">
			<Card.Section title="Explanation">
				This is a section of my UI
			</Card.Section>

			<Card.Section>
				{this._hasDetails() ? 
					(this._renderDetails()) : 
					(this._renderNoDetails())
				}
			</Card.Section>

			{this._hasHistory() && (
				<Card.Section>
					<Tabs layout="vertical">
						<Tabs.Panel title="Tweet History">
							<TweetHistory tweets={this.props.tweets}/>
						</Tabs.Panel>
						<Tabs.Panel title="Facebook History">
							<RefundHistory posts={this.props.facebook_posts}/>
						</Tabs.Panel>
					</Tabs>
				</Card.Section>	
			)}				
		</Card>
	)
}
```

## What is this?

*A collection of React components extracted from various Automattic services*

This project is a set of useful components extracted from some projects inside Automattic. It's open sourced in the hope that these are useful to others.

To see all the components in action, just clone this repo locally and open "demo.html".

Some of the components already implemented:

* alert-box for pop-down confirmations
* password-box for a password field that can show its value (great for listing keys)
* timeout-transition-group (forked from Khan Academy's great ["React components" project](https://github.com/Khan/react-components)) for CSS animation of React DOM nodes
* "cards" for nice layout of admin boxes
* form components based on the awesome [Formsy](https://github.com/christianalfoni/formsy-react)
* pure-CSS smiley face :)
* various layout components - columns and flexbox.
* a slider
* icons based on [Genericons](http://github.com/Automattic/Genericons)
* ... and more to come!

Development features:

* grunt-based workflow builds CSS and JS bundles for you automatically
* ReactJS makes it easy to build composable, comprehensible components
* jshint automatically catches your Javascript style errors
* livereload pushes style and JS changes to the browser without reloads

## Project Status

This project should be considered pre-alpha. It hasn't been used anywhere in production yet, the projects it depends on are in active development, and it doesn't yet have any tests.

That said - all help and comments welcome!

## Requirements

A working `npm` and `grunt` development environment.

A relatively recent version of jQuery (could be tempted to remove this).

Include js/ie-shims.js in your app if you need IE8 support.

```javascript
require('@automattic/dops-react/js/ie-shims');
```

The "Open Sans" font is recommended, but we fall back to the usual Arial/Helvetica/etc fonts. You can include it like this:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,400,300,600" type="text/css" media="all"/>
```

For the <Icon> component, we require that you've included a link to the "[Genericons](https://github.com/Automattic/Genericons)" font definition. Here's a couple of ways to do that:

### Option 1: Link to the CDN'd version of Genericons

A good idea for production, unless you have another CDN you'd prefer.

```html
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/genericons/3.3/genericons/genericons.css" />
```

### Option 2: Link to the node-packaged version of Genericons

Good for local development/prototyping.

```html
<link rel="stylesheet" type="text/css" href="./node_modules/genericons/genericons/genericons.css" />
```

### Option 3: @import into your own stylesheet definitions

Left as an exercise to the reader.

## Building

The javascript bundle is built using the 'Grunt' build tool. It's a bit like `make`, but written in javascript.

Installing grunt and dependencies:

```bash
brew install npm
npm install -g grunt grunt-cli
npm install
```

Building the JS bundle:

```bash
grunt browserify
```

Or, you can just run `grunt` without any arguments and it will watch for file changes and rebuild the bundle automatically, or `grunt browserify:app` to just rebuild the app JS. Note that in `watch` mode Grunt will automatically run jshint on your code and fail with errors if you have common coding problems (e.g. using undeclared variables).

Thanks to livereload, any changes to the JS/JSX/SCSS files will automatically reload the app in the browser provided you're running `grunt watch` (or just `grunt`). This makes iterating much faster.

## Editing styles

All styles are specified using Inline CSS and enhanced using the excellent `[Radium](https://github.com/FormidableLabs/radium)` library.

## CSS Gotchas

While this toolkit uses inline css almost exclusively, there are two exceptions:

* the icons (see above)
* some basic resets, such as box-sizing and default margins/padding
* animations that rely on class transitions

For the latter two we've created a "Reset" element which you can use to wrap your top-level component. This inserts a scoped `<style>` element inline that resets only the contents of that container. It does this by scoping with a  randomly-generated ID.

```jsx
render: function() {
	return (
      <Reset>
        ... the rest of my code goes here ...
      </Reset>
	)
}
```

Hopefully we'll have a cleaner solution for that at some point soon, but it got us past a hump :)

## Demo

Open [demo.html](https://github.com/Automattic/dops-react/blob/gh-pages/demo.html) to see sample code and demos of the components. Please feel free to add/update this!

Injecting React components into the browser as both readable code and running javascript required a bit of hackery (dynamic browserify! dynamic jsx! hooray!), which is why the demo files are called "`foo.jsxdemo`" and are all in the `client/demo` directory, hanging off `demo.jsx`. See that file for the extension points; hopefully it's self-explanatory when you look at it.

## Running tests

TODO - no tests yet GIANT FROWNY FACE.

## Publishing the [demo site](http://automattic.github.io/dops-react/demo.html)

```bash
grunt gh-pages
```

## Authors

@eoigal @gravityrail

## Additional Credits

There's a number of open source React components that I would like to have linked to directly but which didn't quite work the way I needed to, so I rewroute them to fit this framework. Credits follow:

Slider implementation borrowed from https://github.com/mpowaga/react-slider (MIT-licensed)

Codemirror implementation (for demo.html) inspired by: 

* https://github.com/facebook/react/blob/master/docs/_js/live_editor.js#L16
* https://github.com/facebook/react/blob/master/src/browser/ui/dom/components/ReactDOMInput.js

(BSD-licensed)

Timeout Transition Group inspired by https://github.com/Khan/react-components/blob/master/js/timeout-transition-group.jsx (MIT-licensed)

Flexbox implementation inspired by https://github.com/tcoopman/react-flexbox (MIT-licensed)

Thank you to all those amazing Open Source contibutions that allowed me to create this library of components in a reasonable amount of time.
