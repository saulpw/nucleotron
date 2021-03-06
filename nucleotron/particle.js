//particle.js

goog.provide('nucleotron.Particle');
goog.require('nucleotron.Isotope');
goog.require('lime.Circle');

nucleotron.Particle = function(type, _N, _Z, _e){
	lime.Sprite.call(this);
	this.particleType = type;
	this.Isotope = new nucleotron.Isotope();
	this.e = _e;
	this.N = _N;
	this.Z = _Z;
	this.hadronMass = 1;
	this.electronMass = 0.2;

	this.setSize(10,10);
	
	this.RADIUS = 10;
    this.SPEED = .45;
	
	this.setAnchorPoint(.5, 0);
	this.shape = new lime.Circle().setSize(this.RADIUS * 2, this.RADIUS * 2).setFill(200, 0, 0);
	this.appendChild(this.shape);

	this.particleList = new Array();
	
	this.vx = 0.0;
	this.vy = 0.0;
	this.vxOld = 0.0;
	this.vyOld = 0.0;

	this.maxV = 3.5; //max velocity

	this.charge = -1;
	//this.posCharge = true;
	this.MASS = 5;
	this.acclx = 0;
	this.accly = -0.1;
	this.particle_type = type;
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
		this.updateGraphic();
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

	if(this.vx > this.maxV){
		this.vx = this.maxV;

	}
	if(this.vy > this.maxV){
		this.vy = this.maxV;

	}


	this.pos = this.shape.getPosition();
    //pos.x += this.v.x * dt * this.SPEED;
    this.pos.x += this.vx; //* dt * this.SPEED;
	this.pos.y += this.vy; //* dt * this.SPEED;
	this.shape.setPosition(this.pos.x, this.pos.y);
	
	this.vxOld = this.vx;
	this.vyOld = this.vy;

	
}

nucleotron.Particle.prototype.getMass = function(){
	//	return (Math.abs(this.N) + Math.abs(this.Z)) * hadronMass + Math.abs(this.e) * electronMass;
	return (Math.abs(this.N) + Math.abs(this.Z)) * this.hadronMass + Math.abs(this.e) * this.electronMass;
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
		this.Z += particle.Z;
		this.N += particle.N;
		this.e += particle.e;
		this.updateGraphic();
		return true;
	}
	else
	{
		return false;
	}
}



nucleotron.Particle.prototype.updateGraphic = function(){
	//destroy Shape.
	this.shape.removeAllChildren();
	//range mounts
	min = -0.5;
	max = 0.5;
	//electron sheild at the bottom
	if(this.e >= 2){
		shell = new lime.Circle().setSize(this.RADIUS * 5, this.RADIUS * 5).setFill(0,0,200,0.5).setAnchorPoint(0.5, 0.5);
		this.shape.appendChild(shell);
	}
	else if (this.e >= 5){
		shell = new lime.Circle().setSize(this.RADIUS * 5, this.RADIUS * 5).setFill(0,0,200,0.7).setAnchorPoint(1, 1);
		this.shape.appendChild(shell);
	}
	else if (this.e >= 10){
		shell = new lime.Circle().setSize(this.RADIUS * 5, this.RADIUS * 5).setFill(0,0,200,0.9).setAnchorPoint(1, 1);
		this.shape.appendChild(shell);
	}

	for(i = 0; i < this.Z; i++){
		tempshape = new lime.Circle().setSize(this.RADIUS * 1.5, this.RADIUS * 1.5).setFill(200, 0, 0);
		tempX = min + (max - min) * Math.random();
		tempY = min + (max - min) * Math.random();
		tempshape.setAnchorPoint(tempX, tempY);
		tempshape.angle = 360 * Math.random();
		this.shape.appendChild(tempshape);
		this.particleList[i] = tempshape;

	}
	for(i = 0; i < this.N; i++){
		tempshape = new lime.Circle().setSize(this.RADIUS * 1.5, this.RADIUS * 1.5).setFill(0, 0, 200);
		tempX = min + (max - min) * Math.random();
		tempY = min + (max - min) * Math.random();
		tempshape.setAnchorPoint(tempX, tempY);
		tempshape.angle = 360 * Math.random();
		this.shape.appendChild(tempshape);
		this.particleList[i + this.Z] = tempshape;
	}
	

}

nucleotron.Particle.prototype.moveParticles = function(_dt){
	//go through the particle list, move the particle's X and Y based on sin(x + dt)
	diff = _dt / 0.15;
	for(i = 0; i < this.particleList.length; i++){
		//this.particleList[i].setPosition(Math.cos(this.particleList[i].getPosition().x), Math.cos(this.particleList[i].getPosition().y));
		
		this.particleList[i].setPosition( 20 * Math.cos(this.particleList[i].angle += (diff)), 20 * Math.sin(this.particleList[i].angle += (diff) ) );
	}
}

nucleotron.Particle.prototype.emitNutrino = function(){
//later
alert("emit nutrino");
}

nucleotron.Particle.prototype.isHadron = function(){
	return (Zparticles != 0 || neutrons != 0);
}

nucleotron.Particle.prototype.Isotope = function(){
	return this.Isotope;
}
