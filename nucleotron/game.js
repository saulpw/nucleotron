//Game.js

goog.provide('nucleotron.Game');

goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.RoundedRect');
goog.require('lime.Sprite');
goog.require('lime.animation.FadeTo');
goog.require('lime.fill.LinearGradient');
goog.require('nucleotron.Notice');
goog.require('nucleotron.Player');
goog.require('nucleotron.Particle');
goog.require('lime.audio.Audio');


nucleotron.Game = function(mode) {
    lime.Sprite.call(this);

    this.RADIUS = 10;
    this.SPEED = .45;
    this.WIDTH = 300;
    this.HEIGHT = 360;
    this.mode = 1;
    this.winning_score = 10;

	this.GRAVITY = 1; //gravity constant
	
    this.setAnchorPoint(0, 0);
    this.setSize(320, 460);
	
	//
	this.particles = new Array();
	this.particles[0] = null;
	
    var back = new lime.fill.LinearGradient().addColorStop(0, '#bbb').addColorStop(1, '#DDD');
    this.setFill(back);


    this.world = new lime.Sprite().setFill('#FFF').setSize(this.WIDTH, this.HEIGHT).setPosition(10, 50).
        setAnchorPoint(0, 0);
    this.appendChild(this.world);

    this.p1 = new nucleotron.Player(1);
    this.p1.enableInteraction();
    this.world.appendChild(this.p1);

    this.p2 = new nucleotron.Player(0);
    if (mode == 1)
    this.p2.enableSimulation();
    else
    this.p2.enableInteraction();
    //this.world.appendChild(this.p2);


    this.ball = new lime.Circle().setSize(this.RADIUS * 2, this.RADIUS * 2).setFill(200, 0, 0);
    //this.world.appendChild(this.ball);
    this.placeball();

    this.notice = new nucleotron.Notice().setPosition(160, 200).setHidden(false);
    this.appendChild(this.notice);

    this.endRoundSound = new lime.audio.Audio('assets/applause.wav');
    this.bounceSound = new lime.audio.Audio('assets/bounce.wav');
};
goog.inherits(nucleotron.Game, lime.Sprite);


nucleotron.Game.prototype.start = function() {
    lime.scheduleManager.schedule(this.step_, this);
    this.notice.setHidden(true);
    this.v = new goog.math.Vec2(Math.random() * .5, -.8).normalize();
};

//spawn particles
nucleotron.Game.prototype.spawnParticles = function() {
	
	pos = this.p1.getPosition();
	
	this.tempParticle = new nucleotron.Particle();
	console.log("Click");
	this.tempParticle.enableSimulation(pos.x, pos.y - 60);
	this.world.appendChild(this.tempParticle);
	if(this.particles.length == 0){
		this.particles[0] = this.tempParticle;
	}
	else{
		this.particles.push(this.tempParticle);
	}
	console.log("particles: " + this.particles.length);
	
}

//var logs = [];var ii=0;
nucleotron.Game.prototype.step_ = function(dt) { //Update loop
  
    if (this.mode == 1)
    //this.p2.updateTargetPos(pos.x, this.v.y, dt);

    //this.ball.setPosition(pos);
	var i;
	for(i = 0; i < this.particles.length; i++){
		if(this.particles[i] != null)
		{
		    this.particles[i].checkCollision(this.world.getSize());
			this.particles[i].updatePosition(dt);
			//loop through particles
			var j;
			for(j = 0; j < this.particles.length; j++){
				if(i != j && this.particles[j] != null){
					this.simulatePhysics(this.particles[i],this.particles[j]);
					
					if(this.particles[i].checkParticleCollision(this.particles[j])){
							this.particles[j].setPosition(1000,1000); //move offscreen
							this.particles.splice(j, 1);
						}
				}
			}
			
		}
	}
	
	
	
	goog.events.listenOnce(this.world, ['touchstart', 'mousedown'], this.spawnParticles, false, this);
	//console.log("# of particles" + this.particles.length);
	//iterate through particle objects
	

};
nucleotron.Game.prototype.placeball = function() {
    //this.ball.setPosition(this.WIDTH / 2, this.HEIGHT - this.RADIUS);
    goog.events.listenOnce(this.world, ['touchstart', 'mousedown'], this.start, false, this);
    this.p1.setPosition(this.WIDTH / 2, this.HEIGHT);
    //this.p2.setPosition(this.WIDTH / 2, 0);
};

nucleotron.Game.prototype.endGame = function() {
    this.notice.title.setText(this.p1.score > this.p2.score ? 'You won!' : 'You lost.');
    this.notice.score.setText(this.p1.score + ' : ' + this.p2.score);
    this.notice.setOpacity(0).setHidden(false);
    var show = new lime.animation.FadeTo(1);
    this.notice.runAction(show);
    goog.events.listenOnce(this.notice, ['touchstart', 'mousedown'], nucleotron.newgame, false, this);
}

nucleotron.Game.prototype.endRound = function(winner) {
    winner.score++;

    lime.scheduleManager.unschedule(this.step_, this);

    if(winner.score >= this.winning_score) {
        this.endGame();
        return;
    }
    
    this.notice.title.setText(winner == this.p1 ? 'You scored' : 'Opponent scored');
    this.notice.score.setText(this.p1.score + ' : ' + this.p2.score);

    this.notice.setOpacity(0).setHidden(false);
    var show = new lime.animation.FadeTo(1);
    goog.events.listen(show, lime.animation.Event.STOP, function() {
        this.placeball();
    },false, this);
    this.notice.runAction(show);

    this.endRoundSound.stop();
    this.endRoundSound.play();
};

//simulate physics
nucleotron.Game.prototype.simulatePhysics = function(particle1, particle2){
	//F = G((m1 * m2)/ r^2)
	//console.log('simulating physics');
	var posShape1 = particle1.shape.getPosition();
	var posShape2 = particle2.shape.getPosition();
	
	var distX = Math.abs(posShape2.x - posShape1.x);
	var distY = Math.abs(posShape2.y - posShape1.y);
	
	var forceX = this.GRAVITY * ((particle1.MASS * particle2.MASS) / Math.pow(distX, 2));
	var forceY = this.GRAVITY * ((particle1.MASS * particle2.MASS) / Math.pow(distY, 2));
	console.log('forcex:' + forceX + 'forceY' + forceY);
	//f / m = a;
	particle1.acclx = forceX / particle1.MASS;
	particle1.accly = forceY / particle1.MASS;
	
	//particle2.acclx = forceX / particle2.MASS;
	//particle2.accly = forceY / particle2.MASS;
};