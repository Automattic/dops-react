var React = require('react'),
	m = require('../utils/m'),
	Formsy = require('formsy-react'),
	Button = require('./button'),
	styles = require('../styles'),
	Radium = require('radium');

var formStyles = {
	inputWrapper: {
		width: '100%'
	}
};

var idCounter = 0;

function getUniqueId() {
	return 'formid' + (idCounter++);
}

var Section = React.createClass({
	
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
			<div id={this.props.id}>
				{this.props.title ? 
					(
						<div>
							<div style={this.styles.title}>{this.props.title}</div>
							<div style={styles.clear}>
								{this.props.children}
							</div>
							<div style={styles.clear} />
						</div>
					) : 
					(this.props.children)
				}
			</div>
		);
	}
});

// convenience wrapper for a label and an input
var TextInput = React.createClass({

	mixins: [Formsy.Mixin],

	propTypes: {
		name: React.PropTypes.string.isRequired,
		style: React.PropTypes.any,
		label: React.PropTypes.any,
		type: React.PropTypes.string,
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
		return { type: "text" };
	},

	changeValue: function (event) {
		this.setValue(event.target.value);
    },

	render: function() {
		var { style, labelSuffix, label, ...other } = this.props;

		if ( this.props.label ) {
			return (
				<Form.Label style={[formStyles.inputWrapper, style]} label={label} labelSuffix={labelSuffix} htmlFor={this.state.uniqueId} required={this.props.required}>
					{this._renderInput( this.props.label, null, ...other )}
				</Form.Label>
			);
		} else {
			return this._renderInput( this.props.name, style, ...other );
		}	
	},

	_renderInput: function(label, style, ...other) {
		var errorMessage;

		if ( this.isFormSubmitted() ) {
			errorMessage = this.showError() ? this.getErrorMessage() : 
							this.showRequired() ? Form.requiredLabelFormatter(this.props.label) : null;
		}

		return (
			<div>
				<input 
					type={this.props.type}
					id={this.state.uniqueId}
					{ ...other }
					placeholder={this.props.placeholder}
					style={[styles.input, errorMessage && styles.errorField, style]}
					onChange={this.changeValue} 
					value={this.getValue()} />

				{this.props.children}
				<div style={styles.clear}></div>
				{errorMessage && (<span style={styles.errorLabel}>{errorMessage}</span>)}
			</div>
		);
	}
});

var Label = React.createClass({

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
				<div style={ m(this.styles.wrapper, this.props.style) }>
					<label htmlFor={this.props.htmlFor} style={this.styles.label}>{this.props.inline && this.props.children}{this.props.label}{this.props.labelSuffix}{this.props.required && '*'}</label>
					{!this.props.inline && this.props.children}
				</div>
			);
		} else {
			return (
				<div style={ m(this.styles.wrapper, this.props.style) }>
					{this.props.children}
				</div>
			);
		}
	}
});

var Row = React.createClass({
	render: function() {
		return (
			<div style={styles.clear}>
				{this.props.children}
			</div>
		);
	}
});

var Checkbox = React.createClass({
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
		var { style, labelSuffix, label, ...other } = this.props;
		var uniqueId = this.state.uniqueId;
		var errorMessage;

		if ( this.isFormSubmitted() ) {
			errorMessage = this.showError() ? this.getErrorMessage() : 
							this.showRequired() ? Form.requiredLabelFormatter(this.props.label) : null;
		}

		return (
			<div style={m(formStyles.inputWrapper, style)}>
				<Form.Label inline label={label} labelSuffix={labelSuffix} htmlFor={uniqueId} required={this.props.required}>
					<input 
						type="checkbox" 
						id={uniqueId}
						{ ...other }
						style={m(styles.checkbox, errorMessage && styles.errorField)}
						onChange={this.changeValue} 
						checked={this.getValue()} />
				</Form.Label>
				{errorMessage && (<span style={styles.errorLabel}>{errorMessage}</span>)}
			</div>
		);
	}
});

var RadioInput = React.createClass({
	mixins: [Formsy.Mixin],

	propTypes: {
		name: React.PropTypes.string.isRequired
	},

	render: function() {
		return (
			<p>Radio button</p>
		);
	}
});

var Hidden = React.createClass({
	mixins: [Formsy.Mixin],

	propTypes: {
		name: React.PropTypes.string.isRequired
	},

	render: function() {
		return (
			<input type="hidden" value={this.getValue()}/>
		);
	}
});

var SelectInput = React.createClass({

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
			<div style={m(formStyles.inputWrapper, this.props.inline && this.styles.inlineWrapper, this.styles.widthHack, this.props.style)}>
				<Form.Label inline={this.props.inline} label={this.props.label} labelSuffix={this.props.labelSuffix} htmlFor={this.state.uniqueId} required={this.props.required}>
					<select ref="select" id={this.state.uniqueId} style={m(styles.select, errorMessage && styles.errorField, this.props.inline && this.styles.inline)} value={this.getValue()} onChange={this.changeValue}>
						{this.props.children}
					</select>
				</Form.Label>
				{errorMessage && (<span style={styles.errorLabel}>{errorMessage}</span>)}
			</div>
		);
	}
});

var ActionBar = React.createClass({
	style: {
		wrapper: {
			background: '#f9f9f9',
			color: '#aaa',
			margin: '0px -20px',
			padding: '15px 20px',
		}
	},

	propTypes: {
		style: React.PropTypes.object
	},

	render: function() {
		return (
			<div style={[this.style.wrapper, this.props.style]}>
				{this.props.children}
			</div>
		);
	}
});

// simple button that submits the form
var Submit = React.createClass({

	render: function() {
		var { ...other } = this.props;

		return (
			<Button {...other} type="submit">{this.props.children}</Button>
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
var Form = React.createClass({

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
		var { style, ...other } = this.props;
		return (
			<div style={m(this.styles.form, style)}>
				<Formsy.Form ref="form" validationErrors={this.state.validationErrors} {...other}>
					{this.props.children}
				</Formsy.Form>
			</div>
		);
	}
});

// this can be overridden with a custom function so that you can internationalise the output
Form.requiredLabelFormatter = function(label) {
	return label + " is required";
};

Form.Submit = Submit;
Form.ActionBar = Radium(ActionBar);
Form.Section = Section;
Form.Hidden = Hidden;
Form.RadioInput = RadioInput;
Form.SelectInput = SelectInput;
Form.TextInput = Radium(TextInput);
Form.Checkbox = Checkbox;
Form.Label = Label;
Form.Row = Row;

module.exports = Form;