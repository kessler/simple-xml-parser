simple xml parser
=================

More of an extractor than a parser. This library should only be used on small xml data, that is expected to be mostly well formed. It should be very fast for this niche. 


### Usage

```
	var xml = '<x>x</x><m>m</m><l>l</l>';

	var SimpleXmlParser = require('simple-xml-parser');

	var parser = SimpleXmlParser.create(['x', 'm', 'l']);

	parser.on('done', function(result, raw) {
		//raw === xml

		console.log(result.x);
		console.log(result.m);
		console.log(result.l);

		// prints: 
		// x
		// m
		// l
	});

	parser.on('error', function(element, msg, data) {
		// data === xml
	});

	parser.parseData(xml);

```

or directly from http request

```
	parser.parseHttpRequest(request);
```