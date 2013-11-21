simple xml parser
=================

More of an extractor than a parser. This library should only be used on small xml data, that is expected to be mostly well formed. It should be very fast for this niche.
Please note that element data is extracted from the first element the parser encounters and in the order it was declared.

### Usage

```
var xml = '<x>x</x><m>m</m><l>l</l>';

var SimpleXmlParser = require('simple-xml-parser');

var parser = SimpleXmlParser.create(['x', 'm', 'l']);

var result = parser.parseData(xml);

if (result.error) {
	console.log(result.error, result.element);
} else {
	console.log(result.parsedData.x);
	console.log(result.parsedData.m);
	console.log(result.parsedData.l);

	// prints:
	// x
	// m
	// l
}

```
