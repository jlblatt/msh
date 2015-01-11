/*-- programs.js
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
*/

//Program object- contains program name and arguments
function program(cmd) {
	//Split command on spaces so program is at [0] and args are [1] , [2] , etc...
	this.args = cmd.split(/ +/);
	
	//Strip non alphanumeric characters from command, to prevent injection type attacks
	this.args[0] = this.args[0].replace( /[\W]+/g , '');
	
	//Run
	this.runJB = runJB;
}

//Run function for program object
function runJB() {
	var prog = 'jb_' + this.args[0] + '(this)';
	if(this.args[this.args.length-1] == '-debug') eval(prog);
	else {
		try {
			eval(prog);
		}
	
		catch(e) {
			writeToConsole('msh: execution error running "' + this.args[0] + '" (' + e.name + ' line ' + e.lineNumber + ')' , 'error');	
		}
	}
}

//Dispatch function (for Ajax programs)
function dispatch(cmd)
{
	var URL = 'php/' + cmd.args[0] + '.php?';
	for(var i = 1; i < cmd.args.length; i++) {
		URL += i + '=' + cmd.args[i] + '&';
	}
	
	URL = URL.replace( / /g , '%20');
	URL = URL.substring(0,URL.length-1);
	//alert(URL);
	$("#buffer").load(URL , function(data) {
		writeToConsole($("#buffer").html() + CLR + LB);	
	});
}

//Wait for keypress function
function waitForKey(func)
{
	//Unbind keyboard functions from input
	$("#consoleInput").unbind();
	//Bind new keypress function
	$("#consoleInput").keypress(func);
}

var keyIn;
function captureKeypress()
{
	//Unbind new keypress function
	$("#consoleInput").unbind();
	//Rebind original keyboard functions
	$("#consoleInput").keypress(function(e) { processKeypress(e); });
	$("#consoleInput").keyup(function(e) { processKeyup(e); });	
	//Empty stdin
	clearInput();
	prompt();
}

//Argument parsers
//Get strings[] from space-separated list of arguments
//Returns false if no strings or uneven number of quotes
//Support double quotes only
function getStrings(args)
{
	var strings = new Array();
	var qTotal = 0;
	var recordFlag = false;
	var wholeArg = '';
	
	//Recompile args back to string
	for(var i = 1; i < args.length; i++) {
		wholeArg += args[i] + ' ';
	}
	
	//Record text between double quotes
	for(var j = 0; j < wholeArg.length; j++) {
		var c = wholeArg.charAt(j);
		if(c == '"') {
			if(!recordFlag) {  //Start capturing string
				recordFlag = true;
				qTotal++;
				strings[qTotal-1] = '';
			}
			else recordFlag = false; //Finish capturing string
		}
		
		else { //Note a double quote character, save or discard based on recordFlag
			if(recordFlag) strings[qTotal-1] += c;
		}
	}
	
	if(strings.length <= 0 || recordFlag) return false;
	else return strings;
}







//Built-in programs below this line ********************************************************************************

function jb_about(cmd)
{
	writeToConsole( LB +
		'/********^^^^^^^^~~~~~~~~........________________........~~~~~~~~^^^^^^^^********\\' + LB + 
		'|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|' + LB +
		'|&nbsp;&nbsp;&nbsp;&nbsp;/\\&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;M shell (' + VERSION + ');&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|' + LB +
		'|&nbsp;&nbsp;&nbsp;/__\\&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-written by Jason Blatt&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|' + LB +
		'|&nbsp;&nbsp;/\\&nbsp;&nbsp;/\\&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-copyright 2008&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|' + LB +
		'|&nbsp;/__\\/__\\&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-distributed under terms of the <a target="_blank" href="http://www.gnu.org/licenses/gpl.txt">GNU General Public License</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|' + LB +
		'|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|' + LB +
		'|&nbsp;&nbsp;&nbsp;"My closest friend, linoleum.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|' + LB +
		'|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Linoleum supports my head, gives me something to believe." -NOFX&nbsp;&nbsp;&nbsp;|' + LB +
		'|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|' + LB +
		'\\________........~~~~~~~~^^^^^^^^****************^^^^^^^^~~~~~~~~........________/' + LB + LB
	
	);
}

function jb_alert(cmd)
{ 
	var a = '';
	for(var i = 1; i < cmd.args.length; i++) {
		a += cmd.args[i] + ' ';
	}
	alert(a);
}

function jb_bg(cmd) {
	//$("html").fadeOut("slow", function() {
		//var pxs = 0;
		if(cmd.args[1] == '' || cmd.args[1] == null) {
			writeToConsole('bg: not enough argument - defaulting to black' , 'error');
			$("body").fadeTo("slow" , 1);
		}
		else {
			//if(cmd.args[1].charAt(0) == '-') {
					//pxs = parseInt(cmd.args[1].substring(1) / 2);
			//}
			//else {
				//cmd.args[2] = cmd.args[1];
				//cmd.args[1] = '-';
			//}
			
			var imagePath = '';
			for(i = 1 ; i < cmd.args.length ; i++) {
				imagePath += cmd.args[i] + ' ';
			}
				
			//writeToConsole(escape(imagePath.substring(0,imagePath.length-1)).toString() + LB);
			$("html").css({ background: "#000000 url(php/download.php?f=" + WD + "/" + escape(imagePath.substring(0,imagePath.length-1)).toString() +") center center no-repeat fixed" });
			//$("html").css({ background: "#ff0000" });

			redrawAll();
			//$("html").fadeIn("slow", function() {
				$("body").css({ background: "#000000" });
				$("body").fadeTo("slow" , 0.78);
			//});
			
			//Shrink console by 10% so new background stands out
			bgRS = new program('rs 10');
			bgRS.runJB();
			//And wtf, give it a border cause I'm anal
			document.getElementById('bg').style.border = '20px solid #222222';
		
			redrawAll();
		}
	//});
	                                   
}

function jb_clear(cmd) { $("#consoleDisplay").empty(); }

function jb_cat(cmd)
{
	if(cmd.args[1] == '' || cmd.args[1] == null) writeToConsole('cat: not enough arguments' , 'error');
	
	else {
	
		if(cmd.args[1].charAt(0) != '-') { //no flags as fit argument?
		//	if(cmd.args[2] == '' || cmd.args[2] == null) {
		//		cmd.args[2] = '-';  //path but no flags, create empty flag
		//		var i = cmd.args[1];  var j = cmd.args[2];//switch args so path is always second - this lets the user set flags before or after path
		//		cmd.args[1] = j;  cmd.args[2] = i;
		//	}
		//	else if(cmd.args[2].charAt(0) == '-') {//path and flags provided
		//		var i = cmd.args[1];  var j = cmd.args[2];//switch args so path is always second
		//		cmd.args[1] = j;  cmd.args[2] = i;
		//	}
		//	else { //assume no flags
				var newargs = new Array();
				newargs[0] = cmd.args[0];  //pass cat
				newargs[1] = '-'; //pass empty flag
				
				for(var i = 2 ; i < cmd.args.length+1 ; i++) {
					newargs[i] = cmd.args[i-1];
				}
				cmd.args = newargs;
		//	}
		}
	
		else { //flags first already - we good, just check path
			if(cmd.args[2] == '' || cmd.args[2] == null) cmd.args[2] = WD;
		} 
	
		if(cmd.args[2].charAt(0) == '/');  //check beginning of path for '/' to signify absolute path (ok to pass)
		else cmd.args[2] = WD + cmd.args[2];  //if not append WD
	
		dispatch(cmd);
	}
}


function jb_cd(cmd) {
	if(cmd.args[1] == '' || cmd.args[1] == null) writeToConsole('cd: not enough arguments' , 'error');
	
	else {
	
		if(cmd.args[1].charAt(0) != '-') { //no flags as first argument?
			if(cmd.args[2] == '' || cmd.args[2] == null) {
				cmd.args[2] = '-';  //path but no flags, create empty flag
				var i = cmd.args[1];  var j = cmd.args[2];//switch args so path is always second - this lets the user set flags before or after path
				cmd.args[1] = j;  cmd.args[2] = i;
			}
			else if(cmd.args[2].charAt(0) == '-') {//path and flags provided
				var i = cmd.args[1];  var j = cmd.args[2];//switch args so path is always second
				cmd.args[1] = j;  cmd.args[2] = i;
			}
			else { //assume no flags
				var newargs = new Array();
				newargs[0] = cmd.args[0];  //pass cd
				newargs[1] = '-'; //pass empty flag
				
				for(var i = 2 ; i < cmd.args.length+1 ; i++) {
					newargs[i] = cmd.args[i-1];
				}
				cmd.args = newargs;
			}
		}
	
		else { //flags first already - we good, just check path
			if(cmd.args[2] == '' || cmd.args[2] == null) cmd.args[2] = WD;
		} 
	
		if(cmd.args[2].charAt(0) == '/');  //check beginning of path for '/' to signify absolute path (ok to pass)
		else cmd.args[2] = WD + cmd.args[2];  //if not append WD
	
		dispatch(cmd);
	}
}


function jb_crash(cmd)
{
	document.getElementById('bg').style.border = 'none';
	$("html").css({ background: "#000000" });
	$("body").fadeTo("fast" , 1);
	
	$('#consoleDisplay').hide();
	$("#consoleInputDisplay").hide();
	
	document.getElementById('crash').style.display = 'block';
	document.getElementById('crash').style.height = getY() + 400 + 'px';
	document.getElementById('crash').style.width = getX() + 400 + 'px';
	document.getElementById('crashText').style.marginTop = getY() / 2  + 50 + 'px';
	
	//Wait for keypress
	waitForKey(function() {
		$('#consoleDisplay').show();
		$("#consoleInputDisplay").show();
		$('#crash').fadeOut('medium' , function() {
			captureKeypress();
			$("#consoleInputDisplay").append('<span id="marker">&nbsp;</span>');
			bgRS = new program('rs 5');
			bgRS.runJB();
		});
	});
	
}


function jb_echo(cmd)
{ 
	var e = '';
	for(var i = 1; i < cmd.args.length; i++) {
		e += cmd.args[i] + ' ';
	}
	writeToConsole(e + LB + LB);
}


function jb_get(cmd)
{
	if(cmd.args[1] == '' || cmd.args[1] == null) writeToConsole('get: not enough arguments' , 'error');
	
	else {
	
		if(cmd.args[1].charAt(0) != '-') { //no flags as first argument?
			//if(cmd.args[2] == '' || cmd.args[2] == null) {
			//	cmd.args[2] = '-';  //path but no flags, create empty flag
			//	var i = cmd.args[1];  var j = cmd.args[2];//switch args so path is always second - this lets the user set flags before or after path
			//	cmd.args[1] = j;  cmd.args[2] = i;
			//}
			//else if(cmd.args[2].charAt(0) == '-') {//path and flags provided
			//	var i = cmd.args[1];  var j = cmd.args[2];//switch args so path is always second
			//	cmd.args[1] = j;  cmd.args[2] = i;
			//}
			//else { //assume no flags
				var newargs = new Array();
				newargs[0] = cmd.args[0];  //pass get
				newargs[1] = '-'; //pass empty flag
				
				for(var i = 2 ; i < cmd.args.length+1 ; i++) {
					newargs[i] = cmd.args[i-1];
				}
				cmd.args = newargs;
			//}
		}
	
		else { //flags first already - we good, just check path
			if(cmd.args[2] == '' || cmd.args[2] == null) cmd.args[2] = WD;
		} 
	
		if(cmd.args[2].charAt(0) == '/');  //check beginning of path for '/' to signify absolute path (ok to pass)
		else cmd.args[2] = WD + cmd.args[2];  //if not append WD
	
		dispatch(cmd);
	}
}


function jb_help(cmd)
{
	writeToConsole('********************************************' + LB + '*** msh Help' + LB + '********************************************' + LB);
	
	if((cmd.args[1] == '-commands') || (cmd.args[1] == '-command') || (cmd.args[1] == '--commands') || (cmd.args[1] == '--command')) {
		writeToConsole('****** Commands' + LB + '********************************************' + LB +
						'bg [file] : Sets background image' + LB +
						'cat [-*flags*] [filename] : outputs file contents (will crash your browser if file is large)' + LB +
						'cd [directory] : Change directory' + LB +
						'clear : Clears console' + LB +
						'get [filename] : Download file (see also \'mget\')' + LB +
						'help [-topic] : Shows help for supplied topic' + LB +
						'hide : Hides console' + LB +
						'install [package] : Load package for use' + LB +
						'learn [recent] [x]: Dispense knowledge' + LB +
						'ls [-*flags*] [directory] : List contents of directory' + LB +
						'mget : Download all files in directory' + LB +
						'play [file] : Play media in browser' + LB +
						'rf : Refresh' + LB +
						'rs [x] : Shrinks console by [x] %' + LB +
						'scroll : Toggles scrollbars in console' + LB +
						'upload : Opens upload file panel' + LB +
						'version : Display msh version information' + LB + 
						'who [user] : get user info (use \'who am i\' for client info)' + LB + LB +
						'Other implemented commands: about, alert, crash, echo, nag, ping' + LB);
	}
	
	else if((cmd.args[1] == '-browsers') || (cmd.args[1] == '-browser') || (cmd.args[1] == '--browsers') || (cmd.args[1] == '--browser')) {
		writeToConsole('****** Browser Compatibility Info' + LB + '********************************************' + LB +
						'msh was <b>coded specifically for</b> Firefox 3 on WinXP.  <a target="_blank" href="http://www.mozilla.com/en-US/firefox/all.html">Get Firefox 3</a>' + LB +
						'msh was <b>tested on</b> Internet Explorer 7, and Google Chrome.  It works reasonably well in these browers (including Safari due to Chrome\'s use of WebKit)' + LB +
						'This software is only "supported" using the latest build of Firefox 3 on Windows XP' + LB +
						'Why am I coding for Firefox (and to a lesser extent, Chrome) first and foremost?  See links:' + LB +
						'<a target="_blank" href="http://ejohn.org/blog/javascript-performance-rundown/"> - Javascript performance in IE is terrible</a>' + LB +
						'<a target="_blank" href="http://arstechnica.com/news.ars/post/20080819-mozilla-drags-ie-into-the-future-with-canvas-element-plugin.html"> - IE doesn\'t support the canvas element</a>' + LB +
						'<a target="_blank" href="http://www.robin.com.au/why-microsoft-internet-explorer-ie-sucks.html"> - IE is considered a web developer\'s mortal enemy in most situations</a>' + LB);
	}
	
	else writeToConsole('msh uses a pseudo <a target="_blank" href="http://en.wikipedia.org/wiki/Command_line_interface">command line interface (CLI)</a>' + LB +
						'Enter your command and press \'Enter\' to execute' + LB +
						'Up/down arrow keys will scroll through your command history' + LB +
						'Highlighting text on page will copy it , the \'insert\' key will paste it  to the console (independent of your OS\'s clipboard)' + LB +
						'Type \'help -commands\' for a short list of commands w/ descriptions' + LB);
	
	writeToConsole(LB);
}

function jb_hide(cmd)
{
	$("#bg").fadeOut('slow');
	
	//Wait for keypress
	waitForKey(function() {
		$("#bg").fadeIn('slow', function() {
			captureKeypress();
			$("#consoleInputDisplay").append('<span id="marker">&nbsp;</span>');
		});
	});
	
}

function jb_install(cmd)
{
	dhtmlLoadScript('js/' + cmd.args[1] + '.js?' + randInt(99999) );  //Randint arg prevents IE from caching js
	writeToConsole(LB);
}

function jb_learn(cmd)
{
	
	var learns = new Array();
	learns[0] = 'Use <a target="_blank" href="http://www.foxitsoftware.com/pdf/rd_intro.php">FoxIt</a> for PDF files.  <a target="_blank" href="http://dearadobe.com/">Adobe sucks.</a>';
	learns[1] = 'Do not use Internet Explorer when an alternative is feasible:  <a target="_blank" href="http://www.mozilla.com/firefox/">Firefox</a> | <a target="_blank" href="http://www.google.com/chrome">Chrome</a> | <a target="_blank" href="http://www.opera.com/">Opera</a> | <a target="_blank" href="http://www.apple.com/safari/">Safari</a>';
	learns[2] = 'In 1987, <a target="_blank" href="http://en.wikipedia.org/wiki/Max_Headroom_(character)">Max Headroom</a> <a target="_blank" href="http://howtopirate.com/2008/09/max-headroom-pirating-incident/">took over a local television network in Chicago.</a>';
	learns[3] = 'Don\'t bring your fucking kids to the grocery store.';
	learns[4] = '<a target="_blank" href="http://www.ubuntu.com/">Don\'t run Windows.</a>';
	learns[5] = '<a target="_blank" href="http://www.leap.cc/cms/index.php">Prohibition is wrong,</a> <a target="_blank" href="http://en.wikipedia.org/wiki/Arguments_for_and_against_drug_prohibition">ineffective,</a> <a target="_blank" href=http://blogs.salon.com/0002762/stories/2003/08/17/drugWarVictims.html">and kills innocent people.</a>';
	learns[6] = 'Tip your servers/bartenders.  If tipping wasn\'t required in the service industry, employers would have to pay wage to their servers- they would pass the expense onto the customer.  The food you eat is cheaper because servers get paid $2.83 an hour.  If you want them to make minimum wage (<a target="_blank" href="http://en.wikipedia.org/wiki/List_of_U.S._state_minimum_wages">now $7.25 by July 24, 2009</a>), you will end up paying more for your food, and you will be served by minimum wage employees (think: fast food, walmart).  Tipping lets us know who is an asshole, who is a bad server, and saves the customer money in the end.  Don\' be Mr. Pink.';
	learns[7] = '<a target="_blank" href="http://www.geocities.com/Athens/Thebes/2399/jesus.html">Jesus was an extraterrestrial</a>';
	learns[8] = '<a target="_blank" href="http://www.timecube.com/">Timecube will cure all that ails you (except the crazy).</a>';
	learns[9] = '<a target="_blank" href="http://www.zombo.com/">This</a> is the best site on the internet.';
	learns[10] = '<a target="_blank" href ="http://xkcd.com/">Funny.</a> <a target="_blank" href="http://pbfcomics.com/">Also funny.</a>';
	learns[11] = 'The ideal candidate is one who is much smarter than you, but who is also much poorer.';
	learns[12] = 'NOFX - <a target="_blank" href="http://video.google.com/videoplay?docid=-5637645708702385131">The Decline</a>';
	learns[13] = 'Don\'t bring your fucking kids to Vegas.';
	learns[14] = 'My home page: <a target="_blank" href ="http://www.fark.com">fark.com</a>';
	learns[15] = '"Some people, when confronted with a problem, think \'I know, I\'ll use regular expressions.\' Now they have two problems." --Jamie Zawinski';
	learns[16] = 'How this program was created: <a target="_blank" href="http://xkcd.com/323/">The Ballmer Peak</a>';
		
	var randLearn = randInt(learns.length);
	if(cmd.args[1] == 'recent') { //Display x most recent
		var num = 10;
		if (isInt(cmd.args[2])) num = Math.abs(cmd.args[2]);
		else if(cmd.args[2] != '' && cmd.args[2] != null) {
			num = 0;
			writeToConsole('Learn error: wrong argument for \'learn recent [x]\'' , 'error')
		}
		if(num > learns.length) num = learns.length;
		for(var i=(learns.length)-1; i > (learns.length)-num-1; i--) {
			writeToConsole(learns[i] , 'ok');	
		}
	}
	
	else if(isInt(cmd.args[1])) { //Show specific #
		writeToConsole(learns[Math.abs(cmd.args[1])] , 'ok');
	}
	
	else if(cmd.args[1] == '' || cmd.args[1] == null) writeToConsole(learns[randLearn] , 'ok');   //Random
	
	else writeToConsole('Learn error: unrecognized command.' , 'error'); 
}

function jb_ls(cmd)
{
	if(cmd.args[1] == '' || cmd.args[1] == null) {
		cmd.args[1] = '-';
		cmd.args[2] = WD;
	}
	
	else if(cmd.args[1].charAt(0) != '-') { //no flags as first argument?
		/* This section used to sort of let users enter flags before or after path - yeah, fuck that	
		if(cmd.args[2] == '' || cmd.args[2] == null) {
			cmd.args[2] = '-';  //path but no flags, create empty flag
			var i = cmd.args[1];  var j = cmd.args[2];//switch args so path is always second - this lets the user set flags before or after path
			cmd.args[1] = j;  cmd.args[2] = i;
		}
		else if(cmd.args[2].charAt(0) == '-') {//path and flags provided
			var i = cmd.args[1];  var j = cmd.args[2];//switch args so path is always second
			cmd.args[1] = j;  cmd.args[2] = i;
		}
		*/
		//else { //assume no flags
			var newargs = new Array();
			newargs[0] = cmd.args[0];  //pass ls
			newargs[1] = '-'; //pass empty flag
			
			for(var i = 2 ; i < cmd.args.length+1 ; i++) {
				newargs[i] = cmd.args[i-1];
			}
			cmd.args = newargs;
		//}
	}
	
	else { //flags first already - we good, just check path
		if(cmd.args[2] == '' || cmd.args[2] == null) cmd.args[2] = WD;
	} 
	
	if(cmd.args[2].charAt(0) == '/');  //check beginning of path for '/' to signify absolute path (ok to pass)
	else cmd.args[2] = WD + cmd.args[2];  //if not append WD
	
	dispatch(cmd);
}

function jb_mget(cmd)
{
	if(cmd.args[1] == '' || cmd.args[1] == null) {
		cmd.args[1] = '-';
		cmd.args[2] = WD;
	}
	
	else if(!(cmd.args[1] == '' || cmd.args[1] == null) && cmd.args[1].charAt(0) != '-') { //no flags as first argument?
			var newargs = new Array();
			newargs[0] = cmd.args[0];  //pass mget
			newargs[1] = '-'; //pass empty flag
			
			for(var i = 2 ; i < cmd.args.length+1 ; i++) {
				newargs[i] = cmd.args[i-1];
			}
			cmd.args = newargs;
	}
	
	else { //flags first already - we good, just check path
		if(cmd.args[2] == '' || cmd.args[2] == null) cmd.args[2] = WD;
	}
	
	if(cmd.args[2].charAt(0) == '/');  //check beginning of path for '/' to signify absolute path (ok to pass)
	else cmd.args[2] = WD + cmd.args[2];  //if not append WD
	
	dispatch(cmd);
}

function jb_nag(cmd)
{ 
	var whichNag = randInt(5);
	var nags = new Array();
	nags[0] = 'I\'m bored!';
	nags[1] = 'I want some ice cream!';
	nags[2] = 'Stop programming and go to bed!';
	nags[3] = 'Azeroth is not a real place!';
	nags[4] = 'Take a fucking shower!';
	writeToConsole(nags[whichNag] , 'warning');
}

function jb_ping(cmd) { writeToConsole('Pong!' + LB + LB); }

function jb_play(cmd) {
	if(cmd.args[1] == '' || cmd.args[1] == null) writeToConsole('get: not enough arguments' , 'error');
	
	else {
	
		if(cmd.args[1].charAt(0) != '-') { //no flags as first argument?

			var newargs = new Array();
			newargs[0] = cmd.args[0];  //pass get
			newargs[1] = '-'; //pass empty flag
				
			for(var i = 2 ; i < cmd.args.length+1 ; i++) {
				newargs[i] = cmd.args[i-1];
			}
			cmd.args = newargs;
		}
	
		else { //flags first already - we good, just check path
			if(cmd.args[2] == '' || cmd.args[2] == null) cmd.args[2] = WD;
		} 
	
		if(cmd.args[2].charAt(0) == '/');  //check beginning of path for '/' to signify absolute path (ok to pass)
		else cmd.args[2] = WD + cmd.args[2];  //if not append WD
		
		var toPlay = '';
		for(i = 2 ; i < cmd.args.length ; i++) toPlay += cmd.args[i]+ ' ';
		toPlay = toPlay.substring(0,toPlay.length-1);
		//toPlay.replace(/[']/g,"\\'");
		//alert(toPlay);
		writeToConsole(LB + '<div><object type="application/x-shockwave-flash" width="400" height="15" data="swf/xspf_player_slim.swf?song_url=php/download.php?f=' + toPlay + '&autoplay=true&song_title=' + toPlay + '"><param name="movie" value="swf/xspf_player_slim.swf?song_url=php/download.php?f=' + toPlay + '&autoplay=true&song_title=' + toPlay + '" /></object></div>' + LB);
	}
}

function jb_pwd(cmd) { writeToConsole(WD + LB + LB); }

function jb_rf(cmd) { location.reload(true); }

function jb_rs(cmd) {
	var pxs = 0;
	if(cmd.args[1] == '' || cmd.args[1] == null) {
		writeToConsole('rs: not enough arguments' , 'error');
	}
	else {
		if(cmd.args[1].charAt(0) == '-') pxs = cmd.args[1].substring(1);
		else pxs = cmd.args[1];
		
		var perc;
		if (pxs < 3) perc = .03;
		else if (pxs > 80) perc = .8;
		else perc = pxs / 100;

		var m = getX() * .5 * perc;
		document.body.style.marginLeft = m + "px";
		document.body.style.marginRight = m + "px";
		document.getElementById('bg').style.marginTop = (getY() * .5 * perc) + "px";
		document.getElementById('consoleDisplay').style.height = (getY() - 2*(getY()*perc)) + "px";
	}
			
}

function jb_scroll(cmd) {
    if(document.getElementById('consoleDisplay').style.overflow == 'auto') document.getElementById('consoleDisplay').style.overflow = 'hidden';
    else document.getElementById('consoleDisplay').style.overflow = 'auto';
}

function jb_upload(cmd) { 
	writeToConsole('<form id="upload_f" enctype="multipart/form-data" action="php/upload.php" method="POST" target="_blank">' +
						'<input type="hidden" name="MAX_FILE_SIZE" value="1000000000" />' +
						'file: <input name="uploadedfile" type="file" />' +
						'<input id="upload_sub" type="submit" value="Upload File" />' + 
					'</form><div style="clear:both;"></div>');
}

function jb_version(cmd) { writeToConsole(VERSION + LB + LB); }

function jb_who(cmd)
{
	if(cmd.args[1] == 'am' && cmd.args[2] == 'i') {
		writeToConsole('username: <b>' + USERNAME + '</b>' + LB +
						'ip: <b>' + IP + ' (' + HOSTNAME + ')' + '</b>' + LB +
						'browser: <b>' + browserName + ' ' + fullVersion + ' (' + nAgt + ')' + '</b>' + LB +
						'os/resolution: <b>' + OSName + ' ' + getX() + ' x ' + getY() + '</b>' + LB);
	}
	
	else if(cmd.args[1]  != '' || cmd.args[1] != null) {
		//Lookup a user
		dispatch(cmd);
	}
	
	else writeToConsole('who: not enough arguments' , 'error');
	
	writeToConsole(LB);
}



