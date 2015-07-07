var React = require('react'),
	i18n = require('lib/mixins/i18n');

var CardFooter = React.createClass({displayName: "CardFooter",
	mixins: [i18n.mixin],

	styles: {
		footer: {
			background: '#f9f9f9',
			margin: '-1px -20px -25px',
			padding: '15px 20px'
		}
	},

	render: function() {
		return (
			React.createElement("div", {style: this.styles.footer}, 
				this.props.children
			)
		);
	}
});

module.exports = CardFooter;