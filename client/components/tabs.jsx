var React = require('react'),
	styles = require('../styles'),
	m = require('../utils/m');

var Panel = React.createClass({
	propTypes: {
		title: React.PropTypes.any.isRequired
	},

	render: function() {
		return <div>{this.props.children}</div>;
	}
});

var Tabs = React.createClass({

	propTypes: {
		layout: React.PropTypes.oneOf(['horizontal', 'vertical'])
	},

	styles: {
		horizontal: {
			wrapper: {
				borderBottom: '1px solid #eee',
				marginLeft: 0,
				marginTop: -10,
				clear: 'both'
			},
			item: {
				borderRight: '1px solid #eee',
				listStyle: 'none',
				margin: '0 0 -1px',
				float: 'left'
			},
			link: {
				color: '#aaa',
				display: 'block',
				fontSize: 14,
				margin: '0 15px',
				padding: '10px 0',
				textAlign: 'center',
				textTransform: 'uppercase'
			},
			activeLink: {
				borderBottom: '2px solid #029dd6',
				color: '#444',
				textDecoration: 'none'
			},
			content: {

			}
		},
		vertical: {
			wrapper: {
				width: '30%',
				float: 'left'
			},
			item: {
				listStyle: 'none',
				margin: '0 0'
			},
			link: {
				display: 'block',
				borderLeft: '2px solid transparent',
				color: '#999',
				margin: '0 10px 10px 0',
				padding: '4px 6px'
			},
			activeLink: {
				borderColor: '#029dd6',
				color: '#029dd6',
				background: '#f9f9f9',
				textDecoration: 'none'
			},
			content: {
				float: 'right',
				width: '70%'
			}
		}
	},

	getDefaultProps: function() {
		return {
			layout: 'horizontal'
		};
	},

	getInitialState: function() {
		return {
			activeTab: 0
		};
	},

	handleSelectTab: function( index, e ) {
		e.preventDefault();
		this.setState({ activeTab: index });
	},

	handleMouseOverTab: function( index ) {
		this.setState({ hoverTab: index });
	},

	handleMouseOutTab: function( index ) {
		if ( this.state.hoverTab === index ) {
			this.setState({ hoverTab: null });
		}
	},

	_isHorizontal: function() {
		return this.props.layout === 'horizontal';
	},

	render: function() {
		var theme = this._isHorizontal() ? this.styles.horizontal : this.styles.vertical;
		var childCount = 0;
		return (
			<div>
				{this._renderNav(theme)}
				<div style={theme.content}>
					{React.Children.map(this.props.children, function( child, index ){
						if ( index === this.state.activeTab ) {
							return child;
						} else {
							return null;
						}
						childCount++;
					}.bind(this))}
				</div>
				<div style={styles.clear}></div>
			</div>
		);
	},

	_renderNav: function(theme) {
		return (
			<ul style={theme.wrapper}>
				{React.Children.map(this.props.children, function( child, index ) {
					var title = child.props.title,
						ref = 'tab-'+(index + 1),
						active = this.state.activeTab === index,
						hover = this.state.hoverTab === index;

					return (
						<li key={index} style={theme.item}>
							<a href="#" ref={ref} onClick={this.handleSelectTab.bind(this, index)} onMouseOver={this.handleMouseOverTab.bind(this, index)} onMouseOut={this.handleMouseOutTab.bind(this, index)} style={m(theme.link, (active||hover) && theme.activeLink)}>{title}</a>
						</li>		
					);
				}.bind(this))}
				<div style={styles.clear}/>
			</ul>
		);
	}
});

Tabs.Panel = Panel;

module.exports = Tabs;
