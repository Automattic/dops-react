var React = require('react'),
	Icon = require('./icon'),
	Radium = require('radium'),
	styles = require('../styles'),
	m = require('../utils/m');

var CardSection = React.createClass({displayName: "CardSection",

	styles: {
		
		wrapper: {
			borderBottom: '1px solid #eee',
			fontSize: 14,
			padding: '10px 0',
		},

		label: {
			color: '#999',
			fontSize: 12,
			fontWeight: 'normal',
			textTransform: 'uppercase',
		},

		content: {},

		vertical: {
			label: {
				marginBottom: 10
			},
			content: {}
		},

		horizontal: {
			label: {
				float: 'left',
				width: '30%',
				'@media all and (max-width: 590px)': {
					marginBottom: 10,
					float: 'none',
					width: '100%'
				}
			},
			content: {
				float: 'right',
				width: '70%',
				'@media all and (max-width: 590px)': {
					float: 'none',
					width: '100%'
				}
			}
		}
	},

	propTypes: {
		title: React.PropTypes.any,
		vertical: React.PropTypes.any,
		device: React.PropTypes.oneOf(['desktop', 'tablet', 'phone'])
	},

	getDefaultProps: function() {
		return { vertical: null };
	},

	render: function() {
		return (
			React.createElement("div", {style: this.styles.wrapper}, 
				this.props.title ? 
					this._renderWithTitle() : 
					this.props.children, 
				
				React.createElement("div", {style: styles.clear})
			)
		);
	},

	_renderWithTitle: function() {
		var orientation = this.props.vertical ? 'vertical' : 'horizontal';
		return (
			React.createElement("div", null, 
				React.createElement("h4", {ref: "label", style: [
					this.styles.label, 
					this.styles[orientation].label]}, 
						this.props.title
				), 
				React.createElement("div", {ref: "content", style: [
					this.styles.content, 
					this.styles[orientation].content]}, 
						this.props.children
				)
			)
		);
	}
});

var CardFooter = React.createClass({displayName: "CardFooter",

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

var Card = React.createClass({displayName: "Card",

	style: {
		card: {
			background: '#fff',
			borderWidth: 1,
			borderStyle: 'solid',
			borderColor: '#ddd',
			borderRadius: 2,
			boxShadow: '0 1px 1px rgba(0, 0, 0, 0.05)',
			padding: '25px 20px',
			'@media all and (max-width: 1000px)': {
				float: 'none',
				width: '100%'
			},
		},

		cardStacked: {
			marginBottom: 40,
			'@media all and (max-width: 590px)': {
				marginBottom: 10
			}
		},

		title: {
			borderBottom: '1px solid #eee',
			color: '#444',
			font: "14px 'Open Sans', Helvetica, Arial, sans-serif",
			margin: 0,
			marginBottom: 10,
			paddingBottom: 5,
			textTransform: 'uppercase'
		}
	},

	propTypes: {
		title: React.PropTypes.any,
		icon: React.PropTypes.string,
		iconLabel: React.PropTypes.any,
		iconColor: React.PropTypes.string,
		device: React.PropTypes.oneOf(['desktop', 'tablet', 'mobile'])
	},

	getDefaultProps: function() {
		return {
			iconColor: styles.colors.gray
		};
	},

	render: function() {
		return (
			React.createElement("div", {style: [this.style.card, this.style.cardStacked]}, 
				this.props.title && (
					React.createElement("h2", {style: this.style.title}, 
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
			React.createElement("span", {style: [styles.right, styles.accountStatus, {color: this.props.iconColor}]}, 
				this.props.icon && React.createElement(Icon, {name: this.props.icon, style: m(styles.accountStatusNoticon, {backgroundColor: this.props.iconColor})}), 
				this.props.iconLabel
			)
		);
	}

});

var RadiumCard = Radium(Card);

RadiumCard.Section = Radium(CardSection);
RadiumCard.Footer = CardFooter;

module.exports = RadiumCard;