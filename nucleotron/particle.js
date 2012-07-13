//particle.js

goog.provide('nucleotron.Particle');

goog.require('lime.Circle');

nucleotron.Particle = function(type){
	lime.Sprite.call(this);
	this.particleType = type;
	this.setSize(10,10);
	this.RADIUS = 10;
    this.SPEED = .45;
	this.setAnchorPoint(.5, 0);
	this.shape = new lime.Circle().setSize(this.RADIUS * 2, this.RADIUS * 2).setFill(200, 0, 0);
	this.appendChild(this.shape);
	this.vx = 0.0;
	this.vy = 0.0;
	this.vxOld = 0.0;
	this.vyOld = 0.0;
	this.posCharge = true;
	this.MASS = 5;
	this.acclx = 0;
	this.accly = -0.1;
	//var type = "protron";
	if(type == 1){ //protron
		this.shape.setFill(200, 0, 0);
		this.posCharge = true;
	}
	else if(type == 2){ //electron
		this.shape.setFill(0, 200, 200);
		this.shape.setSize(this.RADIUS, this.RADIUS);
		this.posCharge = false;	
	}
	else if(type == 3){ //alpha
		this.shape.setFill(0, 0, 200);
		this.shape.setSize(this.RADIUS * 1.5, this.RADIUS * 1.5);
		this.shape2 = new lime.Circle().setSize(this.RADIUS * 1.5, this.RADIUS * 1.5).setFill(200,0,0);
		//this.shape2.setAnchorPoint(0.5, 0.5);
		this.appendChild(this.shape2);
		this.posCharge = false;
	}
	
}	
goog.inherits(nucleotron.Particle, lime.Sprite);

nucleotron.Particle.prototype.enableSimulation = function(pX, pY) {
    this.shape.setPosition(pX, pY);
	this.a = 0;
};


nucleotron.Particle.prototype.updatePosition = function(dt) {
	//v = v0 + at
	this.vx = this.vxOld + this.acclx * dt;
	this.vy = this.vyOld + this.accly * dt;
	//console.log('this particle updated');
	this.pos = this.shape.getPosition();
    //pos.x += this.v.x * dt * this.SPEED;
    this.pos.x += this.vx; //* dt * this.SPEED;
	this.pos.y += this.vy; //* dt * this.SPEED;
	this.shape.setPosition(this.pos.x, this.pos.y);
	
	this.vxOld = this.vx;
	this.vyOld = this.vy;
	
}

nucleotron.Particle.prototype.checkCollision = function(worldSize){
	this.pos = this.shape.getPosition();
	
	if (this.pos.x < this.RADIUS) {
        // bounce off left wall
        this.vx *= -1;
		this.vxOld *= -1;
        this.pos.x = this.RADIUS;
    }
    else if (this.pos.x > worldSize.width - this.RADIUS) {
        // bounce off right wall
        this.vx *= -1;
		this.vxOld *= -1;
        this.pos.x = worldSize.width - this.RADIUS;
    }
	
    if (this.pos.y < this.RADIUS) {
		this.vy *= -1;
		this.vyOld *= -1;
		this.pos.y = this.RADIUS;
    }
    else if (this.pos.y > worldSize.height - this.RADIUS) {
		this.vy *= -1;
		this.vyOld *= -1;
		this.pos.y = worldSize.height - this.RADIUS;
    }
}

nucleotron.Particle.prototype.checkParticleCollision = function(particle){
	
	if(particle == null)
	{
		return false;
	}
	var otherPos = particle.shape.getPosition();
	var otherRad = particle.RADIUS;
	var distance = Math.sqrt( Math.pow(otherPos.x - this.pos.x, 2) + Math.pow(otherPos.y - this.pos.y, 2));
	
	var radii = Math.abs(this.RADIUS + otherRad);
	
	if (distance <= radii){
		//collision
		//this.shape.setFill(0, 200, 0);
		return true;
	}
	else
	{
		return false;
	}
}