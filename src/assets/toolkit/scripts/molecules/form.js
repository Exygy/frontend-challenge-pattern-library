function init() {
  // Activate a form's submit button when all required form fields are filled out and
  // deactivate when all required form fields are not filled out
  function updateSubmitButtonState(form) {
    var disableSubmit = false;
    var submitButton = form.find('button[type=submit]');

    form.find('input[required], select[required]').each(function() {
      if (!$(this).val()) {
        disableSubmit = true;
        return false;
      }
    });

    disableSubmit ? submitButton.attr('disabled', '') : submitButton.removeAttr('disabled');
  }

  // Initially set form button states
  $('form').each(function() {
    updateSubmitButtonState($(this));
  });

  // Update button state on login form input updates
  $('.login-box-form input[required]').on('keyup change', function() {
		updateSubmitButtonState($(this).closest('.login-box-form'));
  })
}

$(init);
