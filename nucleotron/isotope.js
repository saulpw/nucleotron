//isotope.js
goog.provide('nucleotron.Isotope');

nucleotron.Isotope = function(){
	this.mechanisms = new Array(); //array
	this.decayProbab = 0.0;
	this.halfLife = 0; //can never be 3
	this.massExcess;
}