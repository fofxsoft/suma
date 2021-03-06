(function () {
	"use strict";
	
	// Some useless comment
	
	var deltaDecorations = function (oldDecorations, newDecorations) {
		/// <summary>
		///   Update oldDecorations to match newDecorations.
		///   It will remove old decorations which are not found in new decorations
		///   and add only the really new decorations.
		/// </summary>
		/// <param name="oldDecorations" type="Array">
		///   An array containing ids of existing decorations
		/// </param>
		/// <param name="newDecorations" type="Array">
		///   An array containing literal objects describing new decorations. A
		///   literal contains the following two fields:
		///      range
		///      options
		/// </param>
		/// <returns type="Array">
		///   Returns an array of decorations ids
		/// </returns>
		var hashFunc = function (range, options) {
			return range.startLineNumber + "," + range.startColumn + "-" + range.endLineNumber + "," + range.endColumn +
				"-" + options.hoverMessage + "-" + options.className + "-" + options.isOverlay + "-" + options.showInOverviewRuler;
		};
		return this.changeDecorations(function (changeAccessor) {
			var i, len, oldDecorationsMap = {}, hash;
				
			// Record old decorations in a map
			for (i = 0, len = oldDecorations.length; i < len; i++) {
				hash = hashFunc(this.getDecorationRange(oldDecorations[i]), this.getDecorationOptions(oldDecorations[i]));
				oldDecorationsMap[hash] = i;
			}
			
			// Add only new decorations & mark reused ones
			var result = [], usedOldDecorationsMap = {};
			for (i = 0, len = newDecorations.length; i < len; i++) {
				hash = hashFunc(newDecorations[i].range, newDecorations[i].options);
				if (oldDecorationsMap.hasOwnProperty(hash)) {
					usedOldDecorationsMap[oldDecorationsMap[hash]] = true;
					result.push(oldDecorations[oldDecorationsMap[hash]]);
				} else {
					result.push(changeAccessor.addDecoration(newDecorations[i].range, newDecorations[i].options));
				}
			}
			
			// Remove unused old decorations
			for (i = 0, len = oldDecorations.length; i < len; i++) {
				if (!usedOldDecorationsMap.hasOwnProperty(i)) {
					changeAccessor.removeDecoration(oldDecorations[i]);
				}
			}
			
			return result;
		}.bind(this));
	};

})();
