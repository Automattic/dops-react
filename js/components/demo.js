/*jshint unused: false*/
var React = require('react'),
	Codemirror = require('./codemirror'),
	Col = require('./col'),
	Reset = require('./reset');

var _demos = [
	{
		title: "Modal",
		id: "demo-modal",
		js: require('./demo/demo-modal'),
		requires: {
			'./modal': require('./modal')
		}
	},
	{
		title: "Password Box",
		id: "demo-password-box",
		js: require('./demo/demo-password-box'),
		requires: {
			'./password-box': require('./password-box')
		}
	},
	{
		title: "Cards",
		id: "demo-card",
		js: require('./demo/demo-card'),
		requires: {
			'./card': require('./card')
		}
	},
	{
		title: "Tabs",
		id: "demo-tabs",
		js: require('./demo/demo-tabs'),
		requires: {
			'./tabs': require('./tabs')
		}
	},
	{
		title: "Alert Box",
		id: "demo-alert-box",
		js: require('./demo/demo-alert-box'),
		requires: {
			'./alert-box': require('./alert-box'),
			'./timeout-transition-group': require('./timeout-transition-group')
		}
	},
	{
		title: "Icon",
		id: "demo-icons",
		js: require('./demo/demo-icon'),
		requires: {
			'./icon': require('./icon')
		}
	},
	{
		title: "HoverIcon",
		id: "demo-hover-icons",
		js: require('./demo/demo-hover-icon'),
		requires: {
			'./hover-icon': require('./hover-icon')
		}
	},
	{
		title: "Wizard",
		id: "demo-wizard",
		js: require('./demo/demo-wizard'),
		requires: {
			'./wizard': require('./wizard')
		}
	},
	{
		title: "Button",
		id: "demo-button",
		js: require('./demo/demo-button'),
		requires: {
			'./button': require('./button')
		}
	},
	{
		title: "Form",
		id: "demo-form",
		js: require('./demo/demo-form'),
		requires: {
			'./form': require('./form'),
			'../styles': require('../styles')
		}
	},
	{
		title: "View",
		id: "demo-view",
		js: require('./demo/demo-view'),
		requires: {
			'./view': require('./view'),
			'../styles': require('../styles')
		}
	},
	{
		title: "Face",
		id: "demo-face",
		js: require('./demo/demo-face'),
		requires: {
			'./face': require('./face')
		}
	},
	{
		title: "Slider",
		id: "demo-slider",
		js: require('./demo/demo-slider'),
		requires: {
			'./slider': require('./slider')
		}
	}
];

var DemoModule = React.createClass({displayName: "DemoModule",
	propTypes: {
		demo: React.PropTypes.any.isRequired
	},

	componentWillMount: function () {
		// inject dependencies into the global fake require cache
		Object.keys(this.props.demo.requires).forEach( function( key ) {
			window.Demo.modules[key] = this.props.demo.requires[key];
		}.bind(this));
	},

	render: function() {
		return (
			React.createElement(Reset, {className: "demo"}, 
				React.createElement("h1", null, this.props.demo.title), 
				React.createElement(Col, {left: true}, 
					this._renderScript( this.props.demo.js, this.props.demo.id)
				), 
				React.createElement(Col, {right: true}, 
					this._renderLive( this.props.demo.js, this.props.demo.id)
				)
			)
		);
	},

	_renderScript: function ( js, id )  {
		var sanitizedJs = js.replace( /Demo\.require/g, 'require' ).replace( /Demo\.domId/g, "'"+id+"'" );
		
		return (
			React.createElement("div", {className: "code"}, 
				React.createElement(Codemirror, {defaultValue: sanitizedJs, theme: "solarized", mode: "text/e4x", readOnly: true, lineNumbers: true})
			)
		);
	},

	_renderLive: function ( js, id ) {
		var liveJs = js.replace( /Demo\.domId/g, "'"+id+"'" );
		return (
			React.createElement("div", {className: "live"}, 
				React.createElement("script", {type: "text/jsx", dangerouslySetInnerHTML: {__html: liveJs}}), 
				React.createElement("div", {id: id}, "demo container")
			)
		);
	}

});

var Demo = React.createClass({displayName: "Demo",

	componentWillMount: function() {
		//this is so we can inject a fake "require" function into our scripts
		window.Demo = {
			require: function(name) { return this.modules[name]; },
			modules: {}
		};
	},

	render: function() {
		return (
			React.createElement("div", null, 
				React.createElement("h1", null, "Demo"), 
				_demos.map ( function ( demo ) {
					return (React.createElement(DemoModule, {key: demo.id, demo: demo}));
				})
			)
		);
	}
});

module.exports = Demo;