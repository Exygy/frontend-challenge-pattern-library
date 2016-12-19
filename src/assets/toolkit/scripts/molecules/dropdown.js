function init() {
  $('.dropdown-pane.sort li').click(function(){
    var dropdown = $(this).parent().parent();
    var dropdownToggle = $('[data-toggle=' + dropdown.attr('id') + ']');
    var selected = $(this);
    var selectedValue = $(this).find('a').html();

    // Replace current sort option with selected option
    dropdownToggle.find('.dropdown-sort-value').html(selectedValue);

    // Make selected option active in options list
    selected.siblings().removeClass('is-active');
    selected.addClass('is-active');

    dropdown.foundation('close');
  });

  $('.dropdown-pane.panel li').click(function(){
    var dropdown = $(this).parent().parent();
    dropdown.foundation('close');
  });
}

$(init);
