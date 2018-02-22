var TransformStream = require('stream').Transform;

function limitCommentsStream(limit) {
	var stream = new TransformStream({
		readableObjectMode: true,
		writableObjectMode: true
	});

	var count = 0;

	stream._transform = function (comment, encoding, done) {
		if (count < limit) {
			this.push(comment);
			count++;
		}
		else {
			this.push(null);
		}

		done();
	};

	return stream;
}

module.exports = limitCommentsStream;
