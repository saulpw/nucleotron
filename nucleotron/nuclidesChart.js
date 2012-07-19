//nuclidesChart.js
goog.provide('nucleotron.NuclidsChart');
goog.require('nucleotron.DecayTable');
//also, rounded rectangle

public var loadingElement = 0;
public var _decayTable = DecayTable();
//todo: include stats for making rounded rects and squares for display


nucleotron.NuclidsChart = function(){



}

///AS code goes here
nucleotron.NuclidsChart.prototype.loadTable = function(urlString){
	
	_decayTable.load(urlString);

}

nucleotron.NuclidsChart.prototype.chartNuclideRange = function(low, high){
	this.loadingElement = low;


	//TODO: input function for charting range

	/* code added for reference

   public function chartNuclideRange(low:Number, high:Number)
    {
		this.loadingElement = low;
		var _this:NuclidesChart = this;
		_fullChart.onEnterFrame = function()
		{
			var Z:Number = _this.loadingElement;
			for (var _N in _this._decayTable[_this.loadingElement])
			{
				var N:Number = int(_N);
                var mc:MovieClip = this.attachMovie("nuclide_info", "nuclide" + "_" + Z + "_" + N, this.getNextHighestDepth());

                mc._x = N * _this.ni_width;
                mc._y = Z * _this.ni_height;

				_this.fillNuclideInfo(mc, Z, N, 0);
			}
			_this.loadingElement = Z + 1;
			if (Z + 1 > high)
				this.onEnterFrame = null;
		}
	}

	*/

}
nucleotron.NuclidsChart.prototype.fillNuclideInfo = function(element, Z, N, charge){
	//todo: implment fillNuclidInfo
}

