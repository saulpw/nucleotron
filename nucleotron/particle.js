//particle.js

goog.provide('nucleotron.Particle');

goog.require('lime.Circle');

nucleotron.Particle = function(){
	lime.Sprite.call(this);
	this.setSize(10,10);
	this.RADIUS = 10;
    this.SPEED = .45;
	this.ball = new lime.Circle().setSize(this.RADIUS * 2, this.RADIUS * 2).setFill(200, 0, 0);
	
}	
goog.inherits(nucleotron.Particle, lime.Sprite);