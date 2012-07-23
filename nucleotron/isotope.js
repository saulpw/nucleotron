//isotope.js
//temp values inputted until I can fix the XML parser
goog.provide('nucleotron.Isotope');
goog.require('nucleotron.DecayMethod');

nucleotron.Isotope = function(){
	this.mechanisms = new Array(); //array
	this.mechanisms[0] = new nucleotron.DecayMethod(2, 1, -1, 100);
	this.decayProbab = 100;
	this.halfLife = 8.589;
	this.massExcess = 2;
}
/*
<isotope Z="1" N="2" halflife = "8.589">
  <method beta="-1" prob = "100"/>
  */