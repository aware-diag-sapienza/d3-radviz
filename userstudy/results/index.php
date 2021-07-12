<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");
header('Content-type:application/json;charset=utf-8');

if( isset($_GET["f"]) ){
	echo file_get_contents($_GET["f"]);
}
else{
	$files = array();
	foreach (scandir("./") as $f) {
		if (preg_match('/.json$/', $f)){
			array_push($files, $f);
		}
	}

	echo json_encode( $files );
}

?>
