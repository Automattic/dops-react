module.exports = function() {
	var res = {};
	for ( var i = 0; i < arguments.length; ++i) {
		if (arguments[i]) {
			jQuery.extend(res, arguments[i]);
		}
	}
	return res;
};