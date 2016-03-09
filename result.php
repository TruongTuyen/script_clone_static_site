<?php
session_start();
error_reporting(0);

$url = $_SESSION['url'];
$folder = $_SESSION['folder'];

if(!$url || !$folder){
    header('location: index.php');
}

?>
<!DOCTYPE html>
<html lang="vi">
    <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=1" name="viewport" />
        <link href="http://nguyenduchanh.com/css-spider/" rel="canonical" />
        <meta content="index, follow" name="ROBOTS" />
        <meta content="900" http-equiv="refresh" />
        <meta http-equiv="Cache-Control" content="max-age=2592000, public" />
        <title>CSS Spider | Nguyễn Đức Hạnh</title>
        <meta name="keywords" content="Css Spider, clone theme, clone css" >
        <meta name="description" content="Css Spider, công cụ clone nhanh giao diện website" />
        <meta property="og:image" content="http://nguyenduchanh.com/css-spider/asset/images/logo.png" />
        <meta name="geo.region" content="VN-HN" />
        <meta name="geo.placename" content="Hà Nội" />
        <meta name="geo.position" content="21.027764;105.83416" />
        <meta name="ICBM" content="21.027764, 105.83416" />
        <link href="asset/images/favicon.png" rel="icon" type="image/png" />
        <link rel="stylesheet" href="asset/css/main.css?v=4" media=all />
    </head>
    <body>
        <div id="content">
            <form name="frm" id="frm" action="" method="get">
                <div class="row" style="margin-bottom: 20px">
                    <a href="/css-spider"><img src="asset/images/logo.png" height="120" alt="Css Spider" /></a>
                </div>
                <div class="row en-scroll" id="wrap-process">
                    <ul id="result-process">
                    </ul>
                </div>
                <div class="row" style="margin-top: 20px">
                    <a href="#" class="btn-result" id="btn-download" target="_blank">Tải về</a>
                    <a href="#" class="btn-result" id="btn-view" target="_blank">Xem</a>
                </div>
            </form>
        </div>
        <script type="text/javascript" src="asset/js/jquery.min.js"></script>
        <script type="text/javascript" src="asset/js/enscroll-0.6.1.min.js"></script>
        <script type="text/javascript" src="asset/js/main.js"></script>
        <script type="text/javascript">
            var is_process = true;
            //var interval = setInterval(getResult, 500);
            
            getResult();
            
            function getResult(){        
                var url = "process.php";
                $.get(url, function (data) {
                    obj =  $.parseJSON(data);
                    if(obj.status == 200){
                        var size = '';
                        if(obj.data && obj.data.size){
                            var size = '<span>' + obj.data.size + '</span>';
                        }
                        $("#wrap-process ul li").removeClass('processing').addClass('complete');
                        $("#result-process").prepend('<li class="processing">' + obj.msg + size + '</li>');
                        getResult();
                    }
                    if(obj.status == 500 && is_process == true){
                        $("#wrap-process ul li").removeClass('processing');
                        is_process = false;
                        $("#result-process").prepend('<li>' + obj.msg + '</li>');
                        $("#btn-download").attr('href',obj.data.link_download).css('display','inline-block');
                        $("#btn-view").attr('href',obj.data.link_view).css('display','inline-block');
                        //clearInterval(interval);
                        window.location.href = obj.data.link_download;
                    }
                });
            }
        </script>
        
        <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-68158191-1', 'auto');
        ga('send', 'pageview');

        </script>
</body>
</html>