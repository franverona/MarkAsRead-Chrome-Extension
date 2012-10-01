// ==UserScript==
// @name          Google Reader - Mark Selected Items as Read
// @version       2.1
// @namespace     http://twitter.com/franverona
// @description   This script adds the button "Mark selected as read" and a checkbox for each item.
// @author        Fran Verona (adapted for new Google Reader and Google Chrome from Dmitry Rodiontsev original script)
// @include       htt*://www.google.tld/reader/view/*
// ==/UserScript==

/*
Version history

1.0 on 20/08/2011:
    - Initial version.
	
2.0 on 12/08/2012:
	- Adapted to new Google Chrome extension API.
	- Modified to work with the new Google Reader interface.
	
2.1 on 15/08/2012:
	- Browser's language
	
2.2 on 24/08/2012:
	- Support for Google Reader ES and EN

*/

var buttonText = "Mark as read";
var buttonId = "mark-selected-as-read";
var articles = new Array();

var buttonTextInv = "Invert selection";
var buttonIdInv = "invert-select";
var articlesInv = new Array();

var userLang = (navigator.language) ? navigator.language : navigator.userLanguage;

if(userLang == "es"){
	buttonText = "Marcar como leido";
	buttonTextInv = "Invertir seleccion";
}

document.getElementById('settings-button-container').style.minWidth = '24px';
document.getElementById('item-up-down-buttons').style.display = 'none';

document.addEventListener("DOMNodeInserted", function(event){
   nodeInserted(event);
}, true);

function nodeInserted(event) {
   var entries = document.getElementById("entries");
   if (entries && matchClass(entries, "list")) {
      var button = document.getElementById(buttonId);
      if (!button) {
         articles = new Array();
         appendButton();
      }
        
      var element = event.target;
      if (element. className && element.className.match(/entry\s+entry-\d+/) != null) {
         articles.push(element);
            
         var checkbox = document.createElement("input");
         checkbox.type = "checkbox";
         checkbox.className = "mark-selected-as-read-checkbox-class";
         checkbox.style.marginRight = "9px";
         checkbox.style.verticalAlign = "top";
         checkbox.addEventListener("click", function(event) {
            event.stopPropagation();
         }, true);
         var entrySecondary = element.getElementsByClassName("entry-secondary")[0];
         entrySecondary.insertBefore(checkbox, entrySecondary.firstChild);
      }
   }
}

function appendButton() {
   var viewerTopControlsId = "viewer-top-controls";
   var markAllAsReadId = "mark-all-as-read-split-button";

   var divVewerTopControls = document.getElementById(viewerTopControlsId);
   var btnMarkAllAsRead = document.getElementById(markAllAsReadId);

   if ((divVewerTopControls != null) && (btnMarkAllAsRead != null)) {
      var button = document.createElement("div");
      button.className = "goog-button goog-button-base unselectable goog-inline-block goog-button-float-left goog-button-tight scour-disabled viewer-buttons";
      button.id = buttonId;
      button.innerHTML = "<div class=\"goog-button-base-outer-box goog-inline-block\">"
      + "<div class=\"goog-button-base-inner-box goog-inline-block\">"
      + "<div class=\"goog-button-base-pos\">"
      //+ "<div class=\"goog-button-base-top-shadow\">&nbsp;</div>"
      + "<div class=\"goog-button-base-content\">"
      + "<div class=\"goog-button-body\">" + buttonText + "</div>"
      + "</div>"
      + "</div>"
      + "</div>"
      + "</div>";
      button.addEventListener("click", markSelectedAsRead, false);
      divVewerTopControls.insertBefore(button, btnMarkAllAsRead);
	  
	  var buttonInv = document.createElement("div");
      buttonInv.className = "goog-button goog-button-base unselectable goog-inline-block goog-button-float-left goog-button-tight scour-disabled viewer-buttons";
      buttonInv.id = buttonId;
      buttonInv.innerHTML = "<div class=\"goog-button-base-outer-box goog-inline-block\">"
      + "<div class=\"goog-button-base-inner-box goog-inline-block\">"
      + "<div class=\"goog-button-base-pos\">"
      //+ "<div class=\"goog-button-base-top-shadow\">&nbsp;</div>"
      + "<div class=\"goog-button-base-content\">"
      + "<div class=\"goog-button-body\">" + buttonTextInv + "</div>"
      + "</div>"
      + "</div>"
      + "</div>"
      + "</div>";
      buttonInv.addEventListener("click", invertSelection, false);
      divVewerTopControls.insertBefore(buttonInv, btnMarkAllAsRead);
   }
}

function matchClass (element, sClassName) {
   return (sClassName
      && element.className
      && element.className.length
      && element.className.match(new RegExp("(^|\\s+)(" + sClassName +")($|\\s+)")));
}

function simulateClick(node) {
   var event = node.ownerDocument.createEvent("MouseEvents");
   event.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
   node.dispatchEvent(event);
}

function simulateKeypress(node, keyCode) {
   var event = node.ownerDocument.createEvent("KeyboardEvent");
   event.initKeyboardEvent("keypress", true, true, null, false, false, false, false, keyCode, 0);
   node.dispatchEvent(event);
}

function simulateRead(node) {
   simulateKeypress(node, 77); //"m" button - mark entry as read.
}

function simulateCollapse(node) {
   simulateKeypress(node, 79); //"o" button - expand/collapse entry.
}

function getArticleIcon(article) {
   var divs = article.getElementsByTagName("div");
   for (var i = 0; i < divs.length; i++) {
      var div = divs[i];
      if (matchClass(div, "entry-icons")) return div;
   }
   return null;
}

function invertSelection(){
   var container = document.getElementById("entries");
   for (var i = 0; i < articles.length; i++) {
      var article = articles[i];
      var checkbox = article.getElementsByTagName("input")[0];
	  checkbox.checked = !checkbox.checked;
   }
}

function markSelectedAsRead() {
   var container = document.getElementById("entries");
   container.style.display = "none";
   for (var i = 0; i < articles.length; i++) {
      var article = articles[i];
      var checkbox = article.getElementsByTagName("input")[0];
      if (checkbox.checked) {
         if (!(matchClass(article, "read"))) {
            var articleIcon = getArticleIcon(article);
            simulateClick(articleIcon);
            if (!(matchClass(article, "read"))) {
               simulateRead(articleIcon);
            }
            if (matchClass(article, "expanded")) {
               simulateClick(articleIcon);
			   console.info('match_expanded: '+i);
            }
         }
         checkbox.checked = false;
      }
   }
   container.style.display = "block";
}
