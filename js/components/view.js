/* A simple FlexBox implementation */
/* All credit must go to Thomas Coopman for his original es6 implementation at: https://github.com/tcoopman/react-flexbox */

var React = require('react'),
	m = require('../utils/m'),
	Radium = require('radium');

var flexContainerStyle = {
	display: 'flex',
	flexWrap: 'nowrap',
	flex: '1 0 auto',
	justifyContent: 'space-between',
	alignContent: 'space-between',
	alignItems: 'stretch'
};

function calcFlexStyle(props) {
	var divStyle = {};

	var defaultGrowShrink = props.stretch ? 1 : 0;

	var flexGrow = props.grow ? props.grow : defaultGrowShrink;
	var flexShrink = props.shrink ? props.shrink : defaultGrowShrink;
	var flexDirection = props.column ? 'column' : 'row';
	var flexBasis = 'auto';

	if ( typeof props.width === 'number' ) {
		flexGrow = props.width;
	} else if ( props.width ) {
		divStyle.width = props.width;
	}

	if ( props.height) {
		divStyle.height = props.height;
	}

	divStyle.flexBasis = flexBasis;
	divStyle.flexGrow = flexGrow;
	divStyle.flexShrink = flexShrink;
	divStyle.flexDirection = flexDirection;
	
	return divStyle;
}

var View = React.createClass({displayName: "View",
	_childrenWithPadding: function() {
		if ( ! this.props.padding ) {
			return this.props.children;	
		}

		var total = React.Children.count(this.props.children),
			count = 0,
			cssProp = this.props.column ? 'marginBottom' : 'marginRight';
		
		return React.Children.map(this.props.children, function(child) {			
			count = count + 1;
			
			var style = {};
			style[cssProp] = this.props.padding;

			if ( count < total ) {
				return React.cloneElement(child, { style: m(child.props.style, style) });
			} else {
				return child;
			}
		}, this);
	},

	render: function() {
		var $__0=            this.props,row=$__0.row,column=$__0.column,width=$__0.width,height=$__0.height,auto=$__0.auto,style=$__0.style,stretch=$__0.stretch,child=$__0.child,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{row:1,column:1,width:1,height:1,auto:1,style:1,stretch:1,child:1});

		var viewProps = {
			row: row,
			column: column,
			width: width,
			height: height,
			auto: auto,
			style: style,
			stretch: stretch,
			child: child
		};

		var viewStyle = calcFlexStyle(viewProps);

		// this is so we can say <View child .../> and not get display:flex
		var computedStyle = this.props.child ? m.apply(null, [viewStyle].concat(style)) : m.apply(null, [flexContainerStyle, viewStyle].concat(style));

		return React.createElement("div", React.__spread({},  other, {style: computedStyle}), this._childrenWithPadding());
	}
});

module.exports = Radium(View);