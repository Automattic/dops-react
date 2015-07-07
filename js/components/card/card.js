var React = require('react'),
	i18n = require('lib/mixins/i18n'),
	Icon = require('../icon');

var Card = React.createClass({displayName: "Card",
	mixins: [i18n.mixin],

	propTypes: {
		title: React.PropTypes.any,
		icon: React.PropTypes.string,
		iconLabel: React.PropTypes.any
	},

	render: function() {
		return (
			React.createElement("div", {className: "card card--stacked"}, 
				this.props.title && (
					React.createElement("h2", null, 
						this.props.title, 
						(this.props.icon || this.props.iconLabel) && (
							this._renderIcon()
						)
					)
				), 
				
				this.props.children
			)
		);
	},

	_renderIcon: function() {
		return (
			React.createElement("span", {className: "core_right account-status account-status--active"}, 
				this.props.icon && React.createElement(Icon, {name: this.props.icon}), 
				this.props.iconLabel
			)
		);
	}

});

Card.Section = require('./section');
Card.Footer = require('./footer');

module.exports = Card;