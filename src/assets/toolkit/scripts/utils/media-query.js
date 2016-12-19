
var $ = require('jquery');
var mq = Foundation.MediaQuery;

var noMatchArray = [];
var matchArray = [];
var items = [];

$(window).on('changed.zf.mediaquery', function(event, newSize, oldSize){
	breakpointChanged( newSize );
});

function breakpointChanged( newSize ){

	noMatchArray = [];
	matchArray = [];

	for(var i in items){

		var item = items[i];

		if( item.modifier == 'down' ){

			if( mq.atLeast(item.breakpoint) && newSize != item.breakpoint ){
				noMatchArray.push( item.noMatch );
			}else{
				matchArray.push( item.match );
			}

		}else if( item.modifier == 'only' ){

			if( newSize == item.breakpoint ){
				matchArray.push( item.match );
			}else{
				noMatchArray.push( item.noMatch );;
			}

		}else {

			if( mq.atLeast(item.breakpoint) ){
				matchArray.push( item.match );
			}else{
				noMatchArray.push( item.noMatch );
			}

		}
	}

	for(var i in noMatchArray){
		noMatchArray[i]();
	}

	for(var i in matchArray){
		matchArray[i]();
	}

}

function empty(){};

function on( query, match, noMatch ){
	var on = query.split(" ");
	var breakpoint = on[0];
	var modifier = on[1];

	items.push({
		breakpoint: on[0],
		modifier: on[1],
		match: match || empty,
		noMatch: noMatch || empty
	});

	setTimeout(function(){
		run();
	},100);
}

function run() {
	breakpointChanged( mq.current );
}

module.exports = { on: on, run: run };
