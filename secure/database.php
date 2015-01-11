<?php

/*-- database.php
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

// Mark Allen
// http://www.comptechdoc.org/independent/web/php/intro/phpmsquery.html

$dbuser="dbuser";
$dbpass="dbpass";
$dbname="msh_db";  //the name of the database

$_SERVER['PHP_AUTH_PW'];

$chandle = mysql_connect("localhost", $dbuser, $dbpass) or die("Connection Failure to Database");
mysql_select_db($dbname, $chandle) or die ($dbname . " Database not found. " . $dbuser);


function jb_query($q)
{
	global $chandle;
	$result = mysql_query($q, $chandle) or die("Failed Query - A : " . mysql_error());  //do the query
	if (!$result)
	{
	  //Invalid query
	  return(false);
	}
	else
	{
	  return $result;
	}
}

function jb_encrypt($t)
{
	$e = md5($t . 'mmm_salty');
	preg_replace();	
}

function jb_login()
{
	echo "writeToConsole('";
	$user = mysql_real_escape_string($_SERVER['REMOTE_USER']);
	$result = jb_query("select last_login from msh_users where name = '$user';");
	if(!$result) die("Error during login!");
	
	echo "login successful!' + LB + '";
	echo "welcome back, <b>$user</b> ";
		$row = mysql_fetch_assoc($result);
		$last_login = $row['last_login'];
	echo "(last login : $last_login)";
	
	echo "' + LB);";
	
	//Update last_login
	jb_query("update msh_users set last_login = now() where name = '$user';");
}

function jb_getuser($user)
{
	$user = mysql_real_escape_string($user);
	return jb_query("select name , type, title, last_login from msh_users where name = '$user';");
}

?>