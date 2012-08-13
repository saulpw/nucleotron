//isotope.js
goog.provide('nucleotron.Isotope');
goog.require('nucleotron.DecayMethod');

nucleotron.Isotope = function(){
	this.mechanisms = new Array(); 
	this.decayProbab;
	this.halfLife;
	this.massExcess;
}
