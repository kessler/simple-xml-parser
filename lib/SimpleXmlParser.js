function SimpleXmlParser(targetElements, startFromLastMatch) {

	if (targetElements.length === 0)
		throw new Error('must specify target elements (array was empty)');

	this._startFromLastMatch = startFromLastMatch;
	this._targetElements = targetElements;
}

SimpleXmlParser.prototype.parseData = function(data) {
	var result = {};
	var lastMatch = 0;

	for (var i = 0; i < this._targetElements.length; i++) {
		var element = this._targetElements[i];

		var start = data.indexOf(element.start, lastMatch);

		// not found, proceed to next tag
		if (start === -1) {
			continue;
		}

		var end = data.indexOf(element.end, start + 1);

		if (end === -1) {
			return { error: 'missing closing tag', element: element };
		}

		start = start + element.start.length;

		result[element.name] = data.substr(start, end - start);

		if (this._startFromLastMatch)
			lastMatch = end + element.end.length;
	}

	return { parsedData: result };
};

SimpleXmlParser.createTargetElementsFromNames = function(targetElements) {
	var result = []
	for (var i = 0; i < targetElements.length; i++) {
		result.push({
			name: targetElements[i],
			start: '<' + targetElements[i] + '>',
			end: '</' + targetElements[i] + '>'
		});
	}

	return result;
};

SimpleXmlParser.create = function(elementNames, startFromLastMatch) {
	return new SimpleXmlParser(SimpleXmlParser.createTargetElementsFromNames(elementNames), startFromLastMatch);
};

module.exports = SimpleXmlParser;