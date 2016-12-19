var previousScrollPositions = {};

function stickyHeaders(container) {
  var containerTop = container.offset().top;
  var headers = container.find('.mCSB_container .set-group-header');

  headers.each(function(i, el) {
    var nameBase = $(this).data('name').substr(0, $(this).data('name').length - 1);
    var thisTop = $(this).offset().top;
    if (!previousScrollPositions[$(this).data('name')]) previousScrollPositions[$(this).data('name')] == thisTop;
    var previousScrollPosition = previousScrollPositions[$(this).data('name')];

    if (i > 0) {
      var prevHeaderClone = $('header[data-name=' + nameBase + (i - 1) + '-clone]');
      var prevHeaderCloneHeight = prevHeaderClone.outerHeight();
    }

    if (!$(this).hasClass('is-stuck')) {
      if (thisTop <= containerTop) {
        // "Stick" the header by creating a clone of it that will sit at the top of the container
        var clonedHeader = $(this).clone().attr('data-name', $(this).data('name') + '-clone');
        clonedHeader.css('position', 'absolute');
        clonedHeader.css('top', 0);
        clonedHeader.css('z-index', 50 + i);
        container.prepend(clonedHeader);
        $(this).addClass('is-stuck');
      } else if (i > 0) {
        // If user is scrolling up and the top of this header is between the bottom of the previous
        // header clone and the top of the container, slide up the previous header clone so it
        // looks like this header is pushing it out of the way as it scrolls up
        if (previousScrollPosition > thisTop && thisTop <= (containerTop + prevHeaderCloneHeight) && thisTop >= containerTop) {
          prevHeaderClone.slideUp(300);
        }
      }
    } else if ($(this).hasClass('is-stuck') && thisTop > containerTop) {
      // If this header had been "stuck" by having a clone made of it, when it gets
      // scrolled below the  container top, "unstick" it by deleting its clone.
      $('header[data-name=' + $(this).data('name') + '-clone]').remove();
      $(this).removeClass('is-stuck');

      // If there is a previous header clone, show that header clone
      if (i > 0) prevHeaderClone.slideDown(200);
    }

    previousScrollPositions[$(this).data('name')] = thisTop;
  });
}

module.exports = { stickyHeaders: stickyHeaders };
