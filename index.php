<?php
/**
 * @author Nguyen Duc Hanh
 * @copyright 2014
 * @copygith nguyenduchanh.com
 */
// delete file guest download on yesterday
//include_once('cron_delete_file.php');

session_start();
error_reporting(0);
include_once('functions.php');

if (isset($_GET['url'])) {
    $url = $_GET['url'];
    if (strpos($url, 'http') === false) {
        $url = 'http://' . $url;
    }
    if (filter_var($url, FILTER_VALIDATE_URL) === FALSE) {
        $err_mgs[] = '+ Nhập đường dẫn url chưa hợp lệ';
    }else{
        $_SESSION['url'] = $url;
    }
    

    $parse_url = parse_url($url);
    $folder = $parse_url['host'];
    if ($folder == '') {
        $err_mgs[] = '+ Tên thư mục không hợp lệ';
    } else {
        $_SESSION['folder'] = $folder;
    }

    $save_file = $_SESSION['save_file']  = 'index.html';
    if ($url && $folder && $save_file) {
        header("location: result.php");
    }
} else {
    session_destroy();
}

/* delete folder after 5 minutes */
$dirs = array_filter(glob('save/*'), 'is_dir');
foreach($dirs as  $fd){
    $time_created = filemtime($fd);
    if(time() - 600 > $time_created){
       system("rm -rf ".escapeshellarg($fd));
    }
    
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
        <link rel="stylesheet" href="asset/css/main.css" media=all />
    </head>
    <body>
        <div id="content" style="margin-top: 10%;">
            <form name="frm" id="frm" action="" method="get">
                <div class="row">
                    <a href="/css-spider"><img src="asset/images/logo.png" height="120" alt="Css Spider" /></a>
                </div>
                <div class="row">
                    <p class="red">
                    <?php
                    if (isset($err_mgs)) {
                        foreach ($err_mgs as $msg) {
                            echo $msg . '<br/>';
                        }
                    }
                    ?>
                    </p>
                </div>
                <div class="row wrap-input">
                    <input type="text" name="url" placeholder="Nhập url website" />
                </div>
                <div class="row wrap-submit">
                    <input type="reset" value="Xóa" />
                    <input type="submit" value="Bắt đầu Xử lý" />
                </div>
            </form>
        </div>
        <div id="sidebar">
            <ul>
                <?php
                $allZipFile = getZipFile();
                foreach ($allZipFile as $key=>$value){
                    echo '<li><a href="'.$value.'">'.substr($value, 5).'</a></li>';
                }
                ?>
            </ul>
        </div>
        
        <script type="text/javascript" src="asset/js/jquery.min.js"></script>
        <script type="text/javascript" src="asset/js/enscroll-0.6.1.min.js"></script>
        <script type="text/javascript" src="asset/js/main.js"></script>
        
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