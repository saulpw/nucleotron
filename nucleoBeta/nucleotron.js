//set main namespace
goog.provide('nucleotron');


//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.GlossyButton');
goog.require('nucleotron.Game');


// entrypoint
nucleotron.start = function(){

	lime.scheduleManager.setDisplayRate(1000 / 60);
	

	var director = new lime.Director(document.body,1024,768),
	    scene = new lime.Scene(),
		layer = new lime.Layer();	
	
	
	
	
	var btn = new lime.GlossyButton('Start').setSize(100, 40).setPosition(150, 100);
		goog.events.listen(btn, 'click', function() {
				nucleotron.newgame();
		});
		layer.appendChild(btn);

	scene.appendChild(layer);
	
		
	director.makeMobileWebAppCapable();

// set current scene active
	director.replaceScene(scene);
	
}

//starts a new game, switches scene game.js
nucleotron.newgame = function(mode) {
	var scene = new lime.Scene(),
	layer = new lime.Layer();

	scene.appendChild(layer);

	var game = new nucleotron.Game(mode);
	layer.appendChild(game);
	

	nucleotron.director.replaceScene(scene);
};

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('nucleotron.start', nucleotron.start);
