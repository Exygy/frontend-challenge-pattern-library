var mediaQuery = require('../utils/media-query.js');

function init() {

	// On click of the toggler ( hamburger menu icon ) ..
	$('.nav-mobile-toggler').on('click', function(){
		// Toggle the 'nav-mobile-open' class on the top-bar element
		$('.top-bar').toggleClass('nav-mobile-open');
	});

	// When we go to large screen size ..
	mediaQuery.on('large', function(){
		// 'Close' the mobile menu
		$('.top-bar').removeClass('nav-mobile-open');
	});

}

$(init);
