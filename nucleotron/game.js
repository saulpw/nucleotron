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
    this.setSize(320, 550); //orig val 320,460
	
	//
	this.particles = new Array();
	//this.particles[0] = null;
	
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
	//add buttons
	this.btnPro = new lime.GlossyButton('Protron').setSize(100, 40).setPosition(50, 400);
	this.btnEle = new lime.GlossyButton('Electron').setSize(100, 40).setPosition(150, 400);
	this.btnAlp = new lime.GlossyButton('Alpha').setSize(100, 40).setPosition(250, 400);
		
	
	this.world.appendChild(this.btnPro);
	this.world.appendChild(this.btnEle);
	this.world.appendChild(this.btnAlp);
	
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
nucleotron.Game.prototype.spawnProtron = function() {
	this.spawnParticles(1);
}

nucleotron.Game.prototype.spawnElectron = function() {
	this.spawnParticles(2);
}

nucleotron.Game.prototype.spawnAlpha = function() {
	this.spawnParticles(3);
}

nucleotron.Game.prototype.spawnParticles = function(type) {
	pos = this.p1.getPosition();
	this.tempParticle = new nucleotron.Particle(type);
	this.tempParticle.enableSimulation(pos.x, pos.y - 60);
	this.world.appendChild(this.tempParticle);
	
	this.particles.push(this.tempParticle);

	console.log("particles: " + this.particles.length);
}

//var logs = [];var ii=0;
nucleotron.Game.prototype.step_ = function(dt) { //Update loop
  
    //if (this.mode == 1)

	var i;
	for(i = 0; i < this.particles.length; i++){
		if(this.particles[i] != null)
		{
		    this.particles[i].checkCollision(this.world.getSize());
			this.particles[i].updatePosition(dt);
			//loop through particles
			var j;
			for(j = 0; j < this.particles.length; j++){
				if(i != j){
				    this.simulatePhysics(this.particles[i],this.particles[j]);
				
					if(this.particles[i].checkParticleCollision(this.particles[j])){
							this.particles[j].setPosition(1000,1000); //move offscreen
							this.particles[j].MASS = 0;
							this.particles.splice(j, 1);
							return;
					}
				}
				else{
					
					this.particles[i].accly = 0;
					this.particles[i].acclx = 0;
				}
			}
			
		}
	}
	
	//Button Listners	
	goog.events.listenOnce(this.btnPro, ['touchstart', 'mousedown'], this.spawnProtron, false, this);
	goog.events.listenOnce(this.btnEle, ['touchstart', 'mousedown'], this.spawnElectron, false, this);
	goog.events.listenOnce(this.btnAlp, ['touchstart', 'mousedown'], this.spawnAlpha, false, this);
	
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
	
	var posShape1 = particle1.shape.getPosition();
	
	var posShape2 = particle2.shape.getPosition();
	
	var dist = Math.sqrt(Math.pow(posShape2.x - posShape1.x ,2) + Math.pow(posShape2.y - posShape1.y ,2) );
	
	var forceX = this.GRAVITY * ((particle1.MASS * particle2.MASS) / Math.pow(dist, 2));
	var forceY = this.GRAVITY * ((particle1.MASS * particle2.MASS) / Math.pow(dist, 2));
	
	//if the charges are the same, repel instead of attract
	if(particle1.posCharge == particle2.posCharge){
		forceX *= -1;
		forceY *= -1;
	}
	
	particle1.acclx = forceX / particle1.MASS;
	particle1.accly = forceY / particle1.MASS;
	
};

nucleotron.Game.prototype.resetForce = function(particle){
	particle.accly = 0;
	particle.acclx = 0;
};