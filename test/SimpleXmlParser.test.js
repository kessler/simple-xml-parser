var vows = require('vows');
var assert = require('assert');
var events = require('events');
var suite = vows.describe('SimpleXmlParser');
var fs = require('fs');

var SimpleXmlParser = require('../lib/SimpleXmlParser');

var testData = fs.readFileSync('./test.xml', 'utf8');

var testErrorData = fs.readFileSync('./testError.xml', 'utf8');

suite.addBatch({
	'parses xml data and report using events': {
		topic: function () {
			var elementsData = SimpleXmlParser.createTargetElementsFromNames(['to']);
			var parser = new SimpleXmlParser(elementsData);
			var self = this;
			
			parser.on('done', function(results) {
				self.callback(parser, results);
			});

			parser.on('error', function(element) {
				self.callback(null, element);
			});

			parser.parseData(testData);		
		},
		'callback': function(parser, results) {

			if (parser === null)
				assert.fail('error in parser');

			assert.includes(results, 'to');
			assert.strictEqual(results.to, 'tove');
		}
	},
	'an error event should be raised if we cannot find an end element': {
		topic: function () {
			var elementsData = SimpleXmlParser.createTargetElementsFromNames(['to']);
			var parser = new SimpleXmlParser(elementsData);
			var self = this;

			parser.on('done', function(results) {
				
			});

			parser.on('error', function(element, msg, data) {
				self.callback(element, msg, data);
			});

			parser.parseData(testErrorData);		
		},
		'callback': function(element, msg, data) {			
			assert.strictEqual(element.name, 'to');
		}		
	},
	'parses http requests (buffer data and so on)': {
		topic: function () {
			var elementsData = SimpleXmlParser.createTargetElementsFromNames(['to']);
			var parser = new SimpleXmlParser(elementsData);
			var self = this;

			var fakeRequest = new events.EventEmitter();
			fakeRequest.setEncoding = function() {};

			parser.on('done', function(results) {
				self.callback(parser, results);
			});

			parser.on('parseError', function(element) {
				self.callback(null, element);
			});

			parser.parseHttpRequest(fakeRequest);

			var part1 = testData.substr(0, 15);
			var part2 = testData.substr(15);

			fakeRequest.emit('data', part1);			
			fakeRequest.emit('data', part2);			
			fakeRequest.emit('end');				
		
		},
		'callback': function(parser, results) {

			if (parser === null)
				assert.fail('error in parser');

			assert.includes(results, 'to');
			assert.strictEqual(results.to, 'tove');

		}

	}
});

suite.options.error = false;

suite.export(module);