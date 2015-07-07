// This is the main entry point for the account summary screen
require('./ie-shims');
var React = require('react'), // TODO: split out into conditional include for <=IE9
	Demo = require('./components/demo');

jQuery(document).ready(function () {
	React.render(
	  React.createElement(Demo, {}), document.getElementById('demo')
	);
});

