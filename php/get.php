<?php
/*-- get.php
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

//$_GET['0'] = orginal command (get)
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
	    writeSpecial('get error: no such file "' . $ROOT_DIR .'"','error');
    }

    else { ?>
    	<script type="text/javascript">
			window.open('php/download.php?f=<?php print(substr($ROOT_DIR,1) . $res); ?>');
		</script><?php
	}
   

?>