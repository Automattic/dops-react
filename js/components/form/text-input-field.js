var React = require('react');

var TextInputField = React.createClass({displayName: "TextInputField",
	
	propTypes: {
		required: React.PropTypes.bool,
		onChange: React.PropTypes.func,
		style: React.PropTypes.object,
		ref: React.PropTypes.string,
		value: React.PropTypes.string
	},

	getInitialState: function() {
		return {};
	},

	_hasValidationError: function() {
		return !!this.state.validationMessage;
	},

	handleChange: function(e) {
		if ( this.props.onChange ) {
			this.props.onChange(e);
		}
	},

	setValidationMessage: function(message) {
		this.setState({ validationMessage: message });
	},

	clearValidationMessage: function() {
		this.setState({ validationMessage: null });
	},

	render: function() {
		var classes = "fields wide";

		if ( this.props.required ) {
			classes = classes + " required";
		}

		if ( this._hasValidationError() ) {
			classes = classes + " error";
		}

		return (
			React.createElement("div", {className: "field-wrapper", style: this.props.style}, 
				React.createElement("input", {ref: this.props.ref, name: this.props.ref, type: "text", className: classes, placeholder: this.props.placeholder, value: this.props.value, onChange: this.handleChange, "aria-required": this.props.required}), 
				
					this._hasValidationError() && 
					(React.createElement("label", {className: "error", htmlFor: this.props.ref}, this.state.validationMessage))
				
			)
		);
	}
});

module.exports = TextInputField;