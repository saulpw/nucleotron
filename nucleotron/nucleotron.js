//set main namespace
goog.provide('nucleotron');


//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.GlossyButton');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');

goog.require('nucleotron.Game');

// entrypoint
nucleotron.start = function(){

lime.scheduleManager.setDisplayRate(1000 / 60);
	

	var director = new lime.Director(document.body,1024,768),
	    scene = new lime.Scene(),
		layer = new lime.Layer();	
	
	
	var label = new lime.Label("Nucleotron - test build please ignore").setPosition(150,20);
		layer.appendChild(label);
	
	var btn = new lime.GlossyButton('Start').setSize(100, 40).setPosition(150, 100);
		goog.events.listen(btn, 'click', function() {
				nucleotron.newgame(1);
		});
		layer.appendChild(btn);

	scene.appendChild(layer);
	
		
	director.makeMobileWebAppCapable();

// set current scene active
	director.replaceScene(scene);

}

nucleotron.newgame = function(mode) {
	var director = new lime.Director(document.body,1024,768)
	var scene = new lime.Scene(),
	layer = new lime.Layer();

	scene.appendChild(layer);

	var game = new nucleotron.Game(mode);
	layer.appendChild(game);
	

	director.replaceScene(scene);
	//this.director.replaceScene(scene);
};

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('nucleotron.start', nucleotron.start);
