var React = require('react'),
	Radium = require('radium');

/**
 * Show progress through the steps
 * NOTE: progressPercent MUST be rounded to the nearest 10, i.e. 10, 20, 30, 40...100
 * This is required for the CSS to work (will fix later...)
 **/
var ProgressBar = React.createClass({

	propTypes: {
		style: React.PropTypes.object,
		progressPercent: React.PropTypes.number.isRequired
	},

	styles: {
		wrapper: {
			fontWeight: 400,
			fontSize: '80%'
		},
		progress: {
			background: '#4ab866',
			width: '0%',
			transition: 'width 0.5s',
			display: 'block',
			height: '100%'
		},
		bar: {
			display: 'inline-block',
			width: 80,
			height: 12,
			margin: '0 8px -2px 0',
			padding: 2,
			borderRadius: 2,
			background: '#f5f5f5'
		}
	},

	render: function() {
		// var classes = 'getting-started__progress progress_'+this.props.progressPercent;
		return (
			<div style={[this.styles.wrapper, this.props.style]}>
				<div style={this.styles.bar}>
					<span style={[this.styles.progress, { width: this.props.progressPercent+'%' }]}></span>
				</div>
				{this.props.progressPercent}% complete
			</div>
		);
	}
});

module.exports = Radium(ProgressBar);