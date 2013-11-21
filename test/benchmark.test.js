var StringStream = require('string-stream');
var SimpleXmlParser = require('../lib/SimpleXmlParser');

var fs = require('fs');
var parseString = require('xml2js').parseString;
var async = require('async');
var assert = require('assert');
var expat = require('node-expat');
var path = require('path');

var elements = ['to', 'heading', 'heading2', 'heading3', 'heading4', 'heading5', 'body10', 'body9', 'body8'];

var TEST_SIZE = 100000;

var content = fs.readFileSync(path.join(__dirname, 'data.xml'), "utf8");

function runXml2Js(callback) {
	var count = 0;
	var runTime = 0;

	var runner = function () {

		var start = Date.now();

		var write = false;

		var data = '';

		parseString(content, function(err, result) {
			runTime += Date.now() - start;

			if (++count === TEST_SIZE)
				callback(null, runTime / TEST_SIZE);
		});
	};

	for (var i = 0; i < TEST_SIZE; i++)
		runner();
}

function runSimpleXmlParser(callback) {
	var count = 0;
	var self = this;
	var runTime = 0;

	var runner = function () {

		var start = Date.now();

		var parser = SimpleXmlParser.create(elements, false);

		var parsedResults = parser.parseData(content);

		runTime += Date.now() - start;

		if (++count === TEST_SIZE) {
			console.log(parsedResults);
			callback(null, runTime / TEST_SIZE);
		}
	};

	for (var i = 0; i < TEST_SIZE; i++)
		runner();
}

function runNodeXPat(callback) {
	var count = 0;
	var self = this;
	var runTime = 0;

	var runner = function () {

		var start = Date.now();

		var results = {};

		var current;

		var parser = new expat.Parser("UTF-8");

		parser.on('startElement', function (name, attrs) {

			if (elements.indexOf(name) > -1) {
				current = name;
			}
		});

		parser.on('endElement', function (name) {

			current = undefined;
			if (name === 'note')
				done();
		});

		parser.on('text', function (text) {

			if (current) {
				results[current] = text;
			}
		});

		parser.on('error', function (err) {
			console.error(err);
		});

		function done() {
			runTime += Date.now() - start;

			if (++count === TEST_SIZE) {
				callback(null, runTime / TEST_SIZE);
			}
		};

		parser.write(content);
	};

	for (var i = 0; i < TEST_SIZE; i++)
		runner();
}

describe('bench', function () {
	it('bench', function () {
		async.series({
			'xml2js': runXml2Js,
			'simple-xml-parser': runSimpleXmlParser,
			'xpat': runNodeXPat
		}, benchDone);

		function benchDone(err, results) {
			if (err) console.error( err);

			console.log(results);

			assert.ok('simple-xml-parser' in results);

			var target = results['simple-xml-parser'];

			delete results['simple-xml-parser'];

			// check that the other libs perform slower
			for (var lib in results) {
				assert.ok(target <= results[lib]);
			}
		}
	});

});
