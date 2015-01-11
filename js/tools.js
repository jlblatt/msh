/*-- tools.js
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

//Get browser info code from JavaScripter.net
// http://www.javascripter.net/faq/browsern.htm

var nVer = navigator.appVersion;
var nAgt = navigator.userAgent;
var browserName  = '';
var fullVersion  = 0; 
var majorVersion = 0;

// In Internet Explorer, the true version is after "MSIE" in userAgent
if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
 browserName  = "Internet Explorer";
 fullVersion  = parseFloat(nAgt.substring(verOffset+5));
 majorVersion = parseInt(''+fullVersion);
}

// In Opera, the true version is after "Opera" 
else if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
 browserName  = "Opera";
 fullVersion  = parseFloat(nAgt.substring(verOffset+6));
 majorVersion = parseInt(''+fullVersion);
}

// In Firefox, the true version is after "Firefox" 
else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
 browserName  = "Firefox";
 fullVersion  = parseFloat(nAgt.substring(verOffset+8));
 majorVersion = parseInt(''+fullVersion);
}

else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
 browserName  = "Chrome";
 fullVersion  = parseFloat(nAgt.substring(verOffset+7));
 majorVersion = parseInt(''+fullVersion);
}

// In most other browsers, "name/version" is at the end of userAgent 
else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < (verOffset=nAgt.lastIndexOf('/')) ) 
{
 browserName  = nAgt.substring(nameOffset,verOffset);
 fullVersion  = parseFloat(nAgt.substring(verOffset+1));
 if (!isNaN(fullVersion)) majorVersion = parseInt(''+fullVersion);
 else {fullVersion  = 0; majorVersion = 0;}
}

// Finally, if no name and/or no version detected from userAgent...
else
{
 browserName  = navigator.appName;
 fullVersion  = parseFloat(nVer);
 majorVersion = parseInt(nVer);
}

var OSName="Unknown OS";  // http://www.javascripter.net/faq/operatin.htm
if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";


//Get selected text
// http://www.codetoad.com/javascript_get_selected_text.asp
function getSelText()
{
    var txt = '';
    
    if (window.getSelection) txt = window.getSelection();
    else if (document.getSelection) txt = document.getSelection();
    else if (document.selection) txt = document.selection.createRange().text;
    
    return txt;
}

//Set cursor position in textarea
// http://blog.josh420.com/archives/2007/10/setting-cursor-position-in-a-textbox-or-textarea-with-javascript.aspx
function setCaretPosition(elemId, caretPos) {
    var elem = document.getElementById(elemId);

    if(elem != null) {
        if(elem.createTextRange) {
            var range = elem.createTextRange();
            range.move('character', caretPos);
            range.select();
        }
        else {
            if(elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(caretPos, caretPos);
            }
            else
                elem.focus();
        }
    }
}

//Dynamically load external javascript
// http://www.codehouse.com/javascript/articles/external/
function dhtmlLoadScript(url)
{
   var e = document.createElement("script");
   e.src = url;
   e.type="text/javascript";
   document.getElementsByTagName("head")[0].appendChild(e);
}

// http://www.peterbe.com/plog/isint-function
function isInt(x)
{
	var y=parseInt(x);
	if (isNaN(y)) return false;
	return x==y && x.toString()==y.toString();
} 

function randInt(max)
{
	return randomnumber=Math.floor(Math.random()*max)  //http://www.javascriptkit.com/javatutors/randomnum.shtml
}

function getX()
{
	if(browserName == 'Internet Explorer') return document.body.clientWidth;
	else return window.innerWidth;
}

function getY()
{
	if(browserName == 'Internet Explorer') return document.body.clientHeight;
	else return window.innerHeight;
}