<?php
/*-- tools.php
---- M'shell ( msh )
---- Copyright Jason Blatt 2008
---- Distributed under terms of the GNU General Public License
----      (http://www.gnu.org/licenses/gpl.txt)

	This file is part of M'shell (msh).

    M'shell (msh) is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    M'shell (msh) is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with M'shell (msh).  If not, see <http://www.gnu.org/licenses/>.

--*/


function getip() {
	if (isSet($_SERVER)) {
		if (isSet($_SERVER["HTTP_X_FORWARDED_FOR"])) {
			$realip = $_SERVER["HTTP_X_FORWARDED_FOR"];
		}
		elseif (isSet($_SERVER["HTTP_CLIENT_IP"])) {
			$realip = $_SERVER["HTTP_CLIENT_IP"];
		}
		else {
			$realip = $_SERVER["REMOTE_ADDR"];
		}
	}
	
	else {
		if ( getenv( 'HTTP_X_FORWARDED_FOR' ) ) {
			$realip = getenv( 'HTTP_X_FORWARDED_FOR' );
		}
		elseif ( getenv( 'HTTP_CLIENT_IP' ) ) {
			$realip = getenv( 'HTTP_CLIENT_IP' );
		}
		else {
			$realip = getenv( 'REMOTE_ADDR' );
		}
	}
	
	return $realip;
}

//This function allows php programs called by ajax to make use of the shell's special output mechanism
function writeSpecial($string , $style) {
	echo "<div class=\"consoleToDraw\"><div class=\"$style\"><span class=\"consoleToDraw\">$string</span></div></div>";
}

//Reduce directory names with .. and . and kill any leading/trailing space
function deDot($dir) {
	$dir = preg_replace("/\/[^\/]+\/\.\./" , "/" , $dir);  //.. means move up one dir - replace */.. where * is parent directory
	$dir = preg_replace("/\/\./" , "" , $dir);  //. means this dir - replace with nothing
	$dir = preg_replace("/\/\//" , "/" , $dir);  //Replace '//' with '/' to remove duplicate directories (cause I'm lazy)\
	$dir = trim($dir);  //Remove space
	return $dir;
}

//Convert bytes to human-readable
//Found in PHP manual - http://us3.php.net/filesize
function byte_convert($bytes)
{
    $symbol = array(' B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB');

    $exp = 0;
    $converted_value = 0;
    if( $bytes > 0 )
    {
	$exp = floor( log($bytes)/log(1024) );
	$converted_value = ( $bytes/pow(1024,floor($exp)) );
    }

    return sprintf( '%.2f '.$symbol[$exp], $converted_value );
}


?>