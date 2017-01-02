/**
 * Application JavaScript
 */

'use strict';

// Components
require('./atoms/search-box.js');
require('./molecules/browse.js');
require('./molecules/form.js');
require('./molecules/mobile-nav.js');

$(document).ready(function () {
	$(document).foundation();
});
