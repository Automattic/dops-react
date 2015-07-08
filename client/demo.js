var React = require('react'),
	Demo = require('./components/demo');

jQuery(document).ready(function () {
	React.render(
	  React.createElement(Demo, {}), document.getElementById('demo')
	);
});

