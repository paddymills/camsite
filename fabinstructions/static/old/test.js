function test() {
  $('#job').val('1170001T');
  $('#ship').val('1');
  $('#sectiongroup').val('A-C');

  var $options = $('#fabBay').find('option');
  var random = Math.floor(Math.random() * $options.length - 1) + 1;
  $options.eq(random).prop('selected', true);

  $('#holes_table .holes, .splice').each(function() {
    var $options = $(this).find('option');
    var random = Math.floor(Math.random() * $options.length);
    $options.eq(random).prop('selected', true);
  });
  $('#holes_table .switch').each(function() {
    if (Math.random() * 2 >= 1) {
      this.click();
    }
  });
  $('#notes').val('job notes\ngo \n\nhere\n..');

  var notes = $('#notes').val();
}

$('#test').on('click', test);
