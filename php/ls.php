<?php
/*-- ls.php
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

clearstatcache();

//$_GET['0'] = orginal command (ls)
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
echo $ROOT_DIR;


	//List directory by Jon Haworth
	// http://www.laughing-buddha.net/jon/php/dirlist/

    $results = array();

    // create a handler for the directory
    $handler =  @ opendir($absDir);
    
    if(!$handler) {
	    writeSpecial('ls error: no such directory "' . $ROOT_DIR .'"','error');
    }

    else {
		$f_1 = false;
		$f_list = false;
		$f_h = false;
		$nameLen = 25;  //By default, show 25 characters of file/directory name
	    
	    if(strpos($_GET['1'] , '1') != false) {
		   //Single column list
		   $f_1=true;
		   $nameLen = -1;
	    }

	    if(strpos($_GET['1'] , 'l') != false ) {
	    	   //Detailed list
		   $f_list=true;
		   $nameLen = 50;
	    }

	    if(strpos($_GET['1'] , 'h') != false ) {
	    	   //Human readable
		   $f_h=true;
	    }
	    
    	// keep going until all files in directory have been read
    	while (($file = @ readdir($handler)) !== false) {
            	$results[] = $file;
    	}
    	@ closedir($handler);
    	sort($results);
    	
    	//echo $ROOT_DIR;

    	foreach($results as $res) {
	    	if($res != 'Thumbs.db' && $res != '.') {  //Suppress Windows thumbs file and single dot (this directory)
	    	
				if($f_1) { ?>
					<span class="col_1"><?
				}
				else if($f_list) { ?>
				     	<span class="col_list"><?
				}
				else { ?>
					<span class="col_220"><?
				}
					if(is_dir($absDir . $res)) { //Directory
						print("<a class=\"cdLink\" href=\"javascript:writeToConsole('cd  $ROOT_DIR$res/' + LB); newCD = new program('cd $ROOT_DIR$res'); newCD.runJB(); newLS = new program('ls $ROOT_DIR$res/'); newLS.runJB();\">&raquo;</a> ");
						if($nameLen == -1) print($res);
						else print(substr($res,0,$nameLen));
					}
					else { //File
						print("<a target=\"blank\" class=\"dlLink\" href=\"php/download.php?f=" . substr($ROOT_DIR,1) . $res . "\">&dArr;</a> ");
						
						if(strpos($res,'.mp3') !== false) {
							print("<a class=\"mpLink\" href=\"javascript:newPlay = new program('play $ROOT_DIR$res'); newPlay.runJB();\">&#9835;</a> ");
						}
						else if(strpos($res,'.jpg') !== false || strpos($res,'.jpeg') !== false || strpos($res,'.gif') !== false || strpos($res,'.png') !== false) {
							print("<a class=\"bgLink\" href=\"javascript:writeToConsole('bg  $res' + LB); newBG = new program('bg $res'); newBG.runJB();\">&part;</a> ");

						}
						
						if($nameLen == -1) print($res);
						else print(substr($res,0,$nameLen));
					}
				?></span><?

				if($f_list) { //Detailed mode
					?><span class="col_100"><?
						if($f_h) print(byte_convert(filesize("$absDir$res")));
						else print(filesize("$absDir$res") . " B");
					?></span><?

					?><span class="col_180"><?
						print(date("Y M d H:i:s",filemtime("$absDir$res")));
					?></span><?
				}
			
			}
    	}
	}
   

?>