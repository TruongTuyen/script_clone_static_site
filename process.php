<?php

/**
 * @author Nguyen Duc Hanh
 * @copyright 2014
 * @copygith nguyenduchanh.com
 */
 
session_start();
error_reporting(0);

include_once('simple_html_dom.php');
include_once('functions.php');

if(isset($_REQUEST['cmd']) && $_REQUEST['cmd']=='clear'){
    session_destroy();
    jsonResult(403, 'Đã xóa hết session');
    die;
}

$url = $_SESSION['url'];
$folder = $_SESSION['folder'];
$save_file = $_SESSION['save_file'];
if($url==''){
    jsonResult(403, 'url không hợp lệ');
    die;
}
if($folder==''){
    jsonResult(403, 'folder không hợp lệ');
    die;
}



$path = "save/".$folder;
$css_path = "save/".$folder."/asset/css";
$js_path =  "save/".$folder."/asset/js";

/* 
step = 1; // download  html content
step = 2; // get css and javascript file
step = 3; // save background images
step = 4; // update html content
step = 5; // finish
*/


if(!is_dir($path)){
    mkdir($path, 0777, true);    
}
if(!is_dir($css_path)){
    mkdir($css_path, 0777, true);    
}
if(!is_dir($js_path)){
    mkdir($js_path, 0777, true);    
}



$step = isset($_SESSION['step']) ? $_SESSION['step'] : 1 ;
switch($step){
    case "1":
        /* download html
        ----------------------------------------------------------------------------*/
        $bytes = file_put_contents($path.'/tmp',get_file_content($url));
        $step++;
        $_SESSION['step'] = $step;
        
        $byte = bytesToSize($bytes);
        jsonResult(200, 'Tải cấu trúc html website', array('size' => $byte));
        die;
    break;
    
    case "2":
        /* get script and css
        ----------------------------------------------------------------------------*/
        // clean css file
        $website = file_get_html($path.'/tmp');
        foreach ($website->find('link') as $stylesheet){
            $stylesheet->rel = strtolower($stylesheet->rel);
        }
        //$website->save($path.'/tmp');
        
        //$website = file_get_html($path.'/tmp');
        $arrayCss = array();
        $arrayCssNoClean = array();
        foreach ($website->find('link[rel="stylesheet"]') as $stylesheet){
            $stylesheet_url = cleanUrl($stylesheet->href,true);
            $stylesheet_url_notclean = $stylesheet->href;
            if($stylesheet_url!=''){
                $stylesheet_url = (strpos($stylesheet_url,'//')===false) ? h_parse_url($_SESSION['url']).'/'.$stylesheet_url : $stylesheet_url;
                $stylesheet_url_notclean = (strpos($stylesheet_url_notclean,'//')===false) ? h_parse_url($_SESSION['url']).'/'.$stylesheet_url_notclean : $stylesheet_url_notclean;
                $arrayCss[] = $stylesheet_url;
                $arrayCssNoClean[] = $stylesheet_url_notclean;
                
                $path_info = pathinfo($stylesheet_url);
                $file_path = $css_path."/".$path_info['filename'].".".$path_info['extension'];
                file_put_contents($file_path,get_file_content($stylesheet->href));
                $css_import = get_css_import($stylesheet_url_notclean);
                if($css_import){
                    $arrayCss = array_merge($css_import,$arrayCss);
                    $arrayCssNoClean = array_merge($css_import,$arrayCssNoClean);
                }
            }
        }
        $_SESSION['arrayCss'] = $arrayCss;
        $_SESSION['arrayCssNoClean'] = $arrayCssNoClean;
        
        $arrayJs = array();
        foreach ($website->find('script') as $script){
            $script_url = cleanUrl($script->src);
            $stylesheet_url = (strpos($script_url,'//')===false) ? h_parse_url($_SESSION['url']).'/'.$script_url : $script_url; 
            if($script_url){
                $arrayJs[] = $script_url;
                $path_info = pathinfo($script_url);
                $file_path = $js_path."/".$path_info['filename'].".".$path_info['extension'];
                file_put_contents($file_path,get_file_content($script->src));
                //var_dump($file_path);
            }
        }
        $step++;
        $_SESSION['step'] = $step;
        
        jsonResult(200, 'Tải các file css và javascript');
        die;
    break;
    
    case "3":
        /* save background images
        ----------------------------------------------------------------------------*/
        $imgs = $_SESSION['img'];
        $arrayCss = $_SESSION['arrayCss'];
        $arrayCssNoClean = $_SESSION['arrayCssNoClean'];
        if(count($imgs) > 0 ){
            // remove duplicate value from images array
            $imgs = array_unique($imgs);
            
            $bg_images = array_pop($imgs);
            if($bg_images){
                //show_image_download($bg_images);
                $images_info = pathinfo($bg_images);
                $image_path = $css_path.'/'.$images_info['dirname'];
                if(!is_dir($image_path)){
                    mkdir($image_path,0777,true);
                }
                $images_name = $images_info['filename'].'.'.$images_info['extension'];
                $images_url = $_SESSION['css_url'].'/'.$bg_images;
                $bytes = file_put_contents($image_path.'/'.$images_name,get_file_content($images_url));
                $_SESSION['img'] = $imgs;
                
                $byte = bytesToSize($bytes);
                jsonResult(200, 'Tải ảnh background: <a href="'.$images_url.'" target="_blank">'.$bg_images.'</a>', array('size' => $byte));
                die;
            }else{
                //show_image_download(false);
            }
        }else if(count($arrayCssNoClean) > 0 ){
            $css_file = array_pop($arrayCssNoClean);
            if($css_file){
                $css_content = get_file_content($css_file);
                $re = '/url\(\s*[\'"]?(\S*\.(?:jpe?g|gif|png|otf|eot|svg|ttf|woff))[\'"]?\s*\)[^;}]/i';
                if (preg_match_all($re, $css_content, $matches)) {
                    $imgs = $matches[1];
                }
                $_SESSION['img'] = $imgs;
                $file_info = pathinfo($css_file);
                $_SESSION['css_url'] = $file_info[ 'dirname'];
            }
            $_SESSION['arrayCssNoClean'] =  $arrayCssNoClean;
            
            $path_info = pathinfo($css_file);
            jsonResult(200, 'Bóc tách ảnh trong file css: <a href="'.$css_file.'" target="_blank">'.$path_info['basename'].'</a>');
            die;
        }
  
        $step++;
        $_SESSION['step'] = $step;
        
        jsonResult(200, 'Cập nhật lại đường dẫn các file css và javascript ');
        die;
    break;
    
    case "4":
        /* update html content
        ----------------------------------------------------------------------------*/
      
        // load temp html file, keep treserve the break line
        $html_file = file_get_html($path.'/tmp',false,NULL,'-1','-1',true,true,DEFAULT_TARGET_CHARSET,false);
        foreach ($html_file->find('link') as $stylesheet){
            $stylesheet->rel = strtolower($stylesheet->rel);
        }
        
        // remore "base" dom element
        foreach($html_file->find('base') as $base){
            $base->outertext = '';
        }
        
        // replace link css
        foreach ($html_file->find('link[rel="stylesheet"]') as $stylesheet){
            $stylesheet_url = cleanUrl($stylesheet->href,true);
            if($stylesheet_url){
                $stylesheet_url = str_replace(h_parse_url($_SESSION['url']),'',$stylesheet_url);
                $path_info = pathinfo($stylesheet_url);
                $file_path = 'asset/css/'.$path_info['filename'].".".$path_info['extension'];
                $stylesheet->href = $file_path;
            }
        }
        // replace link js
        foreach ($html_file->find('script') as $script){
            $script_url = cleanUrl($script->src);
            if($script_url){
                $stylesheet_url = str_replace(h_parse_url($_SESSION['url']),'',$script_url);
                $path_info = pathinfo($script_url);
                $file_path = 'asset/js/'.$path_info['filename'].".".$path_info['extension'];
                $script->src = $file_path;
            }
        }
        
        // recreate images link
        foreach ($html_file->find('img') as $h_img){
            $images_src = $h_img->src;
            if(strpos($images_src,'http')===false){
                $h_img->src =  h_parse_url($_SESSION['url']).'/'.$images_src;
            }
        }
        
        // recreate sub link
        foreach ($html_file->find('a') as $link){
            $link_href = $link->href;
            if(strpos($link_href,'//')===false){
                $link->href = h_parse_url($_SESSION['url']).'/'.$link_href;
            }
        }
        
        // delete temp file and create html file
        $ret = $html_file->root->innertext();
        file_put_contents($path.'/'.$save_file,$ret);
        /*
        $a = $html_file->save($path.'/'.$save_file);
        unlink($path.'/tmp');
        */
        
        $step++;
        $_SESSION['step'] = $step;
        
        $site_path = get_site_path();
        $data = array('link_download' => $site_path . 'download.php?f=' . $folder , 'link_view' => $site_path . 'save/' . $folder );
        jsonResult(500, '<strong class="blink">Đã hoàn thành...</strong>', $data);
        session_destroy(); 
        unlink($path.'/tmp');
        die;
        
    break;
    
    case "5":
        session_destroy(); 
    break;
} // end switch
?>