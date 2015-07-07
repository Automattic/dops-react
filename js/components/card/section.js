var React = require('react'),
	i18n = require('lib/mixins/i18n'),
	styles = require('../../styles'),
	Radium = require('radium');

var CardSection = React.createClass({displayName: "CardSection",
	mixins: [i18n.mixin],

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

module.exports = Radium(CardSection);