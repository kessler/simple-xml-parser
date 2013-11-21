var assert = require('assert');
var events = require('events');
var path = require('path');
var fs = require('fs');

var SimpleXmlParser = require('../lib/SimpleXmlParser');

var testData = fs.readFileSync(path.join(__dirname, './data.xml'), 'utf8');

var testErrorData = fs.readFileSync(path.join(__dirname, './error.xml'), 'utf8');

describe('SimpleXmlParser', function () {
	it('parses xml data', function() {

		var elementsData = SimpleXmlParser.createTargetElementsFromNames(['to']);
		var parser = new SimpleXmlParser(elementsData);

		var result = parser.parseData(testData);


		if (result.error)
			throw new Error(result);

		assert.ok('to' in result.parsedData);
		assert.strictEqual(result.parsedData.to, 'tove');
	});

	it('returns an error object if cannot find an end element', function () {

		var elementsData = SimpleXmlParser.createTargetElementsFromNames(['to']);
		var parser = new SimpleXmlParser(elementsData);

		var result = parser.parseData(testErrorData);

		assert.ok('error' in result);
		assert.strictEqual(result.element.name, 'to');
	});
});