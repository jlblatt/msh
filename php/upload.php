<?php
/*-- upload.php
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

//This code shamelessly stolen from:
//  http://www.tizag.com/phpT/fileupload.php

// Where the file is going to be placed 
$target_path = "../uploads/";

//Add the original filename to our target path.  
//Result is "uploads/filename.extension"
$target_path = $target_path . basename( $_FILES['uploadedfile']['name']); 

if(move_uploaded_file($_FILES['uploadedfile']['tmp_name'], $target_path)) {
	echo "The file ".  basename( $_FILES['uploadedfile']['name']) . " has been uploaded";
}

else {
	$e = $_FILES['uploadedfile']['error'];
	echo "There was an error uploading the file, please try again! Error code: $e";
}


?>