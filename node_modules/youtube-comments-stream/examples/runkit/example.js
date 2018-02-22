const commentsStream = require('youtube-comments-stream');

const VIDEO_ID = 'HVv-oBN6AWA';
const stream = commentsStream(VIDEO_ID);

stream.on('data', function (comment) {
	console.log(comment.text);
});

stream.on('error', function (err) {
	console.error('ERROR READING COMMENTS:', err);
});

stream.on('end', function () {
	console.log('NO MORE COMMENTS');
	process.exit();
});
