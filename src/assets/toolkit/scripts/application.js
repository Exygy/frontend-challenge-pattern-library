/**
 * Application JavaScript
 */

'use strict';

// Components
require('./molecules/browse.js');
require('./molecules/dropdown.js');
require('./molecules/mobile-nav.js');
require('./molecules/reveal.js');
require('./molecules/sticky.js');

$(document).ready(function () {
	$(document).foundation();
});
