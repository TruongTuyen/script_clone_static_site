var zone_id =2;

var time_delay=20;
if(zone_id==2){
time_delay=20;
}
jQuery(document).ready(function() {
jQuery("#adv1").jcarousel({
auto: time_delay, //thoi gian auto
scroll: 1,  //so anh cuon
buttonNextHTML: null,
buttonPrevHTML: null,
wrap: 'circular',
initCallback: mycarousel_initCallback1
});
});
function mycarousel_initCallback1(carousel) {

jQuery('#next1').bind('click', function() {
carousel.next();
return false;
});

jQuery('#back1').bind('click', function() {
carousel.prev();
return false;
});
}
;
