var _ = require('lodash');

module.exports = {
	default: function (value, defaultValue) {
		return value ? value : defaultValue;
	},
	compare: function (lvalue, operator, rvalue, options) {
		var operators, result;

		if (arguments.length < 3) {
			throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
		}

		if (options === undefined) {
			options = rvalue;
			rvalue = operator;
			operator = "===";
		}

		operators = {
			'==': function (l, r) { return l == r; },
			'===': function (l, r) { return l === r; },
			'!=': function (l, r) { return l != r; },
			'!==': function (l, r) { return l !== r; },
			'<': function (l, r) { return l < r; },
			'>': function (l, r) { return l > r; },
			'<=': function (l, r) { return l <= r; },
			'>=': function (l, r) { return l >= r; },
			'typeof': function (l, r) { return typeof l == r; }
		};

		if (!operators[operator]) {
			throw new Error("Handlebars Helper 'compare' doesn't know the operator " + operator);
		}

		result = operators[operator](lvalue, rvalue);

		if (result) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}

	},
	attr: function(value) {
		return _.kebabCase(value);
	},
  add: function(value, num) {
    return parseInt(value) + parseInt(num);
  },
	capitalize: function(value) {
		return _.capitalize(value);
	},
	concat: function(str1, str2) {
		return str1 + str2;
	},
  	concatMultiple: function(){
  		var s = '';
  		for(var i in arguments){
  			if( typeof arguments[i] != "object" ){
	  			s += arguments[i];
	  		}
  		}
  		return s;
  	},
	fileIconName: function(name) {
    var iconName;

    if (['word', 'excel', 'pdf', 'virtual'].indexOf(name) >= 0) {
      // If the name is a file type name, prefix it with "file-"
      iconName = 'file-' + name;
    } else {
      // Otherwise just use the name
      iconName = name;
    }

		return iconName;
	},
  getInitials: function(name) {
    var initials = '';

    if (name.length > 0) {
      var names = name.split(' ');
      names.forEach(name => { initials += name.charAt(0); });
    }

    return initials;
  },
  random: function(min, max) {
    if (!min) min = 0;
    if (!max) max = 1;
    return Math.floor(Math.random() * (max - min)) + min;
  },
  timestamp: function() {
    return Date.now();
  },
};
