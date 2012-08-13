//DecayTable.js
goog.require('nucleotron.Isotope');
//goog.require('nucleotron.DecayMechanism'); //TODO make Decay mechanism
goog.provide('nucleotron.DecayTable');
goog.require('nucleotron.DecayMethod');
//	public var elementSymbols:Object = new Object();
//	public var elementNames:Object = new Object();



nucleotron.DecayTable = function(){
	
	this.elementNames = new Object();
	this.elementSymbols = new Object();

	this.xmlDoc = null;

	this.numElementsParsed = 0;

	this.decayArray = new Array();

	this.doc;
	this.docELement;
	this.firstNode;
	this.Load("decay-shipped.xml");
	this.constructNuclids();
}


nucleotron.DecayTable.prototype.Load = function(fileLocation){
	this.file = fileLocation;
	if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
		  xmlhttp=new XMLHttpRequest();
	}
	else{// code for IE6, IE5
		  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("GET",this.file,false);
	xmlhttp.send();

	this.xmlDoc = xmlhttp.responseXML;
}


nucleotron.DecayTable.prototype.constructNuclids = function(){

	this.docElement = this.xmlDoc.documentElement;
	currentNode = this.docElement.firstChild;
	while(currentNode != null){
		this.populateTable(currentNode);
		currentNode = currentNode.nextSibling;
	}

}

nucleotron.DecayTable.prototype.populateTable = function(node){
	if(node.nodeName != "isotope"){
		return; 
	}
	this.numElementsParsed++;
	var _Z = node.getAttribute("Z");
	var _N = node.getAttribute("N");
	tempIsotope = new nucleotron.Isotope();

	if(node.getAttribute("halflife")){
		hl = node.getAttribute("halflife");
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
	tempIsotope.massexcess = node.getAttribute("massexcess");

	j = 0;
	for(j in node.childNodes){
		dNode = node.childNodes[j];
		if (dNode.nodeName != "method"){
			continue;
		}
		tempIsotope.mechanisms.push(new nucleotron.DecayMethod(dNode.getAttribute("Z"), dNode.getAttribute("N"), dNode.getAttribute("beta"), dNode.attributes.prob));

	}
	if(this.decayArray[_Z] == null){
		this.decayArray[_Z] = new Array(2);
	}

	this.decayArray[_Z][_N] = tempIsotope;


}

nucleotron.DecayTable.prototype.setIsotope = function(z, n){
	var retIsotope = new nucleotron.Isotope();

	//perform XML lookup
	currentNode = this.docElement.firstchild;

	while(currentNode){
		if(currentNode.getAttribute("Z") == z)
		{
			var i = 0;
			for(i in currentNode.childNodes[i]){
				dNode = currentNode.childNodes[i];
				if (dNode.nodeName != "method"){
					continue;
				}
				retIsotope.mechanisms.push(new DecayMethod(dNode.getAttribute("Z"), dNode.getAttribute("N"), dNode.getAttribute("beta"), dNode.getAttribute("prob")));
			}
			 
			//retIsotope.prob = currentNode.getAttribute("prob");
			retIsotope.halfLife = currentNode.getAttribute("halflife");
			//retIsotope.massExcess = currentNode.getAttribute("massexcess");
		}
		else{
			currentNode = currentNode.nextsibling;
		}
	}

	return retIsotope;
}

nucleotron.DecayTable.prototype.getIsotope = function(z, n){
	return this.decayArray[z][n];
}

nucleotron.DecayTable.prototype.getFirstChild = function(node){
	var n = node.first
}

nucleotron.DecayTable.prototype.loadXMLDoc = function(dname)
{
	if (window.XMLHttpRequest)
	  {
	  xhttp=new XMLHttpRequest();
	  }
	else
	  {
	  xhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	xhttp.open("GET",dname,false);
	xhttp.send();
	return xhttp.responseXML;
}

