var holeOptions = [
  {value: 'none', text: ''},
  {value: 'farley', text: 'Farley'},
  {value: 'ficep', text: 'FICEP'},
  {value: 'drill_template', text: 'Drill Template'},
  {value: 'drill_from_solid', text: 'Drill from Solid'},
  {value: 'burn', text: 'Burn Holes'}
];
var spliceOptions = [
  {value: 'none', text: ''},
  {value: 'slab', text: 'Slab Welded'}
];
var fabBays = [
  {value: 'none', text: 'Fabrication Bay'},
  {value: 'plt1', text: 'Plant 1'},
  {value: 'plt2n', text: 'Plant 2 - North'},
  {value: 'plt2s', text: 'Plant 2 - South'},
  {value: 'plt3n', text: 'Plant 3 - North'},
  {value: 'plt3s', text: 'Plant 3 - South'}
];
var plates = ['Web', 'TF', 'BF'];
var locations = ['lhe', 'rhe', 'misc'];

function initialize() {
  var showDuration = 1500;
  var fadeDuration = 500;
  $('.left, .right, .fadeHidden').hide();
  $('.right').show(showDuration);
  $('.left').show(showDuration, function() {
    $('.fadeHidden').fadeIn(fadeDuration);

    setOptions('.holes', holeOptions);
    setOptions('.splice', spliceOptions);
    setOptions('.bay', fabBays);
    $('#webSplice').append(new Option('Bevel', 'bevel'));
    $('.bay option[value="none"]').attr('disabled',true);
    addHoleSets();

    $('.fsh').each(function() {
      var elem = $(this);
      setTimeout(function() {
        elem.toggleClass('toggleSelected');
      }, 125);
    });

    $('#global_lhe').toggleClass('toggleSelected');
    $('#global_rhe').toggleClass('toggleSelected');
  });
}

function setOptions(itemClass, options) {
  $(itemClass).each(function() {
    for (x in options) {
      this.append(new Option(options[x].text, options[x].value));
    }
  });
}

function addHoleSets() {
  for (plate in plates) {
    for (loc in locations) {
      var plateLoc = locations[loc] + plates[plate];
      var copy = $('#global_hole_selection').clone(true);
      copy.attr('id', plateLoc)
      copy.children().eq(0).attr('id', plateLoc + 'HoleMethod');
      copy.children().eq(2).attr('id', plateLoc + 'HoleSize_fsh');
      copy.children().eq(3).attr('id', plateLoc + 'HoleSize_ra');
      $('.' + locations[loc]).append(copy);
    }
  }
}

$(document).ready(initialize);
