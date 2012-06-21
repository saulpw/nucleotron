//particle.js

goog.provide('nucleotron.Particle');

goog.require('lime.Circle');

nucleotron.Particle = function(){
	lime.Sprite.call(this);
	this.setSize(10,10);
	
}
goog.inherits(nucleotron.Particle, lime.Sprite);