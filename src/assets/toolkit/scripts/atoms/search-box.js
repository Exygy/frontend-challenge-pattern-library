function init() {
  // Clear the search box when the close icon is clicked
  $('.search-box-close-icon').click(function() {
    $(this).parent().find('.search-box').val('');
  });
}

$(init);
