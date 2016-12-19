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

  // When a reveal modal opens, scroll the overlay to the top so the reveal's close button doesn't go off-screen
  $('.reveal').on('open.zf.reveal', function() {
    $('.reveal-overlay').scrollTop(0);
  })

  $('.task-reveal').on('open.zf.reveal', function() {
    var title = $(this).find('.task-reveal-title');
    var subtitle = $(this).find('.task-reveal-subtitle');
    var assignee = $(this).find('.task-reveal-assignee');
    var date = $(this).find('.task-reveal-date');
    var revealAction = $(this).data('action');
    var taskRevealForm = $(this).find('.task-reveal-form');

    var activeCard = $('.task-card.is-active');
    var taskActionTitle = activeCard.find('.task-card-action').html();
    var taskActionRequiresSign = activeCard.find('.task-card-action').data('sign');

    // Remove leftover document list if present
    subtitle.next('.task-reveal-doc-list').remove();

    // Fill in reveal's title based on type of action
    var titleText;
    switch (revealAction) {
      case 'approve':
        titleText = 'Approve';
        if (taskActionRequiresSign) {
          titleText += ' and Sign';
        }
        break;
      case 'reject':
        titleText = 'Reject';
        if (taskActionRequiresSign) {
          titleText += ' and Sign';
        }
        break;
      case 'delegate':
        titleText = 'Delegate Task';
        break;
      default:
        titleText = 'Approve';
    }
    title.html(titleText);

    // Fill in subtitle with active task's document name or document count. Add doc list if there are multiple docs.
    var subtitleText;
    if (activeCard.find('.task-card-doc-list-title').length > 0) {
      subtitleText = '(' + activeCard.find('.task-card-doc-list-title').html() + ')';
      var docList = activeCard.find('.task-card-doc-list').clone().removeClass('task-card-doc-list').addClass('task-reveal-doc-list');
      subtitle.after(docList);
      docList.hide();
    } else {
      subtitleText = activeCard.find('.task-card-document').html();
    }
    subtitle.html(subtitleText);
    subtitle.show();

    // Fill in assignee and date with active task's assignee and date
    assignee.html(activeCard.find('.task-card-assignee').html());
    date.html(activeCard.find('.task-card-date').html());

    // Remove signing fields if the task action does not require signature
    var signatureFields = taskRevealForm.find('.task-reveal-signature-field');
    if (taskActionRequiresSign) {
      signatureFields.each(function() {
        $(this).removeAttr('disabled').attr('required', true).show();
      });
    } else {
      signatureFields.each(function() {
        $(this).removeAttr('required').attr('disabled', true).hide();
      });
    }
    updateSubmitButtonState(taskRevealForm);
  });

  // Set initial form submit button states on the task reveal forms
  $('.task-reveal-form').each(function() {
    updateSubmitButtonState($(this));
  });

	// Show the document list when the document count is clicked
	$('.task-reveal .task-reveal-subtitle').click(function() {
    var docList = $(this).next('.task-reveal-doc-list');
    if (docList.length > 0) {
      $(this).slideUp(500);
      docList.slideDown(300);
    }
	});

  // Update button state on task reveal form input updates
  $('.task-reveal-form input[required]').on('keyup', function() {
		updateSubmitButtonState($(this).closest('.task-reveal-form'));
  })
  // Update button state on task reveal form input updates
  $('.task-reveal-form select[required]').on('change', function() {
		updateSubmitButtonState($(this).closest('.task-reveal-form'));
  })
  
  // If the all tasks complete message is present on the page, and there are no task cards
  // on the page, show the all tasks complete message
  if ($('.task-complete-message.all').length > 0 && $('.task-card').length <= 0) {
    // Hide the main page contents
    $('.layout-main > *').hide();

    // Show the task completion area
    $('.task-complete').show();

    // Fade in the all tasks complete message
    $('.task-complete-message.all').fadeIn(600);
  }

  // When a doc listing is clicked, fill in the doc reveal with that listing's doc's details
  $('body').on('click', '.doc-listing', function() {
    var reveal = $('.doc-reveal');

    // Copy doc icon
    reveal.find('.doc-reveal-header-type').html($(this).find('.doc-listing-type').html());

    // Copy title and subtitle
    reveal.find('.doc-listing-title').html($(this).find('.doc-listing-title').html());
    reveal.find('.doc-listing-subtitle').html($(this).find('.doc-listing-subtitle').html());
  });

  // When a timeline item is clicked, fill in the doc reveal with the current document's details
  $('body').on('click', '.timeline-item', function() {
    var reveal = $('.doc-reveal');

    // Copy doc icon
    reveal.find('.doc-reveal-header-type').html($('.header-bar-icon.title-bar-icon').html());

    // Copy title and subtitle
    reveal.find('.doc-listing-title').html($('.title-bar-doc-title').html());
    reveal.find('.doc-listing-subtitle').html($('.title-bar-doc-subtitle-content').html());
  });

  // Toggle the doc reveal's properties accordion panel when either the more button or
  // the panel's close button is clicked. Reset the button when the reveal is closed.
  $('.doc-reveal-header-more, .doc-reveal-panel-close').click(function() {
    var reveal = $(this).closest('.doc-reveal');
    var revealPanel = reveal.find('.doc-reveal-panel');
    reveal.find('.doc-reveal-header-more .button').toggleClass('hollow secondary secondary-light');
    revealPanel.toggle();
  });

  $('.doc-reveal').on('closed.zf.reveal', function() {
    var revealPanel = $(this).find('.doc-reveal-panel');
    $(this).find('.doc-reveal-header-more .button').removeClass('secondary-light').addClass('hollow secondary');
    revealPanel.hide();
  });
}

$(init);
