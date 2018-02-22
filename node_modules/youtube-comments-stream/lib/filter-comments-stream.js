var Transform = require('stream').Transform;

function filterCommentsStream(filter) {
	var stream = new Transform({
		readableObjectMode: true,
		writableObjectMode: true
	});

	stream._transform = function (comment, encoding, done) {
		if (filter(comment)) {
			stream.push(comment);
		}

		done();
	};

	return stream;
}

module.exports = filterCommentsStream;
