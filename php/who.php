<?php
/*-- who.php
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

include '../secure/database.php';
include '../secure/fs.php';
include '../php/tools.php';

//$_GET['0'] = orginal command (who)
//$_GET['1'] = user to lookup

$result = jb_getuser($_GET['1']);

$row = mysql_fetch_assoc($result);
print("user: <b>" . $row['name'] . "</b> (" . $row['type'] . "/" . $row['title'] . ")<br />");
print("last-login: " . $row['last_login']);
//Have to find a way to set online = false after some time server side
//if($row['online']) print(" <b>*Online</b><br />");

?>