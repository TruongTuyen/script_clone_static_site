var zone_id =2;

var time_delay=5;
if(zone_id==2){
time_delay=5;
}
jQuery(document).ready(function() {
jQuery("#adv2").jcarousel({
auto: time_delay, //thoi gian auto
scroll: 3,  //so anh cuon
buttonNextHTML: null,
buttonPrevHTML: null,
wrap: 'circular',
initCallback: mycarousel_initCallback2
});
});
function mycarousel_initCallback2(carousel) {

jQuery('#next2').bind('click', function() {
carousel.next();
return false;
});

jQuery('#back2').bind('click', function() {
carousel.prev();
return false;
});
}
;
