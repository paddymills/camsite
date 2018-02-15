var headers = [
  'job', 'ship', 'sectiongroup', 'fabBay',
  'lheWebHoleMethod', 'lheWebHoleSize',
  'rheWebHoleMethod', 'rheWebHoleSize',
  'miscWebHoleMethod', 'miscWebHoleSize',
  'lheTFHoleMethod', 'lheTFHoleSize',
  'rheTFHoleMethod', 'rheTFHoleSize',
  'miscTFHoleMethod', 'miscTFHoleSize',
  'lheBFHoleMethod', 'lheBFHoleSize',
  'rheBFHoleMethod', 'rheBFHoleSize',
  'miscBFHoleMethod', 'miscBFHoleSize',
  'webSplice', 'bfSplice', 'tfSplice',
];


function globalSet() {
  var op = $('#global_holes').val();
  var fsh = $('#global_fsh').hasClass('toggleSelected');

  for (var girderEnd of ['lhe', 'rhe']) {
    if ($('#global_' + girderEnd).hasClass('toggleSelected')) {
      for (var x=1; x<4; x++) {
        setHoleOptions(op, fsh, $('.' + girderEnd).children().eq(x).children());
      }
    }
  }
}

function setHoleOptions(method, fsh, parentSelector) {
  parentSelector.eq(0).val(method);
  // <br> is .eq(1)
  if (parentSelector.eq(2).hasClass('toggleSelected') !== fsh) {
    parentSelector.eq(2).toggleClass('toggleSelected');
    parentSelector.eq(3).toggleClass('toggleSelected');
  }
}

function getHoleData(parentSelector) {
  if (parentSelector.eq(2).hasClass('toggleSelected') == true) {
    return {method: parentSelector.eq(0).val(), size: 'FSH'};
  } else {
    return {method: parentSelector.eq(0).val(), size: 'RA'};
  }
}

function clear() {
  $('body').fadeTo(125, 0.25, function() {
    $('textarea').val('');
    $('select').each(function() {
      $(this).find('option').eq(0).prop('selected', true);
    });
    $('.fsh, .toggle').each(function() {
      if ($(this).hasClass('toggleSelected') != true) {
        this.click();
      }
    });
    $('body').fadeTo(125, 1.0);
  });
}

function submit() {
  var re = new RegExp('^([0-9]+)([a-zA-Z]*)$');
  // check input

  var match = $('#job').val().match(re);
  $('#proceed').on('click', function() {
    $('.popup').fadeOut(250);
  });
  if (match == null || match.input !== match[1] + match[2]) {
    popup('Job number does not match expected format; 7-digit number followed by structure letter');
  } else if (match[1].length !== 7) {
    popup('Job number does not meet 7 digit expected format');
  } else if (match[2].length !== 1) {
    popup('Job structure letter is not given or is not 1 character long');
  } else if ($('#ship').val().match('^[0-9]+$') == null) {
    popup('Shipment number is not given or is not number');
  } else if ($('#fabBay').val() == null) {
    popup('No fabrication bay selected');
  } else {
    $('#proceed p').text('Submit');
    popup('Enter your name', true);

    // for testing
    $('.popup_input').val('pm-test');
    $('#proceed').removeClass('disabledButton');

    $('#proceed').off('click').on('click', function() {
      if ($(this).hasClass('disabledButton')) {
        $('.popup_input').effect('pulsate', {times: 5}, 500);
        $('.popup_input').select();
      } else {
        // fetch data
        var data = {
          'callFunc': 'submit',
          'submittedBy': $('.popup_input').val(),
          'submittedDateTime': new Date().toLocaleString()
        };
        for (var header of headers) {
          if (header.slice(-8) === 'HoleSize') {
            if ($('#' + header + '_fsh').hasClass('toggleSelected')) {
              data[header] = 'FSH';
            } else {
              data[header] = 'RA';
            }
          } else {
            data[header] = $('#' + header).val();
          }
        }
        data['Notes'] = $('#notes').val();

        $.ajax({
          url: 'cgi-bin/fetch.py',
          type: 'GET',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          data: data,
          success: function(response) {
            console.log(response.data);
          }
        });
        $('.blanket, .popup').css({visibility: 'hidden'});
      }
    });

  }
}

function load() {
  $.ajax({
    url: 'cgi-bin/fetch.py',
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    data: {'callFunc': 'load'},
    success: function(response) {
      var submittals = response.data;
      // code to fill dropdown box with submittals for selection
      for (var submitted of submittals) {
        var $last = $('<tr></tr>').appendTo('.load tbody');
        $('<td class="loadID"></td>').append(submitted.ID).appendTo($last);
        $('<td class="loadJob"></td>').append(submitted.Job).appendTo($last);
        $('<td class="loadShip"></td>').append(submitted.Shipment).appendTo($last);
        $('<td class="loadSection"></td>').append(submitted.Section).appendTo($last);
        $('<td class="loadSubmitBy"></td>').append(submitted.submittedBy).appendTo($last);
        $('<td class="loadDateTime"></td>').append(submitted.submittedDateTime).appendTo($last);
      }

      $('.load').css({visibility: 'visible'});
      $('#loadSubmittal').addClass('disabledButton');
      $('.load').fadeIn(250);
      $('.load tbody tr').on('click', function() {
        $('.load tbody tr').each(function() {
          $(this).removeClass('selectedRow');
        })
        $(this).addClass('selectedRow');
        var id = $(this).children().eq(0).html();
        $('#loadSubmittal').removeClass('disabledButton');
        $('#loadSubmittal').off('click').on('click', function() {
          $.ajax({
            url: 'cgi-bin/fetch.py',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: {'callFunc': 'loadSubmittal', 'ID': id},
            success: function(response) {
              clearLoad();
              // fill out form
              var entry = response.data[0];
              for (var header of headers) {
                if (header.slice(-8) === 'HoleSize') {
                  if (!$('#' + header + '_' + entry[header].toLowerCase()).hasClass('toggleSelected')) {
                    $('#' + header + '_fsh').toggleClass('toggleSelected');
                    $('#' + header + '_ra').toggleClass('toggleSelected');
                  }
                } else {
                  $('#' + header).val(entry[header]);
                }
              }
              $('#notes').val(entry.Notes);
            }
          });
        });
      });
    }
  });
}

function clearLoad() {
  $('.load').fadeOut(250);
  for (var x=$('.load tbody').children().length; x>=0; x--) {
    $('.load tbody').children().eq(0).detach();
  }
}

function popup(para, input) {
  $('.popup').css({visibility: 'visible'});
  $('.popup_para').text(para);
  $('.popup').fadeIn(250);
  if (input != true) {
    $('.popup_input').hide();
  } else {
    $('.popup_input').show();
    $('.popup_input').val('');
    $('.popup_input').select();
    $('#proceed').addClass('disabledButton');
  }
}

$('#set_global').on('click', globalSet);
$('#clear').on('click', clear);
$('#load').on('click', load);
$('#submit').on('click', submit);
$('#escape').on('click', function() {
  $('.popup').fadeOut(250);
});
$('#cancel').on('click', clearLoad);

$('.switch').on('click', function() {
  $(this).toggleClass('toggleSelected');
  if ($(this).hasClass('fsh')) {
    $(this).next().toggleClass('toggleSelected');
  } else if ($(this).hasClass('ra')) {
    $(this).prev().toggleClass('toggleSelected');
  }
});

$('.popup_input').on('change keyup paste', function() {
  if ($('.popup_input').val() === '') {
    $('#proceed').addClass('disabledButton');
  } else {
    $('#proceed').removeClass('disabledButton');
  }
});
