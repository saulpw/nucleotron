//elementTable.js
//loads the elements and gives the game a way to access them
goog.provide("nucleotron.ElementTable");
goog.require("nucleotron.Element");
goog.require("nucleotron.Particle");

nucleotron.ElementTable = function(fileLocation) {
	this.file = fileLocation;
	if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
		  xmlhttp=new XMLHttpRequest();
	}
	else{// code for IE6, IE5
		  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("GET",this.file,false);
	xmlhttp.send();

	this.xmlDoc=xmlhttp.responseXML;
	//console.log(this.xmlDoc);
}

nucleotron.ElementTable.prototype.setElement = function(particle, element){

	//this.xmlDoc = $.parseXML( this.file );
   // $xml = $( xmlDoc ),
    //$title = $xml.find( "title" );




	if(this.xmlDoc != null){
		var elementDoc = this.xmlDoc.getElementsByTagName("element");
		
		var _Z = particle.Z;
		var _N = particle.N;

		for(var i = 0; i < 95; i++){
			temp = elementDoc[i].getAttribute("z");
			if(temp == _Z){
				element.symbol.setText(elementDoc[i].getAttribute("symbol"));
				console.log("tried to create element");
				element.elementName.setText(elementDoc[i].getAttribute("name"));
			}	
		}
	}
	else{
		console.log("null xml");
		console.log(this.file);
	}


	//this.xmlDoc.getElementsByTagName("to")[0].childNodes[0].nodeValue;
	//return 
}