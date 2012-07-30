//element.js
//element displayed for each complex particle
goog.provide("nucleotron.Element");

goog.require('lime.RoundedRect');

nucleotron.Element = function(particle) {
    lime.RoundedRect.call(this);

    var back = new lime.fill.LinearGradient().addColorStop(0, 255, 150, 0, .4).addColorStop(0.9, 250, 150, 0, .05).addColorStop(1, 0, 0, 0, 0);
    this.setSize(50, 50).setFill(back).setAnchorPoint(0, 0);

    this.weight = new lime.Label().setText('4').setPosition(25, 10).setFontSize(10);   
    this.appendChild(this.weight);

    this.symbol = new lime.Label().setText('Tm').setPosition(25, 20).setFontSize(10);
    this.appendChild(this.symbol);

    this.n_count = new lime.Label().setText(particle.Z).setPosition(10, 30).setFontSize(10);
    this.appendChild(this.n_count);

    this.z_count = new lime.Label().setText(particle.N).setPosition(10, 45).setFontSize(10);
    this.appendChild(this.z_count);

};
goog.inherits(nucleotron.Element, lime.RoundedRect);
