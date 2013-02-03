var vows = require('vows');
var SimpleXmlParser = require('../lib/SimpleXmlParser');
var suite = vows.describe('benchmarks');
var fs = require('fs');
var parseString = require('xml2js').parseString;
var async = require('async');
var assert = require('assert');

var TEST_SIZE = 5000;

var content = fs.readFileSync("test.xml", "utf8");

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

		var parser = SimpleXmlParser.create(['to'], false);

		parser.on('done', function () {		
			runTime += Date.now() - start;					

			if (++count === TEST_SIZE)
				callback(null, runTime / TEST_SIZE);
		});

		parser.parseData(content);
	};

	for (var i = 0; i < TEST_SIZE; i++)
		runner();	
}

suite.addBatch({
	'xml2js': {
		topic: function() {
			async.series({
				'xml2js': runXml2Js,
				'simple-xml-parser': runSimpleXmlParser
			}, this.callback);
			
		},
		'bench': function (results) {
			console.log(results);

			assert.includes(results, 'simple-xml-parser');

			var target = results['simple-xml-parser'];
			
			delete results['simple-xml-parser'];

			// check that the other libs perform slower
			for (var lib in results) {
				assert.isTrue(target <= results[lib]);
			}
		}	
	}	
});


suite.export(module);