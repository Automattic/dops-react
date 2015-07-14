var React = require('react'),
	m = require('../utils/m'),
	Formsy = require('formsy-react'),
	Button = require('./button'),
	styles = require('../styles');

var formStyles = {
	inputWrapper: {
		width: '100%'
	}
};

var idCounter = 0;

function getUniqueId() {
	return 'formid' + (idCounter++);
}

var Section = React.createClass({displayName: "Section",
	
	propTypes: {
		title: React.PropTypes.any,
		id: React.PropTypes.string
	},

	styles: {
		title: {
			fontSize: 11,
			fontWeight: 'bold', 
			color: '#333',
			borderBottom: '1px solid #DDD',
			paddingBottom: 3,
			marginBottom: 5,
			marginTop: 15
		}
	},

	render: function() {
		return (
			React.createElement("div", {id: this.props.id}, 
				this.props.title ? 
					(
						React.createElement("div", null, 
							React.createElement("div", {style: this.styles.title}, this.props.title), 
							React.createElement("div", {style: styles.clear}, 
								this.props.children
							), 
							React.createElement("div", {style: styles.clear})
						)
					) : 
					(this.props.children)
				
			)
		);
	}
});

// convenience wrapper for a label and an input
var TextInput = React.createClass({displayName: "TextInput",

	mixins: [Formsy.Mixin],

	propTypes: {
		name: React.PropTypes.string.isRequired,
		style: React.PropTypes.any,
		label: React.PropTypes.any,
		labelSuffix: React.PropTypes.any,
		required: React.PropTypes.any,
		validations: React.PropTypes.string,
		validationError: React.PropTypes.string
	},

	getInitialState: function() {
		return {
			uniqueId: getUniqueId()
		};
	},

	changeValue: function (event) {
		this.setValue(event.target.value);
    },

	render: function() {var $__1, $__2;
		var $__0=       this.props,style=$__0.style,labelSuffix=$__0.labelSuffix,label=$__0.label,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{style:1,labelSuffix:1,label:1});

		if ( this.props.label ) {
			return (
				React.createElement(Form.Label, {style: m(formStyles.inputWrapper, style), label: label, labelSuffix: labelSuffix, htmlFor: this.state.uniqueId, required: this.props.required}, 
					($__1 = this)._renderInput.apply($__1, [this.props.label].concat(other))
				)
			);
		} else {
			return ($__2 = this)._renderInput.apply($__2, [this.props.name].concat(other));
		}	
	},

	_renderInput: function(label ) {for (var other=[],$__0=1,$__1=arguments.length;$__0<$__1;$__0++) other.push(arguments[$__0]);
		var errorMessage;

		if ( this.isFormSubmitted() ) {
			errorMessage = this.showError() ? this.getErrorMessage() : 
							this.showRequired() ? Form.requiredLabelFormatter(this.props.label) : null;
		}

		return (
			React.createElement("div", null, 
				React.createElement("input", React.__spread({
					type: "text", 
					id: this.state.uniqueId}, 
					 other , 
					{style: m(styles.input, errorMessage && styles.errorField), 
					onChange: this.changeValue, 
					value: this.getValue()})), 

				this.props.children, 
				React.createElement("div", {style: styles.clear}), 
				errorMessage && (React.createElement("span", {style: styles.errorLabel}, errorMessage))
			)
		);
	}
});

var Label = React.createClass({displayName: "Label",

	propTypes: {
		style: React.PropTypes.any,
		label: React.PropTypes.any,
		labelSuffix: React.PropTypes.any,
		htmlFor: React.PropTypes.string,
		required: React.PropTypes.any,
		inline: React.PropTypes.any
	},

	styles: {
		wrapper: {
			marginBottom: 5,
			position: 'relative'
		},
		label: {
			display: 'block',
			marginTop: 10,
			float: 'none',
			fontSize: 12,
			marginBottom: 10,
			textTransform: 'uppercase',
			width: 'auto'
		}
	},

	render: function() {
		if ( this.props.label ){
			return (
				React.createElement("div", {style:  m(this.styles.wrapper, this.props.style) }, 
					React.createElement("label", {htmlFor: this.props.htmlFor, style: this.styles.label}, this.props.inline && this.props.children, this.props.label, this.props.labelSuffix, this.props.required && '*'), 
					!this.props.inline && this.props.children
				)
			);
		} else {
			return (
				React.createElement("div", {style:  m(this.styles.wrapper, this.props.style) }, 
					this.props.children
				)
			);
		}
	}
});

var Row = React.createClass({displayName: "Row",
	render: function() {
		return (
			React.createElement("div", {style: styles.clear}, 
				this.props.children
			)
		);
	}
});

var Checkbox = React.createClass({displayName: "Checkbox",
	mixins: [Formsy.Mixin],

	propTypes: {
		name: React.PropTypes.string.isRequired,
		style: React.PropTypes.any,
		label: React.PropTypes.any.isRequired,
		labelSuffix: React.PropTypes.any,
		required: React.PropTypes.any,
		validations: React.PropTypes.string,
		validationError: React.PropTypes.string
	},

	getInitialState: function() {
		return {
			uniqueId: getUniqueId()
		};
	},

	getDefaultProps: function() {
		return { required: false };
	},

	changeValue: function (event) {
		this.setValue(event.target.checked);
    },

	render: function() {
		var $__0=       this.props,style=$__0.style,labelSuffix=$__0.labelSuffix,label=$__0.label,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{style:1,labelSuffix:1,label:1});
		var uniqueId = this.state.uniqueId;
		var errorMessage;

		if ( this.isFormSubmitted() ) {
			errorMessage = this.showError() ? this.getErrorMessage() : 
							this.showRequired() ? Form.requiredLabelFormatter(this.props.label) : null;
		}

		return (
			React.createElement("div", {style: m(formStyles.inputWrapper, style)}, 
				React.createElement(Form.Label, {inline: true, label: label, labelSuffix: labelSuffix, htmlFor: uniqueId, required: this.props.required}, 
					React.createElement("input", React.__spread({
						type: "checkbox", 
						id: uniqueId}, 
						 other , 
						{style: m(styles.checkbox, errorMessage && styles.errorField), 
						onChange: this.changeValue, 
						checked: this.getValue()}))
				), 
				errorMessage && (React.createElement("span", {style: styles.errorLabel}, errorMessage))
			)
		);
	}
});

var RadioInput = React.createClass({displayName: "RadioInput",
	mixins: [Formsy.Mixin],

	propTypes: {
		name: React.PropTypes.string.isRequired
	},

	render: function() {
		return (
			React.createElement("p", null, "Radio button")
		);
	}
});

var Hidden = React.createClass({displayName: "Hidden",
	mixins: [Formsy.Mixin],

	propTypes: {
		name: React.PropTypes.string.isRequired
	},

	render: function() {
		return (
			React.createElement("input", {type: "hidden", value: this.getValue()})
		);
	}
});

var SelectInput = React.createClass({displayName: "SelectInput",

	mixins: [Formsy.Mixin],

	propTypes: {
		name: React.PropTypes.string.isRequired,
		style: React.PropTypes.any,
		label: React.PropTypes.any,
		inline: React.PropTypes.any,
		labelSuffix: React.PropTypes.any,
		required: React.PropTypes.any,
		validations: React.PropTypes.string,
		validationError: React.PropTypes.string
	},

	styles: {
		inline: {
			width: 'auto',
			marginRight: 10
		},

		inlineWrapper: {
			display: 'inline'
		}
	},

	getInitialState: function() {
		return {
			uniqueId: getUniqueId()
		};
	},

	changeValue: function (event) {
		this.setValue(event.target.value);
    },

	render: function() {
		var errorMessage;

		if ( this.isFormSubmitted() ) {
			errorMessage = this.showError() ? this.getErrorMessage() : 
							this.showRequired() ? Form.requiredLabelFormatter(this.props.label) : null;
		}

		return (
			React.createElement("div", {style: m(formStyles.inputWrapper, this.props.inline && this.styles.inlineWrapper, this.styles.widthHack, this.props.style)}, 
				React.createElement(Form.Label, {inline: this.props.inline, label: this.props.label, labelSuffix: this.props.labelSuffix, htmlFor: this.state.uniqueId, required: this.props.required}, 
					React.createElement("select", {ref: "select", id: this.state.uniqueId, style: m(styles.select, errorMessage && styles.errorField, this.props.inline && this.styles.inline), value: this.getValue(), onChange: this.changeValue}, 
						this.props.children
					)
				), 
				errorMessage && (React.createElement("span", {style: styles.errorLabel}, errorMessage))
			)
		);
	}
});

var ActionBar = React.createClass({displayName: "ActionBar",
	style: {
		wrapper: {
			background: '#f9f9f9',
			color: '#aaa',
			margin: '-1px -20px',
			padding: '15px 20px'
		}
	},

	propTypes: {
		style: React.PropTypes.object
	},

	render: function() {
		return (
			React.createElement("div", {style: m(this.style.wrapper, this.props.style)}, 
				this.props.children
			)
		);
	}
});

// simple button that submits the form
var Submit = React.createClass({displayName: "Submit",

	render: function() {
		var $__0=    this.props,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{});

		return (
			React.createElement(Button, React.__spread({},  other, {type: "submit"}), this.props.children)
		);
	}
});

// from: https://gist.github.com/ShirtlessKirk/2134376
/**
 * Luhn algorithm in JavaScript: validate credit card number supplied as string of numbers
 * @author ShirtlessKirk. Copyright (c) 2012.
 * @license WTFPL (http://www.wtfpl.net/txt/copying)
 */
var luhnChk = (function (arr) {
    return function (ccNum) {
        var 
            len = ccNum.length,
            bit = 1,
            sum = 0,
            val;
 
        while (len) {
            val = parseInt(ccNum.charAt(--len), 10);
            sum += (bit ^= 1) ? arr[val] : val;
        }
 
        return sum && sum % 10 === 0;
    };
}([0, 2, 4, 6, 8, 1, 3, 5, 7, 9]));

// To find out more about validators, see:
// https://github.com/christianalfoni/formsy-react/blob/master/API.md#validators

Formsy.addValidationRule('isCC', function (values, value) {
	if ( value === undefined || value === null ) {
		return false;
	} else {
		return value.length === 16 && luhnChk(value);
	}
});

// very thin wrapper for Formsy.Form
var Form = React.createClass({displayName: "Form",

	propTypes: {
		style: React.PropTypes.object,
		onValidSubmit: React.PropTypes.func,
		onInvalidValidSubmit: React.PropTypes.func,
		onValid: React.PropTypes.func,
		onInvalidValid: React.PropTypes.func
	},

    styles: {
    	form: {
    		fontFamily: styles.fonts.sans
    	}
    },

    getInitialState: function() {
    	return {};
    },

    setValidationErrors: function(errors) {
    	this.setState( { validationErrors: errors } );
    },

    submit: function() {
    	this.refs.form.submit();
    },

	render: function() {
		var $__0=     this.props,style=$__0.style,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{style:1});
		return (
			React.createElement("div", {style: m(this.styles.form, style)}, 
				React.createElement(Formsy.Form, React.__spread({ref: "form", validationErrors: this.state.validationErrors},  other), 
					this.props.children
				)
			)
		);
	}
});

// this can be overridden with a custom function so that you can internationalise the output
Form.requiredLabelFormatter = function(label) {
	return label + " is required";
};

Form.Submit = Submit;
Form.ActionBar = ActionBar;
Form.Section = Section;
Form.Hidden = Hidden;
Form.RadioInput = RadioInput;
Form.SelectInput = SelectInput;
Form.TextInput = TextInput;
Form.Checkbox = Checkbox;
Form.Label = Label;
Form.Row = Row;

module.exports = Form;