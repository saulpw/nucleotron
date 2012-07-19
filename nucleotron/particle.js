//particle.js

goog.provide('nucleotron.Particle');

goog.require('lime.Circle');

nucleotron.Particle = function(type, _Z, _N, _e){
	lime.Sprite.call(this);
	this.particleType = type;
	
	this.e = _e;
	this.N = _N;
	this.Z = _Z;
	this.hadronMass = 1;

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
	this.charge = -1;
	//this.posCharge = true;
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
		this.shape2.setAnchorPoint(0.5, 0.5);
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

//Decay functions
nucleotron.Particle.prototype.checkDecay = function (){
	decay_energy = 0;
	tempParticle = ;
	if(this.charge < 0 && ){ //if the charge is negative
		if(/*random*/ < 0.01){
			electrons--;
			tempParticle = new nucleotron.Particle(type, 0, 0, 1)
			decay_energy = 5;
		}
	} 
	else if(Math.random() < is){ //ISOTOPE = goes through table and reutrns probably based on Zparticles and Nuetorns
		//must implement table first.


	}


	/*
	else if (Math.random() < isotope.decayprob)
		{
			var x:Number = Math.random();
			for (var i:Number=0; i < isotope.mechanisms.length; i++)
			{
				var m:DecayMethod = isotope.mechanisms[i];
				if (x < m.probability)
				{
                    var kev:Number = this.isotope.massexcess;
					newp = decay(m);
                    var kevnew:Number = this.isotope.massexcess;
                    if (newp.isotope.massexcess)
                    {
                         //trace(newp.isotope.massexcess);
                         kevnew += newp.isotope.massexcess;
                    }
                    energy = (kev - kevnew);
                    if (energy < 0)
                    {
//                        trace(energy);
//                       trace("ejected =" + newp.Z + "," + newp.N);
//                        trace("remainder =" + Z + "," + N);
                    }
					break;
				}
				else
				{
					x -= m.probability;
					trace("ignoring decay method");
				}
			}
		}
		if (newp)
		{
			bounceMovie();
			newp.pos = pos;
			
			var angle:Number = Math.random() * 2 * Math.PI;
            var vnewp:Vector;

            if (energy >= 0)
            {
			    vnewp = Vector.Polar(Math.sqrt(energy/newp.mass), angle);
            }
            else
            {
                // if endothermic, take it out of our velocity
                vnewp = Vector.Polar(Math.sqrt(this.energy/this.mass)/10, angle);
            }
            newp.velocity = vnewp;
            var mnewp:Vector = vnewp.mult(newp.mass);
            this.velocity = this.velocity.sub(mnewp.div(this.mass));
		}
		return newp;

		///GETS ISOTOPE
	public function get isotope():Isotope
	{
		return Nucleotron.g_decayTable.getIsotope(Z, N);
	}
	*/

}

nucleotron.Particle.prototype.decay = function(){

}

nucleotron.Particle.prototype.emitNutrino = function(){

}

nucleotron.Particle.prototype.isHadron = function(){
	return (Zparticles != 0 || neutrons != 0);
}

nucleotron.Particle.prototype.Isotope = function(){
	return nucleotron.Game.decayTable.getIsotope(Z, N); //this doesn't work and I know it wont >:(
}