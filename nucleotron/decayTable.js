//DecayTable.js
goog.require('nucleotron.Isotope');
//goog.require('nucleotron.DecayMechanism'); //TODO make Decay mechanism
goog.provide('nucleotron.DecayTable');
goog.require('nucleotron.DecayMethod');
//	public var elementSymbols:Object = new Object();
//	public var elementNames:Object = new Object();

this.elementNames = new Array();
this.elementSymbols = new Array();

this.xmlDoc = null;

this.numElementsParsed = 0;


nucleotron.DecayTable = function(){
	this.doc;
	this.docELement;
	this.firstNode;
	this.Load('decay-shipped.xml');
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
	console.log(this.xmlDoc);


}


nucleotron.DecayTable.prototype.constructNuclids = function(){

/*
for (i=0;i<firstNode.childNodes.length;i++)
*/
/*
	for(i = 0; i < this.firstNode.childNodes.length; i++ ){
		tempNode = this.firstNode.childNodes[i];
		if (tempNode.nodeName = "element"){
			Z = Number(tempNode.attributes.z);
			this.elementNames[Z] = tempNode.attributes.name;
			this.elementSymbols[Z] = tempNode.attributes.symbol;
		}
	}
*/
	this.docElement = this.xmlDoc.documentElement;
	currentNode = this.docElement.firstchild;
	while(currentNode){
		this.populateTable(currentNode);
		currentNode = currentNode.nextsibling;
	}

}

nucleotron.DecayTable.prototype.populateTable = function(node){
	
	if(node.nodeName != "isotope"){
		return; 
	}
	//elementDoc[i].getAttribute("symbol")
	this.numElementsParsed++;
	var _Z = node.getAttribute("Z");
	var _N = node.getAttribute("N");
	tempIsotope = new Isotope();

	if(node.attributes.halflife){
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
		tempIsotope.mechanisms.push(new DecayMethod(dNode.getAttribute("Z"), dNode.getAttribute("N"), dNode.getAttribute("beta"), dNode.attributes.prob));

	}
	if(! this[_Z]){
		this[_Z][_N] = tempIsotope;
	}


}

nucleotron.DecayTable.prototype.getIsotope = function(z, n){
	return this[z][n];
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

