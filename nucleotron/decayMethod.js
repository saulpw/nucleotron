//DecayMethod.js
goog.provide('nucleotron.DecayMethod');

	this.Z;
	this.N;
	this.beta;
	this.probability;

	nucleotron.DecayMethod = function(z, n, b, p) 
	{ 
		this.Z = z;
		this.N = n;
		this.beta = b;
	
		if (p)
			this.probability = p;
		else
			this.probability = 1.0;
		//trace(Z + "," + N + "," + beta + "," + probability);
	}
