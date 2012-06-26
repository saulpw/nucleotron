//particle.js

goog.provide('nucleotron.Particle');

goog.require('lime.Circle');

nucleotron.Particle = function(){
	console.log("created particle.js");
	lime.Sprite.call(this);
	this.setSize(10,10);
	this.RADIUS = 10;
    this.SPEED = .45;
	this.setAnchorPoint(.5, 0);
	this.shape = new lime.Circle().setSize(this.RADIUS * 2, this.RADIUS * 2).setFill(200, 0, 0);
	this.appendChild(this.shape);
    //this.v = goog.math.Vec2(.5,.5);
	this.vx = 0.5;
	this.vy = 0.5;
	//console.log('particle has been created at ' + paddleX + ":" + paddleY);
}	
goog.inherits(nucleotron.Particle, lime.Sprite);

nucleotron.Particle.prototype.enableSimulation = function(pX, pY) {
	//this.v = goog.math.Vec2(Math.random() * .5, -.8).normalize();
    //this.v = ;
    this.shape.setPosition(pX, pY);
	this.a = 0;
};

nucleotron.Particle.prototype.updatePosition = function(dt) {
	//console.log('this particle updated');
	this.pos = this.shape.getPosition();
    //pos.x += this.v.x * dt * this.SPEED;
    this.pos.x += this.vx * dt * this.SPEED;
	this.pos.y += this.vy * dt * this.SPEED;
	this.shape.setPosition(this.pos.x, this.pos.y);
	//pos.y += this.v.y * dt * this.SPEED;
	console.log("x " + this.pos.x + " y " + this.pos.y);
}

nucleotron.Particle.prototype.checkCollision = function(worldSize){
	this.pos = this.shape.getPosition();
	
	if (this.pos.x < this.RADIUS) {
        // bounce off left wall
        this.vx *= -1;
        this.pos.x = this.RADIUS;
    }
    else if (this.pos.x > worldSize.width - this.RADIUS) {
        // bounce off right wall
        this.vx *= -1;
        this.pos.x = worldSize.width - this.RADIUS;
    }
	
    if (this.pos.y < this.RADIUS) {
		this.vy *= -1;
		this.pos.y = this.RADIUS;
    }
    else if (this.pos.y > worldSize.height - this.RADIUS) {
		this.vy *= -1;
		this.pos.y = worldSize.height - this.RADIUS;

    }
}