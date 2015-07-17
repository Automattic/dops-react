// this component provides some basic resets so that the rest of the styling works as intended.
// this prevents noisy duplication of reset code throughout the codebase.

// usage:
// use this as a wrapper for a top-level component that uses dops-react, e.g.
//
// render: function() {
// 	return (
//       <Reset>
//         ... the rest of my code goes here ...
//       </Reset>
// 	)
// }

// to add additional CSS, pass it in using the "CSS" property

var React = require('react'),
	Radium = require('radium'),
	m = require('../utils/m');

var idCounter = 0;

var Reset = React.createClass({
	propTypes: {
		css: React.PropTypes.object
	},

	style: {
		resets: {
			'*': {
				boxSizing: 'border-box'
			},
			'div, ul, ol, li, h1, h2, h3, h4, h5, h6, form, fieldset, legend, input, button, textarea, p, blockquote, th, td': { 
				margin: 0, padding: 0 
			},
			img: {
				border: 'none',
				maxWidth: '100%'
			},
			td: {
				verticalAlign: 'top'
			},

			// these support animations
			'.slideDown-enter': {
				overflowY: 'hidden',
				maxHeight: 0,
				transition: 'all .5s ease-out'
			},

			'.slideDown-enter-active': {
				overflowY: 'hidden',
				maxHeight: 400
			},

			'.slideDown-leave': {
				overflowY: 'hidden',
				maxHeight: 400,
				transition: 'all .5s ease-out'
			},

			'.slideDown-leave-active': {
				overflowY: 'hidden',
				maxHeight: 0
			},

			/**
			 * Slide across right-to-left
			 */

			'.slideRTL-enter': {
				position: 'absolute',
				left: '100%',
				transition: 'all .2s linear'
			},

			'.slideRTL-enter-active': {
				position: 'absolute',
				left: '0%'
			},

			'.slideRTL-leave': {
				position: 'absolute',
				left: '0%',
				transition: 'all .2s linear'
			},

			'.slideRTL-leave-active': {
				position: 'absolute',
				left: '-100%'
			},

			/**
			 * Slide across left-to-right
			 */

			'.slideLTR-enter': {
				position: 'absolute',
				left: '-100%',
				transition: 'all .2s linear'
			},

			'.slideLTR-enter-active': {
				position: 'absolute',
				left: '0%'
			},

			'.slideLTR-leave': {
				position: 'absolute',
				left: '0%',
				transition: 'all .2s linear'
			},

			'.slideLTR-leave-active': {
				position: 'absolute',
				left: '100%'
			}
		}
	},
	render: function() {
		var {...props} = this.props,
			id = this._generateId();

		return (
			<div id={id} {...props}>
				<Radium.Style scopeSelector={'#'+id} rules={m(this.style.resets, this.props.css)} />
				{this.props.children}
			</div>
		);
	},

	_generateId: function() {
		return 'dopsid'+(idCounter++);
	}
});

module.exports = Reset;