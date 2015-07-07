var React = require('react'),
	Button = require('./button'),
	styles = require('../styles');

var PasswordBox = React.createClass({displayName: "PasswordBox",

	propTypes: {
		value: React.PropTypes.any.isRequired,
		hideLabel: React.PropTypes.any,
		showLabel: React.PropTypes.any
	},

	getDefaultProps: function() {
		return {
			hideLabel: "hide",
			showLabel: "show"
		};
	},

	styles: {
		box: {
			borderRadius: 2,
			padding: '5px 10px',
			background: '#f5f5f5'
		}
	},

	getInitialState: function() {
		return {
			showPass: false
		};
	},

	handleShowPass: function ( e ) {
		e.preventDefault();
		this.setState({showPass: true});
	},

	handleHidePass: function ( e ) {
		e.preventDefault();
		this.setState({showPass: false});
	},

	render: function() {
		return (
			React.createElement("div", {style: this.styles.box}, 
				this.state.showPass ? 
					(React.createElement("div", null, 
						React.createElement("span", {style: this.styles.visibleKey}, this.props.value), 
						React.createElement(Button, {size: "tiny", style: styles.right, onClick: this.handleHidePass}, this.props.hideLabel)
					)) : 
					(React.createElement("div", null, 
						React.createElement("span", {style: this.styles.hiddenKey}, "************"), 
						React.createElement(Button, {size: "tiny", style: styles.right, onClick: this.handleShowPass}, this.props.showLabel)
					))
				
			)
		);
	}
});

module.exports = PasswordBox;

