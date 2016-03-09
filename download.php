<?php

/**
 * @author Nguyen Duc Hanh
 * @copyright 2014
 * @copygith nguyenduchanh.com
 */

include_once('hzip.class.php');
include_once('functions.php');

$folder = isset($_REQUEST['f']) ? $_REQUEST['f'] : '';

if($folder){
    HZip::zipDir("save/$folder", "save/$folder.zip");
    
    $site_path = get_site_path();
    header("location: $site_path/save/$folder.zip");
}

 