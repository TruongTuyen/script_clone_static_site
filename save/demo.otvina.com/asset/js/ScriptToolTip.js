
var offsetfromcursorXX=12 //Customize x offset of tooltip
var offsetfromcursorYY=10 //Customize y offset of tooltip

var offsetdivfrompointerXX=10 //Customize x offset of tooltip DIV relative to pointer image
var offsetdivfrompointerYYY=14 //Customize y offset of tooltip DIV relative to pointer image. Tip: Set it to (height_of_pointer_image-1).

document.write('<div id="dhtmltooltipMK"></div>') //write out tooltip DIV
document.write('<div id="dhtmlpointerMK"></div>') //write out pointer image
document.write('<div id="dhtmltooltip"></div>') //write out tooltip DIV
document.write('<div id="dhtmlpointer"></div>') //write out pointer image

var ie			= document.all
var ns6			= document.getElementById && !document.all
var enabletipMK	= false
var enabletip	= false
if (ie||ns6)
var tipobjMK = document.all? document.all["dhtmltooltipMK"] : document.getElementById? document.getElementById("dhtmltooltipMK") : ""
var tipobj = document.all? document.all["dhtmltooltip"] : document.getElementById? document.getElementById("dhtmltooltip") : ""

var pointerobjMK =document.all? document.all["dhtmlpointerMK"] : document.getElementById? document.getElementById("dhtmlpointerMK") : ""
var pointerobj =document.all? document.all["dhtmlpointer"] : document.getElementById? document.getElementById("dhtmlpointer") : ""

function ietruebodyMK(){
return (document.compatMode && document.compatMode!="BackCompat")? document.documentElement : document.body
}

function mtln(thetext, thewidth, thecolor){
document.onmousemove = positiontipMK
if (ns6||ie){
if (typeof thewidth!="undefined") tipobjMK.style.width = thewidth + "px"
if (typeof thecolor!="undefined" && thecolor!="") tipobjMK.style.backgroundColor=thecolor
tipobjMK.innerHTML = thetext
enabletipMK = true
return false
}
}

function ddrivetip(thetext, thewidth, thecolor){
document.onmousemove = positiontip
if (ns6||ie){
if (typeof thewidth!="undefined") tipobj.style.width = thewidth + "px"
if (typeof thecolor!="undefined" && thecolor!="") tipobj.style.backgroundColor=thecolor
tipobj.innerHTML = thetext
enabletip = true
return false
}
}

function positiontipMK(e){
if (enabletipMK){
var nondefaultposMK = false
var curXMK=(ns6)?e.pageX : event.clientX+ietruebodyMK().scrollLeft;
var curYMK=(ns6)?e.pageY : event.clientY+ietruebodyMK().scrollTop;
//Find out how close the mouse is to the corner of the window
var winwidthMK	= ie&&!window.opera? ietruebodyMK().clientWidth : window.innerWidth-20
var winheightMK	= ie&&!window.opera? ietruebodyMK().clientHeight : window.innerHeight-20

var rightedgeMK		= ie&&!window.opera? winwidthMK-event.clientX-offsetfromcursorXX : winwidthMK-e.clientX-offsetfromcursorXX
var bottomedgeMK	= ie&&!window.opera? winheightMK-event.clientY-offsetfromcursorYY : winheightMK-e.clientY-offsetfromcursorYY

var leftedgeMK = (offsetfromcursorXX<0)? offsetfromcursorXX*(-1) : -1000

//if the horizontal distance isn't enough to accomodate the width of the context menu
if (rightedgeMK < tipobjMK.offsetWidth){
//move the horizontal position of the menu to the left by it's width
tipobjMK.style.left = curXMK-tipobjMK.offsetWidth + "px"
nondefaultposMK = true
}
else if (curXMK < leftedgeMK)
tipobjMK.style.left = "5px"
else{
//position the horizontal position of the menu where the mouse is positioned
tipobjMK.style.left = curXMK+offsetfromcursorXX+"px"
pointerobjMK.style.left = curXMK+offsetfromcursorXX+"px"
}

//same concept with the vertical position
if (bottomedgeMK < tipobjMK.offsetHeight){
tipobjMK.style.top = curYMK - tipobjMK.offsetHeight - offsetfromcursorYY + "px"
nondefaultposMK = true
}
else{
tipobjMK.style.top		= curYMK + offsetfromcursorYY + "px"
pointerobjMK.style.top	= curYMK + offsetfromcursorYY + "px"
}
tipobjMK.style.visibility = "visible"
if (!nondefaultposMK)
pointerobjMK.style.visibility = "visible"
else
pointerobjMK.style.visibility = "hidden"
}
}

function positiontip(e){
if (enabletip){
var nondefaultpos = false
var curX=(ns6)?e.pageX : event.clientX+ietruebodyMK().scrollLeft;
var curY=(ns6)?e.pageY : event.clientY+ietruebodyMK().scrollTop;
//Find out how close the mouse is to the corner of the window
var winwidth	= ie&&!window.opera? ietruebodyMK().clientWidth : window.innerWidth-20
var winheight	= ie&&!window.opera? ietruebodyMK().clientHeight : window.innerHeight-20

var rightedge		= ie&&!window.opera? winwidth-event.clientX-offsetfromcursorXX : winwidthMK-e.clientX-offsetfromcursorXX
var bottomedge	= ie&&!window.opera? winheight-event.clientY-offsetfromcursorYY : winheightMK-e.clientY-offsetfromcursorYY

var leftedge = (offsetfromcursorXX<0)? offsetfromcursorXX*(-1) : -1000

//if the horizontal distance isn't enough to accomodate the width of the context menu
if (rightedge < tipobj.offsetWidth){
//move the horizontal position of the menu to the left by it's width
tipobj.style.left = curX-tipobj.offsetWidth + "px"
nondefaultpos = true
}
else if (curX < leftedge)
tipobj.style.left = "5px"
else{
//position the horizontal position of the menu where the mouse is positioned
tipobj.style.left = curX+offsetfromcursorXX+"px"
pointerobj.style.left = curX+offsetfromcursorXX+"px"
}

//same concept with the vertical position
if (bottomedge < tipobj.offsetHeight){
tipobj.style.top = curY - tipobj.offsetHeight - offsetfromcursorYY + "px"
nondefaultpos = true
}
else{
tipobj.style.top		= curY + offsetfromcursorYY + "px"
pointerobj.style.top	= curY + offsetfromcursorYY + "px"
}
tipobj.style.visibility = "visible"
if (!nondefaultpos)
pointerobj.style.visibility = "visible"
else
pointerobj.style.visibility = "hidden"
}
}

function mtlh(){
if (ns6||ie){
enabletipMK = false
tipobjMK.style.visibility		= "hidden"
pointerobjMK.style.visibility	= "hidden"
tipobjMK.style.left	 = "-1000px"
tipobjMK.style.backgroundColor	= ''
tipobjMK.style.width = ''
}
}

function hideddrivetip(){
if (ns6||ie){
enabletip = false
tipobj.style.visibility		= "hidden"
pointerobj.style.visibility	= "hidden"
tipobj.style.left	 = "-1000px"
tipobj.style.backgroundColor	= ''
tipobj.style.width = ''
}
}

