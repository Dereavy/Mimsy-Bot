var Readable = require('stream').Readable;

function getMockCommentsStream(comments) {
	var stream = new Readable({ objectMode: true });
	var index = 0;

	stream._read = function () {
		var comment;

		if (index < comments.length) {
			comment = comments[index];

			// if comment has a type that contains "error" then treat it as an error
			if (comment.type && /error/i.test(comment.type)) {
				stream.emit('error', comment);
			}
			else {
				stream.push(comment);
			}

			index++;
		}
		else {
			stream.push(null);
		}
	};

	return stream;
}

module.exports = getMockCommentsStream;
