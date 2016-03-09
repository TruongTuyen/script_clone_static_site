function flash(url,w,h){str='<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" width="'+w+'" height="'+h+'" id="tech" align="middle">';str=str+'<param name="allowScriptAccess" value="sameDomain" /><param name="WMode" value="Transparent" />';str=str+'<param name="movie" value="'+url+'" /><param name="quality" value="high" />';str=str+'<embed wmode="transparent" src="'+url+'" quality="high" width="'+w+'" height="'+h+'" name="tech" align="middle" allowScriptAccess="sameDomain" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />';str=str+'</object>';document.write(str);}
function video(str){document.getElementById('dvdeo').style.display = 'block';document.getElementById("dvdeo").innerHTML='<div class="dvd"><div class="t"><a href="javascript:clvideo();"></a></div><div class="f"><object width="640px" height="480px"><param name="movie" value="http://www.youtube.com/v/'+str+'?version=3&amp;hl=vi_VN&amp;rel=0&autoplay=1"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/'+str+'?version=3&amp;hl=vi_VN&amp;rel=0&autoplay=1" type="application/x-shockwave-flash" width="640px" height="480px" allowscriptaccess="always" allowfullscreen="true"></embed></object></div></div><div style="opacity:0.7;" id="bgpopup"></div>';}
function clvideo(){document.getElementById('dvdeo').style.display = 'none';document.getElementById("dvdeo").innerHTML='';}
function videoh(str,w,h){document.getElementById("lvd").innerHTML='<object width="'+w+'px" height="'+h+'px"><param name="movie" value="http://www.youtube.com/v/'+str+'?version=3&amp;hl=vi_VN&amp;rel=0&autoplay=1"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/'+str+'?version=3&amp;hl=vi_VN&amp;rel=0&autoplay=1" type="application/x-shockwave-flash" width="'+w+'px" height="'+h+'px" allowscriptaccess="always" allowfullscreen="true"></embed></object>';}
(function(d, s, id) {var js, fjs = d.getElementsByTagName(s)[0];if (d.getElementById(id)) return;js = d.createElement(s); js.id = id;js.src = "//connect.facebook.net/vi_VN/all.js#xfbml=1";fjs.parentNode.insertBefore(js, fjs);}(document, 'script', 'facebook-jssdk'));
!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
window.___gcfg = {lang: 'vi'};(function() {var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;po.src = 'https://apis.google.com/js/plusone.js';var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);})();
function tabp(id,i,div){
    document.getElementById('ud1').className = "u"+id;
    document.getElementById('dp1').style.display = 'none';
    document.getElementById('dp2').style.display = 'none';
    document.getElementById('dp3').style.display = 'none';
    document.getElementById('dp4').style.display = 'none';
    document.getElementById('dp'+id).style.display = 'block';
//    if (id==3){$(div).load('/js/inckm.aspx?i='+i);}
}
function tabd(){
    window.scrollTo(0,450);
    document.getElementById('ud1').className = "u2";
    document.getElementById('dp1').style.display = 'none';
    document.getElementById('dp3').style.display = 'none';
    document.getElementById('dp4').style.display = 'none';
    document.getElementById('dp2').style.display = 'block';
}

ij=0;
function delt(div,id,mid,p){if (ij==0){document.getElementById('a2').style.fontWeight = 'normal';document.getElementById('aa2').style.fontWeight = 'normal';}else{document.getElementById('a'+ij).style.fontWeight = 'normal';document.getElementById('aa'+ij).className = "n";}ij=p;document.getElementById('a'+p).style.fontWeight = 'bold';document.getElementById('aa'+p).className = "s";$(div).load('/js/incpro.aspx?id='+id+'&m='+mid+'&p='+p);}
function delt1(div,id,mid,p){$(div).load('/js/incpro.aspx?id='+id+'&m='+mid+'&p='+p);}