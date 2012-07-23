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
	this.LoadXML('decay-shipped.xml');
	this.constructNuclids();
}


nucleotron.DecayTable.prototype.Load = function(urlString){
		_xml.ignoreWhite = true;
        if(_xml.onLoad){
        	this.constructNuclids();
        }
        else
        {
        	console.log("unable to load files");
        }
        _xml.load(urlString);

}

nucleotron.DecayTable.prototype.LoadXML = function(urlString){
	//xmlDoc.getElementsByTagName("to")[0].childNodes[0].nodeValue;
	this.doc = this.loadXMLDoc(urlString);
	this.docElement = this.doc.documentElement;
	this.firstNode=get_firstchild(this.docElement);

}

nucleotron.DecayTable.prototype.constructNuclids = function(){

/*
for (i=0;i<firstNode.childNodes.length;i++)
*/

	for(i = 0; i < this.firstNode.childNodes.length; i++ ){
		tempNode = this.firstNode.childNodes[i];
		if (tempNode.nodeName = "element"){
			Z = Number(tempNode.attributes.z);
			this.elementNames[Z] = tempNode.attributes.name;
			this.elementSymbols[Z] = tempNode.attributes.symbol;
		}
	}

	currentNode = get_firstchild(this.docElement);
	while(currentNode){
		this.populateTable(currentNode);
		currentNode = get_nextSibling(currentNode);
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

