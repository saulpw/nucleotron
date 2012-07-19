//DecayTable.js
goog.require('nucleotron.Isotope');
goog.require('nucleotron.DecayMechanism'); //TODO make Decay mechanism

//	public var elementSymbols:Object = new Object();
//	public var elementNames:Object = new Object();

this.elementNames = new Array();
this.elementSymbols = new Array();

this.xmlDoc = null;

this.numElementsParsed = 0;


nucleotron.DecayTable = function(){

	
}


nucleotron.DecayTable.prototype.Load = function(urlString){
	if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
	  		xmlhttp = new XMLHttpRequest();
	  	}
	  	else{
	  		console.log("incompatible browser"); //if they have IE6 hahaha
	  	}

		//xml parser goes here
		xmlhttp.open("GET",urlString,false);
		xmlhttp.send();
		xmlDoc=xmlhttp.responseXML;
}

nucleotron.DecayTable.prototype.constructNuclids = function(){

	main = xmlDoc.firstChild;
	i = 0;
	for(i in main.childNodes){
		tempNode = main.childNodes[i];
		if (tempNode.nodeName = "element"){
			Z = Number(tempNode.attributes.z);
			this.elementNames[Z] = tempNode.attributes.name;
			this.elementSymbols[Z] = tempNode.attributes.symbol;
		}
	}

	currentNode = xmlDoc.firstChild;
	while(currentNode){
		this.populateTable(currentNode);
		currentNode = currentNode.nextSibling;
	}

}

nucleotron.DecayTable.prototype.populateTable = function(node){
	
	if(node.nodeName != "isotope"){
		return; 
	}

	this.numElementsParsed++;
	Z = Number(node.attributes.Z);
	N = Number(node.attributes.N);
	tempIsotope = new Isotope();

	if(node.attributes.halflife){
		hl = Number(node.attributes.halflife);
		if (hl < 0){
			return;
		}
		tempIsotope.halflife = hl;
		tempIsotope.decayprob = Math.min(1.0, Math.exp(-0.424 * hl) / 45);

	}
	else{
		tempIsotope.decayprob = 0.0;
		tempIsotope.halflife = 16;
	}
	tempIsotope.massexcess = Number(node.attributes.massexcess);

	j = 0;
	for(j in node.childNodes){
		dNode = node.childNodes[j];
		if (dNode.nodeName != "method"){
			continue;
		}
		tempIsotope.mechanisms.push(new DecayMethod(dNode.attributes.Z, dNode.attributes.N, dNode.attributes.beta, dNode.attributes.prob));

	}
	if(! this[Z]){
		this[Z][N] = tempIsotope;
	}


}

nucleotron.DecayTable.prototype.getIsotope = function(z, n){
	return this[z][n];
}


