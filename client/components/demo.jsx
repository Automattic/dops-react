/*jshint unused: false*/
var React = require('react'),
	Codemirror = require('./codemirror'),
	Col = require('./col'),
	Reset = require('./reset'),
	styles = require('../styles');

var _demos = [
	{
		title: "Modal",
		description: 'A simple fixed modal which has a close button, title and subtitle, and can be narrow, medium or wide',
		id: "demo-modal",
		js: require('./demo/demo-modal'),
		requires: {
			'./modal': require('./modal')
		}
	},
	{
		title: "Password Box",
		description: "A box which displays an obfuscated password that can be hidden. Great for API keys.",
		id: "demo-password-box",
		js: require('./demo/demo-password-box'),
		requires: {
			'./password-box': require('./password-box')
		}
	},
	{
		title: "Cards",
		description: "Cards are boxes that have a title and sections. The sections can be laid out with the title above ('vertical') or to the side. On small screens, all sections become vertical.",
		id: "demo-card",
		js: require('./demo/demo-card'),
		requires: {
			'./card': require('./card')
		}
	},
	{
		title: "Tabs",
		description: "Vertical or horizontal tabbed panel",
		id: "demo-tabs",
		js: require('./demo/demo-tabs'),
		requires: {
			'./tabs': require('./tabs'),
			'./card': require('./card')
		}
	},
	{
		title: "Alert Box",
		description: "An inline pop-down alert box that can be made alarming-to-look-at by providing status='error'. Good for confirming irreversible actions.",
		id: "demo-alert-box",
		js: require('./demo/demo-alert-box'),
		requires: {
			'./alert-box': require('./alert-box'),
			'./timeout-transition-group': require('./timeout-transition-group')
		}
	},
	{
		title: "Icon",
		description: "A thin wrapper for Genericons, Automattic's open-source icon font for blogs",
		id: "demo-icons",
		js: require('./demo/demo-icon'),
		requires: {
			'./icon': require('./icon')
		}
	},
	{
		title: "HoverIcon",
		description: "Same as the Icon component, but with a tooltip",
		id: "demo-hover-icons",
		js: require('./demo/demo-hover-icon'),
		requires: {
			'./hover-icon': require('./hover-icon')
		}
	},
	{
		title: "Wizard",
		description: "Simple left-right wizard with animated transition and the ability to jump to any step via its API",
		id: "demo-wizard",
		js: require('./demo/demo-wizard'),
		requires: {
			'./wizard': require('./wizard')
		}
	},
	{
		title: "Button",
		description: "Simple button element with 3 sizes and 2 colors.",
		id: "demo-button",
		js: require('./demo/demo-button'),
		requires: {
			'./button': require('./button')
		}
	},
	{
		title: "Form",
		description: "Fairly sophisticated form library that builds on Formsy to provide inline, extensible validation",
		id: "demo-form",
		js: require('./demo/demo-form'),
		requires: {
			'./form': require('./form'),
			'../styles': require('../styles')
		}
	},
	{
		title: "View",
		description: "An implementation of Flexbox. Needs IE10+ and modern versions of Chrome/Firefox/Safari to work correctly. Great for forms!",
		id: "demo-view",
		js: require('./demo/demo-view'),
		requires: {
			'./view': require('./view'),
			'./card': require('./card'),
			'../styles': require('../styles')
		}
	},
	{
		title: "Face",
		description: "A simple pure-CSS face with configurable happiness and size",
		id: "demo-face",
		js: require('./demo/demo-face'),
		requires: {
			'./face': require('./face')
		}
	},
	{
		title: "Slider",
		description: "A slider with a dynamic label",
		id: "demo-slider",
		js: require('./demo/demo-slider'),
		requires: {
			'./slider': require('./slider')
		}
	},
	{
		title: "Progress Bar",
		description: "A simple progress bar",
		id: "demo-progress-bar",
		js: require('./demo/demo-progress-bar'),
		requires: {
			'./progress-bar': require('./progress-bar')
		}
	}
];

var DemoModule = React.createClass({
	propTypes: {
		demo: React.PropTypes.any.isRequired
	},

	styles: {
		wrapper: {
			paddingTop: 40,
			clear: 'both'
		},
		code: {
			maxHeight: 400,
			overflow: 'scroll',
			border: '1px solid #aaa'
		},
		live: {
			padding: 5,
			border: '1px solid #aaa'
		}
	},

	componentWillMount: function () {
		// inject dependencies into the global fake require cache
		Object.keys(this.props.demo.requires).forEach( function( key ) {
			window.Demo.modules[key] = this.props.demo.requires[key];
		}.bind(this));
	},

	render: function() {
		return (
			<div style={this.styles.wrapper}>
				<h1>{this.props.demo.title}</h1>

				<h2 style={{marginBottom: 24}}>{this.props.demo.description}</h2>
				<Col left>
					{this._renderScript( this.props.demo.js, this.props.demo.id )}
				</Col>
				<Col right>
					{this._renderLive( this.props.demo.js, this.props.demo.id )}
				</Col>
			</div>
		);
	},

	_renderScript: function ( js, id )  {
		var sanitizedJs = js.replace( /Demo\.require/g, 'require' ).replace( /Demo\.domId/g, "'"+id+"'" );
		
		return (
			<div style={this.styles.code}>
				<Codemirror value={sanitizedJs} theme="solarized" mode="text/e4x" readOnly={true} lineNumbers={true} />
			</div>
		);
	},

	_renderLive: function ( js, id ) {
		var liveJs = js.replace( /Demo\.domId/g, "'"+id+"'" );
		return (
			<div style={this.styles.live}>
				<script type="text/jsx" dangerouslySetInnerHTML={{__html: liveJs}} />
				<div id={id}>demo container</div>
			</div>
		);
	}

});

var Demo = React.createClass({

	componentWillMount: function() {
		//this is so we can inject a fake "require" function into our scripts
		window.Demo = {
			require: function(name) { return this.modules[name]; },
			modules: {}
		};
	},

	render: function() {
		return (
			<Reset css={styles.css}>
				<h1>Demo of DOPS-React components</h1>
				<p>This demonstrates some of the functionality provided by the DOPS-React library, a set of simple React components for building rich user interfaces.</p>
				<p>For more information, check out the <a href="https://github.com/Automattic/dops-react">GitHub repository</a>.</p>
				{_demos.map ( function ( demo ) {
					return (<DemoModule key={demo.id} demo={demo} />);
				})}
			</Reset>
		);
	}
});

module.exports = Demo;