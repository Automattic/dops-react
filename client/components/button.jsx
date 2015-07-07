var React = require('react'),
	styles = require('../styles'),
	m = require('../utils/m');

var Button = React.createClass({

	propTypes: {
		size: React.PropTypes.oneOf(['tiny', 'normal', 'big']),
		color: React.PropTypes.oneOf(['gray', 'blue']),
		inline: React.PropTypes.bool,
		onClick: React.PropTypes.func		
	},

	getDefaultProps: function() {
		return { size: 'normal', inline: true, color: 'gray' };
	},

	handleMouseOver: function() {
		this.setState({ hover: true });
	},

	handleMouseOut: function() {
		this.setState({ hover: false });
	},

	getInitialState: function() {
		return { hover: false };
	},

	styles: {
		basic: {
			borderRadius: 3,
			boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3)',
			borderWidth: 1,
			borderStyle: 'solid',
			cursor: 'pointer',
			display: 'block',
			fontSize: 14,
			fontWeight: 'bold',
			padding: '10px 20px',
			textAlign: 'center',
			textDecoration: 'none',
			textTransform: 'uppercase',
			WebkitFontSmoothing: 'antialiased',
			transition: 'background 0.2s'
		},

		sizes: {
			tiny: {
				fontSize: 10,
				padding: '2px 10px',
			},
			normal: {
				fontSize: 12,
				padding: '5px 10px'
			},
			big: {
				fontSize: 16,
				padding: '20px 40px'
			}
		},

		colors: {
			gray: {
				background: 'linear-gradient(#fff, #f9f9f9)',
				borderColor: styles.colors.lightGray,
				color: styles.colors.darkGray
			},
			grayHover: {
				color: styles.colors.gray	
			},
			blue: {
				background: styles.colors.blue,
				borderColor: 'rgba(0,0,0,0.6)',
				color: 'white'
			},
			blueHover: {
				background: styles.colors.lighterBlue,
	  			textDecoration: 'none'
			}
		},
		
		inline: {
			display: 'inline-block'
		}
	},

	render: function() {

		var { size, color, inline, onClick, ...other } = this.props;

		var style = m(
			this.styles.basic, 
			this.styles.sizes[size],
			this.styles.colors[color],
			this.state.hover && this.styles.colors[color+'Hover'],
			inline && this.styles.inline,
			this.props.style
		);

		return (
			<button {...other} style={style} onClick={onClick} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
				{this.props.children}
			</button>
		);
	}
});

module.exports = Button;