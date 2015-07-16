module.exports = {
	//layout
	right: { float: 'right' },
	
	left: { float: 'left' },
	
	third: { width: '33%' },

	full: { width: '100%' },

	half: { width: '48%' },

	hidden: { display: 'none' },

	clear: {
		clear: 'both', 
		display: 'block' 
	},

	//account status indicator
	accountStatus: {
		textTransform: 'capitalize'
	},

	accountStatusNoticon: {
		borderRadius: "50%",
		width: 16,
		height: 16,
		marginRight: 10,
		color: '#fff',
		background: '#81bf16'
	},

	//box widget
	box: {
		borderRadius: 2,
		padding: '5px 10px',
		background: '#f5f5f5'
	},

	//basic styling - fonts and colors
	light: { color: '#999' },
	colors: {
		akismetGreen: '#5e8e14',
		blue: '#029dd6',
		lighterBlue: '#13AEE7',
		black: '#333',
		darkGray: '#444',
		gray: '#787878',
		lightGray: '#bbb',
		veryLightGray: '#eee',
		offWhite: '#f9f9f9',
		accountActive: '#81bf16',
		accountInactive: '#bbb',
		green: '#518d2a',
		lighterGreen: '#57972d'
	},

	fonts: {
		sans: 'Open Sans, "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
		serif: 'Merriweather, Georgia, serif',
		mono: '"Courier New", Courier, monospace'
	},

	//forms
	input: {
		width: "100%",
		boxShadow: 'none',
		background: '#fff',
		border: '1px solid #d5d5d5',
		fontSize: 12,
		padding: '8px 10px'
	},

	select: {
		borderRadius: 3,
		backgroundColor: '#fff',
		fontSize: 12,
		height: 35,
		width: '100%',
		border: '1px solid #d5d5d5',
		padding: '3px 5px',
		minWidth: 0
	},

	checkbox: {
		marginRight: 10
	},

	errorField: {
		border: '1px solid #dd3d36'
	},
	
	errorLabel: {
		border: '1px solid #dd3d36',
		color: '#a00',
		display: 'block',
		fontSize: 12,
		margin: '5px 0 0 0',
		padding: 5
	}
};