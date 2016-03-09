<?php
// define ROOT_PATH
define('ROOT_PATH',dirname(__FILE__));

// define DIRECTORY_SEPARATOR
define('DS',DIRECTORY_SEPARATOR);

// define ROOT PATH
define("INC_PATH",ROOT_PATH.DS);

$dir = INC_PATH.'save/';

if ($handle = opendir($dir)) {
    while (false !== ($file = readdir($handle))) {
        $file_path = $dir.$file;
        $filelastmodified = filemtime($file_path);
        if((time() - $filelastmodified) > 24*3600){
           if(is_dir($file_path)){  // if path is the dir
                rmdir_recursive($file_path);
           }else{
                unlink($file_path); 
           }
        }
    }
    closedir($handle); 
}


function rmdir_recursive($dir) {
    foreach(scandir($dir) as $file) {
        if ('.' === $file || '..' === $file) continue;
        if (is_dir("$dir/$file")) rmdir_recursive("$dir/$file");
        else unlink("$dir/$file");
    }
    rmdir($dir);
}