$(document).on('click', '.program', function() {
  var prog = $(this).find('>:first-child').html();
  $.ajax({
    url : 'getProgramData/',
    type : 'GET',
    data : { program : prog },

    success : function(render) {
      $('.temporary').remove();
      $('body').append(render);
      $(document).click(function() {
        $('.temporary').remove();
      });
    },

    error : function(xhr, errmsg, err) {
      console.log('error occurred');
    }
  });
});
