
var isTouch = ("ontouchstart" in window);
var evt=[{"down": "mousedown", "move": "mousemove", "up": "mouseup"},{"down": "touchstart", "move": "touchmove", "up": "touchend"}][+isTouch];
var ready = function() {
	
	var locRouter = {
			"#home" : "home",
			"#level-select" : "exitState",
			"#stage" : "initStage"
		},
		eventRouter = {
			home: function() {
			},

			exitGame: function() {
					
			},
			
			initStage: function(){
			}
			
		},
		routeHash = function(){
			var selected = nav.querySelector(".selected");
			selected && selected.classList.remove("selected");
			nav.querySelector("[href='" + location.hash + "']").parentNode.classList.add("selected");
			location.hash in locRouter && eventRouter[locRouter[location.hash]]();
		},
		nav = document.getElementById("main-nav");
	document.body.classList.add("loaded");
	window.addEventListener("hashchange", routeHash, false);
	location.hash == "" && (location.hash = "home");
	routeHash();
}	
document.addEventListener("DOMContentLoaded", ready, false);