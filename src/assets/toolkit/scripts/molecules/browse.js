function init() {
  // Load child items from an accordion item into the stage in slat format
  function loadIntoStage(item, page=null) {
    var newSlat, type, typeIcon, attrs;
    var children = item.find('> .browse-accordion-content > .browse-accordion > .browse-accordion-item, > .browse-accordion-item');
    var slatTemplate = $('.browse-slat-template .slat').eq(0);
    var browseSlatSet = $('.browse-stage .browse-slat-set');

    if (!item) return false;

    // Clear the stage
    browseSlatSet.html('');

    // Add a slat for each child item in the current page
    var min = 0;
    var max = 25;
    if (page) {
      min = (page - 1) * 25;
      max = page * 25;
    }
    children.slice(min, max).each(function() {
      type = $(this).data('type');
      newSlat = slatTemplate.clone();
      if ($(this).data('directory-id')) newSlat.attr('data-ref', $(this).data('directory-id'));
      newSlat.addClass(type);
      typeIcon = newSlat.find('.slat-avatar .ui-icon');
      typeIcon.find('use').attr('xlink:href', '#i-' + ($(this).hasClass('file') ? 'file-' : '') + type);
      typeIcon.addClass('i-' + type);

      attrs = $(this).data('attrs');
      if (attrs) {
        var slatAttrWrappers = newSlat.find('.slat-attr-wrapper').toArray();
        $.each(attrs, function(k, v) {
          var wrapper = slatAttrWrappers.shift();
          $(wrapper).find('.slat-attr-key').html(k + ':');
          $(wrapper).find('.slat-attr-value').html(v);
        });

        // Remove unused attribute slots
        $.each(slatAttrWrappers, function() {
          $(this).remove();
        });
      }

      // Set the slat title. If the child item has a subtitle, use it to set slat's subtitle; otherwise,
      // remove the subtitle from the slat.
      newSlat.find('.slat-header').html($(this).find('.browse-accordion-title-text').html());
      if ($(this).data('subtitle')) {
        newSlat.find('.slat-subtitle-text').html($(this).data('subtitle'));
      } else {
        newSlat.find('.slat-subtitle').remove();
      }

      browseSlatSet.append(newSlat);
    });

    // If there are more than 25 items, fill out and show the pagination elements
    var paginations = $('.browse-stage .pagination');
    if (children.length > 25) {
      paginations.each(function() {
        pagination.updatePaginationState($(this), (page ? page : 1), Math.ceil(children.length / 25));
      });
      paginations.show();
    } else {
      paginations.hide();
    }
    // Update stage title
    var itemTitle = item.find('.browse-accordion-title-text').first().html();
    $('.browse-stage-header .header-bar-title').html(itemTitle);

    // Mark the item as the currently displayed item
    $('.browse-accordion-item').removeClass('displayed');
    item.addClass('displayed');

    updateBreadcrumbs();

    // Track browse page state via cookie
    if (item.data('directory-id')) {
      window.Cookies.set('lastBrowseDirectoryID', item.data('directory-id'), {path: ''});
    }
  }

  function openAccordionTo(item) {
    if (!item) return false;

    // Accept both directory ID and accordion item object
    if (!item.jquery) {
      item = $('.browse-accordion-item[data-directory-id=' + item + ']');
    }

    item.parents('.browse-accordion-item').each(function() {
      $(this).parent().foundation('down', $(this).find('> .browse-accordion-content'));
    });

    item.parent().foundation('down', item.find('> .browse-accordion-content'));
    item.parent().foundation('down', item.find('> .browse-accordion-content'));
  }

  function updateBreadcrumbs() {
    var breadcrumbs = $('.browse-breadcrumbs');
    var currentlyDisplayedItem = $('.browse-accordion-item.displayed');
    var screenReaderCurrentText = breadcrumbs.find('li span.show-for-sr').detach();
    var divider = $('.breadcrumbs-divider-template').html();

    // Clear the breadcrumb items
    breadcrumbs.children('li').remove();

    var path = currentlyDisplayedItem.parents('.browse-accordion-item').toArray().reverse();
    path.push(currentlyDisplayedItem);

    $.each(path, function(i) {
      var itemTitle = $(this).find('.browse-accordion-title-text').html();
      breadcrumbs.children('li').last().append(divider);
      var newBreadcrumb = $('<li>');
      if (i < path.length - 1) {
        newBreadcrumb.append($('<a>').attr('data-ref', $(this).data('directory-id')).html(itemTitle));
      } else {
        newBreadcrumb.html(itemTitle)
      }
      breadcrumbs.append(newBreadcrumb);
    });

    breadcrumbs.children('li').last().prepend(screenReaderCurrentText);
  }

  // On page load, load the approprate cabinet or folder into the browse stage
  if ($('.browse-accordion').length > 0) {
    var initialAccordionItem;
    if (window.Cookies.get('lastBrowseDirectoryID')) {
      // There is a cookie with saved information about the last directory that was browsed to - use that directory.
      initialAccordionItem = $('.browse-accordion-item[data-directory-id=' + window.Cookies.get('lastBrowseDirectoryID') + ']');
    } else {
      // No cookie. Use the first accordion item.
      initialAccordionItem = $('.browse-accordion-item').first();
      initialAccordionItem.addClass('is-active');
    };

    var setAccordionState = setInterval(function() {
      if (initialAccordionItem.parent().attr('data-accordion')) {
        loadIntoStage(initialAccordionItem);
        openAccordionTo(initialAccordionItem);
        clearInterval(setAccordionState);
      }
    }, 200);
  }

  // When a browse accordion item is clicked, load its contents into the stage
  $('body').on('click', '.browse-accordion-title', function(e) {
    var arrowSelectors = '.browse-accordion-arrow-wrapper, .browse-accordion-arrow, .browse-accordion-arrow svg, .browse-accordion-arrow use';

    if (!$(e.target).is(arrowSelectors)) {
      // If anything but the the arrow was clicked, load item's contents into stage
      loadIntoStage($(this).closest('.browse-accordion-item'));
    }
  });

  // When a breadcrumb nav item or a slat is clicked, load the corresponding accordion item's
  // contents into the stage and open the accordion to that item
  $('body').on('click', '.browse-breadcrumbs a', function() {
    var directoryId = $(this).data('ref');

    if (directoryId) {
      var accordionItem = $('.browse-accordion-item[data-directory-id=' + directoryId + ']');

      if (accordionItem && accordionItem.length > 0) {
        loadIntoStage(accordionItem);
        openAccordionTo(accordionItem);
      }
    }
  });

  // When a directory slat is double-clicked, load the corresponding accordion item's
  // contents into the stage and open the accordion to that item
  $('body').on('dblclick', '.browse-slat-set .slat.cabinet, .browse-slat-set .slat.folder', function() {
    var directoryId = $(this).data('ref');

    if (directoryId) {
      var accordionItem = $('.browse-accordion-item[data-directory-id=' + directoryId + ']');

      if (accordionItem && accordionItem.length > 0) {
        loadIntoStage(accordionItem);
        openAccordionTo(accordionItem);
      }
    }
  });

  // When a slat is clicked, if it is a directory slat, highlight it. Unhighlight all other
  // slats regardless of whether this slat is a directory or file.
  $('body').on('click', '.browse-slat-set .slat', function() {
    if ($(this).hasClass('cabinet') || $(this).hasClass('folder')) {
      $(this).addClass('active');
    } else {
      slidingPanels.openSlide('document');
    }

    $(this).siblings('.slat').removeClass('active');
  });

  // Make the browse stage pagination navigate between pages of an item's children
  $('.browse-stage .pagination').on('pagination:navigate', function() {
    if ($(this).attr('display') != 'none') {
      var currentPage = parseInt($(this).find('.pagination-current').val());
      loadIntoStage($('.browse-accordion-item.displayed').first(), currentPage);
    }
  });

  // We may need a better way to reference those items ( ? )
  $('.viewer-bar-more [data-page-tab]').on('click', function(e){
    // When clicking to a document more button, go to properties
    slidingPanels.openSlide('document-properties');
  });
}

module.exports.init = init;
