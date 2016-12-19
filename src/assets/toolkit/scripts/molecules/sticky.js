
// We store sticky elements by its parent scrollable ID
var stickyElems = {};

function init() {

}

function stick( elem ){
	if( !elem.length || elem.hasClass('mcs-sticky') ) return;

	var scrollable = elem.parents('.mCustomScrollbar');
	var scrollableId = scrollable.data('scrollable');

	// Add to sticky elements object
	// And if this is the first element that we are adding
	// for that scrollable object, register the scroll event
	if( !stickyElems[scrollableId] ){
		stickyElems[scrollableId] = [elem];
		scrollable.on('scroll', onScrollCheckStickies );
	}else{
		stickyElems[scrollableId].push(elem);
	}

	var positionElement = $("<div>");
	elem.before( positionElement );
	elem.data('positionElement', positionElement );
	elem.addClass('mcs-sticky');

	updateStickies( scrollableId, scrollable );
}

function unstick( elem ){
	if( !elem.length || !elem.hasClass('mcs-sticky') ) return;

	var scrollable = elem.parents('.mCustomScrollbar');
	var scrollableId = scrollable.data('scrollable');
	var elems;
	if( elems = stickyElems[scrollableId] ){
		for(var i in elems){
			if( elems[i].is(elem) ){
				stickyElems[scrollableId].splice(i,1);
				break;
			}
		}
	}
	elem.css('top', 0);
	elem.data('positionElement').remove();
	elem.data('positionElement', null);
	elem.removeClass('mcs-sticky').removeClass('mcs-sticked');

	updateStickies( scrollableId, scrollable );
}

function updateStickies( scrollableId, scrollable ) {
	var scrollTop = - parseInt( scrollable.find('> .mCustomScrollBox > .mCSB_container').css('top') );

	updateElems( scrollableId, scrollTop );
}

function onScrollCheckStickies( event, data ){
	var scrollableId = $(this).data('scrollable');
	var scrollTop = -data.top;

	updateElems( scrollableId, scrollTop );
}

function updateElems(scrollableId, scrollTop){
	for(var i in stickyElems[scrollableId]){
		var elem = stickyElems[scrollableId][i];
		var positionElement = elem.data('positionElement'); 
		var pos = positionElement.position().top;
		var top = Math.max(0, scrollTop-pos);

		elem.css('top', top );
		elem.toggleClass('mcs-sticked', top > 0 );
	}
}

module.exports.stick = stick;
module.exports.unstick = unstick;