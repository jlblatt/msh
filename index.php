<!-- index.php
---- M shell ( msh )
---- Copyright Jason Blatt 2008
---- Distributed under terms of the GNU General Public License
----      (http://www.gnu.org/licenses/gpl.txt)

	This file is part of M shell (msh).

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

-->

<?php
	include 'secure/database.php';
	include 'php/tools.php';
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"><head>
<title>msh</title>
<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />

<!-- Don't cache anything -->
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Cache-Control" content="no-cache, must-revalidate">
<meta http-equiv="Expires" content="Mon, 26 Jul 1997 05:00:00 GMT"> 

<!--<script type="text/javascript" src="/msh/js/processing.js"></script>-->  <!-- http://ejohn.org/blog/processingjs/ : See license in file -->
<script type="text/javascript" src="/msh/js/jquery-1.2.6.js"></script>  <!-- http://jquery.com/ : See license in file -->
<script type="text/javascript" src="/msh/js/programs.js"></script>
<script type="text/javascript" src="/msh/js/tools.js"></script>
<script type="text/javascript">

$(document).ready(function(){
   initShell();
   setInterval('sUpdate();',1000);
   setInterval('markerOut();',1000);
 });
 
//Some global variables (probably, but not nessesarily, constants)
var SKIN = 0;
var CONSOLE_SPEED = 420;
var LB = '</span><br /><span class="consoleToDraw">';
var CLR = '<div class="clearBoth"></div>';
var PROMPT = 'm# ';
var VERSION = 'msh 0.1a';
var IP = '<?php echo getip(); ?>';
var HOSTNAME = '<?php echo gethostbyaddr(getip()); ?>';
var USERNAME = '<?php echo $_SERVER['REMOTE_USER']; ?>';
var CLIP = '';
var HISTORY = new Array();
var HISTORY_pos = -1;
var WD = '/';

$.ajaxSetup({
  url: "secure/",
  global: false,
  type: "GET"
});

function sUpdate()
{
	//Every such amount of time, check server for updates (msgs, cursor blink, etc...)
	//BE CAREFUL WITH CYCLES HERE, ITS ALWAYS RUNNING!!!

}

function markerOut()
{
	//markerOut() and markerIn() blink cursor in console display
	$('#marker').addClass('fadeIn');
	$('.fadeOut').removeClass('fadeOut');
	$('.fadeIn').fadeOut('' , function() {
		markerIn();	
	});
}
		
	
function markerIn()
{
	$('.fadeIn').addClass('fadeOut');
	$('.fadeIn').removeClass('fadeIn');
	$('.fadeOut').fadeIn('');
}


function initShell()
{

	writeToConsole('loading... (hints: press F11 for fullscreen , disable popup blocker , enable active-x , chill tf out , etc...)' + LB);
	
	writeToConsole('checking for javascript... ');
	//get rid of 'no JS' warning
	document.getElementById('noJS').style.display = 'none';
	writeToConsole(' found!' + LB);
	
	//set console max height
	writeToConsole('setting element dimensions...' + LB);
	var newHeight = getY() - 90;
	document.getElementById('consoleDisplay').style.height = newHeight + 'px';
	
	writeToConsole('getting browser info...');
	//check for non-firefox browser
	if(browserName == "Firefox" && majorVersion == 3) {
		writeToConsole(browserName + ' ' + fullVersion + ' detected! (' + nAgt + ')' , 'ok');
	}
	
	else {
		writeToConsole(
			browserName + ' ' + fullVersion + ' detected! (' + nAgt + ')' + LB +
			'**Site coded for Firefox 3.0 - site may still work but is unsupported! (Type \'help -browser\' for compatibility information)**', 'warning');
		if(browserName == "Internet Explorer" && majorVersion == 6) writeToConsole('****IE6 detected - you have made a mortal enemy - multiple viruses installed on your system****',error);
	}
	
	writeToConsole('binding keyboard events...' + LB);
	//bind keyboard to callback function
	$("#consoleInput").keypress(function(e) {
		processKeypress(e);
	});
	$("#consoleInput").keyup(function(e) {
		processKeyup(e);
	});
	
	writeToConsole('binding mouse events...' + LB);
	//bind mouseclick on console
	$("#consoleDisplay").mouseup(function(e) {
		if(getSelText() != '') CLIP = getSelText().toString();
		
	});
	$("html").mouseup(function(e) {
		$('#consoleInput').focus();
	});
	
	writeToConsole('binding misc events...' + LB);
	//bind highlights on console focus / blur
	$('#consoleInput').focus(function(e) {
		$('#consoleInputDisplay').removeClass('consoleInputDisplayBlurred').addClass('consoleInputDisplayFocused');
	});
	$('#consoleInput').blur(function(e) {
		$('#consoleInputDisplay').removeClass('consoleInputDisplayFocused').addClass('consoleInputDisplayBlurred');
	});
	
	//bind window resize
	$(window).resize(function(){
		//var resizeHeight = getY() - 90;
		//document.getElementById('consoleDisplay').style.height = resizeHeight + 'px';
		
		//Do a default shrink of 5%
		bgRS = new program('rs 5');
		bgRS.runJB();
		redrawAll();
	});

	<?php 
		jb_login(); 
	?>
	writeToConsole(VERSION + ' ready' + LB);
		
	prompt();
	$("#consoleInputDisplay").append('<span id="marker">&nbsp;</span>');
	
}

function prompt()
{
	$("#consoleInputDisplay").empty().append(PROMPT);
	$('#consoleInput').focus();
}

function clearInput()
{
	$("#consoleInput").val('');
	$("#consoleInputDisplay").empty();
}

function redrawAll()
{
	//Draw Console
	$(".consoleToDraw").fadeIn(CONSOLE_SPEED);
	$(".consoleToDraw").removeClass("consoleToDraw");
	
	//Drop to bottom of console
	var objDiv = document.getElementById("consoleDisplay"); // http://radio.javaranch.com/pascarello/2005/12/14/1134573598403.html
	objDiv.scrollTop = objDiv.scrollHeight;
	
	//Refocus Input
	$('#consoleInput').focus();
}

function writeToConsole(stdout , className)
{
	if (className != null) $("#consoleDisplay").append('<div class="consoleToDraw"><div class="' + className + '"><span class="consoleToDraw">' + stdout + '</span></div></div>');
	else $("#consoleDisplay").append('<span class="consoleToDraw">' + stdout + '</span>');
	redrawAll();
}

//This function processes most keypresses
function processKeypress(e)
{
	$("#marker").remove();
	
	//Enter key - write to console and execute command
	if (e.which == '13') {
		//Get value of stdin (trim whitespace)
		var cmd = $("#consoleInput").val();
		cmd = $.trim(cmd);
		//Write command to history if not empty
		if(cmd != '' && cmd != null) HISTORY.push(cmd);
		HISTORY_pos = -1;
		//Display command
		writeToConsole('<span class="executedCmd">' + PROMPT + cmd + '<div></div>');
		//Erase input line and textarea
		clearInput();
		//Attempt to run input
		if (cmd != '') {
			thisProg = new program(cmd);
			thisProg.runJB();
		}
		prompt();
	}
	
	//Spacebar needs to append &nbsp; in browser
	else if(e.which == '32') {
		$("#consoleInputDisplay").append('&nbsp;');
	}
	
	//Delete, insert, dash, arrow keys overridden below for compatibility
	else if(e.which == '8' || e.keyCode == '37' || e.keyCode == '38' || e.keyCode == '39' || e.keyCode == '40' || e.keyCode == '45' || e.keyCode == '189') { }
	
	//Delete key - complete dir if possible
	else if(e.keyCode == '46') {
		//$("#buffer").load("php/ls.php?1='ac'");
	}
	
	//All 'normal' keys - append to display
	else {
		HISTORY_pos = -1;
		var c = String.fromCharCode(e.which);
		$("#consoleInputDisplay").append(c);
	}
	
	$("#consoleInputDisplay").append('<span id="marker">&nbsp;</span>');
	
}

//This function process some special key presses for compatibility reasons
//IE does fire keypress events for some keys, so we need to define those here (and override them above)
function processKeyup(e)
{
	$("#marker").remove();
	
	if(e.which == '9') {
		//alert('tab');
	}
	
	//Delete key - remove last character from display
	if(e.which == '8') {
		HISTORY_pos = -1;
		$("#consoleInputDisplay").text(PROMPT + $("#consoleInputDisplay").text().substring(PROMPT.length,$("#consoleInputDisplay").text().length-1));
	}
	
	//Left/right arrow keys - nullify by moving cursor to end
	else if(e.keyCode == '37' || e.keyCode == '39') {
		setCaretPosition('consoleInput', 25000);
	}
	
	//Up/down arrow keys view history
	else if(e.keyCode == '38' || e.keyCode == '40') {
		//Check if we are viewing history already
		if(HISTORY_pos >= 0) {
			//Traverse history
			if(e.keyCode == '38') HISTORY_pos--;//Up (previous command)
			else HISTORY_pos++;//Down (next command)
			//Check bounds
			if(HISTORY_pos < 0) HISTORY_pos = 0;
			if(HISTORY_pos > HISTORY.length-1) HISTORY_pos = HISTORY.length-1;
			//Display command
			clearInput();
			$("#consoleInput").val(HISTORY[HISTORY_pos]);
			prompt();
			$("#consoleInputDisplay").append(HISTORY[HISTORY_pos]);
		}
		//If we aren't currently viewing history, clear inputs and goto last command executed
		else {
			clearInput();
			prompt();
			HISTORY_pos = HISTORY.length-1
			if(HISTORY_pos >= 0) {
				$("#consoleInput").val(HISTORY[HISTORY_pos]);
				prompt();
				$("#consoleInputDisplay").append(HISTORY[HISTORY_pos]);
			}
		}
	}
	
	//Insert key - paste
	else if(e.keyCode == '45') {
		//alert(CLIP);
		$("#consoleInput")[0].value = $("#consoleInput")[0].value + CLIP;
		$("#consoleInputDisplay").append(CLIP);
	}
	
	//Dash
	else if(e.keyCode == '189') {
		HISTORY_pos = -1;
		$("#consoleInputDisplay").append('-');
	}
	
	$("#consoleInputDisplay").append('<span id="marker">&nbsp;</span>');
}


</script>

<link rel="stylesheet" type="text/css" href="css/style.css">
</head>







<body id="mainBody">
	<div id="bg">
		<div id="crash">
			<div id="crashText">
				<span class="crashGrey">&nbsp;Windows&nbsp;</span><br /><br />
				<center><table border="0" width="680px"><tr><td id="crashTextLeft" align="left">
				A fatal exception 0E has occured at 0028:C0011E36 in VXD VMM(01) + <br /> 0010E36.  The current application will be terminated.<br /><br />* Press any key to terminate the current application.<br />* Press CTRL+ALT+DEL again to restart your computer.  You will<br />&nbsp;&nbsp;lose any unsaved information in all applications.
				</td></tr></table></center><br />
				Press any key to continue _
			</div>
		</div>
		<div id="noJS">no javascript detetcted - disable script blockers or download a browser released after 1996</div>
		<div id="main"></div>
		<div id="consoleDisplay"></div>
		<div id="consoleInputDisplay"></div>
		<div id="buffer"></div>
	</div>
	
	<form name="stdin"><textarea id="consoleInput" name="consoleInput" type="text"></textarea></form>
	
</body>

</html>
