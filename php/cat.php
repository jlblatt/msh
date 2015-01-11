<?php
/*-- cat.php
---- M shell ( msh )
---- Copyright Jason Blatt 2008
---- Distributed under terms of the GNU General Public License
----      (http://www.gnu.org/licenses/gpl.txt)

	This file is part of M'shell (msh).

    M shell (msh) is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    M shell (msh) is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with M shell (msh).  If not, see <http://www.gnu.org/licenses/>.

--*/

include '../secure/fs.php';
include '../php/tools.php';

//$_GET['0'] = orginal command (cat)
//$_GET['1'] = flags
//$_GET['2'] = directory
//$_GET['3...'] = additional args, assumed to be part of directory name (but separated by spaces)

$ROOT_DIR = $_GET['2'];
$i=3;
while($_GET["$i"]) {
	$ROOT_DIR .= ' ' . $_GET["$i"];
	$i++;
}

$ROOT_DIR = deDot($ROOT_DIR);
$absDir = $VIRTUAL_DIR . $ROOT_DIR;

    $results = array();

    // create a handler for the directory
    $handler =  @ fopen($absDir , 'r');
    
    if(!$handler) {
	    writeSpecial('cat error: no such file "' . $ROOT_DIR .'"','error');
    }

    else {
	    if($_GET['1'] == '-a') {
    		$file = fread($handler, filesize($absDir) );
    		@ fclose($handler);
    	
    		echo $ROOT_DIR;
    		echo '<br />';

    		$file = preg_replace("/\n/" , '<br />' , $file);
    		print($file);
	    }
	    else if(substr($_GET['1'], 0, 1) == '-') {
		    if(substr($_GET['1'], 1)) $file = fread($handler , substr($_GET['1'], 1)) ;
		    else $file = fread($handler , filesize($absDir) );
    		@ fclose($handler);
    	
    		echo $ROOT_DIR;
    		echo '<br />';

    		$file = preg_replace("/\n/" , '<br />' , $file);
    		print($file);
	    }
	    else {
			echo 'Using first 100 bytes of file... <br />';
    		$file = fread($handler , 100 );
    		@ fclose($handler);
    	
    		echo $ROOT_DIR;
    		echo '<br />';

    		$file = preg_replace("/\n/" , '<br />' , $file);
    		print($file);
		}
	
	}
   

?>