var React = require('react'),
	styles = require('../styles'),
	Radium = require('radium');

var Button = React.createClass({displayName: "Button",

	propTypes: {
		size: React.PropTypes.oneOf(['tiny', 'normal', 'big']),
		color: React.PropTypes.oneOf(['gray', 'blue', 'green']),
		theme: React.PropTypes.oneOf(['wp', 'jetpack']),
		inline: React.PropTypes.bool,
		onClick: React.PropTypes.func,
		href: React.PropTypes.string
	},

	getDefaultProps: function() {
		return { size: 'normal', inline: true, color: 'gray', theme: 'wp' };
	},

	handleCallbackHref: function(e) {
		e.preventDefault();
		window.location = this.props.href;
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
			// textTransform: 'uppercase',
			WebkitFontSmoothing: 'antialiased',
			transition: 'background 0.2s'
		},

		sizes: {
			tiny: {
				fontSize: 10,
				padding: '2px 10px',
			},
			normal: {
				fontSize: 13,
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
				color: styles.colors.darkGray,
				':hover': {
					color: styles.colors.gray
				}
			},
			blue: {
				background: styles.colors.blue,
				borderColor: 'rgba(0,0,0,0.6)',
				color: 'white',
				':hover': {
					background: styles.colors.lighterBlue,
				}
			},
			green: {
				background: styles.colors.green,
				color: 'white',
				borderColor: 'rgba(0,0,0,0.6)',
				':hover': {
					background: styles.colors.lighterGreen,
				}

			}
		},

		themes: {
			wp: {},
			jetpack: {
				padding: '18px 24px 15px',
				font: '400 20px/1 "Open Sans", Helvetica, sans-serif',
				borderRadius: 6,
				border: 'none',
				boxShadow: '0 6px 0 #3e6c20,0 6px 3px rgba(0,0,0,0.4)'
			}
		},
		
		inline: {
			display: 'inline-block'
		},

		disabled: {
			background: '#f9f9f9',
			borderColor: styles.colors.lightGray,
			color: styles.colors.lightGray,
			':hover': {
				background: '#f9f9f9',
				borderColor: styles.colors.lightGray,
				color: styles.colors.lightGray,
			}
		}
	},

	render: function() {

		var $__0=          this.props,size=$__0.size,color=$__0.color,inline=$__0.inline,onClick=$__0.onClick,theme=$__0.theme,href=$__0.href,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{size:1,color:1,inline:1,onClick:1,theme:1,href:1});

		var callback;

		var combinedStyle = [
			this.styles.basic, 
			this.styles.sizes[size],
			this.styles.colors[color],
			this.styles.themes[theme],
			this.props.disabled && this.styles.disabled,
			inline && this.styles.inline,
			this.props.style
		];

		if ( href && !onClick) {
			callback = this.handleCallbackHref;
		} else {
			callback = onClick;
		}

		return (
			React.createElement("button", React.__spread({},  other, {style: combinedStyle, onClick: callback, onMouseOver: this.handleMouseOver, onMouseOut: this.handleMouseOut}), 
				this.props.children
			)
		);
	}
});

module.exports = Radium(Button);