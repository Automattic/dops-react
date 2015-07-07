var React = require('react'), 
	m = require('../utils/m'),
	styles = require('../styles'),
	Icon = require('./icon');

var HoverIcon = React.createClass({

	styles: {
		tooltip: {
			display: 'none',
			fontSize: 12,
			fontFamily: styles.fonts.sans,
			padding: '5px 5px 8px',
			position: 'absolute',
			left: 0,
			top: '100%',
			zIndex: 999
		},
		tooltipType: {
			transparent: {},
			light: {
				borderRadius: 3,
				boxShadow: '5px 5px 5px rgba(0,0,0,0.3)',
				border: '1px solid #bbb',
				backgroundColor: '#fff',
				color: '#000'
			},
			dark: {
				borderRadius: 3,
				background: 'rgba(0, 0, 0, 0.9)',
				color: '#fff',
			},	
		},
		tooltipHover: { display: 'block' },
		icon: { position: 'relative' }
	},

	propTypes: {
		name: React.PropTypes.string.isRequired,
		type: React.PropTypes.oneOf(['dark', 'transparent', 'light'])
	},

	getDefaultProps: function() {
		return {
			type: 'dark'
		};
	},

	getInitialState: function() {
		return { hover: false };
	},

	handleMouseOver: function() {
		this.setState({ hover: true });
	},

	handleMouseOut: function() {
		this.setState({ hover: false });
	},

	render: function() {
		return (
			<Icon name={this.props.name} style={this.styles.icon} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
				<span 
					style={ m(this.styles.tooltip, this.styles.tooltipType[this.props.type], this.state.hover && this.styles.tooltipHover) }>
					{this.props.children}
				</span>
			</Icon>
		);
	}
});

module.exports = HoverIcon;